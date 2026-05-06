#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/rust_apoc_settings.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} WASTELAND descriptions for MechBot's post-apoc-rust-tech path. Each describes WHERE the scavenger scene is happening, 14-22 words.

━━━ SETTING CATEGORIES ━━━
- Cracked desert hardpan (heat shimmer, dust devils, distant wreck silhouette)
- Salt flats at sunset (mirror-flat horizon, long shadows, dust trail)
- Toxic-orange canyons (chemical-stained walls, eroded mesa formations)
- Overgrown highway (abandoned cars choked with vines, asphalt cracked)
- Sun-bleached refinery ruins (skeletal pipe forests, fallen flare stacks)
- Salvage yard graveyard (mountains of scrap, rusted hulls, half-buried machines)
- Dust-storm white-out (visibility zero, crew goggled, headlights cutting)
- Riverbed dry of decades (caked mud, dead boats, mud-brick raider settlements)
- Frozen apocalypse tundra (snow over rust, breath-fog, blue-shadow dunes)
- Acid-rain ruins (pooled green water, chemical-eroded steel, downpour active)

━━━ ATMOSPHERIC ELEMENTS ━━━
- Heat shimmer / dust haze / acid rain / blizzard / fog
- Time-of-day (golden-hour mostly — Mad Max sunset palette)
- Wreckage in distance (other rigs, downed mechs, dead ships)
- Vegetation reclaiming (vines, rust-eating fungi, succulents in cracks)

━━━ EXAMPLES (write fresh) ━━━
- "Cracked desert hardpan at golden hour, heat shimmer rising, distant wreck silhouette and a dust devil spiral"
- "Toxic-orange canyon walls eroded into mesa shapes, chemical staining streaks, blue sky bleached almost white"
- "Sun-bleached refinery ruins at midday, skeletal pipe forest, fallen flare stacks, rust dunes drifting at the base"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: terrain type + time-of-day + decay-element.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
