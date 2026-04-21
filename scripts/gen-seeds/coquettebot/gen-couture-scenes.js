#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/couture_scenes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COUTURE SCENE descriptions for CoquetteBot's adorable-couture path — rich-detailed backdrops for fantasy-character couture scenes. Luxurious / dreamy / magical / pastel settings.

Each entry: 15-30 words. One specific rich backdrop.

━━━ CATEGORIES ━━━
- Fairy glens with lanterns (magical small-scale forest with golden lights)
- Rose gardens at golden hour (climbing roses, warm amber, moss-stone paths)
- Pastel ballrooms (crystal chandeliers, peach marble, rose-accents)
- Teacup-dance meadows (tiny dance-floor setup in wildflower meadow)
- Moonlit rose-pavilions (marble pavilion draped in roses, moonlight)
- Fairy-door courtyards (cobbled, rose-vines, storybook architecture)
- Garden-party gazebos (white lattice, draped gauze, pastel flowers)
- Princess-conservatory greenhouses (glass domes, tropical pastel flowers)
- Palace-rose corridor (mirrored hall, rose arrangements, candelabras)
- Castle-ballroom terraces (stone balustrade, rose-gold sunset)
- Cherry-blossom arbor tea-sets (under sakura canopy, pink lanterns)
- Crystal-ice fairy-caves (pastel-ice magical interior)
- Pearl-pond lagoons (lily-pad covered, swan-floating)
- Silk-tent pavilions (gauzy curtains, pastel cushions)
- Marble-balcony sunsets (rose-gold sky, ivy-climbing railing)
- Enchanted forest clearings (dappled light, wildflower carpet)
- Bakery-storefronts (Parisian, pastel with displays visible)
- Vintage carriages (pastel-painted, rose-garland)
- Ice-skating pond decorated with rose-garlands
- Crystal-lake islands at dawn
- Terrace gardens with rose-trellis
- Lavender hillside with golden lanterns strung
- Carousel grounds at twilight (pastel horse-carousel lit)
- Porch-swings in ivy-covered entrances
- Pink-sand beach with driftwood sculpture

━━━ RULES ━━━
- Luxurious / dreamy / precious
- Rich detail — couture wearer will be placed
- Pastel / pink / rose-gold palette
- No humans in setting (wearer placed separately)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
