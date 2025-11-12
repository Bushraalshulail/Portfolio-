import pandas as pd
from pathlib import Path
from .database import Base, engine, SessionLocal
from .models import Gym, Facility, Equipment


def main():
    """Main function to import gym data from Excel"""
    # Get absolute path to Excel file (in the same directory as this script)
    _current_dir = Path(__file__).parent.absolute()
    EXCEL_FILE = _current_dir / "GymFinderData.xlsx"

    if not EXCEL_FILE.exists():
        raise FileNotFoundError(f"Excel file not found at: {EXCEL_FILE}")

    print(f"Reading Excel file: {EXCEL_FILE}")

    # Drop and recreate all tables
    print("Dropping existing tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        print(f"Reading data from Excel...")
        df = pd.read_excel(EXCEL_FILE)
        print(f"Found {len(df)} rows in Excel file")

        gyms_added = 0
        facilities_added = 0
        equipment_added = 0
        
        # Track all gyms to commit together
        all_gyms = []

        for idx, row in df.iterrows():
            try:
                # --- Fix rating value (handle "4,3" -> 4.3) ---
                rating_value = row.get("rating")
                if pd.isna(rating_value):
                    rating_value = None
                elif isinstance(rating_value, str):
                    rating_value = rating_value.replace(",", ".").strip()
                try:
                    rating_value = float(rating_value) if rating_value else None
                except (ValueError, TypeError):
                    rating_value = None

                # Create gym
                gym = Gym(
                    name_ar=str(row.get("name_ar", "")).strip(),
                    name_en=str(row.get("name_en", "")).strip(),
                    gender=str(row.get("gender", "")).strip() if pd.notna(row.get("gender")) else None,
                    district=str(row.get("district", "")).strip() if pd.notna(row.get("district")) else None,
                    website=str(row.get("website", "")).strip() if pd.notna(row.get("website")) else None,
                    phone=str(row.get("phone", "")).strip() if pd.notna(row.get("phone")) else None,
                    description=str(row.get("description", "")).strip() if pd.notna(row.get("description")) else None,
                    rating=rating_value,
                    opening_hours=str(row.get("opening_hours", "")).strip() if pd.notna(row.get("opening_hours")) else None,
                    added_by=None
                )

                db.add(gym)
                db.flush()  # Get gym.id before linking relationships
                gyms_added += 1

                # --- Link facilities ---
                facilities_en_str = str(row.get("facilities_en", "")).strip()
                facilities_ar_str = str(row.get("facilities_ar", "")).strip()
                
                if facilities_en_str and facilities_en_str != "nan":
                    facilities_en = [x.strip() for x in facilities_en_str.split(",") if x.strip()]
                    facilities_ar_list = [x.strip() for x in facilities_ar_str.split(",")] if facilities_ar_str and facilities_ar_str != "nan" else []
                    
                    # Pad facilities_ar_list to match facilities_en length
                    while len(facilities_ar_list) < len(facilities_en):
                        facilities_ar_list.append(facilities_en[len(facilities_ar_list)])
                    
                    for en, ar in zip(facilities_en, facilities_ar_list):
                        facility = db.query(Facility).filter_by(name_en=en).first()
                        if not facility:
                            facility = Facility(name_en=en, name_ar=ar if ar else en)
                            db.add(facility)
                            db.flush()  # Flush to get facility.id
                            facilities_added += 1
                        gym.facilities.append(facility)

                # --- Link equipment ---
                equipment_en_str = str(row.get("equipment_en", "")).strip()
                equipment_ar_str = str(row.get("equipment_ar", "")).strip()
                
                if equipment_en_str and equipment_en_str != "nan":
                    equipment_en = [x.strip() for x in equipment_en_str.split(",") if x.strip()]
                    equipment_ar_list = [x.strip() for x in equipment_ar_str.split(",")] if equipment_ar_str and equipment_ar_str != "nan" else []
                    
                    # Pad equipment_ar_list to match equipment_en length
                    while len(equipment_ar_list) < len(equipment_en):
                        equipment_ar_list.append(equipment_en[len(equipment_ar_list)])
                    
                    for en, ar in zip(equipment_en, equipment_ar_list):
                        equipment = db.query(Equipment).filter_by(name_en=en).first()
                        if not equipment:
                            equipment = Equipment(name_en=en, name_ar=ar if ar else en)
                            db.add(equipment)
                            db.flush()  # Flush to get equipment.id
                            equipment_added += 1
                        gym.equipment.append(equipment)

                all_gyms.append(gym)

            except Exception as e:
                print(f"WARNING: Error processing row {idx + 1}: {e}")
                continue

        # Single commit at the end - this commits all gyms, facilities, equipment, and relationships
        print("Committing all changes to database...")
        db.commit()
        print(f"SUCCESS! Added {gyms_added} gyms, {facilities_added} facilities, {equipment_added} equipment items.")
        
        # Verify data was committed
        print("\nVerifying data in database...")
        gym_count = db.query(Gym).count()
        facility_count = db.query(Facility).count()
        equipment_count = db.query(Equipment).count()
        print(f"Database contains: {gym_count} gyms, {facility_count} facilities, {equipment_count} equipment")
        
        if gym_count == 0:
            print("WARNING: Database appears empty after commit!")
            raise Exception("Data was not persisted to database")
        
    except Exception as e:
        db.rollback()
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
