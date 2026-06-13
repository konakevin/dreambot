const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const useLandscape = Math.random() < 0.3;
  const scene = useLandscape
    ? picker.pickWithRecency(pools.CLAYMATION_LANDSCAPES, 'claymation_landscape')
    : picker.pickWithRecency(pools.CLAYMATION_SCENES, 'claymation_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const scenario =
    sharedDNA.renderMode === 'world'
      ? picker.pickWithRecency(pools.TOY_SCENARIOS, 'toy_scenario')
      : null;
  // bespoke story_beat pool — verb-led claymation village events
  const storyBeat = picker.pickWithRecency(pools.CLAYMATION_STORY_BEATS, 'claymation_story_beat');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a claymation stop-motion photographer writing CLAYMATION SCENES for ToyBot. Clay-everything. Wallace-Gromit / Coraline / Laika / Play-Doh energy. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ CLAYMATION MEDIUM LOCK ━━━
EVERYTHING is clay. Thumbprints visible. Paint-strokes on clay-figures. Subtle imperfections = art. Clay-eyes painted-on.

━━━ COMPOSITION LOCK — MULTI-FIGURE MANDATORY ━━━
EXACTLY 3-5 clay characters visible simultaneously in the frame, each in its own zone, each mid-verb. NO single-clay-character centered. NO solo-claymation portraits. The story is the multi-character interaction in the clay world.

━━━ THE CLAYMATION SCENE ━━━
${scene}

━━━ STORY BEAT — the EVENT this render is showing ━━━
${storyBeat}

Render every named cast role as a clay-everything stop-motion figure performing the verb-led action above.

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
Mid-close stop-motion frame. Clay-characters mid-action. Handcrafted feel. Cinematic stop-motion lighting.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
