from __future__ import annotations

"""
Update the first 20 rows of the gyms table using data from the Excel file
 "GymFinderData (1).xlsx" located under backend/app/.

Rules:
- Match strictly by gym_id (maps to models.Gym.id)
- If exists: update fields; if not: insert new with the same id
- Do NOT touch other tables
- Stop after first 20 rows
- Produce a report with invalid logo_url entries and any unprocessed rows

This script uses the project's SQLAlchemy session and models, and pandas for IO.
"""

import os
import json
from typing import Any, Dict, List, Optional

import pandas as pd

from app.database import SessionLocal
from app import models

# Optional: validate logo_url reachability
try:
    import requests  # type: ignore
except Exception:  # requests might not be available in some environments
    requests = None  # type: ignore


EXCEL_PATH = os.path.join(os.path.dirname(__file__), "app", "GymFinderData (1).xlsx")
REPORT_DIR = os.path.join(os.path.dirname(__file__), "update_reports")
REPORT_PATH = os.path.join(REPORT_DIR, "gyms_update_report.json")


EXPECTED_COLUMNS = {
    # mapping of expected logical columns to dataframe column names if they differ
    "gym_id": ["gym_id", "id", "Gym ID", "Gym_Id"],
    "name_en": ["name_en", "Name_EN", "nameEnglish"],
    "name_ar": ["name_ar", "Name_AR", "nameArabic"],
    "gender": ["gender", "Gender"],
    "district": ["district", "District", "location", "Location"],
    "website": ["website", "Website"],
    "phone": ["phone", "Phone"],
    "description": ["description", "Description"],
    "rating": ["rating", "Rating"],
    "opening_hours": ["opening_hours", "Opening Hours", "openingHours"],
    "logo_url": ["logo_url", "logo", "Logo", "Logo URL", "LogoUrl"],
}


def first_existing_column(df: pd.DataFrame, candidates: List[str]) -> Optional[str]:
    for c in candidates:
        if c in df.columns:
            return c
    return None


def normalize_row(row: pd.Series, df: pd.DataFrame) -> Dict[str, Any]:
    out: Dict[str, Any] = {}
    for key, candidates in EXPECTED_COLUMNS.items():
        col = first_existing_column(df, candidates)
        if col is not None:
            out[key] = row.get(col)
        else:
            out[key] = None
    return out


def is_image_url(url: str) -> bool:
    if not url or not isinstance(url, str):
        return False
    if requests is None:
        # If requests isn't available, best-effort validation: basic extension check
        return any(url.lower().endswith(ext) for ext in [".png", ".jpg", ".jpeg", ".webp", ".gif"])
    try:
        # Try HEAD first
        resp = requests.head(url, timeout=6, allow_redirects=True)
        if resp.status_code >= 400:
            # Some servers don't support HEAD properly; fallback to GET with stream
            resp = requests.get(url, timeout=8, stream=True)
        if resp.status_code >= 400:
            return False
        ctype = resp.headers.get("Content-Type", "").lower()
        return ctype.startswith("image/")
    except Exception:
        return False


def run() -> Dict[str, Any]:
    if not os.path.exists(EXCEL_PATH):
        raise FileNotFoundError(f"Excel file not found: {EXCEL_PATH}")

    df = pd.read_excel(EXCEL_PATH)

    report: Dict[str, Any] = {
        "processed_rows": 0,
        "updated": 0,
        "inserted": 0,
        "invalid_logo_urls": [],  # list of {gym_id, logo_url, reason}
        "unprocessed_rows": [],   # list of {index, reason}
    }

    session = SessionLocal()
    try:
        # Restrict to the first 20 rows only
        limit = min(20, len(df))
        for idx in range(limit):
            row = df.iloc[idx]
            norm = normalize_row(row, df)

            gym_id = norm.get("gym_id")
            if pd.isna(gym_id):
                report["unprocessed_rows"].append({"index": int(idx), "reason": "Missing gym_id"})
                continue

            try:
                gym_id_int = int(gym_id)
            except Exception:
                report["unprocessed_rows"].append({"index": int(idx), "reason": f"Invalid gym_id value: {gym_id}"})
                continue

            # Validate logo_url (best-effort)
            logo_url = norm.get("logo_url")
            if isinstance(logo_url, float) and pd.isna(logo_url):
                logo_url = None
            if logo_url and not is_image_url(str(logo_url)):
                report["invalid_logo_urls"].append({
                    "gym_id": gym_id_int,
                    "logo_url": logo_url,
                    "reason": "Unreachable or not an image"
                })

            # Fetch existing gym
            gym: Optional[models.Gym] = session.get(models.Gym, gym_id_int)

            # Normalize rating to float if possible (handle comma decimals like '4,2')
            raw_rating = norm.get("rating")
            rating_value: Optional[float] = None
            if raw_rating is not None and not (isinstance(raw_rating, float) and pd.isna(raw_rating)):
                try:
                    if isinstance(raw_rating, str):
                        cleaned = raw_rating.strip().replace(",", ".")
                        rating_value = float(cleaned)
                    else:
                        rating_value = float(raw_rating)  # type: ignore[arg-type]
                except Exception:
                    rating_value = None

            # Normalize phone to string if numeric
            raw_phone = norm.get("phone")
            phone_value: Optional[str] = None
            if raw_phone is not None and not (isinstance(raw_phone, float) and pd.isna(raw_phone)):
                try:
                    if isinstance(raw_phone, (int, float)):
                        # Avoid scientific notation and remove decimals
                        phone_value = str(int(raw_phone))
                    else:
                        phone_value = str(raw_phone).strip()
                except Exception:
                    phone_value = None

            fields_to_update = {
                "name_ar": norm.get("name_ar"),
                "name_en": norm.get("name_en"),
                "gender": norm.get("gender"),
                "district": norm.get("district"),
                "website": norm.get("website"),
                "phone": phone_value,
                "description": norm.get("description"),
                "rating": rating_value,
                "opening_hours": norm.get("opening_hours"),
                "logo_url": logo_url,
            }

            # Clean string values: convert NaN to None and strip
            for k, v in list(fields_to_update.items()):
                if isinstance(v, float) and pd.isna(v):
                    fields_to_update[k] = None
                elif isinstance(v, str):
                    fields_to_update[k] = v.strip()

            if gym is None:
                # Insert new gym with the specified id
                gym = models.Gym(id=gym_id_int, **fields_to_update)
                session.add(gym)
                report["inserted"] += 1
            else:
                # Update existing gym
                for k, v in fields_to_update.items():
                    setattr(gym, k, v)
                report["updated"] += 1

            report["processed_rows"] += 1

        session.commit()
    except Exception as e:
        session.rollback()
        raise
    finally:
        session.close()

    # Write report to file
    os.makedirs(REPORT_DIR, exist_ok=True)
    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    return report


if __name__ == "__main__":
    result = run()
    print(json.dumps(result, ensure_ascii=False, indent=2))


