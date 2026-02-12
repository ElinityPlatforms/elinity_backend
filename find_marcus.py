from database.session import Session
from models.user import Tenant, PersonalInfo
from models.connection import Connection
from models.chat import Group, GroupMember, Chat

db = Session()
try:
    marcus = db.query(Tenant).join(PersonalInfo).filter(PersonalInfo.first_name == 'Marcus').first()
    if not marcus:
        print("Marcus not found in PersonalInfo")
        # Try finding by name in seed users
        marcus = db.query(PersonalInfo).filter(PersonalInfo.first_name == 'Marcus').first()
        if marcus:
            marcus = db.query(Tenant).filter(Tenant.id == marcus.tenant).first()

    if marcus:
        print(f"Marcus found: {marcus.id}")
        conns = db.query(Connection).filter((Connection.user_a_id == marcus.id) | (Connection.user_b_id == marcus.id)).all()
        print(f"Total connections with Marcus: {len(conns)}")
        for c in conns:
            other_id = c.user_a_id if c.user_b_id == marcus.id else c.user_b_id
            other_user = db.query(Tenant).filter(Tenant.id == other_id).first()
            other_email = other_user.email if other_user else "Unknown"
            print(f" Connection with {other_email} ({other_id}), Status: {c.status}")
            
            # Check if group exists
            ids = sorted([marcus.id, other_id])
            group_name = f"dm_{ids[0]}_{ids[1]}"
            group = db.query(Group).filter(Group.name == group_name).first()
            if group:
                print(f"  Group exists: {group.id}, Status: {group.status}")
                # Check members
                members = db.query(GroupMember).filter(GroupMember.group == group.id).all()
                print(f"  Members count: {len(members)}")
                for m in members:
                    print(f"    Member: {m.tenant}")
                
                # Check messages
                messages = db.query(Chat).filter(Chat.group == group.id).order_by(Chat.created_at.desc()).all()
                print(f"  Messages count: {len(messages)}")
                for msg in messages:
                    print(f"    Msg: {msg.message[:30]}... (From: {msg.sender})")
            else:
                print(f"  No group found for name: {group_name}")
    else:
        print("Marcus still not found.")
finally:
    db.close()
