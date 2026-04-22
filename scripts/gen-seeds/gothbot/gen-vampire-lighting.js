#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_lighting.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} CINEMATIC LIGHTING + SHADOW + HUE compositions for GothBot's vampire-vogue-realism path — extreme close-up face portraits of vampire women. Each entry is ONE dramatic lighting composition for a face-dominant portrait.

Each entry: 25-40 words. Specifies KEY LIGHT (hue + direction + quality) + FILL / RIM / BOUNCE (cool or warm counter) + SHADOW behavior + ONE atmospheric detail. The subject is ALREADY a pale drained vampire woman — your lighting shapes her face dramatically.

━━━ LIGHTING VARIETY — ROTATE HARD ━━━
Each entry must vary across these dimensions. NO two entries share the same key+fill+direction combination:

**KEY LIGHT HUE** — rotate: warm amber candle / warm torch-orange / warm forge-ember / cold moonlit silver / cool violet-twilight / cool sapphire-blue / witch-fire-emerald-green / fel-violet / crimson-stained-glass / pink-moonlight / alchemist-gold / cold-steel / blacklight-UV / white-fluorescent-cold / pre-dawn-indigo

**KEY LIGHT DIRECTION** — rotate: low-right / low-left / directly-above (top) / top-right-rembrandt-45 / top-left-rembrandt-45 / side-left-hard / side-right-hard / below-underlight-chilling / behind-rim-backlit / directly-below-up-lit / high-back-3/4-rim / eye-level-flat

**SHADOW COLOR** — cool-violet / indigo-navy / deep-teal / obsidian-black / midnight-blue / fel-green-tinted / plum-shadow / cold-steel-grey / warm-umber / blood-shadow. Shadows are colored, never flat neutral gray.

**FILL / RIM / BOUNCE** — opposite-temperature counter fill light. Every entry has a second hue in the shadow or rim to avoid monochrome single-hue cast. If key is warm, fill is cool. If key is cool, fill is warm or a specialty hue (witch-fire-green, fel-violet accent).

**ATMOSPHERIC DETAIL** — add one: faint dust motes in key beam / rain droplets glinting in rim / wet dewy skin picking up colored highlights / candle-flicker-wobble / bokeh-light-orbs behind / fog-diffusion softening fill / lens flare from rim / thin fabric-texture shadow from out-of-frame curtain / gentle breath-fog caught in key beam

━━━ TONE ━━━
Cinematic portrait lighting — Barry-Lyndon-candlelit / Crimson-Peak-moonlit / Nosferatu-2024-underlit / Underworld-blue-steel / Interview-with-the-Vampire-amber-candle / Only-Lovers-Left-Alive-neon-nocturne aesthetic. Dramatic chiaroscuro with deep dark shadows and single saturated key. NEVER flat-magazine-beauty-light. NEVER HDR-flat-lit. NEVER soft-ring-light-selfie-glow.

━━━ WRITING EXAMPLES (style target) ━━━
"Single warm amber candle from low-right casting long upward shadow up her cheekbone, cool violet-indigo ambient bounce from opposite side wrapping the temple, faint dust motes floating in the key beam."

"Cold moonlit silver key from above-left carving a sharp vertical shadow down the nose bridge, fel-green witch-fire rim from behind-right glowing along the jawline, plum-shadow in the sockets, dewy skin catching silver highlights."

"Witch-fire emerald underlight from below throwing long carved shadows up across the nose and forehead, warm torch-orange accent glint on the lip-wet-gloss, deep obsidian-black shadow swallowing the hairline."

"Pink-moonlight key from high-back-rim silhouetting her jaw in soft rose-glow, cold sapphire-blue fill across the near cheek, thin rain-droplet glints caught in the rim wash."

"Crimson-stained-glass shaft falling diagonally from top-left painting one half of her face blood-red, cool deep-teal shadow on the opposite half, faint bokeh-light-orbs dissolving in the background."

━━━ HARD RULES ━━━
- 25-40 words per entry
- Each entry names: key-light-hue + direction, fill/rim/bounce counter hue, shadow color, one atmospheric detail
- Every entry visibly distinct from every other (NO repeating key+fill+direction combos)
- Each entry has TWO distinct hue temperatures minimum — NEVER single-hue monochrome cast
- Cinematic dramatic lighting — not flat magazine-beauty-light

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
