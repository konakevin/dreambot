#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/koi_backdrop.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} JAPANESE GARDEN BACKDROP descriptions for a kawaii koi-pond scene. The pond is the foreground; this is the SURROUNDING garden setting that frames it.

Each entry: 18-30 words. ONE specific Japanese garden setting.

DO write:
- A traditional Japanese garden with red-and-cream pagoda rising in the distance, wisteria-draped pergola, mossy stone-lanterns
- A zen rock-garden corner with bonsai trees in clay-pots, raked-sand patterns, stone-toro-lanterns flanking
- A wisteria-grove with cascading lavender-and-pink blooms draping overhead, mossy pillars wrapped in vines
- A Japanese garden teahouse with sliding shoji screens, wooden-beam veranda, paper-lanterns hanging above
- A bamboo-grove garden with tall green stalks behind, fallen leaves on mossy ground, soft mist
- A temple-garden courtyard with red torii-gate in distance, cherry-blossom trees, stone-path winding through
- A Japanese tea-garden with stone bridges arching over the pond, hydrangea bushes, mossy bamboo fence
- A moon-viewing garden at dusk with full pale-pink moon rising behind a wooden viewing-platform
- A koi-pond pavilion with curved wooden roof, lantern-light glowing inside, wisteria draping
- A Japanese cherry-blossom garden with pink-blossom trees framing the pond on all sides
- A rock-and-water Japanese garden with smooth pebbles edging, lavender wisteria draping above
- A small Japanese village pond with wooden bridge, paper-lanterns strung between trees, cottage-roof in distance
- A monastery garden with stone steps leading to pond, white pebbles, wisteria draping a pergola
- A samurai-era Japanese garden with stone lanterns, wooden teahouse, cherry-blossom trees behind
- A Japanese fairy-tale garden with rainbow-bridge over pond, cherry-trees, magical lantern-glow
- A misty mountain-Japanese-garden with mountains in soft pastel-blue distance, wisteria foreground
- A pagoda-and-temple Japanese garden with multi-tier red pagoda visible behind cherry-blossom trees
- A Japanese onsen-garden with stone bath nearby, bamboo fence, hydrangea hedges
- A Japanese ryokan-courtyard garden with wooden buildings, lattice screens, stone-lantern paths
- A Japanese sukiya-style garden with elegant wooden architecture, smooth stones, wisteria pergola

DO NOT write:
- Foreground (creatures, pond surface, lotus blooms — those are foreground/separate axes)
- Modern urban / industrial / mall scenes
- Pathway / lane RECEDING into vanishing point through the foreground
- Dark / scary / dirty scenes — kawaii painterly Ghibli
- Real kanji / Japanese-text labels

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
