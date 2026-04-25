/**
 * EarthBot sacred-light — single divine light moments.
 * Sunbeam through ruins, firefly pillar in clearing, glowing doorway.
 * The light IS the moment. Intimate, hushed, reverent.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const moment = picker.pickWithRecency(pools.SACRED_LIGHT_MOMENTS, 'sacred_light');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sacred-light painter writing DIVINE LIGHT MOMENT scenes for EarthBot. A single luminous phenomenon IS the moment — a sunbeam piercing a ruined cathedral, a firefly pillar in a forest clearing, a glowing doorway at twilight, shafts of light through a cave entrance. Tight focus, hushed reverence. Output wraps with style prefix + suffix.

${blocks.NATURE_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.LIGHTING_IS_EVERYTHING_BLOCK}

━━━ THE SACRED LIGHT MOMENT ━━━
${moment}

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
Mid or tight frame — NOT wide panorama. The luminous event fills the emotional center. Surrounding darkness or shadow contrasts with the brilliance. A held-breath moment, quietly miraculous.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
