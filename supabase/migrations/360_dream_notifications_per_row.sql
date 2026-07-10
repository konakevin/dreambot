-- 360_dream_notifications_per_row.sql (2026-07-10)
--
-- Stop aggregating manual dreams in the inbox — show ONE notification row per
-- dream again (Kevin 2026-07-10). This reverts migration 340's manual-dream
-- day-bucket group_key; every dream_generated row goes back to its own per-row
-- key `dream:<id>` (the same shape nightly/welcome/first-dream already use).
--
-- Kept from 340/358/359 (they still make sense per-row):
--   • get_inbox.event_count = unseen count (per row → 0 or 1; the dead
--     "N dreams are ready" copy branch is removed client-side).
--   • badge = SUM of unseen dreams (per-row → each dream is its own +1, so 3
--     ready dreams still badge as 3).
--   • seen_at acknowledgment on view (Dreams-tab auto-ack / opening a dream).
--
-- Signature is unchanged (still the 7-arg form from 340) so the BEFORE INSERT
-- trigger needs no change — p_subtype/p_created_at are simply no longer read.
-- CREATE OR REPLACE (same return type). Plus a scoped one-time re-key so the
-- ALREADY-aggregated manual dreams split back into individual rows immediately.

BEGIN;

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
    -- ── aggregating types — key = "kind:target" so siblings collapse ──
    WHEN 'post_like'        THEN 'like:post:'        || COALESCE(p_upload_id::text,  p_id::text)
    WHEN 'comment_like'     THEN 'clike:comment:'    || COALESCE(p_comment_id::text, p_id::text)
    WHEN 'post_twin'        THEN 'twin:post:'        || COALESCE(p_upload_id::text,  p_id::text)
    WHEN 'post_fuse'        THEN 'fuse:post:'        || COALESCE(p_upload_id::text,  p_id::text)
    WHEN 'post_milestone'   THEN 'milestone:post:'   || COALESCE(p_upload_id::text,  p_id::text)
    WHEN 'follow_accepted'  THEN 'follow:'           || p_recipient_id::text
    WHEN 'friend_accepted'  THEN 'friend:'           || p_recipient_id::text
    -- ── individual types — key is the row's own id (never collapses) ──
    WHEN 'post_comment'     THEN 'comment:'          || p_id::text
    WHEN 'comment_reply'    THEN 'reply:'            || p_id::text
    WHEN 'comment_mention'  THEN 'mention:'          || p_id::text
    WHEN 'post_share'       THEN 'share:'            || p_id::text
    WHEN 'follow_request'   THEN 'freq:'             || p_id::text
    WHEN 'friend_request'   THEN 'frreq:'            || p_id::text
    -- Dreams are now ALWAYS per-row (no manual day-bucket) — one inbox row each.
    WHEN 'dream_generated'  THEN 'dream:'            || p_id::text
    WHEN 'dream_failed'     THEN 'dreamfail:'        || p_id::text
    WHEN 'download_ready'   THEN 'download:'         || p_id::text
    ELSE                         'system:'           || p_id::text
  END;
$$;

-- One-time re-key: split the already-aggregated manual dreams back into their
-- own rows. Scoped to manual dream_generated only; idempotent (per-row rows just
-- get set to their own id again). group_key has no unique constraint, and id is
-- unique, so no collisions.
UPDATE public.notifications
SET group_key = 'dream:' || id::text
WHERE type = 'dream_generated'
  AND subtype = 'manual';

COMMIT;
