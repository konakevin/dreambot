#!/usr/bin/env node
/**
 * 2026-06-05 rewrite (Kevin call: no IP refs in StarBot pools).
 * Dropped the "Mandalorian beskar'gam / Master Chief MJOLNIR /
 * Warhammer 40K power armor" inspiration list + the "Space marine
 * plate" category — those were leaking franchise terms into entries.
 * Renamed category 6 to a generic war-armor archetype; replaced the
 * inspiration anchor with feature-only descriptions.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/sci_fi_male_outfits.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} descriptions of BADASS MALE SCI-FI OUTFITS for StarBot. Each is an ornate, heavy, "holy fuck" space suit, armor, or tactical rig. 20-35 words each.

━━━ WHAT THESE OUTFITS ARE ━━━
The most jaw-dropping sci-fi armor and gear ever designed for OUR universe. Heavy, ornate, imposing — built for war and survival in the most hostile environments in the galaxy. Every rivet, plate, and weapon mount is designed to make you say "holy shit that's cool." These outfits should make you want to BE this person.

CRITICAL — NEVER name any sci-fi franchise, species, trademark, or named character. Do not write "Mandalorian", "beskar", "MJOLNIR", "Spartan", "Master Chief", "Warhammer", "Space Marine", "ceramite", "bolter", "ODST", "Halo", "Mass Effect", "N7", "Star Wars", "Stormtrooper", "Boba Fett", "Destiny Guardian", or any franchise / trademark term. Describe FEATURES, not franchises. Generic equivalents only.

━━━ OUTFIT CATEGORIES (spread EVENLY) ━━━
1. Heavy power armor — full plated suit with ornate engravings, glowing power conduits, massive pauldrons
2. Tactical combat rig — modular armor plates over tactical undersuit, ammo loops, weapon mounts everywhere
3. Pilot exosuit — reinforced pressure suit with command insignia, HUD helmet, rank-marked pauldrons
4. Explorer heavy EVA — industrial-grade environmental suit with tool harness, reinforced joints, specimen containers
5. Bounty hunter loadout — layered mismatched armor with trophy attachments, custom weapon holsters, intimidation factor
6. Cathedral-grade war armor — full-coverage plate with devotional engravings, massive shoulder guards, built-in weaponry (describe the look, do NOT name the franchise)
7. Command battlesuit — officer's armor combining elegance with overwhelming firepower, ceremonial + functional
8. Engineer hardsuit — reinforced work armor with integrated tools, welding shield, hydraulic assist frame
9. Mercenary custom — personalized kit assembled over years, mix of high-end and field-repaired, tells a story
10. Scavenger rig — cobbled from salvaged suits and alien tech, asymmetric, ugly-beautiful, functional chaos

━━━ ORNAMENT LEVEL ━━━
These should look like legendary gear. Battle-worn but magnificent — dents and scratches that add character, custom paint jobs faded by vacuum exposure, kill-marks etched into armor plates, personal insignia, unit badges, religious/cultural markings. Each is ONE-OF-A-KIND gear with HISTORY.

━━━ DEDUP: MATERIAL + SILHOUETTE ━━━
No two outfits should share primary material + overall silhouette:
- MATERIALS: matte black armor-composite, polished chrome-steel, scorched durasteel, carbon-fiber weave, reactive nano-plate, scarred high-density alloy, brushed titanium, oxidized bronze alloy, alien bone-composite, mag-locked modular plate
- SILHOUETTES: full enclosed power armor, chest-heavy asymmetric, light legs + massive torso, balanced tactical, long armored coat over suit, exoskeleton frame, minimal armor + heavy weapons, layered segmented, bulky industrial, streamlined predator
- COLORS: matte olive, midnight black, desert sand, gunmetal, blood red, arctic grey, burnt umber, cobalt blue, charcoal, rust-orange — spread widely

━━━ RULES ━━━
- Describe the OUTFIT only — no body details (clashes with character pool)
- Focus on construction: plates, seams, power conduits, weapon mounts, ornamentation, wear patterns
- Badass through MASS and DETAIL, not through exposure
- Heavy, imposing, ornate — "fuck yeah" energy
- Functional — every element has a plausible purpose
- 20-35 words per entry
- NO franchise / trademark / species / character names anywhere

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
