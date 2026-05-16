#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/assassin_accessories_male.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} VAMPIRE-ASSASSIN-MALE WEAPON & ACCESSORY descriptions for GothBot. Each entry is 16-26 words. The accessory is the SIGNATURE OBJECT visible at full-body wide-shot — what makes him readable as an assassin from across the frame.

CONTEXT: HOT, ornate, agile, mean, crafty male assassins. Castlevania-Belmont + Devil May Cry-Dante + Van Helsing weapon language. ARMED-BUT-NOT-FIRING — weapons are visible, holstered or drawn but not in active combat use. Ornate metalwork, silver detail, gothic-engraved.

⚡ CROSSBOW DISTRIBUTION MANDATE: Approximately 10 of the ${n} entries MUST feature a crossbow as the PRIMARY visible weapon. Vary the crossbow type across these 10 — Van-Helsing heavy hunter crossbow, small silver recurve, wrist-mounted crossbow, compact hand-crossbow, siege-style heavy crossbow with stirrup, scoped sniper crossbow, repeating crossbow, ornate gold-and-silver dueling crossbow, crossbow-pistol hybrid, twin small wrist-crossbows. Each of those 10 entries describes a DIFFERENT crossbow flavor — never repeat the same crossbow type twice.

⚡ WHIP DISTRIBUTION MANDATE: Approximately 20 of the ${n} entries (~10%) MUST feature a whip as the PRIMARY visible weapon. The whip is the CLASSIC iconic Castlevania-Belmont vampire-hunter signature — Vampire Killer / Belmont chain-whip / Morning-Star / leather bullwhip / silver-tipped lash etc. Vary the whip type across these 20: Castlevania Vampire Killer chain-whip with cross-pommel, silver-tipped leather bullwhip, three-section chain-flail, holy-rune-etched leather whip with crucifix-grip, steel-link chain-whip, bone-spike-tipped whip, gothic cat-o-nine-tails with silver tips, Morning-Star spiked-ball whip, twin short whips (one each hand), Belmont-coded chain-flail with sanctified-iron links, crucifix-handle bullwhip, black-leather snake-whip with holy-water-soaked lash, long-tail bullwhip coiled at hip, demon-bone vertebra whip, iron-stud leather whip, dragon-leather whip with silver-inlay handle, gothic-knot-tail whip with onyx-bead lash-tips, engraved-handle steel coil-whip, holy-amulet-handled bullwhip, long signature Belmont Vampire-Killer chain-whip with cross-and-rune engraving along every link. Each of those 20 entries describes a DIFFERENT whip flavor. Render the whip as visible and prominent — coiled at hip / draped over shoulder / partially-uncoiled-and-trailing / wrapped around forearm / held loose-coiled-in-hand. Belmont signature.

The remaining ${Math.max(n - 30, 0)} entries cover OTHER weapons (pistols, swords, axes, daggers, scythes, twin-blades, throwing-knives, stakes, etc.) varied widely.

Categories (rotate widely):
- Crossbow variants (10 entries — see distribution mandate above)
- Twin ornate flintlock pistols holstered low at hips (silver-inlaid, engraved with crucifix-pattern)
- Silver-bladed greatsword slung diagonally across his back (Castlevania-style ornate handle)
- Holy-water vials in chest-bandolier (visible glass vials with cork stoppers, glowing pale)
- Long silver dagger at his hip (ornate cross-pommel, crucifix-engraved blade)
- Crucifix-pommel longsword sheathed at his hip (silver basket-hilt, holy-rune-etched)
- Silver throwing-knives in chest-bandolier (visible row of pointed silver blades)
- Single rapier-style blade with silver basket-hilt (DMC-style)
- Pair of silver-edged kukri / curved fighter knives crossed at the lower back
- Ornate single pistol with engraved barrel held loose, second hand free
- Stake-holster bandolier across chest (visible row of pointed wooden stakes tipped silver)
- Silver-tipped barbed-leather whip coiled at hip (Belmont-style)
- Silver scope-monocle on a chain around the neck
- Garlic-strand woven into a leather chest-strap (visible bulbs)
- Holy-amulet large enough to read as visible in full-body shot
- Twin curved sabres crossed in an X across the back
- A pair of silver-edged hand-axes holstered at the hips
- Cane-sword (silver-tipped walking cane that conceals a thin blade)

EVERY entry must include:
- Specific weapon / object (no vague "weapon" — name it)
- Ornate detail (silver, engraved, holy-rune-etched, crucifix-pommel, gothic-pattern, cross-inlay)
- Position on body (at hip / on back / chest-bandolier / over shoulder / coiled at waist / in hand)
- ONE flourish (visible glow / catching moonlight / holstered loose / partially drawn / leaning casually)

ABSOLUTELY BANNED:
- NO modern firearms (assault rifles, machine guns)
- NO sci-fi (laser, plasma, energy)
- NO bare swords without ornate detail
- NO weapon mid-strike (this is candid armed-but-not-firing)

Examples (write fresh):
- "Silver crossbow with engraved gothic-pattern stock held loose at his right side, garlic-tipped silver bolts in a leather quiver at his back"
- "Twin ornate flintlock pistols with silver-inlaid barrels and crucifix-engraved grips, holstered low at each hip, butts angled forward for cross-draw"
- "Silver-bladed greatsword with crucifix-pommel slung diagonally across his back, ornate scabbard etched with holy runes, hilt visible over the right shoulder"
- "Stake-holster bandolier crossed over his chest, eight pointed silver-tipped wooden stakes visible in leather loops, ornate buckles at the shoulder"

Output ONLY a valid JSON array of ${n} strings (16-26 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
