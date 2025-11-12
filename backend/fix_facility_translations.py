"""Fix facilities that have English text in name_ar field"""
import sys
from pathlib import Path

backend_dir = Path(__file__).parent.absolute()
sys.path.insert(0, str(backend_dir))

from app.database import SessionLocal
from app.models import Facility

# Translation mapping: English -> Arabic
TRANSLATIONS = {
    "-": "-",
    "additional lockers": "خزائن إضافية",
    "shower rooms": "غرف استحمام",
    "running track area": "منطقة مضمار الجري",
    "group training area": "منطقة التدريب الجماعي",
    "foosball table": "طاولة كرة القدم",
    "coffee cafe": "مقهى",
    "vending machine": "آلة بيع",
    "parking area": "منطقة مواقف سيارات",
    "cross training rig": "معدات تدريب متعدد",
    "free weights area": "منطقة الأوزان الحرة",
    "cardio zone": "منطقة الكارديو",
    "stretch area": "منطقة التمدد",
    "outdoor training space (if applicable)": "مساحة تدريب خارجية (إن وجدت)",
    "changing area": "منطقة تبديل الملابس",
    "group class studio": "استوديو التمارين الجماعية",
    "boxing training zone": "منطقة تدريب الملاكمة",
    "kickboxing station": "محطة الكيك بوكسينغ",
    "speed bag station": "محطة الكيس السريع",
    "heavy bag area": "منطقة الكيس الثقيل",
    "core training corner": "ركن تدريب العضلات الأساسية",
    "drinking water station": "محطة مياه الشرب",
    "sound system high beat": "نظام صوتي عالي النبض",
    "strength zone": "منطقة القوة",
    "group studios": "استوديوهات جماعية",
    "functional zone": "منطقة وظيفية",
    "cycling studio": "استوديو الدراجات",
    "sauna steam": "ساونا وبخار",
    "locker rooms": "غرف تبديل الملابس",
    "boxing ring": "حلبة الملاكمة",
    "running track": "مضمار الجري",
    "steam room": "غرفة بخار",
    "group exercise studios": "استوديوهات التمارين الجماعية",
    "nutrition counseling": "استشارات غذائية",
    "expanded locker rooms": "غرف تبديل ملابس موسعة",
    "vip programs": "برامج VIP",
    "personalized training plans": "خطط تدريب مخصصة",
    "exclusive access to special zones": "وصول حصري للمناطق الخاصة",
    "premium customer services": "خدمات عملاء متميزة",
}

db = SessionLocal()

try:
    print("=" * 70)
    print("FIXING FACILITY ARABIC TRANSLATIONS")
    print("=" * 70)
    print()
    
    updated_count = 0
    not_found_count = 0
    
    for en_text, ar_text in TRANSLATIONS.items():
        # Find facilities that have this English text in name_ar
        facilities = db.query(Facility).filter(
            Facility.name_ar == en_text
        ).all()
        
        if facilities:
            for facility in facilities:
                print(f"Updating: {facility.name_en}")
                print(f"  Old AR: {facility.name_ar}")
                print(f"  New AR: {ar_text}")
                facility.name_ar = ar_text
                updated_count += 1
                print()
        else:
            # Check if it's a partial match
            facilities_partial = db.query(Facility).filter(
                Facility.name_ar.contains(en_text)
            ).all()
            
            if not facilities_partial:
                not_found_count += 1
                print(f"  Warning: No facility found with: {en_text}")
    
    if updated_count > 0:
        print("=" * 70)
        print(f"Committing {updated_count} updates to database...")
        db.commit()
        print("SUCCESS! Facilities updated.")
    else:
        print("No facilities needed updating.")
        
    if not_found_count > 0:
        print(f"\nWarning: {not_found_count} translations were not applied (facility not found)")
        
    print("=" * 70)
    
except Exception as e:
    db.rollback()
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
    raise
finally:
    db.close()

