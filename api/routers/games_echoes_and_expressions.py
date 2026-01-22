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
GAME_SLUG = "elinity-echoes-and-expressions"

class StartReq(BaseModel):
    user_id: str
    ai_enabled: Optional[bool] = True

class JoinReq(BaseModel):
    session_id: str
    user_id: str

class ActionReq(BaseModel):
    session_id: str
    user_id: str
    action: str # "submit_work", "echo_work"
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
        resp = await safe_chat_completion(system_prompt, "Transmit the opening creative frequency. [FORMAT: JSON]", max_tokens=300)
        try: initial_ai = json.loads(resp)
        except: initial_ai = {"creative_prompt": "Let the silence morph into a question.", "visual_theme": "Ethereal"}

    initial_state = {
        "creative_prompt": initial_ai.get("creative_prompt"),
        "resonance": 10, # 0-100 (Collective vibration)
        "clarity": 50,   # 0-100 (Vibrational purity)
        "gallery": [],
        "turn": 1,
        "ai_enabled": req.ai_enabled,
        "last_ai_response": initial_ai
    }
    
    session = await gm.create_session(game_slug=GAME_SLUG, host_id=req.user_id, initial_state=initial_state)
    await gm.join_session(session.session_id, req.user_id, {"role": "Vocalist"})
    group_id = await create_game_chat_group(db, session.session_id, req.user_id)
    return {'ok': True, 'session_id': session.session_id, 'group_id': group_id, 'state': session.state}

@router.post('/action')
async def action(req: ActionReq, db: AsyncSession = Depends(get_async_db)):
    gm = GameManager(db)
    session = await gm.get_session(req.session_id)
    if not session: raise HTTPException(status_code=404, detail="Session not found")
    
    s = session.state
    gallery = list(s.get("gallery", []))
    
    if req.action == "express":
        gallery.append({"user": req.user_id, "expression": req.content, "timestamp": "now"})
        
    ai_response = {}
    system_prompt = load_system_prompt(GAME_SLUG)
    
    # Observer logic
    observer_note = ""
    if session.analysis and req.user_id in session.analysis:
        p_analysis = session.analysis[req.user_id]
        if p_analysis.get("truth_mismatch_detected"):
            observer_note = f"\n[SHADOW OBSERVER: {p_analysis.get('fun_commentary')}]"

    context = f"""
    Frequency: {s.get('creative_prompt')}
    Current Resonance: {s.get('resonance')}, Clarity: {s.get('clarity')}
    Vocalist Expression: {req.content}{observer_note}
    
    Synthesize the 'Echo'. Respond in JSON.
    Include [UPDATE: resonance+X, clarity+X] tags in the 'echo_synthesis' field.
    """
    
    resp_str = await safe_chat_completion(system_prompt, context, max_tokens=500)
    try:
        ai_response = json.loads(resp_str)
    except:
        ai_response = {"echo_synthesis": "The chamber vibrates with your truth.", "next_challenge": "Deepen the sound."}
             
    # Parse Updates
    import re
    new_res = s.get('resonance', 10)
    new_cla = s.get('clarity', 50)
    
    echo_text = ai_response.get("echo_synthesis", "")
    meta_match = re.search(r'\[UPDATE:\s*(.*?)\]', echo_text)
    if meta_match:
        echo_text = echo_text.replace(meta_match.group(0), "").strip()
        updates = meta_match.group(1).split(",")
        for up in updates:
            up = up.strip()
            if up.startswith("resonance"):
                new_res = min(100, max(0, new_res + int(up[9:])))
            elif up.startswith("clarity"):
                new_cla = min(100, max(0, new_cla + int(up[7:])))

    new_state = {
        **s,
        "resonance": new_res,
        "clarity": new_cla,
        "creative_prompt": ai_response.get("next_challenge", s.get("creative_prompt")),
        "gallery": gallery[-10:],
        "last_ai_response": {**ai_response, "echo_synthesis": echo_text},
        "turn": s.get("turn", 0) + 1
    }
    
    updated = await gm.update_state(req.session_id, new_state, history_entry={"user": req.user_id, "action": req.action, "content": req.content})
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
