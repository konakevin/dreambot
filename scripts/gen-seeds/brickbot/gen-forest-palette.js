#!/usr/bin/env node
/**
 * BRICKBOT_FOREST_PALETTE — 3-4-color themed palettes for forest/woodland
 * dioramas. Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_forest_palette.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} PALETTE entries for BrickBot's forest path — cohesive 3-4-color stories for an enchanted/woodland brick diorama. Each entry: ONE 14-22 word phrase: theme + colors + cohesion tail.

━━━ THE BAR ━━━
Every entry names a THEME (Elvendale-fae / Forestmen-ranger / haunted-grove / autumn-redwood / pine-forest / spring-blossom / etc.) PLUS specific brick color names (sand-green / dark-green / dark-tan / olive / trans-cyan / trans-pink / reddish-brown / etc.) PLUS short cohesion tail. CLEAN 3-4 colors max.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 SEASONAL: spring-blossom / summer-deep-green / autumn-foliage / winter-bare / monsoon-jungle / late-fall-russet
- ~4 LEGO FACTIONS: Elvendale fae, Forestmen ranger, Friends-Forest, Crystal-Falls explorers, Hobbit-shire
- ~3 ENCHANTED / FAE: glow-mushroom grove, fae-court palette, wood-nymph dell, pixie-realm
- ~3 DARK / HAUNTED: dark-grey + black + trans-purple, haunted ruined hollow, witch's coven thicket
- ~3 BIOMES: pine boreal forest, oak-broadleaf, tropical jungle, mangrove-river, redwood-canopy, bamboo-grove
- ~3 RAINFOREST / JUNGLE: emerald canopy, trans-cyan understory, parrot-bright accents, monsoon-mist
- ~2 LIGHT / SUN-DAPPLED: dappled green-gold, warm-sun afternoon, fall-amber sunlit
- ~2 NIGHT / MOONLIT: silver-moon + deep-green + bone-white, fairy-night
- ~2 ANIMAL-INSPIRED: deer-tan + autumn-russet, owl-grey + dark-green, fox-orange + olive
- ~1 BLACK-WOOD GOTHIC: silhouettes against pale-cream sky
- ~1 BAMBOO + JADE eastern grove
- ~1 SWAMP / MARSH: silt-brown + dark-olive + trans-green

━━━ FORMAT ━━━
Each entry: ONE phrase "<Theme> palette — <color>1 + <color>2 + <color>3 (+ <color>4), <cohesion tail>". Touchpoints:
"Elvendale fairy palette — trans-purple + sand-green + warm-gold + rose-pink, jewel-bright and ethereal, the elf-queen court shimmer"
"Forestmen ranger palette — dark-green + dark-tan + reddish-brown, muted and weathered, the hooded-outlaw woodland-camouflage legacy"
"Autumn-redwood palette — burnt-orange + dark-tan + olive + dark-red, glowing fall canopy and rust-needle floor"

━━━ BANS ━━━
- NO more than 4 main colors
- NO photoreal vocab
- NO mood-modifier as color ("happy-yellow")
- NO "rainbow" or "any-color"
- NO duplicating themes

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
