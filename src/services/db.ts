import { supabase } from '@/lib/supabase';
import { Dish } from '@/types';

export async function fetchUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching profile:', error);
  }
  return data;
}

export async function createProfile(profile: any) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profile])
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
  return data;
}

export async function fetchHouseholdProfiles(householdName: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('household_name', householdName);

  if (error) {
    console.error('Error fetching household profiles:', error);
    return [];
  }
  return data;
}

export async function fetchDishesFromDB(): Promise<Dish[]> {
  const { data, error } = await supabase
    .from('foods')
    .select(`
      *,
      food_nutrition (*)
    `);

  if (error) {
    console.error('Error fetching dishes:', error);
    return [];
  }

  return data.map((item: any): Dish => {
    // If food_nutrition is returned as an array or object, handle both
    const nutrition = Array.isArray(item.food_nutrition) 
      ? item.food_nutrition[0] 
      : item.food_nutrition || {};

    return {
      id: item.id,
      name: item.name,
      englishName: item.name,
      urduName: item.urdu_name,
      category: item.category, 
      proteinSource: item.protein_source,
      cookingTimeMinutes: item.cooking_time_minutes || 45,
      isQuick: item.is_quick || false,
      tags: item.tags || [],
      nutrition: {
        calories: nutrition.calories || 0,
        proteinGrams: nutrition.protein_g || 0,
        carbsGrams: nutrition.carbs_g || 0,
        fatsGrams: nutrition.fat_g || 0,
        ironMg: nutrition.iron_mg || 0,
        zincMg: nutrition.zinc_mg || 0,
        fiberGrams: nutrition.fiber_g || 0,
      },
      prepTimeMinutes: 15,
      difficulty: 'Darmiyana (Medium)',
      // Provide a fallback image
      imageUrl: item.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      description: `A delicious authentic serving of ${item.name}.`,
      recommendedPairingIds: ['pairing-salad', 'pairing-raita']
    };
  });
}

export async function fetchMealHistory(userId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('meal_history')
    .select(`
      *,
      foods (
        name,
        urdu_name,
        category
      ),
      meal_history_pairings (
        pairing_food_id
      )
    `)
    .eq('user_id', userId)
    .order('meal_date', { ascending: false });

  if (error) {
    console.error('Error fetching meal history:', error);
    return [];
  }
  return data;
}

export async function logMealToDB(logData: any, pairingFoodIds: string[] = []) {
  const { data, error } = await supabase
    .from('meal_history')
    .insert([logData])
    .select()
    .single();

  if (error) {
    console.error('Error logging meal:', error);
    throw error;
  }

  // Insert pairings if any
  if (data && data.id && pairingFoodIds.length > 0) {
    const pairingsToInsert = pairingFoodIds.map(id => ({
      meal_history_id: data.id,
      pairing_food_id: id,
      timing: 'with_meal'
    }));

    const { error: pairingError } = await supabase
      .from('meal_history_pairings')
      .insert(pairingsToInsert);

    if (pairingError) {
      console.error('Error logging pairings:', pairingError);
    }
  }

  return data;
}

export async function fetchUserFavorites(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('food_id')
    .eq('user_id', userId)
    .eq('is_favorite', true);

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
  return data.map((fav: any) => fav.food_id);
}

export async function toggleFavoriteInDB(userId: string, foodId: string, isFavorite: boolean) {
  // Upsert the preference
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({ 
      user_id: userId, 
      food_id: foodId, 
      is_favorite: isFavorite,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,food_id'
    });

  if (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
  return data;
}

export async function fetchDismissedDishes(userId: string): Promise<string[]> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('daily_dismissals')
    .select('food_id')
    .eq('user_id', userId)
    .eq('dismissed_date', today);

  if (error) {
    console.error('Error fetching dismissed dishes:', error);
    return [];
  }
  return data.map((d: any) => d.food_id);
}

export async function dismissDishInDB(userId: string, foodId: string) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('daily_dismissals')
    .insert([{
      user_id: userId,
      food_id: foodId,
      dismissed_date: today
    }]);

  if (error) {
    // Ignore duplicate key errors if already dismissed today
    if (error.code !== '23505') {
      console.error('Error dismissing dish:', error);
      throw error;
    }
  }
  return data;
}

