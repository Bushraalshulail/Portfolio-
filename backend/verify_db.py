"""Script to verify database connection and data"""
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent.absolute()
sys.path.insert(0, str(backend_dir))

from app.database import SessionLocal, engine
from app.models import Gym, Facility, Equipment
from app.config import settings
import sqlite3

print("=" * 60)
print("DATABASE VERIFICATION")
print("=" * 60)

# Check config
print(f"\n1. Database URL from config:")
print(f"   {settings.DATABASE_URL}")

# Check file exists
db_path_str = settings.DATABASE_URL.replace("sqlite:///", "")
print(f"\n2. Database file path:")
print(f"   {db_path_str}")

from pathlib import Path
db_file = Path(db_path_str)
if db_file.exists():
    size = db_file.stat().st_size
    print(f"   [OK] File exists ({size:,} bytes)")
else:
    print(f"   [ERROR] File does NOT exist!")
    print(f"   Expected at: {db_file.absolute()}")

# Test direct SQLite connection
print(f"\n3. Direct SQLite connection test:")
try:
    conn = sqlite3.connect(str(db_file))
    cursor = conn.cursor()
    
    # Get table info
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [row[0] for row in cursor.fetchall()]
    print(f"   Tables found: {', '.join(tables) if tables else 'NONE'}")
    
    # Count records
    if 'gyms' in tables:
        cursor.execute("SELECT COUNT(*) FROM gyms")
        gym_count = cursor.fetchone()[0]
        print(f"   Gyms: {gym_count}")
    
    if 'facilities' in tables:
        cursor.execute("SELECT COUNT(*) FROM facilities")
        facility_count = cursor.fetchone()[0]
        print(f"   Facilities: {facility_count}")
    
    if 'equipment' in tables:
        cursor.execute("SELECT COUNT(*) FROM equipment")
        equipment_count = cursor.fetchone()[0]
        print(f"   Equipment: {equipment_count}")
    
    conn.close()
    print(f"   [OK] SQLite connection successful")
except Exception as e:
    print(f"   [ERROR] SQLite connection failed: {e}")

# Test SQLAlchemy connection
print(f"\n4. SQLAlchemy connection test:")
try:
    db = SessionLocal()
    gym_count = db.query(Gym).count()
    facility_count = db.query(Facility).count()
    equipment_count = db.query(Equipment).count()
    
    print(f"   [OK] SQLAlchemy connection successful")
    print(f"   Gyms: {gym_count}")
    print(f"   Facilities: {facility_count}")
    print(f"   Equipment: {equipment_count}")
    
    if gym_count > 0:
        # Show sample gym
        sample = db.query(Gym).first()
        print(f"\n   Sample gym:")
        print(f"   - ID: {sample.id}")
        print(f"   - Name (EN): {sample.name_en}")
        print(f"   - Name (AR): {sample.name_ar}")
        print(f"   - District: {sample.district}")
        print(f"   - Facilities: {len(sample.facilities)}")
        print(f"   - Equipment: {len(sample.equipment)}")
    
    db.close()
except Exception as e:
    print(f"   [ERROR] SQLAlchemy connection failed: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
print("VERIFICATION COMPLETE")
print("=" * 60)

