-- 652_wild_west_rules_period: two Wild West render rules carried modern items into renders on cards held to the
-- 1860s-1890s frontier (Kevin: "old frontier west, no modern settings ... Tombstone ... Red Dead Redemption era";
-- NIGHTLY_POOL_CLEANUP_PLAN.md open item 2). SUBJECT_RULE goes into every render brief, so the era has to live here
-- too, not only in the spots (mig 635).
--   Cattle Ranch: "squeeze chutes, round pens, corrugated tin barns, caliche roads" (a modern Texas ranch) ->
--     pole corrals, branding pens, log barns, chuckwagons, wagon-rutted trails; the 1880s open range.
--   Monument Valley: "Monument Valley Navajo Tribal Park" (a modern park label) -> the valley itself.
-- Re-runnable.

UPDATE public.location_cards
SET biome_config = jsonb_set(biome_config, '{SUBJECT_RULE}', to_jsonb(
  'Unmistakably recognizable 1880s OPEN-RANGE CATTLE RANCH landscape — Texas, Oklahoma, or Great Plains geographic DNA. Iconic frontier ranch features (wooden windmills, stock tanks, cedar-post fence lines, pole corrals and branding pens, log barns and bunkhouses, chuckwagons, wagon-rutted trails, limestone ridges) rendered MASSIVE and dominant — these structures and the enormous sky above them own the frame. Pure working-ranch geography and atmosphere of the open range — timber, dust, rawhide and iron, never a modern trace.'::text))
WHERE name = 'cattle ranch';

UPDATE public.location_cards
SET biome_config = jsonb_set(biome_config, '{SUBJECT_RULE}', to_jsonb(
  'Unmistakably recognizable Monument Valley geology rendered MASSIVE and DOMINANT — the West Mitten, East Mitten, Merrick Butte, the Three Sisters, Elephant Butte, or Spearhead Mesa filling the frame as monumental iron-red sandstone towers rising from a flat desert floor. The formations are the uncontested hero: 400-to-1000-foot vertical sandstone columns, caprock-topped, fluted by erosion, surrounded by open red-sand valley. Pure Colorado Plateau geology in the untouched frontier West, never a modern trace.'::text))
WHERE name = 'monument valley trail';
