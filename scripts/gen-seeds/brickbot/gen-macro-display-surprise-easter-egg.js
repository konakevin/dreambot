#!/usr/bin/env node
/**
 * BRICKBOT_MACRO_DISPLAY_SURPRISE_EASTER_EGG — the small hidden detail
 * tucked into the complete-diorama for second-look delight. Audit 2026-06-05:
 * existing 20 entries — undersized. Target 200.
 *
 * Each entry describes a small / hidden / second-look detail the eye finds
 * AFTER taking in the whole build — never dominates, never eclipses the
 * centerpiece. Quiet wins (gag / vignette / tiny chase / hidden creature /
 * easter-egg reference).
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_macro_display_surprise_easter_egg.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} EASTER-EGG entries for BrickBot's macro-display path — the SMALL HIDDEN detail tucked into the complete-diorama brick build for second-look delight. Each entry is ONE 18-32 word sentence describing the tiny gag / vignette / chase / creature / pop-culture wink / domestic moment / drama tucked somewhere a casual viewer misses on first glance.

━━━ THE BAR ━━━
Every entry must describe a SMALL, HIDDEN, DOMINANT-ONLY-ON-SECOND-LOOK detail (a sleeping cat on a far rooftop / a tiny chase across the skyline / a hidden dragon in a cave / a UFO peeking from behind a cloud). NEVER the centerpiece. NEVER dominant. The CHARM is the gentle reward when the eye finds it.

━━━ VARIETY MANDATE (distribute roughly across these surprise categories) ━━━
- ~4 TINY DOMESTIC VIGNETTE — couple kissing on balcony / sleeping cat / window-watcher / two monks at chess / kids playing tag
- ~3 SLAPSTICK GAG — runaway barrel / minifig dangling from a weathervane / falling-suitcase moment / banana-peel slip / paint-bucket tipping
- ~3 HIDDEN CRYPTID / CREATURE — sea-monster tail surfacing / dragon in cave / UFO peeking / Yeti tracks / Loch-Ness in lake / ghost in cemetery
- ~3 TINY CHASE / DRAMA — thief leaping rooftops / guard chasing / pickpocket grabbing a purse / cat chasing a bird / dog chasing the mail-minifig
- ~2 HIDDEN ROMANCE — wedding on side-chapel step / proposal in garden / lovers on a balcony / picnic in a meadow / letter-passing through a window
- ~2 SECRET ECONOMY — gambling den behind a door / black-market deal in alley / smuggler's stash under a dock / counterfeit-press in basement
- ~2 ANIMAL MISCHIEF — small fox stealing a chicken / squirrel raiding a stall / racoon overturning a bin / pigeon on the statue's head
- ~2 HIDDEN MESSAGE / NOTE — chalked message on alley wall / printed-tile graffiti / scroll in a window / message in a bottle in a window
- ~1 SECRET ROOM REVEAL — hidden gear mechanism behind a wall / vault behind a bookshelf / trapdoor in a tavern floor
- ~1 POP-CULTURE WINK — DeLorean-shaped brick build half-hidden / TARDIS-blue phone-box in alley / generic-iconic prop (no licensed names)
- ~1 TINY-MUSIC MOMENT — band of three minifigs playing in shadowed alcove / lone violinist on rooftop / busker with hat tipping for coins
- ~1 ARTIST AT WORK — minifig painter on high scaffold with mural / sculptor with chisel / writer at café window with quill
- ~1 SLEEPING-GIANT / TROLL-IN-LANDSCAPE — sleeping giant half-buried as a hillside, brick face emerging from the turf
- ~1 INDUSTRIAL FAIL — broken pipe spurting / smoke-stack billowing in wrong direction / construction-crane tilting too far / dropped crate burst open

━━━ FORMAT ━━━
Each entry: ONE 18-32 word sentence starting with "A" / "An" / a quantifier. Touchpoint examples:
"A brick dragon peeking from a dark cave-mouth on the back hillside, easy to miss until a second look rewards the eye."
"A tiny minifig in comic peril clinging by one C-hand to a clock-tower ledge, a hat brick fluttering below."
"A sea-monster tail-coil breaking the trans-blue harbor surface behind the moored ships, a hidden hint of something vast below."
"A small fox-build slipping beneath a market stall with a stolen chicken-element, a vendor minifig oblivious just one tile away."

━━━ BANS ━━━
- NO photoreal language
- NO dominant features — every easter-egg is SMALL, HIDDEN, OFF-CENTER
- NO licensed-character names (Mickey / Yoda / Iron Man) — generic-iconic only (a TARDIS-blue phone-box, a DeLorean-shape, a generic spaceship)
- NO motion blur — everything is FROZEN brick moment
- NO real human descriptors — every figure is a minifig
- NO bland descriptors ("a hidden detail") — name the specific tiny brick element + where it's tucked

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
