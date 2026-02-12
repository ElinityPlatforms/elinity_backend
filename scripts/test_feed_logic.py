import sys
import os
from sqlalchemy.orm import Session

# Add parent directory to path to import models and database
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.session import Session
from models.social import SocialPost
from models.user import Tenant, PersonalInfo, ProfilePicture

def test_feed_logic():
    db = Session()
    try:
        posts = db.query(SocialPost).order_by(SocialPost.created_at.desc()).limit(50).all()
        print(f"Found {len(posts)} posts")
        
        results = []
        for i, post in enumerate(posts):
            try:
                print(f"[{i}] Processing post {post.id} by {post.author_id}")
                # Fetch user info
                user_info = db.query(PersonalInfo).filter(PersonalInfo.tenant == post.author_id).first()
                user_pic = db.query(ProfilePicture).filter(ProfilePicture.tenant == post.author_id).first()
                
                print(f"[{i}] user_info found: {user_info is not None}")
                if user_info:
                    print(f"[{i}] first_name: {user_info.first_name}, last_name: {user_info.last_name}")
                
                full_name = f"{user_info.first_name} {user_info.last_name}".strip() if user_info and user_info.first_name else "Unknown User"
                print(f"[{i}] Full name decided: {full_name}")
                
                avatar = user_pic.url if user_pic and user_pic.url else f"https://ui-avatars.com/api/?name={full_name}&background=random"
                print(f"[{i}] Avatar decided: {avatar}")
                
                # Convert to response dict
                post_data = {
                    "id": post.id,
                    "author_id": post.author_id,
                    "content": post.content,
                    "media_urls": post.media_urls if post.media_urls is not None else [],
                    "likes": post.likes if post.likes is not None else [],
                    "comments": post.comments if post.comments is not None else [],
                    "created_at": post.created_at,
                    "user": {
                        "id": post.author_id,
                        "full_name": full_name,
                        "avatar": avatar
                    }
                }
                results.append(post_data)
                print(f"[{i}] Successfully added to results")
            except Exception as inner_e:
                print(f"[{i}] FAILED processing post: {inner_e}")
                traceback.print_exc()
            
        print(f"Total results: {len(results)}")
        return results
    except Exception as e:
        print(f"ERROR in feed logic: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_feed_logic()
