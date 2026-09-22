/**
 * ============================================================================
 * ARCHITECTURAL CONTEXT: Dish Catalog Data & Smart Desi Pairings
 * ----------------------------------------------------------------------------
 * PURPOSE:
 * Serves as the localized Pakistani recipe knowledge base. Pre-seeded with
 * culturally authentic dishes across Karahi, Rice, Daal, Sabzi, and BBQ.
 * 
 * NUTRITIONAL LOGIC:
 * Nutrition metrics are calibrated against typical Pakistani household cooking
 * practices (e.g. standard mustard oil or desi ghee measures, skinless chicken,
 * standard basmati rice portions, and whole-wheat atta roti).
 * ============================================================================
 */

import { Dish, SmartPairing } from '@/types';

export const SMART_PAIRINGS: SmartPairing[] = [
  {
    id: 'pairing-salad',
    name: 'Fresh Kachumber Salad (Cucumber, Onion & Tomato)',
    urduName: 'کچومر سلاد',
    icon: '🥗',
    calories: 25,
    healthBenefit: 'High dietary fiber, promotes digestion & micronutrient absorption',
    category: 'salad'
  },
  {
    id: 'pairing-raita',
    name: 'Zeera & Mint Raita (Spiced Curd)',
    urduName: 'زیرہ اور پودینہ رائتہ',
    icon: '🥣',
    calories: 60,
    healthBenefit: 'Probiotic richness, cools gut acidity from spices',
    category: 'raita'
  },
  {
    id: 'pairing-chutney',
    name: 'Hari Chutney (Coriander & Green Chilli)',
    urduName: 'ہری چٹنی',
    icon: '🌿',
    calories: 15,
    healthBenefit: 'Vitamin C booster, enhances iron bio-availability',
    category: 'chutney'
  },
  {
    id: 'pairing-dryfruit',
    name: 'Roasted Almonds & Walnuts',
    urduName: 'بادام اور اخروٹ',
    icon: '🥜',
    calories: 140,
    healthBenefit: 'Healthy Omega-3 fats & zinc for cognitive stamina',
    category: 'dry_fruit'
  }
];

export const MOCK_DISHES: Dish[] = [
  {
    id: 'dish-1',
    englishName: 'Chicken Pulao',
    urduName: 'چکن پلاؤ',
    category: 'rice_specialty',
    description: 'Fragrant basmati rice gently simmered in whole spiced chicken yakhni (bone broth), garnished with golden caramelized onions.',
    prepTimeMinutes: 20,
    cookingTimeMinutes: 45,
    difficulty: 'Darmiyana (Medium)',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'A fragrant golden basmati Chicken Pulao garnished with caramelized onions and fresh mint',
    nutrition: {
      calories: 580,
      proteinGrams: 32,
      carbsGrams: 70,
      fatsGrams: 16,
      ironMg: 3.2,
      zincMg: 2.1,
      fiberGrams: 3.5
    },
    defaultRotiCount: 0,
    recommendedPairingIds: ['pairing-raita', 'pairing-salad'],
    tags: ['Yakhni Broth', 'Comfort Food', 'Family Feast'],
    isAmmiSpecial: true
  },
  {
    id: 'dish-2',
    englishName: 'Bhindi Masala (Okra)',
    urduName: 'بھنڈی مصالحہ',
    category: 'sabzi_veg',
    description: 'Tender crisped okra sautéed with sliced onions, diced tomatoes, green chillies, and amchur (dry mango powder) for a tangy crunch.',
    prepTimeMinutes: 15,
    cookingTimeMinutes: 25,
    difficulty: 'Aasan (Easy)',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Stir-fried vibrant green Bhindi Masala with onions and spices',
    nutrition: {
      calories: 220,
      proteinGrams: 5,
      carbsGrams: 24,
      fatsGrams: 11,
      ironMg: 2.8,
      zincMg: 0.9,
      fiberGrams: 6.2
    },
    defaultRotiCount: 2,
    recommendedPairingIds: ['pairing-salad', 'pairing-chutney'],
    tags: ['High Fiber', 'Light Dinner', 'Vegetarian'],
    isAmmiSpecial: false
  },
  {
    id: 'dish-3',
    englishName: 'Daal Chawal (Tarka Moong & Masoor)',
    urduName: 'دال چاول',
    category: 'daal_lentils',
    description: 'Silky golden yellow lentils tempered with garlic, cumin seeds, round red chillies, and curry leaves, served over fluffy steamed rice.',
    prepTimeMinutes: 10,
    cookingTimeMinutes: 30,
    difficulty: 'Aasan (Easy)',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Traditional Pakistani yellow lentils with aromatic garlic tarka and steamed basmati rice',
    nutrition: {
      calories: 420,
      proteinGrams: 16,
      carbsGrams: 68,
      fatsGrams: 8,
      ironMg: 4.5,
      zincMg: 2.4,
      fiberGrams: 7.8
    },
    defaultRotiCount: 0,
    recommendedPairingIds: ['pairing-salad', 'pairing-chutney'],
    tags: ['Comfort Classic', 'High Iron', 'Plant Protein'],
    isAmmiSpecial: true
  },
  {
    id: 'dish-4',
    englishName: 'Shinwari Chicken Karahi',
    urduName: 'شنواری چکن کڑاہی',
    category: 'karahi_gosht',
    description: 'Authentic Pashtun-style wok chicken cooked strictly in fresh ripe tomatoes, green chillies, ginger juliennes, and black pepper. No onion, pure flavor.',
    prepTimeMinutes: 15,
    cookingTimeMinutes: 30,
    difficulty: 'Darmiyana (Medium)',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Sizzling hot Shinwari Chicken Karahi garnished with fresh coriander and ginger juliennes',
    nutrition: {
      calories: 490,
      proteinGrams: 42,
      carbsGrams: 10,
      fatsGrams: 28,
      ironMg: 3.8,
      zincMg: 3.1,
      fiberGrams: 2.1
    },
    defaultRotiCount: 2,
    recommendedPairingIds: ['pairing-raita', 'pairing-salad'],
    tags: ['High Protein', 'Keto Friendly', 'Weekend Special'],
    isAmmiSpecial: true
  },
  {
    id: 'dish-5',
    englishName: 'Aloo Palak (Spinach & Potatoes)',
    urduName: 'آلو پالک',
    category: 'sabzi_veg',
    description: 'Velvety pureed spinach cooked with tender pan-fried golden baby potatoes, spiced with cumin, fenugreek leaves (kasuri methi), and green chillies.',
    prepTimeMinutes: 20,
    cookingTimeMinutes: 35,
    difficulty: 'Darmiyana (Medium)',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Rich emerald green spinach gravy simmered with golden potato chunks',
    nutrition: {
      calories: 280,
      proteinGrams: 7,
      carbsGrams: 36,
      fatsGrams: 12,
      ironMg: 5.6,
      zincMg: 1.2,
      fiberGrams: 5.4
    },
    defaultRotiCount: 2,
    recommendedPairingIds: ['pairing-raita', 'pairing-salad'],
    tags: ['Iron Powerhouse', 'Antioxidants', 'Pure Vegetarian'],
    isAmmiSpecial: false
  },
  {
    id: 'dish-6',
    englishName: 'Sindhi Chicken Biryani',
    urduName: 'سندھی بریانی',
    category: 'rice_specialty',
    description: 'Layered spiced basmati rice and marinated chicken cooked with tangy dried plums (aaloo bukhara), potatoes, saffron milk, and fresh mint on dum.',
    prepTimeMinutes: 35,
    cookingTimeMinutes: 50,
    difficulty: 'Khaas (Special)',
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Aromatic layered Sindhi Biryani with saffron rice, chicken, and spiced potatoes',
    nutrition: {
      calories: 680,
      proteinGrams: 36,
      carbsGrams: 82,
      fatsGrams: 22,
      ironMg: 4.1,
      zincMg: 2.8,
      fiberGrams: 4.2
    },
    defaultRotiCount: 0,
    recommendedPairingIds: ['pairing-raita', 'pairing-salad'],
    tags: ['Celebration Dish', 'Dum Cooking', 'Spice Master'],
    isAmmiSpecial: true
  },
  {
    id: 'dish-7',
    englishName: 'Chana Daal Gosht (Mutton with Lentils)',
    urduName: 'چنا دال گوشت',
    category: 'daal_lentils',
    description: 'Slow-simmered tender bone-in mutton cooked together with split Bengal gram (chana daal) in an aromatic warming garam masala gravy.',
    prepTimeMinutes: 20,
    cookingTimeMinutes: 60,
    difficulty: 'Darmiyana (Medium)',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Hearty Chana Daal Gosht simmered with whole spices and tender meat',
    nutrition: {
      calories: 520,
      proteinGrams: 38,
      carbsGrams: 32,
      fatsGrams: 24,
      ironMg: 5.2,
      zincMg: 4.0,
      fiberGrams: 6.8
    },
    defaultRotiCount: 2,
    recommendedPairingIds: ['pairing-salad', 'pairing-chutney'],
    tags: ['High Iron & Zinc', 'Slow Cooked', 'Traditional Salan'],
    isAmmiSpecial: true
  },
  {
    id: 'dish-8',
    englishName: 'Peshawari Chapli Kabab',
    urduName: 'پشاوری چپلی کباب',
    category: 'bbq_dry',
    description: 'Pan-fried minced beef patties infused with crushed coriander seeds, pomegranate arils (anardana), sliced tomatoes, and green chillies.',
    prepTimeMinutes: 25,
    cookingTimeMinutes: 15,
    difficulty: 'Darmiyana (Medium)',
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Crispy pan-fried Chapli Kabab with tomato slice and chopped mint',
    nutrition: {
      calories: 460,
      proteinGrams: 34,
      carbsGrams: 14,
      fatsGrams: 28,
      ironMg: 4.8,
      zincMg: 5.1,
      fiberGrams: 2.0
    },
    defaultRotiCount: 1,
    recommendedPairingIds: ['pairing-chutney', 'pairing-salad', 'pairing-raita'],
    tags: ['High Protein', 'Beshak Pasand', 'Peshawar Heritage'],
    isAmmiSpecial: true
  }
];
