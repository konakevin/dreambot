-- 327_shuffle_bot_post_dates.sql (2026-07-06)
--
-- ✅ APPLIED 2026-07-06 (and backup table dropped after Kevin approved the
-- result). OPERATIONAL LESSON: the dashboard SQL editor executed this script
-- PIECEMEAL over a pooled connection — the BEGIN/COMMIT wrapper did NOT hold
-- (the backup CREATE committed alone while the timed-out UPDATE rolled back
-- alone on attempt 1; on the retry the UPDATE committed but the verification
-- DO-block timed out, reporting failure for a run that had succeeded). For
-- bulk DML, run against a DIRECT session connection (psql / node pg on the
-- session pooler, port 5432) where transactions are real — the dashboard is
-- only trustworthy for single-statement work. Also: PostgREST cannot see
-- newly-created tables until its schema cache reloads — do not use REST 404s
-- to conclude a table doesn't exist.
--
-- ONE-TIME data shuffle (Kevin): bot test batches posted in clumps (6-10
-- renders in a row) dominate profile + feed chronology. This permutes the
-- (created_at, posted_at) pairs AMONG each bot's own posted uploads — same
-- multiset of timestamps per bot (cadence/history density unchanged,
-- bot_schedules.last_posted_at still matches the newest post), but WHICH
-- render sits at each moment is randomized. Scope: is_bot users' uploads
-- with is_posted AND is_active (pre-verified 2026-07-06: 22,127 rows, zero
-- NULL posted_at, zero posted-but-inactive).
--
-- SAFETY (3 layers):
--   1. Full snapshot table _backup_bot_post_dates_2026_07_06 (rollback below).
--   2. The whole script is ONE transaction.
--   3. A post-update assertion compares per-bot row counts + timestamp
--      checksums against the pre-state and RAISEs on ANY mismatch, which
--      rolls back EVERYTHING automatically.
--
-- Only created_at + posted_at are written. No other column is touched.

BEGIN;

-- Give the statement room + skip per-row triggers for this bulk rewrite.
-- The dashboard editor's upstream ceiling killed attempt #1 (2026-07-06):
-- the shuffle math is instant, but 22k rows × (sanitize trigger + search_tsv
-- recompute + a realtime event each) blew the budget. This update touches
-- ONLY created_at/posted_at — no text to sanitize, no tsv change needed —
-- so `replica` mode (skips user triggers + logical-replication/realtime
-- emission for this session) is safe AND makes it run in seconds. The
-- TRANSACTION-scoped SETs revert automatically at COMMIT/ROLLBACK.
SET LOCAL statement_timeout = '8min';
SET LOCAL session_replication_role = replica;

-- ── 1. Rollback snapshot ────────────────────────────────────────────────────
CREATE TABLE public._backup_bot_post_dates_2026_07_06 AS
SELECT up.id, up.created_at, up.posted_at
FROM public.uploads up
JOIN public.users u ON u.id = up.user_id
WHERE u.is_bot = true AND up.is_posted = true AND up.is_active = true;

-- ── 2. Pre-state fingerprint (per bot: row count + epoch checksums) ─────────
CREATE TEMP TABLE _pre_fingerprint ON COMMIT DROP AS
SELECT up.user_id,
       count(*)                                        AS n,
       sum(extract(epoch FROM up.created_at))::numeric AS created_sum,
       sum(extract(epoch FROM up.posted_at))::numeric  AS posted_sum
FROM public.uploads up
JOIN public.users u ON u.id = up.user_id
WHERE u.is_bot = true AND up.is_posted = true AND up.is_active = true
GROUP BY up.user_id;

-- ── 3. The permutation ──────────────────────────────────────────────────────
-- bot_posts: each in-scope post with its ORIGINAL rank (by created_at).
-- permuted:  each post assigned a RANDOM rank (bijection 1..N per bot).
-- Post P (random rank k) receives the timestamp PAIR of the post that
-- originally held rank k. Because ranks are a per-bot bijection, every
-- timestamp pair is reassigned exactly once — the multiset is preserved.
-- MATERIALIZED pins each CTE to a single evaluation (random() is volatile).
WITH bot_posts AS MATERIALIZED (
  SELECT up.id, up.user_id, up.created_at, up.posted_at,
         row_number() OVER (PARTITION BY up.user_id ORDER BY up.created_at, up.id) AS orig_rn
  FROM public.uploads up
  JOIN public.users u ON u.id = up.user_id
  WHERE u.is_bot = true AND up.is_posted = true AND up.is_active = true
),
permuted AS MATERIALIZED (
  SELECT id, user_id,
         row_number() OVER (PARTITION BY user_id ORDER BY random()) AS new_rn
  FROM bot_posts
)
UPDATE public.uploads u
SET created_at = donor.created_at,
    posted_at  = donor.posted_at
FROM permuted p
JOIN bot_posts donor
  ON donor.user_id = p.user_id
 AND donor.orig_rn = p.new_rn
WHERE u.id = p.id;

-- ── 4. Assertions — ANY failure raises and rolls back the whole transaction ─
DO $$
DECLARE
  bad_bots  integer;
  pre_rows  numeric;
  post_rows numeric;
BEGIN
  -- Per-bot: row count AND both timestamp checksums must be identical.
  SELECT count(*) INTO bad_bots
  FROM _pre_fingerprint pre
  FULL OUTER JOIN (
    SELECT up.user_id,
           count(*)                                        AS n,
           sum(extract(epoch FROM up.created_at))::numeric AS created_sum,
           sum(extract(epoch FROM up.posted_at))::numeric  AS posted_sum
    FROM public.uploads up
    JOIN public.users u ON u.id = up.user_id
    WHERE u.is_bot = true AND up.is_posted = true AND up.is_active = true
    GROUP BY up.user_id
  ) post ON post.user_id = pre.user_id
  WHERE pre.user_id IS NULL OR post.user_id IS NULL
     OR pre.n <> post.n
     OR abs(pre.created_sum - post.created_sum) > 0.001
     OR abs(pre.posted_sum  - post.posted_sum)  > 0.001;

  IF bad_bots > 0 THEN
    RAISE EXCEPTION 'SHUFFLE ABORTED: % bot(s) failed the timestamp-multiset check — rolling back', bad_bots;
  END IF;

  -- Global: the backup row count must equal the current in-scope row count.
  SELECT count(*) INTO pre_rows  FROM public._backup_bot_post_dates_2026_07_06;
  SELECT count(*) INTO post_rows
  FROM public.uploads up JOIN public.users u ON u.id = up.user_id
  WHERE u.is_bot = true AND up.is_posted = true AND up.is_active = true;

  IF pre_rows <> post_rows THEN
    RAISE EXCEPTION 'SHUFFLE ABORTED: row count changed (% -> %) — rolling back', pre_rows, post_rows;
  END IF;

  RAISE NOTICE 'Shuffle verified: % rows, all per-bot timestamp multisets preserved.', post_rows;
END $$;

COMMIT;

-- ── ROLLBACK (only if needed, any time later) ───────────────────────────────
-- UPDATE public.uploads u
-- SET created_at = b.created_at, posted_at = b.posted_at
-- FROM public._backup_bot_post_dates_2026_07_06 b
-- WHERE u.id = b.id;
--
-- ── CLEANUP (after you're happy with the result) ───────────────────────────
-- DROP TABLE public._backup_bot_post_dates_2026_07_06;
