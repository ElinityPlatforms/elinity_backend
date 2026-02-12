from fastapi import APIRouter, HTTPException, Depends
from pathlib import Path
from typing import List, Dict, Any, Optional
import json

from core.universal_prompt_selfgrowth import UNIVERSAL_SELFGROWTH_PROMPT
from services.ai_service import AIService
from database.session import async_session
from models.conversation import ConversationSession, ConversationTurn
from sqlalchemy import select, desc
from utils.token import get_current_user
from services.activity_log import log_user_activity
from services.user_context import get_user_context_string
from models.user import Tenant

router = APIRouter()
ai_service = AIService()


def _data_file_path() -> Path:
    return Path(__file__).resolve().parents[2] / "data" / "self_growth_skills.json"


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


@router.get("/", summary="List self-growth skills")
async def list_skills():
    skills = load_skills()
    return [{"id": s.get("id"), "name": s.get("name"), "description": s.get("description"), "notes": s.get("notes")} for s in skills]


@router.get("/{skill_id}", summary="Get a self-growth skill by id")
async def get_skill(skill_id: int):
    skills = load_skills()
    skill = _find_skill(skills, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill


@router.post("/{skill_id}/start", summary="Start a self-growth skill session")
async def start_skill(skill_id: int, session_number: int = 1, current_user: Tenant = Depends(get_current_user)):
    skills = load_skills()
    skill = _find_skill(skills, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    session_info = next((s for s in skill.get("sessions", []) if s.get("session_number") == session_number), None)
    session_title = session_info.get("title") if session_info else skill.get("name")
    session_goal = session_info.get("goal") if session_info else "Explore this skill."

    async with async_session() as session:
         user_context = await get_user_context_string(session, current_user.id)

    prompt_content = UNIVERSAL_SELFGROWTH_PROMPT.replace("{{TITLE}}", f"{skill.get('name')} - {session_title}")
    prompt_content = prompt_content.replace("{{DETAILED_DESCRIPTION}}", f"Session Goal: {session_goal}\n\nSkill Description: {skill.get('description', '')}")
    prompt_content = prompt_content.replace("{{ADDITIONAL_NOTES}}", skill.get("notes", ""))
    
    full_system_prompt = f"{user_context}\n\n{prompt_content}"

    async with async_session() as session:
        await log_user_activity(session, current_user.id, "skill_start", str(skill_id), {"session_number": session_number, "skill_name": skill.get("name"), "type": "self_growth"})
        
        user_uuid = None
        try: user_uuid = uuid.UUID(current_user.id)
        except: pass

        conv = ConversationSession(user_id=user_uuid, skill_id=skill_id, skill_type="self-growth")
        session.add(conv)
        await session.commit()
        await session.refresh(conv)

        ai_message = await ai_service.chat([{"role": "system", "content": full_system_prompt}])
        turn = ConversationTurn(session_id=conv.id, role="assistant", content=ai_message)
        session.add(turn)
        await session.commit()

    return {"skill": skill.get("name"), "session_title": session_title, "ai_message": ai_message, "session_id": str(conv.id)}


@router.post("/{skill_id}/reply", summary="Reply to a self-growth skill session")
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
        user_uuid = None
        try: user_uuid = uuid.UUID(current_user.id)
        except: pass

        # Ownership check
        conv_session = await session.execute(select(ConversationSession).where(ConversationSession.id == session_id, ConversationSession.user_id == user_uuid))
        if not conv_session.scalar_one_or_none():
            raise HTTPException(404, "Session not found")

        q = select(ConversationTurn).where(ConversationTurn.session_id == session_id).order_by(desc(ConversationTurn.timestamp)).limit(10)
        res = await session.execute(q)
        turns = [r[0] for r in res.fetchall()]
        history = [{"role": t.role, "content": t.content} for t in reversed(turns)]

        system_content = UNIVERSAL_SELFGROWTH_PROMPT.replace("{{TITLE}}", skill.get("name", "")).replace("{{DETAILED_DESCRIPTION}}", skill.get("description", "")).replace("{{ADDITIONAL_NOTES}}", skill.get("notes", ""))
        user_context = await get_user_context_string(session, current_user.id)
        
        messages = [{"role": "system", "content": f"{user_context}\n\n{system_content}"}]
        messages.extend(history)
        messages.append({"role": "user", "content": user_input})

        ai_response = await ai_service.chat(messages)

        db_turns = [
            ConversationTurn(session_id=session_id, role="user", content=user_input),
            ConversationTurn(session_id=session_id, role="assistant", content=ai_response)
        ]
        session.add_all(db_turns)
        await session.commit()

    return {"reply": ai_response}


@router.get("/{session_id}/history", summary="Get conversation history")
async def get_history(session_id: str, current_user: Tenant = Depends(get_current_user)):
    async with async_session() as session:
        user_uuid = None
        try: user_uuid = uuid.UUID(current_user.id)
        except: pass
        
        # Ownership check
        conv_session = await session.execute(select(ConversationSession).where(ConversationSession.id == session_id, ConversationSession.user_id == user_uuid))
        if not conv_session.scalar_one_or_none():
            raise HTTPException(404, "Session not found")

        q = select(ConversationTurn).where(ConversationTurn.session_id == session_id).order_by(ConversationTurn.timestamp.asc())
        res = await session.execute(q)
        turns = [{"role": t.role, "content": t.content, "timestamp": t.timestamp.isoformat() if t.timestamp else None} for (t,) in res.fetchall()]
    return {"history": turns}

