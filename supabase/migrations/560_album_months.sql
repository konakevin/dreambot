-- 560_album_months.sql — the months of an album, for the timeline scrubber and the months
-- view (ALBUM_DISCOVERY_PLAN.md, phase 3). 2026-09-26.
--
-- get_album_months(p_user_id, p_scope) → one row per month, newest first:
--   month         first day of the month (UTC)
--   post_count    everything in that month
--   pinned_count  how many of those are pinned (they float to the top in newest-first
--                 grids, so the app subtracts them when working out where a month starts)
--   cover_url     the newest image of the month
--
-- p_scope mirrors each grid's query EXACTLY, so "month starts at item N" lines up:
--   'dreams_all' / 'dreams_private' / 'dreams_posted' → useMyDreams (own only:
--       album_ref_count = 0, not quarantined; posted = public), dated by created_at, except
--       'dreams_posted', which is dated by posted_at like its grid
--   'posts' → useUserPosts / usePublicProfilePosts (public posts), dated by posted_at
--
-- SECURITY INVOKER: the caller's row-level security applies, so a private account's
-- months are visible only to its followers, and private dreams only to their owner.

DROP FUNCTION IF EXISTS public.get_album_months(uuid, text);
CREATE FUNCTION public.get_album_months(p_user_id uuid, p_scope text)
RETURNS TABLE (month date, post_count integer, pinned_count integer, cover_url text)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = ''
SET plan_cache_mode = force_custom_plan
AS $$
#variable_conflict use_column
DECLARE
  v_by_posted boolean := p_scope IN ('dreams_posted', 'posts');
BEGIN
  IF auth.uid() IS NULL OR p_user_id IS NULL THEN
    RETURN;
  END IF;
  IF p_scope LIKE 'dreams_%' AND p_user_id <> auth.uid() THEN
    RETURN;
  END IF;

  RETURN QUERY
    WITH rows AS (
      SELECT CASE WHEN v_by_posted THEN up.posted_at ELSE up.created_at END AS k,
             (v_by_posted AND up.pinned_at IS NOT NULL) AS pinned,
             COALESCE(up.image_url_display, up.image_url) AS img
        FROM public.uploads up
       WHERE up.user_id = p_user_id
         AND CASE p_scope
               WHEN 'dreams_all'     THEN up.album_ref_count = 0 AND up.quarantined_at IS NULL
               WHEN 'dreams_private' THEN up.album_ref_count = 0 AND up.quarantined_at IS NULL
                                          AND NOT up.is_public
               WHEN 'dreams_posted'  THEN up.album_ref_count = 0 AND up.quarantined_at IS NULL
                                          AND up.is_public
               WHEN 'posts'          THEN up.is_public
               ELSE false
             END
    )
    SELECT (date_trunc('month', r.k AT TIME ZONE 'UTC'))::date,
           count(*)::integer,
           (count(*) FILTER (WHERE r.pinned))::integer,
           (array_agg(r.img ORDER BY r.k DESC))[1]
      FROM rows r
     WHERE r.k IS NOT NULL
     GROUP BY 1
     ORDER BY 1 DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_album_months(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_album_months(uuid, text) TO authenticated;
