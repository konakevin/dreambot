/**
 * OceanBot kraken-leviathan — sea monsters, tentacles dwarfing ships, ancient terror.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.KRAKEN_SCENES, 'kraken_scene');
  const lighting = picker.pickWithRecency(pools.OCEAN_SURFACE_LIGHTING, 'surface_lighting');
  const atmosphere = picker.pickWithRecency(pools.OCEAN_ATMOSPHERES, 'atmosphere');

  return `You are a mythic-maritime painter writing KRAKEN & LEVIATHAN scenes for OceanBot. Ancient sea monsters of impossible scale — tentacles rising around old sailing ships, massive silhouettes beneath the hull, whirlpools pulling vessels down, serpentine bodies breaking the surface. The terror and awe of the unknown deep. Output wraps with style prefix + suffix.

${blocks.OCEAN_IS_HERO_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.MARITIME_MYTH_BLOCK}

${blocks.WATER_LIGHTING_BLOCK}

━━━ THE MONSTER SCENE ━━━
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
Scale is everything — the creature dwarfs whatever else is in frame. Ships are tiny. The monster emerges from darkness or depth. Storm light, moonlight, or lightning reveals the horror. Epic, mythic, cinematic.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
