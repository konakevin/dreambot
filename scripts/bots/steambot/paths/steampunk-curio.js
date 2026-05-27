/**
 * SteamBot steampunk-curio — declarative composer form.
 *
 * A single clockwork AUTOMATON (a brass mechanical creature) as the hero,
 * AT REST in an immersive lived-in Victorian-industrial SETTING (workshop /
 * conservatory / library / observatory / atelier / airship interior). Cabinet-
 * of-curiosities energy, but the curio lives in a steampunk room — NOT a museum
 * display, NOT out in nature. NO PRIMARY HUMAN FIGURE.
 *
 * REPAIRED 2026-05-27: the 2026-05-15 "animate-creature-caught-mid-motion"
 * design rendered broken REAL animals (live-animal mimic + mandatory dynamic
 * pose). Fix: the `curio` pool is now sanitized to STILL, clearly-mechanical
 * automatons at rest (scripts/sanitize-merge-curio-pool.js → STEAMPUNK_CURIOS),
 * and the template drops the motion/alive mandates. See
 * BOT_SCENE_QUALITY_PLAYBOOK.md → SteamBot lessons.
 *
 * 5-axis split: 3 path-bespoke (curio / habitat / ornate_flourish pickN:3)
 * + 2 universal (lighting / atmosphere).
 */

module.exports = {
  archetype: 'STEAMBOT_STEAMPUNK_CURIO',
  pools: {
    curio: 'STEAMPUNK_CURIOS',
    habitat: 'STEAMPUNK_CURIO_HABITAT',
    ornate_flourish: 'STEAMPUNK_CURIO_ORNATE_FLOURISH',
  },
};
