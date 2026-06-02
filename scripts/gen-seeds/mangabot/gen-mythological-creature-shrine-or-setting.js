#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mythological_creature_shrine_or_setting.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SHRINE-OR-SETTING entries for a MangaBot mythological-creature keyframe. SCENE-LED — each entry names a SPECIFIC JAPANESE SACRED-NATURAL LOCATION where the yokai HERO appears. The setting frames the creature and provides cultural anchoring. Mononoke / Spirited-Away / Mushishi / Kakuriyo / xxxHolic register.

⚠️ CRITICAL: ONLY Japanese sacred / natural / mythological locations. NEVER western castles / European forests / Greek temples / Egyptian pyramids. NEVER WESTERN. Authentic Japanese place language: torii / shimenawa / inari / shinto / kami / yokai-bridge / cedar-shrine / persimmon-orchard / Mt-Fuji.

Each entry: 12-22 words. ONE specific Japanese setting + ONE atmospheric / architectural detail that proves it. Setting must accommodate a HERO-SIZED yokai (40-70% of frame), so locations need scale (vertical pillars, broad clearings, sweeping mist).

SETTING VARIETY (Japanese sacred + natural):
- Bamboo grove with vermilion torii row stretching into mist
- Cedar shrine with thick shimenawa rope strung between two ancient trees
- Waterfall cascade with mist clouding the basin (ryujin / yuki-onna register)
- Mt-Fuji snowfield at dusk, the cone-shape silhouetted against violet sky
- Persimmon orchard at dawn, gnarled trees laden with orange fruit, mist between rows
- Yokai bridge spanning a black ravine, lanterns swinging from cypress beams
- Underground onsen cavern, steam rising from sulphur-pools, stone-Buddha relief
- Autumn-maple grove ablaze with red leaves, single shrine peeking through
- Mountain pass with low fog, stone jizo statues lining the path
- Inari-shrine path of red torii arches, fox-statues at the gate
- Cherry-blossom temple courtyard, petals drifting through the gate
- Bamboo forest with paper-lanterns strung between stalks, twilight green
- Floating-island shrine above cloud-sea, cypress pillars half-veiled in mist
- Iron-town forge village at the foot of a wooded mountain (Mononoke register)
- Snow-buried gassho-zukuri village under starlit blizzard
- Frost-river under moonlight, ice-shards stacking at the bank
- Cherry-petal river-bridge in spring, water carrying drifting pink petals
- Black-stone shrine in a moss-covered ravine, water trickling between mossy steps
- Wisteria veil draping a temple gate, purple cascades brushing the lintel
- Mountain hot-spring at twilight, mineral-blue water steaming under cedar canopy
- Foxfire-lit cemetery at midnight, weathered headstones leaning in tall grass
- Lotus pond at a temple's edge, paper-lanterns reflected on the still surface
- Frost-bound torii half-buried in winter snow, single crow perched atop
- Edo-period yokai-festival lane at dusk, paper-lanterns strung across alley
- Black-cedar mountain shrine at thunderstorm, lightning splitting the sky behind the torii

DO write (Japanese setting + atmospheric proof, scale accommodating hero yokai):
- A bamboo grove with a vermilion torii row stretching into mist, the lanes wide enough for a coiled dragon
- A cedar shrine with thick shimenawa rope strung between two ancient trees, fox-statues guarding the steps
- A waterfall cascade with mist clouding the basin, vermilion footbridge half-veiled in spray
- Mt-Fuji snowfield at dusk, the cone-shape silhouetted against violet sky, frost-crust glittering
- An inari-shrine path of red torii arches receding into bamboo, fox-statues clustered at the gate
- A floating-island shrine above cloud-sea, cypress pillars half-veiled in lifting mist
- An iron-town forge village at the foot of a wooded mountain, forge-smoke curling over thatched roofs

DO NOT write:
- ANY western architecture (European castle / Gothic cathedral / Greek temple / pyramid)
- ANY western nature (Black Forest / English moor / Alps / Sahara)
- Modern cityscapes (Tokyo skyscraper / neon district — different paths)
- Generic "forest" / "mountain" without Japanese specificity
- Settings too small to fit a hero-sized yokai (closet / interior bedroom)
- Multiple settings per entry (pick ONE place)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
