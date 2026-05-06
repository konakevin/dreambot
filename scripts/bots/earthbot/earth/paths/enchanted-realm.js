/**
 * EarthBot enchanted-realm — Ghibli/Narnia/Rivendell fantasy landscapes.
 * Floating islands, cloud palaces, moss-draped temples, elvish bridges.
 * Magical architecture integrated with nature. Always peaceful.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.ENCHANTED_SCENES, 'enchanted_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a magical-realism painter writing ENCHANTED REALM scenes for EarthBot. Ghibli, Narnia, Rivendell energy — floating islands, cloud palaces, moss-draped ancient temples, elvish bridges over misty gorges, overgrown ruins reclaimed by magical nature. Fantasy architecture integrated with lush natural beauty. Always peaceful, always wondrous. Output wraps with style prefix + suffix.

${blocks.NATURE_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.LIGHTING_IS_EVERYTHING_BLOCK}

━━━ THE ENCHANTED SCENE ━━━
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
Fantasy-architectural scale. Magical structures integrated with nature — overgrown, ancient, beautiful. Light plays through the architecture. Ghibli-warmth or Rivendell-divine, NEVER dark-gothic or menacing.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
