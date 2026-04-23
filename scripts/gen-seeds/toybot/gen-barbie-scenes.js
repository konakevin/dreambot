#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/barbie_scenes.json',
  total: 200,
  batch: 10,
  append: true,
  metaPrompt: (n) => `You are writing ${n} BARBIE-WORLD scene descriptions for ToyBot's barbie-scene path — cinematic Mattel-fashion-doll dioramas. Glossy 11-inch fashion-dolls on hand-built playsets with pink-dominant palette, DreamHouse architecture, fashion-boutique signage, convertible-pink-car scale, photographed like a Barbie-movie film still.

Each entry: 18-28 words. ONE specific Barbie-world cinematic scene with fashion-doll figurines mid-action in a fully-dressed playset.

━━━ THE CHARACTERS ━━━
Classic 11.5-inch Mattel fashion-dolls — articulated plastic bodies, molded hair (variety: blonde / brunette / redhead / black / pastel-dyed), oversized head with glossy-painted makeup (winged-liner, pink-lip), fashion-forward mini-wardrobe (evening gown / power-suit / beach-look / astronaut / veterinarian / chef / rockstar / ballerina), spike-heel plastic shoes molded to foot. Multiple dolls per scene is fine — Barbie-world is social.

━━━ SCENE CATEGORIES (rotate, don't cluster) ━━━
- DreamHouse pink-spiral-staircase descent — doll in evening gown mid-step, chandelier glow
- Rooftop-pool cabana — dolls in swimsuits lounging on striped cushions, pink flamingo-float
- Pink-convertible beach-drive — driver-doll and passenger mid-laugh, highway cliff behind
- Fashion-runway backstage — dolls clustered at vanity mirror with lights, garment-rack line
- Malibu-beach sunset — dolls with surfboards silhouetted against orange sky, palm-tree diorama
- DreamHouse kitchen — doll in apron pulling tray from pink-oven, cupcakes cooling on rack
- Boutique storefront — dolls window-shopping at pink-awning store, shopping-bag armload
- Country-club tennis-court — doll mid-serve with pink racket, scoreboard backdrop
- Pink-jet airplane cockpit — pilot-doll with headset, cloud-puffs out plastic window
- Veterinary-clinic scene — doctor-doll in lab-coat holding tiny kitten-figurine on exam-table
- Concert-stage — rockstar-doll mid-strum with pink guitar, stage-lights, fog-machine haze
- Fashion-week front-row — doll in oversized sunglasses and statement-coat, notepad in lap
- DreamHouse walk-in closet — doll choosing from rows of miniature garments on pink-hangers
- Yacht-deck champagne toast — dolls in cocktail-dresses clinking flutes, ocean-diorama
- Horse-riding stable — doll in jodhpurs grooming miniature pink-bridled horse-figurine
- Ice-skating rink — doll mid-spin in sequined leotard, audience-doll blur in stands
- Astronaut moon-landing scene — space-suited doll planting pink-flag on miniature crater-surface
- Pool-party underwater shot — doll mid-dive with bubbles, swim-goggles, pool-tile bottom
- Pink-salon — stylist-doll blow-drying client-doll's hair, product-shelves in background
- Chef-at-bistro — doll plating miniature dish under pass-through window, ticket-wheel
- Red-carpet premiere — doll mid-wave with flashbulb-glints, paparazzi-silhouettes
- Ballet-studio barre — doll in leotard mid-extension, floor-to-ceiling mirror behind
- Ski-chalet apres — dolls in parkas toasting mugs by stone fireplace, ski-rack on wall
- Tropical-jungle explorer — doll with camera and safari-hat peeking through plastic fronds
- DreamHouse pink-bathroom — doll at vanity with curlers, bubblegum-pink robe, perfume bottles

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- Reference FASHION-DOLL / plastic-doll / Mattel-scale / articulated-doll / playset LANGUAGE
- Signature pink-dominant palette + glossy-plastic sheen + fashion-forward wardrobe
- Cinematic verb — mid-stride / mid-laugh / mid-pose / mid-reach
- Practical playset-photography lighting (studio-soft-box / golden-hour / window-glow)
- Specific mini-prop + specific mini-outfit

━━━ BANNED ━━━
- NO "real woman" — these are DOLLS
- NO branded name-drops (Barbie / Ken / Skipper) — archetype only
- NO sexual / mature content
- NO dark / creepy / horror tone
- NO grim-realism — this is shiny aspirational toy-cinema

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
