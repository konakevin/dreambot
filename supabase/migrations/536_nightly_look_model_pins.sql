-- 536_nightly_look_model_pins.sql — per-look model PIN for the nightly, 2026-09-20. Kevin: "how about instead of
-- routing those two to gemini or flex, let's route it to nano banana pro (5 sparkle) model, we'll absorb the average
-- cost of that model across the 7% of rolls, and that way we still get good renders for those two … so that any time
-- a nightly dream rolls those looks, it runs nano banana pro".
--
-- WHY
-- `nightly_classical_oil` and `nightly_colored_pencil` are the only two couple-graded looks that reject
-- flux-1.1-pro (migration 528, from the honest-looks probe). Under LOOKS_ALL_MODELS the attempt-1 pool is
-- "the surface's policy primaries MINUS this look's rejections", so for those two the pool collapses to a single
-- survivor and every couple render lands on google/gemini-2-image. That is the designed route, not a failover —
-- but Kevin wants those looks on Nano Banana Pro (google/gemini-3-image-preview) instead.
--
-- WHY THIS IS A NEW TABLE AND NOT A TWEAK TO THE EXISTING ONES
--   * nightly_model_policy.primary_models is deliberately a CHEAP pool: __tests__/db/nightlyModelPolicy.dbspec.ts
--     asserts primaries <= 5c and fallbacks <= 6.3c. Nano Banana Pro is ~13.4c. And a 0 weight cannot express
--     "never" — pickWeighted falls back to UNIFORM when every surviving weight is 0, so a weight-0 entry would be
--     picked by accident rather than by intent.
--   * nightly_look_approvals.approved = false is documented as a FACE-SWAP QUALITY judgement (Kevin's grading).
--     Using it to express routing would corrupt the one signal that records those grades.
--   * dream_mediums.allowed_models already carries a list on 49 of 57 nightly looks (nearly all
--     [flux-1.1-pro, flux-2-flex]); repurposing it as the pool source would silently reroute the whole catalogue.
-- So the pin says what it means, in its own table, and is read at exactly one place (nightlyStyle's lookFirst
-- attempt-1 branch).
--
-- COST: this is a DELIBERATE exception to the nightly's <=2-sparkle model cap (_shared/nightlyModelPool.ts).
-- Nano Banana Pro is 5 sparkles / ~13.4c vs flux's 1 / ~4c. It applies to COUPLES ONLY (Kevin, 2026-09-20: solos
-- are not failing on these looks and are higher volume), which is roughly 7% of couple rolls. Every render still
-- logs its true cost to ai_generation_log.cost_cents, so the spend is measurable.
--
-- SCOPE: attempt 1 only. The re-render stays on the policy's fallback roll (flux-2-flex / gemini-2-image 50/50),
-- because a retry must CHANGE models — re-rendering the same model after an identity miss does not recover it.
--
-- ROLLBACK (no deploy, routing returns to gemini-2-image):
--   UPDATE public.nightly_look_model_pins SET active = false;
CREATE TABLE IF NOT EXISTS public.nightly_look_model_pins (
  look_key   text NOT NULL REFERENCES public.dream_mediums(key) ON DELETE CASCADE,
  surface    text NOT NULL CHECK (surface IN ('couple','solo')),
  model      text NOT NULL,
  reason     text,
  active     boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (look_key, surface)
);
ALTER TABLE public.nightly_look_model_pins ENABLE ROW LEVEL SECURITY;
-- Engine-only table, same posture as nightly_look_approvals (mig 498): no client policies, service role bypasses.
GRANT SELECT ON public.nightly_look_model_pins TO service_role;

COMMENT ON TABLE public.nightly_look_model_pins IS
  'Per-(look x surface) model PIN for the nightly. When an ACTIVE row exists, that model renders attempt 1 for '
  'that look on that surface, bypassing the policy pool, the weighted roll and the <=2-sparkle cost cap — a '
  'deliberate, auditable exception (stamp model_source:look_pin:<model>). A banned model is ignored and falls '
  'through to the normal pool (stamp look_pin_banned:<model>). The retry chain is untouched. Set active = false '
  'to revert with no deploy.';

INSERT INTO public.nightly_look_model_pins (look_key, surface, model, reason) VALUES
  ('nightly_classical_oil', 'couple', 'google/gemini-3-image-preview',
   'Kevin 2026-09-20: flux rejected on couples (mig 528); route to Nano Banana Pro rather than gemini-2. Probe 2026-09-20: 2/2 held on renders that reached the swap, identity 0.743/0.728 and 0.733/0.723.'),
  ('nightly_colored_pencil', 'couple', 'google/gemini-3-image-preview',
   'Kevin 2026-09-20: flux rejected on couples (mig 528); route to Nano Banana Pro rather than gemini-2. Probe 2026-09-20: 2/3 held, identity 0.728/0.724 and 0.694/0.758.')
ON CONFLICT (look_key, surface) DO UPDATE SET
  model = EXCLUDED.model,
  reason = EXCLUDED.reason,
  active = true;
