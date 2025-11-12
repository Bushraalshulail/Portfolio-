"""Verify that facilities now have proper Arabic translations"""
import sys
from pathlib import Path

backend_dir = Path(__file__).parent.absolute()
sys.path.insert(0, str(backend_dir))

from app.database import SessionLocal
from app.models import Facility
import re

def is_mostly_english(text):
    """Check if text contains mostly English characters"""
    if not text or text.strip() == '-' or text.strip() == '':
        return False  # Don't flag empty or dash
    text_clean = re.sub(r'[^\w\s]', '', text)
    arabic_chars = len(re.findall(r'[\u0600-\u06FF]', text_clean))
    total_chars = len(re.findall(r'[a-zA-Z\u0600-\u06FF]', text_clean))
    
    if total_chars == 0:
        return False
    
    return (arabic_chars / total_chars) < 0.3

db = SessionLocal()

try:
    print("=" * 70)
    print("VERIFYING FACILITY TRANSLATIONS")
    print("=" * 70)
    print()
    
    facilities = db.query(Facility).all()
    
    still_english = []
    proper_arabic = []
    
    for f in facilities:
        if f.name_ar and is_mostly_english(f.name_ar):
            still_english.append(f)
        elif f.name_ar and len(f.name_ar.strip()) > 0:
            proper_arabic.append(f)
    
    print(f"Total facilities: {len(facilities)}")
    print(f"[OK] Facilities with proper Arabic: {len(proper_arabic)}")
    print(f"[WARNING] Facilities still with English: {len(still_english)}")
    print()
    
    if still_english:
        print("Facilities still needing translation:")
        for f in still_english:
            print(f"  - ID {f.id}: {f.name_en} -> {f.name_ar}")
    else:
        print("[SUCCESS] ALL FACILITIES HAVE PROPER ARABIC TRANSLATIONS!")
        print("\nSample translations:")
        for f in proper_arabic[:5]:
            print(f"  - {f.name_en} -> {f.name_ar}")
    
    print()
    print("=" * 70)
    
finally:
    db.close()

