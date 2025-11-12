# Start Gym Finder Backend Server
Write-Host "Starting Gym Finder Backend Server..." -ForegroundColor Green
Write-Host ""

# Change to backend directory
Set-Location $PSScriptRoot

# Check if venv exists
if (-not (Test-Path ".venv\Scripts\python.exe")) {
    Write-Host "ERROR: Virtual environment not found at .venv\Scripts\python.exe" -ForegroundColor Red
    Write-Host "Please ensure the virtual environment is set up correctly." -ForegroundColor Red
    pause
    exit 1
}

Write-Host "Starting server on http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
