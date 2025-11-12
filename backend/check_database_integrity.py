"""
Comprehensive database integrity check
Checks for data issues, orphaned records, and inconsistencies
"""
import sqlite3
from pathlib import Path

_backend_dir = Path(__file__).parent.absolute()
DB_PATH = _backend_dir / "gym_finder.db"

print("=" * 70)
print("DATABASE INTEGRITY CHECK")
print("=" * 70)
print(f"\nDatabase: {DB_PATH}\n")

conn = sqlite3.connect(str(DB_PATH))
cursor = conn.cursor()

issues = []
warnings = []

try:
    # 1. Check orphaned gym_facility relationships
    print("1. Checking gym-facility relationships...")
    cursor.execute("""
        SELECT COUNT(*) FROM gym_facility gf
        LEFT JOIN gyms g ON gf.gym_id = g.id
        LEFT JOIN facilities f ON gf.facility_id = f.id
        WHERE g.id IS NULL OR f.id IS NULL
    """)
    orphaned = cursor.fetchone()[0]
    if orphaned > 0:
        issues.append(f"Found {orphaned} orphaned gym-facility relationships")
        print(f"  [ISSUE] {orphaned} orphaned relationships found")
    else:
        print(f"  [OK] All gym-facility relationships are valid")
    
    # 2. Check orphaned gym_equipment relationships
    print("\n2. Checking gym-equipment relationships...")
    cursor.execute("""
        SELECT COUNT(*) FROM gym_equipment ge
        LEFT JOIN gyms g ON ge.gym_id = g.id
        LEFT JOIN equipment e ON ge.equipment_id = e.id
        WHERE g.id IS NULL OR e.id IS NULL
    """)
    orphaned = cursor.fetchone()[0]
    if orphaned > 0:
        issues.append(f"Found {orphaned} orphaned gym-equipment relationships")
        print(f"  [ISSUE] {orphaned} orphaned relationships found")
    else:
        print(f"  [OK] All gym-equipment relationships are valid")
    
    # 3. Check gyms without facilities or equipment
    print("\n3. Checking gyms without facilities/equipment...")
    cursor.execute("""
        SELECT COUNT(*) FROM gyms g
        LEFT JOIN gym_facility gf ON g.id = gf.gym_id
        LEFT JOIN gym_equipment ge ON g.id = ge.gym_id
        WHERE gf.gym_id IS NULL AND ge.gym_id IS NULL
    """)
    empty_gyms = cursor.fetchone()[0]
    if empty_gyms > 0:
        warnings.append(f"Found {empty_gyms} gyms without facilities or equipment")
        print(f"  [WARNING] {empty_gyms} gyms have no facilities or equipment")
    else:
        print(f"  [OK] All gyms have facilities or equipment")
    
    # 4. Check for NULL critical fields in gyms
    print("\n4. Checking gyms for missing critical data...")
    cursor.execute("SELECT COUNT(*) FROM gyms WHERE name_en IS NULL OR name_en = ''")
    missing_names = cursor.fetchone()[0]
    if missing_names > 0:
        issues.append(f"Found {missing_names} gyms without English names")
        print(f"  [ISSUE] {missing_names} gyms missing name_en")
    else:
        print(f"  [OK] All gyms have English names")
    
    # 5. Check for duplicate facilities
    print("\n5. Checking for duplicate facilities...")
    cursor.execute("""
        SELECT name_en, COUNT(*) as cnt FROM facilities
        GROUP BY name_en
        HAVING cnt > 1
    """)
    duplicates = cursor.fetchall()
    if duplicates:
        for name, count in duplicates:
            issues.append(f"Duplicate facility: {name} ({count} times)")
        print(f"  [ISSUE] Found {len(duplicates)} duplicate facilities")
    else:
        print(f"  [OK] No duplicate facilities")
    
    # 6. Check for duplicate equipment
    print("\n6. Checking for duplicate equipment...")
    cursor.execute("""
        SELECT name_en, COUNT(*) as cnt FROM equipment
        GROUP BY name_en
        HAVING cnt > 1
    """)
    duplicates = cursor.fetchall()
    if duplicates:
        for name, count in duplicates:
            issues.append(f"Duplicate equipment: {name} ({count} times)")
        print(f"  [ISSUE] Found {len(duplicates)} duplicate equipment")
    else:
        print(f"  [OK] No duplicate equipment")
    
    # 7. Check gym suggestions integrity
    print("\n7. Checking gym suggestions...")
    cursor.execute("SELECT COUNT(*) FROM gym_suggestions WHERE user_id IS NOT NULL")
    suggestions_with_user = cursor.fetchone()[0]
    
    cursor.execute("""
        SELECT COUNT(*) FROM gym_suggestions gs
        LEFT JOIN users u ON gs.user_id = u.id
        WHERE gs.user_id IS NOT NULL AND u.id IS NULL
    """)
    orphaned_suggestions = cursor.fetchone()[0]
    if orphaned_suggestions > 0:
        issues.append(f"Found {orphaned_suggestions} suggestions with invalid user_id")
        print(f"  [ISSUE] {orphaned_suggestions} suggestions have invalid user_id")
    else:
        print(f"  [OK] All suggestions have valid user references")
    
    # 8. Check contact messages integrity
    print("\n8. Checking contact messages...")
    cursor.execute("""
        SELECT COUNT(*) FROM contact_messages cm
        LEFT JOIN users u ON cm.user_id = u.id
        WHERE cm.user_id IS NOT NULL AND u.id IS NULL
    """)
    orphaned_messages = cursor.fetchone()[0]
    if orphaned_messages > 0:
        issues.append(f"Found {orphaned_messages} contact messages with invalid user_id")
        print(f"  [ISSUE] {orphaned_messages} messages have invalid user_id")
    else:
        print(f"  [OK] All contact messages have valid user references")
    
    # 9. Check database file integrity
    print("\n9. Checking database file integrity...")
    cursor.execute("PRAGMA integrity_check")
    integrity = cursor.fetchone()[0]
    if integrity == 'ok':
        print(f"  [OK] Database integrity check passed")
    else:
        issues.append(f"Database integrity check failed: {integrity}")
        print(f"  [ISSUE] Integrity check: {integrity}")
    
    # 10. Check foreign keys are enabled
    print("\n10. Checking foreign key enforcement...")
    cursor.execute("PRAGMA foreign_keys")
    fk_enabled = cursor.fetchone()[0]
    if fk_enabled:
        print(f"  [OK] Foreign keys are enabled")
    else:
        warnings.append("Foreign keys are not enabled (SQLite default)")
        print(f"  [WARNING] Foreign keys are not enabled")
    
    # Summary
    print("\n" + "=" * 70)
    print("INTEGRITY CHECK SUMMARY")
    print("=" * 70)
    
    if issues:
        print(f"\n[ISSUES FOUND: {len(issues)}]")
        for issue in issues:
            print(f"  ✗ {issue}")
    else:
        print("\n[OK] No critical issues found!")
    
    if warnings:
        print(f"\n[WARNINGS: {len(warnings)}]")
        for warning in warnings:
            print(f"  ! {warning}")
    
    if not issues and not warnings:
        print("\n✓ Database integrity is excellent!")
        print("  All relationships are valid")
        print("  No orphaned records found")
        print("  No data inconsistencies detected")
    
    print("\n" + "=" * 70)
    
except sqlite3.Error as e:
    print(f"\n[ERROR] SQLite error: {e}")
except Exception as e:
    print(f"\n[ERROR] Unexpected error: {e}")
    import traceback
    traceback.print_exc()
finally:
    conn.close()
