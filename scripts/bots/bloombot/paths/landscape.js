/**
 * BloomBot landscape path — Garden-of-Eden-times-100 dramatic backdrops.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const flower = picker.pickWithRecency(pools.FLOWER_TYPES, 'flower');
  const setting = picker.pickWithRecency(pools.LANDSCAPE_SETTINGS, 'landscape_setting');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a surrealist landscape photographer writing DRAMATIC WIDE-SCENE floral landscapes for BloomBot. Every render is Garden-of-Eden-times-100 — an INSANE explosion of flowers overtaking a stunning natural backdrop. Output wraps with style prefix + suffix.

${blocks.FLORAL_DOMINANCE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE FLOWER (hero species that dominates the scene) ━━━
${flower}

━━━ THE DRAMATIC SETTING ━━━
${setting}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC ELEMENT ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.DRAMATIC_LIGHTING_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Wide sweeping vista. Setting is dramatic + massive. Flowers OVERTAKE the scene — impossibly dense, more blooms than should exist. The specific flower species is unmistakable throughout. The setting is still visible and stunning, but flowers dominate every surface, every foreground element, every mid-ground. Physics-defying floral density.

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble, no quotes. Avoid unescaped quotes inside entries.`;
};
