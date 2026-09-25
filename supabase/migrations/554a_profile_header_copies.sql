-- 554a_profile_header_copies.sql — headers are COPIES, not links, 2026-09-25.
--
-- Kevin: "we need to copy the image they choose over to their profile … i don't
-- want an alias to the bot post because if it gets deleted at some point i don't
-- want a user's background image to fail to load."
--
-- So the set-profile-header edge function copies the chosen picture's file into
-- the member's own storage folder (<user_id>/profile-header-<ts>.<ext>, a
-- server-side storage copy, no pixel work) and stores THAT URL. Consequences:
--   • A source post being deleted, deactivated or made private no longer touches
--     anyone's header (554's clear-on-null trigger is dropped). Only an admin
--     QUARANTINE still clears headers made from that picture (moderation).
--   • The bot credit is stored on the member's row (header_credit_user_id), so it
--     survives the source post too.
--   • The only write path is the edge function (service role). 554's client RPCs
--     set_profile_header / clear_profile_header stored a link, so they're dropped.
--     Validation stays in SQL: header_source_check(), service-role only.
--   • Suggestions only offer Storage-hosted pictures (the ones we can copy).

-- ─── 1. Credit survives the source post ────────────────────────────────────
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS header_credit_user_id uuid REFERENCES public.users(id) ON DELETE SET NULL;

GRANT SELECT (header_credit_user_id) ON public.users TO anon, authenticated;

COMMENT ON COLUMN public.users.header_url IS
  'The member''s OWN copy of the header picture (set-profile-header edge fn), so it keeps loading if the source post is deleted.';
COMMENT ON COLUMN public.users.header_upload_id IS
  'The post the header was copied from (informational; ON DELETE SET NULL leaves the header in place).';
COMMENT ON COLUMN public.users.header_credit_user_id IS
  'Bot credited on a header copied from a bot post (migration 554a).';

-- ─── 2. Deleting / hiding the source no longer clears a header ─────────────
DROP TRIGGER IF EXISTS trg_clear_header_on_source_null ON public.users;
DROP FUNCTION IF EXISTS public.clear_header_fields_when_source_nulled();

-- Quarantine (admin red X) still clears every header copied from that picture.
CREATE OR REPLACE FUNCTION public.clear_headers_for_retired_upload()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.users
     SET header_upload_id = NULL,
         header_url = NULL,
         header_focal_y = 50,
         header_source = NULL,
         header_credit_user_id = NULL,
         header_set_at = NULL
   WHERE header_upload_id = NEW.id;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_clear_headers_for_retired_upload ON public.uploads;
CREATE TRIGGER trg_clear_headers_for_retired_upload
  AFTER UPDATE OF quarantined_at ON public.uploads
  FOR EACH ROW
  WHEN (OLD.quarantined_at IS NULL AND NEW.quarantined_at IS NOT NULL)
  EXECUTE FUNCTION public.clear_headers_for_retired_upload();

-- ─── 3. One write path: the edge function ──────────────────────────────────
DROP FUNCTION IF EXISTS public.set_profile_header(uuid, integer);
DROP FUNCTION IF EXISTS public.clear_profile_header();

-- The rules, in one place, for the edge function (service role) to call before
-- it copies anything. Returns {source, src_url, credit_user_id} or raises
-- 'header_not_allowed'. Allowed: the member's own dream (any privacy), or a
-- public, non-shadow post by a public bot; always an AI render, never an album
-- cover, never quarantined or deactivated, and Storage-hosted (copyable).
CREATE OR REPLACE FUNCTION public.header_source_check(p_user_id uuid, p_upload_id uuid)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_up record;
BEGIN
  SELECT up.id, up.user_id, up.is_public, up.shadow, up.quarantined_at, up.is_active,
         up.ai_prompt, up.media_count,
         COALESCE(up.image_url_display, up.image_url) AS url,
         o.is_bot AS owner_is_bot, o.is_public AS owner_is_public
    INTO v_up
  FROM public.uploads up
  JOIN public.users o ON o.id = up.user_id
  WHERE up.id = p_upload_id;

  IF NOT FOUND
     OR p_user_id IS NULL
     OR v_up.quarantined_at IS NOT NULL
     OR v_up.is_active IS FALSE
     OR v_up.ai_prompt IS NULL
     OR COALESCE(v_up.media_count, 1) > 1
     OR v_up.url IS NULL
     OR position('/storage/v1/object/public/' IN v_up.url) = 0 THEN
    RAISE EXCEPTION 'header_not_allowed' USING ERRCODE = '22023';
  END IF;

  IF v_up.user_id = p_user_id THEN
    RETURN jsonb_build_object('source', 'own', 'src_url', v_up.url, 'credit_user_id', NULL);
  END IF;

  IF v_up.owner_is_bot AND v_up.owner_is_public AND v_up.is_public AND NOT v_up.shadow THEN
    RETURN jsonb_build_object('source', 'bot', 'src_url', v_up.url, 'credit_user_id', v_up.user_id);
  END IF;

  RAISE EXCEPTION 'header_not_allowed' USING ERRCODE = '22023';
END;
$$;

REVOKE ALL ON FUNCTION public.header_source_check(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.header_source_check(uuid, uuid) TO service_role;

-- ─── 4. get_public_profile(): credit from the member's row ─────────────────
DROP FUNCTION IF EXISTS public.get_public_profile(uuid);

CREATE FUNCTION public.get_public_profile(p_user_id uuid)
RETURNS TABLE(
  id uuid, username text, display_name text, bio text, avatar_url text,
  is_public boolean, created_at timestamptz,
  post_count bigint, follower_count bigint, following_count bigint,
  is_following boolean, has_request boolean,
  header_url text, header_focal_y smallint, header_source text, header_upload_id uuid,
  header_credit_user_id uuid, header_credit_username text, header_credit_avatar_url text
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    u.id,
    u.username,
    u.display_name,
    u.bio,
    u.avatar_url,
    u.is_public,
    u.created_at,
    (SELECT COUNT(*) FROM public.uploads up
     WHERE up.user_id = u.id AND up.is_public = true) AS post_count,
    (SELECT COUNT(*) FROM public.follows f
     WHERE f.following_id = u.id
       AND NOT EXISTS (
         SELECT 1 FROM public.blocked_users b
         WHERE (b.blocker_id = auth.uid() AND b.blocked_id = f.follower_id)
            OR (b.blocker_id = f.follower_id AND b.blocked_id = auth.uid())
       )) AS follower_count,
    (SELECT COUNT(*) FROM public.follows f
     WHERE f.follower_id = u.id
       AND NOT EXISTS (
         SELECT 1 FROM public.blocked_users b
         WHERE (b.blocker_id = auth.uid() AND b.blocked_id = f.following_id)
            OR (b.blocker_id = f.following_id AND b.blocked_id = auth.uid())
       )) AS following_count,
    EXISTS (
      SELECT 1 FROM public.follows
      WHERE follower_id = auth.uid() AND following_id = u.id
    ) AS is_following,
    EXISTS (
      SELECT 1 FROM public.follow_requests
      WHERE requester_id = auth.uid() AND target_id = u.id
    ) AS has_request,
    u.header_url,
    u.header_focal_y,
    u.header_source,
    u.header_upload_id,
    cu.id AS header_credit_user_id,
    cu.username AS header_credit_username,
    cu.avatar_url AS header_credit_avatar_url
  FROM public.users u
  LEFT JOIN public.users cu
    ON u.header_source = 'bot' AND cu.id = u.header_credit_user_id
  WHERE u.id = p_user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users
      WHERE (blocker_id = p_user_id AND blocked_id = auth.uid())
         OR (blocker_id = auth.uid() AND blocked_id = p_user_id)
    );
$$;

GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO anon, authenticated;

-- ─── 5. Suggestions: only copyable (Storage-hosted) pictures ───────────────
CREATE OR REPLACE FUNCTION public.get_header_suggestions(
  p_source text DEFAULT 'bots',
  p_bot_id uuid DEFAULT NULL,
  p_limit integer DEFAULT 6,
  p_exclude uuid[] DEFAULT '{}'::uuid[]
)
RETURNS TABLE(
  upload_id uuid, image_url text,
  owner_id uuid, owner_username text, owner_avatar_url text,
  is_private boolean
)
LANGUAGE plpgsql VOLATILE SECURITY DEFINER  -- random(): must not be STABLE
SET search_path = ''
SET plan_cache_mode = force_custom_plan
AS $$
#variable_conflict use_column
DECLARE
  v_uid uuid := auth.uid();
  v_limit integer := LEAST(GREATEST(COALESCE(p_limit, 6), 1), 24);
  v_exclude uuid[] := COALESCE(p_exclude, '{}'::uuid[]);
BEGIN
  IF v_uid IS NULL THEN
    RETURN;
  END IF;

  IF p_source = 'me' THEN
    RETURN QUERY
      SELECT up.id, COALESCE(up.image_url_display, up.image_url),
             u.id, u.username, u.avatar_url, NOT up.is_public
      FROM public.uploads up
      JOIN public.users u ON u.id = up.user_id
      WHERE up.user_id = v_uid
        AND up.quarantined_at IS NULL
        AND up.is_active IS NOT FALSE
        AND up.ai_prompt IS NOT NULL
        AND COALESCE(up.media_count, 1) <= 1
        AND position('/storage/v1/object/public/' IN COALESCE(up.image_url_display, up.image_url, '')) > 0
        AND NOT (up.id = ANY (v_exclude))
      ORDER BY random()
      LIMIT v_limit;
  ELSIF p_source = 'bots' OR (p_source = 'bot' AND p_bot_id IS NOT NULL) THEN
    RETURN QUERY
      SELECT up.id, COALESCE(up.image_url_display, up.image_url),
             u.id, u.username, u.avatar_url, false
      FROM public.uploads up
      JOIN public.users u ON u.id = up.user_id
      WHERE u.is_bot = true
        AND u.is_public = true
        AND (p_source = 'bots' OR u.id = p_bot_id)
        AND up.is_public = true
        AND up.shadow = false
        AND up.quarantined_at IS NULL
        AND up.is_active IS NOT FALSE
        AND up.ai_prompt IS NOT NULL
        AND COALESCE(up.media_count, 1) <= 1
        AND position('/storage/v1/object/public/' IN COALESCE(up.image_url_display, up.image_url, '')) > 0
        AND NOT (up.id = ANY (v_exclude))
      ORDER BY random()
      LIMIT v_limit;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.get_header_suggestions(text, uuid, integer, uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_header_suggestions(text, uuid, integer, uuid[]) TO authenticated;
