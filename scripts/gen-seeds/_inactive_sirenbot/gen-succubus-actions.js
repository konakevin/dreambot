#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/succubus_actions.json',
  total: 50,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SUCCUBUS ACTION descriptions for SirenBot's succubus path. A gothic demonic heroine — bat wings, small curved horns, shadow magic. She is DANGEROUS and HEROIC, not seductive pinup. Every action is dynamic, mid-motion.

Each entry: 10-20 words. A specific freeze-frame action moment.

━━━ CATEGORIES TO COVER ━━━
- Launching skyward from a cathedral spire, wings snapping open, shadow trailing behind her
- Deflecting a holy bolt with an outstretched palm wreathed in dark flame
- Landing hard on a rooftop, one knee down, wings folded, eyes scanning
- Summoning shadow tendrils from the ground, arms raised, hair whipping upward
- Perched on a gargoyle, wings half-spread, watching the city below through narrowed eyes
- Catching a falling sword mid-air, fingers closing around the blade without flinching
- Walking through fire untouched, silhouette sharp against the inferno behind her
- Tearing open a portal in the air with both hands, violet light spilling through
- Crouching on a rooftop edge, one wing extended for balance, rain streaming off leather
- Reading ancient text by candlelight, one claw tracing the page, wings folded close

━━━ RULES ━━━
- NO sitting, lying, posing, watching, meditating, standing still
- NO seductive poses, no come-hither looks, no beckoning
- Every entry is MID-ACTION — she is doing something with her whole body
- She is a warrior-queen, not a model

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: action verb + body position + power type (shadow/fire/flight/physical).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
