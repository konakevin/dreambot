#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_painterly_drama.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} DRAMA / EVENT entries for a MangaBot ghibli-painterly keyframe. Fires at 40% gate. A loaded narrative beat that ELEVATES the scene from a pretty postcard to a moment-in-a-story. Subtle, atmospheric — never combat or violence.

Each entry: 12-22 words. ONE specific loaded moment that adds narrative tension or wonder.

VARIETY (25 bespoke entries):
- 20% SUN-SHAFT BREAKTHROUGH (sun cracking through clouds onto the architecture in a dramatic beam)
- 15% LANTERN-RELEASE (festival lanterns rising en masse from the scene)
- 15% MASS PETAL-FALL (sakura blossoms suddenly cascading in a wind-gust)
- 10% SPIRIT-PROCESSION passing (yokai parade glimpsed at distance, lantern lights moving)
- 10% RAIN-START (first drops hitting stone, ripples spreading)
- 10% FIRST-LIGHT MOMENT (dawn breaking, gold rim on the eaves, first warmth touching cold stone)
- 5% AURORA-PULSE (rare auroral light shimmering across the sky)
- 5% BELL-TOLL (shrine bell ringing, visible reverberation, birds startling up)
- 5% PASSING SHIP / AIRSHIP / GREAT-CREATURE distant silhouette
- 5% MEMORY-MOMENT (Sheeta-locket-glowing kind of beat, a hidden detail catching light)

DO write:
- A single sun-shaft cracks through the cloud-cover and lights the cathedral spire in solid gold beam
- Hundreds of paper festival lanterns rise from the river all at once, ascending past the pagoda into the night
- Wind-gust sends a mass cascade of cherry blossoms across the scene, pink rain filling the foreground
- A spirit-procession passes at distance — line of yokai lanterns moving slowly along the cliff path beyond
- First raindrops hit the stone-step, ripples spreading in the puddles, foreground darkening
- Dawn breaks across the floating fortress, first gold rim catching the eaves, cold stone warming
- Aurora pulses in soft mint-and-rose bands across the night sky above the spire
- The shrine bell tolls and a flock of crows startles up from the courtyard, silhouetted against amber
- A great airship silhouette passes in the deep distance behind the spire, slowly crossing the cloud-sea
- A hidden carved sigil on the spire catches the light and glows briefly amber, then fades

DO NOT write:
- Combat / violence / battle drama
- Hero-character close-up moment
- Weather disaster (no tornado / no flood)
- Western fantasy creatures
- Vehicle crash / explosion

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
