import sqlite3

conn = sqlite3.connect('gym_finder.db')
cursor = conn.cursor()

# Count gyms with logos
cursor.execute('SELECT COUNT(*) FROM gyms WHERE logo_url IS NOT NULL AND logo_url != ""')
with_logos = cursor.fetchone()[0]

# Count gyms without logos
cursor.execute('SELECT COUNT(*) FROM gyms WHERE logo_url IS NULL OR logo_url = ""')
without_logos = cursor.fetchone()[0]

total = with_logos + without_logos

print("=" * 70)
print("Gym Logo Status Report")
print("=" * 70)
print(f"Total Gyms: {total}")
print(f"With Logos: {with_logos} ({with_logos*100//total}%)")
print(f"Without Logos: {without_logos} ({without_logos*100//total}%)")
print("=" * 70)

# Show gyms with logos
print("\nGyms WITH logos (sample of first 10):")
cursor.execute('SELECT id, name_en, name_ar FROM gyms WHERE logo_url IS NOT NULL AND logo_url != "" LIMIT 10')
for gym_id, name_en, name_ar in cursor.fetchall():
    print(f"  - ID {gym_id}: {name_en} / {name_ar}")

# Show gyms without logos
print("\nGyms WITHOUT logos (sample of first 10):")
cursor.execute('SELECT id, name_en, name_ar FROM gyms WHERE logo_url IS NULL OR logo_url = "" LIMIT 10')
for gym_id, name_en, name_ar in cursor.fetchall():
    print(f"  - ID {gym_id}: {name_en} / {name_ar}")

conn.close()
