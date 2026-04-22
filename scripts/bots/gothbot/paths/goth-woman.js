/**
 * GothBot goth-woman path — alluring dark-beauty hero.
 * Vampire queen / succubus / blood-huntress / corrupted priestess /
 * witch-queen / occult-seductress / van-helsing-huntress. SOLO, DYNAMIC, alluring.
 * Twilight color, exterior preferred, no Maleficent-horn default.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const accessory = picker.pickWithRecency(pools.GOTH_WOMAN_ACCESSORIES, 'goth_accessory');
  const action = picker.pickWithRecency(pools.CHARACTER_ACTIONS, 'character_action');
  const landscape = picker.pickWithRecency(pools.GOTHIC_LANDSCAPES, 'gothic_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a dark-fantasy concept-art painter writing ALLURING GOTH-HELLSPAWN WOMAN scenes for GothBot. Vampire queen, succubus, corrupted priestess, blood-huntress, witch-queen, occult-seductress, van-helsing-style huntress, banshee-bride, demon-courtesan. SOLO, DYNAMIC, haunting + alluring. Twilight-colored. Exterior preferred. Output wraps with style prefix + suffix.

${blocks.ELEGANT_DARKNESS_BLOCK}

${blocks.TWILIGHT_COLOR_BLOCK}

${blocks.ALLURING_BEAUTY_BLOCK}

${blocks.DYNAMIC_POSE_BLOCK}

${blocks.EXTERIOR_PREFERRED_BLOCK}

${blocks.NO_CHEAP_GORE_BLOCK}

${blocks.NO_SATANIC_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CONFIDENT PREDATORY ACTION (non-negotiable — render THIS exact action) ━━━
${action}

━━━ THE ICONIC DARK ACCESSORY / STYLING DETAIL ━━━
${accessory}

━━━ SETTING CONTEXT (prefer exterior gothic — garden, courtyard, battlement, graveyard, moor, forest, balcony, cliff) ━━━
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

━━━ COMPOSITION ━━━
Mid-close or mid-wide DYNAMIC frame — she is mid-action (mid-stalk / mid-cast / mid-turn / mid-draw-blade / mid-levitate / mid-commanding-familiar / mid-step-onto-balcony / mid-pounce / mid-whisper-to-familiar / mid-raise-goblet). Never just-standing-there. Alluring + dangerous + magnetic. Signature styling detail prominent. No horns as default — vary the iconic feature widely. Exterior setting preferred (60% of the time). Twilight color saturating the scene.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
