-- 208: get_public_vibe_summary RPC — sanitized cross-user vibe peek.
--
-- The own-profile peek reads user_recipes.recipe directly because RLS
-- (migration 050) allows owners to read their own row. For OTHER users'
-- profiles, that row is invisible. This RPC exposes only the public-safe
-- slice of the recipe — aesthetics + art_styles, both interpretations of
-- the user's curated taste signals — so the same VibeProfilePeek
-- component can render on public profile screens.
--
-- Intentionally NOT returned:
--   * dream_seeds (personal anchors — places + objects + characters)
--   * dream_cast (real face photos — extra-private)
--   * moods (private mood slider settings)
--   * avoid (private content preferences)
--   * dream_wish
--
-- Blocked-user check mirrors get_public_profile (migration 116): if
-- either party has blocked the other, the function returns no rows.

BEGIN;

CREATE OR REPLACE FUNCTION public.get_public_vibe_summary(p_user_id uuid)
RETURNS TABLE (
  aesthetics  text[],
  art_styles  text[]
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    COALESCE(
      ARRAY(SELECT jsonb_array_elements_text(r.recipe->'aesthetics')),
      ARRAY[]::text[]
    ) AS aesthetics,
    COALESCE(
      ARRAY(SELECT jsonb_array_elements_text(r.recipe->'art_styles')),
      ARRAY[]::text[]
    ) AS art_styles
  FROM public.user_recipes r
  WHERE r.user_id = p_user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users
      WHERE (blocker_id = p_user_id AND blocked_id = auth.uid())
         OR (blocker_id = auth.uid() AND blocked_id = p_user_id)
    );
$$;

GRANT EXECUTE ON FUNCTION public.get_public_vibe_summary(uuid) TO authenticated, anon;

COMMIT;
