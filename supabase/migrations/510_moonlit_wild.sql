-- 510_moonlit_wild.sql — Kevin 2026-09-11: "keep all of them for nightly … all versions across all columns".
-- Mig 506 omitted moonlit's __wild version because its one matrix render shipped faceless; Kevin wants every
-- column, and production has the identity gate + the after-scene retry rung, so it joins the pool like the other
-- six wild rows (the ORIGINAL mig 504 fragment, placed early).
INSERT INTO public.dream_vibes
  (key, label, description, directive, face_swap_directive, sort_order, is_active, is_dream_eligible, nightly_only,
   client_meta, flux_fragment, fragment_position, nightly_pool, version_of)
SELECT 'moonlit__wild', b.label || ' · wild', COALESCE(b.description, b.label) || ' (first bold draft, the camera roams)',
       b.directive, b.face_swap_directive, b.sort_order * 10 + 4, true, false, true, b.client_meta,
       'bright full-moon silver light from above, crisp moon shadows, a starry indigo sky, a faint low mist', 'early', true, b.key
FROM public.dream_vibes b WHERE b.key = 'moonlit'
ON CONFLICT (key) DO UPDATE SET flux_fragment = EXCLUDED.flux_fragment, fragment_position = EXCLUDED.fragment_position,
  nightly_pool = EXCLUDED.nightly_pool, nightly_only = EXCLUDED.nightly_only, is_active = EXCLUDED.is_active;
