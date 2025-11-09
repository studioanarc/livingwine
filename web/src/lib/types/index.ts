// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  location?: string;
  profileImage?: string;
  credibilityScore: number;
  level: "explorer" | "enthusiast" | "advocate" | "steward";
  createdAt: string;
  updatedAt: string;
}

// Wine Types
export interface Wine {
  id: string;
  slug: string;
  name: string;
  vintage?: number;
  producerId: string;
  producer: Producer;
  grapeVarietals: string[];
  region: string;
  country: string;
  wineType: "red" | "white" | "rose" | "orange" | "sparkling" | "dessert";
  vineyardDetails?: VineyardDetails;
  cellarDetails?: CellarDetails;
  distributionDetails?: DistributionDetails;
  opennessRating?: OpennessRating;
  averageRating?: number;
  totalCheckins: number;
  createdAt: string;
  updatedAt: string;
}

export interface VineyardDetails {
  farmingMethods: string[];
  certifications: string[];
  soilType?: string;
  harvestMethod?: "manual" | "mechanical";
  harvestDate?: string;
}

export interface CellarDetails {
  fermentationType?: "spontaneous" | "selected" | "mixed";
  vesselTypes: string[];
  agingDuration?: number;
  addedSulfites?: boolean;
  sulfitesAmount?: number;
  filtration?: "none" | "minimal" | "standard";
  fining?: "none" | "traditional" | "commercial";
}

export interface DistributionDetails {
  productionVolume?: string;
  bottlingDate?: string;
  closureType?: "cork" | "screw_cap" | "crown_cap";
  availability?: string[];
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface OpennessRating {
  completeness: number; // 0-5
  communityVerified: boolean;
  verificationCount: number;
  producerCertified: boolean;
}

// Producer Types
export interface Producer {
  id: string;
  slug: string;
  name: string;
  region: string;
  country: string;
  description?: string;
  philosophy?: string;
  certifications: string[];
  claimed: boolean;
  claimedBy?: string;
  website?: string;
  profileImage?: string;
  totalWines: number;
  createdAt: string;
  updatedAt: string;
}

// Check-in Types
export interface Checkin {
  id: string;
  userId: string;
  user: User;
  wineId: string;
  wine: Wine;
  rating: number;
  tastingNotes?: string;
  flavorProfile?: FlavorProfile;
  contextTags: string[];
  foodPairings?: string;
  venueId?: string;
  venue?: Venue;
  servingTemp?: string;
  pricePaid?: number;
  wherePurchased?: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FlavorProfile {
  funky?: number;
  clean?: number;
  oxidative?: number;
  reductive?: number;
  savory?: number;
  mineral?: number;
  floral?: number;
  earthy?: number;
  citrus?: number;
  fruity?: number;
}

// Venue Types
export interface Venue {
  id: string;
  slug: string;
  name: string;
  type: "wine_bar" | "restaurant" | "shop" | "winery";
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  naturalWineFocus: boolean;
  description?: string;
  website?: string;
  phone?: string;
  averageRating?: number;
  totalCheckins: number;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search/Filter Types
export interface WineFilters {
  search?: string;
  wineType?: string[];
  region?: string[];
  country?: string[];
  grapeVarietals?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  minRating?: number;
  farmingMethods?: string[];
  certifications?: string[];
}

export interface ProducerFilters {
  search?: string;
  region?: string[];
  country?: string[];
  certifications?: string[];
  claimed?: boolean;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface CreateCheckinForm {
  wineId: string;
  rating: number;
  tastingNotes?: string;
  flavorProfile?: FlavorProfile;
  contextTags: string[];
  foodPairings?: string;
  venueId?: string;
  servingTemp?: string;
  pricePaid?: number;
  wherePurchased?: string;
  photo?: File;
}
