#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/neo_tokyo_district.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} DISTRICT / NEIGHBORHOOD entries for a MangaBot neo-tokyo cyberpunk anime keyframe. Each entry is the SPECIFIC CYBERPUNK BIOME the scene sits in — different neighborhoods of neo-tokyo have very different feels.

Each entry: 12-22 words. One specific district + its visual signature.

DISTRICT VARIETY (every entry distinct):
- Shibuya-style scramble crossing (massive intersection, holographic ads, crowd silhouettes)
- Akihabara electronics street (vertical electronics-shop towers, anime-billboard saturation)
- Underground market / black-market (low-ceiling sprawl, gray-market vending, no sky)
- Yakuza-strip back-alley (tatami-bar entrances, smoking salarymen, hostess-club neon)
- Ramen / yatai food alley (steam-pillars, paper-lanterns over tech, stall-noren chains)
- Megacorp atrium / corporate lobby (sterile chrome, security-bots, fountain hologram)
- Rooftop slum / shanty-on-tower (improvised tin-shacks, antenna-forest, plant-vines)
- Red-light district / pink-hostess strip (saturated pink + magenta, hostess-club facades)
- Industrial port / cargo-dock zone (containers, cranes, rusted metal + neon-strip lighting)
- Hovercar-highway underpass (suspended hovercar lanes, light-trail blur above)
- Cyber-clinic / surgery-back-alley (medical-cross neon, plastic-strip doors, surgery silhouettes)
- Pachinko-arcade strip (rows of glowing arcade machines, salaryman gambling crowd)
- Subway / metro tunnel (fluorescent + maglev rails, train-arrival glow)
- Sky-district / floating-platform high (suspended walkways, cloud-level, city far below)
- Old-meets-new district (tatami-bars beside cyber-tech shops, traditional-meets-tech blend)

DO write (vary widely):
- Shibuya-scramble intersection with massive holographic ads stacking the air and silhouette-crowds crossing in every direction
- Akihabara electronics-street vertical with anime-billboards and electronics-shop signage rising twelve stories up both sides
- Yakuza-strip back-alley with hostess-club neon and steaming exhaust vents, salaryman shapes hunched at tatami-bar entrances
- Ramen-alley with paper-lantern strings overhead and steam-pillars from yatai stalls along the wet pavement
- Megacorp lobby atrium with sterile chrome floors, security-drones hovering, central hologram-fountain projecting kanji

DO NOT write:
- Specific signage details (separate axis)
- Architectural anchors (separate axis — landmark_anchor)
- Vertical clutter specifics (separate axis)
- Historical Japan (no torii / pagoda — those are samurai-era)
- Modern unbranded city (the district must read as NEO-TOKYO specifically, cyberpunk-coded)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
