/**
 * BloomBot garden-walk path — walkable outdoor garden/path scenes dialed to 10×.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const flower = picker.pickWithRecency(pools.FLOWER_TYPES, 'flower');
  const walk = picker.pickWithRecency(pools.GARDEN_WALKS, 'garden_walk');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pick(pools.ATMOSPHERES);

  return `You are a garden photographer writing WALKABLE OUTDOOR flower path / garden scenes for BloomBot. The space is intimate-scale (you could step into it) but the floral density is IMPOSSIBLE — 10× more blooms than reality. Paths, trails, arches, hedge tunnels, meadows — all OVERTAKEN by specific flowers. Output wraps with style prefix + suffix.

${blocks.FLORAL_DOMINANCE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE WALKABLE SPACE ━━━
${walk}

━━━ THE DOMINANT FLOWER TYPE ━━━
${flower}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.DRAMATIC_LIGHTING_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ RULES ━━━
- Walkable / intimate scale — path, trail, arch, garden corner (not dramatic backdrop, not interior)
- Flowers DIALED TO 10× density — more blooms than physics should allow
- Specific flower species visible dominating the scene
- Outdoor (not indoor — that's cozy path)
- No people in frame

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble, no quotes.`;
};
