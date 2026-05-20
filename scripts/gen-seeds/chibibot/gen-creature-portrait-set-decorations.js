#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/creature_portrait_set_decorations.json',
  total: 200,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} SCATTERED SET-DECORATIONS for ChibiBot creature-portrait — small charming props that appear scattered around the chibi creature in the soft-bokeh foreground or floating in the air. Template picks 3 per render. Adds visual abundance to the portrait.

Each entry: 10-20 words. ONE specific decoration. NO creatures, NO outfits, NO recognizable settings.

━━━ FORMAT — SCATTERED CUTE SET-DECORATION ━━━

Examples:
✓ "Floating pastel heart-balloons drifting near the creature's head"
✓ "Scattered cherry-blossom petals tumbling across the foreground"
✓ "Mini-tea-set arranged on a soft cloud-cushion in the foreground"
✓ "Stack of tiny pastel storybooks tilted askew nearby"
✓ "Small bouquet of wildflowers in a glass-bottle vase"
✓ "Floating pearl-beads drifting like soap bubbles around the scene"
✓ "Mini-cupcakes on a tiny tiered cake-stand foregrounded"
✓ "Star-confetti and heart-confetti raining gently throughout"
✓ "Wisteria-vine cluster overhanging in the upper-corner of frame"
✓ "Tiny stuffed-toy-cluster (mini-bear, mini-bunny, mini-cat) piled near"

━━━ CATEGORY DISTRIBUTION ━━━

- 15% FLOATING / DRIFTING (floating heart-balloons / drifting petals / floating pearl-beads / floating star-confetti / floating bubbles)
- 15% TINY-FOOD (mini-cupcakes / mini-macarons / mini-donuts / mini-tea-set / pastel-candy-pile)
- 15% FLORAL-DECOR (bouquet in glass-bottle / cluster of wildflowers / scattered cherry-blossoms / wisteria-vine cluster / rose-bouquet)
- 10% BOOKS / STATIONERY (stack of pastel storybooks / open picture-book / pile of letters / quill-and-inkwell)
- 10% MINI-TOYS / PLUSHIES (mini-stuffed-bear / mini-bunny-plushie / mini-cat-plushie / mini-doll-cluster)
- 10% CONFETTI / SCATTER (rainbow sprinkles / heart-confetti / star-confetti / pastel-glitter / sugar-pearls)
- 5% RIBBONS / BUNTING (pastel ribbon-loops / hanging-bunting / draped lace / chiffon scarves)
- 5% LIGHTING-ACCENTS (mini paper-lanterns / fairy-light strand / candle-jar cluster / glow-jars / tea-light cluster)
- 5% MUSIC / WHIMSY (mini music-box / tiny piano-keys / floating sheet-music / tin-whistle cluster)
- 5% MAGICAL-WHIMSY (drifting magical-sparkle / wisp-of-light / floating gem-cluster / tiny crystal-pile)
- 5% MISC-CUTE (mini gift-boxes / tiny picnic-basket / mini-suitcase-of-charms / mini cake-on-pedestal)

━━━ HARD MANDATES ━━━

- Plural / cluster forms (NOT single solo items)
- Soft pastel palette
- Pop-Mart designer-vinyl glossy finish
- Foreground or floating positioning (NOT background)

━━━ HARD BANS ━━━

- NO creatures
- NO outfits (clothing on creature)
- NO setting / village language
- NO modern tech
- NO weapons / aggressive items

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
