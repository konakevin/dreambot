#!/usr/bin/env node
/**
 * YumBot scale SCENES — bucket D trial (2026-06-07).
 *
 * 6 scale-twist sub-themes × 5 entries = 30 trial-pool entries.
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_scale_scenes.json',
  total: 300,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} KAWAII-FOOD SCALE-TWIST SCENES for YumBot. Each entry sets up a specific kawaii-food vignette with a SCALE / SETTING TWIST — food at a scale or in a setting where it doesn't usually live (colossal in a city, microscopic in a tiny world, an entire island made of cake, a chocolate-river world, an undersea pastry kingdom, food in deep space).

━━━ DISTRIBUTION — MANDATORY (exact even split across the 6 sub-themes) ━━━

Split the ${n} entries EXACTLY evenly across the 6 sub-themes — produce EXACTLY ${Math.floor(n / 6)} entries for each of the 6 sub-themes below (${n % 6 > 0 ? `with ${n % 6} extra distributed across the first sub-themes` : ''}). Count carefully as you write so the distribution is exact. Within each sub-theme, vary heavily — DO NOT repeat the same kawaii subject + setting combo. Use the variant hints below to spread the 50 entries widely across the sub-theme's semantic range:
- ~${Math.floor(n / 6)} "giant-real-world" — colossal kawaii food TOWERING over real-world cities / landmarks (skyscraper-donut over Manhattan / Statue-of-Liberty-sized macaron / Eiffel-Tower-sized éclair / Tokyo-scrambled-crossing kaiju cupcake / Mt-Fuji-sized rice ball / Pyramid-cake at Giza / Big-Ben-tall croissant / etc.). Vary the city and landmark widely across all the world's iconic skylines.
- ~${Math.floor(n / 6)} "microscopic" — a single sprinkle / crumb / sugar-grain IS the world, ant-scale perspective with kawaii food the size of mountains relative to a tiny figure (sprinkle-rocks / sugar-grain landscape / breadcrumb cliffs / pollen-dust valleys / single-droplet ocean / pepper-grain mesas)
- ~${Math.floor(n / 6)} "food-island" — an entire island MADE OF FOOD (cake mountains, frosting beaches, candy reefs, kawaii food-civilians as the island's inhabitants — vary tropical / arctic / volcanic / desert / archipelago variants)
- ~${Math.floor(n / 6)} "chocolate-river" — Willy-Wonka-style chocolate stream with marshmallow boats / sugar-cane forest / lollipop trees / candy-cane bridges (vary river-rapids / glassy / lazy-bend / waterfall / delta variants; vary the kawaii crew traveling along it)
- ~${Math.floor(n / 6)} "underwater" — kawaii pastries / cakes / desserts as undersea creatures, coral reefs of frosting, kelp of cotton-candy, mermaid-food, jellyfish-jellies (vary shallow / deep / coral / kelp-forest / abyss / tide-pool variants)
- ~${Math.floor(n / 6)} "food-in-space" — kawaii food in deep space — planet-cakes orbiting a sun-cookie / asteroid-cookies / cosmic-donut / nebula-cotton-candy / rocket-ice-cream-cone (vary nebula / asteroid-belt / lunar / saturn-rings / black-hole / galaxy-spiral variants)

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

Each entry is a JSON object with exactly TWO fields:
{
  "tags": ["<one of: giant-real-world | microscopic | food-island | chocolate-river | underwater | food-in-space>"],
  "description": "<the scene, 25-40 words>"
}

━━━ THE BAR — every entry must produce ━━━

- One specific kawaii food subject WITH kawaii face features.
- The SCALE TWIST reads instantly — what's the unusual scale or setting (colossal / microscopic / cake-island / chocolate-river / undersea / deep-space).
- A light composition hint (wide-epic / overhead / low-hero / etc.).
- Self-contained.

━━━ EXAMPLES ━━━

{ "tags": ["giant-real-world"], "description": "Colossal kawaii sprinkle donut the size of a skyscraper looming over Manhattan's Times Square at dusk, smiling glaze-eyes blinking down at tiny pedestrians, wide low-angle hero framing" }
{ "tags": ["microscopic"], "description": "Single kawaii rainbow sprinkle the size of a mountain seen from ant-perspective on a vast tabletop landscape of crystalline sugar-grain dunes, low hero-up framing emphasizing scale" }
{ "tags": ["food-island"], "description": "Entire kawaii cake-island rising from frosting waves with sponge cliffs and gumdrop trees, a tiny kawaii cookie-civilian waving from the beach, sweeping epic wide composition" }
{ "tags": ["chocolate-river"], "description": "Kawaii marshmallow-boat with smiling pink face floating down a glossy chocolate river through a candy-cane forest, lollipop trees lining the banks, wide tracking composition" }
{ "tags": ["underwater"], "description": "Kawaii cupcake-jellyfish with smiling frosting-eyes drifting through a coral reef of frosting-arms and gumdrop-sea-urchins under shafts of soft underwater light, side-on framing" }
{ "tags": ["food-in-space"], "description": "Kawaii planet-cookie with crater-blush orbiting a sun-cake in a candy-rainbow nebula, comet-cupcakes streaking past, wide epic cosmic composition" }

━━━ HARD MANDATES ━━━

- EVERY entry has the kawaii subject WITH kawaii face features.
- The scale twist must read instantly.
- Composition hint included.
- Each "description" is 25-40 words.

━━━ HARD BANS ━━━

- NO photo-realistic register ("photograph" / "DSLR" / "f/2.8").
- NO mood/lighting/palette words inside the description.
- NO sub-theme blending.
- NO human-character cast (food is the cast — except in microscopic where the tiny "figure" can be the food-citizen at ant-scale, NEVER a literal human).

━━━ OUTPUT ━━━

A JSON array of exactly ${n} structured objects, in the order [5 giant-real-world, 5 microscopic, 5 food-island, 5 chocolate-river, 5 underwater, 5 food-in-space]. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
