-- Fixes Supabase security advisor alerts (2026-04):
--
-- 1. public.ai_cost_summary view — re-create with security_invoker so
--    it queries with the caller's permissions, not the creator's.
--
-- 2. public.model_overrides — RLS not enabled. Adding read-only policy
--    for authenticated + anon (it's routing config, not sensitive).
--    Service role (Edge Functions) bypasses RLS for admin operations.
--
-- (feature_flags, rank_thresholds, recipe_registry — all flagged by
-- earlier audit but already dropped in migrations 076/093.)

-- ── 1. ai_cost_summary view: ensure security_invoker ─────────────────
DROP VIEW IF EXISTS public.ai_cost_summary;
CREATE VIEW public.ai_cost_summary
  WITH (security_invoker = true)
AS
SELECT date, COUNT(*) AS images, SUM(total_cost_cents) AS cost_cents
FROM public.ai_generation_budget
GROUP BY date
ORDER BY date DESC;

-- ── 2. model_overrides: enable RLS ───────────────────────────────────
ALTER TABLE public.model_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "model_overrides_read" ON public.model_overrides;
CREATE POLICY "model_overrides_read" ON public.model_overrides
  FOR SELECT TO authenticated, anon
  USING (true);
