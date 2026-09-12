-- 509_vibe_versions_round2.sql — versions for the 36 families rendered in matrix rounds e-j (the 12 app vibes,
-- mig 507, and the 24 gap-fill / revived vibes, mig 508), same pattern as mig 506: __subtle (no fragment) ·
-- __soft (fragment after the scene) · __bold (fragment early). No __wild here (no rewrites). Every render shipped
-- with a face, so nothing is omitted (synthwave__bold drifted to identity 0.40 on flux; the identity gate and
-- the after-scene retry rung cover it in production). All version rows: nightly_only + not eligible + in the
-- looks-path pool. Base rows stay canonical / Create-facing and out of the pool.
CREATE TEMP TABLE fam(key text PRIMARY KEY);
INSERT INTO fam VALUES ('coquette'),('kawaii'),('high_fantasy'),('whimsical'),('surreal'),('fierce'),('voltage'),
  ('ancient'),('macabre'),('shimmer'),('minimal'),('psychedelic'),
  ('snowfall'),('candlelit'),('fog'),('rainfall'),('sunrise'),('bioluminescent'),('noir'),('caustics'),('opulent'),
  ('synthwave'),('autumnal'),('blossom'),('starlit'),('godrays'),('fireworks'),('carnival'),('cotton_candy'),
  ('overcast'),('stained_glass'),('dreamy'),('chaos'),('majestic'),('ominous'),('aura');

INSERT INTO public.dream_vibes
  (key, label, description, directive, face_swap_directive, sort_order, is_active, is_dream_eligible, nightly_only,
   client_meta, flux_fragment, fragment_position, nightly_pool, version_of)
SELECT b.key || '__subtle', b.label || ' · subtle', COALESCE(b.description, b.label) || ' (mood only)', b.directive, b.face_swap_directive,
       b.sort_order * 10 + 1, true, false, true, b.client_meta, NULL, NULL, true, b.key
FROM public.dream_vibes b JOIN fam USING (key)
UNION ALL
SELECT b.key || '__soft', b.label || ' · soft', COALESCE(b.description, b.label) || ' (accent after the scene)', b.directive, b.face_swap_directive,
       b.sort_order * 10 + 2, true, false, true, b.client_meta, b.flux_fragment, 'after_scene', true, b.key
FROM public.dream_vibes b JOIN fam USING (key)
UNION ALL
SELECT b.key || '__bold', b.label || ' · bold', COALESCE(b.description, b.label) || ' (accent up front)', b.directive, b.face_swap_directive,
       b.sort_order * 10 + 3, true, false, true, b.client_meta, b.flux_fragment, 'early', true, b.key
FROM public.dream_vibes b JOIN fam USING (key)
ON CONFLICT (key) DO UPDATE SET
  label = EXCLUDED.label, description = EXCLUDED.description, directive = EXCLUDED.directive,
  face_swap_directive = EXCLUDED.face_swap_directive, sort_order = EXCLUDED.sort_order, is_active = EXCLUDED.is_active,
  is_dream_eligible = EXCLUDED.is_dream_eligible, nightly_only = EXCLUDED.nightly_only, client_meta = EXCLUDED.client_meta,
  flux_fragment = EXCLUDED.flux_fragment, fragment_position = EXCLUDED.fragment_position,
  nightly_pool = EXCLUDED.nightly_pool, version_of = EXCLUDED.version_of;

UPDATE public.dream_vibes SET nightly_pool = false WHERE key IN (SELECT key FROM fam);
DROP TABLE fam;
