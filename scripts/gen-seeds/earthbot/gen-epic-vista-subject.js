#!/usr/bin/env node
/**
 * EarthBot epic-vista — SUBJECT axis (the iconic vista anchor).
 *
 * Each entry = ONE real Earth location, geography + geology + scale only.
 * NO weather, NO lighting, NO phenomena, NO sky baked in. Those are
 * separate axes and the composer stacks them at render time.
 *
 * Identity correction (2026-05-20): the legacy epic_vistas pool packed
 * 3-5 phenomena per entry ("granite spires + storm clouds + THREE rainbows
 * + glacial lake + golden light" all in one sentence). That stacking is
 * the AI-fake drift Kevin called out. This pool restores discipline:
 * one location, one scene anchor.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/epic_vista_subject.json',
  total: 30,
  batch: 15,
  metaPrompt: (n) => `You are writing ${n} EPIC VISTA SUBJECT entries for EarthBot — each entry names ONE iconic real-world Earth landscape and describes its core geological character + scale.

━━━ THE BAR ━━━

EarthBot's identity: jaw-dropping vistas of REAL EARTH, larger-than-life but never AI-fake / never sci-fi / never fantasy. The viewer's reaction: "is this real? I want to BOOK A FLIGHT THERE." Each entry should make a future Flux render of THAT specific place at vista-scale.

━━━ FORMAT (NON-NEGOTIABLE) ━━━

Each entry: 18-30 words. ONE location. Describe:
- Location NAME (real specific place — Torres del Paine, Vatnajökull, Reynisfjara, Etretat, Bryce, Zhangjiajie, etc.)
- Core geological character (granite spires / basalt columns / sandstone hoodoos / ice cap / hexagonal columns / star dunes / etc.)
- Scale character (vertical drop, breadth, depth — concrete physical scale)
- Base material/palette (charcoal-black sand / electric-blue ice / rust-red sandstone / cobalt water / lime-green moss)

WHAT TO ABSOLUTELY EXCLUDE — these go in OTHER axes, never in subject:
- NO weather (no storms, no clouds, no rain, no snow falling)
- NO lighting / time-of-day (no "golden hour", no "sunset", no "dawn", no "midnight sun")
- NO optical phenomena (no rainbows, no aurora, no sun-pillars, no halos)
- NO atmospheric effects (no fog, no mist, no haze, no spray)
- NO sky description (no cobalt sky, no mammatus clouds)
- NO scale-prover wildlife (no eagles, no goats — that's hero_feature axis)

This is the LOCATION + GEOLOGY only. Other axes layer on top at render time.

━━━ EXAMPLES (study the format — clean isolation of just the subject) ━━━

✓ "Torres del Paine in Patagonia: three granite spires rising sheer two-thousand meters from turquoise glacial lake, sheer wind-scoured east faces, blue-grey ridges receding to horizon"
✓ "Vatnajökull Glacier in Iceland: ice cap stretching to horizon, electric-blue calving fronts dropping vertical into black volcanic-sand fjord, crevasse fields scoring the surface"
✓ "Reynisfjara in Iceland: hexagonal basalt column cliffs rising from north-Atlantic surf, charcoal-black volcanic sand, sea-stacks standing offshore"
✓ "Saharan Star Dunes near Erg Chebbi: thousand-foot pyramid sand crests, shadow-striped ridgelines converging to vanishing point, tangerine sand and pure ochre hollows"
✓ "Zhangjiajie sandstone pillars in China: thousand sandstone towers rising vertical from valley floor, every column dressed in moss and clinging pines, deep ravines cutting between"
✓ "Cliffs of Moher in Ireland: vertical 700-foot sea cliffs running fourteen kilometers along Atlantic coast, layered Liscannor flagstone, slate-grey and ochre"

✗ BAD — stacks too much: "Torres del Paine granite spires pierce storm clouds while three rainbows arc over turquoise glacial lake, golden light exploding through breaking tempest" (this packs subject + storm + rainbow + light into one entry)
✗ BAD — adds wildlife: "Patagonian peaks with condors soaring above" (wildlife is a separate axis)
✗ BAD — adds atmosphere: "Patagonian peaks under low rolling fog" (atmosphere is a separate axis)

━━━ CATEGORY DISTRIBUTION (across ${n} entries) ━━━

- ~30% Mountain ranges (Patagonia / Himalayan / Karakoram / Alps / Dolomites / Sierra / Cascades / Andes / Atlas)
- ~20% Coastal sea-cliff (Reynisfjara / Napali / Faroe / Cliffs of Moher / Big Sur / Etretat / 12 Apostles)
- ~15% Desert/dunes (Sahara / Namib / Atacama / Sonoran / Wadi Rum / Death Valley / Salar de Uyuni)
- ~15% Ice/Arctic (Vatnajökull / Antarctic ice shelf / Greenland ice cap / Banff icefields / Lemaire Channel)
- ~10% Canyon/plateau/karst (Grand Canyon / Bryce / Monument Valley / Zion / Plitvice / Jiuzhaigou)
- ~10% Forest giants / jungle / volcanic landscape (Sequoia / Redwood / Daintree / Hoh Rainforest / Kilauea / Mount Bromo / Yellowstone hot springs)

NEVER repeat a location twice. Each entry is a UNIQUE real place.

━━━ HARD BANS — EARTHBOT IDENTITY ━━━

- NO sci-fi vocabulary ("alien", "otherworldly", "Pandora", "biomechanical")
- NO fantasy vocabulary ("enchanted", "magical", "mystical", "ethereal", "fairy")
- NO bioluminescent fungi / glowworms / phosphorescent anything (those leaked into legacy from a separate bot)
- NO multi-moons, NO twin-suns, NO floating-islands
- NO impossible-physics phrasing

━━━ OUTPUT ━━━

JSON array of ${n} strings, real Earth locations only, ONE subject per entry, 18-30 words each. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
