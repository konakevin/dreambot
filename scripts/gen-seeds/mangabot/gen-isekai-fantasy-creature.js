#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/isekai_fantasy_creature.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} FANTASY-CREATURE entries for a MangaBot ANIME ISEKAI keyframe. Anime-coded fantasy creatures — Slime / Konosuba / Re:Zero / Frieren / Spice and Wolf canon. NOT Western D&D photoreal.

Each entry: 10-22 words. ONE anime-isekai creature with painterly anime detail.

ANIME-ISEKAI CREATURE VARIETY:
- SLIME CREATURE (smiling blue slime — Slime / Rimuru-style cute monster)
- CUTE DRAGON (anime small dragon companion — Spice and Wolf / Tate no Yuusha)
- FAIRY COMPANION (anime tiny winged fairy floating beside hero)
- BEAST-FOLK WARRIOR (anime cat-girl / wolf-folk / dragon-folk character)
- ANIME GOBLIN HORDE (Konosuba-style anime goblins, comedic-light)
- WOLF FAMILIAR (anime spirit-wolf companion — Spice and Wolf style)
- DRAGON-LORD (massive anime fantasy dragon coiled around tower)
- DEMON-LORD SHADOW (anime dark villain creature in fantasy armor)
- ANIME GOLEM (giant stone/wood golem with rune-glow)
- KAWAII MONSTER (Konosuba-style cute fantasy monster — flame-mage chuunibyou register)
- FORGE-SPIRIT (anime dwarven forge-elemental)
- HEALING-FAIRY (anime ethereal healer-fairy)
- ANIME UNICORN (anime fantasy unicorn with rainbow-mane)
- SLIME-MOM AND BABIES (anime slime family — Slime canon)
- FOREST-DEER SPIRIT (anime Mononoke-style ethereal forest deer)
- ANIME FROG-MAGE (Konosuba-comedic giant frog with mage-hat)
- DEMON-LOLI (anime small demon-girl — child-presenting demon canon)
- ANIME PHOENIX (anime fantasy phoenix with painterly flame-feathers)
- COZY-INN CAT (anime fantasy cat-spirit in cozy isekai)
- ELEMENTAL SPIRIT (anime water / fire / earth elemental being)

DO write:
- A smiling round blue slime creature beside the hero, anime cute-monster register
- An anime small dragon companion perched on the hero's shoulder, scales painted in cel-shaded saturation
- A tiny anime winged fairy floating beside the character, sparkle-trail behind her
- An anime cat-girl beast-folk warrior with tail and ears, traveling beside the party
- A comedic Konosuba-style anime goblin-horde scattering at the party's approach
- An anime spirit-wolf companion walking alongside the hero, Spice-and-Wolf register
- A massive anime fantasy dragon coiled around the magic tower in deep distance
- A giant anime stone-golem with glowing-rune cracks across its body, ancient ruins behind
- A Konosuba-style cute fantasy monster bouncing comically at the party's approach
- An anime ethereal healing-fairy hovering near the wounded ally, soft glow

DO NOT write:
- Western photoreal D&D monsters (gritty / desaturated)
- Multiple creatures per entry — ONE focal creature
- Generic "monster" without anime canon
- Gore / scary horror creatures (anime isekai is mostly comedic/whimsical/heroic)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
