-- 359_badge_counts_dreams_individually.sql (2026-07-10)
--
-- The bell/app-icon badge should reflect how many DREAMS are actually waiting.
--
-- Migration 340 made the badge count DISTINCT GROUPS so an aggregated "5 dreams"
-- inbox row = 1 badge unit. But a day's manual dreams collapse into ONE group,
-- so 3 fresh dreams showed a badge of 1 while the inbox row read "3 dreams are
-- ready" — the badge undercounted the thing it's telling you about (Kevin
-- 2026-07-10).
--
-- Fix: badge = SUM over new+unseen groups of
--   • dream groups     → the count of UNSEEN dreams in the group (so 3 = 3), and
--   • every other type → 1 per group (a like-aggregate stays one badge unit).
-- Still gated on last_inbox_view_at, so opening the inbox clears the badge, and
-- on seen_at, so a viewed dream (Dreams-tab auto-ack / opening its notification)
-- drops out — same signals as get_inbox's event_count (migration 358).

BEGIN;

CREATE OR REPLACE FUNCTION public.get_new_notification_count(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  WITH
    viewer AS (SELECT last_inbox_view_at AS lv FROM public.users WHERE id = p_user_id),
    grp AS (
      SELECT
        n.group_key,
        BOOL_OR(n.type = 'dream_generated')          AS is_dream,
        BOOL_OR(n.seen_at IS NULL)                   AS any_unseen,
        COUNT(*) FILTER (WHERE n.seen_at IS NULL)    AS unseen_ct,
        MAX(n.created_at)                            AS last_at
      FROM public.notifications n
      WHERE n.recipient_id = p_user_id
      GROUP BY n.group_key
    )
  SELECT COALESCE(
    SUM(CASE WHEN g.is_dream THEN g.unseen_ct ELSE 1 END),
    0
  )::int
  FROM grp g, viewer v
  WHERE g.any_unseen
    AND (v.lv IS NULL OR g.last_at > v.lv);
$$;

GRANT EXECUTE ON FUNCTION public.get_new_notification_count(uuid) TO authenticated;

COMMIT;
