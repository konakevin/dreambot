#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/explorer_skin.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} SKIN-DESCRIPTION entries for StarBot's female-explorer and male-explorer paths. Each entry is a SHORT phrase (10-20 words) describing the EXACT visual texture of explorer skin in sci-fi light — how alien-sun / cockpit-glow / ship-corridor lighting / nebula-glow hits it.

This pool composes with separate hair/eyes/outfit pools.

━━━ TONE SPREAD (enforce diversity across ${n}) ━━━
- FAIR (5) — porcelain pale catching cockpit-glow warm at the cheekbones, milk-white skin tinted blue under nebula-light, alabaster fairness with engine-soot smudge at the jaw, pale Northern complexion sun-burned from alien-star exposure, freckled fair skin with a faint UV-tan from extra-vehicular work
- WARM OLIVE (5) — Mediterranean olive that drinks alien-sun warmth to gold, sun-warmed Greek olive softened by lantern-fire-glow, weathered Italian olive tinted faintly green under nebula-shimmer, warm Spanish olive darkening at the temple from too many landings, olive-amber that glows under aurora-flicker
- WARM BROWN (5) — sun-bronzed brown weathered by zero-gravity exposure, deep Indian-subcontinent warmth tinged ochre by ship-corridor red-light, walnut-brown skin with engine-grease shadow at the wrist, polished mahogany glowing copper in cockpit-warm-glow, sun-darkened tan with golden flecks at the cheekbones
- DEEP UMBER (5) — rich umber catching cockpit-glow along the jaw to bronze, deep cocoa with a polished sheen under emergency-blue-light, ebony glowing copper near the engine-banks, dark mahogany with violet shadows pooling at the throat in nebula-light, deep coal-warm skin holding warm light at exertion
- WEATHERED / UNUSUAL (5) — wind-weathered explorer-tan with a thin scar over the cheekbone from a debris strike, sun-cracked desert-world tan with cracked lips, freckled redhead skin radiation-burned across the nose, weathered fair skin with multiple thin nicks from EVA mishaps, faintly-blue-tinged skin from too long in low-pressure pods

━━━ RULES ━━━
- Each entry is a VISUAL DESCRIPTION ready to be painted — not a personality
- Specify how SCI-FI LIGHT (cockpit-glow / alien-sun / nebula / aurora / corridor-red) interacts
- Tone-diverse — DO NOT cluster on pale-Northern. The 5-tier spread is mandatory
- Explorer-worn details welcome (UV-tan, low-pressure-tinge, debris-scar)
- Suitable for BOTH male and female explorers
- No skin-type judgments ("flawless", "perfect")

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
