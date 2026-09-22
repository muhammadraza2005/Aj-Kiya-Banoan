/**
 * ============================================================================
 * ARCHITECTURAL CONTEXT: Recommendation & Variety Scoring Engine
 * ----------------------------------------------------------------------------
 * PURPOSE:
 * Implements the deterministic Desi meal recommendation algorithm.
 * Balances family preferences, nutritional balance, and repetition penalties.
 * 
 * ALGORITHMIC BREAKDOWN:
 * Final Score (0 - 100) = 
 *     Base Preference Score (30%)
 *   + Repetition Decay Penalty (40%)
 *   + Nutritional Balance Boost (20%)
 *   + Prep Friction Factor (10%)
 * 
 * WHY PURE FUNCTIONS:
 * By keeping this algorithm free of React hooks and external I/O, it can be
 * executed synchronously in Next.js Server Components, Server Actions, or
 * client-side instant re-rolls ("Dusra Dikhao 🎲").
 * ============================================================================
 */

import { Dish, MealLogEntry, FamilyMember } from '@/types';

/**
 * Calculates days elapsed between a meal log timestamp and today.
 */
function getDaysSince(dateString: string): number {
  const mealDate = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - mealDate.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * CONCEPTUAL: Repetition Penalty
 * Desi households strongly resist having the exact same dish within 3 days,
 * and resist repeating the same meat category two consecutive days.
 * 
 * Decay Curve:
 * 0 days ago (today): 0% multiplier (blocked)
 * 1 day ago (yesterday): 20% multiplier (heavy penalty)
 * 2 days ago: 50% multiplier
 * 3 days ago: 75% multiplier
 * >= 4 days ago: 100% (penalty cleared)
 */
export function calculateRepetitionMultiplier(dish: Dish, history: MealLogEntry[]): number {
  // Check exact dish recurrence
  const lastEatenExact = history.find(entry => entry.dishId === dish.id);
  if (lastEatenExact) {
    const daysSince = getDaysSince(lastEatenExact.date);
    if (daysSince === 0) return 0.05;
    if (daysSince === 1) return 0.20;
    if (daysSince === 2) return 0.50;
    if (daysSince === 3) return 0.75;
  }

  // Check category recurrence (e.g. don't suggest Karahi if Karahi was cooked yesterday)
  const mostRecentMeal = history[0];
  if (mostRecentMeal && mostRecentMeal.category === dish.category) {
    return 0.65; // Soft category variety penalty
  }

  return 1.0;
}

/**
 * CONCEPTUAL: Nutritional Balance Boost
 * If the household has had high carbs and low greens in the last 48 hours,
 * dishes with high iron, fiber, and protein receive an affirmative boost.
 */
export function calculateNutritionBoost(dish: Dish, recentHistory: MealLogEntry[]): number {
  let boost = 0;

  // Check if Daal/Sabzi has been neglected in the last 3 days
  const recentCategories = recentHistory.slice(0, 3).map(h => h.category);
  const hadVegOrDaal = recentCategories.includes('sabzi_veg') || recentCategories.includes('daal_lentils');

  if (!hadVegOrDaal && (dish.category === 'sabzi_veg' || dish.category === 'daal_lentils')) {
    boost += 15; // Vital dietary balance incentive
  }

  // High iron incentive (combatting Desi household anemia gaps)
  if (dish.nutrition.ironMg >= 4.0) {
    boost += 8;
  }

  // High protein incentive (>= 30g)
  if (dish.nutrition.proteinGrams >= 30) {
    boost += 7;
  }

  return Math.min(boost, 30);
}

/**
 * CONCEPTUAL: Family Preference Weighting
 * Calculates affinity score based on how many family members love or dislike this dish.
 */
export function calculateFamilyAffinityScore(dish: Dish, family: FamilyMember[]): number {
  let affinityScore = 50; // Baseline neutrality

  for (const member of family) {
    // If a member has this in favorites
    if (member.favoriteDishIds.includes(dish.id)) {
      affinityScore += 18;
    }
    // If a picky eater strongly dislikes this
    if (member.dislikedDishIds.includes(dish.id)) {
      affinityScore -= 25; // Picky eater protection
    }
  }

  // Cap affinity between 0 and 100
  return Math.max(0, Math.min(100, affinityScore));
}

export interface ScoredDish {
  dish: Dish;
  compositeScore: number;
  matchPercentage: number;
  varietyTag: string;
  nutritionTag: string;
}

/**
 * Ranks all candidate dishes and returns an ordered list with breakdown metadata.
 */
export function rankDishesForToday(
  dishes: Dish[],
  history: MealLogEntry[],
  family: FamilyMember[]
): ScoredDish[] {
  return dishes
    .map(dish => {
      const affinity = calculateFamilyAffinityScore(dish, family);
      const repMultiplier = calculateRepetitionMultiplier(dish, history);
      const nutritionBoost = calculateNutritionBoost(dish, history);

      // Composite calculation
      const rawScore = (affinity * 0.5 + nutritionBoost * 1.5) * repMultiplier;
      const compositeScore = Math.round(Math.max(10, Math.min(99, rawScore)));

      // Generate human-friendly badge labels
      let varietyTag = 'Fresh & Unrepeated';
      const lastEaten = history.find(e => e.dishId === dish.id);
      if (lastEaten) {
        const days = getDaysSince(lastEaten.date);
        varietyTag = `Cooked ${days} days ago`;
      } else {
        varietyTag = 'Not cooked this week';
      }

      let nutritionTag = `${dish.nutrition.proteinGrams}g Protein • ${dish.nutrition.calories} kcal`;
      if (dish.nutrition.ironMg >= 4.5) {
        nutritionTag += ' • Iron Rich';
      }

      return {
        dish,
        compositeScore,
        matchPercentage: compositeScore,
        varietyTag,
        nutritionTag
      };
    })
    .sort((a, b) => b.compositeScore - a.compositeScore);
}
