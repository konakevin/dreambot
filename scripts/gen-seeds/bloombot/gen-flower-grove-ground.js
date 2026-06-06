#!/usr/bin/env node
/**
 * BLOOMBOT_FLOWER_GROVE_GROUND — Truffula/Lorax-fluffy ground in a
 * fun/crazy flower-grove. Pom-pom blossoms, plush mounds, shaggy
 * bloom-tufts, downy pile, velvet quilt terrain, springy carpet. Focuses
 * on FORM/SCALE only — color is rolled by the engine.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_flower_grove_ground.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} GROUND entries for BloomBot's flower-grove path — Truffula/Lorax-fluffy Dr-Seuss-coded fluffy ground beneath giant tree-sized blooms. Each entry is one descriptive line, 25-45 words. NO leading CAPS NAME — just a flowing prose entry describing the ground's FORM and SCALE.

━━━ THE BAR ━━━
Every entry names a SPECIFIC FORM of ground covered in dense tiny pom-pom / tuft / fluff / shag / cushion blossoms. NO color descriptions (engine adds color). Focus on the surface shape, terrain undulation, plushness, density, scale. Truffula-coded — soft round hummocks, hill-mounds, valley folds, plush dunes, soft slopes, gentle waves.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"rolling tufted hills densely furred in tiny pom-pom blossoms, the whole terrain cushiony and plush, swelling into soft rounded hummocks that bounce and billow toward the horizon"
"a vast meadow floor carpeted in deep shaggy bloom-tufts, undulating in gentle mounds like a thick velvet quilt draped over slow rolling ground"
"spongy bloom-covered terrain swelling into soft rounded dunes, every surface packed with thousands of tiny tufted flowers giving the ground a thick downy pile"
"densely mounded bloom-cushions filling the valley floor, each hummock furred to the tip with tight pom-pom tufts, winding soft gaps of pressed flower-turf between them"
"a plush carpet of densely packed tiny blossoms rolling in low even waves, the surface springy and thick as a shag rug laid over gentle hills"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~6 ROLLING-HILLS form (mounded hummocks, swelling rises, gentle waves, low ridges, soft hill-pile, billowing folds)
- ~5 DUNE / DRIFT form (rounded dunes, plush drift-mounds, soft windblown waves, undulating bloom-dunes)
- ~5 VALLEY / DIP form (gentle valley folds, soft hollow basin, bowl of bloom-tufts, scooped low-ground, dip between mounds)
- ~5 CARPET / RUG form (springy carpet, plush shag, deep pile, dense velvet quilt, downy mat, woven-tuft mat)
- ~4 TERRACE / STEP form (terraced bloom-shelves, stepped soft mounds, layered bloom-plinths, tiered cushioned shelves)
- ~4 PILLAR-MOUND form (individual fluffy bumps, isolated cushion-mounds, scattered pom-pom hillocks, tufted mound-cluster)
- ~3 SCATTERED-CLUSTER form (loose cushion-clusters, soft scattered pillows of bloom, isolated tuft-islands)
- ~3 SWELLING-MASS form (vast swelling bloom-mass, monumental cushion-mass, broad plush expanse)
- ~3 FRINGED-EDGE form (fringed bloom-skirts at base, fringed soft-edge mounds, shaggy-edge pile)
- ~3 TIGHT-DENSE form (densely tight-packed mat, compact firm-packed tuft, tightly bunched cushion-grass)
- ~3 LOOSE-FLOATY form (loosely floating fluff-mounds, airy puffball ground, soft loose-pile mounds)
- ~3 RIBBON / FLOW form (ribbons of bloom-tuft flowing between mounds, soft seam-line between hummocks, soft bloom-river between cushions)
- ~3 ROOTED-CARPET form (deeply matted bloom-floor, root-fused cushion-mat, integrated turf-tuft)
- ~3 SOFT-PADDING form (pillow-soft underfoot, fluff-padded ground, billowy cushion-pile)

━━━ BANS ━━━
- NO color descriptions (no pink / purple / orange / red — color is engine-rolled).
- NO scenes with figures or buildings — this is GROUND ONLY.
- NO sci-fi / no neon / no hologram.
- NO bare "flower meadow" — name the SPECIFIC FORM of ground.
- NO CAPS NAME prefix — flowing prose only.

━━━ FORMAT ━━━
Each entry: 25-45 words. Flowing prose — NO leading CAPS NAME. Describes FORM and SCALE of the fluffy bloom-ground only.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
