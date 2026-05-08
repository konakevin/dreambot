#!/usr/bin/env node
/**
 * SHARED scenarios pool for ToyBot.
 *
 * "What toys get up to when nobody's looking" — Toy Story-inspired
 * multi-character story scenarios in real-world settings. Used across
 * ALL toy paths (vinyl/claymation/plush/etc.) so the WHO (cast) lives
 * in path-specific pools while the WHAT (activity) is shared.
 *
 * Each entry: 24-40 words, comma-separated phrase clusters, names a
 * scenario + the activity beat + the real-world setting + cast size.
 */
const { generatePool } = require('../../lib/seedGenHelper');

const TOTAL = parseInt(process.env.TOTAL, 10) || 25;
const APPEND = process.env.APPEND === 'true';

generatePool({
  outPath: 'scripts/bots/toybot/seeds/toy_scenarios.json',
  total: TOTAL,
  batch: Math.min(TOTAL, 25),
  append: APPEND,
  metaPrompt: (n) => `You are writing ${n} TOY SCENARIO descriptions for ToyBot. These are SHARED across all toy paths (vinyl Funko Pop, claymation, plush, action figures, etc.) — the WHO comes from the path's cast pool, this scenario describes the WHAT and WHERE.

The vibe is TOY STORY — what do toys get up to when their humans aren't looking? Multi-character story moments in real-world environments at toy scale. Implied narrative — cause + reaction, who's doing what to whom, what's about to happen.

Each entry: 24-40 words. Comma-separated phrase clusters. NO sentences with periods. NO mention of specific toy types/brands (no "Funko Pop", no "claymation figures") — those slot in from the path's cast.

━━━ FORMAT ━━━
"{ACTIVITY/SETTING}, {2-4 figures cast description placeholder like 'four figures'}, {what they're doing — story beat with cause/reaction}, {real-world setting details}, {atmospheric/cinematic detail}"

━━━ EXAMPLES (for vibe — generate FAR more variety) ━━━
- "Grocery store aisle invasion, four figures riding a real shopping cart through real cereal-box canyon, one figure clinging to the front edge while another reaches for a real apple the size of their head, real linoleum-floor reflecting overhead fluorescent light"
- "Backyard sandbox campaign, three figures building a real-sand fortress, one figure stomping the ramparts in mock-attack while another protests with raised plastic arms, real beach toys towering as siege engines, real grass blades framing"
- "Kitchen counter heist, four figures rappelling down real cabinet face on dental-floss ropes, one figure on lookout at real toaster while another pries open a real cookie jar, real countertop tile reflecting dawn light"
- "Bookshelf city traffic jam, three figures stuck in a 'pile-up' on real spine-binding ledge, one figure honking a tiny horn made from real binder clip while another waves a real Post-it flag, real dust motes in real beam of window light"
- "Living room couch fortress, four figures building a real pillow-and-blanket fort, one figure hammering with real fork while another inflates a real balloon roof, real Cheerio cereal scattered like construction debris"
- "Garden escape mission, three figures wading through real grass jungle taller than them, one figure carrying real strawberry on shoulder while another scouts ahead with real magnifying glass, real morning dew beaded everywhere"
- "Bathroom sink white-water rafting, four figures clinging to a real sponge as it spins down a real running tap, real bubbles foaming around them, real toothbrush bridge above"
- "Beach picnic invasion by ants, three figures defending a real picnic basket from real ants the size of cars, one figure mid-swing with real toothpick spear, real sand grains as boulders, real seagull silhouette overhead"
- "Movie night reenactment, four figures lined up watching real laptop screen on real bed, one figure crying mid-scene while another offers a real popcorn kernel, real glow of screen lighting their faces"
- "Closet expedition, four figures climbing real shoelaces hanging from a real sneaker, one figure mid-jump from real tongue to real heel while another belays from above, real dust-bunny tumbleweeds rolling"

━━━ HARD RULES ━━━
- 2-4 figures per entry, NEVER solo. Figures interact (cause + reaction).
- Real-world setting — describe REAL objects (real apple, real pencil, real grass, real linoleum) NOT toy props.
- Story beat with verbs and reactions. Show what's happening AT THIS MOMENT.
- Wide-to-medium implied framing — the real-world environment is part of the scene.
- Imaginative + relatable — Toy Story / The Borrowers / Stuart Little vibes.
- NO toy-medium mentions (vinyl, claymation, plush, etc.). Use "figures" generically.
- VARIETY — kitchen, bathroom, garden, beach, park, library, attic, basement, garage, school, office, gym, restaurant, grocery store, gas station, post office, vet's office, bookstore, coffee shop, museum, zoo, hardware store, road trip, camping, farm, factory, etc.

━━━ DEDUP ━━━
No two scenarios share the same setting + activity combination. Spread widely.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
