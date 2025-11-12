# Fix: Frontend Not Connecting to Backend

## Prerequisites

**BEFORE connecting frontend:**
1. ✅ Backend server MUST be running
2. ✅ Server accessible at: `http://127.0.0.1:8000`
3. ✅ Database has data (202 gyms)

## Step 1: Verify Backend is Running

**Open browser:** `http://127.0.0.1:8000`

**Should see:**
```json
{"status":"ok","message":"Gym Finder API is running"}
```

**If NOT working:**
- See `FIX_SERVER.md` for how to start server
- Server must be running FIRST!

## Step 2: Check API Configuration

**File:** `frontend/src/config/api.js`

**Should have:**
```javascript
const API_BASE_URL = 'http://127.0.0.1:8000';
```

**Verify it's correct:**
1. Open file: `frontend/src/config/api.js`
2. Check line 2: `const API_BASE_URL = 'http://127.0.0.1:8000';`
3. Should match your backend server URL

## Step 3: Start Frontend

1. Open **NEW terminal** (keep backend terminal open!)
2. Navigate to frontend:
   ```powershell
   cd "C:\Users\HP\Downloads\Telegram Desktop\Gym Finder Riyadh Design\frontend"
   ```
3. Start frontend:
   ```powershell
   npm run dev
   ```
4. Wait for: `Local: http://localhost:5173/`
5. Open browser: `http://localhost:5173`

## Step 4: Check Browser Console

1. Open browser: `http://localhost:5173`
2. Press **F12** (Developer Tools)
3. Go to **Console** tab
4. Look for errors:

### If you see "Failed to fetch" or "Network error":
- ✅ Backend server is NOT running
- **Fix:** Start backend server (see FIX_SERVER.md)

### If you see CORS error:
- ✅ CORS is misconfigured (should be fixed already)
- **Fix:** Check `backend/app/main.py` has `allow_origins=["*"]`

### If you see no errors but no data:
- Check Network tab (see Step 5)

## Step 5: Check Network Tab

1. In DevTools, go to **Network** tab
2. Refresh page (F5)
3. Look for request: **`gyms`** or **`127.0.0.1:8000/gyms`**
4. Click on it
5. Check:

   **Request URL:** Should be `http://127.0.0.1:8000/gyms`
   
   **Status:** Should be **200 OK**
   
   **Response:** Should show JSON array with gyms
   ```json
   [
     {
       "id": 1,
       "name_en": "Fitness Time",
       "name_ar": "...",
       "district": "...",
       "facilities": [...],
       "equipment": [...]
     },
     ...
   ]
   ```

### If Status is 404:
- Check API endpoint URL in `api.js`
- Should be: `http://127.0.0.1:8000/gyms` (no trailing slash)

### If Status is 500:
- Backend error
- Check backend terminal for error messages

### If Request doesn't appear:
- Frontend not calling API
- Check `frontend/src/pages/Gyms.jsx` - should call `gymAPI.getAll()`

## Step 6: Test API Directly

**Test in browser:**
```
http://127.0.0.1:8000/gyms
```

**Should return:** JSON array with 202 gyms

**If this works but frontend doesn't:**
- Frontend configuration issue
- Check API URL in `frontend/src/config/api.js`

## Quick Diagnostic Commands

```powershell
# Test if backend is running
cd backend
.venv\Scripts\python.exe test_server.py

# View database contents
.venv\Scripts\python.exe show_db_data.py
```

## Complete Workflow

### Terminal 1: Backend
```powershell
cd backend
.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```
**Keep this open!**

### Terminal 2: Frontend  
```powershell
cd frontend
npm run dev
```
**Keep this open!**

### Browser:
- Open: `http://localhost:5173`
- Check console (F12)
- Should see gyms loading

