#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/castlevania_contexts.json',
  total: 200,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} CASTLEVANIA-STYLE architecture + landscape settings for GothBot's castlevania-scene path. Each entry is a PURE ARCHITECTURE/ENVIRONMENT description — NO humans, NO figures, NO people. Entries 25-40 words. Castlevania / Van-Helsing / Bloodborne / Berserk gothic architecture + landscape DNA.

━━━ THREE NON-NEGOTIABLE RULES ━━━

**RULE 1 — PURE ARCHITECTURE / LANDSCAPE ONLY. ZERO CHARACTERS.**
Every entry is pure structures + landscape + props. Absolutely NO characters, NO figures, NO silhouettes of people, NO hooded wanderers, NO hunters, NO witches, NO priests, NO warlocks, NO monks, NO pilgrims, NO plague-doctors, NO cardinals, NO paladins, NO vampire-lords, NO mages, NO figures of any kind. DO NOT describe implied presence (e.g. "witch-trial field" / "warlock sanctum" / "monk's cloister" all imply people — write "abandoned gallows field" / "obsidian obelisk grounds" / "cloister arcade" instead). The scene is UNPOPULATED. Distant atmospheric creature accents OK as tiny detail — bat swarm, raven on gargoyle, cat silhouette, wolf-shadow, single owl — but NEVER the subject.

**RULE 2 — COMPOSITION: 3 SHOT-TYPES ONLY (rotate across the pool)**
Every entry fits one of three composition types:
A) **EPIC WIDE VISTA** (~50% of entries, min 100) — distant gothic castle/cathedral/citadel silhouetted against moonlit sky, viewed from a wide vantage point (ridge, valley-floor, cliff-edge). The full structure visible, dramatic silhouette against atmospheric sky. Trees / mist / terrain framing the shot.
B) **INSIDE GOTHIC CITY, CLOSE TO THE BIG BUILDING** (~30% of entries, min 60) — street-level or plaza-level inside a gothic cityscape, with a looming cathedral/castle/clock-tower towering above. You feel WITHIN the place — rain-slick cobblestones, gas-lamps, crooked shopfronts, clothesline alleys, but the massive gothic structure dominates the horizon.
C) **UP-CLOSE ON GOTHIC ARCHITECTURE FACADE/DETAIL** (~20% of entries, min 30) — mid-distance close-up on a single dramatic architectural element: rose-window, flying-buttress flank, gargoyle-crowded roofline, ornate carved doorway, wrought-iron gate, spire-base. The detail fills the frame.

NOT shot-types: NO empty interior prop-rooms. NO tiny-prop close-ups. NO flat-aerial-from-above. NO single-detail-on-stairway-going-down.

**RULE 3 — LIGHTING: WARM + COOL MIX ENCOURAGED, MONOCHROMATIC-COOL WITH WARM-ACCENT OK**
Prefer entries that specify both a COOL ambient (moonlit-silver / twilight-violet / midnight-blue / aurora-cyan) AND a WARM accent (amber-candle / orange-torch / forge-ember / alchemist-gold / pink-moon-glow). Monochromatic-cool scenes are fine IF they include a single warm accent (pink moon, amber window, torch-row). Pure one-color-only entries are BANNED. Accent-hue specialty light (witch-fire-green, violet-stained-glass, fel-green, crimson-stained-glass) welcome as secondary accent.

━━━ AESTHETIC NORTH STAR ━━━
Castlevania-game-art stages, Van-Helsing-movie locations, Bloodborne exteriors, Berserk gothic-landscapes, Dark-Souls / Elden-Ring dead courtyards, Crimson-Peak mansion grounds. Dramatic ornate gothic architecture + atmospheric landscape. Fog / mist / dust / ember-sparks.

━━━ SUBJECT VARIETY ACROSS 200 POOL ━━━

Primary subjects to rotate through (mix across epic-vista / in-city / close-up compositions):
- Gothic cathedrals (cliff-top, city-center, ruined, siege-scarred, multi-spired)
- Gothic castles / citadels / fortresses / keeps (various geographies)
- Clock-towers / bell-towers / watch-towers / observatories
- Gothic cityscapes / quarters / plazas / gaslight lanes (big building looms)
- Cathedral rose-windows (interior-facing close-up, stained-glass-lit)
- Flying-buttress walls / gargoyle-roofline / carved-doorway close-ups
- Cliff-top monasteries / mountain-pass abbeys / remote chapels
- Stone bridges + aqueducts crossing chasms (architecture-as-hero)
- Gothic flower gardens with castle/cathedral backdrop
- Necropoli / mausoleum-rows with distant skyline
- Coastal gothic lighthouses + fortified harbors
- Ruin-fields with distant surviving tower / spire
- Ice-castles / frozen-fortresses / glacial-cathedrals
- Haunted village clustered around gothic manor (city-close-up)
- Moat-bridges + gate-houses (wide-vista or close-up)
- Crypt entrances / carved gates / iron-gate facades (close-up detail)
- Volcanic / wasteland gothic ruin-fields
- Desert-mesa gothic monastery silhouettes

No interior empty-prop-rooms. No stairway close-ups. No character-implying settings.

━━━ NIGHTSHADE PALETTE ANCHOR ━━━
Deep purples, midnight blues, velvet blacks, charcoal, moonlit silver — PLUS warm amber-gold + cool violet-silver + green witch-fire accents MIXED. Red/crimson sparing only (single lantern, rose-petal). NO full-red monochrome.

━━━ HARD BANS ━━━
- NO humans / figures / people / silhouettes of characters
- NO character-implying roles as subject (witch, hunter, paladin, pilgrim, warlock, priest, monk, nun, duelist, cardinal, plague-doctor, vampire-lord, etc.)
- NO red-red-red monochrome
- NO single-color-dominant scenes (MUST have 2-3 distinct hues specified)
- NO stairways as the dominant subject
- NO "looking through archway at building" cliché
- NO pentagrams / satanic iconography
- NO named IP references

━━━ RULES ━━━
- Each entry 25-40 words
- Pure architecture + landscape — NO characters
- 2-3 distinct-temperature light sources specified per entry
- Specific architectural + atmospheric detail
- Every entry visibly distinct from others

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
