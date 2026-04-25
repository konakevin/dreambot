#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/mech_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LEGO MECH/VEHICLE scene descriptions for BrickBot. Giant mechs, tanks, motorcycles, steampunk walkers, crazy contraptions — mechanical marvels built from LEGO.

Each entry: 15-25 words. One specific mech or vehicle scene.

━━━ SCENE TYPES (mix broadly) ━━━
- Giant bipedal mech with ball-joint legs, cannon arms, cockpit canopy
- Steampunk walking machine with gear trains, steam pipes, brass-colored bricks
- Monster truck crushing smaller brick vehicles, oversized wheels
- Battle mech duel, two mechs clashing in ruined cityscape
- Spider tank crawling over rubble, technic leg joints visible
- Flying vehicle with rotor blades, transparent engine glow
- Submarine with technic propeller, transparent dome cockpit
- Transforming vehicle mid-change, panels unfolding
- Racing vehicles on studded track, speed blur
- Construction mech lifting steel beams, hydraulic arms

━━━ RULES ━━━
- Technic beams, ball joints, pneumatic hoses, gear trains visible
- The engineering and build technique is the star
- Low angle to emphasize scale and mechanical detail
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
