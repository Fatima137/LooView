
"use client";

import type { Toilet } from '@/lib/types';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/lib/constants';
import { useEffect, useState } from 'react';
import { Toilet as ToiletIcon, Star } from 'lucide-react';

interface MapViewProps {
  toilets: Toilet[];
  onMarkerClick: (toilet: Toilet) => void;
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  className?: string;
  mapId?: string; 
}

export default function MapView({
  toilets,
  onMarkerClick,
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
  className = "w-full h-full",
  mapId = "looview-main-map", 
}: MapViewProps) {
  const [currentCenter, setCurrentCenter] = useState(center);
  const [selectedToiletForInfoWindow, setSelectedToiletForInfoWindow] = useState<Toilet | null>(null);

  useEffect(() => {
    setCurrentCenter(center);
  }, [center]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted text-destructive-foreground p-4 rounded-md">
        <p className="text-center">
          Google Maps API Key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.
        </p>
      </div>
    );
  }

  const handleMarkerClickInternal = (toilet: Toilet) => {
    setSelectedToiletForInfoWindow(toilet); // For InfoWindow
    onMarkerClick(toilet); // Call external handler for sheet opening
  };

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} solutionChannel="GMP_QB_Looview_v1_Map">
      <Map
        defaultCenter={currentCenter}
        defaultZoom={zoom} // Set initial zoom from props
        center={currentCenter}
        // zoom={zoom} // Removed to allow native zoom controls to work independently
        gestureHandling={'greedy'}
        disableDefaultUI={false}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        zoomControl={true}      
        className={className}
        mapId={mapId} 
        style={{ borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
      >
        {toilets.map((toilet) => (
          <AdvancedMarker
            key={toilet.id}
            position={{ lat: toilet.location.latitude, lng: toilet.location.longitude }}
            onClick={() => handleMarkerClickInternal(toilet)}
            title={`${toilet.name} (⭐ ${toilet.averageRating.toFixed(1)})`} 
          >
            <Pin background={'hsl(var(--primary))'} borderColor={'hsl(var(--primary-foreground))'} glyphColor={'hsl(var(--primary-foreground))'}>
                <ToiletIcon size={18}/>
            </Pin>
          </AdvancedMarker>
        ))}
        
        {selectedToiletForInfoWindow && (
          <InfoWindow
            position={{ lat: selectedToiletForInfoWindow.location.latitude, lng: selectedToiletForInfoWindow.location.longitude }}
            onCloseClick={() => setSelectedToiletForInfoWindow(null)}
            headerDisabled 
            pixelOffset={new google.maps.Size(0, -40)} 
          >
            <div className="p-2 bg-card text-card-foreground rounded-md shadow-lg max-w-xs">
              <h3 className="text-md font-semibold mb-1">{selectedToiletForInfoWindow.name}</h3>
              <div className="flex items-center text-sm">
                <Star size={14} className="text-accent fill-accent mr-1" />
                {selectedToiletForInfoWindow.averageRating.toFixed(1)}
                {selectedToiletForInfoWindow.legacyReview && <span className="mx-1">&middot;</span>}
                {selectedToiletForInfoWindow.legacyReview && <span className="truncate text-xs text-muted-foreground">{selectedToiletForInfoWindow.legacyReview}</span>}
              </div>
               {selectedToiletForInfoWindow.address && <p className="text-xs text-muted-foreground mt-1">{selectedToiletForInfoWindow.address}</p>}
              <button 
                onClick={() => onMarkerClick(selectedToiletForInfoWindow)} 
                className="text-xs text-primary hover:underline mt-2">
                View Details
              </button>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}
