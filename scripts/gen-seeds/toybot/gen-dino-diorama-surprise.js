#!/usr/bin/env node
/**
 * DINO_DIORAMA_SURPRISE — gated (55%) other-toy / unexpected whimsy
 * crashing the prehistoric clay world. A stray plastic astronaut,
 * a Hot Wheels car half-buried in mud, a green army-man crouched in
 * ferns, a wind-up tin robot, a tiny UFO on a paperclip — fun gags
 * that make the viewer grin without stealing focus from the dinos.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/dino_diorama_surprise.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SURPRISE-ELEMENT entries for ToyBot dino-diorama — one stray non-dinosaur TOY or unexpected whimsy crashing the prehistoric clay world. Each entry is one short clause, 18-30 words, naming a SPECIFIC tiny toy + its mid-action + how it fits the prehistoric scene.

━━━ THE BAR ━━━
Every entry names ONE specific tiny toy from a recognizable toy-line (plastic astronaut, green army-man, Hot Wheels car, LEGO brick, wind-up tin robot, rubber duck, toy UFO, Funko Pop, plastic cowboy, Polly Pocket, Strawberry Shortcake figure, plastic dinosaur of WRONG era like a sabretooth tiger, etc.). It is doing something — mid-stride, mid-flag-planting, mid-radio-call, half-buried, hovering, fooling no one. The gag is genuinely funny + harmless.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"a tiny plastic astronaut planting a toothpick flag on the smoldering clay volcano, helmet visor reflecting orange eruption glow"
"a green plastic army-man crouching behind a fern frond, walkie-talkie raised, clearly radioing that the T-rex situation is very bad"
"a cherry-red Hot Wheels car half-buried in clay mud, one tiny wheel still spinning optimistically near the diplodocus watering hole"
"a single yellow LEGO brick wedged among the clay boulders, bright and unmistakable, fooling absolutely nobody into thinking it belongs"
"a wind-up tin robot mid-stride through the prehistoric ferns, its little chest dial still ticking, completely unbothered by nearby raptors"
"a rubber duck bobbing serenely in the glossy clay tar pit, expression cheerful, utterly unaware of the fossils forming beneath it"

━━━ VARIETY MANDATE (distribute across these surprise categories) ━━━
- ~3 ASTRONAUT / SPACE TOY (plastic astronaut planting flag / spaceman riding tricep / mini moon-lander / tiny rocket / NASA-coded extra)
- ~3 ARMY / SOLDIER TOY (green army-man crouching / plastic soldier with rifle / parachutist tangled in fern / mini tank stuck in clay)
- ~3 VEHICLE TOY (Hot Wheels car half-buried / Matchbox truck mid-drive / Tonka dump-truck spilling pebbles / mini submarine in tar pit)
- ~2 ROBOT / SCI-FI TOY (wind-up tin robot / Funko Pop droid / tiny silver UFO on paperclip / plastic alien)
- ~2 LEGO / BRICK PIECE (single yellow brick / minifig hand peeking out / loose Lego antenna)
- ~2 CARTOON / GIRL'S TOY (Polly Pocket figure / Strawberry Shortcake / My Little Pony pony / Barbie shoe lying around)
- ~2 WATER / BATH TOY (rubber duck bobbing / plastic fish / wind-up tugboat in tar pit / floating mini swimmer)
- ~2 COWBOY / WESTERN / KNIGHT TOY (plastic cowboy with lasso / tin knight / plastic Indian-style brave / medieval soldier with sword)
- ~2 WRONG-ERA ANIMAL (toy sabretooth tiger sneaking in / plastic woolly mammoth / fake-fur ape / wind-up shark)
- ~1 BOARD-GAME PIECE (Monopoly thimble / plastic pawn / chess knight standing guard)
- ~1 CARTOON CHARACTER FIGURE (Smurf / Snorks / Funko Pop / vintage Disney figure)
- ~1 OFFICE / KITCHEN ITEM AS GAG (paperclip arch / plastic spork / rubber-band tumbleweed / push-pin marker)

━━━ BANS ━━━
- NO real living humans — toys only.
- NO actual dinosaur figures (the dinos are in another pool — this is the WRONG-toy gag).
- NO modern photoreal objects (this is a TOY gag, not a real item).
- NO bare "a toy appears" — name the SPECIFIC toy + its action + the placement.
- NO entries that steal focus from the dinos (keep it small, peripheral, background).
- NO mean / scary / unsafe gags — keep them genuinely funny + harmless.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
