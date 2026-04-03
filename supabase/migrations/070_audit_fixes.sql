-- Migration 070: Audit fixes
-- 1. Rate limit post shares (max 20 per minute per user)
-- 2. Tighten uploads SELECT RLS policy to enforce is_approved

-- ── 1. Rate limit post shares ────────────────────────────────────────────────
-- Max 20 shares per minute per user (prevents spam)

CREATE OR REPLACE FUNCTION public.check_share_rate_limit()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_recent_count int;
BEGIN
  SELECT COUNT(*) INTO v_recent_count
  FROM post_shares
  WHERE sender_id = NEW.sender_id
    AND created_at > NOW() - INTERVAL '1 minute';

  IF v_recent_count >= 20 THEN
    RAISE EXCEPTION 'Too many shares. Please wait a moment.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_share_rate_limit ON post_shares;
CREATE TRIGGER trg_share_rate_limit
  BEFORE INSERT ON post_shares
  FOR EACH ROW
  EXECUTE FUNCTION check_share_rate_limit();

-- ── 2. Tighten uploads SELECT RLS policy ─────────────────────────────────────
-- Old policy: is_active = true (allowed viewing unapproved posts via direct query)
-- New policy: is_active = true AND (is_approved = true OR is_moderated = false)
-- This matches the feed filter logic: unmoderated posts are visible,
-- but moderated-and-rejected posts are hidden even from direct queries.

DROP POLICY IF EXISTS "Approved uploads are viewable by everyone" ON public.uploads;
CREATE POLICY "Approved uploads are viewable by everyone"
  ON public.uploads FOR SELECT
  USING (is_active = true AND (is_approved = true OR is_moderated = false));

-- Allow users to always see their own uploads (even if rejected)
DROP POLICY IF EXISTS "Users can view their own uploads" ON public.uploads;
CREATE POLICY "Users can view their own uploads"
  ON public.uploads FOR SELECT
  USING (auth.uid() = user_id);

-- ── 3. Enforce friend request rate limit ──────────────────────────────────────
-- Migration 069 defined check_friend_request_rate_limit() but never wired it up.
-- Fix: update send_friend_request to call the check before inserting.

CREATE OR REPLACE FUNCTION public.send_friend_request(p_target_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  v_user_a uuid;
  v_user_b uuid;
BEGIN
  IF p_target_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot friend yourself';
  END IF;

  -- Enforce rate limit (max 5 per minute)
  IF NOT check_friend_request_rate_limit(auth.uid()) THEN
    RAISE EXCEPTION 'Too many friend requests. Please wait a moment.';
  END IF;

  v_user_a := LEAST(auth.uid(), p_target_id);
  v_user_b := GREATEST(auth.uid(), p_target_id);

  INSERT INTO public.friendships (user_a, user_b, status, requester)
  VALUES (v_user_a, v_user_b, 'pending', auth.uid())
  ON CONFLICT (user_a, user_b) DO NOTHING;
END;
$$;
