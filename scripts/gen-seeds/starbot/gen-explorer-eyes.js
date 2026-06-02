#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/explorer_eyes.json',
  total: 25,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} EYE-COLOR-AND-INTENSITY entries for StarBot's female-explorer and male-explorer paths. Each entry is a SHORT phrase (10-18 words) describing the EXACT vivid color of explorer eyes AND how sci-fi-world light interacts — cockpit HUD glow, nebula aurora reflection, ship-corridor red-light, alien-star catch.

━━━ COLOR SPREAD (enforce diversity across ${n}) ━━━
- AMBER / GOLD (4-5) — molten amber catching cockpit HUD glow, warm honey-amber with copper rings around the pupil, dark amber that glints in nebula-light, dragon-gold eyes burning under aurora, antique-bronze gold with darker outer rim
- GREEN (4-5) — alien-aurora green so vivid they look lit from within, deep moss-green softened by ship-light warmth, cold serpent-green catching corridor-red, hazel-green that goes brass in cockpit-glow, mint-glass green with gold flecks
- BLUE (4-5) — Northern ice-blue burning cold under cockpit-blue, deep ocean-blue with a haunted pale ring, electric-blue glinting silver under emergency-light, plasma-blue that crackles when focused, weathered grey-blue washed warm by lantern
- BROWN / UMBER (4-5) — chocolate-brown with copper highlights from the engine-bay, dark almond-brown that catches cockpit-warm to honey, deep umber going gold near the iris-edge, rich coffee-brown with bronze flecks under HUD-glow, mahogany-brown glinting copper under lantern-fire
- RARE / STRIKING / AUGMENTED (4-5) — heterochromatic one amber one ice-blue, surgically-augmented violet with a faint glow ring, bone-white from a low-light gene-mod, dual-pupil mutation from a contaminated atmosphere, surgically-repaired iris with a thin chrome line, ocular-implant glowing soft amber where her right eye used to be

━━━ RULES ━━━
- Each entry is a VIVID color + a sci-fi-light interaction
- Color-diverse — do NOT cluster on amber
- Eyes should feel POWERFUL — focused, weathered by alien skies
- One entry MUST involve cybernetic / surgical / gene-mod augmentation (signature StarBot detail)
- Suitable for both male and female explorers
- No "soulless" / "dead eyes" — power and danger via VIVIDNESS

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
