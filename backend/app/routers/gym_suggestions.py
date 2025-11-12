from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from .. import schemas, models, crud
from .users import get_current_user, require_admin

router = APIRouter(prefix="/gym-suggestions", tags=["gym_suggestions"])


@router.post("/", response_model=schemas.GymSuggestionOut, status_code=status.HTTP_201_CREATED)
def submit_suggestion(
    data: schemas.GymSuggestionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_gym_suggestion(db, user_id=current_user.id, data=data)


@router.post("/{suggestion_id}/approve", response_model=schemas.GymSuggestionOut)
def approve_suggestion(
    suggestion_id: int,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(require_admin),
):
    suggestion = crud.get_gym_suggestion(db, suggestion_id)
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    return crud.set_gym_suggestion_status(db, suggestion, models.SuggestionStatus.approved)


@router.post("/{suggestion_id}/reject", response_model=schemas.GymSuggestionOut)
def reject_suggestion(
    suggestion_id: int,
    db: Session = Depends(get_db),
    admin_user: models.User = Depends(require_admin),
):
    suggestion = crud.get_gym_suggestion(db, suggestion_id)
    if not suggestion:
        raise HTTPException(status_code=404, detail="Suggestion not found")
    return crud.set_gym_suggestion_status(db, suggestion, models.SuggestionStatus.rejected)

