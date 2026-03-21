from pydantic import BaseModel, Field
from typing import Dict, Optional, List
from enum import Enum

class ChemicalType(str, Enum):
    DOPAMINE = "dopamine"    # Reward, Motivation
    SEROTONIN = "serotonin"  # Mood, Stability
    OXYTOCIN = "oxytocin"    # Trust, Bonding
    CORTISOL = "cortisol"    # Stress, Anxiety
    ADRENALINE = "adrenaline" # Energy, Fight/Flight

class NeuroState(BaseModel):
    chemicals: Dict[ChemicalType, float] = Field(
        default_factory=lambda: {
            ChemicalType.DOPAMINE: 50.0,
            ChemicalType.SEROTONIN: 50.0,
            ChemicalType.OXYTOCIN: 50.0,
            ChemicalType.CORTISOL: 20.0,
            ChemicalType.ADRENALINE: 10.0
        }
    )
    last_updated: float = Field(default_factory=float)

class BiologyProfile(BaseModel):
    name: str = "Human Standard"
    decay_rates: Dict[ChemicalType, float] = Field(
        default_factory=lambda: {
            ChemicalType.DOPAMINE: 0.1,
            ChemicalType.SEROTONIN: 0.05,
            ChemicalType.OXYTOCIN: 0.02,
            ChemicalType.CORTISOL: 0.08,
            ChemicalType.ADRENALINE: 0.15
        }
    )
    sensitivities: Dict[ChemicalType, float] = Field(
        default_factory=lambda: {
            ChemicalType.DOPAMINE: 1.0,
            ChemicalType.SEROTONIN: 1.0,
            ChemicalType.OXYTOCIN: 1.0,
            ChemicalType.CORTISOL: 1.0,
            ChemicalType.ADRENALINE: 1.0
        }
    )

class Character(BaseModel):
    id: str
    owner_id: str
    name: str
    description: str
    background: str
    biology: BiologyProfile
    current_state: NeuroState
    is_published: bool = False

class User(BaseModel):
    id: str
    username: str
    created_at: datetime.datetime

class UserCreate(BaseModel):
    username: str
    password: str
