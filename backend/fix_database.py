"""
Comprehensive database fix script
Checks and fixes all database structure issues
"""
import sqlite3
from pathlib import Path
from sqlalchemy import inspect
from sqlalchemy.engine import create_engine

# Get database path
_backend_dir = Path(__file__).parent.absolute()
DB_PATH = _backend_dir / "gym_finder.db"

print("=" * 70)
print("DATABASE FIX SCRIPT")
print("=" * 70)
print(f"\nDatabase file: {DB_PATH}")
print(f"File exists: {DB_PATH.exists()}")

if not DB_PATH.exists():
    print("\n[ERROR] Database file not found!")
    print("Database will be created when server starts or import script runs.")
    exit(1)

print(f"File size: {DB_PATH.stat().st_size:,} bytes\n")

# Connect to database
conn = sqlite3.connect(str(DB_PATH))
cursor = conn.cursor()

issues_found = []
fixes_applied = []

try:
    # 1. Check if all required tables exist
    print("Step 1: Checking tables...")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    existing_tables = {row[0] for row in cursor.fetchall()}
    
    required_tables = {
        'users', 'gyms', 'facilities', 'equipment', 
        'gym_facility', 'gym_equipment', 
        'gym_suggestions', 'contact_messages'
    }
    
    missing_tables = required_tables - existing_tables
    if missing_tables:
        issues_found.append(f"Missing tables: {', '.join(missing_tables)}")
        print(f"  [ISSUE] Missing tables: {', '.join(missing_tables)}")
    else:
        print(f"  [OK] All required tables exist")
    
    # 2. Check users table columns
    print("\nStep 2: Checking users table structure...")
    if 'users' in existing_tables:
        cursor.execute("PRAGMA table_info(users)")
        user_columns = {row[1] for row in cursor.fetchall()}
        
        required_user_columns = {
            'id', 'name', 'email', 'password', 'favorite_food',
            'role', 'email_verified', 'created_at'
        }
        
        missing_columns = required_user_columns - user_columns
        if missing_columns:
            issues_found.append(f"Users table missing columns: {', '.join(missing_columns)}")
            print(f"  [ISSUE] Missing columns: {', '.join(missing_columns)}")
            
            # Fix: Add missing columns
            for col in missing_columns:
                if col == 'favorite_food':
                    try:
                        cursor.execute("ALTER TABLE users ADD COLUMN favorite_food VARCHAR")
                        fixes_applied.append(f"Added column 'favorite_food' to users table")
                        print(f"  [FIX] Added column 'favorite_food'")
                    except sqlite3.OperationalError as e:
                        if "duplicate column" not in str(e).lower():
                            print(f"  [ERROR] Could not add favorite_food: {e}")
                elif col == 'role':
                    try:
                        cursor.execute("ALTER TABLE users ADD COLUMN role VARCHAR DEFAULT 'user'")
                        fixes_applied.append(f"Added column 'role' to users table")
                        print(f"  [FIX] Added column 'role'")
                    except sqlite3.OperationalError:
                        pass
                elif col == 'email_verified':
                    try:
                        cursor.execute("ALTER TABLE users ADD COLUMN email_verified VARCHAR DEFAULT 'no'")
                        fixes_applied.append(f"Added column 'email_verified' to users table")
                        print(f"  [FIX] Added column 'email_verified'")
                    except sqlite3.OperationalError:
                        pass
                elif col == 'created_at':
                    try:
                        cursor.execute("ALTER TABLE users ADD COLUMN created_at DATETIME")
                        fixes_applied.append(f"Added column 'created_at' to users table")
                        print(f"  [FIX] Added column 'created_at'")
                    except sqlite3.OperationalError:
                        pass
        else:
            print(f"  [OK] All required columns exist in users table")
    
    # 3. Check gyms table columns
    print("\nStep 3: Checking gyms table structure...")
    if 'gyms' in existing_tables:
        cursor.execute("PRAGMA table_info(gyms)")
        gym_columns = {row[1] for row in cursor.fetchall()}
        
        required_gym_columns = {
            'id', 'name_ar', 'name_en', 'gender', 'district',
            'website', 'phone', 'description', 'rating',
            'opening_hours', 'logo_url', 'added_by', 'created_at'
        }
        
        missing_columns = required_gym_columns - gym_columns
        if missing_columns:
            issues_found.append(f"Gyms table missing columns: {', '.join(missing_columns)}")
            print(f"  [ISSUE] Missing columns: {', '.join(missing_columns)}")
            
            # Fix: Add missing columns
            for col in missing_columns:
                if col == 'logo_url':
                    try:
                        cursor.execute("ALTER TABLE gyms ADD COLUMN logo_url VARCHAR")
                        fixes_applied.append(f"Added column 'logo_url' to gyms table")
                        print(f"  [FIX] Added column 'logo_url'")
                    except sqlite3.OperationalError:
                        pass
                elif col == 'added_by':
                    try:
                        cursor.execute("ALTER TABLE gyms ADD COLUMN added_by INTEGER")
                        fixes_applied.append(f"Added column 'added_by' to gyms table")
                        print(f"  [FIX] Added column 'added_by'")
                    except sqlite3.OperationalError:
                        pass
                elif col == 'created_at':
                    try:
                        cursor.execute("ALTER TABLE gyms ADD COLUMN created_at DATETIME")
                        fixes_applied.append(f"Added column 'created_at' to gyms table")
                        print(f"  [FIX] Added column 'created_at'")
                    except sqlite3.OperationalError:
                        pass
        else:
            print(f"  [OK] All required columns exist in gyms table")
    
    # 4. Check indexes
    print("\nStep 4: Checking indexes...")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='index' AND sql IS NOT NULL")
    indexes = {row[0] for row in cursor.fetchall()}
    
    # Try to create indexes if missing (not critical but improves performance)
    if 'ix_users_email' not in indexes:
        try:
            cursor.execute("CREATE INDEX IF NOT EXISTS ix_users_email ON users(email)")
            fixes_applied.append("Created index on users.email")
            print(f"  [FIX] Created index on users.email")
        except sqlite3.OperationalError:
            pass
    
    if 'ix_gyms_id' not in indexes:
        try:
            cursor.execute("CREATE INDEX IF NOT EXISTS ix_gyms_id ON gyms(id)")
            fixes_applied.append("Created index on gyms.id")
            print(f"  [FIX] Created index on gyms.id")
        except sqlite3.OperationalError:
            pass
    
    # 5. Check foreign key constraints (verify integrity)
    print("\nStep 5: Checking foreign key constraints...")
    cursor.execute("PRAGMA foreign_key_check")
    fk_issues = cursor.fetchall()
    
    if fk_issues:
        issues_found.append(f"Foreign key constraint violations found: {len(fk_issues)}")
        print(f"  [WARNING] Found {len(fk_issues)} foreign key constraint violations")
        for issue in fk_issues[:5]:  # Show first 5
            print(f"    - {issue}")
    else:
        print(f"  [OK] No foreign key constraint violations")
    
    # 6. Verify data counts
    print("\nStep 6: Verifying data counts...")
    if 'gyms' in existing_tables:
        cursor.execute("SELECT COUNT(*) FROM gyms")
        gym_count = cursor.fetchone()[0]
        print(f"  Gyms: {gym_count}")
        if gym_count == 0:
            issues_found.append("No gyms found in database")
    
    if 'facilities' in existing_tables:
        cursor.execute("SELECT COUNT(*) FROM facilities")
        facility_count = cursor.fetchone()[0]
        print(f"  Facilities: {facility_count}")
    
    if 'equipment' in existing_tables:
        cursor.execute("SELECT COUNT(*) FROM equipment")
        equipment_count = cursor.fetchone()[0]
        print(f"  Equipment: {equipment_count}")
    
    # Commit all fixes
    if fixes_applied:
        conn.commit()
        print(f"\n  [SUCCESS] Committed {len(fixes_applied)} fixes to database")
    
    # Summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    
    if issues_found:
        print(f"\nIssues found: {len(issues_found)}")
        for issue in issues_found:
            print(f"  - {issue}")
    else:
        print("\n[OK] No issues found!")
    
    if fixes_applied:
        print(f"\nFixes applied: {len(fixes_applied)}")
        for fix in fixes_applied:
            print(f"  ✓ {fix}")
    else:
        print("\n[OK] No fixes needed")
    
    print("\n" + "=" * 70)
    print("DATABASE FIX COMPLETE")
    print("=" * 70)
    
    if missing_tables:
        print("\n[IMPORTANT] Missing tables detected!")
        print("Run one of these to create tables:")
        print("  1. Start the server: python -m uvicorn app.main:app")
        print("  2. Run import: python import_gyms.py")
        print("  3. Run: python -c 'from app.database import Base, engine; Base.metadata.create_all(engine)'")
    
except sqlite3.Error as e:
    print(f"\n[ERROR] SQLite error: {e}")
    conn.rollback()
except Exception as e:
    print(f"\n[ERROR] Unexpected error: {e}")
    import traceback
    traceback.print_exc()
    conn.rollback()
finally:
    conn.close()
