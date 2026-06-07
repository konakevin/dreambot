#!/usr/bin/env node
const { generateBucketScenes, buildYumBotSubThemePrompt } = require('../../lib/yumbotBucketGen');

const SUB_THEMES = [
  { tag: 'food-with-pets', blurb: 'Kawaii food alongside a real tiny kawaii pet (kitten next to cat-shaped cookie / puppy beside dog-cake / hamster nibbling kawaii cracker / bunny + carrot-shaped pastry / parakeet on a cupcake / mouse with cheese-shaped treat). Pet should match or complement the food shape.', example: '{ "tags": ["food-with-pets"], "description": "Kawaii cat-shaped sugar cookie with smiling eyes resting beside a real tiny kawaii kitten with matching ear-shape, both centered three-quarter view, gentle nuzzle-pose between them" }' },
  { tag: 'food-fashion-show', blurb: 'Kawaii pastries / cakes / drinks on a runway, food modeling, food-as-couture (catwalk, photographers flashes, designer-runway register). Anchor: runway / catwalk / flashbulbs / chic pose.', example: '{ "tags": ["food-fashion-show"], "description": "Kawaii pastel macaron strutting confidently down a pink fashion-show runway, side-on dynamic framing, flashbulbs blurred in background, chic kawaii expression peering ahead" }' },
  { tag: 'food-spa', blurb: 'Kawaii foods at a spa / hot-tub / sauna / massage table / facial bath / mud-bath / steam-room. Foam-frosting bubble bath, cucumber-slice eye masks, towels, candles. Anchor: spa accessory, towel, candle.', example: '{ "tags": ["food-spa"], "description": "Kawaii waffle relaxing deep in a steaming syrup hot-tub with cucumber-slice eye-mask, folded towel beside, overhead spa-day composition" }' },
  { tag: 'food-orchestra', blurb: 'Kawaii foods playing tiny instruments in an orchestra / chamber ensemble / jazz band / string quartet (violin / cello / trumpet / piano / drums / sax / flute). Anchor: stage, music stand, conductor baton.', example: '{ "tags": ["food-orchestra"], "description": "Kawaii violin-cookie mid-bow alongside a cello-loaf and a trumpet-donut in a tiny chamber quartet on stage, centered ensemble composition" }' },
  { tag: 'food-school', blurb: 'Kawaii foods as students in a classroom (desks, chalkboard, pencils, apples, lunchboxes), teacher-food at front, hand-raised, art-class, science-class, gym-class. Anchor: tiny school desk, chalkboard, pencil, notebook.', example: '{ "tags": ["food-school"], "description": "Kawaii apple-student seated at a tiny wooden school desk with a miniature pencil and a small open notebook, three-quarter view, chalkboard hinted behind" }' },
  { tag: 'food-and-toys', blurb: 'Kawaii food alongside plushie / vinyl / wooden / paper toys (food-shaped toys, food picnicking with bears, food-with-blocks, food-with-action-figures / food-with-dollhouse / food-with-jack-in-the-box). Anchor: plushie, wooden block, paper toy.', example: '{ "tags": ["food-and-toys"], "description": "Kawaii teddy-bear cookie sharing a picnic blanket with a real plushie teddy bear holding a tiny tea cup, side-by-side composition, both with matching smiles" }' },
];

generateBucketScenes({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_whimsical_scenes.json',
  perSubTheme: 34,
  subThemes: SUB_THEMES,
  buildPrompt: buildYumBotSubThemePrompt({ bucketTitle: 'WHIMSICAL-CONCEPT', bannedNotes: '' }),
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
