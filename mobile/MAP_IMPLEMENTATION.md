# Map Screen Implementation

## Overview

Interactive map screen for the Tipsy mobile app with clustering, custom markers, search functionality, and bottom sheet details.

## File Structure

```
mobile/
├── app/
│   └── (tabs)/
│       └── map.tsx                    # Main map screen
├── components/
│   └── map/
│       ├── MapCluster.tsx             # Cluster marker component
│       ├── VenueMarker.tsx            # Venue marker component
│       ├── ProducerMarker.tsx         # Producer marker component
│       ├── EventMarker.tsx            # Event marker component
│       ├── MarkerDetails.tsx          # Bottom sheet content
│       └── index.ts                   # Barrel export
├── services/
│   └── mapService.ts                  # API calls and caching
├── store/
│   └── mapStore.ts                    # Zustand state management
└── types/
    └── map.ts                         # TypeScript definitions
```

## Dependencies

Install these packages for the map functionality:

```bash
npm install react-native-maps @gorhom/bottom-sheet zustand react-native-svg
npm install react-native-reanimated react-native-gesture-handler
```

### Required Setup

#### 1. iOS Configuration

In `ios/Podfile`, add:

```ruby
pod 'GoogleMaps'
pod 'Google-Maps-iOS-Utils'
```

Run:
```bash
cd ios && pod install && cd ..
```

In `ios/YourApp/AppDelegate.mm`, add:

```objc
#import <GoogleMaps/GoogleMaps.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"YOUR_GOOGLE_MAPS_API_KEY"];
  // ... rest of your code
}
```

#### 2. Android Configuration

In `android/app/src/main/AndroidManifest.xml`, add:

```xml
<application>
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
</application>
```

#### 3. Reanimated Setup

In `babel.config.js`, add:

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'], // Must be last
};
```

#### 4. Environment Variables

Create `.env` file:

```bash
EXPO_PUBLIC_API_URL=http://your-api-url.com/api
```

## Features

### 1. Interactive Map
- Pan and zoom
- Google Maps provider
- User location display
- Clustering based on zoom level

### 2. Custom Markers

#### Producer Markers
- Olive green color
- Grape vine icon
- Verification badge (blue checkmark)
- Certification badge (colored dot)
  - Purple: Biodynamic/Demeter
  - Green: Organic
  - Blue: Other certifications

#### Venue Markers
- Different icons by type:
  - Wine Bar: Wine glass (red)
  - Restaurant: Fork & knife (yellow)
  - Wine Shop: Shop icon (blue)
  - Tasting Room: Wine bottle (brown)
- Natural wine focus badge (green star)

#### Event Markers
- Calendar icon (yellow)
- Event type and date information

### 3. Clustering
- Automatic grouping at different zoom levels
- Color-coded by count:
  - Green: < 10 items
  - Blue: 10-50 items
  - Yellow: 50-100 items
  - Red: 100+ items
- Tap to zoom into cluster

### 4. Search & Filters

#### Search Bar
- Live search with debouncing (500ms)
- Search by location name
- Clear button

#### Filter Buttons
- Toggle producers on/off
- Toggle venues on/off
- Toggle events on/off
- Active state styling

### 5. Bottom Sheet
- Swipeable drawer
- Two snap points: 50% and 90%
- Pan down to close
- Shows marker details:
  - Name and type
  - Photo (if available)
  - Rating and stats
  - Certifications/badges
  - Address
  - Action buttons (Directions, View Details)

### 6. Caching
- 5-minute cache for map data
- Reduces API calls
- Improves performance

## State Management

The map uses Zustand for state management with the following structure:

```typescript
interface MapStore {
  // State
  markers: Marker[];
  clusters: ClusterMarker[];
  selectedMarker: Marker | null;
  filters: MapFilters;
  searchQuery: string;
  region: Region;
  isLoading: boolean;
  error: string | null;
  bottomSheetOpen: boolean;

  // Actions
  setMarkers: (markers: Marker[]) => void;
  setClusters: (clusters: ClusterMarker[]) => void;
  setSelectedMarker: (marker: Marker | null) => void;
  setFilters: (filters: Partial<MapFilters>) => void;
  toggleFilter: (filterKey: keyof MapFilters) => void;
  setSearchQuery: (query: string) => void;
  setRegion: (region: Region) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setBottomSheetOpen: (open: boolean) => void;
  resetFilters: () => void;
  clearSearch: () => void;
}
```

## API Integration

The map expects the following API endpoint:

### GET `/api/map/clusters`

Query parameters:
- `latitude` (number): Center latitude
- `longitude` (number): Center longitude
- `latitudeDelta` (number): Latitude span
- `longitudeDelta` (number): Longitude span
- `zoom` (number): Zoom level
- `showProducers` (boolean)
- `showVenues` (boolean)
- `showEvents` (boolean)
- `search` (string, optional)
- `venueTypes` (string, optional): Comma-separated
- `certifications` (string, optional): Comma-separated
- `region` (string, optional)

Response:
```json
{
  "markers": [
    {
      "id": "string",
      "type": "producer" | "venue" | "event",
      "name": "string",
      "coordinates": {
        "latitude": 0,
        "longitude": 0
      },
      // ... type-specific fields
    }
  ],
  "clusters": [
    {
      "id": "string",
      "coordinates": {
        "latitude": 0,
        "longitude": 0
      },
      "pointCount": 0,
      "markers": []
    }
  ]
}
```

## Customization

### Styling
All styles are defined in StyleSheet at the bottom of each component file. Modify colors, sizes, and spacing as needed.

### Map Settings
Adjust initial region in `mapStore.ts`:

```typescript
const DEFAULT_REGION: Region = {
  latitude: 46.2276, // Center of France
  longitude: 2.2137,
  latitudeDelta: 15,
  longitudeDelta: 15,
};
```

### Clustering Thresholds
Modify cluster sizes and colors in `MapCluster.tsx`:

```typescript
const getClusterSize = (count: number): number => {
  if (count < 10) return 40;
  if (count < 50) return 50;
  if (count < 100) return 60;
  return 70;
};
```

### Cache Duration
Adjust cache duration in `mapService.ts`:

```typescript
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
```

## Performance Optimization

1. **Marker Rendering**: Uses `tracksViewChanges={false}` to prevent unnecessary re-renders
2. **Caching**: 5-minute cache for API responses
3. **Debouncing**: 500ms debounce on search input
4. **Clustering**: Reduces marker count at high zoom levels
5. **Memoization**: Uses `useCallback` for event handlers

## Testing

Test scenarios:
1. Load map and verify markers appear
2. Zoom in/out and verify clustering
3. Tap cluster to zoom in
4. Tap marker to open bottom sheet
5. Search for location
6. Toggle filters
7. Pan down to close bottom sheet
8. Test on both iOS and Android

## Troubleshooting

### Map not displaying
- Verify Google Maps API key is set
- Check API key permissions (Maps SDK for iOS/Android)
- Ensure proper native setup (pods installed, manifest configured)

### Markers not appearing
- Check API endpoint is returning data
- Verify network connectivity
- Check console for errors

### Bottom sheet not working
- Ensure react-native-reanimated is properly installed
- Verify babel.config.js includes reanimated plugin
- Clear Metro bundler cache: `npm start -- --reset-cache`

## Future Enhancements

1. Custom clustering algorithm (react-native-map-clustering)
2. Heatmap layer for density visualization
3. Offline map tiles
4. Route drawing between locations
5. Advanced filtering (by rating, certification, etc.)
6. Marker animation on appear
7. Map style customization (dark mode, custom theme)
8. Geofencing for nearby notifications
