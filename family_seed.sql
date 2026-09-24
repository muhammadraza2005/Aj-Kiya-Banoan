ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

INSERT INTO public.profiles (id, display_name, household_name) VALUES 
('11111111-1111-1111-1111-111111111111', 'Ammi', 'Hamara Ghar'),
('22222222-2222-2222-2222-222222222222', 'Abu', 'Hamara Ghar'),
('33333333-3333-3333-3333-333333333333', 'Beta', 'Hamara Ghar'),
('44444444-4444-4444-4444-444444444444', 'Beti', 'Hamara Ghar')
ON CONFLICT (id) DO NOTHING;
