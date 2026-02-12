from fastapi import APIRouter, Depends, HTTPException
from models.blogs import Blog
from database.session import get_db, Session
from schemas.blogs import BlogSchema, BlogCreateSchema
from utils.token import get_current_user
from models.user import Tenant
from typing import List

router = APIRouter(tags=["blogs"])

async def verify_admin(user: Tenant):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

@router.get("/", response_model=List[BlogSchema])
def get_blogs(db: Session = Depends(get_db)):
    blogs = db.query(Blog).filter(Blog.active == True).all()
    return blogs

@router.post("/", response_model=BlogSchema)
async def create_blog(
    blog: BlogCreateSchema, 
    db: Session = Depends(get_db), 
    current_user: Tenant = Depends(get_current_user)
):
    await verify_admin(current_user)
    db_blog = Blog(**blog.model_dump())
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog