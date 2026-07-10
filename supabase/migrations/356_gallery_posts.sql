-- 356: Gallery posts (multi-image / carousel). GALLERY_POSTS_PLAN.md.
--
-- A post stays ONE uploads row. Its scalar image columns (image_url,
-- image_url_display, image_url_hq, thumbhash, width, height) keep meaning "the
-- cover / position 0", so every existing single-image surface is untouched. A
-- gallery adds its images (ALL of them, including the cover at position 0) to
-- the new child table upload_media. Single posts have ZERO upload_media rows
-- and render the scalar cover exactly as before (no backfill needed).
--
-- Decisions (2026-07-09): source = own dreams only; immutable; upscale acts on
-- the currently-viewed image (image_url_hq lives per upload_media row); cap is
-- engine_config-tunable.

-- ── child table ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.upload_media (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id     uuid NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
  position      smallint NOT NULL,           -- 0-based; 0 == cover
  image_url         text NOT NULL,
  image_url_display text,
  image_url_hq      text,
  image_url_hq_generated_at timestamptz,
  thumbhash     text,
  width         integer,
  height        integer,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (upload_id, position)
);
CREATE INDEX IF NOT EXISTS upload_media_upload_idx
  ON public.upload_media (upload_id, position);

ALTER TABLE public.upload_media ENABLE ROW LEVEL SECURITY;

-- Read: parent is a public feed post OR owned by the caller. Write: owner only
-- (immutable after posting is enforced in the app; DB allows the initial insert
-- + delete-your-own). Upscale writes image_url_hq as service-role (bypasses RLS).
DROP POLICY IF EXISTS upload_media_select ON public.upload_media;
CREATE POLICY upload_media_select ON public.upload_media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.uploads u
      WHERE u.id = upload_id
        AND (u.user_id = auth.uid()
             OR (u.is_public = true AND u.posted_at IS NOT NULL))
    )
  );
DROP POLICY IF EXISTS upload_media_insert ON public.upload_media;
CREATE POLICY upload_media_insert ON public.upload_media
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.uploads u WHERE u.id = upload_id AND u.user_id = auth.uid())
  );
DROP POLICY IF EXISTS upload_media_delete ON public.upload_media;
CREATE POLICY upload_media_delete ON public.upload_media
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.uploads u WHERE u.id = upload_id AND u.user_id = auth.uid())
  );

GRANT SELECT ON public.upload_media TO anon, authenticated;
GRANT INSERT, DELETE ON public.upload_media TO authenticated;

-- ── denormalized count on uploads (trigger-maintained; no client grant) ─────
ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS media_count smallint NOT NULL DEFAULT 1;

-- SECURITY DEFINER + pinned search_path (the A3 counter-trigger lesson).
CREATE OR REPLACE FUNCTION public.sync_upload_media_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  UPDATE public.uploads u
    SET media_count = GREATEST(
      (SELECT count(*) FROM public.upload_media m
       WHERE m.upload_id = COALESCE(NEW.upload_id, OLD.upload_id)), 1)
    WHERE u.id = COALESCE(NEW.upload_id, OLD.upload_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;
DROP TRIGGER IF EXISTS trg_sync_upload_media_count ON public.upload_media;
CREATE TRIGGER trg_sync_upload_media_count
  AFTER INSERT OR DELETE ON public.upload_media
  FOR EACH ROW EXECUTE FUNCTION public.sync_upload_media_count();

-- media_count is client-READABLE (uploads SELECT is table-wide) but never
-- client-WRITABLE (trigger owns it) — deliberately NOT added to the 278
-- GRANT UPDATE list.

-- ── config knob ─────────────────────────────────────────────────────────────
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS gallery_max_images integer NOT NULL DEFAULT 10;

-- ── get_feed: add a trailing `media` jsonb column ───────────────────────────
-- Reproduces migration 352 verbatim + one correlated json_agg subquery. DROP
-- first (return-shape change); the GRANT matches the unchanged 11-arg signature.
DROP FUNCTION IF EXISTS public.get_feed(
  uuid, integer, integer, double precision, double precision,
  text, double precision, uuid, text, text, uuid
);

CREATE OR REPLACE FUNCTION public.get_feed(
  p_user_id       uuid,
  p_limit         integer DEFAULT 20,
  p_offset        integer DEFAULT 0,
  p_seed          double precision DEFAULT 0.0,
  p_shuffle       double precision DEFAULT 0.10,
  p_tab           text DEFAULT 'forYou',
  p_cursor_score  double precision DEFAULT NULL,
  p_cursor_id     uuid DEFAULT NULL,
  p_medium        text DEFAULT NULL,
  p_vibe          text DEFAULT NULL,
  p_bot_user_id   uuid DEFAULT NULL
)
RETURNS TABLE(
  id                uuid,
  user_id           uuid,
  image_url         text,
  image_url_hq      text,
  image_url_display text,
  thumbhash         text,
  width             integer,
  height            integer,
  caption           text,
  description       text,
  created_at        timestamptz,
  posted_at         timestamptz,
  username          text,
  avatar_url        text,
  allow_reposts     boolean,
  comment_count     integer,
  like_count        integer,
  ai_prompt         text,
  ai_concept        jsonb,
  bot_message       text,
  dream_medium      text,
  dream_vibe        text,
  model             text,
  repost_count      integer,
  surface_type      text,
  reposter_id       uuid,
  reposter_name     text,
  reposters_more    integer,
  reposted_at       timestamptz,
  feed_score        double precision,
  media             jsonb
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  WITH user_blocks AS (
    SELECT blocked_id AS uid FROM public.blocked_users WHERE blocker_id = p_user_id
    UNION
    SELECT blocker_id AS uid FROM public.blocked_users WHERE blocked_id = p_user_id
  ),
  user_reports AS (
    SELECT upload_id FROM public.reports WHERE reporter_id = p_user_id AND upload_id IS NOT NULL
  ),
  user_follows AS (
    SELECT following_id FROM public.follows WHERE follower_id = p_user_id
  ),
  public_users AS (
    SELECT id FROM public.users WHERE is_public = true
  ),
  repost_agg AS (
    SELECT
      r.upload_id,
      count(*)::int AS followed_reposter_count,
      max(r.created_at) AS latest_repost_at,
      (array_agg(r.reposter_id ORDER BY r.created_at DESC))[1] AS latest_reposter_id,
      (array_agg(ru.username  ORDER BY r.created_at DESC))[1] AS latest_reposter_name
    FROM public.post_reposts r
    JOIN public.users ru ON ru.id = r.reposter_id
    WHERE r.reposter_id IN (SELECT following_id FROM user_follows)
    GROUP BY r.upload_id
  ),
  scored AS (
    SELECT
      up.id, up.user_id, up.image_url, up.image_url_hq,
      up.image_url_display, up.thumbhash,
      up.width, up.height, up.caption, up.description,
      up.created_at, up.posted_at,
      u.username, u.avatar_url, u.allow_reposts,
      up.comment_count, up.like_count,
      up.ai_prompt, up.ai_concept, up.bot_message,
      up.dream_medium, up.dream_vibe, up.model,
      up.repost_count,

      (ra.upload_id IS NOT NULL) AS has_followed_repost,
      COALESCE(ra.followed_reposter_count, 0) AS followed_reposter_count,
      ra.latest_repost_at, ra.latest_reposter_id, ra.latest_reposter_name,

      CASE
        WHEN p_tab IN ('following', 'forYou')
             AND ra.upload_id IS NOT NULL
             AND uf.following_id IS NULL
          THEN 'repost'
        ELSE 'original'
      END AS surface_type,

      (up.like_count + up.comment_count * 2
       + up.share_count * 2 + up.save_count * 1.5
       + up.repost_count * 2.0)::float AS weighted_engagement,

      GREATEST(EXTRACT(EPOCH FROM (now() -
        CASE
          WHEN p_tab = 'following'
               AND ra.upload_id IS NOT NULL
               AND uf.following_id IS NULL
            THEN ra.latest_repost_at
          ELSE up.posted_at
        END
      )) / 3600.0, 0.1) AS hours_age,

      CASE WHEN uf.following_id IS NOT NULL THEN true ELSE false END AS is_following,

      GREATEST(up.view_count, 10)::float AS views

    FROM public.uploads up
    JOIN public.users u ON u.id = up.user_id
    LEFT JOIN user_follows uf ON uf.following_id = up.user_id
    LEFT JOIN repost_agg ra ON ra.upload_id = up.id
    WHERE up.is_public = true
      AND up.posted_at IS NOT NULL
      AND (p_tab <> 'forYou'
           OR up.posted_at > now() - interval '365 days'
           OR ra.upload_id IS NOT NULL)
      AND (p_tab = 'bots' OR up.user_id != p_user_id)
      AND (up.is_moderated = false OR up.is_approved = true)
      AND up.user_id NOT IN (SELECT uid FROM user_blocks)
      AND up.id NOT IN (SELECT upload_id FROM user_reports)
      AND (
        up.user_id IN (SELECT id FROM public_users)
        OR up.user_id IN (SELECT following_id FROM user_follows)
      )
      AND (
        CASE
          WHEN p_tab = 'following' THEN
            (up.user_id IN (SELECT following_id FROM user_follows)
             OR ra.upload_id IS NOT NULL)
          WHEN p_tab = 'bots' THEN
            up.is_ai_generated = true
            AND up.user_id IN (SELECT id FROM public.users WHERE is_bot = true)
            AND (p_bot_user_id IS NULL OR up.user_id = p_bot_user_id)
          ELSE true
        END
      )
      AND (p_medium IS NULL OR up.dream_medium = p_medium)
      AND (p_vibe IS NULL OR up.dream_vibe = p_vibe)
  ),
  final_scored AS (
    SELECT
      scored.*,
      CASE
        WHEN p_tab = 'forYou' THEN (
          EXP(-0.05 * scored.hours_age) * 0.25
          + LN(1.0 + scored.weighted_engagement / scored.hours_age) / 5.0 * 0.25
          + LN(1.0 + scored.weighted_engagement / scored.views) / 3.0 * 0.10
          + LN(1.0 + scored.weighted_engagement) / LN(1.0 + 5000.0) * 0.15
          + CASE WHEN scored.is_following THEN 0.15 ELSE 0.0 END
          + ((ABS(HASHTEXT(p_user_id::text || scored.id::text || p_seed::text)) % 1000)::float / 1000.0) * p_shuffle
          + CASE WHEN scored.hours_age < 4.0 THEN 0.20 ELSE 0.0 END
          + CASE WHEN scored.has_followed_repost
                 THEN LEAST(0.20, 0.08 + 0.04 * scored.followed_reposter_count)
                 ELSE 0.0 END
        )
        WHEN p_tab = 'following' THEN (
          CASE WHEN scored.hours_age < 24.0
            THEN 1.0 - (scored.hours_age / 24.0) * 0.3
            ELSE 0.0
          END
          + LN(1.0 + scored.weighted_engagement) / LN(1.0 + 5000.0) * 0.30
          + EXP(-0.02 * scored.hours_age) * 0.10
        )
        WHEN p_tab = 'bots' THEN
          EXTRACT(EPOCH FROM scored.posted_at) / 1e10
        ELSE 0.0
      END AS computed_score
    FROM scored
  )
  SELECT
    final_scored.id, final_scored.user_id, final_scored.image_url,
    final_scored.image_url_hq,
    final_scored.image_url_display, final_scored.thumbhash,
    final_scored.width, final_scored.height, final_scored.caption,
    final_scored.description, final_scored.created_at, final_scored.posted_at,
    final_scored.username, final_scored.avatar_url, final_scored.allow_reposts,
    final_scored.comment_count, final_scored.like_count,
    final_scored.ai_prompt, final_scored.ai_concept, final_scored.bot_message,
    final_scored.dream_medium, final_scored.dream_vibe, final_scored.model,
    final_scored.repost_count,
    final_scored.surface_type,
    CASE WHEN final_scored.surface_type = 'repost' THEN final_scored.latest_reposter_id END AS reposter_id,
    CASE WHEN final_scored.surface_type = 'repost' THEN final_scored.latest_reposter_name END AS reposter_name,
    CASE WHEN final_scored.surface_type = 'repost'
         THEN GREATEST(final_scored.followed_reposter_count - 1, 0) ELSE 0 END AS reposters_more,
    CASE WHEN final_scored.surface_type = 'repost' THEN final_scored.latest_repost_at END AS reposted_at,
    final_scored.computed_score AS feed_score,
    -- Gallery images (empty array for single-image posts → client uses the cover scalar).
    (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
               'url', m.image_url, 'display', m.image_url_display,
               'hq', m.image_url_hq, 'thumbhash', m.thumbhash,
               'width', m.width, 'height', m.height) ORDER BY m.position), '[]'::jsonb)
      FROM public.upload_media m WHERE m.upload_id = final_scored.id
    ) AS media
  FROM final_scored
  WHERE
    (p_cursor_score IS NULL OR p_cursor_id IS NULL)
    OR (final_scored.computed_score < p_cursor_score)
    OR (final_scored.computed_score = p_cursor_score AND final_scored.id < p_cursor_id)
  ORDER BY final_scored.computed_score DESC, final_scored.id DESC
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_feed(uuid, integer, integer, double precision, double precision, text, double precision, uuid, text, text, uuid) TO authenticated;

-- ── get_shared_post: add a trailing `media` jsonb column (web + in-app link) ─
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
