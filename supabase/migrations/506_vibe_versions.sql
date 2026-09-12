-- 506_vibe_versions.sql — EVERY version of every vibe from the 2026-09-11 matrix becomes its own vibe
-- (Kevin: "i liked every single version of the vibes … can we save all versions of each as a different vibe?").
--
-- A version = the same directive + a different ACCENT ROUTE, exactly as rendered in rounds A-D:
--   __subtle = round A: no fragment; the directive reaches Flux only through Sonnet's mood words (today's route)
--   __soft   = round B: the original (mig 504) fragment placed AFTER scene_description
--   __bold   = round C/D: the CURRENT fragment placed EARLY (mig 505 rewrite where one exists, else the original)
--   __wild   = round C for the 6 rewritten vibes: the ORIGINAL sky-naming fragment placed EARLY (the camera roams:
--              epic's storm sky, dark's moonlit exterior, spotlight's magenta stage; moonlit's went faceless → omitted)
-- Grouping: version_of = the base key (a "family", rolled family-first like looks, NIGHTLY_VIBES_AUDIT.md §9).
-- Gating: nightly_pool = the LOOKS-PATH roll pool (the style contract). The legacy nightly roll keeps using
-- is_dream_eligible (unchanged: still the 5 incumbents' base rows), and get_dream_vibes() (Create) never lists
-- nightly_only rows — so tonight's production is untouched. The 20 base rows stay Create-facing / canonical.
ALTER TABLE public.dream_vibes
  ADD COLUMN IF NOT EXISTS fragment_position text,
  ADD COLUMN IF NOT EXISTS nightly_pool boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS version_of text REFERENCES public.dream_vibes(key);
ALTER TABLE public.dream_vibes DROP CONSTRAINT IF EXISTS dream_vibes_fragment_position_valid;
ALTER TABLE public.dream_vibes ADD CONSTRAINT dream_vibes_fragment_position_valid
  CHECK (fragment_position IS NULL OR fragment_position IN ('early','after_scene'));
COMMENT ON COLUMN public.dream_vibes.fragment_position IS
  'Where flux_fragment sits in a cast prompt: early (before the person) | after_scene | NULL (no fragment). Mig 506.';
COMMENT ON COLUMN public.dream_vibes.nightly_pool IS
  'true = in the nightly LOOKS-PATH vibe roll (style contract). Independent of is_dream_eligible (legacy roll). Mig 506.';
COMMENT ON COLUMN public.dream_vibes.version_of IS
  'Base vibe key this row is a version of (the roll picks a family first, then a version). NULL = a base row. Mig 506.';

-- The original (mig 504) fragments of the rows mig 505 rewrote — needed verbatim for __soft and __wild.
CREATE TEMP TABLE orig(key text PRIMARY KEY, frag text);
INSERT INTO orig VALUES
  ('cozy',      'warm golden lamplight and candle glow, soft amber shadows, an intimate sheltered warmth over everything'),
  ('epic',      'grand sweeping light, sun rays breaking through towering dramatic clouds, a vast luminous sky, solemn monumental atmosphere'),
  ('dark',      'low-key moody night, deep velvety shadows, one precious light source, teal and violet glints in the gloom'),
  ('moonlit',   'bright full-moon silver light from above, crisp moon shadows, a starry indigo sky, a faint low mist'),
  ('spotlight', 'a single warm theatrical spotlight on the subject with haze glowing in the beam, deep dark surroundings, a cool magenta rim light'),
  ('aurora',    'aurora curtains of green, teal and violet light rippling across the night sky, their glow spilling onto every surface, stars behind'),
  ('prism',     'sunlight split through glass into rainbow refractions, prismatic flares and iridescent sheen, soft bright pastel-tinged light');

CREATE TEMP TABLE fam(key text PRIMARY KEY);
INSERT INTO fam VALUES ('cinematic'),('cozy'),('epic'),('nostalgic'),('peaceful'),('dark'),('ethereal'),('arcane'),
  ('enchanted'),('nightshade'),('golden_hour'),('blue_hour'),('moonlit'),('stormlight'),('festive'),('after_rain'),
  ('sun_drenched'),('spotlight'),('aurora'),('prism');

INSERT INTO public.dream_vibes
  (key, label, description, directive, face_swap_directive, sort_order, is_active, is_dream_eligible, nightly_only,
   client_meta, flux_fragment, fragment_position, nightly_pool, version_of)
SELECT b.key || '__subtle', b.label || ' · subtle', b.description || ' (mood only)', b.directive, b.face_swap_directive,
       b.sort_order * 10 + 1, true, false, true, b.client_meta, NULL, NULL, true, b.key
FROM public.dream_vibes b JOIN fam USING (key)
UNION ALL
SELECT b.key || '__soft', b.label || ' · soft', b.description || ' (accent after the scene)', b.directive, b.face_swap_directive,
       b.sort_order * 10 + 2, true, false, true, b.client_meta, COALESCE(o.frag, b.flux_fragment), 'after_scene', true, b.key
FROM public.dream_vibes b JOIN fam USING (key) LEFT JOIN orig o USING (key)
UNION ALL
SELECT b.key || '__bold', b.label || ' · bold', b.description || ' (accent up front)', b.directive, b.face_swap_directive,
       b.sort_order * 10 + 3, true, false, true, b.client_meta, b.flux_fragment, 'early', true, b.key
FROM public.dream_vibes b JOIN fam USING (key)
UNION ALL
SELECT b.key || '__wild', b.label || ' · wild', b.description || ' (first bold draft, the camera roams)', b.directive, b.face_swap_directive,
       b.sort_order * 10 + 4, true, false, true, b.client_meta, o.frag, 'early', true, b.key
FROM public.dream_vibes b JOIN orig o USING (key) WHERE b.key <> 'moonlit'
ON CONFLICT (key) DO UPDATE SET
  label = EXCLUDED.label, description = EXCLUDED.description, directive = EXCLUDED.directive,
  face_swap_directive = EXCLUDED.face_swap_directive, sort_order = EXCLUDED.sort_order, is_active = EXCLUDED.is_active,
  is_dream_eligible = EXCLUDED.is_dream_eligible, nightly_only = EXCLUDED.nightly_only, client_meta = EXCLUDED.client_meta,
  flux_fragment = EXCLUDED.flux_fragment, fragment_position = EXCLUDED.fragment_position,
  nightly_pool = EXCLUDED.nightly_pool, version_of = EXCLUDED.version_of;

-- Base rows: canonical / Create-facing, never in the looks-path pool themselves (their __bold twin is).
UPDATE public.dream_vibes SET nightly_pool = false, fragment_position = 'early' WHERE key IN (SELECT key FROM fam);
DROP TABLE orig; DROP TABLE fam;
