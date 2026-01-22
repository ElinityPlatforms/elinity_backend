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
GAME_SLUG = "elinity-myth-maker-arena"

class StartReq(BaseModel):
    user_id: str
    archetype: Optional[str] = "Warrior"
    ai_enabled: Optional[bool] = True

class JoinReq(BaseModel):
    session_id: str
    user_id: str
    archetype: Optional[str] = "Seer"

class ActionReq(BaseModel):
    session_id: str
    user_id: str
    action: str # "contribute"
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
        resp = await safe_chat_completion(system_prompt, f"Start Opening Epoch. Hero Archetype: {req.archetype}. [FORMAT: JSON]", max_tokens=300)
        try: initial_ai = json.loads(resp)
        except: initial_ai = {"narrative": f"The age of {req.archetype} begins...", "next_stage": "Genesis"}

    initial_state = {
        "stage": initial_ai.get("next_stage", "Genesis"),
        "belief": 10, # 0-100 (Collective faith)
        "divinity": 0, # 0-100 (Hero's power)
        "turn": 1,
        "myth_log": [initial_ai],
        "ai_enabled": req.ai_enabled,
        "last_ai_response": initial_ai
    }
    
    session = await gm.create_session(game_slug=GAME_SLUG, host_id=req.user_id, initial_state=initial_state)
    await gm.join_session(session.session_id, req.user_id, {"role": "Demi-God", "archetype": req.archetype})
    group_id = await create_game_chat_group(db, session.session_id, req.user_id)
    return {'ok': True, 'session_id': session.session_id, 'group_id': group_id, 'state': session.state}

@router.post('/action')
async def action(req: ActionReq, db: AsyncSession = Depends(get_async_db)):
    gm = GameManager(db)
    session = await gm.get_session(req.session_id)
    if not session: raise HTTPException(status_code=404, detail="Session not found")
    
    s = session.state
    myth_log = list(s.get("myth_log", []))
    current_stage = s.get("stage")
    
    ai_response = {}
    system_prompt = load_system_prompt(GAME_SLUG)
    
    # Observer logic
    observer_note = ""
    if session.analysis and req.user_id in session.analysis:
        p_analysis = session.analysis[req.user_id]
        if p_analysis.get("truth_mismatch_detected"):
            observer_note = f"\n[SHADOW OBSERVER: {p_analysis.get('fun_commentary')}]"

    context = f"""
    Epoch: {current_stage}
    Belief: {s.get('belief')}, Divinity: {s.get('divinity')}
    Hero's Deed: {req.content}{observer_note}
    
    Narrate the outcome and evolve the mythos. Respond in JSON.
    Include [UPDATE: belief+X, divinity+X] tags in the 'narrative' field.
    """
    
    resp_str = await safe_chat_completion(system_prompt, context, max_tokens=500)
    try:
        ai_response = json.loads(resp_str)
    except:
        ai_response = {"narrative": "A new verse is written in the heavens.", "next_stage": "Ascension"}
             
    # Parse Updates
    import re
    new_belief = s.get('belief', 10)
    new_divinity = s.get('divinity', 0)
    
    narrative_text = ai_response.get("narrative", "")
    meta_match = re.search(r'\[UPDATE:\s*(.*?)\]', narrative_text)
    if meta_match:
        narrative_text = narrative_text.replace(meta_match.group(0), "").strip()
        updates = meta_match.group(1).split(",")
        for up in updates:
            up = up.strip()
            if up.startswith("belief"):
                new_belief = min(100, max(0, new_belief + int(up[6:])))
            elif up.startswith("divinity"):
                new_divinity = min(100, max(0, new_divinity + int(up[8:])))

    if ai_response:
        ai_response["narrative"] = narrative_text
        myth_log.append(ai_response)
        
    new_state = {
        **s,
        "stage": ai_response.get("next_stage", current_stage),
        "belief": new_belief,
        "divinity": new_divinity,
        "myth_log": myth_log[-10:], # Keep only recent log
        "last_ai_response": ai_response,
        "turn": s.get("turn", 0) + 1
    }
    
    updated = await gm.update_state(req.session_id, new_state, history_entry={"user": req.user_id, "action": "action", "content": req.content})
    return {'ok': True, 'state': updated.state}

@router.post('/join')
async def join(req: JoinReq, db: AsyncSession = Depends(get_async_db)):
    gm = GameManager(db)
    session = await gm.join_session(req.session_id, req.user_id, {"role": "Player", "archetype": req.archetype})
    from models.chat import Group
    group_name = f"game_{req.session_id}"
    result = await db.execute(select(Group).where(Group.name == group_name))
    group = result.scalars().first()
    if group: await add_player_to_game_chat(db, group.id, req.user_id)
    return {'ok': True, 'players': session.players, 'group_id': group.id if group else None}
