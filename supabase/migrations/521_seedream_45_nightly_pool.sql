-- 521: put bytedance/seedream-4.5 in the nightly cast pool at 15% (Kevin 2026-09-17, option B).
--
-- WHAT IT IS. Evaluated the same night via `node scripts/eval-model.js "bytedance/seedream-4.5" --light`
-- (10 organic nightly dreams). Kevin liked the renders. The measured numbers, for the record:
--
--   swap        0 of 8 multi-person renders degraded — it does NOT fight the dual swap
--   completed   8 of 10. One HTTP 546 WORKER_RESOURCE_LIMIT, one timeout
--   latency     p50 79s, worst 111s, against a 140s RENDER_TIMEOUT_MS ceiling
--   price       ~$0.04/image — the SAME as flux-1.1-pro, and above seedream-4's ~$0.03
--
-- The failures trace to one hard constraint: 4.5 cannot render below 3.69MP. Its `size` enum has no
-- '1K' (only 2K / 4K / custom) and custom dimensions are refused under 3,686,400 px, so unlike
-- seedream-4 it cannot be dropped under the Edge runtime's comfortable decode size. Nightly retries up
-- to 8 times, so a user effectively never sees a failure; the real costs are ~25% more renders on its
-- share and the slower p50.
--
-- Hence 15% rather than 25%: a small, observable exposure on the least-proven of the three models. It is
-- dialled from the dashboard now, with no deploy —
--   node scripts/model-split.js --surface solo --set "flux-1.1-pro=70,gemini-2-image=15,seedream-4.5=15"
-- and a weight of 0 benches it instantly if the latency becomes annoying.
--
-- SOLO + COUPLE ONLY. Scene is left alone (33/33/34 across flux, gemini-2 and ultra) because nobody has
-- looked at 4.5 on a people-free render yet.
--
-- NOT user-facing. The image_models row below is is_active = false, so 4.5 never appears in the Create
-- model picker — users would be paying sparkles for the slowest option. loadModelCosts() reads the table
-- without an is_active filter, so the row still supplies the price while staying invisible.

BEGIN;

-- 1) Price it. Static fallbacks live in _shared/modelPricing.ts; this row is the live, tunable source.
INSERT INTO public.image_models
  (id, label, family, sparkle_cost, cost_cents, description, is_default, is_active, sort_order, dreambot_enabled)
VALUES (
  'bytedance/seedream-4.5',
  'Seedream 4.5',
  'seedream',
  1,
  4,
  'Nightly pool only (15%). Cannot render below 3.69MP, so it is not offered in the Create picker.',
  false,
  false,   -- INVISIBLE to the user-facing model picker, on purpose
  99,
  false
)
ON CONFLICT (id) DO UPDATE SET
  sparkle_cost = EXCLUDED.sparkle_cost,
  cost_cents = EXCLUDED.cost_cents,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  dreambot_enabled = EXCLUDED.dreambot_enabled;

-- 2) Add it to the cast surfaces and set the split.
--    Weights are RATIOS and are read live by the roll (nightlyStyle.ts, as of 2026-09-17) — before that
--    they were set in this table and silently ignored, which is why couple read 51/49 while rendering
--    75/25. The determinism is locked by __tests__/lib/modelWeightDeterminism.test.ts.
UPDATE public.nightly_model_policy
SET primary_models = ARRAY[
      'black-forest-labs/flux-1.1-pro',
      'google/gemini-2-image',
      'bytedance/seedream-4.5'
    ],
    primary_weights = ARRAY[70, 15, 15]
WHERE surface IN ('solo', 'couple');

COMMIT;
