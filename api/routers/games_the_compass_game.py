from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict
import json
from ._system_prompt import load_system_prompt
from ._llm import safe_chat_completion
from .game_session_manager import GameManager
from database.session import get_async_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from utils.game_chat import create_game_chat_group, add_player_to_game_chat

router = APIRouter()
GAME_SLUG = "elinity-the-compass-game"

class StartReq(BaseModel):
    user_id: str
    ai_enabled: Optional[bool] = True

class JoinReq(BaseModel):
    session_id: str
    user_id: str

class ActionReq(BaseModel):
    session_id: str
    user_id: str
    action: str # "choose_path"
    content: str 

@router.post('/start')
async def start(req: StartReq, db: AsyncSession = Depends(get_async_db)):
    # Ensure user exists
    from utils.guest_manager import ensure_guest_user
    await ensure_guest_user(db, req.user_id)
    
    gm = GameManager(db)
    system_prompt = load_system_prompt(GAME_SLUG)
    
    initial_ai = {}
    if req.ai_enabled:
        resp = await safe_chat_completion(system_prompt, "Start Level 1: The Gateway. Present the first fork in the road. [FORMAT: JSON]", max_tokens=300)
        try: initial_ai = json.loads(resp)
        except: initial_ai = {"narrative": "You stand at a crossroads...", "location_name": "The Gateway", "choices": ["Path of Duty", "Path of Freedom"]}

    initial_state = {
        "location": initial_ai.get("location_name"),
        "north_south": 50, # Logic vs Emotion
        "east_west": 50,  # Self vs Others
        "turn": 1,
        "compass_journal": [],
        "ai_enabled": req.ai_enabled,
        "last_ai_response": initial_ai
    }
    
    session = await gm.create_session(game_slug=GAME_SLUG, host_id=req.user_id, initial_state=initial_state)
    await gm.join_session(session.session_id, req.user_id, {"role": "Voyager"})
    group_id = await create_game_chat_group(db, session.session_id, req.user_id)
    return {'ok': True, 'session_id': session.session_id, 'group_id': group_id, 'state': session.state}

@router.post('/action')
async def action(req: ActionReq, db: AsyncSession = Depends(get_async_db)):
    gm = GameManager(db)
    session = await gm.get_session(req.session_id)
    if not session: raise HTTPException(status_code=404, detail="Session not found")
    
    s = session.state
    journal = list(s.get("compass_journal", []))
    
    ai_response = {}
    system_prompt = load_system_prompt(GAME_SLUG)
    
    # Observer logic
    observer_note = ""
    if session.analysis and req.user_id in session.analysis:
        p_analysis = session.analysis[req.user_id]
        if p_analysis.get("truth_mismatch_detected"):
            observer_note = f"\n[SHADOW OBSERVER: {p_analysis.get('fun_commentary')}]"

    context = f"""
    Current Location: {s.get('location')}
    Value Polarities: NS={s.get('north_south')}, EW={s.get('east_west')}
    Voyager Choice: {req.content}{observer_note}
    
    Narrate the arrival at the next landmark. Respond in JSON.
    Include [UPDATE: ns+X, ew+X] tags in the 'narrative' field.
    """
    
    resp_str = await safe_chat_completion(system_prompt, context, max_tokens=500)
    try:
        ai_response = json.loads(resp_str)
    except:
        ai_response = {"narrative": "The path unfolds before you.", "location_name": "Uncharted Territory", "choices": ["Continue"]}
             
    # Parse Updates
    import re
    new_ns = s.get('north_south', 50)
    new_ew = s.get('east_west', 50)
    
    narrative_text = ai_response.get("narrative", "")
    meta_match = re.search(r'\[UPDATE:\s*(.*?)\]', narrative_text)
    if meta_match:
        narrative_text = narrative_text.replace(meta_match.group(0), "").strip()
        updates = meta_match.group(1).split(",")
        for up in updates:
            up = up.strip()
            if up.startswith("ns"):
                new_ns = min(100, max(0, new_ns + int(up[2:])))
            elif up.startswith("ew"):
                new_ew = min(100, max(0, new_ew + int(up[2:])))

    if ai_response.get("compass_insight"):
        journal.append({"insight": ai_response["compass_insight"], "loc": ai_response.get("location_name")})
        
    new_state = {
        **s,
        "location": ai_response.get("location_name"),
        "north_south": new_ns,
        "east_west": new_ew,
        "compass_journal": journal,
        "last_ai_response": {**ai_response, "narrative": narrative_text},
        "turn": s.get("turn", 0) + 1
    }
    
    updated = await gm.update_state(req.session_id, new_state, history_entry={"user": req.user_id, "content": req.content})
    return {'ok': True, 'state': updated.state}

@router.post('/join')
async def join(req: JoinReq, db: AsyncSession = Depends(get_async_db)):
    gm = GameManager(db)
    session = await gm.join_session(req.session_id, req.user_id, {"role": "Player"})
    from models.chat import Group
    group_name = f"game_{req.session_id}"
    result = await db.execute(select(Group).where(Group.name == group_name))
    group = result.scalars().first()
    if group: await add_player_to_game_chat(db, group.id, req.user_id)
    return {'ok': True, 'players': session.players, 'group_id': group.id if group else None}
