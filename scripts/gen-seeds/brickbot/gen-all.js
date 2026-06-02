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
const SCENE_TOTAL = parseInt(arg('scene-total'), 10) || 25; // default 25 for fast iteration; use --scene-total 200 for prod

// Camera-framing distribution per entry. Default split favors variety
// across scales; "wide" skew is for camera-defined paths (macro-display,
// lego-masters, landscape) where the path's identity IS the wide framing.
// MACRO removed 2026-05-07 — extreme-zoom shots lost their LEGO character
// (looked like real-life metal/leather/etc instead of brick).
const FRAMING_SPLIT = {
  default: { wide: 25, medium: 30, close: 35, atmospheric: 10 },
  wide: { wide: 55, medium: 30, close: 15, atmospheric: 0 },
};

const sceneMeta = (cfg, n) => {
  const skew = cfg.cameraSkew === 'wide' ? FRAMING_SPLIT.wide : FRAMING_SPLIT.default;
  return `You are writing ${n} BrickBot ${cfg.label.toUpperCase()} scene seeds for a LEGO MOC photographer. Each seed becomes one render.

━━━ SUBJECT ━━━
${cfg.subject}

━━━ SEED FORMAT ━━━
Each entry is 18-32 words. Comma-separated descriptive phrase clusters. NO sentences with periods.
EVERY entry must lead with a FRAMING TAG (one of WIDE / MEDIUM / CLOSE / ATMOSPHERIC) so the framing is unambiguous to the renderer. Example shape:
  "WIDE: {whole-build description}, {context detail}, {minifig scale-reference if any}, {atmospheric note}"
  "CLOSE: {minifig mid-action}, {target/object}, {other figure reaction}, {detail}"

━━━ FRAMING DISTRIBUTION (deliver ALL types in this proportion) ━━━

~${skew.wide}% WIDE — entire build / diorama / vista in frame, baseplate edges visible, multiple build elements visible at once. The camera is pulled back; the BUILD is the hero.
  Examples:
  • "WIDE: complete pirate harbor diorama, three galleons docked, brick-built pier with crates, harbor town backdrop with lit windows, entire baseplate visible"
  • "WIDE: full LEGO Masters turntable showcase of crumbling cathedral interior, every floor visible, dramatic spotlight overhead, fog rolling across base"
  • "WIDE: alpine ski village from elevated angle, multiple chalets, gondola tower, mountain backdrop, snow-covered baseplate edges"

~${skew.medium}% MEDIUM — one part of the scene visible, multiple minifigs in context, depth and surroundings clear but not the full build. Mid-distance.
  Examples:
  • "MEDIUM: pirate captain on quarterdeck addressing crew of six, ship's wheel visible, sails behind, evening sky"
  • "MEDIUM: fantasy market square with three vendor stalls, customers browsing, half of the city wall visible behind"

~${skew.close}% CLOSE — story beat, single moment, tight framing on minifig action. The minifig + immediate surroundings fill the frame, but the LEGO build context is still visible (NOT extreme zoom on a single object). Action verbs + cause/reaction.
  Examples:
  • "CLOSE: captain crossing swords with mutineer on deck planks, blades clashing, crew watching frozen, storm rain streaking, mast and rigging visible"
  • "CLOSE: wizard hurling transparent-blue spell-ball at advancing troll, ranger drawing bow from cover behind brick column, sparks flying, dungeon walls visible"

~${skew.atmospheric}% ATMOSPHERIC — mood/weather/place, no character focus. Pure environment.
  Examples:
  • "ATMOSPHERIC: foggy harbor dawn, ghost-ship shadow on horizon, brick-built bell-buoy ringing, pale silver light"
  • "ATMOSPHERIC: thunderstorm over castle ramparts, lightning forking sky, rain on banners, no figures visible"

━━━ HARD RULES ━━━
- Every entry must lead with a FRAMING TAG (WIDE: / MEDIUM: / CLOSE: / ATMOSPHERIC:).
- Every entry must read as ${cfg.label.toUpperCase()} unmistakably.
- Use specific brick / build language: "transparent piece," "slope brick," "minifig accessory," "technic beam," "molded element"
- NO HUMAN HANDS, NO HUMAN SKIN, NO REAL PEOPLE in scene descriptions
- NO EXTREME ZOOM on a single small object (no "extreme close-up of a badge," no "macro of a single gear filling the frame"). The LEGO build context must always be visible — multiple bricks, multiple build elements, or at minimum a clear brick-built environment around the subject.
- For CLOSE story scenes: always show CAUSE → EFFECT. Someone reacts to what someone else does.
- For WIDE shots: explicitly mention "whole build," "entire diorama," "edges of baseplate," "multiple build elements," or similar wide-framing language.

━━━ DEDUP ━━━
No two entries share the same subject + framing combination.

━━━ OUTPUT ━━━
JSON array of ${n} strings, each starting with its FRAMING TAG (WIDE: / MEDIUM: / CLOSE: / ATMOSPHERIC: only — no MACRO). No preamble, no numbering.`;
};

const lightingMeta = (
  cfg,
  n
) => `You are writing ${n} BrickBot ${cfg.label.toUpperCase()} LIGHTING DESCRIPTIONS — short prose phrases that lock the lighting / atmosphere of a single render.

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

const paletteMeta = (
  cfg,
  n
) => `You are writing ${n} BrickBot ${cfg.label.toUpperCase()} COLOR PALETTES — short comma-separated palette descriptions for a single render.

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
    if (kind === 'scenes')
      return {
        total: SCENE_TOTAL,
        batch: Math.min(SCENE_TOTAL, 25),
        metaPrompt: (n) => sceneMeta(cfg, n),
      };
    if (kind === 'lighting')
      return { total: 40, batch: 20, metaPrompt: (n) => lightingMeta(cfg, n) };
    if (kind === 'palette') return { total: 40, batch: 20, metaPrompt: (n) => paletteMeta(cfg, n) };
    throw new Error('unknown kind: ' + kind);
  })();
  console.log(`\n━━━ Generating ${filename} (${config.total} entries) ━━━`);
  await generatePool({ outPath, ...config });
}

(async () => {
  const cfgs = onlyPath
    ? PATH_CONFIGS.filter((c) => c.key === onlyPath || c.label === onlyPath)
    : PATH_CONFIGS;
  if (onlyPath && cfgs.length === 0) {
    console.error(
      `Unknown path: ${onlyPath}. Valid keys: ${PATH_CONFIGS.map((c) => c.key).join(', ')}`
    );
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
