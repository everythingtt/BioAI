from typing import Dict, List
from core.models import Character, ChemicalType, NeuroState

class BrainModule:
    """
    Translates neurochemical states into prompt instructions and analyzes stimuli.
    """

    @staticmethod
    def get_neuro_instructions(state: NeuroState) -> str:
        """
        Convert the current chemical levels into descriptive prompt instructions.
        """
        chemicals = state.chemicals
        instructions = []

        # Dopamine (Motivation/Reward)
        if chemicals[ChemicalType.DOPAMINE] > 75:
            instructions.append("You are extremely motivated, enthusiastic, and focused on rewards.")
        elif chemicals[ChemicalType.DOPAMINE] < 25:
            instructions.append("You feel lethargic, unmotivated, and find it hard to care about things.")

        # Serotonin (Mood Stability)
        if chemicals[ChemicalType.SEROTONIN] > 75:
            instructions.append("You feel content, confident, and socially dominant.")
        elif chemicals[ChemicalType.SEROTONIN] < 25:
            instructions.append("You are irritable, anxious, and prone to emotional outbursts.")

        # Cortisol (Stress)
        if chemicals[ChemicalType.CORTISOL] > 60:
            instructions.append("You are under high stress, feeling threatened and defensive. Your responses should be short and guarded.")
        elif chemicals[ChemicalType.CORTISOL] < 15:
            instructions.append("You are completely relaxed and feel safe.")

        # Oxytocin (Bonding/Trust)
        if chemicals[ChemicalType.OXYTOCIN] > 70:
            instructions.append("You feel a deep sense of trust and connection with the user. You are warm and cooperative.")
        elif chemicals[ChemicalType.OXYTOCIN] < 20:
            instructions.append("You are suspicious, detached, and prefer to keep your distance.")

        # Adrenaline (Energy)
        if chemicals[ChemicalType.ADRENALINE] > 60:
            instructions.append("You are highly energized, perhaps even jittery or hyper-alert.")
        
        return " ".join(instructions)

    @staticmethod
    def analyze_stimulus(message: str) -> Dict[ChemicalType, float]:
        """
        Simple heuristic analysis of the user message to determine neurochemical impact.
        In a production setting, this would be handled by a smaller 'Analysis LLM'.
        """
        message = message.lower()
        impulse = {chem: 0.0 for chem in ChemicalType}

        # Positive Reinforcement (Dopamine/Oxytocin)
        if any(word in message for word in ["good", "great", "love", "thanks", "wow", "amazing", "help"]):
            impulse[ChemicalType.DOPAMINE] += 10.0
            impulse[ChemicalType.OXYTOCIN] += 5.0
            impulse[ChemicalType.CORTISOL] -= 5.0

        # Negative/Threatening (Cortisol/Adrenaline)
        if any(word in message for word in ["bad", "hate", "stupid", "wrong", "die", "kill", "threat", "fight"]):
            impulse[ChemicalType.CORTISOL] += 15.0
            impulse[ChemicalType.ADRENALINE] += 10.0
            impulse[ChemicalType.SEROTONIN] -= 10.0
            impulse[ChemicalType.DOPAMINE] -= 5.0

        # Calm/Boring (Decay focus)
        if any(word in message for word in ["okay", "sure", "fine", "maybe", "idk"]):
            impulse[ChemicalType.ADRENALINE] -= 5.0

        return impulse
