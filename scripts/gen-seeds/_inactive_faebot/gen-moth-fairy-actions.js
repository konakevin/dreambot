#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/moth_fairy_actions.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} MOTH FAIRY ACTION descriptions for FaeBot's moth-fairy path. Each entry is what a nocturnal moth-winged fairy is DOING at night — drawn to light, navigating darkness, nocturnal activities. Dynamic freeze-frames. SOLO.

Each entry: 10-20 words. A specific nocturnal fairy action.

━━━ CATEGORIES TO COVER ━━━
- Hovering near a lantern flame, wings dusting the glass with scale powder
- Landing on a windowsill drawn by candlelight, pressing her hands to the glass
- Navigating through darkness by the glow of her own wing-dust trail
- Collecting moonbeams in a tiny bottle, scooping silver light from a puddle
- Circling a campfire, spiraling higher as sparks rise around her
- Resting on a moth's back in flight, both drawn toward a distant light
- Shaking wing-scale dust onto a sleeping flower to help it bloom at night
- Drinking nectar from a night-blooming flower, face dusted with pollen
- Weaving a cocoon of silk around herself for a brief rest, one eye open
- Leading fireflies in a synchronized dance through the dark trees
- Pressing her enormous reflective eyes close to examine a dewdrop
- Launching from a branch into the dark, wing-scales catching moonlight mid-flight

━━━ BANNED ━━━
- Sitting / lying passively / sleeping fully
- "Posing", "modeling", looking at the camera
- Daytime activities (this is ALWAYS nocturnal)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + light source interaction.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
