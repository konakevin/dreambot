#!/usr/bin/env node
/**
 * YumBot DECOR_ITEMS top-up (Stage 2 backfill 2026-06-05).
 *
 * Small scene-decoration items — NOT food, NOT characters, NOT landscape
 * features. They populate scenes with charming clutter, filtered by
 * WORLD_FIT so each path pulls only decor that fits its emotional world.
 *
 * Shared by rainbow-dreamscape + candy-fantasy (plus other paths tag-
 * filtering by WORLD_FIT). Uses the strict {description, tags} object
 * shape — the seedGenHelper preserves objects with non-empty `tags`.
 *
 * Tag dimensions:
 *   TYPE:      LANTERN / FLOWER / RIBBON / FAIRY_LIGHT / BUNTING / BASKET /
 *              PLUSH / SIGN / VESSEL / WIND_DECOR / LACE / GIFT / TINY_OBJECT
 *   WORLD_FIT: CAFE / KONBINI / CANDY_FANTASY / FESTIVAL / PICNIC / BAKERY /
 *              MARKET / TEA_PARTY / ARCADE / COTTAGECORE / BENTO / MINI_CHEF /
 *              RAINBOW_DREAMSCAPE / UNIVERSAL / BREAKFAST
 *
 * Topping up toward 200; accepting natural ceiling.
 */
const { generatePool } = require('../../lib/seedGenHelper');

const VALID_TYPES = [
  'LANTERN',
  'FLOWER',
  'RIBBON',
  'FAIRY_LIGHT',
  'BUNTING',
  'BASKET',
  'PLUSH',
  'SIGN',
  'VESSEL',
  'WIND_DECOR',
  'LACE',
  'GIFT',
  'TINY_OBJECT',
];
const VALID_WORLDS = [
  'CAFE',
  'KONBINI',
  'CANDY_FANTASY',
  'FESTIVAL',
  'PICNIC',
  'BAKERY',
  'MARKET',
  'TEA_PARTY',
  'ARCADE',
  'COTTAGECORE',
  'BENTO',
  'MINI_CHEF',
  'RAINBOW_DREAMSCAPE',
  'UNIVERSAL',
  'BREAKFAST',
];

generatePool({
  outPath: 'scripts/bots/yumbot/seeds/decor_items.json',
  total: 200,
  batch: 20,
  maxTokens: 16000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} new DECOR_ITEMS for YumBot — small scene-decoration items that populate scenes with charming clutter. NOT food. NOT characters. NOT landscape. Small set-dressing items.

Each entry is a STRUCTURED OBJECT with two fields:
  - "description": short item description (12-22 words)
  - "tags": array combining 1+ TYPE tag AND 1+ WORLD_FIT tag (multiple of each allowed)

━━━ VALID TAGS (NEVER use any tag outside this list) ━━━

TYPE (must include at least one):
  LANTERN, FLOWER, RIBBON, FAIRY_LIGHT, BUNTING, BASKET, PLUSH, SIGN,
  VESSEL, WIND_DECOR, LACE, GIFT, TINY_OBJECT

WORLD_FIT (must include at least one — usually 2-4 since most decor fits multiple worlds):
  CAFE, KONBINI, CANDY_FANTASY, FESTIVAL, PICNIC, BAKERY, MARKET,
  TEA_PARTY, ARCADE, COTTAGECORE, BENTO, MINI_CHEF, RAINBOW_DREAMSCAPE,
  UNIVERSAL, BREAKFAST

━━━ EXAMPLES (mirror exact format + register) ━━━

{ "description": "A paper-lantern strand of warm red-and-gold lanterns hung overhead with soft glow", "tags": ["LANTERN", "FESTIVAL", "CAFE"] }
{ "description": "A small pastel-pink rose bouquet wrapped in lace tied with twine", "tags": ["FLOWER", "COTTAGECORE", "TEA_PARTY", "PICNIC", "BAKERY"] }
{ "description": "A string of pastel-pink-and-blue triangular bunting hanging in a gentle arc", "tags": ["BUNTING", "CANDY_FANTASY", "PICNIC", "CAFE", "BAKERY", "TEA_PARTY"] }
{ "description": "A vintage porcelain teapot on a saucer with steam-curl rising", "tags": ["VESSEL", "TEA_PARTY", "CAFE", "COTTAGECORE"] }
{ "description": "A drift of soft pastel-glitter dust through the air, catching warm light", "tags": ["WIND_DECOR", "UNIVERSAL", "CAFE", "BAKERY", "TEA_PARTY", "RAINBOW_DREAMSCAPE"] }

━━━ VARIETY MANDATE (under-represented WORLDS to prioritize) ━━━

Current pool is CAFE/COTTAGECORE-heavy. Add coverage for under-represented worlds:
- ~14% CANDY_FANTASY decor (gummy-bear-cluster, candy-cane-arch, lollipop-fence, sugar-bauble)
- ~12% RAINBOW_DREAMSCAPE decor (floating cloud-cushions, rainbow-arc-ribbons, pastel-pearl-orbs)
- ~10% FESTIVAL decor (lantern-strands, paper-fan stalls, taiko-banner, koi-flag)
- ~10% BAKERY decor (cake-stands, glass-display-domes, pastel-tile counters, frosting-tubes)
- ~10% TEA_PARTY decor (porcelain settings, lace-doilies, ribbon-bows, pearl-strands)
- ~8% MARKET / KONBINI decor (wire-shelves, price-tags, neat-product-rows)
- ~8% PICNIC / OUTDOOR decor (checkered blankets, wicker baskets, jam-jars)
- ~8% ARCADE / RETRO-KAWAII decor (pastel-neon signs, plushie claw-machines, token-cups)
- ~6% COTTAGECORE decor (wildflower wreaths, vintage-glass jars, woven mats)
- ~6% MINI_CHEF / KITCHEN decor (whisks, mixing-bowls, rolling-pins, apron-on-hook)
- ~4% BENTO / BREAKFAST decor (chopstick rests, dividers, food-picks)
- ~4% UNIVERSAL decor (drifting glitter, pearl-orb clusters that fit any path)

Tag GENEROUSLY for cross-path reuse — a pastel-bunting fits BAKERY + CAFE + PICNIC + CANDY_FANTASY + TEA_PARTY simultaneously.

━━━ KAWAII REGISTER MANDATES ━━━

- Pastel colors (pink, mint, lavender, cream, pearl, baby-blue, yellow, peach)
- Glossy / pearlescent / soft-glow / lace-trim / ribbon-bow finishes
- Small scale — set-decoration, NOT hero subject
- Specific (not "a flower" — "a sprig of pastel-lavender stems tied with twine")

━━━ HARD BANS ━━━

- NO food / drinks (those live in FOOD_CATALOG).
- NO living characters / creatures (those live in TINY_COMPANIONS).
- NO landscape features (those live in LANDSCAPE_FEATURES).
- NO photoreal / realistic / industrial register.
- NO modern tech (no phones, no laptops, no TVs).
- NO scary / dark / spooky.
- NO tag outside the VALID lists above.

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS in the {"description": "...", "tags": [...]} shape. No preamble, no numbering, no markdown.`,
}).then(() => {
  const fs = require('fs');
  const out = JSON.parse(
    fs.readFileSync('scripts/bots/yumbot/seeds/decor_items.json', 'utf8')
  );
  let invalid = 0;
  out.forEach((e, i) => {
    if (typeof e === 'string') return;
    const tags = e.tags || [];
    const bad = tags.filter((t) => !VALID_TYPES.includes(t) && !VALID_WORLDS.includes(t));
    if (bad.length) {
      console.error(`#${i + 1}: invalid tags ${bad.join(',')}`);
      invalid++;
    }
  });
  if (invalid) {
    console.error(`⚠ ${invalid} entries with invalid tags — REVIEW FILE before deploy`);
  } else {
    console.log(`✓ all tags valid`);
  }
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
