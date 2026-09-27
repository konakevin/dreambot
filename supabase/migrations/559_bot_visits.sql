-- 559_bot_visits.sql — keep track of bots (ALBUM_DISCOVERY_PLAN.md, phase 2).
-- 2026-09-26.
--
-- "Seen" = post_impressions: a post you looked at full size (Home feed, Bots tab, or opened
-- on its own), recorded by record_impression with a dwell timer, kept forever, back to
-- 2026-04-11. The app can't read that table (insert/update policies only), so everything
-- here is SECURITY DEFINER and filtered to auth.uid().
--
-- bot_visits: when you last visited each bot (its profile, or its page in the Bots tab).
--   ONE foreign key to users (user_id) on purpose: a second FK between this table and
--   users would make un-hinted PostgREST embeds of the pair ambiguous (the 2026-09-25
--   outage, migration 555). bot_id is a plain uuid.
--
-- get_bot_new_counts()          → per public bot: posts since your last visit that you
--                                 haven't already seen. First call seeds every bot at now(),
--                                 so everyone starts at zero instead of "3,600 new".
-- mark_bot_visited(p_bot_id)    → you just left that bot: its count resets.
-- get_bot_visit(p_bot_id)       → your last visit (the "You're caught up" line) and the ids of
--                                 posts since then that you haven't seen (the NEW marks). Only
--                                 looks at posts newer than the visit. (A seen/total "Explorer"
--                                 progress card was built and removed, Kevin 2026-09-26: too much.)
-- get_bot_unseen_posts(p_bot_id)→ the bot's public posts you haven't seen (Haven't seen),
--                                 SETOF uploads so the app pages it with .order()/.range().

CREATE TABLE IF NOT EXISTS public.bot_visits (
  user_id         uuid NOT NULL DEFAULT auth.uid() REFERENCES public.users(id) ON DELETE CASCADE,
  bot_id          uuid NOT NULL,
  last_visited_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, bot_id)
);

ALTER TABLE public.bot_visits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bot_visits_own ON public.bot_visits;
CREATE POLICY bot_visits_own ON public.bot_visits
  FOR SELECT TO authenticated USING (user_id = auth.uid());
REVOKE ALL ON public.bot_visits FROM anon, authenticated;
GRANT SELECT ON public.bot_visits TO authenticated;

-- A bot's posts that count: public, not quarantined, active.
-- (shadow posts are never public — verified 2026-09-26 — so no shadow filter needed.)

DROP FUNCTION IF EXISTS public.get_bot_new_counts();
CREATE FUNCTION public.get_bot_new_counts()
RETURNS TABLE (bot_id uuid, new_count integer)
LANGUAGE plpgsql
VOLATILE -- seeds missing visit rows
SECURITY DEFINER
SET search_path = ''
SET plan_cache_mode = force_custom_plan
AS $$
#variable_conflict use_column
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RETURN;
  END IF;
  INSERT INTO public.bot_visits (user_id, bot_id, last_visited_at)
  SELECT v_uid, b.id, now()
  FROM public.users b
  WHERE b.is_bot AND b.is_public
  ON CONFLICT (user_id, bot_id) DO NOTHING;

  RETURN QUERY
    SELECT v.bot_id,
           (SELECT count(*)::integer
              FROM public.uploads up
             WHERE up.user_id = v.bot_id
               AND up.is_public
               AND up.quarantined_at IS NULL
               AND up.is_active IS NOT FALSE
               AND up.posted_at > v.last_visited_at
               AND NOT EXISTS (
                     SELECT 1 FROM public.post_impressions pi
                      WHERE pi.user_id = v_uid AND pi.upload_id = up.id))
    FROM public.bot_visits v
    JOIN public.users b ON b.id = v.bot_id AND b.is_bot AND b.is_public
    WHERE v.user_id = v_uid;
END;
$$;

DROP FUNCTION IF EXISTS public.mark_bot_visited(uuid);
CREATE FUNCTION public.mark_bot_visited(p_bot_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL OR p_bot_id IS NULL THEN
    RETURN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.users b WHERE b.id = p_bot_id AND b.is_bot) THEN
    RETURN;
  END IF;
  INSERT INTO public.bot_visits (user_id, bot_id, last_visited_at)
  VALUES (v_uid, p_bot_id, now())
  ON CONFLICT (user_id, bot_id) DO UPDATE SET last_visited_at = EXCLUDED.last_visited_at;
END;
$$;

DROP FUNCTION IF EXISTS public.get_bot_explorer(uuid);
DROP FUNCTION IF EXISTS public.get_bot_visit(uuid);
CREATE FUNCTION public.get_bot_visit(p_bot_id uuid)
RETURNS TABLE (last_visited_at timestamptz, new_ids uuid[])
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
SET plan_cache_mode = force_custom_plan
AS $$
#variable_conflict use_column
DECLARE
  v_uid uuid := auth.uid();
  v_last timestamptz;
BEGIN
  IF v_uid IS NULL OR p_bot_id IS NULL THEN
    RETURN;
  END IF;
  -- Definer function: only ever read a PUBLIC BOT account's posts.
  IF NOT EXISTS (SELECT 1 FROM public.users b WHERE b.id = p_bot_id AND b.is_bot AND b.is_public) THEN
    RETURN;
  END IF;
  SELECT v.last_visited_at INTO v_last
    FROM public.bot_visits v WHERE v.user_id = v_uid AND v.bot_id = p_bot_id;

  RETURN QUERY
    SELECT v_last,
           COALESCE((
             SELECT array_agg(n.id)
               FROM (SELECT up.id
                       FROM public.uploads up
                      WHERE v_last IS NOT NULL
                        AND up.user_id = p_bot_id
                        AND up.is_public
                        AND up.quarantined_at IS NULL
                        AND up.is_active IS NOT FALSE
                        AND up.posted_at > v_last
                        AND NOT EXISTS (SELECT 1 FROM public.post_impressions pi
                                         WHERE pi.user_id = v_uid AND pi.upload_id = up.id)
                      ORDER BY up.posted_at DESC
                      LIMIT 200) n
           ), '{}'::uuid[]);
END;
$$;

DROP FUNCTION IF EXISTS public.get_bot_unseen_posts(uuid);
CREATE FUNCTION public.get_bot_unseen_posts(p_bot_id uuid)
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
BEGIN
  IF v_uid IS NULL OR p_bot_id IS NULL THEN
    RETURN;
  END IF;
  -- Definer function: only ever read a PUBLIC BOT account's posts.
  IF NOT EXISTS (SELECT 1 FROM public.users b WHERE b.id = p_bot_id AND b.is_bot AND b.is_public) THEN
    RETURN;
  END IF;
  RETURN QUERY
    SELECT up.*
      FROM public.uploads up
     WHERE up.user_id = p_bot_id
       AND up.is_public
       AND up.quarantined_at IS NULL
       AND up.is_active IS NOT FALSE
       AND NOT EXISTS (
             SELECT 1 FROM public.post_impressions pi
              WHERE pi.user_id = v_uid AND pi.upload_id = up.id);
END;
$$;

REVOKE ALL ON FUNCTION public.get_bot_new_counts() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.mark_bot_visited(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_bot_visit(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_bot_unseen_posts(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_bot_new_counts() TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_bot_visited(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_bot_visit(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_bot_unseen_posts(uuid) TO authenticated;
