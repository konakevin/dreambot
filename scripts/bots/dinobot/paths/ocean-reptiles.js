/**
 * DinoBot ocean-reptiles — marine reptiles of the Mesozoic.
 * Plesiosaurs, mosasaurs, ichthyosaurs, giant sea turtles.
 * Underwater + surface shots of prehistoric oceans.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.OCEAN_SCENES, 'ocean_scene');
  const species = picker.pickWithRecency(pools.DINO_SPECIES, 'ocean_species');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.PREHISTORIC_ATMOSPHERES, 'atmosphere');

  return `You are a deep-sea wildlife cinematographer writing PREHISTORIC OCEAN scenes for DinoBot. Marine reptiles of the Mesozoic — plesiosaurs gliding through kelp forests, mosasaurs hunting in open water, ichthyosaurs breaching the surface, ammonites drifting in currents. The prehistoric ocean is as alive and terrifying as the land. Output wraps with style prefix + suffix.

${blocks.DINOSAUR_IS_HERO_BLOCK}

${blocks.SPECIES_ACCURATE_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.SCALE_AND_ATMOSPHERE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE MARINE REPTILE ━━━
${species}

━━━ THE OCEAN SCENE ━━━
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
Underwater or half-submerged framing. The prehistoric ocean is vast, deep, alive. Marine reptiles move through water with grace and power. Light filters from above. The deep is beautiful and alien.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
