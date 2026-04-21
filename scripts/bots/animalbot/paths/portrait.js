/**
 * AnimalBot portrait path — extreme macro closeup of ONE animal.
 * Razor-sharp detail, impossible clarity. Eyes, fur, feathers, scales fill
 * the frame.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const animal = picker.pickWithRecency(pools.LAND_ANIMALS, 'animal');
  const framing = picker.pickWithRecency(pools.PORTRAIT_FRAMINGS, 'portrait_framing');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a wildlife portrait photographer writing EXTREME MACRO WILDLIFE PORTRAITS for AnimalBot. Single animal, razor-sharp detail, impossible clarity. The animal fills the frame. Output wraps with style prefix + suffix.

${blocks.ANIMAL_IS_HERO_BLOCK}

${blocks.IMPOSSIBLE_CLARITY_BLOCK}

${blocks.SOLO_ANIMAL_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.NO_MARINE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE ANIMAL (hero subject) ━━━
${animal}

━━━ FRAMING STRATEGY ━━━
${framing}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.DRAMATIC_LIGHTING_BLOCK}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Tight or extreme-close macro. Animal fills or nearly fills frame. Razor-sharp fur / feather / scale detail. Eyes luminous with environment reflection. Background soft but atmospheric — narrow depth-of-field.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
