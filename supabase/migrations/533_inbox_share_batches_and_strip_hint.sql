-- 533_inbox_share_batches_and_strip_hint.sql — 2026-09-18. INBOX STRIP (Kevin: "if someone sends you multiple posts,
-- it's awkward to tap into one, tap back, tap into the next … it would be nice if you could swipe in between all inbox
-- images"). Two parts land together:
--
-- 1. post_share notifications now group PER SENDER PER DAY ('share:<actor_id>:<yyyy-mm-dd>') instead of per row, so
--    "Alice sent you 4 posts" is ONE inbox row (get_inbox's event_count = the unseen rows). The generic
--    notification_group_key() is untouched; the BEFORE INSERT trigger special-cases shares (it has NEW.actor_id, which
--    the generic function does not take). The live 30-day window is backfilled so today's batches collapse too.
-- 2. user_first_run.seen_inbox_strip_hint — the one-time "Swipe up for the next one" hint in the fullscreen viewer.
BEGIN;

CREATE OR REPLACE FUNCTION public.set_notification_group_key()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.group_key IS NULL THEN
    IF NEW.type = 'post_share' AND NEW.actor_id IS NOT NULL THEN
      NEW.group_key := 'share:' || NEW.actor_id::text || ':'
        || ((COALESCE(NEW.created_at, now()) AT TIME ZONE 'UTC')::date)::text;
    ELSE
      NEW.group_key := public.notification_group_key(
        NEW.id, NEW.type, NEW.subtype, NEW.recipient_id, NEW.upload_id, NEW.comment_id,
        COALESCE(NEW.created_at, now())
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

UPDATE public.notifications
SET group_key = 'share:' || actor_id::text || ':' || ((created_at AT TIME ZONE 'UTC')::date)::text
WHERE type = 'post_share'
  AND actor_id IS NOT NULL
  AND created_at > now() - interval '30 days'
  AND group_key IS DISTINCT FROM ('share:' || actor_id::text || ':' || ((created_at AT TIME ZONE 'UTC')::date)::text);

ALTER TABLE public.user_first_run
  ADD COLUMN IF NOT EXISTS seen_inbox_strip_hint boolean NOT NULL DEFAULT false;

COMMIT;
