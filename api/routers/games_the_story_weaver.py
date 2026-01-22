from fastapi import APIRouter, HTTPException, Depends
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
GAME_SLUG = "elinity-the-story-weaver"

class StartReq(BaseModel):
    user_id: str
    genre: Optional[str] = "Fantasy"
    ai_enabled: Optional[bool] = True

class JoinReq(BaseModel):
    session_id: str
    user_id: str

class ActionReq(BaseModel):
    session_id: str
    user_id: str
    action: str # "contribute", "vote"
    content: str # The text contribution or vote choice

@router.post('/start')
async def start(req: StartReq, db: AsyncSession = Depends(get_async_db)):
    # Ensure user exists
    from utils.guest_manager import ensure_guest_user
    await ensure_guest_user(db, req.user_id)
    
    gm = GameManager(db)
    system_prompt = load_system_prompt(GAME_SLUG)
    
    # 1. AI initialization
    opening_json = {}
    if req.ai_enabled:
        prompt = f"Genre: {req.genre}. Generate the first page of the book. [FORMAT: JSON]"
        try:
            resp = await safe_chat_completion(system_prompt, prompt, max_tokens=400)
            opening_json = json.loads(resp)
        except:
             opening_json = {"narrative": f"The story begins in a {req.genre} world...", "visual_cue": "Mystery start", "phase": "contribution"}
    else:
        opening_json = {"narrative": f"The story begins in a {req.genre} world...", "phase": "contribution"}

    initial_state = {
        "story_text": [opening_json.get("narrative", "")],
        "genre": req.genre,
        "turn": 1,
        "chapter": 1,
        "karma": 50, # 0-100 (Dark to Light)
        "character_arc": "Neutral",
        "phase": opening_json.get("phase", "contribution"),
        "ai_enabled": req.ai_enabled,
        "last_ai_response": opening_json,
        "player_order": [req.user_id],
        "turn_index": 0
    }
    
    session = await gm.create_session(game_slug=GAME_SLUG, host_id=req.user_id, initial_state=initial_state)
    await gm.join_session(session.session_id, req.user_id, {"role": "Weaver", "joined_at": "now"})
    
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
    
    # 1. AI Processing with Context
    ai_response = {}
    system_prompt = load_system_prompt(GAME_SLUG)
    
    # Context Construction (Scroll history)
    history_str = "\n".join(s.get("story_text", [])[-5:])
    
    # Observer logic
    observer_note = ""
    if session.analysis and req.user_id in session.analysis:
        p_analysis = session.analysis[req.user_id]
        if p_analysis.get("truth_mismatch_detected"):
            observer_note = f"\n[SHADOW OBSERVER: {p_analysis.get('fun_commentary')}] - The Weaver's contribution contradicts their internal truth. Weave this contradiction into the narrative arc."

    prompt = f"""
    Current World Karma: {s.get('karma')}
    Current Arc: {s.get('character_arc')}
    Story History: {history_str}
    
    New Contribution: {req.content}{observer_note}
    
    Continue the tale. Return VALID JSON. 
    Include [UPDATE: karma+X, arc=Name] in the 'narrative' field if the story shifts.
    """
    
    resp_str = await safe_chat_completion(system_prompt, prompt, max_tokens=600)
    try:
        ai_response = json.loads(resp_str)
    except:
        ai_response = {"narrative": "The story continues...", "phase": "contribution"}
            
    # 2. Parse Metadata from Narrative
    import re
    new_karma = s.get('karma', 50)
    new_arc = s.get('character_arc', "Neutral")
    
    narrative_text = ai_response.get("narrative", "")
    meta_match = re.search(r'\[UPDATE:\s*(.*?)\]', narrative_text)
    if meta_match:
        narrative_text = narrative_text.replace(meta_match.group(0), "").strip()
        updates = meta_match.group(1).split(",")
        for up in updates:
            up = up.strip()
            if up.startswith("karma"):
                new_karma = min(100, max(0, new_karma + int(up[5:])))
            elif up.startswith("arc="):
                new_arc = up[4:]

    # 3. Update Story
    story_text = s.get("story_text", [])
    story_text.append(req.content)
    if narrative_text:
        story_text.append(narrative_text)
        
    # Calculate Next Turn
    next_turn_index = (turn_index + 1) % len(player_order)
            
    new_state = {
        **s,
        "story_text": story_text,
        "last_ai_response": {**ai_response, "narrative": narrative_text},
        "karma": new_karma,
        "character_arc": new_arc,
        "turn": s.get("turn", 0) + 1,
        "chapter": (s.get("turn", 0) // 5) + 1,
        "phase": ai_response.get("phase", "contribution"),
        "player_order": player_order,
        "turn_index": next_turn_index
    }
    
    updated = await gm.update_state(req.session_id, new_state, history_entry={"user": req.user_id, "action": req.action, "content": req.content})
    return {'ok': True, 'state': updated.state}

@router.post('/join')
async def join(req: JoinReq, db: AsyncSession = Depends(get_async_db)):
    gm = GameManager(db)
    session = await gm.join_session(req.session_id, req.user_id, {"role": "Player"})
    
    # Update player order in state
    current_state = dict(session.state or {})
    player_order = list(current_state.get("player_order", []))
    if req.user_id not in player_order:
        player_order.append(req.user_id)
        current_state["player_order"] = player_order
        await gm.update_state(req.session_id, {"player_order": player_order})
    
    # Check for existing group
    from models.chat import Group
    group_name = f"game_{req.session_id}"
    result = await db.execute(select(Group).where(Group.name == group_name))
    group = result.scalars().first()
    if group:
        await add_player_to_game_chat(db, group.id, req.user_id)
        
    return {'ok': True, 'players': session.players, 'group_id': group.id if group else None}
