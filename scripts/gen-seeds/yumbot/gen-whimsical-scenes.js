#!/usr/bin/env node
/**
 * YumBot whimsical SCENES — bucket I trial (2026-06-07).
 *
 * 6 whimsical-concept sub-themes × 5 entries = 30 trial-pool entries.
 * Each entry is a tagged structured object:
 *   { tags: ['<sub-theme>'], description: '<scene>' }
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_whimsical_scenes.json',
  total: 30,
  batch: 30,
  metaPrompt: (
    n
  ) => `You are writing ${n} KAWAII-FOOD WHIMSICAL-CONCEPT SCENES for YumBot. Each entry sets up a specific kawaii-food vignette with a WHIMSICAL CONCEPT TWIST — food doing things food usually doesn't (modeling, schooling, spa-day, playing instruments, hanging with pets / toys). Other axes (camera / lighting / palette / time-of-day / companion / decor / atmospheric accent) layer on top — your job is the SCENE (kawaii subject + whimsical concept + light composition hint).

━━━ DISTRIBUTION — MANDATORY (exactly 5 per sub-theme) ━━━

The 30 entries split EXACTLY:
- 5 with tag "food-with-pets" — kawaii food alongside a real tiny kawaii pet (kitten next to kitten-shaped cookie / puppy beside dog-cake / hamster nibbling kawaii cracker / etc.)
- 5 with tag "food-fashion-show" — kawaii pastries on a runway, food modeling, food-as-couture (catwalk, photographers' flashes, designer-runway register)
- 5 with tag "food-spa" — kawaii foods at a spa / hot-tub / sauna / massage table, foam-frosting bubble bath, cucumber-slice eye masks, towels
- 5 with tag "food-orchestra" — kawaii foods playing tiny instruments in an orchestra / chamber ensemble (violin / cello / trumpet / piano / drums)
- 5 with tag "food-school" — kawaii foods as students in a classroom (desks, chalkboard, pencils, apples, lunchboxes), teacher-food at front
- 5 with tag "food-and-toys" — kawaii food alongside plushie / vinyl / wooden / paper toys (food-shaped toys, food picnicking with bears, food-with-blocks, food-with-action-figures)

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

Each entry is a JSON object with exactly TWO fields:
{
  "tags": ["<one of: food-with-pets | food-fashion-show | food-spa | food-orchestra | food-school | food-and-toys>"],
  "description": "<the scene, 25-40 words>"
}

The DESCRIPTION is the SCENE — kawaii subject (with kawaii face) + the whimsical-concept setup + light composition hint. Camera / lighting / palette / time / companion / decor / atmospheric flourish are OTHER axes — DO NOT name them. Just the subject + concept + composition.

━━━ THE BAR — every entry must produce ━━━

- One specific kawaii food subject WITH kawaii face features (smiling eyes / dot-blush / mouth implied).
- The whimsical concept reads instantly (cat next to cat-cookie / pastry on runway / waffle in hot-tub / cookie playing violin / apple at desk / cake picnicking with bear).
- A light composition hint (centered / off-center / overhead / 3-quarter / side-by-side / catwalk-side-on / etc.).
- Self-contained — readable as a scene without relying on other axes.

━━━ EXAMPLES ━━━

{ "tags": ["food-with-pets"], "description": "Kawaii cat-shaped sugar cookie with smiling eyes resting beside a real tiny kawaii kitten with matching ear-shape, both centered three-quarter view, gentle nuzzle-pose between them" }
{ "tags": ["food-fashion-show"], "description": "Kawaii pastel macaron strutting confidently down a pink fashion-show runway, side-on dynamic framing, flashbulbs blurred in background, chic kawaii expression peering ahead" }
{ "tags": ["food-spa"], "description": "Kawaii waffle relaxing deep in a steaming syrup hot-tub with cucumber-slice eye-mask, folded towel beside, overhead spa-day composition" }
{ "tags": ["food-orchestra"], "description": "Kawaii violin-cookie mid-bow alongside a cello-loaf and a trumpet-donut in a tiny chamber quartet on stage, centered ensemble composition" }
{ "tags": ["food-school"], "description": "Kawaii apple-student seated at a tiny wooden school desk with a miniature pencil and a small open notebook, three-quarter view, chalkboard hinted behind" }
{ "tags": ["food-and-toys"], "description": "Kawaii teddy-bear cookie sharing a picnic blanket with a real plushie teddy bear holding a tiny tea cup, side-by-side composition, both with matching smiles" }

━━━ HARD MANDATES ━━━

- EVERY entry has the kawaii food subject WITH kawaii face features.
- The whimsical concept is the load-bearing twist — must read instantly.
- Composition hint included.
- Each "description" is 25-40 words. No more.

━━━ HARD BANS ━━━

- NO photo-realistic-coded register ("photograph", "DSLR", "f/2.8").
- NO mood/lighting words inside the description (warm / cool / golden-hour / dusk).
- NO color-palette words inside the description.
- NO sub-theme blending (a "food-with-pets" entry shouldn't also be at a fashion show).
- NO humans in the scene — pets / toys / food only.

━━━ OUTPUT ━━━

A JSON array of exactly ${n} structured objects, in the order [5 food-with-pets, 5 food-fashion-show, 5 food-spa, 5 food-orchestra, 5 food-school, 5 food-and-toys]. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
