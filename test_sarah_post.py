from database.session import Session
from models.user import Tenant, PersonalInfo, ProfilePicture
from models.social import SocialPost
from schemas.social import SocialPostCreate, SocialPostResponse
import uuid

def test_sarah_post():
    db = Session()
    try:
        user = db.query(Tenant).filter(Tenant.email == "sarah.miller@elinity.com").first()
        if not user:
            print("Sarah not found")
            return
        
        print(f"Test for Sarah: {user.id}")
        
        # Simulate create_post logic
        content = "Today I spent 20 minutes in the Sanctuary module..."
        db_post = SocialPost(
            author_id=user.id,
            content=content,
            media_urls=[],
            likes=[],
            comments=[]
        )
        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        print(f"Post created: {db_post.id}")
        
        # Test serialization
        user_info = db.query(PersonalInfo).filter(PersonalInfo.tenant == user.id).first()
        user_pic = db.query(ProfilePicture).filter(ProfilePicture.tenant == user.id).first()
        
        full_name = f"{user_info.first_name} {user_info.last_name}".strip() if user_info else "You"
        avatar = user_pic.url if user_pic else f"https://ui-avatars.com/api/?name={full_name}&background=random"
        
        resp_data = {
            "id": db_post.id,
            "author_id": db_post.author_id,
            "content": db_post.content,
            "media_urls": db_post.media_urls,
            "likes": db_post.likes,
            "comments": db_post.comments,
            "created_at": db_post.created_at,
            "user": {
                "id": db_post.author_id,
                "full_name": full_name,
                "avatar": avatar
            }
        }
        
        validated = SocialPostResponse(**resp_data)
        print("Serialization success!")
        print(validated.model_dump())
        
    except Exception as e:
        print(f"Failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_sarah_post()
