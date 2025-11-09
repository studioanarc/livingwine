# Natural Wine Tracking App - Design Document

## Executive Summary
A social discovery and tracking app for natural/low-intervention wine enthusiasts. The app combines Untappd-style check-ins with deep transparency into wine production methods, emphasizing authenticity, community validation, and the grassroots values of the natural wine movement.

---

## 1. UNTAPPD FEATURE ANALYSIS

### Features That Translate Well ✅

| Untappd Feature | Translation to Natural Wine | Priority |
|----------------|----------------------------|----------|
| **Check-ins** | ✅ Perfect fit - track wines tasted | HIGH |
| **Ratings & Reviews** | ✅ Essential for community feedback | HIGH |
| **Personal Profile** | ✅ Build taste profile over time | HIGH |
| **Friend Activity Feed** | ✅ See what friends are drinking | HIGH |
| **Venue/Location** | ✅ Track wine bars, natural wine shops, restaurants | HIGH |
| **Discovery/Search** | ✅ Find natural wines by style, region, producer | HIGH |
| **Wish List** | ✅ Track wines to try | MEDIUM |
| **Photos** | ✅ Share wine labels, food pairings, moments | MEDIUM |
| **Nearby Venues** | ✅ Find natural wine spots | MEDIUM |
| **Lists/Collections** | ✅ Curate personal collections | MEDIUM |

### Features to Modify or Skip ❌

| Untappd Feature | Why Modify/Skip | Alternative |
|----------------|-----------------|-------------|
| **Badges/Gamification** | Too commercial for grassroots ethos | Subtle achievements focused on learning (e.g., "Tried 10 orange wines") |
| **Beer Styles** | Wine has different taxonomy | Grape varietals + production methods |
| **ABV Focus** | Less relevant for wine | Include but de-emphasize |
| **Shopping Integration** | Risk of commercialization | "Where to find" info only, no direct sales |
| **Brewery Focus** | Different model | Producer/Domaine focus with vineyard transparency |

---

## 2. NATURAL WINE-SPECIFIC FEATURES

### A. Production Transparency Framework

The app uses a three-pillar system to track wine production:

#### **🌱 VINEYARD (Terroir & Growing)**
- **Location**: Specific region, appellation, plot info
- **Farming Methods**:
  - Organic certification (EU Organic, Demeter, Biodynamic, etc.)
  - No synthetic pesticides/herbicides/fertilizers
  - Soil management practices (no-till, cover crops, compost)
  - Biodiversity initiatives
- **Harvest Details**:
  - Manual vs. mechanical harvest
  - Harvest date/timing
  - Same-day processing
  - Cooled transport (yes/no)
  - Selection criteria (hand-sorted, table sorting)

#### **🍷 CELLAR (Winemaking)**
- **Fermentation**:
  - Spontaneous/wild yeast vs. selected strains
  - Vessel type (stainless steel, concrete, amphorae, oak, etc.)
  - Temperature control (none, ambient, controlled)
  - Maceration time (for reds/orange wines)
  - Fermentation duration
- **Pressing**:
  - Method (direct press, basket press, pneumatic, gravity)
  - Whole cluster vs. destemmed
  - Batch size
- **Aging**:
  - Vessel type (oak barrel, concrete egg, amphorae, stainless)
  - Duration
  - New vs. old oak
  - Lees contact
- **Interventions**:
  - Added sulfites (none, minimal at bottling, amount in ppm)
  - Filtration (none, minimal, standard)
  - Fining (none, traditional methods, commercial)
  - Additions (none, or specify what)
  - pH adjustments
  - Temperature manipulation

#### **📦 DISTRIBUTION (Post-Production)**
- **Bottling**:
  - Estate-bottled vs. contract
  - Bottling date
  - Closure type (cork, screw cap, crown cap)
- **Distribution**:
  - Production volume (small batch, micro, estate, etc.)
  - Distribution channels (direct, importers, natural wine shops)
  - Temperature-controlled storage/transport
- **Availability**:
  - Where to buy (specific shops, wine bars, online)
  - Price range
  - Current vintage availability

### B. Transparency Score ("Openness Rating")

Instead of "trust factor" (which sounds judgmental), use **"Openness Rating"** with three components:

1. **Completeness** (0-5 stars): How much information the producer has shared
   - 5 stars: Full transparency across all three pillars
   - 1 star: Minimal information provided

2. **Community Verified** (badge):
   - Users who've visited the domaine can verify information
   - "Verified by X community members"
   - Weighted by user reputation

3. **Producer Certified** (badge):
   - Producer has claimed their profile and confirmed data
   - Official organic/biodynamic certifications uploaded

**Guarantor System (Soft Approach)**:
- Instead of harsh penalties, use a reputation system
- Users earn "credibility points" for accurate contributions
- Users with low credibility scores have their edits flagged for review
- Community moderators (elected volunteers) can review disputes
- False information results in credibility loss, not immediate ban
- Persistent bad actors can be suspended after review

### C. Taste Profile System

Natural wines have unique characteristics that differ from conventional wines:

**Flavor Profiles**:
- Funky/barnyard notes
- Clean/pure fruit
- Oxidative character
- Reductive notes
- Savory/umami
- Mineral/saline
- Floral/aromatic
- Earthy/forest floor
- Citrus/bright acidity
- Tipsy/hazy appearance (with sediment note)

**Mouthfeel**:
- Tannic structure
- Acidity level
- Body (light/medium/full)
- Texture (silky, grippy, chalky, etc.)

**Categories**:
- Skin-contact whites (orange wines)
- Pét-nat (natural sparkling)
- Conventional styles (red, white, rosé)
- Maceration length for skin-contact

**Drinking Context** (your idea!):
- Food pairing suggestions (specific dishes)
- Occasion tags:
  - "Sunny afternoon sipper"
  - "Dinner party wine"
  - "Pizza wine"
  - "Contemplative/serious"
  - "Chillable red"
  - "Natural wine gateway" (for beginners)
  - "Advanced/acquired taste"

---

## 3. COMMUNITY FEATURES

### Social Interactions
- **Check-in Feed**: See friend activity in real-time
- **Comments**: On check-ins and wine pages
- **Toasts**: Like Untappd's "toast" (quick appreciation)
- **Direct Messages**: Connect with other enthusiasts
- **Mentions & Tags**: Tag friends in check-ins

### Knowledge Sharing
- **Community Notes**: Wiki-style collaborative wine information
- **Producer Stories**: Long-form profiles written by community
- **Tasting Groups**: Local groups for tastings/meetups
- **Event Calendar**: Natural wine fairs, tastings, domaine visits
- **Forums/Discussions**: Topic-based discussions (not just wine-specific)

### Achievements (Subtle, Educational)
Instead of points/badges, use learning milestones:
- "Explored Orange Wines" (tried 5 skin-contact whites)
- "Regional Explorer: Jura" (tried 10 wines from region)
- "Method Explorer: Pét-Nat" (tried 5 natural sparkling)
- "Domaine Supporter" (tried 5+ wines from same producer)
- "Community Contributor" (verified 10 producer details)

### User Levels
Based on contributions and engagement, not consumption:
- **Explorer**: New member
- **Enthusiast**: Active participation
- **Advocate**: Consistent quality contributions
- **Steward**: Trusted community member (can moderate)

---

## 4. PRODUCER FEATURES

### Producer Portal
- Claim and manage domaine profile
- Upload certifications (organic, biodynamic)
- Submit detailed production information
- Update current vintage info
- Add photos (vineyard, cellar, team)
- Respond to community questions
- Analytics: See who's drinking your wines, where, ratings

### Verification Process
1. Producer requests profile claim
2. Verification via domain email or official documentation
3. Profile marked as "Producer-Managed"
4. Community can still contribute, but producer has final say

### Anti-Commercial Safeguards
- No direct sales or "buy now" buttons
- No advertising or promoted posts
- Producer accounts are free
- Focus on storytelling and transparency, not marketing

---

## 5. DATA MODEL STRUCTURE

### Core Entities

```
User
├── profile (bio, photo, location, preferences)
├── taste_profile (generated from check-ins)
├── credibility_score
├── achievements
└── privacy_settings

Wine
├── basic_info (name, vintage, producer, grape varietals, region)
├── vineyard_details (farming, harvest, terroir)
├── cellar_details (fermentation, aging, interventions)
├── distribution_details (bottling, availability, price)
├── openness_rating (completeness, verified, certified)
└── community_notes

Check-in
├── wine_id
├── user_id
├── rating (0-5)
├── tasting_notes
├── flavor_profile_tags
├── context_tags (food pairing, occasion)
├── venue_id
├── price_paid
├── where_purchased
├── photo
├── serving_temp
└── timestamp

Producer/Domaine
├── profile (name, location, history, philosophy)
├── certifications
├── contact_info
├── claimed (true/false)
├── verified_by_users []
└── wines []

Venue
├── name, location, type (wine bar, shop, restaurant)
├── natural_wine_focus (true/false)
├── current_selection []
└── user_ratings

Community Contribution
├── user_id
├── contribution_type (verification, edit, photo, note)
├── target_id (wine/producer)
├── credibility_votes
└── status (approved, pending, disputed)
```

---

## 6. USER EXPERIENCE FLOW

### New User Journey
1. **Onboarding**:
   - Explain natural wine philosophy
   - Select taste preferences
   - Follow friends or suggested users
   - Find local venues

2. **First Check-in**:
   - Search or scan wine label (OCR)
   - Rate and add tasting notes
   - Tag context (where, with what food)
   - Share with friends

3. **Discovery**:
   - Get recommendations based on taste profile
   - Browse trending natural wines
   - Explore by region, style, or producer
   - Find nearby natural wine venues

### Advanced User Journey
1. **Deep Engagement**:
   - Contribute producer verification
   - Organize tasting groups
   - Build curated lists
   - Become community steward

2. **Producer Interaction**:
   - Ask questions to producers
   - Read producer stories
   - Plan domaine visits
   - Learn about upcoming releases

---

## 7. TECHNICAL ARCHITECTURE

### Technology Stack Recommendations

**Mobile App**:
- React Native or Flutter (cross-platform iOS/Android)
- Offline-first architecture for check-ins

**Backend**:
- Node.js/Express or Django
- PostgreSQL (relational data) + Redis (caching)
- GraphQL API for flexible data queries
- Elasticsearch for search functionality

**Additional Services**:
- Image hosting: Cloudinary or AWS S3
- OCR: Google Cloud Vision API (label scanning)
- Maps: Mapbox or Google Maps
- Authentication: OAuth 2.0 + JWT
- Real-time: WebSockets for feed updates

**Hosting**:
- AWS, Google Cloud, or Railway
- CDN for image delivery
- Automated backups

### Key Features to Build First (MVP)
1. User authentication and profiles
2. Wine database (manual entry initially)
3. Check-in system with ratings
4. Basic search and discovery
5. Friend system and activity feed
6. Venue database
7. Simple producer profiles

### Phase 2 Features
1. Producer portal and verification
2. Advanced transparency scoring
3. Community verification system
4. Tasting groups and events
5. Label scanning (OCR)
6. Recommendations engine
7. Mobile app optimization

---

## 8. WHAT MAKES THIS VALUABLE

### For Consumers
✅ **Transparency**: Know exactly how wine is made
✅ **Discovery**: Find wines aligned with values
✅ **Community**: Connect with like-minded enthusiasts
✅ **Education**: Learn about natural wine production
✅ **Practical Info**: Where to buy, price points, food pairing
✅ **Taste Tracking**: Build personal preference profile
✅ **Authenticity**: Community-verified information

### For Producers
✅ **Direct Connection**: Engage with consumers
✅ **Storytelling**: Share philosophy and methods
✅ **Transparency**: Demonstrate commitment to values
✅ **Feedback**: Understand how wines are received
✅ **Distribution**: Help consumers find their wines
✅ **Free Platform**: No advertising or fees

### For Venues
✅ **Discoverability**: Natural wine bars/shops get found
✅ **Community**: Connect with local enthusiasts
✅ **Selection Showcase**: Display current offerings
✅ **Events**: Promote tastings and special releases

---

## 9. APP NAME SUGGESTIONS

Based on natural wine culture, playfulness, and memorability:

### Top Choices:

1. **Vinethread** - Connects the thread from vine to glass
2. **Tipsy** - Playful reference to unfiltered natural wines
3. **RootStock** - Foundation of viticulture + building a stock of favorites
4. **NaturCheck** - Direct and functional (check-in for natural wine)
5. **GrapeTruth** - Transparency + wordplay
6. **PureVin** - Simple, sophisticated (vin = wine)
7. **FunkTank** - Embraces the funky character of natural wines (fun but might be too casual)
8. **Ungrafted** - Reference to ungrafted vines + authentic/pure
9. **Unfiltered** - Literal (natural wines often unfiltered) + metaphorical (honest reviews)
10. **SipStory** - Every wine has a story

### Personal Favorite: **Tipsy** ☁️🍷
- Short, memorable, one word
- Distinctive in app stores
- Embraces what makes natural wine unique (cloudiness = unfiltered = authentic)
- Playful but sophisticated
- Works internationally
- Good for branding (cloud/droplet icon)

### Runner-up: **Vinethread**
- Beautiful metaphor for traceability
- Sophisticated
- Emphasizes the connection between all parts of production

---

## 10. NEXT STEPS

### Immediate Actions:
1. ✅ Complete this design document
2. ⏭️ Create database schema
3. ⏭️ Set up project structure
4. ⏭️ Build basic API endpoints
5. ⏭️ Create mobile app framework
6. ⏭️ Implement authentication
7. ⏭️ Build wine and check-in models

### Research Needs:
- Interview natural wine consumers about pain points
- Survey wine shop owners about venue features
- Talk to producers about what info they'd share
- Test with small beta group from natural wine community

### Design Needs:
- UI/UX mockups
- Branding and visual identity
- Icon design
- User flow diagrams

---

## APPENDIX: KEY DIFFERENTIATORS FROM UNTAPPD

| Aspect | Untappd (Beer) | Our App (Natural Wine) |
|--------|----------------|------------------------|
| **Focus** | Gamification, collection | Transparency, education |
| **Ethos** | Casual, fun | Thoughtful, authentic |
| **Producer Info** | Basic brewery info | Deep production transparency |
| **Verification** | User-generated | Community + producer verified |
| **Commercial** | Shopping, ads | Anti-commercial, grassroots |
| **Community** | Large, broad | Niche, values-driven |
| **Education** | Style education | Production method education |
| **Ratings** | Simple rating | Rating + context + production |

---

**Document Version**: 1.0
**Last Updated**: 2025-11-09
**Status**: Design Phase
