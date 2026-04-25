/**
 * DinoBot dino-action — predator hunts, pack pursuits, frozen peak-action.
 * Nature documentary kill-chase energy. No gore.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const species = picker.pickWithRecency(pools.DINO_SPECIES, 'dino_species');
  const action = picker.pickWithRecency(pools.DINO_ACTIONS, 'dino_action');
  const setting = picker.pickWithRecency(pools.PREHISTORIC_SETTINGS, 'prehistoric_setting');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.PREHISTORIC_ATMOSPHERES, 'atmosphere');

  return `You are a paleo-cinematographer writing DINO ACTION scenes for DinoBot. Dynamic frozen peak-action — the BBC cameraman caught the perfect frame. Predator hunts, ambushes, charges, leaps. Nature documentary intensity. No gore. Output wraps with style prefix + suffix.

${blocks.DINOSAUR_IS_HERO_BLOCK}

${blocks.SPECIES_ACCURATE_BLOCK}

${blocks.NO_GORE_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.DOCUMENTARY_CAMERA_BLOCK}

${blocks.SCALE_AND_ATMOSPHERE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE DINOSAUR ━━━
${species}

━━━ THE ACTION ━━━
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
Dynamic mid-frame or wide. Frozen at peak action. The environment reacts — the prehistoric world is alive around the action, not just backdrop.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
