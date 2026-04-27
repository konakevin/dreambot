#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/siren_nymph_skin.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} SIREN NYMPH SKIN descriptions for classical figure paintings. Each entry describes the nymph's skin appearance: skin tone, how nature grows from her skin as ornamentation (tattoo-like, jewelry-like), and what bioluminescence she has. These will be inserted into a comma-separated image prompt — write them as comma-separated descriptive phrases, NOT full sentences.

Each entry: 15-25 words. Describes skin tone + nature ornamentation + glow.

━━━ RANGE TO COVER ━━━
Skin tones: warm brown, pale moonlit, golden-olive, deep umber, porcelain with green undertones, warm copper, cool silver-grey, rich mahogany, soft peach, dark ebony, rosy tan, tawny gold
Nature on skin (like tattoos/jewelry): delicate moss along collarbone like a necklace, flower petals embedded like tattoos, tiny ferns unfurling from shoulder blades, lichen freckles like gold dust, veins glowing faint green like leaf patterns, permanent dewdrops like diamonds, vine tracery along arms like henna, pollen dusting cheekbones like blush, wildflower blooms at temples, luminous spore freckles, crystal frost along eyelashes
Bioluminescence: faint green-gold glow, blue-white spore-light freckles, pulsing amber warmth, permanent dew-sheen, violet light at joints, soft pink warmth from within, cold silver shimmer, firefly-spark flickers

━━━ CRITICAL BANS ━━━
- NO words: "nude", "naked", "bare", "exposed", "unclothed", "uncovered", "topless"
- NO clothing or covering words: wrap, drape, skirt, bodice, corset, lace, fabric, gown, dress
- These entries describe SKIN APPEARANCE ONLY — color, texture, glow, nature details
- Write as comma-separated descriptive phrases, NOT full sentences

━━━ RULES ━━━
- Every entry: SKIN TONE + NATURE ORNAMENTATION + GLOW TYPE
- Nature details are tattoo-like, jewelry-like, cosmetic — growing FROM her skin
- Keep it beautiful, feminine, ornamental
- No two entries should share the same skin tone + glow combination

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
