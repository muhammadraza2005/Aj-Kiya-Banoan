/**
 * ============================================================================
 * ARCHITECTURAL CONTEXT: Recommendation & Scoring Engine
 * ----------------------------------------------------------------------------
 * PURPOSE:
 * Implements the deterministic scoring formula specified in `backend.md`.
 * We evaluate preferences, recency, variety, nutrients, and penalties.
 * No black-box ML - everything outputs a tangible `RecommendationReason`.
 * ============================================================================
 */

import { Dish, MealLogEntry, FamilyMember, ScoredDish, RecommendationReason, AccompanimentType, NutritionMetrics } from '@/types';

/**
 * Helper: Calculates the number of days between a past date string and today.
 * Useful for calculating recency penalties and variety bonuses.
 */
function getDaysSince(dateString: string): number {
  const mealDate = new Date(dateString);
  // Strip time from both dates to ensure accurate day calculation
  mealDate.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(now.getTime() - mealDate.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculates the nutritional values for a meal combination.
 * Follows the "Accompaniment & Nutrition Math" in backend.md
 */
export function calculateMealMacros(dish: Dish, accompaniment: AccompanimentType, qty: number = 1): NutritionMetrics {
  // Base Roti Macros from backend.md: +90 kcal, 3g protein, 18g carbs, 0.5g fat, 2.5g fiber
  const rotiMacros = { calories: 90, protein: 3, carbs: 18, fat: 0.5, fiber: 2.5 };
  
  let addedCalories = 0;
  let addedProtein = 0;
  
  if (accompaniment === 'roti') {
    addedCalories = rotiMacros.calories * qty;
    addedProtein = rotiMacros.protein * qty;
  }
  
  // Note: Here we would add Naan / Rice macros as well based on real data, using placeholders for now.

  return {
    ...dish.nutrition,
    calories: dish.nutrition.calories + addedCalories,
    proteinGrams: dish.nutrition.proteinGrams + addedProtein,
  };
}

/**
 * Evaluates a single dish and generates its score and human-readable reasons.
 * Formula: S_pref + S_recency + S_variety + S_nutrients + S_mood - P_rep - P_dislike - P_skip
 */
export function scoreDish(
  dish: Dish,
  history: MealLogEntry[],
  family: FamilyMember[],
  skippedDishIds: string[], // "Aaj Nahi" dismissed dishes today
  moodFilter?: string
): ScoredDish {
  
  let totalScore = 0;
  const reasons: RecommendationReason[] = [];

  // ==========================================
  // 1. BASE PREFERENCE (0 to 20) + FAVORITES (+15)
  // ==========================================
  let isFavorite = false;
  let isDisliked = false;
  // We simplify user preference to just look at family favorites for now.
  // In a real DB, each user has a 1-5 rating. Here we assume Favorite = 5 rating.
  for (const member of family) {
    if (member.favoriteDishIds.includes(dish.id)) isFavorite = true;
    if (member.dislikedDishIds.includes(dish.id)) isDisliked = true;
  }

  if (isFavorite) {
    totalScore += 20; // assumed 5 star rating (5 * 4) = 20
    totalScore += 15; // Favorite bonus
    reasons.push({
      type: 'favorite',
      badgeEn: 'Family Favorite',
      badgeUrdu: 'گھر کی پسند',
      explanationEn: 'This dish is marked as a household favorite.',
      explanationUrdu: 'یہ کھانا سب کا پسندیدہ ہے۔'
    });
  } else if (isDisliked) {
    totalScore -= 50;
    reasons.push({
      type: 'penalty',
      badgeEn: 'Disliked',
      badgeUrdu: 'ناپسندیدہ',
      explanationEn: 'Someone in the house dislikes this dish.',
      explanationUrdu: 'گھر میں کسی کو یہ پسند نہیں ہے۔'
    });
  }

  // ==========================================
  // 2. RECENCY & REPETITION PENALTY
  // ==========================================
  const exactLogs = history.filter(h => h.dishId === dish.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const lastEatenExact = exactLogs[0];
  
  if (lastEatenExact) {
    const daysSince = getDaysSince(lastEatenExact.date);
    
    if (daysSince >= 7) {
      totalScore += 25;
      reasons.push({ type: 'recency', badgeEn: 'Not cooked in 7+ days', badgeUrdu: '7 دن سے نہیں پکا', explanationEn: 'It has been over a week since you had this.', explanationUrdu: 'اسے پکے ہوئے ایک ہفتے سے زیادہ ہو گیا ہے۔' });
    } else if (daysSince >= 4 && daysSince <= 6) {
      totalScore += 15;
    } else if (daysSince >= 2 && daysSince <= 3) {
      totalScore += 5;
    } else if (daysSince === 1) {
      // Eaten yesterday penalty!
      totalScore -= 35;
      reasons.push({ type: 'penalty', badgeEn: 'Cooked Yesterday', badgeUrdu: 'کل ہی پکایا تھا', explanationEn: 'You just had this dish yesterday.', explanationUrdu: 'یہ کھانا کل ہی کھایا تھا۔' });
    } else if (daysSince === 0) {
      // Eaten today
      totalScore -= 100; 
    } else if (daysSince === 2) {
      totalScore -= 15; // Eaten 2 days ago penalty
    }
  } else {
    // Never eaten before in logged history
    totalScore += 25;
    reasons.push({ type: 'recency', badgeEn: 'Fresh Idea', badgeUrdu: 'نئی ڈش', explanationEn: 'You haven\'t cooked this recently.', explanationUrdu: 'یہ حال ہی میں نہیں بنایا گیا۔' });
  }

  // ==========================================
  // 3. VARIETY (Category Diversity)
  // ==========================================
  const recentCategories = history.slice(0, 3).map(h => h.category);
  const categoryDaysSince = recentCategories.indexOf(dish.category);
  
  if (categoryDaysSince === -1) {
    // Category not eaten in last 3 days
    totalScore += 15;
    reasons.push({ type: 'variety', badgeEn: `Missing ${dish.category}`, badgeUrdu: 'نئی قسم', explanationEn: `You haven't had this type of dish recently.`, explanationUrdu: 'یہ قسم کچھ دنوں سے نہیں کھائی گئی۔' });
  } else if (categoryDaysSince === 0) { // meaning eaten today/yesterday (depending on slice order)
    // Same category eaten yesterday/today
    totalScore -= 15;
  }

  // ==========================================
  // 4. NUTRIENT GAP
  // ==========================================
  // Simplified iron check for the example
  const recentIronRich = history.slice(0, 5).some(h => h.dishName?.includes('Kaleji') || h.dishName?.includes('Palak'));
  if (!recentIronRich && dish.nutrition.ironMg >= 4.0) {
    totalScore += 20;
    reasons.push({ type: 'nutrient', badgeEn: 'Iron Boost', badgeUrdu: 'آئرن سے بھرپور', explanationEn: 'Restores missing iron for the week.', explanationUrdu: 'اس ہفتے کی آئرن کی کمی پوری کرتا ہے۔' });
  }

  // Protein balance check
  if (dish.nutrition.proteinGrams >= 25) {
    totalScore += 15;
  }

  // ==========================================
  // 5. MOOD / FILTER (e.g., Jaldi < 30m, Gosht)
  // ==========================================
  if (moodFilter) {
    if (moodFilter === 'quick' && dish.cookingTimeMinutes <= 30) {
      totalScore += 20;
      reasons.push({ type: 'quick', badgeEn: 'Under 30 mins', badgeUrdu: '30 منٹ سے کم', explanationEn: 'Quick to cook, matches your mood.', explanationUrdu: 'جلدی تیار ہونے والا کھانا۔' });
    }
    if (moodFilter === 'meat' && (dish.category === 'meat' || dish.proteinSource === 'chicken' || dish.proteinSource === 'beef' || dish.proteinSource === 'mutton')) {
      totalScore += 20;
      reasons.push({ type: 'meat', badgeEn: 'Meat Lover', badgeUrdu: 'گوشت کی خواہش', explanationEn: 'Satisfies your craving for meat.', explanationUrdu: 'گوشت کی خواہش پوری کرتا ہے۔' });
    }
    if (moodFilter === 'veg' && (dish.category === 'sabzi' || dish.category === 'daal' || dish.proteinSource === 'plant' || dish.proteinSource === 'none')) {
      totalScore += 20;
      reasons.push({ type: 'veg', badgeEn: 'Vegetarian', badgeUrdu: 'سبزی یا دال', explanationEn: 'A healthy plant-based choice.', explanationUrdu: 'سبزی اور دال کا صحت بخش انتخاب۔' });
    }
  }


  // ==========================================
  // 6. SKIP TODAY PENALTY
  // ==========================================
  if (skippedDishIds.includes(dish.id)) {
    totalScore -= 1000;
    reasons.push({ type: 'penalty', badgeEn: 'Skipped Today', badgeUrdu: 'آج نہیں', explanationEn: 'You dismissed this dish for today.', explanationUrdu: 'آپ نے آج اس ڈش کو نظرانداز کیا ہے۔' });
  }

  // Determine Tier based on final score
  let tier: 'BEST_CHOICE' | 'ALSO_CONSIDER' | 'AAJ_NAHI' = 'ALSO_CONSIDER';
  if (totalScore >= 60 && !skippedDishIds.includes(dish.id) && !isDisliked) {
    tier = 'BEST_CHOICE';
  } else if (totalScore < 0 || skippedDishIds.includes(dish.id) || isDisliked) {
    tier = 'AAJ_NAHI';
  }

  return {
    foodId: dish.id,
    name: dish.name || dish.englishName || '',
    urduName: dish.urduName,
    score: totalScore,
    tier,
    reasons,
    dish
  };
}

/**
 * Main Orchestrator: Ranks all dishes and groups them by Tiers.
 */
export function generateDailyRecommendations(
  dishes: Dish[],
  history: MealLogEntry[],
  family: FamilyMember[],
  skippedDishIds: string[],
  moodFilter?: string
): { topPick: ScoredDish | null, alternatives: ScoredDish[], skipToday: ScoredDish[] } {
  
  const scoredDishes = dishes.map(d => scoreDish(d, history, family, skippedDishIds, moodFilter));
  
  // Sort descending by score
  scoredDishes.sort((a, b) => b.score - a.score);

  const bestChoices = scoredDishes.filter(d => d.tier === 'BEST_CHOICE');
  const alsoConsider = scoredDishes.filter(d => d.tier === 'ALSO_CONSIDER');
  const aajNahi = scoredDishes.filter(d => d.tier === 'AAJ_NAHI');

  // Hero Card is the highest scoring BEST_CHOICE, fallback to ALSO_CONSIDER if none exist.
  let topPick = bestChoices.length > 0 ? bestChoices[0] : (alsoConsider.length > 0 ? alsoConsider[0] : null);
  
  // Remove top pick from its list
  let alternatives = [...bestChoices.slice(1), ...alsoConsider];
  if (topPick) {
    alternatives = alternatives.filter(d => d.foodId !== topPick!.foodId);
  }

  // Return all alternatives to allow continuous shuffling on the Home screen
  return {
    topPick,
    alternatives: alternatives,
    skipToday: aajNahi
  };
}
