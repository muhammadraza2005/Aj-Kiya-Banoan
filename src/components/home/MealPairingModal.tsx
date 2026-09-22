'use client';

/**
 * ============================================================================
 * ARCHITECTURAL CONTEXT: Roti Counter & Smart Pairings Drawer
 * ----------------------------------------------------------------------------
 * PURPOSE:
 * Directly translated from stitch_frontend_ui_design_project/meal_pairing_roti_stepper.
 * Enables Mom or household members to calibrate carb portions (Roti vs Rice)
 * and attach nutritional balancing sides before cooking.
 * 
 * NUTRITION RECALCULATION FORMULA:
 * Total Meal Calories = Dish Base Calories 
 *                     + (Roti Count * 90 kcal) 
 *                     + Sum(Active Smart Pairings)
 * ============================================================================
 */

import React, { useState } from 'react';
import { X, Minus, Plus, Check, Sparkles } from 'lucide-react';
import { Dish, AccompanimentType, SmartPairing } from '@/types';
import { SMART_PAIRINGS } from '@/data/mockDishes';

interface MealPairingModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: Dish;
  currentRotiCount: number;
  currentAccompaniment: AccompanimentType;
  selectedPairingIds: string[];
  onSavePreferences: (
    rotiCount: number,
    accompaniment: AccompanimentType,
    pairingIds: string[]
  ) => void;
}

export const MealPairingModal: React.FC<MealPairingModalProps> = ({
  isOpen,
  onClose,
  dish,
  currentRotiCount,
  currentAccompaniment,
  selectedPairingIds,
  onSavePreferences,
}) => {
  const [rotiCount, setRotiCount] = useState<number>(currentRotiCount);
  const [accompaniment, setAccompaniment] = useState<AccompanimentType>(currentAccompaniment);
  const [pairingIds, setPairingIds] = useState<string[]>(selectedPairingIds);

  if (!isOpen) return null;

  // Nutritional dynamic recalculation
  const rotiKcal = accompaniment === 'roti' ? rotiCount * 90 : 0;
  const rotiCarbs = accompaniment === 'roti' ? rotiCount * 18 : 0;
  const rotiProtein = accompaniment === 'roti' ? rotiCount * 3 : 0;

  const riceKcal = accompaniment === 'sada_chawal' ? 180 : 0;
  const riceCarbs = accompaniment === 'sada_chawal' ? 40 : 0;

  const pairingsKcal = pairingIds.reduce((sum, id) => {
    const found = SMART_PAIRINGS.find(p => p.id === id);
    return sum + (found ? found.calories : 0);
  }, 0);

  const totalCalories = dish.nutrition.calories + rotiKcal + riceKcal + pairingsKcal;
  const totalProtein = dish.nutrition.proteinGrams + rotiProtein;
  const totalCarbs = dish.nutrition.carbsGrams + rotiCarbs + riceCarbs;

  const togglePairing = (id: string) => {
    setPairingIds(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    onSavePreferences(rotiCount, accompaniment, pairingIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Dimmed Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-charcoal-ink/60 backdrop-blur-xs transition-opacity" 
      />

      {/* Foreground Bottom Sheet Modal */}
      <div className="relative z-10 w-full max-w-[430px] bg-surface-pure rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border-t sm:border border-border-subtle animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Drag Handle & Header */}
        <div className="pt-3 pb-2 flex flex-col items-center shrink-0 border-b border-border-subtle/70 px-4">
          <div className="w-12 h-1.5 rounded-full bg-border-subtle mb-3 sm:hidden" />
          
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden border border-border-subtle shrink-0">
                <img
                  src={dish.imageUrl}
                  alt={dish.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-bold text-charcoal-ink leading-tight">
                    {dish.englishName}
                  </h3>
                  <span className="font-urdu text-sm text-terracotta-clay">
                    ({dish.urduName})
                  </span>
                </div>
                <p className="text-xs text-warm-gray">
                  Base: ~{dish.nutrition.calories} kcal • {dish.nutrition.proteinGrams}g Protein
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-warm-parchment text-warm-gray transition-colors"
              type="button"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-4 py-4 space-y-5">
          
          {/* Section 1: Accompaniment Type */}
          <section className="space-y-2">
            <div className="flex items-baseline justify-between">
              <h4 className="font-serif text-sm font-bold text-charcoal-ink flex items-center gap-1.5">
                <span>Saath me kya khayein gay?</span>
                <span className="font-urdu text-xs text-terracotta-clay">(ساتھ کیا لیں گے؟)</span>
              </h4>
              <span className="text-[11px] text-warm-gray uppercase tracking-wider">Accompaniment</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 bg-warm-parchment rounded-xl border border-border-subtle">
              <button
                type="button"
                onClick={() => setAccompaniment('roti')}
                className={`flex items-center justify-center py-2 px-1 rounded-lg text-xs font-semibold gap-1.5 transition-all ${
                  accompaniment === 'roti'
                    ? 'bg-turmeric-glow border border-saffron-amber shadow-xs text-terracotta-clay'
                    : 'bg-surface-pure hover:bg-white text-charcoal-ink border border-transparent'
                }`}
              >
                <span>🫓</span>
                <span>Roti / Phulka</span>
              </button>

              <button
                type="button"
                onClick={() => setAccompaniment('sada_chawal')}
                className={`flex items-center justify-center py-2 px-1 rounded-lg text-xs font-semibold gap-1.5 transition-all ${
                  accompaniment === 'sada_chawal'
                    ? 'bg-turmeric-glow border border-saffron-amber shadow-xs text-terracotta-clay'
                    : 'bg-surface-pure hover:bg-white text-charcoal-ink border border-transparent'
                }`}
              >
                <span>🍚</span>
                <span>Sada Chawal</span>
              </button>

              <button
                type="button"
                onClick={() => setAccompaniment('baghair_roti')}
                className={`flex items-center justify-center py-2 px-1 rounded-lg text-xs font-semibold gap-1.5 transition-all ${
                  accompaniment === 'baghair_roti'
                    ? 'bg-turmeric-glow border border-saffron-amber shadow-xs text-terracotta-clay'
                    : 'bg-surface-pure hover:bg-white text-warm-gray border border-transparent'
                }`}
              >
                <span>Baghair Roti</span>
              </button>
            </div>

            {/* Stepper only when Roti is active */}
            {accompaniment === 'roti' && (
              <div className="bg-warm-parchment/80 rounded-xl p-3 border border-border-subtle flex items-center justify-between mt-2">
                <div className="space-y-0.5">
                  <span className="text-[11px] uppercase tracking-wider text-warm-gray font-semibold block">
                    Portion Control
                  </span>
                  <span className="font-serif text-base font-bold text-charcoal-ink">
                    {rotiCount} {rotiCount === 1 ? 'Roti' : 'Rotiyan'} (Phulka)
                  </span>
                  <div className="text-xs text-saffron-amber font-medium">
                    +{rotiKcal} kcal • +{rotiCarbs}g Carbs
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-surface-pure p-1 rounded-xl border border-border-subtle shadow-xs">
                  <button
                    type="button"
                    onClick={() => setRotiCount(prev => Math.max(0, prev - 1))}
                    className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg bg-warm-parchment hover:bg-border-subtle active:scale-95 text-charcoal-ink flex items-center justify-center transition-all"
                    aria-label="Decrease Roti"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="w-7 text-center font-serif text-lg font-bold text-terracotta-clay">
                    {rotiCount}
                  </span>

                  <button
                    type="button"
                    onClick={() => setRotiCount(prev => Math.min(6, prev + 1))}
                    className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-lg bg-saffron-amber text-white hover:bg-terracotta-clay active:scale-95 flex items-center justify-center transition-all shadow-xs"
                    aria-label="Increase Roti"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Section 2: Smart Pairings */}
          <section className="space-y-2">
            <div className="flex justify-between items-baseline">
              <h4 className="font-serif text-sm font-bold text-charcoal-ink flex items-center gap-1.5">
                <span>Saath Me Kya Shamil Karein?</span>
                <span className="text-[10px] bg-cardamom-soft text-cardamom-emerald px-1.5 py-0.5 rounded font-semibold">
                  Recommended
                </span>
              </h4>
            </div>
            <p className="text-xs text-warm-gray">
              Fresh digestive and nutrient-balancing complements
            </p>

            <div className="flex flex-col gap-2 pt-1">
              {SMART_PAIRINGS.map((pairing) => {
                const isSelected = pairingIds.includes(pairing.id);
                return (
                  <button
                    key={pairing.id}
                    type="button"
                    onClick={() => togglePairing(pairing.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                      isSelected
                        ? 'border-cardamom-emerald bg-cardamom-soft/40 shadow-xs'
                        : 'border-border-subtle bg-surface-pure hover:bg-warm-parchment'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pairing.icon}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-charcoal-ink">
                            {pairing.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-cardamom-emerald font-medium block">
                          +{pairing.calories} kcal • {pairing.healthBenefit}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-cardamom-emerald text-white'
                          : 'border border-border-subtle text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 3: Live Recalculated Nutrition Total */}
          <div className="bg-turmeric-glow/60 border border-saffron-amber/30 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-saffron-amber" />
              <div>
                <span className="text-xs font-bold text-terracotta-clay block">
                  Total Meal Nutrition Estimate
                </span>
                <span className="text-[11px] text-warm-gray">
                  Calibrated for {accompaniment === 'roti' ? `${rotiCount} Roti` : accompaniment} + {pairingIds.length} sides
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-serif text-lg font-bold text-terracotta-clay block">
                ~{totalCalories} kcal
              </span>
              <span className="text-[11px] text-charcoal-ink font-semibold">
                {totalProtein}g Protein • {totalCarbs}g Carbs
              </span>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 border-t border-border-subtle bg-surface-pure shrink-0">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3.5 px-4 bg-saffron-amber hover:bg-terracotta-clay active:scale-[0.98] text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Set Portion &amp; Pairings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
