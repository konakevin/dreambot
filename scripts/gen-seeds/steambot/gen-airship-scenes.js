#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/airship_scenes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} AIRSHIP SCENE descriptions for SteamBot's airship-skies path — airships in dramatic sky scenes.

Each entry: 15-30 words. One specific airship scene.

━━━ CATEGORIES ━━━
- Breaking through clouds (massive airship emerging from cloud layer)
- Fleet over city (multiple airships hovering above Victorian city)
- Mid-storm (airship being tossed by storm, lightning)
- Docking at sky-port (airship settling into brass-and-rope harbor)
- Cloud-gliding peaceful (solitary airship drifting at sunset)
- Airship-battle mid-fire (ships firing cannons across sky)
- Airship-pirate boarding (ropes extended between two ships)
- Balloon-basket voyage at dawn (early-morning flight)
- Zeppelin crossing ocean (wide-shot ocean crossing)
- Airship-launch ceremony (ship leaving dock with crowd)
- Moonlit airship-glide (silver-lit airship against star)
- Airship-wreckage (crashed ship dangling from cliff)
- Airship-race (multiple racing ships through mountains)
- Lighthouse-passing airship (ship rounds lighthouse)
- Grand-zeppelin formal (luxurious zeppelin interior visible through windows)
- Fog-filled sky-harbor (airships in dense fog)
- Aurora-lit airship (arctic airship under northern lights)
- Rainbow-passing airship (through rainbow arc)
- Desert airship-expedition (over dunes)
- Jungle-canopy airship (over rainforest)
- Storm-chase airship (pursued by storm)
- Glacier-passing airship
- Volcano-circling airship (around eruption)
- Dawn-emerging airship (sunrise glow)
- Swarm of small airships (clan of small vessels)
- Mother-ship with daughter-ships tethered
- Military parade of war-zeppelins
- Escape-launch airship (taking off urgently)
- Diving airship (descending through clouds)
- Anchored-above-battlefield observing
- Ice-cracked-arctic airship-rescue

━━━ RULES ━━━
- Dramatic sky scenes
- Airship is focal, cloudscape is stage
- Victorian-steampunk aesthetic
- Specific moment captured

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
