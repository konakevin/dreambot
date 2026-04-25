#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/sci_fi_female_outfits.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} descriptions of ORNATE FEMALE SCI-FI OUTFITS for StarBot. Each is a form-fitting, sultry but functional space suit, armor, or tactical outfit. 20-35 words each.

━━━ WHAT THESE OUTFITS ARE ━━━
The most jaw-dropping sci-fi suits and armor ever designed. Ornate, detailed, form-fitting — they hug feminine curves while being FUNCTIONAL combat/exploration gear. Think: high-fashion space couture meets battle-tested engineering. Every seam, panel, and buckle is designed with both beauty and purpose. These outfits should make you stare at the craftsmanship.

━━━ OUTFIT CATEGORIES (spread EVENLY) ━━━
1. Tactical space suit — form-fitting bodysuit with ornate armor panels, mag-holsters, tool loops
2. Heavy combat armor — full plated suit with feminine silhouette, ornate engravings, glowing power lines
3. Pilot flight suit — sleek pressure suit with rank insignia, decorative piping, integrated HUD visor
4. Explorer EVA suit — reinforced environmental suit with specimen pouches, scanner mounts, decorative mission patches
5. Bounty hunter rig — mix of armored plates and flexible undersuit, trophy attachments, ornate weapon harness
6. Stealth operative — skin-tight adaptive camo suit with minimal but exquisite armor accents
7. Command uniform — elegant but armored officer's suit with ornate rank insignia and ceremonial elements
8. Mechanic/engineer — reinforced coveralls with form-fitting cut, tool harness, welding shield, rolled sleeves over armored underlayer
9. Ceremonial armor — ornate parade-quality suit with decorative filigree, ceremonial weapons, gleaming finish
10. Scavenger gear — cobbled together from multiple salvaged suits, mismatched but personalized with trophies and custom paint

━━━ ORNAMENT LEVEL ━━━
These should look like they cost a FORTUNE or were painstakingly customized over years. Intricate panel lines, custom paint jobs, etched insignia, glowing accent lines, ornate buckles, personalized modifications. Every piece tells a story. NOT generic space jumpsuits — these are MASTERWORK gear.

━━━ DEDUP: MATERIAL + SILHOUETTE ━━━
No two outfits should share primary material + overall silhouette:
- MATERIALS: matte carbon-fiber, polished chrome, brushed titanium, carbon-weave fabric, reactive smart-mesh, hardened ceramic plate, translucent nano-fiber, scarred durasteel, iridescent polymer, bioluminescent membrane
- SILHOUETTES: full body armor, crop-top + armored pants, asymmetric single-shoulder plate, flowing coat over bodysuit, minimal bodysuit with strategic armor, heavy torso armor + light legs, layered belts over suit, armored dress-cut, jumpsuit with rolled elements
- COLORS: matte black, arctic white, deep navy, burnt orange, forest green, gunmetal grey, crimson, cobalt blue, slate purple, sand tan — spread widely

━━━ RULES ━━━
- Describe the OUTFIT only — no body parts, no "bare shoulders" or "exposed midriff" (clashes with character pool)
- Focus on construction: materials, panels, seams, buckles, tech integration, ornamentation
- Sultry through SILHOUETTE and FIT, not through skin exposure
- Form-fitting and shapely — these suits hug curves, they don't hide them
- Functional — every ornate element has a plausible purpose (even if exotic)
- 20-35 words per entry
- No named IP gear

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
