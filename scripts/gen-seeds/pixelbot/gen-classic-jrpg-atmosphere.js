#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/classic_jrpg_atmosphere.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} ATMOSPHERE descriptions for PixelBot's classic-jrpg path (Zelda LttP / FF VI / Chrono Trigger / Secret of Mana / Earthbound / Lufia II 16-bit-era top-down JRPG aesthetic — used as inspiration only, never named in output).

Each entry is 15-30 words. EVERY entry must include 2-3 of these animated-feel JRPG elements:
- Drifting cherry-petals / autumn-leaves / spring-pollen
- Drifting dust motes in light shafts (dungeons / interiors)
- Drifting firefly-glow at dusk
- Dripping water from cave-stalactites
- Drifting magical-motes pale-violet / pale-cyan
- Drifting smoke-trails from chimneys / hearths / torch-rooms
- Drifting embers from fire-pits / lava-cracks
- Drifting snow / falling rain
- Bouncing animated-fish in water
- Hopping insects in tile-grass
- Drifting bubbles from underwater
- Sparkle-motes around treasure chests
- Drifting cobwebs in dungeons
- Drifting steam from hot-spring / kettle / forge
- Drifting petals from cursed-rose-bushes

Examples (write fresh):
- "Drifting cherry-petals across the village square, dust-motes in golden god-rays, hopping insects in tile-grass, drifting smoke-trail from the smithy chimney."
- "Drifting dust-motes in the torch-shaft, dripping water from cave-stalactites, drifting cobwebs swaying in side passages, scattered bone-pile in foreground corner."
- "Drifting firefly-glow at dusk between cottages, lit lantern-string overhead casting warm-orange dappled light, drifting petals on the cobblestones, distant owl-silhouette."
- "Drifting magical-motes pale-violet around the rune-stone, soft mossy ambient, drifting pollen-particles in the sunbeam, distant bird-call silhouette in middle-distance."
- "Drifting embers from the lava-stream, drifting smoke-trail rising from cracked stone, oppressive heat-shimmer, distant dragon-silhouette wing-spread in the back chamber."
- "Drifting snow over the ice-huts, distant aurora-shimmer in the night sky, bouncing snow-fox prowling, cold breath-mist visible on hero sprites."
- "Drifting bubbles rising from the underwater treasure-cave, sparkle-motes around the chest, drifting kelp-fronds, hopping bioluminescent-fish in the foreground."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
