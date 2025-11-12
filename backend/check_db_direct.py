"""Direct database check - will show what DB Browser should see"""
import sqlite3
from pathlib import Path

db_path = Path("gym_finder.db").absolute()
print("=" * 70)
print("DIRECT SQLite DATABASE CHECK")
print("=" * 70)
print(f"\nDatabase file: {db_path}")
print(f"File exists: {db_path.exists()}")
if db_path.exists():
    print(f"File size: {db_path.stat().st_size:,} bytes")

print("\nConnecting directly with sqlite3...")
conn = sqlite3.connect(str(db_path))

try:
    cursor = conn.cursor()
    
    # Check tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [row[0] for row in cursor.fetchall()]
    print(f"\nTables found: {', '.join(tables)}")
    
    # Count gyms
    cursor.execute("SELECT COUNT(*) FROM gyms")
    gym_count = cursor.fetchone()[0]
    print(f"\nGyms count: {gym_count}")
    
    # Count facilities
    cursor.execute("SELECT COUNT(*) FROM facilities")
    facility_count = cursor.fetchone()[0]
    print(f"Facilities count: {facility_count}")
    
    # Count equipment
    cursor.execute("SELECT COUNT(*) FROM equipment")
    equipment_count = cursor.fetchone()[0]
    print(f"Equipment count: {equipment_count}")
    
    if gym_count > 0:
        print("\nFirst 5 gyms (what DB Browser should show):")
        print("-" * 70)
        cursor.execute("""
            SELECT id, name_en, name_ar, district, gender, rating 
            FROM gyms 
            LIMIT 5
        """)
        for row in cursor.fetchall():
            print(f"ID: {row[0]}")
            print(f"  EN: {row[1]}")
            print(f"  AR: {row[2]}")
            print(f"  District: {row[3]}")
            print(f"  Gender: {row[4]}")
            print(f"  Rating: {row[5]}")
            print()
    
    # Check gym_facility relationships
    cursor.execute("SELECT COUNT(*) FROM gym_facility")
    gym_facility_count = cursor.fetchone()[0]
    print(f"Gym-Facility relationships: {gym_facility_count}")
    
    # Check gym_equipment relationships
    cursor.execute("SELECT COUNT(*) FROM gym_equipment")
    gym_equipment_count = cursor.fetchone()[0]
    print(f"Gym-Equipment relationships: {gym_equipment_count}")
    
    print("\n" + "=" * 70)
    print("IF DB BROWSER SHOWS EMPTY:")
    print("1. Make sure you're opening: gym_finder.db (in backend folder)")
    print("2. Close DB Browser completely")
    print("3. Reopen DB Browser")
    print("4. Open Database -> Select: gym_finder.db")
    print("5. Go to 'Browse Data' tab")
    print("6. Select table: 'gyms' from dropdown")
    print("7. Click 'Refresh' button")
    print("=" * 70)
    
finally:
    conn.close()

