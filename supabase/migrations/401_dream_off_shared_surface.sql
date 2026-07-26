-- 401_dream_off_shared_surface.sql (2026-07-26)
--
-- Dream Off — Step 1 cont. (DREAM_OFF_BUILD_PLAN.md §1 A1). The ONLY changes to
-- LIVE shared tables the feature needs: two additive CHECK widenings so a game
-- entry render + the Dream Off notification types are ACCEPTED. Both are strict
-- SUPERSETS (every currently-valid value still passes) → no existing row
-- violates them, ms-lock, no table rewrite. Nothing yet emits these values
-- (RPCs/edge come later + the flag is false), so this is inert until wired.
--
-- Must land BEFORE the RPC/phase-machine/edge stages (a dream_off row/notif must
-- never precede the CHECK that allows it). Re-runnable.

BEGIN;

-- ── 1. dream_queue.source: allow game entry renders (source='dream_off') ──────
-- The source CHECK is the inline unnamed one from migration 156 (the only
-- definer) → auto-named `dream_queue_source_check`. If a hand-apply ever renamed
-- it, verify with:
--   SELECT conname FROM pg_constraint
--   WHERE conrelid='public.dream_queue'::regclass AND contype='c'
--     AND pg_get_constraintdef(oid) LIKE '%source%';
-- and use the real name below.
ALTER TABLE public.dream_queue DROP CONSTRAINT IF EXISTS dream_queue_source_check;
ALTER TABLE public.dream_queue ADD CONSTRAINT dream_queue_source_check
  CHECK (source IN ('first_dream', 'nightly', 'create', 'dlt', 'dream_off'));

-- ── 2. notifications.type: add the 6 Dream Off types ──────────────────────────
-- The FULL migration-387 list is reproduced VERBATIM then appended. Rebuilding
-- this CHECK from a stale/partial list silently drops a type (the 384/385
-- regression that migration 387 itself fixed) — so never trim it.
-- (No notification_category change needed: the 6 new types fall through its
-- `ELSE 'Your dreams'` branch, so they surface + push under "Your dreams" for
-- v1. A dedicated 'Dream Off' category + preference is a fast-follow.)
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
    'welcome_gift',
    'announcement',
    'trial_reminder',
    'pro_reminder',
    'basic_reminder',
    -- ── Dream Off (migration 401) ──
    'dream_off_invite', 'dream_off_your_turn', 'dream_off_voting_open',
    'dream_off_results', 'dream_off_nudge', 'dream_off_pot_refund'
  ));

COMMIT;
