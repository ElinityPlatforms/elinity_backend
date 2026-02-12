from database.session import Session
from models.social import SocialPost
from models.user import Tenant
import uuid

def test_create():
    db = Session()
    try:
        user = db.query(Tenant).first()
        if not user:
            print("No user found")
            return
        
        print(f"Using user: {user.email} ({user.id})")
        
        new_post = SocialPost(
            author_id=user.id,
            content="Test post from script",
            media_urls=[],
            likes=[],
            comments=[]
        )
        db.add(new_post)
        db.commit()
        db.refresh(new_post)
        print(f"Successfully created post: {new_post.id}")
    except Exception as e:
        print(f"Error creating post: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    test_create()
