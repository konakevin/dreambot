-- 502_nightly_looks_mode.sql — the switch for the nightly LOOKS path (NIGHTLY_LOOKS_REFACTOR_PLAN.md Phase 2).
--   off    = legacy medium chain (today), nothing changes
--   shadow = legacy renders; the style contract the looks path WOULD have chosen is stamped
--            (`style_shadow:<surface>:<model>:<look>`) for coverage checks
--   on     = the looks path decides model + look (+ vibe) per render via the style contract
-- QA renders bypass the mode with the `force_looks_path` flag (Kevin's account only, production untouched).
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS nightly_looks_mode text NOT NULL DEFAULT 'off',
  ADD COLUMN IF NOT EXISTS nightly_look_recency integer NOT NULL DEFAULT 7;
ALTER TABLE public.engine_config DROP CONSTRAINT IF EXISTS engine_config_nightly_looks_mode_valid;
ALTER TABLE public.engine_config ADD CONSTRAINT engine_config_nightly_looks_mode_valid
  CHECK (nightly_looks_mode IN ('off','shadow','on'));
