#!/usr/bin/env node
/**
 * MangaBot game-center-arcade — bespoke axis pools (2026-09-23, SHADOW).
 *
 * A JAPANESE GAME CENTRE AT NIGHT, drawn as anime. The room is the hero: a
 * bank of machines crossing the picture, a mound of plush behind glass, a
 * chrome claw stopped mid-drop, columns of clear capsules, saturated neon
 * against near-black and a polished floor giving all of it back doubled.
 * Register anchors (recipe only, never written into output): the game-centre
 * episodes of a 90s slice-of-life OVA, Trigger's neon interiors, the arcade
 * scenes in a Shinkai city film.
 *
 * ⚠️ THIS IS THE HIGHEST TEXT-RISK SUBJECT ON THE BOT. An arcade is made of
 * screens, marquees, price plates, score readouts, banners and packaging —
 * every one of them a lettering magnet whose SHAPE is itself a text prior.
 * Playbook lesson 12 says such a surface cannot be worded safely, only
 * DELETED; lesson 27 (measured on this very bot, on onsen-evening) says a
 * deletion leaves an ABSENCE and an absence gets BACKFILLED. So the whole
 * pool set is built on the composed rule DELETE **AND** FILL, plus lesson 36's
 * POSITION-COLOUR-COUNT LAW (which held 0 text in 26 renders on a star chart):
 *
 *   - Every glowing face is EDGE-ON, RAKING, seen FROM BEHIND, or out of frame
 *     and present only as coloured light landing on faces, floor and chrome.
 *   - A machine is identified by its PRIZE MOUND, its CHROME CLAW, its rows of
 *     round coloured BUTTONS, its ball-topped LEVERS, its CAPSULE COLUMNS —
 *     never by a lit face.
 *   - Information is shown ONLY as the POSITION, COLOUR or COUNT of real
 *     objects: three of nine round lamps lit, four rubber footplate panels each
 *     a different colour, three coins stacked on a ledge, a row of bulbs.
 *   - Every flat band, top and panel is FULL of a round or soft physical thing
 *     and is never flat and never rectangular to camera.
 *   - Every large flat flank is RAKING and REFLECTIVE, so it cannot hold text.
 *
 * JARGON AUDIT (lesson 28 — a domain's own correct word can be a confident
 * wrong prior). Banned in every recipe, with the layperson's reading:
 *   crane        → a construction crane / a bird (and MangaBot's onsen path
 *                  already paints crane birds). Use "chrome claw ... on a
 *                  cable inside the glass".
 *   UFO catcher  → a flying saucer. Deleted outright.
 *   cabinet      → a kitchen cabinet. The head noun is always "machine".
 *   marquee      → a theatre marquee / a tent, AND it is a signboard. Deleted.
 *   pod          → a seed pod. Deleted.
 *   gachapon     → no layperson prior at all. Use "clear plastic capsules".
 *   ticket/score → printed objects. Deleted; replaced by lit-lamp counts.
 *
 * 6 Sonnet-generated pools at MVP-25. The 7th axis — `camera` — is
 * HAND-AUTHORED (scripts/bots/mangabot/seeds/game_center_arcade_camera.json)
 * per the standing law that a generated camera pool leaks time-of-day, hero
 * type and posture verbs, and that ONE axial/plan-view entry is a hard-fail
 * generator that out-votes every mandate in a template. On THIS path an axial
 * entry is doubly fatal: a row of machines shot down its own axis is the
 * receding-corridor generator of lessons 17/24, with the subject tiled to the
 * vanishing point.
 *
 * Run: node scripts/gen-seeds/mangabot/gen-game-center-arcade-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');
const DIR = 'scripts/bots/mangabot/seeds/';

// Repeated in every recipe — the traps this path is built against.
const COMMON_BANS = `HARD BANS (every entry):
- NO READABLE TEXT AND NO TEXT-SHAPED OBJECT ANYWHERE. Never a letter, a digit, a number, a word, a name, a kanji, a written character, a symbol, an arrow, a logo, a brand, a price, a menu, a label, a sticker, a poster, a banner, a notice, a sign, a signboard, a nameplate, a ticket, a score, a readout, a chart, a whiteboard, a printed box, a printed card or a printed wrapper.
- NO SCREEN NOUNS. Never a screen, a monitor, a display, a lit face, a lit panel, a video image, a picture on glass. A machine's glowing front is only ever mentioned as EDGE-ON, at a RAKING angle, seen FROM BEHIND, or out of frame with only its coloured light in the picture — and preferably not mentioned at all, because what identifies a machine here is its prizes, its chrome claw, its buttons, its levers and its capsule columns.
- NO EMPTY FLAT BAND. Wherever a flat strip or a flat top would sit on a machine, a shelf, a doorway or a wall, it is FULL of real round or soft things instead — a row of round coloured bulbs, plush hung by their loops from a bar, small soft toys crowded along it, a coiled cable on a hook, a rotating beacon lamp, a bunch of balloons, a stack of plastic stools, a potted plant. Nothing up there is ever flat and never rectangular.
- NO FLAT SURFACE SQUARED TO THE VIEWER. Never "in flat blocks of colour" and never a flat panel facing us — a large flat flank is always RAKING away from us and GLOSSY, giving the room's colour back.
- JARGON BANNED (a layperson reads these as a different object): never "crane", never "UFO catcher", never "cabinet", never "marquee", never "pod", never "gachapon", never "purikura", never "pusher". Say "machine", "chrome claw on a cable inside the glass", "clear plastic capsules", "curtained booth".
- NO SIMILE AND NO METAPHOR. Never "like a", never "shaped like", and never borrow an adjective from another object (a "feathered" streak renders a literal feather).
- NO LIGHT DESCRIBED AS A SOLID: never a column, pillar, wall, tower, bar, ribbon, sheet or beam of light. Light is a glow, a patch, a pool, a wash, a rim, a spill, a sheen or a reflection landing on a real surface.
- NO DETAIL EXEMPTIONS. Never "the nearest one shown in detail" or "detail on the front one or two" — the thing you describe most is the thing that comes out biggest, and a size ruler loses to an anatomy clause every time.
- NO named anime, studio, film, character or real brand in the output.
- NO photoreal, NO 3D, NO Western-cartoon wording. This is 2D anime art.
- NO even counts of like things (never two lamps, four plush, six coins) — use an odd count and set one member apart.`;

(async () => {
  // ───────────────────────────────────────────────────────────────────────────
  // 1. arcade_room — THE HERO. Leads with the machine bank's own mass, states
  //    the CROSSWISE law, and NAMES THE ENCLOSING SURFACES (lesson 3: on an
  //    interior path the rolled look decides whether the room exists, and
  //    camera words do not fix it — naming the enclosure does).
  // ───────────────────────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'game_center_arcade_room.json',
    total: 25,
    batch: 25,
    append: false,
    maxTokens: 6000,
    metaPrompt: (
      n
    ) => `You are writing ${n} HERO-ROOM descriptions for MangaBot's game-center-arcade path — the inside of a Japanese game centre at night, drawn as anime. This is the HERO axis: the room itself, its bank of machines, its floor and the surfaces that close it in.

Each entry: 28-40 words, one sentence or two short ones.

THE FORMAT IS LOAD-BEARING — every entry MUST OPEN with the bank of machines and its own mass, then build the room around it. Example openings: "A bank of tall machines crossing the picture from edge to edge, their fronts turned obliquely, and above them...", "A run of waist-high machines with glass tops sweeping across the frame, and behind them a wall of...", "Two ranks of tall machines meeting at an angle across the whole picture, and over them...". If an entry opens with anything other than the machines, it is wrong — the first-named noun becomes the hero and the room would vanish.

THE CROSSWISE LAW IS MANDATORY IN EVERY ENTRY. The machine bank CROSSES the picture from one side edge to the other, its fronts turned obliquely to us, and both of its ends run out of frame. One machine stands NEAR and LARGE. There is never an aisle running away up the middle of the picture toward a distant point, never a row of identical machines shrinking to a vanishing point, and nothing ever converges on a single shared point. State the crosswise fact in the entry itself.

THE ROOM MUST CLOSE THE FRAME — this is mandatory and it is what stops the render coming back as machines floating in a void. Every entry names at least TWO enclosing surfaces: a low ceiling close overhead (its open cable trays, its ducting, its run of bulbs, its hanging soft toys, its swagged paper streamers, its grid of ceiling tiles with one panel replaced), and something closing the frame down a side (the flank of another machine raking away, a mirrored column, a wall of prize shelves crowded with plush, a heavy curtain on a booth, a low rail, a stack of plastic stools).

THE FLOOR IS ALWAYS DARK AND POLISHED AND GIVES EVERYTHING BACK — say so in the entry. A wet patch inside the entrance, a mopped sheen, a polished dark floor doubling every colour in the room, a puddle of melt by the doors with the colours standing in it. This is the single best thing in the picture, so every entry earns it: never a patterned carpet, never a plain matte floor.

THE BAR — this is the whole point. A dim, tidy, tasteful arcade is a FAILURE even when it is clean. Every entry must be VIVID: saturated committed colour against near-black, glass and chrome everywhere giving light back, the room dense and lived-in and slightly crowded. Show a viewer somewhere they have never been, or the familiar arcade redressed as something far more interesting. Think adventurous and playful, never sober.

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

ONE CHARM DETAIL PER ENTRY — a clever small thing the eye finds on second look, belonging to the ROOM: a machine pulled out from the wall with its back open and cables spilling, one ceiling panel replaced with a clear one, a stool with a folded coat over it, a plush wedged between two machines where it fell, a hand-drawn... no, never anything drawn or written; a worn bright patch in the floor where feet have stood, a fat cable taped down across the floor, a fire extinguisher bracket with a soft toy sitting on it, one machine wearing a dust sheet.

AXIS DISCIPLINE — the ROOM ONLY:
- NO light sources and NO colour named as a palette. Say the floor is dark and polished and gives colour back, and say glass and chrome are everywhere, but a separate axis owns every light source and the whole palette. Do not name a colour.
- NO description of what is inside any single machine (a separate axis owns the near machine and another owns the prizes).
- NO people, NO figures, NO hands, NO faces, NO animals — separate axes own those.
- NO camera or framing language, NO lens, NO shot, NO angle-of-view words. Say the machine bank is turned obliquely; say nothing about where a camera stands.
- NO outdoor weather, NO sky, NO daylight of any kind. It is night and we are indoors.

${COMMON_BANS}

Return ONLY a valid JSON array of ${n} strings. No preamble, no commentary.`,
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 2. machine — ★ THE NEAR MACHINE as SHAPE and GLOW. Identified by prizes,
  //    claw, buttons, levers, capsules. Carries DELETE-AND-FILL on its top
  //    band and the RAKING-GLOSSY law on its flank.
  // ───────────────────────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'game_center_arcade_machine.json',
    total: 25,
    batch: 25,
    append: false,
    maxTokens: 6000,
    metaPrompt: (
      n
    ) => `You are writing ${n} NEAR-MACHINE descriptions for MangaBot's game-center-arcade path — the one arcade machine standing NEAR and LARGE in the picture, drawn as anime. It is a SHAPE and a GLOW, and it is identified entirely by its physical parts.

Each entry: 26-38 words.

WHAT IDENTIFIES A MACHINE — use these and only these, and open the entry with the machine's own mass:
- the mound of soft toys heaped behind its glass, pressed against the inside of the glass
- a chrome claw hanging on a cable inside the glass, its three prongs open, stopped part-way down
- rows of round buttons on its sloped ledge, each one a different saturated colour, one of them worn pale
- a ball-topped lever with the chrome gone bright where hands have held it
- columns of clear plastic capsules stacked behind a curved dome, a big chrome knob below them
- a low metal footplate with round rubber panels set into it, each panel a different colour
- a pair of drum pads with worn rubber heads and a stick resting across one of them
- a shallow coin slot with a worn dish below it and three coins stacked on the ledge beside it
- a glass top you look down through at prizes lying on a moving shelf
- a hinged flap at the bottom where a prize drops out, propped open by a soft toy caught in it

INFORMATION IS SHOWN ONLY AS POSITION, COLOUR AND COUNT. If a machine would tell you something, it does it with real objects: three of nine little round lamps lit along its edge, a single green lamp burning while the rest are dark, one red lamp blinking on the corner, five coins stacked on the ledge, a bulb behind the glass that pulses. Never anything written, never anything drawn, never a symbol.

THE TOP BAND IS ALWAYS FULL — this part is mandatory and it is what keeps invented lettering out of the render. Above the glass, where a machine would carry a flat strip, every entry instead puts real round or soft things: a row of round coloured bulbs along it, soft toys hung by their loops from a bar across it, small soft toys crowded along the top, a rotating beacon lamp bolted to one corner, a coiled cable on a hook, a bunch of balloons tied to its edge, a potted plant slowly dying up there, a cardboard crate of soft toys. Nothing up there is ever flat and never rectangular. Rotate which one each entry uses.

ITS BIG FLANK IS RAKING AND GLOSSY — every entry says the machine's large side turns away from us in raking perspective, glossy, giving the room's colour back along its length, with a chrome kick-rail or a scuffed rubber edge at the bottom. Never a flat side facing us.

THE BAR — every entry must be a genuinely delightful object, not an inventory of parts. Aim for the surprising version: a single soft toy pressed flat against the inside of the glass with its face squashed; the claw stopped mid-drop with its prongs just touching a toy's ear; a hinged flap jammed half-open by the prize it was delivering; a machine whose glass is fogged by a hand-print at child height; one machine standing dark and unplugged with its claw slack at the bottom.

AXIS DISCIPLINE — ONE machine, and only its own parts:
- NO light sources named and NO colour named as a palette beyond a button, a lamp, a bulb or a capsule being a colour. A separate axis owns the room's light and the whole palette.
- NO room, NO ceiling, NO floor, NO other machines beyond the flank of one neighbour. A separate axis owns the room.
- NO prize shelves and NO hanging prize walls — a separate axis owns those.
- NO people, NO figures, NO hands on the controls, NO faces, NO animals. A worn button and a bright-rubbed lever are welcome; a hand on them is not.
- NO camera or framing language.

${COMMON_BANS}

Return ONLY a valid JSON array of ${n} strings. No preamble, no commentary.`,
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 3. play_moment — ★ THE BEAT. Every entry NAMES ITS ACTOR as a whole
  //    figure (lesson 25: a named action with no named actor renders the body
  //    part alone, measured twice in the 33-path run).
  // ───────────────────────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'game_center_arcade_play_moment.json',
    total: 25,
    batch: 25,
    append: false,
    maxTokens: 6000,
    metaPrompt: (
      n
    ) => `You are writing ${n} PLAY-MOMENT descriptions for MangaBot's game-center-arcade path — the one beat happening right now in a Japanese game centre at night, drawn as anime. This is the story of the picture.

Each entry: 22-34 words.

EVERY ENTRY MUST NAME A WHOLE FIGURE BY ROLE, AT THE FRONT OF THE ENTRY, BEFORE THE ACTION. A named action with no named actor renders a giant disembodied hand or arm floating in the frame — this has happened twice on this fleet. So write "a schoolgirl in a navy blazer leaning over the glass with both palms flat on it", never "both palms flat on the glass". Roles only, never names: a schoolgirl in a navy blazer, a boy in a bucket hat, an office worker with his tie loosened and his jacket over one arm, a student with a bag slung across her back, a shop assistant in a company windbreaker, a grandmother with a shopping bag, a small child on a parent's shoulders, two friends in matching track jackets, a teenager with headphones round his neck, a young woman with her sleeves pushed up.

ONE FIGURE OR TWO, NEVER A CROWD. Two is welcome when they are doing one thing together or one thing against each other.

SIZE IS MANDATORY IN EVERY ENTRY. The room and its machines are the hero, so state the figure's size or place plainly: "at the near machine, cut off at the waist by the bottom of the frame", "small at the middle of the row", "at mid-distance with the machines towering over them", "standing at the near machine, occupying a third of the height of the picture at most". An entry with no size or place word renders a hero portrait and loses the room.

THE BAR — every entry is a real story beat with comedy or tension in it, never a person standing at a machine. Aim exactly here:
- a boy in a bucket hat with his whole face lit from below by the glass, his nose almost touching it, watching the claw come down
- a schoolgirl walking away with a tower of won soft toys stacked so high she cannot see over it, chin tipped up to peer past
- two friends in matching track jackets back to back on adjacent footplate machines, mid-step, hair flying up
- an office worker with his tie loosened crouched right down to the glass at floor level, one eye closed, lining something up
- a small child on a parent's shoulders reaching for a soft toy hung from the ceiling, fingers just short
- a student pressing one flat palm against the glass exactly where a soft toy's squashed face is pressed back at her
- a grandmother with a shopping bag at her feet working a ball-topped lever with total concentration while a teenager watches over her shoulder
- a boy holding an enormous won soft toy that is plainly bigger than he is, arms locked round its middle
- a young woman feeding her last coin in with three more stacked on the ledge and one already dropped and rolling
- two friends both reaching into the prize flap at once, shoulder to shoulder, neither giving way
- a teenager frozen mid-punch of a button with the whole row of little lamps lit along the edge
- a shop assistant on a stepladder restocking the glass, waist-deep in soft toys, only her top half showing
- a boy lying flat along a glass-topped machine to see under something, cheek on the glass
- a young woman carrying five soft toys by their loops in one hand like a bunch
- a small child crouched at the prize flap with both arms inside it up to the elbow
- an office worker asleep upright on a stool with his coat over him and a soft toy on his lap
- two friends counting coins out into a stack on a machine's ledge, heads together
- a schoolgirl mid-cheer with both arms up, a soft toy tucked under one of them
- a boy walking backwards away from the machine, still watching it, not looking where he is going
- a young woman holding a soft toy up at arm's length and looking it dead in the eye

MOTION IS MANDATORY — every figure is mid-something: mid-step, mid-reach, mid-punch of a button, mid-turn, mid-laugh, leaning, crouching, carrying, walking away. Weight shifted, a limb in motion, hair or clothing caught in the air. Never standing neutrally, never a posed portrait, never a back-to-camera silhouette as the subject.

WHOLESOME AND FULLY CLOTHED. Everyone is in ordinary street, school or work clothes, described plainly, one layer named at most. Never describe a body, never describe skin, never a swimsuit, never anything sultry or alluring. This is a warm, funny, everyday scene.

AXIS DISCIPLINE — the figure and the beat ONLY:
- NO light sources and NO palette beyond "lit from below by the glass" as a fact about the figure's face. A separate axis owns the room's light.
- NO room description, NO ceiling, NO floor, NO machine described beyond the part being touched.
- NO animals — a separate axis owns those.
- NO camera or framing language beyond where the figure stands and how big they are.

${COMMON_BANS}

Return ONLY a valid JSON array of ${n} strings. No preamble, no commentary.`,
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 4. prize_life — THE ANTI-TEXT SET DRESSING (lesson 26: the anti-text form
  //    must itself carry the interest, and done right it is a set-dressing
  //    win, not a tax). Picked TWICE per render for density.
  //    Deliberately ALL SOFT AND ROUND: plush, capsules, balls, bulbs. Boxed
  //    and printed prizes are deleted outright — a box is a printed wrapper.
  // ───────────────────────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'game_center_arcade_prize_life.json',
    total: 25,
    batch: 25,
    append: false,
    maxTokens: 6000,
    metaPrompt: (
      n
    ) => `You are writing ${n} PRIZE-LIFE descriptions for MangaBot's game-center-arcade path — the soft toys, the capsules and the hanging prizes that fill a Japanese game centre and make it feel crowded, loved and lived-in. Two of these are picked per render, so each must stand alone and each must be a genuine little discovery, never filler.

Each entry: 16-28 words. ONE arrangement or one small group.

EVERYTHING HERE IS SOFT OR ROUND. Soft toys, plush animals, round cushions, clear plastic capsules, rubber balls, round bulbs, balloons, pompoms, bundles of cord, a mound of fur. Nothing here is ever a box, a carton, a packet, a wrapper, a card, a tin, a bottle or anything with a flat printed face — those are deleted from this path entirely, because a flat printed face is where invented lettering lands.

THE CHARM LAW — every entry carries one clever detail the eye finds on second look: something wedged where it fell, hung by one ear, upside down, squashed against glass, mended, faded next to its bright twin, set apart from the rest, plainly older than everything around it.

VARIETY MANDATE — spread across all of these families:
- a mound of soft toys heaped behind glass, the front ones pressed flat against it with their faces squashed
- a single huge soft toy taking up a whole machine by itself, wedged in at an angle
- rows of soft toys hung by loops from a bar, packed shoulder to shoulder, one turned to face the wrong way
- a wall of shelves crowded with soft toys graded by size, the smallest at the top
- one soft toy fallen behind a machine and visible in the gap, face up
- a clear dome crowded with capsules in a dozen colours, one capsule already cracked open and empty
- columns of capsules stacked behind curved glass, one column nearly empty and the rest full
- a bin of loose capsules with a hand-depth hollow worn in the middle of them
- a cardboard crate of soft toys on the floor with the flaps folded in on each other
- soft toys crowded along the top of a shoulder-high partition, all facing the same way but one
- a bundle of small soft toys tied together by their loops and hung from a hook
- a soft toy sitting alone on a stool as though someone left it to hold their place
- a prize counter with soft toys stacked to elbow height along its whole front
- a net bag of rubber balls slung under a shelf, bulging
- a soft toy caught half-in and half-out of a prize flap
- a row of identical soft toys with one obviously older and greyer among them
- a stack of round cushions taller than a person leaning slightly
- soft toys hung in rows from a ceiling grid, low enough to brush a head
- a soft toy with one ear held on by a neat line of stitches
- a long garland of pompoms swagged across the front of a shelf
- a soft toy wearing a small knitted hat that someone put on it
- a glass shelf of soft toys lit from underneath so the fur glows at the edges
- a cluster of balloons tied to the corner of a machine, drifting slightly
- a soft toy face down in a puddle of light on the floor where it has been dropped
- a pile of soft toys in a shopping basket set on the floor beside a stool

AXIS DISCIPLINE — the prizes ONLY:
- NO people, NO figures, NO hands, NO faces, NO animals. A real live animal is a separate axis; these are all toys. A soft toy's own stitched face is welcome and is not a face in this sense.
- NO light sources named beyond a prize being lit from under or behind, and NO palette. A separate axis owns the room's light and colour.
- NO room, NO ceiling, NO floor beyond a stool, a shelf, a hook, a bar, a gap, a counter or a crate to put things on.
- NO machine described beyond its glass, its flap, its shelf or its top.
- NO camera or framing language.

${COMMON_BANS}

Return ONLY a valid JSON array of ${n} strings. No preamble, no commentary.`,
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 5. neon_light — ★ THE MONEY SHOT. Owns the palette.
  //    LESSON 30: on an INTERIOR path every light entry must name a source
  //    INSIDE the room and say what its light LANDS ON. An outdoor-sky entry
  //    here is a flat-daylight generator.
  // ───────────────────────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'game_center_arcade_neon_light.json',
    total: 25,
    batch: 25,
    append: false,
    maxTokens: 6000,
    metaPrompt: (
      n
    ) => `You are writing ${n} LIGHT-AND-COLOUR descriptions for MangaBot's game-center-arcade path. This is the MONEY-SHOT axis and the single most important pool on the path: what lights a Japanese game centre at night, and the colour the whole frame takes from it. It is always night and we are always indoors.

Each entry: 24-34 words.

EVERY SOURCE IS INSIDE THIS ROOM, AND EVERY ENTRY SAYS WHAT ITS LIGHT LANDS ON. This is absolute. A light source that a windowless indoor room physically cannot show — a sun, a sky, daylight, dawn, dusk, a sunbeam, moonlight — renders flat pale ambient daylight and takes the whole palette grey. So every entry names a real thing in this room that is switched on, and then names the surfaces its light reaches: faces from below, the polished floor, the wet mat inside the doors, chrome levers and kick-rails, the glass of a machine, the fur of soft toys behind that glass, a stack of stools, someone's forearms, the underside of the ceiling ducts.

THE VIVID LAW — every entry names TWO colours, and at least half the entries pit a WARM colour against a COOL one (magenta against cyan, orange against blue-violet, gold against teal, red against deep green, rose against steel-blue). Saturated and committed, against near-black. A muted, dim or single-hue entry is a failure — this path's whole identity is the most saturated picture on the bot.

VARIETY MANDATE — spread the sources across all of these, all of them inside the room:
- the glass of one machine lit from within, throwing its colour up onto a face from below
- a whole bank of machines off to one side, out of frame, their massed glow washing across the floor
- a row of round bulbs along a ceiling beam, small and warm and repeated
- a rotating beacon lamp on a machine top sweeping its colour round the room
- a lit prize shelf glowing from underneath so every soft toy is rimmed
- the warm square glow of a vending machine standing alone at the end of a blue-black run
- a bare fluorescent tube over the change counter, cold and flat, with everything else coloured
- a mirrored pillar or wall doubling every colour in the room back into the frame
- the wet floor inside the open doors carrying the street's colours back up in long smears
- a clear dome full of capsules lit from below so the colours stack up inside it
- a run of little coloured lamps along a machine's edge, only some of them lit
- one machine standing dark and unplugged, a black hole in the middle of all the colour
- a low amber worklight left on in a back corner where a machine is pulled out
- a cluster of coloured bulbs strung along the ceiling grid, swaying very slightly
- the glow of a curtained booth leaking out round the edge of its heavy curtain
- a stair head coming up into the floor with cooler light spilling from below it
- a single hanging shade low over a bench, its pool of light small and warm
- a wall of glass tops all lit from inside, the light coming up through them
- the doorway to the street at the far end, its colours cool and everything near us warm
- coin-slot lamps low along a whole row, a line of small glows at knee height

AXIS DISCIPLINE — light and colour ONLY:
- NO sun, NO sky, NO daylight, NO dawn, NO dusk, NO moon, NO weather of any kind. Street colour is allowed only as light coming IN through a doorway or a window from outside at night, and then only as what it lands on.
- NO people, NO figures, NO faces described beyond "a face lit from below" as a surface the light lands on, NO animals.
- NO prizes described beyond fur or capsules being lit, NO room structure described beyond a surface for light to land on, NO machine described beyond its glass or its lamps.
- NO camera or framing language.

${COMMON_BANS}

Return ONLY a valid JSON array of ${n} strings. No preamble, no commentary.`,
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 6. extra_life — the SECOND presence at a distance: one more small person,
  //    or an animal. 0.5 gate. Explicit size word mandatory in every entry
  //    (the measured onsen rule for a second figure-supplying axis).
  // ───────────────────────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'game_center_arcade_extra_life.json',
    total: 25,
    batch: 25,
    append: false,
    maxTokens: 6000,
    metaPrompt: (
      n
    ) => `You are writing ${n} SECOND-PRESENCE descriptions for MangaBot's game-center-arcade path — one more small presence deeper in the room, behind the main beat, that gives the picture depth and its best joke. It is either one more person seen small at a distance, or an animal.

Each entry: 14-24 words.

SIZE IS MANDATORY IN EVERY ENTRY. The room, its machines and the main figure are the hero, so every single entry contains an explicit size or distance word: "small at the far end of the row", "tiny between two machines at the back", "low at the near edge and no bigger than a stool", "a small shape at mid-distance". An entry with no size word renders this presence at hero scale and ruins the frame.

HALF PEOPLE, HALF ANIMALS. Roles only, never names.

PEOPLE — small and at a distance, doing one funny or quiet thing:
- an attendant small at the far end pushing a mop, not looking up
- a small child at mid-distance sitting on the floor between two machines, entirely happy
- an office worker tiny at the back with his forehead resting on a machine's glass
- two friends small at the far end arguing about something with big gestures
- a teenager small at mid-distance asleep sitting up on a stool
- an attendant small on a stepladder at the back with her arms full of soft toys
- a grandmother small at the far end with a shopping bag, playing with great seriousness
- a small figure at the back carrying a soft toy bigger than their own head
- a boy tiny at the far end with his hood up, eating something out of one hand
- a pair of small figures at mid-distance walking away hand in hand
- a shop assistant small at the back kneeling at an open machine with tools out
- a small child at mid-distance pressed against a glass top, both hands flat

ANIMALS — a real, whole, recognisable animal with a real animal's face, correct anatomy, never part-human, never upright and talking, never dressed:
- a cat curled asleep on a stool between two machines, small and entirely unbothered by the noise
- a small cat sitting upright on top of a machine, watching the floor with total suspicion
- a cat low at the near edge, no bigger than a stool, one paw batting at a fallen capsule
- a small dog on a lead at mid-distance, sitting patiently while its owner plays
- a cat small at the far end walking along the top of the prize shelf between the soft toys
- a sparrow small at the back on a ceiling pipe, in from the open doors
- a cat tiny at the far end asleep inside an empty crate
- a small tortoiseshell cat at mid-distance sitting exactly in the middle of the floor
- a dog small at the near edge lying across the wet mat by the doors, chin down
- a cat small on a machine's top, indistinguishable from the soft toys around it but for its open eyes
- a small cat at mid-distance with one paw inside a prize flap
- a moth small at the near edge circling a low lamp

WHOLESOME AND FULLY CLOTHED. Every person is in ordinary street, school or work clothes, described plainly. Never describe a body, never describe skin, never anything sultry.

AXIS DISCIPLINE — the one presence ONLY:
- NO light sources and NO palette. A separate axis owns those.
- NO room description beyond a stool, a machine top, a shelf, a gap, a crate, a mat, a pipe or a ladder to place them on or near.
- NO prizes beyond one soft toy or one capsule being carried, batted or sat among.
- NO camera or framing language beyond size and distance.
- Never both a person AND an animal in the same entry.

${COMMON_BANS}

Return ONLY a valid JSON array of ${n} strings. No preamble, no commentary.`,
  });

  console.log('\n✅ 6 game-center-arcade pools generated (camera is hand-authored).');
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
