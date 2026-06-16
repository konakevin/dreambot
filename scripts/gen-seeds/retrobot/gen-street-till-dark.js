#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/retrobot/seeds/street_till_dark.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} STREET-PLAY scene descriptions for RetroBot — the suburban sidewalk, driveway, and cul-de-sac that was the kids' playground, 1975-1995. No people visible. Pure scene/environment. "Out till the streetlights come on." Golden hour fading to dusk. The kids just ran off — the place tells the story.

Each entry: 10-20 words. One specific street, sidewalk, or driveway scene or detail. Focus on the STREET / SIDEWALK / DRIVEWAY / FRONT-YARD-EDGE — not the backyard, not indoors.

━━━ CATEGORIES ━━━
- Chalk hopscotch grid on the sidewalk, a chalk nub and a tossed pebble marker
- Sidewalk chalk drawings — rainbow, sun, scrawled names — chalk bucket nearby
- BMX bike / banana-seat bike / Big Wheel dropped on the driveway, kickstand up
- Garage basketball hoop, ball resting on the driveway, faded free-throw chalk line
- Roller skates or a skateboard on the porch step or against the curb
- Hand-painted lemonade stand — card table, pitcher of ice, stacked paper cups
- Jump rope or Chinese jump rope lying on the driveway
- Homemade skateboard ramp — plywood propped on the curb
- Streetlight buzzing on at dusk over an empty cul-de-sac
- Open fire hydrant, wet street shining (city-block summer)
- Front stoop with jacks, marbles, a Slinky, a deck of cards
- Red Radio Flyer wagon parked on the walk
- Chain-link gate, mailbox, garden gnome — the suburban frame at golden hour
- Pogo stick or a scooter leaned against the garage
- Trading cards, bottle caps, or a clothespinned card in bike spokes by the curb
- Driveway-edge curb with a hose, a bucket, washed-bike water drying

━━━ RULES ━━━
- PURE SCENE — no people, no hands, no silhouettes
- 1975-1995 suburban/city America — period bikes, toys, signage (no modern gear)
- Golden hour to dusk — long shadows, warm amber, the streetlight beginning to glow
- Warm analog film-grain feel
- Gender-neutral — boys and girls both lived this

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
