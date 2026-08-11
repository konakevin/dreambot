-- Option B (Kevin, 2026-08-10): generative LOCATION-fit action beats on nightly
-- plain-location face-swap dreams. locationActionBeat.ts authors a swap-safe
-- action that fits the exact place; this % controls how often a plain-location
-- dream uses it (rolls only when the biome ACTIVE pose didn't fire).
-- 0 = off (default, no behavior change until we dial it up after QA).
ALTER TABLE public.engine_config
  ADD COLUMN IF NOT EXISTS location_action_pct integer NOT NULL DEFAULT 0;

-- engine_config is the singleton read by the service role in edge functions;
-- no client GRANT needed (not exposed to anon/authenticated).
