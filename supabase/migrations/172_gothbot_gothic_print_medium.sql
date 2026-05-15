-- GothBot bespoke medium for gothic-architecture path (2026-05-15).
-- The legacy 'anime' medium was producing decent anime-illustration renders but
-- Kevin wants a more illustrative-realistic look — "super crisp, detailed
-- illustration/canvas print, but not photorealism. A super rich/vivid high def
-- illustration."
--
-- This medium pushes Flux toward Karl-Kopinski / John-Howe / Ted-Nasmith
-- painted-canvas fantasy-cover quality with hyper-detailed gothic ornament,
-- vivid saturated palette, sharp clean linework, master-illustrator finish.
-- NOT photoreal, NOT film-still, NOT 35mm.
--
-- Path → medium override is in scripts/bots/gothbot/index.js mediumByPath.
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
  'gothbot_gothic_print',
  'GothBot Gothic Print',
  'Render a hyper-detailed gothic concept-art illustration in the painted-canvas tradition — Karl Kopinski / John Howe / Ted Nasmith / Mark Brooks fantasy-cover quality. Vivid saturated palette with deep purples, midnight blues, candle-amber, witch-fire green, blood-red accents. Sharp clean linework — every architectural ornament rendered crisp at every readable scale. Theatrical lighting with high contrast. Master-illustrator finish with rich color depth and high-def fidelity. NOT photoreal, NOT film-still, NOT 35mm, NOT photo-realistic CGI. Think painted fantasy book cover, gallery print, art-of-the-game concept-art splash page.',
  'hyper-detailed gothic concept-art illustration, master-illustrator painted-canvas finish, vivid saturated palette with deep purples and candle-amber and witch-fire green and blood-red accents, sharp clean linework, every architectural ornament rendered crisp, theatrical high-contrast lighting, rich color depth, high-def gallery-print fidelity, painted fantasy book cover quality, NOT photoreal NOT film-still NOT 35mm NOT photo-realistic CGI',
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
