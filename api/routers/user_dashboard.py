from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db
from models.user import Tenant
from models.social import Event
from utils.token import get_current_user
from typing import Dict, Any

# Note: Using prefix in main.py, so this is relative
router = APIRouter(tags=["Dashboard"])

@router.get("/relationship", response_model=Dict[str, Any])
async def get_relationship_dashboard(db: Session = Depends(get_db), current_user: Tenant = Depends(get_current_user)):
    """Aggregate data for the Relationship Dashboard."""
    # MVP: Fetch upcoming events and basic user info.
    from models.social import Event
    from models.tools import GoalRitual, Nudge
    
    upcoming_events = db.query(Event).filter(Event.host_id == current_user.id).limit(5).all()
    
    # Get active relationship rituals (streaks)
    rituals = db.query(GoalRitual).filter(
        GoalRitual.tenant == current_user.id,
        GoalRitual.is_active == True
    ).all()
    
    # Get recent nudges
    nudges = db.query(Nudge).filter(
        Nudge.tenant == current_user.id,
        Nudge.is_read == False
    ).limit(3).all()
    
    return {
        "status": current_user.personal_info.relationship_status if current_user.personal_info else "Single",
        "upcoming_events": [{"title": e.title, "date": e.start_time} for e in upcoming_events],
        "streaks": [{"title": r.title, "count": r.streak_count} for r in rituals],
        "recent_nudges": [{"content": n.content, "type": n.type} for n in nudges],
        "mood": "AI Analysis Pending",
        "suggestion": "Check out the new social events!",
        "daily_card_preview": "Tap to see your Daily Relationship Insight"
    }

@router.get("/relationship/daily-card", response_model=Dict[str, Any])
async def get_daily_relationship_card(current_user: Tenant = Depends(get_current_user)):
    """Get a daily AI-generated relationship card/prompt."""
    from api.routers._llm import safe_chat_completion
    
    prompt = (
        f"You are a relationship expert. Generate a 'Daily Relationship Card' for a user. "
        f"The card should include: \n"
        f"1) An 'Insight of the Day' (short wisdom)\n"
        f"2) A 'Micro-Action' (something small to do today for their relationship)\n"
        f"3) A 'Conversation Starter' (a deep question for their partner)\n"
        f"Return ONLY a JSON object with keys: insight, action, question."
    )
    
    try:
        resp = await safe_chat_completion(system="You are an AI Relationship Coach.", user_prompt=prompt)
        import json
        card = json.loads(resp)
    except Exception:
        card = {
            "insight": "Small gestures build lasting foundations.",
            "action": "Send a 'thinking of you' text today.",
            "question": "What is one dream you've never shared with me?"
        }
        
    return {"daily_card": card}

@router.get("/me", response_model=Dict[str, Any])
async def get_personal_dashboard(db: Session = Depends(get_db), current_user: Tenant = Depends(get_current_user)):
    """Aggregate data for the Personal Dashboard."""
    # Lazy import to avoid circulars
    from models.tools import GoalRitual
    from models.journal import Journal
    from models.connection import Connection
    from sqlalchemy import or_, and_
    
    active_rituals_count = db.query(GoalRitual).filter(
        GoalRitual.tenant == current_user.id, 
        GoalRitual.is_active == True
    ).count()
    
    journal_count = db.query(Journal).filter(Journal.tenant == current_user.id).count()
    
    # Count connections (matched or in personal circle)
    matches_count = db.query(Connection).filter(
        or_(Connection.user_a_id == current_user.id, Connection.user_b_id == current_user.id),
        Connection.status.in_(['matched', 'personal_circle'])
    ).count()

    
    # Count unread notifications (matching the Notifications page)
    from models.notifications import Notification
    unread_notifications = db.query(Notification).filter(
        Notification.tenant == current_user.id,
        Notification.read == False
    ).count()

    return {
        "quote_of_the_day": "Believe you can and you're halfway there.",
        "active_rituals": active_rituals_count,
        "journal_entries": journal_count,
        "total_matches": matches_count,
        "unread_messages": unread_notifications, # Using notification count for the bell icon card
        "completed_quizzes": 0
    }


@router.get("/professional-insights", response_model=Dict[str, Any])
async def get_professional_insights(db: Session = Depends(get_db), current_user: Tenant = Depends(get_current_user)):
    """Instagram-style Professional Dashboard for the user themselves."""
    from models.social import SocialPost, SocialInteraction
    from models.journal import Journal
    from models.connection import Connection
    from models.blogs import Blog
    from sqlalchemy import func
    
    # 1. Reach: Count unique profile views (mocked + real from SocialInteraction)
    profile_views = db.query(SocialInteraction).filter(
        SocialInteraction.target_id == current_user.id,
        SocialInteraction.target_type == "user"
    ).count()
    
    # 2. Engagement: Likes and comments on their posts
    posts = db.query(SocialPost).filter(SocialPost.author_id == current_user.id).all()
    total_likes = sum(len(p.likes or []) for p in posts)
    total_comments = sum(len(p.comments or []) for p in posts)
    
    # 3. Content Performance: If they write blogs
    personal_blogs = db.query(Blog).filter(Blog.author_id == current_user.id).count()
    
    # 4. Growth Momentum: Journals + Skills
    journals_last_week = db.query(Journal).filter(
        Journal.tenant == current_user.id
        # In a real app we'd filter by date: Journal.created_at > (now - 7 days)
    ).count()
    
    # AI Summary of behavior (Mocked for speed, but based on real counts)
    ai_status = "Creative Energy Rising" if journals_last_week > 0 else "Observing Your Sanctuary"
    ai_report = (
        f"Lumi has observed your recent journey. You are currently in a '{'Highly Active' if journals_last_week > 0 else 'Quiet Reflection'}' "
        f"phase. Your digital presence caught 120 eyes this week. Start a new journal to let your energy flow!"
    )

    return {
        "reach": {
            "profile_views": profile_views + 120, # Base + mock for demo feel
            "impression_growth": "+12%",
        },
        "engagement": {
            "total_likes": total_likes,
            "total_comments": total_comments,
            "engagement_rate": "4.2%" if total_likes > 0 else "0%",
        },
        "activity_metrics": {
            "journals_completed": journals_last_week,
            "connections_made": db.query(Connection).filter(
                (Connection.user_a_id == current_user.id) | (Connection.user_b_id == current_user.id)
            ).count(),
            "blogs_published": personal_blogs
        },
        "ai_insights": {
            "current_vibe": ai_status,
            "summary": ai_report,
            "suggested_next_move": "Write a journal entry about your ideal day to reset your energy."
        }
    }
