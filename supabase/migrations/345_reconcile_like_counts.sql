-- One-time reconcile of uploads.like_count against real likes rows.
--
-- Live audit 2026-07-08: 44 uploads under-counted (stored 0, real 1) — every
-- one from likes created 2026-04-01..05 by two users, i.e. the pre-migration-080
-- era when update_like_count() ran WITHOUT SECURITY DEFINER and its UPDATE on
-- uploads failed silently under RLS. Zero drift since (trigger sound for 3
-- months), and comment_count showed ZERO drift across all 27k uploads — so this
-- is a historical backfill, not a live-bug fix.
--
-- Scoped to rows that actually disagree; safe to re-run (idempotent).

UPDATE public.uploads u
SET like_count = real_counts.n
FROM (
  SELECT up.id, COALESCE(l.n, 0) AS n
  FROM public.uploads up
  LEFT JOIN (
    SELECT upload_id, COUNT(*)::int AS n
    FROM public.likes
    GROUP BY upload_id
  ) l ON l.upload_id = up.id
) real_counts
WHERE u.id = real_counts.id
  AND u.like_count IS DISTINCT FROM real_counts.n;
