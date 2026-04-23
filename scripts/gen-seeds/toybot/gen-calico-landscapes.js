#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/calico_landscapes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} CALICO-CRITTER / SYLVANIAN-FAMILIES LANDSCAPE scene descriptions for ToyBot's calico-scene path. Cozy dollhouse-scale miniature environments — wooden furniture, tiny dishware, hand-sewn drapes, meticulously-detailed wholesome daily-life world.

Each entry: 15-25 words. ONE specific Calico/Sylvanian-world landscape scene.

━━━ THE MIX ━━━
- ~30% Type A — pure empty dollhouse-scale environment, NO flocked-animal-figurines. The fully-appointed miniature set IS the subject.
- ~70% Type B — ONE off-center flocked-animal figurine (bunny / bear / fox / cat / mouse / raccoon / hedgehog / squirrel — velvet-flocked ~3-inch scale with tiny cloth outfit) in a specific body-shaping pose within a dollhouse-scale environment. Lead with BODY POSITION.

━━━ TYPE B RULES ━━━
Lead with body-position in first 5-8 words (kneeling / crouched / seated / reclining / leaning / mid-stride / reaching / climbing / leaping / bent / tilted / dangling / curled). Set dominates frame.

━━━ CONTEXT DNA ━━━
- Calico environments: mushroom-cottage / sunlit-kitchen / garden with picket-fence / flower-meadow / mossy campsite / tree-house / blacksmith-forge / bakery-window / pond with lilypads / cozy-bedroom / post-office / library-loft / greenhouse / market-stall / stream-with-waterwheel / autumn-leaf-raking yard / beach-with-striped-umbrella / schoolhouse / attic-with-trunks / bathtime-nursery
- Figurine DNA: flocked-velvet small-animal body, painted plastic eyes, tiny cloth outfits (gingham / knit / calico / pinafore / bonnet / overalls / apron), ~3-inch dollhouse scale

━━━ MUST-HAVE ━━━
- Reference FLOCKED / velvet-texture / figurine / miniature-dollhouse-scale / tiny-cloth-outfit LANGUAGE
- Calico Critters / Sylvanian Families aesthetic
- Type A = zero figurines. Type B = exactly ONE flocked-animal-figurine, OFF-CENTER, body-shaping pose-first
- Aggressive dedup: max 4 per pose-family, max 2 per environment-type, vary animal-species across entries

━━━ BANNED ━━━
- NO centered-hero figurine
- NO multi-figurine entries
- NO passive verbs
- NO humans / human-children — flocked-animal-figurines only
- NO edgy / dark / horror tone — wholesome daily-life
- NO real brand-name references beyond generic "flocked figurine" DNA

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
