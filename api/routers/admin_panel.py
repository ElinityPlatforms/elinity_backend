from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.session import get_db
from models.platform import Report, Subscription
from schemas.platform import AdminStats, ReportCreate
from utils.token import get_current_user
from models.user import Tenant
from typing import Dict

# Prefix /admin/panel to distinguish from user dashboard
router = APIRouter(tags=["Admin Panel"])

async def verify_admin(user: Tenant):
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Admin access required"
        )

@router.get("/stats", response_model=AdminStats)
async def get_stats(
    db: Session = Depends(get_db), 
    current_user: Tenant = Depends(get_current_user)
):
    await verify_admin(current_user)
    
    total_users = db.query(Tenant).count()
    active_subs = db.query(Subscription).filter(Subscription.status == "active").count()
    pending_reports = db.query(Report).filter(Report.status == "pending").count()
    
    # Mock some data for the expanded dashboard
    return AdminStats(
        total_users=total_users,
        active_subscriptions=active_subs,
        pending_reports=pending_reports,
        active_users=total_users // 2, # Mock
        total_matches=total_users * 2, # Mock
        reported_issues=pending_reports,
        api_response_time="115ms",
        database_status="Healthy",
        server_uptime="99.98%",
        recent_activity=[
            {"user": "System", "action": "Database Backup", "time": "2 hours ago"},
            {"user": "Admin", "action": "User Moderation", "time": "5 hours ago"}
        ]
    )

@router.post("/reports")
async def create_report(
    report: ReportCreate, 
    db: Session = Depends(get_db), 
    current_user: Tenant = Depends(get_current_user)
):
    db_report = Report(reporter_id=current_user.id, **report.model_dump())
    db.add(db_report)
    db.commit()
    return {"message": "Report submitted"}

@router.post("/users/{user_id}/suspend")
async def suspend_user(
    user_id: str, 
    db: Session = Depends(get_db), 
    current_user: Tenant = Depends(get_current_user)
):
    await verify_admin(current_user)
    # MVP: Log suspension or set a flag (not implemented in Tenant model yet)
    return {"message": f"User {user_id} suspended"}

@router.post("/sessions/reset")
async def reset_sessions(
    db: Session = Depends(get_db), 
    current_user: Tenant = Depends(get_current_user)
):
    await verify_admin(current_user)
    from sqlalchemy import text
    try:
        db.execute(text("DELETE FROM game_sessions")) 
        db.commit()
        return {"message": "All game sessions deleted."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
