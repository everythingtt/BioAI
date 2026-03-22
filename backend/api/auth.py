from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import uuid
from core.auth import Token, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_password_hash, verify_password
from core.models import UserCreate, User
from db.models import DBUser, SessionLocal
from api.characters import get_db

router = APIRouter()

@router.post("/register", response_model=User)
async def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    print(f"DEBUG: Registering user {user_in.username}")
    db_user = db.query(DBUser).filter(DBUser.username == user_in.username).first()
    if db_user:
        print(f"DEBUG: Username {user_in.username} already taken")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    try:
        new_user = DBUser(
            id=str(uuid.uuid4()),
            username=user_in.username,
            hashed_password=get_password_hash(user_in.password)
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"DEBUG: Successfully created user {user_in.username}")
        return new_user
    except Exception as e:
        print(f"DEBUG: Error creating user: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during registration")

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    print(f"DEBUG: Login attempt for {form_data.username}")
    user = db.query(DBUser).filter(DBUser.username == form_data.username).first()
    if not user:
        print(f"DEBUG: User {form_data.username} not found")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verify_password(form_data.password, user.hashed_password):
        print(f"DEBUG: Invalid password for {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"DEBUG: Login successful for {form_data.username}")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id, "username": user.username}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
