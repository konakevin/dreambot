#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/dungeon_depth_lighting.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (
    n
  ) => `Write ${n} LIGHTING descriptions for PixelBot's dungeon-depth path. Each entry is 15-30 words describing DIM, THREATENING, ATMOSPHERIC dungeon lighting (Diablo + Hades + Hyper Light Drifter + Dead Cells + Salt and Sanctuary lineage).

EVERY entry must include:
- ALWAYS DIM mood — torches / candles / magical glow / bioluminescent fungi / single-source / cracked-skylight beam as PRIMARY light source. NEVER bright daylight.
- Specific light source (wall-torch, candle-stub, runic-glow, fire-pit, magical-circle, pale fungi-glow, broken-skylight beam, brazier)
- Deep shadow contrast — most of frame in darkness, a single light cuts through
- Light flicker / color (orange-flicker / cool-cyan / blood-red / magical-violet / sickly-green)

VARIETY: rotate broadly across light sources, color tints, intensity levels.

Examples (write fresh):
- "Two flickering wall-torches casting orange-amber dancing shadows across cracked stone floor, deep shadow corners, oppressive blackness receding into distance."
- "A single magical-circle inscribed on the floor pulsing pale-violet runic-glow, deep shadows surrounding, faint torch-glow at the chamber's far end."
- "Bioluminescent pale-cyan fungi-glow as primary light source on cavern walls, deep blue-black shadow corners, dripping water-light reflections on wet stone."
- "Single beam of pale moonlight through a broken-skylight cutting harsh through the chamber, dust motes catching the beam, surrounding darkness oppressive."
- "Blood-red brazier-fire flickering orange-crimson on stone walls, dancing shadow silhouettes, deep oppressive darkness in the cavern's far reaches."
- "Sickly-green poisonous magical glow leaking from a cracked sarcophagus, deep blue-black shadows, faint dripping-water reflections in puddles."
- "A swinging single oil-lantern casting strobing shadows, dust motes drifting in the strobing light, deep oppressive negative-space dark."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
