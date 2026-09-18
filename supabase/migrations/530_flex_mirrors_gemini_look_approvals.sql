-- 530_flex_mirrors_gemini_look_approvals.sql — 2026-09-18. Kevin: "just enable flex for whatever gemini is enabled for".
--
-- Context: the first re-render of a nightly cast render (couple AND single) is now the policy's fallback roll —
-- nightly_model_policy.<surface>.fallback_models / fallback_weights, configured 50/50 flux-2-flex / gemini-2-image
-- (nightlyStyle.ts forAttempt, stamped `policy:<surface>:2:<model>:fallback_roll`). flux-2-flex had no graded looks;
-- the nightly contract locks the rolled look across attempts, so a flex re-render renders the same look regardless,
-- and Kevin's call is to trust flex wherever gemini is trusted. This copies every gemini-2-image approved=true row
-- (couple + solo) to flux-2-flex as source='override'. Rejections are not mirrored (no row = ungraded).
--
-- ROLLBACK: DELETE FROM public.nightly_look_approvals WHERE model = 'black-forest-labs/flux-2-flex' AND source = 'override'
--   AND note LIKE 'Kevin 2026-09-18: mirror of gemini%';
BEGIN;
INSERT INTO public.nightly_look_approvals (look_key, model, surface, approved, source, note)
SELECT a.look_key,
       'black-forest-labs/flux-2-flex',
       a.surface,
       true,
       'override',
       'Kevin 2026-09-18: mirror of gemini-2-image approval ("just enable flex for whatever gemini is enabled for"); flex is the 50/50 first-re-render fallback with gemini'
FROM public.nightly_look_approvals a
WHERE a.model = 'google/gemini-2-image' AND a.approved = true
ON CONFLICT (look_key, model, surface) DO UPDATE
  SET approved = true, source = EXCLUDED.source, note = EXCLUDED.note, graded_at = now();
COMMIT;
