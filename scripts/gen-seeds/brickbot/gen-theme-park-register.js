#!/usr/bin/env node
/**
 * BRICKBOT_THEME_PARK_REGISTER — theme-park heritage / LEGO theme lock.
 * Audit 2026-06-05: 46 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_theme_park_register.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} REGISTER entries for BrickBot's theme-park path — a register is a theme-park HERITAGE / LEGO-line / sub-genre. Each entry: ONE CAPS prefix + em-dash + 25-40 word body.

━━━ THE BAR ━━━
Every entry names a SPECIFIC theme-park signature (Creator-Expert Ornate-Fairground, LEGO-City Modern-Amusement, Friends-Amusement-Park, Carnival-Midway, etc.) and locks PALETTE + RIDE-AESTHETIC + CROWD STYLE + STRUCTURAL HINT.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 LEGO LINES: Creator-Expert Ornate-Fairground, LEGO-City Modern-Amusement, Friends-Amusement-Park, Master-Builder Display, Junior-Builder Family
- ~4 STATE-FAIR / COUNTY-FAIR: traveling fair, agricultural-fair midway, county-fair carnival
- ~4 VINTAGE / 1920s-COASTER: coney-island vintage, art-deco amusement
- ~4 STEAMPUNK MECHANICAL: brass-mechanical fair, clockwork carnival, gear-driven rides
- ~3 PRINCESS / FAIRY-TALE: princess-castle land, fairy-tale park, storybook adventure
- ~3 PIRATE-COVE: pirate-themed land, treasure-island park, buccaneer cove
- ~3 SPACE / SCI-FI: space-port amusement, future-city park, alien-world ride
- ~3 WILD-WEST: frontier-town land, gold-rush mining ride
- ~3 SPOOKY / HALLOWEEN: haunted-house, monster-mash, witch-coven park
- ~3 SAFARI / JUNGLE: safari-adventure, jungle-cruise land, lost-ruin park
- ~3 ICE-WORLD: snow-land, ice-castle, polar-bear ride
- ~2 BEACH / TROPICAL: tropical-paradise park, surf-resort fairground
- ~2 RACE-CAR / SPEED: race-track amusement, NASCAR-coded park
- ~2 CIRCUS-TENT: traveling circus, big-top ringmaster fair

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-6 hyphenated/spaced words), em-dash, 25-40 word body. Body must mention PALETTE + RIDE-AESTHETIC + CROWD STYLE. Touchpoints:
"CREATOR-EXPERT ORNATE-FAIRGROUND SIGNATURE — cream + teal + red + gold palette, scalloped canopies with gold filigree + barber-pole columns + finial-topped spires + motorized rides"
"LEGO-CITY MODERN-AMUSEMENT SIGNATURE — bright primary red + blue + yellow palette, sleek drop-tower + looping coaster + bold chunky signage, casual minifig crowds clutching cotton-candy"
"FRIENDS-AMUSEMENT PARK SIGNATURE — bright pastel pink + mint + lavender palette, heart-and-star-decorated Ferris wheel + swan-boat ride + photo-booth build, mini-doll crowds in sundresses"

━━━ BANS ━━━
- NO licensed franchise names verbatim (no Disneyland / Universal verbatim)
- NO duplicating registers
- NO photoreal vocab

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
