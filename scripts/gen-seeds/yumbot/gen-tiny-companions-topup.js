#!/usr/bin/env node
/**
 * YumBot TINY_COMPANIONS top-up (Stage 2 backfill 2026-06-05).
 *
 * Shared by rainbow-dreamscape + candy-fantasy (and other paths that filter
 * by HABITAT tag). Hand-curated 56-entry pool uses a strict {description,
 * tags} object shape with two tag dimensions:
 *
 *   TYPE:    BIRD / RABBIT / FROG / BUTTERFLY / FAIRY / FISH / INSECT /
 *            MAMMAL / MAGICAL_ORB / MOCHI_BLOB / REPTILE / AMPHIBIAN
 *   HABITAT: WATER / FOREST / FESTIVAL / SKY / CANDY / TEA_PARTY / PICNIC /
 *            COTTAGECORE / RAINBOW_DREAMSCAPE / UNIVERSAL / CAFE /
 *            CANDY_FANTASY
 *
 * The seedGenHelper preserves objects with a non-empty `tags` array
 * (helper.js line 246-248). This script asks Sonnet to emit the tagged
 * object shape directly so the helper appends them un-flattened.
 *
 * Topping up toward 200; will accept natural ceiling.
 */
const { generatePool } = require('../../lib/seedGenHelper');

const VALID_TYPES = [
  'BIRD',
  'RABBIT',
  'FROG',
  'BUTTERFLY',
  'FAIRY',
  'FISH',
  'INSECT',
  'MAMMAL',
  'MAGICAL_ORB',
  'MOCHI_BLOB',
  'REPTILE',
  'AMPHIBIAN',
];
const VALID_HABITATS = [
  'WATER',
  'FOREST',
  'FESTIVAL',
  'SKY',
  'CANDY',
  'TEA_PARTY',
  'PICNIC',
  'COTTAGECORE',
  'RAINBOW_DREAMSCAPE',
  'UNIVERSAL',
  'CAFE',
  'CANDY_FANTASY',
];

generatePool({
  outPath: 'scripts/bots/yumbot/seeds/tiny_companions.json',
  total: 200,
  batch: 20,
  maxTokens: 16000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} new TINY_COMPANIONS for YumBot — cute peripheral creatures that inhabit YumBot scenes ALONGSIDE the food-creatures. These appear AROUND the food (never as the hero), supporting cute scene density.

Each entry is a STRUCTURED OBJECT with two fields:
  - "description": short kawaii creature description (16-26 words)
  - "tags": array combining 1+ TYPE tag AND 1+ HABITAT tag (multiple of each allowed)

━━━ VALID TAGS (NEVER use any tag outside this list) ━━━

TYPE (must include at least one):
  BIRD, RABBIT, FROG, BUTTERFLY, FAIRY, FISH, INSECT, MAMMAL, MAGICAL_ORB,
  MOCHI_BLOB, REPTILE, AMPHIBIAN

HABITAT (must include at least one — usually 2-4 since most creatures fit multiple worlds):
  WATER, FOREST, FESTIVAL, SKY, CANDY, TEA_PARTY, PICNIC, COTTAGECORE,
  RAINBOW_DREAMSCAPE, UNIVERSAL, CAFE, CANDY_FANTASY

━━━ EXAMPLES (mirror exact format + register) ━━━

{ "description": "A tiny pastel-pink butterfly with closed-arc eyes, mid-flight, soft glittering wings", "tags": ["BUTTERFLY", "SKY", "PICNIC", "COTTAGECORE", "RAINBOW_DREAMSCAPE", "UNIVERSAL"] }
{ "description": "A pearl-cream bunny nibbling a tiny pastel-strawberry, dimpled blush cheeks", "tags": ["RABBIT", "MAMMAL", "FOREST", "COTTAGECORE", "PICNIC"] }
{ "description": "A pastel-mint frog mid-jump between two lily-pads, dewdrops trailing", "tags": ["FROG", "AMPHIBIAN", "WATER", "COTTAGECORE"] }
{ "description": "A cluster of tiny golden-glow fireflies drifting through twilight air", "tags": ["INSECT", "FAIRY", "SKY", "FOREST", "FESTIVAL", "COTTAGECORE"] }
{ "description": "A pastel-pink mochi-blob creature with closed-arc eyes and dimpled blush, hopping shyly", "tags": ["MOCHI_BLOB", "UNIVERSAL", "CAFE", "CANDY_FANTASY", "RAINBOW_DREAMSCAPE"] }

━━━ VARIETY MANDATE (distribute across new entries) ━━━

Build coverage for the under-represented HABITAT tags (current pool is COTTAGECORE-heavy; we need more CAFE / TEA_PARTY / CANDY_FANTASY / FESTIVAL / RAINBOW_DREAMSCAPE companions).

- ~18% CAFE-fitting creatures (small kawaii pets, cafe-shop animals, indoor-cozy critters)
- ~14% TEA_PARTY-fitting creatures (porcelain-themed fairies, tiny formal companions)
- ~14% CANDY_FANTASY-fitting creatures (sugar/candy themed creatures, gummy-blobs)
- ~12% RAINBOW_DREAMSCAPE-fitting creatures (sky orbs, rainbow wisps, cloud-creatures)
- ~10% FESTIVAL-fitting creatures (lantern-fairies, koi-spirits, paper-crane companions)
- ~10% WATER / FROG / FISH / AMPHIBIAN — pond-life, kawaii-koi, axolotls, tadpoles
- ~8% FOREST mammals — kawaii deer, fox-kits, hedgehogs, squirrels, mice
- ~8% BIRD / BUTTERFLY / INSECT — varied birds, butterflies, dragonflies, bees
- ~6% MAGICAL_ORB / FAIRY — wisps, sprites, sparkle-orbs

Tag combinations should overlap when natural — a pastel butterfly fits SKY + PICNIC + COTTAGECORE + RAINBOW_DREAMSCAPE; tag GENEROUSLY for cross-path reusability.

━━━ KAWAII REGISTER MANDATES ━━━

- Pastel colors (pink, mint, lavender, cream, pearl, baby-blue, yellow, peach)
- Cute proportions — oversized eyes, dimpled blush, closed-arc smiles, fluffy/soft, kawaii face
- ONE creature per entry (max small cluster of 2-3 if natural for the species)
- Glossy / pearlescent / glittering / sparkle-trail finishes welcomed
- Mid-pose / mid-action (mid-hop, mid-flight, peeking, perched, nibbling)

━━━ HARD BANS ━━━

- NO humans / chibi-children / faces (creatures only).
- NO scary / horror / spooky / dark register.
- NO photoreal / realistic-rendering register (kawaii only).
- NO modern objects in the creatures (no phones, no helmets).
- NO tag outside the VALID lists above.
- NO description with zero kawaii anchor words (must say "pastel", "kawaii", "blush", "closed-arc", "dimpled", or similar — pick at least one).

━━━ OUTPUT ━━━

JSON array of ${n} OBJECTS in the {"description": "...", "tags": [...]} shape. No preamble, no numbering, no markdown.`,
}).then(() => {
  // Validate tags after write
  const fs = require('fs');
  const out = JSON.parse(
    fs.readFileSync('scripts/bots/yumbot/seeds/tiny_companions.json', 'utf8')
  );
  let invalid = 0;
  out.forEach((e, i) => {
    if (typeof e === 'string') return; // legacy entries fine
    const tags = e.tags || [];
    const bad = tags.filter((t) => !VALID_TYPES.includes(t) && !VALID_HABITATS.includes(t));
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
