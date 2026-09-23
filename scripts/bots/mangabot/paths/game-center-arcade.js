/**
 * MangaBot game-center-arcade path (2026-09-23) — MangaBot's first INTERIOR
 * NIGHT LEISURE register, and the most saturated picture on the bot.
 *
 * THE SOUL OF THE PATH:
 *   Inside a Japanese game centre at night. A bank of machines crossing the
 *   picture, a mound of soft toys heaped behind glass with the front ones
 *   squashed flat against it, a chrome claw stopped part-way down over a
 *   plush's ear, columns of clear capsules glowing from below, a face lit
 *   entirely from underneath by a machine's glass, and a dark polished floor
 *   giving every colour in the room back doubled. Saturated neon against
 *   near-black. THE LIGHT IS THE HERO MATERIAL and the room is the hero
 *   subject.
 *
 * WHY IT EXISTS (the gap, verified against the seeds, not assumed):
 *   MangaBot has 25 live paths + 4 Halloween seasonals + onsen-evening, and
 *   an arcade appears in exactly two places, neither of which owns it:
 *     • `neo-tokyo` — 10 of 200 `neo_tokyo_settings` entries and 17 of 192
 *       `neo_tokyo_district` entries are arcades or pachinko halls, but in a
 *       CYBERPUNK-DYSTOPIAN register ("retro-future arcade", "holographic
 *       displays flickering overhead", "VR arcade helmet stations",
 *       "salaryman crowds hunched in gambling trance"). That path also runs a
 *       dedicated `NEO_TOKYO_SIGNAGE_DENSITY` axis whose whole job is kanji
 *       signage — it is a TEXT-MAXIMISING path by design, i.e. the exact
 *       opposite of what this one has to be. Nothing here may be reused.
 *     • `anime-character-female` — 12 of 181 setting entries put a girl at a
 *       claw machine. The arcade is a BACKDROP and the character is the
 *       subject.
 *   So nothing on the bot owns the game centre as a ROOM, and nothing has
 *   machines and play as its subject. Structurally it is also the bot's FIRST
 *   TRUE INTERIOR NIGHT path: its interiors are mecha-hangars (industrial),
 *   anime-trains (transit) and space-opera (ship), and every cosy/night path
 *   is outdoors — festival-nights streets, rooftop-sunsets, anime-rain,
 *   night-touge, winter-anime, and onsen-evening, which was deliberately kept
 *   OPEN-AIR precisely to dodge the interior traps. This path takes them on.
 *
 * LOOK-ENABLED (route to mangabot_anime_neutral), same as onsen-evening. A
 *   game centre is a PLACE plus a CONDITION (night, indoors, neon), not a
 *   style, so a rolled look never fights it — and three of the twelve looks
 *   are outright gifts here (Trigger/Edgerunners neon, Shinkai, late-80s/90s
 *   OVA cel, since an arcade IS a 90s subject). The look axis is also what
 *   keeps 2 posts/day of ONE room from going samey, which a single-place path
 *   needs more than any other kind.
 *   ⚠️ PRE-IDENTIFIED RISK, stated before round 1 so it can be measured
 *   rather than discovered: 3 of the 12 looks carry priors that fight this
 *   path — #9 loose watercolour-and-ink ("generous airy negative space" is a
 *   room-voiding AND de-saturating instruction), #1 Ghibli ("muted natural
 *   earth-and-…" palette) and #11 dreamy pastel ("airy soft pastel"). That is
 *   a 25% exposure.
 *   → MEASURED OVER 24 RENDERS, AND IT IS **DIRECTIONALLY SUPPORTED BUT NOT
 *   ESTABLISHED — DO NOT ENCODE A LOOK FILTER ON THIS EVIDENCE.** Those three
 *   looks rolled 5 times, mean 3.34, against 3.75 for the other nineteen; the
 *   single lowest render of the final 12 is the dreamy-pastel one (3.2) and 4
 *   of the 5 pale rolls sit at or below 3.4. But ONE pale roll scored 4.0 (a
 *   Ghibli that came back clean and enclosed), 4 of the 5 pale rolls happened
 *   in rounds 1-2 when the whole batch averaged 3.3 — so round, not look, is
 *   a live confounder — and per lesson 19's resolution arithmetic a 0.4-point
 *   effect needs far more than n=5. In the final 12 the pale arm is n=2. The
 *   correct next experiment is a deliberate 2-arm batch, ~8 renders FORCED
 *   onto the three pale looks against ~8 on the saturated ones, all on the
 *   shipped R3 spec; only then is a filter justified. The filter itself is
 *   cheap and self-contained when the time comes: load the look pool in THIS
 *   file and pick from a filtered subset, touching no shared file.
 *
 * FUNCTION-FORM + SELF-CONTAINED (the onsen-evening / FaeBot apothecary
 *   pattern): this file loads its own seven seed JSONs and inlines its whole
 *   brief. It touches NO shared bot file — no pools.js entry, no archetypes.js
 *   entry, no archetype-templates.js entry. Registration is the block at the
 *   bottom of this file.
 *
 * 7 AXES (5 always-on, prize_life picked twice, 1 gated, 1 with a positive
 * fallback):
 *   - arcade_room   ★ HERO. Leads with the machine bank's own mass, carries
 *                     the CROSSWISE law and NAMES THE ENCLOSING SURFACES.
 *                     Light-free and colour-free by contract.
 *   - machine       ★ the near machine as SHAPE and GLOW, identified only by
 *                     prizes / claw / buttons / levers / capsules, its flank
 *                     raking and glossy, its top band always FULL.
 *   - play_moment   ★ 0.85 the beat, its ACTOR named as a whole figure at the
 *                     front of every entry. Positive "just vacated" fallback.
 *   - prize_life ×2   the plush, the capsules, the hanging toys — the anti-text
 *                     set dressing. Everything soft or round, never a box.
 *   - neon_light    ★★ THE MONEY SHOT. Owns the palette. Every entry names a
 *                     source INSIDE the room and what its light LANDS ON.
 *   - camera          HAND-AUTHORED, interior-safe, angle word in every entry.
 *   - extra_life    0.5 the second small presence at a distance: one more
 *                     person, or an animal.
 *
 * THE SEVEN TRAPS THIS PATH IS BUILT AGAINST (all playbook-documented):
 *   1. READABLE TEXT, and this is the hardest text subject in the fleet. An
 *      arcade is made of screens, marquees, price plates, score readouts,
 *      banners and packaging — every one a lettering magnet whose SHAPE is
 *      itself a text prior. Lesson 12: such a surface cannot be worded safely,
 *      only DELETED. Lesson 27, measured on THIS bot: a deletion leaves an
 *      ABSENCE, and an absence gets BACKFILLED — onsen-evening deleted its
 *      signboard from all three layers and the rate did not move (2/6 → 2/6)
 *      until the lintel was FILLED with a positive non-sign object (0/6).
 *      So the whole path is built on DELETE **AND** FILL, plus lesson 36's
 *      POSITION-COLOUR-COUNT LAW (0 text in 26 renders on a star chart):
 *      every glowing face is edge-on / raking / behind / off-frame; a machine
 *      is known by its prizes and its chrome, never by a lit front; anything
 *      a machine would TELL you it tells you as the position, colour or count
 *      of real objects (three of nine round lamps lit, five coins stacked on a
 *      ledge, four round rubber footplate panels each a different colour); and
 *      the band above every machine's glass is always FULL of round or soft
 *      things and never flat and never rectangular. Every flat class the
 *      lesson-26 backfill would otherwise claim is positively assigned a
 *      filler: the machine flank RAKES and is GLOSSY (a raking reflective
 *      surface cannot hold legible text), the ceiling carries cable trays and
 *      hanging plush, the walls carry prize shelves or a curtain, the counter
 *      front is stacked with plush to elbow height, and the floor is polished
 *      and reflective rather than patterned carpet.
 *   2. THE CORRIDOR. A row of machines is a LINEAR FEATURE, and lessons 17/24
 *      measure that as a receding corridor with the subject tiled to the
 *      vanishing point. Beaten with the CROSSWISE LAW stated in all three
 *      places that reach Flux (template rule 2, all 25 hero seeds, output-order
 *      item 2) plus lesson 29's sweep (`converg|vanishing|single point|apex`)
 *      run on the HERO pool, not just the camera pool.
 *   3. THE ROOM NOT EXISTING. Lesson 3: on an interior path the rolled look
 *      decides whether the room exists, and camera words do not fix it —
 *      NAMING THE ENCLOSING SURFACES does. Every hero seed names at least two
 *      (a low ceiling close overhead, and something closing a side), and rule 1
 *      says it too. MangaBot has never had an interior path, so this is the
 *      path's untested structural risk.
 *   4. FLAT DAYLIGHT. Lesson 30: on an interior path every light entry must
 *      name a source INSIDE the room and say what its light lands on; an
 *      "outdoor sky" entry is a flat-daylight generator that takes the whole
 *      palette pale. Enforced per-entry in the recipe; street colour is
 *      allowed only as night light coming IN through a doorway.
 *   5. THE DISEMBODIED LIMB. Lesson 25: a named action with no named actor
 *      renders the body part alone (measured twice in the 33-path run). Every
 *      one of the 25 play_moment entries names a whole figure by role BEFORE
 *      the action, and the output-order item names the actor too — not a
 *      reference to another section, which lesson 22's second form says does
 *      not ship.
 *   6. THE JARGON TRAP. Lesson 28: a domain's own correct word can be a
 *      confident wrong prior. Banned in every recipe, with the layperson's
 *      reading: crane (a construction crane, or a bird — and this bot's onsen
 *      path already paints crane birds), UFO catcher (a flying saucer),
 *      cabinet (a kitchen cabinet), marquee (a theatre marquee, and a
 *      signboard), pod (a seed pod), gachapon (no lay prior at all),
 *      ticket/score (printed objects). The head noun is always "machine".
 *   7. THE FLAT RECTANGLE. Lesson 39: any phrase instructing a flat surface
 *      squared to the viewer is a sign instruction — "in flat blocks of
 *      colour" on hanging cloth drew four flat rectangles each carrying an
 *      invented device. Banned outright here; every large flat surface is
 *      RAKING and GLOSSY instead.
 *
 * TWO CONDITIONS ARE NAMED IN THE EMITTED PROMPT, not merely implied — a path
 *   whose identity is a CONDITION must state it (the campfire-night lesson):
 *   (a) it is NIGHT, and (b) we are INDOORS. Both lead the output order, fused
 *   with the rolled light exactly as onsen-evening fuses evening with its
 *   light (which took steam 3/6 → 6/6).
 *
 * ── QA RESULT: 3 ROUNDS + 1 CONFIRMATION BATCH, 24 renders, 24/24 delivered ──
 *   R1 ~3.32 → R2 ~3.35 → R3 ~4.03 → confirmation ~3.97. Final 12 mean 4.00.
 *   Best render 4.6: a young woman feeding her last coin in with three more
 *   stacked on the ledge and one already dropped and rolling across the floor,
 *   warm amber machine-glow against a cold teal shaft and near-black, a second
 *   figure small on the walkway behind, zero lettering.
 *
 *   | metric                                   | R1  | R2  | R3+conf (12) |
 *   | ---------------------------------------- | --- | --- | ------------ |
 *   | receding corridor / rank tiled to a point| 2/6 | 3/6 | **0/12**     |
 *   | lit graphic machine faces turned to us   | 4/6 | 0/6 | 0/12         |
 *   | every machine in shot FULL               | ~1/6| 6/6 | 12/12        |
 *   | gibberish lettering anywhere             | 5/6 | 6/6 | 7/12, only 2 prominent |
 *   | saturated colour against near-black      | 2/6 | 2/6 | ~7/12        |
 *   | room encloses the frame                  | 5/6 | 6/6 | 12/12        |
 *   | named actor, zero disembodied limbs      | 4/4 | 4/4 | 10/10        |
 *
 *   R2's variable (the BANK-FILL LAW — every machine in the run full, not just
 *   the near one) did exactly what it was designed to do: lit graphic faces
 *   4/6 → 0/6 and machines full ~1/6 → 6/6. And the batch average DID NOT MOVE
 *   (3.32 → 3.35), because the lettering simply RELOCATED to the one strip
 *   still unfilled — the narrow header band between the glass and the bulb rail
 *   — and the corridor got worse. That is lesson 27's shape a third time, with
 *   a new refinement worth keeping: FILLING A SURFACE DOES NOT REMOVE THE
 *   LETTERING, IT MIGRATES IT TO THE NEAREST REMAINING UNFILLED STRIP.
 *
 *   R3's variable was the thing that actually moved the path: lesson 17/24's
 *   CONCRETE-BUT-CROPPED form applied to the SETTING — only two or three
 *   machines in shot, their glass filling the NEAR HALF as one continuous wall
 *   running off BOTH side edges, everything beyond squeezed into a BAND across
 *   the top. Corridor 3/6 → 0/12 and lettering 6/6 → 7/12 with prominence down
 *   hard, from ONE change, because the crop is also a text-surface-area cut: a
 *   receding rank of eight machines shows eight header bands, a cropped near
 *   wall shows two. Ruling out the camera first is what made this the right
 *   call — the five corridor renders traced to five DIFFERENT camera entries,
 *   including the two worded most explicitly against a corridor, so a camera
 *   purge (the BrickBot move) was measurably not the lever here, exactly as
 *   lesson 17 records: camera words lose to the feature's own prior.
 *
 * LENGTH (lesson 18 + its 2026-09-23 refinement): MangaBot already states a
 *   word cap on this path shape and emits a median 301 words with the scene
 *   starting at word 58, so tightening the NUMBER buys nothing — what shortens
 *   the output is deleting template prose and output-order items. This template
 *   is therefore deliberately LEANER than onsen-evening's: 5 lead rules instead
 *   of 6, and 8 order items instead of 9, with the near machine and its actor
 *   kept as separate items because lesson 34 forbids buying an unsolved trap
 *   with a solved one.
 *
 * CONFIG NOTES (see the registration block at the bottom):
 *   - mediumByPath → mangabot_anime_neutral (look-enabled).
 *   - modelByPath = onsen-evening's MEASURED pin, inherited as the starting
 *     point and verified in round 1 rather than assumed: flux-2-pro +
 *     flux-2-max. flux-1.1-pro-ultra is a standing exclusion for any path
 *     whose identity is a LIGHTING CONDITION (it reverts to a golden-hour
 *     exterior and signs its work — a hard text fail here). flux-1.1-pro
 *     drifts to full daylight on this bot's condition path, and flux-dev drops
 *     the premise material outright (no steam in 3 of 4 onsen renders).
 *   - sensoryAnchors MUST skip this path. MangaBot's scene `lightcolor` pool
 *     carries SETTING NOUNS ("the manga aisle corner", "the late-night parking
 *     lot", "the underground tunnel entrance") — a second-scene injection that
 *     would also out-vote the money-shot light axis.
 *   - twoPassPolish MUST skip (Haiku strips the camera, the crosswise law, the
 *     glow law and the full-top-band rule when compressing).
 *   - chaos MUST skip — chaos is enabled bot-wide on MangaBot.
 *   - NO nudityCheck needed: unlike onsen-evening there is no undress prior
 *     anywhere near this subject, and every figure axis states ordinary
 *     street/school/work clothes.
 *   - sharedDNA.colorPalette is deliberately NOT used: neon_light owns the
 *     palette, and a fixed vibe colour-cast would override the rolled light.
 *   - No promptPrefixByPath — the wrapper-strip lesson says default to empty.
 */

const fs = require('fs');
const nodePath = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(nodePath.join(__dirname, '..', 'seeds', `${name}.json`), 'utf8')
  );
}

const ROOM = load('game_center_arcade_room');
const MACHINE = load('game_center_arcade_machine');
const PLAY_MOMENT = load('game_center_arcade_play_moment');
const PRIZE_LIFE = load('game_center_arcade_prize_life');
const NEON_LIGHT = load('game_center_arcade_neon_light');
const CAMERA = load('game_center_arcade_camera');
const EXTRA_LIFE = load('game_center_arcade_extra_life');

const PLAY_GATE = 0.85;
const EXTRA_GATE = 0.5;

// Look-override header. Deliberately worded COOPERATIVELY rather than reusing
// archetype-templates.js `lookOverride()`'s "NON-NEGOTIABLE / AUTHORITY /
// OVERRIDES" wording: the playbook's FarmBot amendment measured that phrase
// family triggering Sonnet's own injection defences on ~28% of calls, and this
// template carries NO baked style phrases for a look to have to beat (the
// mangabot_anime_neutral medium explicitly defers style to the look), so the
// authority wording buys nothing here and costs refusal risk.
function lookLead(sharedDNA) {
  if (!sharedDNA || !sharedDNA.lookRegister) return '';
  return `━━━ THE ART STYLE FOR THIS RENDER ━━━
${sharedDNA.lookRegister}

Please write the whole Flux prompt in this art style, and open the prompt with these style words so they set the visual treatment from the very first line. Keep every piece of scene content and every rule below exactly as written — just render all of it in this style.

`;
}

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const room = picker.pickWithRecency(ROOM, 'arcade_room');
  const machine = picker.pickWithRecency(MACHINE, 'arcade_machine');
  const neonLight = picker.pickWithRecency(NEON_LIGHT, 'arcade_neon_light');
  const prizeA = picker.pickWithRecency(PRIZE_LIFE, 'arcade_prize_life');
  const prizeB = picker.pickWithRecency(PRIZE_LIFE, 'arcade_prize_life');
  const camera = picker.pickWithRecency(CAMERA, 'arcade_camera');
  const play =
    Math.random() < PLAY_GATE ? picker.pickWithRecency(PLAY_MOMENT, 'arcade_play_moment') : null;
  const extra =
    Math.random() < EXTRA_GATE ? picker.pickWithRecency(EXTRA_LIFE, 'arcade_extra_life') : null;

  const prizes = prizeB && prizeB !== prizeA ? `${prizeA}\n${prizeB}` : prizeA;

  const playSection = play
    ? `
★━━━ 3. THE BEAT HAPPENING NOW (name this whole figure before the action) ━━━
${play}

Write this figure into the prompt as a whole person, named by role, doing exactly what the entry says, at exactly the size the entry says. They are in ordinary street, school or work clothes, named plainly.
`
    : `
━━━ 3. THE MACHINE JUST VACATED ━━━
The near machine has the room to itself this moment: a stool pushed back from it with a coat still over the seat, a few coins left standing on its ledge, the chrome claw resting open on the heap of soft toys at the bottom of the glass, and every lamp and bulb in the room still burning.
`;

  const extraSection = extra
    ? `
━━━ 6. THE SECOND PRESENCE, DEEPER IN THE ROOM ━━━
${extra}

Keep it exactly the size the entry says. If it is an animal it is a whole real animal with a real animal's head, body and face — never part-human, never upright and talking, never dressed.
`
    : '';

  return `${lookLead(sharedDNA)}You are an anime background painter writing ONE Flux prompt for a NIGHT inside a Japanese GAME CENTRE — a floor of arcade machines, claw machines and capsule machines. Register anchors for YOU only, never written into the output: the game-centre episodes of a 90s slice-of-life anime, the neon interiors of a modern action anime, the after-dark city rooms of a Shinkai film.

━━━ THE FIVE THINGS THAT MAKE THIS PICTURE ━━━
1. NIGHT, INDOORS, ON THE ARCADE FLOOR — say so in the first words of the prompt. Every light in the picture is something switched on inside this room: a machine's glass, a bulb, a lamp, a lit shelf, or the night street seen through a doorway. Never daylight, never a sun, never a sky. And the ROOM CLOSES THE FRAME: the low ceiling presses close overhead and a real surface closes the picture down one side, so the machines are standing in a room and never floating in open space.
2. THE GLASS FILLS THE NEAR HALF OF THE FRAME. Only TWO OR THREE machines are in shot, and they stand so close that their glass and their heaped fur are the biggest things in the picture — one continuous wall of glass running off BOTH side edges of the frame, cropped at both ends. Everything beyond them is squeezed into a BAND across the TOP of the picture. The floor is dark and polished and gives every colour in the room back doubled. Nothing runs away up the middle of the picture toward a distant point, no rank of machines shrinks away to a point, and nothing converges on one shared point.
3. EVERY MACHINE IN THE PICTURE IS FULL — not only the near one, and this is the rule the whole path turns on. All the way down the bank, every machine carries glass heaped full of soft toys pressing against the panes, or a clear dome crowded with capsules, with a chrome claw on a cable inside the glass, rows of round coloured buttons and a ball-topped lever along the ledge, and above every machine's glass a row of round bulbs or soft toys hung by their loops from a bar. So the whole run reads as glass, fur, chrome and round bulbs from one edge of the frame to the other. Every front in the run is raked away from us and glossy, giving the room's colour back along its length, and no glowing front is turned toward us: a glowing front is only ever edge-on, raking, seen from behind, or out of frame with just its coloured light in the picture. A machine is known by its prizes and its chrome, never by a lit front, and anything a machine would tell you it tells you with real objects — three of nine little round lamps lit, or five coins stacked on a ledge. Whichever surface you leave undescribed is the one that comes back wrong, so fill them all.
4. SATURATED COLOUR AGAINST NEAR-BLACK is the whole point — this is the most vivid picture on this bot. Two committed colours, one warm set against one cool, and every wet, polished, chrome and glass surface in the room hands them back: the floor doubles everything standing on it, a face is lit from below by a machine's glass, chrome burns. A dim, tidy, tasteful arcade is a failure.
5. ONE CLEAR STORY BEAT, and the person doing it is named as a whole figure BEFORE the action. Everyone in frame is in ordinary street, school or work clothes.

★━━━ 1. THE ROOM (the hero) ━━━
${room}

★━━━ 2. THE NEAR MACHINE ━━━
${machine}
${playSection}
★★━━━ 4. THE LIGHT AND THE COLOUR (the money shot — it owns the palette) ━━━
${neonLight}

Commit to this light and to both its colours, named on the surfaces they land on. Light is a glow, a patch, a pool, a wash, a rim, a spill, a sheen or a reflection on a real thing — never a solid column, wall, bar, ribbon or beam.

━━━ 5. THE PRIZES CROWDING THE ROOM ━━━
${prizes}
${extraSection}
━━━ 7. THE CAMERA (apply the position, distance and angle exactly) ━━━
${camera}

Never a portrait, never a face filling the frame, never a straight-down or straight-on symmetrical view, never a view along the length of a row.

━━━ MOOD ━━━
${vibeDirective ? String(vibeDirective).slice(0, 90) : ''}

━━━ LENGTH IS THE FIRST RULE — 95-120 WORDS. COUNT THEM. ━━━
Write ONE line of comma-separated phrases, ONE phrase per bracket below, in exactly this order, then STOP. Anything not on this list gets cut, and every phrase is trimmed to its essentials to make the count. A tight 110-word scene beats a crammed 300-word inventory.
[NIGHT, INSIDE A JAPANESE GAME CENTRE, named plainly together with the rolled light and both the colours it brings, on the surfaces they land on],
[TWO OR THREE machines only, standing so close their glass FILLS THE NEAR HALF of the picture as one continuous wall of glass and heaped fur RUNNING OFF BOTH SIDE EDGES of the frame, everything beyond them squeezed into a BAND across the TOP — with EVERY machine in shot full of heaped soft toys or crowded capsules behind its glass, a claw on a cable inside each glass, and a row of round bulbs or looped soft toys above each glass, so the near wall reads as glass, fur, chrome and bulbs — and the low ceiling close overhead plus whatever closes the picture down one side],
[the near machine, known by its heaped soft toys, its chrome claw on a cable, its rows of round coloured buttons, its ball-topped lever or its columns of clear capsules, its big flank raking away and glossy — and the band above its glass FULL of round or soft real things],${
    play
      ? '\n[the whole figure named by role, and exactly what they are doing, at the size written],'
      : '\n[the stool pushed back, the coins left on the ledge and the claw resting open on the heap of soft toys],'
  }
[the soft toys and the clear capsules crowding the room],
[the dark polished floor giving every colour in the room back doubled],${extra ? '\n[the second presence deeper in the room, exactly the size written],' : ''}
[the camera position, distance and angle].

Describe only what IS present — every phrase names something in the picture, never something absent or avoided. No preamble, no headers, no markers, no bullets, no bold labels.`;
};

/*
 * ── REGISTRATION (merge into scripts/bots/mangabot/index.js) ─────────────────
 *
 *  1. pathBuilders:
 *       'game-center-arcade': require('./paths/game-center-arcade'),
 *
 *  2. shadowPaths (currently `['onsen-evening']`):
 *       shadowPaths: ['onsen-evening', 'game-center-arcade'],
 *
 *  3. mediumByPath — add (LOOK-ENABLED):
 *       'game-center-arcade': 'mangabot_anime_neutral',
 *
 *  4. modelByPath — add (array = uniform random pick):
 *       'game-center-arcade': [
 *         'black-forest-labs/flux-2-pro',
 *         'black-forest-labs/flux-2-max',
 *       ],
 *
 *  5. vibesByPath — add:
 *       'game-center-arcade': ['cinematic','voltage','shimmer','nostalgic','whimsical','cozy','enchanted','dark'],
 *
 *  6. chaos.skipPaths — add:
 *       'game-center-arcade',
 *
 *  7. twoPassPolish.skipPaths — add:
 *       'game-center-arcade',
 *
 *  8. sensoryAnchors.skipPaths — add (the key exists, holding onsen-evening):
 *       skipPaths: ['onsen-evening', 'game-center-arcade'],
 *
 * Nothing else is required: pools.js is untouched (this file loads its own
 * seeds), no nudityCheck entry is needed, and no dream_mediums /
 * dlt_clean_mediums row is needed because the path reuses the existing
 * mangabot_anime_neutral medium.
 * Going live later = move the string from shadowPaths[] into paths[], changing
 * nothing else (the faithful-xerox rule).
 */
