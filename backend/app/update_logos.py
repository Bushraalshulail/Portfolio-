import pandas as pd
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from backend.app.models import Gym
from backend.app.config import settings

# تحميل ملف الإكسل (تأكدي إنه داخل backend/app/)
df = pd.read_excel("backend/app/GymFinderData.xlsx")

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

updated = 0
not_found = []

for _, row in df.iterrows():
    name_ar = str(row.get("name_ar", "")).strip()
    name_en = str(row.get("name_en", "")).strip()
    logo_url = str(row.get("logo_url", "")).strip()

    if not logo_url:
        continue

    gym = session.query(Gym).filter(Gym.name_ar == name_ar).first()

    if not gym and name_en:
        gym = session.query(Gym).filter(Gym.name_en == name_en).first()

    if gym:
        gym.logo_url = logo_url
        updated += 1
    else:
        not_found.append((name_ar, name_en))

session.commit()
session.close()

print(f"\n✅ تم تحديث {updated} نادي")
if not_found:
    print("\n⚠️ لم يتم العثور على النوادي التالية:")
    for ar, en in not_found:
        print(f" - AR: {ar} | EN: {en}")
