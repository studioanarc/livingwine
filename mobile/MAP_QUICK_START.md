# Map Feature Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
cd mobile

# Install required packages
npm install react-native-maps @gorhom/bottom-sheet zustand react-native-svg
npm install react-native-reanimated react-native-gesture-handler

# For iOS
cd ios && pod install && cd ..
```

### Step 2: Configure Google Maps API

#### Get API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Maps SDK for Android" and "Maps SDK for iOS"
4. Create credentials → API Key
5. Copy your API key

#### Add to Expo Config

Edit `app.json`:

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
    },
    "plugins": [
      "react-native-maps"
    ]
  }
}
```

### Step 3: Configure Reanimated

Edit `babel.config.js`:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // Must be last!
    ],
  };
};
```

### Step 4: Set Environment Variables

Create `.env`:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

Or for production:

```bash
EXPO_PUBLIC_API_URL=https://your-api.com/api
```

### Step 5: Clear Cache & Run

```bash
# Clear Metro bundler cache
npx expo start -c

# Or with React Native CLI
npx react-native start --reset-cache
```

---

## 🧪 Test with Mock Data

Don't have a backend yet? Add this mock data fetcher to `mapService.ts`:

```typescript
// Add this method to MapService class in mapService.ts

async fetchMockData(): Promise<{ markers: Marker[]; clusters: ClusterMarker[] }> {
  // Mock producers
  const producers: ProducerMarker[] = [
    {
      id: '1',
      type: 'producer',
      name: 'Domaine Marcel Lapierre',
      producerName: 'Domaine Marcel Lapierre',
      region: 'Beaujolais, France',
      coordinates: { latitude: 46.1561, longitude: 4.6419 },
      certifications: ['Organic', 'Biodynamic'],
      isVerified: true,
      wineCount: 12,
      rating: 4.8,
    },
    {
      id: '2',
      type: 'producer',
      name: 'Domaine de la Cadette',
      producerName: 'Domaine de la Cadette',
      region: 'Burgundy, France',
      coordinates: { latitude: 47.0503, longitude: 4.8613 },
      certifications: ['Organic'],
      isVerified: true,
      wineCount: 8,
      rating: 4.6,
    },
  ];

  // Mock venues
  const venues: VenueMarker[] = [
    {
      id: '3',
      type: 'venue',
      name: 'La Cave à Michel',
      venueName: 'La Cave à Michel',
      venueType: 'wine_bar',
      coordinates: { latitude: 48.8566, longitude: 2.3522 },
      naturalWineFocus: true,
      rating: 4.5,
      currentWineCount: 45,
      priceRange: 2,
    },
    {
      id: '4',
      type: 'venue',
      name: 'Le Verre Volé',
      venueName: 'Le Verre Volé',
      venueType: 'wine_shop',
      coordinates: { latitude: 48.8738, longitude: 2.3586 },
      naturalWineFocus: true,
      rating: 4.7,
      currentWineCount: 120,
      priceRange: 3,
    },
  ];

  // Mock events
  const events: EventMarker[] = [
    {
      id: '5',
      type: 'event',
      name: 'Natural Wine Fair',
      eventName: 'Natural Wine Fair',
      eventType: 'Wine Fair',
      coordinates: { latitude: 48.8606, longitude: 2.3376 },
      startDate: '2025-12-01',
      endDate: '2025-12-03',
      attendeeCount: 250,
    },
  ];

  return {
    markers: [...producers, ...venues, ...events],
    clusters: [],
  };
}
```

Then use it in the map screen for testing:

```typescript
// In map.tsx, temporarily replace fetchMarkers():
const fetchMarkers = async () => {
  try {
    setLoading(true);
    setError(null);

    // Use mock data for testing
    const data = await mapService.fetchMockData();

    setMarkers(data.markers);
    setClusters(data.clusters);
  } catch (err) {
    console.error('Error fetching markers:', err);
    setError(err instanceof Error ? err.message : 'Failed to load map data');
  } finally {
    setLoading(false);
  }
};
```

---

## 📱 Run the App

### iOS
```bash
npx expo run:ios
# or
npm run ios
```

### Android
```bash
npx expo run:android
# or
npm run android
```

### Web (Preview Only - Maps may not work fully)
```bash
npx expo start
# Press 'w' for web
```

---

## ✅ Verify Installation

You should see:
1. ✅ Map loads with Google Maps
2. ✅ Mock markers appear (if using mock data)
3. ✅ Search bar at top
4. ✅ Filter buttons below search
5. ✅ My Location button (bottom right)
6. ✅ Tapping marker opens bottom sheet
7. ✅ No console errors

---

## 🐛 Common Issues

### Issue: Map not displaying (blank screen)

**Solution 1**: Check API key is correct
```bash
# In app.json, verify:
"googleMapsApiKey": "AIza..." // Should start with AIza
```

**Solution 2**: Enable required APIs in Google Cloud
- Maps SDK for Android ✅
- Maps SDK for iOS ✅

**Solution 3**: Rebuild native code
```bash
cd ios && pod install && cd ..
npx expo run:ios
```

### Issue: "Reanimated 2 not configured"

**Solution**: Check babel.config.js has reanimated plugin as LAST plugin
```javascript
plugins: [
  // ... other plugins
  'react-native-reanimated/plugin', // MUST BE LAST
],
```

Then clear cache:
```bash
npx expo start -c
```

### Issue: Bottom sheet not opening

**Solution**: Ensure gesture handler is set up
```bash
npm install react-native-gesture-handler
```

In `app/_layout.tsx` or `index.tsx`:
```typescript
import 'react-native-gesture-handler';
```

### Issue: Markers not appearing

**Solution**: Check console for API errors
```bash
# In terminal running metro bundler, look for:
Error fetching markers: [error details]
```

Use mock data (see above) to test without backend.

---

## 🎨 Customize Colors

Edit `/mobile/constants/mapConstants.ts`:

```typescript
export const MARKER_COLORS = {
  PRODUCER: '#YOUR_COLOR',
  VENUE: {
    WINE_BAR: '#YOUR_COLOR',
    // ...
  },
};
```

---

## 📚 Next Steps

1. ✅ Get map working with mock data
2. ✅ Test all interactions (zoom, search, filters)
3. ✅ Customize colors and styling
4. ✅ Implement backend API endpoints
5. ✅ Replace mock data with real API calls
6. ✅ Add real marker data
7. ✅ Test on physical devices
8. ✅ Submit to app stores

---

## 💡 Pro Tips

### Tip 1: Use React Query for Better Data Management
```bash
npm install @tanstack/react-query
```

### Tip 2: Test on Real Devices
Google Maps API has different behavior on simulators vs real devices.

### Tip 3: Optimize Marker Count
If you have 1000+ markers, implement server-side clustering or use react-native-map-clustering.

### Tip 4: Cache Aggressively
The built-in cache is 5 minutes. Adjust in `mapService.ts` based on your data update frequency.

### Tip 5: Handle Permissions Properly
Add location permission handling:
```typescript
import * as Location from 'expo-location';

const requestLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission denied', 'Enable location in settings');
  }
};
```

---

## 📞 Need Help?

1. Check `MAP_IMPLEMENTATION.md` for detailed docs
2. Review examples in `MapExample.tsx`
3. Check constants in `mapConstants.ts`
4. Review type definitions in `types/map.ts`

---

## 🎉 You're Ready!

Your interactive map feature is now set up and ready to use. Happy coding!

---

**Quick Start Version**: 1.0.0
**Last Updated**: 2025-11-09
