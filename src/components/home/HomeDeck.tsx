'use client';

/**
 * ============================================================================
 * ARCHITECTURAL CONTEXT: Home Recommendation Hero Deck
 * ----------------------------------------------------------------------------
 * PURPOSE:
 * Directly translated from stitch_frontend_ui_design_project/home_aaj_kya_banaun.
 * Serves as the primary decision engine interface for Mom in the kitchen.
 * 
 * INTERACTION MODEL:
 * 1. "Dusra Dikhao 🎲": Cycles through candidate dishes ranked by the scoring engine.
 * 2. "Paka Liya! 🍳": Logs the meal, shoots celebratory confetti, and records it in Tareekh.
 * 3. Portion Modal: Adjusts Roti count and sides with live nutrient updates.
 * ============================================================================
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  Dices, 
  CheckCircle2, 
  SlidersHorizontal, 
  Heart,
  TrendingUp,
  Info
} from 'lucide-react';
import { Dish, AccompanimentType, MealLogEntry } from '@/types';
import { ScoredDish } from '@/domain/scoring';
import { MealPairingModal } from './MealPairingModal';
import { SMART_PAIRINGS } from '@/data/mockDishes';

interface HomeDeckProps {
  scoredDishes: ScoredDish[];
  onLogMeal: (log: Omit<MealLogEntry, 'id'>) => void;
  onToggleFavorite: (dishId: string) => void;
  favoriteDishIds: string[];
}

export const HomeDeck: React.FC<HomeDeckProps> = ({
  scoredDishes,
  onLogMeal,
  onToggleFavorite,
  favoriteDishIds,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [mealType, setMealType] = useState<'Dopahar (Lunch)' | 'Raat (Dinner)'>('Raat (Dinner)');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [justLogged, setJustLogged] = useState<boolean>(false);

  // Portion state for currently displayed recommendation
  const [rotiCount, setRotiCount] = useState<number>(2);
  const [accompaniment, setAccompaniment] = useState<AccompanimentType>('roti');
  const [selectedPairingIds, setSelectedPairingIds] = useState<string[]>(['pairing-salad']);

  if (!scoredDishes || scoredDishes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
        <span className="text-4xl mb-3">🍲</span>
        <h3 className="font-serif text-lg font-bold text-charcoal-ink">Sab Khane Ban Chuke Hain!</h3>
        <p className="text-sm text-warm-gray mt-1">Please reset or update your meal log history.</p>
      </div>
    );
  }

  const currentItem = scoredDishes[currentIndex % scoredDishes.length];
  const { dish, matchPercentage, varietyTag } = currentItem;
  const isFavorite = favoriteDishIds.includes(dish.id);

  // Calculate live dynamic calories with selected portion
  const rotiKcal = accompaniment === 'roti' ? rotiCount * 90 : 0;
  const riceKcal = accompaniment === 'sada_chawal' ? 180 : 0;
  const sidesKcal = selectedPairingIds.reduce((sum, id) => {
    const p = SMART_PAIRINGS.find(item => item.id === id);
    return sum + (p ? p.calories : 0);
  }, 0);
  const totalMealCalories = dish.nutrition.calories + rotiKcal + riceKcal + sidesKcal;

  // Next candidate shuffle
  const handleShuffleNext = () => {
    setJustLogged(false);
    setCurrentIndex(prev => (prev + 1) % scoredDishes.length);
  };

  // Cooked CTA
  const handleMarkCooked = () => {
    // Fire festive kitchen confetti
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#E65100', '#BF360C', '#1B5E20', '#FFF8E1']
      });
    } catch {
      // Fallback gracefully if canvas is unavailable
    }

    onLogMeal({
      date: new Date().toISOString().split('T')[0],
      dishId: dish.id,
      dishName: dish.englishName,
      dishUrduName: dish.urduName,
      category: dish.category,
      mealType,
      rotiCount: accompaniment === 'roti' ? rotiCount : 0,
      accompaniment,
      selectedPairingIds,
      totalCalories: totalMealCalories,
      totalProtein: dish.nutrition.proteinGrams,
      notes: `Cooked for ${mealType}`
    });

    setJustLogged(true);
  };

  return (
    <div className="flex flex-col gap-4 pb-20">
      
      {/* 1. Meal Type Segmented Selector (Lunch vs Dinner) */}
      <div className="flex items-center justify-between bg-warm-parchment p-1 rounded-xl border border-border-subtle shadow-xs">
        <button
          type="button"
          onClick={() => setMealType('Dopahar (Lunch)')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            mealType === 'Dopahar (Lunch)'
              ? 'bg-surface-pure text-saffron-amber shadow-xs border border-border-subtle/80'
              : 'text-warm-gray hover:text-charcoal-ink'
          }`}
        >
          <span>☀️ Dopahar (Lunch)</span>
        </button>
        <button
          type="button"
          onClick={() => setMealType('Raat (Dinner)')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            mealType === 'Raat (Dinner)'
              ? 'bg-surface-pure text-saffron-amber shadow-xs border border-border-subtle/80'
              : 'text-warm-gray hover:text-charcoal-ink'
          }`}
        >
          <span>🌙 Raat (Dinner)</span>
        </button>
      </div>

      {/* 2. Success Alert Banner when meal is logged */}
      {justLogged && (
        <div className="bg-cardamom-soft border border-cardamom-emerald/40 text-cardamom-emerald rounded-xl p-3 flex items-center gap-2.5 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Mubarak! Khana record ho gaya.</span>
            <span className="block text-[11px] opacity-90">Added to Tareekh weekly history.</span>
          </div>
        </div>
      )}

      {/* 3. Hero Recommendation Card */}
      <div className="bg-surface-pure rounded-2xl border border-border-subtle shadow-warm-hero overflow-hidden flex flex-col transition-all">
        
        {/* Image & Match Score Overlay */}
        <div className="relative w-full h-52 bg-charcoal-ink overflow-hidden group">
          <img
            src={dish.imageUrl}
            alt={dish.imageAlt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-ink/90 via-charcoal-ink/30 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-saffron-amber text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{matchPercentage}% Match</span>
            </div>

            <button
              type="button"
              onClick={() => onToggleFavorite(dish.id)}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 ${
                isFavorite
                  ? 'bg-white text-terracotta-clay shadow-md'
                  : 'bg-charcoal-ink/50 text-white hover:bg-white/80 hover:text-charcoal-ink'
              }`}
              aria-label="Add to favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-terracotta-clay' : ''}`} />
            </button>
          </div>

          {/* Bottom Dish Name Overlay */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold tracking-tight text-white leading-tight">
                  {dish.englishName}
                </h2>
                <span className="font-urdu text-base text-turmeric-glow block leading-normal mt-0.5">
                  {dish.urduName}
                </span>
              </div>
              <span className="text-xs bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded font-medium">
                {dish.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 flex flex-col gap-3.5">
          
          {/* Variety & Repetition Status */}
          <div className="flex items-center justify-between text-xs bg-warm-parchment px-3 py-1.5 rounded-lg border border-border-subtle">
            <div className="flex items-center gap-1.5 text-cardamom-emerald font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{varietyTag}</span>
            </div>
            <div className="flex items-center gap-1 text-warm-gray">
              <Clock className="w-3 h-3" />
              <span>{dish.prepTimeMinutes + dish.cookingTimeMinutes} mins</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-charcoal-ink/80 leading-relaxed font-normal">
            {dish.description}
          </p>

          {/* Nutritional Breakdown Pill Row */}
          <div className="grid grid-cols-4 gap-2 text-center pt-1">
            <div className="bg-turmeric-glow/70 border border-saffron-amber/30 rounded-xl p-2">
              <span className="text-[10px] text-warm-gray uppercase tracking-wider block font-semibold">Calories</span>
              <span className="font-serif text-sm font-bold text-terracotta-clay">{dish.nutrition.calories}</span>
              <span className="text-[9px] text-warm-gray block">kcal</span>
            </div>

            <div className="bg-warm-parchment border border-border-subtle rounded-xl p-2">
              <span className="text-[10px] text-warm-gray uppercase tracking-wider block font-semibold">Protein</span>
              <span className="font-serif text-sm font-bold text-charcoal-ink">{dish.nutrition.proteinGrams}g</span>
              <span className="text-[9px] text-cardamom-emerald font-medium block">Muscle</span>
            </div>

            <div className="bg-warm-parchment border border-border-subtle rounded-xl p-2">
              <span className="text-[10px] text-warm-gray uppercase tracking-wider block font-semibold">Carbs</span>
              <span className="font-serif text-sm font-bold text-charcoal-ink">{dish.nutrition.carbsGrams}g</span>
              <span className="text-[9px] text-warm-gray block">Base</span>
            </div>

            <div className="bg-warm-parchment border border-border-subtle rounded-xl p-2">
              <span className="text-[10px] text-warm-gray uppercase tracking-wider block font-semibold">Iron</span>
              <span className="font-serif text-sm font-bold text-primary">{dish.nutrition.ironMg}mg</span>
              <span className="text-[9px] text-primary font-medium block">Essential</span>
            </div>
          </div>

          {/* Accompaniment & Pairings Preview Chip Row */}
          <div className="flex items-center justify-between bg-cardamom-soft/40 border border-cardamom-emerald/30 rounded-xl px-3 py-2.5 mt-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">🫓</span>
              <div>
                <span className="text-xs font-bold text-charcoal-ink block">
                  {accompaniment === 'roti' ? `${rotiCount} Roti (Phulka)` : accompaniment === 'sada_chawal' ? 'Sada Chawal' : 'Baghair Roti'}
                  {selectedPairingIds.length > 0 && ` + ${selectedPairingIds.length} Sides`}
                </span>
                <span className="text-[10px] text-cardamom-emerald font-medium">
                  Total Meal: ~{totalMealCalories} kcal
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1 text-xs font-semibold text-saffron-amber hover:text-terracotta-clay bg-surface-pure border border-border-subtle px-2.5 py-1 rounded-lg shadow-xs active:scale-95 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Change</span>
            </button>
          </div>
        </div>

        {/* Action Decision Buttons */}
        <div className="p-4 pt-1 pb-4 grid grid-cols-2 gap-2.5 border-t border-border-subtle/60 bg-warm-parchment/40">
          {/* Secondary: Shuffle Next */}
          <button
            type="button"
            onClick={handleShuffleNext}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-surface-pure hover:bg-surface-container border border-border-subtle text-charcoal-ink font-semibold text-xs active:scale-95 transition-all shadow-xs"
          >
            <Dices className="w-4 h-4 text-saffron-amber" />
            <span>Dusra Dikhao 🎲</span>
          </button>

          {/* Primary: Cooked */}
          <button
            type="button"
            onClick={handleMarkCooked}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-saffron-amber hover:bg-terracotta-clay active:scale-95 text-white font-bold text-xs transition-all shadow-md"
          >
            <Flame className="w-4 h-4 fill-white" />
            <span>Paka Liya! 🍳</span>
          </button>
        </div>
      </div>

      {/* 4. Quick Helper Note */}
      <div className="flex items-start gap-2 bg-surface-pure border border-border-subtle rounded-xl p-3 text-xs text-warm-gray shadow-xs">
        <Info className="w-4 h-4 text-saffron-amber shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-charcoal-ink">Tip for Ammi:</strong> Roti and side accompaniments dynamically balance protein-to-carb ratios. Click &ldquo;Change&rdquo; above to customize.
        </p>
      </div>

      {/* Modal Drawer */}
      <MealPairingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dish={dish}
        currentRotiCount={rotiCount}
        currentAccompaniment={accompaniment}
        selectedPairingIds={selectedPairingIds}
        onSavePreferences={(newCount, newAcc, newPairings) => {
          setRotiCount(newCount);
          setAccompaniment(newAcc);
          setSelectedPairingIds(newPairings);
        }}
      />
    </div>
  );
};
