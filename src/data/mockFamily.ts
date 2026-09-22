/**
 * ============================================================================
 * ARCHITECTURAL CONTEXT: Family Profiles & Preferences Baseline
 * ----------------------------------------------------------------------------
 * PURPOSE:
 * Represents the household members, their individual favorite dishes, dislikes,
 * and dietary goals. This enables the recommendation engine to avoid picky-eater
 * conflicts and prioritize dishes everyone loves.
 * ============================================================================
 */

import { FamilyMember } from '@/types';

export const MOCK_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'fam-ammi',
    name: 'Ammi Jaan',
    role: 'Ammi',
    avatarEmoji: '👩‍🍳',
    favoriteDishIds: ['dish-1', 'dish-3', 'dish-7'],
    dislikedDishIds: [],
    dietaryNotes: 'Prefers lighter oil and balanced nutrition for the family'
  },
  {
    id: 'fam-abu',
    name: 'Abu',
    role: 'Abu',
    avatarEmoji: '🧔',
    favoriteDishIds: ['dish-4', 'dish-6', 'dish-7'],
    dislikedDishIds: ['dish-2'],
    dietaryNotes: 'Loves traditional salan with bone-in mutton and authentic spices'
  },
  {
    id: 'fam-son',
    name: 'Raza (Beta)',
    role: 'Beta',
    avatarEmoji: '👦',
    favoriteDishIds: ['dish-1', 'dish-4', 'dish-8'],
    dislikedDishIds: ['dish-5'],
    dietaryNotes: 'High-protein fitness diet; picky with plain boiled vegetables'
  }
];
