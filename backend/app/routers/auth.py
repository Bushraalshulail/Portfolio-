# OTP verification removed for MVP mode. Do not use in production.
import re
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from .. import schemas, models, crud
from ..crud import hash_password

router = APIRouter(prefix="/auth", tags=["auth"])

# Allowed email domains
ALLOWED_DOMAINS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'gymfinder.com']

def validate_email(email: str) -> bool:
    """Validate email format and domain"""
    # Check basic format
    if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
        return False
    
    # Check if email contains only English characters
    if not re.match(r'^[a-zA-Z0-9._%+-@]+$', email):
        return False
    
    # Extract domain
    domain = email.split('@')[1].lower()
    
    # Check if domain is allowed
    return domain in ALLOWED_DOMAINS


@router.post("/register", response_model=schemas.SendOTPResponse)
def register(request: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register new user with favorite food (no email verification)"""
    email = request.email.lower()
    
    # Validate email format and domain
    if not validate_email(email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="الرجاء إدخال بريد إلكتروني صحيح"
        )
    
    # Validate favorite food
    if not request.favorite_food or len(request.favorite_food.strip()) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="اسم الطعام المفضل يجب أن يكون حرفين على الأقل"
        )
    
    # Validate gender (required)
    if not request.gender or not request.gender.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="الجنس مطلوب"
        )
    
    # Check if user already exists
    existing_user = crud.get_user_by_email(db, email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="البريد الإلكتروني مسجل مسبقاً"
        )
    
    # Create user (auto-verified, no OTP needed)
    try:
        user = crud.create_user(db, request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="فشل في إنشاء الحساب"
        )
    
    return schemas.SendOTPResponse(
        message="تم إنشاء الحساب بنجاح. يمكنك تسجيل الدخول الآن.",
        success=True
    )


@router.post("/verify-email", response_model=schemas.VerifyEmailResponse)
def verify_email(request: schemas.VerifyEmailRequest, db: Session = Depends(get_db)):
    """Email verification is disabled for this system."""
    return schemas.VerifyEmailResponse(
        message="Email verification is disabled for this system.",
        success=True
    )


@router.post("/resend-otp", response_model=schemas.SendOTPResponse)
def resend_otp(request: schemas.SendOTPRequest, db: Session = Depends(get_db)):
    """OTP sending is disabled."""
    return schemas.SendOTPResponse(
        message="OTP sending is disabled.",
        success=True
    )


@router.post("/login", response_model=schemas.LoginResponse)
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    """Login with email and password"""
    email = request.email.lower()
    
    # Validate email format and domain
    if not validate_email(email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="الرجاء إدخال بريد إلكتروني صحيح"
        )
    
    # Authenticate user
    user = crud.authenticate_user(db, email, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="البريد الإلكتروني أو كلمة المرور غير صحيحة"
        )
    
    # Convert string role to UserRole enum
    try:
        user_role = models.UserRole(user.role)
    except ValueError:
        # Fallback to user role if role string is invalid
        user_role = models.UserRole.user
    
    # Create access token
    access_token = crud.create_access_token(user_id=user.id, role=user_role)
    
    return schemas.LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=user
    )


@router.post("/forgot-password", response_model=schemas.ForgotPasswordResponse)
def forgot_password(request: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Use reset-password directly or contact admin."""
    return schemas.ForgotPasswordResponse(
        message="Use reset-password directly or contact admin.",
        success=True
    )


@router.post("/reset-password", response_model=schemas.ResetPasswordResponse)
def reset_password(request: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password using favorite food as security answer"""
    email = request.email.lower()
    favorite_food = request.favorite_food.lower().strip()
    new_password = request.new_password
    
    # Validate email format and domain
    if not validate_email(email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="الرجاء إدخال بريد إلكتروني صحيح"
        )
    
    # Validate favorite food
    if not favorite_food or len(favorite_food) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="اسم الطعام المفضل يجب أن يكون حرفين على الأقل"
        )
    
    # Validate new password
    if len(new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="كلمة المرور يجب أن تكون 6 أحرف على الأقل"
        )
    
    # Get user
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="المستخدم غير موجود"
        )
    
    # Verify favorite food (case-insensitive)
    if not user.favorite_food or user.favorite_food.lower().strip() != favorite_food:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="اسم الطعام المفضل غير صحيح"
        )
    
    # Update password
    user.password = hash_password(new_password)
    db.commit()
    db.refresh(user)
    
    return schemas.ResetPasswordResponse(
        message="تم تغيير كلمة المرور بنجاح",
        success=True
    )