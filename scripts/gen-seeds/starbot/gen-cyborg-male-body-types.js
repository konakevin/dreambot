#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cyborg_male_body_types.json',
  total: 100,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} BODY TYPE / SILHOUETTE descriptions for a male cyborg character. Each describes his overall build and physical proportions — the shape Flux should render. These cyborgs come from ALL walks of life but are ALWAYS handsome.

Each entry: 12-20 words. Body build + proportions + one defining physical trait + purpose word.

━━━ CATEGORIES (spread evenly across ALL of these) ━━━
- Lean assassin/operative builds (narrow hips, broad shoulders, wiry muscle, fast)
- Scholar/diplomat builds (tall, trim, refined posture, elegant hands)
- Laborer/dockworker builds (thick forearms, barrel chest, working-class muscle)
- Surgeon/engineer builds (medium frame, precise hands, controlled posture)
- Pilot/navigator builds (compact, wiry, quick reflexes in joint design)
- Swimmer/athlete builds (broad shoulders, narrow waist, lean defined muscle)
- Musician/artist builds (lean expressive frame, long dexterous fingers, fluid)
- Heavy enforcer builds (massive frame, thick arms, imposing)
- Compact fighter builds (short and dense, low center of gravity)
- Priest/monk builds (tall, spare, dignified bearing, minimal augmentation)

━━━ RULES ━━━
- Masculine silhouettes — but NOT all military/combat. Mix civilian and tactical
- Vary height and build widely. Use words like "tall", "compact", "medium" instead of foot-inch numbers
- Include where mechanical enhancement changes the silhouette
- ALWAYS handsome — good bone structure, attractive proportions regardless of role
- NEVER use apostrophes or single quotes in entries (breaks JSON). Write "six-foot-two" not 6'2"

━━━ DEDUP ━━━
No two entries should describe the same build category with the same proportions.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
