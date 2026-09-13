-- 515_nightly_looks_allowlist.sql — 2026-09-12. Staged rollout for the nightly LOOKS PATH: while
-- engine_config.nightly_looks_mode stays 'off' (or 'shadow') for everyone, users in this allowlist render on the
-- looks path — the exact production path (dream_queue → dream-queue-worker → nightly-dreams, payload {}), no QA
-- flags. Used first for Kevin's parity QA loop (his real nightly + the QA batches), then as the dark-launch cohort
-- before flipping the mode to 'on'.
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS nightly_looks_allowlist uuid[] NOT NULL DEFAULT '{}';
COMMENT ON COLUMN public.engine_config.nightly_looks_allowlist IS
  'User ids rendered on the nightly looks path regardless of nightly_looks_mode (staged rollout). 2026-09-12.';
