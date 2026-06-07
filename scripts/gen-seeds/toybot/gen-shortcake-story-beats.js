#!/usr/bin/env node
/**
 * SHORTCAKE story-beat pool — bespoke per-path (2026-06-06).
 * Verb-led, multi-figure, shared-object/event structure.
 * MVP-25 per [[feedback_always_seed_25_to_test_then_scale]].
 */
const { generatePool } = require('../../lib/seedGenHelper');
const TOTAL = parseInt(process.env.TOTAL, 10) || 25;
const APPEND = process.env.APPEND === 'true';

generatePool({
  outPath: 'scripts/bots/toybot/seeds/shortcake_story_beats.json',
  total: TOTAL, batch: Math.min(TOTAL, 25), append: APPEND,
  metaPrompt: (n) => `You are writing ${n} STRAWBERRY-SHORTCAKE-ERA STORY-MOMENT scenarios for ToyBot's shortcake-scene path. The characters are 1980s soft-plastic scented-doll figurines (Strawberry-Shortcake / Rainbow-Brite / Rose-Petal-Place DNA) — 3-5 inches, oversized heads, huge round eyes, rosy painted blush, thick rooted pastel-yarn hair, gingham/calico cloth dresses. Pastel dessert-or-flower-themed miniature playsets with oversized-scale props (giant strawberry / cupcake-castle / lollipop-grove / pie-cottage / candy-cane forest). Faded-catalog wholesome register.

━━━ STRUCTURAL MANDATE (every entry, NON-NEGOTIABLE) ━━━
1. OPEN with an active verb (Baking / Hauling / Decorating / Tipping / Rescuing / Sliding / Climbing / Frosting / Stirring / Wrapping / Sneaking / Carrying / Toppling / Mixing / Skipping / Discovering).
2. Name ONE shared dessert-fantasy object/event 3-5 dolls react to (a tipping cake-cottage / a runaway candy-cart / a frosting-flood / a missing-pet bunny / an arriving sister doll / a discovered berry-grove).
3. HARD BAN: "mid-X", "frozen mid-X", "watching", "looking at", "gazing", "stands", "posed", any non-verb opener.
4. Present-tense-active throughout. 3-5 named doll cast roles each doing a DIFFERENT verb.

━━━ FORMAT ━━━
60-90 words, semicolon-separated. Cast roles: berry-baker / candy-shop-keeper / cupcake-helper / lemon-friend / blueberry-cousin / mint-twin / pastel pet (bunny / kitten / hedgehog) / cake-decorator. Playset context.

━━━ FAMILY SPLIT (~70/30 wholesome/whimsy-mischief) ━━━
A) WHOLESOME BAKING/PARTY (~70%) — collaborative dessert-event drama (cake collapse / birthday surprise / berry harvest / picnic rescue / kitchen mishap).
B) WHIMSY-MISCHIEF (~30%) — cute caper register (pet escape / hidden sweets-thief / surprise-party-prep secret / lost-recipe quest).

━━━ PASS EXAMPLES ━━━
- "Baking frantically as the towering frosting cake-cottage begins to slump sideways minutes before the party — the berry-baker doll shoves a wooden spoon under the leaning wall as a brace, two helper-dolls haul a fresh icing-bowl across the marble counter to patch the slump, the lemon-friend whisks furiously at a stabilizer-batter, the mint-twin frosts the back wall to hide the crack, a pastel kitten tracks frosting-paw-prints across the unfinished birthday banner"
- "Chasing the runaway candy-cart down the lollipop-grove path as it gathers speed and threatens to crash into the gingerbread bridge — the berry-baker doll sprints with arms outstretched, two helper-dolls dive for the trailing ribbons, the blueberry-cousin signals from the bridge waving both arms, a pastel hedgehog leaps from the path-side as the cart's wheels throw sparkles, a trail of fallen candies marks the runaway path"

━━━ FAIL EXAMPLES ━━━
- "Strawberry doll mid-bake in pastel kitchen…" ← pose + noun opener

━━━ HARD BANS ━━━
- NO real humans, NO CGI, NO modern doll (no Bratz, no Barbie movie register)
- NO IP names (NEVER Strawberry Shortcake / Rainbow Brite / etc. directly — use generic archetypes)
- NO solo figures — 3+ cast minimum

JSON array of ${n} strings. Verb-led only.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
