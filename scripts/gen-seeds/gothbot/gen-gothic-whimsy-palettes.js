#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

const TOTAL = process.argv.includes('--dry') ? 12 : 200;

generatePool({
  outPath: process.argv.includes('--dry')
    ? '/tmp/gothic-whimsy-palettes-dryrun.json'
    : 'scripts/bots/gothbot/seeds/gothic_whimsy_palettes.json',
  total: TOTAL,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} SCENE-WIDE COLOR PALETTE descriptions for GothBot's gothic-whimsy medium. Each entry is a specific shadow-dominant dark-fairytale palette: 3-5 specific color words that define the scene's mood. Entries 12-22 words. DEDUPED HARD.

━━━ AESTHETIC — DARK GOTHIC WHIMSY ━━━
The universe of Tim Burton / Corpse Bride / Coraline / Nightmare Before Christmas / Pan's Labyrinth / Alice in Wonderland. Shadow-dominant low-key cinematic, tenebrous atmosphere, foreboding. Every palette is DARK-DOMINANT with one or two sparing vibrant accents. NOT well-lit, NOT bright, NOT warm-tungsten-dominant.

━━━ CORE RULE — DARK BASE + SPARING ACCENT ━━━
Every palette must have: a DARK dominant shadow-color (velvet-black / midnight-blue / deep-purple / charcoal / dusty-violet / plum / obsidian / graphite) + 1-2 SPARING vibrant accents that don't flood the frame. Accents appear as single-lantern or single-moon or small-prop-highlight only. The overall frame reads DARK, not colorful.

━━━ HARD DEDUP — 200 UNIQUE PALETTES ━━━
You will be shown prior entries. DO NOT repeat the same dominant + accent combo. Rotate HARD across accent color families so 200 entries feel distinct from the thumbnail.

━━━ ACCENT VARIETY — ROTATE WIDELY ━━━
Accents (pick 1-2 per palette, NEVER all): poison-green, rust-orange, oxblood-red, aged-gold, moonlit-silver, dusty-pink, sickly-yellow, emerald-dusk, plum, burnt-umber, candlelight-amber, cold-teal, violet-horizon, necro-white, tarnished-brass, witch-fire-green, blood-crimson, dusty-rose, fel-green, muted-coral, nightshade-indigo, graveyard-pale-blue, wormwood-green, smoke-lavender, dusk-apricot, tin-grey, ember-red, ash-pink, jade-shadow, iron-violet, copper-gleam, pewter-blue, mustard-gold, bruised-purple, dried-blood, moth-wing-grey, bog-olive, spectral-white, crypt-teal, pumpkin-ember, fungal-teal, bile-gold

━━━ PALETTE CONSTRUCTION RULES ━━━
Each entry: name 3-5 specific color words. Describe which color DOMINATES, which is SECONDARY (shadow-support), which is the ACCENT (1-2 sparing highlights). Example format: "velvet-black dominant with midnight-indigo shadow pools, single sparing poison-green accent from a lantern, charcoal mid-tones, dusty-violet haze at edges."

━━━ HARD BANS ━━━
- NO red-dominant monochrome (red/crimson only as sparing accent)
- NO well-lit / bright / cheerful palettes
- NO warm-tungsten-dominant
- NO pink-moon + pale-blue-skin + orange-window cliché (over-rendered)
- NO three-accent-in-a-row — keep accents to 1-2

━━━ DEDUP MANDATE ━━━
- Every entry UNIQUE in dominant + accent combination
- If prior batches used violet-black + poison-green, next entries MUST use different combos
- Rotate accents across the full list widely — 40+ accent options means spread them

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
