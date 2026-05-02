#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/plush_scenes.json',
  total: 200,
  batch: 25,
  metaPrompt: (n) => `Write ${n} PLUSH-WORLD scenes for ToyBot's plush-world path. ENSEMBLE-FORWARD storybook warmth. Multiple stuffed-animal characters together. Non-LBP-burlap. Each entry 20-32 words.

━━━ HARD RULES ━━━
- 70%+ entries: MULTIPLE plush characters (3+) in shared activity.
- Solo entries MAX 30% — must have rich-world context (lookout-while-others-explore, prep-for-incoming-friends, mid-discovery).
- Mix indoor cozy + outdoor adventure.
- Always at least one mid-action verb per scene.

━━━ CHARACTERS (mix archetypes per scene) ━━━
Teddy-bear, plush-bunny, stuffed-fox, knitted-cat, stitched-dragon, fabric-owl, felt-duck, plush-elephant, stuffed-deer, plush-mouse, knitted-hedgehog, plush-otter, plush-koala, knitted-llama, stuffed-penguin, plush-pig, plush-pony. Visible plush-fur / knit-texture / fiberfill / button-eyes / embroidered-mouth. Optional knit sweaters / felt scarves / mini hats.

━━━ EXAMPLE ARCHETYPES (rotate, vary) ━━━
- Forest-campfire circle — 5 stuffed-animals around fabric-flame firepit, marshmallows on twig-skewers, songs sung
- Plush-pirate crew — 4 stuffies on cardboard ship, captain at felt-helm, lookout in crow's-nest
- Picnic-meadow — 6 plush-friends on quilt sharing miniature tea-set, basket open, daisy-meadow
- Bedtime story-circle — 5 plush-cubs around grandparent reading scale-book, fairy-lights overhead
- Bakery-team — 4 stuffies in mini-aprons mid-rolling-pin / mid-frosting / mid-stir, flour-puff
- Plush-band concert — 4 musicians on rooftop stage under fairy-lights, audience-stuffies on lower roofs
- Plush-football game — 6 plush-team mid-tackle on miniature field, ball mid-air, ref-bear with whistle
- Plush-search-party — 5 cubs mid-march through forest with miniature lanterns, lost-toy map in lead's paw
- Snow-fort battle — 6 plush-cubs in two snow-fort teams mid-snowball-throw, fluff-cloud frozen
- Plush-classroom — 5 plush-pupils at miniature desks, teacher-stuffy at chalkboard, raised paws
- Snowy-village caroling — 5 plush-friends in scarves mid-sing on cobblestone-fabric square
- Plush-sleepover pillow-fight — 5 stuffies mid-pillow-swing in fort, fluff mid-air, fairy-light glow

━━━ MUST-HAVE per entry ━━━
- Plush / stuffed / knit / fabric / felt / fiber / button-eyes / embroidered language
- Multi-character ensemble OR strong solo-with-context
- Mid-action verb (mid-toast / mid-stitch / mid-march / mid-tackle / mid-pour)
- Handcrafted miniature setting anchor
- Storybook warmth — lantern / fairy-light / golden-hour / firelight

━━━ BANNED ━━━
- LBP burlap-and-zipper (Sackboy)
- Real animals
- Solo-introspective with no context (the failure mode — fix it)
- Passive-only / sitting-staring / CGI / illustration.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
