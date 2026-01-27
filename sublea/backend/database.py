import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

load_dotenv()
'''
Database configuration and session management using SQLAlchemy.
Soon to be changed to AWS RDS Postgres instance.

'''

DATABASE_URL = os.getenv(
    "DATABASE_URL", # to be implemented in production
)

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set.")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    echo=False,  # Enable SQL query logging for debugging
    max_overflow=10
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