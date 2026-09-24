'use client';

/**
 * ============================================================================
 * ARCHITECTURAL CONTEXT: Aaj Kya Banaun? Main Application Canvas
 * ----------------------------------------------------------------------------
 * PURPOSE:
 * Serves as the central state coordinator for the mobile-first kitchen companion.
 * 
 * ARCHITECTURAL FLOW:
 * 1. State Hydration: Loads candidate Pakistani dishes, 7-day rolling history,
 *    and family preferences.
 * 2. Real-Time Recommendation Pipeline: Passes (dishes, history, activeMember)
 *    through rankDishesForToday() in the pure domain scoring engine.
 * 3. Reactive State Updates:
 *    - Logging a meal ("Paka Liya! 🍳") immediately prepends to history,
 *      which triggers the repetition penalty to prevent same-dish recurrence.
 *    - Favoriting a dish dynamically elevates its affinity score.
 *    - Switching the family persona (e.g. from Ammi to Son) re-ranks dishes
 *      based on individual likes/dislikes.
 * ============================================================================
 */

import React, { useState, useMemo, useEffect } from 'react';
import { TopHeader } from '@/components/layout/TopHeader';
import { BottomNav, ActiveTab } from '@/components/layout/BottomNav';
import { HomeDeck } from '@/components/home/HomeDeck';
import { TareekhScreen } from '@/components/tareekh/TareekhScreen';
import { PasandScreen } from '@/components/pasand/PasandScreen';
import { FamilyScreen } from '@/components/family/FamilyScreen';

import { MOCK_DISHES } from '@/data/mockDishes';
import { INITIAL_MEAL_HISTORY } from '@/data/mockHistory';
import { MOCK_FAMILY_MEMBERS } from '@/data/mockFamily';
import { generateDailyRecommendations } from '@/domain/scoring';
import { MealLogEntry, WeeklyVarietyScore, ScoredDish, Dish } from '@/types';
import { fetchDishesFromDB, fetchMealHistory, fetchUserFavorites, logMealToDB, toggleFavoriteInDB } from '@/services/db';

export default function MainPage() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Core application data state
  const [dishes, setDishes] = useState<Dish[]>(MOCK_DISHES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDishes() {
      try {
        const fetched = await fetchDishesFromDB();
        if (fetched && fetched.length > 0) {
          setDishes(fetched);
        }
      } catch (err) {
        console.error('Failed to load dishes:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDishes();
  }, []);

  const [history, setHistory] = useState<MealLogEntry[]>(INITIAL_MEAL_HISTORY);
  const [familyMembers] = useState(MOCK_FAMILY_MEMBERS);
  const [activeMemberId, setActiveMemberId] = useState<string>('11111111-1111-1111-1111-111111111111');
  const [favoriteDishIds, setFavoriteDishIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadUserData() {
      if (!activeMemberId) return;
      try {
        const [favs, hist] = await Promise.all([
          fetchUserFavorites(activeMemberId),
          fetchMealHistory(activeMemberId)
        ]);
        setFavoriteDishIds(favs);
        
        const mappedHistory: MealLogEntry[] = hist.map((h: any) => ({
          id: h.id,
          date: h.meal_date,
          dishId: h.food_id,
          dishName: h.foods?.name,
          dishUrduName: h.foods?.urdu_name,
          category: h.foods?.category,
          mealType: h.meal_time === 'lunch' ? 'Dopahar (Lunch)' : 'Raat (Dinner)',
          rotiCount: h.accompaniment_quantity,
          accompaniment: h.accompaniment_type,
          selectedPairingIds: [], 
          totalCalories: h.total_calories,
          notes: h.notes
        }));
        
        // Only override if there is actual history or it's a fresh load
        setHistory(mappedHistory.length > 0 ? mappedHistory : INITIAL_MEAL_HISTORY);
      } catch (err) {
        console.error('Failed to load user data:', err);
      }
    }
    loadUserData();
  }, [activeMemberId]);

  // Active family member entity
  const activeMember = useMemo(() => {
    return familyMembers.find(m => m.id === activeMemberId) || familyMembers[0];
  }, [familyMembers, activeMemberId]);

  // Compute live recommendation ranking via scoring engine
  const { topPick, alternatives, skipToday } = useMemo(() => {
    return generateDailyRecommendations(dishes, history, [activeMember], []);
  }, [dishes, history, activeMember]);

  const scoredDishes = useMemo(() => {
    const list: ScoredDish[] = [];
    if (topPick) list.push(topPick);
    return [...list, ...alternatives, ...skipToday];
  }, [topPick, alternatives, skipToday]);

  // Compute real-time weekly variety score
  const varietyScore: WeeklyVarietyScore = useMemo(() => {
    const recentLogs = history.slice(0, 7);
    const meatDays = recentLogs.filter(l => l.category === 'karahi_gosht' || l.category === 'bbq_dry').length;
    const vegDays = recentLogs.filter(l => l.category === 'sabzi_veg').length;
    const daalDays = recentLogs.filter(l => l.category === 'daal_lentils').length;
    const riceDays = recentLogs.filter(l => l.category === 'rice_specialty').length;

    // Diversity penalty if only eating one category
    const categoryCount = [meatDays, vegDays, daalDays, riceDays].filter(c => c > 0).length;
    const scoreOutOf10 = Math.min(10, Math.max(4, categoryCount * 2 + (vegDays > 0 ? 1 : 0) + (daalDays > 0 ? 1 : 0)));

    let verdict = 'Shandar Santulan! (Great Balance)';
    if (scoreOutOf10 < 6) verdict = 'Needs Variety (Tawajjo Darkar)';
    else if (scoreOutOf10 >= 8) verdict = 'Kamil Dastarkhwan (Exceptional Balance)';

    return {
      scoreOutOf10,
      varietyVerdict: verdict,
      totalMealsLogged: recentLogs.length,
      categoryBreakdown: { meatDays, vegDays, daalDays, riceDays },
      nutritionHighlights: {
        avgDailyProtein: 34,
        ironDeficitAlert: daalDays === 0 && vegDays === 0,
        consecutiveMeatWarning: meatDays >= 4,
      },
    };
  }, [history]);

  // Handler: Log a meal cooked today
  const handleLogMeal = async (newLog: Omit<MealLogEntry, 'id'>) => {
    const tempId = `log-${Date.now()}`;
    const createdEntry: MealLogEntry = { ...newLog, id: tempId };
    setHistory(prev => [createdEntry, ...prev]);

    try {
      await logMealToDB({
        user_id: activeMemberId,
        food_id: newLog.dishId,
        meal_date: newLog.date,
        meal_time: newLog.mealType === 'Dopahar (Lunch)' ? 'lunch' : 'dinner',
        accompaniment_type: newLog.accompaniment || 'none',
        accompaniment_quantity: newLog.rotiCount || 0,
        total_calories: newLog.totalCalories,
        notes: newLog.notes || ''
      });
    } catch (e) {
      console.error('Failed to log meal:', e);
    }
  };

  // Handler: Toggle favorite dish
  const handleToggleFavorite = async (dishId: string) => {
    const isFav = !favoriteDishIds.includes(dishId);
    setFavoriteDishIds(prev =>
      isFav ? [...prev, dishId] : prev.filter(id => id !== dishId)
    );

    try {
      await toggleFavoriteInDB(activeMemberId, dishId, isFav);
    } catch (e) {
      console.error('Failed to toggle favorite:', e);
      // Revert optimistic update
      setFavoriteDishIds(prev =>
        !isFav ? [...prev, dishId] : prev.filter(id => id !== dishId)
      );
    }
  };

  // Handler: "Aaj Ye Banayein" selected from Pasand or Tareekh
  const handleSelectToCook = (dishId: string) => {
    // Switch to Home tab
    setActiveTab('home');
  };

  return (
    <div className="w-full min-h-screen bg-warm-parchment desktop-ambient-canvas flex justify-center selection:bg-turmeric-glow selection:text-terracotta-clay">
      
      {/* Responsive Frame Container */}
      <div className="w-full max-w-md md:max-w-3xl lg:max-w-5xl min-h-screen bg-warm-parchment flex flex-col relative shadow-xl sm:border-x sm:border-border-subtle">
        
        {/* Sticky Top Header */}
        <TopHeader
          currentMember={activeMember}
          onOpenFamilySelector={() => setActiveTab('family')}
          streakDays={5}
        />

        {/* Scrollable Viewport Canvas */}
        <main className="flex-1 px-4 pt-3 pb-8 flex flex-col">
          {activeTab === 'home' && (
            <HomeDeck
              scoredDishes={scoredDishes}
              onLogMeal={handleLogMeal}
              onToggleFavorite={handleToggleFavorite}
              favoriteDishIds={favoriteDishIds}
            />
          )}

          {activeTab === 'tareekh' && (
            <TareekhScreen
              history={history}
              varietyScore={varietyScore}
              onCookAgain={handleSelectToCook}
            />
          )}

          {activeTab === 'pasand' && (
            <PasandScreen
              dishes={dishes}
              favoriteDishIds={favoriteDishIds}
              onToggleFavorite={handleToggleFavorite}
              onSelectToCook={handleSelectToCook}
            />
          )}

          {activeTab === 'family' && (
            <FamilyScreen
              members={familyMembers}
              activeMemberId={activeMemberId}
              onSelectMember={(id) => {
                setActiveMemberId(id);
                setActiveTab('home');
              }}
              dishes={dishes}
            />
          )}
        </main>

        {/* Sticky Mobile Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />
      </div>
    </div>
  );
}
