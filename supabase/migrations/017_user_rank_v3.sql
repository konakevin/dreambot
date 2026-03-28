-- Migration 017: User rank v3 — quality-dominant scoring
--
-- Problem with v2: engagement weight (35%) was too high.
-- It lifted chaos_agents out of CURSED/BAD and provocateurs out of MID.
-- Engagement already influences feed placement — double-counting it in
-- the rank score masked genuine quality differences.
--
-- New weights:
--   Quality (wilson_score): 50%  — up from 65% of 0.65 split → now dominant
--   Engagement (log votes): 20%  — down from 35%, tie-breaker only
--
-- composite = weighted_wilson * 0.80 + engagement_factor * 0.20
--
-- Thresholds unchanged from v2:
--   LEGENDARY >= 0.82
--   RAD       >= 0.70
--   SOLID     >= 0.60
--   MID       >= 0.50
--   BAD       >= 0.38
--   CURSED    <  0.38

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

  v_rank := CASE
    WHEN v_score >= 0.82 THEN 'LEGENDARY'
    WHEN v_score >= 0.70 THEN 'RAD'
    WHEN v_score >= 0.60 THEN 'SOLID'
    WHEN v_score >= 0.50 THEN 'MID'
    WHEN v_score >= 0.38 THEN 'BAD'
    ELSE 'CURSED'
  END;

  UPDATE public.users
  SET rad_score = v_score, user_rank = v_rank
  WHERE id = v_owner_id;

  RETURN NEW;
END;
$$;

-- Backfill all existing users
DO $$
DECLARE
  r             RECORD;
  v_wilson      float;
  v_total_votes bigint;
  v_post_count  integer;
  v_engagement  float;
  v_score       float;
  v_rank        text;
BEGIN
  FOR r IN SELECT id FROM public.users LOOP
    SELECT
      SUM(wilson_score * total_votes) / NULLIF(SUM(total_votes), 0),
      SUM(total_votes),
      COUNT(*)
    INTO v_wilson, v_total_votes, v_post_count
    FROM public.uploads
    WHERE
      user_id      = r.id
      AND is_active    = true
      AND total_votes  >= 5
      AND wilson_score IS NOT NULL;

    IF v_post_count >= 3 THEN
      v_engagement := LN(1.0 + COALESCE(v_total_votes, 0)) / LN(1.0 + 2000000.0);
      v_score      := COALESCE(v_wilson, 0) * 0.80 + v_engagement * 0.20;

      v_rank := CASE
        WHEN v_score >= 0.82 THEN 'LEGENDARY'
        WHEN v_score >= 0.70 THEN 'RAD'
        WHEN v_score >= 0.60 THEN 'SOLID'
        WHEN v_score >= 0.50 THEN 'MID'
        WHEN v_score >= 0.38 THEN 'BAD'
        ELSE 'CURSED'
      END;
    ELSE
      v_score := v_wilson;
      v_rank  := NULL;
    END IF;

    UPDATE public.users
    SET rad_score = v_score, user_rank = v_rank
    WHERE id = r.id;
  END LOOP;
END;
$$;
