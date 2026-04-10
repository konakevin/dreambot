-- Fix user_recipes SELECT policy: restrict to own rows (was USING (true))
DROP POLICY IF EXISTS "Service role reads all recipes" ON public.user_recipes;
CREATE POLICY "Users read own recipes" ON public.user_recipes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role reads all recipes" ON public.user_recipes
  FOR SELECT TO service_role USING (true);
