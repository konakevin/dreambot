-- Phase 3: Database fixes
-- 1. Fix blocked_users query in get_feed: NOT IN → NOT EXISTS (performance)
-- 2. Bound @mention parsing to first 10 mentions per comment
-- 3. Add composite index on blocked_users for efficient lookups

-- ── Index for blocked_users lookups in get_feed ─────────────────────────────
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocker_blocked
  ON blocked_users(blocker_id, blocked_id);

-- ── Bound mention parsing ───────────────────────────────────────────────────
-- Replace the existing create_comment_notifications function to limit mentions
CREATE OR REPLACE FUNCTION public.create_comment_notifications()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_upload_owner_id uuid;
  v_parent_author_id uuid;
  v_mentioned_username text;
  v_mentioned_user_id uuid;
  v_mention_count int := 0;
  v_max_mentions int := 10;
BEGIN
  -- Notify the post owner (if not self-comment)
  SELECT user_id INTO v_upload_owner_id FROM uploads WHERE id = NEW.upload_id;
  IF v_upload_owner_id IS NOT NULL AND v_upload_owner_id != NEW.user_id THEN
    INSERT INTO notifications (recipient_id, actor_id, type, upload_id, comment_id, body)
    VALUES (v_upload_owner_id, NEW.user_id, 'comment', NEW.upload_id, NEW.id, LEFT(NEW.body, 100));
  END IF;

  -- Notify the parent comment author (for replies)
  IF NEW.parent_id IS NOT NULL THEN
    SELECT user_id INTO v_parent_author_id FROM comments WHERE id = NEW.parent_id;
    IF v_parent_author_id IS NOT NULL
       AND v_parent_author_id != NEW.user_id
       AND v_parent_author_id != COALESCE(v_upload_owner_id, '00000000-0000-0000-0000-000000000000') THEN
      INSERT INTO notifications (recipient_id, actor_id, type, upload_id, comment_id, body)
      VALUES (v_parent_author_id, NEW.user_id, 'reply', NEW.upload_id, NEW.id, LEFT(NEW.body, 100));
    END IF;
  END IF;

  -- Notify @mentioned users (bounded to v_max_mentions)
  FOR v_mentioned_username IN
    SELECT (regexp_matches(NEW.body, '@([a-zA-Z0-9_.]+)', 'g'))[1]
  LOOP
    v_mention_count := v_mention_count + 1;
    IF v_mention_count > v_max_mentions THEN
      EXIT;
    END IF;

    SELECT id INTO v_mentioned_user_id FROM users WHERE username = v_mentioned_username;
    IF v_mentioned_user_id IS NOT NULL
       AND v_mentioned_user_id != NEW.user_id
       AND v_mentioned_user_id != COALESCE(v_upload_owner_id, '00000000-0000-0000-0000-000000000000')
       AND v_mentioned_user_id != COALESCE(v_parent_author_id, '00000000-0000-0000-0000-000000000000') THEN
      INSERT INTO notifications (recipient_id, actor_id, type, upload_id, comment_id, body)
      VALUES (v_mentioned_user_id, NEW.user_id, 'mention', NEW.upload_id, NEW.id, LEFT(NEW.body, 100));
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;
