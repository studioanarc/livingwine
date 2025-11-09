# Mobile App Dependencies

## Required Dependencies for Map Feature

Add these to your `package.json`:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-native": "^0.73.0",
    "expo": "^50.0.0",
    "react-native-maps": "^1.10.0",
    "@gorhom/bottom-sheet": "^4.6.0",
    "zustand": "^4.5.0",
    "react-native-svg": "^14.1.0",
    "react-native-reanimated": "^3.6.0",
    "react-native-gesture-handler": "^2.14.0"
  }
}
```

## Installation

```bash
# Install all dependencies
npm install

# Or with yarn
yarn install

# Install iOS pods
cd ios && pod install && cd ..
```

## Expo Configuration

If using Expo, add to `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow Tipsy to use your location to find nearby natural wine venues."
        }
      ],
      "react-native-maps"
    ],
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

## Environment Setup

Create `.env` file in mobile directory:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Additional Recommended Dependencies

```json
{
  "dependencies": {
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "@tanstack/react-query": "^5.0.0",
    "react-native-safe-area-context": "^4.8.0",
    "react-native-screens": "^3.29.0",
    "expo-location": "^16.5.0",
    "expo-constants": "^15.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-native": "^0.73.0",
    "typescript": "^5.3.0"
  }
}
```

## TypeScript Configuration

Create or update `tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
```

## React Native Config

If not using Expo, create `react-native.config.js`:

```javascript
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts/'],
};
```

## Metro Config

Update `metro.config.js` for better bundling:

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

module.exports = config;
```
