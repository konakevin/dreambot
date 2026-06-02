#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_village_village_anchor.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} VILLAGE-ANCHOR entries for a MangaBot anime-village keyframe. SCENE-LED — each entry is the NAMED MAIN-ANCHOR village or streetscape that becomes the HERO of the frame. The village IS the subject (not a backdrop for a person).

Each entry: 12-22 words. ONE specific anime-Japan village / neighborhood anchor. Multi-tier depth implied (architectural mass + atmospheric distance).

GENRE SPLIT (this 25-entry pool):
- 60% PASTORAL-PERIOD anime (Mushishi / Mononoke / Spice-and-Wolf register — wooden-tiled / paddy-edge / mountain-shoulder / river-bend villages)
- 40% MODERN-JAPAN (Akihabara back-alley / Shimokitazawa / Asakusa / mid-century Yokohama / Showa-era Tokyo neighborhood / kissaten cafe street / Kichijoji yokocho)

ANCHOR VARIETY — wide spread of named scene types:
- Cedar-shrine in forest clearing (Mononoke / Mushishi register)
- Paddy-edge clay-tile village (Echigo terraces stepping down to wooden cottages)
- Stone-bridge over mountain river (Mushishi-era hamlet either side of clear water)
- Vermillion torii gate path leading uphill to mountain hamlet (Spirited-Away-pastoral)
- Mountain-onsen hamlet (steam rising from rotenburo, wooden ryokan terraced)
- Showa-era kissaten quarter (mid-century neon kanji glowing over narrow café street)
- Akihabara back-alley (vending machines stacked, otaku-shop kanji signs, overhead cables)
- Yokai-ridge village (paper-lanterns swaying along narrow ridge-path between dark-wood houses)
- Lighthouse-fishing village (wooden cottages tumbling down headland to harbour)
- Tibet-meets-Japan high-pass village (prayer-flag-strung wooden hamlet on mountain shoulder)
- Spice-and-Wolf trading hamlet (wagon-wheel ruts through muddy main-street, painted-sign shops)
- Mononoke iron-town gate (heavy wooden palisade ringing forge-village with smoke)
- Asakusa shitamachi street (low Edo-period rowhouses, shrine peeking at street's end)
- Shimokitazawa back-alley (vintage shop neon, cluttered narrow alleyway, basement-stairs)
- Kichijoji yokocho lantern alley (red-lantern jungle over narrow izakaya street)
- Mid-century Yokohama harborside (faded pastel apartment-blocks tumbling down to wharf)
- Hokkaido fishing hamlet under snow-roof eaves (wooden cottages buried under deep snowfall)
- Riverside paddy hamlet with old wooden bridge (rice fields mirror sky on both banks)
- Bamboo-ringed mountain village (cottages nested in tall green-cream culms)
- Persimmon-orchard outskirts of small town (autumn-orange trees ring a wooden village)
- Kyoto-style machiya street (rows of lacquered-wood townhouses, narrow stone lane)
- Tea-mountain village (rows of tea-bush hillsides hugging a single ridge of wooden houses)
- Snow-roofed gassho-style hamlet (steep-thatched cottages buried in midwinter Shirakawa-go)
- Coastal lighthouse village at storm-edge (Showa-era cottages backed by typhoon clouds)
- Rural shrine-town at festival prep (lanterns hung between cedar trunks, wooden inn behind)

DO write:
- A cedar-shrine clearing nestled in mountain mist, dark-wood torii catching first-light at the back of the village
- An Echigo paddy-edge village with terraced rice fields stepping down to a cluster of clay-tile cottages
- A vermillion torii path climbing through cedar shadow toward a wooden mountain-onsen hamlet
- An Akihabara back-alley jungle of vending machines, otaku-shop kanji glowing, overhead power-cables sagging
- A Showa-era kissaten quarter with neon kanji buzzing over a narrow mid-century café street
- A Shirakawa-go gassho hamlet of steep-thatched cottages buried under midwinter snowfall
- A Spice-and-Wolf trading hamlet with wagon-rut main-street, painted shop-signs and an inn at the far end

DO NOT write:
- Hero-portrait framing or any close-up character language
- Single-building scenes (need village MASS, multi-house depth)
- Pure landscape with NO buildings (this is the village pool — architecture must be visible)
- Cyberpunk neo-Tokyo (different path)
- Modern megacity skyscrapers (different path)
- Western-style villages (Europe / America)
- Generic "Japanese village" — name the specific register

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
