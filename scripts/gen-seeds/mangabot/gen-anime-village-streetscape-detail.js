#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_village_streetscape_detail.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} STREETSCAPE-DETAIL entries for a MangaBot anime-village keyframe. SCENE-LED — each entry names a MIDGROUND ACTIVITY DETAIL that fills the street / lane / plaza. This is what gives the village LIFE without becoming a hero-portrait. Vendor stalls, gathered objects, gear arrangements, etc — NOT character close-ups.

Each entry: 12-22 words. ONE specific midground streetscape detail. Multi-tier depth contribution.

GENRE SPLIT (this 25-entry pool):
- 60% PASTORAL-PERIOD (Mushishi / Mononoke / Spice-and-Wolf register)
- 40% MODERN-JAPAN (Akihabara / Shimokitazawa / Showa-era / kissaten / mid-century)

STREETSCAPE-DETAIL VARIETY:
- Fish-vendor cart half-unfolded (umbrella up, ice glistening, baskets of mackerel)
- Paper-lantern vendor (lanterns hanging in rows from cart-frame)
- Izakaya stool clusters spilling onto the lane (low wooden stools and crates)
- Koi-pond bridge with arched cypress rail (red koi visible in clear water below)
- Temple bell tower (stone steps leading up, large bronze bell visible)
- A single vending-machine alone glowing under power-cables (Showa modern)
- Red telephone booth at an alley corner (Showa-Tokyo memorabilia)
- Kissaten chairs set out on the cobble (mid-century café spillover seating)
- Hanging laundry strung between balconies (futon and yukata airing)
- Paper-charm wall at a small shrine (omikuji tied to wooden lattice)
- Shrine offering pile (rice, sake-bottles, fruit stacked at torii base)
- Wagon parked outside an inn (trade-cart with painted side-panels)
- Stacked sake barrels at a brewery facade (cedar barrels tiered three-high)
- Open-air noodle stand with steam rising (yatai with curtained front)
- Bicycle rack overflowing outside a kissaten (mid-century commuter bikes)
- Lantern-light cast across wet cobble after rain
- Tea-bushes in roadside terraces hugging the village outskirts
- Stack of cypress logs being seasoned outside a carpenter's shop
- Daikon and persimmons hanging to dry under deep eaves
- Paper-screen door slid half-open showing tatami glow within
- Showa neon-sign cluster (vintage kanji signage stacked vertically)
- Stone lantern alley (toro lanterns lit, leading toward a shrine)
- Wooden water-trough fed by bamboo-pipe spring (mountain hamlet)
- Curtain-fronted bath-house entry with noren split and steam rolling out
- Antique-shop window crammed with kokeshi and old porcelain (Showa Asakusa)

DO write:
- A fish-vendor cart half-unfolded, ice glistening over baskets of silver mackerel, umbrella casting amber shade
- Paper lanterns swaying in long rows from a wandering lantern-vendor's bamboo frame at the bend
- Izakaya stool clusters spilling onto the lane, low wooden stools and crates ringed by glowing red lanterns
- A single Showa vending machine glowing alone under sagging power-cables, its hum almost visible
- A kissaten's cane-back chairs set out on the wet cobble, neon kanji catching the rain-reflection
- Stacked cedar sake-barrels tiered three-high across the brewery facade, weathered hoops bright
- Hanging laundry strung between two balconies, futon and yukata airing slow in the afternoon

DO NOT write:
- Hero-portrait character close-ups
- Pure architecture (separate axis)
- Empty-frame scenery (this should be an ACTIVITY detail)
- Generic "shops along the street" — name a SPECIFIC midground element
- Modern megacity / cyberpunk
- Western elements

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
