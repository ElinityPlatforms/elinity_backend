from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, List
import json
from ._system_prompt import load_system_prompt
from ._llm import safe_chat_completion
from .game_session_manager import GameManager
from database.session import get_async_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from utils.game_chat import create_game_chat_group, add_player_to_game_chat

router = APIRouter()
GAME_SLUG = "elinity-memory-mosaic"

class StartReq(BaseModel):
    user_id: str
    theme: Optional[str] = "Childhood Adventures"
    ai_enabled: Optional[bool] = True

class JoinReq(BaseModel):
    session_id: str
    user_id: str

class ActionReq(BaseModel):
    session_id: str
    user_id: str
    action: str # "share_memory", "generate_mosaic"
    content: str 

@router.post('/start')
async def start(req: StartReq, db: AsyncSession = Depends(get_async_db)):
    # Ensure user exists
    from utils.guest_manager import ensure_guest_user
    await ensure_guest_user(db, req.user_id)
    
    gm = GameManager(db)
    
    initial_state = {
        "theme": req.theme,
        "memories": [],
        "clarity": 10,  # 0-100 (Blurry to Crystal Clear)
        "resonance": 50, # 0-100 (Harmony of memories)
        "mosaic_url": None,
        "turn": 1,
        "ai_enabled": req.ai_enabled
    }
    
    session = await gm.create_session(game_slug=GAME_SLUG, host_id=req.user_id, initial_state=initial_state)
    await gm.join_session(session.session_id, req.user_id, {"role": "Vessel"})
    group_id = await create_game_chat_group(db, session.session_id, req.user_id)
    return {'ok': True, 'session_id': session.session_id, 'group_id': group_id, 'state': session.state}

@router.post('/action')
async def action(req: ActionReq, db: AsyncSession = Depends(get_async_db)):
    gm = GameManager(db)
    session = await gm.get_session(req.session_id)
    if not session: raise HTTPException(status_code=404, detail="Session not found")
    
    s = session.state
    memories = list(s.get("memories", []))
    
    if req.action == "share_memory":
        memories.append({"user": req.user_id, "text": req.content, "timestamp": "now"})
        
    # AI Interpretation
    ai_response = {}
    system_prompt = load_system_prompt(GAME_SLUG)
    
    observer_note = ""
    if session.analysis and req.user_id in session.analysis:
        p_analysis = session.analysis[req.user_id]
        if p_analysis.get("truth_mismatch_detected"):
            observer_note = f"\n[SHADOW OBSERVER: {p_analysis.get('fun_commentary')}]"

    context = f"""
    Theme: {s.get('theme')}
    Current Clarity: {s.get('clarity')}
    Resonance: {s.get('resonance')}
    New Memory: {req.content}
    All Memories: {json.dumps(memories[-5:])}{observer_note}
    
    Respond in JSON. Include [UPDATE: clarity+X, resonance+X] in 'narrative' field.
    """
    
    resp_str = await safe_chat_completion(system_prompt, context, max_tokens=500)
    try:
        ai_response = json.loads(resp_str)
    except:
        ai_response = {"narrative": "A shard of time joined the mosaic.", "collage_prompt": None}
             
    # Parse Updates
    import re
    new_clarity = s.get('clarity', 10)
    new_resonance = s.get('resonance', 50)
    
    narrative_text = ai_response.get("narrative", "")
    meta_match = re.search(r'\[UPDATE:\s*(.*?)\]', narrative_text)
    if meta_match:
        narrative_text = narrative_text.replace(meta_match.group(0), "").strip()
        updates = meta_match.group(1).split(",")
        for up in updates:
            up = up.strip()
            if up.startswith("clarity"):
                new_clarity = min(100, max(0, new_clarity + int(up[7:])))
            elif up.startswith("resonance"):
                new_resonance = min(100, max(0, new_resonance + int(up[9:])))

    new_state = {
        **s,
        "memories": memories,
        "clarity": new_clarity,
        "resonance": new_resonance,
        "current_mosaic_prompt": ai_response.get("collage_prompt"),
        "last_ai_narrative": narrative_text,
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
