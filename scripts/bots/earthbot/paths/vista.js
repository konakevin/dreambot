/**
 * EarthBot vista path — epic wide-scale Earth panoramas.
 * Patagonian peaks, Icelandic coasts, Saharan dunes, Hawaiian lava. National
 * Geographic cover × 10.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const vista = picker.pickWithRecency(pools.EARTH_VISTAS, 'earth_vista');
  const biome = picker.pickWithRecency(pools.BIOMES, 'biome');
  const timeOfDay = picker.pickWithRecency(pools.TIME_OF_DAY, 'time_of_day');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a landscape photographer on a National-Geographic assignment writing EPIC EARTH VISTA scenes for EarthBot. Wide, panoramic, dramatic Earth-landscapes dialed to 10× saturation / composition / atmosphere. Output wraps with style prefix + suffix.

${blocks.EARTH_ONLY_BLOCK}

${blocks.NATURE_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.NO_WILDLIFE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE EARTH VISTA ━━━
${vista}

━━━ BIOME CONTEXT ━━━
${biome}

━━━ TIME OF DAY / LIGHT ━━━
${timeOfDay}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.DRAMATIC_LIGHTING_BLOCK}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Wide sweeping vista — horizon prominent, scale massive. Earth geology is the hero. Multiple atmospheric layers stacked. Colors pushed beyond documentary realism. Light is magnificent and specific.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
