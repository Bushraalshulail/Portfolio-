from getpass import getpass
from passlib.context import CryptContext

from app.database import SessionLocal
from app.models import User, UserRole

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

def main():
    db = SessionLocal()
    try:
        email = input("SuperAdmin email: ").strip().lower()
        name  = input("Name: ").strip()
        password = getpass("Password: ").strip()

        existing = db.query(User).filter(User.email == email).first()
        hashed = pwd_ctx.hash(password)

        if existing:
            print("⚠️ User already exists. Upgrading role to superadmin…")
            existing.role = UserRole.superadmin
            existing.password = hashed
            existing.email_verified = True
            db.commit()
            print("✅ Upgraded existing user to superadmin.")
            return

        user = User(
            name=name,
            email=email,
            password=hashed,
            role=UserRole.superadmin,
            email_verified=True,
        )
        db.add(user)
        db.commit()
        print("✅ SuperAdmin created.")
    finally:
        db.close()

if __name__ == "__main__":
    main()
