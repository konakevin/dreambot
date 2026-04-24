#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/flower_arrangements.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} FLOWER ARRANGEMENT descriptions for BloomBot's conservatory path. Each entry describes a specific combination of flowers with COLORS explicitly named.

Each entry: 15-30 words. A vivid description of what flowers fill the scene and what colors they create together.

━━━ ARRANGEMENT TYPES (distribute roughly as shown) ━━━

~30% MIXED RIOT — many different species and colors together:
- "wild riot of coral roses, purple delphiniums, white peonies, yellow ranunculus, and blue forget-me-nots cascading in every direction"
- "botanical chaos — fuchsia bougainvillea tangled with orange nasturtiums, lavender sweet peas, crimson poppies, and cream honeysuckle"
- "every color imaginable — magenta dahlias, cobalt hydrangeas, golden sunflowers, blush peonies, violet irises, and scarlet geraniums"

~20% COLOR-THEMED BOUQUETS — multiple species in a harmonious palette:
- "sunset palette — orange marigolds, golden zinnias, red dahlias, peach roses, and amber chrysanthemums in warm cascading layers"
- "cool blues and purples — lavender wisteria, indigo delphiniums, periwinkle hydrangeas, violet clematis, and pale blue morning glories"
- "pink dream — blush peonies, hot pink camellias, rose-pink sweet peas, magenta bougainvillea, and coral snapdragons"
- "greens and whites — white gardenias, cream magnolias, pale green hellebores, white lilacs, and ivory tuberose with deep green foliage"

~20% SINGLE SPECIES, MULTIPLE COLORS — same flower in many hues:
- "hydrangeas in every shade — cobalt blue, dusty pink, deep purple, snow white, and sage green clusters massed together"
- "roses in full spectrum — blood red, peach, butter yellow, snow white, deep pink, and lavender all intermixed"
- "hibiscus rainbow — scarlet, coral, golden yellow, hot pink, white, and deep orange blooms"
- "plumeria in sunset tones — white with yellow center, deep pink, pale peach, fiery red-orange, and pure cream"

~15% SINGLE SPECIES, SINGLE COLOR — dramatic monochrome:
- "pure white jasmine vines blanketing every surface, thousands of tiny star-shaped blooms"
- "endless purple wisteria hanging in curtains from every iron rib"
- "nothing but deep red roses — hundreds of velvety crimson blooms packed impossibly dense"
- "fields of golden sunflowers, each head the size of a dinner plate"

~15% TROPICAL MIX — Hawaiian/exotic species:
- "tropical explosion — hot pink plumeria, orange bird-of-paradise, red torch ginger, purple orchids, and yellow heliconia"
- "jungle flowers — massive white moonflowers, crimson anthurium, tiger-striped orchids, electric blue jade vine, and scarlet passion flowers"

━━━ RULES ━━━
- ALWAYS name specific flower species (real ones, not invented)
- ALWAYS name specific colors (not just "colorful" — say "crimson, gold, periwinkle")
- Each entry should paint a vivid picture of what the viewer SEES color-wise
- Vary widely — no two entries should have the same species + color combo
- Include both common garden flowers AND exotic/tropical species across the pool
- Some entries lush and maximal, others elegant and restrained

━━━ DEDUP ━━━
No two entries with the same dominant species AND same color palette. If two entries feature roses, they must be radically different color combos.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
