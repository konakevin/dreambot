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

// gpt-image-2 medium directive (routed via mediumByModel in index.js).
// GPT-Image-2 reads the bot's normal mediums + "concept art" /
// "production-art polish" anchors as "go full abstract plate" and drops
// the actual mech / cyborg subject. Positive-only, no name-drops, no
// negation cascade. Mirrors mystical-mermaid b0776fb9.
const GPT_CLEAN =
  'Cinematic mech illustration, clean editorial-poster render with clearly readable mechanical detail and recognizable machinery, polished metal palette with atmospheric depth, ornate-industrial sci-fi register';

const SOLO_ROBOT_BLOCK = `━━━ SOLO ROBOT (robot-moment path only) ━━━

Robot-moment renders one robot only. No robot-and-human pair, no robot-gang, no multi-bot scene. Single robot in a tranquil human-moment activity (meditating / reading / watching-sunrise / tinkering / gazing).`;

const CINEMATIC_COMPOSITION_BLOCK = `━━━ CINEMATIC COMPOSITION ━━━

Framing, lighting, and depth chosen for MOVIE-SHOT quality. Wide establishing vistas, tight character moments, dramatic low-angle hero shots, impossible aerial sweeps. Every frame could be a still from a Villeneuve, Spielberg, or Cameron sci-fi epic.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  GPT_CLEAN,
  SOLO_ROBOT_BLOCK,
  CINEMATIC_COMPOSITION_BLOCK,
};
