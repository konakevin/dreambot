-- Migration 034: Vibe stats — similarity score + best streak
--
-- 1. Incremental counters on friendships for O(1) vibe score reads
-- 2. Trigger on votes to keep counters in sync automatically
-- 3. Backfill existing data
-- 4. RPC to fetch vibe stats between any two users

-- ── 1. Add counter columns ─────────────────────────────────────────────────

ALTER TABLE public.friendships
  ADD COLUMN IF NOT EXISTS shared_votes  integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS agreed_votes  integer NOT NULL DEFAULT 0;

-- ── 2. Trigger: auto-update counters when a vote is cast ────────────────────

CREATE OR REPLACE FUNCTION update_vibe_scores()
RETURNS TRIGGER AS $$
BEGIN
  -- For each accepted friendship where the voter is one side and the other
  -- side has also voted on this post, bump the counters.
  UPDATE friendships f
  SET
    shared_votes = f.shared_votes + 1,
    agreed_votes = f.agreed_votes + (CASE WHEN v.vote = NEW.vote THEN 1 ELSE 0 END)
  FROM votes v
  WHERE v.upload_id = NEW.upload_id
    AND v.voter_id != NEW.voter_id
    AND f.status = 'accepted'
    AND f.user_a = LEAST(NEW.voter_id, v.voter_id)
    AND f.user_b = GREATEST(NEW.voter_id, v.voter_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_vibe_scores ON public.votes;
CREATE TRIGGER trg_update_vibe_scores
  AFTER INSERT ON public.votes
  FOR EACH ROW
  EXECUTE FUNCTION update_vibe_scores();

-- ── 3. Backfill existing friendships ────────────────────────────────────────

UPDATE friendships f
SET
  shared_votes = COALESCE(sub.shared, 0),
  agreed_votes = COALESCE(sub.agreed, 0)
FROM (
  SELECT
    LEAST(v1.voter_id, v2.voter_id) AS ua,
    GREATEST(v1.voter_id, v2.voter_id) AS ub,
    COUNT(*)::integer AS shared,
    SUM(CASE WHEN v1.vote = v2.vote THEN 1 ELSE 0 END)::integer AS agreed
  FROM votes v1
  JOIN votes v2
    ON v2.upload_id = v1.upload_id
    AND v2.voter_id > v1.voter_id
  JOIN friendships fs
    ON fs.user_a = LEAST(v1.voter_id, v2.voter_id)
    AND fs.user_b = GREATEST(v1.voter_id, v2.voter_id)
    AND fs.status = 'accepted'
  GROUP BY LEAST(v1.voter_id, v2.voter_id), GREATEST(v1.voter_id, v2.voter_id)
) sub
WHERE f.user_a = sub.ua AND f.user_b = sub.ub;

-- ── 4. RPC: get vibe stats between two users ───────────────────────────────
-- Uses counters for vibers (O(1)), on-demand for non-vibers (profile visits).
-- Returns NULL vibe_score if fewer than 5 shared votes.

DROP FUNCTION IF EXISTS public.get_vibe_stats(uuid, uuid);

CREATE FUNCTION public.get_vibe_stats(p_user_id uuid, p_other_id uuid)
RETURNS TABLE(
  vibe_score    integer,
  best_streak   integer,
  shared_count  integer,
  is_vibing     boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  WITH pair AS (
    SELECT LEAST(p_user_id, p_other_id) AS ua,
           GREATEST(p_user_id, p_other_id) AS ub
  ),
  friendship AS (
    SELECT f.shared_votes, f.agreed_votes
    FROM friendships f, pair p
    WHERE f.user_a = p.ua AND f.user_b = p.ub AND f.status = 'accepted'
  ),
  streak AS (
    SELECT GREATEST(
      COALESCE(vs.best_rad_streak, 0),
      COALESCE(vs.best_bad_streak, 0)
    ) AS best
    FROM vote_streaks vs, pair p
    WHERE vs.user_a = p.ua AND vs.user_b = p.ub
  ),
  on_demand AS (
    -- Fallback for non-vibers: compute from votes table
    SELECT
      COUNT(*)::integer AS shared,
      COALESCE(SUM(CASE WHEN v1.vote = v2.vote THEN 1 ELSE 0 END), 0)::integer AS agreed
    FROM votes v1
    JOIN votes v2
      ON v2.upload_id = v1.upload_id
      AND v2.voter_id = p_other_id
    WHERE v1.voter_id = p_user_id
    -- Only compute on-demand when not vibing (skip the expensive join for vibers)
    AND NOT EXISTS (
      SELECT 1 FROM friendship
    )
  )
  SELECT
    CASE
      WHEN COALESCE(f.shared_votes, od.shared) >= 5
      THEN (COALESCE(f.agreed_votes, od.agreed) * 100
            / NULLIF(COALESCE(f.shared_votes, od.shared), 0))
      ELSE NULL
    END::integer AS vibe_score,
    COALESCE(s.best, 0)::integer AS best_streak,
    COALESCE(f.shared_votes, od.shared, 0)::integer AS shared_count,
    (f.shared_votes IS NOT NULL)::boolean AS is_vibing
  FROM (SELECT 1) AS _one
  LEFT JOIN friendship f ON true
  LEFT JOIN streak s ON true
  LEFT JOIN on_demand od ON true;
$$;

GRANT EXECUTE ON FUNCTION public.get_vibe_stats(uuid, uuid) TO authenticated;
