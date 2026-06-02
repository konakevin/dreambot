#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/space_saga_lighting.json',
  total: 100,
  batch: 25,
  metaPrompt: (
    n
  ) => `Write ${n} authentic STAR WARS toy-photography lighting + atmosphere descriptors for ToyBot's space-saga-figures path. Each entry combines a Star Wars location + light quality + atmospheric phenomenon. Cinematic 1977-1983 space-opera mood. 10-20 words per entry.

━━━ STAR WARS LOCATION-SPECIFIC LIGHTING TO ROTATE ━━━
- Mos Eisley cantina amber-jukebox glow, smoke-haze, dim recessed booth-lighting, Modal Nodes spotlights
- Hoth Echo Base hangar cold-cyan flood, vapor-cloud breath visible, snow-blue ambient, occasional warm-window glow
- Endor forest canopy dappled, sun-shaft through redwood, mossy-green ambient, fog-haze in valley
- Death Star Throne Room red-lit dais, bottomless-shadow walls, single overhead spotlight on Emperor's throne
- Death Star fluorescent corridor, sterile-white overhead strips, sharp shadows, no color
- Tatooine twin-suns harsh-noon, double-shadows, dust-shimmer, sandstone-amber walls
- Dagobah swamp thick-fog, mossy-green tint, Yoda's hut warm-window glow contrast
- Rebel-fleet Mon Calamari Cruiser bridge dim red-emergency lighting, console-glow on faces, holo-projector cyan
- AT-AT cockpit cyan instrument-glow, viewport snow-white BG, dramatic underlighting
- Death Star detention-block stark fluorescent, cell-bar shadows on floor, clinical chrome
- Tatooine sunset twin-suns, salmon-orange sky, long shadows, sand-amber warmth
- Imperial-shuttle hangar landing-platform, sodium-floor-lights, exhaust-fog, dramatic backlight
- Yavin 4 Massassi temple sunbeam through-canopy, mossy-green ambient, dust-mote shafts
- Endor village dusk fairy-light strings, golden-hour wood-warmth, fireplace amber, lantern flicker
- Hoth tundra blue-white whiteout, snow-blowing horizontal, exhaust-vapor visible
- Jabba's palace amber-lantern + cyan-tank-glow (Sarlacc tank), dancing-girl-costume colors, smoke-pillar
- Sail Barge desert canyon, rust-red rim-light from sunset, sand-pit darkness below
- Mos Eisley back-alley neon-strip lighting, puddle-reflection on cobblestone (rare rain)
- Yavin 4 briefing-room dim red-emergency, holo-projector cyan, monitor-glow on rebel pilots' faces
- Cantina back-room shadow-noir, amber-warmth from doorway, smoke layers
- Death Star trench vertical-trench-shadow, exhaust-port glow at end, sparks-cascade
- Mos Espa pod-racer arena dust-cloud lit by stadium-spotlights, audience-shadows
- Hoth Echo Base medical bay bacta-tank cyan-bioluminescent glow, monitor-pulse-light, sterile-white
- Tatooine Jawas sandcrawler-interior amber-lantern haze, mechanical-tinkering shadows, dim
- Cloud City carbonite-freezing chamber red-glow + steam-vapor, smoke-cloud, mid-freeze process
- Mustafar lava-platform red-orange under-glow, lava-river behind, heat-shimmer warping silhouettes
- Bespin Cloud City corridor sky-blue daylight through panels, white-art-deco diffuse, peaceful
- Geonosis arena harsh sun, dust-haze, audience-shadow stripes, sand-amber warmth
- Coruscant Jedi Temple atrium afternoon golden through high windows, marble-warm, dust-motes
- Coruscant lower-levels neon-strip lighting through pipe-haze, advertising-hologram glow
- Imperial Star Destroyer hangar pure-blue-white sodium-flood, exhaust-vapor, mechanical-shadow
- Naboo Theed Palace daylight cyan-blue through high arch-windows, marble-warm contrast, fountain-mist
- Kamino raining landing-platform, dim cyan ambient, cloning-vat green-glow visible
- Endor shield-bunker explosion-aftermath, fireball orange, smoke-pillar, AT-ST silhouette
- Throne Room final duel — sliver of green-light through windows, dais red-glow, Emperor in shadow
- Slave I cargo-bay hold dim cyan-monitor lights, frozen-carbonite block illuminated, vapor

━━━ FORMAT ━━━
Each entry: 10-20 words, comma-separated phrases. Always cinematic 70s/80s Star Wars mood, named location:
- "Mos Eisley cantina amber-jukebox glow, smoke-haze, dim booth-lighting, Modal Nodes mid-stage spotlight"
- "Hoth Echo Base hangar cold-cyan flood, vapor-cloud breath visible, occasional warm window-glow contrast"
- "Death Star Throne Room red-lit dais, bottomless-shadow walls, single overhead spotlight on Emperor's throne"

━━━ BANNED ━━━
- Disney-sequel-trilogy locations (Crait / Ahch-To)
- Generic "cinematic" without naming location

━━━ DEDUP RULE ━━━
- No two entries share LOCATION + LIGHT-COLOR + ATMOSPHERIC-PHENOMENON exactly

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
