from fastapi import FastAPI, APIRouter, HTTPException
import json
from pathlib import Path
from typing import List, Dict, Any

from core.universal_prompt import UNIVERSAL_RELATIONSHIP_PROMPT
from services.ai_service import AIService as RealAIService
from database.session import async_session
from models.conversation import ConversationSession, ConversationTurn
from sqlalchemy import select, desc
from fastapi import Depends
from utils.token import get_current_user
from services.activity_log import log_user_activity
from services.user_context import get_user_context_string
from models.user import Tenant

ai_service = RealAIService()

router = APIRouter()


def _data_file_path() -> Path:
    # api/routers/* -> project root is parents[2]
    return Path(__file__).resolve().parents[2] / "data" / "relationship_skills.json"


def load_skills() -> List[Dict[str, Any]]:
    path = _data_file_path()
    if not path.exists():
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _find_skill(skills: List[Dict[str, Any]], skill_id: int) -> Dict[str, Any]:
    for s in skills:
        if int(s.get("id")) == int(skill_id):
            return s
    return {}


class AIService:
    """Lightweight mock AI service used for now.

    The real app will call an AI backend. For this task we provide a
    small, deterministic mock that extracts the Title line from the
    prompt (if present) and returns a coaching starter message.
    """

    @staticmethod
    async def chat(prompt: str) -> str:
        title = None
        for line in prompt.splitlines():
            if line.strip().lower().startswith("title:"):
                parts = line.split(":", 1)
                if len(parts) > 1:
                    title = parts[1].strip()
                break
        if not title:
            title = "this skill"
        return f"Let's start your training on {title}."


@router.get("/", summary="List relationship skills")
async def list_skills():
    skills = load_skills()
    # return only the common fields used by the frontend
    return [
        {"id": s.get("id"), "name": s.get("name"), "description": s.get("description"), "notes": s.get("notes")} for s in skills
    ]


@router.get("/{skill_id}", summary="Get a relationship skill by id")
async def get_skill(skill_id: int):
    skills = load_skills()
    skill = _find_skill(skills, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill


@router.post("/{skill_id}/start", summary="Start a skill session (AI)")
async def start_skill(skill_id: int, session_number: int = 1, current_user: Tenant = Depends(get_current_user)):
    skills = load_skills()
    skill = _find_skill(skills, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    # Find specific session info
    session_info = next((s for s in skill.get("sessions", []) if s.get("session_number") == session_number), None)
    if not session_info:
        session_title = skill.get("name")
        session_goal = "Explore this skill."
    else:
        session_title = session_info.get("title")
        session_goal = session_info.get("goal")

    # Get User Context for Deep Profiling
    async with async_session() as session:
         user_context = await get_user_context_string(session, current_user.id)
    
    prompt_content = UNIVERSAL_RELATIONSHIP_PROMPT.replace("{{TITLE}}", f"{skill.get('name')} - {session_title}")
    prompt_content = prompt_content.replace("{{DETAILED_DESCRIPTION}}", f"Session Goal: {session_goal}\n\nSkill Description: {skill.get('description', '')}")
    prompt_content = prompt_content.replace("{{ADDITIONAL_NOTES}}", skill.get("notes", ""))
    
    full_system_prompt = f"{user_context}\n\n{prompt_content}"

    async with async_session() as session:
        await log_user_activity(session, current_user.id, "skill_start", str(skill_id), {"session_number": session_number, "skill_name": skill.get("name")})
        
        user_uuid = None
        try: user_uuid = uuid.UUID(current_user.id)
        except: pass

        conv = ConversationSession(user_id=user_uuid, skill_id=skill_id, skill_type="relationship")
        session.add(conv)
        await session.commit()
        await session.refresh(conv)

        # Use the real AIService
        ai_message = await ai_service.chat([{"role": "system", "content": full_system_prompt}])

        turn = ConversationTurn(session_id=conv.id, role="assistant", content=ai_message)
        session.add(turn)
        await session.commit()
    
    return {"skill": skill.get("name"), "session_title": session_title, "ai_message": ai_message, "session_id": str(conv.id)}


@router.post("/{skill_id}/reply", summary="Send a user reply to the AI")
async def reply_skill(skill_id: int, payload: Dict[str, Any], current_user: Tenant = Depends(get_current_user)):
    skills = load_skills()
    skill = _find_skill(skills, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    session_id = payload.get("session_id")
    user_input = payload.get("user_input")
    if not session_id or not user_input:
        raise HTTPException(status_code=400, detail="session_id and user_input are required")

    async with async_session() as session:
        # Verify session belongs to user
        user_uuid = None
        try: user_uuid = uuid.UUID(current_user.id)
        except: pass
        
        conv_session = await session.execute(select(ConversationSession).where(ConversationSession.id == session_id, ConversationSession.user_id == user_uuid))
        if not conv_session.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Conversation session not found or does not belong to user")

        q = select(ConversationTurn).where(ConversationTurn.session_id == session_id).order_by(desc(ConversationTurn.timestamp)).limit(10)
        res = await session.execute(q)
        turns = [r[0] for r in res.fetchall()]
        history = [{"role": t.role, "content": t.content} for t in reversed(turns)]

        # Build messages
        system_content = UNIVERSAL_RELATIONSHIP_PROMPT.replace("{{TITLE}}", skill.get("name", "")).replace("{{DETAILED_DESCRIPTION}}", skill.get("description", "")).replace("{{ADDITIONAL_NOTES}}", skill.get("notes", ""))
        user_context = await get_user_context_string(session, current_user.id)
        
        messages = [{"role": "system", "content": f"{user_context}\n\n{system_content}"}]
        messages.extend(history)
        messages.append({"role": "user", "content": user_input})

        ai_response = await ai_service.chat(messages)

        user_turn = ConversationTurn(session_id=session_id, role="user", content=user_input)
        assistant_turn = ConversationTurn(session_id=session_id, role="assistant", content=ai_response)
        session.add_all([user_turn, assistant_turn])
        await session.commit()

    return {"reply": ai_response}

@router.get("/{session_id}/history", summary="Get conversation history")
async def get_history(session_id: str, current_user: Tenant = Depends(get_current_user)):
    async with async_session() as session:
        user_uuid = None
        try: user_uuid = uuid.UUID(current_user.id)
        except: pass

        # Verify session belongs to user
        conv_session = await session.execute(select(ConversationSession).where(ConversationSession.id == session_id, ConversationSession.user_id == user_uuid))
        if not conv_session.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Conversation session not found or does not belong to user")

        q = select(ConversationTurn).where(ConversationTurn.session_id == session_id).order_by(ConversationTurn.timestamp.asc())
        res = await session.execute(q)
        turns = [{"role": t.role, "content": t.content, "timestamp": t.timestamp.isoformat() if t.timestamp else None} for (t,) in res.fetchall()]
    return {"history": turns}
