-- Migration 018: Percentile-based rank tiers with pg_cron auto-refresh
--
-- Architecture:
--   1. rank_thresholds table — single-row config storing live percentile cutoffs
--   2. refresh_rank_thresholds() — recomputes percentiles + re-buckets all users
--   3. pg_cron job — calls refresh every hour automatically
--   4. update_user_rank trigger — reads thresholds table for immediate bucketing
--      after each vote (falls back to hardcoded values if table is empty)
--
-- Tier distribution (% of ranked users):
--   LEGENDARY  top 10%       — genuinely exceptional
--   RAD        p70–p90       — 20% — great
--   SOLID      p50–p70       — 20% — good
--   MID        p30–p50       — 20% — average
--   BAD        p10–p30       — 20% — below average
--   CURSED     bottom 10%    — rare, genuinely poor
--
-- This guarantees visible color variety regardless of the absolute score
-- distribution. As the user base grows and shifts, tiers shift with it.

-- 1. Thresholds config table (single row, upserted by refresh function)
CREATE TABLE IF NOT EXISTS public.rank_thresholds (
  id         int  PRIMARY KEY DEFAULT 1,
  legendary  float NOT NULL DEFAULT 0.82,
  rad        float NOT NULL DEFAULT 0.70,
  solid      float NOT NULL DEFAULT 0.60,
  mid        float NOT NULL DEFAULT 0.50,
  bad        float NOT NULL DEFAULT 0.38,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed with hardcoded fallback values so the trigger works before first cron run
INSERT INTO public.rank_thresholds (id, legendary, rad, solid, mid, bad)
VALUES (1, 0.82, 0.70, 0.60, 0.50, 0.38)
ON CONFLICT (id) DO NOTHING;

-- 2. Refresh function: recompute percentiles + re-bucket all ranked users
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
BEGIN
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

  -- Update thresholds
  INSERT INTO public.rank_thresholds (id, legendary, rad, solid, mid, bad, updated_at)
  VALUES (1, v_legendary, v_rad, v_solid, v_mid, v_bad, now())
  ON CONFLICT (id) DO UPDATE SET
    legendary  = EXCLUDED.legendary,
    rad        = EXCLUDED.rad,
    solid      = EXCLUDED.solid,
    mid        = EXCLUDED.mid,
    bad        = EXCLUDED.bad,
    updated_at = EXCLUDED.updated_at;

  -- Re-bucket all ranked users with new thresholds
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

-- 3. Update trigger to read live thresholds (falls back to hardcoded if missing)
CREATE OR REPLACE FUNCTION public.update_user_rank()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER AS $$
DECLARE
  v_owner_id      uuid;
  v_wilson        float;
  v_total_votes   bigint;
  v_post_count    integer;
  v_engagement    float;
  v_score         float;
  v_rank          text;
  v_legendary     float;
  v_rad           float;
  v_solid         float;
  v_mid           float;
  v_bad           float;
BEGIN
  SELECT user_id INTO v_owner_id
  FROM public.uploads
  WHERE id = NEW.upload_id;

  IF v_owner_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT
    SUM(wilson_score * total_votes) / NULLIF(SUM(total_votes), 0),
    SUM(total_votes),
    COUNT(*)
  INTO v_wilson, v_total_votes, v_post_count
  FROM public.uploads
  WHERE
    user_id      = v_owner_id
    AND is_active    = true
    AND total_votes  >= 5
    AND wilson_score IS NOT NULL;

  IF v_post_count < 3 THEN
    UPDATE public.users
    SET rad_score = v_wilson, user_rank = NULL
    WHERE id = v_owner_id;
    RETURN NEW;
  END IF;

  v_engagement := LN(1.0 + COALESCE(v_total_votes, 0)) / LN(1.0 + 2000000.0);
  v_score      := COALESCE(v_wilson, 0) * 0.80 + v_engagement * 0.20;

  -- Read live thresholds (fallback to hardcoded defaults)
  SELECT legendary, rad, solid, mid, bad
  INTO v_legendary, v_rad, v_solid, v_mid, v_bad
  FROM public.rank_thresholds
  WHERE id = 1;

  v_legendary := COALESCE(v_legendary, 0.82);
  v_rad       := COALESCE(v_rad,       0.70);
  v_solid     := COALESCE(v_solid,     0.60);
  v_mid       := COALESCE(v_mid,       0.50);
  v_bad       := COALESCE(v_bad,       0.38);

  v_rank := CASE
    WHEN v_score >= v_legendary THEN 'LEGENDARY'
    WHEN v_score >= v_rad       THEN 'RAD'
    WHEN v_score >= v_solid     THEN 'SOLID'
    WHEN v_score >= v_mid       THEN 'MID'
    WHEN v_score >= v_bad       THEN 'BAD'
    ELSE                             'CURSED'
  END;

  UPDATE public.users
  SET rad_score = v_score, user_rank = v_rank
  WHERE id = v_owner_id;

  RETURN NEW;
END;
$$;

-- 4. Schedule hourly refresh via pg_cron
SELECT cron.schedule(
  'refresh-rank-thresholds',
  '0 * * * *',
  'SELECT public.refresh_rank_thresholds()'
);

-- 5. Run immediately to set live thresholds + re-bucket existing users
SELECT public.refresh_rank_thresholds();
