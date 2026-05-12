-- StarBot bot-only medium for space-opera path.
-- Existing starbot_hyperreal medium prefix ("science-fiction world / movie-poster
-- composition / mythic epic scale") biases Flux toward landscape vistas, causing
-- 40-60% ground-drift on space-opera renders (kilometer-class behemoth ships
-- should be in cosmic vacuum, not on canyons/lava/ruins). This medium mandates
-- pure space-vacuum context with ship-as-subject.
--
-- Path → medium override is in scripts/bots/starbot/index.js mediumByPath.
-- Local prefix/style/suffix overrides are also in index.js, matching the DB row.

INSERT INTO public.dream_mediums (
  key,
  label,
  directive,
  flux_fragment,
  is_active,
  is_bot_only,
  is_character_only,
  face_swaps,
  character_render_mode,
  sort_order
) VALUES (
  'starbot_cosmic_void',
  'StarBot Cosmic Void',
  'Render an epic cosmic space scene set in pure vacuum, deep void of space. The MAIN SUBJECT is a kilometer-class capital spaceship dominating the frame, surrounded by smaller craft (fighter wings, cargo trains, satellites, escorts) as scale provers. The setting is starfield, nebula clouds, debris fields, or planet curves seen FROM ORBIT — never planetary surface, never canyon, never ground-level, never atmospheric descent. Photoreal cinematic sci-fi concept art, ray-traced volumetric lighting in vacuum, hull materials detailed at kilometer-class scale.',
  'epic cosmic space scene in pure vacuum, deep void of space, kilometer-class capital spaceships dominating frame, starfield and nebula backdrop only, ship-as-subject composition, hyperrealistic photoreal cinematic sci-fi, ray-traced volumetric lighting in vacuum, photoreal hull materials with weapon batteries lit-window grids hangar bays visible, smaller fighter wings and cargo trains as scale provers, NOT planetary surface, NOT canyon, NOT ground-level, NOT atmospheric, NOT cityscape',
  false,
  true,
  false,
  false,
  'natural',
  99
)
ON CONFLICT (key) DO UPDATE
  SET label = EXCLUDED.label,
      directive = EXCLUDED.directive,
      flux_fragment = EXCLUDED.flux_fragment,
      is_active = EXCLUDED.is_active,
      is_bot_only = EXCLUDED.is_bot_only,
      is_character_only = EXCLUDED.is_character_only,
      face_swaps = EXCLUDED.face_swaps,
      character_render_mode = EXCLUDED.character_render_mode;
