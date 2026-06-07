#!/usr/bin/env node
/**
 * YumBot places SCENES — bucket H trial (2026-06-07).
 *
 * 6 unexpected-places sub-themes × 5 entries = 30 trial-pool entries.
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_places_scenes.json',
  total: 30,
  batch: 30,
  metaPrompt: (
    n
  ) => `You are writing ${n} KAWAII-FOOD UNEXPECTED-PLACES SCENES for YumBot. Each entry places a kawaii food subject in a REAL-WORLD venue that food doesn't usually live in (greenhouse / library / vintage train / amusement park / aquarium / rooftop garden).

━━━ DISTRIBUTION — MANDATORY (exactly 5 per sub-theme) ━━━

The 30 entries split EXACTLY:
- 5 "greenhouse" — kawaii food among potted plants / orchid blooms / ferns / hanging baskets in a Victorian or modern greenhouse / botanical conservatory (glass-paneled walls, tropical humidity, brass plant tags)
- 5 "library" — kawaii food on a vintage library cart / open book stack / antique reading desk / between tall shelves of old leather-bound books (brass lamp, magnifying glass, ribbon-bookmark)
- 5 "train" — kawaii food in a Wes-Anderson vintage dining-car / pastel passenger compartment / mahogany luggage rack / window seat looking out at countryside (linen tablecloth, brass railings, tartan upholstery)
- 5 "amusement-park" — kawaii food at a carnival booth / Ferris-wheel basket / carousel platform / cotton-candy cart / midway game stall (striped awnings, string-lights, popcorn, midway tickets)
- 5 "aquarium" — kawaii food perched on the edge of a giant aquarium tank with fish swimming behind / sitting beside a kelp-forest exhibit / in front of a coral wall / on an aquarium-cafe bench (blue underwater glow, fish silhouettes)
- 5 "rooftop-garden" — kawaii food on an urban rooftop garden with skyline behind / raised herb beds / mismatched cafe chairs / fairy-lights overhead / city view at golden hour

━━━ ENTRY SHAPE — STRUCTURED OBJECT (NON-NEGOTIABLE) ━━━

Each entry is a JSON object with exactly TWO fields:
{
  "tags": ["<one of: greenhouse | library | train | amusement-park | aquarium | rooftop-garden>"],
  "description": "<the scene, 25-40 words>"
}

━━━ THE BAR — every entry must produce ━━━

- One specific kawaii food subject WITH kawaii face features.
- The venue must read instantly — name a load-bearing setting element (glass-paneled wall / vintage-book stack / mahogany luggage rack / striped awning / aquarium tank-glass / urban skyline).
- A light composition hint (centered / off-center / overhead / 3-quarter).
- Self-contained.

━━━ EXAMPLES ━━━

{ "tags": ["greenhouse"], "description": "Kawaii pink macaron with smiling petal-eyes nestled among potted orchids on a brass-tagged greenhouse shelf, glass-paneled wall behind, three-quarter centered framing" }
{ "tags": ["library"], "description": "Kawaii blueberry muffin with sleepy-cozy eyes perched on an open antique book on a vintage library cart between tall leather-spine shelves, brass lamp glow, intimate eye-level view" }
{ "tags": ["train"], "description": "Kawaii croissant with smiling crescent-eyes on a small linen-covered cafe table in a Wes-Anderson vintage train dining-car, window framing countryside behind, three-quarter overhead view" }
{ "tags": ["amusement-park"], "description": "Kawaii cotton-candy cloud with bubble-eyes balanced on a carnival-booth counter under a candy-striped awning at sunset, string-lights overhead, low hero-up framing" }
{ "tags": ["aquarium"], "description": "Kawaii blueberry tart with dreamy-soft eyes seated on the rail of a giant aquarium tank, schools of fish silhouettes behind the glass, cool blue ambient glow, intimate eye-level framing" }
{ "tags": ["rooftop-garden"], "description": "Kawaii lemon tart with happy citrus-eyes resting on a mismatched cafe table on an urban rooftop garden at golden hour, city skyline behind, off-center three-quarter framing" }

━━━ HARD MANDATES ━━━

- EVERY entry has the kawaii subject WITH kawaii face features.
- Venue must read instantly.
- Composition hint included.
- Each "description" is 25-40 words.

━━━ HARD BANS ━━━

- NO photo-realistic register.
- NO mood/lighting/palette words inside the description.
- NO sub-theme blending.
- NO human faces in the scene.

━━━ OUTPUT ━━━

A JSON array of exactly ${n} structured objects, in the order [5 greenhouse, 5 library, 5 train, 5 amusement-park, 5 aquarium, 5 rooftop-garden]. No preamble. No numbering. Plain JSON array only.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
