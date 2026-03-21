from sqlalchemy import create_engine, Column, String, Float, JSON, DateTime, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./db/bioai.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class DBUser(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    characters = relationship("DBCharacter", back_populates="owner")

class DBCharacter(Base):
    __tablename__ = "characters"

    id = Column(String, primary_key=True, index=True)
    owner_id = Column(String, ForeignKey("users.id"))
    name = Column(String, index=True)
    description = Column(String)
    background = Column(String)
    biology = Column(JSON)  # Stores decay_rates and sensitivities
    chemicals = Column(JSON)  # Stores current neurochemical levels
    last_updated = Column(Float)
    is_published = Column(Boolean, default=False) # Stores if visible publicly
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("DBUser", back_populates="characters")

def init_db():
    Base.metadata.create_all(bind=engine)
