const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const useLandscape = Math.random() < 0.3;
  const battle = useLandscape
    ? picker.pickWithRecency(pools.COLLECTOR_SHELF_LANDSCAPES, 'collector_shelf_landscape')
    : picker.pickWithRecency(pools.COLLECTOR_SHELF_SCENES, 'collector_shelf_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const scenario =
    sharedDNA.renderMode === 'world'
      ? picker.pickWithRecency(pools.TOY_SCENARIOS, 'toy_scenario')
      : null;
  // story_beat — different TOY_SCENARIOS pick, fires every render.
  const storyBeat = picker.pickWithRecency(pools.TOY_SCENARIOS, 'collector_shelf_story_beat');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an action-figure photographer writing ACTION FIGURE BATTLE scenes for ToyBot. 80s/90s action-figure cinematic dioramas. Joint-articulation visible + explosion effects. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

${blocks.ACTION_FIGURE_ANTI_HUMAN_LEAK_BLOCK}

━━━ ACTION-FIGURE MEDIUM LOCK ━━━
80s/90s action-figure plastic. Joint-articulation visible at hips/shoulders. Painted details. Weathered paint OK. Explosion effects practical.

━━━ COMPOSITION LOCK — MULTI-FIGURE MANDATORY ━━━
EXACTLY 3-5 action figures visible simultaneously in the frame, each occupying its own zone, each mid-battle-or-action verb. NO single hero figure centered. NO solo-figure hero shots. The story is the multi-figure clash or team-up.

━━━ THE ACTION FIGURE BATTLE ━━━
${battle}

━━━ STORY BEAT — the ACTION MOMENT this render is showing ━━━
${storyBeat}

The battle above sets the SETTING; this story beat is the SPECIFIC EVENT — multiple action figures mid-verb reacting to a shared prop/threat/objective. Recast every named character as a 1/12-scale articulated action figure.

${blocks.STORY_BEAT_MANDATE_BLOCK}

${blocks.worldStagingSection({ renderMode: sharedDNA.renderMode, scenario, staging: sharedDNA.staging })}
━━━ CAMERA FRAMING — VARY THE ZOOM ━━━
${sharedDNA.camera}

${blocks.storyCastSection(sharedDNA.renderMode)}



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
