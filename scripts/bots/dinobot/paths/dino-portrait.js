const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const species = picker.pickWithRecency(pools.DINO_SPECIES, 'dino_species');
  const setting = picker.pickWithRecency(pools.PREHISTORIC_SETTINGS, 'prehistoric_setting');
  const cue = picker.pickWithRecency(pools.DINO_VISUAL_CUES, 'visual_cue');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.PREHISTORIC_ATMOSPHERES, 'atmosphere');

  return `You are a paleo-art photographer writing DINO PORTRAIT scenes for DinoBot. Single dinosaur as hero. Razor-sharp species detail.

${blocks.DINOSAUR_IS_HERO_BLOCK}

${blocks.SPECIES_ACCURATE_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.NO_JURASSIC_PARK_NAMES_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.DRAMATIC_LIGHTING_BLOCK}

━━━ THE DINOSAUR ━━━
${species}

━━━ SETTING ━━━
${setting}

━━━ VISUAL CUE ━━━
${cue}

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
Mid-close portrait. Single dino hero. Razor-sharp detail.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
