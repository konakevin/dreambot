#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_village_architecture.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ARCHITECTURE entries for a MangaBot anime-village keyframe. SCENE-LED — each entry names the SPECIFIC BUILDING DETAIL or facade that grounds the village frame (this is what gives the village its visual identity).

Each entry: 12-22 words. ONE specific Japanese architectural element / building type / facade detail. Material truth + period coding.

GENRE SPLIT (this 25-entry pool):
- 60% PASTORAL-PERIOD wooden architecture (Mushishi / Mononoke / Spice-and-Wolf register)
- 40% MODERN-JAPAN (Akihabara / Shimokitazawa / Showa-era kissaten / mid-century Yokohama)

ARCHITECTURE VARIETY:
- Curved hisashi eaves (deep wooden overhangs casting shadow)
- Dark-stained kiso-wood vs lacquered cypress (textural contrast)
- Kawara clay-tile roof (sloping grey-tile in stacked rows)
- Shoji windows glowing warm from within (paper-screen panels)
- Izakaya facade (low-slung red-lantern bar with noren curtain)
- Vermillion shrine arch (torii grouped at hamlet edge)
- Wooden footbridge over creek (curved hand-railed cypress)
- Edo-period machiya rowhouses (narrow tall townhouses in lacquered-wood)
- Mid-century apartment with rounded balcony (Showa-modern concrete-and-tile)
- Kissaten facade with neon kanji (mid-century café sign glow)
- Gassho-zukuri steep-thatch roof (Shirakawa-go A-frame deep-snow design)
- Stone-stepped pagoda glimpsed beyond cottage roofs
- Wooden palisade gate of iron-town (Mononoke forge village)
- Showa-era public bathhouse (sento with painted facade and chimney)
- Painted-sign apothecary (Spice-and-Wolf wagon-trade shopfront)
- Stilt-house over creek (mountain-village house on wooden poles above stream)
- Old-Tokyo wooden noodle stand (yatai with curtained front)
- Vending-machine cluster glowing under power-cable canopy (modern alley)
- Bonsai-shop facade with stepped display-stand
- Stone lantern row leading to wooden inn entrance
- Mid-century neon arcade signage (showa neon glow over alley)
- Tiled roof with weathered moss-green patina (rural pastoral)
- Tatami-inn balcony with hanging futon airing
- Asakusa shitamachi rowhouses with shared-wall lacquered-wood facades
- Cypress beam-and-post framing exposed at second-storey balcony

DO write:
- Curved hisashi eaves of dark-stained cypress casting deep shade across the cobbled lane
- Kawara clay-tile roofs stacking down the slope in weathered grey rows, moss in the joints
- A Showa-era kissaten facade with humming neon kanji and a single bare bulb above the door
- Vermillion torii gate framing the lane, lacquered paint chipped at the base from rain
- Gassho-zukuri thatched-roof cottages with their steep A-frames buried under snow eaves
- Mid-century apartment block with rounded concrete balconies and pastel-tile facade
- Vending-machine cluster glowing under a sagging canopy of overhead power-cables

DO NOT write:
- Hero-portrait or character close-up
- Single-element entries without architectural specificity
- Cyberpunk megabuildings / skyscrapers (different path)
- Generic "wooden buildings" — name the register
- Western architecture
- Castles or fortresses (samurai-era path)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
