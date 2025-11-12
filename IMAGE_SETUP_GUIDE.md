# Gym Images Setup Guide

## Current Situation

### Images Working ✅
- **17 out of 202 gyms** have logo URLs in the database
- These gyms display their logos correctly
- Logo URLs are stored in the `logo_url` field in the `gyms` table

### Missing Images
- **185 out of 202 gyms** don't have logo URLs
- These show a "No Image" placeholder (expected behavior)

## Image Display Design

The `GymCard` component is designed to show:
1. **Main Image** (large area): The gym's logo or facility photo
2. **Small Logo Overlay** (corner): Only appears if you have a separate facility photo AND a logo

Currently, since we only have `logo_url` in the database:
- The logo appears as the **main large image**
- The small overlay is **hidden** (to avoid showing the same image twice)

## How to Add Images to More Gyms

### Option 1: Update Database Directly

```sql
-- Update a gym's logo URL
UPDATE gyms 
SET logo_url = 'https://your-image-url.com/logo.png' 
WHERE name_en = 'Gym Name';
```

### Option 2: Use Python Script

Create a script to bulk update logo URLs:

```python
import sqlite3

conn = sqlite3.connect('gym_finder.db')
cursor = conn.cursor()

# Example: Update logo URL for specific gym
cursor.execute("""
    UPDATE gyms 
    SET logo_url = ? 
    WHERE name_en = ?
""", ('https://res.cloudinary.com/your-cloud/logo.png', 'Fitness Time'))

conn.commit()
conn.close()
```

### Option 3: Use Admin Panel (if implemented)

If the admin panel supports image uploads, use that interface.

## Image Requirements

### Recommended Image Specifications:
- **Format**: PNG or JPG
- **Size**: At least 400x300 pixels
- **Aspect Ratio**: 4:3 or 16:9
- **File Size**: Under 500KB (optimized)

### Where to Host Images:
- **Cloudinary** (currently used) - Recommended
- **AWS S3**
- **Google Cloud Storage**
- **Any CDN or image hosting service**

### Example Cloudinary URL Format:
```
https://res.cloudinary.com/[your-cloud-name]/image/upload/v[version]/[image-name].png
```

## Future Improvements

To have both facility photos and logos separately:

1. **Add `image_url` field** to database for facility photos
2. **Keep `logo_url`** for brand logos
3. **Update schema** to include both fields
4. **Update frontend** to use:
   - `image_url` for main large image
   - `logo_url` for small overlay

### Database Schema Addition:
```sql
ALTER TABLE gyms ADD COLUMN image_url VARCHAR;
```

### Model Update:
```python
# In backend/app/models.py
image_url = Column(String, nullable=True)  # Facility photo
logo_url = Column(String, nullable=True)   # Brand logo
```

## Current Gyms with Logos

The following gyms currently have logo URLs:
- Fitness Time
- Fitness Time Ladies
- Fitness Time Plus
- Fitness Time Pro
- Fitness Time Ladies Pro
- (12 more...)

To see all gyms with logos:
```bash
python backend/check_logos.py
```

## Testing Images

To test if a logo URL works:
1. Check the URL in a browser - should display the image
2. Check console logs in frontend - should show "Loading image for..."
3. The image should appear in the gym card

## Troubleshooting

### Image not showing?
1. Check browser console for errors
2. Verify URL is accessible (open in browser)
3. Check CORS if hosting on different domain
4. Verify `logo_url` field in database is not NULL/empty

### Want to see which gyms need images?
```sql
SELECT id, name_en, name_ar 
FROM gyms 
WHERE logo_url IS NULL OR logo_url = '';
```

This will show all gyms that need logo URLs added.
