'use client';

/**
 * ============================================================================
 * ARCHITECTURAL CONTEXT: Gharane (Family Profiles & Picky-Eater Settings)
 * ----------------------------------------------------------------------------
 * PURPOSE:
 * Manages the household members and their individual culinary constraints.
 * 
 * PERSONALIZATION ALGORITHM IMPACT:
 * When Ammi switches the active persona to "Beta (Son)", the scoring algorithm
 * immediately prioritizes high-protein dishes and downranks dishes marked as disliked.
 * ============================================================================
 */

import React from 'react';
import { Users, Heart, ThumbsDown, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { FamilyMember, Dish } from '@/types';

interface FamilyScreenProps {
  members: FamilyMember[];
  activeMemberId: string;
  onSelectMember: (memberId: string) => void;
  dishes: Dish[];
}

export const FamilyScreen: React.FC<FamilyScreenProps> = ({
  members,
  activeMemberId,
  onSelectMember,
  dishes,
}) => {
  return (
    <div className="flex flex-col gap-4 pb-20">
      
      {/* 1. Screen Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-bold text-charcoal-ink">
            Gharane ke Afraad (Family)
          </h2>
          <p className="text-xs text-warm-gray">
            Personalize recommendations for picky eaters &amp; preferences
          </p>
        </div>
        <span className="font-urdu text-base text-terracotta-clay">
          گھرانہ
        </span>
      </div>

      {/* 2. Active Persona Selector */}
      <div className="bg-surface-pure border border-border-subtle rounded-2xl p-4 shadow-warm-card flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-saffron-amber" />
          <h3 className="font-serif text-sm font-bold text-charcoal-ink">
            Active Kitchen Recommendation Persona
          </h3>
        </div>
        <p className="text-xs text-warm-gray">
          Select who Ammi is cooking for today to re-calibrate meal suggestions:
        </p>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {members.map((member) => {
            const isActive = member.id === activeMemberId;
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => onSelectMember(member.id)}
                className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                  isActive
                    ? 'border-saffron-amber bg-turmeric-glow/60 shadow-xs'
                    : 'border-border-subtle bg-warm-parchment hover:bg-white'
                }`}
              >
                <span className="text-2xl mb-1">{member.avatarEmoji}</span>
                <span className="text-xs font-bold text-charcoal-ink leading-tight">
                  {member.name}
                </span>
                <span className="text-[10px] text-warm-gray mt-0.5">
                  {member.role}
                </span>
                {isActive && (
                  <span className="mt-1 text-[9px] bg-saffron-amber text-white font-semibold px-1.5 py-0.2 rounded-full">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Detailed Profiles Breakdown */}
      <div className="flex flex-col gap-3">
        <h3 className="font-serif text-sm font-bold text-charcoal-ink flex items-center gap-1.5">
          <Users className="w-4 h-4 text-saffron-amber" />
          <span>Dietary Rules &amp; Favorites</span>
        </h3>

        {members.map((member) => {
          const favoriteDishes = dishes.filter(d => member.favoriteDishIds.includes(d.id));
          const dislikedDishes = dishes.filter(d => member.dislikedDishIds.includes(d.id));

          return (
            <div
              key={member.id}
              className="bg-surface-pure border border-border-subtle rounded-xl p-3.5 shadow-xs flex flex-col gap-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{member.avatarEmoji}</span>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-charcoal-ink">
                      {member.name}
                    </h4>
                    <span className="text-[11px] text-warm-gray">
                      {member.dietaryNotes || 'Standard household diet'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Favorites row */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
                <span className="text-warm-gray flex items-center gap-1 shrink-0 font-medium">
                  <Heart className="w-3 h-3 text-terracotta-clay fill-terracotta-clay" />
                  <span>Loves:</span>
                </span>
                {favoriteDishes.length > 0 ? (
                  favoriteDishes.map(d => (
                    <span key={d.id} className="bg-turmeric-glow border border-saffron-amber/30 text-terracotta-clay px-1.5 py-0.5 rounded text-[10px] font-semibold">
                      {d.englishName}
                    </span>
                  ))
                ) : (
                  <span className="text-warm-gray italic text-[10px]">None selected</span>
                )}
              </div>

              {/* Dislikes row */}
              {dislikedDishes.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                  <span className="text-warm-gray flex items-center gap-1 shrink-0 font-medium">
                    <ThumbsDown className="w-3 h-3 text-warm-gray" />
                    <span>Avoids:</span>
                  </span>
                  {dislikedDishes.map(d => (
                    <span key={d.id} className="bg-warm-parchment border border-border-subtle text-warm-gray px-1.5 py-0.5 rounded text-[10px]">
                      {d.englishName}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Privacy & Offline Kitchen Guarantee */}
      <div className="flex items-center gap-2 bg-warm-parchment border border-border-subtle rounded-xl p-3 text-xs text-warm-gray">
        <ShieldCheck className="w-4 h-4 text-cardamom-emerald shrink-0" />
        <p className="leading-tight">
          All family preferences are saved locally on your device for instant offline kitchen access.
        </p>
      </div>
    </div>
  );
};
