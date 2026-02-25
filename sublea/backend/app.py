## temp import models during dev (auth)
# later to be replaced with migrations
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import Base, engine, get_db
from fastapi import FastAPI, Depends, HTTPException, status, Query
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta, timezone
import os
import random
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer

from auth.models import User, Listing, Message, Verification
from schemas import (
    UserCreate,
    UserResponse,
    UserUpdate,
    UserLogin,
    Token,
    VerificationCodeValidate,
    ResendVerificationRequest,
    PasswordResetRequest,
    PasswordResetConfirm,
    ListingCreate,
    ListingResponse,
    MessageCreate,
    MessageResponse,
)
from auth_utils import *
from email_service import email_service
from google_maps_utils import get_coordinates


load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sublea Backend API", version="1.0.0", description="Student exclusive subletting marketplace API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:5173"),
        "http://localhost:8000",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8000",
        ""
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



@app.post("/api/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered.")
    
    is_verified = is_edu_email(user_data.email)

    hashed_password = hash_password(user_data.password)
    new_user = User(email=user_data.email, password_hash=hashed_password, is_verified=False, age=user_data.age, gender=user_data.gender, gender_preference=user_data.gender_preference, first_name=user_data.first_name, last_name=user_data.last_name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    code = generate_verification_code()
    verification = Verification(user_id=new_user.id, code=code, expires_at=func.now() + timedelta(minutes=15), verified=False)
    db.add(verification)
    db.commit()

    email_sent = email_service.send_verification_email(new_user.email, code)
    if not email_sent:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to send verification email.")

    access_token = create_access_token(data={"user_id": new_user.id, "email": new_user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(new_user)
    }

@app.post("/api/verify", response_model=UserResponse)
def verify_code(verification_data: VerificationCodeValidate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == verification_data.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    
    if user.is_verified:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already verified.")
    
    verification = db.query(Verification).filter(Verification.user_id == user.id, Verification.verified == False).order_by(Verification.created_at.desc()).first()
    if not verification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No verification code found. Please request a new one.")
    
    if datetime.now(timezone.utc) > verification.expires_at:
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


@app.post("/api/pages/resend-verification")
def resend_verification(
    request_data: ResendVerificationRequest, 
    db: Session = Depends(get_db)
):
    """
    Resend verification code to user's email
    Only works for .edu emails
    """
    # Verify it's a .edu email
    if not is_edu_email(request_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only .edu email addresses can be verified."
        )
    
    # Find user
    user = db.query(User).filter(User.email == request_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found."
        )
    
    # Check if already verified
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already verified."
        )
    
    # Check rate limiting - only allow resend if last code was created >1 minute ago
    recent_verification = db.query(Verification)\
        .filter(Verification.user_id == user.id)\
        .order_by(Verification.created_at.desc())\
        .first()
    
    if recent_verification:
        time_since_last = datetime.now(timezone.utc) - recent_verification.created_at
        if time_since_last < timedelta(minutes=1):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Please wait {60 - int(time_since_last.total_seconds())} seconds before requesting a new code."
            )
    
    # Generate new verification code
    code = generate_verification_code()
    
    verification = Verification(
        user_id=user.id,
        code=code,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=15),
        verified=False
    )
    db.add(verification)
    db.commit()
    
    # Send verification email
    email_sent = email_service.send_verification_email(user.email, code)
    
    if not email_sent:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send verification email. Please try again later."
        )
    
    return {
        "message": "Verification code sent successfully.",
        "email": user.email
    }


@app.post("/api/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
    
    access_token = create_access_token(data={"user_id": user.id, "email": user.email})
    print(f"User {user.email} logged in successfully. Access token generated.")
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

@app.get("/api/users/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@app.put("/api/users/me", response_model=UserResponse)
def update_user_profile(user_update: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user

@app.post("/api/pages/password-reset-request")
def password_reset_request(request_data: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request_data.email).first()
    if not user:
         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    request_data.token = create_access_token(data={"sub": str(user.id)}, expires_delta=timedelta(minutes=15))
    reset_email = email_service.send_password_reset_email(user.email, request_data.token)
    if not reset_email:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to send password reset email.")
    return {"message": "Password reset email sent successfully.", "email": user.email}


@app.post("/api/inbox", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def send_message(message_data: MessageCreate, db: Session = Depends(get_db)):
    if message_data.sender_id == message_data.recipient_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sender and recipient must be different users."
        )

    content = message_data.content.strip()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message content cannot be empty."
        )

    sender = db.query(User).filter(User.id == message_data.sender_id).first()
    if not sender:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sender not found."
        )

    recipient = db.query(User).filter(User.id == message_data.recipient_id).first()
    if not recipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient not found."
        )

    listing = db.query(Listing).filter(Listing.id == message_data.listing_id).first()
    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found."
        )

    if message_data.sender_id != listing.user_id and message_data.recipient_id != listing.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Listing must belong to either the sender or the recipient."
        )

    message = Message(
        sender_id=message_data.sender_id,
        recipient_id=message_data.recipient_id,
        listing_id=message_data.listing_id,
        content=content
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    return MessageResponse.from_orm(message)

@app.post("/api/pages/password-reset-confirm")
def password_reset_confirm(confirm_data: PasswordResetConfirm, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == confirm_data.email).first()
    if not user:
         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    hashed_password = hash_password(confirm_data.new_password)
    user.password_hash = hashed_password
    db.commit()
    return UserResponse.from_orm(user)

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

# Edit - TEE
@app.get("/api/listings",
response_model=list[ListingResponse])

def get_all_listings(
    location: Optional[str] = None,
    minPrice: Optional[float] = None,
    maxPrice: Optional[float] = None,
    bedrooms: Optional[str] = None,
    moveInDate: Optional[str] = None,
    prefGender: Optional[str] = None,
    habitCleaning: Optional[str] = None,
    habitSmoking: Optional[str] = None,
    habitPets: Optional[str] = None,
    habitDrinking: Optional[str] = None,
    habitNoise: Optional[str] = None,
    sortOrder: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Returns all listings from the database.
    Can be edited in the future to add pageination and filters
    """
    query = db.query(Listing).join(User, Listing.user_id == User.id)

    if location:
        search = f"%{location}%"
        query = query.filter(
            (Listing.city.ilike(search)) |
            (Listing.address.ilike(search)) |
            (Listing.title.ilike(search)) |
            (Listing.state.ilike(search))
        )
    
    if minPrice is not None:
        query = query.filter(Listing.rent >= minPrice)
        
    if maxPrice is not None:
        query = query.filter(Listing.rent <= maxPrice)
        
    if bedrooms and bedrooms.lower() != 'any':
        try:
            query = query.filter(Listing.bedrooms >= int(bedrooms))
        except ValueError:
            pass
            
    if moveInDate:
        try:
            date_obj = datetime.strptime(moveInDate, "%Y-%m-%d")
            query = query.filter(Listing.available_from <= date_obj)
        except ValueError:
            pass
            
    if prefGender and prefGender.lower() != 'any':
        query = query.filter(User.gender_preference.ilike(f"%{prefGender}%") | User.gender.ilike(f"%{prefGender}%"))
        
    if habitCleaning and habitCleaning.lower() != 'any cleanliness' and habitCleaning.lower() != 'any':
        query = query.filter(User.cleaning_habit.ilike(f"%{habitCleaning}%"))

    if habitSmoking and habitSmoking.lower() != 'any smoking' and habitSmoking.lower() != 'any':
        query = query.filter(User.smoking_habit.ilike(f"%{habitSmoking}%"))

    if habitPets and habitPets.lower() != 'any pet pref' and habitPets.lower() != 'any':
        query = query.filter(User.pet_preference.ilike(f"%{habitPets}%"))
        
    if habitDrinking and habitDrinking.lower() != 'any drinking' and habitDrinking.lower() != 'any':
        query = query.filter(User.drinking_habit.ilike(f"%{habitDrinking}%"))

    if habitNoise and habitNoise.lower() != 'any noise tol' and habitNoise.lower() != 'any':
        query = query.filter(User.noise_tolerance.ilike(f"%{habitNoise}%"))

    if sortOrder == 'price_low':
        query = query.order_by(Listing.rent.asc())
    elif sortOrder == 'price_high':
        query = query.order_by(Listing.rent.desc())
    else:
        query = query.order_by(Listing.created_at.desc())

    listings = query.all()
    return listings

@app.post("/api/listings/create")
def create_listing(user_data: ListingCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = current_user
    if user.is_verified == False:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User email not verified.")
    
    if user_data.anonymous_lister == False:
        if not user.first_name or not user.last_name:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="First and last name required for non-anonymous listings.")
        user_data.lister_first_name = user.first_name
        user_data.lister_last_name = user.last_name

    coords = get_coordinates(user_data.address, user_data.city, user_data.state, user_data.zip_code, user_data.country)
    if coords:
        latitude, longitude = coords
    else:
        latitude, longitude = None, None
    new_listing = Listing(
        user_id=user.id,
        title=user_data.title,
        lister_first_name=user_data.lister_first_name,
        lister_last_name=user_data.lister_last_name,
        description=user_data.description,
        rent=user_data.rent,
        address=user_data.address,
        zip_code=user_data.zip_code,
        city=user_data.city,
        state=user_data.state,
        country=user_data.country,
        latitude=latitude,
        longitude=longitude,
        bedrooms=user_data.bedrooms,
        bathrooms=user_data.bathrooms,
        roommate_count=user_data.roommate_count,
        available_from=user_data.available_from,
        available_to=user_data.available_to,
        images = ",".join(user_data.images) if isinstance(user_data.images, list) else user_data.images,
        anonymous_lister=user_data.anonymous_lister
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    return ListingResponse.from_orm(new_listing)

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
