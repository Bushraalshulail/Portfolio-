# Verification Steps

## 1. Database Path Verification

The database MUST be located at: `backend/gym_finder.db`

To verify the path:
```python
from app.config import settings
print(settings.DATABASE_URL)
```

Should show: `sqlite:///C:/Users/HP/Downloads/Telegram Desktop/Gym Finder Riyadh Design/backend/gym_finder.db`

## 2. Import Data

Run the import script:
```powershell
cd backend
.venv\Scripts\python.exe import_gyms.py
```

Expected output:
- "SUCCESS! Added X gyms, Y facilities, Z equipment"
- "Database contains: X gyms, Y facilities, Z equipment"

## 3. Verify Database in DB Browser

1. Open DB Browser for SQLite
2. Open: `backend/gym_finder.db`
3. Run queries:
   ```sql
   SELECT COUNT(*) FROM gyms;
   SELECT COUNT(*) FROM facilities;
   SELECT COUNT(*) FROM equipment;
   ```
4. Should show > 0 for each

## 4. Start Backend Server

```powershell
cd backend
.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Check startup logs for:
- `[CONFIG] Database URL: sqlite:///...`
- No errors about templates

## 5. Test API Endpoints

### Test /gyms endpoint:
```bash
curl http://127.0.0.1:8000/gyms
```

Or in browser: http://127.0.0.1:8000/gyms

Should return JSON array with gyms including facilities and equipment.

### Test /admin/login:
Open browser: http://127.0.0.1:8000/admin/login

Should show login page (no template errors).

## 6. Test Frontend Connection

1. Start frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. Check browser console for API errors
3. Verify gyms load in the frontend

## 7. Common Issues

### Database empty after import:
- Check that `db.commit()` is called
- Verify no rollback occurred
- Check database path is correct

### Template not found:
- Verify templates exist in `backend/app/templates/`
- Check admin.py template directory path

### CORS errors:
- Check main.py has `allow_origins=["*"]`
- Verify frontend URL matches API_BASE_URL

### API returns empty:
- Check database has data
- Verify `list_gyms()` uses `joinedload()` for relationships
- Check GymOut schema includes facilities and equipment

