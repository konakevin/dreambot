#!/usr/bin/env node
/**
 * Bespoke HOT WHEELS / car scenarios pool — used by hotwheels-city path.
 * Vehicle-driven story beats staged in real-world environments at toy
 * scale. Tracks, jumps, chases, parking lots, garages, races.
 */
const { generatePool } = require('../../lib/seedGenHelper');

const TOTAL = parseInt(process.env.TOTAL, 10) || 25;
const APPEND = process.env.APPEND === 'true';

generatePool({
  outPath: 'scripts/bots/toybot/seeds/hotwheels_scenarios.json',
  total: TOTAL,
  batch: Math.min(TOTAL, 25),
  append: APPEND,
  metaPrompt: (
    n
  ) => `You are writing ${n} HOT WHEELS / TOY CAR SCENARIO descriptions for ToyBot's hotwheels-city path. Vehicle story beats staged in real-world environments at toy scale — kitchen-floor races, bookshelf jumps, desk drag-strips, beach rallies, garage repairs.

Each entry: 24-40 words. Comma-separated phrase clusters. NO sentences with periods. NO car brand mentions (Hot Wheels comes from path-side prefix). Cast = 2-4 vehicles + figures (drivers, mechanics, spectators) interacting.

━━━ FORMAT ━━━
"{VEHICLE-SCENE/ACTIVITY}, {2-4 cars + figures cast placeholder}, {motion beat with cause/reaction}, {real-world setting at toy scale}, {atmospheric detail}"

━━━ EXAMPLES ━━━
- "Kitchen-counter drag race, three toy cars lined up at the start, real spatula as starting flag, mechanic figure flagging the launch while spectator-figure crouches at finish line drawn in real flour spill, real overhead pendant lighting"
- "Bookshelf canyon chase, two cars airborne over real spine-binding gap, lead car mid-leap while pursuit car launches behind, real dust-mote particles in motion blur, real lamp-glow rim-lighting both cars at apex"
- "Garage pit stop, four cars in a row of stalls, mechanic figures swarming over engines with real screwdriver tools, one car lifted on a real-bottle-cap jack while another peels out, real oil-stain on real concrete floor"
- "Beach-sand rally finish line, three cars churning through real wet-sand, lead car spraying real grain-debris as it crosses real seashell finish line, two figures with real-toothpick checkered flags raised, real ocean spray in air"
- "Desk-edge cliffhanger, two cars caught at the lip of a real desk drop-off, lead car teetering with rear wheels spinning in real air while pursuit car locks brakes inches behind, real keyboard horizon below, real lamp glow",
- "Carpet-jungle off-road expedition, four cars climbing through real shag-pile fibers, lead car mid-bounce over real Lego brick obstacle while support cars scout flanks, real dust-bunny tumbleweeds, real morning sun through real window blinds"
- "Late-night highway pursuit on bathroom counter, two cars at full chase across real ceramic surface, real toothpaste-tube as guard rail, one car drafting close behind the other, real mirror reflecting both, real puddle-glint",
- "Toy-store-shelf showcase, four cars on display behind real product packaging, one car suddenly mid-launch off the shelf while figure-driver leans into the turn, real clearance-tag as backdrop, real fluorescent overhead glare"
- "Garage party night-cruise, three cars idling outside a real bottle-cap garage door, drivers leaning on hoods with real coffee-bean cups, mechanic figure waving them in while another inside polishes a real chrome rim, real night-rain on cement"
- "Backyard ramp-jump showdown, four cars taking turns hitting a real wooden-block ramp, lead car airborne above real grass landing zone while three rivals wait at start, real garden-hose serpentine track, real golden-hour light"

━━━ HARD RULES ━━━
- 2-4 vehicles per entry. Add 1-3 figures as drivers / mechanics / spectators when relevant.
- Real-world setting — kitchen counter, bathroom sink, desk, bookshelf, beach, garage, garden, carpet, etc. Toy-scale interpretation.
- Motion beat — cars are mid-action: racing, drifting, jumping, crashing, parked-at-meet, pit-stopping.
- Implied story — chase, race, rivalry, collaboration, celebration, breakdown.
- Wide-to-medium framing — the real-world track environment is part of the scene.

━━━ DEDUP ━━━
No two scenarios share the same setting + activity combination.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
