#!/usr/bin/env node
/**
 * Sci-fi lineage entries for StarBot female-explorer and male-explorer.
 *
 * 2026-06-05 rewrite (Kevin call): describe alien anatomy freely —
 * head-tendrils / pointed ears / forehead ridges / montrals / etc. are
 * all fine. Just NEVER name the franchise (no "Twi'lek", "Vulcan",
 * "Mandalorian", "Spartan", "Togruta", "Asari", "stillsuit", "beskar",
 * "edgerunner", "netrunner", "ceramite", "bolter", "Tuchanka", etc.).
 *
 * The old prompt named the franchises as inspiration AND gave 1:1
 * mapping examples — Sonnet learned the mapping and named the species
 * downstream. New prompt drops the inspiration list + mapping pairs;
 * the toolbox + the no-naming rule do the work.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/sci_fi_race.json',
  total: 50,
  batch: 10,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} HUMANOID SCI-FI LINEAGE entries for StarBot's female-explorer and male-explorer paths. Each entry: a SHORT phrase (15-25 words) describing the EXACT visual signature of a HUMAN-SHAPED sci-fi lineage. Gender-neutral.

━━━ CORE RULE: NO FRANCHISE NAMES ━━━

Describe alien anatomy and human cultures freely — but DO NOT name any sci-fi / fantasy franchise, species, race, faction, character, or trademark term. The output should read like our OWN universe, not a Star Wars / Star Trek / Mass Effect / Halo / Cyberpunk / Warhammer / Dune / Witcher / Avatar / Elder Scrolls / Mandalorian / WoW lookup.

Specifically NEVER write any of: Twi'lek, Vulcan, Klingon, Na'vi, Mandalorian, Spartan, Asari, Togruta, Andorian, Trill, Mirialan, Drow, Witcher, Dunmer, Fremen, Space Marine, Edgerunner, Netrunner, Sin'dorei, Romulan, Cardassian, Bajoran, Ferengi, Tholian, Borg, Krogan, Turian, Quarian, Drell, Aeldari, N7, Reaper, Beskar, Stillsuit, Ceramite, Bolter, MJOLNIR, ODST, Lekku, Montrals, Tuchanka, Tatooine, Stormtrooper, Jedi, Sith, Boba Fett, Han Solo, Cad Bane.

Describe the FEATURES, not the franchise. "Head-tendrils replacing hair" is FINE; "Twi'lek" is NOT. "Pointed ears with green skin" is FINE; "Vulcan" is NOT. "Forehead-ridges and dark mane" is FINE; "Klingon" is NOT.

━━━ FEATURE TOOLBOX (mix freely — alien or human) ━━━

ALIEN ANATOMY (any combination welcome):
- skin: blue, green, purple, ash-grey, mahogany, copper, slate, ivory, ochre, iridescent, faintly bioluminescent
- head: head-tendrils, head-tentacles, head-crests, forehead-ridges, bone-plating, antennae, cranial-grooves, brow-ridges, scalp-tessellation, montral-like striped projections
- ears: pointed, elongated, flanged, finned
- eyes: amber, double-pupil, all-iris-no-white, vertical-slit, ringed, glowing-luminous, color-shifting
- markings: ritual scarification, tribal tattoos, geometric patterns, freckled photonics, subdermal tracery
- build: lithe, dense, broad-shouldered, long-limbed, gracile

CULTURAL / SPACER HUMAN VARIANTS (also valid — describe by real-world ethnic anchors and spacer cultures):
- frontier colonist, ship-born spacer, low-grav-evolved, high-grav-evolved, desert-clan nomad, arctic-clan, steppe rider, umber-skinned warrior, Mediterranean noble, Northern fair-skinned, etc.

AUGMENTED HUMAN (also valid — generic chrome/cyber language, NOT trademark terms):
- neural-port at temple, chrome prosthetic limbs, subdermal LED-tracery, smartlink at temple, cosmetic gene-mods, mantis-blades sheathed at forearms

ARTIFICIAL / SYNTHETIC (also valid):
- humanoid android indistinguishable from human, eerily still poise
- synthetic with brand-plate at temple and faint cool inner glow

━━━ RULES ━━━
- 15-25 words per entry
- Gender-neutral phrasing
- HUMAN-SHAPED required (no scaled reptilians, no beast-headed, no fully non-humanoid)
- NO horns, NO antlers, NO tusks, NO fangs, NO demonic imagery (those read fantasy, not sci-fi)
- NO franchise names anywhere
- Each entry visually distinct
- No personality or backstory — JUST visual signature

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. NO franchise names anywhere.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
