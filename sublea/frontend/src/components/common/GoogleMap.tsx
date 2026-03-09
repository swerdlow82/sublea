import React, { useMemo } from 'react';
import { GoogleMap as ReactGoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

interface Coordinate {
  lat: number;
  lng: number;
}

interface MapMarker extends Coordinate {
  id: string;
  title?: string;
}

interface GoogleMapProps {
  markers?: MapMarker[];
  center?: Coordinate;
  zoom?: number;
  height?: string;
  width?: string;
  onMarkerClick?: (id: string) => void;
  selectedMarkerId?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 44.0521, // default to Eugene, OR, as in the mock data
  lng: -123.0868
};

// Map dark theme to match Sublea
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
];

export const GoogleMap: React.FC<GoogleMapProps> = ({ 
  markers = [], 
  center, 
  zoom = 13,
  height = '400px',
  width = '100%',
  onMarkerClick,
  selectedMarkerId
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const mapCenter = useMemo(() => {
    if (center) return center;
    if (markers.length > 0) return { lat: markers[0].lat, lng: markers[0].lng };
    return defaultCenter;
  }, [center, markers]);
  
  const options = useMemo(() => ({
    styles: darkMapStyle,
    disableDefaultUI: false,
    zoomControl: true,
  }), []);

  // No API key configured — show a placeholder
  if (!apiKey) {
    return (
      <div
        style={{ height, width }}
        className="flex flex-col items-center justify-center bg-[var(--surface)] text-[var(--text-muted)] rounded-[var(--radius-card)] border border-[var(--border)] gap-3"
      >
        <svg className="h-10 w-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <div className="text-center px-4">
          <p className="font-semibold text-sm text-[var(--text-main)]">Map Coming Soon</p>
          <p className="text-xs mt-1 opacity-70">Waiting on API key activation</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        style={{ height, width }}
        className="flex flex-col items-center justify-center bg-[var(--surface)] text-[var(--text-muted)] rounded-[var(--radius-card)] border border-[var(--border)] gap-3"
      >
        <svg className="h-10 w-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <div className="text-center px-4">
          <p className="font-semibold text-sm text-[var(--text-main)]">Map Coming Soon</p>
          <p className="text-xs mt-1 opacity-70">Waiting on API key activation</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{ height, width }} className="flex items-center justify-center bg-[var(--surface)] text-[var(--text-muted)] rounded-[var(--radius-card)] border border-[var(--border)] animate-pulse">
        Loading Map...
      </div>
    );
  }

  return (
    /* Wrapper is relative so we can layer an overlay on top of Google's own error UI */
    <div style={{ height, width }} className="relative rounded-[var(--radius-card)] overflow-hidden border border-[var(--border)]">
      <ReactGoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={zoom}
        options={options}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.title}
            onClick={() => onMarkerClick?.(marker.id)}
          />
        ))}
      </ReactGoogleMap>

      {/* Hides Google's "Oops! Something went wrong" overlay when key is invalid/unpaid.
          This div sits on top at pointer-events:none so the map is still draggable once the
          key is active. When the key activates the map renders fine underneath. */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--surface)] pointer-events-none"
        style={{ display: 'none' }} /* switched to flex via JS/CSS when gm-err-container visible */
        id="map-error-overlay"
      />
    </div>
  );
};

