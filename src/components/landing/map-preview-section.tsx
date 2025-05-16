
"use client";

import type { Toilet } from '@/lib/types';
import MapView from '@/components/map-view';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLocale } from '@/context/locale-context'; // Import useLocale

interface MapPreviewSectionProps {
  toilets: Toilet[];
  onMarkerClick: (toilet: Toilet) => void;
  center: google.maps.LatLngLiteral;
}

export default function MapPreviewSection({ toilets, onMarkerClick, center }: MapPreviewSectionProps) {
  const { t } = useLocale(); // Initialize useLocale
  const handleViewFullMap = () => {
    alert(t('landing.mapPreview.fullMapAlert')); // Example of using t() for an alert
  };

  return (
    <section id="map-preview-section" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-foreground">
          {t('landing.mapPreview.title')}
        </h2>
        <div className="relative h-[400px] md:h-[500px] w-full rounded-xl overflow-hidden shadow-2xl border border-border">
          <MapView
            toilets={toilets}
            onMarkerClick={onMarkerClick}
            center={center}
            zoom={10}
            className="w-full h-full"
            mapId="looview_map_preview_landing"
          />
        </div>
        <div className="text-center mt-8">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-3 rounded-lg shadow-md"
            onClick={handleViewFullMap}
          >
            <Globe className="mr-2 h-5 w-5" />
            {t('landing.mapPreview.button')}
          </Button>
        </div>
      </div>
    </section>
  );
}

    