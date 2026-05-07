/**
 * BrickBot brief composer — every path uses this.
 *
 * Inputs:
 *   pathName    — string, identifies which subject path is rendering
 *   subjectIntro — short prose describing the subject domain (e.g.,
 *                  "PIRATE adventure scenes — ships, harbors, treasure
 *                  caves, swordfights, kraken battles")
 *   sharedDNA   — { camera } from rollSharedDNA (camera is shared axis)
 *   pathPools   — { scenes, lighting, palette } pool arrays
 *   vibeDirective — engine-injected mood text (cinematic only)
 *   picker      — pickWithRecency provider
 *
 * Output: a complete Sonnet brief string. Engine polishes to ~70-100 words
 * before passing to Flux.
 */

const blocks = require('./shared-blocks');

module.exports = function composeBrief({
  pathName,
  subjectIntro,
  sharedDNA,
  pathPools,
  vibeDirective,
  picker,
}) {
  const scene = picker.pickWithRecency(pathPools.scenes, `${pathName}_scene`);
  const lighting = picker.pickWithRecency(pathPools.lighting, `${pathName}_lighting`);
  const palette = picker.pickWithRecency(pathPools.palette, `${pathName}_palette`);

  return `You are a LEGO MOC photographer writing a ${pathName.toUpperCase()} scene description for BrickBot. Output is a 70-100 word comma-separated phrase string for Flux. NO preamble, NO labels, NO bullets.

━━━ SUBJECT (this is the path's identity) ━━━
${subjectIntro}

━━━ THE SCENE ━━━
${scene}

If the scene describes minifigs, render the ACTION moment — what's happening, who's reacting. Not minifigs posing.

━━━ CAMERA AXIS (the variety knob — apply EXACTLY) ━━━
${sharedDNA.camera}

━━━ LIGHTING ━━━
${lighting}

━━━ PALETTE ━━━
${palette}

${blocks.EVERYTHING_IS_BRICK_BLOCK}

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.BRICK_DETAIL_BLOCK}

${blocks.STORY_SCENE_BLOCK}

${blocks.NO_TEMPLATE_BLOCK}

━━━ MOOD ━━━
${vibeDirective.slice(0, 200)}

━━━ OUTPUT ━━━
70-100 words. Comma-separated phrase string. Lead with the subject + scene + camera, weave the lighting + palette through, finish with the mood. NO preamble, NO ━━━ markers, NO **bold**, NO numbered output, NO "render as" trailer.`;
};
