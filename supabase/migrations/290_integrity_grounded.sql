-- 290_integrity_grounded.sql
--
-- DB-audit remediation, GROUNDED in the live schema introspection (2026-06-18).
--
-- The audit's 7 read-only agents INFERRED most integrity/index findings from the
-- migration files (the live dump wasn't available). Introspecting the live catalog
-- (pg_constraint / pg_indexes / pg_proc) REFUTED nearly all of the "critical" ones:
--   • likes / post_reposts / favorites already have their UNIQUE(user_id,upload_id).
--   • dream_jobs.status, dream_queue.status / .weight / .source CHECKs all exist.
--   • The "missing composite membership indexes" ARE the unique keys.
--   • dream_queue(user_id,status) index exists (idx_dream_queue_user_status).
--   • No RLS-disabled tables. update_twin/fuse_count don't exist (dead, already gone).
--   • Counter CHECK(>=0) floors are unnecessary: those columns are frozen + UPDATE-
--     revoked (mig 278), so they're only ever written by the DEFINER triggers below —
--     flooring the triggers is the real fix, a CHECK adds nothing client-reachable.
--
-- That left exactly TWO genuine, safe, grounded fixes:
--
--   1. blocked_users reverse-direction index. The feed block-filter UNIONs a
--      `WHERE blocker_id = me` arm (indexed) with a `WHERE blocked_id = me` arm.
--      Live has idx_blocked_users_blocker (blocker_id) and a (blocker_id, blocked_id)
--      composite — NEITHER leads on blocked_id, so the reverse arm seq-scans. Additive.
--
--   2. Three counter triggers still decrement without a GREATEST(...,0) floor (a
--      double-DELETE could drive the counter negative), and update_save_count /
--      update_share_count also lack a pinned search_path (minor DEFINER hygiene).
--      migration 286 floored like/repost/comment counts; these three were missed.
--
-- All idempotent + function-only / additive → safe to hand-apply on live.

-- 1. Reverse block-filter index (additive, safe).
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked
  ON public.blocked_users (blocked_id, blocker_id);

-- 2a. comment like-count: floor the decrement.
CREATE OR REPLACE FUNCTION public.update_comment_like_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE comments SET like_count = like_count + 1 WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE comments SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.comment_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 2b. upload share-count: floor the decrement + pin search_path.
CREATE OR REPLACE FUNCTION public.update_share_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE uploads SET share_count = share_count + 1 WHERE id = NEW.upload_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE uploads SET share_count = GREATEST(share_count - 1, 0) WHERE id = OLD.upload_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- 2c. upload save-count: floor the decrement + pin search_path.
CREATE OR REPLACE FUNCTION public.update_save_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE uploads SET save_count = save_count + 1 WHERE id = NEW.upload_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE uploads SET save_count = GREATEST(save_count - 1, 0) WHERE id = OLD.upload_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;
