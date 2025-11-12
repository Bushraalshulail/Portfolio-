from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import distinct  

from .database import Base, engine, get_db
from .routers import auth, users, gyms, gym_suggestions, contact_messages, admin
from .config import settings
from . import models  


app = FastAPI(title="Gym Finder Riyadh API")

# CORS for React - Allow specific origins when using credentials
# Note: When allow_credentials=True, you cannot use allow_origins=["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],  # Allow specific origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # Auto-create tables for convenience (still use Alembic for migrations)
    Base.metadata.create_all(bind=engine)


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(gyms.router)
app.include_router(gym_suggestions.router)
app.include_router(contact_messages.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"status": "ok", "message": "Gym Finder API is running"}

@app.get("/districts")
def get_districts(db: Session = Depends(get_db)):
    districts = db.query(distinct(models.Gym.district)).all()
    # Flatten: [('الصحافة',), ('النرجس',)] → ['الصحافة', 'النرجس']
    return [d[0] for d in districts if d[0]]


@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint - verifies database connectivity"""
    from . import models
    try:
        gym_count = db.query(models.Gym).count()
        facility_count = db.query(models.Facility).count()
        equipment_count = db.query(models.Equipment).count()
        return {
            "status": "healthy",
            "database": "connected",
            "gyms": gym_count,
            "facilities": facility_count,
            "equipment": equipment_count,
            "database_path": settings.DATABASE_URL if settings.DATABASE_URL.startswith("sqlite") else "not sqlite"
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}

