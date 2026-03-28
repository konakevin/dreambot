-- Migration 019: Fix rank trigger scaling issue + add votes index
--
-- Problem: update_user_rank() trigger fired on every vote and scanned all posts
-- by that user (wilson_score aggregation over the uploads table). Under load,
-- this causes a full sequential scan per vote insert.
--
-- Fix:
--   1. Add needs_rank_recalc flag to users — cheap single-row UPDATE per vote.
--   2. Replace the trigger function to ONLY set that flag.
--   3. Move the expensive rad_score recalculation into refresh_rank_thresholds(),
--      which already runs hourly via pg_cron.
--   4. Add a composite index on votes(upload_id, voter_id) to speed up common
--      lookup patterns.

-- 1. Add deferred-recalc flag
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS needs_rank_recalc boolean NOT NULL DEFAULT false;

-- 2. Replace the expensive per-vote trigger with a cheap flag setter
CREATE OR REPLACE FUNCTION public.update_user_rank()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  v_owner_id uuid;
BEGIN
  SELECT user_id INTO v_owner_id
  FROM public.uploads
  WHERE id = NEW.upload_id;

  IF v_owner_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Only set a flag — no post scanning, no aggregate queries.
  -- refresh_rank_thresholds() picks this up on the next hourly run.
  UPDATE public.users
  SET needs_rank_recalc = true
  WHERE id = v_owner_id;

  RETURN NEW;
END;
$$;

-- 3. Update refresh_rank_thresholds() to also recalculate rad_score for any
--    user where needs_rank_recalc = true, then reset the flag.
--
--    The rad_score formula is preserved from migration 018:
--      engagement := LN(1 + total_votes) / LN(1 + 2_000_000)
--      score      := wilson_weighted_avg * 0.80 + engagement * 0.20
--    Minimum 3 qualifying posts (total_votes >= 5, wilson_score NOT NULL, is_active).
CREATE OR REPLACE FUNCTION public.refresh_rank_thresholds()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  v_legendary float;
  v_rad       float;
  v_solid     float;
  v_mid       float;
  v_bad       float;
  v_count     int;
  v_owner     RECORD;
  v_wilson    float;
  v_total     bigint;
  v_posts     integer;
  v_engage    float;
  v_score     float;
BEGIN
  -- ----------------------------------------------------------------
  -- Step 1: Recalculate rad_score for all flagged users
  -- ----------------------------------------------------------------
  FOR v_owner IN
    SELECT id FROM public.users WHERE needs_rank_recalc = true
  LOOP
    SELECT
      SUM(wilson_score * total_votes) / NULLIF(SUM(total_votes), 0),
      SUM(total_votes),
      COUNT(*)
    INTO v_wilson, v_total, v_posts
    FROM public.uploads
    WHERE
      user_id      = v_owner.id
      AND is_active    = true
      AND total_votes  >= 5
      AND wilson_score IS NOT NULL;

    IF v_posts < 3 THEN
      -- Not enough qualifying posts — store partial score but clear rank
      UPDATE public.users
      SET rad_score         = v_wilson,
          user_rank         = NULL,
          needs_rank_recalc = false
      WHERE id = v_owner.id;
    ELSE
      v_engage := LN(1.0 + COALESCE(v_total, 0)) / LN(1.0 + 2000000.0);
      v_score  := COALESCE(v_wilson, 0) * 0.80 + v_engage * 0.20;

      UPDATE public.users
      SET rad_score         = v_score,
          needs_rank_recalc = false
      WHERE id = v_owner.id;
      -- user_rank will be set in Step 2 below via the global re-bucket
    END IF;
  END LOOP;

  -- ----------------------------------------------------------------
  -- Step 2: Recompute percentile thresholds (unchanged from 018)
  -- ----------------------------------------------------------------
  SELECT COUNT(*) INTO v_count
  FROM public.users
  WHERE rad_score IS NOT NULL;

  -- Need at least 20 ranked users for percentiles to be meaningful
  IF v_count < 20 THEN
    RETURN;
  END IF;

  SELECT
    PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY rad_score),
    PERCENTILE_CONT(0.70) WITHIN GROUP (ORDER BY rad_score),
    PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY rad_score),
    PERCENTILE_CONT(0.30) WITHIN GROUP (ORDER BY rad_score),
    PERCENTILE_CONT(0.10) WITHIN GROUP (ORDER BY rad_score)
  INTO v_legendary, v_rad, v_solid, v_mid, v_bad
  FROM public.users
  WHERE rad_score IS NOT NULL;

  -- Update thresholds table
  INSERT INTO public.rank_thresholds (id, legendary, rad, solid, mid, bad, updated_at)
  VALUES (1, v_legendary, v_rad, v_solid, v_mid, v_bad, now())
  ON CONFLICT (id) DO UPDATE SET
    legendary  = EXCLUDED.legendary,
    rad        = EXCLUDED.rad,
    solid      = EXCLUDED.solid,
    mid        = EXCLUDED.mid,
    bad        = EXCLUDED.bad,
    updated_at = EXCLUDED.updated_at;

  -- ----------------------------------------------------------------
  -- Step 3: Re-bucket ALL ranked users with refreshed thresholds
  -- ----------------------------------------------------------------
  UPDATE public.users
  SET user_rank = CASE
    WHEN rad_score >= v_legendary THEN 'LEGENDARY'
    WHEN rad_score >= v_rad       THEN 'RAD'
    WHEN rad_score >= v_solid     THEN 'SOLID'
    WHEN rad_score >= v_mid       THEN 'MID'
    WHEN rad_score >= v_bad       THEN 'BAD'
    ELSE                               'CURSED'
  END
  WHERE rad_score IS NOT NULL;
END;
$$;

-- 4. Add composite index to speed up vote lookups by upload + voter
CREATE INDEX IF NOT EXISTS votes_upload_voter_idx ON public.votes(upload_id, voter_id);
