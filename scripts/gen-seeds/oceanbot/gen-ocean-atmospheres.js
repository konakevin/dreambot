#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/ocean_atmospheres.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} UNDERWATER/OCEAN ATMOSPHERIC CONDITION descriptions for OceanBot. These describe water conditions, visibility, particulate, currents — the environmental quality of the water itself, not creatures or scenes.

Each entry: 10-20 words. One specific atmospheric condition.

━━━ CATEGORIES (mix across all) ━━━
- Dense particulate suspension creating hazy blue-green visibility
- Crystal-clear tropical water with 200-foot visibility and sunbeams
- Plankton bloom turning water emerald green with reduced visibility
- Thermocline shimmer where warm and cold layers meet and distort light
- Surface chop texture seen from below, fractured light dancing
- Murky estuary water with tannin staining and suspended sediment
- Current-swept particulate streaming horizontally through the frame
- Bubble curtain rising from volcanic vents on the seafloor
- Snow-like marine snow drifting down through deep blue water
- Surge and backwash creating oscillating visibility near reef
- Milky blue water from glacial runoff mixing with dark ocean
- Red tide bloom creating rust-colored water with eerie light

━━━ RULES ━━━
- WATER CONDITIONS only — not creatures, not scenes, not landscapes
- Describe what the water itself looks like, how light behaves in it
- Specific phenomena, not generic "clear water" or "murky water"
- No repeats — every entry a unique atmospheric condition
- Concise, technical but vivid language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
