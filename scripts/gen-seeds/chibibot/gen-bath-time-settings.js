#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/bath_time_settings.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (n) => `You are writing ${n} BATH-TIME SETTING descriptions for ChibiBot — the WILD, SPECTACULAR, FUN destinations where adorable tiny creatures take their baths. The SETTING is the bath vessel + its location, and we want EPIC PICTURE-BOOK VARIETY — every entry feels like a frame from a different page of a "tiny creatures' bathtime around the world" travel book. We want viewers going "wait, WHERE is this bath?!" not "another cute clawfoot tub."

Each entry: 15-30 words. ONE specific bath vessel + a SPECTACULAR or UNEXPECTED location. NO creatures (separate axis). NO time-of-day or weather (separate axes). NO activity verbs (separate axis). NO amenities/props beyond the vessel itself.

━━━ THE BAR: DESTINATION-SPA FANTASY, NOT GENERIC INTIMATE ━━━

Every setting should answer "WHERE is this?" with a specific, evocative, picture-able location. The vessel should fit the location naturally — a clawfoot tub on a cloud is funny; a hollow-coconut bath on a tropical beach is on-genre; a copper kettle bath in a steampunk airship gondola is unforgettable. AVOID generic "cozy bathroom with tile floor" — that's the boring case.

━━━ CATEGORY DISTRIBUTION (HEAVILY weighted toward WILD locations) ━━━

- 25% sky / cloud / aerial (clawfoot tub balanced on a fluffy cloud / bath inside a hot-air balloon basket / floating-island spring with waterfall pouring off the edge / observatory-dome rooftop bath under stars / treehouse-veranda tub overlooking endless forest canopy / mountain-peak hot spring above the clouds / sky-island plunge pool)
- 20% water-world / nautical / underwater (mermaid-grotto pool with bioluminescent coral / pirate-ship-deck wooden tub overlooking the high seas / submarine porthole bath / hollow-conch-shell bath on a tropical reef / lighthouse-top tub with crashing waves below / dock-end soaking barrel at sunset harbor / canal-boat tub gliding through Venice / hollow-iceberg pool in arctic waters)
- 15% magical / fantasy realm (crystal-cave hot spring with glowing geodes / fairy-ring spring in a glowing forest / hollow-volcano warm pool with lava-glow / dragon's-cave underground bath with treasure piles / moonstone basin in a wizard's tower / cloud-island plunge pool with pegasus parking)
- 10% biome-extreme (volcanic hot-spring on a black-sand beach / arctic ice-cave plunge pool / desert oasis sunken stone tub / jungle-canopy hollow-log bath with vines / glacier-ridge bath cut from ice / canyon-rim natural rock pool with view)
- 10% transportation / steampunk / unusual vessel (steampunk airship-gondola copper kettle / vintage-train-car claw-foot tub rolling through alps / hot-air-balloon-basket bath / submarine porthole / spaceship cockpit bath with stars outside / treasure-chest bathtub / submarine bridge / dirigible observation deck)
- 10% repurposed-tiny-object (giant teacup floating in a koi pond / acorn-cap on a moss carpet / leaf-cup at the edge of a forest stream / hollow walnut on a windowsill / soup-ladle bath / inverted top-hat bath / oversized seashell at the tideline)
- 5% architectural-unusual (Japanese onsen with maple leaves falling / Turkish-bath marble chamber / Roman-villa atrium pool / ice-hotel suite plunge / Moroccan-courtyard fountain bath / Greek-temple ruin spring)
- 5% domestic-classic-bathroom (ONLY 5% — most bathrooms are boring; reserve for ones that have a unique architectural detail like a stained-glass window / sunken Roman tub / glass-floor mountain cabin overlooking a valley)

━━━ WHAT MAKES AN ENTRY 10/10 ━━━

- Concrete vessel anchored to a SPECIFIC place (not just "outdoor bath" — "wooden barrel on the prow of a pirate ship overlooking the Caribbean horizon")
- Material truth: brass, copper, marble, ice, hollowed wood, sea-shell, crystal, bronze, polished stone, terracotta
- Scale anchor: what's around it that proves the scale of the location (cloud puffs around / dolphins jumping below / waterfall plunging beside / volcano steaming nearby / aurora overhead)
- Picture-able in one mental image: if you can't imagine the still frame, the entry is too vague

━━━ DEDUP DIMENSIONS ━━━

Dedup by: location-type + vessel-type + signature scale detail. "tub on a cloud" and "clawfoot bath floating on a cumulus puff" are duplicates. "tub on a cloud" and "tub on a pirate ship deck" are distinct.

━━━ HARD BANS ━━━

- NO creatures or characters (separate axis)
- NO bath activities (separate axis — no "soaking" / "splashing" / "rinsing")
- NO time-of-day language (separate axis — no "morning" / "sunset" / "moonlit night")
- NO weather language (separate axis — no "raining" / "snowing")
- NO amenity props beyond the vessel itself (no "rubber duck floats nearby" / "candles burning" — those are amenity axis)
- NO dark / spooky / scary undertones (no "haunted" / "abandoned" / "decrepit")
- NO modern appliances (no "jacuzzi with jets" / "shower stall with glass")
- NO generic cozy interior unless there's a unique architectural twist (stained glass / glass floor / sunken tub / etc.)

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
