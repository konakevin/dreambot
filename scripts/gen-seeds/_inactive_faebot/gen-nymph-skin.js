#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/nymph_skin.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} FOREST NYMPH SKIN + GLOW + COVERING descriptions for FaeBot. Each entry is a complete body description: skin tone, how the forest shows through her skin BEAUTIFULLY, what bioluminescence she has, and what naturally grows on her body as covering. Always FEMININE, VERY PRETTY, and ORNAMENTAL — like living jewelry or natural body art. Think Pre-Raphaelite painting meets nature documentary.

Each entry: 25-40 words. Covers skin (tone + pretty forest detail) + glow (bioluminescence) + coverings (natural clothing).

━━━ RANGE TO COVER ━━━
Skin tones: warm brown, pale moonlit, golden-olive, deep umber, porcelain with green undertones, warm copper, cool silver-grey, rich mahogany, soft peach, dark ebony, rosy tan, tawny gold
Pretty forest merges: delicate moss along her collarbone like a necklace, flower petals embedded in her skin like tattoos, tiny ferns unfurling from her shoulder blades, lichen freckles like gold dust, veins that glow faint green like leaf patterns, permanent dewdrops on her skin like diamonds, vine tracery along her arms like lace, pollen dusting her cheekbones like blush, wildflower blooms at her temples, luminous spore freckles, crystal frost along her eyelashes
Bioluminescence: faint green-gold glow, blue-white spore-light freckles, pulsing amber warmth, permanent dew-sheen, violet light at her joints, soft pink warmth from within, cold silver shimmer, firefly-spark flickers, no glow but skin that catches light like pearl
Coverings: woven flower petals, spider silk that shimmers, living vine lattice, draped moss like velvet, fern-frond wrap, seed-pod jewelry, cobweb lace, petal skirt, flowering vine bodice, draped lichen like chiffon

━━━ BANNED ━━━
- NO "bark", "bark-textured", "bark plates", "bark ridges", "rough bark" — bark looks gross on skin
- NO "fungi growing from joints", "mushroom caps on elbows" — keep growths PRETTY (flowers, ferns, moss, vines)
- Nothing that makes the skin look diseased, rough, cracked, or ugly

━━━ RULES ━━━
- Every entry must specify SKIN TONE + PRETTY FOREST DETAIL + GLOW TYPE + BODY COVERINGS
- The forest merge should look like ADORNMENT — jewelry, lace, tattoos, blush — not tree disease
- Coverings always maintain fantasy-art decorum (covered enough, never explicit)
- No two entries should share the same skin tone + glow + covering combination

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
