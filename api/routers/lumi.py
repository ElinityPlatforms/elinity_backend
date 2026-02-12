from api.routers._profile_helper import get_user_profile_summary, get_user_full_profile_data
from elinity_ai.modes.prompts import SYSTEM_PROMPT_LUMI
from database.session import get_async_db, Session
from utils.token import get_current_user
from models.user import Tenant
from fastapi import Depends, APIRouter, HTTPException
from services.ai_service import AIService
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from models.conversation import ConversationSession, ConversationTurn
import json
import uuid

from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(tags=["Lumi Core"])

class LumiChatRequest(BaseModel):
    query: str
    session_id: Optional[str] = None

@router.post("/chat/")
async def lumi_endpoint(request: LumiChatRequest, db: AsyncSession = Depends(get_async_db), current_user: Tenant = Depends(get_current_user)):
    """Lumi: Your core AI companion for deep connection and personal flourishing."""
    ai = AIService()
    query = request.query
    session_id = request.session_id
    
    # 1. Get/Create Session
    conv_session = None
    if session_id:
        try:
            session_uuid = uuid.UUID(session_id)
            result = await db.execute(select(ConversationSession).where(ConversationSession.id == session_uuid))
            conv_session = result.scalars().first()
        except ValueError:
            pass

    if not conv_session:
        # Check for user's most recent Lumi session
        try:
            user_uuid = uuid.UUID(current_user.id)
            result = await db.execute(
                select(ConversationSession)
                .where(ConversationSession.user_id == user_uuid, ConversationSession.skill_type == "lumi")
                .order_by(desc(ConversationSession.created_at))
                .limit(1)
            )
            conv_session = result.scalars().first()
        except ValueError:
            # If current_user.id is not a valid UUID (unlikely but possible during dev)
            pass
        
        if not conv_session:
            # Create new session
            user_uuid = None
            try:
                user_uuid = uuid.UUID(current_user.id)
            except:
                pass
                
            conv_session = ConversationSession(
                user_id=user_uuid,
                skill_id=0,
                skill_type="lumi"
            )
            db.add(conv_session)
            await db.commit()
            await db.refresh(conv_session)

    session_id = str(conv_session.id)

    # 2. Get high-level user context and full data dump for 'radical awareness'
    user_summary = await get_user_profile_summary(db, current_user.id)
    full_profile_json = await get_user_full_profile_data(db, current_user.id)
    
    # Lumi System Prompt with user context
    ENHANCED_LUMI_PROMPT = f"{SYSTEM_PROMPT_LUMI}\n\n" \
                           "YOU HAVE RADICAL ACCESS TO THE USER'S JOURNEY. Below is the full profile data currently stored for this user.\n" \
                           "YOU ALSO HAVE EXTENDED VISION: You've been briefed on two other prominent members - Sarah Miller and Marcus Chen.\n" \
                           "SARAH MILLER: Digital Artist in Paris. Anxious attachment, high openness, values authenticity and depth.\n" \
                           "MARCUS CHEN: Travel Photographer in Sao Paulo. Secure attachment, high agreeableness, values presence and quality.\n" \
                           "YOUR ADDITIONAL DUTY: Soul-Sync Onboarding. If you notice critical info is missing (check the MISSING INFO section in summary), " \
                           "guide the user to share those details.\n" \
                           "If the user asks about their own profile, or about Sarah/Marcus, you can now provide specific details based on the data below.\n" \
                           "IMPORTANT: Use a clean, professional style. Use standard line breaks and bullet points for readability. Avoid heavy technical formatting, but ensure responses are neatly structured with paragraph spacing."
    
    full_system_content = f"{ENHANCED_LUMI_PROMPT}\n\n" \
                          f"USER SUMMARY: {user_summary}\n\n" \
                          f"FULL PROFILE DATA (JSON): {json.dumps(full_profile_json, indent=2)}\n\n" \
                          f"EXTENDED CONTEXT - Sarah Miller: ARTIST, Paris, Age 28, seeks depth.\n" \
                          f"EXTENDED CONTEXT - Marcus Chen: PHOTOGRAPHER, Sao Paulo, Age 32, seeks quality."

    
    # 3. Load previous turns for memory
    result = await db.execute(
        select(ConversationTurn)
        .where(ConversationTurn.session_id == conv_session.id)
        .order_by(desc(ConversationTurn.timestamp))
        .limit(10)
    )
    turns = result.scalars().all()
    history_messages = []
    # Reverse to get chronological order
    for t in reversed(turns):
        history_messages.append({"role": t.role, "content": t.content})

    # 4. Prepare messages for AI
    messages = [{"role": "system", "content": full_system_content}]
    messages.extend(history_messages)
    messages.append({"role": "user", "content": query})

    # 5. Get AI response
    resp = await ai.chat(messages)

    # 6. Save turns to database
    user_turn = ConversationTurn(session_id=conv_session.id, role="user", content=query)
    ai_turn = ConversationTurn(session_id=conv_session.id, role="assistant", content=resp)
    db.add_all([user_turn, ai_turn])
    await db.commit()

    return {"LumiAI": resp, "session_id": session_id}

@router.get("/history/")
async def get_lumi_history(db: AsyncSession = Depends(get_async_db), current_user: Tenant = Depends(get_current_user)):
    """Retrieve the conversation history for Lumi."""
    try:
        user_uuid = uuid.UUID(current_user.id)
    except ValueError:
        return []

    # Get the most recent Lumi session
    result = await db.execute(
        select(ConversationSession)
        .where(ConversationSession.user_id == user_uuid, ConversationSession.skill_type == "lumi")
        .order_by(desc(ConversationSession.created_at))
        .limit(1)
    )
    session = result.scalars().first()
    
    if not session:
        return []

    # Get all turns for this session
    result = await db.execute(
        select(ConversationTurn)
        .where(ConversationTurn.session_id == session.id)
        .order_by(ConversationTurn.timestamp.asc())
    )
    turns = result.scalars().all()
    
    return [
        {
            "id": str(t.id),
            "role": t.role,
            "content": t.content,
            "timestamp": t.timestamp
        }
        for t in turns
    ]

