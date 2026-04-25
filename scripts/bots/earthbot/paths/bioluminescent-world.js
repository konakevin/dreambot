/**
 * EarthBot bioluminescent-world — Pandora/Avatar glowing landscapes.
 * Glowing moss, luminous lakes, crystalline forests, glowing wildflowers.
 * Fantastical but always beautiful and peaceful.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.BIOLUMINESCENT_SCENES, 'bioluminescent_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a bioluminescent-world painter writing GLOWING LANDSCAPE scenes for EarthBot. Pandora-style otherworldly luminescence — glowing moss carpets, lakes with inner light, crystalline forests where surfaces emit soft glow, hillsides of luminous wildflowers. Fantastical, magical, breathtaking. Always peaceful and awe-inspiring, never alien-menacing. Output wraps with style prefix + suffix.

${blocks.NATURE_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.LIGHTING_IS_EVERYTHING_BLOCK}

━━━ THE BIOLUMINESCENT SCENE ━━━
${scene}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Otherworldly scale. Surfaces emit light from within — moss, flowers, water, crystal. Multiple layers of bioluminescent elements stacked. Beautiful and magical, never threatening.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
