#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_men_facial_hair.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} STEAMPUNK MAN FACIAL-HAIR descriptions for SteamBot's steampunk-man path. Period-accurate Victorian-industrial / 19th-century facial hair styles. This is the male-only axis equivalent of women's makeup.

Each entry: 8-15 words. ONE facial-hair description.

━━━ FACIAL-HAIR TYPES (distribute across ${n}) ━━━
- Clean-shaven (8-10) — sharp jaw, no facial hair
- Three-day stubble (6-8) — light shadow across jaw and chin
- Heavy stubble / scruff (4-6) — pronounced unkempt growth
- Full beard (5-7) — thick, neat or wild
- Trimmed pointed beard / Van Dyke (4-6) — pointed chin, neat mustache
- Handlebar mustache (4-6) — waxed-curled mustache, no beard
- Walrus mustache (3-5) — thick drooping mustache, no beard
- Pencil mustache (2-4) — thin neat upper-lip line
- Mutton chops (3-5) — long sideburns, no beard
- Mutton chops + handlebar (2-4) — sideburns connected to mustache, no chin
- Friendly mutton chops / sideburns down to jaw (2-3)
- Goatee + mustache (Van Dyke variant) (2-4)
- Long beard (Greybeard / scholar) (2-4)
- Short cropped beard (3-5) — neat, close to the jaw

━━━ DETAILS PER ENTRY ━━━
- Style + texture (waxed, tangled, neat, shot through with grey, soot-flecked)
- Optional period-flavor (Victorian-era handlebar, military-trim, factory-soot-stained)

━━━ ABSOLUTELY BANNED ━━━
- NO modern hipster styling
- NO designer-stubble references
- NO supernatural facial hair (no Mephistopheles flame-tipped beards)

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Clean-shaven, sharp jawline, smooth skin"
- "Heavy three-day stubble shadowing his strong jaw"
- "Waxed handlebar mustache neatly curled at the tips, no beard"
- "Full thick black beard shot through with iron-grey at the chin"
- "Mutton chops long down to the jaw connecting with a waxed handlebar mustache"
- "Trimmed Van Dyke beard with pointed chin and neat mustache, scholarly"
- "Walrus mustache thick and drooping, soot-flecked from the forge"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
