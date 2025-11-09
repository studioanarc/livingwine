/**
 * Map State Management with Zustand
 */

import { create } from 'zustand';
import { Marker, MapFilters, Region, ClusterMarker } from '../types/map';

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

const DEFAULT_FILTERS: MapFilters = {
  showProducers: true,
  showVenues: true,
  showEvents: true,
  venueTypes: undefined,
  certifications: undefined,
  region: undefined,
};

const DEFAULT_REGION: Region = {
  latitude: 46.2276, // Center of France (natural wine hub)
  longitude: 2.2137,
  latitudeDelta: 15,
  longitudeDelta: 15,
};

export const useMapStore = create<MapStore>((set) => ({
  // Initial state
  markers: [],
  clusters: [],
  selectedMarker: null,
  filters: DEFAULT_FILTERS,
  searchQuery: '',
  region: DEFAULT_REGION,
  isLoading: false,
  error: null,
  bottomSheetOpen: false,

  // Actions
  setMarkers: (markers) => set({ markers }),

  setClusters: (clusters) => set({ clusters }),

  setSelectedMarker: (marker) =>
    set({
      selectedMarker: marker,
      bottomSheetOpen: marker !== null,
    }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    })),

  toggleFilter: (filterKey) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [filterKey]: !state.filters[filterKey],
      },
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setRegion: (region) => set({ region }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setBottomSheetOpen: (open) =>
    set({
      bottomSheetOpen: open,
      selectedMarker: open ? undefined : null,
    }),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  clearSearch: () => set({ searchQuery: '' }),
}));
