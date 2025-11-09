/**
 * Application Configuration
 */

// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";

// Mapbox Configuration
export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// App Configuration
export const APP_NAME = "Cloudy";
export const APP_DESCRIPTION =
  "A social platform for natural and low-intervention wine enthusiasts";

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Image Upload
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Rating
export const MIN_RATING = 0;
export const MAX_RATING = 5;
export const RATING_STEP = 0.5;

// Wine Types
export const WINE_TYPES = [
  { value: "red", label: "Red" },
  { value: "white", label: "White" },
  { value: "rose", label: "Rosé" },
  { value: "orange", label: "Orange" },
  { value: "sparkling", label: "Sparkling" },
  { value: "dessert", label: "Dessert" },
] as const;

// Venue Types
export const VENUE_TYPES = [
  { value: "wine_bar", label: "Wine Bar" },
  { value: "restaurant", label: "Restaurant" },
  { value: "shop", label: "Wine Shop" },
  { value: "winery", label: "Winery" },
] as const;

// Flavor Profile Tags
export const FLAVOR_TAGS = [
  { value: "funky", label: "Funky/Barnyard" },
  { value: "clean", label: "Clean/Pure Fruit" },
  { value: "oxidative", label: "Oxidative" },
  { value: "reductive", label: "Reductive" },
  { value: "savory", label: "Savory/Umami" },
  { value: "mineral", label: "Mineral/Saline" },
  { value: "floral", label: "Floral/Aromatic" },
  { value: "earthy", label: "Earthy/Forest Floor" },
  { value: "citrus", label: "Citrus/Bright" },
  { value: "fruity", label: "Fruity" },
] as const;

// Context Tags
export const CONTEXT_TAGS = [
  { value: "sunny_afternoon", label: "Sunny Afternoon Sipper" },
  { value: "dinner_party", label: "Dinner Party Wine" },
  { value: "pizza_wine", label: "Pizza Wine" },
  { value: "contemplative", label: "Contemplative/Serious" },
  { value: "chillable_red", label: "Chillable Red" },
  { value: "gateway", label: "Natural Wine Gateway" },
  { value: "advanced", label: "Advanced/Acquired Taste" },
] as const;

// Farming Methods
export const FARMING_METHODS = [
  { value: "organic", label: "Organic" },
  { value: "biodynamic", label: "Biodynamic" },
  { value: "regenerative", label: "Regenerative" },
  { value: "sustainable", label: "Sustainable" },
  { value: "conventional", label: "Conventional" },
] as const;

// Certifications
export const CERTIFICATIONS = [
  { value: "eu_organic", label: "EU Organic" },
  { value: "usda_organic", label: "USDA Organic" },
  { value: "demeter", label: "Demeter (Biodynamic)" },
  { value: "biodyvin", label: "Biodyvin" },
  { value: "nature_progres", label: "Nature & Progrès" },
  { value: "terra_vitis", label: "Terra Vitis" },
  { value: "hvs", label: "HVE (Haute Valeur Environnementale)" },
] as const;

// User Levels
export const USER_LEVELS = [
  { value: "explorer", label: "Explorer", minCredibility: 0 },
  { value: "enthusiast", label: "Enthusiast", minCredibility: 100 },
  { value: "advocate", label: "Advocate", minCredibility: 500 },
  { value: "steward", label: "Steward", minCredibility: 1000 },
] as const;
