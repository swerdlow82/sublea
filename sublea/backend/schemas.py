from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=64)
    age: int = Field(..., ge=13, le=120)  # Users must be between 13 and 120 years old
    gender: Literal["Male", "Female", "Non-binary", "Other", "Prefer not to say"] = Field(..., description="User's gender")
    gender_preference: Optional[Literal["Male", "Female", "Non-binary", "Other", "No preference"]] = Field(None, description="Preferred gender of roommates")
    

    class Config:
        json_schema_extra = {
            "example": {
                "email": "student@uoregon.edu",
                "password": "strongpassword123",
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
    gender_preference: str
    created_at: datetime

    class Config:
        form_attributes = True

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