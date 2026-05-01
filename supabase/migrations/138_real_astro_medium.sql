-- 138 — Add real_astro as a bot-only medium for StarBot's real-space path.
--
-- Background: StarBot's real-space path renders NASA-grade astrophotography
-- (Hubble / JWST / ESO false-color composites). Migration 137's remap pushed
-- 11 historical `real-astro` uploads into `photography`, but the bot's runtime
-- still writes its own `real_astro` key. Without a row, the engine resolver
-- falls back to canvas on DLT — losing the aesthetic.
--
-- This row is bot-only (is_active=false, is_bot_only=true) so the engine
-- resolves it for DLT but the user-facing picker doesn't show it.

INSERT INTO public.dream_mediums (
  key, label, directive, flux_fragment,
  is_active, is_bot_only, is_character_only,
  face_swaps, character_render_mode,
  sort_order
) VALUES (
  'real_astro',
  'Real Astro',
  'Render as NASA-grade astrophotography in the tradition of Hubble / JWST / ESO deep-space imagery. False-color composite mapping where each emission wavelength reads as a distinct vibrant hue (cyan oxygen, magenta hydrogen, gold sulfur). Luminous nebula clouds glow from within with volumetric depth — translucent, layered, atmospheric. Star fields are dense and blazing with prominent diffraction spikes on the brightest stars. Deep absolute-black void contrast frames everything. Color saturation pushed to wallpaper-worthy maximum without crossing into garish — scientific imaging at its most stunning. NOT painted concept art, NOT smooth digital illustration, NOT CGI, NOT cartoon — the surface texture must read as photographic data captured by a space telescope.',
  'NASA Hubble JWST astrophotography, false-color composite, vibrant wavelength-mapped colors, luminous glowing nebula clouds, blazing star fields with diffraction spikes, deep black void contrast, saturated vivid deep-space imaging, scientific imaging aesthetic',
  false,  -- is_active
  true,   -- is_bot_only
  false,  -- is_character_only
  false,  -- face_swaps
  'natural',
  999
)
ON CONFLICT (key) DO NOTHING;
