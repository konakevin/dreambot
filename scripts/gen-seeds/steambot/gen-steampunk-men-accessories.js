#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_men_accessories.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} STEAMPUNK MAN SIGNATURE-ACCESSORY descriptions for SteamBot's steampunk-man path. Each entry is ONE small object that anchors his identity — Victorian/steampunk-period.

Each entry: 8-18 words. ONE distinctive accessory.

━━━ ACCESSORY TYPES (mix broadly across all entries) ━━━
1. POCKET WATCH — gold pocket watch on long chain, opened mid-glance
2. MONOCLE — brass-rimmed monocle on a thin chain, in or near his eye
3. BRASS GOGGLES — brass aviation goggles pushed up on forehead or hung around neck
4. TOP HAT — silk stovepipe top hat, tipped to the side or held at chest
5. BOWLER HAT — black bowler hat held in hand or set beside him
6. SLOUCH HAT — leather slouch hat pulled low, brim casting shadow
7. BRASS CANE — brass-headed walking cane with concealed sword/weapon
8. MAGNIFYING LOUPE — pinched in his eye, scholar's tool
9. STEAM-REVOLVER — brass-barreled steam-revolver holstered at hip
10. STEAM-RIFLE — brass-barreled rifle slung across his back
11. BRASS COMPASS — antique brass compass open in his palm
12. SEXTANT — naval sextant in hand, navigation moment
13. PIPE — clay or briar pipe being lit with brass match
14. BRASS PROSTHETIC — bronze prosthetic hand/arm with visible gear-joints
15. LEATHER SATCHEL — well-worn leather satchel with brass buckles, tool-loaded
16. INVENTOR'S HEADBAND — leather strap with magnifier-loupe array, jeweler-style
17. POCKET-FLASK — engraved brass flask in his hand or hip pocket
18. BRASS KEY — large ornate ring of brass keys at his belt
19. SHEAFED CIGARETTE / CIGARILLO — held between fingers, smoke curling
20. RIDING CROP / SWAGGER STICK — held casually under his arm
21. BRASS STETHOSCOPE — for the chirurgeon, draped around neck
22. NAVIGATION TELESCOPE — brass collapsible spyglass at his belt
23. SIGNET RING / BRASS RING — chunky engraved ring on his hand

━━━ DETAIL EXPECTATIONS ━━━
- Material (brass, copper, gold, silver, leather, wood, jet, ebony, ivory)
- Wear (tarnished, oxidized green-patina, well-polished, leather-cracked, ornate-engraved)
- Position relative to his body (in his hand, holstered at hip, slung across back, draped around neck)

━━━ ABSOLUTELY BANNED ━━━
- NO modern objects (no smartphones, no plastic, no zippers)
- NO anime / manga accessories (no oversized impossible objects)

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Gold pocket watch on a long chain, hanging from his vest pocket"
- "Brass aviation goggles pushed up onto his forehead, lenses spotted with airship-grease"
- "Brass-headed walking cane in his off-hand, concealed sword inside the shaft"
- "Silver-engraved monocle on a thin black chain, pinched in his right eye"
- "Brass-barreled steam-revolver holstered at his hip, leather thong securing it"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
