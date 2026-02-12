from fastapi import APIRouter, Depends, HTTPException, Query
from schemas.question_cards import QuestionCard, QuestionCardAnswerCreate, QuestionCardAnswerResponse
from typing import List, Optional
import random
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from database.session import get_async_db
from models.user import Tenant
from utils.token import get_current_user
from models.question_card import QuestionCardAnswer

router = APIRouter()
logger = logging.getLogger(__name__)

# Predefined "Deep Persona" Question Cards Pool
STATIC_CARDS = [
    {"text": "What is the most significant change you've made in your life recently?", "category": "Growth", "color": "#FF6B6B", "tags": ["growth", "change"]},
    {"text": "If you could have a conversation with your younger self, what would be the single most important lesson?", "category": "Self", "color": "#4ECDC4", "tags": ["self", "reflection"]},
    {"text": "What is a value you hold that you will never compromise on, even under pressure?", "category": "Values", "color": "#FFE66D", "tags": ["values", "integrity"]},
    {"text": "Who in your life brings out the best in you, and how do they do it?", "category": "Social", "color": "#1A535C", "tags": ["friends", "relationship"]},
    {"text": "What does your ideal day of pure, guilt-free rest look like?", "category": "Lifestyle", "color": "#A259FF", "tags": ["rest", "lifestyle"]},
    {"text": "What is a skill or hobby you are currently trying to master, and what is your deepest 'why'?", "category": "Growth", "color": "#FF6B6B", "tags": ["learning"]},
    {"text": "Describe a moment in the last year when you felt truly, deeply at peace.", "category": "Self", "color": "#4ECDC4", "tags": ["peace", "emotion"]},
    {"text": "What is one fear you are actively working to overcome, and what does victory look like?", "category": "Growth", "color": "#FF6B6B", "tags": ["fear", "courage"]},
    {"text": "If you could live anywhere for a year with zero financial constraints, where would it be?", "category": "Dreams", "color": "#FFE66D", "tags": ["travel", "dreams"]},
    {"text": "What helps you truly recharge when your emotional battery is completely drained?", "category": "Lifestyle", "color": "#A259FF", "tags": ["energy", "self-care"]},
    {"text": "What is the kindest thing someone has done for you that you've never forgotten?", "category": "Social", "color": "#1A535C", "tags": ["kindness", "gratitude"]},
    {"text": "What is a book, movie, or song that fundamentally shifted your perspective on life?", "category": "Inspiration", "color": "#FF6B6B", "tags": ["art", "inspiration"]},
    {"text": "How do you define success at this exact stage of your life?", "category": "Values", "color": "#FFE66D", "tags": ["success", "definition"]},
    {"text": "What is a childhood memory that still makes you smile every time it surfaces?", "category": "Memory", "color": "#4ECDC4", "tags": ["childhood", "joy"]},
    {"text": "What is something you are profoundly grateful for today that isn't a material possession?", "category": "Self", "color": "#F7FFF7", "tags": ["gratitude"]},
    {"text": "What is a question you wish people would ask you more often?", "category": "Connection", "color": "#FFC107", "tags": ["dialogue"]},
    {"text": "What part of your personality has changed the most in the last 5 years?", "category": "Self", "color": "#4CAF50", "tags": ["evolution"]},
    {"text": "What is a project or idea you're currently keeping private but are deeply excited about?", "category": "Creativity", "color": "#E91E63", "tags": ["private-dreams"]},
    {"text": "If money was no object, what problem in the world would you dedicate your life to solving?", "category": "Purpose", "color": "#3F51B5", "tags": ["contribution"]},
    {"text": "What is the most courageous thing you have ever done?", "category": "Growth", "color": "#FF5722", "tags": ["bravery"]},
    {"text": "What quality do you admire most in your closest friend?", "category": "Social", "color": "#009688", "tags": ["friendship"]},
    {"text": "In what way are you currently standing in your own way?", "category": "Honesty", "color": "#607D8B", "tags": ["shadow-work"]},
    {"text": "What does 'home' truly mean to you?", "category": "Emotion", "color": "#795548", "tags": ["belonging"]},
    {"text": "What is a lesson you learned through a difficult ending or failure?", "category": "Growth", "color": "#FF5722", "tags": ["wisdom"]},
    {"text": "If you had an extra hour every day, what would you spend it on?", "category": "Lifestyle", "color": "#2196F3", "tags": ["time"]},
    {"text": "What makes you feel most alive?", "category": "Vitality", "color": "#FF9800", "tags": ["passion"]},
    {"text": "What is a belief you used to hold strongly but have since let go of?", "category": "Self", "color": "#9C27B0", "tags": ["unlearning"]},
    {"text": "How would you like to be remembered?", "category": "Legacy", "color": "#00BFA5", "tags": ["legacy"]},
    {"text": "What is your favorite way to spend time alone?", "category": "Self", "color": "#673AB7", "tags": ["solitude"]},
    {"text": "What is a small, unexpected discovery you made recently?", "category": "Curiosity", "color": "#CDDC39", "tags": ["wonder"]}
]

@router.get("/cards/", tags=["Question Cards"], response_model=List[QuestionCard])
async def generate_cards(
    count: int = Query(15, description="Number of cards to return"),
    current_user: Tenant = Depends(get_current_user)
):
    """Retrieve random 'Deep Persona' cards for introspection."""
    try:
        sample_size = min(count, len(STATIC_CARDS))
        if sample_size == 0:
            return [QuestionCard(text="The deck is currently empty. Please check back soon.", category="System", color="#555555")]
        
        selected_data = random.sample(STATIC_CARDS, sample_size)
        logger.info(f"Returning {len(selected_data)} cards for user {current_user.id}")
        return [QuestionCard(**c) for c in selected_data]
    except Exception as e:
        logger.exception(f"CRITICAL: Error in generate_cards: {str(e)}")
        # Return a "Diagnostic Card" so we can see the error in the UI!
        return [QuestionCard(
            text=f"System Error: {str(e)}", 
            category="Error", 
            color="#FF0000",
            tags=["fix-needed"]
        )]



@router.post("/answers/", tags=["Question Cards"], response_model=QuestionCardAnswerResponse)
async def save_answer(
    payload: dict,
    current_user: Tenant = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """Save a user's answer/reflection to a specific question card."""
    try:
        user_uuid = str(current_user.id)
        
        # Support both card_content (schema) and question_id (legacy/frontend mismatch)
        content = payload.get("card_content") or payload.get("question_id")
        answer_text = payload.get("answer")
            
        if not content:
            raise ValueError("Card content (question_id) is missing")
        if not answer_text:
            raise ValueError("Answer is missing")

        answer_obj = QuestionCardAnswer(
            tenant_id=user_uuid,
            card_content=content,
            answer=answer_text
        )
        db.add(answer_obj)
        await db.commit()
        await db.refresh(answer_obj)
        logger.info(f"Saved reflection for user {user_uuid}")
        return answer_obj
    except Exception as e:
        logger.exception(f"CRITICAL: Error saving answer: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/answers/", tags=["Question Cards"], response_model=List[QuestionCardAnswerResponse])
async def get_answers(
    current_user: Tenant = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """Get history of the user's answered cards."""
    try:
        user_uuid = str(current_user.id)
        result = await db.execute(
            select(QuestionCardAnswer)
            .where(QuestionCardAnswer.tenant_id == user_uuid)
            .order_by(desc(QuestionCardAnswer.created_at))
        )
        return result.scalars().all()
    except Exception as e:
        logger.exception(f"CRITICAL: Error fetching answers: {e}")
        raise HTTPException(500, detail=str(e))



