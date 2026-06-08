-- Migration 242: Repost feature — Phase 1 (data model + RPCs)
--
-- Pointer-with-attribution model: a repost is a lightweight reference record in
-- post_reposts, NOT a duplicate upload. Engagement always targets the original
-- upload_id; deleting the original cascade-deletes its reposts (no tombstones).
-- See REPOST_FEATURE_PLAN.md for the full design. USERS ONLY — bots are repost
-- targets, never actors. No self-repost. Authors can opt out (users.allow_reposts).
--
-- Run in the Supabase dashboard SQL editor (DDL). Idempotent where practical.

-- ── 1. post_reposts table (pointer records) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.post_reposts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reposter_id uuid NOT NULL REFERENCES public.users(id)   ON DELETE CASCADE,
  upload_id   uuid NOT NULL REFERENCES public.uploads(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (reposter_id, upload_id)          -- one repost per user+post, toggle = insert/delete
);

-- (reposter_id, created_at DESC): the reposter's "Reposts" tab + following-feed source.
CREATE INDEX IF NOT EXISTS idx_post_reposts_reposter
  ON public.post_reposts (reposter_id, created_at DESC);
-- (upload_id): repost_count, get_reposters, canonical-id dedup in feeds.
CREATE INDEX IF NOT EXISTS idx_post_reposts_upload
  ON public.post_reposts (upload_id);

-- RLS: public read; insert/delete gated to the reposter. Integrity (public,
-- not-own, author-allows, not-bot) is enforced by trg_enforce_repost_rules +
-- the toggle_repost RPC, NOT here (cross-table checks live in the trigger).
ALTER TABLE public.post_reposts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "view all reposts" ON public.post_reposts;
CREATE POLICY "view all reposts"
  ON public.post_reposts FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "user can repost" ON public.post_reposts;
CREATE POLICY "user can repost"
  ON public.post_reposts FOR INSERT TO authenticated WITH CHECK (auth.uid() = reposter_id);

DROP POLICY IF EXISTS "user can unrepost" ON public.post_reposts;
CREATE POLICY "user can unrepost"
  ON public.post_reposts FOR DELETE TO authenticated USING (auth.uid() = reposter_id);

-- ── 2. uploads.repost_count (denormalized for scoring + display) ────────────
ALTER TABLE public.uploads ADD COLUMN IF NOT EXISTS repost_count integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.update_repost_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.uploads SET repost_count = repost_count + 1 WHERE id = NEW.upload_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.uploads SET repost_count = GREATEST(repost_count - 1, 0) WHERE id = OLD.upload_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_repost_count ON public.post_reposts;
CREATE TRIGGER trg_repost_count
  AFTER INSERT OR DELETE ON public.post_reposts
  FOR EACH ROW EXECUTE FUNCTION public.update_repost_count();

-- ── 3. users.allow_reposts (author opt-out; bots stay true) ─────────────────
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS allow_reposts boolean NOT NULL DEFAULT true;

-- ── 4. Integrity backstop — enforce repost rules on INSERT ──────────────────
-- Defense-in-depth: even a direct client insert (RLS only checks ownership)
-- must satisfy the repost rules. The toggle_repost RPC checks the same rules
-- first to return clean errors; this trigger is the hard guarantee.
CREATE OR REPLACE FUNCTION public.enforce_repost_rules()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_author uuid;
  v_public boolean;
  v_allow  boolean;
BEGIN
  IF (SELECT is_bot FROM public.users WHERE id = NEW.reposter_id) THEN
    RAISE EXCEPTION 'bots cannot repost';
  END IF;
  SELECT user_id, is_public INTO v_author, v_public
    FROM public.uploads WHERE id = NEW.upload_id;
  IF v_author IS NULL THEN
    RAISE EXCEPTION 'upload not found';
  END IF;
  IF v_author = NEW.reposter_id THEN
    RAISE EXCEPTION 'cannot repost your own post';
  END IF;
  IF NOT v_public THEN
    RAISE EXCEPTION 'cannot repost a private post';
  END IF;
  SELECT allow_reposts INTO v_allow FROM public.users WHERE id = v_author;
  IF NOT COALESCE(v_allow, true) THEN
    RAISE EXCEPTION 'author has disabled reposts';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_repost_rules ON public.post_reposts;
CREATE TRIGGER trg_enforce_repost_rules
  BEFORE INSERT ON public.post_reposts
  FOR EACH ROW EXECUTE FUNCTION public.enforce_repost_rules();

-- ── 5. notifications: allow the 'post_repost' type ──────────────────────────
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'post_comment', 'comment_reply', 'comment_mention', 'post_share',
    'friend_request', 'friend_accepted',
    'follow_request', 'follow_accepted',
    'dream_nightly', 'dream_wish', 'dream_welcome', 'dream_generated',
    'dream_failed',
    'post_like', 'post_fuse', 'post_twin', 'post_repost',   -- ADDED post_repost
    'post_milestone', 'comment_like',
    'comment',                                              -- legacy, kept
    'download_ready'
  ));

-- ── 6. toggle_repost RPC — insert/delete toggle + integrity + notification ──
DROP FUNCTION IF EXISTS public.toggle_repost(uuid);
CREATE FUNCTION public.toggle_repost(p_upload_id uuid)
RETURNS TABLE(reposted boolean, repost_count integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_actor    uuid := auth.uid();
  v_author   uuid;
  v_public   boolean;
  v_allow    boolean;
  v_existing uuid;
BEGIN
  IF v_actor IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  IF (SELECT is_bot FROM public.users WHERE id = v_actor) THEN
    RAISE EXCEPTION 'bots cannot repost';
  END IF;

  SELECT user_id, is_public INTO v_author, v_public
    FROM public.uploads WHERE id = p_upload_id;
  IF v_author IS NULL THEN RAISE EXCEPTION 'upload not found'; END IF;

  SELECT id INTO v_existing
    FROM public.post_reposts WHERE reposter_id = v_actor AND upload_id = p_upload_id;

  IF v_existing IS NOT NULL THEN
    -- toggle OFF
    DELETE FROM public.post_reposts WHERE id = v_existing;
    RETURN QUERY SELECT false, (SELECT u.repost_count FROM public.uploads u WHERE u.id = p_upload_id);
    RETURN;
  END IF;

  -- toggle ON — integrity (the trigger re-checks these as the hard guarantee)
  IF v_author = v_actor THEN RAISE EXCEPTION 'cannot repost your own post'; END IF;
  IF NOT v_public THEN RAISE EXCEPTION 'cannot repost a private post'; END IF;
  SELECT allow_reposts INTO v_allow FROM public.users WHERE id = v_author;
  IF NOT COALESCE(v_allow, true) THEN RAISE EXCEPTION 'author has disabled reposts'; END IF;

  INSERT INTO public.post_reposts (reposter_id, upload_id) VALUES (v_actor, p_upload_id);

  -- notify the original author (skip bot authors — bots have no inbox)
  IF NOT COALESCE((SELECT is_bot FROM public.users WHERE id = v_author), false) THEN
    INSERT INTO public.notifications (recipient_id, actor_id, type, upload_id)
    VALUES (v_author, v_actor, 'post_repost', p_upload_id);
  END IF;

  RETURN QUERY SELECT true, (SELECT u.repost_count FROM public.uploads u WHERE u.id = p_upload_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.toggle_repost(uuid) TO authenticated;

-- ── 7. get_reposters RPC — paginated "Reposted by" list (long-press sheet) ──
DROP FUNCTION IF EXISTS public.get_reposters(uuid, integer, timestamptz);
CREATE FUNCTION public.get_reposters(
  p_upload_id uuid,
  p_limit     integer     DEFAULT 30,
  p_cursor    timestamptz DEFAULT NULL
)
RETURNS TABLE(user_id uuid, username text, avatar_url text, reposted_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT u.id, u.username, u.avatar_url, r.created_at
  FROM public.post_reposts r
  JOIN public.users u ON u.id = r.reposter_id
  WHERE r.upload_id = p_upload_id
    AND (p_cursor IS NULL OR r.created_at < p_cursor)
  ORDER BY r.created_at DESC
  LIMIT LEAST(COALESCE(p_limit, 30), 100);
$$;

GRANT EXECUTE ON FUNCTION public.get_reposters(uuid, integer, timestamptz) TO authenticated;
