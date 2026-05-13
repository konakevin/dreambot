/**
 * StarBot starwars-landscape path — multi-biome Star-Wars-coded vista,
 * no characters. Twin-sun deserts, redwood moons, lava hellscapes,
 * city-planet skyscapes, lake country, junkyard shipwreck deserts.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const landscape = picker.pickWithRecency(pools.STARWARS_LANDSCAPES, 'starwars_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'sw_landscape_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'sw_landscape_atmosphere');

  return `You are a sci-fi concept-art painter writing a STAR-WARS-CODED PLANET VISTA for StarBot — a vast cinematic alien-world landscape in the George-Lucas / Ralph-McQuarrie / Doug-Chiang painted-matte tradition. NO CHARACTERS, NO PEOPLE, NO DROIDS, NO LIGHTSABERS, NO FOREGROUND SPACESHIPS — pure landscape, pure aura, pure vibe. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}

${blocks.COSMIC_CANVAS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS — NON-NEGOTIABLE ━━━
This is PURE LANDSCAPE. NO humans, NO aliens, NO droids, NO Jedi, NO stormtroopers, NO foreground spaceships. Distant silhouettes of ships at horizon scale OK. Just the empty iconic-coded world — twin-sun desert / ice plain / redwood-moon canopy / cloud-city / lava hellscape / city-planet skyscape — with all its lived-in atmosphere.

━━━ THE SCENE (render this exact landscape) ━━━
${landscape}

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

━━━ NO FRANCHISE PROPER NOUNS ━━━
NEVER write "Tatooine", "Coruscant", "Hoth", "Endor", "Naboo", "Mustafar", "Kashyyyk", "Jakku", "Kamino", "Bespin", "Jedi", "Sith", "Empire", "Rebellion", "Death Star" in the output.

━━━ COMPOSITION ━━━
Wide cinematic landscape. Lived-in dirty-future used-cosmos mood. Painted-matte feel — like a Ralph McQuarrie production-painting. Sky dominates 50-70% of the frame in atmospheric grandeur. Foreground textural detail anchors the shot. Camera high or wide — emphasizing iconic biome readability.

DRAMATIC VISUALS: render the EXACT scene above. Do NOT add characters. Do NOT shrink the scale.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
