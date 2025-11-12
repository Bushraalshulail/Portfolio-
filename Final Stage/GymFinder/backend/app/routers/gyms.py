from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from .. import schemas, models, crud
from .users import get_current_user, require_admin, require_superadmin

router = APIRouter(prefix="/gyms", tags=["gyms"])


@router.get("/", response_model=list[schemas.GymOut])
def list_gyms(db: Session = Depends(get_db)):
    return crud.list_gyms(db)


@router.post("/", response_model=schemas.GymOut, status_code=status.HTTP_201_CREATED)
def create_gym(
    gym_in: schemas.GymCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_gym(db, gym_in, added_by_user_id=current_user.id)


@router.put("/{gym_id}", response_model=schemas.GymOut)
def update_gym(
    gym_id: int,
    gym_in: schemas.GymUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    gym = crud.get_gym(db, gym_id)
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")
    if current_user.role not in [models.UserRole.superadmin, models.UserRole.admin] and gym.added_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this gym")
    return crud.update_gym(db, gym, gym_in)


@router.delete("/{gym_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gym(
    gym_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    gym = crud.get_gym(db, gym_id)
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")
    if current_user.role not in [models.UserRole.superadmin, models.UserRole.admin] and gym.added_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this gym")
    crud.delete_gym(db, gym)
    return None

