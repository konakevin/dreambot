/**
 * FarmBot — morning-routine (Moment). The FEELING of morning on the farm,
 * not a specific animal or structure.
 *
 * WRITTEN POSITIVE-ONLY (2026-09-07 — see feedback_negative_prompt_leak
 * memory / shared-blocks.js header): an earlier version of this template
 * told Sonnet "do NOT add any animal, creature, figure, person, sign..."
 * and closed with "no signs, no shop signs, no chalkboards...". Direct-API
 * testing showed Sonnet echoing that exact banned-noun language into its
 * OWN generated Flux prompt ("no watermarks, no signatures" / "no text, no
 * figures, no additions") — putting the literal tokens "signatures" /
 * "figures" in front of Flux, which doesn't process negation and rendered
 * them anyway. Rewritten to name nothing it doesn't want rendered; the
 * already-clean seed pool (farmbot_morning_routine_scenes.json — verified
 * to contain zero animal/sign/figure mentions) does the real content
 * control, this template only asks Sonnet to elaborate on light/texture/
 * atmosphere/composition of exactly what the scene names.
 */

const { lookOverride } = require('../shared-blocks');

const SCENES = require('../seeds/farmbot_morning_routine_scenes.json');

module.exports = ({ sharedDNA, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'farmbot_morning_routine_scene');

  return `${lookOverride(sharedDNA && sharedDNA.lookRegister)}━━━ THE MORNING MOMENT — render precisely this ━━━
${scene}

Spend your words entirely on the LIGHT, TEXTURE, ATMOSPHERE, and
COMPOSITION of exactly what's named above. Keep the frame exactly as quiet
and sparse as the description states — every detail named above, rendered
crisply, and nothing more. The whole scene hushed and hopeful in the early
light, gallery quality`;
};
