import React, { useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { GoogleMap as ReactGoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';

interface Coordinate {
  lat: number;
  lng: number;
}

interface MapMarker extends Coordinate {
  id: string;
  title?: string;
  rent?: number;
  address?: string;
  city?: string;
  state?: string;
  bedrooms?: number;
  bathrooms?: number;
  imageUrl?: string;
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
  lat: 44.0521,
  lng: -123.0868
};

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

// Inline styles for the InfoWindow (avoids needing a CSS file)
const infoWindowStyles = {
  container: {
    backgroundColor: '#1a2332',
    borderRadius: '10px',
    overflow: 'hidden',
    width: '220px',
    fontFamily: 'inherit',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    margin: '-8px -12px', // pulls content to edges of InfoWindow padding
  } as React.CSSProperties,
  image: {
    width: '100%',
    height: '110px',
    objectFit: 'cover' as const,
    display: 'block',
    backgroundColor: '#242f3e',
  } as React.CSSProperties,
  imagePlaceholder: {
    width: '100%',
    height: '110px',
    backgroundColor: '#242f3e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,
  body: {
    padding: '10px 12px 12px',
  } as React.CSSProperties,
  price: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#f3d19c',
    marginBottom: '3px',
  } as React.CSSProperties,
  title: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#e8e8e8',
    marginBottom: '4px',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  } as React.CSSProperties,
  address: {
    fontSize: '11px',
    color: '#9ca5b3',
    marginBottom: '8px',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  } as React.CSSProperties,
  meta: {
    display: 'flex',
    gap: '10px',
    fontSize: '11px',
    color: '#9ca5b3',
  } as React.CSSProperties,
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  } as React.CSSProperties,
  viewButton: {
    display: 'block',
    marginTop: '10px',
    padding: '7px 12px',
    backgroundColor: '#f3d19c',
    color: '#1a2332',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    textAlign: 'center' as const,
    textDecoration: 'none',
    letterSpacing: '0.02em',
  } as React.CSSProperties,
};

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
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

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

  const handleMarkerClick = useCallback((id: string) => {
    setActiveMarkerId(prev => prev === id ? null : id);
    onMarkerClick?.(id);
  }, [onMarkerClick]);

  const handleMapClick = useCallback(() => {
    setActiveMarkerId(null);
  }, []);

  const activeMarker = markers.find(m => m.id === activeMarkerId);

  // No API key configured
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
    <div style={{ height, width }} className="relative rounded-[var(--radius-card)] overflow-hidden border border-[var(--border)]">
      <ReactGoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={zoom}
        options={options}
        onClick={handleMapClick}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.title}
            onClick={() => handleMarkerClick(marker.id)}
            icon={
              marker.id === (activeMarkerId ?? selectedMarkerId)
                ? {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: '#f3d19c',
                    fillOpacity: 1,
                    strokeColor: '#1a2332',
                    strokeWeight: 2,
                  }
                : undefined
            }
          />
        ))}

        {activeMarker && (
          <InfoWindow
            position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
            onCloseClick={() => setActiveMarkerId(null)}
            options={{ pixelOffset: new google.maps.Size(0, -40) }}
          >
            <div style={infoWindowStyles.container}>
              {/* Listing image or placeholder */}
              {activeMarker.imageUrl ? (
                <img
                  src={activeMarker.imageUrl}
                  alt={activeMarker.title}
                  style={infoWindowStyles.image}
                />
              ) : (
                <div style={infoWindowStyles.imagePlaceholder}>
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#515c6d" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
                  </svg>
                </div>
              )}

              <div style={infoWindowStyles.body}>
                {activeMarker.rent && (
                  <div style={infoWindowStyles.price}>
                    ${activeMarker.rent.toLocaleString()}<span style={{ fontSize: '11px', fontWeight: 400, color: '#9ca5b3' }}>/mo</span>
                  </div>
                )}
                {activeMarker.title && (
                  <div style={infoWindowStyles.title}>{activeMarker.title}</div>
                )}
                {(activeMarker.address || activeMarker.city) && (
                  <div style={infoWindowStyles.address}>
                    {[activeMarker.address, activeMarker.city, activeMarker.state].filter(Boolean).join(', ')}
                  </div>
                )}
                {(activeMarker.bedrooms != null || activeMarker.bathrooms != null) && (
                  <div style={infoWindowStyles.meta}>
                    {activeMarker.bedrooms != null && (
                      <span style={infoWindowStyles.metaItem}>
                        🛏 {activeMarker.bedrooms} bd
                      </span>
                    )}
                    {activeMarker.bathrooms != null && (
                      <span style={infoWindowStyles.metaItem}>
                        🚿 {activeMarker.bathrooms} ba
                      </span>
                    )}
                  </div>
                )}
                <Link
                  to={`/listings/${activeMarker.id}`}
                  style={infoWindowStyles.viewButton}
                >
                  View Listing →
                </Link>
              </div>
            </div>
          </InfoWindow>
        )}
      </ReactGoogleMap>

      <div
        className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--surface)] pointer-events-none"
        style={{ display: 'none' }}
        id="map-error-overlay"
      />
    </div>
  );
};