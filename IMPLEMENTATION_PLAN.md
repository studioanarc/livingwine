# 🍷 Tipsy - Natural Wine Tracking & Discovery

A social platform for natural and low-intervention wine enthusiasts to discover, track, and share their wine experiences with transparency and community at its core.

## 📖 Project Overview

**Tipsy** is a next-generation wine tracking app designed specifically for the natural and low-intervention wine community. It combines social check-ins with deep production transparency, interactive maps, and a unique visual identity that celebrates the authentic, grassroots nature of natural wine culture.

### Why "Tipsy"?

The name captures the fun, approachable spirit of natural wine culture while remaining memorable and friendly. The cork logo (tipsykroonkurk_dark.svg) reinforces the connection to wine in a playful, authentic way.

---

## 🎯 COMPLETE IMPLEMENTATION PLAN

### Phase 1: Foundation & Infrastructure (IMMEDIATE - Parallel Execution)

#### Task Group A: Backend Enhancements
- **A1**: Update database schema with new features
  - Add wine classification: `serious_vs_fun` (1-5 scale), `food_pairing_style` (solo, companion, both)
  - Add venue clustering support with geospatial indexes
  - Add OAuth provider fields to users table
  - Add web scraping metadata tables

- **A2**: Extend API endpoints
  - Map clustering API with dynamic zoom levels
  - Venue auto-suggestion endpoint
  - OAuth authentication (Google, Apple)
  - Guest mode endpoints (no auth required)
  - Label OCR endpoint with address extraction

- **A3**: Web scraping service
  - Scrape natural wine bars/restaurants
  - Scrape producer websites
  - Scrape natural wine events
  - Automated data enrichment

#### Task Group B: Mobile App (React Native)
- **B1**: Project setup and navigation
  - Expo/React Native setup
  - Navigation structure
  - State management (Redux/Zustand)

- **B2**: Core screens
  - Map view with clustering (react-native-maps)
  - Wine check-in with OCR
  - Discovery/search
  - User profile
  - Onboarding flow (gradual)

- **B3**: Visual design system
  - Custom font integration (quirky fonts)
  - Letterpress/halftone effects
  - Organic shapes and imperfect aesthetics
  - Color system (#F3E4DB, #FCF8F2, Mondrian blue)
  - 3D font shadows

#### Task Group C: Web App (Next.js)
- **C1**: Next.js 14 setup with App Router
- **C2**: Map interface (Mapbox GL)
- **C3**: Responsive design system
- **C4**: Authentication flow
- **C5**: Wine database browser

#### Task Group D: Design & Assets
- **D1**: Design system documentation
- **D2**: Font selection and integration
- **D3**: Visual effects library (letterpress, halftone)
- **D4**: Component library
- **D5**: Logo integration

---

## 🗺️ NEW FEATURES: World Map System

### Map Features
1. **Interactive Clustering**
   - Dynamic clustering based on zoom level
   - Different markers for: producers, bars, restaurants, wine shops, events
   - Click cluster to zoom in
   - Click marker to see details

2. **Search & Filter**
   - Search by location name
   - Filter by type (producer/venue/event)
   - Filter by region
   - Filter by certifications (organic, biodynamic)

3. **Auto-Population**
   - Scrape existing natural wine venues globally
   - Extract addresses from wine labels (OCR)
   - Auto-suggest venues when user checks in
   - User verification system for accuracy

4. **Venue Detection Flow**
   ```
   User scans label → OCR extracts producer info
   → Check if address exists in DB
   → If new: "Want to add [Producer Name] to the map?"
   → User confirms location
   → Producer added with "community-added" flag
   ```

---

## 🍷 ENHANCED WINE CLASSIFICATION

### New Criteria

#### Seriousness Scale (1-5)
- **1 - Pure Fun**: Easy-drinking, party wine, glou-glou
- **2 - Casual**: Approachable, laid-back
- **3 - Balanced**: Can be fun or serious
- **4 - Contemplative**: Rewards attention, complex
- **5 - Serious**: Study wine, age-worthy, intellectual

#### Food Pairing Style
- **Solo Sipper**: Great on its own, aperitif-style
- **Food Companion**: Needs food, built for pairing
- **Versatile**: Works both ways

#### Combined in Check-ins
Users can tag wines with:
- Context: "sunny afternoon", "dinner party", "pizza wine", "contemplative"
- Seriousness: Slider 1-5
- Food style: Radio buttons (solo/companion/versatile)
- Actual pairings: Free text + suggestions

---

## 🚀 GRADUAL ONBOARDING STRATEGY

### Guest Mode (No Account)
Users can:
- ✅ Browse wine database
- ✅ View map and venues
- ✅ Search wines and producers
- ✅ Read check-ins (public)
- ✅ View events

### Account Required For
- Posting check-ins and ratings
- Saving favorites/wish lists
- Following friends
- Claiming producer profiles
- Saving venue locations

### Onboarding Flow
```
1. Download app → Immediate access (guest mode)
2. Want to check-in? → "Sign up to save your check-ins"
3. Options:
   - Continue with Google (1-click)
   - Continue with Apple (1-click)
   - Email (simple: email + password + username only)
4. Optional: Add profile photo and bio later
5. No personal data collection unless claiming producer profile
```

### Authentication Methods
- **Google OAuth** (primary)
- **Apple Sign-In** (iOS requirement)
- **Email/Password** (fallback)
- **Guest mode** (persistent, no account)

---

## 🎨 VISUAL DESIGN SYSTEM

### Inspiration Sources
- The Mac MC: Organic, playful, bold typography
- Three Uncles: Quirky, hand-crafted feel
- Relume Burger: Clean but characterful, unique typography

### Core Design Principles
1. **Natural & Organic**: Imperfect, hand-crafted feeling
2. **Bold Typography**: Mix of 3-4 quirky fonts
3. **Textured**: Letterpress, halftone, grainy effects
4. **Playful Colors**: Mondrian blue accents, warm neutrals
5. **Organic Shapes**: Blobs, irregular borders, hand-drawn elements

### Color Palette
```css
/* Backgrounds */
--bg-primary: #FCF8F2;      /* Off-white, warm */
--bg-secondary: #F3E4DB;    /* Peachy beige */
--bg-tertiary: #EAD5C8;     /* Deeper warm beige */

/* Accents */
--accent-blue: #0055AA;      /* Mondrian blue */
--accent-red: #C1272D;       /* Natural wine red */
--accent-yellow: #F4D03F;    /* Playful yellow */
--accent-green: #6B8E23;     /* Olive green (natural) */

/* Text */
--text-primary: #2C2416;     /* Dark brown */
--text-secondary: #5C4A3A;   /* Medium brown */
--text-tertiary: #8C7A6A;    /* Light brown */

/* Overlays */
--overlay-light: rgba(243, 228, 219, 0.9);
--overlay-dark: rgba(44, 36, 22, 0.8);
```

### Typography Stack
```css
/* Display/Headings - Bold & Quirky */
--font-display: 'Fraunces', 'Cooper Black', serif;  /* Soft serif with personality */

/* Subheadings - Geometric */
--font-heading: 'Cabinet Grotesk', 'Space Grotesk', sans-serif;  /* Unique sans */

/* Body - Readable */
--font-body: 'Inter', 'System UI', sans-serif;  /* Clean, modern */

/* Accent - Handwritten/Playful */
--font-accent: 'Reenie Beanie', 'Caveat', cursive;  /* For special touches */
```

### Visual Effects
1. **Letterpress**:
   - Subtle inner shadow on text
   - `text-shadow: 0 1px 1px rgba(255,255,255,0.8), 0 -1px 1px rgba(0,0,0,0.3)`

2. **Halftone**:
   - CSS halftone pattern on images
   - SVG dot patterns for backgrounds

3. **3D Font Shadow**:
   - Multiple text-shadow layers
   - Offset shadows for depth

4. **Organic Shapes**:
   - border-radius with unique values
   - SVG blob shapes for containers
   - Irregular card edges

5. **Imperfect Elements**:
   - Slight rotation on cards (-1 to 2 degrees)
   - Hand-drawn underlines (SVG paths)
   - Uneven spacing (intentional)

---

## 🏗️ TECHNICAL ARCHITECTURE

### Platform Stack

#### Mobile (iOS + Android)
```
React Native (Expo)
├── Navigation: React Navigation
├── State: Zustand + React Query
├── Maps: react-native-maps (native)
├── Camera/OCR: expo-camera + Google Vision API
├── Auth: expo-auth-session (OAuth)
├── Storage: AsyncStorage + SQLite (offline)
└── UI: React Native + Custom components
```

#### Web App
```
Next.js 14 (App Router)
├── Styling: Tailwind CSS + CSS Modules
├── Maps: Mapbox GL JS
├── Auth: NextAuth.js (OAuth)
├── State: Zustand + React Query
├── UI: Radix UI + Custom components
└── Deployment: Vercel
```

#### Backend (Existing + Extensions)
```
Node.js + Express
├── Database: PostgreSQL + PostGIS
├── ORM: Sequelize
├── Auth: JWT + OAuth
├── File Upload: Cloudinary
├── OCR: Google Cloud Vision
├── Scraping: Puppeteer + Cheerio
├── Caching: Redis
└── Queue: Bull (for scraping jobs)
```

### Data Flow
```
Mobile/Web App
    ↓
API Gateway (Express)
    ↓
┌───────────┬──────────────┬────────────┐
│ PostgreSQL│ Redis Cache  │ Cloudinary │
│ (PostGIS) │              │  (Images)  │
└───────────┴──────────────┴────────────┘
    ↓
External Services
├── Google Cloud Vision (OCR)
├── Mapbox/Google Maps (Geocoding)
└── Web Scraping Queue
```

---

## 📋 PARALLEL IMPLEMENTATION TASKS

### Agents to Launch in Parallel

#### Agent 1: Database Schema Updates
- Add new wine classification fields
- Add OAuth provider fields
- Add venue metadata
- Update indexes for map clustering
- Migration scripts

#### Agent 2: Backend API Extensions
- OAuth authentication endpoints
- Map clustering API
- Venue auto-suggestion
- Guest mode endpoints
- Label OCR with address extraction

#### Agent 3: Web Scraping Service
- Build scraper for natural wine venues
- Implement event scraper
- Producer website scraper
- Data enrichment pipeline
- Queue management

#### Agent 4: React Native Mobile App - Core
- Project setup (Expo)
- Navigation structure
- Authentication flow (OAuth + guest)
- State management setup

#### Agent 5: React Native Mobile App - Features
- Map screen with clustering
- Check-in screen with camera/OCR
- Wine detail screens
- Profile screens
- Search/discovery

#### Agent 6: React Native Mobile App - Design System
- Font integration
- Color system
- Custom components with effects
- Letterpress/halftone utilities
- Organic shape components

#### Agent 7: Next.js Web App - Setup & Auth
- Next.js 14 project setup
- Authentication with NextAuth
- Layout and navigation
- Responsive design system

#### Agent 8: Next.js Web App - Features
- Map interface (Mapbox)
- Wine database browser
- Check-in creation
- User profiles
- Search functionality

#### Agent 9: Next.js Web App - Design System
- Tailwind config with custom colors
- Font integration
- Visual effects (letterpress, halftone)
- Component library
- Responsive utilities

#### Agent 10: Documentation & Deployment
- API documentation (OpenAPI/Swagger)
- Deployment guides
- Environment setup
- Mobile app store preparation
- CI/CD pipelines

---

## 🗂️ PROJECT STRUCTURE (Updated)

```
tipsy/
├── docs/
│   ├── DESIGN.md
│   ├── API.md
│   ├── VISUAL_DESIGN.md
│   └── DEPLOYMENT.md
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   │   ├── ocr.js
│   │   │   ├── geocoding.js
│   │   │   ├── scraping.js
│   │   │   └── clustering.js
│   │   └── utils/
│   └── migrations/
│
├── mobile/                    # React Native (Expo)
│   ├── app/                  # Expo Router
│   ├── components/
│   │   ├── map/
│   │   ├── checkin/
│   │   ├── design-system/
│   │   └── shared/
│   ├── services/
│   ├── store/
│   ├── utils/
│   ├── assets/
│   │   ├── fonts/
│   │   ├── images/
│   │   └── logo/
│   ├── app.json
│   └── package.json
│
├── web/                      # Next.js
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (map)/
│   │   ├── wines/
│   │   ├── producers/
│   │   └── api/
│   ├── components/
│   │   ├── ui/
│   │   ├── map/
│   │   └── design-system/
│   ├── lib/
│   ├── styles/
│   │   ├── globals.css
│   │   └── effects.css
│   ├── public/
│   │   ├── fonts/
│   │   └── images/
│   └── package.json
│
├── shared/                   # Shared utilities
│   ├── types/
│   ├── constants/
│   └── utils/
│
└── assets/
    └── logo/
        └── tipsykroonkurk_dark.svg
```

---

## 🎯 IMMEDIATE NEXT STEPS

1. ✅ Update all documentation with Tipsy branding
2. 🚀 Launch 10 parallel agents to build:
   - Database updates
   - Backend API extensions
   - Web scraping service
   - React Native mobile app (3 agents)
   - Next.js web app (3 agents)
   - Documentation & deployment
3. 🧪 Integration testing
4. 🎨 Design polish
5. 📱 App store submission prep

---

**Let's build this! Launching parallel agents now...**
