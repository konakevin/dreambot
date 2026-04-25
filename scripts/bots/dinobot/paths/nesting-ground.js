/**
 * DinoBot nesting-ground — parents, eggs, hatchlings. Tender prehistoric
 * family moments. The warm side of dinosaur life.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const nest = picker.pickWithRecency(pools.NESTING_SCENES, 'nesting_scene');
  const setting = picker.pickWithRecency(pools.PREHISTORIC_SETTINGS, 'prehistoric_setting');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.PREHISTORIC_ATMOSPHERES, 'atmosphere');

  return `You are a wildlife documentary cinematographer writing NESTING GROUND scenes for DinoBot. The full spectrum of dinosaur family life — not just eggs in a nest. Parents teaching juveniles to forage, hatchlings adventuring away from the nest, siblings play-fighting, family groups migrating together, parents defending young from threats, juveniles discovering water for the first time, communal nurseries with multiple families. These are ANIMALS with complex family behavior, not just egg-sitters. Output wraps with style prefix + suffix.

${blocks.DINOSAUR_IS_HERO_BLOCK}

${blocks.SPECIES_ACCURATE_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.DOCUMENTARY_CAMERA_BLOCK}

${blocks.ENVIRONMENT_STORYTELLING_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE NESTING SCENE ━━━
${nest}

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
Varied framing — close-up of a hatchling exploring, wide shot of a family on the move, mid-shot of juveniles roughhousing. The ACTIVITY is the subject, not just standing near eggs. Lush prehistoric world around them.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
