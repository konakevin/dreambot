#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cyborg_female_body_types.json',
  total: 100,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} BODY TYPE / SILHOUETTE descriptions for a female cyborg character. Each describes her overall build and physical proportions — the shape Flux should render. These cyborgs come from ALL walks of life but are ALWAYS beautiful.

Each entry: 12-20 words. Body build + proportions + one defining physical trait + purpose word.

━━━ CATEGORIES (spread evenly across ALL of these) ━━━
- Hourglass/curvy builds (various proportions — petite to tall)
- Dancer/performer builds (long toned legs, graceful proportions, fluid joints)
- Tall statuesque builds (amazonian, runway, commanding)
- Scholar/diplomat builds (refined posture, elegant hands, polished presence)
- Surgeon/engineer builds (medium frame, precise hands, controlled elegance)
- Pilot/navigator builds (compact athletic, quick-reflex joint design)
- Athletic/muscular builds (gymnast, swimmer, martial artist)
- Petite/compact builds (small but powerful, dense muscle)
- Lean/angular builds (sharp, willowy, minimal curves)
- Oracle/priestess builds (tall, spare, ethereal bearing, luminous presence)

━━━ RULES ━━━
- Feminine silhouettes — but NOT all bombshell/seductress. Mix civilian and tactical
- Vary height (5'0" to 6'3"), weight, and proportions widely
- Include where mechanical enhancement changes the silhouette
- ALWAYS beautiful — attractive proportions regardless of role

━━━ DEDUP ━━━
No two entries should describe the same build category with the same proportions.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
