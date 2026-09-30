export type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'oblong';

export type SkinTone = 'fair' | 'light' | 'medium' | 'tan' | 'deep';

export type SkinUndertone = 'warm' | 'cool' | 'neutral';

export type VisibleConcern = 
  | 'oiliness' 
  | 'redness' 
  | 'dryness' 
  | 'dark_circles' 
  | 'enlarged_pores' 
  | 'uneven_texture';

export interface TraitConfidence<T> {
  value: T;
  confidence: number; // 0 - 100 percentage
  label: string;
}

export interface ExtractedFaceTraits {
  faceShape: TraitConfidence<FaceShape>;
  skinTone: TraitConfidence<SkinTone>;
  skinUndertone: TraitConfidence<SkinUndertone>;
  visibleConcerns: {
    concern: VisibleConcern;
    level: 'low' | 'moderate' | 'high';
    confidence: number;
    label: string;
  }[];
  lightingQuality: 'poor' | 'fair' | 'optimal';
  lightingConfidence: number;
  detectedAt?: string;
}

export interface UserRequirements {
  rawQuery: string;
  budgetMax: number;
  targetedConcerns: string[];
  avoidIngredients: string[];
  productTypes: string[];
  additionalNotes?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string; // e.g. "Serum", "Cleanser", "Moisturizer", etc.
  priceINR: number;
  originalPriceINR?: number;
  rating: number; // e.g. 4.7
  reviewCount?: number;
  image?: string; // Optional local image e.g. "/products/min-01.png"
  buyUrl: string;
  skinTypes: ('oily' | 'dry' | 'combination' | 'sensitive' | 'normal')[];
  targetedConcerns: string[];
  keyIngredients: string[];
  avoidFlags: string[]; // e.g. ["fragrance", "essential-oils", "parabens", "sulfates", "alcohol"]
  description: string;
  volumeOrWeight: string;
  badge?: string;
  brandAccentColor?: string; // Hex color for brand visual tint
}

export interface RecommendationResult {
  product: Product;
  matchScore: number; // 0 - 100
  aiExplanation: string;
  shortExplanation?: string;
  keyReasons?: string[]; // 3 crisp bullets for #1 hero pick
  scoreBreakdown: {
    traitScore: number;
    concernScore: number;
    requirementScore: number;
    budgetScore: number;
    ratingScore: number;
  };
  conflictWarnings: string[];
  highlightBadges: string[];
}

export interface CategoryConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  defaultCurrency: string;
  currencySymbol: string;
  maxBudgetLimit: number;
  defaultBudget: number;
  traitLabels: {
    faceShapes: Record<FaceShape, { label: string; description: string }>;
    skinTones: Record<SkinTone, { label: string; hexSample: string }>;
    skinUndertones: Record<SkinUndertone, { label: string; description: string }>;
    concerns: Record<VisibleConcern, { label: string; description: string }>;
  };
  filterOptions: {
    concerns: { id: string; label: string; icon?: string }[];
    avoidIngredients: { id: string; label: string }[];
    productTypes: { id: string; label: string }[];
    budgetPresets: number[];
  };
  scoringWeights: {
    traitMatchWeight: number;
    concernMatchWeight: number;
    requirementMatchWeight: number;
    budgetFitWeight: number;
    ratingWeight: number;
  };
}
