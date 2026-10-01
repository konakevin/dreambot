-- 632: concepts for the five cards whose spot pools drifted off-theme (Kevin 2026-09-30: "i'd like to get those
-- patched back up and in condition where they produce on brand, kick ass renders for nightly dreams").
--
-- Root cause: all five had EMPTY sub_regions and must_include. Those lists are the authoring hints that keep the spot
-- generators (and the pool cleanup's on-card check) inside a card's concept (LOCATION_SEED_PLAYBOOK.md, "Anatomy").
-- With nothing but a name, the generators wandered: Vineyard Estate filled with Martha's Vineyard beaches, Railroad
-- Town with Utah mountains, Vampire Castle with Romanian peaks, Gladiator Arena with general Rome, Space Station with
-- named planets from other franchises (NIGHTLY_POOL_CLEANUP_PLAN.md, drift report). Data only: no edge function reads
-- these columns. Re-runnable.

UPDATE public.location_cards SET
  sub_regions = ARRAY[
    'Transcontinental line (Promontory Summit and the Golden Spike, Corinne, Ogden Union Station)',
    'Colorado narrow gauge (Durango and Silverton, Georgetown Loop, Cumbres and Toltec at Chama)',
    'Nevada and California (Virginia and Truckee at Virginia City, Carson City, Truckee, Jamestown roundhouse)',
    'Plains railheads (Dodge City, Abilene, Cheyenne depot)',
    'Railroad works anywhere in the Old West (depots, water towers, roundhouses, trestles, snow sheds)'
  ]::text[],
  must_include = ARRAY[
    'steam locomotives at depots and water towers',
    'timber trestles and tunnels over canyons and gorges',
    'main streets of false-front saloons and hotels beside the tracks',
    'roundhouses, turntables, freight yards and cattle pens',
    'a frontier boomtown in the 1860s-1890s, never a modern town or bare scenery'
  ]::text[]
WHERE name = 'railroad town';

UPDATE public.location_cards SET
  sub_regions = ARRAY[
    'Napa and Sonoma',
    'Bordeaux (Medoc, Saint-Emilion, Pauillac chateaux)',
    'Burgundy and Champagne (Cote d''Or, Clos de Vougeot, Epernay, Reims)',
    'Iberia (Douro Valley quintas, Rioja, Ribera del Duero)',
    'Germany and Austria (Mosel, Rheingau, Wachau)',
    'New World (Stellenbosch and Franschhoek, Mendoza, Barossa, Marlborough)'
  ]::text[],
  must_include = ARRAY[
    'vine rows sweeping toward the estate house',
    'chateau, quinta and estate facades with cypress or plane-tree drives',
    'barrel cellars, tasting rooms and long tables among the vines',
    'terraced river-valley vineyards',
    'a working wine estate, never a beach town or a seaside island'
  ]::text[]
WHERE name = 'vineyard estate';

UPDATE public.location_cards SET
  sub_regions = ARRAY[
    'Transylvania (Bran Castle, Corvin Castle, Poenari, Rasnov citadel, Sighisoara)',
    'Central Europe (Orava Castle, Cachtice, Houska, Kokorin, Burg Eltz, Hohenzollern)',
    'Britain and Ireland (Whitby Abbey, Slains Castle, Leap Castle)',
    'Invented gothic castles (crag-top keeps, cliffside fortresses, castle crypts and chapels)'
  ]::text[],
  must_include = ARRAY[
    'castle exteriors on crags above misty forest',
    'great halls, grand staircases, libraries and candlelit galleries',
    'crypts, chapels, catacombs and bell towers',
    'gates, drawbridges, courtyards and battlement walks',
    'the castle itself in every spot, never bare mountains or open countryside'
  ]::text[]
WHERE name = 'vampire castle';

UPDATE public.location_cards SET
  sub_regions = ARRAY[
    'The Colosseum (arena floor, hypogeum, gates, cavea, Ludus Magnus)',
    'Italy (Verona Arena, Pompeii, Capua, Pozzuoli, Lucca''s amphitheatre square)',
    'France and Iberia (Arles, Nimes, Tarragona, Merida, Italica)',
    'North Africa and the Balkans (El Djem, Leptis Magna, Pula)'
  ]::text[],
  must_include = ARRAY[
    'elliptical arena floors of sand within tiered stone seating',
    'hypogeum corridors, cells and lift shafts beneath the arena',
    'gladiator gates, entry tunnels and vaulted passages',
    'gladiator training grounds and barracks',
    'an arena or its working parts in every spot, never a general city sight'
  ]::text[]
WHERE name = 'gladiator arena';

UPDATE public.location_cards SET
  sub_regions = ARRAY[
    'Orbital ring habitats and spin-gravity wheels',
    'Docking bays, hangars and airlocks',
    'Command decks, observation lounges and cupolas',
    'Hydroponic gardens, atriums and crew quarters',
    'Deep-space research outposts and stations above alien worlds'
  ]::text[],
  must_include = ARRAY[
    'windows onto planets, rings, moons and nebulae',
    'curved corridors and modular interiors',
    'solar arrays, docking spines and exterior trusses',
    'an original station of this world, never a named planet or place from a film or game'
  ]::text[]
WHERE name = 'space station';
