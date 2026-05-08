#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/underwater_scenes.json',
  total: 200,
  batch: 25,
  append: true,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} ANIME UNDERWATER scene descriptions for MangaBot's underwater path. Each entry is 30-50 words. Setting-only.

CONTEXT: Anime underwater / aquatic / sunken / mermaid aesthetic. Children-of-the-Sea / Ponyo / The-Little-Mermaid (Ghibli-coded) / Nagi-no-Asukara / Free!-underwater visual vocabulary. Bioluminescent oceans, sunken cities, coral temples, light-shafts piercing blue depths, drifting jellyfish.

Categories — rotate widely:
- Sunken city ruins (Atlantis-style submerged columns, coral-overgrown stones, fish schools)
- Coral-reef temple (temple-like structure made of growing coral)
- Bioluminescent deep-sea grove (glowing jellyfish drifting, dark-blue void)
- Underwater cave with glowing crystals (light-shafts through openings above)
- Kelp-forest path (towering kelp, sun-rays piercing through)
- Mermaid-village (anime mermaid-coded architecture, shells and stones)
- Submerged train carriage (rusted train sitting on the seabed)
- Cherry-tree underwater (surreal — anime sakura tree submerged in clear water)
- Underwater shrine (torii gate half-submerged, stone lanterns covered in coral)
- Whale passing through ruins (giant whale silhouette, distant ruins)
- Drifting jellyfish ballet (hundreds of glowing jellyfish in formation)
- Glowing deep-sea trench (slim canyon glowing with bioluminescence)
- Sunken school classroom (desks underwater with fish swimming through)
- Coral-grown library (books waterlogged, coral on shelves)
- Submerged tea-house (shoji screens shifted by current, koi-fish swimming through)
- Half-flooded subway tunnel (water knee-deep, train-tracks visible, light from broken ceiling)

EVERY entry must include:
- Specific underwater setting
- 4-6 environmental details (coral / kelp / fish-schools / hanging-lanterns submerged / barnacles / rusted-metal / bubbles / light-shafts / sand-floor / shells / stone-statues / waving sea-grass)
- 1-2 atmospheric effects (drifting bubbles / shafts of god-rays piercing surface / drifting plankton-particles / silt-stirring / drifting sea-snow / floating petals on the surface above)
- Lighting tone (caustic-light-rippling-on-surfaces / deep-blue-shadow / bioluminescent-glow / surface-shafts-piercing-down / cool-cyan / pastel-pink-and-blue)
- Sense of stillness / wonder / surreal beauty

ABSOLUTELY BANNED:
- NO photoreal underwater photography
- NO sexualized merfolk
- NO horror / dark-ocean dread
- NO crowds (one figure or empty)

Examples (write fresh):
- "Sunken Greek-style city ruins at moderate depth, marble columns toppled and coral-overgrown, schools of silver fish weaving between the pillars, light-shafts piercing down from the surface far above, drifting plankton-particles, sand-and-silt floor, distant stone statue half-buried, cool cyan-blue light, sense of ancient stillness"
- "Bioluminescent deep-sea grove with hundreds of glowing pink-and-violet jellyfish drifting in formation, dark-blue void surrounding, kelp-forest in the foreground gently waving, drifting bubbles catching the glow, soft pastel rim-lighting on the kelp-fronds, sense of cosmic underwater wonder"
- "Underwater shrine with a vermillion torii gate half-submerged tilted at an angle, stone lanterns coated in white coral and barnacles, koi-style fish swimming through the gate, shafts of golden surface-light cutting down through the water, sand-floor with drifting petals settled, deep cyan-blue ambient"

Output ONLY a valid JSON array of ${n} strings (30-50 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
