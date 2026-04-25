#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/nesting_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} DINOSAUR FAMILY LIFE scene descriptions for DinoBot — the full spectrum of parenting, growing up, and family behavior. NOT just "dino sits on eggs." Dynamic, varied, action-filled.

Each entry: 15-25 words. One specific family-life scenario with species + dynamic action + setting.

━━━ CATEGORIES (distribute evenly) ━━━
- Hatchlings adventuring: first time leaving the nest, exploring a stream, chasing insects, stumbling through ferns
- Juveniles learning: parent teaching offspring to forage, dig for roots, catch fish, find water
- Sibling dynamics: play-fighting, racing, wrestling, competing for food, grooming each other
- Parent defense: mother charging a predator, father standing between threat and young, alarm calls
- Family migration: parent leading juveniles to new feeding grounds, crossing a river together, family group on the move
- Feeding time: parent bringing food back, regurgitating, breaking open fruit/carcass for young
- Growing up: adolescent almost as big as parent, juvenile testing independence, first solo hunt attempt
- Communal nurseries: multiple families nesting together, juveniles from different clutches mixing
- Nighttime family: family sleeping together, parent keeping watch, hatchlings tucked under wings/body
- Bath/water play: juveniles splashing in shallows, parent watching from bank, hatchlings swimming for first time
- Nest building: gathering materials, digging, arranging vegetation, choosing a site
- Egg moments (only ~10%): turning eggs, hatching, guarding clutch

━━━ RULES ━━━
- Maximum 10% should be static "sitting on eggs" scenes
- 70%+ should involve MOVEMENT and ACTIVITY
- These are animals with complex social behavior
- Include environmental interaction (mud, water, vegetation, other species)
- Mix species widely — theropods, hadrosaurs, sauropods, ceratopsians all parent

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
