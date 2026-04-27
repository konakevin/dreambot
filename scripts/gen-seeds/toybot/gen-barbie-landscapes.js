#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/barbie_landscapes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} BARBIE-WORLD LANDSCAPE scene descriptions for ToyBot's barbie-scene path. Cinematic Mattel-scale fashion-doll dioramas — DreamHouse architecture, pink-dominant palette, boutique/rooftop-pool/runway/convertible-pink-car playsets, glossy-plastic sheen, Barbie-movie film-still framing.

Each entry: 15-25 words. ONE specific Barbie-world landscape scene.

━━━ THE MIX ━━━
- ~30% Type A — pure Barbie-world playset environment, NO dolls. Pink DreamHouse / boutique / beach / runway environment IS the subject.
- ~70% Type B — ONE off-center 11.5-inch Mattel-scale fashion-doll (articulated plastic body, molded hair, glossy painted-makeup, fashion-forward mini-wardrobe, spike-heel plastic shoes) in a specific body-shaping pose within a Barbie-world playset. Lead with BODY POSITION.

━━━ TYPE B RULES ━━━
Lead with body-position in first 5-8 words (kneeling / crouched / seated / reclining / leaning / mid-stride / reaching / climbing / leaping / bent / tilted / dangling / twirling). Playset dominates frame.

━━━ CONTEXT DNA ━━━
- Barbie environments: DreamHouse pink-spiral-staircase / rooftop-pool cabana / pink-convertible beach-drive / fashion-runway backstage / Malibu-beach sunset / DreamHouse kitchen / boutique storefront / country-club tennis-court / pink-jet cockpit / veterinary-clinic / concert-stage / fashion-week front-row / walk-in closet / yacht-deck / horse-riding stable / ice-skating rink / astronaut moon-surface / pool-party / pink-salon / chef-bistro / red-carpet premiere / ballet-studio / ski-chalet / tropical-jungle / pink-bathroom vanity
- Doll DNA: 11.5-inch articulated plastic body, molded hair (blonde / brunette / redhead / black / pastel-dyed variety), oversized head with glossy painted-makeup (winged-liner, pink-lip, highlight), fashion-forward mini-wardrobe (evening-gown / power-suit / swimsuit / astronaut / chef / rockstar / ballerina / vet-coat), spike-heel plastic shoes

━━━ MUST-HAVE ━━━
- Reference FASHION-DOLL / plastic-doll / Mattel-scale / articulated-doll / playset / pink-dominant LANGUAGE
- Glossy-plastic sheen + fashion-forward wardrobe language
- Type A = zero dolls. Type B = exactly ONE fashion-doll, OFF-CENTER, body-shaping pose-first
- Aggressive dedup: max 4 per pose-family, max 2 per playset-type

━━━ BANNED ━━━
- NO centered-hero doll
- NO multi-doll entries
- NO passive verbs
- NO branded names (Barbie / Ken / Skipper) — archetype only
- NO sexual / mature content
- NO dark / horror / grim-realism tone

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
