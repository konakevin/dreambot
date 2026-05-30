-- 201_notifications_group_key.sql
--
-- Notifications Phase 1, step 2 — add the aggregation primitive (`group_key`).
-- Every notification row gets a deterministic text key encoding "what this
-- aggregates around"; the grouped inbox RPC (migration 202) reads rows
-- bucketed by it.
--
-- See NOTIFICATIONS_ARCHITECTURE.md §4a for the per-type pattern.
--
-- Self-contained: adds a column, a trigger that populates it on INSERT,
-- a backfill of all existing rows, and a (recipient_id, group_key) index.
-- No breaking changes — readers that don't know about group_key still work.

-- ============================================================
-- 1. Column
-- ============================================================

ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS group_key text;

-- ============================================================
-- 2. Helper — compute group_key for a (type, upload_id, comment_id, recipient_id, id)
-- ============================================================
-- Pattern rules from NOTIFICATIONS_ARCHITECTURE.md §4a:
--   aggregating types use a TARGET-shaped key (so many actors collapse)
--   individual types use the row's own id (no collapse)

CREATE OR REPLACE FUNCTION public.notification_group_key(
  p_id           uuid,
  p_type         text,
  p_recipient_id uuid,
  p_upload_id    uuid,
  p_comment_id   uuid
) RETURNS text
LANGUAGE sql IMMUTABLE
SET search_path = ''
AS $$
  SELECT CASE p_type
    -- ── aggregating types — key = "kind:target" so siblings collapse ──
    WHEN 'post_like'        THEN 'like:post:'        || COALESCE(p_upload_id::text,  p_id::text)
    WHEN 'comment_like'     THEN 'clike:comment:'    || COALESCE(p_comment_id::text, p_id::text)
    WHEN 'post_twin'        THEN 'twin:post:'        || COALESCE(p_upload_id::text,  p_id::text)
    WHEN 'post_fuse'        THEN 'fuse:post:'        || COALESCE(p_upload_id::text,  p_id::text)
    WHEN 'post_milestone'   THEN 'milestone:post:'   || COALESCE(p_upload_id::text,  p_id::text)
    WHEN 'follow_accepted'  THEN 'follow:'           || p_recipient_id::text
    WHEN 'friend_accepted'  THEN 'friend:'           || p_recipient_id::text
    -- ── individual types — key is the row's own id (unique, never collapses) ──
    WHEN 'post_comment'     THEN 'comment:'          || p_id::text
    WHEN 'comment_reply'    THEN 'reply:'            || p_id::text
    WHEN 'comment_mention'  THEN 'mention:'          || p_id::text
    WHEN 'post_share'       THEN 'share:'            || p_id::text
    WHEN 'follow_request'   THEN 'freq:'             || p_id::text
    WHEN 'friend_request'   THEN 'frreq:'            || p_id::text
    WHEN 'dream_generated'  THEN 'dream:'            || p_id::text
    WHEN 'dream_failed'     THEN 'dreamfail:'        || p_id::text
    WHEN 'download_ready'   THEN 'download:'         || p_id::text
    -- Legacy / unknown / dream_nightly / dream_wish / dream_welcome / 'comment'
    -- — fall back to row id so they never collapse, but stay queryable.
    ELSE                         'system:'           || p_id::text
  END;
$$;

-- ============================================================
-- 3. BEFORE INSERT trigger — auto-populate group_key
-- ============================================================
-- Runs server-side so no caller needs to know the rules; runs BEFORE INSERT so
-- the value lands on the same row (no second UPDATE). If a caller already set
-- group_key explicitly, respect it (don't clobber).

CREATE OR REPLACE FUNCTION public.set_notification_group_key()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.group_key IS NULL THEN
    NEW.group_key := public.notification_group_key(
      NEW.id, NEW.type, NEW.recipient_id, NEW.upload_id, NEW.comment_id
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_notification_group_key ON public.notifications;
CREATE TRIGGER trg_set_notification_group_key
  BEFORE INSERT ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.set_notification_group_key();

-- ============================================================
-- 4. Backfill existing rows
-- ============================================================
-- One-time, idempotent (only touches NULL group_key). Cheap — the function is
-- pure SQL with no joins; one pass over the table.

UPDATE public.notifications
   SET group_key = public.notification_group_key(id, type, recipient_id, upload_id, comment_id)
 WHERE group_key IS NULL;

-- ============================================================
-- 5. Index for the grouped reads (migration 202 uses this)
-- ============================================================
-- Hot path: "the recipient's most recent unread groups." Index on
-- (recipient_id, group_key) lets the get_inbox RPC bucket rows fast; including
-- created_at lets it pick the latest row per group without a second sort.

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_group
  ON public.notifications (recipient_id, group_key, created_at DESC);
