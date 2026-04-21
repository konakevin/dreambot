#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/lighting.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for DinoBot — dino-scene lighting.

Each entry: 10-20 words. One specific dino lighting treatment.

━━━ CATEGORIES ━━━
- Golden-hour raking through fern-canopy
- Blue-hour silhouetted sauropod
- Storm-light breaking on T-Rex
- Dappled-canopy sunlight raptor
- Dawn-mist silhouetted triceratops
- Lightning-flash freezing raptor mid-leap
- Sunset-backlit pterosaur wings
- Moonlit silver dinosaur
- Volcano-glow reflecting on scales
- Amber-sunset mother with eggs
- Green-canopy filtered jungle light
- Storm-anvil dramatic backdrop
- God-ray through clouds breaking
- Dawn-on-savanna warm pink
- Twilight prehistoric blue hour
- Ember-rain from distant volcano
- Cave-mouth amber-warm
- Swamp-mist soft-diffuse
- Sun-through-leaves spotlight
- Post-rain fresh clear
- Pre-dawn grey-pink
- Clear-midday harsh primary
- Fog-bank valley-floor
- Sunset-silhouette mountain
- Storm-clearing rainbow
- Midnight-starfield prehistoric
- Lava-glow underlight dramatic
- Eclipse-eerie prehistoric
- Meteor-trail visible
- Aurora-prehistoric dramatic
- Golden-hour jungle shafts
- Backlit frill raptor standing silhouette
- Reverse-lit dinosaur silhouette
- Rim-light scale-detail
- Spot-on-eye intense close
- Chiaroscuro cave-mouth
- Dust-shaft with dinosaur
- Waterfall-mist-prismatic
- Hunting-ambush low-light dim
- Sunrise-warm first-light on herd

━━━ RULES ━━━
- Dramatic dino-specific lighting
- Named specific treatments

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
