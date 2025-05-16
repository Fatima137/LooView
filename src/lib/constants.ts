
import type { ToiletFeatureConfig } from './types';
import {
  Baby,
  Users,
  Droplets,
  Construction,
  MapPin,
  ListChecks,
  Star as StarIcon,
  Camera as CameraIcon,
  Armchair,
  ArrowDownToDot,
  User,
  ConciergeBell,
  Venus,
  Mars,
  Building,
  HelpingHand,
  Sparkles,
  Info,
  Toilet // Added Toilet icon
} from 'lucide-react';

// TOILET_FEATURES_CONFIG: labels and descriptions will be translated using keys like 'constants.toiletFeatures.babyChanging.label'
export const TOILET_FEATURES_CONFIG: ToiletFeatureConfig[] = [
  { id: 'babyChanging', label: 'constants.toiletFeatures.babyChanging.label', icon: Baby, description: 'constants.toiletFeatures.babyChanging.description' },
  { id: 'hasSoap', label: 'constants.toiletFeatures.hasSoap.label', icon: Droplets, description: 'constants.toiletFeatures.hasSoap.description' },
  { id: 'hasToiletPaper', label: 'constants.toiletFeatures.hasToiletPaper.label', icon: Construction, description: 'constants.toiletFeatures.hasToiletPaper.description' },
];

// LOCATION_TYPES will be an array of keys, e.g., 'restaurant', 'hotel'.
// Translation will happen in the component: t(`constants.locationTypes.${typeKey}`)
export const LOCATION_TYPES: string[] = [
  "restaurant",
  "hotel",
  "cafeBar",
  "shoppingMall",
  "trainStation",
  "park",
  "school",
  "publicSpace",
  "gasStation",
  "home",
  "studentHouse",
  "other"
];

// ACCESSIBILITY_OPTIONS: labels will be translated using keys like 'constants.accessibilityOptions.yes'
export const ACCESSIBILITY_OPTIONS = [
  { value: "yes", labelKey: "constants.accessibilityOptions.yes" },
  { value: "no", labelKey: "constants.accessibilityOptions.no" },
  { value: "not_sure", labelKey: "constants.accessibilityOptions.notSure" },
];

// TOILET_TYPE_OPTIONS_CONFIG: labels and descriptions will be translated using keys.
export const TOILET_TYPE_OPTIONS_CONFIG: ToiletFeatureConfig[] = [
  { id: 'sitting', label: 'constants.toiletTypes.sitting.label', icon: Armchair, description: 'constants.toiletTypes.sitting.description' },
  { id: 'squat', label: 'constants.toiletTypes.squat.label', icon: ArrowDownToDot, description: 'constants.toiletTypes.squat.description' },
  { id: 'urinal', label: 'constants.toiletTypes.urinal.label', icon: User, description: 'constants.toiletTypes.urinal.description' },
  { id: 'attended', label: 'constants.toiletTypes.attended.label', icon: ConciergeBell, description: 'constants.toiletTypes.attended.description' },
  { id: 'womenOnly', label: 'constants.toiletTypes.womenOnly.label', icon: Venus, description: 'constants.toiletTypes.womenOnly.description' },
  { id: 'menOnly', label: 'constants.toiletTypes.menOnly.label', icon: Mars, description: 'constants.toiletTypes.menOnly.description' },
  { id: 'genderNeutral', label: 'constants.toiletTypes.genderNeutral.label', icon: Users, description: 'constants.toiletTypes.genderNeutral.description' },
];

export const SECTION_ICONS = {
  location: MapPin,
  access: Building,
  accessibility: HelpingHand,
  toiletType: Toilet,
  features: ListChecks,
  ratingReview: StarIcon,
  photo: CameraIcon,
  quickTags: Sparkles,
};

export const DEFAULT_MAP_CENTER = { lat: 51.5074, lng: 0.1278 };
export const DEFAULT_MAP_ZOOM = 12;

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY && typeof window !== 'undefined') {
  console.warn(
    "Google Maps API Key is missing. Map features will not work. " +
    "Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env.local file. " +
    "You can get a key from https://console.cloud.google.com/google/maps-apis/overview"
  );
}

export interface QuickTag {
  id: string;
  labelKey: string; // Changed from label to labelKey
  emoji?: string;
  category: 'positive' | 'neutral' | 'negative';
}

export interface QuickTagCategoryConfig {
 titleKey: string; // Changed from title to titleKey
 className: string;
}

// QUICK_TAG_CATEGORIES_CONFIG: titles will be translated using keys.
export const QUICK_TAG_CATEGORIES_CONFIG: Record<string, QuickTagCategoryConfig> = {
  positive: { titleKey: 'constants.quickTagCategories.positive.title', className: 'border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white data-[state=checked]:border-green-600 hover:bg-green-100' },
  neutral: { titleKey: 'constants.quickTagCategories.neutral.title', className: 'border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white data-[state=checked]:border-blue-600 hover:bg-blue-100' },
  negative: { titleKey: 'constants.quickTagCategories.negative.title', className: 'border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white data-[state=checked]:border-red-600 hover:bg-red-100' },
};

// QUICK_TAGS_CONFIG: labels will be translated using keys.
export const QUICK_TAGS_CONFIG: QuickTag[] = [
  { id: 'best_visit_ever', labelKey: 'constants.quickTags.best_visit_ever.label', emoji: '✨', category: 'positive' },
  { id: 'spotless_clean', labelKey: 'constants.quickTags.spotless_clean.label', emoji: '🧼', category: 'positive' },
  { id: 'quick_easy', labelKey: 'constants.quickTags.quick_easy.label', emoji: '🚀', category: 'positive' },
  { id: 'well_lit_safe', labelKey: 'constants.quickTags.well_lit_safe.label', emoji: '💡', category: 'positive' },
  { id: 'nothing_special', labelKey: 'constants.quickTags.nothing_special.label', emoji: '🤷', category: 'neutral' },
  { id: 'just_ok', labelKey: 'constants.quickTags.just_ok.label', emoji: '😐', category: 'neutral' },
  { id: 'total_disaster', labelKey: 'constants.quickTags.total_disaster.label', emoji: '💩', category: 'negative' },
  { id: 'smelled_awful', labelKey: 'constants.quickTags.smelled_awful.label', emoji: '🦨', category: 'negative' },
  { id: 'no_toilet_paper', labelKey: 'constants.quickTags.no_toilet_paper.label', emoji: '🚫🧻', category: 'negative' },
  { id: 'long_wait', labelKey: 'constants.quickTags.long_wait.label', emoji: '⏱️', category: 'negative' },
  { id: 'emergency_exit_only', labelKey: 'constants.quickTags.emergency_exit_only.label', emoji: '🧯', category: 'negative' },
];
