import sys
import os

# Add current directory to path so we can import local modules
sys.path.append(os.getcwd())

from sqlalchemy import text
from database.session import Session, engine, Base
from models.user import (
    Tenant, PersonalInfo, BigFiveTraits, MBTITraits, Psychology, 
    InterestsAndHobbies, ValuesBeliefsAndGoals, Favorites, 
    RelationshipPreferences, FriendshipPreferences, CollaborationPreferences,
    PersonalFreeForm, Intentions, AspirationAndReflections, IdealCharacteristics,
    Lifestyle, KeyMemories
)
from models.connection import Connection
from models.chat import Chat, Group, GroupMember
from models.notifications import Notification
from utils.token import get_password_hash

def clear_database():
    print("Clearing database...")
    # Import all models to ensure they are registered with Base metadata
    from models import user, connection, chat, notifications, tools, social, lifebook, activity, blogs, credits, evaluation, game_session, platform, question_card, service_key
    
    # Simple way to drop and recreate all tables
    Base.metadata.drop_all(bind=engine)
    print("All tables dropped.")
    Base.metadata.create_all(bind=engine)
    print("All tables recreated.")

def seed_data():
    print("Seeding sample data...")
    db = Session()
    
    # Comprehensive user profiles
    users_to_create = [
        {
            "email": "sarah.miller@elinity.com",
            "password": "password123",
            "first_name": "Sarah",
            "middle_name": "Elizabeth",
            "last_name": "Miller",
            "age": 28,
            "gender": "Female",
            "sexual_orientation": "Heterosexual",
            "location": "New York, NY",
            "occupation": "Creative Director",
            "education": "Master's in Fine Arts",
            "relationship_status": "Single",
            "profile_pic": "https://i.pravatar.cc/300?img=47",
            "interests": ["Digital Art", "Hiking", "Jazz Music", "Philosophy", "Photography"],
            "hobbies": ["Stargazing", "Pottery", "Vintage Film Photography", "Urban Sketching"],
            "values": ["Authenticity", "Creativity", "Empathy", "Growth"],
            "beliefs": "Art is the bridge between the conscious and unconscious mind.",
            "personal_goals": ["Complete a solo art exhibition", "Hike the Appalachian Trail", "Learn jazz piano"],
            "professional_goals": ["Launch my own creative studio", "Mentor emerging artists"],
            "aspirations": ["Create art that moves people to tears", "Build a community of conscious creators"],
            "quotes": ["The only way out is through.", "Art washes away from the soul the dust of everyday life."],
            "movies": ["Eternal Sunshine of the Spotless Mind", "Before Sunrise", "Her"],
            "music": ["Norah Jones", "Bon Iver", "Miles Davis", "Sufjan Stevens"],
            "books": ["The Artist's Way", "Man's Search for Meaning", "The Alchemist"],
            "places": ["Santorini", "Kyoto Gardens", "MoMA NYC"],
            "bucket_list": ["See the Northern Lights", "Attend Burning Man", "Learn Italian"],
            "life_goals": ["Live authentically", "Create meaningful connections", "Leave a creative legacy"],
            "greatest_fears": ["Losing my creative spark", "Living an unlived life"],
            "seeking": "A partner who values depth, creativity, and emotional intelligence",
            "looking_for": ["Emotional Intelligence", "Artistic Soul", "Adventurous Spirit"],
            "deal_breakers": ["Closed-mindedness", "Emotional unavailability"],
            "what_i_offer": ["Deep empathy", "Creative inspiration", "Unwavering support"],
            "what_i_want": ["Intellectual stimulation", "Emotional depth", "Shared adventures"],
            "ideal_day": "Wake at sunrise, morning meditation, creative work in my studio, afternoon walk in Central Park, evening jazz club with close friends.",
            "bio": "Creative soul seeking deep conversations and artistic inspiration. I believe in living authentically and creating beauty in everyday moments."
        },
        {
            "email": "marcus.chen@elinity.com",
            "password": "password123",
            "first_name": "Marcus",
            "middle_name": "Wei",
            "last_name": "Chen",
            "age": 32,
            "gender": "Male",
            "sexual_orientation": "Heterosexual",
            "location": "San Francisco, CA",
            "occupation": "AI Research Scientist",
            "education": "PhD in Computer Science",
            "relationship_status": "Single",
            "profile_pic": "https://i.pravatar.cc/300?img=12",
            "interests": ["Artificial Intelligence", "Sci-Fi Literature", "Strategy Games", "Mixology", "Philosophy of Mind"],
            "hobbies": ["Synthesizer Music Production", "Competitive Chess", "Bonsai Cultivation", "Craft Cocktails"],
            "values": ["Intellectual Honesty", "Innovation", "Mindfulness", "Excellence"],
            "beliefs": "Technology should amplify human potential, not replace human connection.",
            "personal_goals": ["Master Go strategy", "Build a synthesizer from scratch", "Read 100 classic novels"],
            "professional_goals": ["Publish groundbreaking AI research", "Found an ethical AI company"],
            "aspirations": ["Contribute to beneficial AI development", "Bridge the gap between technology and humanity"],
            "quotes": ["Logic is the beginning of wisdom, not the end.", "The future is already here, it's just not evenly distributed."],
            "movies": ["Blade Runner 2049", "Ex Machina", "The Matrix", "Arrival"],
            "music": ["Daft Punk", "Radiohead", "Brian Eno", "Aphex Twin"],
            "books": ["Gödel, Escher, Bach", "Neuromancer", "Thinking, Fast and Slow", "The Singularity Is Near"],
            "places": ["Tokyo Tech District", "MIT Media Lab", "Iceland", "Burning Man"],
            "bucket_list": ["Attend a TED Talk", "Build an AI that composes music", "Visit every continent"],
            "life_goals": ["Advance human-AI collaboration", "Maintain work-life harmony", "Never stop learning"],
            "greatest_fears": ["Stagnation", "Creating technology that harms humanity"],
            "seeking": "An intellectually curious partner who challenges my worldview",
            "looking_for": ["Intellectual Depth", "Curiosity", "Independence", "Wit"],
            "deal_breakers": ["Anti-intellectualism", "Lack of ambition"],
            "what_i_offer": ["Stimulating conversation", "Loyalty", "Growth mindset"],
            "what_i_want": ["Mental stimulation", "Mutual respect", "Shared curiosity"],
            "ideal_day": "Morning run, deep work on AI research, lunch with brilliant colleagues, evening chess game, late-night music production session.",
            "bio": "AI researcher by day, synthesizer enthusiast by night. Logic is the beginning of wisdom, not the end. Looking for someone to challenge my worldview and explore the intersection of technology and humanity."
        }
    ]
    
    for user_data in users_to_create:
        password_hashed = get_password_hash(user_data["password"])
        tenant = Tenant(
            email=user_data["email"],
            password=password_hashed,
            role="user"
        )
        db.add(tenant)
        db.flush()
        
        # Profile Picture
        from models.user import ProfilePicture
        pic = ProfilePicture(
            tenant=tenant.id,
            url=user_data["profile_pic"]
        )
        db.add(pic)
        
        # 1. Personal Info
        pinfo = PersonalInfo(
            tenant=tenant.id,
            first_name=user_data["first_name"],
            middle_name=user_data.get("middle_name"),
            last_name=user_data["last_name"],
            age=user_data["age"],
            gender=user_data["gender"],
            sexual_orientation=user_data.get("sexual_orientation"),
            location=user_data["location"],
            occupation=user_data["occupation"],
            relationship_status=user_data["relationship_status"],
            education=user_data["education"]
        )
        db.add(pinfo)
        
        # 2. Interests and Hobbies
        ih = InterestsAndHobbies(
            tenant=tenant.id,
            interests=user_data["interests"],
            hobbies=user_data["hobbies"]
        )
        db.add(ih)
        
        # 3. Big Five Traits
        import random
        bf = BigFiveTraits(
            tenant=tenant.id,
            openness=0.85 if user_data["first_name"] == "Sarah" else 0.92,
            conscientiousness=0.78 if user_data["first_name"] == "Sarah" else 0.88,
            extraversion=0.65 if user_data["first_name"] == "Sarah" else 0.55,
            agreeableness=0.82 if user_data["first_name"] == "Sarah" else 0.70,
            neuroticism=0.35 if user_data["first_name"] == "Sarah" else 0.25
        )
        db.add(bf)

        # 4. MBTI Traits
        mbti = MBTITraits(
            tenant=tenant.id,
            introversion=0.45 if user_data["first_name"] == "Sarah" else 0.65,
            extraversion=0.55 if user_data["first_name"] == "Sarah" else 0.35,
            agreeableness=0.80 if user_data["first_name"] == "Sarah" else 0.68,
            neuroticism=0.30 if user_data["first_name"] == "Sarah" else 0.22
        )
        db.add(mbti)

        # 5. Psychology
        psych = Psychology(
            tenant=tenant.id,
            communication_style="Empathetic and expressive" if user_data["first_name"] == "Sarah" else "Analytical and direct",
            conflict_resolution_style="Collaborative" if user_data["first_name"] == "Sarah" else "Logical problem-solving",
            attachment_style="Secure",
            emotional_intelligence=0.90 if user_data["first_name"] == "Sarah" else 0.75,
            cognitive_style="Intuitive & Creative" if user_data["first_name"] == "Sarah" else "Analytical & Systematic",
            stress_tolerance="High",
            trusting=0.85,
            supportive=0.92,
            secure=0.88
        )
        db.add(psych)

        # 6. Values, Beliefs and Goals
        vbg = ValuesBeliefsAndGoals(
            tenant=tenant.id,
            values=user_data["values"],
            beliefs=user_data["beliefs"],
            personal_goals=user_data["personal_goals"],
            professional_goals=user_data["professional_goals"],
            aspirations=user_data["aspirations"]
        )
        db.add(vbg)

        # 7. Favorites
        favs = Favorites(
            tenant=tenant.id,
            quotes=user_data["quotes"],
            movies=user_data["movies"],
            music=user_data["music"],
            books=user_data["books"],
            places=user_data["places"]
        )
        db.add(favs)

        # 8. Relationship Preferences
        rel_prefs = RelationshipPreferences(
            tenant=tenant.id,
            seeking=user_data["seeking"],
            looking_for=user_data["looking_for"],
            deal_breakers=user_data["deal_breakers"],
            what_i_offer=user_data["what_i_offer"],
            what_i_want=user_data["what_i_want"]
        )
        db.add(rel_prefs)
        
        # 9. Friendship Preferences
        friend_prefs = FriendshipPreferences(
            tenant=tenant.id,
            seeking="Deep, authentic connections",
            goals="Build a community of like-minded individuals",
            ideal_traits=["Authenticity", "Curiosity", "Empathy"],
            activities=["Coffee conversations", "Art galleries", "Hiking"] if user_data["first_name"] == "Sarah" else ["Tech meetups", "Chess", "Music production"]
        )
        db.add(friend_prefs)
        
        # 10. Collaboration Preferences
        collab_prefs = CollaborationPreferences(
            tenant=tenant.id,
            seeking="Creative and innovative partners",
            areas_of_expertise=["Visual Design", "Brand Strategy"] if user_data["first_name"] == "Sarah" else ["AI/ML", "Software Architecture"],
            achievements=["Award-winning campaigns"] if user_data["first_name"] == "Sarah" else ["Published research papers"],
            ideal_collaborator_traits=["Creative", "Reliable", "Visionary"] if user_data["first_name"] == "Sarah" else ["Innovative", "Rigorous", "Ethical"],
            goals=["Launch creative projects"] if user_data["first_name"] == "Sarah" else ["Build ethical AI products"]
        )
        db.add(collab_prefs)

        # 11. Lifestyle
        life = Lifestyle(
            tenant=tenant.id,
            ideal_day=user_data["ideal_day"],
            lifestyle_rhythms="Creative mornings, social evenings" if user_data["first_name"] == "Sarah" else "Deep work mornings, experimental evenings"
        )
        db.add(life)

        # 12. Key Memories
        km = KeyMemories(
            tenant=tenant.id,
            special_dates=[{"date": "2024-06-15", "title": "First solo exhibition"}] if user_data["first_name"] == "Sarah" else [{"date": "2023-11-20", "title": "PhD defense"}],
            core_memories=["The moment I sold my first painting"] if user_data["first_name"] == "Sarah" else ["Building my first neural network"]
        )
        db.add(km)
        
        # 13. Aspiration and Reflections
        asp = AspirationAndReflections(
            tenant=tenant.id,
            bucket_list=user_data["bucket_list"],
            life_goals=user_data["life_goals"],
            greatest_fears=user_data["greatest_fears"]
        )
        db.add(asp)
        
        # 14. Ideal Characteristics
        ideal = IdealCharacteristics(
            tenant=tenant.id,
            passionate=0.90 if user_data["first_name"] == "Sarah" else 0.85,
            adventurous=0.80 if user_data["first_name"] == "Sarah" else 0.70,
            supportive=0.92 if user_data["first_name"] == "Sarah" else 0.78,
            funny=0.75 if user_data["first_name"] == "Sarah" else 0.68,
            reliable=0.85 if user_data["first_name"] == "Sarah" else 0.95,
            open_minded=0.95 if user_data["first_name"] == "Sarah" else 0.88,
            innovative=0.88 if user_data["first_name"] == "Sarah" else 0.98,
            dedicated=0.82 if user_data["first_name"] == "Sarah" else 0.92,
            ethical=0.90 if user_data["first_name"] == "Sarah" else 0.95
        )
        db.add(ideal)

        # 15. Intentions & Free Form
        db.add(Intentions(
            tenant=tenant.id, 
            romantic="Seeking a deep, authentic connection" if user_data["first_name"] == "Sarah" else "Looking for intellectual and emotional compatibility",
            social="Building meaningful friendships",
            professional="Collaborating on impactful projects"
        ))
        db.add(PersonalFreeForm(tenant=tenant.id, things_to_share=user_data["bio"]))
        
    db.commit()
    print("Seeding complete. Created 2 fully populated user profiles (Sarah Miller & Marcus Chen).")
    db.close()

if __name__ == "__main__":
    clear_database()
    seed_data()
    print("Ready to test.")
    print("-----------------------------------")
    print("Test Account 1:")
    print("Email: sarah.miller@elinity.com")
    print("Password: password123")
    print("-----------------------------------")
    print("Test Account 2:")
    print("Email: marcus.chen@elinity.com")
    print("Password: password123")
    print("-----------------------------------")
