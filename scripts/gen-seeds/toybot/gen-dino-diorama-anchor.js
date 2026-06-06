#!/usr/bin/env node
/**
 * DINO_DIORAMA_ANCHOR — the ONE monumental clay hero element that
 * dominates the background of a prehistoric toy-dinosaur diorama.
 * Volcano / mesa / glacier / crystal-spire / meteor / tar-pit /
 * geyser scale: so big the toy dinos clustered at its base read tiny.
 * Visible sculpted-clay material is non-negotiable.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/dino_diorama_anchor.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} MONUMENTAL CLAY ANCHOR entries for ToyBot dino-diorama — ONE impossibly-big handmade-clay hero landform that dominates the background of a toy-dinosaur prehistoric diorama. Toy dinos at its base read as tiny specks. Each entry is one sentence, 30-50 words, present-tense.

━━━ THE BAR ━━━
Every entry names ONE specific monumental clay landform, gives its color/material/clay-texture, and reads as the unmistakable HERO BACKDROP — so massive the surrounding toy dinos look like ants. The CLAY-MATERIAL fact must be inside the sentence ("clay", "sculpted clay", "handmade clay", "thumbprinted clay", "matte clay", "glossy clay water"). Visible scale is non-negotiable — describe how tiny the dinos look against it.

━━━ VARIETY MANDATE (distribute across these monumental categories) ━━━
- ~5 VOLCANIC (active eruption / smoking cone / lava-fall / ash plume / smoldering caldera / cinder cone)
- ~3 MESA / PLATEAU (banded sandstone mesa / sky-island plateau / table mountain / butte / hoodoo cluster)
- ~3 WATERFALL / CASCADE (sheer cataract / multi-tier falls / wide curtain / thundering plunge / ice-fed cascade)
- ~3 GLACIER / ICE (calving glacier wall / ice cliff / frozen waterfall / hanging ice-shelf / blue-crevasse face)
- ~2 CRYSTAL / GEODE (crystal spire field / glowing geode wall / amethyst column cluster / quartz forest)
- ~2 METEOR / IMPACT (meteor mid-fall / smoking crater / fresh impact basin / streaking fireball)
- ~2 TAR PIT / WATER FEATURE (vast tar lake / inland sea / mirror lake / fossil-strewn sinkhole)
- ~1 GEYSER / STEAM (towering geyser column / steaming hot-spring pool / fumarole field)
- ~2 ROCK SPIRE / TOWER (vertical sandstone needle / colossal stone arch / natural rock-bridge / monolithic tower)
- ~1 SKELETON / FOSSIL (massive sculpted-clay skeletal arch / colossal bone ribcage cathedral / fossil cliff face)
- ~1 ASTEROID / SKY-PHENOMENA (giant moon / second moon / shooting-star streak / aurora-curtain over horizon)
- ~1 FORESTED MEGA-TREE (colossal redwood-style clay tree / lone giant kapok / ancestral world-tree)

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"A colossal clay waterfall thunders down a sheer ochre cliff-face, white frothy clay spray billowing into a churning gorge below — so enormous the toy dinos clustered at its base look like specks."
"A sky-high clay mesa dominates the entire backdrop, its flat-topped silhouette banded in rust, ochre, and cream clay strata, sheer vertical walls dropping hundreds of scale-feet to dusty canyon floor."
"A vast tar-pit lake of black glossy clay stretches across the background, a half-submerged colossal clay skeleton rising from its centre, ribs and skull breaking the surface like a drowning giant."
"A monstrous clay meteor streaks down from the upper frame, trailing a thick spiralling clay smoke plume, its glowing orange clay nose aimed at a fresh smouldering crater already punched into the ground."

━━━ BANS ━━━
- NO modern objects (cars, buildings, signs).
- NO real photoreal landforms — every entry is HANDMADE SCULPTED CLAY, name the clay.
- NO dinosaurs in this axis — the dinosaurs come from a separate pool. This axis is the LANDFORM only.
- NO multiple landforms in one entry — ONE monumental anchor each.
- NO vague "huge mountain" — name the SPECIFIC clay landform with color + texture detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
