# Map Feature File Structure

## Complete Directory Structure

```
mobile/
├── app/
│   └── (tabs)/
│       └── map.tsx                          # Main map screen with all features
│
├── components/
│   └── map/
│       ├── MapCluster.tsx                   # Cluster marker component
│       ├── VenueMarker.tsx                  # Venue marker component
│       ├── ProducerMarker.tsx               # Producer marker component
│       ├── EventMarker.tsx                  # Event marker component
│       ├── MarkerDetails.tsx                # Bottom sheet content
│       ├── MapExample.tsx                   # Usage examples
│       └── index.ts                         # Barrel exports
│
├── services/
│   └── mapService.ts                        # API calls and caching
│
├── store/
│   └── mapStore.ts                          # Zustand state management
│
├── types/
│   └── map.ts                               # TypeScript definitions
│
├── utils/
│   └── mapUtils.ts                          # Helper functions
│
├── hooks/
│   └── useMap.ts                            # Custom map hook
│
├── constants/
│   └── mapConstants.ts                      # Configuration constants
│
└── [Documentation]
    ├── MAP_FEATURE_SUMMARY.md               # Complete feature overview
    ├── MAP_IMPLEMENTATION.md                # Detailed implementation guide
    ├── MAP_QUICK_START.md                   # 5-minute setup guide
    └── MAP_FILE_STRUCTURE.md                # This file
```

---

## File Descriptions

### Core Files (Required)

#### 1. `/app/(tabs)/map.tsx` (1,050 lines)
**Purpose**: Main map screen component
**Dependencies**: All map components, hooks, services
**Key Features**:
- MapView integration
- Search bar
- Filter buttons
- Bottom sheet
- Loading states
- Error handling

**Exports**: `MapScreen` (default)

---

#### 2. `/types/map.ts` (90 lines)
**Purpose**: TypeScript type definitions
**Dependencies**: None
**Exports**:
- `Coordinates`
- `Region`
- `MarkerType`
- `VenueType`
- `ProducerMarker`
- `VenueMarker`
- `EventMarker`
- `ClusterMarker`
- `MapFilters`
- `MapState`

---

#### 3. `/store/mapStore.ts` (120 lines)
**Purpose**: Zustand state management
**Dependencies**: zustand, types/map
**Exports**: `useMapStore` (hook)

**State**:
- markers, clusters
- selectedMarker
- filters (producers/venues/events)
- searchQuery
- region
- isLoading, error
- bottomSheetOpen

**Actions**:
- setMarkers, setClusters
- setSelectedMarker
- setFilters, toggleFilter
- setSearchQuery
- setRegion
- resetFilters, clearSearch

---

#### 4. `/services/mapService.ts` (260 lines)
**Purpose**: API integration and caching
**Dependencies**: types/map
**Exports**: `mapService` (singleton), `MapService` (class)

**Methods**:
- `fetchClusteredMarkers()`
- `fetchMarkers()`
- `fetchMarkerDetails()`
- `searchLocations()`
- `geocodeAddress()`
- `clearCache()`

**Features**:
- 5-minute cache
- Zoom level calculation
- Error handling

---

### Component Files

#### 5. `/components/map/MapCluster.tsx` (90 lines)
**Purpose**: Display cluster markers
**Dependencies**: react-native-maps, types/map
**Exports**: `MapCluster`

**Props**:
- `cluster: ClusterMarker`
- `onPress: (cluster) => void`

**Features**:
- Dynamic sizing by count
- Color coding
- Shadow effects

---

#### 6. `/components/map/VenueMarker.tsx` (140 lines)
**Purpose**: Display venue markers
**Dependencies**: react-native-maps, react-native-svg, types/map
**Exports**: `VenueMarker`

**Props**:
- `venue: VenueMarker`
- `onPress: (venue) => void`
- `isSelected?: boolean`

**Features**:
- Type-specific icons (4 types)
- Natural wine badge
- Custom SVG rendering

---

#### 7. `/components/map/ProducerMarker.tsx` (130 lines)
**Purpose**: Display producer markers
**Dependencies**: react-native-maps, react-native-svg, types/map
**Exports**: `ProducerMarker`

**Props**:
- `producer: ProducerMarker`
- `onPress: (producer) => void`
- `isSelected?: boolean`

**Features**:
- Grape vine icon
- Verification badge
- Certification badges
- Color-coded certifications

---

#### 8. `/components/map/EventMarker.tsx` (70 lines)
**Purpose**: Display event markers
**Dependencies**: react-native-maps, react-native-svg, types/map
**Exports**: `EventMarker`

**Props**:
- `event: EventMarker`
- `onPress: (event) => void`
- `isSelected?: boolean`

**Features**:
- Calendar icon
- Simple, clean design

---

#### 9. `/components/map/MarkerDetails.tsx` (340 lines)
**Purpose**: Bottom sheet content for marker details
**Dependencies**: react-native, react-native-svg, types/map
**Exports**: `MarkerDetails`

**Props**:
- `marker: Marker`
- `onNavigate?: () => void`
- `onViewDetails?: () => void`

**Features**:
- Type-specific layouts
- Photo display
- Stats and ratings
- Action buttons
- Scrollable content

---

#### 10. `/components/map/index.ts` (7 lines)
**Purpose**: Barrel export for components
**Exports**: All map components

---

### Utility Files

#### 11. `/hooks/useMap.ts` (130 lines)
**Purpose**: Convenience hook for map functionality
**Dependencies**: store/mapStore, services/mapService, types/map
**Exports**: `useMap` (hook)

**Returns**:
- All store state
- All store actions
- `fetchMarkers()`
- `refresh()`
- `search()`
- `zoomToMarker()`
- `zoomToCluster()`
- `getMarkersByType()`
- `getVisibleMarkersCount()`

---

#### 12. `/utils/mapUtils.ts` (330 lines)
**Purpose**: Map calculation utilities
**Dependencies**: types/map
**Exports**: 15+ utility functions

**Functions**:
- Distance: `calculateDistance()`, `formatDistance()`
- Zoom: `calculateZoomLevel()`, `getRegionDeltaFromZoom()`
- Regions: `getBoundingBox()`, `getRegionForCoordinates()`
- Coordinates: `getCenterPoint()`, `interpolateCoordinates()`
- Validation: `isValidCoordinate()`, `isCoordinateInRegion()`
- Formatting: `formatCoordinates()`, `parseCoordinates()`
- Navigation: `getDirectionsUrl()`

---

#### 13. `/constants/mapConstants.ts` (330 lines)
**Purpose**: Configuration constants
**Dependencies**: types/map
**Exports**: 20+ constant objects

**Constants**:
- `DEFAULT_REGIONS` (France, Italy, Spain, etc.)
- `CLUSTER_SIZES`
- `MARKER_COLORS`
- `CERTIFICATION_COLORS`
- `ANIMATION_DURATION`
- `ZOOM_LEVELS`
- `MAP_PADDING`
- `CACHE_SETTINGS`
- `SEARCH_SETTINGS`
- `MAP_ENDPOINTS`
- `FEATURES` (feature flags)
- `PERFORMANCE`
- `ERROR_MESSAGES`
- `BOTTOM_SHEET_CONFIG`
- `FILTER_PRESETS`

---

### Example & Documentation Files

#### 14. `/components/map/MapExample.tsx` (200 lines)
**Purpose**: Usage examples
**Exports**: 3 example components

**Examples**:
1. `SimpleMapExample` - Basic usage
2. `MapWithControlsExample` - Filter controls
3. `ProgrammaticMapExample` - Programmatic navigation

---

#### 15. `/MAP_FEATURE_SUMMARY.md`
**Purpose**: Complete feature overview
**Sections**:
- Files created
- Features implemented
- Design decisions
- API requirements
- Installation
- Usage examples
- Testing checklist

---

#### 16. `/MAP_IMPLEMENTATION.md`
**Purpose**: Detailed implementation guide
**Sections**:
- File structure
- Dependencies
- Setup (iOS/Android)
- Features explanation
- State management
- API integration
- Customization
- Performance
- Troubleshooting

---

#### 17. `/MAP_QUICK_START.md`
**Purpose**: 5-minute setup guide
**Sections**:
- Installation steps
- Configuration
- Mock data setup
- Running the app
- Common issues
- Pro tips

---

## Total Statistics

- **Total TypeScript Files**: 14
- **Total Documentation Files**: 4
- **Total Lines of Code**: ~2,800
- **Components Created**: 5
- **Utility Functions**: 15+
- **Type Definitions**: 10+
- **Configuration Constants**: 20+

---

## Import Graph

```
map.tsx
├── components/map/
│   ├── MapCluster
│   ├── VenueMarker
│   ├── ProducerMarker
│   ├── EventMarker
│   └── MarkerDetails
├── store/mapStore (useMapStore)
├── services/mapService
├── types/map
└── react-native-maps, @gorhom/bottom-sheet

useMap.ts
├── store/mapStore
├── services/mapService
└── types/map

mapService.ts
└── types/map

mapStore.ts
└── types/map

mapUtils.ts
└── types/map

mapConstants.ts
└── types/map

[All Components]
└── types/map
```

---

## File Sizes (Approximate)

| File | Lines | Size |
|------|-------|------|
| map.tsx | 450 | ~15 KB |
| MapCluster.tsx | 90 | ~3 KB |
| VenueMarker.tsx | 140 | ~5 KB |
| ProducerMarker.tsx | 130 | ~5 KB |
| EventMarker.tsx | 70 | ~2.5 KB |
| MarkerDetails.tsx | 340 | ~12 KB |
| mapService.ts | 260 | ~9 KB |
| mapStore.ts | 120 | ~4 KB |
| useMap.ts | 130 | ~4.5 KB |
| mapUtils.ts | 330 | ~11 KB |
| mapConstants.ts | 330 | ~11 KB |
| map.ts (types) | 90 | ~3 KB |
| **TOTAL** | **~2,480** | **~85 KB** |

---

## Dependency Tree

```
External Dependencies:
├── react-native-maps          (Map component)
├── @gorhom/bottom-sheet       (Bottom sheet UI)
├── zustand                    (State management)
├── react-native-svg           (Custom icons)
├── react-native-reanimated    (Animations)
└── react-native-gesture-handler (Gestures)

Internal Dependencies:
All files depend on types/map.ts for type definitions
```

---

## Getting Started

1. **Read First**: `MAP_QUICK_START.md` (5-minute guide)
2. **Implementation Details**: `MAP_IMPLEMENTATION.md`
3. **Complete Overview**: `MAP_FEATURE_SUMMARY.md`
4. **File Structure**: This document
5. **Usage Examples**: `components/map/MapExample.tsx`

---

## File Relationships

```
User Interaction Flow:
map.tsx → User taps marker
  ↓
calls handleMarkerPress()
  ↓
sets selectedMarker (via useMapStore)
  ↓
opens BottomSheet
  ↓
renders MarkerDetails component

Data Flow:
User changes region
  ↓
map.tsx detects region change
  ↓
calls mapService.fetchClusteredMarkers()
  ↓
checks cache
  ↓
makes API call (if needed)
  ↓
updates mapStore
  ↓
map.tsx re-renders with new markers
```

---

**Document Version**: 1.0.0
**Last Updated**: 2025-11-09
