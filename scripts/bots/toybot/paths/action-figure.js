const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const useLandscape = Math.random() < 0.3;
  const battle = useLandscape
    ? picker.pickWithRecency(pools.ACTION_FIGURE_LANDSCAPES, 'action_figure_landscape')
    : picker.pickWithRecency(pools.ACTION_FIGURE_BATTLES, 'action_figure_battle');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an action-figure photographer writing ACTION FIGURE BATTLE scenes for ToyBot. 80s/90s action-figure cinematic dioramas. Joint-articulation visible + explosion effects. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ ACTION-FIGURE MEDIUM LOCK ━━━
80s/90s action-figure plastic. Joint-articulation visible at hips/shoulders. Painted details. Weathered paint OK. Explosion effects practical.

━━━ THE ACTION FIGURE BATTLE ━━━
${battle}

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
Mid-close cinematic action-figure frame. Mid-action peak-moment. Practical-set with lighting drama.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
