from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class BlogCreateSchema(BaseModel):
    title: str
    content: str
    images: List[str] = []
    videos: List[str] = []
    tags: List[str] = []
    links: List[str] = []
    active: bool = True

class BlogSchema(BaseModel):
    id: str
    title: str
    content: str
    images: List[str]
    videos: List[str]
    tags: List[str]
    links: List[str]
    active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True