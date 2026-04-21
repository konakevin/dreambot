#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/dark_creatures.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} DARK CREATURE descriptions for GothBot's horror-creature path — dark-fantasy creatures as hero subject. Powerful, terrifying, BEAUTIFULLY rendered. GNARLY and dramatic — not cheap-horror.

Each entry: 15-30 words. One specific horror creature with distinguishing visual details.

━━━ CATEGORIES ━━━
- Werewolves (massive lycan mid-transformation, shadow-fur with silver backlight)
- Vampires (ancient vampire with translucent skin and red eyes, fang-extended roar)
- Demons (winged demon with obsidian horns, ember-eyes, skeletal wings)
- Wraiths (tattered robe-wraith with skeletal hands, floating through fog)
- Wendigos (antlered wendigo with emaciated body, hollow glowing-eye sockets)
- Liches (robed lich with skull-mask and blue-ember eyes, floating crown)
- Phantoms (translucent figure drifting through gothic hallway, moonlit)
- Ghouls (emaciated ghoul with bone-protruding body, graveyard setting)
- Banshees (wailing banshee with flowing-hair, ethereal figure in white)
- Gargoyles (stone gargoyle animating with ember-eyes, castle rooftop)
- Hellhounds (massive black hound with ember-eyes, smoke emanating)
- Succubi (winged succubus with pale skin and black lace, eerie beauty)
- Revenants (resurrected corpse-warrior in ancient armor, ghost-glow)
- Sirens (dark-fantasy siren with pale skin and scaled legs, drowning-song)
- Mindflayers (tentacle-mouth humanoid with robed body, psychic-horror)
- Vampire-bats-swarm-merging into humanoid form
- Nightgaunt (faceless winged creature in stygian black)
- Shadow-demons (smoke-form demon with glowing red eyes)
- Dragons gothic-variant (skeletal dragon with tattered wings, cursed)
- Undead-royalty (crowned skeletal monarch on throne)
- Witches transformed (crone with black-cat familiar, moss-covered)
- Lamia (snake-lower-body gothic-woman with serpent-tail)
- Chimera gothic (multi-headed dark chimera with horror-edge)
- Manticore (lion-body with bat-wings and scorpion-tail, gothic rendering)
- Basilisk (serpent-king with gold crown and petrifying gaze)
- Kraken (giant tentacled sea-beast emerging from gothic harbor)
- Wild-hunt leader (cloaked figure on skeletal horse leading spirits)
- Headless horseman (classic flaming-pumpkin skull-less rider)
- Skeletal minstrel-band (skeleton-musicians playing gothic instruments)
- Gothic-angel-fallen (ragged black-winged figure with broken halo)

━━━ RULES ━━━
- Dark-fantasy creatures as HERO — gnarly, dramatic, beautifully rendered
- Never cheap-horror, never bloody-slasher
- Castlevania / Bloodborne / Berserk visual DNA
- Include specific iconic detail

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
