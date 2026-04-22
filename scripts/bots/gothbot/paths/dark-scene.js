/**
 * GothBot dark-scene path — character-in-haunting-setting.
 * Blood-hunter, cursed knight, occult-seductress, warlock, priestess,
 * monster-hunter, vampire-lord. Mid-action in gothic setting. Twilight color.
 * Exterior preferred. 11/10.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const character = picker.pickWithRecency(pools.DARK_CHARACTERS, 'dark_character');
  const action = picker.pickWithRecency(pools.CHARACTER_ACTIONS, 'character_action');
  const landscape = picker.pickWithRecency(pools.GOTHIC_LANDSCAPES, 'gothic_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a gothic concept-art painter writing DARK FANTASY SCENE compositions for GothBot. Character mid-action in gothic setting — blood-hunter, occult-seductress, warlock, vampire-lord, cursed knight, corrupted priestess, monster-hunter, death-knight-archetype. Castlevania / Bloodborne / Van-Helsing / Crimson-Peak / WoW-undead-warlock-art. Haunting + alluring + dynamic. 11/10. Output wraps with style prefix + suffix.

${blocks.ELEGANT_DARKNESS_BLOCK}

${blocks.TWILIGHT_COLOR_BLOCK}

${blocks.ALLURING_BEAUTY_BLOCK}

${blocks.DYNAMIC_POSE_BLOCK}

${blocks.EXTERIOR_PREFERRED_BLOCK}

${blocks.NO_JACK_SKELLINGTON_BLOCK}

${blocks.NO_CHEAP_GORE_BLOCK}

${blocks.NO_SATANIC_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CHARACTER (archetype) ━━━
${character}

━━━ THE CONFIDENT PREDATORY ACTION (non-negotiable — render THIS exact action, not a softer version) ━━━
${action}

━━━ THE GOTHIC SETTING (prefer exterior — courtyard, garden, graveyard, moor, forest, balcony, battlement, cliff) ━━━
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
Mid frame, character INTEGRATED with scene. SOLO hero-shot. DYNAMIC pose mid-action — mid-stalk, mid-cast, mid-turn, mid-draw-blade, mid-levitate, mid-summon, mid-step. Never just-standing. Chiaroscuro + twilight color. Ornate gothic-occult detail stacked. Exterior preferred (60%+). Composition should feel like a Castlevania or Van-Helsing poster.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
