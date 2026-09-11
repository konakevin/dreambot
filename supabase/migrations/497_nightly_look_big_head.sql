-- 497_nightly_look_big_head.sql — round-3 add-on (Kevin 2026-09-11: "a 'big head' look that put oversized heads on
-- bodies might be a funny look"). The round-1 floating-heads FAILURES were the swap pasting full-size faces onto tiny
-- bodies; done on purpose, an oversized head with a lifelike face is swap-FRIENDLY (a bigger face lands easier).
-- Fragment leads with the natural-eye-size clause so the proportions are playful but the face stays real.
-- Inert row (nightly_surfaces = {} until graded), reached only by force_look.
INSERT INTO public.dream_mediums
  (key, label, description, directive, flux_fragment, face_swap_flux_fragment, sort_order, allowed_models, preferred_model, client_meta,
   is_active, is_public, is_dream_eligible, is_scene_eligible, is_scene_only, is_character_only, is_bot_only, nightly_skip, face_swaps, character_render_mode,
   nightly_look, nightly_surfaces, weight)
VALUES (
  'nightly_big_head', 'Big Head', 'Playful big-head caricature, realistic face',
  'Render the entire scene as a playful big-head caricature painting: painted big-head caricature figures with oversized heads on small bodies, realistic painted facial features and true-to-life eyes at natural size, soft painted skin, the setting in polished painted realism. People rendered as real adults with lifelike faces; only the head-to-body proportion is exaggerated.',
  'painted big-head caricature portrait, oversized heads on small bodies, realistic painted facial features, soft painted skin, playful exaggerated proportions, the setting rendered in polished painted realism, glossy caricature-print finish',
  'lifelike adult faces with realistic human facial proportions and true-to-life eyes at natural size and spacing, painted big-head caricature portrait, oversized heads on small bodies, realistic painted facial features, soft painted skin, playful exaggerated head-to-body proportions, the setting rendered in polished painted realism, glossy caricature-print finish',
  996, ARRAY['black-forest-labs/flux-1.1-pro','black-forest-labs/flux-2-flex']::text[], 'black-forest-labs/flux-1.1-pro',
  '{"nightly_look_candidate":true,"round":3,"smart_dream_models":["black-forest-labs/flux-1.1-pro","black-forest-labs/flux-2-flex"],"smart_dream_default":"black-forest-labs/flux-1.1-pro","recommended_models":["black-forest-labs/flux-1.1-pro","black-forest-labs/flux-2-flex"]}'::jsonb,
  true, false, false, false, false, false, false, true, true, 'natural',
  true, '{}'::text[], 1)
ON CONFLICT (key) DO UPDATE SET
  label = EXCLUDED.label, description = EXCLUDED.description, directive = EXCLUDED.directive,
  flux_fragment = EXCLUDED.flux_fragment, face_swap_flux_fragment = EXCLUDED.face_swap_flux_fragment,
  sort_order = EXCLUDED.sort_order, client_meta = EXCLUDED.client_meta, nightly_look = true;
