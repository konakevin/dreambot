#!/usr/bin/env node
/**
 * ChibiBot bath-time SCENES — the new "vessel + location" pool for the
 * lean 6-axis rebuild (2026-06-05).
 *
 * Each entry: vessel first (named, sized, materialed), then ONE concise
 * location clause framing it. ~20-25 words.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/bath_time_scenes.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} BATH SCENES for ChibiBot — each one describes a SPECIFIC bath vessel and the location around it. Adorable tiny creatures (specified by a separate axis) bathe in these scenes.

Each entry: 20-25 words on one comma-separated line. Lead with the VESSEL. Then ONE concise backdrop clause for the location.

━━━ FORMAT — bath vessel first, location after ━━━

"Large copper claw-foot tub on a wood-floor cottage bathroom, soft cream walls and a window of garden green behind it."
"Wide hollow-coconut bath set on a tropical reef sandbar, gentle turquoise shallows lapping the rim."
"Polished brass hip-bath lashed to the prow of a tall-masted pirate ship, open Caribbean horizon beyond."
"Deep stone soaking pool sunk into the floor of a Japanese onsen, paper-screen wall sliding open onto a snowy maple courtyard."
"Generous copper kettle bath cradled in the basket of a hot-air balloon, patchwork farmland fields drifting far below."

━━━ THE BAR — every entry meets all 4 ━━━

- Vessel named first (claw-foot tub, copper hip-bath, hollow coconut bath, marble soaking pool, wooden barrel tub, stone hot-spring basin, etc.)
- Vessel sized + materialed — generous, soak-able, large enough for a creature to bathe in (no thimbles, no acorn caps, no oversized teacups)
- Backdrop clause is ONE short phrase — names the place, doesn't try to be the spectacle
- Picture-able as one frame with the bath dominating the foreground

━━━ VARIETY ACROSS THESE SETTINGS (roughly 3-4 entries each) ━━━

- Cozy indoor — cottage bath nook / cabin bathroom / treehouse interior / farmhouse / fairy-cottage stone interior / vintage tile bathroom
- Sky + aerial — cloud terrace / hot-air balloon basket / sky-island plunge pool / cliff porch / observatory dome rooftop
- Water + nautical — pirate-ship deck / lighthouse-top porch / canal-boat / floating coral reef shelf / dock-end soaking barrel
- Magical realm — crystal cave / glowing geode grotto / fairy-ring spring / wizard's tower / moss-glen pool / mushroom-grove hot spring
- Biome wild — black-sand beach hot spring / arctic ice-cave plunge pool / desert oasis sunken stone tub / jungle-canopy hollow-log bath / canyon-rim natural rock pool
- Architectural — Japanese onsen with maples / Roman villa pool with mosaic / Moroccan courtyard fountain / Greek temple terrace / Tibetan cloud-temple

━━━ OUTPUT ━━━

JSON array of ${n} strings. One entry per string. No preamble, no numbering, no commentary.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
