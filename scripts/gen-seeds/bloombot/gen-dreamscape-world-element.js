#!/usr/bin/env node
/**
 * BLOOMBOT_DREAMSCAPE_WORLD_ELEMENT — clean isolated foundational
 * elements that populate a surreal dreamscape. Single granite cliff,
 * still alpine lake, freestanding stone doorway, single cumulus, ornate
 * picture frame, empty stone corridor, meadow fragment, perfect stone
 * cube. Magritte/De Chirico register: simple isolated objects.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_dreamscape_world_element.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} WORLD ELEMENT entries for BloomBot's dreamscape path — clean isolated FOUNDATIONAL elements that populate a surreal Magritte / De Chirico / Roger Dean dreamscape. Each entry is one descriptive line, 25-40 words, starting with a CAPS NAME, em-dash, then body describing the element in isolation, its material, its surface quality, its visual mass.

━━━ THE BAR ━━━
Every entry names ONE element placed in isolation against an open void: a single object / landform / architectural fragment / interior detail / sky element. Reads as Magritte's pieces — a doorway alone, a single cumulus, a perfect cube, a stone corridor, a picture frame floating. Painterly, precise, surface-detailed.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"GRANITE CLIFF FACE — a vertical slab of raw granite cliff rising from the foreground, surface mapped with precise crack-lines, lichen colonies, and water-stain channels, isolated against open sky"
"STILL ALPINE LAKE — a perfectly motionless high-altitude lake at midground, water surface dark glass-smooth, shoreline of fractured shale clearly defined, every pebble beneath the surface visible"
"FREESTANDING STONE DOORWAY — a single weathered limestone doorway-frame standing alone in open space, no walls attached, surface eroded with centuries of rain-pitting and iron-oxide staining"
"SINGLE CUMULUS CLOUD — one precisely rendered cumulus cloud mass in an otherwise empty blue sky, every shadow-shelf and silver-lit upper surface crisp, base flat and shadow-dark"
"ORNATE PICTURE FRAME — a single gilded baroque picture-frame hovering at eye level, gold-leaf surface chipped to reveal red bole beneath, no canvas inside, shadow cast behind"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~3 SINGLE LANDFORM (granite cliff, basalt column, sandstone arch, chalk hill, fractured cliff, single peak silhouette)
- ~3 SINGLE WATER (still alpine lake, mirror tarn, single waterfall ribbon, vertical river, isolated pool)
- ~3 STONE-ARCHITECTURE FRAGMENT (stone doorway, lone column, ruined arch, single carved keystone, isolated lintel, free-standing wall)
- ~3 SINGLE CLOUD-FORM (single cumulus, single anvil thunderhead, single cirrus arc, single mammatus formation, single nacreous wisp)
- ~3 OBJECT-IN-AIR (picture frame, ornate mirror, hovering door, lantern in space, key suspended)
- ~3 ARCHITECTURE-INTERIOR FRAGMENT (empty stone corridor, single vaulted bay, isolated stair-flight, lone fireplace alcove, single colonnade)
- ~3 NATURE FRAGMENT (single tree, lone branch, single boulder, single fern frond, isolated tuft of grass)
- ~3 GEOMETRIC OBJECT (perfect stone cube, gleaming polished sphere, basalt pyramid, copper torus, hollow ring of marble)
- ~3 GROUND FRAGMENT (meadow patch, sand patch with one footprint, single cobblestone path-stretch, ploughed soil patch)
- ~3 SKY OBJECT (sun-disk alone, single moon-crescent, single star pricking through, single planet hung large)
- ~3 SINGLE BLOOM-CONTEXT (lone giant peony, isolated rose-mass, single dahlia head, single chrysanthemum sphere)
- ~3 INTERIOR-OBJECT ISOLATED (single armchair, lone writing desk, isolated empty bookshelf, single grandfather clock)
- ~3 OPENING-IN-FORM (oval window cut into stone, square aperture in wall, doorway in cliff, threshold in cloud)
- ~3 LIGHT-EMITTING ALONE (single lantern, lit candle on stone, glowing orb, brazier in void)

━━━ BANS ━━━
- NO crowds of objects — each entry names ONE isolated element + its surface detail.
- NO photographer-name drops.
- NO sci-fi / neon / hologram register.
- NO bare "lonely landscape" — name the SPECIFIC element + its material + one surface qualifier.
- NO action — the element is STATIC and isolated.

━━━ FORMAT ━━━
Each entry: 25-40 words. Format: "NAME CAPS — body text naming ONE specific isolated element + material + surface qualifier + its placement in the frame".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
