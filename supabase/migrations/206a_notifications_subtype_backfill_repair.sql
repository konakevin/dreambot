-- Migration 206a: re-run the notifications backfill from migration 206.
--
-- Why: 206's first attempt failed on the get_inbox CREATE OR REPLACE (a
-- separate fix was needed to DROP first — cannot change return type of
-- existing function, 42P13). The Supabase SQL editor's transaction
-- semantics meant the backfill UPDATEs either rolled back with the failure
-- OR weren't included in the targeted re-run.
--
-- Post-206 verification on live data showed:
--   • `subtype` column present ✓
--   • subtype values set for wish/welcome/failed/download rows ✓
--   • BUT 696 rows still carry the legacy body prefix ✗
--     (most are dream_generated rows with body='dream:...' — that UPDATE
--      doesn't set a subtype, only strips the prefix from body, so the
--      `subtype IS NULL` guard alone can't tell whether the prefix has
--      already been stripped).
--
-- This migration re-runs the 5 backfills with stronger guards:
--   • For wish/welcome/failed/download: still guarded by `subtype IS NULL`
--     AND `body LIKE '<prefix>:%'` — idempotent (anything already migrated
--     has subtype set).
--   • For the dream_generated 'dream:' strip: guarded by `body LIKE 'dream:%'`
--     only (since no subtype is set on success; the LIKE guard is what
--     prevents double-stripping).
--
-- After this runs, no row should have body starting with any legacy prefix.

-- 'wish:' → subtype='wish' + strip
update public.notifications
   set subtype = 'wish',
       body    = substring(body from 6)
 where subtype is null
   and type = 'dream_generated'
   and body like 'wish:%';

-- 'welcome:' → subtype='welcome' + strip
update public.notifications
   set subtype = 'welcome',
       body    = substring(body from 9)
 where subtype is null
   and type = 'dream_generated'
   and body like 'welcome:%';

-- 'dream:' on dream_generated → no subtype change, just strip
-- Guarded only by body LIKE — safe to re-run because each pass strips ONE
-- prefix and subsequent passes find no matches.
update public.notifications
   set body = substring(body from 7)
 where type = 'dream_generated'
   and body like 'dream:%';

-- 'dream:' on dream_failed → subtype='failed' + strip
update public.notifications
   set subtype = 'failed',
       body    = substring(body from 7)
 where subtype is null
   and type = 'dream_failed'
   and body like 'dream:%';

-- 'download:' → subtype='download' + strip
update public.notifications
   set subtype = 'download',
       body    = substring(body from 10)
 where subtype is null
   and type = 'download_ready'
   and body like 'download:%';
