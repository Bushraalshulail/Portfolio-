from pydantic_settings import BaseSettings
from pydantic import Field
from pathlib import Path

# Get absolute path to backend directory (one level up from app/)
_backend_dir = Path(__file__).parent.parent.absolute()
_db_path = _backend_dir / "gym_finder.db"

# Ensure path uses forward slashes for SQLite (Windows compatibility)
_db_path_str = str(_db_path).replace("\\", "/")
_default_db_url = f"sqlite:///{_db_path_str}"

class Settings(BaseSettings):
    # Force absolute path - do not allow relative paths from env
    DATABASE_URL: str = Field(
        default=_default_db_url,
        description="SQLAlchemy database URL",
    )
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Always use absolute path - override any env variable
        if self.DATABASE_URL.startswith("sqlite"):
            # If it's a relative path, convert to absolute
            if "./" in self.DATABASE_URL or not "/" in self.DATABASE_URL.split("///")[1][:2]:
                self.DATABASE_URL = _default_db_url
    JWT_SECRET_KEY: str = Field(default="change_me", description="JWT secret key")
    JWT_ALGORITHM: str = Field(default="HS256", description="JWT signing algorithm")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60 * 24, description="Access token expiry in minutes")
    
    # Redis settings
    REDIS_URL: str = Field(default="redis://localhost:6379", description="Redis connection URL")
    
    # Email settings (for OTP) - Mailtrap for development
    SMTP_HOST: str = Field(default="smtp.mailtrap.io", description="SMTP host for sending emails")
    SMTP_PORT: int = Field(default=2525, description="SMTP port")
    SMTP_USERNAME: str = Field(default="", description="SMTP username")
    SMTP_PASSWORD: str = Field(default="", description="SMTP password")
    FROM_EMAIL: str = Field(default="noreply@gymfinder.com", description="From email address")
    
    # Alternative environment variable names for Mailtrap
    MAIL_HOST: str = Field(default="smtp.mailtrap.io", description="Mail host (alternative)")
    MAIL_PORT: int = Field(default=2525, description="Mail port (alternative)")
    MAIL_USER: str = Field(default="", description="Mail user (alternative)")
    MAIL_PASS: str = Field(default="", description="Mail pass (alternative)")

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

# Print database path for debugging
if settings.DATABASE_URL.startswith("sqlite"):
    print(f"[CONFIG] Database URL: {settings.DATABASE_URL}")

