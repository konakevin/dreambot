#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/epic_vista_atmosphere.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} ATMOSPHERE descriptions for PixelBot's epic-vista path (Final Fantasy VI airship-flyover / Chrono Trigger world-map / Lufia II / Secret of Mana / Terranigma 16-bit-era panoramic vista aesthetic — used as inspiration only, never named in output).

Each entry is 15-30 words. EVERY entry must include 2-3 of these animated-feel landscape elements:
- Drifting clouds / chunky cumulus / wisps of mist
- Falling cherry-petals / autumn-leaves / spring-pollen
- Drifting snow particles / falling rain / drifting fog
- Drifting embers from lava / volcanic ash drift
- Drifting magical motes / starlight-sparkle / cosmic-particles
- Distant flock-of-birds in flight (mid-frame silhouettes)
- Distant airship-silhouette in flight (with exhaust-trail)
- Distant caravan silhouette winding through
- Distant ship-silhouette on horizon
- Distant lone-traveler silhouette at cliff edge
- Distant herd-of-creatures silhouette grazing
- Drifting waterfall mist between layers
- Drifting wave-foam crashing on shore
- Sandstorm-particles drifting in desert
- Drifting aurora-shimmer particles

Examples (write fresh):
- "Drifting chunky cumulus clouds across the panorama, distant flock-of-birds silhouette in middle-frame flight, drifting magical motes catching light, layered atmospheric haze."
- "Falling cherry-petals cascading across the valley vista, distant lone-traveler silhouette at the cliff edge, soft drifting morning mist, golden god-rays piercing canopy."
- "Drifting snow-particles across the tundra vista, distant wolf-silhouette pack on the snowy ridge, drifting aurora-shimmer particles, far peaks in cool-blue haze."
- "Drifting embers from middle-distance volcanic eruptions, ash-cloud drift across the sky, drifting volcanic-haze, distant ship-silhouette fleeing the eruption."
- "Drifting cosmic-particles in the alien starfield, distant airship-silhouette in flight with exhaust-trail, drifting nebula-shimmer, twin-moons casting long shadows."
- "Distant caravan-silhouette winding through dune-line, drifting sand-particles in the warm wind, sandstorm-haze in middle parallax, drifting eagle-silhouette overhead."
- "Drifting waterfall-mist between fjord cliffs, crashing wave-foam in foreground, distant ship-silhouette on the horizon, drifting seabird-flock."
- "Drifting magical motes across the sky-island vista, drifting cloud-platforms, distant airship-silhouette in flight, dithered atmospheric depth."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
