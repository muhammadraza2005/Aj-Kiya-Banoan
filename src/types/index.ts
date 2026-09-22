/**
 * ============================================================================
 * ARCHITECTURAL CONTEXT: Core Domain Types & Data Contracts
 * ----------------------------------------------------------------------------
 * PURPOSE:
 * Defines the single source of truth for all data shapes across "Aaj Kya Banaun?".
 * This domain model is designed to be 100% compatible with the upcoming Supabase
 * PostgreSQL schema outlined in database.md.
 * 
 * DATA FLOW:
 * [Database/Mock Catalog] ──> [Domain Types] ──> [Scoring Engine] ──> [React Components]
 * 
 * WHY THIS PATTERN:
 * Decoupling the domain definitions from UI components ensures that when we connect
 * Supabase client calls, we only swap the data provider layer without rewriting
 * any UI or business calculation logic.
 * ============================================================================
 */

/**
 * Supported Pakistani culinary categories.
 * Used for repetition decay algorithms and weekly variety balance checks.
 */
export type DishCategory = 
  | 'karahi_gosht'     // Chicken/Mutton/Beef Karahi & Qorma
  | 'rice_specialty'   // Biryani, Pulao, Tahari
  | 'daal_lentils'     // Daal Chawal, Maash, Moong, Chana Daal
  | 'sabzi_veg'        // Bhindi, Aloo Gobi, Palak Paneer, Baingan Bharta
  | 'bbq_dry'          // Tikka, Chapli Kabab, Seekh Kabab
  | 'breakfast_nashta' // Halwa Puri, Nihari, Paye, Anda Ghotala
  | 'soup_salan';      // Aloo Gosht, Shorba dishes

/**
 * Pakistani Accompaniments & Side Pairings
 */
export type AccompanimentType = 'roti' | 'sada_chawal' | 'baghair_roti';

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
  calories: number;        // Total kcal
  proteinGrams: number;    // Macronutrient: Muscle recovery & satiety
  carbsGrams: number;      // Macronutrient: Energy base
  fatsGrams: number;       // Macronutrient: Cooking oil/ghee content
  ironMg: number;          // Critical micronutrient for Desi households (prevents anemia)
  zincMg?: number;         // Immunity & metabolic function
  fiberGrams?: number;     // Digestive health
}

/**
 * Dish Entity: Represents a recipe candidate in the kitchen catalog.
 */
export interface Dish {
  id: string;
  englishName: string;
  urduName: string;
  category: DishCategory;
  description: string;
  prepTimeMinutes: number;
  cookingTimeMinutes: number;
  difficulty: 'Aasan (Easy)' | 'Darmiyana (Medium)' | 'Khaas (Special)';
  imageUrl: string;
  imageAlt: string;
  nutrition: NutritionMetrics;
  defaultRotiCount: number;
  recommendedPairingIds: string[];
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
  dishName: string;
  dishUrduName: string;
  category: DishCategory;
  mealType: 'Dopahar (Lunch)' | 'Raat (Dinner)' | 'Nashta (Breakfast)';
  rotiCount: number;
  accompaniment: AccompanimentType;
  selectedPairingIds: string[];
  totalCalories: number;
  totalProtein: number;
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
 * 7-Day Weekly Variety & Nutritional Health Report.
 */
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
