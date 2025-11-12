from enum import Enum
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Table, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

# -------------------- ENUMS --------------------
class UserRole(str, Enum):
    superadmin = "superadmin"
    admin = "admin"
    user = "user"

class SuggestionStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


# -------------------- RELATION TABLES --------------------

gym_facility = Table(
    "gym_facility", Base.metadata,
    Column("gym_id", Integer, ForeignKey("gyms.id")),
    Column("facility_id", Integer, ForeignKey("facilities.id")),
)

gym_equipment = Table(
    "gym_equipment", Base.metadata,
    Column("gym_id", Integer, ForeignKey("gyms.id")),
    Column("equipment_id", Integer, ForeignKey("equipment.id")),
)


# -------------------- MODELS --------------------

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    favorite_food = Column(String)  # Security question for password reset
    gender = Column(String, nullable=True)  # User's gender preference
    role = Column(String, default=UserRole.user)
    email_verified = Column(String, default="no")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relations
    suggestions = relationship("GymSuggestion", back_populates="user")
    contact_messages = relationship("ContactMessage", back_populates="user")


class Gym(Base):
    __tablename__ = "gyms"
    id = Column(Integer, primary_key=True, index=True)

    name_ar = Column(String)
    name_en = Column(String)
    gender = Column(String)
    district = Column(String)
    website = Column(String)
    phone = Column(String)
    description = Column(String)
    rating = Column(Float)
    opening_hours = Column(String)

    # ✅ أضفنا هنا
    logo_url = Column(String, nullable=True)

    added_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    facilities = relationship("Facility", secondary=gym_facility, back_populates="gyms")
    equipment = relationship("Equipment", secondary=gym_equipment, back_populates="gyms")


class Facility(Base):
    __tablename__ = "facilities"
    id = Column(Integer, primary_key=True, index=True)
    name_en = Column(String, unique=True)
    name_ar = Column(String)
    gyms = relationship("Gym", secondary=gym_facility, back_populates="facilities")


class Equipment(Base):
    __tablename__ = "equipment"
    id = Column(Integer, primary_key=True, index=True)
    name_en = Column(String, unique=True)
    name_ar = Column(String)
    gyms = relationship("Gym", secondary=gym_equipment, back_populates="equipment")


class GymSuggestion(Base):
    __tablename__ = "gym_suggestions"

    id = Column(Integer, primary_key=True, index=True)
    gym_name = Column(String)
    location = Column(String)
    notes = Column(Text, nullable=True)
    status = Column(String, default=SuggestionStatus.pending)

    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="suggestions")


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String)
    email = Column(String)
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="contact_messages")
