# 📱 Tipsy - App Store Submission Checklist

**Complete guide to submitting Tipsy to Apple App Store and Google Play Store**

---

## 🎯 Pre-Submission Requirements

### **Phase 1: Infrastructure (Required Before Building)**

#### **1.1 Deploy Backend API to Production**
- [ ] Choose hosting provider (Railway, Heroku, AWS, DigitalOcean)
- [ ] Set up PostgreSQL database in production
- [ ] Enable PostGIS extension
- [ ] Run database migrations
- [ ] Configure environment variables
- [ ] Set up SSL/TLS (HTTPS required)
- [ ] Configure CORS for mobile apps
- [ ] Set up Redis (for scraping)
- [ ] Test all endpoints in production

**Recommended: Railway.app** (easiest for Node.js + PostgreSQL)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway init
railway up
```

#### **1.2 Production API Keys**
- [ ] Google Cloud Vision API (production project)
- [ ] Mapbox access token (production)
- [ ] Google OAuth credentials (production URLs)
- [ ] Apple OAuth credentials
- [ ] Cloudinary account (image hosting)
- [ ] Configure all in production .env

#### **1.3 Domain & SSL**
- [ ] Register domain (optional: api.tipsywine.app)
- [ ] Point domain to backend
- [ ] Set up SSL certificate (Let's Encrypt or Railway auto)
- [ ] Update API URLs in mobile apps

---

### **Phase 2: Legal Requirements (REQUIRED)**

#### **2.1 Privacy Policy** ⚠️ REQUIRED
Create a privacy policy covering:
- [ ] What data you collect (email, location, photos, check-ins)
- [ ] Why you collect it (app functionality)
- [ ] How you use it (wine tracking, recommendations)
- [ ] Third-party services (Google, Mapbox, Cloudinary)
- [ ] User rights (data deletion, export)
- [ ] Cookie policy (if web app)
- [ ] Children's privacy (COPPA compliance)
- [ ] Contact information

**Tools:**
- https://www.privacypolicygenerator.info (free)
- https://www.termsfeed.com (paid, better)

**Host at:** https://tipsywine.app/privacy (or GitHub Pages)

#### **2.2 Terms of Service**
- [ ] User responsibilities
- [ ] Acceptable use policy
- [ ] Content ownership
- [ ] Liability disclaimers
- [ ] Termination policy

#### **2.3 Age Rating**
Fill out questionnaires:
- [ ] Alcohol references: **YES** (natural wine app)
- [ ] User-generated content: **YES** (check-ins, photos)
- [ ] Location services: **YES** (maps)
- [ ] Expected rating: **17+** (alcohol) or **12+** (educational)

---

### **Phase 3: App Store Accounts**

#### **3.1 Apple Developer Program**
- [ ] Sign up at https://developer.apple.com/programs
- [ ] Pay $99/year (required)
- [ ] Verify identity (D-U-N-S number for organizations)
- [ ] Accept agreements (can take 24-48 hours)
- [ ] Create App ID: `com.tipsy.naturalwine`
- [ ] Enable capabilities (Push Notifications, Sign in with Apple)

#### **3.2 Google Play Console**
- [ ] Sign up at https://play.google.com/console
- [ ] Pay $25 one-time fee
- [ ] Verify identity
- [ ] Create app: "Tipsy - Natural Wine Tracker"
- [ ] Complete store listing

---

### **Phase 4: App Assets**

#### **4.1 App Icon** ⚠️ REQUIRED
Create icon variations:
- [ ] 1024x1024px PNG (no transparency, no alpha)
- [ ] iOS: Rounded square (system adds rounded corners)
- [ ] Android: Adaptive icon (foreground + background)

**Design requirements:**
- Must include cork logo (tipsykroonkurk)
- No text (should be recognizable at small sizes)
- Consistent with brand (cream/beige background)

#### **4.2 Screenshots** ⚠️ REQUIRED

**iOS (Required sizes):**
- [ ] 6.7" (iPhone 15 Pro Max): 1290 x 2796px (3-10 screenshots)
- [ ] 6.5" (iPhone 11 Pro Max): 1284 x 2778px
- [ ] 5.5" (iPhone 8 Plus): 1242 x 2208px
- [ ] 12.9" iPad Pro: 2048 x 2732px (if supporting iPad)

**Android (Required sizes):**
- [ ] Phone: 1080 x 1920px minimum (2-8 screenshots)
- [ ] 7" Tablet: 1920 x 1200px
- [ ] 10" Tablet: 2560 x 1600px

**Screenshots to capture:**
1. Map view with clustering
2. Wine check-in with OCR
3. Wine detail with transparency info
4. Producer profile
5. User profile with check-ins
6. Search/discovery

#### **4.3 App Preview Videos** (Optional but recommended)
- [ ] iOS: 15-30 seconds, H.264, 30fps
- [ ] Android: Up to 30 seconds
- [ ] Show key features: map, OCR, check-in flow

#### **4.4 Feature Graphic** (Android only)
- [ ] 1024 x 500px PNG/JPEG
- [ ] Promotional banner for Play Store listing

---

### **Phase 5: App Configuration**

#### **5.1 Update app.json (Expo)**
```json
{
  "expo": {
    "name": "Tipsy",
    "slug": "tipsy",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "scheme": "tipsy",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FCF8F2"
    },
    "ios": {
      "bundleIdentifier": "com.tipsy.naturalwine",
      "buildNumber": "1",
      "supportsTablet": false,
      "infoPlist": {
        "NSCameraUsageDescription": "Tipsy needs camera access to scan wine labels and extract information.",
        "NSPhotoLibraryUsageDescription": "Tipsy needs photo library access to upload wine label photos.",
        "NSLocationWhenInUseUsageDescription": "Tipsy uses your location to show nearby wine producers, bars, and events."
      },
      "config": {
        "googleMapsApiKey": "PRODUCTION_IOS_KEY"
      }
    },
    "android": {
      "package": "com.tipsy.naturalwine",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FCF8F2"
      },
      "permissions": [
        "CAMERA",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ],
      "config": {
        "googleMaps": {
          "apiKey": "PRODUCTION_ANDROID_KEY"
        }
      }
    },
    "plugins": [
      "expo-router",
      "expo-camera",
      "expo-secure-store",
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow Tipsy to use your location to show nearby wine venues."
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "YOUR_EAS_PROJECT_ID"
      }
    }
  }
}
```

#### **5.2 Create eas.json (Expo Application Services)**
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "env": {
        "API_BASE_URL": "https://api.tipsy.app/v1"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your.email@example.com",
        "ascAppId": "APPLE_APP_STORE_CONNECT_ID",
        "appleTeamId": "YOUR_APPLE_TEAM_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "production"
      }
    }
  }
}
```

#### **5.3 Update Environment Variables**
In `mobile/.env`:
```env
API_BASE_URL=https://api.tipsy.app/v1
GOOGLE_MAPS_API_KEY=production_key
```

---

### **Phase 6: Building & Testing**

#### **6.1 Install EAS CLI**
```bash
npm install -g eas-cli
eas login
```

#### **6.2 Configure EAS Project**
```bash
cd mobile
eas init
# This creates EAS project and updates app.json
```

#### **6.3 Build for Internal Testing**
```bash
# iOS (TestFlight)
eas build --platform ios --profile preview

# Android (Internal Testing)
eas build --platform android --profile preview
```

#### **6.4 Beta Testing**
- [ ] iOS: Upload to TestFlight
- [ ] Add internal testers (up to 100)
- [ ] Test on multiple devices (iPhone 12, 13, 14, 15)
- [ ] Test on different iOS versions (15, 16, 17)
- [ ] Android: Upload to Internal Testing track
- [ ] Test on multiple devices (Samsung, Pixel, etc.)
- [ ] Collect feedback
- [ ] Fix bugs
- [ ] Repeat until stable

**Minimum 2 weeks of beta testing recommended**

---

### **Phase 7: Store Listings**

#### **7.1 Apple App Store Listing**

**App Information:**
- [ ] **Name**: Tipsy - Natural Wine Tracker
- [ ] **Subtitle**: Discover & Track Natural Wines
- [ ] **Category**: Food & Drink
- [ ] **Age Rating**: 17+ (Alcohol)
- [ ] **Privacy Policy URL**: https://tipsy.app/privacy
- [ ] **Support URL**: https://tipsy.app/support
- [ ] **Marketing URL**: https://tipsy.app

**Description (Max 4,000 characters):**
```
Tipsy is the ultimate app for natural and low-intervention wine enthusiasts.
Discover, track, and share your wine experiences with a community that values
transparency, authenticity, and the grassroots nature of natural winemaking.

🍷 KEY FEATURES

• Wine Check-ins: Track every wine you taste with detailed ratings and notes
• OCR Label Scanning: Scan labels to instantly extract wine information
• Production Transparency: See exactly how wines are made from vineyard to bottle
• Interactive Map: Discover natural wine producers, bars, and events worldwide
• Community Verified: Trust ratings from users who've visited the domaines
• Taste Profiles: Build your personal flavor profile based on your check-ins
• No Commercial Pressure: Ad-free, grassroots platform built for wine lovers

🌱 TRANSPARENCY FIRST

Unlike other wine apps, Tipsy shows you the full story:
• Vineyard practices (organic, biodynamic, regenerative)
• Fermentation details (wild yeast, vessel type, duration)
• Aging process (barrel type, duration)
• Sulfite levels and interventions
• Producer certifications

🗺️ DISCOVER NEAR YOU

• Find natural wine bars, restaurants, and shops
• Locate producers and plan domaine visits
• See upcoming wine events and tastings
• Filter by location type and certifications

💬 COMMUNITY DRIVEN

• Connect with fellow natural wine enthusiasts
• Share tasting notes and recommendations
• Verify producer information
• Build your wish list

Whether you're new to natural wine or a seasoned enthusiast, Tipsy helps
you discover wines that align with your values and connect with a community
that cares about how wine is made.

Download Tipsy and start exploring the world of natural wine!
```

**Keywords (Max 100 characters):**
```
natural wine,wine tracker,wine app,organic wine,biodynamic,wine map,sommelier
```

**Promotional Text (Max 170 characters):**
```
Discover natural wines with production transparency. Track check-ins, scan labels with OCR, explore interactive maps. Join the natural wine community!
```

#### **7.2 Google Play Store Listing**

**App Information:**
- [ ] **Title**: Tipsy - Natural Wine Tracker
- [ ] **Short Description** (80 chars): Discover & track natural wines with production transparency
- [ ] **Full Description** (4,000 chars): Same as iOS
- [ ] **Category**: Food & Drink
- [ ] **Content Rating**: Teen (alcohol references)
- [ ] **Privacy Policy URL**: https://tipsy.app/privacy
- [ ] **Contact Email**: support@tipsy.app
- [ ] **Website**: https://tipsy.app

**Store Presence:**
- [ ] Countries: Start with US, then expand
- [ ] Pricing: Free

---

## 🚀 Submission Process

### **iOS App Store Submission**

#### **Step 1: Build Production App**
```bash
cd mobile
eas build --platform ios --profile production
```

#### **Step 2: App Store Connect**
1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "+"
3. Select "New App"
4. Fill in:
   - Platform: iOS
   - Name: Tipsy
   - Language: English
   - Bundle ID: com.tipsy.naturalwine
   - SKU: TIPSY001
5. Create app

#### **Step 3: Upload Build**
```bash
# EAS handles this automatically
eas submit --platform ios --profile production

# Or manually via Xcode:
# 1. Download .ipa from EAS
# 2. Open Transporter app
# 3. Upload .ipa
```

#### **Step 4: Complete App Information**
- [ ] Add screenshots (all required sizes)
- [ ] Add app preview video (optional)
- [ ] Fill out description, keywords, promotional text
- [ ] Add privacy policy URL
- [ ] Fill out age rating questionnaire
- [ ] Answer App Privacy questions:
  - Data collected: Email, location, photos, user content
  - Data usage: App functionality, analytics
  - Third-party tracking: Google Analytics (if using)

#### **Step 5: Submit for Review**
1. Select build version
2. Add release notes: "Initial release of Tipsy - Natural Wine Tracker"
3. Choose manual or automatic release
4. Click "Submit for Review"

**Review Timeline:** 24-48 hours typically

---

### **Android Play Store Submission**

#### **Step 1: Build Production APK/AAB**
```bash
cd mobile
eas build --platform android --profile production
```

#### **Step 2: Google Play Console**
1. Go to https://play.google.com/console
2. Click "Create app"
3. Fill in:
   - App name: Tipsy
   - Default language: English
   - App or game: App
   - Free or paid: Free
   - Accept declarations
4. Create app

#### **Step 3: Complete Store Listing**
Under "Grow" → "Store Presence" → "Main store listing":
- [ ] Upload screenshots (phone, tablet)
- [ ] Upload feature graphic
- [ ] Add app icon
- [ ] Fill out descriptions
- [ ] Select category
- [ ] Add contact details
- [ ] Add privacy policy URL

#### **Step 4: Set Up Release**
Under "Release" → "Production":
1. Click "Create new release"
2. Upload AAB file (from EAS build)
3. Add release name: "1.0.0"
4. Add release notes:
```
Initial release of Tipsy - Natural Wine Tracker

Features:
• Track wine check-ins with ratings
• OCR label scanning
• Interactive world map
• Production transparency
• Community features
```

#### **Step 5: Content Rating**
Under "Policy" → "App content" → "Content rating":
- [ ] Fill out IARC questionnaire
- [ ] Declare alcohol references
- [ ] Expected rating: Teen/PEGI 12

#### **Step 6: Target Audience & Content**
- [ ] Target age: 18+ (alcohol)
- [ ] Declare ads: No ads
- [ ] Privacy policy: Add URL

#### **Step 7: Submit for Review**
1. Complete all required sections
2. Click "Review release"
3. Click "Start rollout to Production"

**Review Timeline:** 3-7 days typically

---

## ⚠️ Common Rejection Reasons

### **iOS Rejections:**
1. **Missing Privacy Policy** - Must have hosted URL
2. **Incomplete App Privacy Form** - Declare all data collected
3. **Camera/Location Permission** - Justify in description
4. **Alcohol Content** - Must have age gate (if needed)
5. **Crashes** - Must be stable, no bugs
6. **Incomplete Features** - All features must work
7. **Wrong Age Rating** - Alcohol = 17+
8. **Third-party Login** - If using Apple Sign-In, must be primary option

### **Android Rejections:**
1. **Missing Privacy Policy** - Required
2. **Dangerous Permissions** - Justify camera/location
3. **Crashes on Review** - Test on multiple devices
4. **Misleading Content** - Accurate description
5. **Intellectual Property** - No copyright issues
6. **Target API Level** - Must target recent Android version

---

## 📝 Pre-Submission Testing Checklist

### **Functional Testing**
- [ ] Registration/login works
- [ ] OAuth (Google/Apple) works
- [ ] Guest mode works
- [ ] Camera opens and captures
- [ ] OCR extracts wine info
- [ ] Check-in creation works
- [ ] Map loads and shows markers
- [ ] Clustering works at all zoom levels
- [ ] Search works
- [ ] Filters work
- [ ] Profile loading works
- [ ] Image uploads work
- [ ] All API calls succeed

### **Performance Testing**
- [ ] App launches in < 2 seconds
- [ ] No crashes
- [ ] No memory leaks
- [ ] Smooth scrolling
- [ ] Images load quickly
- [ ] Map is responsive

### **Device Testing**
- [ ] iPhone 12/13/14/15 (iOS 15-17)
- [ ] iPad (if supporting)
- [ ] Samsung Galaxy S21/S22/S23
- [ ] Google Pixel 6/7/8
- [ ] Different screen sizes
- [ ] Different Android versions (11-14)

### **Network Testing**
- [ ] Works on WiFi
- [ ] Works on 4G/5G
- [ ] Handles poor connection
- [ ] Shows error messages
- [ ] Offline mode (if applicable)

### **Permission Testing**
- [ ] Camera permission flow
- [ ] Location permission flow
- [ ] Photo library permission
- [ ] Can deny permissions gracefully

---

## 💰 Costs Summary

**One-time:**
- Apple Developer: **$99/year**
- Google Play: **$25 one-time**
- Domain (optional): **$10-15/year**

**Monthly (Production):**
- Backend hosting: **$5-20/month** (Railway/Heroku)
- Database: **Included** (Railway) or **$7+/month** (separate)
- Redis: **Free** (Railway) or **$5/month**
- Cloudinary: **Free tier** or **$89/month** (paid)
- Google Cloud Vision: **$1.50 per 1,000 images** (free 1,000/month)
- Mapbox: **Free tier** or **$5/month** (paid)

**Estimated Total:**
- Initial setup: **$124-200**
- Monthly: **$15-150** (depending on usage)

---

## 🎯 Realistic Timeline

**Week 1-2: Infrastructure**
- Deploy backend to production
- Set up production database
- Configure all API keys
- Test production environment

**Week 3: Assets & Legal**
- Create app icons
- Capture screenshots
- Write privacy policy & ToS
- Host legal documents

**Week 4: Accounts**
- Sign up for Apple Developer
- Sign up for Google Play
- Wait for verification

**Week 5-6: Beta Testing**
- Build with EAS
- Distribute to TestFlight/Internal Testing
- Collect feedback
- Fix bugs

**Week 7: Store Listings**
- Complete App Store Connect
- Complete Google Play Console
- Write descriptions
- Add all metadata

**Week 8: Submission**
- Submit iOS for review
- Submit Android for review
- Wait for approval
- Launch!

**Total: 6-8 weeks minimum**

---

## ✅ Ready to Submit Checklist

### Before You Submit:
- [ ] Backend deployed to production with SSL
- [ ] All API keys configured (production)
- [ ] Privacy policy hosted
- [ ] Terms of service hosted
- [ ] App icon created (1024x1024)
- [ ] Screenshots captured (all sizes)
- [ ] Apple Developer account ($99 paid)
- [ ] Google Play account ($25 paid)
- [ ] Beta testing completed (2+ weeks)
- [ ] No crashes or critical bugs
- [ ] All features working
- [ ] Tested on 5+ physical devices
- [ ] App Store listing written
- [ ] Play Store listing written
- [ ] Content rating completed
- [ ] Age gate implemented (if needed for alcohol)
- [ ] Analytics configured
- [ ] Error tracking configured (Sentry)

---

## 🚀 Post-Launch

**After Approval:**
1. Celebrate! 🎉
2. Announce on social media
3. Monitor reviews
4. Track analytics
5. Fix bugs quickly
6. Plan updates
7. Engage with users

**Update Cycle:**
- Bug fixes: As needed (can be fast-tracked)
- New features: Every 2-4 weeks
- Major updates: Every 2-3 months

---

## 📞 Support Resources

**Apple:**
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines
- Common rejection reasons: https://developer.apple.com/app-store/review
- App Store Connect help: https://developer.apple.com/support/app-store-connect

**Google:**
- Play Console help: https://support.google.com/googleplay/android-developer
- Policy guidelines: https://play.google.com/about/developer-content-policy
- Common rejection reasons: https://support.google.com/googleplay/android-developer/answer/9899234

**Expo:**
- EAS Build docs: https://docs.expo.dev/build/introduction
- EAS Submit docs: https://docs.expo.dev/submit/introduction
- App store deployment: https://docs.expo.dev/distribution/introduction

---

**Good luck with your submission! 🍷**
