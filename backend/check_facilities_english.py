"""Check facilities that have English text in name_ar field"""
import sys
import re
from pathlib import Path

backend_dir = Path(__file__).parent.absolute()
sys.path.insert(0, str(backend_dir))

from app.database import SessionLocal
from app.models import Facility

db = SessionLocal()

def is_mostly_english(text):
    """Check if text contains mostly English characters"""
    if not text:
        return True
    # Remove spaces and special characters
    text_clean = re.sub(r'[^\w\s]', '', text)
    # Count Arabic characters (range: \u0600-\u06FF)
    arabic_chars = len(re.findall(r'[\u0600-\u06FF]', text_clean))
    total_chars = len(re.findall(r'[a-zA-Z\u0600-\u06FF]', text_clean))
    
    if total_chars == 0:
        return True
    
    # If less than 30% Arabic characters, consider it English
    return (arabic_chars / total_chars) < 0.3

try:
    print("=" * 70)
    print("FACILITIES WITH ENGLISH TEXT IN name_ar FIELD")
    print("=" * 70)
    print()
    
    facilities = db.query(Facility).all()
    
    english_in_ar = []
    for f in facilities:
        if f.name_ar and is_mostly_english(f.name_ar):
            english_in_ar.append(f)
            print(f"ID: {f.id:3d} | EN: {f.name_en:50s} | AR (WRONG): {f.name_ar}")
    
    print()
    print("=" * 70)
    print(f"Total facilities: {len(facilities)}")
    print(f"Facilities with English in name_ar: {len(english_in_ar)}")
    print("=" * 70)
    
    if english_in_ar:
        print("\nThese facilities need proper Arabic translations!")
        print("\nCreating translation file...")
        
        # Create a mapping file for manual translation
        with open('facility_translations.csv', 'w', encoding='utf-8') as f:
            f.write("id,name_en,name_ar_current,name_ar_needed\n")
            for fac in english_in_ar:
                f.write(f"{fac.id},{fac.name_en},{fac.name_ar},\n")
        
        print("Saved to: facility_translations.csv")
        print("Fill in the 'name_ar_needed' column with Arabic translations")
        
finally:
    db.close()

