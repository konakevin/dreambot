#!/usr/bin/env node
// ToyBot sand-toy-beachworks (2026-09-23, SHADOW) — a vast sand engineering project shot as a
// CIVIL-ENGINEERING EPIC: walls, towers, canals and a moat system caught half-built, with the
// buckets and shovels that made it cropped in the frame beside it.
//
// WHY THIS PATH. Audited all 34 ToyBot builders. Every one of them photographs MANUFACTURED toys
// as the subject, on a dry surface or in water or behind glass. Not one has SAND as a material,
// not one is about BUILDING something, and not one INVERTS the bot's premise — here the toys are
// the TOOLS and the thing they built is the hero. "sandcastle" appears 7 times in the whole bot,
// every time as a prop inside someone else's scene; "beach" exists only as a background setting
// in shared staging/landscape pools. So the gap is real on three axes at once.
//
// ── THE FIVE DRIFTS EVERY POOL HERE IS WRITTEN AGAINST ────────────────────────────────────────
//
// DRIFT 1 — THE HOLIDAY SNAPSHOT (playbook lesson 11, in its beach form). A beach is not a tub,
// but it is the same three-position knob. Name the structure as an OBJECT from outside ("a
// sandcastle on a beach") and the render is the photo everyone already has. Abstract it away and
// the premise is deleted. What works is CONCRETE BUT CROPPED: the camera down at sand level among
// the structure, the near wall's wet cut face filling the lower frame and cropped by both side
// edges, the sea as a band along ONE border, the rest running out of frame. Towels, deckchairs,
// parasols, sunbathers, a promenade, a pier and a crowd are absent from EVERY layer — any one of
// them collapses the epic into a snapshot instantly.
//
// DRIFT 1b — AND THE CROP IS NOT ENOUGH, because a beach carries the same standard-viewing-HEIGHT
// prior a bathtub does (lesson 21, measured on the sibling bath-toy-flotilla at 6 renders per
// position: the camera clause reached 6 of 6 prompts and flux shot from above in 6 of 6). So this
// path names TWO SURFACES THAT CANNOT EXIST IN A SHOT FROM ABOVE, both of them in the prefix and
// in the required output order: (a) the near wall's WET CUT FACE rising straight out of the bottom
// of the frame, cropped by both side edges, and (b) the tallest towers BREAKING THE LINE of the
// bright water behind them. Nothing stands against the sky in a top-down shot.
//
// DRIFT 2 — THE TOYS RENDER FACTORY-FRESH AND GLOSSY. This is the sibling's named residual and it
// is inherited by default: "scuffed sun-faded well-chewed" sat in all 24 bath prompts and lost to
// the moulded-plastic PRODUCT prior every time, because adjectives lose to a prior. The lever the
// sibling identified but never spent: state the finish as a SURFACE, not an adjective, and put it
// in the SEED'S OWN OPENING NOUN PHRASE, per entry, where lesson 13 measures it sticking 9/9 —
// never in the prefix (the sibling's R4 bought it with prefix words and lost its hero's variety).
// So every `tools` entry OPENS on a named surface state: "gone matte and chalky, no shine left on
// it", "faded to salmon on its sun side only", "sand ground permanently into every seam".
//
// DRIFT 3 — THE BLEACHED MIDDAY BEACH. A beach at noon is a low-contrast, desaturated prior and it
// failed the VIVID half of the bar in half the sibling's frames. The light law therefore lives in
// the PREFIX, where it costs nothing in variety because it is identical on every render: low
// raking sun, every ridge's shadow long, wet sand near-black against pale dry sand. The
// `sand_light` axis then owns the COLOURS, and every entry must pit two named colours against
// each other with at least one saturated.
//
// DRIFT 4 — THE SUBJECT IS MADE OF TEXT-SHAPED SURFACES. A bucket and a shovel are BRANDED
// objects with moulded lettering and printed labels, and a sand mould is nothing but embossed
// text. Measured on MangaBot game-center-arcade (lessons 51/52): filling one surface MIGRATES the
// lettering to the nearest unfilled strip, so the rate barely moves while prominence falls as the
// available area shrinks — and CROP is a text lever, because a receding rank of objects shows many
// labelled faces while a cropped near one shows two. So: (a) the count of visible manufactured
// faces stays LOW — one tool, two at most, per entry; (b) every entry crops, turns away or buries
// part of it; (c) the sand IS the positive fill (lessons 14/26/27 merged into one clause) —
// "sand ground into every seam and a crust of drying sand up one side" is simultaneously the
// anti-text fill, the anti-gloss finish and the charm; and (d) the whole MOULD class is DELETED
// rather than described (lesson 12), with only its RESULT allowed ("a turret cast from the bucket
// standing beside it").
//
// DRIFT 5 — A NAMED ACTION WITH NO NAMED ACTOR RENDERS THE BODY PART ALONE (lesson 25, measured
// twice in the 33-path run). A bucket mid-pour with no hand is exactly that trap, and a real
// person on a beach is DRIFT 1. So this path is deliberately figureless of people, and every
// `moment` entry NAMES ITS ACTOR FIRST and the actor is always the water, a named part of the
// structure, a beach animal, or a toy figure. Never a person, never a hand, never a passive.
//
// ── THE JARGON AUDIT (lesson 28, and lesson 47 says run it on the TITLE first) ─────────────────
// The path's own name is the first offender: "BEACHWORKS" reads to a layperson (and to CLIP) as
// industrial dockworks or roadworks, and as a compound trade name it is a text prior on the one
// path whose hardest defect is lettering. It is therefore an INTERNAL key only and the word
// "works" never reaches any layer that touches Flux. Banned with it, each because a layperson
// pictures something else: `mould` (mildew), `spade` (the playing-card suit — use "shovel"),
// `bank` (a savings bank), `race` (a foot race), `channel` (a TV channel), `revetment` (no prior
// at all — the KODAMA trap), `keep` (the verb), `bailey` (a surname), `sluice`, `berm`,
// `crenellation`. Correctness is not the test; what a layperson pictures is.
//
// 6 pools x 25 (MVP-25 only — scaling waits for sign-off):
//   toybot_sand_works   — the built structure (HERO, leads the prompt, leads with its mass)
//   toybot_sand_tools   — the bucket and the shovel, FINISH STATED AS A SURFACE, cropped
//   toybot_sand_moment  — the beat happening right now, ACTOR NAMED FIRST (gated ~0.8)
//   toybot_sand_water   — the moat, the canals, the tide's arrival (money shot)
//   toybot_sand_light   — owns the palette; the anti-bleach axis
//   toybot_sand_life    — a gull, a crab, paw prints, or a toy garrison (gated ~0.55)
//
// CHARM is deliberately NOT a 7th axis: it is a LAW inside works / tools / moment. Reason is word
// budget (lesson 18/43) — ToyBot medians ~245 emitted words and a 7th block plus its output-order
// item pushes past the attended third. A charm detail also works better welded to the entry it
// decorates than rolled separately (lesson 14).
//
// Usage: node scripts/gen-seeds/toybot/gen-sand-toy-beachworks.js [--pool works|tools|moment|water|light|life]
// With no --pool it generates all six. grow-to-N + signature dedup, so a rerun is idempotent.
const { generatePool } = require('../../lib/seedGenHelper');

const ONLY = (() => {
  const i = process.argv.indexOf('--pool');
  return i > -1 ? process.argv[i + 1] : null;
})();
const wants = (name) => !ONLY || ONLY === name;

const SHARED_BAR = `━━━ THE BAR — THIS OUTRANKS "NO DEFECTS" ━━━
DreamBot exists to add whimsy and delight. Every entry must be PLAYFUL, ADVENTUROUS, VIVID, BEAUTIFUL and CLEVER. An entry that is on-brief, clean and merely competent is a FAILURE.
- THE TONE OF THIS PATH, AND IT IS THE WHOLE JOKE: the treatment is a CIVIL-ENGINEERING EPIC — a dam, a fortress, a canal system, shot with total gravity like a documentary about a great public work — while the subject is a sandcastle somebody built with a bucket. Play it COMPLETELY STRAIGHT. Never wink at it, never call anything cute, never make the joke in the words. The comedy is entirely the viewer's.
- VIVID is literal: name committed saturated colour. Muted, tasteful, sun-bleached grey is a failure.
- CLEVER: one charm detail the eye finds on second look, and it must make it THAT structure and no other.
- ADVENTUROUS: mid-action over parked, a story beat over a tableau. Something is always giving way, filling, arriving or being finished.
- Show something never seen before, or take something familiar and redress it as something more interesting. For every entry ask: is this the obvious version of this idea, or the surprising one? Write the surprising one.`;

const SHARED_FRAME = `━━━ WHERE THE CAMERA IS — TRUE OF EVERY ENTRY ━━━
The camera is DOWN AT SAND LEVEL, inches above the sand, IN AMONG the structure — not looking at it, inside it. The near wall's wet cut face rises straight out of the bottom of the frame and is cropped by both side edges. The tallest towers break the line of the bright water behind them. The sea is only ever ONE bright band along a single border of the picture, and the rest of the structure and the rest of the beach run out of frame on every side.
Write from that vantage. Anything only visible from standing height, from across the sand, or from above, does not belong in an entry.
THE BEACH THAT WOULD MAKE THIS A HOLIDAY SNAPSHOT DOES NOT EXIST HERE, and not one of these may be named: a towel, a deckchair, a sun lounger, a parasol, a beach umbrella, a windbreak, a sunbather, a swimmer, a bather, a promenade, a pier, a boardwalk, a hotel, a beach hut, a car park, a crowd, a holidaymaker, a family, a person, a child, a hand, an arm, a leg, a knee, a foot, a bare footprint. Nobody is in this picture. The structure, the tools, the water, the light and the wildlife are the entire cast.`;

const SHARED_MATERIAL = `━━━ MATERIAL TRUTH — TWO MATERIALS AND THEY MUST BOTH READ ━━━
THE SAND. Packed WET sand is a real material and it must be described as one: drum-hard and dark, shovel-smoothed, holding the print of whatever pressed it, its cut faces showing packed layers, going pale and crumbly as it dries, shedding in thin streams from a drying edge. Dry sand is pale, loose, and runs. The whole drama of the picture is the near-black wet against the bone-pale dry.
THE PLASTIC. Every tool is a REAL PHYSICAL BEACH TOY photographed close up: moulded hollow plastic, a seam up the side, a rolled rim, a riveted or moulded handle. And its FINISH IS A SURFACE, not an adjective — "gone matte and chalky with no shine left on it anywhere", "faded to salmon on its sun side only", "sand ground permanently into every seam", "the gloss scoured right off one flank by years of grit", "gone milky and fogged where the sun has got at it". Say that surface out loud inside the noun phrase itself, before the object word, because a bare "red bucket" renders a shop-fresh product and the whole picture goes glossy.
Really photographed, with real texture. Never CGI, never a digital illustration, never a flat graphic.`;

const SHARED_TEXT_LAW = `━━━ THE MARKING LAW (load-bearing — a bucket is a BRANDED object) ━━━
Nothing in frame carries readable writing, and the fix is not to say so — it is to leave no bare plastic face for writing to appear on. THE SAND IS THE FILL: every flat plastic face is either caked with drying sand, packed with wet sand, turned away from the camera, half-buried, or cropped by the edge of the frame. Write that as part of the object, positively, in the same breath as the object itself: "a crust of drying sand up one side", "wet sand packed into the ribs under its rim", "buried to its rim so only the handle shows", "turned away so only its scoured back is to us".
KEEP THE COUNT OF VISIBLE PLASTIC FACES LOW. One tool per entry, two at the absolute most, and each one cropped, turned or buried. A rank of tools standing in a row shows a row of labelled faces; one cropped near tool shows almost none.
NEVER NAME ANY OF THESE OBJECTS — their SHAPE is itself a text prior and no wording makes them safe, so they are deleted rather than described: a sand mould, a castle mould, a shaped former, a measuring cup, a graduated scoop, a bottle, a tube, a jar, a tin, a can, a carton, a packet, a wrapper, a book, a newspaper, a ticket, a sign, a signpost, a notice, a board, a plaque, a chart, a scoreboard, a beach ball or inflatable carrying printing, an ice-cream tub, a cool box. A turret CAST from a bucket is welcome; the thing that cast it is only ever the bucket.
NEVER WRITE ANY OF THESE WORDS: mark, marks, marking, markings, label, labelled, sign, signage, lettering, letters, letter, number, numbered, numeral, digit, inscription, inscribed, engraved, etched, stamped, embossed, moulded lettering, script, characters, glyph, sigil, rune, title, placard, board, banner, motto, logo, brand, branded, trademark, date, price, writing, written, ruled, drawn, traced.
A PENNANT IS THE ONE EXCEPTION AND IT HAS ITS OWN FORM: a scrap of plain bright plastic on a drinking straw is welcome, and it must be described as TWISTING EDGE-ON, curling or rippling — never as a flat block or panel of colour, because a flat rectangle squared to camera is a sign whatever you call it.`;

const SHARED_SCALE_LAW = `━━━ THE SCALE LAW — THIS IS KNEE-HIGH SAND SHOT LIKE A MOUNTAIN RANGE ━━━
The structure must read as MONUMENTAL and as SAND SOMEBODY BUILT, both at once. Two mechanisms, and they are not optional:
1. A RULER, WELDED AND IN FRAME. Every entry that names a mass must rule it against something in the picture whose own size is fixed: the upturned bucket at its foot, the shovel standing in it, the rolled rim of a bucket half-buried in it, the wet-sand line running past it, a razor shell pressed into its face. Never a ruler that is off camera ("waist-high", "the size of a hand") — those buy nothing and they smuggle a person in.
2. HIGH COUNTS. A low count is the giant-object generator: three towers renders three monuments, while a dozen bucket-cast turrets stepping away along a wall renders a fortress at true scale. Say a dozen, a score, two dozen, a run of eight, a whole line of them.
AND GRANT NO ELEMENT A DETAIL EXEMPTION. Never write "the nearest turret shown in loving detail" or anything like it — detail and size are the same dial, and the thing you describe most is the thing that comes out biggest. Every turret, shell, pebble, scrape and creature is a small clean shape at the ruler's size, INCLUDING the nearest one.`;

const SHARED_SHAPE_LAW = `━━━ NEVER DESCRIBE SAND, WATER, FOAM OR LIGHT AS A NOUN-OBJECT ━━━
No "a sheet", "a curtain", "a wall of light", "a column", "a pillar", "a ribbon", "a sweep", "a rush", "a burst", "a plume", "a beam", "a shaft", "a bar", "a cone", "a dome", "a disc", "a plate", "an orb", "a bead of light", "a jewel", "coins of light". Every one of those renders as a solid object sitting in the picture instead of as sand, water or light. Describe the SURFACES and the GRAINS and the DROPS and what they are DOING instead.
No similes either — no "like a", "as though it were a", "shaped like". A borrowed noun renders as that literal object.
And no architectural jargon, because a layperson pictures the wrong thing every time: never write works, beachworks, mould, spade, bank, banks, channel, revetment, keep, bailey, sluice, berm, crenellation, or rust. Write wall, tower, turret, canal, moat, ditch, ramp, dam, trench, spillway, shovel, bucket, cut face, notched top, and "on both sides" for a moat's sides.

━━━ THE BANNED-WORD LIST, MEASURED — every one of these was caught in a first-draft sweep of this very path ━━━
- NEVER "drawn", "ruled", "traced", "score", "scored", "marks", "mark", "marking", "script" — all of them are PUT-THERE-BY-A-HAND words and they render as actual writing. A tapering spire TAPERS to a point, it is not "drawn" to one. A shovel leaves SCRAPES, GROOVES, RIDGES, DENTS or PRINTS in sand, never "marks". Tracks read as STITCHING or PRINTS, never as "script". A high-water LINE, never a high-water "mark".
- NEVER "single file", "in a column", "in a row one behind the other", "receding", "converging", "vanishing", "to a single point". A line of similar objects running away from the camera tiles itself to a vanishing point. Say ABREAST, SPREAD ALONG, STAGGERED, SIDE BY SIDE, CROSSWISE, or "one ahead and two behind".
- NEVER "horizon". The sea is ONE BRIGHT BAND along a single border of the picture, and nothing else. A horizon line across the frame is the holiday snapshot this path exists to avoid.
- NEVER "crowd" or "crowds", even as a verb about towers — the beach-crowd sense is one word away. Say PRESS, STAND PACKED, CLUSTER.
- NEVER a body-part word for part of a structure or a tool: not the wall's "foot", not the tower's "shoulder", not the canal's "arms", not the "footprint" of the walls, not a shovel's "shoulder". Write the wall's BASE, the tower's UPPER CURVE or FLANK, the canal's two BRANCHES, the OUTLINE of the walls, and "driven in up to the handle".
- NEVER an off-camera ruler and never a human one: no "hand-width", "thumb-width", "finger-width", "waist-high", "knee-high", "the size of a". A depth or a gap is measured in SHOVEL-BLADES, BUCKET-RIMS or TURRET-HEIGHTS — things standing in the picture.
- NEVER "crimson", "scarlet", "maroon", "oxblood" or any rust word. Bright red plastic is POSTBOX-RED, PILLARBOX-RED, TOMATO-RED or just BRIGHT RED.
- A TOY IS ALWAYS "IT", NEVER "HE", "SHE", "HIS" OR "HER". A plastic soldier has ITS rifle at ITS shoulder. A pronoun is the fastest way to turn a moulded figure into a real person.`;

(async () => {
  // ── 1. THE STRUCTURE — the hero. Leads the prompt, so it leads with its defining mass. ──
  // LENGTH: the first draft of this recipe asked for "34-46 words" in prose and returned a 112-word
  // median — playbook lesson 46 ("a stated length range in prose is not a cap, and a length spec that
  // contradicts its own content requirements loses every time"). The sibling paths' proven hero pools
  // median 60-62 words, so this recipe now states the cap as a COUNTED HARD RULE with an explicit
  // rejection clause AND drops one requirement to make room: the sand's two tones moved out, because
  // the path prefix already carries "wet sand near-black against pale dry sand" on every single render.
  if (wants('works'))
    await generatePool({
      outPath: 'scripts/bots/toybot/seeds/toybot_sand_works.json',
      total: 25,
      append: true,
      batch: 25,
      metaPrompt: (
        n
      ) => `Write ${n} SAND STRUCTURES for ToyBot's sand-toy-beachworks path. Each describes one vast half-built sandcastle-and-canal system, shot from sand level in among it like a documentary about a great public work.

━━━ LENGTH IS A HARD RULE AND IT IS COUNTED ━━━
Every entry is between 45 and 60 words. COUNT THE WORDS of each entry before you return it. An entry of 61 words or more is REJECTED and must be cut down, not submitted. If you cannot fit everything below into 60 words, DROP a secondary element — never run long.

${SHARED_BAR}

${SHARED_FRAME}

━━━ HOW EVERY ENTRY MUST BE BUILT — FOUR THINGS, IN THIS ORDER, INSIDE 60 WORDS ━━━
1. OPEN WITH THE DEFINING MASS — the one biggest element, named FIRST, with the state of its sand, because the first noun is the one the picture gets built around. "A high wall of drum-hard wet sand, dark as chocolate and shovel-smoothed down its whole length." "A fat round tower of packed wet sand, its flanks still showing the ribs of the bucket that cast it." "A canal cut wide and deep, its near side a sheer wet face." NEVER open with the beach, the sea, the sun, the sand in general, a bucket or a shovel.
2. THEN THE SYSTEM — two or three more named elements, each a genuinely DIFFERENT mass, and every count HIGH: a dozen bucket-cast turrets stepping away along the wall, a run of eight linked pools falling one into the next, two dozen razor shells standing on end along the top, a score of drip-built spires standing packed behind. Tall-and-round beside long-and-low beside wide-and-flat beside small-and-many.
3. A PRESSED-IN NATURAL RULER where the entry earns one, and NEVER A TOOL — a razor shell standing in the wall's face, a mussel shell pressed in point-first, a flat pebble laid into the ramp, a notch cut by a shovel's tip. THE BUCKET AND THE SHOVEL BELONG TO A DIFFERENT AXIS AND MUST NOT APPEAR IN THIS ENTRY AT ALL. That axis always fires and always welds its tool to the structure, so the picture's size ruler is guaranteed — your job here is the SAND, monumental and alone.
4. ONE CHARM DETAIL that makes it THAT structure and no other, the kind the eye finds on second look.

━━━ VARIETY MANDATE — spread the ${n} entries wide, no family more than twice ━━━
THE WALL SYSTEM: a long high wall with a dozen bucket-cast turrets stepping away along it; a double wall with a deep dry trench between them; a wall whose top is notched the whole way along at even intervals; a gatehouse mass with a deep square-cut moat in front of it; an outer wall studded with pressed shells in close rows.
THE CANAL SYSTEM: a wide canal cut crosswise with its near side a sheer wet face; a staircase of eight linked pools stepping down toward the water; a canal splitting into two branches round a packed island; a dam of packed sand across a canal with a spillway notch cut in its crest; a long spillway cut down the outer slope with its floor pressed smooth.
HALF-BUILT AND STILL GOING: a wall half its length with fresh sand still heaped where it was tipped; a tower whose top course is a fresh unmarked cylinder, its rib pattern razor sharp; a stretch of wall fallen in and the repair already started beside it; a tower leaning hard with a crack running down it; a whole quarter of it still only shallow scrapes cut in the dry sand.
THE MOUNTAIN RANGE (the massing that makes the low sun earn its keep): a ridge of two dozen drip-built spires pressed close together; a range of tall thin drip towers stepping back in staggered rows; a whole flank carved into stepped terraces; a great packed mound with switchback ramps cut round it.
THE DRESSING: a wall crowned with a line of razor shells standing on end; a road of two dozen flat pebbles laid crosswise over the ramp; a whole outer face combed into close parallel grooves; a tower ringed with mussel shells pressed in point-first.
THE SHEER SIZE: a structure so long it runs out of frame both sides with only one end of it in shot; a wall so high the towers behind it show only their tops.

${SHARED_SCALE_LAW}

${SHARED_TEXT_LAW}

${SHARED_MATERIAL}

${SHARED_SHAPE_LAW}

━━━ HARD RULES ━━━
- NO PEOPLE AND NO BODY PARTS OF ANY KIND. A small moulded plastic toy figure garrisoned on the structure is allowed and good; a real person is not.
- The entry is purely THE STRUCTURE AND ITS SAND. Another axis owns the bucket and the shovel, another owns the water, another owns the light, another owns what is happening, another owns the wildlife. Do not name the colour of the light, a time of day, a gull, a crab, or what the water is doing right now.
- NOT ONE OF THESE WORDS MAY APPEAR: bucket, shovel, rake, sieve, watering can, spoon, plank, twine, pennant, straw, toy, plastic. Measured on the first draft of this very pool: 24 of 25 entries named a bucket or a shovel because the ruler instruction invited one, and the tools axis then added a SECOND one to the same frame — which doubles the number of branded plastic faces in shot, the exact opposite of what this path needs (crop is a text lever: a cropped near tool shows two faces, a rank of them shows many). One tool per picture, and it is the tools axis's tool.
- The structure is READABLE FRONT TO BACK — several distinct masses, each identifiable, never one lump and never a blur.
- It is SAND SOMEBODY BUILT, never carved stone, never a real castle, never a competition sand sculpture of an animal or a face.
- Describe only what IS present. Never write a negation of any kind.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no keys.`,
    });

  // ── 2. THE TOOLS — the finish stated as a SURFACE in the entry's own opening noun phrase. ──
  if (wants('tools'))
    await generatePool({
      outPath: 'scripts/bots/toybot/seeds/toybot_sand_tools.json',
      total: 25,
      append: true,
      batch: 25,
      metaPrompt: (
        n
      ) => `Write ${n} TOOL entries for ToyBot's sand-toy-beachworks path. Each is the one or two beach toys that built this structure, present in the frame beside it — cropped, buried, turned away or sand-caked. Each entry 22-30 words.

${SHARED_BAR}

${SHARED_FRAME}

━━━ WHY THIS AXIS EXISTS, AND THE ONE THING IT LIVES OR DIES ON ━━━
Measured on the sibling path ToyBot bath-toy-flotilla, 24 renders: the toys came back FACTORY-FRESH AND GLOSSY in most frames against "scuffed sun-faded well-chewed" sitting in every single prompt. Adjectives lose to the moulded-plastic product prior. What beats a prior is a NAMED SURFACE, stated in the entry's OWN OPENING NOUN PHRASE, before the object word.
So EVERY ENTRY OPENS ON THE SURFACE STATE. Not "a scuffed red bucket" — that is an adjective and it loses. Write:
  "Gone matte and chalky with no shine left on it anywhere, a red plastic bucket sits upturned at the tower's foot…"
  "Faded to pale salmon on its sun side only and still postbox-red on the other, a bucket lies half-buried…"
  "With sand ground permanently into every moulded seam, a yellow shovel stands upright in the parapet…"
  "The gloss scoured right off one flank by years of grit, a cobalt bucket is wedged…"
  "Gone milky and fogged where the sun has got at it, a pale blue shovel lies across the canal…"
Rotate the surface state so the ${n} entries do not all use the same one. The available states: gone matte and chalky; gone milky and fogged; sun-faded on one side only; the gloss scoured off by grit; worn back to pale bare plastic at the rim; sand ground into every seam; gone soft-edged and rounded where it has been dragged; crazed with a fine net of hairline cracks; the paint of a printed pattern gone leaving only a faint ghost of colour.

━━━ EVERY ENTRY CONTAINS ━━━
1. THE SURFACE STATE, first, before the object.
2. THE TOOL, named plainly and simply — a bucket, a plastic shovel, a plastic rake, a small watering can, a plastic sieve, a wooden spoon, a driftwood plank, a length of orange twine, a pennant of plain bright plastic on a drinking straw. ONE, or two at the very most.
3. ITS ONE SATURATED COLOUR, named — postbox red, cadmium yellow, cobalt, acid green, hot orange, deep plum, turquoise. This is often the only saturated colour in a frame of neutral sand, so it must be committed and it must be named.
4. WHERE IT IS, WELDED TO THE STRUCTURE, so it doubles as the picture's ruler — upturned at the foot of the near tower, standing upright in the notched top of the wall, laid across the canal as a bridge, buried to its rim in the ramp, tipped on its side in the spoil heap with sand spilling out of it, hooked over a turret by its handle.
5. HOW IT IS CROPPED, TURNED OR BURIED, and what SAND is doing to its flat faces — a crust of drying sand up one side, wet sand packed into the ribs under its rim, buried to the rim so only the handle shows, turned away so only its scoured back is to us, cut off by the bottom edge of the frame.
6. ONE CHARM DETAIL where it earns one — a hairline crack mended with a wrap of twine, the handle worn shiny in one place and dull everywhere else, a single mussel shell dropped inside it, one smooth pebble sitting in the bottom, a thread of dry weed caught under the rim.

━━━ VARIETY MANDATE — spread the ${n} entries across these ━━━
THE BUCKET AS THE MACHINE THAT MADE IT: upturned at the foot of a perfect new turret it has just left behind; sitting on top of a tower not yet lifted off; buried to its rim in the ramp with only the rolled rim and handle showing; tipped on its side with a cone of dry sand spilled out of it; hooked over a turret by its handle, swinging.
THE SHOVEL: standing upright and dead vertical in the notched top of the wall; driven into a dam at an angle with its blade gone; lying flat across the canal as a bridge with sand drifted over it; laid down on the wet sand with its own shape pressed into it where it has been lying; blade-down in the spoil heap with the handle cropped by the frame edge.
THE OTHER GEAR: a plastic rake dragged across the outer slope leaving a field of parallel grooves; a small watering can standing in the moat with water to its shoulder; a plastic sieve half-buried, its holes clogged solid; a wooden spoon standing in a turret like a mast; a driftwood plank laid over the moat and bedded into the sand at both ends; a length of orange twine run along the top of the wall between two shovels; a pennant of plain bright plastic twisting edge-on on a drinking straw.
THE PAIR: a bucket and a shovel together, one of them cropped by the frame, the other sand-caked and turned away.

${SHARED_TEXT_LAW}

${SHARED_MATERIAL}

${SHARED_SCALE_LAW}

${SHARED_SHAPE_LAW}

━━━ HARD RULES ━━━
- NO PEOPLE, NO HANDS, NO ARMS. A tool is never being held, never mid-pour, never mid-dig — an object in mid-action with nobody named renders a giant disembodied hand and forearm, measured twice. Every tool here is standing, lying, buried, tipped, wedged or hooked, ON ITS OWN.
- ONE OR TWO TOOLS PER ENTRY, NEVER MORE, and never a row or rank of them.
- Never name the colour of the light, a time of day, the sea, a gull, a crab, or what the water is doing — other axes own all of those.
- Never a branded or printed object. A bucket with a printed cartoon on it does not exist here.
- Describe only what IS present. Never write a negation of any kind.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no keys.`,
    });

  // ── 3. THE MOMENT — the beat, ACTOR NAMED FIRST. Gated ~0.8 in the path file. ──
  if (wants('moment'))
    await generatePool({
      outPath: 'scripts/bots/toybot/seeds/toybot_sand_moment.json',
      total: 25,
      append: true,
      batch: 25,
      metaPrompt: (
        n
      ) => `Write ${n} MOMENT entries for ToyBot's sand-toy-beachworks path. Each is the one thing that is happening RIGHT NOW to this sand structure. Each entry 18-26 words.

${SHARED_BAR}

${SHARED_FRAME}

━━━ THE ONE RULE THIS AXIS LIVES OR DIES ON ━━━
NAME THE ACTOR FIRST, AND THE ACTOR IS NEVER A PERSON. Measured twice in one run: a named action with no named actor renders the body part alone — a giant disembodied hand and forearm, duplicated at two scales. So every entry OPENS on the thing doing it, and the thing doing it is one of exactly four kinds:
  THE WATER — "the water breaches the dam and races down the canal…"
  A NAMED PART OF THE STRUCTURE — "the tall tower has slumped sideways and is still going…"
  A BEACH ANIMAL, named whole — "a herring gull stands in the middle of the top court…"
  A TOOL AS THE AGENT OF ITS OWN RESULT — "the upturned bucket stands beside the perfect turret it has just left behind…"
Never a passive with the actor missing ("the bucket has just been lifted"). Never "somebody", "a builder", "a hand". If you cannot name a non-human actor, the entry is wrong.

━━━ EVERY ENTRY IS BUILT IN THREE BEATS ━━━
1. THE ACTOR, named, first.
2. WHAT IT IS DOING, in the present, mid-motion.
3. THE CONSEQUENCE ALREADY VISIBLE — what is about to happen next, or what has already gone. "…everything downstream about to go." "…the crack already running two turrets further along." "…the ditch filling in seconds."
Plus ONE CHARM DETAIL where the entry earns one.

━━━ VARIETY MANDATE — spread the ${n} entries across these five families, none more than six times ━━━
THE WATER ARRIVING (the best ones live here): the water breaches the dam and races down the canal with everything below it about to go; water arrives down two canals and the two fronts meet head-on in the middle pool; the sea pushes a lace of foam in through the gate and the moat fills in seconds; the tide's first tongue reaches the outer wall and stops just short of it; the moat has filled higher than the canal and is now running backwards into it; water finds a rabbit-hole in the base of the wall and pours out of the far side of it.
THE STRUCTURE FAILING: the tall tower has slumped sideways and is still going, a crack running down it and two turrets already leaning; a whole stretch of the near wall has fallen in and the sand is still sliding; the canal's near side has given way and the water is cutting itself a new way through it; the top turret has dried pale and is shedding in a thin steady stream down its own flank; the dam is holding but weeping in four places at once.
THE BUILD SUCCEEDING: the upturned bucket stands beside a perfect new turret it has just left behind, still wet and sharp-edged; a driftwood plank lies newly across the moat, bedding itself into the sand at both ends; the shovel stands dead upright in the last gap in the parapet, the gap filled at last; the rake's parallel grooves run right up to the water and stop there, finished.
AN ANIMAL TAKING POSSESSION: a herring gull stands in the middle of the top court, entirely proprietorial, and does not move; a small green crab has moved into the doorway of the tallest tower and sits in it facing out; a line of dog paw prints goes straight up the ramp, over the wall and down the other side; three sandpipers run the length of the moat in single file; an oystercatcher stands on the dam with one leg up, unimpressed.
THE TOY GARRISON (this is ToyBot, and this is its own joke played straight): a green plastic toy soldier stands on the highest turret facing the incoming water alone; a small plastic dinosaur has been set on the dam and the water is already round its feet; a die-cast digger sits parked in the spoil heap at the end of its shift; a plastic knight lies fallen on the ramp where the wall came down on him.

${SHARED_TEXT_LAW}

${SHARED_SCALE_LAW}

${SHARED_SHAPE_LAW}

━━━ HARD RULES ━━━
- NO PEOPLE AND NO BODY PARTS. Never a man, a woman, a boy, a girl, a child, a person, people, a builder, a hand, an arm, a finger, a leg, a foot, a bare footprint. Paw prints and bird tracks are welcome; human prints are not.
- ONE MOMENT PER ENTRY. Two things happening at once fight each other and neither reads.
- Never name the colour of the light, a time of day, the tools' material, or the full massing of the structure — other axes own all of those. Refer to the structure only as "the wall", "the tower", "the turret", "the dam", "the canal", "the moat", "the ramp", "the top court".
- Describe only what IS present. Never write a negation of any kind.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no keys.`,
    });

  // ── 4. THE WATER — the moat, the canals, the tide. The money shot. ──
  if (wants('water'))
    await generatePool({
      outPath: 'scripts/bots/toybot/seeds/toybot_sand_water.json',
      total: 25,
      append: true,
      batch: 25,
      metaPrompt: (
        n
      ) => `Write ${n} WATER entries for ToyBot's sand-toy-beachworks path. Each describes the water in and around this sand structure — the moat, the canals, the wet sand it has left, and the sea as one band at a border. Each entry 16-24 words.

${SHARED_BAR}

━━━ WHY THIS AXIS EXISTS ━━━
Water is what makes a sand structure an engineering project rather than a pile. It is also the single biggest source of BEAUTY available here: the near-black mirror-bright wet sand the water has just left, a pool so still it doubles the towers upside down, a canal running fast and brown with sand in it. Every entry must be a real physical water state, described by its SURFACE and its DROPS, never as a noun-object.

━━━ EVERY ENTRY CONTAINS ━━━
1. WHERE THE WATER IS — in the moat, in the canals, in the linked pools, in the spillway, lying in the scrapes, soaked into the wall's foot, or the sea as one bright band along a single border with everything else running out of frame.
2. WHAT ITS SURFACE IS DOING — dead flat and doubling the towers upside down; running fast and heavy with sand in it; riding in with a thin lace of foam; wrinkling in the wind so the reflection breaks into stripes; sinking away into the sand faster than it arrives; seeping out of the wall's foot in a dark spreading stain; standing in the pools with one ring still crossing it from a single drip.
3. THE WET SAND IT HAS TOUCHED — near-black and mirror-bright where it has just left, holding the sky as a bright sheet; going pale in a widening band as it dries; a dark tide line along the wall showing how high it got.
4. ONE CHARM DETAIL where it earns one — a single fleck of foam riding round and round in one eddy; a thread of weed turning slowly in the moat; the water so clear in one pool that the shovel's shape is visible on the bottom of it; grains of sand turning over and over in the current.

━━━ VARIETY MANDATE — spread the ${n} entries across these, and label nothing ━━━
DEAD STILL: a moat dead flat, the towers doubled upside down in it perfectly; a pool so still one drip's rings are still crossing it; linked pools all standing level, each holding a different piece of sky; a moat brimming exactly to its lip and not moving.
RUNNING: a canal running fast and brown with sand in it; water falling from one pool to the next in eight small steps; a spillway carrying water down the outer slope in a bright moving skin; the moat draining out through a gap and cutting itself deeper as it goes.
ARRIVING: the sea running in over flat sand in a thin fast sheet; a low white line breaking at the bright band along the border; foam riding into the moat in a lace of bubbles; water pushing up through the sand from below so the whole floor darkens at once.
LEAVING AND LOSING: water sinking into the sand faster than it arrives, the canal drying from its far end back; the moat down to a dark stripe of wet in its own bottom; a tide line of stranded foam and shell grit along the wall.
THE WET SAND ITSELF: near-black and mirror-bright right to the frame edge, holding the whole sky as one sheet; a sheet of wet sand so bright the structure stands on its own reflection; wet sand going pale in a widening band as it dries; the sand's surface pocked all over with the marks of sinking bubbles.

${SHARED_SHAPE_LAW}

━━━ HARD RULES ━━━
- AXIS-CLEAN. This axis owns WATER AND WET SAND ONLY. Never name the colour of the light, a time of day, a tool, a bucket, a shovel, a gull, a crab, a toy figure, or the massing of the structure. Refer to the structure only as "the wall", "the tower", "the moat", "the canal", "the dam", "the pools", "the ramp".
- NO PEOPLE, NO HANDS, NO FEET, and never a swimmer, a bather or a boat.
- No glowing magic, no glitter, no sparkle effects, no neon. This is real water on real sand.
- Describe only what IS present. Never write a negation of any kind.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no keys.`,
    });

  // ── 5. THE LIGHT — owns the palette. The anti-bleach axis (a beach at noon is grey). ──
  if (wants('light'))
    await generatePool({
      outPath: 'scripts/bots/toybot/seeds/toybot_sand_light.json',
      total: 25,
      append: true,
      batch: 25,
      metaPrompt: (
        n
      ) => `Write ${n} LIGHT entries for ToyBot's sand-toy-beachworks path. Each describes the light on this sand structure — where it comes from, the two colours it puts in the frame, the one hard highlight it leaves, and what stays dark. Each entry 16-24 words.

${SHARED_BAR}

━━━ WHY THIS AXIS EXISTS ━━━
A beach in the middle of the day is a bleached, low-contrast, desaturated prior, and it failed the VIVID half of the bar in half the sibling path's frames. This axis is the anti-bleach lever and it has to commit hard. The light is ALWAYS LOW AND DIRECTIONAL — it comes in almost along the sand so every ridge, every notch and every shovel-scrape throws its shadow long. Measured on PixelBot ice-cavern: requiring every light entry to pit ONE WARM ACCENT against a cold field put a warm accent into 15 of 15 renders. Do the same here.

━━━ HOW EVERY ENTRY MUST BE BUILT ━━━
1. WHERE THE LIGHT COMES FROM AND ITS ANGLE, and it is always LOW — raking in almost along the sand from one side so every ridge's shadow runs long across the frame; from behind the structure so every top edge is rimmed and the near faces go dark; low from the water side so the wet sand throws it all back up; low and right behind the tallest tower so it flares round the tower's edge; low through sea mist so the air itself is lit.
2. TWO NAMED COLOURS, PITTED AGAINST EACH OTHER, at least one saturated and committed — hot orange against indigo shadow, brass against slate, cadmium yellow against cold blue-grey, rose against deep violet, gold against bottle-green, white-gold against a bruised purple. HALF the entries must be a WARM source against a COLD field. Never write "warm light" or "golden glow" on its own; name the colours.
3. THE ONE HARD HIGHLIGHT AND WHERE IT LANDS — a blown white specular along the wet cut face of the near wall; a hot line along the notched top of the wall; the wet sand throwing back one bright sheet; a rim of fire along a tower's shoulder; the water's surface carrying one narrow bright band.
4. WHAT STAYS DARK, because the drama is the contrast — every shovel-scrape holding its own black; the trench between the two walls unreadable; the far end of the structure dropping into shadow; the undersides of the turrets going almost black.

━━━ VARIETY MANDATE — spread the ${n} entries across these ━━━
Low hard sun raking in from one side, every ridge's shadow ten times its own height. Backlight from behind the structure, every top edge on fire and the near faces near-black. Sun low and directly behind the tallest tower so it flares right round the tower's shoulder. Late gold with cobalt sitting in every scrape. Storm light: a bruise-purple sky band with one break of hot yellow lying across the wet sand. Blue hour with the wet sand still holding the last of the orange. Low sun through thin sea mist so the air is gold and the shadows are indigo. A flat pearl sky with the wet sand a deep slate and one cadmium-red plastic edge as the only warm thing in frame. Hard low sidelight making the notched top of the wall a row of black teeth. Sun so low it comes UNDER the driftwood plank and lights the underside of it. Rose dawn light with the foam pink on its lit side and slate on the other. Green-gold light bounced up off bright wet sand into the shaded undersides. A narrow band of hot light lying across the sand exactly where the towers are, everything else cool. Deep teal shadow with brass light skimming only the very tops. Moonlight-cold silver on the wet sand with one warm amber patch low down. Cloud shadow over most of the frame and one hard sunlit stripe crossing the canal.

${SHARED_SHAPE_LAW}

━━━ HARD RULES ━━━
- AXIS-CLEAN. This axis owns LIGHT AND COLOUR ONLY. Never name a water state, a tool, a bucket, a shovel, a gull, a crab, a toy figure, or the massing of the structure. Refer to the scene only as "the structure", "the wall", "a tower", "the turrets", "the wet sand", "the dry sand", "a scrape", "the water".
- THE LIGHT IS NEVER HIGH, NEVER OVERHEAD, NEVER FLAT AND NEVER EVEN. Every entry is low and directional and says so.
- NO glitter, no sparkle, no glowing magic, no neon, no coloured gels, no rainbow, no lens flare as an effect. This is real sunlight on real sand.
- NO PEOPLE, and no named light fixture that would drag a built place in — no window, no lamp, no streetlight, no spotlight rig. Say where the light comes FROM by its angle and quality.
- Describe only what IS present. Never write a negation of any kind.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no keys.`,
    });

  // ── 6. BEACH LIFE — a gull, a crab, prints, or a toy garrison. Gated ~0.55 in the path file. ──
  if (wants('life'))
    await generatePool({
      outPath: 'scripts/bots/toybot/seeds/toybot_sand_life.json',
      total: 25,
      append: true,
      batch: 25,
      metaPrompt: (
        n
      ) => `Write ${n} BEACH LIFE entries for ToyBot's sand-toy-beachworks path. Each is ONE small inhabitant of this structure — a bird, a shore creature, a set of tracks, or a small plastic toy figure garrisoned on it. Each entry 14-20 words.

${SHARED_BAR}

${SHARED_FRAME}

━━━ WHY THIS AXIS EXISTS ━━━
A great public work needs somebody living on it, and on this path the residents are the beach's own wildlife and the toys that got left standing on the walls. They are also the picture's best ruler — a gull's own height against a tower says exactly how big this thing is. About two in five entries should be a small plastic TOY figure, because this is ToyBot and a toy soldier holding a sand rampart against the incoming tide is the path's own joke played completely straight.

━━━ EVERY ENTRY CONTAINS ━━━
1. THE INHABITANT, named whole and named concretely. A bird or an animal is named as a species a layperson knows — a herring gull, a black-headed gull, an oystercatcher, a sandpiper, a green shore crab, a hermit crab. A toy has its material welded to the noun before the animal or person word can do its damage — "a green plastic toy soldier", "a small moulded plastic dinosaur with its paint worn off its back", "a die-cast digger with the gloss scoured off it", "a chipped plastic knight".
2. WHAT IT IS DOING, mid-motion or held dead still, and it must be behaving like a RESIDENT of this structure — standing on the highest turret, walking the top of the wall, wedged in a turret's doorway, running the length of the moat, parked in the spoil heap, fallen on the ramp.
3. WHERE IT IS IN THE FRAME, because position is the size cue and an adjective is not — tiny at the far end of the wall, small and sharp on the near turret's top, low in the corner of the frame, halfway along and dead centre.
4. ONE SATURATED NAMED COLOUR on it where it has one, and ONE CHARM DETAIL where it earns one — one leg up and the other invisible, a barnacle riding on its shell, its own shadow running twice its length, sand still in the joints of its arms.

━━━ VARIETY MANDATE — spread the ${n} entries across these ━━━
THE BIRDS: a herring gull standing dead centre on the top court, entirely proprietorial; a black-headed gull walking the top of the wall one foot in front of the other; an oystercatcher on the dam with one leg up; three sandpipers running the moat in single file; a gull's own long shadow crossing four turrets.
THE SHORE CREATURES: a green shore crab wedged in the tallest tower's doorway facing out; a hermit crab hauling its shell up the ramp; a crab sitting in the bottom of the moat with only its eyes above water; a sand-coloured shrimp turning over in a pool; a razor shell standing where something pushed it in.
THE TRACKS: a line of dog paw prints going straight up the ramp and over the wall; bird tracks crossing and recrossing the whole top of the wall; a broad drag-mark where something heavy was hauled along the outer slope; the small deep prints of something that walked the whole length of the dam and back.
THE TOY GARRISON: a green plastic toy soldier standing on the highest turret facing the water alone; two plastic soldiers gone matte and chalky posted at either end of the dam; a small plastic dinosaur set on the parapet with the sea behind it; a die-cast digger parked in the spoil heap at the end of its shift; a chipped plastic knight lying fallen on the ramp; a moulded plastic diver standing in the bottom of the moat with water to his chest; a tiny plastic cow standing on the top court for no reason anybody can explain.

${SHARED_SCALE_LAW}

${SHARED_TEXT_LAW}

${SHARED_SHAPE_LAW}

━━━ HARD RULES ━━━
- ONE INHABITANT PER ENTRY. This axis is an accent, not a second cast.
- NO REAL PEOPLE AND NO BODY PARTS. A small moulded plastic toy figure is welcome and is not a person; a real man, woman, boy, girl or child is not, and no entry may name one.
- Never name the colour of the light, a time of day, a water state, the bucket, the shovel, or the massing of the structure — other axes own all of those.
- No glowing magic, no glitter. Real feathers, real shell, real moulded plastic, real sand.
- Describe only what IS present. Never write a negation of any kind.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no keys.`,
    });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
