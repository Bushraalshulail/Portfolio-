from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from .config import settings


class Base(DeclarativeBase):
    pass


# Configure SQLite with foreign keys enabled for better data integrity
sqlite_connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    sqlite_connect_args = {
        "check_same_thread": False,
    }

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=sqlite_connect_args,
)

# Enable foreign keys for SQLite (must be done per-connection)
if settings.DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_conn, connection_record):
        cursor = dbapi_conn.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

