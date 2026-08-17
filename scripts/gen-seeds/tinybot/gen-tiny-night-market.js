#!/usr/bin/env node
// TinyBot Stage N2 (SHADOW) — tiny-night-market. A lantern-lit miniature night
// market: rows of tiny food stalls, paper lanterns and string lights, steam
// curling off bead-sized kettles, a canal of reflected light. SCENE pool = the
// layered world; CAST pool = cute critter vendors + shoppers. MVP-25 each.
const { generatePool } = require('../../lib/seedGenHelper');

(async () => {
  await generatePool({
    outPath: 'scripts/bots/tinybot/seeds/tiny_night_market.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `You are writing ${n} MINIATURE NIGHT-MARKET scene descriptions for TinyBot — a dollhouse-scale lantern-lit night market photographed with a tilt-shift macro lens. Think a hand-built model of a glowing evening market: rows of tiny stalls, paper lanterns and string lights overhead, steam curling off bead-sized kettles, crates of miniature produce, a canal or wet lane reflecting all the light. EXTERIOR / open-air views, looking at the market like a model layout.

Each entry: 18-28 words. ONE specific night-market scene that is a MULTI-ELEMENT constructed world with clear DEPTH LAYERS (a near stall detail, the crowded midground of lit stalls, a far distance fading into warm haze) — never a single object on a bare surface.

━━━ CATEGORIES (spread across all ${n}) ━━━
- Lantern-lined market alley (paper lanterns strung overhead, glowing stall awnings, wet cobbles mirroring the light, bunting)
- Tiny food-stall row (bead-sized dumplings and skewers, steam rising off thimble woks, hanging lightbulbs, chalk menu-boards with no readable text)
- Canal night market (stalls along the water, lanterns doubled in the black canal, a tiny boat-stall, reflected string lights)
- Covered market under a glass roof (fairy-lights in the rafters, tiered stalls, warm pools of lamp-light, a central fountain)
- Flower-and-lantern stall cluster (buckets of miniature blooms, hanging lanterns, a striped awning, a lamplit sign-post)
- Spice-and-produce square (pyramids of tiny oranges and peppers, sack-cloth stalls, a hanging scale, warm hanging bulbs)
- Rainy night market (umbrellas over stalls, puddles full of neon-warm reflections, steam and mist, glistening awnings)
- Tea-house lane (tiny paper lanterns, steaming kettles, low stools, a moon-bridge over a rill, warm doorways)
- Sweets-and-lantern festival stalls (candy jars glowing, a caramel-apple stall, sparkler-bright string lights, a paper-lantern arch)
- Harbor-side night market (stalls on the quay, lantern-lit fishing boats, nets drying, reflections on dark water)
- Bookstall-and-trinket row (tiny stacked books and curios, a swaying lantern, a cat-sized bookseller's cart, warm glow)
- Blue-hour market opening (last cold light in the sky, the first stalls lighting their lamps, long warm reflections beginning)

━━━ SCALE RULE ━━━
Every scene reads MINIATURE / DOLLHOUSE / DIORAMA. Use scale cues: bead-sized dumplings, thimble kettles, matchbox stalls, thread-thin string lights, pinhead lanterns, sugar-cube crates, tilt-shift shallow-focus language.

━━━ GLOW + LIFE ━━━
The signature is WARM GLOW in the dark — lanterns, hanging bulbs, stall-light, reflections on wet ground. Bake in signs of a lived-in bustling market: steam, hanging wares, open awnings, lamplit crates. Cozy and inviting, jewel-like against the night. NO garish neon; warm amber and soft color.

━━━ EXTERIOR ONLY ━━━
Open-air / covered-market views — never a private interior room. Camera above or beside the market. NO humans (peripheral distant silhouettes at most). NO proper nouns, NO brand names, NO readable text on signs or menus (suggest lettering as marks only).

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: market type + weather/time + a specific signature detail. Vary the hero element every entry.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  await generatePool({
    outPath: 'scripts/bots/tinybot/seeds/tiny_night_market_cast.json',
    total: 120,
    append: true,
    batch: 25,
    metaPrompt: (
      n
    ) => `You are writing ${n} CUTE CRITTER-CAST snippets for TinyBot's tiny-night-market path — tiny animals bringing a lantern-lit miniature night market to life as vendors and shoppers. Each is a small SUPPORTING character caught MID-ACTION (not the hero of the frame), to be dropped into a night-market scene.

Each entry: 10-18 words. START WITH THE CRITTER + AN ACTIVE VERB. Warm, wholesome, storybook-adorable.

━━━ ALLOWED CRITTERS ONLY (cute register — hard rule) ━━━
mice, hedgehogs, bunnies/rabbits, red foxes, fawns/deer, red squirrels, dormice, ducklings, robins and other little songbirds, frogs, snails. For "bugs" ONLY these cute ones are allowed: ladybug, butterfly, bumblebee, snail, firefly. NEVER beetle, spider, cricket, moth, ant, wasp, mantis, centipede, or any other insect. When in doubt, use a mouse or a hedgehog.

━━━ NIGHT-MARKET ACTIONS (spread across all ${n}) ━━━
- a mouse vendor ladling steaming soup at a bead-sized stall
- a hedgehog stringing a fresh line of paper lanterns overhead
- a fox flipping tiny skewers over a glowing grill
- a bunny arranging a bucket of miniature flowers at a stall
- a snail minding a curio-and-trinket cart
- a red squirrel weighing tiny apples on a hanging scale
- a dormouse peeking over a stall of glowing candy jars
- a frog lamplighter touching a taper to a swaying lantern
- fireflies drifting between the stalls like living lamps
- a mouse family sharing a dumpling on a lantern-lit bench
- a hedgehog pouring tea from a thimble kettle, steam rising
- a fox bookseller reshelving tiny books on a wheeled cart
- a bunny carrying a paper lantern down the wet alley
- a mouse haggling over a pyramid of tiny oranges
- a duckling splashing in a puddle full of reflected lights

━━━ RULES ━━━
The critter is SMALL in the frame — a warm detail, not the subject. Little aprons, caps, scarves welcome. NO humans. NO text/lettering. Keep every action gentle, cozy, and clearly readable.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
