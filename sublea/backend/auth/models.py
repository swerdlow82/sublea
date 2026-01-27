from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True) #internal user ID
    email = Column(String, unique=True, index=True, nullable=False) # login credential, user unique
    password_hash = Column(String, nullable=False) # hashed password for security
    is_verified = Column(Boolean, default=False) # supports .edu verification process
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 
