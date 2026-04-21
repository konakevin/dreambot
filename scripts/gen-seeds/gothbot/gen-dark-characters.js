#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/dark_characters.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} DARK CHARACTER descriptions for GothBot's dark-scene path — gothic archetype characters by role only. Castlevania/Bloodborne/Crimson-Peak/Berserk energy.

Each entry: 10-20 words. One specific gothic archetype with distinguishing visual details.

━━━ CATEGORIES ━━━
- Knights (gothic knight in black obsidian plate with crimson trim, ruined paladin in tarnished armor)
- Cursed priests (priest in torn black cassock at altar, heretical cardinal with rosary chains)
- Hooded wanderers (cloaked wanderer with silver mask, traveling occultist with lantern)
- Gothic nobles (vampire-lord in Victorian cravat, cursed duchess in black lace gown)
- Warlocks (robed warlock with crystal staff, blood-magic scholar with tattoos)
- Blood-hunters (silver-cross hunter with crossbow, monster-slayer in Taisho-gothic coat)
- Reapers (robed reaper with silver scythe, death-priest in skeletal mask)
- Veiled brides (ghost-bride in torn wedding dress, cursed countess in widow's veil)
- Young vampire-noble (fanged noble with pearl-collar, crimson-lipped lord in frilled shirt)
- Crone-witches (hunched witch with raven on shoulder, hedge-sorceress with potion)
- Mourners (cloaked mourner at crypt, black-veiled widow with single rose)
- Castlevania-Belmont hunters (whip-wielding vampire hunter, young Van-Helsing archetype)
- Gothic paladins (white-lace holy knight with silver gauntlets)
- Cursed princes (exiled prince in shadow-armor, fallen royalty with haunted eyes)
- Scholars (candlelit scholar over grimoire, old librarian with spectacles)
- Witches (young black-lace witch with cat, tiara-wearing dark sorceress)
- Masked courtiers (masquerade-mask noble, carnival-carnage figure)
- Cursed knights (ghost-armor knight, skeletal paladin with flickering sword)
- Vampire countesses (crimson-gown vampire queen with jeweled crown)
- Necromancers (cloaked raiser-of-dead with staff, death-mage with skull)
- Monster hunters (leather-clad werewolf hunter with silver axe)
- Gothic assassins (dagger-drawn killer in Victorian coat)
- Plague-doctors (bird-mask plague-doctor with cane)
- Apothecary witches (poison-bottle witch in black-lace apron)
- Fallen angels (black-winged figure in white robe with tarnished halo)

━━━ RULES ━━━
- By ROLE only — no named IP (Dracula, Alucard, Belmont, Lady Dimitrescu, etc.)
- Darkly romantic OR classically gothic
- Include specific visual detail (clothing, accessory, weapon, pose)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
