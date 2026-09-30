-- 621: mood groups on the Locations page (Kevin 2026-09-30: "i don't like the real world and dream world separation
-- ... group by concepts?", then picked mood groups). picker_tiles.section is the group header a tile sits under; the
-- picker shows the groups in the order of their first tile (sort_order), and a tile without a section falls back to its
-- tier (Real World / Dream Worlds), so nothing breaks if a new tile is added without one. Read by the 1.11.0 picker
-- (lib/pickerSections.ts groupPickerSections); released apps never read this table. Tile keys are unchanged.
--   Around the World  Europe, Asia & Pacific, The Americas, Middle East & Africa
--   Sun & Sea         Tropical Escapes, Beach Towns
--   Wild Places       Nature & Wild, Wild West
--   Through Time      Ancient Worlds, Vintage Eras
--   Love & Luxury     Romantic Escapes, Jet Set
--   Magic & Wonder    Fantasy, Whimsical, Dreamscapes, Sci-Fi & Space
--   Thrills & Chills  Action & Adventure, Gothic & Haunted, Just for Fun
-- Re-runnable.

ALTER TABLE public.picker_tiles ADD COLUMN IF NOT EXISTS section text;
COMMENT ON COLUMN public.picker_tiles.section IS
  'The group header this tile sits under on the Locations page (mig 621); groups appear in the order of their first tile. NULL = its tier (Real World / Dream Worlds).';

DO $$
DECLARE
  n int;
BEGIN
  UPDATE public.picker_tiles AS t SET section = v.section, sort_order = v.sort_order
  FROM (VALUES
    ('europe',             'Around the World', 10),
    ('asia_pacific',       'Around the World', 20),
    ('americas',           'Around the World', 30),
    ('middle_east_africa', 'Around the World', 40),
    ('tropical_escapes',   'Sun & Sea',        50),
    ('beach_towns',        'Sun & Sea',        60),
    ('nature',             'Wild Places',      70),
    ('wild_west',          'Wild Places',      80),
    ('ancient_worlds',     'Through Time',     90),
    ('vintage_eras',       'Through Time',    100),
    ('romance',            'Love & Luxury',   110),
    ('high_life',          'Love & Luxury',   120),
    ('fantasy',            'Magic & Wonder',  130),
    ('whimsical',          'Magic & Wonder',  140),
    ('surreal_dreams',     'Magic & Wonder',  150),
    ('scifi',              'Magic & Wonder',  160),
    ('heroes',             'Thrills & Chills', 170),
    ('gothic',             'Thrills & Chills', 180),
    ('just_for_fun',       'Thrills & Chills', 190)
  ) AS v(key, section, sort_order)
  WHERE t.key = v.key;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 19 THEN
    RAISE EXCEPTION '621: expected 19 tiles, updated %', n;
  END IF;
END $$;
