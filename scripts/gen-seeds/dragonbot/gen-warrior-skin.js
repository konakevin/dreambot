#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/warrior_skin.json',
  total: 100,
  append: true,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} SKIN-DESCRIPTION entries for DragonBot's female-warrior and male-warrior paths. Each entry is a SHORT phrase (10-20 words) describing the EXACT visual texture of warrior skin in fantasy light — how lantern-glow / firelight / moonlight hits it, where shadow pools, what tones it carries.

This pool composes with separate hair/eyes/outfit pools. Render the warrior with weathered, worked, real skin — not idealized airbrushed fantasy-art smoothness.

━━━ TONE SPREAD (enforce diversity across ${n}) ━━━
- FAIR (5) — pale Northern complexion catching torchlight warm at the cheekbones, milk-white Highland skin sun-burned across the nose-bridge, alabaster pale that flushes pink at the collarbone with exertion, freckled fair skin from years under cold mountain sun, paper-pale with battle-scars catching firelight
- WARM OLIVE (5) — Mediterranean olive that drinks torchlight to gold across the jawline, sun-warmed Greek olive softened by candlelight, weathered Italian olive showing campaign-tan, warm Spanish olive going honey at exertion, olive-amber that glows under forge-flame
- WARM BROWN (5) — sun-bronzed brown weathered by march-dust at the temples, deep Indian-subcontinent warmth tinged ochre by lantern-glow, walnut-brown skin with battle-warm undertones, polished mahogany glowing copper in firelight, sun-darkened tan with golden flecks at the cheekbones
- DEEP UMBER (5) — rich umber catching torchlight along the jaw to bronze, deep cocoa with a polished sheen under campaign-rain, ebony glowing burnished-copper near the firelight, dark mahogany with violet shadows pooling in the throat, deep coal-warm skin holding warm light at exertion
- WEATHERED / SCARRED (5) — wind-weathered skin with a battle-scar pulling at the brow, sun-cracked ranger's tan with a sword-scar at the cheekbone, freckled redhead skin scarred at the chin from a long-ago duel, weathered fair skin with multiple thin nicks from training, work-darkened mountaineer's skin with crow's-feet from squinting

━━━ RULES ━━━
- Each entry is a VISUAL DESCRIPTION ready to be painted — not a personality
- Specify how FANTASY LIGHT (torchlight / firelight / moonlight / lantern / dawn) interacts
- Tone-diverse — DO NOT cluster on pale-Northern. The 5-tier spread is mandatory
- Battle-worn / weathered details welcome — these are warriors, not models
- Suitable for BOTH male and female warriors — describe ATMOSPHERE on flesh, not gender
- No skin-type judgments ("flawless", "perfect")

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
