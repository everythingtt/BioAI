from sqlalchemy import create_engine, Column, String, Float, JSON, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./db/bioai.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class DBCharacter(Base):
    __tablename__ = "characters"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    background = Column(String)
    biology = Column(JSON)  # Stores decay_rates and sensitivities
    chemicals = Column(JSON)  # Stores current neurochemical levels
    last_updated = Column(Float)
    is_published = Column(JSON, default=False) # Stores if visible publicly
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)
