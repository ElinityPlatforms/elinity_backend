from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.user import (
    Tenant, PersonalInfo, BigFiveTraits, Psychology, 
    InterestsAndHobbies, ValuesBeliefsAndGoals, Favorites,
    RelationshipPreferences, FriendshipPreferences, CollaborationPreferences,
    Lifestyle, KeyMemories
)
from sqlalchemy.orm import selectinload

async def get_user_profile_summary(db: AsyncSession, user_id: str):
    """Fetches a high-level summary of the user's psychological and personal profile."""
    result = await db.execute(
        select(Tenant)
        .options(
            selectinload(Tenant.personal_info),
            selectinload(Tenant.big_five_traits),
            selectinload(Tenant.psychology),
            selectinload(Tenant.interests_and_hobbies),
            selectinload(Tenant.values_beliefs_and_goals)
        )
        .where(Tenant.id == user_id)
    )
    user = result.scalars().first()
    if not user: return "Guest Traveller"

    summary = []
    if user.personal_info:
        p = user.personal_info
        summary.append(f"Name: {p.first_name} {p.last_name}")
        summary.append(f"Occupation: {p.occupation}")
        summary.append(f"Location: {p.location}")
        summary.append(f"Gender: {p.gender}")
    
    if user.big_five_traits:
        t = user.big_five_traits
        summary.append(f"Big5: Openness={t.openness}, Conscientiousness={t.conscientiousness}, Extraversion={t.extraversion}, Agreeableness={t.agreeableness}, Neuroticism={t.neuroticism}")
    
    if user.psychology:
        psy = user.psychology
        summary.append(f"Attachment: {psy.attachment_style}")
        summary.append(f"Cognitive: {psy.cognitive_style}")
        summary.append(f"Stress Tolerance: {psy.stress_tolerance}")

    if user.interests_and_hobbies:
        summary.append(f"Interests: {user.interests_and_hobbies.interests}")
        summary.append(f"Hobbies: {user.interests_and_hobbies.hobbies}")

    # Check for missing critical info
    missing = []
    if not user.personal_info or not user.personal_info.first_name: missing.append("Basic Info")
    if not user.interests_and_hobbies or not user.interests_and_hobbies.interests: missing.append("Interests")
    if not user.big_five_traits: missing.append("Psychological Traits")
    
    if missing:
        summary.append(f"MISSING INFO: {', '.join(missing)}. Lumi should gently ask for these to complete the profile.")

    return " | ".join(summary) if summary else "Unknown Persona"

async def get_user_full_profile_data(db: AsyncSession, user_id: str):
    """Returns a dictionary containing every piece of data stored for the user profile."""
    result = await db.execute(
        select(Tenant)
        .options(
            selectinload(Tenant.personal_info),
            selectinload(Tenant.big_five_traits),
            selectinload(Tenant.mbti_traits),
            selectinload(Tenant.psychology),
            selectinload(Tenant.interests_and_hobbies),
            selectinload(Tenant.values_beliefs_and_goals),
            selectinload(Tenant.favorites),
            selectinload(Tenant.relationship_preferences),
            selectinload(Tenant.friendship_preferences),
            selectinload(Tenant.collaboration_preferences),
            selectinload(Tenant.lifestyle),
            selectinload(Tenant.key_memories)
        )
        .where(Tenant.id == user_id)
    )
    user = result.scalars().first()
    if not user: return {}

    def to_dict(obj):
        if not obj: return {}
        return {c.name: getattr(obj, c.name) for c in obj.__table__.columns if c.name not in ['id', 'tenant']}

    return {
        "account": {"email": user.email, "phone": user.phone, "created_at": str(user.created_at)},
        "personal_info": to_dict(user.personal_info),
        "big_five": to_dict(user.big_five_traits),
        "mbti": to_dict(user.mbti_traits),
        "psychology": to_dict(user.psychology),
        "interests": to_dict(user.interests_and_hobbies),
        "values_goals": to_dict(user.values_beliefs_and_goals),
        "favorites": to_dict(user.favorites),
        "preferences": {
            "romantic": to_dict(user.relationship_preferences),
            "friendship": to_dict(user.friendship_preferences),
            "collaboration": to_dict(user.collaboration_preferences)
        },
        "lifestyle": to_dict(user.lifestyle),
        "memories": to_dict(user.key_memories)
    }
