-- 558_search_scopes_and_random_posts.sql — scoped search + a random draw of any
-- profile's posts (ALBUM_DISCOVERY_PLAN.md, phase 1). 2026-09-26.
--
-- Both return SETOF public.uploads so the app can embed its usual POST_SELECT and page
-- with .order()/.range() on top: supabase.rpc('search_dreams', …).select(POST_SELECT).
--
-- search_dreams(p_query, p_scope, p_medium, p_vibe)
--   p_scope: 'all'    — bots' + members' public posts, plus your own dreams (private too)
--            'mine'   — your own dreams only, private included
--            'bots'   — bots' public posts
--            'people' — members' public posts
--   NEVER matches people's physical characteristics (Kevin 2026-09-26): bots match their
--   stored search_tsv (full prompts: fictional characters); members' dreams match
--   public.member_search_tsv(description, medium, vibe) computed from the row, never any
--   stored engine text (migration 557).
--   SECURITY DEFINER, with the uploads SELECT policies applied by hand, because row-level
--   security stops Postgres using either search index (it won't run the match before the
--   policy checks: 0.5-1.3 s and ~160k buffers per search on 2026-09-26). The rule, same
--   as the policies: your own rows; public posts of public accounts; public posts of
--   private accounts you follow; nothing from anyone blocked either way. Quarantined
--   renders never match.
--
-- get_random_posts(p_user_id, p_limit, p_exclude) — a random set of one profile's public
--   posts (the 🎲 on bot profiles), skipping the ids on screen. Singles only. INVOKER, so
--   a private account's posts stay visible only to its followers.

DROP FUNCTION IF EXISTS public.bot_user_ids();
DROP FUNCTION IF EXISTS public.is_bot_user(uuid);

DROP FUNCTION IF EXISTS public.search_dreams(text, text, text, text);
CREATE FUNCTION public.search_dreams(
  p_query text,
  p_scope text DEFAULT 'all',
  p_medium text DEFAULT NULL,
  p_vibe text DEFAULT NULL
)
RETURNS SETOF public.uploads
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
SET plan_cache_mode = force_custom_plan
AS $$
#variable_conflict use_column
DECLARE
  v_uid uuid := auth.uid();
  v_scope text := COALESCE(p_scope, 'all');
  v_tsq tsquery;
BEGIN
  IF v_uid IS NULL OR p_query IS NULL OR length(trim(p_query)) < 2 THEN
    RETURN;
  END IF;
  -- Same shape the app used before: every word must match, the last one as a prefix.
  SELECT to_tsquery('english', string_agg(
           CASE WHEN ord = cnt THEN quote_literal(w) || ':*' ELSE quote_literal(w) END, ' & '
           ORDER BY ord))
    INTO v_tsq
    FROM (
      SELECT w, ord, count(*) OVER () AS cnt
      FROM unnest(regexp_split_to_array(
             regexp_replace(lower(trim(p_query)), '[^[:alnum:][:space:]]', ' ', 'g'),
             '\s+')) WITH ORDINALITY AS t(w, ord)
      WHERE w <> ''
    ) words;
  IF v_tsq IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
    -- Bots' public posts: the stored, indexed search_tsv.
    SELECT up.*
    FROM public.uploads up
    JOIN public.users au ON au.id = up.user_id
    WHERE v_scope IN ('all', 'bots')
      AND up.search_tsv @@ v_tsq
      AND up.is_public
      AND au.is_bot
      AND (au.is_public OR EXISTS (SELECT 1 FROM public.follows f
                                    WHERE f.follower_id = v_uid AND f.following_id = up.user_id))
      AND NOT EXISTS (SELECT 1 FROM public.blocked_users b
                       WHERE (b.blocker_id = up.user_id AND b.blocked_id = v_uid)
                          OR (b.blocker_id = v_uid AND b.blocked_id = up.user_id))
      AND up.quarantined_at IS NULL
      AND up.is_active IS NOT FALSE
      AND (p_medium IS NULL OR up.dream_medium = p_medium)
      AND (p_vibe IS NULL OR up.dream_vibe = p_vibe)
    UNION ALL
    -- Your own dreams, private included: an index read of your rows.
    SELECT up.*
    FROM public.uploads up
    WHERE v_scope IN ('all', 'mine')
      AND up.user_id = v_uid
      AND public.member_search_tsv(up.description, up.dream_medium, up.dream_vibe) @@ v_tsq
      AND up.quarantined_at IS NULL
      AND up.is_active IS NOT FALSE
      AND (p_medium IS NULL OR up.dream_medium = p_medium)
      AND (p_vibe IS NULL OR up.dream_vibe = p_vibe)
    UNION ALL
    -- Other members' public posts: the person-free expression index (558a).
    SELECT up.*
    FROM public.uploads up
    JOIN public.users au ON au.id = up.user_id
    WHERE v_scope IN ('all', 'people')
      AND public.member_search_tsv(up.description, up.dream_medium, up.dream_vibe) @@ v_tsq
      AND up.is_public
      AND up.user_id <> v_uid
      AND NOT au.is_bot
      AND (au.is_public OR EXISTS (SELECT 1 FROM public.follows f
                                    WHERE f.follower_id = v_uid AND f.following_id = up.user_id))
      AND NOT EXISTS (SELECT 1 FROM public.blocked_users b
                       WHERE (b.blocker_id = up.user_id AND b.blocked_id = v_uid)
                          OR (b.blocker_id = v_uid AND b.blocked_id = up.user_id))
      AND up.quarantined_at IS NULL
      AND up.is_active IS NOT FALSE
      AND (p_medium IS NULL OR up.dream_medium = p_medium)
      AND (p_vibe IS NULL OR up.dream_vibe = p_vibe);
END;
$$;

REVOKE ALL ON FUNCTION public.search_dreams(text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.search_dreams(text, text, text, text) TO authenticated;

DROP FUNCTION IF EXISTS public.get_random_posts(uuid, integer, uuid[]);
CREATE FUNCTION public.get_random_posts(
  p_user_id uuid,
  p_limit integer DEFAULT 12,
  p_exclude uuid[] DEFAULT '{}'::uuid[]
)
RETURNS SETOF public.uploads
LANGUAGE plpgsql
VOLATILE -- random()
SECURITY INVOKER
SET search_path = ''
SET plan_cache_mode = force_custom_plan
AS $$
#variable_conflict use_column
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;
  RETURN QUERY
    SELECT up.*
    FROM public.uploads up
    WHERE up.user_id = p_user_id
      AND up.is_public
      AND up.quarantined_at IS NULL
      AND up.is_active IS NOT FALSE
      AND COALESCE(up.media_count, 1) <= 1
      AND NOT (up.id = ANY (COALESCE(p_exclude, '{}'::uuid[])))
    ORDER BY random()
    LIMIT LEAST(GREATEST(COALESCE(p_limit, 12), 1), 48);
END;
$$;

REVOKE ALL ON FUNCTION public.get_random_posts(uuid, integer, uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_random_posts(uuid, integer, uuid[]) TO authenticated;
