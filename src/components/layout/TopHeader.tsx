'use client';

/**
 * ============================================================================
 * ARCHITECTURAL CONTEXT: Top Application Bar
 * ----------------------------------------------------------------------------
 * PURPOSE:
 * Provides the sticky header containing the cultural greeting, the Urdu brand
 * identity, and the active family persona selector.
 * 
 * INTERACTION:
 * Clicking the family persona chip toggles between household members (Ammi, Abu, Son),
 * which dynamically re-weights the recommendation engine!
 * ============================================================================
 */

import React from 'react';
import { ChefHat, Users, Sparkles } from 'lucide-react';
import { FamilyMember } from '@/types';

interface TopHeaderProps {
  currentMember: FamilyMember;
  onOpenFamilySelector: () => void;
  streakDays?: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentMember,
  onOpenFamilySelector,
  streakDays = 5,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-warm-parchment/95 backdrop-blur-md border-b border-border-subtle/80 px-4 py-3">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {/* Left: Brand Identity & Urdu Calligraphy */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
            <ChefHat className="w-5 h-5 text-saffron-amber" />
          </div>
          <div>
            <h1 className="font-urdu text-xl font-bold text-primary leading-tight -mb-1">
              آج کیا بناؤں؟
            </h1>
            <p className="text-[11px] font-sans font-medium text-warm-gray tracking-tight">
              Aaj Kya Banaun • Desi Kitchen Companion
            </p>
          </div>
        </div>

        {/* Right: Active Persona Selector Pill & Streak */}
        <div className="flex items-center gap-2">
          {/* Variety Streak Badge */}
          <div 
            className="flex items-center gap-1 bg-turmeric-glow border border-saffron-amber/30 text-saffron-amber px-2 py-1 rounded-full text-xs font-semibold shadow-xs"
            title="5 days of balanced cooking variety!"
          >
            <Sparkles className="w-3.5 h-3.5 text-saffron-amber animate-pulse" />
            <span>{streakDays}d</span>
          </div>

          {/* Member Persona Switcher */}
          <button
            onClick={onOpenFamilySelector}
            className="flex items-center gap-1.5 bg-surface-pure hover:bg-surface-container border border-border-subtle px-2.5 py-1 rounded-full text-xs font-medium text-charcoal-ink transition-all active:scale-95 shadow-xs"
            type="button"
            aria-label="Change family member persona"
          >
            <span className="text-sm">{currentMember.avatarEmoji}</span>
            <span className="font-semibold text-charcoal-ink">{currentMember.name.split(' ')[0]}</span>
            <Users className="w-3 h-3 text-warm-gray" />
          </button>
        </div>
      </div>
    </header>
  );
};
