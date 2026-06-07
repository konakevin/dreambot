#!/usr/bin/env node
const { generateBucketScenes, buildYumBotSubThemePrompt } = require('../../lib/yumbotBucketGen');

const SUB_THEMES = [
  { tag: 'french-patisserie', blurb: 'Kawaii croissant / macaron / éclair / mille-feuille / pain-au-chocolat / tarte / madeleine / opéra / canelé / paris-brest at a Paris patisserie counter. Anchor: marble + brass + Eiffel-tower hint, gold-lettered window.', example: '{ "tags": ["french-patisserie"], "description": "Kawaii buttery croissant with smiling crescent-eyes resting on a marble patisserie counter, brass display rail behind, three-quarter centered framing with Eiffel-tower silhouette implied beyond" }' },
  { tag: 'italian-trattoria', blurb: 'Kawaii pasta bowl / pizza slice / cannoli / gelato cone / tiramisu / focaccia / risotto / bruschetta / panzanella at a checker-tablecloth trattoria. Anchor: red-checker tablecloth, Tuscan terracotta, wine bottle, basil sprig.', example: '{ "tags": ["italian-trattoria"], "description": "Kawaii spaghetti bowl with twirling fork and smiling tomato-cheeks on a red-checker trattoria tablecloth, terracotta pot beside, overhead three-quarter view" }' },
  { tag: 'mexican-fiesta', blurb: 'Kawaii taco / churro / pan-dulce / agua-fresca / elote / tamale / paleta / quesadilla / horchata / mole at a mercado / fiesta-table. Anchor: papel-picado + clay-tile, vibrant ceramic, lime wedges.', example: '{ "tags": ["mexican-fiesta"], "description": "Kawaii double taco with smiling crunchy face on a brightly-painted clay-tile mercado counter, papel-picado banner overhead, slight low-angle framing" }' },
  { tag: 'korean-dessert-cafe', blurb: 'Kawaii bingsoo / mochi / hotteok / dalgona-coffee / yakgwa / mango-toast / patbingsu / honey-bread / cream-bun at a Seoul dessert cafe. Anchor: minimal blonde wood, soft neon, glass dessert dome.', example: '{ "tags": ["korean-dessert-cafe"], "description": "Kawaii bingsoo mountain with sleepy-soft eyes piled high in a glass cafe bowl on a minimal blonde-wood counter, soft three-quarter view" }' },
  { tag: 'indian-sweet-shop', blurb: 'Kawaii gulab-jamun / jalebi / laddu / barfi / kulfi / kheer / rasgulla / peda / halwa / mithai-box at a mithai shop. Anchor: brass-tray + marigold + saffron tones, silver-leaf, sugar-syrup pool.', example: '{ "tags": ["indian-sweet-shop"], "description": "Kawaii orange gulab-jamun balls with smiling sugar-syrup eyes nestled on a brass mithai-tray edge, marigold petals scattered nearby, intimate centered framing" }' },
  { tag: 'middle-eastern-souk', blurb: 'Kawaii baklava / kunafa / Turkish-delight / maamoul / labneh / mint-tea / halva / qatayef / saffron-rice at a souk stall. Anchor: geometric-tile + brass-lantern, brass tray, pistachio pile.', example: '{ "tags": ["middle-eastern-souk"], "description": "Kawaii flaky baklava square with happy honey-eyes resting on a brass souk tray beside a tiny tulip-glass of mint tea, geometric tile underneath, three-quarter overhead" }' },
  { tag: 'nordic-bakery', blurb: 'Kawaii cardamom-bun / cinnamon-bun / smørrebrød / rye-bread / lingonberry-tart / kanelbulle / pulla / koldskål / krumkake at a Scandinavian bakery. Anchor: blonde-wood, linen, birch, snowy window.', example: '{ "tags": ["nordic-bakery"], "description": "Kawaii cardamom-bun with cozy-closed eyes sitting on a blonde-wood Scandinavian bakery counter, linen-cloth folded beside, snowy window hint behind, centered composition" }' },
];

generateBucketScenes({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_cuisine_scenes.json',
  perSubTheme: 29, // 7 × 29 = 203, close to 200 target
  subThemes: SUB_THEMES,
  buildPrompt: buildYumBotSubThemePrompt({ bucketTitle: 'CUISINE', bannedNotes: '' }),
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
