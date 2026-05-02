#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_men_skin.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} STEAMPUNK MAN SKIN descriptions for SteamBot's steampunk-man path. Each entry describes a specific face/skin look — not just ethnicity but the LIVED-IN texture: weathering, soot, scars, sun, gaslight tan, factory pallor, fine bone structure.

Each entry: 12-22 words. ONE specific skin description.

━━━ TONE ━━━
- WEATHERED / WORKED / LIVED-IN — these men work in industrial Victorian steampunk worlds
- Skin tells a story — soot smudges, factory pallor, sun-tanned-from-airship-decks, scarred from gear-mishaps, stubble-shadow
- Period-accurate — no modern beauty product perfection
- Realistic ethnic variety: European (English, Russian, French, German, Italian, Spanish, Polish), Mediterranean, Middle Eastern, North African, Indian, Chinese, Japanese, Black, Caribbean, Latin

━━━ ETHNIC SPREAD (across ${n} entries — distribute) ━━━
- European/British (12-15)
- Mediterranean / Italian / Spanish / Greek (5-7)
- Middle Eastern / Turkish / Persian (4-6)
- North African / Egyptian / Moroccan (3-5)
- Indian / South Asian (3-5)
- East Asian — Chinese, Japanese, Korean (4-6)
- Black — African, African-American, Afro-Caribbean (5-7)
- Latin / Mestizo (3-5)
- Mixed / ambiguous (2-4)

━━━ DETAILS TO INCLUDE PER ENTRY ━━━
- Skin tone in specific terms (alabaster / wheat / olive / russet / sepia / mahogany / ebony / bronze / sandstone)
- Texture: stubble shadow, soot smudge along jaw, factory pallor, sun-bronzed forehead, scarred temple, weathered crow's-feet, freckled, pock-marked
- Bone structure detail: high cheekbones, strong jaw, chiseled brow, broken nose, sharp aristocratic features, soft round face, granite-cut profile

━━━ ABSOLUTELY BANNED ━━━
- NO modern beauty product references (no "perfect skin")
- NO sexualizing language
- NO clothing details (this is just face/skin)
- NO eye descriptions (separate axis)
- NO hair (separate axis)

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Sun-bronzed Greek skin with strong Mediterranean bone structure, sharp jaw shadowed by three-day stubble, faint scar across one eyebrow"
- "Pale alabaster English skin under factory pallor, high aristocratic cheekbones, strong straight nose, faint soot-smudge along his jawline"
- "Mahogany Black skin smooth across high cheekbones, square jaw with close-shaved precision, faint mechanic's-grease smear on his temple"
- "Olive Italian complexion weathered by airship decks, weathered crow's-feet at his eyes, stubble shadow along his strong jaw"
- "Wheat-honey Persian skin with chiseled bone structure, dark stubble shadow across his strong jaw, faint scar through his eyebrow"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
