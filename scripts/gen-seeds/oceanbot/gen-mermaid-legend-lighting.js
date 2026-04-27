#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/mermaid_legend_lighting.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} MARITIME LEGEND LIGHTING descriptions for OceanBot's mermaid-legend path. These describe the light in classical maritime oil paintings — atmospheric, dramatic, painterly. Think Turner, Aivazovsky, Caspar David Friedrich, Winslow Homer seascapes.

Each entry: 10-20 words. A specific lighting condition for an old-world maritime mermaid scene.

━━━ LIGHTING FAMILIES TO COVER ━━━
- Moonlight: full moon on dark swells, crescent moon through clouds, moonpath on black water, silver-blue lunar glow
- Golden hour: low sun on rolling seas, amber light on wet rock, sunset copper on wave faces
- Storm light: lightning flash on churning water, storm-break shafts piercing dark clouds, green-gray storm glow
- Dawn/dusk: pre-dawn violet, first light through sea mist, twilight purple-blue on calm water
- Fog/mist: diffuse pearl-white fog glow, lantern light through thick fog, hazy morning sun barely visible
- Lantern/fire: distant ship's lantern, lighthouse beam sweeping, campfire glow on coastal rocks, oil lamp warmth
- Overcast: heavy pewter sky, flat silver light on gray sea, brooding dark clouds with bright horizon crack
- Dramatic: single shaft of light through cloud break, chiaroscuro contrast, rim-lit figure against dark sky
- Northern: aurora shimmer on dark water, polar twilight, ice-reflected light, cold blue arctic glow
- Underwater glow: bioluminescent shimmer from below surface, phosphorescent wake, glowing tide at night

━━━ RULES ━━━
- These are for CLASSICAL OIL PAINTING aesthetics — painterly, atmospheric, dramatic
- Period-appropriate light sources only (moon, sun, lanterns, lightning, fire — no electric lights)
- Describe the quality and color of the light, not just the source
- Each entry should evoke a specific mood through its lighting
- Vary time of day, weather, and light source across all entries

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: light source + color temperature + time of day + weather condition.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
