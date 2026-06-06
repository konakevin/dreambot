#!/usr/bin/env node
/**
 * ARCANE_HALL — Grand magical interior pool for DragonBot's arcane-halls path.
 *
 * The STAGE — a substantial grand magical interior (NOT a cozy cottage,
 * NOT a tight study). Cathedral / throne room / vault / observatory /
 * banquet hall / forge-hall / monastery / sky-pavilion scale. The
 * spellcaster + magic come from other slots (caster + spell_moment +
 * magic_phenomena).
 *
 * Mirrors existing 25-entry register: single-sentence (15-30 words)
 * describing the interior + warm light source + texture detail. LOTR /
 * GoT / Hogwarts / D&D / Witcher / Elden Ring visual lineage.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/arcane_halls.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} GRAND MAGICAL INTERIOR descriptions for DragonBot's arcane-halls path — substantial fantasy interiors where a spellcaster could unleash a room-filling spell. LOTR / GoT / Hogwarts / D&D / Witcher / Elden Ring visual lineage. Strict Western high fantasy.

Each entry: 15-30 words. One specific interior. No characters in the entry — the spellcaster comes from a separate slot at render-time.

━━━ SCALE: GRAND, NOT INTIMATE ━━━

These are SUBSTANTIAL interiors with room for room-filling magic — cathedral halls, throne rooms, vaults, observatories, banquet halls, forge-halls, libraries, monasteries. NOT a one-corner study, NOT a cozy cottage nook, NOT a single armchair-and-hearth alcove (that's the cozy-arcane path's territory). The space must accommodate a 60%+ frame-fill spell + multiple magical light sources + columns / arches / vaulted ceilings.

GOOD scale anchors:
- cathedral-sized library carved into obsidian cliffs
- dragon's treasure vault deep in volcanic stone with smoke-darkened arches
- alchemist's tower spiraling through seven floors of a crumbling spire
- mountain fortress war-room with maps covering granite walls floor-to-ceiling
- mountaintop signal tower with panoramic brass-framed windows

━━━ VARIETY MANDATE — distribute across these 8 interior clusters (~25 per cluster) ━━━

1. CATHEDRAL / SANCTUARY (cathedral nave / temple sanctuary / monastery hall / shrine chamber / consecrated vault — vaulted ceilings + columns + stained-glass)
2. LIBRARY / ARCHIVE / OBSERVATORY (cathedral-library / star-chart observatory / rune-archive / scriptorium / map-vault — shelves + scrolls + reading desks at scale)
3. THRONE / COURT / AUDIENCE HALL (throne room / royal court / banquet hall / petitioner's hall / great hall — dais + banners + long colonnades)
4. FORGE / WORKSHOP / LABORATORY (dwarven forge-hall / grand alchemist tower / artifice workshop / runic enchantery — anvils, alembics, copper apparatus at hall-scale)
5. VAULT / TREASURY / CRYPT (treasure vault / sealed crypt / artifact vault / dragon-hoard vault / royal mausoleum — coin-drifts, sarcophagi, sealed reliquaries)
6. SUBTERRANEAN / CAVERN / GROTTO (crystal-cavern archive / fungal-cathedral / underground river-temple / lava-tube atrium / hot-spring grotto — natural geology at hall scale)
7. ARBOREAL / NATURAL FUSION (world-tree hollow / overgrown reclaimed cathedral / living-wood pavilion / glacier-ice sanctum / cliff-dwelling behind waterfall — nature + architecture fused)
8. AERIAL / EXOTIC LOCATION (sky-island pavilion / cliffside meditation hall / mountaintop signal tower / lighthouse interior / floating archive — interior with epic vista visible through opening)

━━━ WARM LIGHT + TEXTURE — every entry needs both ━━━

WARM LIGHT SOURCE: hearth-fire / braziers / oil lanterns / candle-light / forge-glow / magma-channels / bioluminescent fungi / sunlight through stained-glass / moon-silver through aperture / enchanted braziers / floating spell-orbs

TEXTURE / MATERIAL DETAIL: worn stone / weathered wood / smoke-darkened arches / verdigris bronze / aged leather / hammer-marked walls / crystal pillars / ice-buttresses / barnacle-crusted timber / root-systems breaking through

━━━ THE LANGUAGE PATTERN — mirror these existing entries' register ━━━

GOOD examples already in the pool (vary strongly from them):
  • "A cathedral-sized wizard library carved into obsidian cliffs, brass lanterns casting amber glow on leather spines stacked toward vaulted ceilings, spiral staircases worn smooth."
  • "Dwarven forge-hall with rivers of molten stone illuminating hammer-marked walls, anvils the size of wagons, centuries of tools hanging from iron chains overhead."
  • "Runic archive beneath frozen citadel, enchanted braziers keeping frost at bay, ice-blue light refracting through crystal pillars carved with glowing glyphs spanning subterranean halls."
  • "Coastal lighthouse tower interior spiraling upward through five levels, lantern-light reflecting off nautical brass fixtures, storm shutters filtering silver moonlight across weathered wooden stairs."

Notice the pattern: <SPECIFIC INTERIOR TYPE> + <WARM LIGHT SOURCE> + <TEXTURE / MATERIAL detail> in a single sentence.

━━━ BANS ━━━

- NO people / creatures / spellcasters in the entry (the slot is filled by other pools)
- NO cozy-cottage / single-armchair / one-corner intimate space (that's cozy-arcane, a different path)
- NO real-world ethnic-coded interiors (no Forbidden-City, no Persian, no Aztec — fantasy worldbuilding only)
- NO sci-fi / cyberpunk / neon-modern / electric bulbs / plastic / chrome
- NO named IPs (no Hogwarts, no Minas Tirith, no Winterfell — invent fantasy spaces)
- NO "majestic / awesome / epic / breathtaking" filler — name SPECIFIC architecture
- NO grand cathedrals with white walls and floor-to-ceiling stained-glass as a default — vary architecture clusters

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, no markdown. Each entry is one sentence.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
