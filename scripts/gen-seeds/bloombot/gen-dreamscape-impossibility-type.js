#!/usr/bin/env node
/**
 * BLOOMBOT_DREAMSCAPE_IMPOSSIBILITY_TYPE — the central surreal impossibility
 * defining a dreamscape. Inverted cloud meadow, ascending bloom-river,
 * Penrose stairs, bell-jar containing a meadow, mirror-lake winter
 * inversion, shadow-species divergence, recursive-container peony,
 * floating bloom-constellation.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_dreamscape_impossibility_type.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} IMPOSSIBILITY TYPE entries for BloomBot's dreamscape path — the central surreal rule-break that DEFINES a dreamscape. Each entry is one descriptive line, 40-65 words, starting with a CAPS NAME, em-dash, then body describing what is impossible + how it is rendered + how blooms are involved.

━━━ THE BAR ━━━
Every entry names a SPECIFIC surreal impossibility — geometric, physical, scale, recursive, temporal, mirror-inversion, gravity-reversal, container-paradox, scale-inversion, etc. Think René Magritte / Salvador Dali / Penrose / Escher / Roger Dean — physics broken cleanly and painterly. Blooms / petals / wildflowers play a central role in HOW the impossibility renders (inverted cloud-meadow, ascending bloom-river, bloom-meadow inside a bell-jar). Cinematic, never glitchy.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"INVERTED CLOUD MEADOW — a dense stratum of cumulus cloud viewed from below, its underside colonized by wild-growing dog-roses and oxeye daisies, roots threading upward into cloud-soil, petals hanging downward"
"ASCENDING BLOOM RIVER — a narrow chalk-bedded river bends upward at a sharp geometric crease in the landscape and flows vertically into open sky, water remaining coherent and glassy as it rises"
"BELL-JAR CONTAINING INFINITE MEADOW — a waist-high glass bell-jar sits on bare stone floor, and inside its sealed interior a full-scale wildflower meadow stretches to a distant treeline with its own horizon"
"PENROSE BLOOM-STAIRCASE — a Penrose impossible staircase constructed from mossy stone steps, each tread blanketed in densely packed sweet williams and wallflowers, the structure ascending and simultaneously descending"
"SHADOW SPECIES DIVERGENCE — a bed of common sunflowers in direct overhead noon light casts shadows that are not their own shapes, each shadow forming the precise silhouette of a different species"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~3 GRAVITY-INVERSION (upside-down meadow, ascending river, hanging-roots ceiling-garden, gravity-reversed pond)
- ~3 GEOMETRY-IMPOSSIBILITY (Penrose stairs, Escher hallway, Möbius bloom-strip, impossible cube of wildflower)
- ~3 CONTAINER-PARADOX (bell-jar full meadow, snow-globe with seasons, locket holding a forest, doorway opening to a smaller world inside a smaller world)
- ~3 SCALE-INVERSION (giant peony backdrop, single bloom larger than a cottage, blade of grass towering over figures, microcosm-as-macrocosm)
- ~3 MIRROR / REFLECTION-LIE (lake reflecting different season, mirror showing different scene, puddle holding the night sky at noon)
- ~3 RECURSIVE / FRACTAL (recursive peony containing meadow containing peony, fractal hedge-row spiral, infinite-petal nested bloom)
- ~3 SHADOW / SILHOUETTE-LIE (shadow-species divergence, shadows that walk, shadow-petals falling from solid blooms)
- ~3 GRAVITY-NEUTRAL FLOAT (floating bloom-constellation, drifting suspended petals, levitating stone islands with meadows)
- ~3 TIME-CONTRADICTION (one bloom cycling birth-to-decay simultaneously, all seasons overlapping in one frame, ancient + new growth on same stem)
- ~3 WATER-IMPOSSIBILITY (suspended water-column with blooms inside, river flowing through air, vertical pond holding fish)
- ~3 ARCHITECTURE-ORGANIC (cottage made of woven flower-vines, doorway carved from one bloom, stone wall growing blooms outward into 3D mass)
- ~3 SKY / TERRAIN SWAP (ground that reads as sky, sky as ploughed soil, cloud-floor + grass-ceiling)
- ~3 IMPOSSIBLE OBJECT (door standing alone in meadow, frame containing real meadow, painted picture leaking flowers out)
- ~3 BIOLOGY-IMPOSSIBLE (humanoid bloom-figure, flower-faced creatures, bloom-eyed forest with awareness, hands sprouting petals)

━━━ BANS ━━━
- NO sci-fi / neon / hologram register.
- NO sloppy glitch / corrupted-data look — every impossibility must be GEOMETRICALLY CLEAN and PAINTERLY.
- NO bare "magical" or "dreamlike" — name the SPECIFIC rule that is broken.
- NO photographer-name drops.
- NO repeating the same impossibility category in subsequent entries.

━━━ FORMAT ━━━
Each entry: 40-65 words. Format: "NAME CAPS — body text naming the specific impossibility + how it renders cleanly + how blooms are central to the rule-break".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
