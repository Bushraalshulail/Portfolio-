import sqlite3
import requests

conn = sqlite3.connect('gym_finder.db')
cursor = conn.cursor()

# Get gyms with logo URLs
cursor.execute('SELECT id, name_en, name_ar, logo_url FROM gyms WHERE logo_url IS NOT NULL AND logo_url != "" LIMIT 5')
gyms_with_logos = cursor.fetchall()

print(f"Found {len(gyms_with_logos)} gyms with logo URLs:")
print("=" * 70)

for gym_id, name_en, name_ar, logo_url in gyms_with_logos:
    print(f"\nID: {gym_id}")
    print(f"Name (EN): {name_en}")
    print(f"Name (AR): {name_ar}")
    print(f"Logo URL: {logo_url}")
    
    # Test if URL is accessible
    try:
        response = requests.head(logo_url, timeout=5, allow_redirects=True)
        if response.status_code == 200:
            print(f"[OK] URL is accessible (Status: {response.status_code})")
        else:
            print(f"[WARN] URL returned status: {response.status_code}")
    except Exception as e:
        print(f"[ERROR] URL check failed: {e}")

conn.close()
