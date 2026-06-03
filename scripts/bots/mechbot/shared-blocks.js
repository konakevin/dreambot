/**
 * MechBot — shared prose blocks.
 *
 * Cyborgs and droids: half-human half-machine beings + ornate solo robots.
 * Hyper-real cinematic 3D — Ex Machina / Alita / Blade Runner / Westworld /
 * Detroit Become Human / Ghost in the Shell aesthetic. Beautiful machinery,
 * exposed clockwork, glowing power cores, ornate mechanical detail.
 */

// 2026-06-02 cruft-audit micro-strip — dropped `hyper-detailed` (mechanical
// detail context already strong) and `hyper detailed` from suffix.
const PROMPT_PREFIX =
  'cinematic sci-fi concept art, mechanical surfaces, ornate machinery, production-art polish';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, masterpiece quality';

const SOLO_ROBOT_BLOCK = `━━━ SOLO ROBOT (robot-moment path only) ━━━

Robot-moment renders one robot only. No robot-and-human pair, no robot-gang, no multi-bot scene. Single robot in a tranquil human-moment activity (meditating / reading / watching-sunrise / tinkering / gazing).`;

const CINEMATIC_COMPOSITION_BLOCK = `━━━ CINEMATIC COMPOSITION ━━━

Framing, lighting, and depth chosen for MOVIE-SHOT quality. Wide establishing vistas, tight character moments, dramatic low-angle hero shots, impossible aerial sweeps. Every frame could be a still from a Villeneuve, Spielberg, or Cameron sci-fi epic.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  SOLO_ROBOT_BLOCK,
  CINEMATIC_COMPOSITION_BLOCK,
};
