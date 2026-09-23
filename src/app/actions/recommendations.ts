'use server';

/**
 * ============================================================================
 * SERVER ACTIONS: Recommendations & Data Mutation
 * ----------------------------------------------------------------------------
 * PURPOSE:
 * Exposes the Next.js Server Actions described in backend.md (Section 5).
 * These functions connect the UI to the underlying domain logic and data stores.
 * Since we don't have Supabase configured yet, we use in-memory arrays / mock data
 * as a placeholder for the actual database operations.
 * ============================================================================
 */

import { DailyRecommendationResponse, LogMealPayload, WeeklyBalanceSummary } from '@/types';
import { generateDailyRecommendations } from '@/domain/scoring';
import { MOCK_DISHES } from '@/data/mockDishes';
import { INITIAL_MEAL_HISTORY } from '@/data/mockHistory';
import { MOCK_FAMILY_MEMBERS } from '@/data/mockFamily';

// In-memory state for demonstration until DB is hooked up
let currentHistory = [...INITIAL_MEAL_HISTORY];
let currentDismissed: string[] = [];

/**
 * API Contract A: getDailyRecommendations
 * Calculates the best meal options for today based on the deterministic engine.
 */
export async function getDailyRecommendations(
  userId: string,
  filter?: string,
  mealTime?: 'lunch' | 'dinner'
): Promise<DailyRecommendationResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Run the domain scoring engine
  const { topPick, alternatives, skipToday } = generateDailyRecommendations(
    MOCK_DISHES,
    currentHistory,
    MOCK_FAMILY_MEMBERS,
    currentDismissed,
    filter
  );

  return {
    topPick,
    alternatives,
    skipToday,
    generatedAt: new Date().toISOString()
  };
}

/**
 * API Contract B: logMealHistory
 * Logs that a meal was cooked/eaten.
 */
export async function logMealHistory(payload: LogMealPayload): Promise<{ success: boolean, logId: string, updatedWeeklyBalance: WeeklyBalanceSummary }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const logId = `log-${Date.now()}`;
  
  // Push to in-memory history (Simulating DB INSERT)
  currentHistory.unshift({
    id: logId,
    date: payload.mealDate,
    dishId: payload.foodId,
    accompaniment: payload.accompanimentType || 'none',
    rotiCount: payload.accompanimentQuantity,
    totalCalories: payload.totalCalories,
    notes: payload.notes
  });

  return {
    success: true,
    logId,
    updatedWeeklyBalance: {
      scoreOutOf10: 8,
      varietyVerdict: 'Good balance!',
      totalMealsLogged: currentHistory.length
    }
  };
}

/**
 * API Contract C: dismissDishToday
 * "Aaj Nahi" - Temporarily skips a dish for today.
 */
export async function dismissDishToday(userId: string, foodId: string): Promise<{ success: boolean }> {
  // Push to in-memory dismissals (Simulating DB INSERT to daily_dismissals)
  if (!currentDismissed.includes(foodId)) {
    currentDismissed.push(foodId);
  }
  return { success: true };
}

/**
 * API Contract D: updateFoodPreference
 * Updates user rating or favorite status in the database.
 */
export async function updateFoodPreference(
  userId: string, 
  foodId: string, 
  rating: 1 | 2 | 3 | 4 | 5, 
  isFavorite: boolean
): Promise<{ success: boolean }> {
  // Here we would mutate the user_preferences table in Supabase.
  // We'll just return success for now.
  return { success: true };
}
