#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/goth_woman_accessories.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} UNIQUE DARK ACCESSORY descriptions for GothBot's goth-woman path — singular accessory that makes a goth-hellspawn woman instantly iconic. Horns, crown, chains, wings, veil, thorns, serpents, third-eye, antlers, halo.

Each entry: 8-16 words. One specific unique dark accessory.

━━━ CATEGORIES ━━━
- Horn accessories (curled obsidian horns, ram-spiral horns, demon-horns with chains)
- Crowns (thorned crown of iron, crown-of-roses-and-bones, skeletal crown)
- Chains (wrapped silver chains on arms, chain-draped necklace, shackle-chain accent)
- Wings (black raven wings furled, bat-membrane wings extended, fallen-angel tattered wings)
- Veils (black lace funeral veil, blood-red widow's veil, tattered mourning veil)
- Thorns (thorn-vine necklace piercing skin, thorn-crown, thorn-sash)
- Serpents (coiled-around-arm serpent, serpent-diadem, snake-necklace)
- Third-eye (glowing third-eye on forehead, carved-eye crystal pendant)
- Antlers (branching antlers on head, elk-crown, thorn-antlers)
- Tarnished halos (rusted-broken halo, black-fire halo, tilted halo)
- Ornate collars (pearl-and-bone choker, wrought-iron collar)
- Claw-gloves (extended claw-tipped gauntlets)
- Spider-motif (spider-silk shawl, spider-brooch, web-cape)
- Moon-motif (crescent-moon headpiece, moon-diadem)
- Raven-feather crown (black-feather headdress)
- Skeletal crown (bone-wrought tiara with jewels)
- Masquerade masks (half-mask filigree, opera-mask lace)
- Ghost-chains floating around (spectral chains floating in air)
- Obsidian horns with candle-flames embedded
- Ice-crystal crown (white-crystalline diadem)
- Living-vine crown (green vines wrapping forehead)
- Rose-garland crown (black-rose circlet)
- Bat-wing headpiece
- Demon-tail visible (gothic demon tail with arrow-tip)
- Glowing runes on skin (magical markings)
- Cascading-black-hair as focal feature
- Obsidian claws
- Blood-stained lace at wrists
- Witch-hat conical with veil
- Tattoo-sleeve dark-magic runes

━━━ RULES ━━━
- Single iconic accessory per entry
- Dark, gothic, darkly-beautiful
- Stackable onto the goth-woman render

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
