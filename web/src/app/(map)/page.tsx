'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import MapView with no SSR to avoid hydration issues with Mapbox
const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-muted">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

  if (!mapboxToken) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
        <div className="max-w-md rounded-lg border bg-card p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-destructive">Configuration Required</h2>
          <p className="mb-4 text-muted-foreground">
            Mapbox token is not configured. Please add your Mapbox access token to the environment variables.
          </p>
          <div className="rounded bg-muted p-4 text-left text-sm">
            <p className="mb-2 font-mono">Add to .env.local:</p>
            <code className="block font-mono text-xs">
              NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
            </code>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Get your free token at{' '}
            <a
              href="https://account.mapbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold">Explore Natural Wine</h1>
            <p className="text-sm text-muted-foreground">
              Discover producers, venues, and events worldwide
            </p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border bg-background px-4 py-2 text-sm hover:bg-muted">
              <span className="mr-2">🍇</span>
              Producers
            </button>
            <button className="rounded-lg border bg-background px-4 py-2 text-sm hover:bg-muted">
              <span className="mr-2">🍷</span>
              Venues
            </button>
          </div>
        </div>
      </header>

      {/* Map */}
      <main className="flex-1">
        <MapView mapboxToken={mapboxToken} onLocationClick={setSelectedLocation} />
      </main>

      {/* Location Info Panel (if selected) */}
      {selectedLocation && (
        <div className="fixed bottom-4 left-1/2 z-10 w-96 -translate-x-1/2 rounded-lg border bg-card p-6 shadow-lg">
          <button
            onClick={() => setSelectedLocation(null)}
            className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
          <h3 className="mb-2 text-xl font-bold">{selectedLocation.name}</h3>
          <p className="mb-1 text-sm text-muted-foreground">
            {selectedLocation.region}, {selectedLocation.country}
          </p>
          <p className="mb-4 text-xs capitalize text-muted-foreground">{selectedLocation.type}</p>
          <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
            View Details
          </button>
        </div>
      )}
    </div>
  );
}
