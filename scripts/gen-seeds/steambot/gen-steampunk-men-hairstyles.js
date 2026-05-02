#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_men_hairstyles.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} STEAMPUNK MAN HAIRSTYLE descriptions for SteamBot's steampunk-man path. Period-accurate Victorian-industrial era hairstyles only. NOT modern haircuts.

Each entry: 10-18 words. ONE hairstyle description.

━━━ HAIRSTYLE TYPES (mix broadly) ━━━
1. SIDE-PARTED VICTORIAN GENTLEMAN — slicked-back with sharp middle or side part, pomade-oiled
2. POMPADOUR — front swept up and back, fashionable in late-Victorian era
3. SLICKED-BACK — hair combed straight back, flat against the skull
4. UNDERCUT WITH POMADED TOP — sides shaved short, top long and combed back
5. WIND-TANGLED — long-ish hair clearly windswept from airship deck or factory steam
6. OILED-DOWN STRAIGHT — neat conservative engineer's cut
7. CLOSE-CROPPED MILITARY — short over the ears, slightly longer on top
8. SHORT FACTORY CUT — practical short crop for the workshop
9. BALD — shaved or naturally bald
10. LONG QUEUE / PONYTAIL — tied at the nape with leather thong (older / scholarly look)
11. DISHEVELED INVENTOR — hair sticking up as if from running fingers through it, mad-genius energy
12. CURTAINED — center-parted hair falling slightly on either side (Romantic-era holdover)
13. SOOT-STREAKED MUSSED — windblown, factory-grime in the strands
14. GOGGLES PUSHED-INTO-HAIR — pushed-up brass goggles holding back hair

━━━ ENVIRONMENT MARKERS (optional flair) ━━━
- "soot-flecked at the temples"
- "windswept from the airship deck"
- "gear-grease at his hairline"
- "factory-steam-frizzed"
- "pomade-perfect"
- "sweat-darkened from the forge"

━━━ ABSOLUTELY BANNED ━━━
- NO modern haircuts (no fades, mohawks, mullets, man-buns)
- NO color references (separate axis)
- NO unnecessary trendy styling
- NO anime hair (no spikes, no chopstick-defying angles)

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Side-parted Victorian gentleman, slicked back with a sharp middle part, pomade-oiled"
- "Disheveled inventor's hair sticking up at angles, as if just hands-through-the-strands, mad-genius energy"
- "Brass aviation goggles pushed up holding back his sweaty wind-tangled hair"
- "Close-cropped military cut, short above the ears, slightly longer on top, soot-flecked at the temples"
- "Long queue tied at his nape with a worn leather thong, scholarly steampunk-academic look"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
