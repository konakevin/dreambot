#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_women_skin.json',
  total: 100,
  append: true,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} SKIN-DESCRIPTION entries for SteamBot's sexy-steampunk-woman path. Each entry is a SHORT phrase (10-20 words) describing the EXACT visual texture of her skin in steampunk light — how light hits it, where shadow pools, what tones it carries.

This pool composes with separate hair/eyes/makeup/wardrobe pools. The painter (Sonnet) will use this LITERAL description when rendering her skin. Make it vivid + specific + paintable.

━━━ TONE SPREAD (enforce diversity across ${n}) ━━━
- FAIR (5) — porcelain Victorian translucence with visible blue veins at temples, alabaster pale catching gaslight warm, milk-white skin that flushes pink at exertion, paper-thin English fairness with freckle-dust across nose, ivory complexion that goes blue in cold air
- WARM OLIVE (5) — Mediterranean olive that drinks brass-light to gold, sun-warmed Italian olive with a faint honey undertone, weathered Spanish olive showing weathered work, warm Greek olive softened by candlelight, olive-amber that glows under forge-flame
- WARM BROWN (5) — sun-bronzed brown with desert-dust softening the cheekbones, deep Indian-subcontinent warmth tinged ochre by gaslight, walnut-brown skin with iron-warm undertones, polished mahogany glowing copper in firelight, sun-darkened tan with golden flecks
- DEEP UMBER (5) — rich umber catching brass highlights along the jaw, deep cocoa with a polished sheen under steam-mist, ebony glowing burnished-copper near the firelight, dark mahogany with violet shadows pooling in the collar, deep coal-warm skin that holds warm light
- WEATHERED / WORKED (5) — sun-cracked ranger's tan with engine-soot smudged at the temple, smoke-tinted skin from years of forge-work, freckled redhead skin sun-burned across the nose-bridge, weathered sailor's skin with salt-bleached fairness, work-darkened mechanic's skin with grease-shadow at the wrist

━━━ RULES ━━━
- Each entry is a VISUAL DESCRIPTION ready to be painted — not a personality
- Specify how STEAMPUNK LIGHT (gaslight / brass / forge / smoke) interacts
- Paintable details: undertones, where shadow pools, how light catches
- Tone-diverse — DO NOT cluster on pale-Victorian. The 5-tier spread above is mandatory
- No skin-type judgments ("flawless", "perfect") — describe ATMOSPHERE on flesh

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
