-- Migration 069: Security hardening
-- 1. Enforce is_approved = false on client inserts (only service_role can approve)
-- 2. Rate limit comments (max 10 per minute per user)
-- 3. Rate limit friend requests (max 5 per minute per user)

-- ── 1. Enforce moderation on uploads ──────────────────────────────────────────
-- Client inserts always get is_approved = false.
-- Only service_role (Edge Functions, nightly-dreams) can set is_approved = true.
-- The feed filter (is_moderated = false OR is_approved = true) still shows
-- unmoderated posts, but prevents client-side moderation bypass.

CREATE OR REPLACE FUNCTION public.enforce_moderation_on_insert()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- Service role callers (Edge Functions, nightly-dreams) can set is_approved
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;
  -- Client callers always start unapproved
  NEW.is_approved := false;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_moderation ON uploads;
CREATE TRIGGER trg_enforce_moderation
  BEFORE INSERT ON uploads
  FOR EACH ROW
  EXECUTE FUNCTION enforce_moderation_on_insert();

-- ── 2. Rate limit comments ────────────────────────────────────────────────────
-- Max 10 comments per minute per user (prevents spam)

CREATE OR REPLACE FUNCTION public.check_comment_rate_limit()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_recent_count int;
BEGIN
  SELECT COUNT(*) INTO v_recent_count
  FROM comments
  WHERE user_id = NEW.user_id
    AND created_at > NOW() - INTERVAL '1 minute';

  IF v_recent_count >= 10 THEN
    RAISE EXCEPTION 'Too many comments. Please wait a moment.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_comment_rate_limit ON comments;
CREATE TRIGGER trg_comment_rate_limit
  BEFORE INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION check_comment_rate_limit();

-- ── 3. Rate limit friend requests ─────────────────────────────────────────────
-- Max 5 friend requests per minute per user (prevents spam)
-- Applied inside send_friend_request RPC since friendships table
-- doesn't have a simple requester column on all rows.

CREATE OR REPLACE FUNCTION public.check_friend_request_rate_limit(p_user_id uuid)
RETURNS boolean LANGUAGE plpgsql AS $$
DECLARE
  v_recent_count int;
BEGIN
  SELECT COUNT(*) INTO v_recent_count
  FROM friendships
  WHERE requester = p_user_id
    AND created_at > NOW() - INTERVAL '1 minute';

  RETURN v_recent_count < 5;
END;
$$;
