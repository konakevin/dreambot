-- Add is_public column to dream_mediums.
-- is_active = medium works (directive configured, can be used by bots/edge functions)
-- is_public = medium shows in the user-facing medium picker UI
-- Bot-only mediums: is_active = true, is_public = false (e.g. aura for MuseBot)

ALTER TABLE public.dream_mediums
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true;

-- Set aura to active but not public (bot-only)
UPDATE public.dream_mediums
  SET is_active = true, is_public = false
  WHERE key = 'aura';

-- Update get_dream_mediums RPC to filter on is_public
-- (bots bypass this RPC and pass medium_key directly to the Edge Function)
DROP FUNCTION IF EXISTS public.get_dream_mediums();

CREATE FUNCTION public.get_dream_mediums()
RETURNS TABLE (
  key text,
  label text,
  directive text,
  flux_fragment text,
  sort_order integer,
  is_scene_only boolean,
  is_character_only boolean,
  nightly_skip boolean,
  face_swaps boolean
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    key, label, directive, flux_fragment, sort_order,
    is_scene_only, is_character_only, nightly_skip, face_swaps
  FROM public.dream_mediums
  WHERE is_active = true AND is_public = true
  ORDER BY sort_order, label;
$$;

GRANT EXECUTE ON FUNCTION public.get_dream_mediums() TO anon, authenticated, service_role;
