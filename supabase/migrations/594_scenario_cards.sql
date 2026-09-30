-- 594: SCENARIO CARDS — location cards whose content is their tagged scenarios, not places (SCENARIO_LOCATION_SCOPE.md,
-- Kevin 2026-09-30: goofy "is having problems fitting into a pool, why not create a new location pool and put them
-- there?"). They carry the scenario groups the tagging found no existing place for.
--
-- content_kind: 'place' (every card until now) or 'scenarios'. When a nightly's place roll lands on a scenarios card,
-- a face-swap cast dream draws one of the card's tagged scenarios; any other dream re-rolls to a real place
-- (nightly-dreams). A scenarios card has no spots and never gets an essence card.
--
-- Cards, their tile (mig 592) and the scenario groups tagged to them (proposed_location, from the offline tagging):
--   just for fun          Just for Fun        just_for_fun + carnival_fun + around_town, plus EVERY goofy row
--   sports arenas         Sports & Adventure  sports_arenas
--   adventure sports      Sports & Adventure  adventure_sports
--   stage and spotlight   Stage & Spotlight   stage_spotlight
--   winter wonderland     Nature & Wild       winter_wonderland
--   regency england       Through Time        regency_era
--   1940s noir            Through Time        noir_1940s
--   retro decades         Through Time        retro_decades
--   gardens and romance   Jet Set             gardens_romance
-- Cards in existing tiles use that tile's picker_category; cards in new tiles get new ones no released app lists.
-- All start admin_only (visible to admins only in the picker). Re-runnable.

ALTER TABLE public.location_cards
  ADD COLUMN IF NOT EXISTS content_kind text NOT NULL DEFAULT 'place';
ALTER TABLE public.location_cards DROP CONSTRAINT IF EXISTS location_cards_content_kind_check;
ALTER TABLE public.location_cards
  ADD CONSTRAINT location_cards_content_kind_check CHECK (content_kind IN ('place', 'scenarios'));

INSERT INTO public.location_cards (name, display_name, picker_category, picker_tile, picker_sort_order, content_kind, admin_only) VALUES
  ('just for fun',        'Just for Fun',        'just_for_fun',     'just_for_fun',    10, 'scenarios', true),
  ('sports arenas',       'Sports & Arenas',     'sports_adventure', 'sports_arenas',   10, 'scenarios', true),
  ('adventure sports',    'Adventure Sports',    'sports_adventure', 'sports_arenas',   20, 'scenarios', true),
  ('stage and spotlight', 'Stage & Spotlight',   'stage_spotlight',  'stage_spotlight', 10, 'scenarios', true),
  ('winter wonderland',   'Winter Wonderland',   'epic_nature',      'nature',          99, 'scenarios', true),
  ('regency england',     'Regency England',     'through_time',     'through_time',    99, 'scenarios', true),
  ('1940s noir',          '1940s Noir',          'through_time',     'through_time',    99, 'scenarios', true),
  ('retro decades',       'Retro Decades',       'through_time',     'through_time',    99, 'scenarios', true),
  ('gardens and romance', 'Gardens & Romance',   'high_life',        'high_life',       99, 'scenarios', true)
ON CONFLICT (name) DO NOTHING;

-- Tag the scenario rows to their card (append; idempotent). Holiday rows are never touched.
DO $$
DECLARE
  m record;
  t text;
BEGIN
  FOR m IN SELECT * FROM (VALUES
      ('just for fun',        ARRAY['just_for_fun', 'carnival_fun', 'around_town']),
      ('sports arenas',       ARRAY['sports_arenas']),
      ('adventure sports',    ARRAY['adventure_sports']),
      ('stage and spotlight', ARRAY['stage_spotlight']),
      ('winter wonderland',   ARRAY['winter_wonderland']),
      ('regency england',     ARRAY['regency_era']),
      ('1940s noir',          ARRAY['noir_1940s']),
      ('retro decades',       ARRAY['retro_decades']),
      ('gardens and romance', ARRAY['gardens_romance'])
    ) AS v(card, groups)
  LOOP
    FOREACH t IN ARRAY ARRAY['dual_scenarios', 'single_scenarios'] LOOP
      EXECUTE format(
        'UPDATE public.%I SET location_keys = array_append(coalesce(location_keys, ''{}''), %L)
           WHERE pool <> ''holiday'' AND proposed_location = ANY(%L::text[])
             AND NOT (%L = ANY(coalesce(location_keys, ''{}'')))',
        t, m.card, m.groups, m.card);
    END LOOP;
  END LOOP;
  -- Every goofy row belongs to Just for Fun (goofy is a tone, not a place); its place tags stay too.
  FOREACH t IN ARRAY ARRAY['dual_scenarios', 'single_scenarios'] LOOP
    EXECUTE format(
      'UPDATE public.%I SET location_keys = array_append(coalesce(location_keys, ''{}''), ''just for fun'')
         WHERE pool = ''goofy'' AND NOT (''just for fun'' = ANY(coalesce(location_keys, ''{}'')))',
      t);
  END LOOP;
END $$;
