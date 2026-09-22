/**
 * ============================================================================
 * ARCHITECTURAL CONTEXT: 7-Day Rolling History & Weekly Variety Baseline
 * ----------------------------------------------------------------------------
 * PURPOSE:
 * Provides realistic pre-seeded meal logs for the "Tareekh" (History) screen.
 * This demonstrates the repetition-checking algorithm and the 7-day nutritional
 * variety score meter in action.
 * 
 * DESI HOUSEHOLD PATTERN:
 * Families typically balance between heavier meats (Karahi/Biryani) on weekends,
 * light daal/sabzi mid-week, and comfort dishes on alternating days.
 * ============================================================================
 */

import { MealLogEntry, WeeklyVarietyScore } from '@/types';

export const INITIAL_MEAL_HISTORY: MealLogEntry[] = [
  {
    id: 'log-1',
    date: '2026-09-22',
    dishId: 'dish-1',
    dishName: 'Chicken Pulao',
    dishUrduName: 'چکن پلاؤ',
    category: 'rice_specialty',
    mealType: 'Raat (Dinner)',
    rotiCount: 0,
    accompaniment: 'baghair_roti',
    selectedPairingIds: ['pairing-raita', 'pairing-salad'],
    totalCalories: 665,
    totalProtein: 34,
    notes: 'Ammi made it extra fragrant with whole cloves and cumin'
  },
  {
    id: 'log-2',
    date: '2026-09-21',
    dishId: 'dish-2',
    dishName: 'Bhindi Masala (Okra)',
    dishUrduName: 'بھنڈی مصالحہ',
    category: 'sabzi_veg',
    mealType: 'Raat (Dinner)',
    rotiCount: 2,
    accompaniment: 'roti',
    selectedPairingIds: ['pairing-salad'],
    totalCalories: 400,
    totalProtein: 11,
    notes: 'Crispy bhindi with 2 phulkas'
  },
  {
    id: 'log-3',
    date: '2026-09-20',
    dishId: 'dish-4',
    dishName: 'Shinwari Chicken Karahi',
    dishUrduName: 'شنواری چکن کڑاہی',
    category: 'karahi_gosht',
    mealType: 'Raat (Dinner)',
    rotiCount: 2,
    accompaniment: 'roti',
    selectedPairingIds: ['pairing-raita', 'pairing-salad'],
    totalCalories: 670,
    totalProtein: 48,
    notes: 'Sunday family dinner with hot tandoori roti'
  },
  {
    id: 'log-4',
    date: '2026-09-19',
    dishId: 'dish-3',
    dishName: 'Daal Chawal (Tarka Moong & Masoor)',
    dishUrduName: 'دال چاول',
    category: 'daal_lentils',
    mealType: 'Dopahar (Lunch)',
    rotiCount: 0,
    accompaniment: 'sada_chawal',
    selectedPairingIds: ['pairing-salad', 'pairing-chutney'],
    totalCalories: 460,
    totalProtein: 17,
    notes: 'Comfort Saturday lunch with zeera tarka'
  },
  {
    id: 'log-5',
    date: '2026-09-18',
    dishId: 'dish-5',
    dishName: 'Aloo Palak',
    dishUrduName: 'آلو پالک',
    category: 'sabzi_veg',
    mealType: 'Raat (Dinner)',
    rotiCount: 2,
    accompaniment: 'roti',
    selectedPairingIds: ['pairing-raita'],
    totalCalories: 460,
    totalProtein: 13,
    notes: 'Fresh palak with soft baby potatoes'
  },
  {
    id: 'log-6',
    date: '2026-09-17',
    dishId: 'dish-8',
    dishName: 'Peshawari Chapli Kabab',
    dishUrduName: 'پشاوری چپلی کباب',
    category: 'bbq_dry',
    mealType: 'Raat (Dinner)',
    rotiCount: 1,
    accompaniment: 'roti',
    selectedPairingIds: ['pairing-chutney', 'pairing-salad'],
    totalCalories: 550,
    totalProtein: 37,
    notes: 'Spicy anardana flavor, served with mint chutney'
  },
  {
    id: 'log-7',
    date: '2026-09-16',
    dishId: 'dish-7',
    dishName: 'Chana Daal Gosht',
    dishUrduName: 'چنا دال گوشت',
    category: 'daal_lentils',
    mealType: 'Raat (Dinner)',
    rotiCount: 2,
    accompaniment: 'roti',
    selectedPairingIds: ['pairing-salad'],
    totalCalories: 700,
    totalProtein: 44,
    notes: 'Mutton and lentil slow cooked in traditional handi'
  }
];

export const INITIAL_VARIETY_SCORE: WeeklyVarietyScore = {
  scoreOutOf10: 8.5,
  varietyVerdict: 'Shandar Santulan! (Excellent Balanced Diet)',
  totalMealsLogged: 7,
  categoryBreakdown: {
    meatDays: 3,
    vegDays: 2,
    daalDays: 2,
    riceDays: 2
  },
  nutritionHighlights: {
    avgDailyProtein: 32,
    ironDeficitAlert: false,
    consecutiveMeatWarning: false
  }
};
