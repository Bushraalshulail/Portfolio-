# Quick Start Guide - Fix Your Issues

## Issue 1: Database Shows Empty in DB Browser

### The Problem:
- Database HAS data (202 gyms confirmed)
- But DB Browser shows empty

### The Solution:

**STEP 1: Find the EXACT database file**

Run this command in backend folder:
```powershell
.venv\Scripts\python.exe show_db_data.py
```

This will show you the EXACT path to open.

**STEP 2: Open in DB Browser**

1. Open **DB Browser for SQLite**
2. Click **File → Open Database**
3. Copy and paste this EXACT path:
   ```
   C:\Users\HP\Downloads\Telegram Desktop\Gym Finder Riyadh Design\backend\gym_finder.db
   ```
4. Click **Open**

**STEP 3: If still empty, refresh:**

1. In DB Browser, go to **"Browse Data"** tab
2. Select table: `gyms`
3. Click **Refresh** button (or close and reopen DB Browser)
4. You should see 202 rows

**OR use SQL query:**
Go to "Execute SQL" tab and run:
```sql
SELECT COUNT(*) FROM gyms;
-- Should return 202
```

---

## Issue 2: Server Not Running (http://127.0.0.1:8000 not working)

### The Problem:
- Server needs to be started manually
- Frontend can't connect because server is down

### The Solution:

**METHOD 1: Using Batch File (Easiest)**

1. Go to `backend` folder
2. Double-click `start_server.bat`
3. Keep terminal window open
4. Wait for: `Uvicorn running on http://127.0.0.1:8000`

**METHOD 2: Manual Command**

1. Open terminal/PowerShell
2. Go to backend folder:
   ```powershell
   cd "C:\Users\HP\Downloads\Telegram Desktop\Gym Finder Riyadh Design\backend"
   ```
3. Start server:
   ```powershell
   .venv\Scripts\python.exe -m uvicorn app.main:app --reload
   ```
4. Keep terminal open (don't close it!)

**VERIFY SERVER IS RUNNING:**

Open browser: `http://127.0.0.1:8000`

Should see: `{"status":"ok","message":"Gym Finder API is running"}`

---

## Issue 3: Frontend Not Connecting

### The Problem:
- Frontend tries to connect but fails
- Browser console shows errors

### The Solution:

**STEP 1: Make sure backend is running**

Run this in backend folder:
```powershell
.venv\Scripts\python.exe test_server.py
```

If it says "Cannot connect", the server is NOT running. Start it first!

**STEP 2: Check API URL**

Verify `frontend/src/config/api.js` has:
```javascript
const API_BASE_URL = 'http://127.0.0.1:8000';
```

**STEP 3: Start Frontend**

1. Open NEW terminal
2. Go to frontend folder:
   ```powershell
   cd "C:\Users\HP\Downloads\Telegram Desktop\Gym Finder Riyadh Design\frontend"
   ```
3. Start frontend:
   ```powershell
   npm run dev
   ```

**STEP 4: Check Browser Console**

1. Open browser: `http://localhost:5173`
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Check for errors:
   - If you see CORS errors → Backend CORS is misconfigured (should be fixed)
   - If you see "Failed to fetch" → Backend server is not running
   - If you see network errors → Check API URL

**STEP 5: Check Network Tab**

1. In DevTools, go to **Network** tab
2. Refresh page
3. Look for request to `/gyms`
4. Click on it
5. Check:
   - Status should be **200 OK**
   - Response should show JSON with gyms array

---

## Complete Step-by-Step Workflow

### Terminal 1: Backend Server
```powershell
cd backend
.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```
**Wait for:** `Uvicorn running on http://127.0.0.1:8000`

### Terminal 2: Frontend
```powershell
cd frontend
npm run dev
```
**Wait for:** `Local: http://localhost:5173/`

### Browser:
1. Open: `http://localhost:5173`
2. Check console (F12)
3. Should see gyms loading

---

## Quick Verification Commands

```powershell
# Test database
cd backend
.venv\Scripts\python.exe show_db_data.py

# Test server (must be running first!)
.venv\Scripts\python.exe test_server.py

# Verify database directly
.venv\Scripts\python.exe verify_db.py
```

---

## Common Issues & Fixes

### "ModuleNotFoundError" when starting server
```powershell
cd backend
.venv\Scripts\python.exe -m pip install -r requirements.txt
```

### "Port 8000 already in use"
- Close other terminal windows
- Or kill the process using port 8000

### "Database locked" error
- Close DB Browser completely
- Then start server

### Frontend shows "Loading..." forever
- Check if backend is running
- Check browser console for errors
- Verify API URL in `frontend/src/config/api.js`

---

## Need Help?

Run these diagnostics:

1. **Database check:**
   ```powershell
   .venv\Scripts\python.exe verify_db.py
   ```

2. **Server check (after starting server):**
   ```powershell
   .venv\Scripts\python.exe test_server.py
   ```

3. **View database contents:**
   ```powershell
   .venv\Scripts\python.exe show_db_data.py
   ```

