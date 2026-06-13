const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const useLandscape = Math.random() < 0.3;
  const scene = useLandscape
    ? picker.pickWithRecency(pools.SACKBOY_LANDSCAPES, 'sackboy_landscape')
    : picker.pickWithRecency(pools.SACKBOY_SCENES, 'sackboy_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const scenario =
    sharedDNA.renderMode === 'world'
      ? picker.pickWithRecency(pools.TOY_SCENARIOS, 'toy_scenario')
      : null;
  // story_beat — different TOY_SCENARIOS pick than scenario.
  const storyBeat = picker.pickWithRecency(pools.TOY_SCENARIOS, 'sackboy_story_beat');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a fabric-world photographer writing SACKBOY/STITCHED scenes for ToyBot. LBP-style fabric world with stitched Sackboy-style characters. Everything fabric/felt/yarn/paper/cardboard. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ STITCHED MEDIUM LOCK ━━━
EVERYTHING fabric / felt / yarn / paper / cardboard. Visible stitching. Button-eyes. Yarn-hair. Seam-lines visible. LBP aesthetic.

━━━ COMPOSITION LOCK — MULTI-FIGURE MANDATORY ━━━
EXACTLY 3-5 stitched-fabric LBP-style characters visible simultaneously in the frame, each occupying its own zone, each mid-action. NO single hero centered. The story is the multi-character interaction in the fabric-world.

━━━ THE SACKBOY SCENE ━━━
${scene}

━━━ STORY BEAT — the EVENT this render is showing ━━━
${storyBeat}

The scene above sets the SETTING; this story beat is the SPECIFIC moment — multiple stitched LBP-style characters mid-verb reacting to a shared prop/event. Recast every named character as a Sackboy-style stitched-fabric figure.

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
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
Mid-close LBP-diorama frame. Stitched character + fabric-world. Mid-action. Cinematic stop-motion lighting.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
