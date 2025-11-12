# How to Open Database in DB Browser

## Database Location

**EXACT PATH:**
```
C:\Users\HP\Downloads\Telegram Desktop\Gym Finder Riyadh Design\backend\gym_finder.db
```

## Steps to Open in DB Browser

1. Open **DB Browser for SQLite**
2. Click **"Open Database"**
3. Navigate to:
   ```
   C:\Users\HP\Downloads\Telegram Desktop\Gym Finder Riyadh Design\backend\
   ```
4. Select file: `gym_finder.db`
5. Click **Open**

## Verify Data

Once opened, go to **"Browse Data"** tab and select:
- Table: `gyms` → Should show 202 rows
- Table: `facilities` → Should show 74 rows
- Table: `equipment` → Should show 52 rows

## Run SQL Queries

Click **"Execute SQL"** tab and run:

```sql
-- Count all gyms
SELECT COUNT(*) as total_gyms FROM gyms;

-- Count all facilities
SELECT COUNT(*) as total_facilities FROM facilities;

-- Count all equipment
SELECT COUNT(*) as total_equipment FROM equipment;

-- View sample gyms with relationships
SELECT 
    g.id,
    g.name_en,
    g.name_ar,
    g.district,
    COUNT(DISTINCT gf.facility_id) as facility_count,
    COUNT(DISTINCT ge.equipment_id) as equipment_count
FROM gyms g
LEFT JOIN gym_facility gf ON g.id = gf.gym_id
LEFT JOIN gym_equipment ge ON g.id = ge.gym_id
GROUP BY g.id
LIMIT 10;
```

## Important Notes

- **Always close DB Browser** before running import scripts
- The database file is: `backend\gym_finder.db`
- File size should be ~200KB (contains 202 gyms)
- If DB Browser shows empty, you may have opened a different file

