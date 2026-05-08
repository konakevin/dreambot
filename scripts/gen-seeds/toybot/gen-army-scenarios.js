#!/usr/bin/env node
/**
 * Bespoke ARMY scenarios pool — used by green-army-warzone + gi-joe-missions.
 * Multi-figure military / tactical / wartime story moments staged in
 * real-world environments at toy scale.
 */
const { generatePool } = require('../../lib/seedGenHelper');

const TOTAL = parseInt(process.env.TOTAL, 10) || 25;
const APPEND = process.env.APPEND === 'true';

generatePool({
  outPath: 'scripts/bots/toybot/seeds/army_scenarios.json',
  total: TOTAL,
  batch: Math.min(TOTAL, 25),
  append: APPEND,
  metaPrompt: (n) => `You are writing ${n} ARMY/TACTICAL SCENARIO descriptions for ToyBot's green-army-warzone + gi-joe-missions paths. Multi-figure military story beats in real-world environments at toy scale (think backyard / garden / kitchen / desk / sandbox war games — Toy Story Sarge's Squad meets full-scale missions).

Each entry: 24-40 words. Comma-separated phrase clusters. NO sentences with periods. NO toy-medium mentions (those slot in from the path's cast pool).

━━━ FORMAT ━━━
"{MISSION/ACTIVITY}, {3-6 figures cast description placeholder}, {tactical story beat with cause/reaction}, {real-world setting at toy scale}, {atmospheric detail}"

━━━ EXAMPLES (variety vibe — generate FAR more) ━━━
- "Backyard hill assault, four figures advancing up a real grass slope under cover, point figure waving the rest forward while rear figure crouches behind real dandelion stalk, real morning dew on grass blades, sunbeams through real fence boards"
- "Kitchen counter recon, three figures moving silently across real ceramic tile, lead figure peeking around real coffee mug while spotter signals halt with real toothpick raised, real overhead pendant-light glare"
- "Sandbox-fortress siege, six figures storming a real sand-castle wall, two with grappling-hooks made of real string while defenders return fire from real plastic shovel battlements, real beach toys repurposed as siege engines"
- "Garden bridge ambush, four figures crouched behind real rocks beside a real garden hose, lead figure raising fist to halt the squad while flanker takes position, real morning fog drifting low across real moss-covered stones"
- "Bookshelf rooftop overwatch, three figures prone atop real hardcover spines, sniper-figure scanning real desk-lamp horizon while spotter calls coordinates, real pages of an open book flapping in real breeze from open window"
- "Desk-perimeter night raid, five figures moving by real laptop glow, point figure peering around real keyboard while another places real binder-clip charges on real coffee-cup objective, real ambient hum of computer fan"
- "Beach landing operation, six figures storming up a real wet-sand shoreline, lead figure firing tracer rounds drawn as real toothpick streaks while squad advances behind real shell debris, real ocean spray, real wave crashing"
- "Fence-post sniper standoff, two figures separated by real wooden plank fence, one figure waiting in real shadow with real coil of wire while target figure unaware on opposite side, real evening sun cutting through real fence gaps"
- "Vehicle-disabled rescue, four figures swarming a tipped real Hot Wheels car under real dust-bunny cover, two extracting trapped figure while two pull security with weapons trained on real desk-edge horizon, real pencil-rolling debris"
- "Living-room-floor patrol, five figures advancing in formation across real carpet pile, lead figure halting the patrol with raised arm while spotter sights through real magnifying-glass ahead, real Cheerio cereal scattered as battle debris"

━━━ HARD RULES ━━━
- 3-6 figures per entry, NEVER solo. Squad/team dynamics — point, flank, rear-guard, sniper, spotter, etc.
- Real-world setting at toy-scale — backyard, garden, sandbox, kitchen, desk, bookshelf, living room, beach, fence-post, etc.
- Tactical story beat with verbs and reactions. Show what's happening AT THIS MOMENT.
- Mix scales: garden = jungle, sandbox = desert, kitchen counter = urban canyon, bookshelf = mountain ridge.
- Wide-to-medium implied framing — tactical environment is part of the scene.
- NO toy-medium mentions (no "green army men", no "GI Joe figures") — use "figures" generically.

━━━ DEDUP ━━━
No two scenarios share the same setting + tactic combination. Spread across military scenarios.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
