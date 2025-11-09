// Core Types for Natural Wine Tracking App

export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  userLevel: 'explorer' | 'enthusiast' | 'advocate' | 'steward';
  credibilityScore: number;
  totalCheckins: number;
  totalUniqueWines: number;
  totalContributions: number;
  createdAt: string;
}

export interface Producer {
  id: string;
  name: string;
  slug: string;
  country?: string;
  region?: string;
  subRegion?: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  philosophy?: string;
  website?: string;
  instagram?: string;
  isClaimed: boolean;
  certifications: string[];
  logoUrl?: string;
  coverPhotoUrl?: string;
  totalWines: number;
  totalCheckins: number;
  averageRating: number;
}

export interface Wine {
  id: string;
  producerId: string;
  producer?: Producer;
  name: string;
  vintage?: number;
  slug: string;
  wineType: 'red' | 'white' | 'rose' | 'orange' | 'sparkling' | 'pet-nat';
  grapeVarietals: string[];
  region?: string;
  appellation?: string;
  seriousnessLevel?: number; // 1-5
  foodPairingStyle?: 'solo' | 'companion' | 'versatile';
  alcoholPercentage?: number;
  productionVolume?: number;
  vineyardDetails?: VineyardDetails;
  cellarDetails?: CellarDetails;
  distributionDetails?: DistributionDetails;
  opennessScore?: OpennessScore;
  totalCheckins: number;
  averageRating: number;
  labelImageUrl?: string;
  bottleImageUrl?: string;
  createdAt: string;
}

export interface VineyardDetails {
  farmingMethod?: string;
  certifications?: string[];
  soilType?: string;
  vineyardAge?: number;
  yield?: number;
  harvestMethod?: string;
  harvestDate?: string;
  sameDayProcessing?: boolean;
  cooledTransport?: boolean;
  handSorted?: boolean;
}

export interface CellarDetails {
  fermentation?: {
    yeastType?: string;
    vesselType?: string;
    temperatureControl?: string;
    durationDays?: number;
    macerationDays?: number;
  };
  pressing?: {
    method?: string;
    wholeCluster?: boolean;
    batchSize?: string;
  };
  aging?: {
    vesselType?: string;
    durationMonths?: number;
    newOakPercentage?: number;
    leesContact?: boolean;
  };
  interventions?: {
    sulfitesAdded?: string;
    sulfitesPpm?: number;
    filtration?: string;
    fining?: string;
    additions?: string[];
    phAdjustments?: boolean;
  };
}

export interface DistributionDetails {
  bottling?: {
    estateBottled?: boolean;
    bottlingDate?: string;
    closureType?: string;
  };
  distribution?: {
    productionScale?: string;
    importers?: string[];
    tempControlledStorage?: boolean;
  };
}

export interface OpennessScore {
  completeness: number; // 0-5
  communityVerified: boolean;
  producerCertified: boolean;
  verifiedCount: number;
}

export interface FlavorProfile {
  funky: number;
  clean: number;
  oxidative: number;
  reductive: number;
  savory: number;
  mineral: number;
  floral: number;
  earthy: number;
  citrus: number;
}

export interface Mouthfeel {
  tannin: number;
  acidity: number;
  body: number;
  texture?: string;
}

export interface CheckIn {
  id: string;
  userId: string;
  user?: User;
  wineId: string;
  wine?: Wine;
  venueId?: string;
  venue?: Venue;
  rating?: number; // 0-5
  tastingNotes?: string;
  flavorProfile?: FlavorProfile;
  mouthfeel?: Mouthfeel;
  contextTags?: string[];
  foodPairings?: string;
  wherePurchased?: string;
  pricePaid?: number;
  currency?: string;
  servingTemperature?: string;
  vintageCondition?: string;
  photoUrls?: string[];
  isPublic: boolean;
  allowComments: boolean;
  locationName?: string;
  locationCoordinates?: {
    latitude: number;
    longitude: number;
  };
  toastCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Venue {
  id: string;
  name: string;
  slug: string;
  venueType: 'wine_bar' | 'wine_shop' | 'restaurant' | 'natural_wine_bar';
  naturalWineFocus: boolean;
  address?: string;
  city?: string;
  country?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  phone?: string;
  website?: string;
  instagram?: string;
  description?: string;
  priceRange?: string;
  totalCheckins: number;
  averageRating: number;
}

export interface OCRResult {
  success: boolean;
  data?: {
    wineName?: string;
    producer?: string;
    vintage?: number;
    region?: string;
    grapeVarietals?: string[];
    alcoholPercentage?: number;
    address?: string;
    rawText?: string;
  };
  error?: string;
}

export interface CheckInFormData {
  wineId?: string;
  wine?: Partial<Wine>;
  rating?: number;
  tastingNotes?: string;
  contextTags?: string[];
  foodPairings?: string;
  seriousnessLevel?: number;
  foodPairingStyle?: 'solo' | 'companion' | 'versatile';
  venueId?: string;
  venueName?: string;
  photoUrls?: string[];
  isPublic?: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface VenueSuggestion {
  id: string;
  name: string;
  address?: string;
  city?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}
