"""Test if server is running and accessible"""
import requests
import sys

BASE_URL = "http://127.0.0.1:8000"

print("=" * 60)
print("TESTING SERVER CONNECTION")
print("=" * 60)

# Test root endpoint
print("\n1. Testing root endpoint (/)...")
try:
    response = requests.get(f"{BASE_URL}/", timeout=2)
    if response.status_code == 200:
        print(f"   [SUCCESS] Server is running!")
        print(f"   Response: {response.json()}")
    else:
        print(f"   [ERROR] Server returned status {response.status_code}")
except requests.exceptions.ConnectionError:
    print("   [ERROR] Cannot connect to server!")
    print("   Server is NOT running.")
    print("\n   TO START SERVER:")
    print("   1. Open terminal in backend folder")
    print("   2. Run: .venv\\Scripts\\python.exe -m uvicorn app.main:app --reload")
    print("   3. Or double-click: start_server.bat")
    sys.exit(1)
except Exception as e:
    print(f"   [ERROR] {e}")
    sys.exit(1)

# Test health endpoint
print("\n2. Testing /health endpoint...")
try:
    response = requests.get(f"{BASE_URL}/health", timeout=2)
    if response.status_code == 200:
        data = response.json()
        print(f"   [SUCCESS] Health check passed")
        print(f"   Database: {data.get('database')}")
        print(f"   Gyms: {data.get('gyms')}")
        print(f"   Facilities: {data.get('facilities')}")
        print(f"   Equipment: {data.get('equipment')}")
except Exception as e:
    print(f"   [ERROR] {e}")

# Test gyms endpoint
print("\n3. Testing /gyms endpoint...")
try:
    response = requests.get(f"{BASE_URL}/gyms", timeout=5)
    if response.status_code == 200:
        data = response.json()
        print(f"   [SUCCESS] Gyms endpoint working")
        print(f"   Total gyms returned: {len(data)}")
        if len(data) > 0:
            print(f"   First gym: {data[0].get('name_en')}")
    else:
        print(f"   [ERROR] Status {response.status_code}: {response.text}")
except Exception as e:
    print(f"   [ERROR] {e}")

print("\n" + "=" * 60)
print("If all tests passed, your server is working correctly!")
print("Frontend should be able to connect.")
print("=" * 60)

