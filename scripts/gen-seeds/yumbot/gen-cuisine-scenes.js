#!/usr/bin/env node
/**
 * YumBot cuisine SCENES — bucket C trial (2026-06-07).
 *
 * 7 cuisine sub-themes × 5 entries = 35 trial-pool entries.
 * Each entry is a tagged structured object:
 *   { tags: ['<sub-theme>'], description: '<scene>' }
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_cuisine_scenes.json',
  total: 35,
  batch: 35,
  metaPrompt: (
    n
  ) => `You are writing ${n} KAWAII-FOOD CUISINE SCENES for YumBot. Each entry sets up a specific kawaii-food vignette anchored in ONE of 7 GLOBAL CUISINES. Other axes (camera / lighting / palette / time-of-day / companion / decor / atmospheric accent) layer on top — your job is the SCENE (kawaii subject + cuisine setting + light composition hint).

━━━ DISTRIBUTION — MANDATORY (exactly 5 per sub-theme) ━━━

The 35 entries split EXACTLY:
- 5 "french-patisserie" — kawaii croissant / macaron / éclair / mille-feuille / pain-au-chocolat / tarte / madeleine at a Paris patisserie counter, marble + brass + Eiffel-tower hint
- 5 "italian-trattoria" — kawaii pasta bowl / pizza slice / cannoli / gelato cone / tiramisu / focaccia at a checker-tablecloth trattoria, Tuscan terracotta + wine bottle
- 5 "mexican-fiesta" — kawaii taco / churro / pan-dulce / agua-fresca / elote / tamale / paleta at a mercado / fiesta-table, papel-picado + clay-tile
- 5 "korean-dessert-cafe" — kawaii bingsoo / mochi / hotteok / dalgona-coffee / yakgwa / mango-toast at a Seoul dessert cafe, minimal wood + soft neon
- 5 "indian-sweet-shop" — kawaii gulab-jamun / jalebi / laddu / barfi / kulfi / kheer at a mithai shop, brass-tray + marigold + saffron tones
- 5 "middle-eastern-souk" — kawaii baklava / kunafa / Turkish-delight / maamoul / labneh / mint-tea at a souk stall, geometric-tile + brass-lantern
- 5 "nordic-bakery" — kawaii cardamom-bun / cinnamon-bun / smørrebrød / rye-bread / lingonberry-tart / kanelbulle at a Scandinavian bakery, blonde-wood + linen + birch + snowy window

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

Each entry is a JSON object with exactly TWO fields:
{
  "tags": ["<one of: french-patisserie | italian-trattoria | mexican-fiesta | korean-dessert-cafe | indian-sweet-shop | middle-eastern-souk | nordic-bakery>"],
  "description": "<the scene, 25-40 words>"
}

The DESCRIPTION is the SCENE — kawaii subject (with kawaii face) + cuisine setting markers + light composition hint. Camera / lighting / palette / time / companion / decor / atmospheric flourish are OTHER axes — DO NOT name them.

━━━ THE BAR — every entry must produce ━━━

- One specific kawaii food subject from the named cuisine WITH kawaii face features.
- Cuisine setting reads instantly — name a load-bearing cultural setting element (counter / tablecloth / stall / lantern / tile-pattern / bakery-window / etc.).
- A light composition hint (centered / off-center / overhead / 3-quarter / etc.).
- Self-contained — readable without relying on other axes.

━━━ EXAMPLES ━━━

{ "tags": ["french-patisserie"], "description": "Kawaii buttery croissant with smiling crescent-eyes resting on a marble patisserie counter, brass display rail behind, three-quarter centered framing with Eiffel-tower silhouette implied beyond" }
{ "tags": ["italian-trattoria"], "description": "Kawaii spaghetti bowl with twirling fork and smiling tomato-cheeks on a red-checker trattoria tablecloth, terracotta pot beside, overhead three-quarter view" }
{ "tags": ["mexican-fiesta"], "description": "Kawaii double taco with smiling crunchy face on a brightly-painted clay-tile mercado counter, papel-picado banner overhead, slight low-angle framing" }
{ "tags": ["korean-dessert-cafe"], "description": "Kawaii bingsoo mountain with sleepy-soft eyes piled high in a glass cafe bowl on a minimal blonde-wood counter, soft three-quarter view" }
{ "tags": ["indian-sweet-shop"], "description": "Kawaii orange gulab-jamun balls with smiling sugar-syrup eyes nestled on a brass mithai-tray edge, marigold petals scattered nearby, intimate centered framing" }
{ "tags": ["middle-eastern-souk"], "description": "Kawaii flaky baklava square with happy honey-eyes resting on a brass souk tray beside a tiny tulip-glass of mint tea, geometric tile underneath, three-quarter overhead" }
{ "tags": ["nordic-bakery"], "description": "Kawaii cardamom-bun with cozy-closed eyes sitting on a blonde-wood Scandinavian bakery counter, linen-cloth folded beside, snowy window hint behind, centered composition" }

━━━ HARD MANDATES ━━━

- EVERY entry has the kawaii subject WITH kawaii face features.
- Cuisine setting must read instantly — name a culturally-coded setting element.
- Composition hint included.
- Each "description" is 25-40 words.

━━━ HARD BANS ━━━

- NO photo-realistic-coded register ("photograph" / "DSLR" / "f/2.8").
- NO mood/lighting words inside the description.
- NO color-palette words inside the description.
- NO sub-theme blending.
- NO human faces in the scene — food only.

━━━ OUTPUT ━━━

A JSON array of exactly ${n} structured objects, in the order [5 french-patisserie, 5 italian-trattoria, 5 mexican-fiesta, 5 korean-dessert-cafe, 5 indian-sweet-shop, 5 middle-eastern-souk, 5 nordic-bakery]. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
