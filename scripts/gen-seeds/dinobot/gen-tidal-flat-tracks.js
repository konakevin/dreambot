#!/usr/bin/env node
/**
 * gen-tidal-flat-tracks.js — the five bespoke pools for DinoBot `tidal-flat-tracks`.
 *
 * Usage:
 *   node scripts/gen-seeds/dinobot/gen-tidal-flat-tracks.js            # all five
 *   node scripts/gen-seeds/dinobot/gen-tidal-flat-tracks.js --pool sky # just one
 *
 * ═══ WHY ONE FILE FOR FIVE POOLS ═══
 * Every recipe here has to carry the SAME ban list, and the playbook's rule is "sweep your RECIPE
 * text, not just the generated output" — a ban that lives in one shared const cannot drift out of
 * one axis while staying in the others. That exact failure is playbook lesson 44: the off-camera
 * ruler ban rode only on the creature axis, so the ground / cast / charm pools independently
 * reached for "the width of a hand" and put a human noun on a no-humans bot.
 *
 * ═══ THE BANS AND WHAT EACH ONE COST SOMEONE ═══
 *  • TEXT-PRIOR SYNONYMS. This path's subject is literally made of them. Playbook lesson 1:
 *    PixelBot banned `rune` and still rendered gibberish from a charm detail reading "ringed with
 *    softly glowing MARKS". `mark / marking / imprint / impression / stamped / engraved / etched /
 *    inscribed` are all natural words for a track in sand and all of them are text priors. Lesson 45
 *    adds the process words — `ruled / drawn / traced / written / tide mark` — and `tide mark` is
 *    named in it verbatim. So the pools say HOLLOW / TRACK / TRACKWAY / TROUGH / FURROW / GOUGE /
 *    CRATER, never a synonym of "mark".
 *  • THE VANISHING POINT. Lessons 17/24/29: a path staged on a linear feature renders as a receding
 *    corridor with the subject tiled to a centre point, and lesson 29 proved the point can be
 *    authored into a NON-ground axis where the ground rule cannot reach it. A trackway is the purest
 *    linear feature there is, so `converg / vanishing / single point / apex / dead centre / straight
 *    down / recedes to a point` is banned in ALL FIVE recipes, including sky and air.
 *  • BODY-PART AND MODERN SCALE UNITS. amber-forest shipped 26 entries measuring things in "a hand's
 *    depth" / "fist-sized" / "the length of a small car" — a figure noun on a no-humans bot, and a
 *    modern-prior noun 66 million years early. In-world rulers only.
 *  • "BEACH". This is the path's own layperson trap (lesson 28/47, where a path's TITLE imported the
 *    exact prior it was built to avoid): "footprints on a wet beach" is one of the most photographed
 *    images in existence and they are HUMAN BARE FEET. So `beach` never appears, and the Flux-facing
 *    noun leads with the track's SHAPE AND SIZE — "a three-toed hollow as broad as a small pond" —
 *    with the word "footprint" arriving second or not at all. Same form as lesson 48's
 *    colour-first / species-last.
 *  • AMBER. DinoBot's saturation word — 167 of 200 entries (84%) of DINOBOT_PALEO_LANDSCAPE_BIOME
 *    carry it, which is why the cold snowline path was worth building at all. Rationed to a hard cap
 *    of 2 entries across the whole sky pool.
 *
 * ═══ LENGTH IS A RECIPE PROBLEM, NOT A TEMPLATE PROBLEM ═══
 * Playbook lesson 54: emitted prompt length predicts the grade (8 shortest renders 4.51, 7 longest
 * 3.87, everything >= 323 words 3.0-3.6). Lesson 55: Sonnet anchors word count on your EXAMPLES, not
 * on your number — a generator asking 35-50 words returned a median of 143 because its examples were
 * 55-70. DinoBot's two best new paths feed the brief 40-word pool entries and emit 275 (undergrowth)
 * and 261 (den) median words. So every example below is written INSIDE its own cap and the caps are
 * deliberately tighter than the bot's norm, and `--audit` prints the achieved medians so a pool that
 * blew past its cap gets regenerated rather than shipped.
 */

const fs = require('fs');
const { generatePool } = require('../../lib/seedGenHelper');

// ─────────────────────────────────────────────────────────────────────────────
// Shared recipe text. Every pool gets both blocks — see lesson 44 above.
// ─────────────────────────────────────────────────────────────────────────────

const WORLD = `━━━ THE WORLD ━━━
Earth deep in the age of dinosaurs, on a vast tidal flat at dead low tide: miles of rippled sand under a skin of standing water that lies mirror-still, cut across by the tracks of something enormous that has already walked through and gone. The only things that exist in this world are sand, water, sky, weather, stranded seaweed and shells, marine invertebrates, fish, small feathered dinosaurs, pterosaurs, small turtles and lizards, and far off the makers of the tracks. No mammals and no modern birds. The flats thrive entirely on their own, unobserved.`;

const BANS = `━━━ WORDS THAT ARE BANNED, AND WHY (these are hard — an entry containing one is rejected) ━━━
1. NEVER a synonym of writing. Banned: mark, marks, marking, imprint, impression, stamped, engraved, etched, inscribed, written, ruled, drawn, traced, sign, glyph, script, "tide mark". Image models read every one of these as LETTERING and paint gibberish text. Use instead: hollow, track, trackway, trough, furrow, gouge, groove, crater, dent, depression, pocket, basin.
2. NEVER a vanishing point. Banned: converge, converging, vanishing point, single point, one point, apex, meeting point, dead centre, dead center, "straight down", "recedes to a point", "leads the eye to a point". A line of tracks under those words renders as a corridor of identical copies marching up the middle of the picture. Everything in these pools runs ACROSS the picture and OUT of its side edges.
3. NEVER the word beach, and never "sandy shore". Footprints on a wet beach is a famous photograph of BARE HUMAN FEET. Say: the tidal flat, the flats, the wet sand, the sand-flat, the low-tide sand.
4. NEVER a body part as a unit of size or an actor: hand, handspan, finger, fingernail, fist, palm, arm, arm-span, knee-height, waist, thumb, boot, foot-long. On this bot a body-part unit is a human noun in the prompt.
5. NEVER a modern object, even as a comparison: car, bus, truck, bathtub, swimming pool, dinner plate, coin, table, door, road, boat, net, camera. This world is 66 million years before any of them.
6. NEVER a human, a person, a figure, a tool or a structure of any kind.
7. Write only what IS in the picture. No "no", "not", "without", "never", "empty of", "free of", "absent". An absence is not renderable — an image model backfills whatever you say is missing, so state the positive thing that is there instead.
8. NEVER the word "film" for the layer of water. It is the natural word for a thin sheet of liquid and it is also photographic film and a motion picture — and this bot's own style wrapper says "cinematic 35mm FILM still" in the first twenty words of every prompt, so the two senses collide inside one prompt with the wrong one in the attended region. Say instead: the standing water, the wet mirror, the sheen, the skin of water, the shallows, the water lying over the sand, the wet surface.
9. NEVER the word "sheet" on its own for the water, for the same reason (a sheet is paper). "A skin of water" and "the standing water" are safe.`;

const RULERS = `━━━ HOW TO STATE A SIZE ━━━
A size comparison only works if the ruler is IN the frame and its own size is fixed by something bigger. So the ruler for anything small is always a feature of the giant's own track — one of its three toe-notches, the ridge of sand shoved up at its rim, the slot a claw cut at a toe tip. For the track itself the ruler is a timeless natural thing: as broad as a small pond, as broad as a shallow pool, deeper than a fallen trunk is thick, a ridge of sand as long as a fallen tree.
And grant NOTHING a detail exemption. Never write "the nearest one showing its banded shell and jointed legs" — the thing you describe in the most anatomical detail is the thing that comes out biggest, measured at 20 of 30 entries on another path and worth 3 giant insects per 6 renders. Every small creature is a small clean shape at the ruler's size, the nearest one included.`;

const OUT_DIR = 'scripts/bots/dinobot/seeds';

// Word caps, declared BEFORE the recipes so each recipe interpolates its own number — the number
// and the examples underneath it therefore cannot drift apart when one is edited (lesson 55: the
// examples ARE the spec, so a cap restated by hand in prose is the one that goes stale).
const CAPS = {
  evidence: [26, 34],
  tenant: [16, 24],
  sky: [22, 30],
  reach: [14, 22],
  air: [9, 14],
};

function RECIPES_CAP(key) {
  const [lo, hi] = CAPS[key];
  return `${lo}-${hi} WORDS`;
}

// ─────────────────────────────────────────────────────────────────────────────
// THE FIVE RECIPES
// ─────────────────────────────────────────────────────────────────────────────

const RECIPES = {
  // ★ THE HERO. Leads the prompt. Carries the crosswise law in its own text — one of the three
  // layers lesson 24 requires (template rule 1, every hero seed, output-order item 1).
  evidence: {
    outPath: `${OUT_DIR}/dinobot_tidal_evidence.json`,
    metaPrompt: (
      n
    ) => `You are writing ${n} pool entries for a prehistoric image-generation path whose HERO IS THE EVIDENCE OF A GIANT THAT HAS ALREADY GONE. Each entry describes one formation left in the wet sand of a tidal flat by an enormous dinosaur, and how the water is filling it.

${WORLD}

━━━ EVERY ENTRY HAS EXACTLY THREE PARTS, IN THIS ORDER — three, not four ━━━
1. THE SHAPE AND THE SIZE FIRST, before any name for it. "A three-toed hollow as broad as a small pond, a claw-slot cut at each toe tip" — never open with the word footprint or track alone, because the shape and the size are what make it read as a giant's rather than anything else.
2. WHAT THE WATER IS DOING IN IT right now: brim-full and mirror-still, a thread of water still running in over a collapsed rim, half-full with the ribbed sand visible under it, the deepest one holding water so dark it reads black.
3. HOW IT CROSSES THE PICTURE, AND ITS CROP. The formation runs ACROSS the frame from one side edge toward the other, or curves away to a side edge. The nearest hollow is HUGE and sits in a named near corner and is CUT BY THE FRAME'S EDGE. State this in the entry — the crop is what keeps the near one big.

THREE PARTS IS THE WHOLE ENTRY. Do not add a fourth clause. A first draft of this recipe asked for a charm detail as well and every one of the 25 entries came back 10 words over cap, because four things will not fit in one sentence and the length always loses that fight. The charm lives in WHICH FORMATION you pick from the list below, not in an extra clause.

━━━ VARIETY — the charm IS the choice of formation. No two entries the same, spread across these kinds ━━━
A trackway of three-toed hollows crossing on a long curve; one colossal round pad-hollow near and cropped with its trackway shrinking away behind it; a long shallow furrow ploughed by a dragging tail with water threading along its bottom; a wide smooth dish where something heavy lay down; a churned crater where something rooted in the sand for shellfish with the spoil fanned around it; an arc of a dozen curved gouges from one tail sweep; a place where a foot skidded and shoved a ridge of sand ahead of it; a trackway the returning water is already softening; hollows punched clean through a pale dried crust into blue-black mud; a trackway walking into a shallow channel and out the far side; a hollow holding one perfect disc of reflected sky; a hollow with a heel-drag scored behind it; a hollow with a ring of dark shell-grit swirled round its inside; a hollow with a stranded glass-clear jellyfish resting in its bottom; a hollow the sand has slumped into from one side; a much smaller trackway crossing a giant one at an angle.

${RULERS}

${BANS}

━━━ LENGTH — ${RECIPES_CAP('evidence')} ━━━
Every entry is ONE sentence of ${RECIPES_CAP('evidence')}. Count the words. An entry over the cap is rejected and regenerated. These three examples are 29, 30 and 31 words — match their LENGTH exactly, not just their shape, because a writer anchors on the examples and not on the number:

"A three-toed hollow as broad as a small pond, claw-slots at each toe tip, brim-full and mirror-still, huge in the near left corner and cut by the frame's edge."
"A shallow furrow ploughed by a dragging tail, crossing from the left edge toward the right, a thread of water running along its bottom, its near end cropped away."
"A churned crater where something rooted for shellfish, spoil fanned round it in wet lobes, brim-full, filling the near right corner and cut by the bottom edge."

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no commentary.`,
  },

  // ★ THE CLEVER AXIS. The tiny life that has already moved into the evidence. Also the reason the
  // bot-wide `render` medium's "photoreal living animal with leathery scarred biological hide" and
  // the `promptSuffixByMedium.render` "the dinosaur is a REAL LIVING ANIMAL" have something
  // on-premise to land on — a path with no animal in frame invites the model to invent one.
  tenant: {
    outPath: `${OUT_DIR}/dinobot_tidal_tenant.json`,
    metaPrompt: (
      n
    ) => `You are writing ${n} pool entries for a prehistoric image-generation path. Each entry is the SMALL LIFE that has already moved into a giant dinosaur's water-filled track on a tidal flat. This is the charm of the picture — the detail the eye finds second and keeps looking at. A giant's footprint holding a whole tiny world.

${WORLD}

━━━ EVERY ENTRY ━━━
• COLOUR FIRST, SHAPE SECOND, and the creature's kind LAST or left out entirely. A species name does not carry its colour and a colour word sitting next to a species name loses to it every time — measured at cream, green and egg-yellow flowers all rendering pink. So write "a slate-blue crested wader", not "a blue Pteranodon".
• IT IS MID-ACTION. Something is happening: flipping, sidling, ploughing, thrashing, stealing, running, throwing water. Never standing, never posed, never gazing.
• ITS SIZE IS WELDED TO THE TRACK. The ruler is always a feature of the giant's own hollow: no longer than one of its three toe-notches, four of them fit inside a single toe-hollow, shorter than the slot one claw cut. Never an off-frame ruler.
• MANY IS SAFER THAN ONE. An image model gives each named subject a share of the frame, so three of a thing means three BIG things — a count under ten is the giant-insect generator. Prefer a dozen or more of anything small (crabs, shrimp, worm-coils, shells). Use a single creature only where it is naturally larger than a hollow's toe-notch anyway: a wader, a small feathered dinosaur, a stranded ray, a turtle.
• ONE per entry — one creature or one group, never two kinds.

━━━ VARIETY — spread across these, no two the same ━━━
A stranded silver-flanked fish thrashing in a brim-full hollow; two dozen pale crabs sidling over a rim in a loose stream; a slate-blue crested wader head-down in a hollow, fishing the water it holds; a rust-and-cream feathered dinosaur bathing in one, wings thrown out, water flying off it; a crust of blue-black mussels already cemented inside a claw-slot; thirty coiled sand castings ringing an inside wall; a cloud of glass-clear shrimp; a sand-coloured ray stranded flat in the deepest hollow, fins working; a plated arthropod ploughing its own tiny furrow beside the giant's; an olive turtle hatchling scrambling up a wet wall; an orange-legged running dinosaur working along the trackway, dipping into each hollow in turn; a looping snail groove written across a smooth floor by something still at the end of it; a coral-pink ammonite shell rolling in the shallows of one; a bronze-green lizard flat out on the ridge of shoved sand; a knot of striped worms writhing where the crust broke.

${RULERS}

${BANS}

━━━ LENGTH — ${RECIPES_CAP('tenant')} ━━━
Every entry is ONE clause of ${RECIPES_CAP('tenant')}. Count the words. Over the cap is rejected. These examples are all inside it:

"A silver-flanked fish stranded in a brim-full hollow, thrashing hard, no longer than one of its three toe-notches."
"Two dozen pale crabs sidling over the rim in a loose stream, four of them fitting inside one toe-hollow."
"A slate-blue crested wader head-down in a hollow, fishing the water it holds, its bill dripping."

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no commentary.`,
  },

  // ★ THE VIVID AXIS, and it owns the whole palette. A mirror-flat DOUBLES the sky, so this axis
  // decides roughly two thirds of the frame's colour. It REPLACES DinoBot's shared `LIGHTING` slot:
  // that pool is not axis-clean (it carries named dinosaurs and other biomes' geology), and the
  // measured anti-sober lever from FarmBot lambing-season is TWO COMMITTED COLOURS IN VISIBLE
  // OPPOSITION — every render there at 4.1 or above had that, and every sober one had light
  // described as even.
  sky: {
    outPath: `${OUT_DIR}/dinobot_tidal_sky.json`,
    metaPrompt: (
      n
    ) => `You are writing ${n} pool entries for a prehistoric image-generation path staged on a vast tidal flat at low tide. Each entry is THE SKY AND ITS DOUBLE. A mirror-still film of water lies over the sand, so whatever the sky does happens TWICE in the picture — once overhead and once underfoot. This axis decides the colour of the entire frame.

${WORLD}

━━━ EVERY ENTRY HAS THREE PARTS ━━━
1. THE SKY'S OWN ARCHITECTURE — a specific named cloud form or light event, not a mood. A black squall wall standing on the horizon. Bruised lobed mammatus hanging down. High feathered cirrus. A rain curtain with the sun behind it. The sun's disc sitting right on the horizon. A fork of lightning inside a violet wall. A moon up in a still-bright sky.
2. TWO COMMITTED COLOURS IN VISIBLE OPPOSITION, and what each one lands on. Not one colour, not a harmony, not a wash — two, fighting. "Molten copper along the water where the low sun rakes it, slate-blue in every ripple shadow." Light described as even, soft, diffused or uniform produces a flat sober picture every time; that is measured, not a preference. Saturated and committed. A grey picture is the one failure this axis exists to prevent.
   ⚠️ AND BOTH SIDES MUST BE A REAL HUE. A NEUTRAL — pewter, charcoal, iron, ash, steel-grey, slate-grey, chalk-white, ice-white, hail-white, bone-white, plain grey, plain white, plain black, silver — carries brightness but NO hue, so it cannot oppose anything chromatically; it only desaturates. "A pillar of magenta against a flat pewter sky" and "hail-white light under a dense charcoal base" are therefore NOT two colours in opposition, they are one accent in a grey picture, and both were measured rendering exactly that. Every entry needs TWO NAMED HUES from different parts of the colour wheel. A near-black or near-white may appear as a third accent, never as one of the two.
3. WHAT THE WATER DOES WITH IT — the standing film repeating the same two colours across the lower part of the picture, the water-filled hollows cutting dark holes through that reflection, the wet sand between them glossed and streaked with the same colours.

━━━ VARIETY — no two entries the same sky, and two entries may share AT MOST ONE colour word ━━━
Spread across: a low side-raking sun; a black storm wall with a lit gap beneath it; bruised mammatus over an acid-lit flat; a double rainbow standing on the water; pre-dawn rose over indigo; a squall's rain curtain lit from behind; coral cirrus over a turquoise film; a sun-dog or a light pillar; blue hour with one hot band left on the horizon; a far volcanic plume lit from below; a moon in a daylit teal sky; scattered cumulus each one doubled underfoot; lightning in a violet wall; the sun's disc on the horizon repeated exactly in the water; a green squall-light; hail-white light under a dark base.
The word "amber" may appear in AT MOST TWO of the ${n} entries — it is this bot's most over-used word and this path is built partly to get away from it. "Golden", "golden-hour" and "warm glow" as a standalone colour are banned outright: name the actual hue and the actual surface.

${BANS}

━━━ LENGTH — ${RECIPES_CAP('sky')} ━━━
Every entry is ONE sentence of ${RECIPES_CAP('sky')}. Count the words. Over the cap is rejected. These examples are all inside it:

"A black squall wall stands along the far edge with a hot yellow gap burning beneath it, and the water repeats both, yellow streaks between blue-black hollows."
"The low sun rakes in from the side, molten copper along every ripple crest, slate-blue in every ripple shadow, the film below doubling the stripes exactly."
"Bruised violet mammatus hang in lobes over an acid-green lit flat, the film below holding both, the hollows punching dark discs through the violet."

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no commentary.`,
  },

  // The far ground, stated as a BAND across the top — the structural anti-corridor axis. Roughly a
  // third of the entries put THE MAKER in it as a speck or a partial shape leaving frame, which is
  // how the giant appears without ever being the subject. This is a structural distribution rather
  // than a prose gate, because a prose compatibility clause loses to a pool pick every time.
  reach: {
    outPath: `${OUT_DIR}/dinobot_tidal_reach.json`,
    metaPrompt: (
      n
    ) => `You are writing ${n} pool entries for a prehistoric image-generation path staged on a vast tidal flat at low tide. Each entry is WHAT CLOSES THE PICTURE AT THE BACK — and it is always a BAND, LINE or STRIP running ACROSS THE TOP of the frame, edge to edge. Never a point, never a focus, never something the picture leads toward.

${WORLD}

━━━ EVERY ENTRY ━━━
• It is a BAND ACROSS THE TOP. Say so in the entry, in those terms: a band along the top edge, a line across the whole top of the picture, a strip running edge to edge. This is the load-bearing part — a far element described any other way turns the trackway in front of it into a corridor aimed at it.
• It is LOW and THIN. It occupies a narrow strip, not a third of the frame.
• Most entries are pure landscape or weather. About a THIRD of them put THE MAKER in the band: already tiny, or most of the way out of a side edge, and always smaller than the near hollow is wide. Lead with its body plan before any name, because an image model reliably knows only a handful of dinosaurs: a long-necked sauropod, a horned ceratopsian with a bony neck-frill, a low-slung armoured ankylosaur, a duck-billed hadrosaur with a broad flat toothless beak, a large theropod, a pterosaur with leathery wings. When the maker is in the band it is WALKING AWAY or crossing, and its own reflection stands under it in the water film.

━━━ VARIETY — no two the same, spread across these ━━━
A dark line of araucaria forest along the top edge; a low ridge of red dunes banded across the top; a black storm wall standing on the horizon strip; the returning tide as a thin white line edge to edge; a far channel glittering as a band; a line of stranded weed, shells and driftwood across the top; a far sandbar with pterosaurs strung along it like commas; a low volcanic cone smoking at one end of the band; a pale cliff of layered rock as a strip; a mangrove-less fringe of horsetails as a dark band; a bar of broken shell heaped edge to edge.
And the maker entries: a long-necked sauropod already tiny at the band with its reflection under it; a low armoured shape three-quarters out of the right edge, only hindquarters and tail still in frame; a string of specks along the band, each one doubled in the water; a large theropod crossing the band, water halfway up its legs; a duck-billed hadrosaur at the band's far end with its head down drinking; a pterosaur flock lifting off the band in a ragged line.

${BANS}

━━━ LENGTH — ${RECIPES_CAP('reach')} ━━━
Every entry is ONE clause of ${RECIPES_CAP('reach')}. Count the words. Over the cap is rejected. These examples are all inside it:

"A dark line of araucaria forest as a thin band along the top edge, edge to edge."
"The returning tide as a white line across the whole top of the picture, edge to edge."
"A long-necked sauropod already tiny in the band across the top, its reflection standing under it."

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no commentary.`,
  },

  // Axis-clean: AIR ONLY. No colour (the sky axis owns the palette and a second colour source is a
  // direct contradiction), no light, no creatures, no ground formations. This REPLACES DinoBot's
  // shared PREHISTORIC_ATMOSPHERES slot for the same reason the sky axis replaces LIGHTING.
  air: {
    outPath: `${OUT_DIR}/dinobot_tidal_air.json`,
    metaPrompt: (
      n
    ) => `You are writing ${n} pool entries for a prehistoric image-generation path staged on a vast tidal flat at low tide. Each entry is ONLY WHAT THE AIR IS DOING over the flats. Nothing else.

${WORLD}

━━━ AXIS-CLEAN — this is the whole rule ━━━
AIR ONLY. Every entry describes moving air, airborne water, haze or the surface texture the wind puts on the water film. It contains:
• NO colour word of any kind. Another axis owns the palette and a second colour source contradicts it.
• NO light, sun, shadow, glow or time of day.
• NO creature and no plant.
• NO ground formation, no hollow, no track, no horizon.
Just the air.

━━━ VARIETY ━━━
Salt haze thickening with distance; blown spume skidding over the water film; a column of midges standing over the flats; fine rain dimpling the whole film at once; wind ripping the film into a corduroy of close ripples; heat shimmer rising off dry sand; scraps of foam tumbling end over end; spray driving in low off the returning water; air so still the film lies like glass; a thin sea-fog lying at knee level over the flats (say "lying low over the flats" — no body-part units); pollen drifting in from inland; a dust of dried sand-grains streaming across the wet surface.

${BANS}

━━━ LENGTH — ${RECIPES_CAP('air')} ━━━
Every entry is ONE short clause of ${RECIPES_CAP('air')}. Count the words. Over the cap is rejected. These examples are all inside it:

"Blown spume skidding low across the water film in long streaks."
"Wind ripping the film into a close corduroy of ripples."
"Air so still the whole film lies like glass."

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no commentary.`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Guard sweep — run on the GENERATED OUTPUT, because the ban in the recipe is a
// nudge and the sweep is the control. Measured at MVP-25 on another path:
// Sonnet re-derived three explicitly-banned nouns with plain replacements
// written out beside them.
// ─────────────────────────────────────────────────────────────────────────────

const SWEEPS = [
  [
    'text-prior',
    /\b(marks?|marking|imprints?|impressions?|stamped|engraved|etched|inscrib\w*|written|ruled|drawn|traced|signs?|glyphs?|script)\b/i,
  ],
  [
    'vanishing-point',
    /\b(converg\w*|vanishing|apex|meeting point|dead cent(er|re))\b|\b(single|one) point\b|straight down|recedes? to a point/i,
  ],
  ['beach', /\b(beach|sandy shore)\b/i],
  // "film" and "sheet" for the water layer — see ban 8/9. `film` collides with this bot's own
  // "cinematic 35mm film still" wrapper, which sits at word ~18 of every single prompt.
  ['film-sheet', /\b(films?|sheets?)\b/i],
  [
    'body-part-unit',
    /\b(hand|handspan|finger|fingernail|fist|palm|arm|arm-span|knee|waist|thumb|boot)\b/i,
  ],
  [
    'modern-object',
    /\b(car|cars|bus|truck|bathtub|swimming pool|dinner plate|coin|table|door|road|boat|net|camera)\b/i,
  ],
  [
    'human',
    /\b(human|person|people|figure|man|woman|child|children|explorer|scientist|ranger|tourist)\b/i,
  ],
  // "no longer/wider/bigger/deeper than X" is a SIZE idiom, not a negation, and it is the exact
  // form the ruler rule asks for — excluded explicitly so the sweep stays readable. Everything
  // else beginning with a bare "no" is a real absence and an absence is what gets backfilled.
  [
    'negation',
    /\bno(?! (longer|wider|bigger|deeper|taller|larger|smaller|higher) than)\b|\bnot\b|\bwithout\b|\bnever\b|\bempty of\b|\bfree of\b|\babsent\b/i,
  ],
];

const AIR_EXTRA_SWEEPS = [
  [
    'air-colour',
    /\b(amber|golden|gold|copper|violet|magenta|indigo|turquoise|teal|slate|crimson|scarlet|coral|rose|orange|yellow|green|blue|red|purple|pink|grey|gray|white|black|silver|bronze)\b/i,
  ],
  ['air-light', /\b(sun|sunlight|light|shadow|glow|dawn|dusk|twilight|noon|moon|lit)\b/i],
];

const SKY_EXTRA_SWEEPS = [
  ['sky-even-light', /\b(even|uniform|diffused|soft light|flat grey|flat gray)\b/i],
];

// A NEUTRAL cannot be one of the two opposed colours — measured in round 2, where the only two
// grey/monochrome frames of the batch both came from an entry of exactly this shape. Reported
// per-entry rather than as a flat count, because the first version of this check FALSE-POSITIVED on
// the pool's single best entry ("bruised ochre-brown … a sharp electric cyan") by omitting `cyan`
// and `ochre` from its hue list, and that entry produced the round's best gemini render. Keep this
// list wide, and read the matched text before rewriting anything.
const NEUTRAL_WORD =
  /\b(pewter|charcoal|iron|ashen|ash|steel-grey|steel grey|slate-grey|chalk-white|bone-white|ice-white|hail-white|chrome-white|cream-white|grey|gray|silver)\b/i;
const HUE_WORD =
  /\b(saffron|violet|plum|chartreuse|lime|tangerine|apricot|peach|teal|cyan|turquoise|rose|pink|magenta|crimson|cherry|scarlet|vermilion|rust|copper|bronze|ochre|umber|amber|gold|yellow|olive|emerald|green|cobalt|prussian|indigo|cerulean|blue|purple|lilac|coral|flamingo|lemon|orange|red|brown)\b/gi;

function skyNeutralAudit(pool) {
  const bad = [];
  pool.forEach((e, i) => {
    const hues = [...new Set((e.match(HUE_WORD) || []).map((h) => h.toLowerCase()))];
    if (hues.length < 2 && NEUTRAL_WORD.test(e)) bad.push([i + 1, hues.join('+') || '(none)', e]);
  });
  return bad;
}

function words(s) {
  return String(s).trim().split(/\s+/).length;
}

function audit(key) {
  const { outPath } = RECIPES[key];
  if (!fs.existsSync(outPath)) {
    console.log(`  ${key}: (not generated yet)`);
    return;
  }
  const pool = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  const w = pool.map(words).sort((a, b) => a - b);
  const [lo, hi] = CAPS[key];
  const over = pool.filter((e) => words(e) > hi).length;
  const sweeps = [
    ...SWEEPS,
    ...(key === 'air' ? AIR_EXTRA_SWEEPS : []),
    ...(key === 'sky' ? SKY_EXTRA_SWEEPS : []),
  ];
  const hits = [];
  for (const [name, re] of sweeps) {
    for (const e of pool) {
      const m = re.exec(e);
      if (m) hits.push(`${name}:"${m[0]}" in "${e.slice(0, 70)}…"`);
    }
  }
  // Ration check — the bot's saturation word.
  const amber = pool.filter((e) => /\bamber\b/i.test(e)).length;
  console.log(
    `  ${key.padEnd(9)} n=${pool.length}  words min/med/max = ${w[0]}/${w[Math.floor(w.length / 2)]}/${w[w.length - 1]}  cap=${lo}-${hi}  over-cap=${over}  amber=${amber}  sweep-hits=${hits.length}`
  );
  for (const h of hits.slice(0, 12)) console.log(`      ⚠ ${h}`);
  if (hits.length > 12) console.log(`      … ${hits.length - 12} more`);
  if (key === 'sky') {
    const bad = skyNeutralAudit(pool);
    console.log(`      colour-vs-NEUTRAL (a grey-frame generator): ${bad.length}/${pool.length}`);
    for (const [i, hues, e] of bad) console.log(`      ⚠ #${i} hues=${hues} :: ${e.slice(0, 80)}…`);
  }
}

// Audit every pool against DinoBot's OWN bannedPhrases as well — a render dies at
// `banned-phrase-check` before model selection, and `bot_run_log` then stamps the DEFAULT model,
// which is a red herring that cost another path a day. The matcher is word-boundary since
// 2026-09-23, so "harvestman" is safe again, but a real human noun still kills the render.
function auditBotBans() {
  const bot = require('../../bots/dinobot');
  const { findBannedPhrase } = require('../../lib/botEngine');
  let bad = 0;
  for (const key of Object.keys(RECIPES)) {
    const { outPath } = RECIPES[key];
    if (!fs.existsSync(outPath)) continue;
    for (const e of JSON.parse(fs.readFileSync(outPath, 'utf8'))) {
      const hit = findBannedPhrase(e, bot.bannedPhrases);
      if (hit) {
        bad++;
        console.log(`  ⛔ ${key}: bannedPhrase "${hit.phrase}" matched "${hit.matched}" — ${e}`);
      }
    }
  }
  console.log(bad === 0 ? '  ✓ 0 DinoBot bannedPhrases hits across all pools' : `  ⛔ ${bad} hits`);
}

(async () => {
  const argv = process.argv.slice(2);
  const only = argv.includes('--pool') ? argv[argv.indexOf('--pool') + 1] : null;
  const auditOnly = argv.includes('--audit');
  const keys = only ? [only] : Object.keys(RECIPES);

  if (!auditOnly) {
    for (const key of keys) {
      const r = RECIPES[key];
      if (!r) throw new Error(`unknown pool "${key}" (have: ${Object.keys(RECIPES).join(', ')})`);
      console.log(`\n═══ ${key} → ${r.outPath} ═══`);
      await generatePool({
        outPath: r.outPath,
        total: 25,
        batch: 25,
        metaPrompt: r.metaPrompt,
        maxTokens: 8000,
      });
    }
  }

  console.log('\n═══ AUDIT ═══');
  for (const key of Object.keys(RECIPES)) audit(key);
  console.log('\n═══ DINOBOT bannedPhrases ═══');
  auditBotBans();
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
