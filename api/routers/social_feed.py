from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
import traceback
import datetime
import uuid

from database.session import get_db
from models.user import Tenant, PersonalInfo, ProfilePicture
from models.social import SocialPost, SocialInteraction
from schemas.social import SocialPostCreate, SocialPostResponse
from sqlalchemy.orm.attributes import flag_modified
from utils.token import get_current_user

router = APIRouter(tags=["Social Feed"])

@router.get("/", response_model=List[SocialPostResponse])
async def get_feed(db: Session = Depends(get_db), current_user: Tenant = Depends(get_current_user)):
    """Get social feed. Currently returns all posts (Public Feed MVP)."""
    try:
        posts = db.query(SocialPost).order_by(SocialPost.created_at.desc()).limit(50).all()
        
        results = []
        for post in posts:
            author_id_str = str(post.author_id)
            # Fetch user info
            user_info = db.query(PersonalInfo).filter(PersonalInfo.tenant == author_id_str).first()
            user_pic = db.query(ProfilePicture).filter(ProfilePicture.tenant == author_id_str).first()
            
            full_name = f"{user_info.first_name} {user_info.last_name}".strip() if user_info and user_info.first_name else "Unknown User"
            avatar = user_pic.url if user_pic and user_pic.url else f"https://ui-avatars.com/api/?name={full_name}&background=random"
            
            # Convert to response dict
            post_data = {
                "id": str(post.id),
                "author_id": author_id_str,
                "content": post.content,
                "media_urls": post.media_urls if post.media_urls is not None else [],
                "likes": post.likes if post.likes is not None else [],
                "comments": post.comments if post.comments is not None else [],
                "created_at": post.created_at,
                "user": {
                    "id": author_id_str,
                    "full_name": full_name,
                    "avatar": avatar
                }
            }
            results.append(post_data)
            
        return results
    except Exception as e:
        print(f"CRITICAL ERROR in get_feed: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Feed error: {str(e)}")

@router.post("/", response_model=SocialPostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(post: SocialPostCreate, db: Session = Depends(get_db), current_user: Tenant = Depends(get_current_user)):
    """Create a new social post."""
    try:
        # Ensure likes/comments are initialized
        db_post = SocialPost(
            author_id=current_user.id,
            content=post.content,
            media_urls=post.media_urls if post.media_urls is not None else [],
            likes=[],
            comments=[]
        )
        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        
        # Fetch author info for response
        user_info = db.query(PersonalInfo).filter(PersonalInfo.tenant == current_user.id).first()
        user_pic = db.query(ProfilePicture).filter(ProfilePicture.tenant == current_user.id).first()
        
        full_name = f"{user_info.first_name} {user_info.last_name}".strip() if user_info and user_info.first_name else "You"
        avatar = user_pic.url if user_pic and user_pic.url else f"https://ui-avatars.com/api/?name={full_name}&background=random"
        
        return {
            "id": str(db_post.id),
            "author_id": str(db_post.author_id),
            "content": db_post.content,
            "media_urls": db_post.media_urls or [],
            "likes": db_post.likes or [],
            "comments": db_post.comments or [],
            "created_at": db_post.created_at,
            "user": {
                "id": str(db_post.author_id),
                "full_name": full_name,
                "avatar": avatar
            }
        }
    except Exception as e:
        print(f"ERROR creating post: {str(e)}")
        traceback.print_exc()
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

from models.notifications import Notification

@router.get("/{post_id}", response_model=SocialPostResponse)
async def get_post(post_id: str, db: Session = Depends(get_db), current_user: Tenant = Depends(get_current_user)):
    """Get a single post with author details and enriched comments."""
    post = db.query(SocialPost).filter(SocialPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Fetch post author info
    user_info = db.query(PersonalInfo).filter(PersonalInfo.tenant == post.author_id).first()
    user_pic = db.query(ProfilePicture).filter(ProfilePicture.tenant == post.author_id).first()
    
    full_name = f"{user_info.first_name} {user_info.last_name}".strip() if user_info and user_info.first_name else "Unknown User"
    avatar = user_pic.url if user_pic and user_pic.url else f"https://ui-avatars.com/api/?name={full_name}&background=random"
    
    # Enrich comments with user info
    enriched_comments = []
    for comment in (post.comments or []):
        c_user_id = comment.get("user_id")
        c_user_info = db.query(PersonalInfo).filter(PersonalInfo.tenant == c_user_id).first()
        c_user_pic = db.query(ProfilePicture).filter(ProfilePicture.tenant == c_user_id).first()
        
        c_name = f"{c_user_info.first_name} {c_user_info.last_name}".strip() if c_user_info else "Unknown"
        c_avatar = c_user_pic.url if c_user_pic else f"https://ui-avatars.com/api/?name={c_name}&background=random"
        
        enriched_comments.append({
            **comment,
            "user": {
                "id": c_user_id,
                "full_name": c_name,
                "avatar": c_avatar
            }
        })

    return {
        "id": post.id,
        "author_id": post.author_id,
        "content": post.content,
        "media_urls": post.media_urls if post.media_urls is not None else [],
        "likes": post.likes if post.likes is not None else [],
        "comments": enriched_comments,
        "created_at": post.created_at,
        "user": {
            "id": post.author_id,
            "full_name": full_name,
            "avatar": avatar
        }
    }

@router.post("/{post_id}/comment", response_model=SocialPostResponse)
async def create_comment(post_id: str, payload: dict, db: Session = Depends(get_db), current_user: Tenant = Depends(get_current_user)):
    """Add a comment to a post and notify the author."""
    content = payload.get("content")
    if not content:
        raise HTTPException(status_code=400, detail="Content is required")

    post = db.query(SocialPost).filter(SocialPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    import datetime, uuid
    new_comment = {
        "id": str(uuid.uuid4()),
        "user_id": current_user.id,
        "content": content,
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "parent_id": payload.get("parent_id") # Optional: ID of the comment being replied to
    }
    
    current_comments = list(post.comments) if post.comments else []
    current_comments.append(new_comment)
    post.comments = current_comments
    flag_modified(post, "comments")
    
    # Notification Logic
    try:
        user_info = db.query(PersonalInfo).filter(PersonalInfo.tenant == current_user.id).first()
        name = f"{user_info.first_name} {user_info.last_name}" if user_info else "Someone"
        
        target_user_id = None
        notif_title = "New Comment"
        notif_msg = f"{name} commented on your post: \"{content[:30]}...\""

        parent_id = new_comment.get("parent_id")
        if parent_id:
            # It's a reply to a specific comment
            parent_comment = next((c for c in current_comments if c.get("id") == parent_id), None)
            if parent_comment and parent_comment.get("user_id") != current_user.id:
                target_user_id = parent_comment.get("user_id")
                notif_title = "New Reply"
                notif_msg = f"{name} replied to your comment: \"{content[:30]}...\""
        elif post.author_id != current_user.id:
            # It's a main comment on a post
            target_user_id = post.author_id

        if target_user_id:
            notif = Notification(
                tenant=target_user_id,
                title=notif_title,
                message=notif_msg,
                type="social"
            )
            db.add(notif)
    except Exception as e:
        print(f"Notification error: {e}")

    db.commit()
    return await get_post(post_id, db, current_user)

@router.post("/{post_id}/like", response_model=SocialPostResponse)
async def like_post(post_id: str, db: Session = Depends(get_db), current_user: Tenant = Depends(get_current_user)):
    """Like a post and notify the author."""
    post = db.query(SocialPost).filter(SocialPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    likes = post.likes if post.likes is not None else []
    if current_user.id not in likes:
        new_likes = list(likes)
        new_likes.append(current_user.id)
        post.likes = new_likes
        flag_modified(post, "likes")
        
        interaction = SocialInteraction(
            user_id=current_user.id,
            target_id=post_id,
            target_type="post",
            interaction_type="like"
        )
        db.add(interaction)

        # Notify author
        if post.author_id != current_user.id:
            user_info = db.query(PersonalInfo).filter(PersonalInfo.tenant == current_user.id).first()
            name = f"{user_info.first_name} {user_info.last_name}" if user_info else "Someone"
            notif = Notification(
                tenant=post.author_id,
                title="Post Liked",
                message=f"{name} liked your post.",
                type="social"
            )
            db.add(notif)
            
        db.commit()
    
    return await get_post(post_id, db, current_user)
@router.post("/{post_id}/moodscape")
async def generate_post_moodscape(post_id: str, db: Session = Depends(get_db), current_user: Tenant = Depends(get_current_user)):
    """Generate a visual 'Perspective' art for a social post."""
    post = db.query(SocialPost).filter(SocialPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    from services.ai_service import AIService
    from services.image_service import ImageService
    
    ai = AIService()
    image_svc = ImageService()
    
    # 1. Transform post content into a visual prompt
    system_prompt = "Transform the following social post into a cinematic, high-end, and abstract image generation prompt. Focus on the core theme and emotion. Return ONLY the prompt text, no quotes."
    mood_prompt = await ai.chat(system_prompt, post.content)
    
    # 2. Generate image
    image_bytes = await image_svc.generate_image(mood_prompt)
    
    if image_bytes:
        filename = f"feed_{post_id}.png"
        image_svc.save_to_local(image_bytes, filename)
        
        # Link to post (media_urls is a list in SocialPost)
        media_url = f"/static/moodscapes/{filename}"
        if post.media_urls is None:
            post.media_urls = []
        
        current_media = list(post.media_urls)
        current_media.append(media_url)
        post.media_urls = current_media
        flag_modified(post, "media_urls")
        
        db.commit()
        return {"moodscape_prompt": mood_prompt, "image_url": media_url}
        
    return {"error": "Generation failed"}
