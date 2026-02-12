from fastapi import APIRouter, Depends, HTTPException, status
from models.chat import Chat, Group, GroupMember
from database.session import get_db, Session
from utils.token import get_current_user
from models.user import Tenant, PersonalInfo, ProfilePicture
from models.connection import Connection
from sqlalchemy import or_, and_
from schemas.chat import ChatSchema, ChatCreateSchema
from services.ai_service import AIService
import json
import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import aliased
from sqlalchemy import func, desc, or_


router = APIRouter()
ai_service = AIService()

# ---------------------------
# Get all chats for user
# ---------------------------
@router.get("/", tags=["Chats"])
async def get_chats(
    current_user: Tenant = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Chat).filter(Chat.sender == current_user.id).all()


# ---------------------------
# Create new chat
# ---------------------------
@router.post("/", tags=["Chats"], response_model=ChatSchema)
async def create_chat(
    chat: ChatCreateSchema,   # ✅ use create schema
    current_user: Tenant = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # sender is always current_user
    chat_obj = Chat(sender=current_user.id, **chat.model_dump())
    db.add(chat_obj)
    db.commit()
    db.refresh(chat_obj)
    return chat_obj


@router.post("/direct/{target_id}", tags=["Chats"]) 
async def send_direct_message(target_id: str, payload: dict, current_user: Tenant = Depends(get_current_user), db: Session = Depends(get_db)):
    """Send a direct message to another user. Automatically creates a private group (dm_{a}_{b}) and stores messages."""
    message = payload.get("message")
    if not message:
        raise HTTPException(status_code=400, detail="message is required")
    if target_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot message yourself")

    # Ensure target exists
    target = db.query(Tenant).filter(Tenant.id == target_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target user not found")

    # --- CONNECTION CHECK ---
    # Normal chats only allowed if status is 'matched' or 'personal_circle'
    connection = db.query(Connection).filter(
        or_(
            and_(Connection.user_a_id == current_user.id, Connection.user_b_id == target_id),
            and_(Connection.user_a_id == target_id, Connection.user_b_id == current_user.id)
        ),
        Connection.status.in_(['matched', 'personal_circle', 'personal'])
    ).first()

    if not connection:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You must be mutually connected to message this user. Send a connection request first."
        )

    # Create deterministic DM group name
    ids = sorted([current_user.id, target_id])
    group_name = f"dm_{ids[0]}_{ids[1]}"

    group = db.query(Group).filter(Group.name == group_name).first()
    if not group:
        group = Group(name=group_name, tenant=current_user.id, description=f"Direct messages between {ids[0]} and {ids[1]}", type='users_ai')
        db.add(group); db.commit(); db.refresh(group)
        # add members
        gm1 = GroupMember(group=group.id, tenant=current_user.id)
        gm2 = GroupMember(group=group.id, tenant=target_id)
        db.add_all([gm1, gm2]); db.commit()

    asset_id = payload.get("asset_url") or payload.get("asset_id")

    # store chat message in group
    chat_obj = Chat(sender=current_user.id, receiver=target_id, group=group.id, message=message, asset_url=asset_id)
    db.add(chat_obj); db.commit(); db.refresh(chat_obj)

    return {"status": "ok", "chat_id": chat_obj.id, "group_id": group.id}


    return {"status": "ok", "chat_id": chat_obj.id, "group_id": group.id}


@router.get("/inbox", tags=["Chats"])
def get_inbox(current_user: Tenant = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get list of active conversations (inbox) with last message and metadata."""
    
    # 1. Get all groups I am a member of
    my_memberships = db.query(GroupMember).filter(GroupMember.tenant == current_user.id).all()
    group_ids = [m.group for m in my_memberships]

    if not group_ids:
        return []

    # 2. Fetch groups (exclude game chat groups from main inbox)
    groups = db.query(Group).filter(
        Group.id.in_(group_ids), 
        Group.status == 'active',
        ~Group.name.like("game_%")
    ).all()
    
    inbox_items = []

    for group in groups:
        # 3. Get last message
        last_msg = db.query(Chat).filter(Chat.group == group.id).order_by(Chat.created_at.desc()).first()
        
        item = {
            "group_id": group.id,
            "type": group.type, # 'user_ai', 'users_ai', 'group'
            "name": group.name,
            "avatar": None,
            "last_message": last_msg.message if last_msg else "No messages yet",
            "time": last_msg.created_at if last_msg else group.created_at,
            "unread": 0, # TODO: implement unread count
            "other_user_id": None
        }

        # 4. Enrich name/avatar if it's a DM (type='users_ai')
        if group.type == 'users_ai':
            # Find the other member
            other_member = db.query(GroupMember).filter(
                GroupMember.group == group.id, 
                GroupMember.tenant != current_user.id
            ).first()
            
            if other_member:
                # Get their personal info
                other_info = db.query(PersonalInfo).filter(PersonalInfo.tenant == other_member.tenant).first()
                # Get profile pic
                other_pic = db.query(ProfilePicture).filter(ProfilePicture.tenant == other_member.tenant).first()
                
                if other_info:
                    item["name"] = f"{other_info.first_name} {other_info.last_name}".strip()
                else:
                    item["name"] = "Unknown User"
                    
                if other_pic:
                    item["avatar"] = other_pic.url
                else:
                     # Fallback random avatar
                    item["avatar"] = f"https://randomuser.me/api/portraits/thumb/men/{len(inbox_items)}.jpg"

                item["other_user_id"] = other_member.tenant
        
        inbox_items.append(item)

    # Sort by time desc
    inbox_items.sort(key=lambda x: x['time'], reverse=True)
    return inbox_items


@router.get("/history/{group_id}", tags=["Chats"])
def get_chat_history(group_id: str, current_user: Tenant = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get chat history for a specific group."""
    # Check membership
    is_member = db.query(GroupMember).filter(
        GroupMember.group == group_id, 
        GroupMember.tenant == current_user.id
    ).first()
    if not is_member:
        raise HTTPException(status_code=403, detail="Not a member of this group")

    # Fetch chats
    chats = db.query(Chat).filter(Chat.group == group_id).order_by(Chat.created_at.asc()).all()
    
    # Enrich sender info
    result = []
    sender_cache = {}
    
    for c in chats:
        sender_name = "Unknown"
        sender_avatar = None
        
        if c.sender == current_user.id:
            sender_name = "Me"
            # Get my avatar if needed, or frontend handles "Me"
        elif c.sender in sender_cache:
             sender_name, sender_avatar = sender_cache[c.sender]
        else:
            pinfo = db.query(PersonalInfo).filter(PersonalInfo.tenant == c.sender).first()
            ppic = db.query(ProfilePicture).filter(ProfilePicture.tenant == c.sender).first()
            if pinfo:
                sender_name = f"{pinfo.first_name} {pinfo.last_name}".strip()
            if ppic:
                sender_avatar = ppic.url
            sender_cache[c.sender] = (sender_name, sender_avatar)

        result.append({
            "id": c.id,
            "sender_id": c.sender,
            "sender_name": sender_name,
            "sender_avatar": sender_avatar,
            "text": c.message,
            "time": c.created_at,
            "is_me": (c.sender == current_user.id)
        })
        
    return result


@router.post("/seed", tags=["Chats"])
def seed_chat_data(current_user: Tenant = Depends(get_current_user), db: Session = Depends(get_db)):
    """Generate mock users and chats for the current user."""
    
    # 1. Create fake users
    fake_users = [
        {"fname": "Ryan", "lname": "Lee", "gender": "male", "msg": "Hey! Long time no see."},
        {"fname": "Jessica", "lname": "Alba", "gender": "female", "msg": "Are we still on for coffee?"},
        {"fname": "Mark", "lname": "Ruffalo", "gender": "male", "msg": "I sent the files."},
        {"fname": "Alice", "lname": "Wonder", "gender": "female", "msg": "Did you see the new movie?"}
    ]
    
    created_count = 0
    
    for u in fake_users:
        # Check if exists (by email to avoid dups if run multiple times)
        email = f"{u['fname'].lower()}.{u['lname'].lower()}@example.com"
        exists = db.query(Tenant).filter(Tenant.email == email).first()
        
        target_user = exists
        if not target_user:
            # Create Tenant
            target_user = Tenant(email=email, password="password", role="user")
            db.add(target_user)
            db.commit()
            db.refresh(target_user)
            
            # Create PersonalInfo
            pinfo = PersonalInfo(
                tenant=target_user.id, 
                first_name=u['fname'], 
                last_name=u['lname'],
                gender=u['gender']
            )
            db.add(pinfo)
            
            # Create ProfilePicture
            gender_code = "women" if u['gender'] == "female" else "men"
            import random
            num = random.randint(1, 90)
            ppic = ProfilePicture(tenant=target_user.id, url=f"https://randomuser.me/api/portraits/{gender_code}/{num}.jpg")
            db.add(ppic)
            db.commit()
            created_count += 1
        
        # 2. Create Group (DM)
        # Sort IDs to make unique name
        ids = sorted([current_user.id, target_user.id])
        group_name = f"dm_{ids[0]}_{ids[1]}"
        
        group = db.query(Group).filter(Group.name == group_name).first()
        if not group:
            group = Group(name=group_name, tenant=current_user.id, type='users_ai', status='active')
            db.add(group)
            db.commit()
            db.refresh(group)
            
            # Add members
            m1 = GroupMember(group=group.id, tenant=current_user.id)
            m2 = GroupMember(group=group.id, tenant=target_user.id)
            db.add_all([m1, m2])
            db.commit()
            
        # 3. Add Messages if empty
        chats_exist = db.query(Chat).filter(Chat.group == group.id).count()
        if chats_exist == 0:
            # Add a few messages
            from datetime import timedelta
            # Msg 1 from them
            c1 = Chat(
                sender=target_user.id, 
                group=group.id, 
                message=u['msg'], 
                created_at=datetime.now(timezone.utc) - timedelta(days=1)
            )
            # Msg 2 from me
            c2 = Chat(
                sender=current_user.id, 
                group=group.id, 
                message="Yeah, definitely! Let's catch up.",
                created_at=datetime.now(timezone.utc) - timedelta(hours=5)
            )
             # Msg 3 from them
            c3 = Chat(
                sender=target_user.id, 
                group=group.id, 
                message="Cool. How about Friday?",
                created_at=datetime.now(timezone.utc) - timedelta(minutes=10)
            )
            db.add_all([c1, c2, c3])
            db.commit()

    return {"message": f"Seeded {created_count} users and conversations."}


@router.post("/icebreaker", tags=["Chats"])
async def get_icebreaker(mode: str = "universal"):
    """Get a random icebreaker prompt based on mode (universal, romantic, leisure, work)."""
    from elinity_ai.modes.prompts import (
        ICEBREAKER_TWO_TRUTHS, ICEBREAKER_SWIPE_SHARE, ICEBREAKER_DATE_DEBATE
    )
    # Mapping modes to specific icebreakers (MVP random pick)
    import random
    options = [ICEBREAKER_TWO_TRUTHS, ICEBREAKER_SWIPE_SHARE, ICEBREAKER_DATE_DEBATE]
    return {"icebreaker": random.choice(options)}

@router.post("/vibe-check", tags=["Chats"])
async def trigger_vibe_check(type: str = "personality"):
    """Get a vibe check prompt for voice/video response."""
    prompts = {
        "personality": "Tell me the story behind your favorite scar, tattoo, or keepsake.",
        "playful": "Tell me a 20-second story using the words: banana, stars, and betrayal.",
        "values": "What’s something you deeply value that others often overlook?",
        "fun": "What's a weird skill or fact you know that nobody expects?"
    }
    return {"prompt": prompts.get(type, prompts["personality"])}

# ---------------------------
# Get single chat by ID
# ---------------------------
@router.get("/{chat_id}", tags=["Chats"], response_model=ChatSchema)
async def get_chat(
    chat_id: str,  # UUID
    current_user: Tenant = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat_obj = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found"
        )
    return chat_obj
