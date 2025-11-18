'use client';

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mock data for demo
const mockLocations = [
  {
    id: '1',
    type: 'producer',
    name: 'Domaine de la Romanée-Conti',
    coordinates: [4.9591, 47.1624],
    region: 'Burgundy',
    country: 'France',
  },
  {
    id: '2',
    type: 'venue',
    name: 'Ten Bells',
    coordinates: [-0.0727, 51.5195],
    region: 'London',
    country: 'UK',
  },
  {
    id: '3',
    type: 'producer',
    name: 'Foradori',
    coordinates: [11.1257, 46.2021],
    region: 'Trentino',
    country: 'Italy',
  },
  {
    id: '4',
    type: 'venue',
    name: 'La Buvette',
    coordinates: [2.3522, 48.8566],
    region: 'Paris',
    country: 'France',
  },
  {
    id: '5',
    type: 'producer',
    name: 'Gut Oggau',
    coordinates: [16.8858, 47.9167],
    region: 'Burgenland',
    country: 'Austria',
  },
];

interface MapViewProps {
  mapboxToken: string;
  onLocationClick?: (location: any) => void;
}

export default function MapView({ mapboxToken, onLocationClick }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [2.5, 48.5], // Center on France
      zoom: 4,
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
      })
    );

    map.current.on('load', () => {
      setMapLoaded(true);

      // Add markers
      mockLocations.forEach((location) => {
        const el = document.createElement('div');
        el.className = 'map-marker';
        el.style.width = '40px';
        el.style.height = '40px';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.fontSize = '20px';

        if (location.type === 'producer') {
          el.style.backgroundColor = '#6B8E23'; // Olive green
          el.textContent = '🍇';
        } else {
          el.style.backgroundColor = '#C1272D'; // Wine red
          el.textContent = '🍷';
        }

        const marker = new mapboxgl.Marker(el)
          .setLngLat(location.coordinates as [number, number])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div style="padding: 8px;">
                <h3 style="margin: 0 0 4px 0; font-weight: 600;">${location.name}</h3>
                <p style="margin: 0; font-size: 14px; color: #666;">${location.region}, ${location.country}</p>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #999; text-transform: capitalize;">${location.type}</p>
              </div>`
            )
          )
          .addTo(map.current!);

        el.addEventListener('click', () => {
          if (onLocationClick) {
            onLocationClick(location);
          }
        });
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, onLocationClick]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full rounded-lg overflow-hidden" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      )}
    </div>
  );
}
