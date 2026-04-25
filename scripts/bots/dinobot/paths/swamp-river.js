/**
 * DinoBot swamp-river — aquatic and semi-aquatic prehistoric life.
 * Spinosaurs fishing, giant crocs, muddy riverbanks, foggy swamps.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.SWAMP_SCENES, 'swamp_scene');
  const species = picker.pickWithRecency(pools.DINO_SPECIES, 'swamp_species');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.PREHISTORIC_ATMOSPHERES, 'atmosphere');

  return `You are a wildlife documentary cinematographer writing SWAMP AND RIVER WORLD scenes for DinoBot. Semi-aquatic prehistoric life — spinosaurs fishing in murky rivers, giant crocodilians lurking, dinosaurs drinking at water's edge, pterosaurs skimming the surface. Water is the setting — muddy, foggy, teeming with life. Output wraps with style prefix + suffix.

${blocks.DINOSAUR_IS_HERO_BLOCK}

${blocks.SPECIES_ACCURATE_BLOCK}

${blocks.NO_GORE_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.ENVIRONMENT_STORYTELLING_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE DINOSAUR ━━━
${species}

━━━ THE SWAMP/RIVER SCENE ━━━
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
Water dominates. The prehistoric waterway is lush, murky, alive. Dinosaurs interact with the water — wading, fishing, drinking, swimming. The environment is as much a character as the animals.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
