from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from api.health import router as health_router
from api.characters import router as characters_router
from api.chat import router as chat_router
from api.auth import router as auth_router
from db.models import init_db
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

# Initialize database on startup
init_db()

app = FastAPI(title="BioAI Backend", description="Ultra-modular Neurochemical AI Engine")

# Custom Middleware to handle Tunnel Bypass and CORS Preflight manually if needed
@app.middleware("http")
async def add_custom_headers(request: Request, call_next):
    if request.method == "OPTIONS":
        response = Response()
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Bypass-Tunnel-Reminder"] = "true"
        return response
        
    response = await call_next(request)
    response.headers["Bypass-Tunnel-Reminder"] = "true"
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

# Standard CORS Middleware as a fallback
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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
