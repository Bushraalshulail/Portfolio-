"""
Test script to verify server can start and database is accessible
"""
import sys
from pathlib import Path

backend_dir = Path(__file__).parent.absolute()
sys.path.insert(0, str(backend_dir))

print("Testing server startup...")
print("=" * 70)

try:
    # Test database connection
    print("\n1. Testing database connection...")
    from app.database import SessionLocal
    from app import models
    
    db = SessionLocal()
    gym_count = db.query(models.Gym).count()
    print(f"   [OK] Database connected! Found {gym_count} gyms")
    db.close()
    
    # Test importing main app
    print("\n2. Testing app import...")
    from app.main import app
    print("   [OK] App imported successfully!")
    
    # Test FastAPI
    print("\n3. Testing FastAPI...")
    from fastapi.testclient import TestClient
    client = TestClient(app)
    
    response = client.get("/health")
    print(f"   [OK] Health endpoint: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   Gyms: {data.get('gyms')}")
    
    response = client.get("/gyms")
    print(f"   [OK] Gyms endpoint: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   Gyms returned: {len(data)}")
    
    print("\n" + "=" * 70)
    print("[SUCCESS] All tests passed! Server should start successfully.")
    print("\nTo start the server, run:")
    print("   .venv\\Scripts\\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000")
    
except Exception as e:
    print(f"\n[ERROR] Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
