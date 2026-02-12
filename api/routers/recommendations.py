import asyncio
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError
from models.user import Tenant
from schemas.user import RecommendedUserSchema, TenantSchema
from database.session import get_db
from utils.token import get_current_user
from models.connection import Connection
from sqlalchemy import or_, and_
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Lazy-load insights to avoid import-time failures when langchain/Google credentials are missing
_insights = None


def get_insights():
    global _insights
    if _insights is not None:
        return _insights
    try:
        from elinity_ai.insights import ElinityInsights
        _insights = ElinityInsights()
    except Exception:
        # If dependencies are missing, fall back to a stub that returns a simple string
        def _fallback_insight(query: str, user_id: str, user_name: str, score: float, user_interests: str):
            return f"Insights unavailable (missing deps/creds); score={score:.2f}"

        class _Fallback:
            def generate_insight(self, query, user_id, user_name, score, user_interests=""):
                return _fallback_insight(query, user_id, user_name, score, user_interests)

        _insights = _Fallback()
    return _insights


async def process_tenant_insight(tenant: Tenant, query: str, score: float) -> RecommendedUserSchema:
    """Helper function to process one tenant and get AI insight."""
    user_name = "Unknown User"
    try:
        # Run AI generation in a thread to avoid blocking event loop
        loop = asyncio.get_event_loop()
        insights = get_insights()
        
        user_id = tenant.id
        name_parts = [
            tenant.personal_info.first_name if tenant.personal_info else "",
            tenant.personal_info.middle_name if tenant.personal_info else "",
            tenant.personal_info.last_name if tenant.personal_info else ""
        ]
        user_name = " ".join(part for part in name_parts if part).strip() or "Unknown User"
        
        user_interests = ','.join(tenant.interests_and_hobbies.interests or []) if tenant.interests_and_hobbies else ""

        ai_insight_text = await loop.run_in_executor(
            None, 
            insights.generate_insight,
            query,
            user_id,
            user_name,
            score,
            user_interests
        )

        return RecommendedUserSchema(
            tenant=TenantSchema.model_validate(tenant),
            score=score,
            ai_insight=ai_insight_text
        )
    except Exception as e:
        logger.error(f"Error processing insight for user {tenant.id}: {e}")
        return RecommendedUserSchema(
            tenant=TenantSchema.model_validate(tenant),
            score=score,
            ai_insight=f"Could not generate insight for {user_name}."
        )


@router.get("/search", tags=["Recommendations"], response_model=List[RecommendedUserSchema])
async def get_recommendations_optimized(
    query: str = "", 
    current_user: Tenant = Depends(get_current_user), 
    db: Session = Depends(get_db)
): 
    return await _get_recommendations_internal(query, current_user, db)

@router.get("/", tags=["Recommendations"], response_model=List[RecommendedUserSchema])
async def get_recommendations(
    current_user: Tenant = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return await _get_recommendations_internal("", current_user, db)

async def _get_recommendations_internal(query: str, current_user: Tenant, db: Session):
    try:
        # 1. Fetch Candidates (up to 50 active users) with Eager Loading (Fix N+1)
        candidates = db.query(Tenant).options(
            joinedload(Tenant.interests_and_hobbies),
            joinedload(Tenant.personal_info)
        ).filter(
            Tenant.id != current_user.id,
            ~Tenant.id.like("host_%"),
            ~Tenant.id.like("player_%"),
            ~Tenant.id.like("guest_%"),
            ~Tenant.email.like("host_%"),
            ~Tenant.email.like("player_%"),
            ~Tenant.email.like("guest_%")
        ).limit(50).all()
        
        # 2. Calculate Similarity Score
        my_interests = set(current_user.interests_and_hobbies.interests or []) if current_user.interests_and_hobbies else set()
        my_location = current_user.personal_info.location.lower() if current_user.personal_info and current_user.personal_info.location else ""
    
        scored_candidates = []
        for user in candidates:
            score = 0.1 # Base score
            
            # Interest Overlap
            their_interests = set(user.interests_and_hobbies.interests or []) if user.interests_and_hobbies else set()
            overlap = len(my_interests.intersection(their_interests))
            if overlap > 0:
                score += min(overlap * 0.2, 0.5)
                
            # Location Match
            their_location = user.personal_info.location.lower() if user.personal_info and user.personal_info.location else ""
            if my_location and their_location and my_location == their_location:
                score += 0.3
                
            scored_candidates.append({"user": user, "score": score})
    
        # 3. Sort and Take Top 5
        scored_candidates.sort(key=lambda x: x["score"], reverse=True)
        top_matches = scored_candidates[:5]
    
        # 4. Generate AI Insights Concurrently
        tasks = [
            process_tenant_insight(item["user"], query, item["score"]) 
            for item in top_matches
        ]
        users_with_insights = await asyncio.gather(*tasks)
        
        # 5. Enrich with Connection Status
        for rec in users_with_insights:
            target_id = rec.tenant.id
            conn = db.query(Connection).filter(
                or_(
                    and_(Connection.user_a_id == current_user.id, Connection.user_b_id == target_id),
                    and_(Connection.user_a_id == target_id, Connection.user_b_id == current_user.id)
                )
            ).first()
            if conn:
                rec.connection_status = conn.status
                rec.connection_id = conn.id

        users_with_insights.sort(key=lambda x: x.score, reverse=True)
        return users_with_insights
    
    except Exception as e:
        logger.error(f"Recommendation Error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Recommendation Error: {str(e)}"
        ) 
 