const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const cast = picker.pickWithRecency(pools.VINYL_FUNKO_CAST, 'vinyl_funko_cast');
  const scenario = picker.pickWithRecency(pools.TOY_SCENARIOS, 'toy_scenario');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a Funko Pop slice-of-life photographer writing FUNKO POP SCENES for ToyBot. The vinyl path is now a feed of multi-character Funko Pop figures living everyday lives in the real world at their tiny scale — grocery shopping, park hangs, sandbox play, tree climbing, beach trips, coffee shops, library reading, beach bonfires, road trips. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ FUNKO POP MEDIUM LOCK ━━━
EVERY figure is a Funko Pop vinyl figure: signature oversized SQUARE head (the big "Pop" cube proportions), small stocky body, tiny legs, glossy matte vinyl finish, large round dot eyes (sometimes with tiny pupils, no expressions beyond stylized), no nose or mouth (or simple printed mouth), printed costume / fur / accessories, mass-produced collectible toy aesthetic. Animals, humans, monsters, robots, fantasy creatures — ALL rendered in the unmistakable Funko Pop visual language. This is collectible vinyl Funko Pop photography, NOT generic designer toy or boutique vinyl. Multiple Funko Pops in the scene, NEVER solo hero.

━━━ THE FUNKO POP CAST (the WHO) ━━━
${cast}

━━━ THE SCENARIO (the WHAT — multi-character story moment, real-world setting) ━━━
${scenario}

Combine the cast above with the scenario above into a single scene. The Funko Pops are the figures performing the scenario.

━━━ REAL-WORLD STAGING — TOY LIVING IN OUR WORLD AT ITS SCALE ━━━
${sharedDNA.staging}

${blocks.REAL_WORLD_STAGING_BLOCK}

━━━ CAMERA FRAMING — VARY THE ZOOM (no more single-character portraits) ━━━
${sharedDNA.camera}

${blocks.STORY_AND_CAST_BLOCK}



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
Mid-close themed diorama. Vinyl figure heroic-posed. Cinematic lighting on glossy surface.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
