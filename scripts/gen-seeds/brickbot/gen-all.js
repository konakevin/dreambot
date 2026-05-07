#!/usr/bin/env node
/**
 * BrickBot pool generator — runs all 39 per-path pool generations.
 *
 * For each of 13 paths, generates: scenes (200), lighting (40),
 * palette (40). Total ~3,500 entries across 39 JSON files.
 *
 * Usage:
 *   node scripts/gen-seeds/brickbot/gen-all.js                   # all 13 paths × 3 pools
 *   node scripts/gen-seeds/brickbot/gen-all.js --path pirates    # one path × 3 pools
 *   node scripts/gen-seeds/brickbot/gen-all.js --path pirates --kind scenes  # one pool
 *
 * Existing files are overwritten — generation is non-incremental.
 */

const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');
const PATH_CONFIGS = require('./path-configs');

const SEED_DIR = 'scripts/bots/brickbot/seeds';

function arg(name) {
  const i = process.argv.indexOf('--' + name);
  if (i < 0) return null;
  return process.argv[i + 1] || null;
}

const onlyPath = arg('path');
const onlyKind = arg('kind');

const sceneMeta = (cfg, n) => `You are writing ${n} BrickBot ${cfg.label.toUpperCase()} scene seeds for a LEGO MOC photographer. Each seed becomes one render.

━━━ SUBJECT ━━━
${cfg.subject}

━━━ SEED FORMAT ━━━
Each entry is 18-32 words. Comma-separated descriptive phrase clusters. NO sentences with periods. Example shape: "{element1}, {element2}, {minifig action}, {detail}, {atmospheric note}".

━━━ COVERAGE — DELIVER ALL THREE TYPES ━━━
~40% ARCHITECTURE / WORLD shots (the BUILD is the subject):
  • Building cross-sections, vehicle exteriors, structure-defining establishing shots
  • Examples: "pirate galleon under full sail, weathered planks, cannons run out, parrot on bowsprit"
  • Examples: "fantasy castle keep — battlements, banners snapping, drawbridge half-raised, moat shimmering below"

~50% STORY scenes (minifigs in MID-ACTION with narrative beats):
  • Use action verbs. Show what's happening AT THIS MOMENT, with cause and reaction.
  • Format: "{minifig} {verb}-ing {object/target} while {other figure} {reacting}".
  • Examples: "captain crossing swords with mutineer mid-deck while crew watches, storm clouds gathering"
  • Examples: "wizard hurling fireball spell at troll while ranger draws bow from cover"
  • NEVER static "minifigs standing around" — always a NARRATIVE BEAT.

~10% MOOD / ATMOSPHERIC establishing shots:
  • No characters in focus. Pure place / weather / object detail.
  • Examples: "treasure cave entrance dripping with stalactites, pile of gold doubloons, single torch flickering"

━━━ HARD RULES ━━━
- Every entry must read as the subject specified above. ${cfg.label.toUpperCase()} unmistakably.
- Use specific brick / build language: "transparent piece," "slope brick," "minifig accessory," "technic beam," "molded element"
- NO HUMAN HANDS, NO HUMAN SKIN, NO REAL PEOPLE in scene descriptions
- Vary the camera-implied subjects across the pool (don't lead with the same noun every entry)
- For story scenes: always show CAUSE → EFFECT. Someone reacts to what someone else does.

━━━ DEDUP ━━━
No two entries share the same subject + action combination. Spread across different sub-themes within ${cfg.label.toUpperCase()}.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`;

const lightingMeta = (cfg, n) => `You are writing ${n} BrickBot ${cfg.label.toUpperCase()} LIGHTING DESCRIPTIONS — short prose phrases that lock the lighting / atmosphere of a single render.

━━━ SUBJECT MOOD ━━━
${cfg.lightingMood}

━━━ ENTRY FORMAT ━━━
Each entry: 12-22 words. A single specific lighting situation in concrete imagery.

━━━ GOOD EXAMPLES (study the texture) ━━━
- "golden-hour rim-light raking across pirate galleon sails from stern, deck in deep shadow"
- "single shaft of sun cutting through cathedral stained-glass, dust motes visible, candlelit altar below"
- "blizzard whiteout flat-light, every brick edge soft and luminous, snow filling negative space"
- "aurora borealis greens and violets washing across snowfield, lit cabin window glowing warm"
- "neon-pink ferris-wheel chaser-bulbs reflected in puddles, summer-night humid haze"

━━━ HARD RULES ━━━
- Stay within the SUBJECT MOOD above — every entry must feel like ${cfg.label.toUpperCase()}.
- Specific colors named (cobalt, amber, scarlet, emerald) > generic ("warm", "cool")
- Each entry one sensation / one image
- VARY the dominant mood across the pool — don't repeat the same lighting situation

━━━ DEDUP ━━━
No two entries describe the same lighting setup with different words.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`;

const paletteMeta = (cfg, n) => `You are writing ${n} BrickBot ${cfg.label.toUpperCase()} COLOR PALETTES — short comma-separated palette descriptions for a single render.

━━━ SUBJECT MOOD ━━━
${cfg.paletteMood}

━━━ ENTRY FORMAT ━━━
Each entry: 8-16 words. Comma-separated named-colors with a short evocative descriptor.
Example shape: "{color1} + {color2} + {color3} + {color4}, {one-word mood descriptor}"

━━━ GOOD EXAMPLES ━━━
- "cobalt + ruby + amber + emerald + amethyst, stained-glass jewel-tone"
- "rust + ochre + sun-bleached wood + sagebrush green, dusty-frontier"
- "transparent cyan + chrome silver + black + neon-yellow, blacktron-classic"
- "blush pink + butter yellow + lavender + mint, candy-pastel"

━━━ HARD RULES ━━━
- Every palette must feel like ${cfg.label.toUpperCase()}.
- Stay within the SUBJECT MOOD above
- 4-5 named colors per entry
- Vary the dominant first-named color across the pool — don't always lead with the same hue

━━━ DEDUP ━━━
No two entries share the same 4-color combo.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`;

async function genOne(cfg, kind) {
  const filename = `${cfg.key}_${kind}`;
  const outPath = `${SEED_DIR}/${filename}.json`;
  const config = (() => {
    if (kind === 'scenes') return { total: 200, batch: 25, metaPrompt: (n) => sceneMeta(cfg, n) };
    if (kind === 'lighting') return { total: 40, batch: 20, metaPrompt: (n) => lightingMeta(cfg, n) };
    if (kind === 'palette') return { total: 40, batch: 20, metaPrompt: (n) => paletteMeta(cfg, n) };
    throw new Error('unknown kind: ' + kind);
  })();
  console.log(`\n━━━ Generating ${filename} (${config.total} entries) ━━━`);
  await generatePool({ outPath, ...config });
}

(async () => {
  const cfgs = onlyPath ? PATH_CONFIGS.filter((c) => c.key === onlyPath || c.label === onlyPath) : PATH_CONFIGS;
  if (onlyPath && cfgs.length === 0) {
    console.error(`Unknown path: ${onlyPath}. Valid keys: ${PATH_CONFIGS.map((c) => c.key).join(', ')}`);
    process.exit(1);
  }
  const kinds = onlyKind ? [onlyKind] : ['scenes', 'lighting', 'palette'];
  for (const cfg of cfgs) {
    for (const kind of kinds) {
      await genOne(cfg, kind);
    }
  }
  console.log('\n✅ All requested pools generated.');
})().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
