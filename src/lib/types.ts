export interface ToiletFeatureConfig {
  id: string; // Changed from keyof ToiletFeaturesBoolean to string for more flexibility with toilet types
  label: string;
  icon?: React.ElementType;
  description?: string; // Optional description for tooltips
}

// Represents the 'features' object in Firestore for a Toilet
// This has been simplified as many features are now detailed in specific objects.
export interface ToiletFeaturesBoolean {
  babyChanging?: boolean;
  hasSoap?: boolean;
  hasToiletPaper?: boolean;
}

export interface ToiletAccessibility {
  isWheelchairAccessible: "yes" | "no" | "not_sure";
  thresholdFree?: boolean;
  wheelchairSpace?: boolean;
  grabBars?: boolean;
  automaticDoor?: boolean;
  inaccessibleReason?: string;
}

export interface ToiletTypeDetails {
  sittingToilet?: boolean;
  squatToilet?: boolean;
  urinal?: boolean;
  attendedToilet?: boolean;
  womenOnly?: boolean;
  menOnly?: boolean;
  genderNeutral?: boolean;
}

export interface ToiletAccessInfo {
  locationType?: string;
}

export interface Toilet {

  id: string; // Document ID
  name: string;
  location: { // GeoPoint in Firestore
    latitude: number;
    longitude: number;
    legacyFeatures?: string[];
  };
  address: string;
  createdBy: string; // User ID
  createdAt: any; // Firestore Timestamp
  averageRating: number;
  features: ToiletFeaturesBoolean;
  photoUrls: string[]; // URLs from Firebase Storage, e.g., gs://bucket/path/to/image.jpg
  reviewCount: number;

  // New detailed fields
  accessInfo?: ToiletAccessInfo;
  accessibility?: ToiletAccessibility;
  toiletTypes?: ToiletTypeDetails;
  quickTags?: string[]; // Added for quick tags

  // UI-only fields, not directly in Firestore 'toilets' document, or derived.
  countryCode?: string;
  countryFlag?: string;
  legacyReview?: string;
}


// Simplified NewToilet for the form, focusing on what a user directly inputs for a new toilet.
export interface NewToiletFormData {
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  photo?: FileList;
  rating: number;
  // Core features like 'babyChanging', 'hasSoap', 'hasToiletPaper'
  features?: string[];


  // New Location & Access fields
  locationType?: string;

  // New Accessibility fields
  wheelchairAccessible: "yes" | "no" | "not_sure"; // Radio group
  thresholdFree?: boolean;
  wheelchairSpace?: boolean;
  grabBars?: boolean;
  automaticDoor?: boolean;
  inaccessibleReason?: string;

  // New Toilet Type fields (array of strings from checkboxes)
  selectedToiletTypes?: string[];

  review?: string;
  quickTags?: string[]; // Added for quick tags
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  joinedAt: string;
  contributions: number;
  isAdmin: boolean;
  isModerator: boolean;
  isBlocked: boolean;
  profilePhotoUrl?: string;
  lastLoginAt?: string;
  permissions?: string[];
}
