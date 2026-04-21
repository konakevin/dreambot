/**
 * BloomBot cosmic path — alien / space / otherworldly floral scenes.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const flower = picker.pickWithRecency(pools.FLOWER_TYPES, 'flower');
  const scene = picker.pickWithRecency(pools.COSMIC_SCENES, 'cosmic_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pick(pools.ATMOSPHERES);

  return `You are a sci-fi concept artist writing COSMIC / ALIEN / OTHERWORLDLY floral scenes for BloomBot. Alien planets, outer space, bioluminescent Avatar-style jungles, flower-shaped galaxies. Flowers are still the hero — but the context breaks physics / biology / location. Output wraps with style prefix + suffix.

${blocks.FLORAL_DOMINANCE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE COSMIC SCENE ━━━
${scene}

━━━ THE FLOWER SPECIES (may be invented / alien / impossible) ━━━
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
- OTHERWORLDLY — alien planet / space / cosmic phenomenon / Avatar-Pandora bioluminescent
- Flowers are still the hero + subject (not just sci-fi with flower garnish)
- Bioluminescence, zero-g, alien biology, cosmic scale — all welcome
- NOT earthly-surreal (that's dreamscape path — pianos + clockwork + cathedrals stay there)
- Breath-taking sci-fi beauty

Output ONLY the 60-90 word scene description. Comma-separated phrases. No preamble, no quotes.`;
};
