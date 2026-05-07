#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/jrpg_dreamscape_lighting.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} LIGHTING descriptions for PixelBot's jrpg-dreamscape path. Each entry is 15-30 words describing surreal cosmic JRPG-cutscene lighting (Final Fantasy mode-7 + Octopath HD-2D pivotal cutscenes + Sea of Stars dream sequences + Chrono Trigger time-vortex + Earthbound surreal interludes).

EVERY entry must include:
- COSMIC / SURREAL / OTHERWORLDLY mood — never mundane realistic light
- Specific cosmic-light source (refracted prism-light, starlight, galaxy-shimmer, moonbeam through cosmic clouds, runic-pulse-glow, cosmic-aura halo, world-tree leaf-glow, summon-spirit pulse, time-vortex shimmer)
- COLOR — soft pastels (pearl-white, opalescent, pink-and-violet cosmic, golden-rose, pale-cyan, lavender-blue) NOT saturated
- DREAMY DIFFUSION — soft falloff, no harsh edges, blurred cosmic-haze quality

VARIETY: rotate broadly across cosmic light sources and color palettes.

Examples (write fresh):
- "Refracted prismatic rainbow-light through crystalline cathedral walls, drifting opalescent haze, soft pearl-white cosmic-glow ambient, gentle violet-edge falloff."
- "Starlight from a swirling cosmic-galaxy backdrop, soft pink-and-violet nebula-glow ambient, drifting pale-cyan magical-mote particles catching the starlight."
- "Single golden cosmic moonbeam piercing through layered cosmic-cloud parallax, drifting petal-particles catching the warm beam, deep cool-cyan ambient surrounding."
- "World-tree leaf-glow pale-gold raining downward from infinite-trunk above, drifting magical motes, soft golden-rose ambient, opalescent cosmic-haze."
- "Time-vortex shimmer pale-violet swirling around floating clock-faces, drifting hourglass-sand catching shimmer-light, deep pink-and-violet cosmic ambient."
- "Summon-spirit elemental aura pulsing rainbow-iridescent around a floating titan, drifting magical-particle halo, deep starfield-black cosmic backdrop."
- "Refracted-prism-light scattering across a crystal-staircase from above, soft opalescent haze, drifting feather-particles, pale-violet cosmic ambient."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
