from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from api.health import router as health_router
from api.characters import router as characters_router
from api.chat import router as chat_router
from api.auth import router as auth_router
from db.models import init_db

# Initialize database on startup
init_db()

app = FastAPI(title="BioAI Backend", description="Ultra-modular Neurochemical AI Engine")

# Configure CORS for Community access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False, # Set to False to allow wildcard origins with JWT
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(health_router, prefix="/api", tags=["System"])
app.include_router(characters_router, prefix="/api", tags=["Characters"])
app.include_router(chat_router, prefix="/api", tags=["Chat"])
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])

@app.get("/")
async def root():
    return {"status": "online", "message": "BioAI Neurochemical Engine is active"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
