import asyncio
import uuid
import json
from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Import models
import sys
import os
sys.path.append(os.getcwd())
from models.user import (
    Tenant, PersonalInfo, BigFiveTraits, MBTITraits, Psychology,
    InterestsAndHobbies, ValuesBeliefsAndGoals, Favorites,
    RelationshipPreferences, Lifestyle, KeyMemories
)
from utils.settings import DATABASE_URL

# Async engine
ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
engine = create_async_engine(ASYNC_DATABASE_URL, future=True)
async_session = sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)

SARAH_ID = "3f18c1ea-622f-487e-94ab-6cc9fcf89383"
MARCUS_ID = "526baa3c-890d-474e-8fb1-cf8f87dce36d"

async def populate_profiles():
    async with async_session() as session:
        # Sarah Miller - High Openness, Artistic, Anxious Attachment (Deep)
        sarah_data = {
            "personal": {"age": 28, "occupation": "Digital Artist & Travel Writer", "location": "Paris, France", "gender": "Female"},
            "big5": {"openness": 0.9, "conscientiousness": 0.6, "extraversion": 0.5, "agreeableness": 0.8, "neuroticism": 0.7},
            "mbti": {"introversion": 0.7, "extraversion": 0.3, "agreeableness": 0.8, "neuroticism": 0.6},
            "psychology": {
                "communication_style": "Poetic, indirect, empathetic",
                "conflict_resolution_style": "Avoidant initially, then deeply reflective",
                "attachment_style": "Anxious-Preoccupied",
                "stress_tolerance": "Moderate - finds solace in art",
                "secure": 0.4, "anxious": 0.8, "avoidant": 0.2
            },
            "interests": {
                "interests": ["Surrealism", "Sustainable Travel", "Deep Psychology", "Indie Cinema"],
                "hobbies": ["Digital Painting", "Journaling in Cafes", "Late night walks in Montmartre"]
            },
            "values": {
                "values": ["Authenticity", "Creative Freedom", "Emotional Depth"],
                "personal_goals": ["To publish a visual-first travel memoir", "To find a soul-deep connection"],
                "professional_goals": ["Lead an exhibition on AI and Human Connection"]
            },
            "preferences": {
                "seeking": "A deep, intellectually stimulating romantic connection",
                "looking_for": ["Empathy", "Consistency", "Shared creative vision"],
                "deal_breakers": ["Surface-level small talk", "Emotional unavailability", "Strict conventionality"]
            }
        }

        # Marcus Chen - Steady, Observant, Secure, Foodie (Deep)
        marcus_data = {
            "personal": {"age": 32, "occupation": "Travel Photographer & Food Blogger", "location": "Sao Paulo, BR", "gender": "Male"},
            "big5": {"openness": 0.8, "conscientiousness": 0.8, "extraversion": 0.7, "agreeableness": 0.9, "neuroticism": 0.3},
            "mbti": {"introversion": 0.4, "extraversion": 0.6, "agreeableness": 0.9, "neuroticism": 0.2},
            "psychology": {
                "communication_style": "Direct but warm, observant",
                "conflict_resolution_style": "Calm, solution-oriented",
                "attachment_style": "Secure",
                "stress_tolerance": "High - stays grounded in sensory experiences",
                "secure": 0.9, "anxious": 0.1, "avoidant": 0.1
            },
            "interests": {
                "interests": ["Gastronomy", "Architecture", "Street Photography", "Cultural History"],
                "hobbies": ["Cooking exotic cuisines", "Exploring local markets", "Analog photography"]
            },
            "values": {
                "values": ["Presence", "Quality", "Intercultural Understanding"],
                "personal_goals": ["To build a home where people feel welcomed", "To capture a 100-country photo series"],
                "professional_goals": ["Global recognized food-travel documentary series"]
            },
            "preferences": {
                "seeking": "A partner to explore the world's flavors and depths with",
                "looking_for": ["Curiosity", "Warmth", "Appreciation for the little things"],
                "deal_breakers": ["Dishonesty", "Lack of curiosity", "Extreme negativity"]
            }
        }

        for user_id, data in [(SARAH_ID, sarah_data), (MARCUS_ID, marcus_data)]:
            # 1. Personal Info
            res = await session.execute(select(PersonalInfo).where(PersonalInfo.tenant == user_id))
            p = res.scalars().first()
            if p:
                p.occupation = data["personal"]["occupation"]
                p.location = data["personal"]["location"]
                p.gender = data["personal"]["gender"]
            
            # 2. Big Five
            res = await session.execute(select(BigFiveTraits).where(BigFiveTraits.tenant == user_id))
            bf = res.scalars().first()
            if not bf:
                bf = BigFiveTraits(tenant=user_id, **data["big5"])
                session.add(bf)
            else:
                for k, v in data["big5"].items(): setattr(bf, k, v)

            # 3. Psychology
            res = await session.execute(select(Psychology).where(Psychology.tenant == user_id))
            psy = res.scalars().first()
            if not psy:
                psy = Psychology(tenant=user_id, **data["psychology"])
                session.add(psy)
            else:
                for k, v in data["psychology"].items(): setattr(psy, k, v)

            # 4. Interests
            res = await session.execute(select(InterestsAndHobbies).where(InterestsAndHobbies.tenant == user_id))
            ih = res.scalars().first()
            if not ih:
                ih = InterestsAndHobbies(tenant=user_id, **data["interests"])
                session.add(ih)
            else:
                for k, v in data["interests"].items(): setattr(ih, k, v)

            # 5. Values
            res = await session.execute(select(ValuesBeliefsAndGoals).where(ValuesBeliefsAndGoals.tenant == user_id))
            vbg = res.scalars().first()
            if not vbg:
                vbg = ValuesBeliefsAndGoals(tenant=user_id, **data["values"])
                session.add(vbg)
            else:
                for k, v in data["values"].items(): setattr(vbg, k, v)

            # 6. Preferences
            res = await session.execute(select(RelationshipPreferences).where(RelationshipPreferences.tenant == user_id))
            rp = res.scalars().first()
            if not rp:
                rp = RelationshipPreferences(tenant=user_id, **data["preferences"])
                session.add(rp)
            else:
                for k, v in data["preferences"].items(): setattr(rp, k, v)

        await session.commit()
        print("Sarah and Marcus profiles updated with deep data.")

if __name__ == "__main__":
    asyncio.run(populate_profiles())
