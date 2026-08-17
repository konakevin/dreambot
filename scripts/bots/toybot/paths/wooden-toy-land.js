/**
 * ToyBot wooden-toy-land path (Stage O2, SHADOW) — function-form.
 *
 * A warm handcrafted world built entirely from HEIRLOOM WOODEN TOYS (Waldorf /
 * Grimm's / Ostheimer / Brio): hand-carved and painted solid-wood pieces in a
 * cozy wooden diorama. SCENE = the wooden world; PIECES = 1-2 wooden-toy cast.
 *
 * Medium: wooden_toy_diorama. Model: flux-1.1-pro/ultra. Self-contained.
 */

const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.TOYBOT_WOODEN_TOY_SCENES, 'wooden_toy_scene');

  const pieces = [picker.pickWithRecency(pools.TOYBOT_WOODEN_TOY_PIECES, 'wooden_toy_piece')];
  if (Math.random() < 0.45) {
    const second = picker.pickWithRecency(pools.TOYBOT_WOODEN_TOY_PIECES, 'wooden_toy_piece');
    if (second !== pieces[0]) pieces.push(second);
  }

  return `You are a cozy macro toy photographer shooting a world made entirely of HEIRLOOM WOODEN TOYS for ToyBot. A real hand-carved wooden-toy diorama on a table, photographed warm and tactile. Waldorf / Grimm's / Ostheimer / Brio heirloom-wooden-toy tradition. Photoreal cinematic macro, shallow depth of field.

━━━ THE WOODEN WORLD ━━━
${scene}

━━━ THE WOODEN TOYS — the gentle life of the scene (real carved painted wood, mid-action) ━━━
${pieces.map((p, i) => `${i + 1}. ${p}`).join('\n')}
Something quietly happening — a toy rolling, a peg-figure at work, animals filing along. Keep everything as REAL carved painted wood with visible grain, never alive, never human (peg-figures are carved wood).

━━━ THE MATERIAL LOOK ━━━
EVERYTHING is hand-carved painted solid wood: visible woodgrain, turned-lathe rounded forms, soft matte painted color, gently rounded child-safe edges, occasional natural unpainted beech or maple, tiny tool-marks. Cozy hobby-table lighting, warm natural wood tones, tilt-shift macro, tactile wood texture in every shadow. NOT plastic, NOT CGI — real heirloom wooden toys.

━━━ CAMERA + FRAMING ━━━
${sharedDNA.camera}
Frame the wooden world with depth: a foreground carved detail, the little wooden world behind it, warm and inviting.

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

Output ONLY the 80-110 word Flux prompt, comma-separated. NO preamble, NO headers, NO ━━━ markers, NO "render as" suffixes. Start immediately with the scene description. End with: no text, no words, no letters, no watermarks, masterwork composition, hyper detailed.`;
};
