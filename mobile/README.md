# Tipsy Mobile App

React Native mobile application for Tipsy - Natural Wine Tracking & Discovery, built with Expo and TypeScript.

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Secure Storage**: Expo Secure Store
- **Maps**: React Native Maps
- **Camera/OCR**: Expo Camera
- **Authentication**: Expo Auth Session (OAuth)

## Project Structure

```
mobile/
├── app/                    # Expo Router screens (file-based routing)
│   ├── _layout.tsx        # Root layout with providers
│   └── index.tsx          # Home screen
├── components/            # Reusable React components
├── services/              # API services
│   ├── api.ts            # Axios instance and API endpoints
│   └── auth.service.ts   # Authentication service
├── store/                 # Zustand state management
│   └── auth.store.ts     # Authentication store
├── constants/            # App constants
│   ├── Colors.ts         # Tipsy color palette
│   └── Config.ts         # Environment configuration
├── types/                # TypeScript type definitions
│   └── index.ts          # Core types
├── utils/                # Utility functions
│   └── storage.ts        # Secure storage utilities
└── assets/               # Images, fonts, icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (macOS) or Android Emulator

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Configure your environment variables in `.env`:
   - `EXPO_PUBLIC_API_URL` - Backend API URL
   - `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key
   - OAuth credentials (if using social login)

### Running the App

- Start development server:
  ```bash
  npm start
  ```

- Run on iOS:
  ```bash
  npm run ios
  ```

- Run on Android:
  ```bash
  npm run android
  ```

- Run on web:
  ```bash
  npm run web
  ```

## Key Features

### Authentication
- Email/password login and registration
- OAuth support (Google, Apple)
- Secure token storage with Expo Secure Store
- Automatic token refresh

### Navigation
- File-based routing with Expo Router
- Type-safe navigation
- Deep linking support

### State Management
- Zustand for lightweight state management
- TanStack Query for server state
- Optimistic updates and caching

### Maps Integration
- Interactive map with clustering
- Venue discovery
- Location-based features

### Camera & OCR
- Wine label scanning
- Photo capture for check-ins
- OCR text extraction

## Design System

### Color Palette

The app uses a warm, organic color scheme inspired by natural wine culture:

- **Primary**: Cream (#FCF8F2), Warm Beige (#F3E4DB)
- **Accents**: Mondrian Blue (#4A90E2), Natural Wine Red (#E63946)
- **Wine Colors**: Red (#8B3A3A), Orange (#E67E22), Pink (#E9A6A6)
- **Earth Tones**: Olive Green (#7C9473), Clay Brown (#A67C52)
- **Neutrals**: Charcoal (#3A3A3A), Warm Gray (#8B8680)

See `constants/Colors.ts` for the complete palette and semantic mappings.

### Typography

- **Display**: Fraunces (soft serif with personality)
- **Headings**: Cabinet Grotesk (unique sans-serif)
- **Body**: Inter (clean, modern)
- **Accent**: Caveat (handwritten touches)

## API Integration

The app connects to the Tipsy backend API. All API calls are made through the configured axios instance in `services/api.ts`.

### API Services

- **Authentication**: Login, register, OAuth, token refresh
- **Wines**: Search, browse, create, update
- **Check-ins**: Create, view, delete check-ins
- **Venues**: Discover nearby venues, venue details
- **Producers**: Browse producers, view details
- **Users**: Profile management, social features

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_API_URL` | Backend API base URL | Yes |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | Yes (for maps) |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID | No (if using OAuth) |
| `EXPO_PUBLIC_APPLE_CLIENT_ID` | Apple OAuth client ID | No (if using OAuth) |
| `EXPO_PUBLIC_ENVIRONMENT` | Environment (dev/staging/prod) | No |

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow functional component patterns
- Use hooks for state and effects
- Keep components small and focused

### State Management
- Use Zustand for global state (auth, user preferences)
- Use TanStack Query for server state (API data)
- Keep state as local as possible

### File Organization
- Group files by feature when applicable
- Use index files for cleaner imports
- Keep related files together

## Building for Production

### iOS

1. Configure app.json with your bundle identifier
2. Build with EAS:
   ```bash
   eas build --platform ios
   ```

### Android

1. Configure app.json with your package name
2. Add Google Maps API key to app.json
3. Build with EAS:
   ```bash
   eas build --platform android
   ```

## Troubleshooting

### Common Issues

**Maps not showing:**
- Ensure Google Maps API key is configured in app.json
- Check permissions are granted on device

**Authentication errors:**
- Verify API_URL is correct in .env
- Check backend is running and accessible

**Camera not working:**
- Grant camera permissions on device
- Check app.json camera configuration

## Contributing

1. Create a feature branch
2. Make your changes
3. Test on both iOS and Android
4. Submit a pull request

## License

Proprietary - Tipsy Natural Wine Tracking
