/**
 * ToyBot board-game-world path (Stage O1, SHADOW) — function-form.
 *
 * A classic printed board game COME TO LIFE as a cinematic macro tabletop
 * diorama: the glossy illustrated board's painted spaces read as a real little
 * world that real game pieces (meeples/pawns/dice/pewter figures) adventure
 * across. SCENE = the board-world; PIECES = 1-2 game-piece cast mid-action.
 *
 * Medium: board_game_diorama (ToyBot mediumByPath + mediumStyles). Model:
 * flux-1.1-pro/ultra. Self-contained (inlines its own look); no composer.
 */

const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.TOYBOT_BOARD_GAME_SCENES, 'board_game_scene');

  const pieces = [picker.pickWithRecency(pools.TOYBOT_BOARD_GAME_PIECES, 'board_game_piece')];
  if (Math.random() < 0.45) {
    const second = picker.pickWithRecency(pools.TOYBOT_BOARD_GAME_PIECES, 'board_game_piece');
    if (second !== pieces[0]) pieces.push(second);
  }

  return `You are a macro toy photographer shooting a classic BOARD GAME come to life for ToyBot. A real printed board game on a table, photographed so its illustrated painted spaces read as a tiny WORLD that game pieces adventure across. Photoreal cinematic macro, shallow depth of field.

━━━ THE BOARD-WORLD ━━━
${scene}

━━━ THE PIECES — the little heroes crossing the board (real wood / plastic / pewter tokens, mid-action) ━━━
${pieces.map((p, i) => `${i + 1}. ${p}`).join('\n')}
The pieces are the story: something is happening on the board — a race, a stand-off, a die mid-roll. Keep them as REAL game pieces, never alive, never human.

━━━ THE MATERIAL LOOK ━━━
It is unmistakably a REAL printed board game: glossy die-cut cardboard, painted illustrated spaces with printed borders, a clear winding path/track, plus scattered set-dressing (dice, a spinner, stacked cards, a little sand-timer). The illustrated board terrain is rich and immersive but still reads as printed cardboard. Warm hobby-table lighting, tilt-shift macro, tactile printed texture in every shadow. NOT a real landscape, NOT CGI.

━━━ CAMERA + FRAMING ━━━
${sharedDNA.camera}
Frame the board as a world: a foreground piece mid-adventure, the illustrated track leading back through the painted spaces, the board's theme legible at a glance.

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

Output ONLY the 80-110 word Flux prompt, comma-separated. NO preamble, NO headers, NO ━━━ markers, NO "render as" suffixes. Start immediately with the scene description. End with: no text, no words, no letters, no watermarks, masterwork composition, hyper detailed.`;
};
