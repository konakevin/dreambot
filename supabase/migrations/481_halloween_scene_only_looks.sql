-- 481 — Halloween SCENE-ONLY stylized looks (HOLIDAY_DAY_OF_PLAN.md §5e; Kevin 2026-09-08: "genres like
-- nightmare before christmas (the same look, avoid rendering the IP), coraline … coco … day of the dead").
-- Two dream_mediums rows in the reserved halloween_ namespace, pinned by the scene-only pools' rows via
-- holiday_scenes.medium_key (the pure-scene holiday branch takes the pinned fragment). Never listed in the
-- app (is_public=false), never rolled by nightly (nightly_skip=true, not dream/scene-eligible), scene-only.
INSERT INTO public.dream_mediums
  (key, label, description, directive, flux_fragment, face_swap_flux_fragment, sort_order, allowed_models, preferred_model, client_meta,
   is_active, is_public, is_dream_eligible, is_scene_eligible, is_scene_only, is_character_only, is_bot_only, nightly_skip, face_swaps, character_render_mode)
VALUES
  ('halloween_stop_motion', 'Halloween Stop Motion', 'Hand-built stop-motion puppet world',
   'a stop-motion puppet animation film still: a hand-built miniature set of felt, wool and painted cardboard, wire-jointed puppets with visible stitching, tilt-shift depth of field, warm tabletop practical lighting, handmade charm',
   'stop-motion puppet animation film still, hand-built miniature set, felt and wool textures, wire-jointed puppets with visible stitching, painted cardboard sky, tilt-shift depth of field, warm tabletop practical lighting, handmade charm, crisp macro detail',
   NULL, 910,
   ARRAY['black-forest-labs/flux-1.1-pro','black-forest-labs/flux-2-flex','google/gemini-2-image','xai/grok-imagine-image']::text[],
   'black-forest-labs/flux-1.1-pro',
   '{"scene_only_look": true, "smart_dream_models": ["black-forest-labs/flux-1.1-pro","black-forest-labs/flux-2-flex","google/gemini-2-image","xai/grok-imagine-image"], "smart_dream_default": "black-forest-labs/flux-1.1-pro"}'::jsonb,
   true, false, false, false, true, false, false, true, false, 'natural'),
  ('halloween_marigold_folk', 'Halloween Marigold Folk Art', 'Painted Mexican folk-art animation, marigold and papel picado',
   'a painted Mexican folk-art animation film still: saturated marigold orange, magenta and teal against deep indigo, cut-paper papel picado edges, candlelit glow, calaca skeleton figures in embroidered charro suits, alebrije spirit creatures glowing neon',
   'painted Mexican folk-art animation film still, saturated marigold orange, magenta and teal against deep indigo, cut-paper papel picado edges, candlelit glow, embroidered charro details, neon-glowing alebrije spirit creatures, rich painted texture',
   NULL, 911,
   ARRAY['black-forest-labs/flux-1.1-pro','black-forest-labs/flux-2-flex','google/gemini-2-image','xai/grok-imagine-image']::text[],
   'black-forest-labs/flux-1.1-pro',
   '{"scene_only_look": true, "smart_dream_models": ["black-forest-labs/flux-1.1-pro","black-forest-labs/flux-2-flex","google/gemini-2-image","xai/grok-imagine-image"], "smart_dream_default": "black-forest-labs/flux-1.1-pro"}'::jsonb,
   true, false, false, false, true, false, false, true, false, 'natural')
ON CONFLICT (key) DO UPDATE SET
  label = EXCLUDED.label, description = EXCLUDED.description, directive = EXCLUDED.directive,
  flux_fragment = EXCLUDED.flux_fragment, sort_order = EXCLUDED.sort_order, allowed_models = EXCLUDED.allowed_models,
  preferred_model = EXCLUDED.preferred_model, client_meta = EXCLUDED.client_meta, is_active = true, is_public = false,
  is_dream_eligible = false, is_scene_eligible = false, is_scene_only = true, nightly_skip = true, face_swaps = false;
