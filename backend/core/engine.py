import time
from typing import Dict
from core.models import ChemicalType, NeuroState, BiologyProfile

class NeuroEngine:
    """
    Core engine responsible for neurochemical fluctuations and decay.
    """
    
    @staticmethod
    def calculate_decay(state: NeuroState, biology: BiologyProfile) -> NeuroState:
        """
        Apply natural decay to chemical levels over time.
        """
        now = time.time()
        if not state.last_updated:
            state.last_updated = now
            return state
            
        dt = (now - state.last_updated) / 60.0  # Time in minutes
        
        new_chemicals = {}
        for chem, val in state.chemicals.items():
            decay_rate = biology.decay_rates.get(chem, 0.05)
            # Baseline levels to which chemicals tend to return
            baseline = 50.0 if chem in [ChemicalType.DOPAMINE, ChemicalType.SEROTONIN, ChemicalType.OXYTOCIN] else 10.0
            
            # Asymptotic decay towards baseline
            diff = val - baseline
            new_val = baseline + (diff * (0.5 ** (dt * decay_rate)))
            new_chemicals[chem] = max(0.0, min(100.0, new_val))
            
        state.chemicals = new_chemicals
        state.last_updated = now
        return state

    @staticmethod
    def process_stimulus(state: NeuroState, biology: BiologyProfile, impulse: Dict[ChemicalType, float]) -> NeuroState:
        """
        Apply an external stimulus (impulse) to the current chemical state.
        """
        new_chemicals = {}
        for chem, val in state.chemicals.items():
            boost = impulse.get(chem, 0.0)
            sensitivity = biology.sensitivities.get(chem, 1.0)
            
            new_val = val + (boost * sensitivity)
            new_chemicals[chem] = max(0.0, min(100.0, new_val))
            
        state.chemicals = new_chemicals
        return state
