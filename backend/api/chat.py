from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from core.models import Character, ChemicalType, NeuroState, BiologyProfile
from core.engine import NeuroEngine
from modules.brain import BrainModule
from db.models import DBCharacter
from api.characters import get_db
import time

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    char_id: str
    message: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    response: str
    neuro_state: NeuroState
    bio_feedback: str

@router.post("/chat", response_model=ChatResponse)
async def chat_with_character(request: ChatRequest, db: Session = Depends(get_db)):
    db_char = db.query(DBCharacter).filter(DBCharacter.id == request.char_id).first()
    if not db_char:
        raise HTTPException(status_code=404, detail="Character not found")
        
    biology = BiologyProfile(**db_char.biology)
    current_state = NeuroState(chemicals=db_char.chemicals, last_updated=db_char.last_updated)
    
    # 1. Apply natural decay first
    char_state = NeuroEngine.calculate_decay(current_state, biology)
    
    # 2. Analyze user message for stimulus
    impulse = BrainModule.analyze_stimulus(request.message)
    
    # 3. Apply stimulus to state
    char_state = NeuroEngine.process_stimulus(char_state, biology, impulse)
    
    # 4. Update DB with new state
    db_char.chemicals = char_state.chemicals
    db_char.last_updated = char_state.last_updated
    db.commit()
    
    # 5. Generate neuro-instructions for the prompt
    bio_feedback = BrainModule.get_neuro_instructions(char_state)
    
    # 6. Build the Final Response (Mocking the LLM)
    mock_responses = {
        "positive": f"(High Dopamine) {db_char.name} looks energized. 'I'm really liking where this is going! Feel free to keep sharing.'",
        "stressed": f"(High Cortisol) {db_char.name} seems tense. 'I... I'm feeling a bit overwhelmed right now. Can we slow down?'",
        "angry": f"(High Adrenaline) {db_char.name} is visibly on edge. 'I'm not in the mood for games. What do you want?'",
        "neutral": f"{db_char.name} nods thoughtfully. 'I hear you. Tell me more about that.'"
    }
    
    if char_state.chemicals[ChemicalType.CORTISOL] > 60:
        response_text = mock_responses["stressed"]
    elif char_state.chemicals[ChemicalType.DOPAMINE] > 70:
        response_text = mock_responses["positive"]
    elif char_state.chemicals[ChemicalType.ADRENALINE] > 60:
        response_text = mock_responses["angry"]
    else:
        response_text = mock_responses["neutral"]
        
    return ChatResponse(
        response=response_text,
        neuro_state=char_state,
        bio_feedback=bio_feedback
    )
