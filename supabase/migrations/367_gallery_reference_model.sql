-- 367_gallery_reference_model.sql (2026-07-11)
--
-- Albums become REFERENCES, not copies (Kevin: "an album is a window into the
-- user's dreams"). upload_media turns into a join table: each row points at its
-- SOURCE dream via source_upload_id, reusing the source's files — publish is two
-- inserts, no storage copies. NULL source_upload_id = legacy copied row (pre-367
-- albums keep working unchanged AND the null doubles as the storage-cleanup
-- discriminator on delete).
--
-- Consistency lives in the DB (client can't drift):
--   • FK ON DELETE CASCADE — deleting a dream removes it from every album.
--   • heal trigger (member delete) — re-fronts the cover / deletes an emptied
--     album host (empty albums cannot exist).
--   • cover trigger (source hidden) — an album fronted by a now-private dream
--     promotes its next visible member to cover.
--   • visibility is READ-TIME (reversible): RLS + get_feed/get_shared_post only
--     surface members whose source is public; all-hidden albums leave the feed
--     and return when any image is re-shown. Hiding is uniform (owner included).
--   • describe_album_impact() — owner-scoped DEFINER RPC for the delete-confirm
--     copy ("removes it from 2 albums / will delete 1 album"), needed because
--     the uniform-hide RLS blocks the owner from introspecting hidden rows.

BEGIN;

-- ── membership reference ─────────────────────────────────────────────────────
ALTER TABLE public.upload_media
  ADD COLUMN IF NOT EXISTS source_upload_id uuid REFERENCES public.uploads(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_upload_media_source ON public.upload_media (source_upload_id);

-- ── heal trigger: member deleted → re-front cover / dissolve empty album ─────
CREATE OR REPLACE FUNCTION public.heal_gallery_on_member_delete()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_host public.uploads%ROWTYPE;
  v_next public.upload_media%ROWTYPE;
  v_remaining integer;
BEGIN
  SELECT * INTO v_host FROM public.uploads WHERE id = OLD.upload_id;
  IF NOT FOUND THEN
    RETURN OLD;  -- the HOST's own delete is cascading its rows: nothing to heal
  END IF;
  SELECT count(*) INTO v_remaining FROM public.upload_media WHERE upload_id = OLD.upload_id;
  IF v_remaining = 0 THEN
    DELETE FROM public.uploads WHERE id = OLD.upload_id;  -- empty albums cannot exist
    RETURN OLD;
  END IF;
  IF v_host.image_url = OLD.image_url THEN  -- deleted member was the cover
    SELECT m.* INTO v_next
    FROM public.upload_media m
    LEFT JOIN public.uploads s ON s.id = m.source_upload_id
    WHERE m.upload_id = OLD.upload_id
    ORDER BY (CASE WHEN m.source_upload_id IS NULL OR s.is_public THEN 0 ELSE 1 END),
             m.position
    LIMIT 1;
    IF FOUND THEN
      UPDATE public.uploads
        SET image_url         = v_next.image_url,
            image_url_display = v_next.image_url_display,
            image_url_hq      = v_next.image_url_hq,
            thumbhash         = v_next.thumbhash,
            width             = COALESCE(v_next.width, width),
            height            = COALESCE(v_next.height, height)
      WHERE id = OLD.upload_id;
    END IF;
  END IF;
  RETURN OLD;
END;
$$;
DROP TRIGGER IF EXISTS trg_heal_gallery_on_member_delete ON public.upload_media;
CREATE TRIGGER trg_heal_gallery_on_member_delete
  AFTER DELETE ON public.upload_media
  FOR EACH ROW EXECUTE FUNCTION public.heal_gallery_on_member_delete();

-- ── cover trigger: source hidden → albums it fronts promote a visible cover ──
CREATE OR REPLACE FUNCTION public.refront_galleries_on_source_hide()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  r record;
  v_next public.upload_media%ROWTYPE;
BEGIN
  FOR r IN
    SELECT m.upload_id
    FROM public.upload_media m
    JOIN public.uploads h ON h.id = m.upload_id
    WHERE m.source_upload_id = NEW.id AND h.image_url = NEW.image_url
  LOOP
    SELECT m2.* INTO v_next
    FROM public.upload_media m2
    LEFT JOIN public.uploads s ON s.id = m2.source_upload_id
    WHERE m2.upload_id = r.upload_id
      AND (m2.source_upload_id IS NULL OR s.is_public = true)
    ORDER BY m2.position
    LIMIT 1;
    IF FOUND THEN
      UPDATE public.uploads
        SET image_url         = v_next.image_url,
            image_url_display = v_next.image_url_display,
            image_url_hq      = v_next.image_url_hq,
            thumbhash         = v_next.thumbhash,
            width             = COALESCE(v_next.width, width),
            height            = COALESCE(v_next.height, height)
      WHERE id = r.upload_id;
    END IF;
    -- No visible member left: cover stays; the get_feed EXISTS filter hides
    -- the whole album from feeds until an image is re-shown.
  END LOOP;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_refront_galleries_on_source_hide ON public.uploads;
CREATE TRIGGER trg_refront_galleries_on_source_hide
  AFTER UPDATE OF is_public ON public.uploads
  FOR EACH ROW
  WHEN (OLD.is_public = true AND NEW.is_public = false)
  EXECUTE FUNCTION public.refront_galleries_on_source_hide();

-- ── RLS: members are visible only while their source is public (uniform) ─────
DROP POLICY IF EXISTS upload_media_select ON public.upload_media;
CREATE POLICY upload_media_select ON public.upload_media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.uploads u
      WHERE u.id = upload_id
        AND (u.user_id = auth.uid()
             OR (u.is_public = true AND u.posted_at IS NOT NULL))
    )
    AND (
      source_upload_id IS NULL  -- legacy copied rows: always visible
      OR EXISTS (SELECT 1 FROM public.uploads s
                 WHERE s.id = source_upload_id AND s.is_public = true)
    )
  );

-- ── delete-confirm introspection (owner-scoped; sees hidden members too) ─────
CREATE OR REPLACE FUNCTION public.describe_album_impact(p_source_ids uuid[])
RETURNS TABLE (albums_touched integer, albums_deleted integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  WITH touched AS (
    SELECT m.upload_id,
           count(*) FILTER (WHERE m.source_upload_id = ANY (p_source_ids)) AS going,
           count(*) AS total
    FROM public.upload_media m
    JOIN public.uploads h ON h.id = m.upload_id
    WHERE h.user_id = auth.uid()
    GROUP BY m.upload_id
    HAVING count(*) FILTER (WHERE m.source_upload_id = ANY (p_source_ids)) > 0
  )
  SELECT COALESCE(count(*), 0)::int  AS albums_touched,
         COALESCE(count(*) FILTER (WHERE going >= total), 0)::int AS albums_deleted
  FROM touched;
$$;
GRANT EXECUTE ON FUNCTION public.describe_album_impact(uuid[]) TO authenticated;

-- ── get_feed: media respects per-image source visibility (migration 367) ────
-- Reproduces migration 356 verbatim with three edits: (1) the media jsonb only
-- includes members whose SOURCE dream is public (reference rows; legacy copied
-- rows are always visible), (2) gallery hosts with ZERO visible members are
-- excluded from the feed entirely, (3) same media predicate in get_shared_post.
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
      -- Gallery hosts need >= 1 VISIBLE member; an album whose images are all
      -- private vanishes from feeds (and returns when any image is re-shown).
      AND (up.media_count <= 1 OR EXISTS (
        SELECT 1 FROM public.upload_media vm
        LEFT JOIN public.uploads vs ON vs.id = vm.source_upload_id
        WHERE vm.upload_id = up.id
          AND (vm.source_upload_id IS NULL OR vs.is_public = true)))
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
      FROM public.upload_media m
      LEFT JOIN public.uploads s ON s.id = m.source_upload_id
      WHERE m.upload_id = final_scored.id
        AND (m.source_upload_id IS NULL OR s.is_public = true)
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
      FROM public.upload_media m
      LEFT JOIN public.uploads s ON s.id = m.source_upload_id
      WHERE m.upload_id = up.id
        AND (m.source_upload_id IS NULL OR s.is_public = true)
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

COMMIT;
