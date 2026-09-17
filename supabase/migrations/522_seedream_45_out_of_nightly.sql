-- 522: take bytedance/seedream-4.5 back out of the nightly cast pool, and set flux/gemini-2 to 80/20.
--
-- Kevin, 2026-09-17, after looking at the renders: "remove seedream, i don't like it, and make it 80/20
-- flux/gemini 2". A taste call on the output, which is the only judgement that settles a look question —
-- the measured numbers were fine and are kept below precisely because they were not the reason.
--
-- IT WAS IN THE POOL FOR ABOUT AN HOUR (migration 521 → this one). What the light pass and the seven
-- organic renders measured, so nobody re-derives it:
--
--   swap        0 of 8 multi-person renders degraded — it does NOT fight the dual swap, better than flux
--   completed   8 of 10 on the light pass. One HTTP 546 WORKER_RESOURCE_LIMIT, one timeout
--   latency     p50 79s, worst 111s, against a 140s ceiling
--   price       ~$0.04/image — the SAME as flux-1.1-pro, and above seedream-4's ~$0.03
--   floor       cannot render below 3.69MP: no '1K' in its size enum, custom sizes refused under
--               3,686,400 px. That is the root of both failure modes.
--
-- So it was never cheap, never fast, and could not be made smaller — it was in on the strength of its
-- swap reliability alone. On the renders it produced busy, incoherent scenes and drifted Kevin's face to
-- an older grey-bearded man, which is the flux age-drift defect showing up on a model that was supposed
-- not to have it. Worth recording: that prior is documented on flux, not on seedream.
--
-- WHAT IS DELIBERATELY LEFT IN PLACE:
--   * the image_models row (is_active = false) — it keeps the model PRICED at 4 cents so any future
--     render logs a true cost instead of falling back to DEFAULT_COST_CENTS (5), and it stays invisible
--     to the Create picker.
--   * the provider special case in _shared/generateImage.ts (size '2K', enhance_prompt false) — it is the
--     reproducible record of the 3.69MP floor. Re-adding the model later should not require rediscovering
--     that its width/height are ignored unless size='custom'.
--
-- Rollback: re-run migration 521.

BEGIN;

UPDATE public.nightly_model_policy
SET primary_models = ARRAY[
      'black-forest-labs/flux-1.1-pro',
      'google/gemini-2-image'
    ],
    primary_weights = ARRAY[80, 20]
WHERE surface IN ('solo', 'couple');

COMMIT;
