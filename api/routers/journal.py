from fastapi import APIRouter, Depends, HTTPException, status
from utils.token import get_current_user
from models.user import Tenant
from database.session import get_db, Session
from models.journal import Journal
from typing import List
from schemas.journal import JournalCreate, JournalResponse


router = APIRouter(prefix="", tags=["Journal"])


@router.get("/", response_model=List[JournalResponse])
def get_journals(current_user: Tenant = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all journal entries for the current user"""
    journals = db.query(Journal).filter(Journal.tenant == current_user.id).all()
    return journals


@router.get("/{id}", response_model=JournalResponse)
def get_journal_by_id(id: str, current_user: Tenant = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get a specific journal entry by ID for the current user"""
    journal = db.query(Journal).filter(Journal.id == id, Journal.tenant == current_user.id).first()
    if not journal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Journal not found")
    return journal


@router.post("/", response_model=JournalResponse)
def create_journal(journal: JournalCreate, current_user: Tenant = Depends(get_current_user), db: Session = Depends(get_db)):
    """Create a new journal entry for the current user"""
    # Create journal with tenant ID from the authenticated user and data from request
    new_journal = Journal(tenant=current_user.id, **journal.model_dump())
    
    # Add to database and commit
    db.add(new_journal)
    db.commit()
    db.refresh(new_journal)
    return new_journal


@router.put("/{id}", response_model=JournalResponse)
def update_journal(id: str, journal: JournalCreate, current_user: Tenant = Depends(get_current_user), db: Session = Depends(get_db)):
    journal = db.query(Journal).filter(Journal.id == id,Journal.tenant == current_user.id).first()
    if not journal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Journal not found")
    for k, v in journal.model_dump().items(): setattr(journal, k, v)
    db.commit(); db.refresh(journal)
    return journal


@router.post("/{id}/moodscape")
async def generate_moodscape(id: str, current_user: Tenant = Depends(get_current_user), db: Session = Depends(get_db)):
    """Generate a visual 'Moodscape' using NVIDIA for reasoning and HF for art."""
    journal = db.query(Journal).filter(Journal.id == id, Journal.tenant == current_user.id).first()
    if not journal:
        raise HTTPException(status_code=404, detail="Journal not found")
        
    from services.ai_service import AIService
    from services.image_service import ImageService
    
    ai = AIService()
    image_svc = ImageService()
    
    # 1. Generate an artistic prompt using NVIDIA/Lumi logic
    system_prompt = "You are a visual artist for Elinity AI. Transform the following journal entry into a cinematic, abstract, and highly detailed image generation prompt. Focus on emotion, lighting, and texture. Return ONLY the prompt text. No quotes."
    user_content = f"Title: {journal.title}\nContent: {journal.content}"
    
    mood_prompt = await ai.chat(system_prompt, user_content)
    
    # 2. Generate the actual image using Flux via Hugging Face
    image_bytes = await image_svc.generate_image(mood_prompt)
    
    if image_bytes:
        # Save locally (until cloud bucket is configured)
        filename = f"mood_{id}.png"
        local_path = image_svc.save_to_local(image_bytes, filename)
        
        # Link to journal (using static URL)
        # Assuming the app serves /static
        journal.media = f"/static/moodscapes/{filename}"
        db.commit()
        db.refresh(journal)
        
        return {
            "moodscape_prompt": mood_prompt,
            "image_url": journal.media
        }
    
    return {"moodscape_prompt": mood_prompt, "error": "Image generation failed"}


@router.delete("/{id}")
def delete_journal(id: str, current_user: Tenant = Depends(get_current_user), db: Session = Depends(get_db)):
    journal = db.query(Journal).filter(Journal.id == id,Journal.tenant == current_user.id).first()
    if not journal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Journal not found")
    db.delete(journal)
    db.commit()
    return {"message": "Journal deleted successfully"}
