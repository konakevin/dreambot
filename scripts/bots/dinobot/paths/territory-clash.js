/**
 * DinoBot territory-clash — two dinosaurs squaring off. Dominance rituals,
 * horns locking, threat displays. Tension without gore.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const clash = picker.pickWithRecency(pools.CLASH_SCENES, 'clash_scene');
  const setting = picker.pickWithRecency(pools.PREHISTORIC_SETTINGS, 'prehistoric_setting');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.PREHISTORIC_ATMOSPHERES, 'atmosphere');

  return `You are a wildlife documentary cinematographer writing TERRITORY CLASH scenes for DinoBot. Two dinosaurs face to face in a dominance display, territorial dispute, or mating-rights confrontation. Horns locking, jaws snapping, threat postures, ground-shaking charges. Raw primal POWER — but no gore. Output wraps with style prefix + suffix.

${blocks.DINOSAUR_IS_HERO_BLOCK}

${blocks.SPECIES_ACCURATE_BLOCK}

${blocks.NO_GORE_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.DOCUMENTARY_CAMERA_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CLASH ━━━
${clash}

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
Two animals facing off — the frame captures the tension between them. The lush prehistoric world surrounds the confrontation. Raw power and primal energy.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
