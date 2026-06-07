#!/usr/bin/env node
/**
 * YumBot meal-types SCENES — bucket-aggregated path (2026-06-06).
 *
 * 6 sub-themes × 5 entries = 30 trial-pool entries. Each entry is a
 * tagged structured object so the runtime can filter / log per sub-theme:
 *   { tags: ['<sub-theme>'], description: '<scene>' }
 *
 * The seedGenHelper preserves objects with non-empty tags + description.
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_meal_types_scenes.json',
  total: 30,
  batch: 30,
  metaPrompt: (
    n
  ) => `You are writing ${n} KAWAII-FOOD MEAL-TYPE SCENES for YumBot. Each entry sets up a specific kawaii food vignette in one of 6 MEAL-OCCASION contexts. Other axes (camera / lighting / palette / time-of-day / companions / decor / atmospheric accent) layer on top — your job is the SCENE (kawaii subject + meal-context setting + light composition hint).

━━━ DISTRIBUTION — MANDATORY (exactly 5 per sub-theme) ━━━

The 30 entries split EXACTLY:
- 5 with tag "breakfast" — kawaii pancake stacks / toast / eggs / cereal / muffins / breakfast pastries at a morning home table
- 5 with tag "high-tea" — kawaii scones / macarons / mini-cakes / tea-sandwiches / tarts on tiered china stands, vintage tea-room register
- 5 with tag "picnic" — kawaii sandwiches / hand-pies / fruit / lemonade / cookies on a checker blanket outdoors
- 5 with tag "coffee-shop" — kawaii lattes / croissants / cookies / muffins at a cafe counter
- 5 with tag "food-truck" — kawaii tacos / hot dogs / burgers / fries / ice-cream at a neon-lit night food truck
- 5 with tag "midnight-snack" — kawaii milk-and-cookies / leftover pizza / cereal / ice cream in a dim warm kitchen at night

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

Each entry is a JSON object with exactly TWO fields:
{
  "tags": ["<one of: breakfast | high-tea | picnic | coffee-shop | food-truck | midnight-snack>"],
  "description": "<the scene, 25-40 words>"
}

The DESCRIPTION is the SCENE — kawaii subject (with kawaii face) + meal-occasion setting + light composition hint. Camera angle, lighting quality, color palette, time-of-day, companions, decor, atmospheric accents are all OTHER pools — DO NOT name them. Just the subject + setting + composition.

━━━ THE BAR — every entry must produce ━━━

- One specific kawaii food subject with kawaii face features (smiling eyes / dot-blush / mouth implied — vary the exact features).
- Anchored in the named meal-occasion setting so the sub-theme reads instantly (windowsill table for breakfast, tiered stand for high-tea, checker blanket for picnic, cafe counter for coffee-shop, neon truck for food-truck, dim kitchen for midnight-snack).
- A light composition hint (centered / off-center / overhead / 3-quarter / etc.) so Flux has a placement signal.
- Self-contained — readable as a scene without relying on other axes.

━━━ EXAMPLES ━━━

{ "tags": ["breakfast"], "description": "Kawaii pancake stack with smiling syrup-eyes wobbling slightly on a sun-warmed windowsill table, golden butter slab winking on top, soft 3-quarter framing centered on the stack" }
{ "tags": ["high-tea"], "description": "Three kawaii rose-macarons clustered on the top tier of a vintage pastel-pink three-tier china stand, gentle 3-quarter view with the stand filling most of the frame" }
{ "tags": ["picnic"], "description": "Kawaii triangle-sandwich with dot-blush cheeks resting on a red-and-white checker blanket beside a stripe-mug of lemonade, overhead 3-quarter composition with grass edge" }
{ "tags": ["coffee-shop"], "description": "Kawaii latte mug with hearted foam-eyes sitting on a marble cafe counter, butter croissant beside it, slight overhead lean, espresso-machine silhouette implied in background" }
{ "tags": ["food-truck"], "description": "Kawaii double-decker taco with smiling eyes peeking over the serving window of a neon-lit night food truck, low 3-quarter framing emphasizing the truck-window pickup moment" }
{ "tags": ["midnight-snack"], "description": "Kawaii milk glass with sleepy half-closed eyes beside three chocolate-chip cookies on a dim kitchen counter, low warm spotlight composition centered on the pair" }

━━━ HARD MANDATES ━━━

- EVERY entry has the kawaii subject WITH kawaii face features (smiling / dot eyes / blush / etc).
- The setting must instantly read as the named meal-occasion — name a load-bearing setting element (windowsill / china tier / checker blanket / cafe counter / neon truck / dim kitchen).
- Composition hint included (overhead / 3-quarter / centered / low-angle / off-center).
- Each "description" is 25-40 words. No more.

━━━ HARD BANS ━━━

- NO camera-brand language, NO lens specs, NO photographer name-drops.
- NO photoreal-coded register ("photograph", "DSLR", "f/2.8"). YumBot stays kawaii illustration.
- NO mood/lighting words inside the description (warm / cool / golden-hour / dusk / overcast / pastel-light) — that's the lighting + time-of-day axes' job. The DESCRIPTION carries subject + setting + composition only.
- NO color-palette words inside the description (pink-and-cream / pastel-green / etc.) — that's the palette axis.
- NO multi-sub-theme blending (a "breakfast" entry shouldn't include high-tea trays).

━━━ OUTPUT ━━━

A JSON array of exactly ${n} structured objects, in the order [5 breakfast, 5 high-tea, 5 picnic, 5 coffee-shop, 5 food-truck, 5 midnight-snack]. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
