from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: Optional[datetime] = None
    location: Optional[str] = None
    attendees: List[str] = [] # List of user IDs to invite initially

class EventResponse(EventCreate):
    id: str
    host_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class SocialPostCreate(BaseModel):
    content: Optional[str] = None
    media_urls: List[str] = []

class UserPostInfo(BaseModel):
    id: str
    full_name: str
    avatar: Optional[str] = None

class SocialPostResponse(BaseModel):
    id: str
    author_id: str
    content: Optional[str] = None
    media_urls: List[str] = []
    likes: List[str] = []
    comments: List[Dict[str, Any]] = []
    created_at: datetime
    user: Optional[UserPostInfo] = None

    class Config:
        from_attributes = True

class InteractionCreate(BaseModel):
    target_id: str
    target_type: str # 'post', 'event', 'user'
