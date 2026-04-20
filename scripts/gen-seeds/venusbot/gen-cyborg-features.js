#!/usr/bin/env node
/**
 * Generate 50 CYBORG FEATURES — the dominant mechanical element visible
 * per render. Used in closeup / full-body / seduction paths.
 *
 * Each describes a LARGE, VISIBLY DOMINANT mechanical feature — 30-50%
 * of what the viewer sees. Not a small accent. The cyborg half is
 * unmistakable and integral to her body, not bolted on.
 *
 * Output: scripts/bots/venusbot/seeds/cyborg_features.json
 */

const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/venusbot/seeds/cyborg_features.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} DOMINANT cyborg feature descriptions for a half-human half-machine woman. Each describes a LARGE mechanical element that takes up 30-50% of what the viewer sees — part of her body, not an attached prop.

━━━ WHAT MAKES A GOOD ENTRY ━━━

- Names a specific body zone (face, jaw, throat, shoulder, chest, arm, torso, spine, back, hip, thigh, temple, skull)
- Describes the mechanical integration in detail (plating, circuitry, translucent panels, exposed gears, cabling, glowing cores, segmented structure, hinge joints, piston-articulation)
- Makes clear how the mechanical part INTEGRATES with the organic part (seam, transition, split, continuation)
- Feminine silhouette stays intact (curves visible)
- Materials can be ANY mix — chrome, brushed titanium, brass, copper, rose-gold, obsidian glass, translucent polymer, latex, carbon fiber, ceramic, liquid mercury, iridescent holographic, matte composite

━━━ CONTENT ━━━

Each entry is 30-60 words. Vary widely across:
- Which body zone dominates
- What material combination
- What glowing internal element is visible
- How the seam between human and machine reads

━━━ BANNED ━━━

- NO nipples, no nipple-position features, no breast-center ports/studs/gems/LEDs
- No "she poses" / "posing" / "editorial" / "fashion shoot"
- No defaulting to chrome-everything — explicitly mix 2-3 materials per entry

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
  maxTokens: 4000,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
