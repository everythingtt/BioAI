from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def get_health():
    return {
        "status": "healthy",
        "version": "0.1.0",
        "modules_loaded": ["core", "neuro_sim_v1"],
        "connection": "secure"
    }

@router.get("/ping")
async def ping():
    return {"message": "pong"}
