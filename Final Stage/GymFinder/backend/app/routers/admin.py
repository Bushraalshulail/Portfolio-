from fastapi import APIRouter, Depends, HTTPException, status, Request, Form, Cookie, Header
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import Optional, List, Union
from jose import JWTError, jwt
from pathlib import Path

from ..database import get_db
from .. import schemas, models, crud
from ..config import settings

router = APIRouter(prefix="/admin", tags=["admin"])

# Templates directory
_template_dir = Path(__file__).parent.parent / "templates"
templates = Jinja2Templates(directory=str(_template_dir))


def get_current_user_from_cookie(
    request: Request,
    access_token: Optional[str],
    db: Session
) -> models.User:
    """Get current user from cookie (for admin pages)"""
    if not access_token:
        raise ValueError("No access token")
    try:
        payload = jwt.decode(access_token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None or role is None:
            raise ValueError("Invalid token")
    except JWTError:
        raise ValueError("Invalid token")
    
    user = db.get(models.User, int(user_id))
    if user is None:
        raise ValueError("User not found")
    return user


def get_admin_user_from_token_or_cookie(
    request: Request,
    access_token: Optional[str],
    authorization: Optional[str],
    db: Session
) -> Optional[models.User]:
    """Get admin user from Bearer token or cookie"""
    token = None
    
    # Try Bearer token first (for API calls)
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
    # Fall back to cookie
    elif access_token:
        token = access_token
    
    if not token:
        return None
    
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None or role is None:
            return None
    except JWTError:
        return None
    
    user = db.get(models.User, int(user_id))
    if user is None:
        return None
    
    # Check if user is admin or superadmin
    user_role = str(user.role)
    if user_role not in [models.UserRole.superadmin.value, models.UserRole.admin.value]:
        return None
    
    return user


def require_admin_cookie(
    request: Request,
    access_token: Optional[str] = Cookie(None),
    db: Session = Depends(get_db)
) -> Union[models.User, RedirectResponse]:
    """Require admin or superadmin role from cookie"""
    if not access_token:
        return RedirectResponse(url="http://localhost:5173/auth", status_code=status.HTTP_302_FOUND)
    try:
        current_user = get_current_user_from_cookie(request, access_token, db)
        # Compare role string with enum values
        user_role = str(current_user.role)
        if user_role not in [models.UserRole.superadmin.value, models.UserRole.admin.value]:
            return RedirectResponse(url="http://localhost:5173/auth", status_code=status.HTTP_302_FOUND)
        return current_user
    except Exception as e:
        # Log error for debugging
        import traceback
        print(f"Admin auth error: {e}")
        traceback.print_exc()
        return RedirectResponse(url="http://localhost:5173/auth", status_code=status.HTTP_302_FOUND)


def require_superadmin_cookie(
    request: Request,
    access_token: Optional[str] = Cookie(None),
    db: Session = Depends(get_db)
) -> Union[models.User, RedirectResponse]:
    """Require superadmin role from cookie"""
    if not access_token:
        return RedirectResponse(url="http://localhost:5173/auth", status_code=status.HTTP_302_FOUND)
    try:
        current_user = get_current_user_from_cookie(request, access_token, db)
        # Compare role string with enum values
        user_role = str(current_user.role)
        if user_role != models.UserRole.superadmin.value:
            return RedirectResponse(url="/admin/dashboard?error=Superadmin access required", status_code=status.HTTP_302_FOUND)
        return current_user
    except Exception as e:
        # Log error for debugging
        import traceback
        print(f"Superadmin auth error: {e}")
        traceback.print_exc()
        return RedirectResponse(url="http://localhost:5173/auth", status_code=status.HTTP_302_FOUND)


# ==================== LOGIN ====================
@router.get("/login", response_class=HTMLResponse)
async def admin_login_page(
    request: Request,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """Redirect to frontend login page - admin login removed"""
    # Redirect to frontend login page
    return RedirectResponse(url="http://localhost:5174/auth", status_code=status.HTTP_302_FOUND)


@router.post("/login")
async def admin_login(
    request: Request,
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    """Redirect to frontend login - admin login removed"""
    return RedirectResponse(url="http://localhost:5174/auth", status_code=status.HTTP_302_FOUND)


@router.get("/auto-login")
async def admin_auto_login(
    request: Request,
    token: Optional[str] = None,
    redirect: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Auto-login admin from Bearer token (for frontend integration)"""
    if not token:
        return RedirectResponse(url="http://localhost:5173/auth", status_code=status.HTTP_302_FOUND)
    
    try:
        # Decode and verify token
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        
        if user_id and role:
            user = db.get(models.User, int(user_id))
            if user:
                user_role = str(user.role)
                # Check if user is admin or superadmin
                if user_role in [models.UserRole.superadmin.value, models.UserRole.admin.value]:
                    # Convert role to enum for token creation
                    try:
                        user_role_enum = models.UserRole(user_role)
                    except ValueError:
                        user_role_enum = models.UserRole.user
                    
                    # Create access token and set cookie
                    access_token = crud.create_access_token(user_id=user.id, role=user_role_enum)
                    
                    # Determine redirect URL
                    if redirect:
                        # If redirect is a full URL, use it directly
                        if redirect.startswith('http://') or redirect.startswith('https://'):
                            redirect_url = redirect
                        else:
                            # If it's a relative path starting with /admin/statistics, redirect to frontend
                            if redirect.startswith('/admin/statistics'):
                                redirect_url = f"http://localhost:5173{redirect}"
                            else:
                                # For other paths, redirect to backend
                                redirect_url = f"http://127.0.0.1:8000{redirect}" if redirect.startswith('/') else f"http://127.0.0.1:8000/{redirect}"
                    else:
                        # Default: redirect to backend's own dashboard
                        redirect_url = "http://127.0.0.1:8000/admin/dashboard"
                    
                    response = RedirectResponse(url=redirect_url, status_code=status.HTTP_302_FOUND)
                    # Set cookie with proper domain and path for cross-origin access
                    response.set_cookie(
                        key="access_token", 
                        value=access_token, 
                        httponly=True, 
                        samesite="lax",
                        path="/",
                        max_age=86400  # 24 hours
                    )
                    return response
    except (JWTError, ValueError, Exception) as e:
        # Invalid token, redirect to login
        print(f"Auto-login error: {e}")
        pass
    
    return RedirectResponse(url="http://localhost:5174/auth", status_code=status.HTTP_302_FOUND)


@router.get("/logout")
async def admin_logout():
    """Handle admin logout - redirect to frontend home"""
    response = RedirectResponse(url="http://localhost:5173/", status_code=status.HTTP_302_FOUND)
    response.delete_cookie("access_token")
    return response


# ==================== DASHBOARD ====================
@router.get("/dashboard", response_class=HTMLResponse)
async def admin_dashboard(
    request: Request,
    db: Session = Depends(get_db),
    current_user: Union[models.User, RedirectResponse] = Depends(require_admin_cookie)
):
    """Admin dashboard - statistics"""
    # Handle redirect response
    if isinstance(current_user, RedirectResponse):
        return current_user
    # Get statistics
    try:
        total_gyms = db.query(func.count(models.Gym.id)).scalar() or 0
        total_facilities = db.query(func.count(models.Facility.id)).scalar() or 0
        total_equipment = db.query(func.count(models.Equipment.id)).scalar() or 0
        total_users = db.query(func.count(models.User.id)).scalar() or 0
        total_contact_messages = db.query(func.count(models.ContactMessage.id)).scalar() or 0
        
        # User gender statistics - handle potential missing column gracefully
        # Note: User gender values are stored as 'Male', 'Female', or 'Mixed'
        try:
            male_users = db.query(func.count(models.User.id)).filter(
                or_(
                    models.User.gender == 'Male',
                    models.User.gender == 'Men'
                )
            ).scalar() or 0
            female_users = db.query(func.count(models.User.id)).filter(
                or_(
                    models.User.gender == 'Female',
                    models.User.gender == 'Women'
                )
            ).scalar() or 0
        except Exception as e:
            print(f"Error querying user gender statistics: {e}")
            male_users = 0
            female_users = 0
        
        # Gym gender statistics (count Male and Female gyms)
        # Note: Gym gender values are stored as 'Male', 'Female', or 'Mixed'
        try:
            male_gyms = db.query(func.count(models.Gym.id)).filter(
                or_(
                    models.Gym.gender == 'Male',
                    models.Gym.gender == 'Men'
                )
            ).scalar() or 0
            female_gyms = db.query(func.count(models.Gym.id)).filter(
                or_(
                    models.Gym.gender == 'Female',
                    models.Gym.gender == 'Women'
                )
            ).scalar() or 0
        except Exception as e:
            print(f"Error querying gym gender statistics: {e}")
            male_gyms = 0
            female_gyms = 0
    except Exception as e:
        print(f"Error getting statistics: {e}")
        import traceback
        traceback.print_exc()
        # Return default values on error
        total_gyms = 0
        total_facilities = 0
        total_equipment = 0
        total_users = 0
        total_contact_messages = 0
        male_users = 0
        female_users = 0
        male_gyms = 0
        female_gyms = 0
    
    return templates.TemplateResponse(
        "admin_dashboard.html",
        {
            "request": request,
            "current_user": current_user,
            "total_gyms": total_gyms,
            "total_facilities": total_facilities,
            "total_equipment": total_equipment,
            "total_users": total_users,
            "total_contact_messages": total_contact_messages,
            "male_users": male_users,
            "female_users": female_users,
            "male_gyms": male_gyms,
            "female_gyms": female_gyms,
        }
    )


@router.get("/statistics", response_class=HTMLResponse)
async def admin_statistics_page(
    request: Request,
    db: Session = Depends(get_db),
    current_user: Union[models.User, RedirectResponse] = Depends(require_admin_cookie)
):
    """Get statistics page as HTML - same as other admin pages"""
    # Handle redirect response
    if isinstance(current_user, RedirectResponse):
        return current_user
    
    # Get statistics
    try:
        total_users = db.query(func.count(models.User.id)).scalar() or 0
        
        # User gender statistics
        # Note: User gender values are stored as 'Male', 'Female', or 'Mixed'
        try:
            male_users = db.query(func.count(models.User.id)).filter(
                or_(
                    models.User.gender == 'Male',
                    models.User.gender == 'Men'
                )
            ).scalar() or 0
            female_users = db.query(func.count(models.User.id)).filter(
                or_(
                    models.User.gender == 'Female',
                    models.User.gender == 'Women'
                )
            ).scalar() or 0
        except Exception as e:
            print(f"Error querying user gender statistics: {e}")
            male_users = 0
            female_users = 0
        
        # Gym gender statistics
        try:
            male_gyms = db.query(func.count(models.Gym.id)).filter(
                or_(
                    models.Gym.gender == 'Male',
                    models.Gym.gender == 'Men'
                )
            ).scalar() or 0
            female_gyms = db.query(func.count(models.Gym.id)).filter(
                or_(
                    models.Gym.gender == 'Female',
                    models.Gym.gender == 'Women'
                )
            ).scalar() or 0
        except Exception as e:
            print(f"Error querying gym gender statistics: {e}")
            male_gyms = 0
            female_gyms = 0
    except Exception as e:
        print(f"Error getting statistics: {e}")
        import traceback
        traceback.print_exc()
        total_users = 0
        male_users = 0
        female_users = 0
        male_gyms = 0
        female_gyms = 0
    
    return templates.TemplateResponse(
        "admin_statistics.html",
        {
            "request": request,
            "current_user": current_user,
            "total_users": total_users,
            "male_users": male_users,
            "female_users": female_users,
            "male_gyms": male_gyms,
            "female_gyms": female_gyms,
        }
    )


@router.get("/statistics/api", response_class=JSONResponse)
async def admin_statistics_api(
    request: Request,
    db: Session = Depends(get_db),
    access_token: Optional[str] = Cookie(None),
    authorization: Optional[str] = Header(None, alias="Authorization")
):
    """Get statistics as JSON for charts - accepts Bearer token or cookie"""
    # Try to get Authorization header from request directly if Header dependency doesn't work
    auth_header = authorization
    if not auth_header:
        auth_header = request.headers.get("Authorization")
    
    # Try to get admin user from token or cookie
    current_user = get_admin_user_from_token_or_cookie(
        request=request,
        access_token=access_token,
        authorization=auth_header,
        db=db
    )
    
    if not current_user:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"error": "Unauthorized"}
        )
    
    # Get total users
    total_users = db.query(func.count(models.User.id)).scalar() or 0
    
    # User gender statistics
    # Note: User gender values are stored as 'Male', 'Female', or 'Mixed'
    try:
        male_users = db.query(func.count(models.User.id)).filter(
            or_(
                models.User.gender == 'Male',
                models.User.gender == 'Men'
            )
        ).scalar() or 0
        female_users = db.query(func.count(models.User.id)).filter(
            or_(
                models.User.gender == 'Female',
                models.User.gender == 'Women'
            )
        ).scalar() or 0
    except Exception as e:
        print(f"Error querying user gender statistics: {e}")
        male_users = 0
        female_users = 0
    
    # Gym gender statistics (count Male and Female gyms)
    try:
        male_gyms = db.query(func.count(models.Gym.id)).filter(
            or_(
                models.Gym.gender == 'Male',
                models.Gym.gender == 'Men'
            )
        ).scalar() or 0
        female_gyms = db.query(func.count(models.Gym.id)).filter(
            or_(
                models.Gym.gender == 'Female',
                models.Gym.gender == 'Women'
            )
        ).scalar() or 0
    except Exception as e:
        print(f"Error querying gym gender statistics: {e}")
        male_gyms = 0
        female_gyms = 0
    
    return JSONResponse(content={
        "total_users": total_users,
        "users": {
            "total": total_users,
            "men": male_users,
            "women": female_users
        },
        "gyms": {
            "men": male_gyms,
            "women": female_gyms
        }
    })


# ==================== GYMS ====================
@router.get("/gyms", response_class=HTMLResponse)
async def admin_gyms_list(
    request: Request,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Union[models.User, RedirectResponse] = Depends(require_admin_cookie)
):
    """List all gyms"""
    # Handle redirect response
    if isinstance(current_user, RedirectResponse):
        return current_user
    query = db.query(models.Gym)
    if search:
        query = query.filter(
            or_(
                models.Gym.name_ar.contains(search),
                models.Gym.name_en.contains(search)
            )
        )
    gyms = query.order_by(models.Gym.created_at.desc()).all()
    
    return templates.TemplateResponse(
        "admin_gyms.html",
        {
            "request": request,
            "gyms": gyms,
            "search": search or "",
            "current_user": current_user
        }
    )


@router.get("/gyms/new", response_class=HTMLResponse)
async def admin_gym_new_page(
    request: Request,
    db: Session = Depends(get_db),
    current_user: Union[models.User, RedirectResponse] = Depends(require_admin_cookie)
):
    """Add new gym page"""
    # Handle redirect response
    if isinstance(current_user, RedirectResponse):
        return current_user
    
    all_facilities = db.query(models.Facility).order_by(models.Facility.name_en).all()
    all_equipment = db.query(models.Equipment).order_by(models.Equipment.name_en).all()
    
    return templates.TemplateResponse(
        "admin_gym_new.html",
        {
            "request": request,
            "all_facilities": all_facilities,
            "all_equipment": all_equipment,
            "current_user": current_user
        }
    )


@router.post("/gyms/new")
async def admin_gym_create(
    request: Request,
    name_ar: str = Form(...),
    name_en: str = Form(...),
    gender: Optional[str] = Form(None),
    district: str = Form(...),
    description: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    website: Optional[str] = Form(None),
    logo_url: Optional[str] = Form(None),
    rating: Optional[float] = Form(None),
    opening_hours: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: Union[models.User, RedirectResponse] = Depends(require_admin_cookie)
):
    """Create new gym"""
    # Handle redirect response
    if isinstance(current_user, RedirectResponse):
        return current_user
    
    form_data = await request.form()
    facilities = [int(v) for v in form_data.getlist("facilities")] if "facilities" in form_data else []
    equipment = [int(v) for v in form_data.getlist("equipment")] if "equipment" in form_data else []
    
    gym_in = schemas.GymCreate(
        name_ar=name_ar,
        name_en=name_en,
        gender=gender,
        district=district,
        description=description,
        phone=phone,
        website=website,
        logo_url=logo_url,
        rating=rating,
        opening_hours=opening_hours,
        facilities=facilities if facilities else None,
        equipment=equipment if equipment else None,
    )
    
    gym = crud.create_gym(db, gym_in, added_by_user_id=current_user.id)
    
    return RedirectResponse(url=f"/admin/gyms/{gym.id}?success=Gym created successfully", status_code=status.HTTP_302_FOUND)


@router.get("/gyms/{gym_id}", response_class=HTMLResponse)
async def admin_gym_view(
    request: Request,
    gym_id: int,
    db: Session = Depends(get_db),
    current_user: Union[models.User, RedirectResponse] = Depends(require_admin_cookie)
):
    """View gym details"""
    # Handle redirect response
    if isinstance(current_user, RedirectResponse):
        return current_user
    gym = crud.get_gym(db, gym_id)
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")
    
    all_facilities = db.query(models.Facility).order_by(models.Facility.name_en).all()
    all_equipment = db.query(models.Equipment).order_by(models.Equipment.name_en).all()
    
    return templates.TemplateResponse(
        "admin_gym_view.html",
        {
            "request": request,
            "gym": gym,
            "all_facilities": all_facilities,
            "all_equipment": all_equipment,
            "current_user": current_user
        }
    )


@router.get("/gyms/{gym_id}/edit", response_class=HTMLResponse)
async def admin_gym_edit_page(
    request: Request,
    gym_id: int,
    db: Session = Depends(get_db),
    current_user: Union[models.User, RedirectResponse] = Depends(require_admin_cookie)
):
    """Edit gym page"""
    # Handle redirect response
    if isinstance(current_user, RedirectResponse):
        return current_user
    gym = crud.get_gym(db, gym_id)
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")
    
    all_facilities = db.query(models.Facility).order_by(models.Facility.name_en).all()
    all_equipment = db.query(models.Equipment).order_by(models.Equipment.name_en).all()
    
    return templates.TemplateResponse(
        "admin_gym_edit.html",
        {
            "request": request,
            "gym": gym,
            "all_facilities": all_facilities,
            "all_equipment": all_equipment,
            "current_user": current_user
        }
    )


@router.post("/gyms/{gym_id}/edit")
async def admin_gym_update(
    request: Request,
    gym_id: int,
    name_ar: str = Form(...),
    name_en: str = Form(...),
    gender: Optional[str] = Form(None),
    district: str = Form(...),
    description: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    website: Optional[str] = Form(None),
    logo_url: Optional[str] = Form(None),
    rating: Optional[float] = Form(None),
    opening_hours: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: Union[models.User, RedirectResponse] = Depends(require_admin_cookie)
):
    """Update gym"""
    # Handle redirect response
    if isinstance(current_user, RedirectResponse):
        return current_user
    gym = crud.get_gym(db, gym_id)
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")
    
    form_data = await request.form()
    facilities = [int(v) for v in form_data.getlist("facilities")] if "facilities" in form_data else []
    equipment = [int(v) for v in form_data.getlist("equipment")] if "equipment" in form_data else []
    
    gym_in = schemas.GymUpdate(
        name_ar=name_ar,
        name_en=name_en,
        gender=gender,
        district=district,
        description=description,
        phone=phone,
        website=website,
        logo_url=logo_url,
        rating=rating,
        opening_hours=opening_hours,
        facilities=facilities if facilities else None,
        equipment=equipment if equipment else None,
    )
    crud.update_gym(db, gym, gym_in)
    return RedirectResponse(url=f"/admin/gyms/{gym_id}?success=Gym updated", status_code=status.HTTP_302_FOUND)


@router.post("/gyms/{gym_id}/delete")
async def admin_gym_delete(
    gym_id: int,
    db: Session = Depends(get_db),
    current_user: Union[models.User, RedirectResponse] = Depends(require_admin_cookie)
):
    """Delete gym"""
    # Handle redirect response
    if isinstance(current_user, RedirectResponse):
        return current_user
    gym = crud.get_gym(db, gym_id)
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")
    crud.delete_gym(db, gym)
    return RedirectResponse(url="/admin/gyms?success=Gym deleted", status_code=status.HTTP_302_FOUND)


# ==================== USERS ====================
@router.get("/users", response_class=HTMLResponse)
async def admin_users_list(
    request: Request,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Union[models.User, RedirectResponse] = Depends(require_admin_cookie)
):
    """List all users - accessible to admin and superadmin"""
    # Handle redirect response
    if isinstance(current_user, RedirectResponse):
        return current_user
    
    query = db.query(models.User)
    if search:
        query = query.filter(
            or_(
                models.User.name.contains(search),
                models.User.email.contains(search)
            )
        )
    users = query.order_by(models.User.created_at.desc()).all()
    
    return templates.TemplateResponse(
        "admin_users.html",
        {
            "request": request,
            "users": users,
            "search": search or "",
            "current_user": current_user
        }
    )


@router.get("/users/{user_id}", response_class=HTMLResponse)
async def admin_user_view(
    request: Request,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: Union[models.User, RedirectResponse] = Depends(require_admin_cookie)
):
    """View user details - accessible to admin and superadmin"""
    # Handle redirect response
    if isinstance(current_user, RedirectResponse):
        return current_user
    
    # Get user
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user activity
    contact_messages = db.query(models.ContactMessage).filter(
        models.ContactMessage.user_id == user_id
    ).order_by(models.ContactMessage.created_at.desc()).all()
    
    return templates.TemplateResponse(
        "admin_user_view.html",
        {
            "request": request,
            "user": user,
            "contact_messages": contact_messages,
            "current_user": current_user
        }
    )


@router.post("/users/{user_id}/change-role")
async def admin_user_change_role(
    request: Request,
    user_id: int,
    new_role: str = Form(...),
    db: Session = Depends(get_db),
    current_user: Union[models.User, RedirectResponse] = Depends(require_superadmin_cookie)
):
    """Change user role - only superadmin can do this"""
    # Handle redirect response
    if isinstance(current_user, RedirectResponse):
        return current_user
    
    # Validate new role
    if new_role not in [models.UserRole.superadmin.value, models.UserRole.admin.value, models.UserRole.user.value]:
        return RedirectResponse(url=f"/admin/users/{user_id}?error=Invalid role", status_code=status.HTTP_302_FOUND)
    
    # Get user
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent changing own role from superadmin
    if user.id == current_user.id and user.role == models.UserRole.superadmin.value and new_role != models.UserRole.superadmin.value:
        return RedirectResponse(url=f"/admin/users/{user_id}?error=Cannot demote yourself from superadmin", status_code=status.HTTP_302_FOUND)
    
    # Update role
    user.role = new_role
    db.commit()
    db.refresh(user)
    
    return RedirectResponse(url=f"/admin/users/{user_id}?success=Role updated to {new_role}", status_code=status.HTTP_302_FOUND)


@router.post("/users/{user_id}/delete")
async def admin_user_delete(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: Union[models.User, RedirectResponse] = Depends(require_superadmin_cookie)
):
    """Delete a user - only superadmin, cannot delete self"""
    # Handle redirect response
    if isinstance(current_user, RedirectResponse):
        return current_user
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        return RedirectResponse(url=f"/admin/users/{user_id}?error=You cannot delete your own account", status_code=status.HTTP_302_FOUND)
    db.delete(user)
    db.commit()
    return RedirectResponse(url=f"/admin/users?success=User {user.email} deleted", status_code=status.HTTP_302_FOUND)


# ==================== CONTACT MESSAGES ====================
@router.get("/contact-messages", response_class=HTMLResponse)
async def admin_contact_messages_list(
    request: Request,
    db: Session = Depends(get_db),
    current_user: Union[models.User, RedirectResponse] = Depends(require_admin_cookie)
):
    """List all contact messages"""
    # Handle redirect response
    if isinstance(current_user, RedirectResponse):
        return current_user
    contact_messages = db.query(models.ContactMessage).order_by(
        models.ContactMessage.created_at.desc()
    ).all()
    
    return templates.TemplateResponse(
        "admin_contact_messages.html",
        {
            "request": request,
            "contact_messages": contact_messages,
            "current_user": current_user
        }
    )


@router.post("/contact-messages/{message_id}/delete")
async def admin_contact_message_delete(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: Union[models.User, RedirectResponse] = Depends(require_admin_cookie)
):
    """Delete contact message"""
    # Handle redirect response
    if isinstance(current_user, RedirectResponse):
        return current_user
    message = db.query(models.ContactMessage).filter(models.ContactMessage.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Contact message not found")
    db.delete(message)
    db.commit()
    return RedirectResponse(url="/admin/contact-messages?success=Contact message deleted", status_code=status.HTTP_302_FOUND)
