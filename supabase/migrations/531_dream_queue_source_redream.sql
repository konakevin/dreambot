-- 531_dream_queue_source_redream.sql — 2026-09-18. "MORE LIKE THIS" (Kevin: the long-press "Dream this again" on a
-- NIGHTLY dream reloaded Create with a look Create cannot render — the empty prompt then took the surprise path and
-- shipped a photographic pure scene). The replacement re-runs the NIGHTLY engine on demand: same look, vibe and cast
-- role as the source dream, a fresh scene, charged like a Create dream (engine_config.base_sparkle_cost), confirmed
-- by the user first. New dream_queue source 'redream': enqueued by enqueue-dream (`redream_upload_id`), claimed by
-- the worker and rendered through the nightly dispatcher with pins, refunded on dead-letter like create.
ALTER TABLE public.dream_queue DROP CONSTRAINT IF EXISTS dream_queue_source_check;
ALTER TABLE public.dream_queue ADD CONSTRAINT dream_queue_source_check
  CHECK (source IN ('first_dream', 'nightly', 'create', 'dlt', 'redream'));
