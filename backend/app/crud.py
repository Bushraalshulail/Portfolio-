from datetime import datetime, timedelta
from typing import Optional, List
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqlalchemy import select

from .config import settings
from . import models, schemas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Password utilities
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# Gender normalization utility
def normalize_gender(gender_value: Optional[str]) -> Optional[str]:
    """Normalize gender values: Men/Male -> Male, Women/Female -> Female, Mixed -> Mixed"""
    if not gender_value:
        return None
    
    gender_str = str(gender_value).strip()
    if not gender_str or gender_str.lower() in ['nan', 'none', '']:
        return None
    
    gender_lower = gender_str.lower()
    
    # Map to standard values
    if gender_lower in ['men', 'male', 'رجال', 'ذكر']:
        return 'Male'
    if gender_lower in ['women', 'female', 'سيدات', 'نساء', 'انثى']:
        return 'Female'
    if gender_lower in ['mixed', 'مختلط', 'both', 'unisex']:
        return 'Mixed'
    
    # If already in correct format, return capitalized
    if gender_lower in ['male', 'female', 'mixed']:
        return gender_str.capitalize()
    
    return gender_str


# JWT utilities
def create_access_token(*, user_id: int, role: models.UserRole, expires_minutes: Optional[int] = None) -> str:
    to_encode = {"sub": str(user_id), "role": role.value}
    expire_minutes = expires_minutes if expires_minutes is not None else settings.ACCESS_TOKEN_EXPIRE_MINUTES
    expire = datetime.utcnow() + timedelta(minutes=expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


# Users
def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    stmt = select(models.User).where(models.User.email == email)
    return db.scalar(stmt)


def create_user(db: Session, user_in: schemas.UserCreate) -> models.User:
    # Normalize gender if provided
    gender_value = None
    if user_in.gender:
        gender_normalized = user_in.gender.strip()
        if gender_normalized:
            gender_lower = gender_normalized.lower()
            if gender_lower in ['male', 'men', 'رجال', 'ذكر']:
                gender_value = 'Male'
            elif gender_lower in ['female', 'women', 'سيدات', 'نساء', 'انثى']:
                gender_value = 'Female'
            elif gender_lower in ['mixed', 'مختلط', 'both', 'unisex']:
                gender_value = 'Mixed'
            else:
                gender_value = gender_normalized.capitalize()
    
    user = models.User(
        name=user_in.name,
        email=user_in.email,
        password=hash_password(user_in.password),
        favorite_food=user_in.favorite_food.lower().strip(),
        gender=gender_value,
        email_verified="true",
        role=models.UserRole.user,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def verify_user_email(db: Session, email: str) -> Optional[models.User]:
    user = get_user_by_email(db, email)
    if user:
        user.email_verified = "true"
        db.commit()
        db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> Optional[models.User]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user


# Gyms (✅ تم تعديل هذه الدالة فقط)
def list_gyms(db: Session) -> List[models.Gym]:
    """List all gyms with relationships eager loaded (shuffled for UI variety)."""
    from sqlalchemy.orm import joinedload
    import random

    stmt = (
        select(models.Gym)
        .options(
            joinedload(models.Gym.facilities),
            joinedload(models.Gym.equipment)
        )
    )

    gyms = list(db.scalars(stmt).unique().all())

    # ✅ خلط النتائج بحيث ما تطلع رصّة مملة في الصفحة الرئيسية
    random.shuffle(gyms)

    return gyms


def create_gym(db: Session, gym_in: schemas.GymCreate, added_by_user_id: int) -> models.Gym:
    gym = models.Gym(
        name_ar=gym_in.name_ar,
        name_en=gym_in.name_en,
        gender=normalize_gender(gym_in.gender),
        district=gym_in.district,
        description=gym_in.description,
        phone=gym_in.phone,
        website=gym_in.website,
        logo_url=gym_in.logo_url,
        rating=gym_in.rating,
        opening_hours=gym_in.opening_hours,
        added_by=added_by_user_id,
    )
    db.add(gym)
    db.flush()

    if gym_in.facilities:
        facilities = db.query(models.Facility).filter(models.Facility.id.in_(gym_in.facilities)).all()
        gym.facilities = facilities

    if gym_in.equipment:
        equipment = db.query(models.Equipment).filter(models.Equipment.id.in_(gym_in.equipment)).all()
        gym.equipment = equipment

    db.commit()
    db.refresh(gym)
    return gym


def get_gym(db: Session, gym_id: int) -> Optional[models.Gym]:
    stmt = select(models.Gym).where(models.Gym.id == gym_id)
    return db.scalar(stmt)


def update_gym(db: Session, gym: models.Gym, gym_in: schemas.GymUpdate) -> models.Gym:
    update_data = gym_in.model_dump(exclude_unset=True, exclude={"facilities", "equipment"})
    for field, value in update_data.items():
        # Normalize gender value if it's being updated
        if field == 'gender':
            value = normalize_gender(value)
        setattr(gym, field, value)

    if "facilities" in gym_in.model_dump(exclude_unset=True):
        if gym_in.facilities is not None:
            facilities = db.query(models.Facility).filter(models.Facility.id.in_(gym_in.facilities)).all()
            gym.facilities = facilities
        else:
            gym.facilities = []

    if "equipment" in gym_in.model_dump(exclude_unset=True):
        if gym_in.equipment is not None:
            equipment = db.query(models.Equipment).filter(models.Equipment.id.in_(gym_in.equipment)).all()
            gym.equipment = equipment
        else:
            gym.equipment = []

    db.add(gym)
    db.commit()
    db.refresh(gym)
    return gym


def delete_gym(db: Session, gym: models.Gym) -> None:
    db.delete(gym)
    db.commit()


# Gym Suggestions
def create_gym_suggestion(db: Session, user_id: int, data: schemas.GymSuggestionCreate) -> models.GymSuggestion:
    suggestion = models.GymSuggestion(
        user_id=user_id,
        gym_name=data.gym_name,
        location=data.location,
        notes=data.notes,
    )
    db.add(suggestion)
    db.commit()
    db.refresh(suggestion)
    return suggestion


def set_gym_suggestion_status(db: Session, suggestion: models.GymSuggestion, status: models.SuggestionStatus) -> models.GymSuggestion:
    suggestion.status = status
    db.add(suggestion)
    db.commit()
    db.refresh(suggestion)
    return suggestion


def get_gym_suggestion(db: Session, suggestion_id: int) -> Optional[models.GymSuggestion]:
    stmt = select(models.GymSuggestion).where(models.GymSuggestion.id == suggestion_id)
    return db.scalar(stmt)


# Contact Messages
def create_contact_message(db: Session, data: schemas.ContactMessageCreate) -> models.ContactMessage:
    message = models.ContactMessage(
        user_id=data.user_id,
        name=data.name,
        email=data.email,
        message=data.message,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message
