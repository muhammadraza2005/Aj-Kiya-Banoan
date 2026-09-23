'use client';

/**
 * ============================================================================
 * ARCHITECTURAL CONTEXT: Bottom Navigation Bar
 * ----------------------------------------------------------------------------
 * PURPOSE:
 * Provides the fixed mobile bottom bar for one-thumb kitchen navigation.
 * 
 * DESIGN SPECIFICATIONS:
 * Follows the Stitch bottom navigation specifications with high touch contrast,
 * active indicator pills, and bilingual label hints.
 * ============================================================================
 */

import React from 'react';
import { Sparkles, CalendarDays, Heart, Users } from 'lucide-react';

export type ActiveTab = 'home' | 'tareekh' | 'pasand' | 'family';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    {
      id: 'home' as ActiveTab,
      label: 'Banaun',
      urdu: 'آج',
      icon: Sparkles,
    },
    {
      id: 'tareekh' as ActiveTab,
      label: 'Tareekh',
      urdu: 'تاریخ',
      icon: CalendarDays,
    },
    {
      id: 'pasand' as ActiveTab,
      label: 'Pasand',
      urdu: 'پسند',
      icon: Heart,
    },
    {
      id: 'family' as ActiveTab,
      label: 'Gharane',
      urdu: 'گھرانہ',
      icon: Users,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-pure/95 backdrop-blur-lg border-t border-border-subtle max-w-md md:max-w-3xl lg:max-w-5xl mx-auto shadow-bottom-sheet">
      <div className="grid grid-cols-4 items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              type="button"
              className={`flex flex-col items-center justify-center h-full transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-saffron-amber font-semibold'
                  : 'text-warm-gray hover:text-charcoal-ink'
              }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-7 rounded-full transition-all ${
                  isActive ? 'bg-turmeric-glow text-saffron-amber' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[11px] leading-tight tracking-tight mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
