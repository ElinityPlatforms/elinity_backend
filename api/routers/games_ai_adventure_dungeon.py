from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict
import os
from ._system_prompt import load_system_prompt
from ._llm import safe_chat_completion
from .game_session_manager import GameManager
from database.session import get_async_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

class StartReq(BaseModel):
    user_id: Optional[str] = "anon"
    theme: Optional[str] = "FANTASY_RUINS"

class JoinReq(BaseModel):
    session_id: str
    user_id: str
    role: Optional[str] = "Adventurer"

class ActionReq(BaseModel):
    session_id: str
    user_id: str
    action: str

@router.post('/start')
async def start(req: StartReq, db: AsyncSession = Depends(get_async_db)):
    """Initialize a new persistent game session."""
    gm = GameManager(db)
    slug = 'ai-adventure-dungeon'
    system = load_system_prompt(slug)
    
    # 1. AI initialization
    prompt = f'Generate an opening dungeon scene for theme {req.theme} in 2-3 sentences. Establish the atmosphere.'
    fallback = 'You enter a dimly-lit cavern; the air smells of damp stone.'
    opening_text = await safe_chat_completion(system or '', prompt, temperature=0.8, max_tokens=200, fallback=fallback)
    
    # 2. Create DB Session with rich state
    initial_state = {
        "scene": opening_text, 
        "narrative": opening_text,
        "theme": req.theme,
        "floor": 1,
        "hp": 100,
        "inventory": ["Rusted Sword", "Torch", "2x Bread"],
        "gold": 10,
        "turn": 1,
        "status": "active" 
    }
    
    session = await gm.create_session(game_slug=slug, host_id=req.user_id, initial_state=initial_state)
    await gm.join_session(session.session_id, req.user_id, {"role": "Host", "joined_at": "now"})
    
    return {'ok': True, 'session_id': session.session_id, 'state': session.state, 'players': session.players}

@router.post('/join')
async def join(req: JoinReq, db: AsyncSession = Depends(get_async_db)):
    """Join an existing session."""
    gm = GameManager(db)
    session = await gm.join_session(req.session_id, req.user_id, {"role": req.role})
    return {'ok': True, 'players': session.players}

@router.post('/action')
async def action(req: ActionReq, db: AsyncSession = Depends(get_async_db)):
    """Submit a move."""
    gm = GameManager(db)
    session = await gm.get_session(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    s = session.state
    
    # 1. AI Processing with Context
    slug = 'ai-adventure-dungeon'
    system = load_system_prompt(slug)
    
    # Construct history context (last 5 interactions)
    history_context = ""
    if session.history:
        recent = session.history[-5:]
        history_context = "\n".join([f"P: {h.get('content')}\nDM: {h.get('result')}" for h in recent])

    prompt = f"""
    {history_context}
    Current Stats: HP={s.get('hp')}, Gold={s.get('gold')}, Inventory={s.get('inventory')}
    Player action: {req.action}
    
    Narrate the outcome. If they found an item, lost HP, or gained gold, include a metadata tag like [UPDATE: hp-10, gold+5, item+Shield].
    """
    
    fallback = f"You move forward. {req.action} happens."
    raw_response = await safe_chat_completion(system or '', prompt, temperature=0.8, max_tokens=400, fallback=fallback)
    
    # 2. Parse Metadata
    import re
    new_hp = s.get('hp', 100)
    new_gold = s.get('gold', 0)
    new_inv = list(s.get('inventory', []))
    
    # Extract [UPDATE: ...]
    meta_match = re.search(r'\[UPDATE:\s*(.*?)\]', raw_response)
    display_text = raw_response
    if meta_match:
        display_text = raw_response.replace(meta_match.group(0), "").strip()
        updates = meta_match.group(1).split(",")
        for up in updates:
            up = up.strip()
            if up.startswith("hp"):
                val = int(up[2:])
                new_hp = max(0, new_hp + val)
            elif up.startswith("gold"):
                val = int(up[4:])
                new_gold = max(0, new_gold + val)
            elif up.startswith("item+"):
                new_inv.append(up[5:])
            elif up.startswith("item-"):
                it = up[5:]
                if it in new_inv: new_inv.remove(it)

    # 3. Update State
    new_state = {
        **s,
        "scene": display_text,
        "narrative": display_text,
        "hp": new_hp,
        "gold": new_gold,
        "inventory": new_inv,
        "last_action": req.action,
        "last_actor": req.user_id,
        "turn": s.get("turn", 0) + 1
    }
    
    # 4. Persist
    updated_session = await gm.update_state(
        req.session_id, 
        new_state, 
        history_entry={"user": req.user_id, "action": "action", "content": req.action, "result": display_text}
    )
    
    return {'ok': True, 'state': updated_session.state, 'history': updated_session.history}

@router.get('/status/{session_id}')
async def status(session_id: str, db: AsyncSession = Depends(get_async_db)):
    """Poll for latest state."""
    gm = GameManager(db)
    session = await gm.get_session(session_id)
    return {'ok': True, 'state': session.state, 'players': session.players, 'history': session.history}
