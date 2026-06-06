#!/usr/bin/env node
/**
 * BRICKBOT_LANDSCAPE_FLORA_DETAIL — brick-built vegetation for epic vistas.
 * Audit 2026-06-05: 42 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_landscape_flora_detail.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} FLORA-DETAIL entries for BrickBot's landscape path — each names a built brick vegetation feature anchoring the foreground/mid-ground of an epic vista diorama. Each entry: ONE phrase, 22-35 words, leading with "A" or "An".

━━━ THE BAR ━━━
Every entry names a SPECIFIC plant/forest/foliage feature (mangrove roots / saguaro field / heather moor / pine grove / palm cluster / etc.) AND describes how it's built (round-bricks, plant-elements, bar-armatures, slope-bricks, etc.) AND placed in the diorama (foregrounding the vista, mid-ground scale, scattering across baseplate).

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 ALPINE / MOUNTAIN: pine grove, fir cluster, alpine meadow, krummholz, edelweiss patch
- ~4 DESERT: saguaro field, prickly-pear cluster, agave star, mesquite scrub, ocotillo spray
- ~4 TROPICAL: palm cluster, coconut grove, banana-plant, hibiscus burst, bird-of-paradise stalk
- ~4 RAINFOREST: jungle vines tangled, fern undergrowth, giant strangler-fig, dense canopy plates
- ~3 COASTAL: mangrove root-arch, sea-grape thicket, beach-pine clinging
- ~3 PRAIRIE / SAVANNA: tall grass tufts, acacia umbrella tree, baobab silhouette, dry-grass field
- ~3 TUNDRA / POLAR: lichen-patch, dwarf-birch, arctic-poppy patch, moss-mound
- ~3 BOREAL / TAIGA: spruce grove, larch cluster, birch stand, lichen-bog
- ~3 WETLAND / MARSH: cattail clump, reed forest, lily-pad raft, water-lotus
- ~2 DECIDUOUS: oak grove, maple stand, sycamore avenue, autumn-foliage cluster
- ~2 BAMBOO / EASTERN: bamboo grove, plum-blossom branch, cherry-blossom drift
- ~2 CACTUS / SUCCULENT: prickly-pear field, barrel-cactus cluster, joshua-tree stand
- ~1 RICE / TERRACE: paddy step
- ~1 HEATHER / MOORLAND: purple heather-flat
- ~1 CARNIVOROUS-PLANT: pitcher-plant cluster, venus-flytrap

━━━ FORMAT ━━━
Each entry: ONE phrase, lead with "A" / "An", 22-35 words. Touchpoints:
"A mangrove-root build — arching brown bar-armature roots with round-brick knee-props rising from trans-blue plates, dark-green plant-element canopy massed above"
"A saguaro field — tall green round-brick columns with upswept cylinder-brick arms, scattered across a flat tan-plate desert with brown brush-element clumps between"
"A heather-moor sweep — rolling purple + green plate hills textured with dense tiny round-plate heather-blooms and scrub-element tufts, muted and broad across the diorama mid-ground"

━━━ BANS ━━━
- NO photoreal language
- NO living-fluid verbs ("sways gently in the breeze")
- NO licensed franchise names
- NO duplicating flora types
- NO blank "trees" — name the species

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
