from database.session import Session, engine
from models.chat import Group, GroupMember, Chat
from models.connection import Connection
from models.user import Tenant, PersonalInfo

db = Session()
try:
    print("--- CONNECTIONS ---")
    conns = db.query(Connection).all()
    for c in conns:
        print(f"ID: {c.id}, A: {c.user_a_id}, B: {c.user_b_id}, Status: {c.status}")

    print("\n--- GROUPS ---")
    groups = db.query(Group).all()
    for g in groups:
        print(f"ID: {g.id}, Name: {g.name}, Status: {g.status}, Type: {g.type}")

    print("\n--- GROUP MEMBERS ---")
    members = db.query(GroupMember).all()
    for m in members:
        print(f"ID: {m.id}, Group: {m.group}, Tenant: {m.tenant}")

    print("\n--- USERS ---")
    users = db.query(Tenant).all()
    for u in users:
        pinfo = db.query(PersonalInfo).filter(PersonalInfo.tenant == u.id).first()
        name = f"{pinfo.first_name} {pinfo.last_name}" if pinfo else "No Profile"
        print(f"ID: {u.id}, Email: {u.email}, Name: {name}")

finally:
    db.close()
