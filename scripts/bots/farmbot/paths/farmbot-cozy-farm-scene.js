/**
 * FarmBot — cozy-farm-scene (first path, MVP).
 *
 * Kevin (2026-09-07): FarmBot's whole identity — a mashup of Hay Day-style
 * farm-sim content (shop stands, decorations, farmhouses, deliveries) and
 * cozy "iyashikei" slice-of-life anime farm content, rendered through a
 * bot-wide LOOK REGISTER that deliberately spans multiple media families
 * (chibi 3D-CGI, kawaii illustration, anime) rather than one coherent
 * register — a departure from every other "Medium Looks" bot on purpose,
 * because FarmBot has no "serious" paths a proportion-shift could wreck.
 *
 * Subject matter is ONE blended pool, not two categories — any entry can
 * lean gamey-Hay-Day, pure slice-of-life-anime, or both.
 */

const { lookOverride } = require('../shared-blocks');

const SCENES = require('../seeds/farmbot-cozy-farm-scene_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_scene');

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE SCENE ━━━
${scene}

render every detail named above crisply, the scene warm and inviting under
soft golden or morning light, no text, no words, no watermarks, gallery
quality`;
};
