#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_village_wildlife_or_object.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} WILDLIFE-OR-OBJECT entries for a MangaBot anime-village keyframe. SCENE-LED — each entry names a SMALL WILDLIFE PRESENCE or AMBIENT OBJECT that adds living-world texture across the village frame. Adds genre-coded atmosphere without becoming a focal subject.

Each entry: 12-22 words. ONE specific wildlife OR object presence. Scale should serve the village (NOT dominate).

GENRE SPLIT (this 25-entry pool):
- 60% PASTORAL-PERIOD (Mushishi / Mononoke / Spice-and-Wolf register)
- 40% MODERN-JAPAN (Akihabara / Shimokitazawa / Showa-era)

WILDLIFE-OR-OBJECT VARIETY:
- Cat napping on a rooftop tile (orange tabby curled in afternoon sun)
- Koi visible in a pond beside the bridge (red-and-white shapes through clear water)
- Crane wading in the rice-paddy edge (white silhouette against green)
- Cloud of small butterflies drifting between cottages (cabbage-whites at dusk-edge)
- Fox-spirit silhouette glimpsed at the alley's end (Mushishi register, ambiguous)
- Dragonfly cloud humming over the paddy (translucent wings catching light)
- Chickens scratching at the lane's edge (small flock pecking)
- Persimmons heavy on a small tree at lane-edge (orange globes on bare branches)
- Wisteria-veil draped over a wooden gate (pale-lavender drift)
- Sakura-rain falling across the lane (petals tumbling between buildings)
- Autumn-leaf cyclone catching at a stone wall (maple-leaves whirling)
- Pair of crows on a power-line (Showa-era alley silhouette)
- Snow drifting onto upturned eaves (deep gassho-hamlet flurry)
- Spider-lily cluster growing wild at a stone-shrine base (red blooms)
- Frog statue beside a koi-pond (mossed stone amphibian)
- Vending-machine glow casting bug-halo of moths (Showa modern night)
- A small heron at the river-bank (still silhouette below the bridge)
- Yamabushi-deer briefly visible at the forest-edge of a village (Mononoke register)
- Hanging persimmons drying under deep eaves (rope-strung orange globes)
- Wind-chimes on a balcony catching breeze (glass + bell ensemble swaying)
- A neko-jizo statue covered in moss (cat-shape stone shrine)
- Hanging laundry shifting in wind (futon + yukata above)
- Bonsai pine on a windowsill (gnarled miniature in pot)
- Carp-streamer fluttering over an Edo machiya (Boys-Day koi-banner)
- Pile of fresh-fallen camellia blossoms on a stone basin

DO write:
- An orange tabby cat napping atop a kawara tile, curled in afternoon sun against weathered grey
- Red-and-white koi visible through clear pond-water below a small cypress bridge
- A cloud of cabbage-white butterflies drifting between cottage gaps at dusk-edge
- A fox-spirit silhouette glimpsed briefly at the alley's far end, ambiguous in twilight
- Sakura-rain falling across the lane, pale petals tumbling between weathered buildings
- A pair of crows perched on a sagging Showa-era power-line, silhouetted against the sky
- A bonsai pine on a kissaten windowsill, gnarled miniature catching neon-glow

DO NOT write:
- Hero-portrait subject
- Anything that would dominate the frame as primary subject
- Generic "birds in the sky" — name a SPECIFIC species and placement
- Modern megacity props
- Fantasy creatures beyond Mushishi-register subtle spirit hints
- Western wildlife

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
