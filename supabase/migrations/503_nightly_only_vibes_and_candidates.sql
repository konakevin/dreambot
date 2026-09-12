-- 503_nightly_only_vibes_and_candidates.sql — vibe axis for the nightly LOOKS refactor (NIGHTLY_VIBES_AUDIT.md).
--
-- 1. dream_vibes.nightly_only — a vibe the NIGHTLY engine may use that the Create screen must NOT list.
--    get_dream_vibes() (the client's picker source) now excludes them; the edge fetchVibes() still loads every
--    active row, so resolveVibeFromDb(key) / force_vibe reach them. Flip nightly_only=false to expose to Create.
-- 2. Ten PROPOSED nightly vibes (Kevin 2026-09-11: "make new ones that would be more fun/cool/pretty/exciting"),
--    inserted nightly_only + is_dream_eligible=false: they render only via force_vibe until the vibe matrix
--    finalises the list (scripts/qa-nightly-vibes-matrix.js). Each is an ATMOSPHERE accent (light, palette,
--    weather, set dressing) that fits any location and never restyles the people — the same contract as the
--    incumbents (cinematic / cozy / epic / nostalgic / peaceful).
ALTER TABLE public.dream_vibes ADD COLUMN IF NOT EXISTS nightly_only boolean NOT NULL DEFAULT false;
COMMENT ON COLUMN public.dream_vibes.nightly_only IS
  'true = usable by the nightly engine only; hidden from get_dream_vibes() (the Create picker). Mig 503.';

DROP FUNCTION IF EXISTS public.get_dream_vibes();
CREATE OR REPLACE FUNCTION public.get_dream_vibes()
RETURNS TABLE(
  key text,
  label text,
  description text,
  directive text,
  sort_order integer,
  client_meta jsonb
) LANGUAGE sql STABLE AS $$
  SELECT key, label, description, directive, sort_order, client_meta
  FROM public.dream_vibes
  WHERE is_active = true AND nightly_only = false
  ORDER BY sort_order;
$$;

INSERT INTO public.dream_vibes (key, label, description, directive, sort_order, is_active, is_dream_eligible, nightly_only, client_meta)
VALUES
('golden_hour', 'Golden Hour', 'Honey light',
 $d$The last hour of sun. Low warm light rakes across the scene from near the horizon, turning every edge to honey and amber, laying long soft shadows and catching haze, leaves, hair and fabric in a warm rim glow. A gentle lens-warm flare where the sun grazes the frame, the sky graded peach to pale gold, warm highlights against cool violet shadows. Everything looks touched by the best light of the day. The mood is glowing, generous and unhurried, a perfect evening that is not over yet.
IMPORTANT: this vibe colors the SCENE and ATMOSPHERE only — the subject's skin, hair, and physical complexion stay their natural selves, never tinted to match this palette.$d$,
 30, true, false, true,
 '{"restyle_fragment":"Grade the image like the last hour of sun: warm amber rim light, long soft shadows, peach-to-gold sky, a gentle warm flare."}'::jsonb),
('blue_hour', 'Blue Hour', 'Twilight blues',
 $d$The hush just after sunset. The sky is a deep saturated cobalt fading to violet at the horizon and the whole scene is bathed in cool soft blue light with no hard shadows. The first lights come on: lamps, windows, lanterns and candles glow warm amber against the blue, their reflections doubling in glass and water. A cool-warm duet of blue air and golden points of light. The mood is tender and expectant, the quiet magic of the day turning into evening.
IMPORTANT: this vibe colors the SCENE and ATMOSPHERE only — the subject's skin, hair, and physical complexion stay their natural selves, never tinted to match this palette.$d$,
 31, true, false, true,
 '{"restyle_fragment":"Grade the image as twilight blue hour: cool cobalt-blue ambient light, warm amber lamps and windows glowing against it, soft shadowless dusk."}'::jsonb),
('moonlit', 'Moonlit', 'Silver night',
 $d$A clear night under a bright full moon. Cool silver light floods the scene from high above, bright enough to read every surface, laying crisp moon-shadows and a pale glow on stone, water, glass and leaves. A deep indigo sky salted with stars, thin drifting cloud lit from behind, a faint low mist catching the silver. Small warm accents are welcome: a lantern, a lit window, a candle. The mood is romantic, hushed and a little enchanted, a world made of silver and shadow.
IMPORTANT: this vibe colors the SCENE and ATMOSPHERE only — the subject's skin, hair, and physical complexion stay their natural selves, never tinted to match this palette.$d$,
 32, true, false, true,
 '{"restyle_fragment":"Grade the image as a moonlit night: cool silver key light from above, deep indigo shadows, a starry sky, one warm lantern accent."}'::jsonb),
('stormlight', 'Stormlight', 'Before the storm',
 $d$The charged minutes before a storm breaks. Towering dark thunderheads stack the sky while shafts of brilliant sun break through gaps in the cloud, lighting the scene in dramatic bright patches against a bruised grey-violet backdrop. Wind moves hair, fabric, leaves and grass. The air is thick, the colors saturated and electric, every surface lit by that strange bright-against-dark storm light. Lightning stays far off on the horizon at most. The mood is thrilling, wild and alive, the moment right before everything changes.
IMPORTANT: this vibe colors the SCENE and ATMOSPHERE only — the subject's skin, hair, and physical complexion stay their natural selves, never tinted to match this palette.$d$,
 33, true, false, true,
 '{"restyle_fragment":"Grade the image like the minutes before a storm: dark bruised thunderheads, shafts of bright sun breaking through, saturated electric color, wind in the fabric."}'::jsonb),
('festive', 'Festive', 'Party lights',
 $d$An intimate celebration is underway and the scene is dressed for it: strings of warm bulb lights and paper lanterns overhead, bunting and garlands, confetti drifting through the air, flowers and ribbons, a table of cake and champagne glasses, sparkle on every surface. Warm golden light with pops of bright joyful color and soft bokeh from every bulb. The celebration lives in the decor and the light. The mood is joyful, generous and a little giddy, the best night of the year in full swing.
IMPORTANT: this vibe colors the SCENE and ATMOSPHERE only — the subject's skin, hair, and physical complexion stay their natural selves, never tinted to match this palette.$d$,
 34, true, false, true,
 '{"restyle_fragment":"Grade the image festive: warm string-light glow, golden bokeh, confetti and lantern color pops, a celebratory sparkle across everything."}'::jsonb),
('after_rain', 'After the Rain', 'Fresh and glistening',
 $d$The world just after a rain shower. Every surface is wet and glistening: puddles mirror the sky and the lights, raindrops bead on leaves, glass and railings, stone and pavement shine dark and reflective. The air is washed clean and cool, colors deepened and saturated, greens vivid, a soft grey-silver sky breaking open with the first warm light. Light doubles in every reflection. The mood is fresh, clean and quietly romantic, the pleasure of stepping out right as the rain stops.
IMPORTANT: this vibe colors the SCENE and ATMOSPHERE only — the subject's skin, hair, and physical complexion stay their natural selves, never tinted to match this palette.$d$,
 35, true, false, true,
 '{"restyle_fragment":"Grade the image as just after rain: wet reflective surfaces, beaded raindrops, deepened saturated greens, a silver sky breaking into warm light."}'::jsonb),
('sun_drenched', 'Sun-Drenched', 'High summer',
 $d$Bright, bold high-summer sun. Hard clean daylight, a deep blue sky, crisp shadows and brilliant highlights, colors saturated and cheerful: turquoise, lemon, coral, white and leaf green. Heat shimmer in the distance, sun sparkle on water and glass, everything crisp, vivid and wide awake. The mood is energetic, carefree and happy, a perfect summer afternoon.
IMPORTANT: this vibe colors the SCENE and ATMOSPHERE only — the subject's skin, hair, and physical complexion stay their natural selves, never tinted to match this palette.$d$,
 36, true, false, true,
 '{"restyle_fragment":"Grade the image sun-drenched: hard bright summer daylight, deep blue sky, crisp shadows, saturated cheerful turquoise-lemon-coral color."}'::jsonb),
('spotlight', 'Spotlight', 'Center stage',
 $d$Theatrical stage lighting. A single strong warm spotlight from above and in front picks out the people and the spot they stand on, a soft haze glowing in the beam, while the surroundings fall into deep rich shadow with only glints and edges visible. Colored stage accents are welcome: a cool blue or magenta rim light from behind, a faint gel wash on the backdrop. Dramatic, glamorous, high-contrast and polished. The mood is showtime, a star moment with every eye on them.
IMPORTANT: this vibe colors the SCENE and ATMOSPHERE only — the subject's skin, hair, and physical complexion stay their natural selves, never tinted to match this palette.$d$,
 37, true, false, true,
 '{"restyle_fragment":"Grade the image like a stage: one warm spotlight on the subject, haze in the beam, deep dark surroundings, a cool colored rim light."}'::jsonb),
('aurora', 'Aurora', 'Northern lights',
 $d$The northern lights are dancing overhead. Wherever sky is visible, through windows, glass, an open roof or above the scene, it ripples with curtains of green, teal, violet and rose light, and that glow spills down into the scene, tinting mist, snow, water, glass and pale surfaces with soft aurora color. Deep night blue with stars behind the curtains. Warm accents from lanterns or windows are welcome. The mood is awe-struck, hushed and magical, a once-in-a-lifetime sky.
IMPORTANT: this vibe colors the SCENE and ATMOSPHERE only — the subject's skin, hair, and physical complexion stay their natural selves, never tinted to match this palette.$d$,
 38, true, false, true,
 '{"restyle_fragment":"Grade the image under the northern lights: green-teal-violet aurora glow spilling from the sky, deep night blue, starlight, one warm lantern accent."}'::jsonb),
('prism', 'Prism', 'Light through crystal',
 $d$Light split into color. Sunlight passes through glass, crystal, water or mist and throws rainbow refractions across the scene: prismatic flares, faint rainbow arcs on walls and floors, an iridescent sheen on glass and wet surfaces, tiny spectrum sparkles. The overall light stays soft and bright, the palette clean and pastel-tinged, with those rainbow accents as jewelry. The mood is delighted, luminous and pretty, a scene that seems to be smiling.
IMPORTANT: this vibe colors the SCENE and ATMOSPHERE only — the subject's skin, hair, and physical complexion stay their natural selves, never tinted to match this palette.$d$,
 39, true, false, true,
 '{"restyle_fragment":"Grade the image prismatic: soft bright light with rainbow refractions and flares, iridescent sheen on glass and water, clean pastel-tinged palette."}'::jsonb)
ON CONFLICT (key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  directive = EXCLUDED.directive,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  is_dream_eligible = EXCLUDED.is_dream_eligible,
  nightly_only = EXCLUDED.nightly_only,
  client_meta = EXCLUDED.client_meta;
