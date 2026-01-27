import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

'''
Database configuration and session management using SQLAlchemy.
Soon to be changed to AWS RDS Postgres instance.

'''

DATABASE_URL = os.getenv(
    "DATABASE_URL", # to be implemented in production
    "sqlite:///./test.db" #local dev for fallback
)

engine = create_engine(
    DATABASE_URL,
    echo=True,  # Enable SQL query logging for debugging
    connect_args={"check_same_thread": False}
    if DATABASE_URL.startswith("sqlite") 
    else {}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False, 
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


''' 
Kaity Notes: 
I know were using AWS but thats not set up yet so for now im using sqlite for local dev.
-Abstracted the database layer first using environment variables so local development is decoupled from deployment infrastructure
'''