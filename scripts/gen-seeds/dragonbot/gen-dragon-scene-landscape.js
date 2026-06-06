#!/usr/bin/env node
/**
 * DRAGON_SCENE_LANDSCAPE — Epic fantasy biome / stage pool.
 *
 * The JAW-DROPPING fantasy stage the dragon inhabits. Pure landscape —
 * no dragon, no action, no character. The dragon comes from
 * DRAGON_SCENE_DRAGON, action from DRAGON_SCENE_ACTION.
 *
 * Format mirrors existing 30 entries:
 *   "<LANDSCAPE TITLE CAPS> — <body of biome detail with scale-prover phrases>."
 *
 * Frazetta / Brom / Vallejo / Hildebrandt / Whelan painted-cover register.
 * LOTR / GoT / Elden Ring / Skyrim / WoW / D&D visual lineage.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/dragon_scene_landscape.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} EPIC FANTASY LANDSCAPE descriptions for DragonBot's dragon-scene path — the JAW-DROPPING stage the dragon inhabits, painted-fantasy-novel-cover style. Frazetta / Brom / Vallejo / Hildebrandt / Whelan / Justin Sweet register. LOTR / GoT / Elden Ring / Skyrim / WoW / D&D visual lineage.

Each entry: 15-30 words. Format EXACTLY: \`<LANDSCAPE TITLE CAPS> — <body of biome detail with at least one explicit scale-prover (numeric height / kilometer / column-diameter / etc.)>.\`

━━━ THE FRAME — LANDSCAPE ONLY ━━━

Each entry describes ONLY the stage — geology, architecture, vegetation, atmosphere. NEVER the dragon (no "dragon-perch", "dragon-lair", "dragon-nest" — those are setting cliches that pre-place the dragon and constrain composition). NEVER a character. NEVER an action.

The dragon will be placed in this landscape at render-time — the landscape must be DRAMATIC ENOUGH ALONE to be a poster, so when the dragon is added, the result is breathtaking.

━━━ VARIETY MANDATE — distribute across these 10 biome clusters (~20 per cluster) ━━━

1. VOLCANIC / MOLTEN (caldera, magma-lake, obsidian-spire forest, lava-flow plain, sulfur-vent canyon)
2. GLACIAL / FROZEN (ice-cathedral canyon, frozen waterfall colonnade, glacier-tongue plateau, frost-mountain ridge, arctic basalt steppe)
3. FORESTED PRIMEVAL (titan-redwood canopy, mist-shrouded fjord forest, twisted-bough wych-elm grove, bioluminescent fungal-tree understory)
4. DESERT / DRYLAND (wind-carved mesa necropolis, hoodoo-pillar canyon, sand-buried ziggurat plain, badlands of cracked salt-flat)
5. COASTAL / OCEANIC (storm-battered basalt cliff, sea-stack archipelago, tidal-cave coastline, kraken-bone shore, sunken-city tidal flat)
6. ALPINE / MOUNTAIN (cloud-piercing granite spires, fortress-peak ridgeline, hanging-valley pass, snow-saddle between giants)
7. RUIN / RECLAIMED ARCHITECTURE (cyclopean stone city overgrown, fallen titan-statue plain, broken-arch ruin field, ziggurat sunken in jungle)
8. SUBTERRANEAN / CAVERN (crystal-geode cavern, bioluminescent fungal cathedral, lava-tube atrium, underground river-temple)
9. STORM / AERIAL (thunderhead canyon-of-air, lightning-marked plateau, mist-veiled mountain valley, sky-island archipelago)
10. ARCANE / WORLD-MAGIC (rune-carved megalith ring, ley-line confluence valley, world-tree root-cavern, frozen battlefield where old magic still arcs)

━━━ SCALE-PROVERS ARE MANDATORY ━━━

Every entry MUST include at least ONE explicit scale-prover that makes the viewer feel small:
- numeric heights/depths ("5000 meters", "800-meter cliffs", "thousand-meter ice walls", "300 meters overhead")
- comparative scale ("trees with 50-meter trunk diameters", "buildings sized for 20-meter inhabitants", "spires kilometer-tall")
- relative reference ("only highest kilometer above cloud-sea", "buttresses sized like cathedral organ pipes")

━━━ THE LANGUAGE PATTERN — mirror these existing entries' register ━━━

GOOD examples already in the pool (vary strongly):
  • "VOLCANIC CALDERA THRONE — jagged obsidian spires rising from molten lake, dragon-perch carved into highest peak."
  • "GLACIAL CATHEDRAL CANYON — thousand-meter ice cliffs carved by eons into buttressed walls, frozen waterfall columns like organ pipes."
  • "PRIMEVAL FOREST OF TITAN TREES — redwood-scale trees with 50-meter trunk diameters, canopy 300 meters overhead blocking sky."
  • "BIOLUMINESCENT FUNGAL CATHEDRAL — underground cavern forest of 100-meter mushroom trees, glowing blue-green."

Note: existing entries occasionally use "dragon-perch", "dragon-tomb", "dragon-nest", "dragon-lair" — DO NOT replicate that pattern in new entries. Modern dedup guidance: landscape stays dragon-free; composition slots dragon in at render time.

━━━ BANS ━━━

- NO dragons in the landscape entry (no "dragon-perch", "dragon-nest", "dragon-lair", "dragon-tomb", "dragon-roost")
- NO characters / armies / villages mid-action (villages can exist as scale-prover ruins, but not "burning village" — that's drama)
- NO named IPs (no Mordor, no Mount Doom, no Westeros, no Skyrim place names)
- NO "epic / breathtaking / jaw-dropping / stunning / majestic" — show, don't tell
- NO real-world toponyms (no "Patagonia", "Iceland", "Sahara" — fantasy worldbuilding only)
- NO modern objects, no urban infrastructure

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, no markdown. Each string starts with \`<LANDSCAPE TITLE CAPS> — \` and is one sentence.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
