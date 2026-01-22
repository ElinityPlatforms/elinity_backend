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
GAME_SLUG = "elinity-the-long-quest"

class StartReq(BaseModel):
    user_id: str
    campaign_name: Optional[str] = "The Azure Peaks"
    ai_enabled: Optional[bool] = True

class JoinReq(BaseModel):
    session_id: str
    user_id: str
    character_name: Optional[str] = "Traveler"
    character_class: Optional[str] = "Adventurer"

class ActionReq(BaseModel):
    session_id: str
    user_id: str
    action: str # "decide", "combat"
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
        resp = await safe_chat_completion(system_prompt, f"Start Opening Scene. Campaign: {req.campaign_name}. [FORMAT: JSON]", max_tokens=600)
        try: initial_ai = json.loads(resp)
        except: initial_ai = {"narrative": f"The gates of {req.campaign_name} swing open.", "visual_cue": "City Gates", "options": ["Enter the city", "Check map"]}

    initial_state = {
        "campaign_name": req.campaign_name,
        "fortitude": 100, # Group HP/Stamina
        "wisdom": 10,    # Quest knowledge
        "camaraderie": 50, # Party bond
        "narrative_log": [initial_ai.get("narrative")],
        "turn": 1,
        "quest_log": ["The journey begins."],
        "ai_enabled": req.ai_enabled,
        "last_ai_response": initial_ai
    }
    
    session = await gm.create_session(game_slug=GAME_SLUG, host_id=req.user_id, initial_state=initial_state)
    await gm.join_session(session.session_id, req.user_id, {"role": "Quest-Leader"})
    group_id = await create_game_chat_group(db, session.session_id, req.user_id)
    return {'ok': True, 'session_id': session.session_id, 'group_id': group_id, 'state': session.state}

@router.post('/action')
async def action(req: ActionReq, db: AsyncSession = Depends(get_async_db)):
    gm = GameManager(db)
    session = await gm.get_session(req.session_id)
    if not session: raise HTTPException(status_code=404, detail="Session not found")
    
    s = session.state
    quest_log = list(s.get("quest_log", []))
    narrative_log = list(s.get("narrative_log", []))
    
    ai_response = {}
    system_prompt = load_system_prompt(GAME_SLUG)
    
    # Observer logic
    observer_note = ""
    if session.analysis and req.user_id in session.analysis:
        p_analysis = session.analysis[req.user_id]
        if p_analysis.get("truth_mismatch_detected"):
            observer_note = f"\n[SHADOW OBSERVER: {p_analysis.get('fun_commentary')}]"

    context = f"""
    Campaign: {s.get('campaign_name')}
    Stats: Fortitude={s.get('fortitude')}, Wisdom={s.get('wisdom')}, Camaraderie={s.get('camaraderie')}
    Quest Leader Action: {req.content}{observer_note}
    
    Narrate the outcome. Respond in JSON.
    Include [UPDATE: fortitude-X, wisdom+X, camaraderie+X] tags in the 'narrative' field.
    """
    
    resp_str = await safe_chat_completion(system_prompt, context, max_tokens=600)
    try:
        ai_response = json.loads(resp_str)
    except:
        ai_response = {"narrative": "The party marches on.", "options": ["Continue"]}
             
    # Parse Updates
    import re
    new_f = s.get('fortitude', 100)
    new_w = s.get('wisdom', 10)
    new_c = s.get('camaraderie', 50)
    
    narrative_text = ai_response.get("narrative", "")
    meta_match = re.search(r'\[UPDATE:\s*(.*?)\]', narrative_text)
    if meta_match:
        narrative_text = narrative_text.replace(meta_match.group(0), "").strip()
        updates = meta_match.group(1).split(",")
        for up in updates:
            up = up.strip()
            if up.startswith("fortitude"):
                new_f = min(100, max(0, new_f + int(up[9:])))
            elif up.startswith("wisdom"):
                new_w = min(100, max(0, new_w + int(up[6:])))
            elif up.startswith("camaraderie"):
                new_c = min(100, max(0, new_c + int(up[11:])))

    if ai_response.get("quest_log_update"):
        quest_log.append(ai_response["quest_log_update"])
        
    narrative_log.append(narrative_text)
        
    new_state = {
        **s,
        "fortitude": new_f,
        "wisdom": new_w,
        "camaraderie": new_c,
        "quest_log": quest_log[-15:], # Journal limit
        "narrative_log": narrative_log[-5:],
        "last_ai_response": {**ai_response, "narrative": narrative_text},
        "turn": s.get("turn", 0) + 1
    }
    
    updated = await gm.update_state(req.session_id, new_state, history_entry={"user": req.user_id, "action": req.action, "content": req.content})
    return {'ok': True, 'state': updated.state}

@router.post('/join')
async def join(req: JoinReq, db: AsyncSession = Depends(get_async_db)):
    gm = GameManager(db)
    session = await gm.join_session(req.session_id, req.user_id, {"role": "Player", "character": req.character_name, "class": req.character_class})
    from models.chat import Group
    group_name = f"game_{req.session_id}"
    result = await db.execute(select(Group).where(Group.name == group_name))
    group = result.scalars().first()
    if group: await add_player_to_game_chat(db, group.id, req.user_id)
    return {'ok': True, 'players': session.players, 'group_id': group.id if group else None}
