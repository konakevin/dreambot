#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/assassin_accessories_female.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (
    n
  ) => `Write ${n} VAMPIRE-ASSASSIN-FEMALE WEAPON & ACCESSORY descriptions for GothBot. Each entry is 16-26 words. The accessory is the SIGNATURE OBJECT visible at full-body wide-shot — what makes her readable as an assassin from across the frame.

CONTEXT: HOT, ornate, agile, mean, crafty assassins. Castlevania + Devil May Cry + Van Helsing weapon language. ARMED-BUT-NOT-FIRING — weapons are visible, holstered or drawn but not in active combat use. Ornate metalwork, silver detail, gothic-engraved.

⚡ CROSSBOW DISTRIBUTION MANDATE: Approximately 10 of the ${n} entries MUST feature a crossbow as the PRIMARY visible weapon. Vary the crossbow type across these 10 — small silver recurve, heavy hunter crossbow, wrist-mounted crossbow, Belmont-style crossbow, compact hand-crossbow, siege-style heavy crossbow with stirrup, scoped sniper crossbow, repeating crossbow, ornate gold-and-silver dueling crossbow, twin small wrist-crossbows. Each of those 10 entries describes a DIFFERENT crossbow flavor — never repeat the same crossbow type twice. The remaining ${Math.max(n - 10, 0)} entries cover OTHER weapons (pistols, swords, scythes, whips, daggers, etc.) varied widely.

Categories (rotate widely):
- Crossbow variants (10 entries — see distribution mandate above)
- Twin ornate flintlock pistols holstered at hips (silver-inlaid, engraved with crucifix-pattern)
- Silver-bladed scythe slung diagonally across her back (Castlevania-style ornate handle)
- Holy-water vials in chest-bandolier (visible glass vials with cork stoppers, glowing pale)
- Long silver dagger sheathed at thigh (ornate cross-pommel, crucifix-engraved blade)
- Crucifix-pommel longsword sheathed at her hip (silver basket-hilt, holy-rune-etched)
- Silver throwing-knives in chest-bandolier (visible row of pointed silver blades)
- Single rapier-style blade with silver basket-hilt at her hip (DMC-style)
- Pair of silver-edged kukri / curved fighter knives crossed at the lower back
- Ornate single pistol with engraved barrel held loose, second hand free
- Stake-holster bandolier across chest (visible row of pointed wooden stakes tipped silver)
- Whip coiled at hip (silver-tipped barbed leather, Castlevania-Belmont-style)
- Silver scope-monocle on a chain around the neck
- Garlic-strand woven into a leather chest-strap (visible bulbs)
- Holy-amulet large enough to read as visible in full-body shot
- Twin curved sabres crossed in an X across the back

EVERY entry must include:
- Specific weapon / object (no vague "weapon" — name it)
- Ornate detail (silver, engraved, holy-rune-etched, crucifix-pommel, gothic-pattern, cross-inlay)
- Position on body (at hip / at thigh / on back / chest-bandolier / over shoulder / coiled at waist)
- ONE flourish (visible glow / catching moonlight / holstered loose / partially drawn)

ABSOLUTELY BANNED:
- NO modern firearms (assault rifles, machine guns)
- NO sci-fi (laser, plasma, energy)
- NO bare swords without ornate detail
- NO weapon mid-strike (this is candid armed-but-not-firing)

Examples (write fresh):
- "Silver crossbow with engraved gothic-pattern stock held loose at her right side, garlic-tipped silver bolts in a leather quiver at her back"
- "Twin ornate flintlock pistols with silver-inlaid barrels and crucifix-engraved grips, holstered low at each hip, butts angled forward for cross-draw"
- "Long silver dagger with cross-pommel sheathed at her right thigh, ornate scabbard etched with holy runes, partially drawn an inch from the sheath"
- "Stake-holster bandolier crossed over her chest, six pointed silver-tipped wooden stakes visible in leather loops, ornate buckles at the shoulder"

Output ONLY a valid JSON array of ${n} strings (16-26 words each). No preamble, no commentary.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
