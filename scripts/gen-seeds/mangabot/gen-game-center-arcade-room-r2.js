#!/usr/bin/env node
/**
 * MangaBot game-center-arcade — ROUND 2 regeneration of the HERO room pool.
 * ONE VARIABLE: extend DELETE-AND-FILL from the near machine to THE WHOLE BANK.
 *
 * WHY (measured, round 1, 6 renders):
 *   Gibberish lettering appeared in 5 of 6 renders while the emitted prompts
 *   carried ZERO text nouns from any of this path's own layers — every regex
 *   hit was a false positive (the bot-wide suffix "no text no words", and the
 *   look-register entry's own "retro screen-print… vintage anime-poster
 *   finish"). So the lettering is 100% UNPROMPTED BACKFILL, which is playbook
 *   lesson 26, and the surface class it landed on is identifiable from the
 *   renders: the BACKGROUND BANK's machine fronts and their upper panels.
 *
 *   Round 1's room entries named the bank only as mass and angle — "a bank of
 *   tall machines crossing the picture, their fronts turned obliquely". The
 *   near machine's own axis fills every one of its surfaces and came back
 *   CLEAN 6 of 6. The bank's fronts were named and never filled, so each one
 *   was a blank upright rectangle, and Flux filled all of them with lit
 *   graphic faces carrying pseudo-kanji.
 *
 *   That is exactly lesson 27's composed rule, one level out: deleting the
 *   sign-shaped noun is not enough, you must FILL the space it left with a
 *   positive object that is not sign-shaped. Round 1 filled it for one machine
 *   and left twenty behind it empty.
 *
 * WHAT CHANGED, and nothing else: a BANK-FILL LAW added to the recipe, every
 *   entry now required to say what the machines BEHIND the near one carry on
 *   their fronts and above their glass. Every other clause — the crosswise
 *   law, the two enclosing surfaces, the polished floor, the charm detail, the
 *   axis discipline, the bans — is carried over verbatim from
 *   gen-game-center-arcade-pools.js so the round isolates one variable.
 *
 * Run: node scripts/gen-seeds/mangabot/gen-game-center-arcade-room-r2.js
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/mangabot/seeds/';

const COMMON_BANS = `HARD BANS (every entry):
- NO READABLE TEXT AND NO TEXT-SHAPED OBJECT ANYWHERE. Never a letter, a digit, a number, a word, a name, a kanji, a written character, a symbol, an arrow, a logo, a brand, a price, a menu, a label, a sticker, a poster, a banner, a notice, a sign, a signboard, a nameplate, a ticket, a score, a readout, a chart, a whiteboard, a printed box, a printed card or a printed wrapper.
- NO SCREEN NOUNS. Never a screen, a monitor, a display, a lit face, a lit panel, a video image, a picture on glass. A machine's glowing front is only ever mentioned as EDGE-ON, at a RAKING angle, seen FROM BEHIND, or out of frame with only its coloured light in the picture.
- NO EMPTY FLAT BAND and NO BLANK UPRIGHT RECTANGLE ANYWHERE IN THE PICTURE. Wherever a flat strip or a flat top or a machine front would sit, it is FULL of real round or soft things instead.
- NO FLAT SURFACE SQUARED TO THE VIEWER. Never "in flat blocks of colour" and never a flat panel facing us — a large flat flank is always RAKING away from us and GLOSSY, giving the room's colour back.
- JARGON BANNED (a layperson reads these as a different object): never "crane", never "UFO catcher", never "cabinet", never "marquee", never "pod", never "gachapon", never "purikura", never "pusher". Say "machine", "chrome claw on a cable inside the glass", "clear plastic capsules", "curtained booth".
- NO SIMILE AND NO METAPHOR. Never "like a", never "shaped like", and never borrow an adjective from another object.
- NO LIGHT DESCRIBED AS A SOLID: never a column, pillar, wall, tower, bar, ribbon, sheet or beam of light. Light is a glow, a patch, a pool, a wash, a rim, a spill, a sheen or a reflection landing on a real surface.
- NO DETAIL EXEMPTIONS. Never "the nearest one shown in detail" or "detail on the front one or two".
- NO named anime, studio, film, character or real brand in the output.
- NO photoreal, NO 3D, NO Western-cartoon wording. This is 2D anime art.
- NO even counts of like things (never two lamps, four plush, six coins) — use an odd count and set one member apart.`;

(async () => {
  await generatePool({
    outPath: DIR + 'game_center_arcade_room.json',
    total: 25,
    batch: 25,
    append: false,
    maxTokens: 8000,
    metaPrompt: (
      n
    ) => `You are writing ${n} HERO-ROOM descriptions for MangaBot's game-center-arcade path — the inside of a Japanese game centre at night, drawn as anime. This is the HERO axis: the room itself, its bank of machines, its floor and the surfaces that close it in.

Each entry: 34-48 words, two or three short sentences.

THE FORMAT IS LOAD-BEARING — every entry MUST OPEN with the bank of machines and its own mass, then build the room around it. Example openings: "A bank of tall machines crossing the picture from edge to edge, their fronts turned obliquely, and above them...", "A run of waist-high machines with glass tops sweeping across the frame, and behind them a wall of...". If an entry opens with anything other than the machines, it is wrong — the first-named noun becomes the hero and the room would vanish.

★ THE BANK-FILL LAW — THIS IS THE MOST IMPORTANT CLAUSE IN THE ENTRY AND IT IS NEW. Do not describe the bank as bare mass and angle. EVERY machine in the run, not merely the nearest, is FULL, and every entry must say what the ones BEHIND the near machine carry. Pick two or three of these per entry and name them as belonging to the whole run:
- glass fronts heaped full of soft toys pressing outward against the panes all down the row
- clear domes crowded with capsules, one behind another down the whole run
- a chrome claw hanging on a cable inside every glass
- rows of round coloured buttons and ball-topped levers along every sloped ledge
- a row of round bulbs above each machine's glass, repeating away down the run
- soft toys hung by their loops from a bar above every machine
- small soft toys crowded along the top of each machine in the run
Then state the consequence plainly, in the entry's own words: the whole run reads as glass, fur, chrome and round bulbs, and NOT ONE machine anywhere in the picture is a bare upright rectangle or shows a flat lit front turned toward us. Every front in the run is raked away from us and glossy. This clause is what stops the render inventing pseudo-writing on the machines at the back, so it must be in every single entry.

THE CROSSWISE LAW IS MANDATORY IN EVERY ENTRY. The machine bank CROSSES the picture from one side edge to the other, its fronts turned obliquely to us, and both of its ends run out of frame. One machine stands NEAR and LARGE. There is never an aisle running away up the middle of the picture toward a distant point, never a row of identical machines shrinking to a vanishing point, and nothing ever converges on a single shared point. State the crosswise fact in the entry itself.

THE ROOM MUST CLOSE THE FRAME — mandatory, and it is what stops the render coming back as machines floating in a void. Every entry names at least TWO enclosing surfaces: a low ceiling close overhead (its open cable trays, its ducting, its run of bulbs, its hanging soft toys, its swagged paper streamers, its grid of tiles with one panel replaced), and something closing the frame down a side (the flank of another machine raking away, a mirrored column, a wall of prize shelves crowded with plush, a heavy curtain on a booth, a low rail, a stack of plastic stools).

THE FLOOR IS ALWAYS DARK AND POLISHED AND GIVES EVERYTHING BACK — say so in the entry. A wet patch inside the entrance, a mopped sheen, a polished dark floor doubling every colour in the room, a puddle of melt by the doors with the colours standing in it. Never a patterned carpet, never a plain matte floor.

THE BAR — a dim, tidy, tasteful arcade is a FAILURE even when it is clean. Every entry must be VIVID: saturated committed colour against near-black, glass and chrome everywhere giving light back, the room dense and lived-in and slightly crowded. Show a viewer somewhere they have never been, or the familiar arcade redressed as something far more interesting. Playful and adventurous, never sober.

VARIETY MANDATE — one distinct room per entry, spread across all of these:
- a long low hall of glass-topped machines with a mirrored pillar in the middle of the run
- a narrow upper floor with a stair head coming up through it and a rail around the opening
- a corner where two ranks of tall machines meet at an angle with a worn turning-space between them
- a wall of prize shelves crowded with soft toys facing a rank of glass-fronted machines
- a basement floor with a low concrete ceiling and pipes crossing it close overhead
- a ground floor open to the street, its glass doors standing wide with wet pavement beyond
- an alcove of low machines with a run of small stools pulled up along them
- a floor divided by a shoulder-high partition with plush crowded along its top
- a bank of machines set against a mirrored wall that doubles the whole room
- a room with a change counter along one side and a stack of crates behind it
- a corridor of glass-topped machines with a curtained booth at its far end
- a floor with a lit prize shelf running its whole length at chest height
- a mezzanine looking down over the floor below through a glass balustrade
- a room whose ceiling is entirely soft toys hung in rows from a grid
- a floor of tall machines with a wide wet entrance mat at the near side
- an end bay with a bank of capsule machines, their clear domes crowded with capsules
- a quiet back row of older machines with a mop and bucket left between two of them
- a floor with a fat ventilation duct running the length of the ceiling and a fan turning in it
- a room with a row of machines along a window wall, the night street beyond the glass
- a wide floor with a knot of machines in a cluster at its centre and clear space around it
- an upper landing with a vending machine standing alone at one end
- a bank of machines under a sagging run of paper streamers left from some event
- a narrow floor with a low bench down its middle and machines on both sides
- a floor where one machine sits dark and unplugged in the middle of a bright row
- a room with a wide low step dividing two levels of machines

ONE CHARM DETAIL PER ENTRY — a clever small thing the eye finds on second look, belonging to the ROOM: a machine pulled out from the wall with its back open and cables spilling, one ceiling panel replaced with a clear one, a stool with a folded coat over it, a plush wedged between two machines where it fell, a worn bright patch in the floor where feet have stood, a fat cable taped down across the floor, a fire extinguisher bracket with a soft toy sitting on it, one machine wearing a dust sheet, a mop leaning against a machine.

AXIS DISCIPLINE — the ROOM ONLY:
- NO light sources and NO colour named as a palette. Say the floor is dark and polished and gives colour back, and say glass and chrome are everywhere, but a separate axis owns every light source and the whole palette. Do not name a colour.
- NO description of what is inside any single machine beyond the bank-fill law above (a separate axis owns the near machine in detail, and another owns the prizes).
- NO people, NO figures, NO hands, NO faces, NO animals — separate axes own those.
- NO camera or framing language, NO lens, NO shot, NO angle-of-view words. Say the bank is turned obliquely; say nothing about where a camera stands.
- NO outdoor weather, NO sky, NO daylight of any kind. It is night and we are indoors.

${COMMON_BANS}

Return ONLY a valid JSON array of ${n} strings. No preamble, no commentary.`,
  });
  console.log('\n✅ arcade_room regenerated with the BANK-FILL LAW (round 2, one variable).');
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
