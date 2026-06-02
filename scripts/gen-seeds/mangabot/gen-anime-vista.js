#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_vista.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (
    n
  ) => `Write ${n} ANIME VISTA descriptions for MangaBot's character paths. Each entry is 20-35 words. The vista is a SCALE-DEFINING backdrop visible behind/around the character — the awe-inspiring scenic anchor that makes each render feel like a wall-poster anime moment.

CONTEXT: Shinkai-grade backgrounds. Lush, vibrant, frame-worthy. The character will be the foreground subject; this vista fills the upper-mid frame and dominates the horizon.

Categories — rotate widely:
- Mt. Fuji backdrop (snow-capped at sunrise / silhouetted against twilight / framed by cherry blossoms)
- Neo-Tokyo skyline (massive Tokyo Tower at twilight / Shibuya crossing far below / neon-lit skyscraper canyon)
- Ocean horizons (golden-hour ocean meeting sky / rocky coastal cliffs at dusk / sea-of-clouds from a mountain peak)
- Cherry-blossom landscapes (mountain ridge of pink blossoms / blossom-lined river / temple cherry-tree at full bloom)
- Sunset rice paddies stretching to horizon, mountains beyond
- Storm sky over Tokyo Tower (lightning-violet thunderheads, neon city below)
- Festival fireworks bursting over a riverbank
- Bamboo forest receding into dappled light
- Snowy mountain range / Hokkaido winter scene
- Rainy cityscape — wet glass overlooking blurred neon Tokyo
- Aurora-style impossible-color sky (Mononoke spirit world)
- Floating fantasy islands (Laputa / Skypiea aesthetic)
- Magic-hour orange-purple gradient sky over rooftops
- Golden cosmic night sky with sparse stars (Shinkai cosmic backgrounds)
- Massive ancient temple complex on mountainside
- Ghibli-coded countryside hills with single tree on horizon
- Tropical-blue summer ocean with cumulus clouds
- City rooftop view at blue-hour with first window-lights coming on
- Snow-falling at night with distant lit windows

EVERY entry must include:
- The vista subject (mountain / skyline / ocean / cherry-blossom / etc.)
- Time-of-day or color-palette anchor (golden-hour amber / twilight violet / blue-hour blue / midday clear / etc.)
- 1-2 atmospheric depth details (clouds receding / mist between hills / petals falling / neon haze / aurora shimmer / etc.)
- Awe-inspiring scale word (towering / sprawling / boundless / vast / receding into haze)

ABSOLUTELY BANNED:
- NO crowd, NO multiple distinct figures
- NO modern Western city specifically (Tokyo / Kyoto / Osaka / Hokkaido / generic Japan-coded only)
- NO sci-fi spaceships
- NO fantasy battles or armies

Examples (write fresh):
- "Mount Fuji in the distance silhouetted against a rose-and-amber twilight sky, layered low clouds receding around its base, foreground cherry-blossom branches framing the right edge"
- "Neo-Tokyo skyline at blue-hour with Tokyo Tower glowing scarlet against fading indigo, hundreds of building windows lighting up across the receding cityscape"
- "Vast cherry-blossom mountain ridge at golden hour, hundreds of pink-canopy trees rolling to the horizon, drifting petals catching warm afternoon light, mountains receding into amber haze"
- "Coastal cliffs at golden hour with the ocean stretching to a hazy horizon, distant fishing boats catching sunlight, gulls circling far below, salt-air haze receding to gradient sky"

Output ONLY a valid JSON array of ${n} strings (20-35 words each). No preamble, no commentary.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
