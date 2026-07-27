-- 418_repost_bump_ledger.sql — repost = "a new post from that user" to their
-- followers, but with a ONE-TIME bump that can't be farmed.
--
-- PRODUCT RULE (Kevin, 2026-07-26): a repost should behave like a fresh post
-- from the reposter INSIDE THEIR FOLLOWER GRAPH (their followers see it float up
-- at repost time; only ORIGINAL posts ever compete in the wide Explore/forYou
-- algorithm). But a user may only ever get that bump ONCE per dream: repost →
-- un-repost → repost must NOT bump the feed a second time. The re-repost still
-- lands in their Reposts album; it just no longer counts as a new post.
--
-- The gaming vector today: toggle_repost (mig 242/370) hard-DELETEs on un-repost,
-- so the (reposter, upload) pair has zero memory — every re-repost re-surfaces at
-- the new time. This migration turns post_reposts into a durable ledger:
--
--   • first_reposted_at — WRITE-ONCE (frozen by trigger, mirrors uploads.posted_at).
--     The feed keys the bump off this, so a re-repost re-enters at its ORIGINAL
--     (now-aged) timestamp — no fresh bump.
--   • active            — currently reposted (in album + feed-eligible) or not.
--                         Un-repost sets false (NEVER deletes); re-repost sets true.
--   • activations       — increments on every off→on flip. get_feed only surfaces
--                         a repost when activations = 1 (the first-ever repost);
--                         activations > 1 is album-only (the "severe penalty").
--   • last_reposted_at  — mutable; album sort only (a re-repost bumps the album).
--
-- SECURITY: the activations counter is the anti-gaming lever, so a client must
-- never be able to touch it. ALL writes now go through SECURITY DEFINER RPCs
-- (toggle_repost + the new bulk_unrepost) — the direct INSERT/DELETE RLS policies
-- are dropped. Reads stay open. See 419 for the get_feed side.
--
-- Run in the Supabase dashboard SQL editor (DDL). Idempotent where practical.

-- ── 1. Ledger columns ───────────────────────────────────────────────────────
ALTER TABLE public.post_reposts
  ADD COLUMN IF NOT EXISTS active            boolean     NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS activations       integer     NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS first_reposted_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS last_reposted_at  timestamptz NOT NULL DEFAULT now();

-- One-time backfill: existing reposts are active first-reposts. ADD COLUMN filled
-- the timestamps with the migration-run now(); pin them back to the real repost
-- time (created_at). Guarded so an accidental re-run can't clobber live activity
-- (post-migration rows have activations>1 or already-equal timestamps).
UPDATE public.post_reposts
  SET first_reposted_at = created_at,
      last_reposted_at  = created_at
  WHERE activations = 1 AND first_reposted_at > created_at;

-- Feed lookup: repost_agg (mig 419) filters reposter_id ∈ follows AND active AND
-- activations = 1, grouped by upload_id. Partial index over exactly that set.
CREATE INDEX IF NOT EXISTS idx_post_reposts_feed_active
  ON public.post_reposts (reposter_id, upload_id)
  WHERE active = true AND activations = 1;

-- ── 2. first_reposted_at is WRITE-ONCE (mirrors freeze on uploads.posted_at) ──
CREATE OR REPLACE FUNCTION public.freeze_repost_first_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  -- The one-time feed bump keys off first_reposted_at, so it must never move on
  -- a re-repost — otherwise un-repost/re-repost would reset freshness (the exact
  -- manipulation this ledger prevents).
  IF NEW.first_reposted_at IS DISTINCT FROM OLD.first_reposted_at THEN
    NEW.first_reposted_at := OLD.first_reposted_at;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_freeze_repost_first_at ON public.post_reposts;
CREATE TRIGGER trg_freeze_repost_first_at
  BEFORE UPDATE ON public.post_reposts
  FOR EACH ROW EXECUTE FUNCTION public.freeze_repost_first_at();

-- ── 3. repost_count follows the ACTIVE set (soft-delete aware) ───────────────
-- Was INSERT/DELETE only (mig 242/278). Now the active flag flips on UPDATE, so
-- the denormalized count must track active transitions too. DELETE stays for the
-- FK cascade (upload/user deletion hard-removes rows).
CREATE OR REPLACE FUNCTION public.update_repost_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.active THEN
      UPDATE public.uploads SET repost_count = repost_count + 1 WHERE id = NEW.upload_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.active IS DISTINCT FROM NEW.active THEN
      IF NEW.active THEN
        UPDATE public.uploads SET repost_count = repost_count + 1 WHERE id = NEW.upload_id;
      ELSE
        UPDATE public.uploads SET repost_count = GREATEST(repost_count - 1, 0) WHERE id = NEW.upload_id;
      END IF;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.active THEN
      UPDATE public.uploads SET repost_count = GREATEST(repost_count - 1, 0) WHERE id = OLD.upload_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_repost_count ON public.post_reposts;
CREATE TRIGGER trg_repost_count
  AFTER INSERT OR UPDATE OR DELETE ON public.post_reposts
  FOR EACH ROW EXECUTE FUNCTION public.update_repost_count();

-- ── 4. Lock writes to the RPCs (activations must be server-controlled) ───────
-- A client that could INSERT/UPDATE post_reposts directly could reset activations
-- and farm the bump. Drop the direct write policies; everything goes through the
-- SECURITY DEFINER RPCs below. SELECT stays open (fill-state + Reposts tab read
-- the table directly). FK cascades bypass RLS, so deletes on upload/user removal
-- still work.
DROP POLICY IF EXISTS "user can repost"   ON public.post_reposts;
DROP POLICY IF EXISTS "user can unrepost" ON public.post_reposts;

-- ── 5. toggle_repost — durable state machine ─────────────────────────────────
-- No row            → FIRST repost: INSERT (active, activations=1, first_reposted_at=now()) → BUMP + notify.
-- Row, active=true  → UN-REPOST:    UPDATE active=false (row kept) → out of feed + album, no notify.
-- Row, active=false → RE-REPOST:    UPDATE active=true, activations+1, last_reposted_at=now(),
--                                   first_reposted_at FROZEN → back in album, NO bump, no notify.
CREATE OR REPLACE FUNCTION public.toggle_repost(p_upload_id uuid)
RETURNS TABLE(reposted boolean, repost_count integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_actor  uuid := auth.uid();
  v_author uuid;
  v_public boolean;
  v_allow  boolean;
  v_active boolean;
  v_exists boolean;
BEGIN
  IF v_actor IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  IF (SELECT is_bot FROM public.users WHERE id = v_actor) THEN
    RAISE EXCEPTION 'bots cannot repost';
  END IF;

  SELECT user_id, is_public INTO v_author, v_public
    FROM public.uploads WHERE id = p_upload_id;
  IF v_author IS NULL THEN RAISE EXCEPTION 'upload not found'; END IF;

  SELECT active INTO v_active
    FROM public.post_reposts
    WHERE reposter_id = v_actor AND upload_id = p_upload_id;
  v_exists := FOUND;

  -- Currently reposted → toggle OFF. Soft-delete: keep the row so the frozen
  -- first_reposted_at + activations survive (that IS the anti-manipulation
  -- ledger). No author notification on an un-repost.
  IF v_exists AND v_active THEN
    UPDATE public.post_reposts
      SET active = false
      WHERE reposter_id = v_actor AND upload_id = p_upload_id;
    RETURN QUERY SELECT false, (SELECT u.repost_count FROM public.uploads u WHERE u.id = p_upload_id);
    RETURN;
  END IF;

  -- Toggling ON (first repost or re-repost). Re-check integrity every time — the
  -- author may have gone private or disabled reposts since the last activation.
  -- (self-repost is allowed, mig 370; bots blocked above.)
  IF NOT v_public THEN RAISE EXCEPTION 'cannot repost a private post'; END IF;
  SELECT allow_reposts INTO v_allow FROM public.users WHERE id = v_author;
  IF NOT COALESCE(v_allow, true) THEN RAISE EXCEPTION 'author has disabled reposts'; END IF;

  IF v_exists THEN
    -- RE-REPOST: re-add to the album, bump the counter + album sort time, but
    -- leave first_reposted_at frozen. activations>1 → get_feed's repost_agg skips
    -- it → NO fresh feed bump. No author notification (avoids toggle ping spam).
    UPDATE public.post_reposts
      SET active = true,
          activations = activations + 1,
          last_reposted_at = now()
      WHERE reposter_id = v_actor AND upload_id = p_upload_id;
  ELSE
    -- FIRST-EVER repost. Column defaults set active=true, activations=1,
    -- first_reposted_at=now() → this one DOES bump. Notify the original author
    -- (skip self-repost + bot authors — bots have no inbox).
    INSERT INTO public.post_reposts (reposter_id, upload_id) VALUES (v_actor, p_upload_id);
    IF v_author <> v_actor
       AND NOT COALESCE((SELECT is_bot FROM public.users WHERE id = v_author), false) THEN
      INSERT INTO public.notifications (recipient_id, actor_id, type, upload_id)
      VALUES (v_author, v_actor, 'post_repost', p_upload_id);
    END IF;
  END IF;

  RETURN QUERY SELECT true, (SELECT u.repost_count FROM public.uploads u WHERE u.id = p_upload_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.toggle_repost(uuid) TO authenticated;

-- ── 6. bulk_unrepost — the Reposts-grid multi-select deactivate ──────────────
-- Replaces the direct DELETE the client did (which destroyed the ledger). Soft-
-- deactivates the caller's active reposts for the given uploads.
DROP FUNCTION IF EXISTS public.bulk_unrepost(uuid[]);
CREATE FUNCTION public.bulk_unrepost(p_upload_ids uuid[])
RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.post_reposts
    SET active = false
    WHERE reposter_id = auth.uid()
      AND upload_id = ANY(p_upload_ids)
      AND active = true;
$$;

GRANT EXECUTE ON FUNCTION public.bulk_unrepost(uuid[]) TO authenticated;

-- ── 7. get_reposters — active reposters only, immutable cursor ───────────────
-- Filter active=true (un-reposted rows linger as ledger tombstones). Paginate by
-- first_reposted_at (write-once → stable keyset; last_reposted_at moves on a
-- re-repost and would break mid-scroll).
DROP FUNCTION IF EXISTS public.get_reposters(uuid, integer, timestamptz);
CREATE FUNCTION public.get_reposters(
  p_upload_id uuid,
  p_limit     integer     DEFAULT 30,
  p_cursor    timestamptz DEFAULT NULL
)
RETURNS TABLE(user_id uuid, username text, avatar_url text, reposted_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT u.id, u.username, u.avatar_url, r.first_reposted_at
  FROM public.post_reposts r
  JOIN public.users u ON u.id = r.reposter_id
  WHERE r.upload_id = p_upload_id
    AND r.active = true
    AND (p_cursor IS NULL OR r.first_reposted_at < p_cursor)
  ORDER BY r.first_reposted_at DESC
  LIMIT LEAST(COALESCE(p_limit, 30), 100);
$$;

GRANT EXECUTE ON FUNCTION public.get_reposters(uuid, integer, timestamptz) TO authenticated;
