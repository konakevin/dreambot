const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const isFemale = Math.random() < 0.5;
  const character = isFemale
    ? picker.pickWithRecency(pools.FEMALE_WARRIORS, 'female_warrior')
    : picker.pickWithRecency(pools.MALE_WARRIORS, 'male_warrior');
  const action = picker.pickWithRecency(pools.WARRIOR_ACTIONS, 'warrior_action');
  const landscape = picker.pickWithRecency(pools.FANTASY_LANDSCAPES, 'fantasy_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a fantasy concept-art painter writing BATTLE MOMENT scenes for DragonBot — a single warrior frozen at the peak of combat in a jaw-dropping high-fantasy landscape. Same universe as our dragons and vast landscapes. The action is explosive but the world is equally breathtaking. Output wraps with style prefix + suffix.

${blocks.EPIC_FANTASY_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ SOLO CHARACTER ONLY ━━━
ONE character mid-combat. No visible enemies — the threat is off-frame or implied. This warrior fights ALONE.

━━━ THE WARRIOR ━━━
${character}

━━━ THE ACTION (frozen at peak intensity) ━━━
${action}

━━━ THE LANDSCAPE ━━━
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
Dynamic freeze-frame at the peak of action. The warrior is mid-motion — muscles tensed, weapon committed, body fully engaged. Hair and cloth whip with momentum. The landscape is vast and dramatic behind the action. NOT a static pose — this is the split-second before impact, the apex of a leap, the moment of release. Low angle, dramatic perspective, motion implied through body position and environmental reaction (dust, debris, sparks, wind).

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
