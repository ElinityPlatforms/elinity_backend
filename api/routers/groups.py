from fastapi import APIRouter, Depends, HTTPException, status
from models.chat import Group
from database.session import get_db, Session
from utils.token import get_current_user
from models.user import Tenant
from schemas.chat import GroupSchema, GroupCreateSchema, GroupWizardSchema
from pydantic import BaseModel
from models.chat import GroupMember, Chat # Added Chat for welcome message
import uuid

router = APIRouter()


# ---------------------------
# Extra schema for updates
# ---------------------------
class GroupUpdateSchema(BaseModel):
    name: str
    description: str
    asset_url: str | None = None
    type: str

    class Config:
        from_attributes = True


# ---------------------------
# Routes
# ---------------------------
@router.get("/", tags=["Groups"])
async def get_groups(
    current_user: Tenant = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Group).filter(
        Group.tenant == current_user.id,
        Group.status == 'active'
    ).all()


@router.post("/wizard", tags=["Groups"], response_model=GroupSchema)
async def create_group_wizard(
    data: GroupWizardSchema,
    current_user: Tenant = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """One-call setup for a group with members."""
    # 1. Create the Group
    group_obj = Group(
        tenant=current_user.id,
        name=data.name,
        description=data.description or f"Discussion group created by {current_user.id}",
        type='group',
        status='active'
    )
    db.add(group_obj)
    db.commit()
    db.refresh(group_obj)

    # 2. Add members
    # Always add creator as owner
    owner = GroupMember(group=group_obj.id, tenant=current_user.id, role='owner')
    db.add(owner)

    # Add other members
    for member_id in data.member_ids:
        if member_id != current_user.id:
            member = GroupMember(group=group_obj.id, tenant=member_id, role='member')
            db.add(member)

    # 3. Add a welcome message
    welcome_msg = Chat(
        sender=current_user.id,
        group=group_obj.id,
        message=f"Welcome to {data.name}! We're ready to start chatting."
    )
    db.add(welcome_msg)
    
    db.commit()
    db.refresh(group_obj)
    return group_obj


@router.post("/", tags=["Groups"], response_model=GroupSchema)
async def create_group(
    group: GroupCreateSchema,
    current_user: Tenant = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    group_obj = Group(tenant=current_user.id, **group.model_dump())
    db.add(group_obj)
    db.commit()
    db.refresh(group_obj)
    return group_obj


@router.get("/{group_id}", tags=["Groups"], response_model=GroupSchema)
async def get_group(
    group_id: str,   # should be UUID/string, not int
    current_user: Tenant = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Group).filter(
        Group.id == group_id,
        Group.status == 'active'
    ).first()


@router.put("/{group_id}", tags=["Groups"], response_model=GroupSchema)
async def update_group(
    group_id: str,
    group: GroupUpdateSchema,   # ✅ new schema
    current_user: Tenant = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    group_obj = db.query(Group).filter(
        Group.id == group_id,
        Group.status == 'active'
    ).first()

    if not group_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )

    for k, v in group.model_dump().items():
        setattr(group_obj, k, v)

    db.commit()
    db.refresh(group_obj)
    return group_obj


@router.delete("/{group_id}", tags=["Groups"])
async def delete_group(
    group_id: str,
    current_user: Tenant = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    group_obj = db.query(Group).filter(
        Group.id == group_id,
        Group.status == 'active'
    ).first()

    if not group_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )

    group_obj.status = 'inactive'
    db.commit()
    return {"message": "Group deleted"}
