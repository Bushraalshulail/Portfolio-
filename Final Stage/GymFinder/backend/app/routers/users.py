from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from ..database import get_db
from .. import schemas, models, crud
from ..config import settings

router = APIRouter(prefix="/users", tags=["users"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None or role is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.get(models.User, int(user_id))
    if user is None:
        raise credentials_exception
    return user


def require_admin(user: models.User = Depends(get_current_user)) -> models.User:
    if user.role != models.UserRole.admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user


def require_superadmin(user: models.User = Depends(get_current_user)) -> models.User:
    if user.role != models.UserRole.superadmin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="SuperAdmin access required")
    return user


@router.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = crud.create_user(db, user_in)
    return user


@router.get("/me", response_model=schemas.UserOut)
def read_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.put("/me/name", response_model=schemas.UpdateNameResponse)
def update_name(
    request: schemas.UpdateNameRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's name"""
    if not request.name or len(request.name.strip()) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="الاسم يجب أن يكون حرفين على الأقل"
        )
    
    current_user.name = request.name.strip()
    db.commit()
    db.refresh(current_user)
    
    return schemas.UpdateNameResponse(
        message="تم تحديث الاسم بنجاح",
        success=True,
        user=current_user
    )


@router.put("/me/password", response_model=schemas.UpdatePasswordResponse)
def update_password(
    request: schemas.UpdatePasswordRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's password"""
    from ..crud import verify_password, hash_password
    
    # Verify current password
    if not verify_password(request.current_password, current_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="كلمة المرور الحالية غير صحيحة"
        )
    
    # Validate new password
    if len(request.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="كلمة المرور يجب أن تكون 6 أحرف على الأقل"
        )
    
    # Update password
    current_user.password = hash_password(request.new_password)
    db.commit()
    
    return schemas.UpdatePasswordResponse(
        message="تم تحديث كلمة المرور بنجاح",
        success=True
    )


@router.put("/me/gender", response_model=schemas.UpdateGenderResponse)
def update_gender(
    request: schemas.UpdateGenderRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's gender"""
    # Normalize gender value
    if request.gender:
        gender_normalized = request.gender.strip()
        if gender_normalized:
            # Normalize common variations
            gender_lower = gender_normalized.lower()
            if gender_lower in ['male', 'men', 'رجال', 'ذكر']:
                current_user.gender = 'Male'
            elif gender_lower in ['female', 'women', 'سيدات', 'نساء', 'انثى']:
                current_user.gender = 'Female'
            elif gender_lower in ['mixed', 'مختلط', 'both', 'unisex']:
                current_user.gender = 'Mixed'
            else:
                current_user.gender = gender_normalized.capitalize()
        else:
            current_user.gender = None
    else:
        current_user.gender = None
    
    db.commit()
    db.refresh(current_user)
    
    return schemas.UpdateGenderResponse(
        message="تم تحديث الجنس بنجاح",
        success=True,
        user=current_user
    )
