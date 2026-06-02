#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/samurai_character_role.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CHARACTER ROLE entries for a MangaBot samurai-era keyframe. Each entry describes the figure(s) in the frame — by ROLE only, NEVER by name. Mononoke / Demon-Slayer / Rurouni-Kenshin / Vagabond archetypes.

Each entry: 10-22 words. Specifies WHO is in frame + COUNT (solo / pair / small group). Outfit and bearing are part of role but no specific identity.

ROLE DISTRIBUTION across the 50:
- 25% SOLO RONIN (masterless wandering swordsman — weathered straw hat / tattered haori / katana at hip)
- 15% SOLO MONK / PRIEST (saffron robe, walking staff, prayer beads / shaved head wandering monk)
- 12% TWO DUELISTS (squared off, katanas drawn or sheathed, clan colors)
- 10% SENSEI + APPRENTICE (older swordsman teaching younger student — formal gi)
- 8% CLAN SAMURAI (formal armor, banner-bearing, mounted or on foot)
- 8% WANDERING SWORDSWOMAN (rare — naginata or katana, traveling cloak)
- 6% HOODED STRANGER (deep straw hat hides face, dust-cloaked traveler)
- 6% YOUNG MESSENGER / RUNNER (boy or girl with letter-bag racing through scene)
- 5% TEMPLE GUARDIAN MONK (warrior-priest with bo-staff and prayer beads)
- 5% MOUNTED SAMURAI (rider on horse with full armor, pennant streaming)

DO write:
- A lone ronin in a tattered grey haori with straw hat tipped low, katana sheathed at his hip
- Two duelists facing off, one in dark-blue clan armor, the other in dust-grey traveling clothes
- An elderly sensei in formal black gi guiding a teenage apprentice through a kata
- A wandering monk in a faded saffron robe carrying a wooden walking staff and prayer beads
- A masked clan samurai in lacquered red armor with a war fan tucked at the belt

DO NOT write:
- Named characters (Kenshin / Zoro / specific historical figures)
- Modern dress
- Specific facial features that would lock a particular look
- Detailed weapons specs (just "katana" / "naginata" — no inlay specifics)
- Group-of-many (10+) — keep to 1-3 figures so composition stays readable
- Gore or violence — implied combat only

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
