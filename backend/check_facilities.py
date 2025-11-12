"""Check facilities with missing Arabic names"""
import sys
from pathlib import Path

backend_dir = Path(__file__).parent.absolute()
sys.path.insert(0, str(backend_dir))

from app.database import SessionLocal
from app.models import Facility

db = SessionLocal()

try:
    print("=" * 70)
    print("FACILITIES WITH MISSING OR EMPTY ARABIC NAMES")
    print("=" * 70)
    print()
    
    facilities = db.query(Facility).all()
    
    missing_ar = []
    for f in facilities:
        if not f.name_ar or f.name_ar.strip() == '':
            missing_ar.append(f)
            print(f"ID: {f.id:3d} | EN: {f.name_en:50s} | AR: [EMPTY]")
    
    print()
    print("=" * 70)
    print(f"Total facilities: {len(facilities)}")
    print(f"Missing Arabic names: {len(missing_ar)}")
    print("=" * 70)
    
    if missing_ar:
        print("\nThese facilities need Arabic translations!")
        
finally:
    db.close()

