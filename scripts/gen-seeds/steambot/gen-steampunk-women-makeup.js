#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_women_makeup.json',
  total: 100,
  append: true,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} MAKEUP entries for SteamBot's sexy-steampunk-woman path. Each entry is a SHORT phrase (12-22 words) describing INTENTIONAL, SOOT-ADJACENT, BRASS-WORLD makeup — these women aren't fashion-magazine glossy, they're working-class-glamour, machinist-chic, weathered-and-deliberate.

This pool composes with separate skin/hair/eyes/wardrobe pools. The makeup should feel STEAMPUNK — kohl from a kohl pot, soot-smudged, gaslight-shadowed. NOT modern cosmetic counter.

━━━ STYLE SPREAD (enforce variety across ${n}) ━━━
- KOHL-HEAVY (5-6) — heavy kohl-rimmed eyes drawn with a steady hand and a lampblack stick, smudged kohl that bled with sweat from forge-work, sharp Cleopatra-meets-Victorian-lab kohl wing, kohl-darkened lash-line softened by hours of working over flame, deep-kohl framing with intentional soot-smudge under the lower lash
- SOOT / WEATHERED (4-5) — engine-soot smudged on cheekbone like deliberate contour, brass-dust dusted across cheekbone catching firelight, oil-spot near the jaw that became part of the face, fingerprint of grease on the temple from absent-minded work, ash-smudged brow from forge-leaning
- DARK LIP (4-5) — wine-dark lip stained with cheap absinthe-bar dye, deep oxblood lip held all day, soot-blackened-purple lip that bites in low light, port-wine stain matched on lower lip and upper, dark plum lip with a slight cracked-from-cold dryness
- GASLIGHT GLAMOUR (4-5) — gold-leafed temples catching firelight, copper-dust highlight along the cheekbone, brass-flecked browbone for the dirigible ball, faint mercury shimmer at inner corner of eye, gilt-flake on the brow ridge
- MINIMAL / WORKED (3-4) — bare-skinned working face with just smoke-dust as eye-shadow, sweat-and-coal natural shadow under tired eyes, factory-day no-paint with kohl just on the lash-line, just-stained lower lip from chewing it through eight hours of work

━━━ RULES ━━━
- Each entry is a SHORT VISUAL — sharp, paintable
- Makeup is INTENTIONAL but PERIOD-APPROPRIATE — kohl pot + soot + lampblack + brass dust, NOT modern airbrushed cosmetics
- Steampunk-world materials: soot, brass-dust, kohl, gaslight-glamour, gold-leaf, absinthe-stained
- NO "smokey eye" or "winged liner" alone — describe the MATERIAL and CONTEXT
- Women are CAPABLE — makeup either says "I dressed for the night" or "I worked all day and didn't reapply"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
