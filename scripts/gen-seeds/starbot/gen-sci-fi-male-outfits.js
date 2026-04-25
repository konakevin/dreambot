#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/sci_fi_male_outfits.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} descriptions of BADASS MALE SCI-FI OUTFITS for StarBot. Each is an ornate, heavy, "holy fuck" space suit, armor, or tactical rig. 20-35 words each.

━━━ WHAT THESE OUTFITS ARE ━━━
The most jaw-dropping sci-fi armor and gear ever designed. Heavy, ornate, imposing — built for war and survival in the most hostile environments in the galaxy. Think: Mandalorian beskar'gam, Master Chief MJOLNIR, Warhammer 40K power armor, but ORIGINAL. Every rivet, plate, and weapon mount is designed to make you say "holy shit that's cool." These outfits should make you want to BE this person.

━━━ OUTFIT CATEGORIES (spread EVENLY) ━━━
1. Heavy power armor — full plated suit with ornate engravings, glowing power conduits, massive pauldrons
2. Tactical combat rig — modular armor plates over tactical undersuit, ammo loops, weapon mounts everywhere
3. Pilot exosuit — reinforced pressure suit with command insignia, HUD helmet, rank-marked pauldrons
4. Explorer heavy EVA — industrial-grade environmental suit with tool harness, reinforced joints, specimen containers
5. Bounty hunter loadout — layered mismatched armor with trophy attachments, custom weapon holsters, intimidation factor
6. Space marine plate — cathedral-grade war armor with devotional engravings, massive shoulder guards, built-in weaponry
7. Command battlesuit — officer's armor combining elegance with overwhelming firepower, ceremonial + functional
8. Engineer hardsuit — reinforced work armor with integrated tools, welding shield, hydraulic assist frame
9. Mercenary custom — personalized kit assembled over years, mix of high-end and field-repaired, tells a story
10. Scavenger rig — cobbled from salvaged suits and alien tech, asymmetric, ugly-beautiful, functional chaos

━━━ ORNAMENT LEVEL ━━━
These should look like legendary gear. Battle-worn but magnificent — dents and scratches that add character, custom paint jobs faded by vacuum exposure, kill-marks etched into armor plates, personal insignia, unit badges, religious/cultural markings. NOT generic space marine armor — each is ONE-OF-A-KIND gear with HISTORY.

━━━ DEDUP: MATERIAL + SILHOUETTE ━━━
No two outfits should share primary material + overall silhouette:
- MATERIALS: matte black ceramite, polished chrome-steel, scorched durasteel, carbon-fiber weave, reactive nano-plate, scarred adamantium, brushed titanium, oxidized bronze alloy, alien bone-composite, mag-locked modular plate
- SILHOUETTES: full enclosed power armor, chest-heavy asymmetric, light legs + massive torso, balanced tactical, long armored coat over suit, exoskeleton frame, minimal armor + heavy weapons, layered segmented, bulky industrial, streamlined predator
- COLORS: matte olive, midnight black, desert sand, gunmetal, blood red, arctic grey, burnt umber, cobalt blue, charcoal, rust-orange — spread widely

━━━ RULES ━━━
- Describe the OUTFIT only — no body details (clashes with character pool)
- Focus on construction: plates, seams, power conduits, weapon mounts, ornamentation, wear patterns
- Badass through MASS and DETAIL, not through exposure
- Heavy, imposing, ornate — "fuck yeah" energy
- Functional — every element has a plausible purpose
- 20-35 words per entry
- No named IP gear

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
