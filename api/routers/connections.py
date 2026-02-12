from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, and_
from database.session import get_db
from models.user import Tenant
from models.connection import Connection
from models.notifications import Notification
from utils.token import get_current_user
from datetime import datetime, timezone
import logging

router = APIRouter(prefix="/connections", tags=["Connections P1"])
logger = logging.getLogger(__name__)

def create_notification(db: Session, tenant_id: str, title: str, message: str, type: str = 'social', metadata: dict = None):
    import json
    notif = Notification(
        tenant=tenant_id,
        title=title,
        message=message,
        type=type,
        notif_metadata=json.dumps(metadata) if metadata else None
    )
    db.add(notif)
    return notif

@router.post("/request/{target_id}")
async def request_connection(
    target_id: str,
    mode: str = Body("social", embed=True),
    current_user: Tenant = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Initial connection request from User A to User B."""
    # 1. Check if self
    if target_id == current_user.id:
        raise HTTPException(400, "Cannot connect with yourself")
    
    
    # 2. Check if target user exists
    print(f"🔍 CONNECTION REQUEST: current_user={current_user.id}, target_id={target_id}")
    target_user = db.query(Tenant).filter(Tenant.id == target_id).first()
    if not target_user:
        print(f"❌ TARGET USER NOT FOUND: {target_id}")
        # List all users for debugging
        all_users = db.query(Tenant).all()
        print(f"📋 AVAILABLE USERS: {[(str(u.id), u.email) for u in all_users]}")
        raise HTTPException(404, f"User not found: {target_id}")
    print(f"✅ TARGET USER FOUND: {target_user.email}")


    # 3. Check if connection exists
    conn = db.query(Connection).filter(
        or_(
            and_(Connection.user_a_id == current_user.id, Connection.user_b_id == target_id),
            and_(Connection.user_a_id == target_id, Connection.user_b_id == current_user.id)
        )
    ).first()

    if conn:
        # If already suggested, move to pending
        if conn.status == 'suggested':
            conn.status = 'pending_b'
            conn.user_a_id = current_user.id
            conn.user_b_id = target_id
            db.commit()
        else:
            return {"status": "exists", "connection_status": conn.status, "connection_id": conn.id}
    else:
        # Create new
        conn = Connection(
            user_a_id=current_user.id,
            user_b_id=target_id,
            mode=mode,
            status='pending_b',
            score=0.5 # Default
        )
        db.add(conn)
        db.commit()
    
    
    # 3. Notify User B - Load personal info if not already loaded
    try:
        if not current_user.personal_info:
            db.refresh(current_user, ['personal_info'])
        sender_name = f"{current_user.personal_info.first_name if current_user.personal_info else ''}".strip() or "Someone"
    except Exception as e:
        logger.warning(f"Could not load sender name: {e}")
        sender_name = "Someone"
    
    create_notification(
        db, 
        target_id, 
        "New Connection Request", 
        f"{sender_name} wants to connect with you!", 
        "social",
        metadata={
            "connection_id": str(conn.id),
            "sender_id": str(current_user.id),
            "sender_name": sender_name,
            "action": "connection_request"
        }
    )
    db.commit()

    return {"status": "ok", "connection_status": conn.status, "connection_id": conn.id}


# --- HELPERS (Adapted from recommendations.py) ---
def calculate_heuristic_score(user_a, user_b):
    """Simple python-based similarity score until Vector DB is fully stable."""
    try:
        score = 0.1 # Base score
        
        # Interests
        a_interests = set(user_a.interests_and_hobbies.interests or []) if user_a.interests_and_hobbies else set()
        b_interests = set(user_b.interests_and_hobbies.interests or []) if user_b.interests_and_hobbies else set()
        
        overlap = len(a_interests.intersection(b_interests))
        if overlap > 0:
            score += min(overlap * 0.2, 0.5) # Max 0.5 from interests
            
        # Location
        a_loc = user_a.personal_info.location.lower() if user_a.personal_info and user_a.personal_info.location else "."
        b_loc = user_b.personal_info.location.lower() if user_b.personal_info and user_b.personal_info.location else ".."
        if a_loc == b_loc:
            score += 0.3
            
        return min(score, 0.99)
    except Exception as e:
        logger.error(f"Scoring error: {e}")
        return 0.1

def generate_ai_insight(user_b, score):
    """Stub for AI explanation."""
    return f"We noticed you share common interests. With a compatibility score of {int(score*100)}%, {user_b.personal_info.first_name} could be a great match."

# --- ENDPOINTS ---

@router.get("/daily/{mode}")
async def get_daily_batch(
    mode: str, 
    current_user: Tenant = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Fetch daily recommendations based on the Founder's P1 logic.
    - Check Quota (3/5/8)
    - Apply Threshold vs Top Pick logic
    - Persist as 'suggested' connections
    """
    prefs = current_user.connection_preferences or {}
    
    # 1. Config
    daily_limit = prefs.get('daily_limit', 3)
    filter_mode = prefs.get('filter_mode', 'threshold') # 'threshold' or 'top_picks'
    min_threshold = prefs.get('min_threshold', 0.60)
    
    # 2. Check Exising Recommendations for TODAY
    # (Simple logic: Count 'suggested' created today)
    # For a real app, we'd check date. For prototype, just check total active suggestions.
    
    existing_recs = db.query(Connection).filter(
        Connection.user_a_id == current_user.id,
        Connection.status == 'suggested',
        Connection.mode == mode
    ).all()
    
    # If we already have a batch, return it
    if len(existing_recs) >= daily_limit:
        return [format_connection(c, db) for c in existing_recs]
        
    # 3. Generate New Recommendations (Fill the gap)
    needed = daily_limit - len(existing_recs)
    
    # Get Candidates (exclude self and already connected in either direction)
    conns = db.query(Connection).filter(
        or_(Connection.user_a_id == current_user.id, Connection.user_b_id == current_user.id)
    ).all()
    
    existing_ids = set()
    for c in conns:
        existing_ids.add(c.user_a_id)
        existing_ids.add(c.user_b_id)
    existing_ids.add(current_user.id)

    
    candidates = db.query(Tenant).filter(
        Tenant.id.notin_(existing_ids),
        ~Tenant.id.like("host_%"),
        ~Tenant.id.like("player_%"),
        ~Tenant.id.like("guest_%"),
        ~Tenant.email.like("host_%"),
        ~Tenant.email.like("player_%"),
        ~Tenant.email.like("guest_%")
    ).limit(50).all()
    
    scored = []
    for cand in candidates:
        score = calculate_heuristic_score(current_user, cand)
        scored.append((cand, score))
        
    # 4. Apply Filtering Logic
    scored.sort(key=lambda x: x[1], reverse=True)
    
    final_picks = []
    if filter_mode == 'threshold':
        # Only above N%
        final_picks = [x for x in scored if x[1] >= min_threshold]
        # Just take top 'needed' from those who passed
        final_picks = final_picks[:needed]
    else:
        # Top picks regardless of score
        final_picks = scored[:needed]
        
    # 5. Persist
    new_connections = []
    for cand, score in final_picks:
        conn = Connection(
            user_a_id=current_user.id,
            user_b_id=cand.id,
            mode=mode,
            score=score,
            status='suggested',
            feedback={} # Init
        )
        db.add(conn)
        new_connections.append(conn)
        
    db.commit()
    
    # Refresh to get IDs
    for c in new_connections:
        db.refresh(c)
        
    # Combine old + new
    all_recs = existing_recs + new_connections
    
    # Generate insights concurrently if needed (future improvement)
    # For now, just ensure format_connection is efficient
    return [format_connection(c, db) for c in all_recs]

@router.post("/action/{connection_id}")
async def handle_connection_action(
    connection_id: str,
    action: str = Body(..., embed=True), # 'accept', 'decline', 'archive'
    feedback: str = Body(None, embed=True),
    reason: str = Body(None, embed=True),
    current_user: Tenant = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Handle user actions on a profile.
    - Accept: Move to 'pending_b' (waiting for other user) or 'matched' if B already accepted A.
    - Decline: Move to 'declined', store AI Feedback.
    - Archive: Move to 'archived'.
    """
    conn = db.query(Connection).filter(Connection.id == connection_id).first()
    if not conn:
        raise HTTPException(404, "Connection not found")
        
    if conn.user_a_id != current_user.id and conn.user_b_id != current_user.id:
        raise HTTPException(403, "Not authorized")
        
    if action == 'archive':
        conn.status = 'archived'
        db.commit()
        return {"ok": True, "status": "archived"}
        
    if action == 'decline':
        conn.status = 'declined'
        conn.feedback = {
            "declined_by": current_user.id,
            "reason": reason,
            "feedback_text": feedback,
            "timestamp": str(datetime.now())
        }
        db.commit()
        return {"ok": True, "status": "declined"}
        
    if action == 'accept':
        if conn.status == 'suggested' and conn.user_a_id == current_user.id:
            conn.status = 'pending_b'
            # Notify User B
            sender_name = f"{current_user.personal_info.first_name if current_user.personal_info else ''}".strip() or "Someone"
            create_notification(
                db, 
                conn.user_b_id, 
                "New Connection Request", 
                f"{sender_name} wants to connect with you!", 
                "social",
                metadata={
                    "connection_id": str(conn.id),
                    "sender_id": str(current_user.id),
                    "sender_name": sender_name,
                    "action": "connection_request"
                }
            )
        elif conn.status == 'pending_b' and conn.user_b_id == current_user.id:
            conn.status = 'matched'
            conn.ai_icebreaker = f"You are now connected!"
            
            # --- CREATE CHAT SESSION ---
            from models.chat import Group, GroupMember
            ids = sorted([conn.user_a_id, conn.user_b_id])
            group_name = f"dm_{ids[0]}_{ids[1]}"
            
            group = db.query(Group).filter(Group.name == group_name).first()
            if not group:
                group = Group(
                    name=group_name, 
                    tenant=conn.user_a_id, 
                    description=f"Direct messages between {ids[0]} and {ids[1]}", 
                    type='users_ai',
                    status='active'
                )
                db.add(group)
                db.flush()
                # add members
                gm1 = GroupMember(group=group.id, tenant=conn.user_a_id)
                gm2 = GroupMember(group=group.id, tenant=conn.user_b_id)
                db.add_all([gm1, gm2])

            # Notify User A that B accepted
            sender_name = f"{current_user.personal_info.first_name if current_user.personal_info else ''}".strip() or "Someone"
            create_notification(
                db, 
                conn.user_a_id, 
                "Connection Accepted", 
                f"{sender_name} accepted your request! You can now chat.", 
                "social",
                metadata={
                    "connection_id": str(conn.id),
                    "sender_id": str(current_user.id),
                    "sender_name": sender_name,
                    "action": "connection_accepted"
                }
            )
        db.commit()
        return {"ok": True, "status": conn.status}


    raise HTTPException(400, "Invalid action")

@router.post("/confirm/{connection_id}")
async def confirm_relationship(
    connection_id: str,
    current_user: Tenant = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Moves a match to 'Personal Circle'.
    If mode is 'romantic', this should disable further romantic searches.
    """
    conn = db.query(Connection).filter(Connection.id == connection_id).first()
    if not conn or conn.status != 'matched':
        raise HTTPException(400, "Must be a match first")
        
    conn.status = 'personal_circle'
    
    # If Romantic, turn off search
    if conn.mode == 'romantic':
        prefs = dict(current_user.connection_preferences)
        if 'active_modes' in prefs:
             prefs['active_modes']['romantic'] = False
             current_user.connection_preferences = prefs
             
    db.commit()
    return {"ok": True, "message": "Moved to Personal Circle"}

@router.get("/pending", tags=["Connections P1"])
async def list_pending_requests(
    current_user: Tenant = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """List connection requests sent to ME that I haven't accepted yet (status='pending_b')."""
    conns = db.query(Connection).filter(
        Connection.user_b_id == current_user.id,
        Connection.status == 'pending_b'
    ).all()
    
    results = []
    for c in conns:
        results.append({
            "id": c.id,
            "user_a_id": c.user_a_id,
            "mode": c.mode,
            "score": c.score,
            "timestamp": c.created_at
        })
    return results

@router.get("/", tags=["Connections P1"])
async def list_connections(
    status_filter: str = "personal_circle",
    current_user: Tenant = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """List all connections with a specific status (default: personal_circle)"""
    conns = db.query(Connection).options(
        joinedload(Connection.user_a).joinedload(Tenant.personal_info),
        joinedload(Connection.user_b).joinedload(Tenant.personal_info)
    ).filter(
        or_(Connection.user_a_id == current_user.id, Connection.user_b_id == current_user.id),
        Connection.status == status_filter
    ).all()
    
    results = []
    for c in conns:
        other_user = c.user_b if c.user_a_id == current_user.id else c.user_a
        if other_user:
             # Basic info mapping
             first = other_user.personal_info.first_name if other_user.personal_info else ""
             last = other_user.personal_info.last_name if other_user.personal_info else ""
             name = f"{first} {last}".strip() or "Unknown"
             
             # Fetch latest profile picture
             from models.user import ProfilePicture
             profile_pic = db.query(ProfilePicture).filter(ProfilePicture.tenant == other_user.id).order_by(ProfilePicture.uploaded_at.desc()).first()
             avatar_url = profile_pic.url if profile_pic else "/default-avatar.png"
             
             results.append({
                 "id": str(other_user.id),
                 "connection_id": str(c.id),
                 "name": name,
                 "avatar": avatar_url, 
                 "relation": "Connection", 
                 "bio": getattr(other_user, 'bio', ""),
                 "mode": c.mode,
                 "status": c.status,
                 "metrics": {
                     "healthScore": int(c.score * 100) if c.score else 50,
                     "positiveInteractions": 0,
                     "sharedActivities": []
                 }
             })

    return results

def format_connection(conn, db):
    # Fetch User B profile efficiently
    user_b = db.query(Tenant).options(joinedload(Tenant.personal_info)).filter(Tenant.id == conn.user_b_id).first()
    if not user_b:
        return None
        
    first = user_b.personal_info.first_name if user_b.personal_info else ""
    last = user_b.personal_info.last_name if user_b.personal_info else ""
    name = f"{first} {last}".strip() or "Unknown"

    return {
        "id": conn.id,
        "user_b": {
            "id": user_b.id,
            "name": name,
            "location": user_b.personal_info.location if user_b.personal_info else "",
        },
        "score": conn.score,
        "mode": conn.mode,
        "status": conn.status,
        "ai_insight": generate_ai_insight(user_b, conn.score)
    }
