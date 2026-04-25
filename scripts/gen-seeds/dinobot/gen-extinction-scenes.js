#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/extinction_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} EXTINCTION EVENT scene descriptions for DinoBot — the asteroid impact and its aftermath. The final chapter of the Mesozoic.

Each entry: 15-25 words. One specific extinction scenario with species + apocalyptic element + emotional tone.

━━━ CATEGORIES ━━━
- The asteroid streak across the sky, dinosaurs looking up from grazing
- Impact flash on the horizon, a wall of light approaching
- Firestorm sweeping across a continent, silhouetted herds fleeing
- Impact winter — grey skies, frost on tropical ferns, shivering dinosaurs
- Tsunamis hitting coastal areas, marine reptiles tossed in churning water
- Ash-darkened sky with the last rays of sunlight breaking through
- A mother dinosaur sheltering eggs as ash falls like snow
- The final sunset before impact, peaceful world about to end
- Crater aftermath — devastated landscape with a single survivor walking
- Nuclear-winter forests with dead trees and a lone dinosaur searching for food
- The last herd standing on a hill, looking at the fireball approaching
- Quiet aftermath — empty landscape with only footprints remaining

━━━ RULES ━━━
- Epic tragedy, not horror — beautiful devastation
- The dinosaur is dignified, not panicked (or if fleeing, with natural grace)
- The sky tells the apocalyptic story
- Mix before/during/after impact moments

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
