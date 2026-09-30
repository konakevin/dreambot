-- 617: remove generated atmosphere lines that contradict the new Dreamscapes worlds' own spots (mig 615), the same
-- review as mig 607. Celestial's bans forbade earthly flora, ordinary clouds and fog, and any sun, but its spots are
-- wisteria pergolas, lavender meadows, fog-softened hills and a twin-sun sunset; its "gravitational rain" is physics an
-- image model drops. Impossible Architecture's bans limited materials to stone and timber and colours to white, amber
-- and gold, but its spots are glass bridges, brass stairs, rose quartz and turquoise porcelain; its "rain indoors,
-- cloudless outside" weather contradicts itself. Overgrown Wonders is consistent and untouched. Each pattern must
-- match exactly one entry. Re-runnable.

DO $$
DECLARE
  r record;
  n int;
BEGIN
  FOR r IN SELECT * FROM (VALUES
      ('celestial realm',         'BANS',    'NO generic blue sky%'),
      ('celestial realm',         'BANS',    'NO terrestrial weather%'),
      ('celestial realm',         'BANS',    'NO earthly flora%'),
      ('celestial realm',         'WEATHER', 'Gravitational rain%'),
      ('impossible architecture', 'BANS',    'NO MODERN MATERIALS%'),
      ('impossible architecture', 'BANS',    'NO ARTIFICIAL COLOR GRADING%'),
      ('impossible architecture', 'WEATHER', 'Impossible interior-exterior weather%')
    ) AS v(card, axis, pat)
  LOOP
    SELECT count(*) INTO n
    FROM public.location_cards c, jsonb_array_elements_text(c.biome_config -> r.axis) e
    WHERE c.name = r.card AND e ILIKE r.pat;
    IF n > 1 THEN
      RAISE EXCEPTION '617: % / % / % matched % entries', r.card, r.axis, r.pat, n;
    ELSIF n = 0 THEN
      RAISE NOTICE '617: % / % / % already gone', r.card, r.axis, r.pat;
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
