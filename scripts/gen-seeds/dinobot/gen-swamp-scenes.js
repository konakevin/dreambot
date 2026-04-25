#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/swamp_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SWAMP AND RIVER scene descriptions for DinoBot — semi-aquatic prehistoric life in murky waterways, foggy swamps, muddy riverbanks.

Each entry: 15-25 words. One specific swamp/river scenario with species + water interaction + atmosphere.

━━━ CATEGORIES ━━━
- Spinosaurus fishing in murky shallows, snout breaking the surface
- Giant crocodilians lurking in still water, only eyes visible
- Dinosaurs drinking at a river's edge, reflections in the water
- Pterosaurs skimming the surface for fish, wingtips touching water
- Sauropods wading through a flooded forest, water to their bellies
- Fallen trees creating natural bridges, small dinosaurs crossing
- Foggy swamp at dawn, shapes moving through the mist
- Turtle-covered logs, dragonflies the size of birds, humid air
- Theropod stalking prey through knee-deep marsh water
- River delta with sandbars, nesting sites on the banks

━━━ RULES ━━━
- Water is the setting — muddy, foggy, teeming with life
- Include aquatic atmosphere (fog, humidity, reflections, ripples)
- Mix aquatic and terrestrial species interacting with water
- Lush and alive, not stagnant or dead

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
