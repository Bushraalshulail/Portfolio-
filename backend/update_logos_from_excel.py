from __future__ import annotations

"""
Populate missing gym logos from the Excel file "GymFinderData (1).xlsx".

Rules:
- Use only the logo_url from the sheet
- Match strictly by gym_id
- Update ONLY gyms.logo_url (do not touch any other columns or tables)
- Skip rows without a valid gym_id or without a logo value
"""

import os
import json
from typing import Any, Dict, List, Optional

import pandas as pd

from app.database import SessionLocal
from app import models


EXCEL_PATH = os.path.join(os.path.dirname(__file__), "app", "GymFinderData (1).xlsx")
REPORT_DIR = os.path.join(os.path.dirname(__file__), "update_reports")
REPORT_PATH = os.path.join(REPORT_DIR, "logos_update_report.json")


def first_existing_column(df: pd.DataFrame, candidates: List[str]) -> Optional[str]:
    for c in candidates:
        if c in df.columns:
            return c
    return None


def run() -> Dict[str, Any]:
    if not os.path.exists(EXCEL_PATH):
        raise FileNotFoundError(f"Excel file not found: {EXCEL_PATH}")

    df = pd.read_excel(EXCEL_PATH)

    col_id = first_existing_column(df, ["gym_id", "id", "Gym ID", "Gym_Id"]) or "gym_id"
    col_logo = first_existing_column(df, [
        "logo_url", "logo", "Logo", "Logo URL", "LogoUrl"
    ])
    if col_logo is None:
        raise RuntimeError("No logo_url column found in Excel file")

    report: Dict[str, Any] = {
        "updated": 0,
        "skipped": 0,
        "missing_ids": 0,
        "not_found_in_db": [],
    }

    session = SessionLocal()
    try:
        for idx, row in df.iterrows():
            gym_id = row.get(col_id)
            if pd.isna(gym_id):
                report["missing_ids"] += 1
                continue
            try:
                gym_id = int(gym_id)
            except Exception:
                report["skipped"] += 1
                continue

            logo_value = row.get(col_logo)
            if isinstance(logo_value, float) and pd.isna(logo_value):
                continue
            logo_value = str(logo_value).strip()
            if not logo_value:
                continue

            gym = session.get(models.Gym, gym_id)
            if not gym:
                report["not_found_in_db"].append(gym_id)
                continue

            # Update only if missing or empty
            if not gym.logo_url:
                gym.logo_url = logo_value
                session.add(gym)
                report["updated"] += 1

        session.commit()
    finally:
        session.close()

    os.makedirs(REPORT_DIR, exist_ok=True)
    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    return report


if __name__ == "__main__":
    print(json.dumps(run(), ensure_ascii=False, indent=2))


