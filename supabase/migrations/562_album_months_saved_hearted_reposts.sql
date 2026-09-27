-- 562_album_months_saved_hearted_reposts.sql — the months view (calendar button) on the
-- Saved, Hearted and Reposts albums (ALBUM_DISCOVERY_PLAN.md). 2026-09-26.
--
-- get_album_months (migration 560) gains three scopes. These albums sort by when YOU saved,
-- hearted or reposted, so their months bucket by that same date (not the post's):
--   'saved'   → useFavoritePosts: favorites.created_at            (own only)
--   'hearted' → useLikedPosts:    likes.created_at                (own only; likes are
--                                  readable by everyone, so the function refuses others')
--   'reposts' → useUserReposts:   post_reposts.last_reposted_at   (active rows; anyone's,
--                                  reposts are public)
-- Each joins uploads under the caller's row-level security, exactly like its grid (the grid
-- drops rows whose upload you can't see), so a month tile's count equals its month album.
--
-- Signature and return shape unchanged, so CREATE OR REPLACE; the old scopes are verbatim.

CREATE OR REPLACE FUNCTION public.get_album_months(p_user_id uuid, p_scope text)
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
  IF (p_scope LIKE 'dreams_%' OR p_scope IN ('saved', 'hearted')) AND p_user_id <> auth.uid() THEN
    RETURN;
  END IF;

  IF p_scope IN ('saved', 'hearted', 'reposts') THEN
    RETURN QUERY
      WITH rows AS (
        SELECT f.created_at AS k, COALESCE(up.image_url_display, up.image_url) AS img
          FROM public.favorites f
          JOIN public.uploads up ON up.id = f.upload_id
         WHERE p_scope = 'saved' AND f.user_id = p_user_id
        UNION ALL
        SELECT l.created_at, COALESCE(up.image_url_display, up.image_url)
          FROM public.likes l
          JOIN public.uploads up ON up.id = l.upload_id
         WHERE p_scope = 'hearted' AND l.user_id = p_user_id
        UNION ALL
        SELECT r.last_reposted_at, COALESCE(up.image_url_display, up.image_url)
          FROM public.post_reposts r
          JOIN public.uploads up ON up.id = r.upload_id
         WHERE p_scope = 'reposts' AND r.reposter_id = p_user_id AND r.active
      )
      SELECT (date_trunc('month', r.k AT TIME ZONE 'UTC'))::date,
             count(*)::integer,
             0,
             (array_agg(r.img ORDER BY r.k DESC))[1]
        FROM rows r
       WHERE r.k IS NOT NULL
       GROUP BY 1
       ORDER BY 1 DESC;
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
