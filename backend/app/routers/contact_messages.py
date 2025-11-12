from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from ..database import get_db
from .. import schemas, crud

router = APIRouter(prefix="/contact-messages", tags=["contact_messages"])


@router.post("/", response_model=schemas.ContactMessageOut, status_code=status.HTTP_201_CREATED)
def submit_message(data: schemas.ContactMessageCreate, db: Session = Depends(get_db)):
    return crud.create_contact_message(db, data)

