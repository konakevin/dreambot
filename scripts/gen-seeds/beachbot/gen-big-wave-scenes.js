#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/beachbot/seeds/big_wave_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} BIG WAVE scene descriptions for BeachBot's big-wave path. Each entry describes a dramatic, awe-inspiring scene of massive waves and churning ocean set against a beautiful tropical coastline. The contrast between dangerous raw ocean power and stunning tropical beauty is the hook.

Each entry: 25-40 words. One complete big wave scene with wave type, coastal setting, weather, and light.

━━━ THE CONCEPT ━━━
Massive, terrifying, jaw-dropping waves breaking against gorgeous tropical coasts. The ocean at its most powerful and dramatic — 30-foot swells, churning whitewater, spray reaching the sky — but always set in the prettiest coastal scenes imaginable. Palm trees bending, volcanic cliffs getting hammered, pristine beaches being pounded. Raw power meets paradise.

━━━ WAVE TYPES (distribute across entries) ━━━
- Massive barrel wave curling and crashing, hollow tube visible, spray blowing off the lip
- 40-foot swell rising like a wall, dark face stretching across the frame
- Explosive shorebreak slamming onto shallow reef, white explosion of spray
- Wave colliding with volcanic cliff, spray rocketing 50 feet into the air
- Churning whitewater aftermath, foam and turbulence spreading across entire bay
- Double-up wave — two swells merging into one massive peak before breaking
- Closeout set wave — entire horizon-wide wall of water collapsing at once
- Rogue wave towering above normal swell, ominous dark water face
- Storm swell wrapping around rocky headland, water pouring over point
- Cross-seas — confused wave patterns meeting from two directions, chaotic water

━━━ COASTAL SETTINGS (vary — always tropical/beautiful) ━━━
- Rocky volcanic point with palms behind, wave exploding against black lava
- White sand beach with coconut palms, massive shorebreak crashing on shore
- Cliff-top view looking down at waves hammering the base far below
- Protected bay where waves funnel in and amplify, green hills rising behind
- Coral reef pass where waves jack up suddenly, turquoise-to-dark-blue transition
- Remote tropical cove, jungle hillside behind, waves wrapping in from open ocean
- Black sand beach with dramatic surf, volcanic mountains in background
- Lighthouse or rocky point with waves breaking around it, spray everywhere

━━━ WEATHER + ATMOSPHERE (vary — ~40% stormy, ~60% beautiful) ━━━
STORMY (~40%):
- Dark storm clouds, wind-whipped spray, dramatic contrast lighting
- Approaching squall, ominous sky, last golden light before storm hits
- Post-storm clearing, sun breaking through, rainbow visible, waves still huge
- Grey churning ocean under heavy overcast, raw and moody

BEAUTIFUL (~60%):
- Golden sunset backlighting massive wave spray, silhouetted palms
- Crystal clear morning, blue sky, but ocean raging with enormous swell
- Soft early morning light, mist in valleys behind, giant waves rolling in
- Vivid tropical day, bright colors everywhere, waves providing the drama

━━━ NO PEOPLE ━━━
No surfers, swimmers, people on beach, boats in water. Empty — only waves, coast, sky, light.

━━━ DEDUP ━━━
Each entry must be a DIFFERENT wave type + coastal setting combo. No two entries with the same wave breaking at the same location type.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
