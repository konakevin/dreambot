#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/male_outfits.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} OUTFIT entries for DragonBot's male-warrior path. Each entry is a DENSE phrase (20-35 words) describing his full warrior DRESS in obsessive material detail.

━━━ HARD ANTI-BIAS RULE ━━━
The existing pool was 64% fur-coded (bear-pelt, fur-lined, fur-mantle, fur-trim). NEW entries MUST avoid fur unless an archetype legitimately demands it. **MAX 10% of new entries may include fur.** The other 90% lean into ALL the other materials and silhouettes below. Variety is the goal — the renders should NOT all look like burly fur-shouldered berserkers.

━━━ DIVERSE ARCHETYPE-MATCHED OUTFITS (enforce broad variety) ━━━

CLASSIC WARRIOR FAMILY (~25%):
- HEAVY KNIGHT / FULL PLATE — etched steel plate, tabard with house-sigil, mailed gorget, articulated gauntlets, plated greaves, helm under arm, no fur
- LIGHT RANGER / SCOUT — studded leather jerkin, hooded ranger-cloak forest-green, leather bracers, quiver across back, soft boots laced to knee, no fur
- DRAGON-RIDER / SKY — fitted scale-mail flight-harness with saddle-strap rigging, riding goggles, leather flight-coat with high collar (cloth, not fur), reinforced gauntlets
- NOBLE COMMANDER — gold-trimmed scale armor over crimson velvet doublet, ceremonial pauldron, embroidered cloak (silk or wool, not fur), polished riding-boots

MAGE / SCHOLAR FAMILY (~20%):
- ARCHMAGE / WIZARD — long flowing midnight-blue robe embroidered with silver constellations, wide silk sash at the waist, pointed leather boots, spell-pouch at the hip, staff of carved oak
- BATTLE-MAGE — armored half-robes of layered silk over a chain shirt, pauldron of runed steel on one shoulder only, leather bracers, gemmed staff strapped to back
- SCHOLAR / SAGE — long woolen robe with rolled-back sleeves, embroidered hem of script-runes, leather satchel of scrolls slung across the chest, ink-stained fingers, sandaled feet
- SORCERER — dark velvet tunic with gold-thread sigil-stitching, leather harness with pouches of crystals, knee-high leather boots, deep-hooded cloak

MONASTIC / ASCETIC FAMILY (~15%):
- BATTLE-MONK / WARRIOR-MONK — wrapped saffron robes layered over cloth gi, leather knuckle-wraps, calloused feet bare, prayer-beads draped, simple linen sash
- MARTIAL ASCETIC — undyed linen training-tunic and trousers, cloth-wrapped forearms, leather sandals, simple staff of polished wood, shaved or close-cropped head
- TEMPLE GUARDIAN — lacquered bamboo-and-silk armor, lacquered shin-guards, kabuto helm tucked under arm, woven straw sandals, naginata-style polearm

DRUID / NATURE FAMILY (~10%):
- DRUID OF THE GROVE — woven living-leaf mantle over bark-strip tunic, vine-belt at waist, antler-staff in hand, bare feet, ivy-wrapped wristlets
- ELEMENTAL CHANNELER — robes patterned with elemental glyphs, runed leather harness, staff of crystal, no fur — only nature-woven materials

PALADIN / RELIGIOUS-ORDER FAMILY (~10%):
- PALADIN OF THE LIGHT — silver-gilt plate inscribed with prayers, white tabard with sun-sigil, ornate gauntlets, ceremonial sword at hip, no fur — pure ceremonial cloth
- TEMPLAR — chainmail hauberk with surcoat of order-crest, sword-belt with relic-pouch, helm with face-plate, woven cloak

ASSASSIN / SHADOW FAMILY (~5%):
- SHADOWBLADE — close-fitted black silk and leather, hooded mask, twin daggers crosswise on the back, supple climbing-boots, throwing-knife bandolier, no fur
- NIGHT-WALKER — dark leather harness over dyed-black undertunic, soft-soled boots, gauntlets with hidden blades, deep cowl

BARD / SWASHBUCKLER FAMILY (~5%):
- TRAVELING BARD — embroidered doublet over linen shirt, silk sash, knee-high boots, lute slung across back, dueling-rapier at hip
- DUELIST — dashing slashed-sleeve tunic with ruffled shirt-edge, sword-belt with ornate rapier, supple riding-trousers, plumed cap, no fur

PEASANT / FOLK-WARRIOR FAMILY (~5%):
- VILLAGE DEFENDER — patched homespun shirt, leather apron-armor, axe-belt, work-boots, woolen scarf, simple practical garb of someone who took up arms reluctantly

WILD / BARBARIAN FAMILY (~5% — the only place fur belongs):
- BARBARIAN / NORTH — bear-pelt mantle, leather-strapped torso, fur-lined boots — used SPARINGLY, this is the exception not the rule

━━━ RULES ━━━
- Each entry OBSESSIVELY DETAILED — every layer, clasp, material
- Materials beyond fur — silk, velvet, wool, linen, lacquered bamboo, woven leaf, embroidered silk, dragon-scale, runed steel, brass, leather, mail, lacquerware, chainmail, gold-thread, gem-inlay, crystal, polished wood
- Visible at waist-up to thigh-up framing
- Practical for combat OR signature for the archetype
- "Sexy" via capability and craftsmanship, not exposed skin
- No modern items (no jeans, no zippers — buckles/laces/cloth-ties only)
- Specific to MALE warriors
- DEDUP: vary archetype each entry — never two consecutive entries from the same family

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
