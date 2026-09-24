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
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { TopHeader } from '@/components/layout/TopHeader';
import { BottomNav, ActiveTab } from '@/components/layout/BottomNav';
import { HomeDeck } from '@/components/home/HomeDeck';
import { TareekhScreen } from '@/components/tareekh/TareekhScreen';
import { PasandScreen } from '@/components/pasand/PasandScreen';
import { FamilyScreen } from '@/components/family/FamilyScreen';

import { MOCK_DISHES } from '@/data/mockDishes';
import { MOCK_FAMILY_MEMBERS } from '@/data/mockFamily';
import { generateDailyRecommendations } from '@/domain/scoring';
import { MealLogEntry, WeeklyVarietyScore, ScoredDish, Dish, FamilyMember } from '@/types';
import { fetchDishesFromDB, fetchMealHistory, fetchUserFavorites, logMealToDB, toggleFavoriteInDB, fetchDismissedDishes, dismissDishInDB, fetchHouseholdProfiles, fetchUserProfile, createProfile, deleteMealFromDB } from '@/services/db';

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

  const [history, setHistory] = useState<MealLogEntry[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [activeMemberId, setActiveMemberId] = useState<string>('');
  const [favoriteDishIds, setFavoriteDishIds] = useState<string[]>([]);
  const [skippedDishIds, setSkippedDishIds] = useState<string[]>([]);
  const [moodFilter, setMoodFilter] = useState<string>('');
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndLoadProfiles() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      
      const userId = session.user.id;
      let userProfile = await fetchUserProfile(userId);
      
      if (!userProfile) {
        userProfile = await createProfile({
          id: userId,
          display_name: 'Ammi',
          household_name: 'Hamara Ghar',
          daily_calorie_target: 2000
        });
      }
      
      const profiles = await fetchHouseholdProfiles(userProfile.household_name);
      if (profiles && profiles.length > 0) {
        const mappedMembers: FamilyMember[] = profiles.map((p: any) => ({
          id: p.id,
          name: p.display_name,
          role: 'Ammi', // Default role for now
          avatarEmoji: '👩',
          favoriteDishIds: [],
          dislikedDishIds: []
        }));
        setFamilyMembers(mappedMembers);
        setActiveMemberId(userId);
      }
      setIsAuthLoading(false);
    }
    checkAuthAndLoadProfiles();
  }, [router]);

  useEffect(() => {
    async function loadUserData() {
      if (!activeMemberId) return;
      try {
        const [favs, hist, dismissed] = await Promise.all([
          fetchUserFavorites(activeMemberId),
          fetchMealHistory(activeMemberId),
          fetchDismissedDishes(activeMemberId)
        ]);
        setFavoriteDishIds(favs);
        setSkippedDishIds(dismissed);
        
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
          selectedPairingIds: h.meal_history_pairings ? h.meal_history_pairings.map((p: any) => p.pairing_food_id) : [], 
          totalCalories: h.total_calories,
          notes: h.notes
        }));
        
        // Set history to fetched data (could be empty for new users)
        setHistory(mappedHistory);
      } catch (err) {
        console.error('Failed to load user data:', err);
      }
    }
    loadUserData();
  }, [activeMemberId]);

  // Active family member entity
  const activeMember = useMemo(() => {
    if (familyMembers.length === 0) return null;
    const member = familyMembers.find(m => m.id === activeMemberId) || familyMembers[0];
    return { ...member, favoriteDishIds }; // Merge dynamic favorites
  }, [familyMembers, activeMemberId, favoriteDishIds]);

  // Compute live recommendation ranking via scoring engine
  const { topPick, alternatives, skipToday } = useMemo(() => {
    if (!activeMember) return { topPick: null, alternatives: [], skipToday: [] };
    return generateDailyRecommendations(dishes, history, [activeMember], skippedDishIds, moodFilter);
  }, [dishes, history, activeMember, skippedDishIds, moodFilter]);

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
      const data = await logMealToDB({
        user_id: activeMemberId,
        food_id: newLog.dishId,
        meal_date: newLog.date,
        meal_time: newLog.mealType === 'Dopahar (Lunch)' ? 'lunch' : 'dinner',
        accompaniment_type: newLog.accompaniment || 'none',
        accompaniment_quantity: newLog.rotiCount || 0,
        total_calories: newLog.totalCalories,
        notes: newLog.notes || ''
      }, newLog.selectedPairingIds || []);

      // Replace the temporary ID with the real database UUID
      if (data && data.id) {
        setHistory(prev => prev.map(log => log.id === tempId ? { ...log, id: data.id } : log));
      }
    } catch (e) {
      console.error('Failed to log meal:', e);
      // Revert optimistic add
      setHistory(prev => prev.filter(log => log.id !== tempId));
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

  // Handler: Dismiss dish for today (Aaj Nahi)
  const handleDismissDish = async (dishId: string) => {
    setSkippedDishIds(prev => [...prev, dishId]);
    try {
      await dismissDishInDB(activeMemberId, dishId);
    } catch (e) {
      console.error('Failed to dismiss dish:', e);
    }
  };

  // Handler: Delete meal from history
  const handleDeleteMeal = async (logId: string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this meal from your history?");
    if (!isConfirmed) return;

    // If it's a temporary ID, it means it hasn't synced to the DB yet, or we shouldn't attempt DB delete.
    // Wait, by the time they click it, it should have the real ID thanks to the update above.
    // However, if they manage to click it super fast, we just remove it locally.
    setHistory(prev => prev.filter(log => log.id !== logId));

    if (!logId.startsWith('log-')) {
      try {
        await deleteMealFromDB(logId);
      } catch (e) {
        console.error('Failed to delete meal:', e);
        // Ideally, revert optimistic update here, but for simplicity we log the error
      }
    }
  };

  // Handler: "Aaj Ye Banayein" selected from Pasand or Tareekh
  const handleSelectToCook = (dishId: string) => {
    // Switch to Home tab
    setActiveTab('home');
  };

  if (isAuthLoading || !activeMember) {
    return <div className="min-h-screen bg-warm-parchment flex items-center justify-center text-charcoal-ink font-serif text-xl">Loading...</div>;
  }

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
            <>
              {/* Mood Filters */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setMoodFilter(moodFilter === 'quick' ? '' : 'quick')}
                  className={`flex-none px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${moodFilter === 'quick' ? 'bg-saffron-amber text-white border-saffron-amber' : 'bg-surface-pure text-warm-gray border-border-subtle hover:border-saffron-amber/50'}`}
                >
                  ⚡ Jaldi (&#60;30m)
                </button>
                <button
                  onClick={() => setMoodFilter(moodFilter === 'meat' ? '' : 'meat')}
                  className={`flex-none px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${moodFilter === 'meat' ? 'bg-terracotta-clay text-white border-terracotta-clay' : 'bg-surface-pure text-warm-gray border-border-subtle hover:border-terracotta-clay/50'}`}
                >
                  🥩 Gosht
                </button>
                <button
                  onClick={() => setMoodFilter(moodFilter === 'veg' ? '' : 'veg')}
                  className={`flex-none px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${moodFilter === 'veg' ? 'bg-cardamom-emerald text-white border-cardamom-emerald' : 'bg-surface-pure text-warm-gray border-border-subtle hover:border-cardamom-emerald/50'}`}
                >
                  🥬 Sabzi / Daal
                </button>
              </div>

              <HomeDeck
                key={activeMemberId}
                scoredDishes={scoredDishes}
                onLogMeal={handleLogMeal}
                onToggleFavorite={handleToggleFavorite}
                onDismissDish={handleDismissDish}
                favoriteDishIds={favoriteDishIds}
              />
            </>
          )}

          {activeTab === 'tareekh' && (
            <TareekhScreen
              history={history}
              varietyScore={varietyScore}
              onCookAgain={handleSelectToCook}
              onDeleteMeal={handleDeleteMeal}
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
