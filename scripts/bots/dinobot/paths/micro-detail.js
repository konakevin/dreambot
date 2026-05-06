/**
 * DinoBot micro-detail — extreme close-ups of dinosaur anatomy.
 * Scales, feathers, eyes, claws, teeth, skin texture.
 * Macro wildlife photography of prehistoric animals.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const detail = picker.pickWithRecency(pools.MICRO_DETAILS, 'micro_detail');
  const species = picker.pickWithRecency(pools.DINO_SPECIES, 'micro_species');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const camera = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');
  const atmosphere = picker.pickWithRecency(pools.PREHISTORIC_ATMOSPHERES, 'atmosphere');

  return `You are a macro wildlife photographer writing EXTREME CLOSE-UP scenes for DinoBot. The intimate details of dinosaur anatomy — the texture of a scale, the iris of an eye, the barb of a feather, the serration of a tooth, the callus of a foot. Macro lens, shallow depth of field, the animal fills the entire frame. Output wraps with style prefix + suffix.

${blocks.NO_HUMANS_BLOCK}

${blocks.DINOSAUR_IS_HERO_BLOCK}

${blocks.SPECIES_ACCURATE_BLOCK}
${blocks.ENVIRONMENT_STORYTELLING_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE DINOSAUR ━━━
${species}

━━━ THE DETAIL ━━━
${detail}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.VOLUMETRIC_LIGHT_BLOCK}

${blocks.WET_WORLD_BLOCK}

${blocks.LUSH_PRIMORDIAL_BLOCK}

${blocks.EPIC_SCALE_BLOCK}

${blocks.VAST_TERRAIN_BLOCK}

${blocks.SURPRISING_WEATHER_BLOCK}

${blocks.BLOW_IT_UP_BLOCK}

━━━ CAMERA / FRAMING ━━━
${camera}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Extreme close-up. Macro lens. The detail IS the subject — a single anatomical feature fills the frame with razor-sharp focus. Ultra-shallow depth of field. The viewer feels close enough to touch the animal.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
