#!/usr/bin/env node
const { generateBucketScenes, buildYumBotSubThemePrompt } = require('../../lib/yumbotBucketGen');

const SUB_THEMES = [
  { tag: 'greenhouse', blurb: 'Kawaii food among potted plants / orchid blooms / ferns / hanging baskets in a Victorian or modern greenhouse / botanical conservatory. Anchor: glass-paneled walls, tropical humidity, brass plant tags.', example: '{ "tags": ["greenhouse"], "description": "Kawaii pink macaron with smiling petal-eyes nestled among potted orchids on a brass-tagged greenhouse shelf, glass-paneled wall behind, three-quarter centered framing" }' },
  { tag: 'library', blurb: 'Kawaii food on a vintage library cart / open book stack / antique reading desk / between tall shelves of old leather-bound books. Anchor: brass lamp, magnifying glass, ribbon-bookmark, leather-spine.', example: '{ "tags": ["library"], "description": "Kawaii blueberry muffin with sleepy-cozy eyes perched on an open antique book on a vintage library cart between tall leather-spine shelves, brass lamp glow, intimate eye-level view" }' },
  { tag: 'train', blurb: 'Kawaii food in a Wes-Anderson vintage dining-car / pastel passenger compartment / mahogany luggage rack / window seat looking out at countryside. Anchor: linen tablecloth, brass railings, tartan upholstery, window-curtain.', example: '{ "tags": ["train"], "description": "Kawaii croissant with smiling crescent-eyes on a small linen-covered cafe table in a Wes-Anderson vintage train dining-car, window framing countryside behind, three-quarter overhead view" }' },
  { tag: 'amusement-park', blurb: 'Kawaii food at a carnival booth / Ferris-wheel basket / carousel platform / cotton-candy cart / midway game stall. Anchor: striped awnings, string-lights, popcorn, midway tickets, carousel-horse silhouette.', example: '{ "tags": ["amusement-park"], "description": "Kawaii cotton-candy cloud with bubble-eyes balanced on a carnival-booth counter under a candy-striped awning at sunset, string-lights overhead, low hero-up framing" }' },
  { tag: 'aquarium', blurb: 'Kawaii food perched on the edge of a giant aquarium tank with fish swimming behind / sitting beside a kelp-forest exhibit / in front of a coral wall / on an aquarium-cafe bench. Anchor: blue underwater glow, fish silhouettes, tank-glass rim.', example: '{ "tags": ["aquarium"], "description": "Kawaii blueberry tart with dreamy-soft eyes seated on the rail of a giant aquarium tank, schools of fish silhouettes behind the glass, cool blue ambient glow, intimate eye-level framing" }' },
  { tag: 'rooftop-garden', blurb: 'Kawaii food on an urban rooftop garden with skyline behind / raised herb beds / mismatched cafe chairs / fairy-lights overhead / city view at golden hour. Anchor: skyline silhouette, raised planter, fairy-lights, urban herb-pot.', example: '{ "tags": ["rooftop-garden"], "description": "Kawaii lemon tart with happy citrus-eyes resting on a mismatched cafe table on an urban rooftop garden at golden hour, city skyline behind, off-center three-quarter framing" }' },
];

generateBucketScenes({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_places_scenes.json',
  perSubTheme: 34,
  subThemes: SUB_THEMES,
  buildPrompt: buildYumBotSubThemePrompt({ bucketTitle: 'UNEXPECTED-PLACES', bannedNotes: '' }),
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
