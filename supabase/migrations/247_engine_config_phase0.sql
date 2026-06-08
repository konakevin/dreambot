-- 247_engine_config_phase0.sql — Admin-config backbone, Phase 0.
--
-- engine_config is a singleton (id=1) config row already read by chaosTier /
-- dreamStyles / nightly-dreams. ADMIN_CONFIG_PLAN.md Phase 0 extends it with the
-- create-screen / economics knobs that are currently hardcoded in the RN client
-- (App-Store-gated) or duplicated across runtimes, so they become live DB edits.
--
-- Each column DEFAULTs to the value currently hardcoded in code, so behavior is
-- unchanged until an admin edits the row. A get_engine_config() RPC exposes the
-- client-facing subset (the client must NOT read internal scene/chaos knobs).
--
-- Run in the Supabase dashboard SQL editor. Idempotent.

ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS base_sparkle_cost       integer NOT NULL DEFAULT 1,    -- 1 sparkle / DreamBot dream
  ADD COLUMN IF NOT EXISTS welcome_sparkle_bonus   integer NOT NULL DEFAULT 25,   -- onboarding grant
  ADD COLUMN IF NOT EXISTS pro_trial_days          integer NOT NULL DEFAULT 14,   -- KILLS the 3-runtime 14d sync
  ADD COLUMN IF NOT EXISTS prompt_max_length       integer NOT NULL DEFAULT 2000, -- create-screen TextInput cap
  ADD COLUMN IF NOT EXISTS photo_preprocess_width  integer NOT NULL DEFAULT 1024, -- upload resize width
  ADD COLUMN IF NOT EXISTS photo_preprocess_quality real   NOT NULL DEFAULT 0.8,  -- upload JPEG quality
  ADD COLUMN IF NOT EXISTS nightly_max_jobs        integer NOT NULL DEFAULT 5000, -- nightly enqueue cap
  ADD COLUMN IF NOT EXISTS self_ref_regex          text,   -- NULL → client uses its built-in fallback
  ADD COLUMN IF NOT EXISTS relationship_regex      text;   -- NULL → client uses its built-in fallback

-- get_engine_config() — client-facing config only (NOT scene/chaos/model internals).
-- SECURITY DEFINER so the client can read it without an RLS policy on engine_config.
CREATE OR REPLACE FUNCTION public.get_engine_config()
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'base_sparkle_cost',        base_sparkle_cost,
    'welcome_sparkle_bonus',    welcome_sparkle_bonus,
    'pro_trial_days',           pro_trial_days,
    'prompt_max_length',        prompt_max_length,
    'photo_preprocess_width',   photo_preprocess_width,
    'photo_preprocess_quality', photo_preprocess_quality,
    'self_ref_regex',           self_ref_regex,
    'relationship_regex',       relationship_regex
  )
  FROM public.engine_config
  WHERE id = 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_engine_config() TO authenticated, anon;
