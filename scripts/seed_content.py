import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database.session import engine, Session
from models.tools import Quiz as QuizModel
from models.user import Tenant
from datetime import datetime, timezone
import uuid

def seed_content():
    db = Session()
    try:
        # Check for system user or just use first user
        system_user = db.query(Tenant).first()
        if not system_user:
            print("No users found to assign quizzes to.")
            return

        # 1. Seed Quizzes
        quizzes = [
            {
                "id": str(uuid.uuid4()),
                "title": "Love Language Assessment",
                "description": "Discover how you prefer to give and receive love.",
                "is_system": True,
                "questions": [
                    {"q": "What makes you feel most appreciated?", "options": ["Words", "Time", "Gifts", "Acts", "Touch"]}
                ]
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Attachment Style Quiz",
                "description": "Understand your emotional patterns in relationships.",
                "is_system": True,
                "questions": [
                    {"q": "How do you react to closeness?", "options": ["Embrace it", "Need space", "Feel anxious"]}
                ]
            }
        ]

        for q_data in quizzes:
            exists = db.query(QuizModel).filter(QuizModel.title == q_data["title"]).first()
            if not exists:
                quiz = QuizModel(
                    id=q_data["id"],
                    title=q_data["title"],
                    description=q_data["description"],
                    is_system=q_data["is_system"],
                    questions=q_data["questions"],
                    created_by=system_user.id
                )
                db.add(quiz)
                print(f"Added quiz: {q_data['title']}")

        db.commit()
        print("Seeding complete.")
    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_content()
