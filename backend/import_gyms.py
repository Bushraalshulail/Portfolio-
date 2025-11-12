#!/usr/bin/env python
"""
Simple script to import gym data from Excel.
Run this from the backend directory:
    python import_gyms.py
Or use your virtual environment:
    .venv\Scripts\python.exe import_gyms.py
"""
import sys
from pathlib import Path

# Add the current directory to Python path so we can import app
backend_dir = Path(__file__).parent.absolute()
sys.path.insert(0, str(backend_dir))

try:
    from app.import_data import main
    main()
except ImportError as e:
    print(f"Import Error: {e}")
    print("\nMake sure you're using the correct Python environment.")
    print("If you have a virtual environment, activate it first:")
    print(".venv\\Scripts\\activate  (Windows)")
    print("or run: .venv\\Scripts\\python.exe import_gyms.py")
    sys.exit(1)
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

