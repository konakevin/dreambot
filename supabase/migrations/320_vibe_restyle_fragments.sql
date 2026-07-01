-- Migration 320: restyle-safe vibe fragments (client_meta.restyle_fragment).
--
-- Context (2026-07-01): restyle sent the vibe as a raw 200-char slice of the
-- scene-generation directive, cut mid-word, full of scene content ("reading
-- nooks, porch corners") that Kontext cannot apply while the medium directive
-- commands "keep the exact composition". A/B on the same photo: cozy vs
-- macabre restyles were indistinguishable — the vibe was a no-op.
--
-- Each active vibe now carries an IMPERATIVE color/light/atmosphere grade with
-- NO scene content — the one lever an img2img edit actually has. Consumed by
-- restyle-photo via fetchVibes (dreamStyles.ts restyleFragment); composed as
-- "Also shift the overall mood and color grade of the image: <fragment>"
-- (photoPrompts.ts). A vibe without a fragment falls back to the legacy slice.
--
-- Authoring rules for future vibes: start with "Grade the image ...", name
-- palette / lighting / contrast / atmosphere ONLY (never rooms, props,
-- weather-as-objects, or subjects), keep it under ~220 chars.
--
-- APPLIED TO PROD via service-role PostgREST on 2026-07-01 (data-only change;
-- this file is the record).

UPDATE public.dream_vibes SET client_meta = coalesce(client_meta, '{}'::jsonb) || jsonb_build_object('restyle_fragment', fragment)
FROM (VALUES
  ('cinematic',    'Grade the image like a frame from a great film: filmic teal and amber color grade, dramatic directional key light, deep cinematic contrast, a subtle atmospheric haze.'),
  ('dark',         'Grade the image low-key and moody: plunge the surroundings into deep shadow, keep one restrained key light on the subject, crushed blacks, cool desaturated palette.'),
  ('cozy',         'Grade the image warm and intimate: golden lamplight glow, soft amber palette, gentle warm shadows, a hearth-lit comfortable warmth across everything.'),
  ('minimal',      'Grade the image clean and restrained: quiet neutral palette, low saturation, soft even light, calm airy tones with nothing loud or busy.'),
  ('epic',         'Grade the image monumental and dramatic: sweeping golden-hour light, bold contrast between light and shadow, rich saturated sky tones, heroic large-scale atmosphere.'),
  ('nostalgic',    'Grade the image like a fond memory: faded warm film tones, soft blooming highlights, a slight sepia lean, a gentle vignette like an old photograph.'),
  ('psychedelic',  'Grade the image trippy and vivid: saturated rainbow hues flowing across surfaces, iridescent color shifts, a gentle rippling glow, kaleidoscopic color energy.'),
  ('peaceful',     'Grade the image serene and still: soft dawn light, pale tranquil palette of blues and creams, low contrast, a hushed misty calm.'),
  ('whimsical',    'Grade the image playful and storybook-bright: cheerful candy-leaning palette, sparkling highlights, sunny soft light, lighthearted picture-book warmth.'),
  ('ethereal',     'Grade the image dreamlike and otherworldly: pale luminous glow as if the air itself is lit, soft white diffusion, delicate pastel iridescence, weightless floating light.'),
  ('arcane',       'Grade the image mystical and enchanted: deep twilight palette with glowing violet and gold accents, faint magical shimmer on edges and highlights, candlelit warmth against blue shadow.'),
  ('ancient',      'Grade the image timeworn and weathered: dusty parchment palette, faded ochres and stone grays, an aged patina over every surface, the soft antique light of a forgotten age.'),
  ('enchanted',    'Grade the image with fairy-tale luminescence: golden dusk warmth, softly glowing highlights, jewel-toned accents, light that finds the prettiest edges of everything.'),
  ('fierce',       'Grade the image intense and powerful: hot high-contrast light, burning reds and oranges against deep blacks, dramatic rim lighting, a charged explosive atmosphere.'),
  ('coquette',     'Grade the image soft and sweet: rosy pastel palette of pinks and creams, silky diffused glow, delicate blooming highlights, gentle romantic softness.'),
  ('voltage',      'Grade the image electric and nocturnal: neon palette of magenta, cyan and violet, glowing highlights like city lights at night, deep blue shadows, humming late-night energy.'),
  ('nightshade',   'Grade the image gothic and moonlit: silver-blue moonlight, deep velvet shadows, desaturated dark-romantic tones, a faint cold mist.'),
  ('macabre',      'Grade the image spooky and whimsical: desaturated Victorian palette, cool moonlit shadows, deep vignettes, faint fog, a playful gothic gloom.'),
  ('shimmer',      'Grade the image glowing and flattering: soft bloom on the highlights, gentle rim light on the subject, silky luminous tones, a fine sparkling sheen over everything.'),
  ('surreal',      'Grade the image subtly dreamlike: slightly unreal color balance, soft light with no clear direction, a faint impossible glow, the quiet sense that something is gently off.'),
  ('kawaii',       'Grade the image candy-cute: pastel palette of pink, mint and cream, bright bubbly even light, glossy sweet highlights, maximum adorable softness.'),
  ('high_fantasy', 'Grade the image like a fantasy realm: enchanted golden-green light, rich storybook saturation, a faint magical glow in the air, surfaces kissed with high-fantasy wonder.')
) AS v(vibe_key, fragment)
WHERE dream_vibes.key = v.vibe_key;
