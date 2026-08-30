-- 449_quarantine_bad_renders.sql (2026-08-30)
--
-- "Report as bad render" quarantine, replacing the admin one-tap HARD delete with
-- a soft-quarantine. A flagged render is hidden from every user-facing surface but
-- the row + image + all metadata (ai_prompt, dream_medium, model, face_swap_mode)
-- and its linked ai_generation_log (rolled_axes / fallback_reasons) SURVIVE — so
-- bad renders pool into a queryable set for later pool-quality trend analysis
-- (which mediums / models / nightly paths / fallback_reasons produce junk).
--
-- Hiding strategy: quarantine flips is_public → false, which the 7 surfaces that
-- already filter `is_public = true` (get_feed, search, both profile grids, album
-- context, user-context feed) exclude for free — NO edit to the code-red get_feed
-- RPC. The 5 surfaces that DON'T filter is_public get an explicit
-- `quarantined_at IS NULL` in the client (useMyDreams private album, useAlbumPosts
-- by-IDs, useUserContextFeed target, usePost) + get_shared_post here (web link).
--
-- Analysis later:
--   SELECT u.dream_medium, u.model, u.face_swap_mode,
--          l.rolled_axes->>'nightlyPath' AS path, l.fallback_reasons, count(*)
--   FROM public.uploads u
--   LEFT JOIN public.ai_generation_log l ON l.job_id = u.job_id
--   WHERE u.quarantined_at IS NOT NULL
--   GROUP BY 1,2,3,4,5 ORDER BY count(*) DESC;
--
-- Run in the Supabase dashboard SQL editor.

BEGIN;

-- 1. The bad-render pool markers. null quarantined_at = live.
ALTER TABLE public.uploads
  ADD COLUMN IF NOT EXISTS quarantined_at    timestamptz,
  ADD COLUMN IF NOT EXISTS quarantine_reason text;

-- uploads uses COLUMN-LEVEL grants — a new column is invisible to the client until
-- granted. Grant SELECT so the client can filter `quarantined_at IS NULL`. NO
-- UPDATE grant: only the admin RPC (SECURITY DEFINER) may write it, so a
-- non-admin can never un-quarantine or self-quarantine another's post.
GRANT SELECT (quarantined_at, quarantine_reason) ON public.uploads TO anon, authenticated;

-- 2. Partial index for the analysis queries (only the quarantined rows).
CREATE INDEX IF NOT EXISTS idx_uploads_quarantined
  ON public.uploads (quarantined_at)
  WHERE quarantined_at IS NOT NULL;

-- 3. The quarantine action. Admin-gated (mirrors admin_delete_upload's guard).
--    Soft: flips is_public off (hides from every is_public-filtered surface) +
--    stamps the pool markers. Row + storage stay. admin_delete_upload (099) is
--    kept for genuine hard deletes.
CREATE OR REPLACE FUNCTION public.admin_quarantine_upload(
  p_upload_id uuid,
  p_reason    text DEFAULT 'bad_render'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.uploads
     SET quarantined_at    = now(),
         quarantine_reason = COALESCE(p_reason, 'bad_render'),
         is_public         = false
   WHERE id = p_upload_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_quarantine_upload(uuid, text) TO authenticated;

-- 4. get_shared_post (web deep-link + in-app share) checks the AUTHOR's is_public
--    and the upload's posted_at, NOT the upload's is_public — so the flag-flip
--    above wouldn't hide a quarantined post here. Redefine with the explicit
--    exclusion (migration 368 body verbatim + the one new clause).
DROP FUNCTION IF EXISTS public.get_shared_post(uuid);

CREATE FUNCTION public.get_shared_post(p_id uuid)
RETURNS TABLE (
  id                uuid,
  user_id           uuid,
  image_url         text,
  image_url_hq      text,
  image_url_display text,
  thumbhash         text,
  caption           text,
  created_at        timestamptz,
  comment_count     integer,
  like_count        integer,
  dream_medium      text,
  dream_vibe        text,
  model             text,
  is_public         boolean,
  posted_at         timestamptz,
  description       text,
  username          text,
  avatar_url        text,
  allow_reposts     boolean,
  media             jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    up.id,
    up.user_id,
    up.image_url,
    up.image_url_hq,
    up.image_url_display,
    up.thumbhash,
    up.caption,
    up.created_at,
    up.comment_count,
    up.like_count,
    up.dream_medium,
    up.dream_vibe,
    up.model,
    up.is_public,
    up.posted_at,
    up.description,
    us.username,
    us.avatar_url,
    us.allow_reposts,
    (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
               'url', m.image_url, 'display', m.image_url_display,
               'hq', m.image_url_hq, 'thumbhash', m.thumbhash,
               'width', m.width, 'height', m.height) ORDER BY m.position), '[]'::jsonb)
      FROM public.upload_media m WHERE m.upload_id = up.id
    ) AS media
  FROM public.uploads up
  JOIN public.users us ON us.id = up.user_id
  WHERE up.id = p_id
    AND up.posted_at IS NOT NULL
    AND up.quarantined_at IS NULL   -- hide quarantined bad renders from share links
    AND (up.is_moderated = false OR up.is_approved = true)
    AND us.is_public = true
    AND NOT EXISTS (
      SELECT 1
      FROM public.blocked_users b
      WHERE (b.blocker_id = up.user_id AND b.blocked_id = auth.uid())
         OR (b.blocker_id = auth.uid()  AND b.blocked_id = up.user_id)
    );
$$;

GRANT EXECUTE ON FUNCTION public.get_shared_post(uuid) TO anon, authenticated;

COMMIT;
