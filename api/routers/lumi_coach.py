from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from database.session import get_db
from models.user import Tenant
from models.chat import Chat, Group
from models.connection import Connection
from utils.token import get_current_user
from api.routers._llm import safe_chat_completion
from sqlalchemy import or_, and_, desc
import logging

router = APIRouter(prefix="/lumi/relationship-coach", tags=["Lumi Relationship Coach"])
logger = logging.getLogger(__name__)

async def analyze_conversation(db: Session, group_id: str, user_a_id: str, user_b_id: str):
    """Background task to analyze conversation and provide relationship insights."""
    try:
        # Get recent messages from this conversation
        messages = db.query(Chat).filter(
            Chat.group == group_id
        ).order_by(desc(Chat.created_at)).limit(20).all()
        
        if len(messages) < 3:
            return  # Not enough messages to analyze
        
        # Format conversation for AI analysis
        conversation_text = "\n".join([
            f"{'User A' if msg.sender == user_a_id else 'User B'}: {msg.message}"
            for msg in reversed(messages)
        ])

        
        # Get user profiles for context
        user_a = db.query(Tenant).filter(Tenant.id == user_a_id).first()
        user_b = db.query(Tenant).filter(Tenant.id == user_b_id).first()
        
        user_a_name = user_a.personal_info.first_name if user_a and user_a.personal_info else "User A"
        user_b_name = user_b.personal_info.first_name if user_b and user_b.personal_info else "User B"
        
        # AI Analysis Prompt
        system_prompt = """You are Lumi, an empathetic AI relationship coach. You monitor conversations between two people 
        who are building a connection. Your role is to:
        1. Identify positive patterns and green flags
        2. Detect potential communication issues or red flags
        3. Suggest conversation topics to deepen the connection
        4. Provide gentle guidance to help both people build a healthy relationship
        
        Be supportive, non-judgmental, and focus on helping them connect authentically."""
        
        user_prompt = f"""Analyze this conversation between {user_a_name} and {user_b_name}:

{conversation_text}

Provide insights in JSON format:
{{
    "overall_vibe": "positive/neutral/concerning",
    "green_flags": ["list of positive observations"],
    "suggestions_for_a": ["personalized tips for {user_a_name}"],
    "suggestions_for_b": ["personalized tips for {user_b_name}"],
    "conversation_starters": ["topics they might enjoy discussing"],
    "relationship_health_score": 0-100
}}"""
        
        # Get AI analysis
        response = await safe_chat_completion(system=system_prompt, user_prompt=user_prompt)
        
        import json
        insights = json.loads(response)
        
        # Store insights in notifications for both users
        from models.notifications import Notification
        
        # Create notification for User A
        notif_a = Notification(
            tenant=user_a_id,
            title="💡 Lumi's Relationship Insight",
            message=f"I've been observing your conversation with {user_b_name}. Here are some insights to help you connect better!",
            type="lumi_insight",
            notif_metadata=json.dumps({
                "insights": insights,
                "for_user": user_a_name,
                "suggestions": insights.get("suggestions_for_a", []),
                "conversation_starters": insights.get("conversation_starters", [])
            })
        )
        db.add(notif_a)
        
        # Create notification for User B
        notif_b = Notification(
            tenant=user_b_id,
            title="💡 Lumi's Relationship Insight",
            message=f"I've been observing your conversation with {user_a_name}. Here are some insights to help you connect better!",
            type="lumi_insight",
            notif_metadata=json.dumps({
                "insights": insights,
                "for_user": user_b_name,
                "suggestions": insights.get("suggestions_for_b", []),
                "conversation_starters": insights.get("conversation_starters", [])
            })
        )
        db.add(notif_b)
        
        db.commit()
        logger.info(f"Lumi analyzed conversation in group {group_id}, health score: {insights.get('relationship_health_score', 'N/A')}")
        
    except Exception as e:
        logger.error(f"Error in Lumi conversation analysis: {e}")
        db.rollback()


@router.post("/analyze-chat/{group_id}")
async def trigger_chat_analysis(
    group_id: str,
    background_tasks: BackgroundTasks,
    current_user: Tenant = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Manually trigger Lumi to analyze a chat conversation."""
    
    # Get the group and verify user is a member
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        return {"error": "Group not found"}
    
    # Get the connection to find both users
    connection = db.query(Connection).filter(
        or_(
            and_(Connection.user_a_id == current_user.id, Connection.status == 'matched'),
            and_(Connection.user_b_id == current_user.id, Connection.status == 'matched')
        )
    ).first()
    
    if not connection:
        return {"error": "No matched connection found"}
    
    user_a_id = connection.user_a_id
    user_b_id = connection.user_b_id
    
    # Trigger background analysis
    background_tasks.add_task(analyze_conversation, db, group_id, user_a_id, user_b_id)
    
    return {
        "status": "success",
        "message": "Lumi is analyzing your conversation. You'll receive insights shortly!"
    }


@router.get("/insights")
async def get_relationship_insights(
    current_user: Tenant = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all Lumi relationship insights for the current user."""
    from models.notifications import Notification
    
    insights = db.query(Notification).filter(
        Notification.tenant == current_user.id,
        Notification.type == "lumi_insight"
    ).order_by(desc(Notification.created_at)).limit(10).all()
    
    return {
        "insights": [
            {
                "id": str(i.id),
                "title": i.title,
                "message": i.message,
                "metadata": i.notif_metadata,
                "created_at": i.created_at.isoformat() if i.created_at else None
            }
            for i in insights
        ]
    }
