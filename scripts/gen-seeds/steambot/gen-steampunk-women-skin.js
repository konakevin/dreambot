#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_women_skin.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} STEAMPUNK WOMAN SKIN descriptions for SteamBot's sexy-steampunk-woman path. Each entry describes the skin of a stunning steampunk woman in a way that ANCHORS HER ETHNICITY HARD so Flux 1.1 Pro will render the correct ethnicity (Flux has a strong default-toward-European-brunette bias that we need to FIGHT).

Each entry: 14-25 words. ONE specific skin description.

━━━ NON-NEGOTIABLE FORMAT — HARD LOCK ━━━
EVERY entry MUST OPEN with an explicit ETHNIC-IDENTIFIER PHRASE. The first 2-3 words MUST be one of these patterns:
- "Korean woman", "Japanese woman", "Chinese woman", "Vietnamese woman", "Thai woman", "Filipina woman"
- "Indian woman", "Pakistani woman", "Sri Lankan woman", "Bangladeshi woman"
- "Persian woman", "Arab woman", "Lebanese woman", "Egyptian woman", "Moroccan woman", "Turkish woman"
- "Mexican woman", "Cuban woman", "Colombian woman", "Brazilian woman", "Argentinian woman", "Latina woman"
- "Senegalese woman", "Ethiopian woman", "Nigerian woman", "Kenyan woman", "Caribbean woman", "African American woman"
- "Navajo woman", "Cherokee woman", "Maori woman", "Hawaiian woman", "Polynesian woman", "Samoan woman"
- "Greek woman", "Italian woman", "Spanish woman", "Sicilian woman"
- "English woman", "Irish woman", "Scottish woman", "Russian woman", "Norwegian woman", "Swedish woman", "German woman"
- "Mixed-heritage woman" (only for genuinely-mixed entries — describe the heritage)

Then continue with: skin tone description + steampunk-light interaction + one texture detail.

━━━ MANDATORY DISTRIBUTION (across these 100 entries) ━━━
Steampunk is a Victorian-era European aesthetic. European-coded women are
the dominant majority, with global variety sprinkled in.

- ~40 European Northern / Western (English, Irish, Scottish, Welsh, French, German, Russian, Norwegian, Swedish, Dutch, Polish)
- ~15 Mediterranean (Greek, Italian, Spanish, Sicilian, Portuguese)
- ~10 Middle Eastern / Persian / Arab (Persian, Lebanese, Egyptian, Moroccan, Turkish, Syrian) — fits Victorian-era exploration / Orientalist context
- ~10 East Asian (Korean, Japanese, Chinese, Vietnamese, Thai, Filipina)
- ~6 South Asian (Indian, Pakistani, Sri Lankan, Bangladeshi)
- ~6 African / African Diaspora (Senegalese, Ethiopian, Nigerian, Caribbean, African American)
- ~5 Latin / Hispanic / Mestiza (Mexican, Cuban, Colombian, Brazilian, Argentinian)
- ~4 Indigenous / Pacific (Navajo, Cherokee, Maori, Hawaiian, Polynesian, Samoan)
- ~4 Mixed-heritage / multi-racial

━━━ EACH ENTRY MUST INCLUDE ━━━
1. Ethnic-identifier phrase (FIRST WORDS — see format above)
2. Specific skin tone for that ethnicity (e.g., "porcelain-pale", "wheat-honey", "warm-caramel", "deep-mahogany")
3. Steampunk-light interaction: how brass-light / gaslight / forge-light / verdigris / amber-lamp hits her skin
4. One texture detail: freckle constellation / fine pore-detail / faint scar / sun-weathering / smile lines / steam-flush

━━━ HARD BANS ━━━
- DO NOT lead with "Salt-weathered" or "Sun-bronzed" or other tone-only openers — LEAD WITH ETHNIC-IDENTIFIER PHRASE
- NO sexualizing language, NO objectifying skin descriptions
- NO age description
- NO entries that are ambiguous about ethnicity

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Korean woman with cool-porcelain skin, brass lamplight giving warm rose to apple of cheek, single mole below left eye"
- "Indian woman with wheat-honey skin and warm gold undertone, gaslamp catching gold across high cheekbones, faint freckles across nose-bridge"
- "Persian woman with caramel skin and green undertone, forge-light bronzing brow, healed scar near right brow"
- "Mexican mestiza woman with terracotta skin and red undertone, amber gaslamp warming jaw, freckles dusting cheeks"
- "Senegalese woman with deep ebony skin and warm-red undertone, brass gaslamp making cheekbone glow like polished walnut"
- "Maori woman with bronze skin and golden undertone, lantern-glow catching old burn-scar at jawline, faint moko-style temple tattoo"
- "Greek woman with warm olive skin, brass-light skating across nose-bridge, faint sun-weathering at temples"
- "Vietnamese woman with cool jade complexion, copper-light haloing high cheekbone, fine wisp of hair on temple"
- "Irish woman with cream-pale skin and pink undertone, copper-penny freckles scattered across forehead and nose-bridge"
- "Mixed-heritage woman of African and Korean descent, warm honey-brown skin with cool undertone, faint lighting-burn scar on neck"
- "Filipina woman with golden-tan skin and warm bronze undertone, gaslamp glow across cheekbone, smattering of dark freckles across nose"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
