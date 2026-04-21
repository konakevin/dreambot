#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/titanbot/seeds/pantheons_and_regalia.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} PANTHEON + REGALIA detail descriptions for TitanBot — cultural anchors + signature regalia that identify a specific pantheon. Visual details that stack onto deities/scenes.

Each entry: 8-16 words. One specific cultural anchor or regalia item.

━━━ CATEGORIES ━━━
- Greek regalia (golden laurel crown, ivory-staff caduceus, bronze-greaves, peplos drape)
- Norse regalia (horned helm with feathers, shield-bound-with-runes, braided beard-clasps, fur-mantle)
- Egyptian regalia (nemes striped headdress, ankh, crook-and-flail, uraeus cobra crown)
- Hindu regalia (dhoti + gold ornaments, third-eye mark, lotus cushion, multiple weapons held in four arms)
- Buddhist regalia (saffron robes, lotus-seat, prayer-beads, alms-bowl)
- Japanese regalia (kimono silks, katana, shrine-bells, fox-masks, yumi bow)
- Chinese regalia (dragon-embroidered robes, jade ornaments, scroll-of-fate, peach-of-immortality)
- Aztec regalia (feathered headdress, obsidian weapons, jaguar-pelt, jade-jewelry)
- Celtic regalia (torc neck-ring, spiral tattoos, oaken staff, bronze-cauldron)
- African/Yoruba regalia (cowrie-beaded crown, double-axe oshe, mirror, calabash)
- Slavic regalia (kokoshnik crown, embroidered rushnyk, axe, honey-pot)
- Polynesian regalia (tapa cloth, lei of flowers, fish-hook staff, tattoo patterns)
- Mesopotamian regalia (horned crown, cedar-staff, winged-bull companions)
- Native American regalia (eagle-feather headdress, turquoise jewelry, drum, medicine-bag)
- Inuit regalia (fur parka with amulets, bone-harpoon, soapstone amulet)
- Aboriginal regalia (ochre-paint markings, didgeridoo, boomerang-ceremonial)
- Mayan regalia (quetzal-feathered headdress, jade mosaic mask)

━━━ RULES ━━━
- Specific cultural regalia / anchor item
- Visually renderable
- Single element per entry

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
