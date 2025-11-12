# Complete Setup Guide - Gym Finder

## ✅ Current Status

**Database is POPULATED:**
- ✅ 202 gyms
- ✅ 74 facilities  
- ✅ 52 equipment items
- ✅ Database file: `backend/gym_finder.db`

**Database Path (Absolute):**
```
C:\Users\HP\Downloads\Telegram Desktop\Gym Finder Riyadh Design\backend\gym_finder.db
```

## 🚀 Step-by-Step Setup

### Step 1: Verify Database (IMPORTANT!)

**Open in DB Browser:**
1. Open **DB Browser for SQLite**
2. File → Open Database
3. Navigate to: `backend\gym_finder.db`
4. **EXACT PATH:** `C:\Users\HP\Downloads\Telegram Desktop\Gym Finder Riyadh Design\backend\gym_finder.db`

**Verify Data:**
- Go to "Browse Data" tab
- Select table `gyms` → Should show 202 rows
- Run SQL: `SELECT COUNT(*) FROM gyms;` → Should return 202

### Step 2: Start Backend Server

```powershell
cd backend
.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

**Expected Output:**
```
[CONFIG] Database URL: sqlite:///C:/Users/.../backend/gym_finder.db
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Step 3: Test API Endpoints

**Open in Browser:**

1. **Health Check:**
   ```
   http://127.0.0.1:8000/health
   ```
   Should show: `{"status": "healthy", "gyms": 202, ...}`

2. **Gyms API:**
   ```
   http://127.0.0.1:8000/gyms
   ```
   Should return JSON array with 202 gyms

3. **API Docs:**
   ```
   http://127.0.0.1:8000/docs
   ```

### Step 4: Start Frontend

**In a NEW terminal:**
```powershell
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Step 5: Test Frontend Connection

1. Open browser: `http://localhost:5173`
2. Open **Developer Console** (F12)
3. Check **Console** tab for errors
4. Check **Network** tab - look for request to `/gyms`
5. Verify gyms are displayed on the page

### Step 6: Test Admin Panel

1. Open: `http://127.0.0.1:8000/admin/login`
2. Login with superadmin credentials
3. Should see dashboard with statistics

## 🔧 Troubleshooting

### Database Shows Empty in DB Browser

**Solution:**
- Make sure you're opening the correct file: `backend\gym_finder.db`
- Close DB Browser before running import scripts
- Re-run: `.venv\Scripts\python.exe import_gyms.py`

### Frontend Shows No Gyms

**Check:**
1. Backend server is running (Step 2)
2. API endpoint works: `http://127.0.0.1:8000/gyms`
3. Browser console shows CORS errors? (Should be none)
4. Network tab shows successful request to `/gyms`

**Fix:**
- Check `frontend/src/config/api.js` - URL should be `http://127.0.0.1:8000`
- Verify CORS is enabled in `backend/app/main.py`

### API Returns Empty Array

**Check:**
1. Run: `.venv\Scripts\python.exe verify_db.py`
2. Should show: Gyms: 202
3. Check `/health` endpoint

**Fix:**
- Re-run import: `.venv\Scripts\python.exe import_gyms.py`
- Verify database path in config

## 📋 Quick Verification Commands

```powershell
# Verify database
cd backend
.venv\Scripts\python.exe verify_db.py

# Test API (after starting server)
python test_api.py

# Re-import data if needed
.venv\Scripts\python.exe import_gyms.py
```

## 🎯 Expected Results

✅ Database: 202 gyms, 74 facilities, 52 equipment  
✅ Backend: Running on http://127.0.0.1:8000  
✅ API: `/gyms` returns JSON with all gyms  
✅ Frontend: Displays gyms from API  
✅ Admin: Login and dashboard working  

## 📝 Important Notes

1. **Always close DB Browser** before running import scripts
2. **Database path is absolute** - always points to `backend/gym_finder.db`
3. **CORS is enabled** for all origins in development
4. **Relationships are eager loaded** - facilities and equipment included in API response

