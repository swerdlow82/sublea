## temp import models during dev (auth)
# later to be replaced with migrations
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import Base, engine, get_db
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import os
import random
from dotenv import load_dotenv

from auth.models import User, Listing, Message, Verification
from schemas import UserCreate, UserResponse, UserLogin, Token, VerificationCodeValidate
from auth_utils import *


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


def generate_verification_code():
    return f"{random.randint(100000, 999999)}"

def send_verification_email(email: str, code: str):
    # Placeholder function to simulate sending an email
    is_edu = is_edu_email(email)
    edu_message = ""
    if is_edu:
        edu_message = "\n Verifying your .edu email will give you a Verified badge on your profile!"
    print(f"Sending verification code {code} to {email}.{edu_message}")


@app.post("/api/pages/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered.")
    
    is_verified = is_edu_email(user_data.email)

    hashed_password = hash_password(user_data.password)
    new_user = User(email=user_data.email, password_hash=hashed_password, is_verified=False, age=user_data.age, gender=user_data.gender, gender_preference=user_data.gender_preference)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    code = generate_verification_code()
    verification = Verification(user_id=new_user.id, code=code, created_at=func.now() + timedelta(minutes=15), verified=False)
    db.add(verification)
    db.commit()

    send_verification_email(new_user.email, code)

    access_token = create_access_token(data={"user_id": new_user.id, "email": new_user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(new_user)
    }

@app.post("/api/pages/verify-email", response_model=UserResponse)
def verify_code(verification_data: VerificationCodeValidate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == verification_data.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    
    if user.is_verified:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already verified.")
    
    verification = db.query(Verification).filter(Verification.user_id == user.id, Verification.verified == False).order_by(Verification.created_at.desc()).first()
    if not verification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No verification code found. Please request a new one.")
    
    if func.now() > verification.expires_at:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Verification code has expired. Please request a new one.")
    
    if verification.code != verification_data.code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification code.")
    
    user.is_verified = True
    verification.verified = True
    db.commit()
    db.refresh(user)

    if is_edu_email(user.email):
        print(f"User {user.email} has been verified with a .edu email.")

    return UserResponse.from_orm(user)


@app.post("/api/pages/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
    
    access_token = create_access_token(data={"user_id": user.id, "email": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }

@app.get("/pages/login")
def login_page():
    return {"message": "This is the login page."}

@app.get("/pages/signup")
def signup_page():
    return {"message": "This is the signup page."}

@app.get("/pages/verify-email")
def verify_email_page():
    return {"message": "This is the email verification page."}

@app.get("/pages/profile")
def profile_page():
    return {"message": "This is the profile page."}

@app.get("/pages/profile/edit")
def edit_profile_page():
    return {"message": "This is the edit profile page."}

@app.get("/pages/listings")
def listings_page():
    return {"message": "This is the listings page."}

@app.get("/pages/listings/new")
def new_listing_page():
    return {"message": "This is the new listing page."}

@app.get("/pages/listings/{listing_id}")
def listing_detail_page(listing_id: int):
    return {"message": f"This is the detail page for listing {listing_id}."}

@app.get("/pages/messages")
def messages_page():
    return {"message": "This is the messages page."}

@app.get("/pages/messages/{conversation_id}")
def conversation_page(conversation_id: int):
    return {"message": f"This is the conversation page for conversation {conversation_id}."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)