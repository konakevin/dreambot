#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_characters.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} PIXEL CHARACTER descriptions for PixelBot's pixel-character-moment path — generic pixel archetypes in context. Candid, solo. No IP names.

Each entry: 10-20 words. One pixel archetype with quick detail.

━━━ CATEGORIES ━━━
- Hooded warrior with glowing sword
- Pixel sorceress with staff of light
- Pixel ronin with katana at dusk
- Pixel astronaut on distant planet
- Pixel druid with staff of oak
- Pixel mage-apprentice with spellbook
- Pixel knight in blue-plate
- Pixel explorer with backpack
- Pixel cyberpunk runner with tech-jacket
- Pixel archer drawing bow
- Pixel thief in shadow
- Pixel paladin with radiant armor
- Pixel necromancer in robe
- Pixel bard with lute
- Pixel dragon-rider
- Pixel samurai in lacquered armor
- Pixel witch with broomstick
- Pixel priest at shrine
- Pixel pirate captain
- Pixel wizard with starry-cloak
- Pixel elven ranger in leaf-cloak
- Pixel dwarven smith at forge
- Pixel halfling with pipe
- Pixel mermaid in water
- Pixel centaur archer
- Pixel vampire noble
- Pixel werewolf in forest
- Pixel demon-hunter
- Pixel ice-queen on throne
- Pixel bandit in wasteland
- Pixel mercenary with rifle
- Pixel monk meditating
- Pixel inventor at workbench
- Pixel alchemist at cauldron
- Pixel fisherwoman at dock
- Pixel farmer in field
- Pixel shepherd with flock
- Pixel librarian at shelf
- Pixel ghost-hunter with trap
- Pixel bounty-hunter in tavern
- Pixel rogue climbing rooftop
- Pixel warrior-queen with sword
- Pixel frost-wizard with ice-staff
- Pixel forest-spirit in glen
- Pixel harbinger with raven
- Pixel young-hero with stick-sword

━━━ RULES ━━━
- Generic archetypes only — no IP
- Pixel-art-ready description
- Solo, candid pose

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
