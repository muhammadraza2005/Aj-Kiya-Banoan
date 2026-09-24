-- ==========================================
-- Re-enable RLS on all relevant tables
-- ==========================================
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_history_pairings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_dismissals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Foods are publicly readable" ON public.foods;
DROP POLICY IF EXISTS "Food nutrition is publicly readable" ON public.food_nutrition;
DROP POLICY IF EXISTS "Profiles are readable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update household profiles" ON public.profiles;
DROP POLICY IF EXISTS "Household can access meal history" ON public.meal_history;
DROP POLICY IF EXISTS "Household can access favorites" ON public.user_preferences;
DROP POLICY IF EXISTS "Household can access dismissals" ON public.daily_dismissals;
DROP POLICY IF EXISTS "Household can access meal history pairings" ON public.meal_history_pairings;

-- ==========================================
-- 1. Foods (Master Catalog) & Nutrition
-- ==========================================
CREATE POLICY "Foods are publicly readable" 
ON public.foods FOR SELECT USING (true);

CREATE POLICY "Food nutrition is publicly readable" 
ON public.food_nutrition FOR SELECT USING (true);

-- ==========================================
-- 2. Profiles (Household Members)
-- ==========================================
-- Allow users to read and insert profiles (so they can create family members)
CREATE POLICY "Profiles are readable by authenticated users" 
ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert profiles" 
ON public.profiles FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update household profiles" 
ON public.profiles FOR UPDATE USING (
  household_name = (SELECT household_name FROM public.profiles WHERE id = auth.uid() LIMIT 1)
);

-- ==========================================
-- 3. Private User Data (Meal History, Favorites, Dismissals)
-- Allow access if the target user_id belongs to the same household as the logged-in user.
-- ==========================================
CREATE POLICY "Household can access meal history"
ON public.meal_history FOR ALL 
USING (
  user_id IN (
    SELECT id FROM public.profiles WHERE household_name = (SELECT household_name FROM public.profiles WHERE id = auth.uid() LIMIT 1)
  )
) 
WITH CHECK (
  user_id IN (
    SELECT id FROM public.profiles WHERE household_name = (SELECT household_name FROM public.profiles WHERE id = auth.uid() LIMIT 1)
  )
);

CREATE POLICY "Household can access favorites"
ON public.user_preferences FOR ALL 
USING (
  user_id IN (
    SELECT id FROM public.profiles WHERE household_name = (SELECT household_name FROM public.profiles WHERE id = auth.uid() LIMIT 1)
  )
) 
WITH CHECK (
  user_id IN (
    SELECT id FROM public.profiles WHERE household_name = (SELECT household_name FROM public.profiles WHERE id = auth.uid() LIMIT 1)
  )
);

CREATE POLICY "Household can access dismissals"
ON public.daily_dismissals FOR ALL 
USING (
  user_id IN (
    SELECT id FROM public.profiles WHERE household_name = (SELECT household_name FROM public.profiles WHERE id = auth.uid() LIMIT 1)
  )
) 
WITH CHECK (
  user_id IN (
    SELECT id FROM public.profiles WHERE household_name = (SELECT household_name FROM public.profiles WHERE id = auth.uid() LIMIT 1)
  )
);

CREATE POLICY "Household can access meal history pairings"
ON public.meal_history_pairings FOR ALL
USING (
  meal_history_id IN (
    SELECT id FROM public.meal_history WHERE user_id IN (
      SELECT id FROM public.profiles WHERE household_name = (SELECT household_name FROM public.profiles WHERE id = auth.uid() LIMIT 1)
    )
  )
)
WITH CHECK (
  meal_history_id IN (
    SELECT id FROM public.meal_history WHERE user_id IN (
      SELECT id FROM public.profiles WHERE household_name = (SELECT household_name FROM public.profiles WHERE id = auth.uid() LIMIT 1)
    )
  )
);
