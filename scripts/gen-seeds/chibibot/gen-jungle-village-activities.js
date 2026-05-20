#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/jungle_village_activities.json',
  total: 50,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} TINY-RESIDENT ACTIVITY descriptions for ChibiBot jungle-village — what a SOLO tiny resident creature is DOING in the village, going about their day. The resident is a TINY scale-prover (small but visible), not centered. Active verb-led story-driven activity.

Each entry: 15-25 words. ONE specific resident activity. ACTIVE VERB-LED. Interacting with a CONCRETE jungle-village prop.

━━━ FORMAT — ACTIVE VERB + JUNGLE PROP ━━━

Every entry MUST start with an active verb + include a concrete jungle-village prop:
✓ "Hauling a bundle of palm-fronds up a vine-ladder with both paws gripping the rungs..."
✓ "Watering a row of orchid-pots in a banana-leaf trough with a tiny gourd-watering-can..."
✓ "Mid-skip across a rope-bridge clutching a basket of fresh-picked rambutan fruits..."
✓ "Pushing a tiny wheelbarrow of mango-stones up a moss-stone village path..."
✓ "Tending a hanging-orchid garden on a treehouse balcony with a brass pruner..."
✓ "Mid-deliver of a leaf-wrapped parcel through a Dutch-door of a bark-cottage..."
✓ "Sweeping a stone doorstep with a tiny fern-broom under hanging-vine lantern..."

━━━ CATEGORY DISTRIBUTION ━━━

- 25% TRAVEL / CROSSING (carrying parcels across rope-bridges / mid-skip with kite / pushing wheelbarrow up a jungle path / climbing a vine-ladder)
- 20% DOMESTIC / CHORE (sweeping a stone doorstep / hanging laundry on a vine / shaking out a woven-mat rug / watering orchid-pots)
- 15% MARKET / COMMERCE (selling banana-leaf-wrapped sweets at a stall / hauling a basket of pineapples to market / mid-pour of jungle-tea / chalking a sign on a wooden board)
- 15% TENDING (pruning rose-vines with a brass tool / picking ripe star-fruit from a tree / harvesting orchid blossoms / arranging fruit in a woven basket)
- 10% DELIVERY (mid-receive of a leaf-wrapped parcel / handing off a basket of muffins / accepting a vine-letter from a bird / delivering tea-cups door-to-door)
- 10% LEISURE / PLAY (mid-leap from one platform to another / reading on a balcony hammock / flying a leaf-kite from a treehouse / playing with a hand-carved spinning-top)
- 5% MID-DISCOVERY (mid-pick of a perfect orchid / mid-find of a glowing seed-pod / mid-look-up at a butterfly cluster)

━━━ HARD BANS ━━━

- NO setting / time / weather / village language (those are other axes)
- NO species names
- NO multi-creature scenes (this is SOLO resident)
- NO scary / sad / threatening
- NO indoor / cozy-room scenes (this is jungle-village outdoor)

━━━ OUTPUT ━━━

JSON array of \${n} strings. Each begins with an active verb.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
