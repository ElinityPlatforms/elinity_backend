import sys
import os
from sqlalchemy.orm import Session
from datetime import datetime, timezone

# Add parent directory to path to import models and database
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.session import Session
from models.tools import Quiz

def seed_quizzes():
    db = Session()
    try:
        # Check if system quizzes already exist
        existing = db.query(Quiz).filter(Quiz.is_system == True).count()
        if existing > 0:
            print(f"Quizzes already seeded ({existing} found). Skipping.")
            return

        quizzes = [
            {
                "title": "Love Languages Assessment",
                "description": "Discover how you prefer to give and receive love and affection.",
                "is_system": True,
                "questions": [
                    {
                        "id": "ll_1",
                        "question": "What makes you feel most appreciated in a relationship?",
                        "type": "multiple_choice",
                        "options": [
                            "Meaningful words of encouragement",
                            "Simple acts of service/help",
                            "Unexpected gifts or tokens",
                            "Undivided attention and time",
                            "Physical touch and closeness"
                        ]
                    },
                    {
                        "id": "ll_2",
                        "question": "Rate how much you value quality time together:",
                        "type": "scale",
                        "min": 1,
                        "max": 5,
                        "min_label": "Not much",
                        "max_label": "Extremely"
                    },
                    {
                        "id": "ll_3",
                        "question": "Describe a perfect date night in your view:",
                        "type": "text"
                    }
                ]
            },
            {
                "title": "Attachment Style Quiz",
                "description": "Understand your emotional connection patterns in relationships.",
                "is_system": True,
                "questions": [
                    {
                        "id": "as_1",
                        "question": "When my partner needs space, I feel...",
                        "type": "multiple_choice",
                        "options": [
                            "Secure and respect their boundaries",
                            "Anxious that they are pulling away",
                            "Relieved to have my own time",
                            "Confused and unsure how to react"
                        ]
                    },
                    {
                        "id": "as_2",
                        "question": "I find it easy to depend on others.",
                        "type": "scale",
                        "min": 1,
                        "max": 5,
                        "min_label": "Disagree",
                        "max_label": "Agree"
                    }
                ]
            },
            {
                "title": "Communication Style Analyzer",
                "description": "Find out if you are an assertive, passive, or expressive communicator.",
                "is_system": True,
                "questions": [
                    {
                        "id": "cs_1",
                        "question": "In a disagreement, I usually...",
                        "type": "multiple_choice",
                        "options": [
                            "State my needs clearly and calmly",
                            "Avoid the topic to keep the peace",
                            "Get emotional and raise my voice",
                            "Use humor to deflect the tension"
                        ]
                    }
                ]
            }
        ]

        for q_data in quizzes:
            quiz = Quiz(**q_data)
            db.add(quiz)
        
        db.commit()
        print(f"Successfully seeded {len(quizzes)} system quizzes!")

    except Exception as e:
        print(f"Error seeding quizzes: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_quizzes()
