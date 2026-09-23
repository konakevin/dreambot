#!/usr/bin/env node
// ToyBot snow-globe-world (2026-09-22, SHADOW) — a whole little world sealed inside a snow globe.
//
// WHY THIS PATH. ToyBot has 23 live paths and every one of them photographs toys ON a surface —
// a shelf, a table, a diorama, a floor. A snow globe is a CONTAINED WORLD seen through curved
// glass: a different optical and compositional problem (refraction, a rim of light for a frame,
// weather suspended in water), which is why it earned a path instead of a bucket.
//
// THE DULL FAILURE THIS PATH IS DESIGNED AGAINST: a snow globe photographed on a shelf is the
// gift-shop product shot — competent, lifeless, and something everyone has seen. So every pool
// here treats the WORLD INSIDE as a real place with weather and a story, and the glass as a
// window rather than an object. The hero pool NEVER leads with the globe-as-object (that
// front-load collapses the interior to a blurred prop — the bubble-bot environment-collapse law).
//
// 4 pools x 25 (MVP):
//   tinybot_snow_globe_worlds   — the sealed world inside (the HERO, leads the prompt)
//   tinybot_snow_globe_weather  — what the water and the flakes are doing (the MONEY SHOT)
//   tinybot_snow_globe_vessel   — the dome, base, wear, trapped bubbles, refraction
//   tinybot_snow_globe_moments  — a story beat playing out inside (gated ~70% in the path file)
//
// TEXT-PRIOR NOTE: a snow globe base is a plaque magnet, and the surface you forget to describe
// is the one that gets lettering. Every recipe below therefore handles its own signable surfaces
// POSITIVELY and PICTORIALLY (a painted picture, or plain bare timber) and the recipe — never the
// entry text — carries the ban list.
const { generatePool } = require('../../lib/seedGenHelper');

const SHARED_BAR = `━━━ THE BAR — THIS OUTRANKS "NO DEFECTS" ━━━
DreamBot exists to add whimsy and delight. Every entry must be PLAYFUL, ADVENTUROUS, VIVID, BEAUTIFUL and CLEVER. An entry that is on-brief, clean and merely competent is a FAILURE.
- VIVID is literal: name committed saturated colour and dramatic light. Muted, tasteful grey is a failure.
- CLEVER: one charm detail the eye finds on second look, and it must make it THAT entry and no other.
- ADVENTUROUS: mid-action over parked, a story beat over a tableau.
- Show something never seen before, or take something familiar and redress it as something more interesting. For every entry ask: is this the obvious version of this idea, or the surprising one? Write the surprising one.`;

const SHARED_TEXT_LAW = `━━━ THE MARKING LAW (load-bearing) ━━━
Nothing in frame carries readable writing. Where a surface would normally want a name, a sign, a board or a plate, the maker has given it ONE SMALL PAINTED PICTURE instead — a painted sprig, a loaf, a fish, a boot, a star, a crescent moon, a bird, a sun, a curl of gilt scrollwork — or the surface is left PLAIN: bare polished timber, a flat block of painted colour, smooth unmarked glass.
THE SHOPFRONT BAND is the surface that catches this out. Any entry with a shop, a bakery, a stall, a station or a workshop in it must say what the wide flat band ABOVE its windows is wearing — one small painted picture, or a plain block of colour. (Verified 2026-09-22: a bakery fascia came back lettered on a render whose door panel, shutters and hull were all correctly pictorial. The surface you forget to describe is the one that gets lettering.)
NEVER write any of these words: plaque, nameplate, name plate, brass plate, label, sign, signage, lettering, letters, inscription, inscribed, engraved, etched, carved words, stamped, script, characters, marking, marks, glyph, sigil, rune, title, placard, board, banner with words, motto, date stamp, maker's mark, price.
AND — any entry that names a VEHICLE (a boat, ship, train, locomotive, carriage, caravan, wagon, cart, sleigh, sledge, balloon, bicycle, barge, tram, aircraft) must CLOSE with its own plain-surface clause, because a vehicle carries its own separate text prior (a hull name, a tender, a fuselage, a plate, a destination panel) that the rest of the prompt does not reach: "…, its flanks and panels one plain block of painted colour wearing a single small painted picture." (Verified 2026-09-22: a fishing-boat hull came back lettered even with the pictorial rule stated in the template's output order. Note the clause is phrased POSITIVELY — the first draft ended "and nothing else", which is a negation sitting in a seed.)`;

const SHARED_MATERIAL = `━━━ MATERIAL TRUTH ━━━
This is a REAL PHYSICAL OBJECT photographed close up. The little world is a hand-painted miniature: modelled plaster and resin and painted tin, visible brush-marks, a rounded hand-sculpted look, flock snow glued to the roofs, tiny grain-of-wheat bulbs behind the windows. The dome is real curved glass with real thickness. The water is real water. Never CGI, never a digital illustration, never a flat graphic.`;

(async () => {
  // ── 1. THE WORLD INSIDE — the hero. Leads the prompt, so it leads with its own mass. ──
  await generatePool({
    outPath: 'scripts/bots/tinybot/seeds/tinybot_snow_globe_worlds.json',
    total: 25,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} SEALED LITTLE WORLDS for ToyBot's snow-globe-world path. Each describes a whole tiny world that lives inside a glass dome — as a REAL PLACE with its own geography, its own lights and its own weather, seen through the glass from inches away. Each entry 30-44 words.

${SHARED_BAR}

━━━ HOW EVERY ENTRY MUST BE BUILT ━━━
1. OPEN WITH THE WORLD'S OWN DEFINING MASS — the thing that makes it that place: the steep hillside the village climbs, the black rock the lighthouse stands on, the crag the castle sits on, the caldera, the reef wall, the ridge the railway wraps around. NEVER open with the globe, the dome, the glass, the base or the water. The world is the subject; the glass is only the window we look through.
2. SCALE TRICKERY — one cue that proves the little world is a real place that continues past the frame: its own lit windows in rows, a road that goes somewhere and disappears, a mountain with a far side, a second bay beyond the headland, a stair that climbs out of sight, terraces stacking back into haze.
3. COMMITTED COLOUR — name two real colours doing the work, at least one of them saturated and confident (teal, ox-blood red, cobalt, burnt orange, acid green, brass-gold, deep plum, buttercup yellow).
4. ONE CHARM DETAIL that makes it THAT world and no other — a clever small thing the eye finds second: a boat hauled up on the ice with its oars still in it, a washing line strung between two rooftops, one window with its curtain open and a lit table inside, a cat-sized dragon asleep on the warm chimney, a ladder left leaning on the observatory dome.

━━━ VARIETY MANDATE — spread the ${n} entries wide across these, no family more than twice ━━━
Snow worlds: an alpine village climbing a hillside with a switchback road; a frozen canal town with bridges and a lit skating pond; a pine forest with a sleigh road cut through it; a harbour with fishing boats iced into the water; a cliff monastery in cloud; a railway looping a snowbound mountain; a bakery street at blue dawn; a fir plantation with one lit cabin.
IMPOSSIBLE WORLDS (about a third of the entries — these are the best ones): a whole city at night with a million lit windows; a thunderstorm standing over one tiny farm; a green aurora over a tin-roof cabin; a summer meadow where drifting pollen and dandelion seed replace the snow; a coral reef with silt drifting instead of flakes; a volcano dropping warm ash on a black-sand village; a carnival with a lit ferris wheel turning; a desert caravan under drifting sand; a moon base with slow grey dust; a jungle temple in a downpour; a cherry orchard in petal-fall; an ocean liner mid-voyage with spray coming over the bow; a hot-air-balloon meet lifting off a green field; a castle on a crag with its drawbridge lit; a valley of long-necked dinosaurs under falling ash; a rooftop city of chimneys with pigeons wheeling.

${SHARED_TEXT_LAW}

${SHARED_MATERIAL}

━━━ HARD RULES ━━━
- NO PEOPLE, NO ANIMALS AS THE SUBJECT in these entries. Inhabitants are supplied by a separate axis, and naming figures here would put two casts in one frame. Describe the PLACE and its own lights, roads, boats, roofs and terraces. (A charm detail may include a sleeping creature or a bird, but never a crowd and never a figure doing something — that is the other axis's job.)
- NO snow globe, dome, glass, water, base, pedestal or shelf vocabulary. Another axis owns the vessel. This entry is purely the world.
- The world is DEEP and SHARP, with a far side and a distance — never a single object on a bare white mound.
- Describe only what IS present. Never write a negation of any kind.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no keys.`,
  });

  // ── 2. THE WEATHER IN THE WATER — the money-shot axis. ──
  await generatePool({
    outPath: 'scripts/bots/tinybot/seeds/tinybot_snow_globe_weather.json',
    total: 25,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} WEATHER-IN-THE-WATER entries for ToyBot's snow-globe-world path. Each describes what the water inside a glass dome and the stuff suspended in it are DOING right now, and how the light is catching it. This is the money shot of the whole path: the flakes must read as REAL WEATHER inside a real place, not as sparkles in a toy. Each entry 20-30 words.

${SHARED_BAR}

━━━ HOW EVERY ENTRY MUST BE BUILT ━━━
1. WHAT THE SUSPENDED STUFF IS, and describe it PER PARTICLE, never as one mass: "each flake a separate soft white speck", "thousands of individual specks", "one large slow flake close to the glass and a haze of fine ones behind it". Per-particle wording is what makes it read as weather instead of a white streak.
2. WHAT IT IS DOING RIGHT NOW, mid-motion and caught: hanging almost still, tumbling slowly, drifting past in a long slow spiral around the steeple, settling in a soft ridge along a rooftop, rising back up off the ground, packed thick on one side of the world and thin on the other, all of it tilted the same way as though the whole world leans.
3. THE LIGHT ON IT — warm light coming in low from one side and lighting each passing speck from behind while the far side of the water stays deep and dark, or cold blue light from above, or the world's own lit windows throwing little warm haloes into the water around them. Name TWO colours.
4. THE WATER ITSELF as water — faintly thick and slow, a soft drift of sediment low down, the surface of the world seen slightly wavering through it.

━━━ VARIETY MANDATE — spread the ${n} entries across these ━━━
A full blizzard, thick enough to half-hide the far side of the world. A last few flakes after the storm, most of the snow already settled. Snow rising rather than falling, blown up off the roofs. One enormous slow flake close to the glass, huge and soft. A whole side of the water packed with a white wall of snow while the other side is clear. Warm ash instead of snow, grey and drifting down. Drifting pollen and dandelion seed, gold in the light. Cherry petals turning as they fall. Fine silt and bubbles rising through a reef. Grey moon dust hanging with no weather to move it. Rain — a thousand short bright streaks slanting the same way. Golden sparks lifting off a bonfire. Bright green flecks of aurora light in the water itself. Bubbles trapped and rising one behind another, angled off vertical. Sand, warm and brown, drifting over a caravan. Confetti over a carnival. Fireflies instead of flakes, each a warm pinpoint. Soap-bubble iridescence in the water where the light hits it. Snow with a tiny spin to it, as though the whole world was set down a moment ago.

━━━ HARD RULES ━━━
- Never describe the motion or the light as a noun-object: no "a rush", "a sweep", "a swoosh", "a burst", "a blast", "a ribbon", "a sheet", "a curtain", "a column", "a pillar", "a wall of light", "a beam", "a shaft", "a bar", "a cone" — those render as solid white objects instead of weather. Describe the PARTICLES and the LIT SURFACES instead. (Verified 2026-09-22: "bubbles rising in a tilted column" and "a curtain of spray" both had to be hand-rewritten out of the first MVP-25.)
- Never describe an individual particle by a borrowed geometric noun — no "disc", "disk", "plate", "ring", "orb", "coin", "bead", "jewel", "gem". A flake is a flake, a petal is a petal, a scrap of confetti is a scrap. A geometric noun renders that literal object. (Verified 2026-09-22: three entries called flakes, petals and confetti "discs".)
- Never use a simile for the light or the flakes ("like a", "as though it were a", "shaped like"). A borrowed noun renders as that literal object.
- No glowing magic, no fairy dust, no glitter, no sparkle-effects. This is real physical stuff in real water lit by real light.
- Never name the globe, the dome, the glass, the base, the shelf or the room. Only the water, what is in it, and the light.
- Describe only what IS present. Never write a negation of any kind.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no keys.`,
  });

  // ── 3. THE VESSEL — the dome, the base, the wear, the refraction. Sits LAST in the prompt. ──
  await generatePool({
    outPath: 'scripts/bots/tinybot/seeds/tinybot_snow_globe_vessel.json',
    total: 25,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} VESSEL DETAILS for ToyBot's snow-globe-world path. Each is ONE small honest detail of the glass dome or its base — the thing that proves this is a real, old, loved, hand-made object and not a stock ornament. Each entry 16-26 words.

${SHARED_BAR}

━━━ WHY THIS AXIS EXISTS ━━━
The camera is TWO INCHES from the glass and the world inside fills the frame, so the only glass we ever see is its own CURVE across the top and sides of the picture and the BRIGHT WET BAND OF REFRACTION bending the extreme corners — plus, at most, a band of the base's own painted colour along the very bottom edge. This axis supplies the one detail that makes that curve and that band beautiful and specific.

━━━ THE FRAMING TEST — apply it to every entry before you write it ━━━
Could a camera two inches from the glass, with the little world filling its frame, actually SEE this? If the detail needs the whole object in shot — its feet, its underside, two of its sides, its overall turned shape — it FAILS and must be rewritten as something at the curve or along the bottom edge. (Verified 2026-09-22: ten first-draft entries described the object from outside, and each one dragged the whole gift-shop ornament into frame.)

━━━ VARIETY MANDATE — spread the ${n} entries across these ━━━
THE GLASS: three old air bubbles trapped high in the curve, sitting still against it. A hairline crack across the curve at the top of frame, mended long ago with a fine seam of gold. Water gone faintly amber with age so the whole world reads warm and old. A soft ring of tiny scratches low in the glass where it has been picked up a thousand times. The glass thick and slightly green where it bends away. One bright warm highlight riding the curve at the upper left.
THE REFRACTION (the beautiful work): the row of lit windows repeating around the curve as a smear of warm dots. The far edge of the world bending and stretching where the glass turns away at the side of frame. The whole scene doubling faintly in the thickness of the glass. A cold blue rim-light along the curve at the very top of frame. The world's brightest light throwing a small star of flare across an upper corner through a flaw in the glass. The top of frame thick and slightly rippled from mouth-blown glass, softening what sits just behind it.
THE BASE, ALWAYS AS A BAND ALONG THE VERY BOTTOM EDGE OF THE FRAME: a band of dark walnut worn to a pale stripe by thumbs. A black-painted band carrying one small painted fish in cadmium red. A polished mirror-bright brass band with verdigris gone deep in its grooves. A band that blazes post-box red at one end and has faded to dusty pink at the other. Ribbed cream porcelain with one small clean chip showing the buff clay beneath. A hand-painted cobalt band with the brushstrokes still readable as loose arcs. A thin strip of green baize lifted and curling up into a dark scroll at the lowest corner. A sliver of pale birch meeting a sliver of dark walnut where two mismatched pieces were fitted. A little winding key's shaft crossing the lower right corner, rubbed silver-bright. A thin ring of old sealant gone amber and crystalline where the glass meets it.

━━━ EVERY ENTRY INCLUDES ━━━
- THE DETAIL, named concretely with its material.
- WHERE it sits in the frame — along the very bottom edge, around the outer rim of the picture, high in the curve, at the extreme edge of frame.
- ONE WEAR OR LIGHT NOTE — rubbed bright, chipped, sun-faded, gone green, curling, catching a warm highlight, gone faintly amber.

${SHARED_TEXT_LAW}
The base especially: describe its TOP and its SIDE as plain polished or painted surfaces, or carrying at most one small painted picture. This is the single most important rule in this axis.

━━━ HARD RULES ━━━
- NEVER write any of these words: dome, globe, snow globe, ornament, stand, pedestal, shelf, mantelpiece, desk, table, underside, feet, bun feet. Every one of them drags the whole object into frame and turns the picture into a shop display with the world inside gone to mush. Say "the curve", "the glass", "the band along the bottom edge".
- NO PEOPLE, NO HANDS holding it.
- Describe only what IS present. Never write a negation of any kind.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no keys.`,
  });

  // ── 4. THE MOMENT INSIDE — the story beat. Gated ~70% in the path file. ──
  await generatePool({
    outPath: 'scripts/bots/tinybot/seeds/tinybot_snow_globe_moments.json',
    total: 25,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} MOMENTS INSIDE for ToyBot's snow-globe-world path. Each is ONE small thing HAPPENING inside the sealed world right now — the story beat that makes the little place alive rather than a model. Each entry 18-28 words.

${SHARED_BAR}

━━━ HOW EVERY ENTRY MUST BE BUILT ━━━
1. OPEN WITH AN ACTIVE VERB, mid-motion, caught a half-second in: a sleigh mid-turn on the hill road with snow kicking off its runners; a skater mid-stride with a long curved scratch on the ice behind him; a lit procession winding up a hill with the front of it already round the bend; a lighthouse beam swinging out over the water and catching the spray.
2. ONE THING BEFORE AND ONE THING AFTER must be readable in the frame — the scratch behind the skater, the tipped bucket, the door left standing open, the ladder still leaning, the wake spreading behind the boat, the lantern set down on the step. This is what makes it a story instead of a pose.
3. EVERY FIGURE IS A TINY HAND-PAINTED MINIATURE, said so in the entry — "a tiny painted figure no bigger than a grain of rice", "two painted figures", "a painted skater", "a painted lamplighter". Faces are two dabs of paint. Name them by their ROLE (skater, lamplighter, fisherman, carol singer, sledder, postie, baker, bellringer, stationmaster, chimney sweep), never as a man, a woman, a girl, a boy or a person.
4. COMMITTED COLOUR on the figure or the thing that moves — an ox-blood red coat, a buttercup-yellow sledge, a cobalt door, a brass bell.

━━━ VARIETY MANDATE — spread the ${n} entries across these ━━━
A sleigh mid-turn, a sledge mid-run down a street, a skater mid-stride, a toboggan pile-up, a snowball caught in the air. A lit procession winding up a hill; carol singers in a ring around a lamp post; a lantern being hung on a tree. A lighthouse beam swinging; a fishing boat coming in with its wake behind it; a rowboat being pushed off the ice. A train mid-tunnel with its lit windows showing; a level-crossing gate half-swung. A ferris wheel turning with one car at the top; a carousel mid-spin. A chimney sweep halfway up a ladder; a shutter blown open and banging; washing whipping off a line. A ballooning crew mid-launch with the envelope half-inflated. A caravan cresting a dune. A dragon the size of a cat lifting off a warm chimney. A flock of birds bursting off a rooftop. A baker propping a shop shutter open with a tray still in one hand. A dog mid-leap after a thrown stick, the stick still in the air. A bellringer leaning on the rope with the bell already tipped. A postie's bicycle skidding on ice, one foot down.

${SHARED_TEXT_LAW}

━━━ HARD RULES ━━━
- Never name the globe, the dome, the glass, the water, the base, the shelf or the room. This axis is purely what is happening in the little world.
- Figures stay TINY — grain-of-rice scale, painted, part of the place. Never a portrait, never a face filling anything, never a crowd described as a mass.
- No glowing magic, no magical effects. Practical light only: lit windows, lanterns, a lighthouse, a bonfire, a string of bulbs.
- Describe only what IS present. Never write a negation of any kind.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no keys.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
