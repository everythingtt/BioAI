from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Dict, List, Optional
from core.models import Character, BiologyProfile, NeuroState, ChemicalType
from core.engine import NeuroEngine
from core.auth import get_current_user, TokenData
from db.models import DBCharacter, SessionLocal
import uuid
import time
import json

router = APIRouter()

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/characters", response_model=Character)
async def create_character(
    name: str, 
    description: str, 
    background: str, 
    biology: Optional[BiologyProfile] = None,
    db: Session = Depends(get_db),
    current_user: TokenData = Depends(get_current_user)
):
    char_id = str(uuid.uuid4())
    
    if biology is None:
        biology = BiologyProfile()
        
    initial_state = NeuroState(last_updated=time.time())
    
    db_char = DBCharacter(
        id=char_id,
        owner_id=current_user.user_id,
        name=name,
        description=description,
        background=background,
        biology=biology.dict(),
        chemicals=initial_state.chemicals,
        last_updated=initial_state.last_updated,
        is_published=False
    )
    
    db.add(db_char)
    db.commit()
    db.refresh(db_char)
    
    return Character(
        id=db_char.id,
        owner_id=db_char.owner_id,
        name=db_char.name,
        description=db_char.description,
        background=db_char.background,
        biology=BiologyProfile(**db_char.biology),
        current_state=NeuroState(chemicals=db_char.chemicals, last_updated=db_char.last_updated),
        is_published=db_char.is_published
    )

@router.get("/characters/{char_id}", response_model=Character)
async def get_character(char_id: str, db: Session = Depends(get_db)):
    db_char = db.query(DBCharacter).filter(DBCharacter.id == char_id).first()
    if not db_char:
        raise HTTPException(status_code=404, detail="Character not found")
        
    biology = BiologyProfile(**db_char.biology)
    current_state = NeuroState(chemicals=db_char.chemicals, last_updated=db_char.last_updated)
    
    # Update state based on decay before returning
    updated_state = NeuroEngine.calculate_decay(current_state, biology)
    
    # Update DB with new state
    db_char.chemicals = updated_state.chemicals
    db_char.last_updated = updated_state.last_updated
    db.commit()
    
    return Character(
        id=db_char.id,
        owner_id=db_char.owner_id,
        name=db_char.name,
        description=db_char.description,
        background=db_char.background,
        biology=biology,
        current_state=updated_state,
        is_published=db_char.is_published
    )

@router.post("/characters/{char_id}/stimulate", response_model=NeuroState)
async def stimulate_character(char_id: str, impulse: Dict[ChemicalType, float], db: Session = Depends(get_db)):
    db_char = db.query(DBCharacter).filter(DBCharacter.id == char_id).first()
    if not db_char:
        raise HTTPException(status_code=404, detail="Character not found")
        
    biology = BiologyProfile(**db_char.biology)
    current_state = NeuroState(chemicals=db_char.chemicals, last_updated=db_char.last_updated)
    
    # Apply decay first, then stimulus
    updated_state = NeuroEngine.calculate_decay(current_state, biology)
    updated_state = NeuroEngine.process_stimulus(updated_state, biology, impulse)
    
    # Update DB
    db_char.chemicals = updated_state.chemicals
    db_char.last_updated = updated_state.last_updated
    db.commit()
    
    return updated_state

@router.get("/characters", response_model=List[Character])
async def list_characters(db: Session = Depends(get_db)):
    db_chars = db.query(DBCharacter).all()
    result = []
    for db_char in db_chars:
        result.append(Character(
            id=db_char.id,
            owner_id=db_char.owner_id,
            name=db_char.name,
            description=db_char.description,
            background=db_char.background,
            biology=BiologyProfile(**db_char.biology),
            current_state=NeuroState(chemicals=db_char.chemicals, last_updated=db_char.last_updated),
            is_published=db_char.is_published
        ))
    return result

@router.post("/characters/{char_id}/publish")
async def toggle_publish(char_id: str, db: Session = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    db_char = db.query(DBCharacter).filter(DBCharacter.id == char_id).first()
    if not db_char:
        raise HTTPException(status_code=404, detail="Character not found")
    
    if db_char.owner_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to publish this character")
    
    db_char.is_published = not db_char.is_published
    db.commit()
    return {"is_published": db_char.is_published}

@router.get("/gallery", response_model=List[Character])
async def list_published_characters(db: Session = Depends(get_db)):
    db_chars = db.query(DBCharacter).filter(DBCharacter.is_published == True).all()
    result = []
    for db_char in db_chars:
        result.append(Character(
            id=db_char.id,
            owner_id=db_char.owner_id,
            name=db_char.name,
            description=db_char.description,
            background=db_char.background,
            biology=BiologyProfile(**db_char.biology),
            current_state=NeuroState(chemicals=db_char.chemicals, last_updated=db_char.last_updated),
            is_published=db_char.is_published
        ))
    return result

@router.delete("/characters/{char_id}")
async def delete_character(char_id: str, db: Session = Depends(get_db), current_user: TokenData = Depends(get_current_user)):
    db_char = db.query(DBCharacter).filter(DBCharacter.id == char_id).first()
    if not db_char:
        raise HTTPException(status_code=404, detail="Character not found")
    
    if db_char.owner_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this character")
    
    db.delete(db_char)
    db.commit()
    return {"message": "Character deleted successfully"}
