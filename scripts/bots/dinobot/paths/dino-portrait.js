/**
 * DinoBot dino-portrait — single dinosaur hero portrait. Museum-grade
 * paleoart detail. Telephoto wildlife photography framing.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const species = picker.pickWithRecency(pools.DINO_SPECIES, 'dino_species');
  const setting = picker.pickWithRecency(pools.PREHISTORIC_SETTINGS, 'prehistoric_setting');
  const cue = picker.pickWithRecency(pools.DINO_VISUAL_CUES, 'visual_cue');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.PREHISTORIC_ATMOSPHERES, 'atmosphere');

  return `You are a paleo-art wildlife photographer writing DINO PORTRAIT scenes for DinoBot. Single dinosaur as hero subject. Telephoto wildlife portrait — the camera caught this animal in a candid moment. Museum-grade paleoart detail. Output wraps with style prefix + suffix.

${blocks.DINOSAUR_IS_HERO_BLOCK}

${blocks.SPECIES_ACCURATE_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.DOCUMENTARY_CAMERA_BLOCK}

${blocks.ENVIRONMENT_STORYTELLING_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE DINOSAUR ━━━
${species}

━━━ VISUAL DETAIL ━━━
${cue}

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
Telephoto wildlife portrait. Single dino fills the frame. Candid — not roaring at the camera. Existing. Breathing. Being an animal. Lush prehistoric environment surrounding it.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
