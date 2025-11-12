"""
Script to add favorite_food column to existing users table.
Run this once to migrate the database schema.
"""
import sqlite3
from pathlib import Path

_backend_dir = Path(__file__).parent.absolute()
DB_PATH = _backend_dir / "gym_finder.db"

print("=" * 70)
print("DATABASE MIGRATION: Adding favorite_food column")
print("=" * 70)

if not DB_PATH.exists():
    print(f"ERROR: Database file not found at {DB_PATH}")
    print("The database will be created automatically on first run.")
    exit(1)

try:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if column already exists
    cursor.execute("PRAGMA table_info(users)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if 'favorite_food' in columns:
        print("Column 'favorite_food' already exists. Migration not needed.")
    else:
        print("Adding 'favorite_food' column to users table...")
        cursor.execute("ALTER TABLE users ADD COLUMN favorite_food VARCHAR")
        conn.commit()
        print("SUCCESS: Column 'favorite_food' added successfully!")
        
        # Update existing users with a default value (optional)
        cursor.execute("UPDATE users SET favorite_food = '' WHERE favorite_food IS NULL")
        conn.commit()
        print("Updated existing users with empty favorite_food value.")
    
    conn.close()
    print("\nMigration completed successfully!")
    print("=" * 70)
    
except sqlite3.Error as e:
    print(f"SQLite error: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")

