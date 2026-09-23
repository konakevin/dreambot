#!/usr/bin/env node
// ToyBot bath-toy-flotilla (2026-09-22, SHADOW) — bath toys shot as an EPIC SEAFARING VOYAGE.
//
// WHY THIS PATH. Audited all 27 ToyBot builders: every one photographs toys on a DRY surface —
// a shelf, a table, a board, a diorama floor, a stage, inside a globe. There is no WATER path,
// and nothing in the roster is built on a comic mismatch of SCALE. This adds both. The premise:
// the bath is an OCEAN, the toys are a FLEET, and the camera shoots it like a maritime epic from
// down at the waterline. The delight is the gap between the heroic treatment and the fact that
// it is six inches of bathwater. The toys are played completely straight as vessels and crew.
//
// TWO DRIFTS EVERY POOL HERE IS WRITTEN AGAINST:
//
// DRIFT 1 — THE CONTAINER KNOB (playbook lesson 11, measured on ToyBot snow-globe-world at 6
// renders per position). A tub is the same class of object as a snow globe and both ends of the
// knob fail: naming it as an OBJECT ("a white bathtub seen from outside with toys in it") is a
// product shot; reducing it to an ABSTRACTION ("a vast expanse of water with no edge") deletes
// the path's identity and leaves a sea. What works is CONCRETE BUT CROPPED — the water SURFACE
// fills the frame, ONE identifying edge sits as a BAND along a border (the enamel rim across the
// top, a chrome tap looming like a lighthouse), everything else runs off the frame. So bathroom /
// floor / tiles / walls / room / whole tub / any person is absent from EVERY layer, and the
// `landmark` recipe below carries a FRAMING TEST — if a detail needs the whole tub in shot, it is
// rewritten or cut. (Lesson 17 is the same law applied to a linear stage: describe the SURFACE
// the stage is made of, filling the frame, far edge as a band along one border.)
//
// DRIFT 2 — "BATH TOY" IS A CUTE-PRODUCT PRIOR. Say "rubber duck" and Flux returns a clean studio
// render of one glossy duck on white. It is crowded out POSITIVELY, never by negation: a FLEET,
// weathered and chewed and in service, at sea, mid-voyage, in dramatic light. The material +
// condition + plurality live in the LEADING tokens of the path's prefix (the found-object-hull
// law from FaeBot acorn-boat-regatta: material is a PREFIX job, not a seed job), and every seed
// repeats it so the toy reading never evaporates into a real animal or a real boat.
//
// 6 pools x 25 (MVP):
//   toybot_bath_flotilla       — the FLEET (hero, leads the prompt; leads with its defining mass)
//   toybot_bath_sea_state      — the bathwater as an ocean: suds, swell, steam, drips (money shot)
//   toybot_bath_voyage_moment  — the story beat, mid-action (the joke lives here; gated ~0.75)
//   toybot_bath_landmark       — the ONE cropped identifying edge (THE CONTAINER KNOB)
//   toybot_bath_sea_light      — owns the palette; the anti-monochrome axis (a bathroom is white)
//   toybot_bath_sea_life       — other toys playing as wildlife (gated ~0.55)
//
// CHARM is deliberately NOT a 7th axis: it is a LAW inside flotilla / voyage_moment / landmark.
// Reason is word budget — ToyBot medians 245 emitted words and snow-globe-world already medians
// 284 on four axes; a 7th block plus its output-order item would push this path past ~330, where
// playbook lesson 18 says flux renders the first third. A charm detail also works better welded
// to the entry it decorates than rolled separately (lesson 14: an anti-text rule and a
// make-it-vivid rule aimed at the same surface must be ONE sentence).
//
// TEXT-PRIOR NOTE (path-specific, and it is severe): a bath toy is a BRANDED object and a BOAT is
// the strongest hull-name prior in the fleet. Worse, the bath-toy aisle is full of objects whose
// SHAPE IS TEXT — foam alphabet letters and numbers, bath books, thermometers, graduated
// measuring cups, numbered stacking cups, bottles and tubes of product. Playbook lesson 12 says a
// text-SHAPED surface cannot be described safely, only deleted, so every one of those classes is
// banned outright from every recipe here, and every vessel-bearing entry closes with its own
// positive plain-surface clause.
const { generatePool } = require('../../lib/seedGenHelper');

const SHARED_BAR = `━━━ THE BAR — THIS OUTRANKS "NO DEFECTS" ━━━
DreamBot exists to add whimsy and delight. Every entry must be PLAYFUL, ADVENTUROUS, VIVID, BEAUTIFUL and CLEVER. An entry that is on-brief, clean and merely competent is a FAILURE.
- THE TONE OF THIS PATH, AND IT IS THE WHOLE JOKE: the treatment is a MARITIME EPIC — heroic, dramatic, shot like a film about the sea — while the subject is bath toys in six inches of bathwater. Play the toys COMPLETELY STRAIGHT as real vessels and real crew on a real voyage. Never wink at it, never call anything cute, never make a joke in the words. The comedy comes entirely from taking it seriously.
- VIVID is literal: name committed saturated colour. Muted, tasteful grey is a failure.
- CLEVER: one charm detail the eye finds on second look, and it must make it THAT entry and no other.
- ADVENTUROUS: mid-action over parked, a story beat over a tableau.
- Show something never seen before, or take something familiar and redress it as something more interesting. For every entry ask: is this the obvious version of this idea, or the surprising one? Write the surprising one.`;

const SHARED_FRAME = `━━━ WHERE THE CAMERA IS — TRUE OF EVERY ENTRY ━━━
The camera is DOWN AT THE WATERLINE, an inch above the surface, inside the voyage. The water surface fills the whole frame and runs off all four edges. The bath itself is only ever ONE cropped edge along one border of the picture — a band of enamel rim, a tap rising out of frame — and the bathroom does not exist: no room, no wall, no floor, no tiles, no window, no shelf, no towel, no person, no hand, and never the tub seen from outside as a whole object.
Write from that vantage. Anything only visible from across the room, or from above the whole tub, does not belong in an entry.`;

const SHARED_MATERIAL = `━━━ MATERIAL TRUTH — THE TOY READING MUST NEVER EVAPORATE ━━━
Every vessel and every creature is a REAL PHYSICAL BATH TOY photographed close up in real water: moulded hollow rubber and plastic, a visible mould seam up the side, a squeaker hole, scuffed and sun-faded paint, tooth-marks along a beak or a fin, a chewed corner, a hairline crack, a patch worn back to bare pale plastic, a wind-up key, real water beaded on real rubber. Say that material out loud inside the noun phrase itself — "a dented hollow plastic shark", "a scuffed rubber duck with its mould seam showing" — never just "a shark" or "a duck", because a bare animal noun renders a real animal and the toy reading is lost.
These are WELL-LOVED and IN SERVICE: years of bathtimes on them. Never boxed, never pristine, never a glossy product on white.
Really photographed, with real texture. Never CGI, never a digital illustration, never a flat graphic.`;

const SHARED_TEXT_LAW = `━━━ THE MARKING LAW (load-bearing — a bath toy is a BRANDED object) ━━━
Nothing in frame carries readable writing. Where a surface would normally want a name, a number, a sign or a board, it instead wears ONE SMALL SIMPLE PAINTED SHAPE — a stripe, a star, an anchor, a chevron, a spot, a curl of gilt, a painted eye, a red beak — or it is PLAIN: one flat block of scuffed painted colour, bare pale plastic, smooth wet rubber.
ANY ENTRY THAT NAMES A VESSEL (a boat, ship, tug, barge, raft, submarine, liner, dinghy, ferry, hull) MUST CLOSE with its own plain-surface clause, because a vessel carries a separate hull-name prior the rest of the prompt does not reach: "…, its flanks and panels one plain block of scuffed painted colour wearing a single small painted shape." Phrase it POSITIVELY — never end on "and nothing else", which is a negation sitting inside a seed.
NEVER NAME ANY OF THESE OBJECTS — their SHAPE is itself a text prior and no wording makes them safe, so they are deleted rather than described: foam bath letters, foam numbers, alphabet or number toys, bath books, a thermometer, a measuring jug, a graduated or numbered stacking cup, a bottle, a tube, a jar, a tin, a can, a sachet, a soap wrapper, a carton, a name board, a notice, a chart, a dial, a gauge, a clock, a screen, a flag or life-ring bearing writing.
NEVER WRITE ANY OF THESE WORDS: plaque, nameplate, name plate, brass plate, label, labelled, sign, signage, lettering, letters, letter, number, numbered, numeral, digit, inscription, inscribed, engraved, etched, carved words, stamped, embossed text, moulded lettering, script, characters, marking, markings, marks, glyph, sigil, rune, title, placard, board, banner, motto, logo, brand, branded, trademark, date, price.`;

const SHARED_SHAPE_LAW = `━━━ NEVER DESCRIBE WATER, FOAM, STEAM OR LIGHT AS A NOUN-OBJECT ━━━
No "a sheet", "a curtain", "a wall", "a column", "a pillar", "a ribbon", "a sweep", "a rush", "a burst", "a blast", "a plume", "a beam", "a shaft", "a bar", "a cone", "a dome", "a disc", "a disk", "a plate", "an orb", "a bead of light", "a jewel". Every one of those renders as a solid object sitting in the picture instead of as water or light. Describe the SURFACES and the PARTICLES and what they are DOING instead.
No similes either — no "like a", "as though it were a", "shaped like". A borrowed noun renders as that literal object.`;

(async () => {
  // ── 1. THE FLEET — the hero. Leads the prompt, so it leads with its defining mass. ──
  await generatePool({
    outPath: 'scripts/bots/toybot/seeds/toybot_bath_flotilla.json',
    total: 25,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} FLEETS for ToyBot's bath-toy-flotilla path. Each describes a small fleet of bath toys under way across a bathwater ocean, shot like a fleet in a film about the sea. Each entry 34-46 words.

${SHARED_BAR}

${SHARED_FRAME}

━━━ HOW EVERY ENTRY MUST BE BUILT ━━━
1. OPEN WITH THE FLEET'S DEFINING MASS — the one biggest, most characterful vessel, named first with its material and its wear, because the first noun is the one the picture is built around. A hulking scuffed rubber duck riding high. A long low dented plastic crocodile. A squat hollow plastic tug with a bent funnel. A grey submarine half-awash. NEVER open with the bath, the water, the tap or the rim.
2. THEN 3 TO 5 MORE VESSELS, EACH A GENUINELY DIFFERENT SILHOUETTE — tall and round beside long and low beside flat and wide beside small and many. Say what each one IS and what its wear is. Then a scatter more of them further off, smaller, to give the fleet depth.
3. THE FORMATION, named plainly — in line abreast, in a long single file, in a loose V behind the leader, bunched tight in a huddle, strung out with one straggler, two up ahead and the rest hull-down behind.
4. COMMITTED COLOUR — name two or three real colours doing the work, at least one of them saturated and confident (cadmium yellow, ox-blood red, cobalt, teal, burnt orange, acid green, chalk white, deep plum).
5. ONE CHARM DETAIL that makes it THAT fleet and no other, the kind the eye finds on second look — the lead duck's beak scuffed pale from years of service, a wind-up key still turning on the frog at the back, one duck riding backwards, a plaster stuck over a crack in a hull, a smaller duck rafted alongside a bigger one with a twist of ribbon, one vessel sitting visibly lower in the water than the rest.

━━━ VARIETY MANDATE — spread the ${n} entries wide, no family more than twice ━━━
THE DUCK LINE: a squadron of scuffed rubber ducks in a V; one enormous old duck with a convoy of ducklings strung out behind it; ducks rafted into a floating island; two big ducks abreast with a gap between them where something has just gone down.
THE ODD FLEET: a wind-up plastic frog leading; a hollow plastic tugboat towing a sponge barge low with cargo; a washcloth rigged as a sail on a soap-dish raft, heavy and sagging with water; a bristle brush shipped upside down as a floating landing craft; an upturned beaker going down as a bathysphere; a net scrubby as a wallowing troop transport; a plastic pirate boat with a chewed mast; a wind-up penguin thrashing along astern.
THE PREDATOR AND THE DEEP: a dented hollow plastic shark running with the fleet, dorsal fin up; a grey submarine surfacing under the line with water sheeting off it; a long low rubber crocodile on the flank; a rubber octopus half-submerged with two arms over a hull.
THE ARMADA: a dozen small identical plastic fish moving as one body ahead of the big toys; a mixed-medium fleet where every single vessel is a different animal; a fleet of identical ducks with one impostor among them.

${SHARED_TEXT_LAW}

${SHARED_MATERIAL}

${SHARED_SHAPE_LAW}

━━━ HARD RULES ━━━
- NO PEOPLE, NO HANDS, NO FACES. A tiny moulded plastic diver or frogman figure riding a vessel is allowed and good; a real person is not, and no entry may name a man, a woman, a boy, a girl, a child, a person or people.
- The entry is purely the FLEET. Another axis owns the water and the weather, another owns the tap and the rim, another owns the light, another owns what is happening. Do not name suds, steam, a swell, a drip, a tap, a plug, a rim, a time of day or the colour of the light.
- The fleet is READABLE FRONT TO BACK — several distinct vessels, each identifiable, never one hero toy alone and never a blurred mass.
- Describe only what IS present. Never write a negation of any kind.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no keys.`,
  });

  // ── 2. THE SEA STATE — the bathwater as an ocean. The money-shot axis. ──
  await generatePool({
    outPath: 'scripts/bots/toybot/seeds/toybot_bath_sea_state.json',
    total: 25,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} SEA STATES for ToyBot's bath-toy-flotilla path. Each describes what the BATHWATER is doing right now, treated as a real ocean with real weather — made entirely out of bath physics. This is the money shot: the bath has to read as a SEA. Each entry 20-28 words.

${SHARED_BAR}

${SHARED_FRAME}

━━━ HOW EVERY ENTRY MUST BE BUILT ━━━
1. THE STATE OF THE SURFACE, named as a sea state and built from bath material — a long slow swell running the whole length of the water; a range of soapsud hills with real crests and troughs; foam broken into drifting floes with dark water between them; a dead-flat mirror calm with the whole fleet doubled in it; a confused chop with the surface shattered into a thousand facets.
2. WHAT IT IS DOING RIGHT NOW, mid-motion and caught a half-second in — a sud crest just tipping over and breaking into separate bubbles; the whole body of water leaning one way so the far end is high; a drip landing and throwing up a perfect crown of separate beads with rings running out from it; foam sliding apart to open a lane of clear water; the surface still ringing from something that has just gone under.
3. PER-PARTICLE, NEVER AS ONE MASS — say bubbles individually. "Each bubble its own thin skin", "thousands of separate small bubbles packed into a crest", "three enormous slow bubbles standing clear of the foam, each one carrying a whole warped reflection of the fleet". Per-particle wording is what makes it read as foam and spray instead of a white smear.
4. THE WATER ITSELF AS WATER — its real thickness and slowness, the meniscus climbing where it meets a hull, a skin of soap film on top, the shallow bottom readable down through it, sediment and flecks drifting low.

━━━ VARIETY MANDATE — spread the ${n} entries across these ━━━
Soapsud mountain ranges with peaks and valleys. A single towering sud crest about to break. Foam broken into pack ice with lanes between. A dead calm mirror. A confused chop. A long heavy swell with the fleet rising and falling out of step. Steam rolling low across the surface as sea fog, thick enough to hide the far end. Steam torn into rags and moving. A drain whirlpool turning slowly with foam spiralling into it. Bubbles the size of hot-air balloons standing over the fleet, each carrying a warped reflection. Soap film iridescence smeared in slicks across the surface. Spray coming off a crest as separate flung beads. A drip from above landing and throwing a crown. Rain — a hundred drips at once, each punching its own ring. The surface completely covered edge to edge in a thick foam blanket with only funnels and fins showing through. Clear water so still the fleet's own shadows lie on the bright bottom. Water sliding off something that has just surfaced, running in separate strings. A drift of loose foam scraps blowing across like tumbleweed. A pale slick of soap spreading out and flattening the chop as it goes. The water low and going down, foam stranded in a tide line along the enamel. Two bodies of water meeting where clear and foam collide in a line. The surface trembling all over in tiny rings from steam condensing and dropping back.

${SHARED_SHAPE_LAW}

${SHARED_MATERIAL}

━━━ HARD RULES ━━━
- AXIS-CLEAN. This axis owns the WATER and the WEATHER ONLY. Never name the colour of the light, a time of day, a sunset, a lamp, a window, a shadow's colour, a warm or cool cast — a separate axis owns all of that and naming it here contradicts what that axis rolled. Never name a vessel, a duck, a fin, a tap, a rim or a plug either, beyond the general word "the fleet" or "a hull" where the water is doing something TO it.
- NO glitter, no sparkle-effects, no glowing magic, no fairy dust. Real water, real soap, real steam.
- NO PEOPLE, NO HANDS. Nothing is stirring the water from outside the frame; whatever the water is doing, it is simply doing.
- Describe only what IS present. Never write a negation of any kind.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no keys.`,
  });

  // ── 3. THE VOYAGE MOMENT — the story beat. The joke lives here. Gated ~0.75 in the path file. ──
  await generatePool({
    outPath: 'scripts/bots/toybot/seeds/toybot_bath_voyage_moment.json',
    total: 25,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} VOYAGE MOMENTS for ToyBot's bath-toy-flotilla path. Each is ONE dramatic thing HAPPENING to the fleet right now — the beat that turns a row of floating toys into a scene from a film about the sea. Each entry 18-26 words.

${SHARED_BAR}

${SHARED_FRAME}

━━━ HOW EVERY ENTRY MUST BE BUILT ━━━
1. OPEN WITH AN ACTIVE VERB, mid-motion, caught a half-second in — "cresting", "going down", "surfacing", "heeling", "coming alongside", "running before", "hauling", "breaking through", "turning back".
2. ONE THING BEFORE AND ONE THING AFTER must be readable in the same frame. This is what makes it a story instead of a pose: the wake still fanning out behind, the ring still spreading where something went under, the water still sheeting off a hull, the gap in the line where the missing one was, the tow rope already taut, one straggler still far astern.
3. PLAYED ENTIRELY STRAIGHT AND ENTIRELY HEROIC. The wind-up frog is genuinely trying. The shark means it. The little duck is in real trouble. Write it as if the stakes were absolute. The humour is the reader's, never the writer's — no "adorably", no "comically", no "cute", no "as if".
4. COMMITTED COLOUR on the thing that moves — a cadmium yellow bow, an ox-blood red fin, a cobalt hull, a chalk-white belly, a brass key.

━━━ VARIETY MANDATE — spread the ${n} entries across these ━━━
HEROIC: the fleet cresting a soapsud wave, the leader airborne with water sheeting off its breast. Running before a breaking crest with the whole line stern-on. Breaking out of steam fog already close, bows first. Making landfall, the leader's beak just touching a grounded bar of soap. Passing the tap in line abreast, dwarfed by it.
DISASTER: a hollow plastic boat going down bow-first into a drain whirlpool, two scuffed rubber ducks watching from the rim of it at a safe distance. A washcloth sail collapsing heavy with water and slewing the raft broadside. A hull rolling right over with its worn keel coming up. Swamped to the gunwales and still going. A wind-up frog paddling hard against the current and losing ground, wake fanning wide behind it, key still turning.
THE PREDATOR: a dented plastic fin cutting between two hulls, both heeling away from it, foam curling off the fin. A rubber octopus taking a duck down by one foot with only its tail still showing. A submarine surfacing directly under the line and tipping the leader up bodily.
RESCUE AND SEAMANSHIP: a tug coming alongside a capsized duck with its line already across. Two vessels rafted together with a twist of ribbon while the swell runs under both. The big duck turning back for a duckling separated from the line. Hauling the plug chain taut as it lifts dripping out of the water. A moulded plastic diver figure going over the side of a beaker.
STRANGE: one duck spinning slowly in an eddy, facing entirely the wrong way, while the fleet goes on past. A whole fleet leaning the same way as the water tilts. A plastic whale rolling up under the fleet and sending a jet of water arcing over them. The fleet stopped dead in a mirror calm with its own reflection perfect beneath it.

${SHARED_TEXT_LAW}

${SHARED_MATERIAL}

${SHARED_SHAPE_LAW}

━━━ HARD RULES ━━━
- NO PEOPLE, NO HANDS, NO FACES. A tiny moulded plastic diver or frogman figure is allowed; never a man, a woman, a boy, a girl, a child, a person or people, and nothing is reaching in from outside the frame.
- Never name the colour of the light, a time of day or a lamp — a separate axis owns the light.
- Keep it to ONE beat. One thing is happening, described so the eye reads it in two seconds.
- Describe only what IS present. Never write a negation of any kind.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no keys.`,
  });

  // ── 4. THE LANDMARK — the ONE cropped identifying edge. THE CONTAINER KNOB. ──
  await generatePool({
    outPath: 'scripts/bots/toybot/seeds/toybot_bath_landmark.json',
    total: 25,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} LANDMARKS for ToyBot's bath-toy-flotilla path. Each is the ONE piece of the bath that is allowed into the picture, and it is always CROPPED — a coastal feature of this ocean rather than a bit of bathroom. Each entry 14-22 words.

${SHARED_BAR}

━━━ WHY THIS AXIS EXISTS, AND WHY IT IS THE WHOLE PATH ━━━
This is the single most load-bearing axis in the path, and both easy answers fail. If the bath is named as an OBJECT — a white bathtub with toys floating in it — the render is a product shot of a tub and the voyage is gone. If the bath is removed entirely — a vast expanse of water with no edge — the render is just a sea and the path's identity is deleted.
What works is CONCRETE BUT CROPPED: name the thing plainly, say WHERE IN THE FRAME it sits, and give the CROP as the counter-anchor. It is a BAND along one border of the picture, or a mass rising at one side with its top running out of frame. Never the whole object, never seen from outside, never with anything behind it.
Every entry therefore reads like a coastline: the enamel rim as a bright band along the top edge running out past both sides. The chrome tap rising out of the fog at the right of frame like a lighthouse, its top out of shot, one drip hanging from its lip. A grounded bar of soap as a white reef low in the frame.

━━━ THE FRAMING TEST — apply it to every entry BEFORE you write it ━━━
The camera is an inch above the water, with the water filling its frame. Could it actually SEE this? If the detail needs the whole tub in shot, or a view from across the room, or a look down from above, it FAILS and must be rewritten as something that meets the water or crops a border. (Verified on ToyBot snow-globe-world 2026-09-22: ten first-draft entries described the container from outside and every one of them dragged the whole gift-shop ornament into frame and turned the picture into a shop display.)

━━━ EVERY ENTRY CONTAINS ━━━
- THE FEATURE, named concretely with its material — white enamel, chipped cast iron, polished chrome, wet rubber, soap, sponge, sodden cloth, steel chain.
- WHERE IT SITS IN THE FRAME AND HOW IT IS CROPPED — a band along the top edge running out past both sides; rising at the right of frame with its top out of shot; low across the bottom corner; meeting the water at the far edge.
- ONE WEAR OR LIGHT NOTE — chipped through to grey iron, limescale crusted pale, rubbed mirror-bright, a hard white highlight riding its curve, gone soft and dark with water, a bloom of green where it drips.
- ONE CHARM DETAIL where it earns one — a single drip caught falling in mid-air, a strand of hair caught on a chain link, a tide line of stranded foam along the enamel, one chip in the rim worn round and smooth by thumbs.

━━━ VARIETY MANDATE — spread the ${n} entries across these ━━━
THE TAP AND ITS FITTINGS (the lighthouse family): the chrome tap rising at one side with its top out of frame and a drip hanging from its lip; the tap's spout mouth huge and close with a bead of water swelling on its lip; a mixer lever catching one hard white highlight at the extreme edge of frame; a shower hose coiled loose on the surface and disappearing off the edge; the tap's base where it meets the enamel, ringed in pale limescale, water fanning away from it.
THE RIM (the cliff family): the enamel rim as a bright band along the top edge of the picture, running out past both sides; the same rim chipped through to grey cast iron at one place; the bath's curved end wall rising as a smooth white cliff at the left of frame, cropped top and bottom; a rolled rim seen from just under it, thick and bright, with the wall dropping away into the water below.
THE PLUG AND THE DRAIN (the harbour family): the plug chain rising out of the water and running up out of frame, every link beaded; a black rubber plug sitting low as a dark island with its chain slack across the water; the drain grate dark and slotted just under the surface, water sliding down into it; the overflow opening as a dark round harbour mouth just above the waterline at the far edge.
THE GROUNDED THINGS (the reef and headland family): a grounded bar of soap, wet and rounded, as a white reef low in the frame; a loofah standing on end at one side as a rough sea stack; a sponge wedged into a corner as a soft dark headland; a bristle brush stood on its bristles as a floating forest; a sodden flannel draped over the rim and hanging down into the water as a heavy cloth cliff; the suction feet of a non-slip mat breaking the surface as a field of stepping stones.

${SHARED_TEXT_LAW}

${SHARED_SHAPE_LAW}

━━━ HARD RULES ━━━
- NEVER WRITE ANY OF THESE WORDS: bathroom, room, wall tile, tiles, tiled, floor, window, mirror on a wall, towel rail, shelf, cabinet, curtain, doorway, radiator, skirting, the whole bath, the whole tub, from outside, from above, seen across the room. Every one of them pulls the camera back out of the water and the voyage dies. This is the single most important rule in this axis.
- NO PEOPLE, NO HANDS, NO FEET, NO KNEES, NO LEGS. Nobody is in this bath.
- ONE FEATURE PER ENTRY. Two features fight for the border and both get cropped away.
- Describe only what IS present. Never write a negation of any kind.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no keys.`,
  });

  // ── 5. THE SEA LIGHT — owns the palette. The anti-monochrome axis (a bathroom is white). ──
  await generatePool({
    outPath: 'scripts/bots/toybot/seeds/toybot_bath_sea_light.json',
    total: 25,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} SEA LIGHT entries for ToyBot's bath-toy-flotilla path. Each describes the light on this little ocean — where it comes from, what two colours it puts in the frame, and the one hard highlight it leaves. Each entry 16-24 words.

${SHARED_BAR}

━━━ WHY THIS AXIS EXISTS ━━━
A bath is a white box full of clear water, so the default render of this path is grey, pale and washed out — technically clean and a total failure against the bar. This axis is the anti-monochrome lever and it has to commit hard. Measured on PixelBot ice-cavern 2026-09-22: requiring every light entry to pit ONE WARM ACCENT against a cold field put a warm accent into 15 of 15 renders. Do the same here.

━━━ HOW EVERY ENTRY MUST BE BUILT ━━━
1. WHERE THE LIGHT COMES FROM AND ITS ANGLE — low and hard raking straight across the surface from one side; from behind the fleet so every hull is rimmed and its front is dark; from below, bounced up off the bright enamel through the water; high and flat from directly overhead; through the water from the far end so the shallow bottom is lit and the fleet stands dark against it.
2. TWO NAMED COLOURS, PITTED AGAINST EACH OTHER, at least one saturated and committed — warm gold against deep teal, hot orange against indigo, cadmium yellow against a cold blue-grey, amber against bottle-green, rose against slate, brass against ox-blood. Half the entries must be a WARM source against a COLD field. Never write "warm light" or "soft glow" on its own; name the colours.
3. THE ONE HARD HIGHLIGHT and where it lands — a blown white specular on wet chrome, a hot line along the top of a swell, a bright rim along one duck's crown, the lit rings around a drip's impact, a sheet of light lying flat on the mirror calm.
4. WHAT STAYS DARK — because the drama is the contrast. The trough between two crests going almost black. The far end of the water dropping away into deep shadow. The underside of a hull unreadable.

━━━ VARIETY MANDATE — spread the ${n} entries across these ━━━
Low hard sun raking the surface from one side. Backlight from behind the fleet, every hull rimmed, spray lit right through. Sunset coming through the water from the far end so the shallow bottom glows amber and the fleet is in silhouette. A single warm bulb high and off to one side, everything else cold. Cold blue-white overcast with ONE ox-blood red toy as the only warm thing in frame. Green-gold light bounced up off the enamel underwater with teal shadow overhead. Hard light through thick steam so the fog itself is a lit body of gold and the water beneath it is indigo. Storm light: flat cool grey water with one break of hot yellow along a crest. Candle-coloured light from one side with cobalt shadow and a hot specular on the leader's crown. Moonlight-cold silver on the crests and warm amber deep in the troughs. Dawn light low and rose, the foam pink on its lit side and slate on the other. Light coming through a bubble and throwing a small bright disc of colour onto a hull. Hard clean top-light making every hull cast a sharp black shadow on the bright bottom. A dark frame with one narrow band of hot light lying across the water where the fleet happens to be. Deep bottle-green water with brass-coloured light skimming the very top of the swell. A cold cyan field with one hot amber reflection stretched and wobbling across it.

${SHARED_SHAPE_LAW}

━━━ HARD RULES ━━━
- AXIS-CLEAN. This axis owns LIGHT AND COLOUR ONLY. Never name a sea state, a suds formation, steam, a drip, a wave breaking, a vessel's action, a tap, a rim or a plug — other axes own all of those and naming them here contradicts what they rolled. Refer to the scene only as "the fleet", "a hull", "the water", "the surface", "a crest", "a trough".
- NO glitter, no sparkle-effects, no glowing magic, no neon, no coloured gels, no rainbow. This is real light on real water.
- NO PEOPLE, NO HANDS, and no named light fixture that would drag a room in — no window, no lamp shade, no ceiling, no spotlight rig. Say where the light comes FROM by its angle and quality, not by its housing.
- Describe only what IS present. Never write a negation of any kind.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no keys.`,
  });

  // ── 6. THE SEA LIFE — other toys playing as wildlife. Gated ~0.55 in the path file. ──
  await generatePool({
    outPath: 'scripts/bots/toybot/seeds/toybot_bath_sea_life.json',
    total: 25,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} SEA LIFE entries for ToyBot's bath-toy-flotilla path. Each is ONE other bath toy playing the part of the wildlife of this ocean — not part of the fleet, but a creature the fleet shares the water with. Each entry 14-20 words.

${SHARED_BAR}

${SHARED_FRAME}

━━━ THE ONE RULE THIS AXIS LIVES OR DIES ON ━━━
Every creature must be named as a TOY in the noun phrase itself, before the animal word does its damage. "A dented hollow plastic shark". "A scuffed rubber octopus with its mould seam showing". "A sun-faded plastic seahorse". A bare animal noun renders a REAL ANIMAL and the whole toy reading of the picture collapses — measured on SteamBot, where "a mechanical creature mimicking a real animal" rendered the real animal and dropped the metal every time, because the animal prior outweighs the material unless the material is welded to the noun.

━━━ HOW EVERY ENTRY MUST BE BUILT ━━━
1. THE TOY CREATURE, with its material and its wear welded to the noun — moulded hollow plastic, scuffed rubber, a visible mould seam, a squeaker hole, tooth-marks, sun-faded paint, a chewed fin, a patch worn back to pale bare plastic.
2. WHAT IT IS DOING, mid-motion, and it must be behaving like the WILDLIFE it is playing — running a line of foam alongside the fleet, standing vertical in the shallows, rolling up from below, living in a loofah with one arm out, breaking the surface and going under again, hanging motionless just under the meniscus.
3. WHERE IT IS RELATIVE TO THE FLEET — alongside, astern, ahead and closing, right under them, off at the edge of frame, already past.
4. COMMITTED COLOUR — one saturated named colour on it, and ONE CHARM DETAIL where it earns one: one eye painted crooked, a tooth-mark right through a fin, a patch of pale plastic where the paint has gone, a squeaker hole in its belly showing as it rolls.

━━━ VARIETY MANDATE — spread the ${n} entries across these ━━━
PREDATORS: a dented hollow plastic shark with its dorsal fin up, running a line of foam. A long low rubber crocodile, only eyes and back showing. A moulded plastic barracuda holding station.
BIG AND SLOW: a plastic whale rolling up under the fleet. A rubber hippo half-submerged with its back a wet grey island. A hollow plastic turtle with a cracked shell, slow and half-awash. A scuffed rubber walrus. A plastic narwhal.
STRANGE AND CHARMING: a scuffed rubber octopus living in a loofah with one arm out over the water. A plastic seahorse standing bolt upright in the shallows. A jelly-mould jellyfish drifting with the light coming right through it. A rubber snake coiling on the surface. A squeaky plastic crab walking a grounded bar of soap. A plastic starfish stuck to the wet enamel just above the waterline. A wind-up plastic fish thrashing hard at the surface. A hollow plastic pelican sitting high with its pouch chewed.
SHOALS AND SMALL: a dozen tiny plastic fish packed into a tight ball. A scatter of small moulded plastic minnows glittering just under the surface. Two rubber frogs watching from a sponge.
SURFACING AND DIVING: a plastic dolphin arcing clear with water running off it in separate strings. A rubber seal rolling with its pale belly up. A grey plastic manta passing underneath, seen down through clear water.

${SHARED_TEXT_LAW}

${SHARED_MATERIAL}

${SHARED_SHAPE_LAW}

━━━ HARD RULES ━━━
- ONE CREATURE PER ENTRY. This axis is an accent, not a second fleet.
- NO PEOPLE, NO HANDS, NO FACES. Never a man, a woman, a boy, a girl, a child, a person or people.
- Never name the colour of the light, a time of day, a sea state, a tap, a rim or a plug — other axes own all of those.
- No glowing magic, no glitter. Real moulded rubber and plastic in real water.
- Describe only what IS present. Never write a negation of any kind.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no keys.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
