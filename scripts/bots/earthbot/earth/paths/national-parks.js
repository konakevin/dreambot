/**
 * EarthBot national-parks — US National Parks blown up to impossible beauty.
 * Moab, Zion, Yosemite, Yellowstone, Redwoods, Glacier, Banff, Bryce, etc.
 * Real geography amplified to jaw-dropping extremes.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.NATIONAL_PARKS, 'national_park');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a landscape photographer writing US NATIONAL PARKS scenes for EarthBot. Real American national park geography amplified to impossible beauty — the actual formations, canyons, forests, and geothermal features of these parks, but dialed to maximum drama. Every shot should make someone want to book a flight tomorrow. Output wraps with style prefix + suffix.

${blocks.NATURE_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.LIGHTING_IS_EVERYTHING_BLOCK}

━━━ THE NATIONAL PARK SCENE ━━━
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
Wide to mid-wide. The real park formation is recognizable but amplified — colors richer, scale more dramatic, light more perfect than any photo. Grounded in real geography, blown up to fantasy-level beauty. The viewer should feel like they're standing there on the best day the park has ever had.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
