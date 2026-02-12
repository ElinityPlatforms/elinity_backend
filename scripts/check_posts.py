import sys
import os
from sqlalchemy.orm import Session

# Add parent directory to path to import models and database
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.session import Session
from models.social import SocialPost

def check_posts():
    db = Session()
    try:
        count = db.query(SocialPost).count()
        print(f"Total social posts: {count}")
        
        posts = db.query(SocialPost).all()
        for p in posts:
            print(f"Post ID: {p.id}")
            print(f"  Likes type: {type(p.likes)}, content: {p.likes}")
            print(f"  Comments type: {type(p.comments)}, content: {p.comments}")
            
    except Exception as e:
        print(f"Error checking posts: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_posts()
