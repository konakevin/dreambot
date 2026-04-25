#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/wild_west_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} LEGO WILD WEST scene descriptions for BrickBot. Frontier towns, cowboys, outlaws, gold rushes — classic Western scenes built from LEGO.

Each entry: 15-25 words. One specific Wild West scene.

━━━ SCENE TYPES (mix broadly) ━━━
- Main street showdown, two cowboy minifigs facing off, tumbleweeds
- Saloon interior with swinging doors, bar fight mid-swing
- Train robbery, locomotive on brick tracks, bandits on horseback
- Gold mine entrance, minecart on rails, dynamite crates
- Sheriff's office and jail, wanted posters, rifle rack
- Stagecoach racing through canyon, pursued by bandits
- Campfire scene in desert, coffee pot, bedroll, horse hitched
- Bank vault heist, safe door blown open, gold brick pile
- Cavalry fort, watchtower, flag, parade ground
- Desert canyon with natural bridge, wagon train passing through

━━━ RULES ━━━
- Tan and brown brick palette, dusty atmosphere
- Warm golden light, long shadows, high noon or sunset
- Brown plant pieces for tumbleweeds, green for cacti
- Classic Western romance in plastic
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
