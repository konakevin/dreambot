#!/usr/bin/env node
/**
 * BRICKBOT_FANTASY_SUBJECT_FOCUS — dominant subject of fantasy diorama
 * (structure / mount / no-vehicle landscape / no-vehicle interior).
 * Audit 2026-06-05: 99 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_fantasy_subject_focus.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SUBJECT-FOCUS entries for BrickBot's fantasy path — each names the dominant brick subject of the scene. Each entry: a (CATEGORY) prefix + body, 28-45 words.

━━━ THE BAR ━━━
Every entry leads with one of FOUR category tags and describes a brick-built dominant fantasy subject with structural detail.
CATEGORIES:
- (STRUCTURE) — castle, keep, tower, wizard-spire, dungeon, temple, gatehouse, drawbridge, siege-engine, fortress, monument
- (NO-VEHICLE LANDSCAPE) — enchanted forest, dragon-lair cliffs, battlefield, ruined keep, crypt-glade, swamp-bog, mountain-pass, dark-cavern
- (NO-VEHICLE INTERIOR) — throne-room, great-hall, library, alchemist-lab, dungeon-cell, tavern, smithy, scriptorium, war-room, crypt
- (MOUNT) — warhorse, dragon-mount, griffin-mount, unicorn, direwolf, gorgon-steed, sky-pegasus, war-elephant

━━━ VARIETY MANDATE (distribute roughly) ━━━
- ~7 STRUCTURE — castle / keep / tower / drawbridge / dungeon / temple / wizard-spire / siege-tower / mausoleum / oracle-tower / forge / amphitheater
- ~6 NO-VEHICLE LANDSCAPE — dragon-lair cliff / enchanted glade / battlefield / fog-marsh / ruined wall / dwarven mine entrance / haunted graveyard / volcanic ridge / fae-bower / iceberg fjord
- ~6 NO-VEHICLE INTERIOR — throne-room / great-hall / wizard-lab / scriptorium / armory / smithy / dungeon-cell / treasury vault / inn-tavern / crypt / library
- ~5 MOUNT — warhorse mid-charge, dragon take-off, griffin dive, direwolf prowl, unicorn rear, war-rhino, pegasus ride, manticore claw, giant-eagle perch

━━━ FORMAT ━━━
Each entry: (CATEGORY) prefix + 28-45 word brick description. Touchpoints:
"(STRUCTURE) a brick-built keep with crenellated battlements, three flanking tower-spires of conical-tile rooftops, a portcullis-gate, banner-poles + heraldic flags hanging from each tower, the central diorama anchor."
"(NO-VEHICLE LANDSCAPE) a brick dragon-lair cliff with stacked dark-grey slope-bricks rising in tiers, scattered treasure-tile gold, a perched dragon-skull frame, the immersive hero scene."
"(MOUNT) a brick-built warhorse mid-cavalry-charge with caparisoned trappings in heraldic blue, mounted knight minifig lance-couched, banner-bearer beside, the dominant centerpiece."

━━━ BANS ━━━
- NO photoreal language
- NO living-creature behavior verbs ("the dragon roars terrifyingly")
- NO licensed franchise names
- NO duplicating subjects already in pool

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with the (CATEGORY) prefix.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
