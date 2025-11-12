# Fix: Frontend Showing 0 Gyms

## Problem
The frontend displays "الأندية المتاحة (0)" (Available Clubs: 0) even though the database has 202 gyms.

## Root Cause
The backend server is not running, so the frontend cannot fetch gym data from the API.

## Solution

### Step 1: Start the Backend Server

**Option A: Using the batch file (Windows)**
```powershell
cd backend
.\start_server.bat
```

**Option B: Using command line**
```powershell
cd backend
..\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Step 2: Verify Backend is Running

Open your browser and go to:
- http://127.0.0.1:8000/health

You should see:
```json
{
  "status": "healthy",
  "database": "connected",
  "gyms": 202,
  "facilities": 74,
  "equipment": 52
}
```

### Step 3: Start the Frontend (if not already running)

**In a NEW terminal window:**
```powershell
cd frontend
npm run dev
```

### Step 4: Refresh the Frontend

1. Open the frontend in your browser
2. Open Developer Console (F12)
3. Check the Console tab for:
   - `API Request: http://127.0.0.1:8000/gyms GET`
   - `API Response: ... Status: 200 Data length: 202`
4. The gyms should now appear!

## Debugging

### Check Browser Console

Open Developer Tools (F12) and check:

1. **Console Tab:**
   - Look for `API Request:` messages
   - Look for error messages
   - If you see: `لا يمكن الاتصال بالخادم` - the backend is not running

2. **Network Tab:**
   - Filter by XHR/Fetch
   - Look for request to `/gyms`
   - Check if it shows "Failed" or "CORS error"

### Common Issues

#### Issue: Network Error
**Error:** `لا يمكن الاتصال بالخادم`

**Solution:**
- Make sure backend server is running
- Check the URL: http://127.0.0.1:8000
- Verify port 8000 is not used by another application

#### Issue: CORS Error
**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
- Check `backend/app/main.py` has CORS middleware enabled
- Verify `allow_origins=["*"]` is set

#### Issue: Empty Array Response
**Error:** API returns 200 but empty array `[]`

**Solution:**
- Check database has data: `python backend/fix_database.py`
- Verify backend can see gyms: http://127.0.0.1:8000/gyms
- Check backend logs for errors

## Verification Checklist

- [ ] Backend server is running on port 8000
- [ ] http://127.0.0.1:8000/health shows 202 gyms
- [ ] http://127.0.0.1:8000/gyms returns JSON array
- [ ] Frontend is running
- [ ] Browser console shows successful API calls
- [ ] No CORS errors in browser console

## Quick Test

Run this command to test the API directly:
```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:8000/gyms" | Select-Object -ExpandProperty Content
```

Should return JSON with 202 gyms.

## Summary

✅ **Backend running?** → Start with `start_server.bat`  
✅ **Database has 202 gyms?** → Verified ✓  
✅ **API endpoint working?** → Check http://127.0.0.1:8000/gyms  
✅ **Frontend connected?** → Check browser console  

Once the backend server is running, the frontend will automatically fetch and display all 202 gyms!
