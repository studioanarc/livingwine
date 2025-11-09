# Cloudy Web Application

The web application for Cloudy - Natural Wine Tracking & Discovery platform.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: NextAuth.js v5 (Beta)
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **HTTP Client**: Axios
- **Maps**: Mapbox GL
- **UI Components**: Radix UI
- **Animations**: Framer Motion

## Project Structure

```
web/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── (auth)/              # Auth pages (login, register, forgot-password)
│   │   ├── (map)/               # Map page
│   │   ├── wines/               # Wine pages
│   │   │   └── [slug]/          # Individual wine page
│   │   ├── producers/           # Producer pages
│   │   │   └── [slug]/          # Individual producer page
│   │   ├── api/                 # API routes
│   │   │   └── auth/            # NextAuth API routes
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── ui/                  # UI primitives
│   │   ├── layout/              # Layout components
│   │   ├── wine/                # Wine components
│   │   ├── producer/            # Producer components
│   │   ├── map/                 # Map components
│   │   └── checkin/             # Check-in components
│   ├── lib/                     # Library code
│   │   ├── api.ts               # API client
│   │   ├── auth.ts              # NextAuth configuration
│   │   ├── config.ts            # App configuration
│   │   ├── hooks/               # Custom React hooks
│   │   ├── providers/           # Context providers
│   │   ├── store/               # Zustand stores
│   │   ├── types/               # TypeScript types
│   │   └── utils/               # Utility functions
│   └── styles/                  # Additional styles
├── public/                      # Static assets
├── .env.local                   # Local environment variables
├── .env.example                 # Environment variables template
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Backend API running on `http://localhost:3000`

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:
   - `NEXT_PUBLIC_API_BASE_URL`: Backend API URL
   - `NEXTAUTH_SECRET`: Secret for NextAuth (generate with `openssl rand -base64 32`)
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
   - `APPLE_CLIENT_ID` & `APPLE_CLIENT_SECRET`: Apple OAuth credentials
   - `NEXT_PUBLIC_MAPBOX_TOKEN`: Mapbox access token

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

### Build for Production

```bash
npm run build
npm run start
```

## Features

### Authentication
- Email/password authentication
- Google OAuth
- Apple OAuth
- Protected routes with middleware
- Session management with JWT

### Data Management
- React Query for server state
- Zustand for client state
- Automatic caching and refetching
- Optimistic updates

### Styling
- Tailwind CSS v4 with custom design system
- Cloudy brand colors (burgundy, amber, sky blue)
- Dark mode support
- Responsive design
- Custom scrollbar and focus styles

### API Integration
- Axios-based API client
- Automatic token management
- Error handling and retry logic
- Type-safe API calls

## Design System

### Colors

**Primary (Burgundy/Wine)**
- Used for primary actions and branding
- Shades from 50-900

**Secondary (Amber/Orange Wine)**
- Used for secondary actions and highlights
- Shades from 50-900

**Accent (Sky/Cloud Blue)**
- Used for interactive elements
- Shades from 50-900

**Neutral (Earth/Stone)**
- Used for text and backgrounds
- Shades from 50-900

### Typography
- Font Family: Inter (system fonts fallback)
- Font sizes: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl

### Components
- Built with Radix UI primitives
- Fully accessible
- Keyboard navigation

## API Client Usage

```typescript
import { api } from '@/lib/api';

// Login
const { data } = await api.login('email@example.com', 'password');

// Get wines
const wines = await api.getWines({ wineType: ['red', 'orange'] });

// Create check-in
const checkin = await api.createCheckin({
  wineId: 'wine-id',
  rating: 4.5,
  tastingNotes: 'Funky and delicious!',
  contextTags: ['sunny_afternoon'],
});
```

## State Management

```typescript
import { useAuth, useUI, useMap } from '@/lib/store/useStore';

// Auth state
const { user, isAuthenticated, logout } = useAuth();

// UI state
const { isSidebarOpen, toggleSidebar } = useUI();

// Map state
const { center, zoom, setCenter } = useMap();
```

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

## License

MIT License - see LICENSE file for details

---

**Built with love for the natural wine community**
