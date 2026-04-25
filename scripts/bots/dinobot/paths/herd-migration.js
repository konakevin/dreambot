/**
 * DinoBot herd-migration — colossal herds crossing prehistoric plains.
 * Massive scale, dust clouds, endless silhouettes. BBC nature doc energy.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const herd = picker.pickWithRecency(pools.HERD_SCENES, 'herd_scene');
  const setting = picker.pickWithRecency(pools.PREHISTORIC_SETTINGS, 'prehistoric_setting');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.PREHISTORIC_ATMOSPHERES, 'atmosphere');

  return `You are a BBC wildlife cinematographer writing COLOSSAL HERD MIGRATION scenes for DinoBot. Massive numbers of dinosaurs moving together across a lush prehistoric world. The scale is the story — dozens to hundreds of animals, stretching to the horizon. Output wraps with style prefix + suffix.

${blocks.DINOSAUR_IS_HERO_BLOCK}

${blocks.SPECIES_ACCURATE_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.SCALE_AND_ATMOSPHERE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE HERD ━━━
${herd}

━━━ SETTING ━━━
${setting}

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
Wide epic frame. The herd dominates — animals at multiple distances from foreground to horizon. The prehistoric landscape is lush and alive around them. Scale is everything.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
