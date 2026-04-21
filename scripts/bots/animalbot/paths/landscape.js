/**
 * AnimalBot landscape path — single animal as scale element in vast setting.
 * The animal is small in frame but still the emotional hero.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const animal = picker.pickWithRecency(pools.LAND_ANIMALS, 'animal');
  const context = picker.pickWithRecency(pools.LANDSCAPE_CONTEXTS, 'landscape_context');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an epic-landscape wildlife photographer writing ANIMAL-IN-VAST-LANDSCAPE scenes for AnimalBot. A single animal sits small as scale element inside a breathtaking setting — BUT the animal remains the emotional hero of the frame. The setting is dramatic; the animal earns the viewer's eye. Output wraps with style prefix + suffix.

${blocks.ANIMAL_IS_HERO_BLOCK}

${blocks.IMPOSSIBLE_CLARITY_BLOCK}

${blocks.SOLO_ANIMAL_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.NO_MARINE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE ANIMAL (hero — small in frame but composition pulls eye here) ━━━
${animal}

━━━ THE LANDSCAPE CONTEXT ━━━
${context}

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
Wide vista with animal placed for maximum emotional impact — rule-of-thirds, foreground animal + vast distance, or animal on ridgeline silhouetted. The setting is massive and stunning. The animal is small but unmistakably THE subject — light, color, and composition guide the eye there.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
