from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from .models import UserRole, SuggestionStatus


# Auth
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: int
    role: UserRole


# Email Verification OTP (for signup only)
class SendOTPRequest(BaseModel):
    email: EmailStr


class SendOTPResponse(BaseModel):
    message: str
    success: bool


class VerifyEmailRequest(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=6, max_length=6)


class VerifyEmailResponse(BaseModel):
    message: str
    success: bool


# Login
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


# Forgot Password
class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ForgotPasswordResponse(BaseModel):
    message: str
    success: bool


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    favorite_food: str  # Security answer instead of OTP
    new_password: str


class ResetPasswordResponse(BaseModel):
    message: str
    success: bool


class UpdateNameRequest(BaseModel):
    name: str = Field(min_length=2)


class UpdateNameResponse(BaseModel):
    message: str
    success: bool
    user: "UserOut"


class UpdatePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=6)


class UpdatePasswordResponse(BaseModel):
    message: str
    success: bool


class UpdateGenderRequest(BaseModel):
    gender: Optional[str] = None


class UpdateGenderResponse(BaseModel):
    message: str
    success: bool
    user: "UserOut"


# Users
class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str
    favorite_food: str  # Security question for password reset
    gender: str  # Required field


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(UserBase):
    id: int
    email_verified: str
    role: UserRole
    gender: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Gyms
class GymBase(BaseModel):
    name_ar: str
    name_en: str
    gender: Optional[str] = None
    district: str
    description: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    rating: Optional[float] = None
    opening_hours: Optional[str] = None
    facilities: Optional[List[int]] = None  # List of facility IDs
    equipment: Optional[List[int]] = None  # List of equipment IDs


class GymCreate(GymBase):
    pass


class GymUpdate(BaseModel):
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    gender: Optional[str] = None
    district: Optional[str] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    rating: Optional[float] = None
    opening_hours: Optional[str] = None
    facilities: Optional[List[int]] = None  # List of facility IDs
    equipment: Optional[List[int]] = None  # List of equipment IDs


class GymOut(BaseModel):
    id: int
    name_ar: str
    name_en: str
    gender: Optional[str] = None
    district: str
    description: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    rating: Optional[float] = None
    opening_hours: Optional[str] = None
    logo_url: Optional[str] = None
    added_by: Optional[int] = None
    created_at: datetime
    facilities: Optional[List["FacilityOut"]] = None
    equipment: Optional[List["EquipmentOut"]] = None

    class Config:
        from_attributes = True


class FacilityOut(BaseModel):
    id: int
    name_en: str
    name_ar: str

    class Config:
        from_attributes = True


class EquipmentOut(BaseModel):
    id: int
    name_en: str
    name_ar: str

    class Config:
        from_attributes = True


# Gym Suggestions
class GymSuggestionBase(BaseModel):
    gym_name: str
    location: str
    notes: Optional[str] = None


class GymSuggestionCreate(GymSuggestionBase):
    pass


class GymSuggestionOut(GymSuggestionBase):
    id: int
    user_id: int
    status: SuggestionStatus
    created_at: datetime

    class Config:
        from_attributes = True


class GymSuggestionModerate(BaseModel):
    status: SuggestionStatus


# Contact Messages
class ContactMessageCreate(BaseModel):
    user_id: Optional[int] = None
    name: str
    email: EmailStr
    message: str


class ContactMessageOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    name: str
    email: EmailStr
    message: str
    created_at: datetime

    class Config:
        from_attributes = True

