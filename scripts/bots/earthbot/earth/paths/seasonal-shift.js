/**
 * EarthBot seasonal-shift — the beauty of changing seasons.
 * Autumn fire, first snow, cherry blossoms, spring thaw, summer golden hour.
 * Seasons at their most dramatic and beautiful.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.SEASONAL_SCENES, 'seasonal_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a nature photographer writing SEASONAL SHIFT scenes for EarthBot. The most dramatic and beautiful moments of seasonal change — autumn forests on fire with color, first snow dusting a mountain valley, cherry blossom storms, spring thaw flooding a meadow with wildflowers, golden summer evenings. The season itself is the subject. Output wraps with style prefix + suffix.

${blocks.NATURE_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.LIGHTING_IS_EVERYTHING_BLOCK}

━━━ THE SEASONAL SCENE ━━━
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
Mid-wide to wide frame. The seasonal transformation dominates — leaves, blossoms, snow, or wildflowers fill the scene. Colors are pushed to maximum seasonal intensity. The viewer should feel the season in their bones.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
