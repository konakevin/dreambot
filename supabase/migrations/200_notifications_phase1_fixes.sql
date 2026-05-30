-- 200_notifications_phase1_fixes.sql
--
-- Notifications Phase 1 (kickoff) — fix three silently-broken notification
-- paths and wire two that were never wired. Pure bug-fix migration: no schema
-- changes besides the type CHECK constraint (adds 3 type values).
--
-- See NOTIFICATIONS_ARCHITECTURE.md for the full design and roadmap.
--
-- BUGS FIXED:
--   1. comment_reply notifications never fired (0 ever). The trigger function
--      from migration 068 inserts type 'reply', which isn't in the CHECK
--      constraint — every reply silently violates and is dropped.
--   2. comment_mention notifications never fired (same root cause: type
--      'mention' not in the allowed list).
--   3. follow_accepted notifications never fired (type wasn't in the allowed
--      list either, despite migration 098 having the insert code).
--
-- MISSING TYPES WIRED:
--   4. comment_like — liking a comment now notifies its author (matches
--      IG/TikTok). New trigger on comment_likes.INSERT.
--   5. follow_request — sending a follow request to a private account now
--      notifies the target (was only the *acceptance* notifying). New
--      trigger on follow_requests.INSERT.
--
-- This migration is additive (CHECK adds values; new triggers don't conflict
-- with existing ones). Safe to re-run via IF EXISTS / IF NOT EXISTS guards.

-- ============================================================
-- 1. CHECK constraint — add the three missing types
-- ============================================================

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'post_comment', 'comment_reply', 'comment_mention', 'post_share',
    'friend_request', 'friend_accepted',
    'follow_request', 'follow_accepted',                   -- ADDED
    'dream_nightly', 'dream_wish', 'dream_welcome', 'dream_generated',
    'dream_failed',
    'post_like', 'post_fuse', 'post_twin',
    'post_milestone', 'comment_like',                      -- ADDED comment_like
    'comment',                                             -- legacy, kept
    'download_ready'
  ));

-- ============================================================
-- 2. Rewrite create_comment_notifications with canonical type names
-- ============================================================
-- Replaces the broken version from migration 068 (which inserted 'comment',
-- 'reply', 'mention' — only 'comment' is in the constraint, the other two
-- silently fail). Now uses 'post_comment', 'comment_reply', 'comment_mention'.
-- All other behavior identical: skip self-comment; skip parent author = post
-- owner; bound mentions at 10; skip mentioned = commenter/post-owner/parent.

CREATE OR REPLACE FUNCTION public.create_comment_notifications()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_upload_owner_id  uuid;
  v_parent_author_id uuid;
  v_mentioned_username text;
  v_mentioned_user_id  uuid;
  v_mention_count int := 0;
  v_max_mentions  int := 10;
BEGIN
  -- Notify the post owner (if not self-comment)
  SELECT user_id INTO v_upload_owner_id FROM public.uploads WHERE id = NEW.upload_id;
  IF v_upload_owner_id IS NOT NULL AND v_upload_owner_id != NEW.user_id THEN
    INSERT INTO public.notifications (recipient_id, actor_id, type, upload_id, comment_id, body)
    VALUES (v_upload_owner_id, NEW.user_id, 'post_comment', NEW.upload_id, NEW.id, LEFT(NEW.body, 100));
  END IF;

  -- Notify the parent comment author (replies) — but only if they're not also
  -- the post owner (avoid double-notifying the same person).
  IF NEW.parent_id IS NOT NULL THEN
    SELECT user_id INTO v_parent_author_id FROM public.comments WHERE id = NEW.parent_id;
    IF v_parent_author_id IS NOT NULL
       AND v_parent_author_id != NEW.user_id
       AND v_parent_author_id != COALESCE(v_upload_owner_id, '00000000-0000-0000-0000-000000000000') THEN
      INSERT INTO public.notifications (recipient_id, actor_id, type, upload_id, comment_id, body)
      VALUES (v_parent_author_id, NEW.user_id, 'comment_reply', NEW.upload_id, NEW.id, LEFT(NEW.body, 100));
    END IF;
  END IF;

  -- Notify @mentioned users (capped at v_max_mentions). Skip if the mention
  -- target was already notified above (commenter / post owner / parent author).
  FOR v_mentioned_username IN
    SELECT (regexp_matches(NEW.body, '@([a-zA-Z0-9_.]+)', 'g'))[1]
  LOOP
    v_mention_count := v_mention_count + 1;
    IF v_mention_count > v_max_mentions THEN
      EXIT;
    END IF;

    SELECT id INTO v_mentioned_user_id FROM public.users WHERE username = v_mentioned_username;
    IF v_mentioned_user_id IS NOT NULL
       AND v_mentioned_user_id != NEW.user_id
       AND v_mentioned_user_id != COALESCE(v_upload_owner_id,  '00000000-0000-0000-0000-000000000000')
       AND v_mentioned_user_id != COALESCE(v_parent_author_id, '00000000-0000-0000-0000-000000000000') THEN
      INSERT INTO public.notifications (recipient_id, actor_id, type, upload_id, comment_id, body)
      VALUES (v_mentioned_user_id, NEW.user_id, 'comment_mention', NEW.upload_id, NEW.id, LEFT(NEW.body, 100));
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

-- Trigger already exists from migration 039 (trg_comment_notifications on
-- comments.INSERT calling create_comment_notifications). The CREATE OR
-- REPLACE above swaps the function body in place. No trigger change needed.

-- ============================================================
-- 3. comment_like — new trigger
-- ============================================================
-- comment_likes.INSERT → notify the comment's author (unless they're the liker).

CREATE OR REPLACE FUNCTION public.create_comment_like_notification()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_author_id uuid;
  v_upload_id uuid;
BEGIN
  SELECT user_id, upload_id INTO v_author_id, v_upload_id
    FROM public.comments WHERE id = NEW.comment_id;
  IF v_author_id IS NOT NULL AND v_author_id != NEW.user_id THEN
    INSERT INTO public.notifications (recipient_id, actor_id, type, upload_id, comment_id)
    VALUES (v_author_id, NEW.user_id, 'comment_like', v_upload_id, NEW.comment_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_comment_like ON public.comment_likes;
CREATE TRIGGER trg_notify_comment_like
  AFTER INSERT ON public.comment_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.create_comment_like_notification();

-- ============================================================
-- 4. follow_request — new trigger
-- ============================================================
-- follow_requests.INSERT → notify the target user. The acceptance flow
-- (approve_follow_request RPC, on_user_goes_public trigger) already inserts
-- 'follow_accepted' notifications — those start working now that the CHECK
-- constraint above allows the type.

CREATE OR REPLACE FUNCTION public.create_follow_request_notification()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.target_id IS NOT NULL AND NEW.target_id != NEW.requester_id THEN
    INSERT INTO public.notifications (recipient_id, actor_id, type)
    VALUES (NEW.target_id, NEW.requester_id, 'follow_request');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_follow_request ON public.follow_requests;
CREATE TRIGGER trg_notify_follow_request
  AFTER INSERT ON public.follow_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.create_follow_request_notification();
