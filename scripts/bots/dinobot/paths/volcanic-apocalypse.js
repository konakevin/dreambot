/**
 * DinoBot volcanic-apocalypse — dinosaurs against volcanic eruptions.
 * Lava flows, ash clouds, fire-lit silhouettes. Nature's fury meets
 * prehistoric life. Dramatic, not gore.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.VOLCANIC_SCENES, 'volcanic_scene');
  const species = picker.pickWithRecency(pools.DINO_SPECIES, 'volcanic_species');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.PREHISTORIC_ATMOSPHERES, 'atmosphere');

  return `You are a disaster-documentary cinematographer writing VOLCANIC APOCALYPSE scenes for DinoBot. Dinosaurs amid volcanic eruptions — lava rivers, ash-darkened skies, glowing pyroclastic flows, fleeing herds silhouetted against fire. The raw power of a volcanic Earth meeting the animals that lived on it. Dramatic and awe-inspiring, not gory. Output wraps with style prefix + suffix.

${blocks.DINOSAUR_IS_HERO_BLOCK}

${blocks.SPECIES_ACCURATE_BLOCK}

${blocks.NO_GORE_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE DINOSAUR ━━━
${species}

━━━ THE VOLCANIC SCENE ━━━
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
The volcano dominates the background. Dinosaurs in the foreground — fleeing, watching, enduring. Fire-lit from below, ash-darkened from above. The prehistoric world at its most dramatic and dangerous.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
