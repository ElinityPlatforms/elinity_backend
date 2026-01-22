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
GAME_SLUG = "elinity-world-builders"

class StartReq(BaseModel):
    user_id: str
    ai_enabled: Optional[bool] = True

class JoinReq(BaseModel):
    session_id: str
    user_id: str

class ActionReq(BaseModel):
    session_id: str
    user_id: str
    action: str # "create", "advance_round"
    content: str 

@router.post('/start')
async def start(req: StartReq, db: AsyncSession = Depends(get_async_db)):
    # Ensure user exists
    from utils.guest_manager import ensure_guest_user
    await ensure_guest_user(db, req.user_id)
    
    gm = GameManager(db)
    system_prompt = load_system_prompt(GAME_SLUG)
    
    # Opening
    initial_ai = {}
    if req.ai_enabled:
        resp = await safe_chat_completion(system_prompt, "Round 1: Geography. Describe the birth of a new realm. [FORMAT: JSON]", max_tokens=300)
        try: initial_ai = json.loads(resp)
        except: initial_ai = {"narrative": "At first, there was only the void...", "next_prompt": "Describe the first landmass.", "visual_cue": "Cosmic Genesis"}

    initial_state = {
        "round": "Geography",
        "turn": 1,
        "mana": 100,
        "population": 0,
        "stability": 100,
        "world_codex": [], 
        "ai_enabled": req.ai_enabled,
        "last_ai_response": initial_ai,
        "player_order": [req.user_id],
        "turn_index": 0
    }
    
    session = await gm.create_session(game_slug=GAME_SLUG, host_id=req.user_id, initial_state=initial_state)
    await gm.join_session(session.session_id, req.user_id, {"role": "Architect"})
    group_id = await create_game_chat_group(db, session.session_id, req.user_id)
    return {'ok': True, 'session_id': session.session_id, 'group_id': group_id, 'state': session.state}

@router.post('/action')
async def action(req: ActionReq, db: AsyncSession = Depends(get_async_db)):
    gm = GameManager(db)
    session = await gm.get_session(req.session_id)
    if not session: raise HTTPException(status_code=404, detail="Session not found")
    
    s = session.state
    player_order = s.get("player_order", [])
    turn_index = s.get("turn_index", 0)
    
    if not player_order: player_order = sorted(list(session.players.keys()))
    if player_order and req.user_id != player_order[turn_index % len(player_order)]:
         raise HTTPException(status_code=400, detail="Not your turn!")
    
    codex = s.get("world_codex", [])
    current_round = s.get("round", "Geography")

    # Round Transition Logic
    if req.action == "advance_round":
        rounds = ["Geography", "Culture", "History", "Characters", "End"]
        try:
            next_idx = rounds.index(current_round) + 1
            current_round = rounds[next_idx] if next_idx < len(rounds) else "End"
        except: current_round = "Geography"
            
    # AI Logic
    ai_response = {}
    system_prompt = load_system_prompt(GAME_SLUG)
    
    # Observer context from P1 analysis
    observer_context = ""
    if session.analysis and req.user_id in session.analysis:
        p_analysis = session.analysis[req.user_id]
        if p_analysis.get("truth_mismatch_detected"):
            observer_context = f"\n[OBSERVER NOTE: {p_analysis.get('fun_commentary')}]"

    context = f"""
    Epoch: {current_round}
    Stats: Mana={s.get('mana')}, Pop={s.get('population')}, Stability={s.get('stability')}
    Codex: {json.dumps(codex[-3:])}
    Input: {req.content}{observer_context}
    
    Respond in JSON. Include [UPDATE: mana-10, pop+50, stability-5] in 'narrative' if world shifts.
    """
    
    resp_str = await safe_chat_completion(system_prompt, context, max_tokens=500)
    try:
        ai_response = json.loads(resp_str)
    except:
        ai_response = {"narrative": "The world shifts as you speak.", "codex_entry": {"title": "Creation", "description": req.content, "type": current_round}}
            
    # Parse Updates
    import re
    new_mana = s.get('mana', 100)
    new_pop = s.get('population', 0)
    new_stab = s.get('stability', 100)
    
    narrative_text = ai_response.get("narrative", "")
    meta_match = re.search(r'\[UPDATE:\s*(.*?)\]', narrative_text)
    if meta_match:
        narrative_text = narrative_text.replace(meta_match.group(0), "").strip()
        updates = meta_match.group(1).split(",")
        for up in updates:
            up = up.strip()
            if up.startswith("mana"):
                new_mana = max(0, new_mana + int(up[4:]))
            elif up.startswith("pop"):
                new_pop = max(0, new_pop + int(up[3:]))
            elif up.startswith("stability"):
                new_stab = min(100, max(0, new_stab + int(up[9:])))

    if ai_response.get("codex_entry"):
        entry = ai_response["codex_entry"]
        if "type" not in entry: entry["type"] = current_round
        codex.append(entry)
        
    next_turn_index = (turn_index + 1) % len(player_order)

    new_state = {
        **s,
        "round": current_round,
        "world_codex": codex,
        "mana": new_mana,
        "population": new_pop,
        "stability": new_stab,
        "last_ai_response": {**ai_response, "narrative": narrative_text},
        "turn": s.get("turn", 0) + 1,
        "player_order": player_order,
        "turn_index": next_turn_index
    }
    
    updated = await gm.update_state(req.session_id, new_state, history_entry={"user": req.user_id, "content": req.content})
    return {'ok': True, 'state': updated.state}

@router.post('/join')
async def join(req: JoinReq, db: AsyncSession = Depends(get_async_db)):
    gm = GameManager(db)
    session = await gm.join_session(req.session_id, req.user_id, {"role": "Player"})
    
    # Update player order
    current_state = dict(session.state or {})
    player_order = list(current_state.get("player_order", []))
    if req.user_id not in player_order:
        player_order.append(req.user_id)
        current_state["player_order"] = player_order
        await gm.update_state(req.session_id, {"player_order": player_order})
        
    from models.chat import Group
    group_name = f"game_{req.session_id}"
    result = await db.execute(select(Group).where(Group.name == group_name))
    group = result.scalars().first()
    if group: await add_player_to_game_chat(db, group.id, req.user_id)
    return {'ok': True, 'players': session.players, 'group_id': group.id if group else None}
