#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/retrobot/seeds/summer_golden.json',
  total: 200,
  batch: 50, append: true,
  metaPrompt: (n) => `You are writing ${n} SUMMER GOLDEN scene descriptions for RetroBot — endless summer days as a kid, 1975-1995. No people visible. Pure scene/environment.

Each entry: 10-20 words. One specific summer scene or detail.

━━━ CATEGORIES ━━━
- Sprinkler on the lawn (rainbow in the spray, wet grass, garden hose coiled)
- Popsicle drips on hot sidewalk (melted puddle, sticky wooden stick)
- Swimming pool (above-ground pool, diving board, pool noodles, chlorine-blue water)
- Lemonade stand (hand-painted sign, pitcher with ice, paper cups)
- Bike abandoned on front lawn (banana seat, handlebar streamers, kickstand up)
- Ice cream truck (musical box on dashboard, menu board, soft-serve cone)
- Firefly jars at dusk (mason jar with holes poked in lid, yellow-green glow)
- Slip 'N Slide on the grass (yellow plastic, wet streak, garden hose connection)
- Screen door (wooden frame, mesh, bugs bumping against porch light)
- Backyard BBQ setup (Weber grill, picnic table, red-checkered cloth, paper plates)
- Tree fort / treehouse (rope ladder, plywood floor, comic books scattered)
- Playground at golden hour (metal slide hot in sun, swingset shadows, wood chips)
- Fishing spot (tackle box, bobber on still water, cooler on the bank)
- Drive-in movie screen at dusk (speaker hooked on car window, lot half-full)
- Neighborhood street at sunset (basketball hoop on garage, chalk drawings on sidewalk)

━━━ RULES ━━━
- PURE SCENE — no people, no hands, no silhouettes
- 1975-1995 suburban/rural America — no modern equipment
- Golden hour / warm afternoon light dominates
- Gender-neutral — boys and girls both lived this summer

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
