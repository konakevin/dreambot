#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/creature_portrait_features.json',
  total: 200,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CUTE PORTRAIT FEATURES for ChibiBot creature-portrait — small cute amplifier-details visible on the chibi creature's body/face in a tight portrait. Template picks 2 per render.

Each entry: 10-18 words. ONE specific cute body/face feature. NO creature species names, NO pose, NO expression, NO background.

━━━ FORMAT — CUTE CHARACTER-FEATURE ━━━

Examples:
✓ "Mochi-puff blush cheeks like rosy little pillows under glittering eyes"
✓ "Heart-shaped ears with pink inner-fluff catching the warm light"
✓ "Glittering oversized dewy eyes with multiple star-catchlights swimming inside"
✓ "Tiny pink heart-shaped nose dotted right in the center of a fluffy face"
✓ "Round mochi belly visible with a tiny belly-button or fluffy tuft"
✓ "Whisker-tufts curling out from cheeks like delicate antennae"
✓ "Pearlescent shimmer-fur catching iridescent rainbow highlights"
✓ "Tiny paw-pads visible in soft pink jellybeans"
✓ "Stubby fluff-tail curled up like a marshmallow"
✓ "Floppy ear flopped over one eye in a sweet accident"

━━━ CATEGORY DISTRIBUTION ━━━

- 20% EYES-DETAIL (glittering dewy oversized / star-catchlights inside / heart-shaped pupils / iridescent shimmer / multi-catchlight glassy / sparkle-irises)
- 15% CHEEK / BLUSH (mochi-puff blush cheeks / heart-shaped blush / glittering rosy dabs / dimpled pink cheeks)
- 15% EAR-DETAIL (heart-shaped ears / floppy ears / pearl-iridescent inner-ear / fluffy ear-tufts / ear-tuft-bows)
- 10% NOSE / MOUTH (tiny pink heart-nose / tiny smile-arc mouth / pink jelly-nose / star-shaped freckle on nose)
- 10% FUR / TEXTURE (mochi-puff fluffy fur / pearlescent shimmer / iridescent rainbow highlights / cotton-candy-soft fur / velvet plush)
- 5% BELLY / BODY (round mochi belly / fluffy belly-tuft / chubby marshmallow-body / heart-marking on chest)
- 5% PAWS / PADS (tiny pink jellybean paw-pads / soft floofy paw-fur / chubby stubby paws)
- 5% TAIL (stubby fluff-tail / curly marshmallow-tail / heart-tipped tail / iridescent shimmer-tail)
- 5% ANTENNAE / EXTRA (whisker-tufts / tiny antlers / horn-nubs / wing-stubs / floral-accent in hair)
- 5% ACCENTS (small star-shaped birthmark / tiny pink freckles / heart-shaped marking / sparkle-glitter on fur)
- 5% MAGIC-DETAIL (faint glow under the fur / sparkle-trail from movement / iridescent shimmer / magical mark)

━━━ HARD MANDATES ━━━

- IMPOSSIBLY-CUTE amplifier (push beyond ordinary cute)
- Visible on the creature's BODY (not pose, not background)
- Pixar/Pop-Mart designer-vinyl aesthetic

━━━ HARD BANS ━━━

- NO creature species names
- NO setting / background
- NO pose / expression
- NO scary / weird features

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
