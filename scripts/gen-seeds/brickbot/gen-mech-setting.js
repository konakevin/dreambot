#!/usr/bin/env node
/**
 * BRICKBOT_MECH_SETTING — environment around the mech (hangar / battlefield / city-ruin / etc).
 * Audit 2026-06-05: 41 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_mech_setting.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SETTING entries for BrickBot's mech path — each names the environment / location for a mech / titan / robot diorama. Each entry: ONE CAPS prefix + em-dash + 28-40 word body.

━━━ THE BAR ━━━
Every entry names a SPECIFIC setting (battle-damaged junkyard, maintenance hangar, war-torn cityscape, etc.) AND describes the brick build of the environment (stacked wreck-hulls, Technic-beam gantries, slope-brick facade rubble, etc.) plus how the mech sits within.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 MAINTENANCE / HANGAR: gantry, repair-bay, weapons-rack, loading-bay
- ~5 BATTLEFIELD: war-torn city, battlefield-trench, ravaged plains, contested zone
- ~4 INDUSTRIAL / SCRAP: junkyard, salvage-station, recycling-yard, forge-foundry
- ~4 URBAN / CITY: skyscraper canyons, megacity boulevard, downtown ruin, megastructure spire
- ~3 LABORATORY / R&D: research-lab, prototype-bay, test-arena, AI-training facility
- ~3 NATURAL HOSTILE: volcanic crater, frozen tundra, desert dune-sea, jungle ruin
- ~3 SPACE-PORT / LAUNCH: launch-pad, orbital-elevator, deep-space-dock
- ~3 UNDERWATER / DEEP-SEA: sub-station, trench-base, abyssal-mech-yard
- ~3 ANCIENT RUIN: forgotten temple, ziggurat-overgrown, monument-broken
- ~2 ARCTIC / POLAR: ice-shelf base, frozen-graveyard, glacier-station
- ~2 RACING / ARENA: stadium-mecha-fight, arena-gladiator-pit, race-track
- ~2 SKYSHIP / FLYING: aerial carrier deck, airship-hangar
- ~2 PRIVATE / DOMESTIC: pilot's-quarters with off-duty mech, garage-house

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated words), em-dash, 28-40 word body. Body must include brick build of setting + mech context. Touchpoints:
"BATTLE-DAMAGED JUNKYARD — a brick scrapyard of stacked wreck-hulls + salvaged slope-armour panels, a magnet-crane build overhead, oil-drum round-bricks scattered, the mech salvaging components"
"MAINTENANCE HANGAR — a vast Technic-beam gantry flanking the mech on both sides, catwalk-platforms crowded with wrench-wielding crew-minifigs, cable-bundles running across the floor"
"WAR-TORN CITYSCAPE — a brick city block reduced to slope-brick facade rubble, a crushed civilian stud-car flat beneath debris-tiles, smaller trooper-minifigs taking cover behind the mech's legs"

━━━ BANS ━━━
- NO photoreal vocab
- NO living-fluid verbs ("smoke billows")
- NO licensed franchise names
- NO duplicating settings

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
