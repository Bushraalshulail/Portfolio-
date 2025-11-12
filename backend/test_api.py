"""Test script to verify API endpoints return data"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

print("=" * 60)
print("API ENDPOINT TESTS")
print("=" * 60)

# Test health endpoint
print("\n1. Testing /health endpoint...")
try:
    response = requests.get(f"{BASE_URL}/health")
    if response.status_code == 200:
        data = response.json()
        print(f"   [OK] Health check passed")
        print(f"   Status: {data.get('status')}")
        print(f"   Gyms: {data.get('gyms')}")
        print(f"   Facilities: {data.get('facilities')}")
        print(f"   Equipment: {data.get('equipment')}")
    else:
        print(f"   [ERROR] Health check failed: {response.status_code}")
except Exception as e:
    print(f"   [ERROR] Could not connect: {e}")
    print("   Make sure the server is running: uvicorn app.main:app --reload")

# Test gyms endpoint
print("\n2. Testing /gyms endpoint...")
try:
    response = requests.get(f"{BASE_URL}/gyms")
    if response.status_code == 200:
        data = response.json()
        print(f"   [OK] Gyms endpoint successful")
        print(f"   Total gyms returned: {len(data)}")
        if len(data) > 0:
            sample = data[0]
            print(f"\n   Sample gym:")
            print(f"   - ID: {sample.get('id')}")
            print(f"   - Name (EN): {sample.get('name_en')}")
            print(f"   - Name (AR): {sample.get('name_ar')}")
            print(f"   - District: {sample.get('district')}")
            print(f"   - Facilities: {len(sample.get('facilities', []))}")
            print(f"   - Equipment: {len(sample.get('equipment', []))}")
            
            # Check if facilities/equipment are properly loaded
            if sample.get('facilities'):
                print(f"   - Sample facility: {sample['facilities'][0].get('name_en') if isinstance(sample['facilities'][0], dict) else sample['facilities'][0]}")
        else:
            print(f"   [WARNING] No gyms returned!")
    else:
        print(f"   [ERROR] Gyms endpoint failed: {response.status_code}")
        print(f"   Response: {response.text}")
except Exception as e:
    print(f"   [ERROR] Could not connect: {e}")

print("\n" + "=" * 60)
print("TESTS COMPLETE")
print("=" * 60)
print("\nTo test frontend:")
print("1. Start backend: cd backend && .venv\\Scripts\\python.exe -m uvicorn app.main:app --reload")
print("2. Start frontend: cd frontend && npm run dev")
print("3. Open browser console and check for errors")

