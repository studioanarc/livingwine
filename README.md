# 🍷 Cloudy - Natural Wine Tracking & Discovery

A social platform for natural and low-intervention wine enthusiasts to discover, track, and share their wine experiences with transparency and community at its core.

## 📖 Overview

**Cloudy** is like Untappd, but reimagined for the natural wine community. It combines social check-ins with deep production transparency, allowing users to discover wines that align with their values while building a knowledge base around natural winemaking practices.

### Why "Cloudy"?

Natural wines are often unfiltered, resulting in a cloudy appearance—a badge of authenticity. The name celebrates what makes natural wine unique while being memorable and approachable.

## ✨ Core Features

### For Wine Lovers
- **Check-ins & Ratings**: Track every wine you taste with detailed notes and ratings
- **Production Transparency**: See exactly how wines are made, from vineyard to bottle
- **Taste Profiles**: Build your personal flavor profile based on your check-ins
- **Discovery**: Find wines by style, region, producer, or production method
- **Social Feed**: See what friends are drinking in real-time
- **Context Tagging**: Tag wines by occasion ("sunny afternoon", "pizza wine", etc.)
- **Food Pairing**: Share and discover perfect food matches

### For Producers
- **Claim Your Profile**: Take ownership of your domaine's page
- **Share Your Story**: Detail your philosophy and winemaking practices
- **Upload Certifications**: Showcase organic, biodynamic, or other credentials
- **Engage with Community**: Answer questions and connect with consumers
- **Free Platform**: No fees, no advertising, no commercial pressure

### Unique to Natural Wine

#### Three-Pillar Transparency System

**🌱 Vineyard (Terroir & Growing)**
- Farming methods (organic, biodynamic, regenerative)
- Soil management and biodiversity
- Harvest details (manual, timing, transport)

**🍷 Cellar (Winemaking)**
- Fermentation process (spontaneous yeast, vessels, duration)
- Pressing methods and batch sizes
- Aging details (vessel type, duration)
- Interventions (sulfites, filtration, fining)

**📦 Distribution**
- Bottling information
- Production scale
- Where to buy and price ranges

#### Openness Rating System
Instead of a binary "trust score," we use a transparent, multi-faceted approach:
- **Completeness**: How much information has been shared (0-5 stars)
- **Community Verified**: Users who've visited the domaine can verify details
- **Producer Certified**: Official certifications and producer-confirmed data

## 🏗️ Project Structure

```
livingwine/
├── backend/              # Node.js/Express API server
│   ├── src/
│   │   ├── config/      # Database and app configuration
│   │   ├── models/      # Sequelize data models
│   │   ├── routes/      # API route handlers
│   │   ├── middleware/  # Authentication, validation, etc.
│   │   ├── controllers/ # Business logic (future)
│   │   ├── services/    # External services (future)
│   │   └── utils/       # Helper functions
│   └── tests/           # API tests
│
├── mobile/              # React Native mobile app (future)
│   ├── src/
│   │   ├── screens/     # App screens
│   │   ├── components/  # Reusable components
│   │   ├── navigation/  # Navigation setup
│   │   ├── services/    # API calls
│   │   └── utils/       # Helper functions
│   └── assets/          # Images, fonts, etc.
│
├── docs/                # Documentation
├── DESIGN.md           # Comprehensive design document
└── DATABASE_SCHEMA.sql # PostgreSQL database schema
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 14+
- (Optional) Redis for caching

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd livingwine
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Create PostgreSQL database**
   ```bash
   createdb cloudy_db
   ```

5. **Run database migrations**
   ```bash
   # Import the schema
   psql cloudy_db < ../DATABASE_SCHEMA.sql
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000/api/v1`

### API Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login

#### Users
- `GET /api/v1/users/:username` - Get user profile
- `GET /api/v1/users/:username/checkins` - Get user's check-ins
- `PATCH /api/v1/users/me` - Update own profile
- `GET /api/v1/users/me` - Get own profile (authenticated)

#### Wines
- `GET /api/v1/wines` - Search wines
- `GET /api/v1/wines/:slug` - Get wine details
- `POST /api/v1/wines` - Create new wine (authenticated)
- `PATCH /api/v1/wines/:slug` - Update wine (authenticated)
- `GET /api/v1/wines/:slug/checkins` - Get wine's check-ins

#### Producers
- `GET /api/v1/producers` - Search producers
- `GET /api/v1/producers/:slug` - Get producer details
- `POST /api/v1/producers` - Create producer (authenticated)
- `POST /api/v1/producers/:slug/claim` - Claim producer profile (authenticated)
- `PATCH /api/v1/producers/:slug` - Update producer (authenticated)

#### Check-ins
- `GET /api/v1/checkins` - Get public feed
- `GET /api/v1/checkins/:id` - Get single check-in
- `POST /api/v1/checkins` - Create check-in (authenticated)
- `PATCH /api/v1/checkins/:id` - Update check-in (authenticated)
- `DELETE /api/v1/checkins/:id` - Delete check-in (authenticated)

## 🧪 Example API Usage

### Register a User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "winenerd",
    "email": "winenerd@example.com",
    "password": "securepass123",
    "fullName": "Wine Enthusiast"
  }'
```

### Create a Check-in
```bash
curl -X POST http://localhost:3000/api/v1/checkins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "wineId": "wine-uuid-here",
    "rating": 4.5,
    "tastingNotes": "Funky, vibrant, with notes of citrus and a mineral finish",
    "flavorProfile": {
      "funky": 0.8,
      "clean": 0.6,
      "citrus": 0.9,
      "mineral": 0.7
    },
    "contextTags": ["sunny_afternoon", "chillable_red"],
    "foodPairings": "Grilled sardines"
  }'
```

## 🎨 Design Philosophy

### Anti-Commercial, Pro-Community
- No advertising or promoted content
- No direct sales integration
- Free for producers and users
- Focus on education and storytelling

### Transparency Over Marketing
- Detailed production information
- Community verification system
- Honest reviews and ratings
- No hiding behind fancy labels

### Education-First Gamification
- Achievements focus on learning, not consumption
- "Explored Orange Wines" > "Drank 100 Beers"
- Community contribution rewards
- User levels based on engagement quality

## 📱 Mobile App (Coming Soon)

The mobile app will be built with React Native for cross-platform iOS and Android support, featuring:
- Offline check-in capability
- Label scanning with OCR
- Location-based venue discovery
- Push notifications for friend activity
- Native camera integration

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- ✅ Core API (users, wines, producers, check-ins)
- ✅ Authentication system
- ✅ Basic search and discovery
- ⏳ Mobile app foundation

### Phase 2: Community Features
- [ ] Comments and social interactions
- [ ] Friend system and activity feed
- [ ] Lists and collections
- [ ] User achievements

### Phase 3: Producer Tools
- [ ] Producer portal
- [ ] Verification system
- [ ] Analytics dashboard
- [ ] Direct communication

### Phase 4: Advanced Features
- [ ] Label scanning (OCR)
- [ ] Recommendation engine
- [ ] Events and tastings
- [ ] Advanced search filters
- [ ] Venue check-ins with current selection

### Phase 5: Scale & Polish
- [ ] Performance optimization
- [ ] Internationalization
- [ ] Advanced moderation tools
- [ ] API rate limiting per user tier
- [ ] Analytics and insights

## 🤝 Contributing

We welcome contributions from the community! Whether it's:
- Bug reports and fixes
- Feature suggestions
- Documentation improvements
- Code contributions

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) (coming soon) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

Inspired by:
- The natural wine community and its grassroots values
- Untappd's social beer tracking model
- The importance of transparency in food production
- All the passionate winemakers doing things differently

## 📞 Contact

- **Project Website**: Coming soon
- **Documentation**: See [DESIGN.md](DESIGN.md) for comprehensive design details
- **Issues**: Use GitHub Issues for bug reports and feature requests

---

**Built with 🍷 for the natural wine community**
