-- 225_dedup_download_ready.sql
--
-- Duplicate download_ready pushes (2026-06-05):
--
-- Kevin reported tapping an "HD download ready" push, landing on the photo
-- screen, and getting a SECOND push for the same upload while the in-app
-- save was still in progress. Root cause is a TOCTOU race in
-- upscale-image/index.ts:110-121 — the dedup SELECT can miss a concurrent
-- INSERT, so two upscale_requests rows for the same (upload_id, user_id)
-- can land. The notify loop then iterates "pending" with TWO rows for the
-- same user and inserts TWO download_ready notifications → two pushes.
--
-- Two structural fixes here:
--
--   1. Partial unique index on upscale_requests (upload_id, user_id) WHERE
--      notified_at IS NULL. Lets a user re-request after a previous
--      notification has been sent (separate save for the same upload weeks
--      later still works) but blocks two concurrent un-notified rows. Paired
--      with an UPSERT (ON CONFLICT DO NOTHING) in upscale-image so the race
--      collapses to one row.
--
--   2. download_ready group_key now uses p_upload_id (was the row's own id).
--      Two notifications for the same upload now share a group_key, so the
--      send-push "sibling-acknowledged" gate (added in the same commit as
--      this migration) can find them and suppress the second push when the
--      first was already tapped.
--
-- Backfill: existing duplicate upscale_requests rows with notified_at IS NULL
-- get notified_at set to now() so the unique index can land cleanly. They've
-- effectively already missed the notification anyway (the prior request
-- already fired one, or the upscale already completed) — the inbox row for
-- the duplicate would have been a re-notification of state the user already
-- saw.

BEGIN;

-- ── 1. Backfill: close out duplicate un-notified rows ──
-- For each (upload_id, user_id) with multiple un-notified rows, keep the
-- oldest and mark the rest notified_at = now() (won't fire a push because
-- send-push isn't called on UPDATE; we're just unblocking the unique index).
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY upload_id, user_id
           ORDER BY created_at ASC, id ASC
         ) AS rn
  FROM public.upscale_requests
  WHERE notified_at IS NULL
)
UPDATE public.upscale_requests
SET notified_at = now()
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- ── 2. Partial unique index ──
-- Only constrains "pending" rows. A user with a completed request can re-
-- request the same upload (new row, fresh upscale) without hitting this.
CREATE UNIQUE INDEX IF NOT EXISTS uq_upscale_requests_pending
  ON public.upscale_requests (upload_id, user_id)
  WHERE notified_at IS NULL;

-- ── 3. download_ready group_key uses upload_id ──
-- Was: 'download:' || p_id (row's own id — siblings never collapse)
-- Now: 'download:' || p_upload_id (siblings for the same upload share a key)
-- Function body is otherwise byte-identical to migration 201's version.
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
    -- aggregating types — key = "kind:target" so siblings collapse
    WHEN 'post_like'        THEN 'like:post:'        || COALESCE(p_upload_id::text,  p_id::text)
    WHEN 'comment_like'     THEN 'clike:comment:'    || COALESCE(p_comment_id::text, p_id::text)
    WHEN 'post_twin'        THEN 'twin:post:'        || COALESCE(p_upload_id::text,  p_id::text)
    WHEN 'post_fuse'        THEN 'fuse:post:'        || COALESCE(p_upload_id::text,  p_id::text)
    WHEN 'post_milestone'   THEN 'milestone:post:'   || COALESCE(p_upload_id::text,  p_id::text)
    WHEN 'follow_accepted'  THEN 'follow:'           || p_recipient_id::text
    WHEN 'friend_accepted'  THEN 'friend:'           || p_recipient_id::text
    -- download_ready joins the aggregating group — was per-row, now per-upload
    WHEN 'download_ready'   THEN 'download:'         || COALESCE(p_upload_id::text,  p_id::text)
    -- individual types — key is the row's own id (unique, never collapses)
    WHEN 'post_comment'     THEN 'comment:'          || p_id::text
    WHEN 'comment_reply'    THEN 'reply:'            || p_id::text
    WHEN 'comment_mention'  THEN 'mention:'          || p_id::text
    WHEN 'post_share'       THEN 'share:'            || p_id::text
    WHEN 'follow_request'   THEN 'freq:'             || p_id::text
    WHEN 'friend_request'   THEN 'frreq:'            || p_id::text
    WHEN 'dream_generated'  THEN 'dream:'            || p_id::text
    WHEN 'dream_failed'     THEN 'dreamfail:'        || p_id::text
    -- Legacy / unknown — fall back to row id so they never collapse.
    ELSE                         'system:'           || p_id::text
  END;
$$;

COMMIT;
