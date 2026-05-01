#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_killer_details.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} VAMPIRE KILLER-DETAIL descriptions for GothBot's vampire-girls-2 path. Each entry is ONE distinctive vampire-coded hero element ON or HELD BY her. Energy: D&D vampire character portrait, dark-fantasy paperback cover, Castlevania splash page (Ayami Kojima), dark-fantasy game character art. Each entry: 6-15 words, comma-separated noun phrase.

CALIBRATION: Across 11 hearted renders from this path, the killer-details that LANDED were ornate crowns / tiaras / feathered headpieces (5 of 11 hearts), ornate jewelry at the throat (universal), dramatic dark gowns with ornate trim. Bat-wing pauldrons did NOT land. Animal companions are forbidden. Crown-heavy distribution.

ABSOLUTE RULES:
- VAMPIRE-CODED. Crowns, tiaras, ornate vampire jewelry, glowing pendants, ornate chokers, dramatic feathered headpieces.
- ON or HELD BY her — at her hair, brow, neck, throat, chest, or hand. Not "in the background."
- NO LIVING CREATURES — no ravens, no wolfhounds, no bats, no creatures.
- NO BAT-WING PAULDRONS or HORNED DIADEMS — those didn't land. Drop them.
- A SINGLE elegant blood detail (one tear streak / one drop at the lip) is OK as flair, never gore.

━━━ DETAIL CATEGORIES (mandatory variety across ${n}) ━━━

ORNATE VAMPIRE CROWNS / TIARAS (8-9 entries — HIGHEST WEIGHT, this is the strongest hit-rate):
- ornate vampire-queen crown of dark gold and obsidian, gemstones gleaming, set high on her hair
- tarnished silver tiara with seven points crowning her brow, garnet inlay, ornate filigree
- ornate vampire diadem of jet and silver with a single ruby at the brow
- antique gold-and-pearl crown studded with emerald and amethyst, baroque scrollwork
- ornate vampire crown of dark feathers and silver filigree set into her dark hair
- crown of woven raven plumes and dark-gold filigree, dramatic and high
- ornate gold tiara with cascading pearl strands and ruby drops at the temples
- elaborate baroque crown of tarnished silver with cathedral-spire points and dark gemstones
- antique vampire-queen circlet of carved bone and dark-amethyst gems, vampire-priestess regalia

ORNATE THROAT JEWELRY (5-6 entries — universal in hearted set):
- ornate beaded choker with cameo brooch and crimson ribbon-tie at her throat
- antique gold-and-pearl collar with cascading rubies, ornate baroque
- heavy silver crucifix on a long chain at her chest, dramatic and ornate
- jet-beaded mourning collar with silver filigree and a single dark sapphire
- ornate gold cameo brooch on a black velvet ribbon choker
- elaborate gold-and-garnet ceremonial collar covering her throat from chin to clavicle

GLOWING PENDANTS / GEMS (3-4):
- a heavy ruby pendant the size of an eye at the hollow of her throat, glowing faintly
- a glowing amethyst amulet at her chest, faint inner light pulsing
- a single drop emerald on a fine chain, catching the moonlight
- a glowing-blue sapphire pendant on a gold chain, light flickering inside

HELD ATMOSPHERIC OBJECTS (3-4):
- a hand mirror reflecting only the candle, never her own face
- a glass perfume bottle uncorked, vapor curling upward into darkness
- a single black orchid held delicately between two fingers
- an antique silver chalice held at her chest, untouched

DRAMATIC HAIR ACCENTS (2-3):
- a single black raven feather pinned dramatically at her temple
- a strand of pearls woven through dark hair, the strand tipped with garnet
- a single dark-amethyst hairpin with cascading silver chains

━━━ RULES ━━━
- 6-15 words per entry
- ONE specific vampire-coded hero detail per entry
- ON or HELD BY her — never in the background
- NO living creatures
- NO bat-wing pauldrons, NO horned diadems (these didn't land)
- Crown-heavy distribution — these are the highest-hit-rate elements

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: detail category + dominant material + position on body. Two entries are too similar if they share more than one of these.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
