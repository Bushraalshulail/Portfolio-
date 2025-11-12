# How to Import Gym Data

## The file is named `import_data.py` (NOT `import_date.py`)

## Method 1: Use the wrapper script (EASIEST)
```powershell
cd backend
.venv\Scripts\python.exe import_gyms.py
```

## Method 2: Direct import (if Method 1 doesn't work)
```powershell
cd backend
.venv\Scripts\python.exe -c "import sys; sys.path.insert(0, '.'); from app.import_data import main; main()"
```

## Method 3: Using Python module syntax
```powershell
cd backend
.venv\Scripts\python.exe -m app.import_data
```

**IMPORTANT:** The filename is `import_data.py` (with "data", not "date")!

