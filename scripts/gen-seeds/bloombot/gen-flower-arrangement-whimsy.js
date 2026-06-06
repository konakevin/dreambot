#!/usr/bin/env node
/**
 * BLOOMBOT_FLOWER_ARRANGEMENT_WHIMSY — surreal/whimsical twists on
 * an ornate floral arrangement. Mirror-split halves, arrangement-inside-
 * arrangement, right-angle stems, levitating top, inverted-reflection
 * symmetry.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_flower_arrangement_whimsy.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} WHIMSY entries for BloomBot's flower-arrangement path — surreal / whimsical / impossible twists on an ornate floral arrangement. Each entry is one descriptive line, 30-50 words. NO leading CAPS NAME — flowing prose. Each describes ONE specific surreal touch that turns an arrangement from beautiful → magical and dream-coded.

━━━ THE BAR ━━━
Every entry names a SPECIFIC small surreal touch — geometric impossibility, recursive nesting, gravity-defying float, symmetric impossibility, growth direction-reversal, inversion mirror. The arrangement remains elegant and detailed, but one element breaks physics cleanly (Magritte register, not chaos).

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"the arrangement split cleanly into two mirror-image halves that lean away from each other in a graceful V, each side a perfect floral echo of the other, the gap between them revealing the vessel dramatically below"
"a second miniature arrangement growing impossibly from within the first — a tiny perfect replica nested at the heart of the blooms, an arrangement inside the arrangement, endlessly self-referential and exquisite"
"every stem bent at a precise right angle midway up, blooms pivoting sharply horizontal before turning skyward again, the arrangement performing an elegant geometric zigzag entirely at odds with nature"
"the topmost blooms frozen in the act of gently separating from their stems, hovering a breath above the arrangement in a neat levitating crown, tethered to nothing, impeccably poised"
"the arrangement growing downward as well as up — a perfect inverted reflection blooming beneath the vessel as if into a mirror, the whole piece symmetrical top-to-bottom in impossible floral palindrome"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~4 MIRROR-SYMMETRY (split-V mirror halves, perfect bilateral mirror, ground-glass top-bottom mirror, mirror-palindrome top-to-bottom)
- ~4 RECURSIVE / NESTED (arrangement-inside-arrangement, nested-replica core, fractal nested florals, infinite self-similar layers)
- ~4 GEOMETRIC-BENT STEMS (right-angle stems, zigzag column of blooms, Möbius-twist stem, Penrose impossible structure)
- ~4 LEVITATING-COMPONENT (top blooms hovering off, blooms suspended in air around vessel, a single hovering blossom-crown, floating bloom-aura)
- ~4 GROWING-DOWNWARD (inverted growth beneath vessel, blooms growing into the table, reverse-gravity descending mass)
- ~4 PORTAL / WINDOW (arrangement contains a window to a meadow, vessel opens to inner-world bloom-meadow, single bloom-portal showing another scene)
- ~3 SCALE-WRONG (one bloom impossibly oversized in mass, single dinner-plate-bloom dwarfing others, one massive hero-bloom)
- ~3 SEASONAL CONTRADICTION (spring + autumn + winter blooms in one arrangement, blooms cycling birth-to-decay across single stem)
- ~3 IMPOSSIBLE-INTERIOR (vessel filled with cloud + arrangement, vessel holding liquid-bloom soup, vessel containing a galaxy)
- ~3 SHADOW-LIE (arrangement shadow does not match the blooms, shadow forms a different species, shadow falls upward)
- ~3 TIME-FROZEN (single petal mid-fall frozen in air around vessel, bloom mid-burst captured forever, fading-blooms simultaneously with bursting)
- ~3 GLOWING-BLOOMS (blooms emitting soft inner light, fireflies inside one bloom-cluster, single bloom-glow lighting whole vessel)
- ~3 ANIMAL-INTRUDER (hummingbird frozen mid-hover at one bloom, butterfly cluster suspended around arrangement, bee chain spiraling)
- ~3 PETAL-WEATHER (petals snowing around arrangement, petal-cloud orbiting vessel, petal-rain returning to blooms)
- ~3 IMPOSSIBLE-WEIGHT (massive arrangement floating off table, vessel balanced on one petal-tip, weightless mass)
- ~3 ARCHITECTURE-LIKE (arrangement built as flying-buttress, blooms forming an arch, vase-and-blooms as a tower)
- ~3 LIQUID-DRIPPING (blooms slowly melting into honey at base, blooms dripping color into vessel, petals dripping like wax)
- ~3 GROWING-OUT (single stem growing from vessel through ceiling, one stem rising into clouds, vines escaping vessel-side)
- ~3 ROOT-VISIBLE (impossible root system spreading across surface beneath vessel, root-glow under glass vessel)

━━━ BANS ━━━
- NO sci-fi / no neon / no hologram.
- NO sloppy chaos — the surrealism is CLEAN and PAINTERLY (Magritte register).
- NO bare "whimsical" — name the SPECIFIC rule-break.
- NO leading CAPS NAME — flowing prose only.

━━━ FORMAT ━━━
Each entry: 30-50 words. Flowing prose. Names ONE specific surreal touch + its visual specifics.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
