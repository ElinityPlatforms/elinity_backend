from database.session import Session
from models.user import Tenant, PersonalInfo
from models.chat import Group, GroupMember, Chat
from sqlalchemy import func

def test_inbox_logic(email):
    db = Session()
    try:
        user = db.query(Tenant).filter(Tenant.email == email).first()
        if not user:
            print(f"User {email} not found")
            return
        
        print(f"Checking inbox for {email} ({user.id})")
        
        # 1. Get memberships
        memberships = db.query(GroupMember).filter(GroupMember.tenant == user.id).all()
        group_ids = [m.group for m in memberships]
        print(f"Groups user is member of: {group_ids}")
        
        if not group_ids:
            print("No groups found for this user.")
            return

        # 2. Fetch active non-game groups
        from sqlalchemy import not_
        groups = db.query(Group).filter(
            Group.id.in_(group_ids),
            Group.status == 'active',
            not_(Group.name.like("game_%"))
        ).all()
        
        print(f"Active non-game groups: {[g.name for g in groups]}")
        
        for group in groups:
            last_msg = db.query(Chat).filter(Chat.group == group.id).order_by(Chat.created_at.desc()).first()
            msg_text = last_msg.message if last_msg else "No messages"
            print(f" - Group: {group.name}, Last Msg: {msg_text}")
            
    finally:
        db.close()

if __name__ == "__main__":
    test_inbox_logic("sarah.miller@elinity.com")
    test_inbox_logic("marcus.chen@elinity.com")
