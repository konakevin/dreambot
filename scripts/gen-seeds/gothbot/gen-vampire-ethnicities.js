#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_ethnicities.json',
  total: 30,
  batch: 15,
  metaPrompt: (n) => `You are writing ${n} ETHNIC / CULTURAL FEATURE descriptions for GothBot's vampire-vogue-realism path. Vampires exist across every region of the world. This pool exists to add variety so renders don't always default to the same ethnic features — all regions (including European / Western) are welcome, just spread across the pool.

Each entry: 15-25 words. ONE vampire woman's UNDERLYING ETHNIC / CULTURAL FEATURE DNA — describes bone structure + eye shape + nose + lip shape + hair type + underlying skin undertone (note: her actual render-skin is deathly-pale vampire-drained, but her underlying ethnic features and skin UNDERTONE still come through).

━━━ GLOBAL VARIETY MANDATE ━━━
Across 30 entries, rotate through a wide range of regions. Max ~3 entries per region so the pool stays varied. Regions to cover (all welcome, no region excluded):

- EAST ASIAN (Japanese, Korean, Chinese, Mongolian — 3 entries max combined, varied features)
- SOUTHEAST ASIAN (Vietnamese, Thai, Filipino, Indonesian, Malay, Burmese — 3 entries max)
- SOUTH ASIAN (Indian, Pakistani, Sri Lankan, Tamil, Bengali, Nepali — 3 entries max)
- CENTRAL ASIAN (Kazakh, Uzbek, Kyrgyz, Uyghur — 2 entries max)
- MIDDLE EASTERN / NORTH AFRICAN (Persian, Arab, Lebanese, Turkish, Kurdish, Egyptian, Moroccan, Berber — 3 entries max)
- SUB-SAHARAN AFRICAN (West-African, East-African, South-African, Ethiopian, Somali, Nigerian, Ghanaian, Kenyan — 3 entries max)
- MEDITERRANEAN EUROPEAN (Greek, Italian, Spanish, Portuguese, Sicilian — 2 entries max)
- SLAVIC / EASTERN EUROPEAN (Russian, Polish, Ukrainian, Serbian, Romanian — 2 entries max)
- NORDIC / NORTH EUROPEAN (Scandinavian, Finnish, Icelandic — 2 entries max)
- CELTIC / NORTHWEST EUROPEAN (Irish, Scottish, Welsh — 2 entries max)
- WESTERN EUROPEAN (English, German, French, Dutch, Austrian — 2 entries max)
- LATIN AMERICAN (Mexican, Peruvian, Brazilian, Colombian, Argentinian, Chilean — 2 entries max)
- INDIGENOUS AMERICAS (Navajo / Apache-inspired, Mayan / Aztec-inspired, Incan-inspired, Andean, First-Nations-inspired — 2 entries max)
- POLYNESIAN / PACIFIC ISLANDER (Maori, Hawaiian, Samoan, Tongan — 1-2 entries)
- CARIBBEAN / AFRO-DIASPORA (Afro-Caribbean, Dominican, Cuban, Haitian — 2 entries max)
- MIXED / AMBIGUOUS / AFRO-ASIAN / EURASIAN / AFRO-LATIN (2-3 entries)

━━━ WHAT EACH ENTRY MUST NAME ━━━

1. ETHNIC / CULTURAL INSPIRATION — the region or ancestry clearly named
2. BONE STRUCTURE — cheekbones (high, broad, low, hollow-carved, sharp, soft), jaw (square, heart-shape, oval, wide, narrow)
3. EYE SHAPE — almond, hooded, monolid, round, upturned, downturned, deep-set, wide-set
4. NOSE — aquiline, broad, narrow-bridge, button, hook, flat-bridge, high-bridge, flared-nostril
5. LIPS — full, heart-shape, thin, wide, wide-bow, cupid-bow, flat-bow
6. HAIR TEXTURE — straight, wavy, curly, kinky-coiled, silken, coarse, thick
7. SKIN UNDERTONE — BASE undertone before vampire pallor (warm-olive, cool-porcelain, deep-umber, rich-bronze, honey, sepia, neutral-ivory, warm-mahogany, cool-ebony, etc.). The render makeup-pales her to corpse-drained, but her UNDERTONE shows through the pallor.

━━━ TONE ━━━
Write as descriptive character features — NOT stereotypes, NOT reductive. The goal is realistic anthropological variety. Every vampire is specific and dignified — she happens to be from her region, her features are BEAUTIFUL in the way they are authentic to that region.

━━━ WRITING EXAMPLES (style target) ━━━
"East-African Ethiopian-Oromo vampire — high sharp cheekbones, deep-set almond eyes with pronounced double-lid, narrow high-bridged aquiline nose, full well-defined cupid-bow lips, tight coiled raven hair, deep bronze-umber undertone showing through deathly pallor"

"Vietnamese-ancestry vampire — delicate heart-shape face, monolid almond eyes with slight upturn, narrow low-bridge button nose, wide flat-bow lips, silken straight raven hair, warm-honey undertone cooled to corpse-pale"

"Persian / Iranian vampire — high broad cheekbones, deep-set hooded almond eyes, long slim aquiline nose with prominent bridge, full wide lips, thick wavy raven hair, warm-olive undertone drained to bloodless ivory"

"Polynesian Maori vampire — broad strong cheekbones, wide-set almond-round eyes, broader flat-bridge nose, full wide heart-shape lips, thick wavy dark hair, rich warm-sepia undertone tinted to ashen-drained"

"Sicilian-Italian vampire — sharp heart-shape jaw, deep-set wide-set dark almond eyes, long straight aquiline nose, narrow cupid-bow lips, thick black curly hair, olive-honey undertone washed to corpse-waxy-pallor"

"Navajo-inspired Indigenous vampire — broad high cheekbones, almond-round deep-set eyes, strong slightly-hooked nose, wide flat-bow lips, thick coarse raven hair, warm copper-cedar undertone paled to deathly-ashen"

━━━ HARD RULES ━━━
- 15-25 words per entry
- Every entry explicitly names its ethnic / cultural inspiration
- Every entry names: bone structure + eye shape + nose + lips + hair + undertone
- Max 3 per region (enforce)
- No repeated specific descriptor combos
- NOT reductive stereotypes — realistic anthropological features, dignified

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
