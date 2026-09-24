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
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Ammi Jaan',
    role: 'Ammi',
    avatarEmoji: '👩‍🍳',
    favoriteDishIds: ['dish-1', 'dish-3', 'dish-7'],
    dislikedDishIds: [],
    dietaryNotes: 'Prefers lighter oil and balanced nutrition for the family'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Abu',
    role: 'Abu',
    avatarEmoji: '🧔',
    favoriteDishIds: ['dish-4', 'dish-6', 'dish-7'],
    dislikedDishIds: ['dish-2'],
    dietaryNotes: 'Loves traditional salan with bone-in mutton and authentic spices'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Raza (Beta)',
    role: 'Beta',
    avatarEmoji: '👦',
    favoriteDishIds: ['dish-1', 'dish-4', 'dish-8'],
    dislikedDishIds: ['dish-5'],
    dietaryNotes: 'High-protein fitness diet; picky with plain boiled vegetables'
  }
];
