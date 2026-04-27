#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/sorceress_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} SORCERESS ACTION descriptions for SirenBot's sorceress path. Each entry is what a sorceress is DOING while practicing magic — rituals, experiments, spellcasting. Unaware of being observed. Dynamic freeze-frames. SOLO.

Each entry: 10-20 words. A specific magical action.

━━━ CATEGORIES TO COVER ━━━
- Channeling energy between her hands, a sphere of light growing between her palms
- Levitating multiple objects in a controlled orbit around her body
- Drawing an arcane circle in the air with a glowing fingertip
- Pouring liquid light from one vessel to another, watching the color shift
- Summoning a storm through an open window, arms raised to the sky
- Binding a spell into a gemstone, pressing it between her palms until it glows
- Reading a scroll that unrolls itself, runes lifting off the page
- Pulling threads of raw magic from the air and weaving them together
- Shattering a crystal to release trapped energy, shards floating mid-explosion
- Transmuting lead into gold on a workbench, metal flowing like water
- Walking through a portal she just opened, one foot in each world
- Controlling water in mid-air, shaping it into impossible geometric forms

━━━ BANNED ━━━
- Sitting / lying passively / meditating eyes-closed
- "Posing", "modeling", looking at the camera
- Second figures / summoned creatures with sentience

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: magic type (elemental/transmutation/summoning/binding) + hand position.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
