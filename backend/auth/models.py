from datetime import datetime
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True) #internal user ID
    email = Column(String, unique=True, index=True, nullable=False) # login credential, user unique
    password_hash = Column(String, nullable=False) # hashed password for security
    first_name = Column(String(50), nullable=True)
    last_name = Column(String(50), nullable=True)
    is_verified = Column(Boolean, default=False) # supports .edu verification process
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 
    gender = Column(String(20), nullable=True)
    age = Column(Integer, nullable=True)
    gender_preference = Column(String(50), nullable=True)
    age_preference_min = Column(Integer, nullable=True)
    age_preference_max = Column(Integer, nullable=True)
    cleaning_habit = Column(String(20), nullable=True)
    smoking_habit = Column(String(20), nullable=True)
    pet_preference = Column(String(20), nullable=True)
    drinking_habit = Column(String(20), nullable=True)
    noise_tolerance = Column(String(20), nullable=True)
    profile_picture = Column(String(200), nullable=True)  # URL to profile picture
    bio = Column(Text, nullable=True)
    bed_time = Column(String(20), nullable=True)
    wake_time = Column(String(20), nullable=True)

    listings = relationship("Listing", back_populates="owner", cascade="all, delete-orphan")
    messages_sent = relationship("Message", back_populates="sender", foreign_keys='Message.sender_id', cascade="all, delete-orphan")
    messages_received = relationship("Message", back_populates="recipient", foreign_keys='Message.recipient_id', cascade="all, delete-orphan")
    verifications = relationship("Verification", back_populates="user", cascade="all, delete-orphan")
    

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, is_verified={self.is_verified})>"
    

class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    rent = Column(Float, nullable=False)
    address = Column(String(500), nullable=False)
    zip_code = Column(String(20), nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    country = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    bedrooms = Column(Integer, nullable=False)
    bathrooms = Column(Integer, nullable=False)
    roommate_count = Column(Integer, default=0)
    available_from = Column(DateTime, nullable=False)
    available_to = Column(DateTime, nullable=True)
    images = Column(Text, nullable=True)  # Comma-separated image URLs
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    anonymous_lister = Column(Boolean, default=False, nullable=False)
    lister_first_name = Column(String(50), nullable=True)
    lister_last_name = Column(String(50), nullable=True)
    gender_preference = Column(String(50), nullable=True)
    cleaning_habit = Column(String(50), nullable=True)
    smoking_habit = Column(String(100), nullable=True)
    pet_preference = Column(String(100), nullable=True)
    drinking_habit = Column(String(100), nullable=True)
    noise_tolerance = Column(String(100), nullable=True)
    bed_time = Column(String(100), nullable=True)
    wake_time = Column(String(100), nullable=True)
    age_preference_min = Column(Integer, nullable=True)
    age_preference_max = Column(Integer, nullable=True)
    amenities = Column(Text, nullable=True) # Comma-separated amenities

    owner = relationship("User", back_populates="listings")
    messages = relationship("Message", back_populates="listing", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Listing(id={self.id}, title={self.title}, rent={self.rent}, address={self.address}, anonymous_lister={self.anonymous_lister})>"
    
class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    sent_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    read = Column(Boolean, default=False, nullable=False)

    sender = relationship("User", back_populates="messages_sent", foreign_keys=[sender_id])
    recipient = relationship("User", back_populates="messages_received", foreign_keys=[recipient_id])
    listing = relationship("Listing", back_populates="messages")



    def __repr__(self):
        return f"<Message(id={self.id}, sender_id={self.sender_id}, recipient_id={self.recipient_id}, listing_id={self.listing_id})>"
    
class Verification(Base):
    __tablename__ = "verifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    code = Column(String(6), nullable=False)  # e.g., 6-digit verification code
    expires_at = Column(DateTime(timezone=True), nullable=False)
    verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    

    user = relationship("User", back_populates="verifications")

    def __repr__(self):
        return f"<Verification(id={self.id}, user_id={self.user_id}, verified={self.verified})>"