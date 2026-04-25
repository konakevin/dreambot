/**
 * DinoBot extinction-event — the asteroid impact and its aftermath.
 * The final chapter. Firestorms, impact winter, the last dinosaurs.
 * Epic, tragic, beautiful.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.EXTINCTION_SCENES, 'extinction_scene');
  const species = picker.pickWithRecency(pools.DINO_SPECIES, 'extinction_species');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.PREHISTORIC_ATMOSPHERES, 'atmosphere');

  return `You are an apocalyptic nature documentary cinematographer writing EXTINCTION EVENT scenes for DinoBot. The asteroid has struck or is about to. The final chapter of the Mesozoic — firestorms on the horizon, darkened skies, the last dinosaurs in a dying world. Epic tragedy. Beautiful devastation. The end of an era. Output wraps with style prefix + suffix.

${blocks.DINOSAUR_IS_HERO_BLOCK}

${blocks.SPECIES_ACCURATE_BLOCK}

${blocks.NO_GORE_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.SCALE_AND_ATMOSPHERE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE DINOSAUR ━━━
${species}

━━━ THE EXTINCTION SCENE ━━━
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
The world is ending, but the animal endures in this moment. The sky tells the story — fire, ash, darkness, the streak of the asteroid. The dinosaur is dignified, not panicked. Tragic beauty on an impossible scale.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
