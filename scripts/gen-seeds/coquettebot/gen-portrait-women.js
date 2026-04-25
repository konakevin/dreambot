#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/portrait_women.json',
  total: 200,
  batch: 50, append: true,
  metaPrompt: (n) => `You are writing ${n} PORTRAIT WOMAN descriptions for CoquetteBot — diverse beautiful women as subjects for classical oil-painting portraits in coquette fashion. Each describes the WOMAN only (not her clothing or setting — those come from other pools).

Each entry: 8-15 words. One specific woman's appearance: skin tone + ethnicity/features + age range + body type + one distinguishing detail.

━━━ SKIN TONES (distribute evenly across all ${n} entries) ━━━
- Deep ebony, rich dark brown, warm mahogany, deep bronze
- Medium brown, golden brown, olive, warm amber, tawny
- Light olive, sun-kissed tan, warm beige, golden
- Fair, porcelain, ivory, peachy-cream, rosy-pale, freckled fair

━━━ ETHNICITIES & FEATURES (distribute evenly) ━━━
- East Asian (Chinese, Japanese, Korean, Vietnamese, Thai, Filipino)
- South Asian (Indian, Pakistani, Sri Lankan, Bangladeshi)
- Southeast Asian (Indonesian, Malaysian, Cambodian)
- Black/African (West African, East African, Caribbean, African-American)
- Latina/Hispanic (Mexican, Colombian, Brazilian, Puerto Rican, Cuban)
- Middle Eastern/North African (Persian, Arab, Turkish, Amazigh)
- European (Northern, Southern, Eastern, Mediterranean)
- Mixed/multiracial (any combination)
- Indigenous (Native American, Polynesian, Aboriginal, Maori)

━━━ AGE RANGE ━━━
- All women are young (18-28): youthful glow, fresh-faced, dreamy wide eyes
- NO older women — this is princess energy, young and aspirational

━━━ DISTINGUISHING DETAILS (one per entry, vary widely) ━━━
- Freckles (scattered, dense, bridge-of-nose only)
- Beauty marks, dimples, high cheekbones
- Full lips, cupid's bow, soft smile, serene expression
- Almond eyes, wide-set eyes, heavy-lidded eyes, bright eyes
- Strong jaw, delicate features, round face, heart-shaped face
- Broad shoulders, petite frame, tall willowy, soft curves

━━━ RULES ━━━
- NO hair descriptions (separate pool handles hair)
- NO clothing descriptions (separate pool handles garments)
- NO settings or poses
- EVERY entry must specify skin tone + ethnic features
- Distribute EVENLY across all skin tones and ethnicities — no clustering
- Each woman should feel like a unique individual, not a type
- Beautiful but VARIED — not one beauty standard

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
