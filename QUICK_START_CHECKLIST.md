# ⚡ Tipsy - Quick Start Checklist

**Get your natural wine app running in 30 minutes!**

---

## ✅ Pre-Flight Checklist

### **System Requirements**
- [ ] Node.js 18+ installed (`node --version`)
- [ ] PostgreSQL 14+ installed (`psql --version`)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

### **Accounts Needed**
- [ ] Google Cloud account (for Vision API - OCR)
- [ ] Mapbox account (for maps & geocoding)
- [ ] Google OAuth credentials (optional, for login)
- [ ] Apple Developer account (optional, for iOS OAuth)
- [ ] Redis instance (optional, for web scraping)

---

## 🔧 Backend Setup (10 minutes)

### **1. Install Dependencies**
```bash
cd backend
npm install
```

### **2. Create Database**
```bash
# Create PostgreSQL database
createdb tipsy_db

# Import schema
psql tipsy_db < ../DATABASE_SCHEMA.sql

# Verify tables created
psql tipsy_db -c "\dt"
```

### **3. Configure Environment**
```bash
cp .env.example .env
```

**Edit `.env` with your credentials:**
```env
# Database (REQUIRED)
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/tipsy_db

# JWT (REQUIRED - generate random string)
JWT_SECRET=CHANGE_THIS_TO_RANDOM_STRING
JWT_EXPIRE=7d

# Google Cloud Vision (REQUIRED for OCR)
GOOGLE_CLOUD_VISION_API_KEY=your_api_key_here

# Mapbox (REQUIRED for geocoding)
MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token

# OAuth (OPTIONAL)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Redis (OPTIONAL - only for web scraping)
REDIS_HOST=localhost
REDIS_PORT=6379
ENABLE_SCRAPING_QUEUE=false

# Cloudinary (OPTIONAL - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **4. Generate JWT Secret**
```bash
# Generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **5. Start Backend**
```bash
npm run dev
```

**✅ Verify:** Visit http://localhost:3000/health

---

## 📱 Mobile App Setup (10 minutes)

### **1. Install Dependencies**
```bash
cd mobile
npm install
```

### **2. Configure Environment**
```bash
cp .env.example .env
```

**Edit `.env`:**
```env
API_BASE_URL=http://localhost:3000/api/v1
# For physical device, use your computer's IP:
# API_BASE_URL=http://192.168.1.X:3000/api/v1
```

### **3. Download Fonts**
Download these fonts and place in `mobile/assets/fonts/`:
- **Fraunces**: https://fonts.google.com/specimen/Fraunces
- **Plus Jakarta Sans**: https://fonts.google.com/specimen/Plus+Jakarta+Sans
- **Inter**: https://fonts.google.com/specimen/Inter
- **Caveat**: https://fonts.google.com/specimen/Caveat

Or use system fonts temporarily (edit `mobile/constants/Typography.ts`).

### **4. Configure Google Maps**
**Edit `mobile/app.json`:**
```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      }
    },
    "ios": {
      "config": {
        "googleMapsApiKey": "YOUR_GOOGLE_MAPS_API_KEY"
      }
    }
  }
}
```

### **5. Start Mobile App**
```bash
npm start
```

**Test on:**
- iOS: Press `i` or `npm run ios`
- Android: Press `a` or `npm run android`
- Web: Press `w` or `npm run web`

**✅ Verify:** App launches and shows home screen

---

## 🌐 Web App Setup (5 minutes)

### **1. Install Dependencies**
```bash
cd web
npm install
```

### **2. Configure Environment**
```bash
cp .env.example .env.local
```

**Edit `.env.local`:**
```env
# API (REQUIRED)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1

# Mapbox (REQUIRED for map)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_token

# NextAuth (REQUIRED)
NEXTAUTH_SECRET=YOUR_RANDOM_SECRET
NEXTAUTH_URL=http://localhost:3001

# OAuth (OPTIONAL)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### **3. Generate NextAuth Secret**
```bash
openssl rand -base64 32
```

### **4. Start Web App**
```bash
npm run dev
```

**✅ Verify:** Visit http://localhost:3001

---

## 🎯 API Keys Setup Guide

### **1. Google Cloud Vision (OCR)**
1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Enable "Cloud Vision API"
4. Create credentials → API Key
5. Copy API key to `.env`: `GOOGLE_CLOUD_VISION_API_KEY=...`

### **2. Mapbox (Maps & Geocoding)**
1. Go to https://account.mapbox.com
2. Sign up for free account
3. Copy default public token OR create new token
4. Add to backend `.env`: `MAPBOX_ACCESS_TOKEN=pk...`
5. Add to web `.env.local`: `NEXT_PUBLIC_MAPBOX_TOKEN=pk...`

### **3. Google Maps (Mobile)**
1. Go to https://console.cloud.google.com
2. Enable "Maps SDK for Android" and "Maps SDK for iOS"
3. Create credentials → API Key
4. Restrict key to Maps SDK
5. Add to `mobile/app.json`

### **4. Google OAuth (Login)**
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - Backend: `http://localhost:3000/api/v1/oauth/google/callback`
   - Web: `http://localhost:3001/api/auth/callback/google`
4. Copy Client ID and Secret
5. Add to backend `.env` and web `.env.local`

---

## 🧪 Quick Test Checklist

### **Backend Tests**
```bash
# Health check
curl http://localhost:3000/health

# API info
curl http://localhost:3000/api/v1

# Create test user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### **Mobile App Tests**
- [ ] App launches without errors
- [ ] Map screen loads and shows map
- [ ] Camera screen opens (on device)
- [ ] Navigation works between screens
- [ ] Design system demo shows correctly

### **Web App Tests**
- [ ] Homepage loads
- [ ] Map page loads with Mapbox
- [ ] Map markers appear (mock data)
- [ ] Search and filters work

---

## ⚠️ Common Issues

### **Issue: Database connection failed**
**Solution:**
```bash
# Check PostgreSQL is running
pg_isready

# Create database if missing
createdb tipsy_db

# Verify connection string in .env
DATABASE_URL=postgresql://user:password@localhost:5432/tipsy_db
```

### **Issue: PostGIS extension missing**
**Solution:**
```bash
# Install PostGIS
# macOS: brew install postgis
# Ubuntu: sudo apt-get install postgresql-14-postgis-3

# Enable in database
psql tipsy_db -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

### **Issue: Mobile app won't connect to backend**
**Solution:**
- Use your computer's IP address, not `localhost`
- Find IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
- Update `.env`: `API_BASE_URL=http://192.168.1.X:3000/api/v1`
- Ensure backend is running
- Ensure firewall allows port 3000

### **Issue: OCR not working**
**Solution:**
- Verify Google Cloud Vision API is enabled
- Check API key is correct in `.env`
- Ensure billing is enabled (Google Cloud requires it)
- Check OCR endpoint: `curl http://localhost:3000/api/v1/ocr/status`

### **Issue: Map not showing**
**Solution:**
- Verify Mapbox token is correct
- Check token is public (starts with `pk.`)
- For mobile: Ensure Google Maps API key is in `app.json`
- Check browser console for errors

### **Issue: Fonts not loading (mobile)**
**Solution:**
- Download fonts to `mobile/assets/fonts/`
- Ensure font files are named correctly
- Restart Expo dev server (`npm start -- --clear`)
- Or temporarily use system fonts

---

## 🚀 Next Steps

**Once Everything is Running:**

1. **Create Test Data**
   - Register a user
   - Create a producer
   - Add a wine
   - Make a check-in

2. **Explore Features**
   - Browse the map
   - Search for wines
   - Test OCR (scan a wine label)
   - Try different screens

3. **Customize**
   - Add your logo (`assets/logo/`)
   - Update app name in `app.json`
   - Customize colors in `constants/Colors.ts`
   - Add your content

4. **Deploy**
   - Backend: Railway, Heroku, AWS
   - Web: Vercel, Netlify
   - Mobile: Expo EAS Build → App Stores

---

## 📚 Helpful Commands

**Backend:**
```bash
npm run dev          # Start development server
npm test            # Run tests
npm run lint        # Lint code
```

**Mobile:**
```bash
npm start           # Start Expo dev server
npm run ios         # Run on iOS simulator
npm run android     # Run on Android emulator
npm run web         # Run in web browser
```

**Web:**
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start           # Start production server
npm run lint        # Lint code
```

**Database:**
```bash
# Connect to database
psql tipsy_db

# List tables
\dt

# View schema
\d wines

# Reset database
dropdb tipsy_db
createdb tipsy_db
psql tipsy_db < DATABASE_SCHEMA.sql
```

---

## 📞 Need Help?

**Documentation:**
- Main README: `/README.md`
- Project Summary: `/PROJECT_SUMMARY.md`
- Mobile docs: `/mobile/README.md`
- Web docs: `/web/README.md`

**External Resources:**
- Expo: https://docs.expo.dev
- Next.js: https://nextjs.org/docs
- PostgreSQL: https://www.postgresql.org/docs
- Mapbox: https://docs.mapbox.com

---

## ✅ Success Criteria

**You're ready to develop when:**
- [ ] Backend API is running on port 3000
- [ ] Database is created with all tables
- [ ] Mobile app launches without errors
- [ ] Web app shows map correctly
- [ ] You can create a user and check-in
- [ ] OCR extracts text from labels
- [ ] Maps show markers and clustering

**Happy coding! 🍷**
