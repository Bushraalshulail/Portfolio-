"""
Create all database tables based on SQLAlchemy models
This ensures the database schema matches the models exactly
"""
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent.absolute()
sys.path.insert(0, str(backend_dir))

from app.database import Base, engine
from app import models  # Import all models to register them

print("=" * 70)
print("CREATING DATABASE TABLES")
print("=" * 70)

try:
    # This will create all tables defined in models
    print("\nCreating all tables based on models...")
    Base.metadata.create_all(bind=engine)
    print("[SUCCESS] All tables created successfully!")
    
    # Verify tables were created
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    print(f"\nTables in database:")
    for table in sorted(tables):
        print(f"  ✓ {table}")
    
    print("\n" + "=" * 70)
    print("DATABASE SCHEMA CREATED")
    print("=" * 70)
    print("\nYou can now:")
    print("  1. Run: python import_gyms.py (to import gym data)")
    print("  2. Start server: python -m uvicorn app.main:app --reload")
    
except Exception as e:
    print(f"\n[ERROR] Failed to create tables: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
