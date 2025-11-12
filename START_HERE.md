# 🚀 START HERE - Fix Your Issues

## ✅ Database Status
**GOOD NEWS:** Your database HAS 202 gyms! The data is there.

## 🔴 Problem 1: Database Appears Empty in DB Browser

### Quick Fix:
```powershell
cd backend
.venv\Scripts\python.exe show_db_data.py
```
This will show you the data. The database file is at:
```
C:\Users\HP\Downloads\Telegram Desktop\Gym Finder Riyadh Design\backend\gym_finder.db
```

**To view in DB Browser:**
1. Close DB Browser completely
2. Open DB Browser
3. File → Open Database
4. Navigate to: `backend\gym_finder.db`
5. Browse Data tab → Select table `gyms` → Should show 202 rows

---

## 🔴 Problem 2: Server Not Running (http://127.0.0.1:8000 not working)

### Quick Fix - Method 1 (EASIEST):
1. Go to `backend` folder
2. **Double-click:** `start_server.bat`
3. Wait for: `Uvicorn running on http://127.0.0.1:8000`
4. **Keep window open!**
5. Test: Open `http://127.0.0.1:8000` in browser

### Method 2 (Manual):
```powershell
cd backend
.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

**After starting, test in browser:**
- `http://127.0.0.1:8000` → Should show JSON
- `http://127.0.0.1:8000/gyms` → Should show 202 gyms

---

## 🔴 Problem 3: Frontend Not Connecting

### Step 1: Start Backend FIRST
- See Problem 2 above
- Backend MUST be running before frontend

### Step 2: Start Frontend
```powershell
cd frontend
npm run dev
```

### Step 3: Check Connection
1. Open: `http://localhost:5173`
2. Press **F12** (Console)
3. Check for errors:
   - If "Failed to fetch" → Backend not running (go back to Step 1)
   - If CORS error → Should be fixed already
   - If no errors → Check Network tab

### Step 4: Verify API Call
1. In browser, press **F12**
2. Go to **Network** tab
3. Refresh page
4. Look for request to `/gyms`
5. Click it → Should show 200 OK with gyms data

---

## 📋 Complete Workflow (Copy-Paste These Commands)

### Terminal 1: Start Backend
```powershell
cd "C:\Users\HP\Downloads\Telegram Desktop\Gym Finder Riyadh Design\backend"
.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```
**Wait for:** `INFO: Uvicorn running on http://127.0.0.1:8000`
**Keep this terminal open!**

### Terminal 2: Start Frontend
```powershell
cd "C:\Users\HP\Downloads\Telegram Desktop\Gym Finder Riyadh Design\frontend"
npm run dev
```
**Wait for:** `Local: http://localhost:5173/`
**Keep this terminal open!**

### Browser:
1. Open: `http://localhost:5173`
2. Open DevTools (F12)
3. Check Console tab for errors
4. Check Network tab for `/gyms` request

---

## ✅ Verification Checklist

- [ ] Database shows 202 gyms (run `show_db_data.py`)
- [ ] Server running (test `http://127.0.0.1:8000`)
- [ ] Server returns gyms (test `http://127.0.0.1:8000/gyms`)
- [ ] Frontend starts (test `http://localhost:5173`)
- [ ] Browser console shows no errors
- [ ] Network tab shows successful `/gyms` request
- [ ] Gyms display on frontend page

---

## 🆘 Still Not Working?

### Test Backend:
```powershell
cd backend
.venv\Scripts\python.exe test_server.py
```

### View Database:
```powershell
cd backend
.venv\Scripts\python.exe show_db_data.py
```

### Verify Database:
```powershell
cd backend
.venv\Scripts\python.exe verify_db.py
```

---

## 📝 Important Files Created

- `backend/start_server.bat` - Double-click to start server
- `backend/show_db_data.py` - View database contents
- `backend/test_server.py` - Test if server is running
- `backend/verify_db.py` - Verify database connection

