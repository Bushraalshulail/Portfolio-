# Fix: Server Not Running (http://127.0.0.1:8000 not working)

## The Problem

When you try to open `http://127.0.0.1:8000` in browser, you get:
- "This site can't be reached"
- "Connection refused"
- Page doesn't load

**This means the backend server is NOT running.**

## Solution: Start the Server

### Method 1: Double-Click Batch File (EASIEST)

1. Go to `backend` folder in Windows Explorer
2. Find file: **`start_server.bat`**
3. **Double-click it**
4. A terminal window will open
5. Wait for this message:
   ```
   INFO:     Uvicorn running on http://127.0.0.1:8000
   ```
6. **Keep this window open!** (Don't close it)
7. Now try: `http://127.0.0.1:8000` in browser

### Method 2: Manual Command

1. Open **PowerShell** or **Command Prompt**
2. Navigate to backend folder:
   ```powershell
   cd "C:\Users\HP\Downloads\Telegram Desktop\Gym Finder Riyadh Design\backend"
   ```
3. Start server:
   ```powershell
   .venv\Scripts\python.exe -m uvicorn app.main:app --reload
   ```
4. Wait for: `INFO: Uvicorn running on http://127.0.0.1:8000`
5. **Keep terminal open**
6. Open browser: `http://127.0.0.1:8000`

### Verify Server is Running

**Test 1: Browser**
- Open: `http://127.0.0.1:8000`
- Should see: `{"status":"ok","message":"Gym Finder API is running"}`

**Test 2: Health Endpoint**
- Open: `http://127.0.0.1:8000/health`
- Should show: `{"status":"healthy","gyms":202,...}`

**Test 3: Gyms Endpoint**
- Open: `http://127.0.0.1:8000/gyms`
- Should show JSON array with 202 gyms

**Test 4: Using Script**
```powershell
.venv\Scripts\python.exe test_server.py
```

## Important Notes

1. **Server must run in terminal** - Keep terminal window open
2. **Don't close terminal** - Server stops if you close it
3. **One server at a time** - Only run one instance
4. **Port 8000 must be free** - Close other apps using port 8000

## Common Errors

### "Port 8000 already in use"
- Another server is running
- Close other terminal windows
- Or use different port: `--port 8001`

### "Module not found"
- Activate virtual environment first
- Or use: `.venv\Scripts\python.exe` (already in command)

### "Database locked"
- Close DB Browser
- Then start server

