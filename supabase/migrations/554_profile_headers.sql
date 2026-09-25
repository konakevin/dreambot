-- 554_profile_headers.sql — Dreamscape profile headers, 2026-09-25.
--
-- A profile can show a header image: a tall "Dreamscape" banner that fades into
-- the page, with the avatar + name in the fade. Kevin's rules (design pages:
-- claude.ai/artifact/XeKGdGR8tZkVbkvcTBDmVJ + /YRez3WV4PPdAvxgWSM4R34):
--   • A header is ONLY ever one of the member's own dreams or a public bot post.
--     No phone uploads, so every possible header is an image our pipeline made
--     and no new image moderation is needed.
--   • The picker offers one source at a time (You / All bots / one bot) and a
--     quick random draw of six; Shuffle draws again.
--   • The member drags to set a focal point, stored as 0..100 (CSS
--     object-position Y; expo-image contentPosition {top:'N%'} uses the same math).
--   • Headers ship dark behind engine_config.profile_headers_enabled.
--
-- Writes go ONLY through set_profile_header / clear_profile_header (SECURITY
-- DEFINER). users uses column-level grants (migration 278) and there is no
-- table-level UPDATE for anon/authenticated, so the new columns are client-
-- READABLE (granted below) but not client-writable.
--
-- If a source post is quarantined, deactivated or deleted, or a bot post goes
-- private, every header pointing at it clears itself (trigger below), and the
-- profile falls back to the compact layout.
--
-- Rollback: UPDATE public.engine_config SET profile_headers_enabled = false;
-- (the app then ignores headers). Full removal: drop the functions, triggers
-- and columns added here.

-- ─── 1. Columns ────────────────────────────────────────────────────────────
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS header_upload_id uuid REFERENCES public.uploads(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS header_url text,
  ADD COLUMN IF NOT EXISTS header_focal_y smallint NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS header_source text,
  ADD COLUMN IF NOT EXISTS header_set_at timestamptz;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_header_focal_y_range') THEN
    ALTER TABLE public.users
      ADD CONSTRAINT users_header_focal_y_range CHECK (header_focal_y BETWEEN 0 AND 100);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_header_source_kind') THEN
    ALTER TABLE public.users
      ADD CONSTRAINT users_header_source_kind CHECK (header_source IS NULL OR header_source IN ('own', 'bot'));
  END IF;
END $$;

-- The FK's ON DELETE SET NULL looks rows up by header_upload_id on every
-- uploads delete; keep that a tiny index probe.
CREATE INDEX IF NOT EXISTS idx_users_header_upload
  ON public.users (header_upload_id)
  WHERE header_upload_id IS NOT NULL;

GRANT SELECT (header_upload_id, header_url, header_focal_y, header_source, header_set_at)
  ON public.users TO anon, authenticated;

COMMENT ON COLUMN public.users.header_upload_id IS
  'Profile header source post (own dream or public bot post). Set only via set_profile_header (migration 554).';
COMMENT ON COLUMN public.users.header_url IS
  'Display URL copied from the source post, so a private own dream never has to be readable to show the header.';
COMMENT ON COLUMN public.users.header_focal_y IS
  'Header crop position 0..100, CSS object-position Y semantics.';

-- ─── 2. Feature flag ───────────────────────────────────────────────────────
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS profile_headers_enabled boolean NOT NULL DEFAULT false;

-- get_engine_config(): the live migration-425 field set, verbatim, plus the flag.
CREATE OR REPLACE FUNCTION public.get_engine_config()
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'base_sparkle_cost',        base_sparkle_cost,
    'welcome_sparkle_bonus',    welcome_sparkle_bonus,
    'pro_trial_days',           pro_trial_days,
    'prompt_max_length',        prompt_max_length,
    'photo_preprocess_width',   photo_preprocess_width,
    'photo_preprocess_quality', photo_preprocess_quality,
    'self_ref_regex',           self_ref_regex,
    'relationship_regex',       relationship_regex,
    'relationship_words',       relationship_words,
    'pet_words',                pet_words,
    'min_app_version',          min_app_version,
    'latest_app_version',       latest_app_version,
    'gifting_enabled',          gifting_enabled,
    'gift_max_per_send',        gift_max_per_send,
    'gift_max_per_day',         gift_max_per_day,
    'gift_message_max_len',     gift_message_max_len,
    'new_scene_max_people',     new_scene_max_people,
    'new_scene_price_standard', new_scene_price_standard,
    'new_scene_price_best',     new_scene_price_best,
    'max_inflight_dreams_per_user', max_inflight_dreams_per_user,
    'profile_headers_enabled',  profile_headers_enabled
  )
  FROM public.engine_config
  WHERE id = 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_engine_config() TO authenticated, anon;

-- ─── 3. get_public_profile(): + header fields ──────────────────────────────
-- Body is the live definition verbatim; new trailing columns carry the header
-- and, for a header taken from a bot post, the bot to credit. RETURNS TABLE
-- changes shape, so DROP first (42P13).
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
  LEFT JOIN public.uploads hu
    ON u.header_source = 'bot' AND hu.id = u.header_upload_id
  LEFT JOIN public.users cu
    ON cu.id = hu.user_id
  WHERE u.id = p_user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users
      WHERE (blocker_id = p_user_id AND blocked_id = auth.uid())
         OR (blocker_id = auth.uid() AND blocked_id = p_user_id)
    );
$$;

GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO anon, authenticated;

-- ─── 4. get_header_suggestions(): the picker's random draw ──────────────────
-- p_source: 'me' (your own dreams, private ones included), 'bots' (every public
-- bot), or 'bot' with p_bot_id. Only AI renders qualify (ai_prompt present), and
-- album covers are skipped (their members are their own rows). p_exclude lets
-- Shuffle avoid handing back the set already on screen.
-- plpgsql + force_custom_plan: 'bots' vs 'bot' is an optional filter (CLAUDE.md
-- hard rule), and #variable_conflict because it RETURNS TABLE (mig 493).
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
        AND COALESCE(up.image_url_display, up.image_url) IS NOT NULL
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
        AND COALESCE(up.image_url_display, up.image_url) IS NOT NULL
        AND NOT (up.id = ANY (v_exclude))
      ORDER BY random()
      LIMIT v_limit;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.get_header_suggestions(text, uuid, integer, uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_header_suggestions(text, uuid, integer, uuid[]) TO authenticated;

-- ─── 5. set_profile_header() / clear_profile_header() ──────────────────────
-- The only write path. Allowed sources: the caller's own dream (any privacy),
-- or a public, non-shadow post by a public bot. Always an AI render, never an
-- album cover, never quarantined or deactivated. Re-calling with the same post
-- and a new focal point just moves the crop.
CREATE OR REPLACE FUNCTION public.set_profile_header(
  p_upload_id uuid,
  p_focal_y integer DEFAULT 50
)
RETURNS jsonb
LANGUAGE plpgsql VOLATILE SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_up record;
  v_source text;
  v_url text;
  v_focal smallint := LEAST(GREATEST(COALESCE(p_focal_y, 50), 0), 100)::smallint;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501';
  END IF;

  SELECT up.id, up.user_id, up.is_public, up.shadow, up.quarantined_at, up.is_active,
         up.ai_prompt, up.media_count,
         COALESCE(up.image_url_display, up.image_url) AS url,
         o.is_bot AS owner_is_bot, o.is_public AS owner_is_public
    INTO v_up
  FROM public.uploads up
  JOIN public.users o ON o.id = up.user_id
  WHERE up.id = p_upload_id;

  IF NOT FOUND
     OR v_up.quarantined_at IS NOT NULL
     OR v_up.is_active IS FALSE
     OR v_up.ai_prompt IS NULL
     OR COALESCE(v_up.media_count, 1) > 1
     OR v_up.url IS NULL THEN
    RAISE EXCEPTION 'header_not_allowed' USING ERRCODE = '22023';
  END IF;

  IF v_up.user_id = v_uid THEN
    v_source := 'own';
  ELSIF v_up.owner_is_bot AND v_up.owner_is_public AND v_up.is_public AND NOT v_up.shadow THEN
    v_source := 'bot';
  ELSE
    RAISE EXCEPTION 'header_not_allowed' USING ERRCODE = '22023';
  END IF;

  v_url := v_up.url;

  UPDATE public.users
     SET header_upload_id = v_up.id,
         header_url = v_url,
         header_focal_y = v_focal,
         header_source = v_source,
         header_set_at = now()
   WHERE id = v_uid;

  RETURN jsonb_build_object(
    'header_upload_id', v_up.id,
    'header_url', v_url,
    'header_focal_y', v_focal,
    'header_source', v_source
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.clear_profile_header()
RETURNS void
LANGUAGE plpgsql VOLATILE SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated' USING ERRCODE = '42501';
  END IF;
  UPDATE public.users
     SET header_upload_id = NULL, header_url = NULL, header_focal_y = 50,
         header_source = NULL, header_set_at = NULL
   WHERE id = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION public.set_profile_header(uuid, integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.clear_profile_header() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_profile_header(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.clear_profile_header() TO authenticated;

-- ─── 6. Headers clear themselves when their source goes away ───────────────
-- (a) Deleted post: the FK's ON DELETE SET NULL nulls header_upload_id; this
--     BEFORE trigger then blanks the copied URL + source with it. Named trg_c…
--     so it runs before trg_freeze_user_columns (BEFORE triggers fire by name).
CREATE OR REPLACE FUNCTION public.clear_header_fields_when_source_nulled()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.header_url := NULL;
  NEW.header_source := NULL;
  NEW.header_set_at := NULL;
  NEW.header_focal_y := 50;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_clear_header_on_source_null ON public.users;
CREATE TRIGGER trg_clear_header_on_source_null
  BEFORE UPDATE OF header_upload_id ON public.users
  FOR EACH ROW
  WHEN (NEW.header_upload_id IS NULL AND OLD.header_upload_id IS NOT NULL)
  EXECUTE FUNCTION public.clear_header_fields_when_source_nulled();

-- (b) Quarantined / deactivated post: clear every header using it. A bot post
--     going private clears the headers OTHER people took from it (an owner's
--     own private dream is still a valid own header).
CREATE OR REPLACE FUNCTION public.clear_headers_for_retired_upload()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF (NEW.quarantined_at IS NOT NULL AND OLD.quarantined_at IS NULL)
     OR (NEW.is_active IS FALSE AND OLD.is_active IS NOT FALSE) THEN
    UPDATE public.users SET header_upload_id = NULL
     WHERE header_upload_id = NEW.id;
  ELSIF (NEW.is_public = false AND OLD.is_public = true)
     OR (NEW.shadow = true AND OLD.shadow = false) THEN
    UPDATE public.users SET header_upload_id = NULL
     WHERE header_upload_id = NEW.id AND header_source = 'bot';
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_clear_headers_for_retired_upload ON public.uploads;
CREATE TRIGGER trg_clear_headers_for_retired_upload
  AFTER UPDATE OF quarantined_at, is_active, is_public, shadow ON public.uploads
  FOR EACH ROW
  WHEN (OLD.quarantined_at IS DISTINCT FROM NEW.quarantined_at
        OR OLD.is_active IS DISTINCT FROM NEW.is_active
        OR OLD.is_public IS DISTINCT FROM NEW.is_public
        OR OLD.shadow IS DISTINCT FROM NEW.shadow)
  EXECUTE FUNCTION public.clear_headers_for_retired_upload();

-- ─── 7. The 18 public bots' headers (Kevin's picks, 2026-09-24) ────────────
-- Each bot's header is one of its own posts, so header_source = 'own' (no
-- credit pill on a bot's own profile). No-op where a post doesn't exist.
UPDATE public.users u
   SET header_upload_id = v.upload_id,
       header_url = COALESCE(up.image_url_display, up.image_url),
       header_focal_y = v.focal_y,
       header_source = 'own',
       header_set_at = now()
  FROM (VALUES
    ('073d23c3-b17a-462c-9660-329c7a187530'::uuid, 46::smallint),  -- DreamBot
    ('e9ca1c1e-c293-4e75-bf3b-759d706c6731'::uuid, 26::smallint),  -- BloomBot
    ('5492e6f3-e161-4bc1-ad06-6b6262ab0952'::uuid, 68::smallint),  -- BrickBot
    ('15887fd3-5022-40e2-a890-3ec7a0667c0f'::uuid, 69::smallint),  -- ChibiBot
    ('2a38a9f9-b5d1-44a4-bfc4-f63bbe33f505'::uuid, 61::smallint),  -- DinoBot
    ('ec5798bb-f34d-4e8a-8c07-ed44ebd439da'::uuid, 50::smallint),  -- DragonBot
    ('5a8e0e39-7890-47f2-9b54-4385967b0d06'::uuid, 23::smallint),  -- EarthBot
    ('62c7b902-e1bb-4f45-bbd3-31be6bc5f2de'::uuid, 54::smallint),  -- FaeBot
    ('8107e92f-371d-4a33-8d00-a22f82a37205'::uuid, 60::smallint),  -- FarmBot
    ('8c58d249-88f6-4bba-8052-b74f92ded4b6'::uuid, 37::smallint),  -- GothBot
    ('6540b8b0-2dcc-4c54-9c3b-191d53e99b24'::uuid, 60::smallint),  -- MangaBot
    ('d1958c06-5d44-47f5-bf1a-a8019892f645'::uuid, 51::smallint),  -- OceanBot
    ('9ebefcb8-779f-410a-a988-5cf40dde819d'::uuid, 71::smallint),  -- PixelBot
    ('1cba4c2f-f398-4c76-aead-5f9b2e748d18'::uuid, 50::smallint),  -- StarBot
    ('ff9bf742-6840-4df8-8772-b23c37cd882d'::uuid, 36::smallint),  -- SteamBot
    ('31b4d8e8-f77f-4e69-91b6-08c8f2c96038'::uuid, 51::smallint),  -- TinyBot
    ('5835ba53-7b36-4285-972b-d89dd19f0041'::uuid, 56::smallint),  -- ToyBot
    ('72126aa3-c77e-489c-a576-854dc257c182'::uuid, 52::smallint)   -- YumBot
  ) AS v(upload_id, focal_y)
  JOIN public.uploads up ON up.id = v.upload_id
 WHERE u.id = up.user_id
   AND u.is_bot = true;
