## temp import models during dev (auth)
# later to be replaced with migrations
from sqlalchemy.orm import Session
from database import Base, engine, get_db
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import os
import random
from dotenv import load_dotenv

from auth.models import User, Listing, Message, Verification
#from schemas import UserCreate, UserResponse, UserLogin, Token, VerificationCodeValidate
#from auth_utils import *


load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sublea Backend API", version="1.0.0", description="Student exclusive subletting marketplace API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:5173"),
        "http://localhost:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "message": "Sublea Backend API is running.", "version":"1.0.0"}

