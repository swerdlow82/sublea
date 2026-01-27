import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True) #internal user ID
    email = Column(String, unique=True, index=True, nullable=False) # login credential, user unique
    password_hash = Column(String, nullable=False) # hashed password for security
    is_verified = Column(Boolean, default=False) # supports .edu verification process
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 

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
    address = Column(String(200), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    bedrooms = Column(Integer, nullable=False)
    bathrooms = Column(Integer, nullable=False)
    roommate_count = Column(Integer, default=0)
    available_from = Column(DateTime, nullable=False)
    available_to = Column(DateTime, nullable=True)
    images = Column(Text, nullable=True)  # Comma-separated image URLs
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    owner = relationship("User", back_populates="listings")
    messages = relationship("Message", back_populates="listing", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Listing(id={self.id}, title={self.title}, rent={self.rent}, address={self.address})>"
    
class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    sent_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
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
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    

    user = relationship("User", back_populates="verifications")

    def __repr__(self):
        return f"<Verification(id={self.id}, user_id={self.user_id}, verified={self.verified})>"