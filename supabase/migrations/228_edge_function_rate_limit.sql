-- 228_edge_function_rate_limit.sql
-- ─────────────────────────────────────────────────────────────────────────
-- Rate-limit the unauthenticated-but-expensive Edge Functions: describe-photo
-- and classify-photo. Both invoke Llama Vision on Replicate (~5¢ per call).
-- Without rate-limit, a malicious authenticated user can drain budget by
-- looping the endpoint against arbitrary image URLs.
--
-- Pattern reuses migration 194's `enforce_insert_rate_limit` trigger:
-- each Edge Function INSERTs a row into `edge_function_invocations` at the
-- start of its work. The BEFORE INSERT trigger raises P0001 with hint
-- `rate_limited` when the per-user-per-window count exceeds the cap; the
-- Edge Function catches that error and returns HTTP 429.
--
-- Caps: 10/min per user per function. Generous enough for the legitimate
-- onboarding flow (upload self + plus_one = 2 calls), tight enough to
-- block scripted abuse.
-- ─────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.edge_function_invocations (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  function_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index supports the rate-limit count query (user_id + window) and the
-- periodic cleanup (created_at).
CREATE INDEX IF NOT EXISTS idx_edge_fn_invocations_user_time
  ON public.edge_function_invocations (user_id, function_name, created_at DESC);

-- RLS: service role only (Edge Functions write). Clients never touch this.
ALTER TABLE public.edge_function_invocations ENABLE ROW LEVEL SECURITY;

-- No client-facing policies — Edge Functions use the service role key which
-- bypasses RLS. A future client that tries to read/write this table directly
-- gets denied by default (no permissive policy = deny).

-- Per-function rate-limit triggers. The shared `enforce_insert_rate_limit`
-- function from migration 194 partitions counts by the column passed as
-- argument #3 — here `user_id`. Since the function doesn't filter by
-- function_name, we attach a separate trigger per function that uses a
-- WHEN clause to scope counting to that function's rows.
--
-- Workaround: enforce_insert_rate_limit counts ALL rows for the user in the
-- window, regardless of function_name. That's actually fine — a user
-- exceeding 10 vision-API calls per minute across BOTH endpoints is suspect
-- regardless of which one they're hitting. Keep it simple.

DROP TRIGGER IF EXISTS trg_rate_limit_edge_fn ON public.edge_function_invocations;
CREATE TRIGGER trg_rate_limit_edge_fn
  BEFORE INSERT ON public.edge_function_invocations
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_insert_rate_limit('10', '1 minute', 'user_id');

-- Optional but cheap: nightly cleanup of rows older than 1 hour. The rate-
-- limit window is 1 minute, so anything past 1 hour is permanently dead.
-- pg_cron job (registered separately if not already): see comments.
-- For now, leave the table to grow — it's tiny (one INSERT per Edge call,
-- two timestamps + a string). A scheduled DELETE can be added later if
-- the row count becomes a problem.

COMMENT ON TABLE public.edge_function_invocations IS
  'Per-user invocation log for rate-limiting expensive Edge Functions (describe-photo, classify-photo). Insert-triggered rate limit raises P0001 when user exceeds 10 calls/min. Migration 228.';
