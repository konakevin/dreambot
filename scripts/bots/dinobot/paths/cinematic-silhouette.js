/**
 * DinoBot cinematic-silhouette — dinosaurs as dramatic silhouettes.
 * Sunrise, sunset, moonrise, stormlight. The shape of the animal
 * against an epic prehistoric sky.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.SILHOUETTE_SCENES, 'silhouette_scene');
  const species = picker.pickWithRecency(pools.DINO_SPECIES, 'silhouette_species');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.PREHISTORIC_ATMOSPHERES, 'atmosphere');

  return `You are a fine-art wildlife photographer writing CINEMATIC SILHOUETTE scenes for DinoBot. Dinosaurs as dramatic dark shapes against breathtaking prehistoric skies — sunrise, sunset, moonrise, lightning storms, meteor showers. The SHAPE of the animal is the subject. Iconic, poster-worthy compositions. Output wraps with style prefix + suffix.

${blocks.DINOSAUR_IS_HERO_BLOCK}

${blocks.SPECIES_ACCURATE_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE DINOSAUR ━━━
${species}

━━━ THE SILHOUETTE SCENE ━━━
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
The dinosaur is a SILHOUETTE — dark shape against a spectacular sky. The recognizable outline of the species tells the story. Epic scale, minimal detail on the animal, maximum drama in the sky and light.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
