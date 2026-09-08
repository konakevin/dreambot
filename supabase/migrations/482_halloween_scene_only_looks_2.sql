-- 482 — Halloween SCENE-ONLY stylized looks, batch 2 (HOLIDAY_DAY_OF_PLAN.md §5e): claymation, paper-cut
-- shadow theater, needle-felt. Same posture as mig 481: reserved halloween_ namespace, scene-only, never
-- listed in the app, never rolled by nightly — pinned by the pools' rows via holiday_scenes.medium_key.
INSERT INTO public.dream_mediums
  (key, label, description, directive, flux_fragment, face_swap_flux_fragment, sort_order, allowed_models, preferred_model, client_meta,
   is_active, is_public, is_dream_eligible, is_scene_eligible, is_scene_only, is_character_only, is_bot_only, nightly_skip, face_swaps, character_render_mode)
VALUES
  ('halloween_claymation', 'Halloween Claymation', 'Plasticine stop-motion, thumbprints and all',
   'a claymation film still: matte plasticine with visible thumbprints, chunky rounded proportions, tabletop set lighting, glossy clay highlights, handmade stop-motion charm',
   'claymation film still, matte plasticine with visible thumbprints, chunky rounded proportions, tabletop set lighting, glossy clay highlights, handmade stop-motion charm, crisp macro detail',
   NULL, 912,
   ARRAY['black-forest-labs/flux-1.1-pro','black-forest-labs/flux-2-flex','google/gemini-2-image','xai/grok-imagine-image']::text[],
   'black-forest-labs/flux-1.1-pro',
   '{"scene_only_look": true, "smart_dream_models": ["black-forest-labs/flux-1.1-pro","black-forest-labs/flux-2-flex","google/gemini-2-image","xai/grok-imagine-image"], "smart_dream_default": "black-forest-labs/flux-1.1-pro"}'::jsonb,
   true, false, false, false, true, false, false, true, false, 'natural'),
  ('halloween_papercut', 'Halloween Paper Cut', 'Layered paper-cut diorama, backlit',
   'a layered paper-cut diorama: black cut-paper silhouettes in stacked planes, backlit amber, violet and teal, visible paper edges and long theatrical shadows, shadow-theater depth',
   'layered paper-cut diorama, black cut-paper silhouettes in stacked planes, backlit amber violet and teal glow, visible paper edges, long theatrical shadows, shadow-theater depth, crisp craft detail',
   NULL, 913,
   ARRAY['black-forest-labs/flux-1.1-pro','black-forest-labs/flux-2-flex','google/gemini-2-image','xai/grok-imagine-image']::text[],
   'black-forest-labs/flux-1.1-pro',
   '{"scene_only_look": true, "smart_dream_models": ["black-forest-labs/flux-1.1-pro","black-forest-labs/flux-2-flex","google/gemini-2-image","xai/grok-imagine-image"], "smart_dream_default": "black-forest-labs/flux-1.1-pro"}'::jsonb,
   true, false, false, false, true, false, false, true, false, 'natural'),
  ('halloween_felt', 'Halloween Felt', 'Needle-felted wool and yarn craft',
   'a needle-felted wool craft scene: fuzzy wool fibres, embroidered stitches, yarn details, button accents, soft macro depth of field, warm handmade textile charm',
   'needle-felted wool craft scene, fuzzy wool fibres, embroidered stitches, yarn details, button accents, soft macro depth of field, warm handmade textile charm, crisp fibre detail',
   NULL, 914,
   ARRAY['black-forest-labs/flux-1.1-pro','black-forest-labs/flux-2-flex','google/gemini-2-image','xai/grok-imagine-image']::text[],
   'black-forest-labs/flux-1.1-pro',
   '{"scene_only_look": true, "smart_dream_models": ["black-forest-labs/flux-1.1-pro","black-forest-labs/flux-2-flex","google/gemini-2-image","xai/grok-imagine-image"], "smart_dream_default": "black-forest-labs/flux-1.1-pro"}'::jsonb,
   true, false, false, false, true, false, false, true, false, 'natural')
ON CONFLICT (key) DO UPDATE SET
  label = EXCLUDED.label, description = EXCLUDED.description, directive = EXCLUDED.directive,
  flux_fragment = EXCLUDED.flux_fragment, sort_order = EXCLUDED.sort_order, allowed_models = EXCLUDED.allowed_models,
  preferred_model = EXCLUDED.preferred_model, client_meta = EXCLUDED.client_meta, is_active = true, is_public = false,
  is_dream_eligible = false, is_scene_eligible = false, is_scene_only = true, nightly_skip = true, face_swaps = false;
