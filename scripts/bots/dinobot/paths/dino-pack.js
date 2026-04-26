/**
 * DinoBot dino-pack — herds, flocks, pods, packs. Multi-animal compositions
 * at wildlife-documentary scale. BBC Planet Earth energy.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const species = picker.pickWithRecency(pools.DINO_SPECIES, 'dino_species');
  const action = picker.pickWithRecency(pools.PACK_DINO_ACTIONS, 'pack_dino_action');
  const setting = picker.pickWithRecency(pools.PREHISTORIC_SETTINGS, 'prehistoric_setting');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.PREHISTORIC_ATMOSPHERES, 'atmosphere');

  return `You are a BBC wildlife cinematographer writing PACK/HERD scenes for DinoBot. Massive groups of a single species moving, hunting, nesting, or migrating together. The scale is the story — dozens to hundreds of this species, stretching across the landscape. Output wraps with style prefix + suffix.

CRITICAL: READ the species below. The scene shows a GROUP of THIS species — multiple individuals of the SAME kind. Render their species-accurate anatomy across every visible animal.

${blocks.DINOSAUR_IS_HERO_BLOCK}

${blocks.SPECIES_ACCURATE_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.SCALE_AND_ATMOSPHERE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE SPECIES ━━━
${species}

━━━ THE GROUP BEHAVIOR ━━━
${action}

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
Wide epic frame. Multiple individuals at multiple distances from foreground to horizon. The herd/pack/flock DOMINATES the frame. The prehistoric landscape is lush and alive around them. Scale is everything.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
