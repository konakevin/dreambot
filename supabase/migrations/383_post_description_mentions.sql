-- 383_post_description_mentions.sql (2026-07-20)
--
-- @mention notifications for POST DESCRIPTIONS (captions), plus block-respect +
-- case-insensitive matching on the existing comment-mention path.
--
-- Today: @username in a comment notifies (type 'comment_mention', migration 200);
-- @username in a post DESCRIPTION renders as a tappable link (lib/mentions.ts)
-- but notifies NOBODY. This adds a new 'post_mention' type + an uploads trigger.
--
-- Kevin 2026-07-20 decisions:
--   • Fire ONLY when a post is PUBLISHED for the first time (posted_at goes
--     NULL→non-NULL) — never on a later description EDIT, never on re-publish
--     ("Share again" keeps posted_at), never on a private post (you can't see it).
--   • Case-INSENSITIVE username match (mirrors the tappable link's ilike, so the
--     link and the notification stay consistent).
--   • Respect blocks (skip if either party blocked the other).
--   • De-dupe multiple mentions of the same user in one caption; cap at 10.
--
-- Routing needs NO change: a post_mention carries upload_id + NULL comment_id, so
-- lib/notificationRouting.ts falls through to /photo/<upload_id> (opens the post).
--
-- Run in the Supabase dashboard SQL editor.

BEGIN;

-- ── 1. Allow the new type ──────────────────────────────────────────────────────
-- Full list carried from migration 334 + 'post_mention'.
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'post_comment', 'comment_reply', 'comment_mention', 'post_mention', 'post_share',
    'friend_request', 'friend_accepted',
    'follow_request', 'follow_accepted',
    'dream_nightly', 'dream_wish', 'dream_welcome', 'dream_generated',
    'dream_failed',
    'post_like', 'post_repost',
    'post_milestone', 'comment_like',
    'comment',
    'download_ready',
    'report',
    'sparkle_gift',
    'announcement'
  ));

-- ── 2. Category → 'Mentions' (else it defaults to 'Your dreams') ────────────────
-- CREATE OR REPLACE carried from migration 254 + the post_mention row.
CREATE OR REPLACE FUNCTION public.notification_category(p_type text)
RETURNS text
LANGUAGE sql IMMUTABLE
SET search_path = ''
AS $$
  SELECT CASE p_type
    WHEN 'post_like'        THEN 'Likes'
    WHEN 'comment_like'     THEN 'Likes'
    WHEN 'post_milestone'   THEN 'Likes'
    WHEN 'post_comment'     THEN 'Comments'
    WHEN 'comment_reply'    THEN 'Comments'
    WHEN 'comment_mention'  THEN 'Mentions'
    WHEN 'post_mention'     THEN 'Mentions'
    WHEN 'post_share'       THEN 'Shares'
    WHEN 'post_repost'      THEN 'Reposts'
    WHEN 'follow_request'   THEN 'Follows'
    WHEN 'follow_accepted'  THEN 'Follows'
    WHEN 'friend_request'   THEN 'Follows'
    WHEN 'friend_accepted'  THEN 'Follows'
    WHEN 'dream_generated'  THEN 'Your dreams'
    WHEN 'dream_failed'     THEN 'Your dreams'
    WHEN 'dream_nightly'    THEN 'Your dreams'
    WHEN 'dream_wish'       THEN 'Your dreams'
    WHEN 'dream_welcome'    THEN 'Your dreams'
    WHEN 'download_ready'   THEN 'Your dreams'
    ELSE                         'Your dreams'
  END;
$$;

-- ── 3. group_key — one inbox row per post_mention (individual, never collapses) ─
-- CREATE OR REPLACE carried from migration 360 + the post_mention row.
CREATE OR REPLACE FUNCTION public.notification_group_key(
  p_id           uuid,
  p_type         text,
  p_subtype      text,
  p_recipient_id uuid,
  p_upload_id    uuid,
  p_comment_id   uuid,
  p_created_at   timestamptz
) RETURNS text
LANGUAGE sql IMMUTABLE
SET search_path = ''
AS $$
  SELECT CASE p_type
    WHEN 'post_like'        THEN 'like:post:'        || COALESCE(p_upload_id::text,  p_id::text)
    WHEN 'comment_like'     THEN 'clike:comment:'    || COALESCE(p_comment_id::text, p_id::text)
    WHEN 'post_twin'        THEN 'twin:post:'        || COALESCE(p_upload_id::text,  p_id::text)
    WHEN 'post_fuse'        THEN 'fuse:post:'        || COALESCE(p_upload_id::text,  p_id::text)
    WHEN 'post_milestone'   THEN 'milestone:post:'   || COALESCE(p_upload_id::text,  p_id::text)
    WHEN 'follow_accepted'  THEN 'follow:'           || p_recipient_id::text
    WHEN 'friend_accepted'  THEN 'friend:'           || p_recipient_id::text
    WHEN 'post_comment'     THEN 'comment:'          || p_id::text
    WHEN 'comment_reply'    THEN 'reply:'            || p_id::text
    WHEN 'comment_mention'  THEN 'mention:'          || p_id::text
    WHEN 'post_mention'     THEN 'pmention:'         || p_id::text
    WHEN 'post_share'       THEN 'share:'            || p_id::text
    WHEN 'follow_request'   THEN 'freq:'             || p_id::text
    WHEN 'friend_request'   THEN 'frreq:'            || p_id::text
    WHEN 'dream_generated'  THEN 'dream:'            || p_id::text
    WHEN 'dream_failed'     THEN 'dreamfail:'        || p_id::text
    WHEN 'download_ready'   THEN 'download:'         || p_id::text
    ELSE                         'system:'           || p_id::text
  END;
$$;

-- ── 4. Description-mention trigger ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.create_post_mention_notifications()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_owner_id     uuid := NEW.user_id;
  v_username     text;
  v_mentioned_id uuid;
  v_count        int := 0;
  v_max          int := 10;
BEGIN
  -- FIRST-PUBLISH ONLY. posted_at goes NULL→non-NULL exactly once (the compose
  -- flow sets is_public + posted_at + description together). Re-publish
  -- ("Share again") keeps posted_at, and a plain caption edit never touches it,
  -- so neither re-fires. Private posts (posted_at NULL) never fire.
  IF NEW.posted_at IS NULL THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.posted_at IS NOT NULL THEN
    RETURN NEW;
  END IF;
  IF NEW.is_public IS NOT TRUE THEN
    RETURN NEW;
  END IF;
  IF NEW.description IS NULL OR NEW.description = '' THEN
    RETURN NEW;
  END IF;

  -- DISTINCT + lower() = de-dupe + case-insensitive. Regex mirrors the tappable
  -- link tokenizer (lib/hashtags.ts CAPTION_TOKEN_RE) so what links == what notifies.
  FOR v_username IN
    SELECT DISTINCT lower((regexp_matches(NEW.description, '@([a-zA-Z0-9_.]+)', 'g'))[1])
  LOOP
    v_count := v_count + 1;
    IF v_count > v_max THEN
      EXIT;
    END IF;

    SELECT id INTO v_mentioned_id FROM public.users WHERE lower(username) = v_username;
    IF v_mentioned_id IS NOT NULL
       AND v_mentioned_id != v_owner_id                          -- not the poster themselves
       AND NOT public.block_exists(v_owner_id, v_mentioned_id)   -- respect blocks (either way)
    THEN
      INSERT INTO public.notifications (recipient_id, actor_id, type, upload_id, comment_id, body)
      VALUES (v_mentioned_id, v_owner_id, 'post_mention', NEW.id, NULL, LEFT(NEW.description, 100));
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

-- Fire on INSERT (a gallery host inserted already-published) and on the
-- first-publish UPDATE (posted_at written). A re-publish doesn't SET posted_at,
-- so `UPDATE OF posted_at` won't even fire for it; the guard above is the belt.
DROP TRIGGER IF EXISTS trg_post_mention_notifications ON public.uploads;
CREATE TRIGGER trg_post_mention_notifications
  AFTER INSERT OR UPDATE OF posted_at ON public.uploads
  FOR EACH ROW EXECUTE FUNCTION public.create_post_mention_notifications();

-- ── 5. Comment notifications: case-insensitive mentions + block-respect + dedup ─
-- CREATE OR REPLACE carried from migration 200. Changes: (a) all three inserts
-- now skip blocked pairs; (b) the mention lookup is case-insensitive + DISTINCT.
-- (223's notify_on_comment() is dead orphan code — the live trigger from
-- migration 039 calls create_comment_notifications, which is what we replace.)
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
  -- Notify the post owner (not self, not a blocked pair).
  SELECT user_id INTO v_upload_owner_id FROM public.uploads WHERE id = NEW.upload_id;
  IF v_upload_owner_id IS NOT NULL
     AND v_upload_owner_id != NEW.user_id
     AND NOT public.block_exists(NEW.user_id, v_upload_owner_id) THEN
    INSERT INTO public.notifications (recipient_id, actor_id, type, upload_id, comment_id, body)
    VALUES (v_upload_owner_id, NEW.user_id, 'post_comment', NEW.upload_id, NEW.id, LEFT(NEW.body, 100));
  END IF;

  -- Notify the parent comment author on replies (not self, not the post owner
  -- already notified, not a blocked pair).
  IF NEW.parent_id IS NOT NULL THEN
    SELECT user_id INTO v_parent_author_id FROM public.comments WHERE id = NEW.parent_id;
    IF v_parent_author_id IS NOT NULL
       AND v_parent_author_id != NEW.user_id
       AND v_parent_author_id != COALESCE(v_upload_owner_id, '00000000-0000-0000-0000-000000000000')
       AND NOT public.block_exists(NEW.user_id, v_parent_author_id) THEN
      INSERT INTO public.notifications (recipient_id, actor_id, type, upload_id, comment_id, body)
      VALUES (v_parent_author_id, NEW.user_id, 'comment_reply', NEW.upload_id, NEW.id, LEFT(NEW.body, 100));
    END IF;
  END IF;

  -- Notify @mentioned users. DISTINCT + lower() = case-insensitive dedup (was a
  -- case-SENSITIVE exact match). Skip self / already-notified owner+parent /
  -- blocked pairs. Capped.
  FOR v_mentioned_username IN
    SELECT DISTINCT lower((regexp_matches(NEW.body, '@([a-zA-Z0-9_.]+)', 'g'))[1])
  LOOP
    v_mention_count := v_mention_count + 1;
    IF v_mention_count > v_max_mentions THEN
      EXIT;
    END IF;

    SELECT id INTO v_mentioned_user_id FROM public.users WHERE lower(username) = v_mentioned_username;
    IF v_mentioned_user_id IS NOT NULL
       AND v_mentioned_user_id != NEW.user_id
       AND v_mentioned_user_id != COALESCE(v_upload_owner_id,  '00000000-0000-0000-0000-000000000000')
       AND v_mentioned_user_id != COALESCE(v_parent_author_id, '00000000-0000-0000-0000-000000000000')
       AND NOT public.block_exists(NEW.user_id, v_mentioned_user_id) THEN
      INSERT INTO public.notifications (recipient_id, actor_id, type, upload_id, comment_id, body)
      VALUES (v_mentioned_user_id, NEW.user_id, 'comment_mention', NEW.upload_id, NEW.id, LEFT(NEW.body, 100));
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

COMMIT;
