"""
Update gender classification for all gyms from GymFinderData (1).xlsx file.

This script reads the Excel file and updates the gender field for each gym
based on the gender classification information in the Excel file.
"""

import os
import pandas as pd
from app.database import SessionLocal
from app.models import Gym


EXCEL_PATH = os.path.join(os.path.dirname(__file__), "app", "GymFinderData (1).xlsx")


def normalize_gender(gender_value):
    """Normalize gender values to handle various formats"""
    if pd.isna(gender_value) or gender_value is None:
        return None
    
    gender_str = str(gender_value).strip()
    
    # Handle empty strings
    if not gender_str or gender_str.lower() in ['nan', 'none', '']:
        return None
    
    # Normalize common variations
    gender_lower = gender_str.lower()
    
    # Check for exact matches first (case-insensitive)
    exact_matches = {
        'male': 'Male',
        'female': 'Female',
        'mixed': 'Mixed',
    }
    
    if gender_lower in exact_matches:
        return exact_matches[gender_lower]
    
    # Map common variations to standard values (check longer/more specific first)
    gender_mapping = [
        ('ladies', 'Female'),
        ('women', 'Female'),
        ('men', 'Male'),
        ('رجال', 'Male'),
        ('ذكر', 'Male'),
        ('نساء', 'Female'),
        ('انثى', 'Female'),
        ('مختلط', 'Mixed'),
        ('both', 'Mixed'),
        ('unisex', 'Mixed'),
    ]
    
    # Check if it contains any of the variations (check longer strings first)
    for key, value in gender_mapping:
        if key in gender_lower:
            return value
    
    # Return capitalized version if no mapping found
    return gender_str.capitalize()


def first_existing_column(df: pd.DataFrame, candidates: list) -> str | None:
    """Find the first column that exists in the dataframe"""
    for c in candidates:
        if c in df.columns:
            return c
    return None


def update_gender_classification():
    """Update gender classification for all gyms from Excel file"""
    
    if not os.path.exists(EXCEL_PATH):
        raise FileNotFoundError(f"Excel file not found: {EXCEL_PATH}")
    
    print(f"Reading Excel file: {EXCEL_PATH}")
    df = pd.read_excel(EXCEL_PATH)
    
    print(f"Found {len(df)} rows in Excel file")
    print(f"Columns in Excel: {list(df.columns)}")
    
    # Find gender column
    gender_col = first_existing_column(df, ["gender", "Gender", "GENDER", "الجنس"])
    if not gender_col:
        print("WARNING: Gender column not found in Excel file!")
        print("Available columns:", list(df.columns))
        return
    
    print(f"Using gender column: {gender_col}")
    
    # Find matching columns for gym identification
    name_ar_col = first_existing_column(df, ["name_ar", "Name_AR", "nameArabic", "الاسم_عربي"])
    name_en_col = first_existing_column(df, ["name_en", "Name_EN", "nameEnglish", "الاسم_انجليزي"])
    gym_id_col = first_existing_column(df, ["gym_id", "id", "Gym ID", "Gym_Id", "معرف_النادي"])
    
    if not name_ar_col and not name_en_col and not gym_id_col:
        print("ERROR: Cannot find gym identification columns!")
        print("Available columns:", list(df.columns))
        return
    
    session = SessionLocal()
    
    try:
        updated_count = 0
        not_found_count = 0
        skipped_count = 0
        
        for idx, row in df.iterrows():
            try:
                # Get gender value
                gender_value = row.get(gender_col)
                normalized_gender = normalize_gender(gender_value)
                
                if normalized_gender is None:
                    skipped_count += 1
                    continue
                
                # Find gym in database
                gym = None
                
                # Try by gym_id first if available
                if gym_id_col:
                    gym_id = row.get(gym_id_col)
                    if pd.notna(gym_id):
                        try:
                            gym_id_int = int(gym_id)
                            gym = session.query(Gym).filter(Gym.id == gym_id_int).first()
                        except (ValueError, TypeError):
                            pass
                
                # Try by name_ar if not found
                if not gym and name_ar_col:
                    name_ar = str(row.get(name_ar_col, "")).strip()
                    if name_ar and name_ar != "nan":
                        gym = session.query(Gym).filter(Gym.name_ar == name_ar).first()
                
                # Try by name_en if still not found
                if not gym and name_en_col:
                    name_en = str(row.get(name_en_col, "")).strip()
                    if name_en and name_en != "nan":
                        gym = session.query(Gym).filter(Gym.name_en == name_en).first()
                
                if gym:
                    # Update gender
                    old_gender = gym.gender
                    gym.gender = normalized_gender
                    updated_count += 1
                    
                    # Print first 5 updates for verification
                    if idx < 5:
                        print(f"  [{idx+1}] Updated gym ID {gym.id} ({gym.name_en}): '{old_gender}' -> '{normalized_gender}'")
                else:
                    not_found_count += 1
                    if idx < 5:  # Print first 5 not found for debugging
                        name_ar = str(row.get(name_ar_col, "")) if name_ar_col else "N/A"
                        name_en = str(row.get(name_en_col, "")) if name_en_col else "N/A"
                        print(f"  [{idx+1}] NOT FOUND: AR='{name_ar}', EN='{name_en}', Gender='{normalized_gender}'")
            
            except Exception as e:
                print(f"ERROR processing row {idx + 1}: {e}")
                continue
        
        # Commit all changes
        session.commit()
        
        print("\n" + "="*60)
        print("UPDATE SUMMARY")
        print("="*60)
        print(f"[OK] Updated: {updated_count} gyms")
        print(f"[WARNING] Not found: {not_found_count} gyms")
        print(f"[SKIP] Skipped (no gender): {skipped_count} gyms")
        print(f"[INFO] Total rows processed: {len(df)}")
        print("="*60)
        
        # Verify updates
        print("\nVerifying updates in database...")
        total_gyms = session.query(Gym).count()
        gyms_with_gender = session.query(Gym).filter(Gym.gender.isnot(None)).count()
        print(f"Total gyms in database: {total_gyms}")
        print(f"Gyms with gender classification: {gyms_with_gender}")
        
        # Show gender distribution
        print("\nGender distribution:")
        from sqlalchemy import func
        gender_counts = session.query(Gym.gender, func.count(Gym.id)).group_by(Gym.gender).all()
        for gender, count in gender_counts:
            print(f"  {gender or 'None'}: {count}")
        
    except Exception as e:
        session.rollback()
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        session.close()


if __name__ == "__main__":
    update_gender_classification()

