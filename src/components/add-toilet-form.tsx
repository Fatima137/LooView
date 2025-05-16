"use client";

import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import StarRating from '@/components/star-rating';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { NewToiletFormData, ToiletFeatureConfig } from '@/lib/types';
import {
  TOILET_FEATURES_CONFIG,
  GOOGLE_MAPS_API_KEY,
  LOCATION_TYPES, // Will be an array of keys
  ACCESSIBILITY_OPTIONS, // Will be an array of objects with value and labelKey
  TOILET_TYPE_OPTIONS_CONFIG,
  SECTION_ICONS,
  QUICK_TAGS_CONFIG,
  QUICK_TAG_CATEGORIES_CONFIG
} from '@/lib/constants';
import { Camera, MapPin, Save, LocateFixed, AlertTriangle, Loader2 } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useCallback, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/locale-context'; // Import useLocale

// Function to generate the Zod schema with translated error messages
const getFormSchema = (t: (key: string, replacements?: Record<string, string | number>) => string) => z.object({
  name: z.string().min(3, t('addToilet.validation.nameMin')).max(100, t('addToilet.validation.nameMax')),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().max(200, t('addToilet.validation.addressMax')).optional(),
  locationType: z.string().optional(),
  wheelchairAccessible: z.enum(["yes", "no", "not_sure"]),
  thresholdFree: z.boolean().optional().default(false),
  wheelchairSpace: z.boolean().optional().default(false),
  grabBars: z.boolean().optional().default(false),
  automaticDoor: z.boolean().optional().default(false),
  inaccessibleReason: z.string().max(500, t('addToilet.validation.inaccessibleReasonMax')).optional(),
  selectedToiletTypes: z.array(z.string()).optional().default([]),
  features: z.array(z.string()).optional().default([]),
  photo: z.custom<FileList>().optional(),
  rating: z.number().min(1, t('addToilet.validation.ratingMinMax')).max(5, t('addToilet.validation.ratingMinMax')),
  review: z.string().max(500, t('addToilet.validation.reviewMax')).optional(),
  quickTags: z.array(z.string()).optional().default([]),
});

type AddToiletFormValues = z.infer<ReturnType<typeof getFormSchema>>;

interface AddToiletFormProps {
  onSubmit: (data: NewToiletFormData) => void;
  onCancel: () => void;
  initialCoordinates: { lat: number; lng: number };
}

function MapInteraction({ setMarker, setFormValue, setMapFeedback, t }: {
  setMarker: (pos: {lat: number, lng: number}) => void;
  setFormValue: <TName extends keyof AddToiletFormValues>(name: TName, value: AddToiletFormValues[TName]) => void;
  setMapFeedback: (feedback: string) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
 }) {
  const map = useMap();

  const geocodeLatLng = useCallback((lat: number, lng: number) => {
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      console.warn("Google Maps Geocoder not available.");
      setMapFeedback(t('addToilet.mapFeedback.geocoderNotAvailable'));
      return;
    }
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK") {
        if (results && results[0]) {
          setFormValue("address", results[0].formatted_address);
          setMapFeedback(t('addToilet.mapFeedback.locationUpdated', { address: results[0].formatted_address }));
        } else {
          console.warn("No geocoding results found");
          setMapFeedback(t('addToilet.mapFeedback.locationSetNoAddress'));
        }
      } else {
        console.warn("Geocoder failed due to: " + status);
        setMapFeedback(t('addToilet.mapFeedback.geocoderFailed', { status }));
      }
    });
  }, [setFormValue, setMapFeedback, t]);

  useEffect(() => {
    if (!map) return;
    const listener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarker({ lat, lng });
        setFormValue('latitude', lat);
        setFormValue('longitude', lng);
        geocodeLatLng(lat, lng);
      }
    });
    return () => google.maps.event.removeListener(listener);
  }, [map, setMarker, setFormValue, geocodeLatLng]);

  return null;
}

const FormSection = ({ title, icon: Icon, children, description }: { title: string; icon: React.ElementType; children: React.ReactNode; description?: string }) => (
  <div className="space-y-4 pt-6">
    <div className="flex items-center gap-2">
      <Icon size={20} className="text-primary" />
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
    </div>
    {description && <p className="text-sm text-muted-foreground pl-2">{description}</p>}
    <Separator />
    <div className="space-y-6 pl-2">
      {children}
    </div>
  </div>
);

const ClickableCheckboxCard = ({ item, field, formFieldName, t }: { item: ToiletFeatureConfig; field: any; formFieldName: "selectedToiletTypes" | "features", t: (key: string) => string }) => {
  const isChecked = field.value?.includes(item.id);
  const translatedLabel = t(`constants.${formFieldName === "selectedToiletTypes" ? "toiletTypes" : "toiletFeatures"}.${item.id}.label`);
  const translatedDescription = t(`constants.${formFieldName === "selectedToiletTypes" ? "toiletTypes" : "toiletFeatures"}.${item.id}.description`);

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out shadow-sm hover:shadow-md",
              "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
              isChecked ? 'bg-primary/10 border-primary text-primary' : 'bg-card hover:bg-muted/50 border-border'
            )}
            onClick={() => {
              const newValue = isChecked
                ? field.value.filter((v: string) => v !== item.id)
                : [...(field.value || []), item.id];
              field.onChange(newValue);
            }}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                 e.preventDefault();
                 const newValue = isChecked
                   ? field.value.filter((v: string) => v !== item.id)
                   : [...(field.value || []), item.id];
                 field.onChange(newValue);
              }
            }}
            role="checkbox"
            aria-checked={isChecked}
            tabIndex={0}
          >
            <Checkbox
              checked={isChecked}
              onCheckedChange={(checked) => {
                const newValue = checked
                  ? [...(field.value || []), item.id]
                  : (field.value || []).filter((value: string) => value !== item.id);
                field.onChange(newValue);
              }}
              className="sr-only"
              id={`${formFieldName}-${item.id}`}
              tabIndex={-1}
            />
            {item.icon && <item.icon size={24} className={cn("mb-1.5 transition-colors", isChecked ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />}
            <Label htmlFor={`${formFieldName}-${item.id}`} className="text-center text-xs font-medium cursor-pointer select-none">
              {translatedLabel}
            </Label>
            {isChecked && (
                <div className="absolute top-1.5 right-1.5 h-3 w-3 rounded-full bg-primary" />
            )}
          </div>
        </TooltipTrigger>
        {translatedDescription && (
          <TooltipContent side="top" className="max-w-xs">
            <p className="text-xs">{translatedDescription}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};


function AddToiletForm({ onSubmit, onCancel, initialCoordinates }: AddToiletFormProps) {
  const { t } = useLocale();
  const formSchema = getFormSchema(t);

  const form = useForm<AddToiletFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      latitude: initialCoordinates.lat,
      longitude: initialCoordinates.lng,
      address: '',
      locationType: undefined,
      wheelchairAccessible: "not_sure",
      thresholdFree: false,
      wheelchairSpace: false,
      grabBars: false,
      automaticDoor: false,
      inaccessibleReason: '',
      selectedToiletTypes: [],
      features: [],
      rating: 3,
      review: '',
      quickTags: [],
    },
  });

  const { currentUser, loading: authLoading } = useAuth();

  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number }>(initialCoordinates);
  const [mapReady, setMapReady] = useState(false);
  const [mapFeedback, setMapFeedback] = useState<string>(t('addToilet.mapFeedback.initial'));
  const [isLocating, setIsLocating] = useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const watchedWheelchairAccessible = form.watch("wheelchairAccessible");

  const geocodeAddress = useCallback((address: string) => {
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      console.warn("Google Maps Geocoder not available.");
      setMapFeedback(t('addToilet.mapFeedback.geocoderNotAvailable'));
      return;
    }
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === "OK") {
        if (results && results[0] && results[0].geometry) {
          const loc = results[0].geometry.location;
          const lat = loc.lat();
          const lng = loc.lng();
          setMarkerPosition({ lat, lng });
          form.setValue('latitude', lat);
          form.setValue('longitude', lng);
          setMapFeedback(t('addToilet.mapFeedback.locationUpdated', { address: results[0].formatted_address }));
        } else {
          console.warn("No geocoding results found for address");
          setMapFeedback(t('addToilet.mapFeedback.geocoderNoResults'));
        }
      } else {
        console.warn("Address Geocoder failed due to: " + status);
        setMapFeedback(t('addToilet.mapFeedback.geocoderFailed', { status }));
      }
    });
  }, [form, setMapFeedback, t]);

  useEffect(() => {
    setMapReady(true);
    setMapFeedback(t('addToilet.mapFeedback.initial')); // Set initial feedback after t is available
    if (!form.getValues("address")) {
        if (window.google && window.google.maps && window.google.maps.Geocoder) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: initialCoordinates }, (results, status) => {
                if (status === "OK" && results && results[0]) {
                    form.setValue("address", results[0].formatted_address);
                    setMapFeedback(t('addToilet.mapFeedback.locationUpdated', { address: results[0].formatted_address }));
                } else {
                    setMapFeedback(t('addToilet.mapFeedback.locationSetNoAddress'));
                    console.warn("Initial geocoding failed or no results for initial coordinates.");
                }
            });
        } else {
           setMapFeedback(t('addToilet.mapFeedback.locationSetNoAddress') + " " + t('addToilet.mapFeedback.geocoderNotAvailable'));
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCoordinates, t]); // Added t to dependency array

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  const handleFormSubmit: SubmitHandler<AddToiletFormValues> = (data) => {
     if (authLoading) {
        console.log('Authentication status is loading...');
        return;
      }

      if (!currentUser) {
        console.log('You must be logged in to add a toilet.');
        return;
      }

    const newToiletData: NewToiletFormData = {
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
      locationType: data.locationType,
      wheelchairAccessible: data.wheelchairAccessible,
      thresholdFree: data.thresholdFree,
      wheelchairSpace: data.wheelchairSpace,
      grabBars: data.grabBars,
      automaticDoor: data.automaticDoor,
      inaccessibleReason: data.inaccessibleReason,
      selectedToiletTypes: data.selectedToiletTypes || [],
      features: data.features || [],
      photo: data.photo?.[0] ? data.photo : undefined,
      rating: data.rating,
      review: data.review,
      quickTags: data.quickTags || [],
    };
    onSubmit(newToiletData);
  };

  const handleAddressBlur = () => {
    const addressValue = form.getValues("address");
    if (addressValue) {
      geocodeAddress(addressValue);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
      const file = files[0];
      setPhotoPreviewUrl(URL.createObjectURL(file));
      form.setValue('photo', files);
    } else {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
      setPhotoPreviewUrl(null);
      form.setValue('photo', undefined);
    }
  };

  if (!mapReady) {
    if (!GOOGLE_MAPS_API_KEY) {
       return (
        <div className="p-4 text-center text-destructive bg-destructive/10 rounded-md">
          <AlertTriangle className="inline-block mr-2" /> Google Maps API Key is missing. Please configure it to enable map features.
        </div>
      );
    }
    return <div className="p-4 text-center">Loading map...</div>;
  }

  return (
    <TooltipProvider>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 p-1">

        <FormSection title={t('addToilet.section.location.title')} icon={SECTION_ICONS.location}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FormLabel>{t('addToilet.field.name.label')}</FormLabel>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('addToilet.field.name.tooltip')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <FormControl>
                  <Input placeholder={t('addToilet.field.name.placeholder')} {...field} />
                </FormControl>
                <FormDescription>{t('addToilet.field.name.description')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('addToilet.field.address.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('addToilet.field.address.placeholder')} {...field} onBlur={handleAddressBlur} />
                </FormControl>
                <FormDescription>{t('addToilet.field.address.description')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel>{t('addToilet.field.locationMap.label')}</FormLabel>
              <Button type="button" size="sm" variant="outline" onClick={() => {
                if (navigator.geolocation) {
                  setIsLocating(true);
                  setMapFeedback(t('addToilet.mapFeedback.locating'));
                  navigator.geolocation.getCurrentPosition(pos => {
                    const newPos = {lat: pos.coords.latitude, lng: pos.coords.longitude};
                    setMarkerPosition(newPos);
                    form.setValue('latitude', newPos.lat);
                    form.setValue('longitude', newPos.lng);
                    if (window.google && window.google.maps && window.google.maps.Geocoder) {
                        const geocoder = new window.google.maps.Geocoder();
                        geocoder.geocode({ location: newPos }, (results, status) => {
                          setIsLocating(false);
                          if (status === "OK" && results && results[0]) {
                            form.setValue("address", results[0].formatted_address);
                            setMapFeedback(t('addToilet.mapFeedback.locationUpdated', { address: results[0].formatted_address }));
                          } else {
                            setMapFeedback(t('addToilet.mapFeedback.locationSetNoAddress'));
                          }
                        });
                      } else {
                        setIsLocating(false);
                        setMapFeedback(t('addToilet.mapFeedback.locationSetNoAddress'));
                      }
                  }, (error) => {
                     setIsLocating(false);
                     setMapFeedback(t('addToilet.mapFeedback.locationError', { message: error.message }));
                     console.error("Error getting user location:", error);
                  }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 })
                } else {
                  setMapFeedback(t('addToilet.mapFeedback.geolocationNotSupported'));
                }
              }} disabled={isLocating}>
                {isLocating ? <Loader2 size={16} className="mr-2 animate-spin"/> : <LocateFixed size={16} className="mr-2"/>}
                {isLocating ? t('addToilet.button.locating') : t('addToilet.button.useMyLocation')}
              </Button>
            </div>

            <div className="h-64 w-full rounded-md overflow-hidden border mt-2 shadow-inner">
              {!GOOGLE_MAPS_API_KEY ? (
                <div className="flex items-center justify-center w-full h-full bg-muted text-destructive-foreground p-4">
                  <AlertTriangle className="inline-block mr-2" />Maps API Key is missing. Map functionality disabled.
                </div>
              ) : (
                <APIProvider apiKey={GOOGLE_MAPS_API_KEY} solutionChannel="GMP_QB_Looview_v1_FormDetail">
                  <Map
                    center={markerPosition}
                    zoom={15}
                    gestureHandling="greedy"
                    disableDefaultUI
                    mapId="looview-add-toilet-map-detail"
                    className="w-full h-full"
                  >
                    <AdvancedMarker position={markerPosition}>
                      <Pin background={'hsl(var(--accent))'} borderColor={'hsl(var(--accent-foreground))'} glyphColor={'hsl(var(--accent-foreground))'}>
                        <MapPin size={18}/>
                      </Pin>
                    </AdvancedMarker>
                    <MapInteraction setMarker={setMarkerPosition} setFormValue={form.setValue} setMapFeedback={setMapFeedback} t={t} />
                  </Map>
                </APIProvider>
              )}
            </div>
            <FormDescription className="mt-2 text-sm text-muted-foreground">
              {mapFeedback}
            </FormDescription>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">{t('addToilet.field.latitude.label')}</FormLabel>
                    <FormControl><Input type="number" readOnly {...field} className="bg-muted/50"/></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">{t('addToilet.field.longitude.label')}</FormLabel>
                    <FormControl><Input type="number" readOnly {...field} className="bg-muted/50"/></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormItem>
        </FormSection>

        <FormSection title={t('addToilet.section.access.title')} icon={SECTION_ICONS.access}>
          <FormField
            control={form.control}
            name="locationType"
            render={({ field }) => (
              <FormItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FormLabel>{t('addToilet.field.locationType.label')}</FormLabel>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('addToilet.field.locationType.tooltip')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('addToilet.field.locationType.placeholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LOCATION_TYPES.map(typeKey => (
                      <SelectItem key={typeKey} value={typeKey}>
                        {t(`constants.locationTypes.${typeKey}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title={t('addToilet.section.accessibility.title')} icon={SECTION_ICONS.accessibility}>
          <FormField
            control={form.control}
            name="wheelchairAccessible"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{t('addToilet.field.wheelchairAccessible.label')}</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    {ACCESSIBILITY_OPTIONS.map(option => (
                      <FormItem key={option.value} className="flex items-center space-x-2">
                        <FormControl><RadioGroupItem value={option.value} /></FormControl>
                        <FormLabel className="font-normal">{t(`constants.accessibilityOptions.${option.value}`)}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {watchedWheelchairAccessible === "yes" && (
            <fieldset className="space-y-4 p-4 border rounded-md bg-muted/30 mt-4">
              <legend className="text-md font-medium text-foreground mb-2 px-1">{t('addToilet.field.accessibilityOptions.legend')}</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "thresholdFree", labelKey: "addToilet.field.thresholdFree.label" },
                  { name: "wheelchairSpace", labelKey: "addToilet.field.wheelchairSpace.label" },
                  { name: "grabBars", labelKey: "addToilet.field.grabBars.label" },
                  { name: "automaticDoor", labelKey: "addToilet.field.automaticDoor.label" },
                ].map(item => (
                  <FormField
                    key={item.name}
                    control={form.control}
                    name={item.name as keyof AddToiletFormValues}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-2 rounded-md bg-card border">
                        <FormControl><Checkbox checked={field.value as boolean | undefined} onCheckedChange={field.onChange} /></FormControl>
                        <FormLabel className="font-normal text-sm">{t(item.labelKey)}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </fieldset>
          )}
          {watchedWheelchairAccessible === "no" && (
            <FormField
              control={form.control}
              name="inaccessibleReason"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>{t('addToilet.field.inaccessibleReason.label')}</FormLabel>
                  <FormControl><Textarea placeholder={t('addToilet.field.inaccessibleReason.placeholder')} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </FormSection>

        <FormSection title={t('addToilet.section.toiletType.title')} icon={SECTION_ICONS.toiletType} description={t('addToilet.section.toiletType.description')}>
          <FormField
            control={form.control}
            name="selectedToiletTypes"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
                  {TOILET_TYPE_OPTIONS_CONFIG.map((toiletType) => (
                    <ClickableCheckboxCard key={toiletType.id} item={toiletType} field={field} formFieldName="selectedToiletTypes" t={t} />
                  ))}
                </div>
                <FormMessage className="pt-2" />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title={t('addToilet.section.features.title')} icon={SECTION_ICONS.features} description={t('addToilet.section.features.description')}>
          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
                  {TOILET_FEATURES_CONFIG.map((feature) => (
                     <ClickableCheckboxCard key={feature.id} item={feature} field={field} formFieldName="features" t={t} />
                  ))}
                </div>
                <FormMessage className="pt-2" />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title={t('addToilet.section.ratingReview.title')} icon={SECTION_ICONS.ratingReview}>
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('addToilet.field.rating.label')}</FormLabel>
                <FormControl>
                  <StarRating rating={field.value} onRatingChange={field.onChange} />
                </FormControl>
                <FormDescription>{t('addToilet.field.rating.description')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('addToilet.field.review.label')}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t('addToilet.field.review.placeholder')} {...field} />
                </FormControl>
                <FormDescription>{t('addToilet.field.review.description')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title={t('addToilet.section.quickTags.title')} icon={SECTION_ICONS.quickTags}>
           <Accordion type="single" collapsible className="w-full" defaultValue="quick-tags-accordion">
            <AccordionItem value="quick-tags-accordion">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">{t('addToilet.accordion.quickTags.trigger')}</AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="quickTags"
                  render={({ field }) => (
                    <FormItem>
                      {Object.entries(QUICK_TAG_CATEGORIES_CONFIG).map(([categoryKey, categoryConfig]) => (
                        <div key={categoryKey} className="mb-4">
                          <h4 className="text-sm font-semibold mb-2 text-muted-foreground">{t(`constants.quickTagCategories.${categoryKey}.title`)}</h4>
                          <div className="flex flex-wrap gap-2">
                            {QUICK_TAGS_CONFIG.filter(tag => tag.category === categoryKey).map(tag => {
                              const isSelected = field.value?.includes(tag.id);
                              return (
                                <Button
                                  key={tag.id}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  data-state={isSelected ? 'checked' : 'unchecked'}
                                  className={cn(
                                    "h-auto py-1.5 px-3 text-xs rounded-full border transition-all duration-150 ease-in-out",
                                    "focus:ring-2 focus:ring-ring focus:ring-offset-1",
                                    categoryConfig.className, // This might need to be dynamic based on translated category titles if classNames are tied to them
                                    isSelected ? '' : 'bg-card text-foreground'
                                  )}
                                  onClick={() => {
                                    const currentTags = field.value || [];
                                    const newTags = isSelected
                                      ? currentTags.filter(t => t !== tag.id)
                                      : [...currentTags, tag.id];
                                    field.onChange(newTags);
                                  }}
                                >
                                  {tag.emoji && <span className="mr-1.5 text-base">{tag.emoji}</span>}
                                  {t(`constants.quickTags.${tag.id}.label`)}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      <FormMessage className="pt-2" />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </FormSection>

        <FormSection title={t('addToilet.section.photo.title')} icon={SECTION_ICONS.photo}>
          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('addToilet.field.photo.label')}</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
                    <Camera className="text-muted-foreground h-12 w-12" />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                     <FormDescription className="text-center" dangerouslySetInnerHTML={{ __html: t('addToilet.field.photo.descriptionHtml') }} />
                  </div>
                </FormControl>
                {photoPreviewUrl && (
                  <div className="mt-4 relative w-full max-w-xs mx-auto aspect-video rounded-md overflow-hidden border shadow-md">
                    <Image src={photoPreviewUrl} alt={t('addToilet.field.photo.previewAlt')} layout="fill" objectFit="cover" />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-8">
          <Button type="button" variant="outline" onClick={onCancel} disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
            {t('addToilet.button.cancel')}
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting || authLoading} className="w-full sm:w-auto">
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('addToilet.button.submitting')}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t('addToilet.button.submit')}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
    </TooltipProvider>
  );
}

export { AddToiletForm as default };
