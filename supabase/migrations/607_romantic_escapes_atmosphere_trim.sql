-- 607: trim the bleak atmosphere out of the three Romantic Escapes places (mig 605). Kevin 2026-09-30: "very pretty,
-- lots of lush details, romantic, classy", and "cute" meaning lighter, fun, romantic SETTINGS (the wardrobe stays
-- daring, untouched). gen-location-biome.js wrote good, specific configs, but a few entries fight that brief: midnight
-- and 2am skies, bleaching noon, cold snaps and gales, grey drizzle, harvest stubble and bare October vines. Each
-- pattern must match exactly one entry; a second match aborts the migration. Order within each list is kept.

DO $$
DECLARE
  r record;
  n int;
BEGIN
  FOR r IN SELECT * FROM (VALUES
      ('cherry blossoms', 'TIME',      'Hirosaki Castle moat midnight%'),
      ('cherry blossoms', 'WEATHER',   'hanafubuki gale%'),
      ('cherry blossoms', 'WEATHER',   'spring cold snap%'),
      ('lavender fields', 'TIME',      'Valensole pre-dawn%'),
      ('lavender fields', 'TIME',      'Provençal noon%'),
      ('lavender fields', 'WEATHER',   'Mistral wind raking%'),
      ('lavender fields', 'WEATHER',   'English grey drizzle%'),
      ('lavender fields', 'WEATHER',   'Late-season morning frost%'),
      ('lavender fields', 'PHENOMENA', 'Post-harvest geometry%'),
      ('tuscan villa',    'TIME',      'Chianti midday%'),
      ('tuscan villa',    'TIME',      'Tuscan full-dark%'),
      ('tuscan villa',    'WEATHER',   'Tramontane wind day%'),
      ('tuscan villa',    'WEATHER',   'August heat shimmer%'),
      ('tuscan villa',    'WEATHER',   'Soft overcast after autumn harvest%'),
      ('tuscan villa',    'PHENOMENA', 'Heat lightning over the Apennines%'),
      ('tuscan villa',    'PHENOMENA', 'Starfield over isolated podere%'),
      ('tuscan villa',    'PHENOMENA', 'Morning mist threading the vine rows%'),
      ('tuscan villa',    'PHENOMENA', 'Alpenglow on Apennine snowcaps%')
    ) AS v(card, axis, pat)
  LOOP
    SELECT count(*) INTO n
    FROM public.location_cards c, jsonb_array_elements_text(c.biome_config -> r.axis) e
    WHERE c.name = r.card AND e ILIKE r.pat;
    IF n > 1 THEN
      RAISE EXCEPTION '607: % / % / % matched % entries', r.card, r.axis, r.pat, n;
    ELSIF n = 0 THEN
      RAISE NOTICE '607: % / % / % already gone', r.card, r.axis, r.pat;
      CONTINUE;
    END IF;
    UPDATE public.location_cards c
    SET biome_config = jsonb_set(c.biome_config, ARRAY[r.axis], (
      SELECT coalesce(jsonb_agg(e ORDER BY i), '[]'::jsonb)
      FROM jsonb_array_elements(c.biome_config -> r.axis) WITH ORDINALITY AS t(e, i)
      WHERE NOT ((e #>> '{}') ILIKE r.pat)))
    WHERE c.name = r.card;
  END LOOP;
END $$;
