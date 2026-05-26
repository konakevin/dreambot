-- ============================================================
-- 190 — Drop the dead `friendships` table
-- ============================================================
-- Migration 116 ("Instagram privacy refactor") killed the friendship model
-- (dropped the friend-request RPCs + triggers) but KEPT the table "for rollback
-- safety". It's had no writers since. Verified there are no remaining
-- references before dropping:
--   • get_friend_ids — dropped in 116
--   • get_friends_feed / friend triggers — dropped in 116
--   • get_shareable_vibers — rewritten to the follow model in 189
--   • no app/hook/Edge-Function code reads the `friendships` table
-- CASCADE cleans up the table's own RLS policies + FK constraints.
-- ============================================================

DROP TABLE IF EXISTS public.friendships CASCADE;
