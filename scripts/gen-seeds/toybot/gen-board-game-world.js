#!/usr/bin/env node
// ToyBot Stage O1 (SHADOW) — board-game-world. A classic printed board game
// brought to life as a cinematic macro tabletop diorama: real game pieces
// (meeples/pawns/dice/tokens) adventuring across a glossy illustrated board
// whose spaces become a little world. SCENE = the board world/setup; PIECES =
// the game-piece cast mid-adventure. MVP-25 each.
const { generatePool } = require('../../lib/seedGenHelper');

(async () => {
  await generatePool({
    outPath: 'scripts/bots/toybot/seeds/toybot_board_game_scenes.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} BOARD-GAME-WORLD scenes for ToyBot's board-game-world path. Each is a classic printed board game COME TO LIFE as a cinematic macro tabletop diorama — the glossy illustrated game board's painted spaces read as a real little WORLD that game pieces adventure across. Photoreal macro toy photography of an actual board game on a table, shallow depth of field. Each entry 20-32 words.

━━━ WHAT TO DESCRIBE ━━━
The BOARD as a world + the terrain of its painted spaces + the winding path/track + a sense of a journey across it. The pieces are supplied separately — here describe the BOARD-WORLD itself (its theme, illustrated terrain, the die-cut spaces, the path, tokens/cards/dice as set-dressing).

━━━ BOARD THEMES (spread across all ${n}) ━━━
- Candy-land sweet-world board (frosting hills, gumdrop trees, a licorice path winding to a candy castle, peppermint spaces)
- Haunted-mansion board (a spooky manor's rooms as spaces, cobweb corridors, a moonlit graveyard track, trapdoor tiles)
- Pirate treasure-island board (a painted island map, palm-tree spaces, a dotted route to an X, cardboard waves and a sea-monster tile)
- Dungeon-crawl grid board (a stone-tile grid, torch-lit corridors, monster-lair squares, a treasure-hoard tile, painted rubble)
- Snakes-and-ladders tower board (a tall painted board of numbered squares, long ladders and coiling snake-slides between them)
- Space-race board (a painted galaxy track, planet spaces, an asteroid-field detour, a rocket-launch start tile)
- Fantasy-quest map board (a rolled illustrated realm — forests, mountains, a dragon's cave, a castle finish, hex or path spaces)
- Enchanted-forest board (mushroom-ring spaces, a river-crossing track, a witch's-cottage tile, glowing-glade squares)
- Wild-west boomtown board (a dusty main-street track, saloon and jail tiles, a canyon-shortcut, a gold-mine finish)
- Underwater-kingdom board (a coral-reef track, sunken-ship tiles, a whirlpool space, a mermaid-palace finish)
- Jungle-expedition board (a vine-tangled trail, quicksand tiles, a temple-ruin space, a river-raft shortcut)
- Winter-wonderland board (a snowy path of frosted spaces, an ice-cave tile, a sled-run shortcut, a cozy-lodge finish)

━━━ THE MATERIAL LOOK ━━━
It is a REAL printed board game: glossy die-cut cardboard, painted illustrated spaces with printed borders, a clear winding path/track, plus scattered set-dressing (dice, a spinner, stacked cards, tokens, a little sand-timer). Macro tabletop photography, warm hobby-table light, shallow DOF. NOT a real landscape, NOT CGI — a photographed board game come to life.

━━━ RULES ━━━
NO humans (game pieces/figures are fine — they are the cast, supplied separately). NO readable text/numbers on spaces or cards (printing reads as decorative marks only). Keep each entry a distinct board theme + a specific illustrated terrain detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  await generatePool({
    outPath: 'scripts/bots/toybot/seeds/toybot_board_game_pieces.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} GAME-PIECE CAST snippets for ToyBot's board-game-world path — real board-game pieces mid-adventure, to be dropped onto a board-game world as the little heroes crossing it. Each 12-20 words. START WITH A PIECE + AN ACTIVE VERB so the board reads as a story in motion.

━━━ PIECE TYPES (spread across all ${n}) ━━━
Wooden meeples, plastic pawns (classic rounded tokens), painted pewter/metal figures (knight, wizard, explorer), little plastic army/animal tokens, a top-hat or thimble or boot classic token, a colored cone pawn, a die-as-character (tumbling or landing), a spinner arrow, a stack of cards fanning open. All are REAL game pieces (wood/plastic/pewter), never living things.

━━━ ACTIONS (spread across all ${n}) ━━━
- a red wooden meeple leading a little party of pawns along the winding path
- two pawns racing neck-and-neck toward the finish space
- a pewter knight figure squaring off against a painted dragon token
- a giant die tumbling across the board, pips blurring mid-roll
- a top-hat token pausing at a fork in the track, deciding
- a cone pawn teetering at the top of a ladder about to slide
- a little explorer figure planting a flag on the treasure space
- a wizard pewter piece raising its staff over a glowing tile
- a knot of colored pawns clustered at the start, ready to launch
- a lone meeple crossing a rickety bridge tile, arms out for balance
- a robot token rolling through a space-race asteroid space
- a pirate-pawn peering over a cardboard wave toward the X

━━━ RULES ━━━
The piece is the small hero moving across the board — a story beat, mid-action. Pieces are real wood/plastic/pewter game tokens, never alive, never human. NO text. Keep each a distinct piece + verb.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
