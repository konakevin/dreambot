#!/usr/bin/env node
// TinyBot Stage N3 (SHADOW) — tiny-carnival. A miniature fairground at dusk/
// night: a lit Ferris wheel, a carousel of hand-carved animals, striped big-top
// tents, bunting, ticket booths, game stalls, string lights. SCENE pool = the
// layered fairground world; CAST pool = cute critters riding + running booths.
// MVP-25 each.
const { generatePool } = require('../../lib/seedGenHelper');

(async () => {
  await generatePool({
    outPath: 'scripts/bots/tinybot/seeds/tiny_carnival.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `You are writing ${n} MINIATURE CARNIVAL / FAIRGROUND scene descriptions for TinyBot — a dollhouse-scale fairground photographed with a tilt-shift macro lens. Think a hand-built model carnival glowing at dusk: a lit Ferris wheel, a carousel of tiny carved horses, striped big-top tents, bunting, ticket booths, game stalls, string lights everywhere. EXTERIOR views, looking at the fairground like a model layout.

Each entry: 18-28 words. ONE specific fairground scene that is a MULTI-ELEMENT constructed world with clear DEPTH LAYERS (a near ride or stall detail, the lit midground of the fair, a far distance fading into dusk haze) — never a single object on a bare surface.

━━━ CATEGORIES (spread across all ${n}) ━━━
- Lit Ferris wheel at dusk (spokes of warm bulbs against a lilac sky, gondolas the size of thimbles, reflections in a puddle below)
- Carousel of carved animals (hand-painted horses and swans, a striped canopy, brass poles, a ring of warm bulbs, mirrored center)
- Striped big-top and midway (a peaked tent, a lit entrance arch, sawdust path, flag-topped poles, string lights down the midway)
- Game-stall row (ring-toss and duck-pond stalls, hanging plush prizes, a bell-and-hammer strongman game, glowing bulbs, bunting)
- Popcorn-and-sweets stalls (a caramel-apple cart, a candy-floss drum, popcorn machine, striped awnings, warm bulb-light)
- Helter-skelter and slides (a spiral tower with a striped mat, a lit ticket kiosk, a rope-and-post railing, flags at the top)
- Fairground at blue hour (rides just lighting up, the sky deep blue, the first bulbs glowing, long reflections on damp ground)
- Rainy fair night (puddles full of Ferris-wheel reflections, umbrellas over stalls, glistening rides, warm haze and mist)
- Bumper-car pavilion (a low-roofed rink of tiny cars, a lattice of bulbs overhead, sparking pole-tops, a lit sign-arch with no readable text)
- Fair on the village green (rides pitched among cottages and trees, bunting to the rooftops, scattered hay bales and lanterns)
- Hall-of-mirrors and fun-house facade (a comic painted front, a spinning-barrel entrance, chase-lights outlining the doorway)
- Test-your-strength and prize-tent corner (the striker bell, shelves of tiny trophies and plush, a barker's podium, warm spotlights)

━━━ SCALE RULE ━━━
Every scene reads MINIATURE / DOLLHOUSE / DIORAMA. Use scale cues: thimble gondolas, matchbox ticket booths, bead-sized bulbs, pinhead prizes, sugar-cube hay bales, thread-thin bunting, tilt-shift shallow-focus language.

━━━ GLOW + JOY ━━━
The signature is FESTIVE LIGHT — thousands of tiny warm bulbs, glowing rides, string lights, reflections on damp ground. Bake in playful life and movement: a turning wheel, a spinning carousel, fluttering bunting, lit stalls. Joyful, twinkling, storybook-magical. Warm bulb-amber with a few candy accent colors; NO harsh neon.

━━━ EXTERIOR ONLY ━━━
Outdoor fairground views — never a private interior room. Camera above or beside the fair. NO proper nouns, NO brand names, NO readable text on signs or booths (suggest lettering as marks only).

━━━ NO CROWDS OF PEOPLE (CRITICAL) ━━━
Describe ONLY the rides, stalls, tents, lights, bunting and grounds — NEVER a crowd, a queue of fairgoers, a busy midway of visitors, or any people. Do NOT use the words "crowd", "queue", "fairgoers", "visitors", or "people". The fair's few visitors are tiny ANIMALS supplied separately; a described crowd will wrongly render as humans and break the scene. Keep the grounds open and uncrowded — the LIGHTS and RIDES carry the festive life, not a mass of figures.

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: ride/attraction type + time/weather + a specific signature detail. Vary the hero attraction every entry.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  await generatePool({
    outPath: 'scripts/bots/tinybot/seeds/tiny_carnival_cast.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `You are writing ${n} CUTE CRITTER-CAST snippets for TinyBot's tiny-carnival path — tiny animals bringing a miniature fairground to life as riders and stall-keepers. Each is a small SUPPORTING character caught MID-ACTION (not the hero of the frame), to be dropped into a fairground scene.

Each entry: 10-18 words. START WITH THE CRITTER + AN ACTIVE VERB. Playful, wholesome, storybook-adorable.

━━━ ALLOWED CRITTERS ONLY (cute register — hard rule) ━━━
mice, hedgehogs, bunnies/rabbits, red foxes, fawns/deer, red squirrels, dormice, ducklings, robins and other little songbirds, frogs, snails. For "bugs" ONLY these cute ones are allowed: ladybug, butterfly, bumblebee, snail, firefly. NEVER beetle, spider, cricket, moth, ant, wasp, mantis, centipede, or any other insect. When in doubt, use a mouse or a hedgehog.

━━━ FAIRGROUND ACTIONS (spread across all ${n}) ━━━
- two mice waving from a thimble Ferris-wheel gondola
- a bunny riding a carved carousel horse, ears streaming
- a hedgehog working the strongman bell with a tiny mallet
- a fox barker gesturing from a game-stall podium
- a red squirrel handing over a plush prize twice its size
- a dormouse clutching a stick of candy-floss bigger than its head
- a mouse spinning the ring-toss wheel at a game stall
- a frog tending the duck-pond game with a little net
- fireflies looping around the lit Ferris wheel like sparks
- a bunny scooping popcorn into a striped cone
- a fawn peeking wide-eyed into the hall-of-mirrors
- a mouse family queuing at a matchbox ticket booth
- a hedgehog turning caramel apples on a glowing cart
- a red fox steering a tiny bumper car with a grin
- a duckling chasing a runaway balloon down the midway

━━━ RULES ━━━
The critter is SMALL in the frame — a playful detail, not the subject. Little hats, scarves, ribbons welcome. NO humans. NO text/lettering. Keep every action gentle, joyful, and clearly readable.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
