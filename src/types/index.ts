/**
 * ============================================================================
 * ARCHITECTURAL CONTEXT: Core Domain Types & Data Contracts
 * ----------------------------------------------------------------------------
 * PURPOSE:
 * Defines the single source of truth for all data shapes across "Aaj Kya Banaun?".
 * This domain model is designed to be 100% compatible with the upcoming Supabase
 * PostgreSQL schema outlined in database.md and backend.md.
 * ============================================================================
 */

/**
 * Supported Pakistani culinary categories.
 * Updated to match the backend.md and database.md specifications.
 */
export type DishCategory = 
  | 'rice'
  | 'meat'
  | 'daal'
  | 'sabzi'
  | 'side'
  | 'dry_fruit'
  | 'fruit'
  | 'karahi_gosht'     
  | 'rice_specialty'   
  | 'daal_lentils'     
  | 'sabzi_veg'        
  | 'bbq_dry'          
  | 'breakfast_nashta' 
  | 'soup_salan';

export type ProteinSource = 'chicken' | 'mutton' | 'beef' | 'egg' | 'plant' | 'none';

/**
 * Pakistani Accompaniments & Side Pairings
 */
export type AccompanimentType = 'roti' | 'rice' | 'naan' | 'none' | 'sada_chawal' | 'baghair_roti';

export interface SmartPairing {
  id: string;
  name: string;
  urduName: string;
  icon: string;
  calories: number;
  healthBenefit: string;
  category: 'salad' | 'raita' | 'chutney' | 'dry_fruit';
}

/**
 * Comprehensive nutritional breakdown per standard Desi serving.
 */
export interface NutritionMetrics {
  calories: number;        
  proteinGrams: number;    
  carbsGrams: number;      
  fatsGrams: number;       
  ironMg: number;          
  zincMg?: number;         
  fiberGrams?: number;     
}

/**
 * Dish Entity: Represents a recipe candidate in the kitchen catalog.
 */
export interface Dish {
  id: string;
  name?: string; // from database.md
  englishName?: string; // used by existing UI
  urduName: string;
  category: DishCategory;
  proteinSource?: ProteinSource; // Added from database.md
  description?: string;
  prepTimeMinutes?: number;
  cookingTimeMinutes: number;
  isQuick?: boolean; // Added from database.md
  difficulty?: 'Aasan (Easy)' | 'Darmiyana (Medium)' | 'Khaas (Special)';
  imageUrl?: string;
  imageAlt?: string;
  nutrition: NutritionMetrics;
  defaultRotiCount?: number;
  recommendedPairingIds?: string[];
  tags: string[];
  isAmmiSpecial?: boolean;
}

/**
 * Meal Log Entry: A historical record of what was cooked on a specific date.
 */
export interface MealLogEntry {
  id: string;
  date: string;            // ISO Date: YYYY-MM-DD
  dishId: string;
  dishName?: string;
  dishUrduName?: string;
  category?: DishCategory;
  mealType?: 'Dopahar (Lunch)' | 'Raat (Dinner)' | 'Nashta (Breakfast)';
  rotiCount?: number;
  accompaniment: AccompanimentType;
  selectedPairingIds?: string[];
  totalCalories: number;
  totalProtein?: number;
  notes?: string;
}

/**
 * Family Member Profile: Helps personalize recommendation scoring.
 */
export interface FamilyMember {
  id: string;
  name: string;
  role: 'Ammi' | 'Abu' | 'Beta' | 'Beti' | 'Mehman';
  avatarEmoji: string;
  favoriteDishIds: string[];
  dislikedDishIds: string[];
  dietaryNotes?: string;
}

/**
 * Reason Generation Engine - Output Format
 * As per backend.md section 3
 */
export interface RecommendationReason {
  type: 'favorite' | 'recency' | 'nutrient' | 'variety' | 'quick' | 'penalty';
  badgeEn: string;
  badgeUrdu: string;
  explanationEn: string;
  explanationUrdu: string;
}

/**
 * Dish Scored Output
 * As per backend.md section 3
 */
export interface ScoredDish {
  foodId: string;
  name: string;
  urduName: string;
  score: number;
  tier: 'BEST_CHOICE' | 'ALSO_CONSIDER' | 'AAJ_NAHI';
  reasons: RecommendationReason[];
  // Include original dish for UI rendering
  dish: Dish; 
}

/**
 * API Contracts (Next.js Actions)
 * As per backend.md section 5
 */
export interface DailyRecommendationResponse {
  topPick: ScoredDish | null;        // Tier 1 (Hero Card)
  alternatives: ScoredDish[];        // Tier 2 (Also Consider - 2 dishes)
  skipToday: ScoredDish[];           // Tier 3 (Omitted with reason - 1-2 dishes)
  generatedAt: string;
}

export interface LogMealPayload {
  userId: string;
  foodId: string;
  mealDate: string;                 // YYYY-MM-DD
  mealTime: 'lunch' | 'dinner';
  accompanimentType?: AccompanimentType;
  accompanimentQuantity: number;    // e.g. 2
  pairingsSelected: string[];       // ['pairing-salad', 'pairing-badam']
  totalCalories: number;
  notes?: string;
}

export interface WeeklyBalanceSummary {
  scoreOutOf10: number;
  varietyVerdict: string;
  totalMealsLogged: number;
}

export interface WeeklyVarietyScore {
  scoreOutOf10: number;
  varietyVerdict: string;
  totalMealsLogged: number;
  categoryBreakdown: {
    meatDays: number;
    vegDays: number;
    daalDays: number;
    riceDays: number;
  };
  nutritionHighlights: {
    avgDailyProtein: number;
    ironDeficitAlert: boolean;
    consecutiveMeatWarning: boolean;
  };
}
