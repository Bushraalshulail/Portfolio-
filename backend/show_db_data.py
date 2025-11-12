"""Display database contents in a readable format"""
import sys
from pathlib import Path

backend_dir = Path(__file__).parent.absolute()
sys.path.insert(0, str(backend_dir))

from app.database import SessionLocal
from app.models import Gym, Facility, Equipment
from app.config import settings

print("=" * 70)
print("DATABASE CONTENTS - GYM FINDER")
print("=" * 70)
print(f"\nDatabase Location:")
print(f"  {settings.DATABASE_URL.replace('sqlite:///', '')}")
print()

db = SessionLocal()

try:
    # Count records
    gym_count = db.query(Gym).count()
    facility_count = db.query(Facility).count()
    equipment_count = db.query(Equipment).count()
    
    print(f"RECORD COUNTS:")
    print(f"  Gyms: {gym_count}")
    print(f"  Facilities: {facility_count}")
    print(f"  Equipment: {equipment_count}")
    print()
    
    if gym_count > 0:
        print("SAMPLE GYMS (first 10):")
        print("-" * 70)
        gyms = db.query(Gym).limit(10).all()
        for i, gym in enumerate(gyms, 1):
            print(f"\n{i}. {gym.name_en} / {gym.name_ar}")
            print(f"   District: {gym.district}")
            print(f"   Gender: {gym.gender}")
            print(f"   Rating: {gym.rating}")
            print(f"   Facilities: {len(gym.facilities)}")
            print(f"   Equipment: {len(gym.equipment)}")
            if gym.phone:
                print(f"   Phone: {gym.phone}")
    
    print("\n" + "=" * 70)
    print("If DB Browser shows empty, make sure you're opening:")
    print(f"  {Path(settings.DATABASE_URL.replace('sqlite:///', '')).absolute()}")
    print("=" * 70)
    
finally:
    db.close()

