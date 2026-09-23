'use client';

/**
 * ============================================================================
 * ARCHITECTURAL CONTEXT: Pasand (Favorites & Dish Catalog Directory)
 * ----------------------------------------------------------------------------
 * PURPOSE:
 * Directly translated from stitch_frontend_ui_design_project/pasand_favorites_catalog.
 * Allows Ammi and household members to browse the entire recipe catalog, search
 * dishes, bookmark family favorites, and select any dish to cook today.
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import { Search, Heart, Clock, Sparkles, Plus, ChefHat } from 'lucide-react';
import { Dish, DishCategory } from '@/types';

interface PasandScreenProps {
  dishes: Dish[];
  favoriteDishIds: string[];
  onToggleFavorite: (dishId: string) => void;
  onSelectToCook: (dishId: string) => void;
}

export const PasandScreen: React.FC<PasandScreenProps> = ({
  dishes,
  favoriteDishIds,
  onToggleFavorite,
  onSelectToCook,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All', urdu: 'سب' },
    { id: 'karahi_gosht', label: 'Gosht / Karahi', urdu: 'گوشت' },
    { id: 'rice_specialty', label: 'Rice / Chawal', urdu: 'چاول' },
    { id: 'daal_lentils', label: 'Daal', urdu: 'دالیں' },
    { id: 'sabzi_veg', label: 'Sabzi', urdu: 'سبزی' },
    { id: 'bbq_dry', label: 'BBQ & Kabab', urdu: 'کباب' },
  ];

  const filteredDishes = useMemo(() => {
    return dishes.filter(dish => {
      // Category filter
      if (selectedCategory !== 'all' && dish.category !== selectedCategory) {
        return false;
      }
      // Search query filter (matches English or Urdu)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchEng = (dish.englishName || dish.name || '').toLowerCase().includes(query);
        const matchUrdu = dish.urduName.includes(query);
        const matchTags = dish.tags.some(t => t.toLowerCase().includes(query));
        return matchEng || matchUrdu || matchTags;
      }
      return true;
    });
  }, [dishes, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-4 pb-20">
      
      {/* 1. Screen Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-bold text-charcoal-ink">
            Pasand &amp; Khana Directory
          </h2>
          <p className="text-xs text-warm-gray">
            Browse the recipe catalog &amp; manage family favorites
          </p>
        </div>
        <span className="font-urdu text-base text-terracotta-clay">
          پسندیدہ کھانے
        </span>
      </div>

      {/* 2. Search Input Field */}
      <div className="relative">
        <Search className="w-4 h-4 text-warm-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Biryani, Karahi, Daal, Bhindi..."
          className="w-full pl-10 pr-4 py-2.5 bg-surface-pure border border-border-subtle rounded-xl text-xs text-charcoal-ink placeholder:text-warm-gray focus:outline-none focus:ring-2 focus:ring-saffron-amber shadow-xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-warm-gray hover:text-charcoal-ink"
          >
            Clear
          </button>
        )}
      </div>

      {/* 3. Horizontal Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-saffron-amber text-white shadow-xs'
                  : 'bg-surface-pure hover:bg-warm-parchment text-charcoal-ink border border-border-subtle'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-warm-gray'}`}>
                ({cat.urdu})
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Dish Cards Catalog Grid */}
      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredDishes.length === 0 ? (
          <div className="bg-surface-pure border border-border-subtle rounded-2xl p-8 text-center">
            <span className="text-3xl mb-2 block">🔍</span>
            <h4 className="font-serif text-sm font-bold text-charcoal-ink">Koi khana nahi mila</h4>
            <p className="text-xs text-warm-gray mt-1">Try another search term or category filter.</p>
          </div>
        ) : (
          filteredDishes.map((dish) => {
            const isFav = favoriteDishIds.includes(dish.id);

            return (
              <div
                key={dish.id}
                className="bg-surface-pure border border-border-subtle rounded-xl p-3 shadow-xs hover:border-saffron-amber/40 transition-all flex flex-col gap-2.5"
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail Image */}
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden shrink-0 border border-border-subtle relative">
                    <img
                      src={dish.imageUrl}
                      alt={dish.imageAlt}
                      className="w-full h-full object-cover"
                    />
                    {dish.isAmmiSpecial && (
                      <span className="absolute top-1 left-1 bg-saffron-amber text-white text-[8px] font-bold px-1 rounded">
                        Khaas
                      </span>
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-serif text-sm font-bold text-charcoal-ink truncate leading-tight">
                          {dish.englishName}
                        </h4>
                        <span className="font-urdu text-xs text-terracotta-clay block mt-0.5">
                          {dish.urduName}
                        </span>
                      </div>

                      {/* Favorite Heart Button */}
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(dish.id)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
                          isFav
                            ? 'bg-turmeric-glow text-terracotta-clay'
                            : 'text-warm-gray hover:text-charcoal-ink'
                        }`}
                        aria-label="Toggle Favorite"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-terracotta-clay' : ''}`} />
                      </button>
                    </div>

                    <p className="text-[11px] text-warm-gray line-clamp-1 mt-1">
                      {dish.description}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] bg-turmeric-glow text-terracotta-clay font-semibold px-1.5 py-0.5 rounded border border-border-subtle">
                        ~{dish.nutrition.calories} kcal
                      </span>
                      <span className="text-[10px] text-charcoal-ink font-medium">
                        {dish.nutrition.proteinGrams}g Protein
                      </span>
                      <span className="text-[10px] text-warm-gray flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{(dish.prepTimeMinutes || 0) + dish.cookingTimeMinutes}m</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cook Today Quick Action Button */}
                <div className="pt-2 border-t border-border-subtle/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {dish.tags.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="text-[9px] bg-warm-parchment text-warm-gray px-1.5 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectToCook(dish.id)}
                    className="flex items-center gap-1 text-xs font-bold text-saffron-amber hover:text-terracotta-clay active:scale-95 transition-transform"
                  >
                    <ChefHat className="w-3.5 h-3.5" />
                    <span>Aaj Ye Banayein</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
