#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/male_warrior_hairstyles.json',
  total: 100,
  append: true,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} HAIRSTYLE entries for DragonBot's male-warrior path. Each entry is a SHORT phrase (10-22 words) describing the EXACT hairstyle for a battle-ready fantasy warrior man — practical, weathered, often tied for combat or shaved for war.

━━━ STYLE SPREAD (enforce variety across ${n}) ━━━
- LONG / TIED-BACK (5-6) — long warrior-hair pulled back in a low leather-bound tail, half-up topknot with the rest falling to the shoulders, full Highland-mane drawn back with a single iron-ring at the nape, long Berserker-locks tied with a strip of dragon-hide, long braided beard matching the long braided hair
- SHAVED / UNDERCUT (5-6) — Norse-warrior undercut with a long topknot, fully shaved skull with a single long warrior-braid down the spine, sides shaved with rune-tracks and a Mohican spine of remaining hair, completely shaved with battle-scars catching torchlight, shaved with a single long forelock pulled back
- BRAIDED / WEATHERED (4-5) — single thick warrior-braid down the back tied with bone, double battle-braids at the temples with the rest loose, tight Norse-braid threaded with iron rings, long-haired-with-side-braids combat style, beard-braids matching head-braids in classic Northman style
- WILD / WIND-CAUGHT (4-5) — long hair caught wild in dragon-wind tangled with a iron circlet, loose mane blown back from a cliff-edge stand, undone tangles from a long ride, sweat-damp hair stuck to a brow after battle, salt-tangled long hair from a sea-campaign
- SHORT / CROPPED / WAR-CUT (3-4) — practical short Roman-soldier crop, jaw-length campaign-cut singed at the ends from dragon-flame, choppy field-cut hacked at on the march, close-cropped infantry-style with a single forelock for personality

━━━ RULES ━━━
- Each entry is a VIVID hairstyle with a FANTASY-WORLD detail (bone-clasp, iron-ring, war-paint, dragon-flame burn, rune-track, etc.)
- Style-diverse — do NOT cluster on long-tied-back
- Practical for combat or signature for warrior identity
- Beards welcome — describe beard alongside hair when natural
- No modern hair (no man-buns alone, no fade-cut)
- Specific to MALE warriors

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
