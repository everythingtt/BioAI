from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from core.auth import Token, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()

# In production, this should be in an environment variable!
OWNER_USER = "admin"
OWNER_PASS_HASH = "$2b$12$7D9K23m5.5G3.L.7L.7L.7O.7P.7Q.7R.7S.7T.7U.7V.7W.7X.7Y.7Z" # 'password' for demo

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Simplified owner auth
    if form_data.username != OWNER_USER or form_data.password != "password": # Use hashing in real prod
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
