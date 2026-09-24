'use client';

/**
 * ============================================================================
 * ARCHITECTURAL CONTEXT: Tareekh (7-Day History & Variety Tracker)
 * ----------------------------------------------------------------------------
 * PURPOSE:
 * Directly translated from stitch_frontend_ui_design_project/tareekh_history_weekly_variety.
 * Solves the critical Desi household frustration: "Did we eat chicken yesterday?"
 * and "Have we had enough lentils and vegetables this week?"
 * 
 * DATA FLOW:
 * Reads from MealLogEntry[]. Aggregates category distribution and calculates
 * the real-time weekly variety score.
 * ============================================================================
 */

import React from 'react';
import { 
  CalendarDays, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  UtensilsCrossed, 
  Flame,
  ArrowRight,
  X
} from 'lucide-react';
import { MealLogEntry, WeeklyVarietyScore } from '@/types';

interface TareekhScreenProps {
  history: MealLogEntry[];
  varietyScore: WeeklyVarietyScore;
  onCookAgain: (dishId: string) => void;
  onDeleteMeal: (logId: string) => void;
}

export const TareekhScreen: React.FC<TareekhScreenProps> = ({
  history,
  varietyScore,
  onCookAgain,
  onDeleteMeal,
}) => {
  const { scoreOutOf10, varietyVerdict, categoryBreakdown, nutritionHighlights } = varietyScore;

  // Format date nicely
  const formatFriendlyDate = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (dateStr === today) return 'Aaj (Today)';
    if (dateStr === yesterdayDate) return 'Kal (Yesterday)';

    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const getCategoryBadge = (category: string | undefined) => {
    switch (category) {
      case 'karahi_gosht':
        return { label: 'Gosht / Karahi', color: 'bg-primary/10 text-primary border-primary/20' };
      case 'rice_specialty':
        return { label: 'Chawal / Rice', color: 'bg-saffron-amber/10 text-saffron-amber border-saffron-amber/20' };
      case 'daal_lentils':
        return { label: 'Daal / Lentils', color: 'bg-cardamom-soft text-cardamom-emerald border-cardamom-emerald/20' };
      case 'sabzi_veg':
        return { label: 'Sabzi / Veg', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'bbq_dry':
        return { label: 'BBQ / Kabab', color: 'bg-terracotta-clay/10 text-terracotta-clay border-terracotta-clay/20' };
      default:
        return { label: 'Salan', color: 'bg-warm-parchment text-charcoal-ink border-border-subtle' };
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-20">
      
      {/* 1. Screen Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-bold text-charcoal-ink">
            Tareekh &amp; Weekly Variety
          </h2>
          <p className="text-xs text-warm-gray">
            Last 7 days of home-cooked meals &amp; nutritional balance
          </p>
        </div>
        <span className="font-urdu text-base text-terracotta-clay">
          ہفتہ وار تاریخ
        </span>
      </div>

      {/* 2. Variety Score Meter Card */}
      <div className="bg-surface-pure rounded-2xl border border-border-subtle p-4 shadow-warm-card flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-turmeric-glow flex items-center justify-center text-saffron-amber">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-warm-gray uppercase tracking-wider block">
                Variety Balance Index
              </span>
              <span className="font-serif text-base font-bold text-charcoal-ink">
                {varietyVerdict}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="font-serif text-2xl font-bold text-saffron-amber">
              {scoreOutOf10}
            </span>
            <span className="text-xs text-warm-gray font-medium"> / 10</span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-warm-parchment h-2.5 rounded-full overflow-hidden border border-border-subtle">
          <div
            className="bg-gradient-to-r from-saffron-amber to-cardamom-emerald h-full rounded-full transition-all duration-500"
            style={{ width: `${(scoreOutOf10 / 10) * 100}%` }}
          />
        </div>

        {/* Category Distribution Pills */}
        <div className="grid grid-cols-4 gap-1.5 text-center pt-1">
          <div className="bg-warm-parchment p-1.5 rounded-lg border border-border-subtle">
            <span className="text-[10px] text-warm-gray block">🍗 Meat</span>
            <span className="font-serif text-xs font-bold text-charcoal-ink">{categoryBreakdown.meatDays} days</span>
          </div>
          <div className="bg-warm-parchment p-1.5 rounded-lg border border-border-subtle">
            <span className="text-[10px] text-warm-gray block">🥦 Sabzi</span>
            <span className="font-serif text-xs font-bold text-charcoal-ink">{categoryBreakdown.vegDays} days</span>
          </div>
          <div className="bg-warm-parchment p-1.5 rounded-lg border border-border-subtle">
            <span className="text-[10px] text-warm-gray block">🍲 Daal</span>
            <span className="font-serif text-xs font-bold text-charcoal-ink">{categoryBreakdown.daalDays} days</span>
          </div>
          <div className="bg-warm-parchment p-1.5 rounded-lg border border-border-subtle">
            <span className="text-[10px] text-warm-gray block">🍚 Rice</span>
            <span className="font-serif text-xs font-bold text-charcoal-ink">{categoryBreakdown.riceDays} days</span>
          </div>
        </div>

        {/* Variety Health Alert Banner */}
        {nutritionHighlights.ironDeficitAlert ? (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs p-2.5 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Iron deficit alert: Consider cooking Daal or Palak today.</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-cardamom-soft border border-cardamom-emerald/30 text-cardamom-emerald text-xs p-2.5 rounded-xl">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Well balanced! Healthy rotation between lentils, vegetables, and proteins.</span>
          </div>
        )}
      </div>

      {/* 3. Chronological Meal History List */}
      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        <h3 className="font-serif text-sm font-bold text-charcoal-ink flex items-center gap-1.5">
          <CalendarDays className="w-4 h-4 text-saffron-amber" />
          <span>Past 7 Days History</span>
        </h3>

        {history.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 bg-surface-pure rounded-xl border border-dashed border-border-subtle p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-warm-parchment flex items-center justify-center text-warm-gray">
              <UtensilsCrossed className="w-6 h-6 opacity-50" />
            </div>
            <div>
              <p className="font-serif text-charcoal-ink font-bold">No meals logged yet</p>
              <p className="text-xs text-warm-gray mt-1">
                Your past 7 days history will appear here once you start logging meals.
              </p>
            </div>
          </div>
        ) : (
          history.map((log) => {
            const badge = getCategoryBadge(log.category);
            return (
              <div
                key={log.id}
                className="bg-surface-pure rounded-xl border border-border-subtle p-3.5 shadow-xs flex items-center justify-between gap-3 hover:border-saffron-amber/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-warm-parchment flex items-center justify-center text-charcoal-ink border border-border-subtle shrink-0">
                    <UtensilsCrossed className="w-4 h-4 text-saffron-amber" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-saffron-amber">
                        {formatFriendlyDate(log.date)}
                      </span>
                      <span className="text-[10px] text-warm-gray">• {(log.mealType || '').split(' ')[0]}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <h4 className="font-serif text-sm font-bold text-charcoal-ink leading-tight">
                        {log.dishName}
                      </h4>
                      <span className="font-urdu text-xs text-terracotta-clay">
                        ({log.dishUrduName})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-[10px] text-warm-gray">
                        ~{log.totalCalories} kcal
                        {log.totalProtein ? ` • ${log.totalProtein}g protein` : ''}
                        {log.selectedPairingIds && log.selectedPairingIds.length > 0 && ` • +${log.selectedPairingIds.length} Sides`}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteMeal(log.id)}
                  className="w-8 h-8 rounded-lg bg-warm-parchment hover:bg-terracotta-clay/10 hover:text-terracotta-clay text-warm-gray flex items-center justify-center transition-colors shrink-0"
                  title="Delete from History"
                  aria-label="Delete meal from history"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
