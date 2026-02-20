import token
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=64)
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    age: int = Field(..., ge=13, le=120)  # Users must be between 13 and 120 years old
    gender: Literal["Male", "Female", "Non-binary", "Other", "Prefer not to say"] = Field(..., description="User's gender")
    gender_preference: Optional[Literal["Male", "Female", "Non-binary", "Other", "No preference"]] = Field(None, description="Preferred gender of roommates")
    

    class Config:
        json_schema_extra = {
            "example": {
                "email": "student@uoregon.edu",
                "password": "strongpassword123",
                "first_name": "John",
                "last_name": "Doe",
                "age": 20,
                "gender": "Male",
                "gender_preference": "No preference"
            }
        }



class UserResponse(BaseModel):
    id: int
    email: EmailStr
    is_verified: bool
    age: int
    gender: str
    gender_preference: Optional[str]
    first_name: str
    last_name: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class VerificationCodeSend(BaseModel):
    pass



class VerificationCodeValidate(BaseModel):
    code: str = Field(..., min_length=6, max_length=6)
    email: EmailStr

    class Config:
        json_schema_extra = {
            "example": {
                "code": "123456",
                "email": "student@uoregon.edu"
            }
        }

class ResendVerificationRequest(BaseModel):
    email: EmailStr

    class Config:
        json_schema_extra = {
            "example": {
                "email": "student@uoregon.edu"
            }
        }

class PasswordResetRequest(BaseModel):
    token: str
    email: EmailStr

    class Config:
        json_schema_extra = {
            "example": {
                "token": "reset-token-123",
                "email": "student@uoregon.edu"
            }
        }

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=64)

    class Config:
        json_schema_extra = {
            "example": {
                "token": "reset-token-123",
                "new_password": "newstrongpassword123"
            }
        }


class ListingCreate(BaseModel):
    user_id:int
    title: str
    lister_first_name: Optional[str] = None
    lister_last_name: Optional[str] = None
    description: str
    rent: float
    address: str
    zip_code: str
    city: str
    state: str
    country: Optional[str]
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    bedrooms: int
    bathrooms: int
    roommate_count: Optional[int] = 0
    available_from: datetime
    available_to: Optional[datetime]
    images: Optional[str]  # Comma-separated image URLs
    anonymous_lister: Optional[bool] = False

    class Config:
        json_schema_extra = {
            "example": {
                "address": "559 E 16th Ave",
                "anonymous_lister": False,
                "available_from": "2027-03-22T00:00:00",
                "available_to": "2027-09-25T00:00:00",
                "bathrooms": 1,
                "bedrooms": 2,
                "city": "Eugene",
                "country": "USA",
                "description": "A lovely 4 bedroom house located just minutes from campus.",
                "images": "http://example.com/image1.jpg,http://example.com/image2.jpg",
                "rent": 875,
                "roommate_count": 3,
                "state": "OR",
                "title": "Spacious 4BR House Near Campus",
                "user_id": 8,
                "zip_code": "97401"
            }
        }

class ListingResponse(BaseModel):
    id: int
    user_id:int
    title: str
    lister_first_name: Optional[str]
    lister_last_name: Optional[str]
    description: str
    rent: float
    address: str
    zip_code: str
    city: str
    state: str
    country: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    bedrooms: int
    bathrooms: int
    roommate_count: Optional[int] = 0
    available_from: datetime
    available_to: Optional[datetime]
    images: Optional[str]  # Comma-separated image URLs
    anonymous_lister: Optional[bool] = False
    created_at: datetime
    deleted_at: Optional[datetime]

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    sender_id: int
    recipient_id: int
    listing_id: int
    content: str = Field(..., min_length=1, max_length=2000)

    class Config:
        json_schema_extra = {
            "example": {
                "sender_id": 1,
                "recipient_id": 2,
                "listing_id": 3,
                "content": "Hi! I'm interested in your listing—can we chat?"
            }
        }


class MessageResponse(BaseModel):
    id: int
    sender_id: int
    recipient_id: int
    listing_id: int
    content: str
    sent_at: datetime
    read: bool

    class Config:
        from_attributes = True
