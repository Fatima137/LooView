
"use client";

import AddToiletForm from '@/components/add-toilet-form';
import type { NewToiletFormData, Toilet, ToiletAccessInfo, ToiletAccessibility, ToiletTypeDetails, ToiletFeaturesBoolean } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { DEFAULT_MAP_CENTER, TOILET_FEATURES_CONFIG, TOILET_TYPE_OPTIONS_CONFIG } from '@/lib/constants';
import { mockToilets } from '@/lib/data'; 
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AddToiletPage() {
  const { toast } = useToast();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [toilets, setToiletsState] = useState<Toilet[]>(mockToilets); 
  const [currentMapCenter, setCurrentMapCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.warn("Error getting user location for Add Toilet page. Using default.");
          setCurrentMapCenter(DEFAULT_MAP_CENTER);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.warn("Geolocation not supported. Using default for Add Toilet page.");
      setCurrentMapCenter(DEFAULT_MAP_CENTER);
    }
  }, []);


  const handleAddToiletSubmit = (data: NewToiletFormData) => {
    const accessInfo: ToiletAccessInfo = {
      locationType: data.locationType,
      // accessCode: data.accessCode, // Removed
      // price: data.price, // Removed
    };

    const accessibility: ToiletAccessibility = {
      isWheelchairAccessible: data.wheelchairAccessible,
      thresholdFree: data.wheelchairAccessible === 'yes' ? data.thresholdFree : undefined,
      wheelchairSpace: data.wheelchairAccessible === 'yes' ? data.wheelchairSpace : undefined,
      grabBars: data.wheelchairAccessible === 'yes' ? data.grabBars : undefined,
      automaticDoor: data.wheelchairAccessible === 'yes' ? data.automaticDoor : undefined,
      inaccessibleReason: data.wheelchairAccessible === 'no' ? data.inaccessibleReason : undefined,
    };
    
    const toiletTypes: ToiletTypeDetails = TOILET_TYPE_OPTIONS_CONFIG.reduce((acc, typeConfig) => {
      acc[typeConfig.id as keyof ToiletTypeDetails] = (data.selectedToiletTypes || []).includes(typeConfig.id);
      return acc;
    }, {} as ToiletTypeDetails);

    const features: ToiletFeaturesBoolean = TOILET_FEATURES_CONFIG.reduce((acc, currentFeature) => {
      acc[currentFeature.id as keyof ToiletFeaturesBoolean] = (data.features || []).includes(currentFeature.id);
      return acc;
    }, {} as ToiletFeaturesBoolean);


    const newToiletEntry: Toilet = {
      id: String(Date.now()),
      name: data.name,
      location: { latitude: data.latitude, longitude: data.longitude },
      address: data.address || `Near ${data.latitude.toFixed(3)}, ${data.longitude.toFixed(3)}`,
      createdBy: 'currentUserMockId', 
      createdAt: new Date().toISOString(),
      averageRating: data.rating,
      features,
      accessInfo,
      accessibility,
      toiletTypes,
      photoUrls: data.photo?.[0] ? [URL.createObjectURL(data.photo[0])] : [`https://picsum.photos/seed/newloo${Date.now()}/400/300`],
      reviewCount: 1,
      countryCode: 'GB', 
      countryFlag: '🇬🇧',
      legacyReview: data.review,
      quickTags: data.quickTags || [],
    };
    
    setToiletsState((prev) => [newToiletEntry, ...prev]); 
    mockToilets.unshift(newToiletEntry); // Update global mock data

    toast({
      title: 'Toilet Added!',
      description: `${data.name} has been successfully added to LooView.`,
      variant: 'default',
    });
    router.push('/'); 
  };

  const handleGoBack = () => {
    if (isClient) {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  };

  const handleCancel = () => {
    router.push('/'); 
  };

  if (!isClient || !currentMapCenter) {
    return (
        <div className="flex flex-grow items-center justify-center p-4">
            <p>Loading location for form...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 flex-grow">
      <Button variant="outline" onClick={handleGoBack} className="mb-6">
        <ArrowLeft size={16} className="mr-2" />
        Back
      </Button>
      <div className="max-w-2xl mx-auto bg-card p-6 sm:p-8 rounded-xl shadow-2xl border border-border">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Add a New Loo</h1>
        <p className="text-muted-foreground mb-8">
          Found a toilet worth talking about? Fill in the details below. Your contribution helps everyone!
        </p>
        <AddToiletForm
          onSubmit={handleAddToiletSubmit}
          onCancel={handleCancel}
          initialCoordinates={currentMapCenter}
        />
      </div>
    </div>
  );
}
