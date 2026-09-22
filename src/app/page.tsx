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

import React, { useState, useMemo } from 'react';
import { TopHeader } from '@/components/layout/TopHeader';
import { BottomNav, ActiveTab } from '@/components/layout/BottomNav';
import { HomeDeck } from '@/components/home/HomeDeck';
import { TareekhScreen } from '@/components/tareekh/TareekhScreen';
import { PasandScreen } from '@/components/pasand/PasandScreen';
import { FamilyScreen } from '@/components/family/FamilyScreen';

import { MOCK_DISHES } from '@/data/mockDishes';
import { INITIAL_MEAL_HISTORY } from '@/data/mockHistory';
import { MOCK_FAMILY_MEMBERS } from '@/data/mockFamily';
import { rankDishesForToday } from '@/domain/scoring';
import { MealLogEntry, WeeklyVarietyScore } from '@/types';

export default function MainPage() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Core application data state
  const [dishes] = useState(MOCK_DISHES);
  const [history, setHistory] = useState<MealLogEntry[]>(INITIAL_MEAL_HISTORY);
  const [familyMembers] = useState(MOCK_FAMILY_MEMBERS);
  const [activeMemberId, setActiveMemberId] = useState<string>('fam-ammi');
  const [favoriteDishIds, setFavoriteDishIds] = useState<string[]>(['dish-1', 'dish-4', 'dish-7']);

  // Active family member entity
  const activeMember = useMemo(() => {
    return familyMembers.find(m => m.id === activeMemberId) || familyMembers[0];
  }, [familyMembers, activeMemberId]);

  // Compute live recommendation ranking via scoring engine
  const scoredDishes = useMemo(() => {
    return rankDishesForToday(dishes, history, [activeMember]);
  }, [dishes, history, activeMember]);

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
  const handleLogMeal = (newLog: Omit<MealLogEntry, 'id'>) => {
    const createdEntry: MealLogEntry = {
      ...newLog,
      id: `log-${Date.now()}`,
    };
    setHistory(prev => [createdEntry, ...prev]);
  };

  // Handler: Toggle favorite dish
  const handleToggleFavorite = (dishId: string) => {
    setFavoriteDishIds(prev =>
      prev.includes(dishId) ? prev.filter(id => id !== dishId) : [...prev, dishId]
    );
  };

  // Handler: "Aaj Ye Banayein" selected from Pasand or Tareekh
  const handleSelectToCook = (dishId: string) => {
    // Switch to Home tab
    setActiveTab('home');
  };

  return (
    <div className="w-full min-h-screen bg-warm-parchment desktop-ambient-canvas flex justify-center selection:bg-turmeric-glow selection:text-terracotta-clay">
      
      {/* Mobile Frame Container (Max-width locked at 430px for native phone feel) */}
      <div className="w-full max-w-[430px] min-h-screen bg-warm-parchment flex flex-col relative shadow-xl sm:border-x sm:border-border-subtle">
        
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
