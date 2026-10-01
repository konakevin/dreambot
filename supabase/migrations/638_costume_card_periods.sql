-- 638: the era each historical costume card dresses in (Kevin 2026-09-30: fix the anachronisms, "fix 1 and 2").
-- biome_config.period feeds PERIOD DRESS (_shared/characterSlotPrompt.ts): on the costume path every wardrobe line ends
-- with ", authentic <period> dress" and the brief keeps every garment and prop in "the <period> era". Positive by
-- design: Flux put a wristwatch on a saloon cowboy whose prompt never named one, and a "no wristwatch" line would leak
-- the watch in. Timeless gothic cards and modern / future genre cards (spy lair, starship) carry no period.
-- Rollback: remove the period key. Re-runnable.

UPDATE public.location_cards AS c
SET biome_config = jsonb_set(c.biome_config, '{period}', to_jsonb(v.period), true)
FROM (VALUES
  ('frontier town', '1880s American frontier'),
  ('railroad town', '1880s American frontier'),
  ('outlaw hideout', '1880s American frontier'),
  ('gold rush camp', '1850s California gold rush'),
  ('desert canyon standoff', '1880s American frontier'),
  ('monument valley trail', '1880s American frontier'),
  ('cattle ranch', '1880s American frontier'),
  ('saloon', '1880s American frontier'),
  ('ghost town', '1880s American frontier'),
  ('gladiator arena', 'ancient Roman'),
  ('ancient rome', 'ancient Roman'),
  ('ancient greece', 'ancient Greek'),
  ('viking longhouse', 'Viking Age'),
  ('medieval village', 'medieval'),
  ('renaissance venice', 'Renaissance Venetian'),
  ('victorian london', 'Victorian'),
  ('haunted mansion', 'Victorian gothic'),
  ('vampire castle', 'nineteenth-century gothic'),
  ('pirate cove', 'eighteenth-century pirate'),
  ('1920s speakeasy', '1920s'),
  ('1950s americana', '1950s'),
  ('prehistoric', 'prehistoric')
) AS v(name, period)
WHERE c.name = v.name AND (c.biome_config ->> 'costume')::boolean IS TRUE;

SELECT count(*) AS cards_with_period FROM public.location_cards WHERE biome_config ? 'period';
