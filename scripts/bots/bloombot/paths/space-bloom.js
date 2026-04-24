/**
 * BloomBot space-bloom path — flowers taking over spaceships, alien worlds,
 * space stations, exotic planets. Sci-fi meets botanical explosion.
 * Flowers are WINNING against the cold void of space.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const arrangement = picker.pickWithRecency(pools.FLOWER_ARRANGEMENTS, 'flower_arrangement');
  const space = picker.pickWithRecency(pools.SPACE_BLOOM_SPACES, 'space_bloom_space');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pick(pools.ATMOSPHERES);

  return `You are a sci-fi botanical photographer writing SPACE BLOOM scenes for BloomBot. Flowers TAKING OVER spaceships, alien worlds, space stations, and exotic planets. The cold technological void of space is losing to warm, living, overflowing flowers. Output wraps with style prefix + suffix.

${blocks.FLORAL_DOMINANCE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE SPACE SETTING ━━━
${space}

━━━ THE FLOWERS CONQUERING THIS PLACE ━━━
${arrangement}

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

━━━ SPACE BLOOM SIGNATURE — NON-NEGOTIABLE ━━━
- SCI-FI ENVIRONMENT visible — metal hulls, viewports, alien terrain, stars, nebulae, strange skies
- Flowers are TAKING OVER the space environment — not potted plants, INVASION
- CONTRAST is key — soft living petals against hard cold metal/alien stone/void of space
- Include SPACE CONTEXT — stars visible through windows, alien sky colors, technological details
- The scene should feel like flowers have been growing here for years, slowly winning

━━━ BLOW IT UP — FLOWERS CONQUERING SPACE ━━━
The flowers have COLONIZED this space environment:
- Blooms erupting through control panels, air vents, hull breaches
- Flowers cascading over consoles, climbing viewport frames, filling corridors
- Alien landscapes CARPETED in impossible flower density
- Vines wrapping around antenna arrays, solar panels, structural beams
- The technology/alien world is LOSING — flowers cover 60-70% of the frame
- Life has won against the void — the botanical takeover is nearly complete

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble, no quotes.`;
};
