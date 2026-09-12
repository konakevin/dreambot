-- 504_vibe_flux_fragments.sql — the vibe's verbatim prompt accent (NIGHTLY_VIBES_AUDIT.md §6.4).
-- A ≤140-char light / palette / weather clause the composer places directly after scene_description
-- (characterSlotPrompt.ts `vibeFragment`), so the vibe no longer depends on Sonnet compressing its 700-char
-- directive into three mood words at the tail of the prompt. Round B of the vibe matrix tests exactly this.
-- Rules: light, palette, weather, set dressing only. No composition words, no finish/medium words (the LOOK
-- owns the finish), no objects in front of the people, no trap tokens ("fire", "particle", "herd").
ALTER TABLE public.dream_vibes ADD COLUMN IF NOT EXISTS flux_fragment text;
COMMENT ON COLUMN public.dream_vibes.flux_fragment IS
  'Verbatim ≤140-char atmosphere accent placed after scene_description on cast renders (mig 504). Null = no accent.';

UPDATE public.dream_vibes AS v SET flux_fragment = f.frag FROM (VALUES
  ('cinematic',   'filmic directional light with deliberate shadow, a muted teal-and-amber grade, thin atmospheric haze, quiet tension in the air'),
  ('cozy',        'warm golden lamplight and candle glow, soft amber shadows, an intimate sheltered warmth over everything'),
  ('epic',        'grand sweeping light, sun rays breaking through towering dramatic clouds, a vast luminous sky, solemn monumental atmosphere'),
  ('nostalgic',   'late-afternoon honeyed light, lifted soft shadows, faded warm tones of a fond memory, a gentle glow on everything'),
  ('peaceful',    'still dawn light, pale tranquil blues and creams, low mist, mirror-calm water, a hushed windless quiet'),
  ('dark',        'low-key moody night, deep velvety shadows, one precious light source, teal and violet glints in the gloom'),
  ('ethereal',    'soft omnidirectional glow as if the air itself is lit, pearl and sage haze, weightless luminous mist'),
  ('arcane',      'drifting motes of magical light, lanterns burning in impossible colors, a soft luminous enchanted mist'),
  ('enchanted',   'fairy-tale sparkle drifting through the air, colors glowing brighter than life, light finding its prettiest angle'),
  ('nightshade',  'moonlit gothic glamour, candlelight against midnight blue and deep crimson, low fog curling over the ground'),
  ('golden_hour', 'low golden-hour sun raking across the scene, long soft shadows, warm rim light, a peach-to-gold sky'),
  ('blue_hour',   'cobalt blue twilight, soft shadowless dusk light, warm amber lamps and windows glowing against the blue'),
  ('moonlit',     'bright full-moon silver light from above, crisp moon shadows, a starry indigo sky, a faint low mist'),
  ('stormlight',  'dark towering thunderheads with shafts of brilliant sun breaking through, wind in the leaves, electric saturated color'),
  ('festive',     'strings of warm bulb lights and paper lanterns overhead, confetti in the air, golden bokeh, joyful pops of color'),
  ('after_rain',  'just after rain, wet glistening surfaces and mirror puddles, beaded raindrops, deep saturated greens, a silver sky breaking into warm light'),
  ('sun_drenched','hard bright high-summer sun, a deep blue sky, crisp shadows, saturated turquoise, lemon and coral color'),
  ('spotlight',   'a single warm theatrical spotlight on the subject with haze glowing in the beam, deep dark surroundings, a cool magenta rim light'),
  ('aurora',      'aurora curtains of green, teal and violet light rippling across the night sky, their glow spilling onto every surface, stars behind'),
  ('prism',       'sunlight split through glass into rainbow refractions, prismatic flares and iridescent sheen, soft bright pastel-tinged light')
) AS f(key, frag) WHERE v.key = f.key;
