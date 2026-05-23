#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/isekai_action_moment.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `Write ${n} ACTION-MOMENT entries for a MangaBot ANIME ISEKAI keyframe. Candid anime mid-action verb-phrase. Anime isekai canon.

Each entry: 8-18 words. ONE anime-isekai action with body-language detail.

VARIETY across these isekai actions:
- MAGIC CAST (mid-spell with hand-raised, mana-glow visible)
- SWORD MID-SLASH (anime blade-arc mid-strike against enemy)
- PARTY-WALKING (mid-stride traveling through fantasy world)
- TAVERN-SHARING (mid-laugh / mid-toast / mid-meal in cozy isekai)
- MONSTER-PETTING (interacting with slime / fairy / dragon-pet)
- LEVEL-UP MOMENT (status-window appearing, character pausing in awe)
- GUILD QUEST-PICK (looking at quest-board, deciding mission)
- POTION DRINKING (anime mid-drink of magic potion)
- SUMMON-CIRCLE (kneeling mid-summon, magic-circle glowing)
- PORTAL CROSSING (anime mid-step through dimensional gate)
- DRAGON-BACK FLIGHT (anime party riding dragon mid-flight)
- COOKING (Konosuba-Restaurant-style cooking magic dish)
- ARROW-DRAW (anime archer mid-draw with energy-arrow)
- SHIELD-BLOCK (warrior mid-block of incoming attack)
- BOOK-CASTING (mage mid-spell from open spellbook)
- DEMON-LORD SUMMON (anime villain mid-summon of dark magic)
- HAND-HOLDING (anime party-members supporting each other)
- DRAGON-SOULBOND (anime character mid-bond with dragon)
- TREASURE-DISCOVERY (anime mid-discovery of fantasy loot)
- BOSS FIGHT FINISH (anime hero mid-final-strike on boss)

DO write:
- Mid-magic-cast with hand raised, mana-glow streaming from palm, rune-circle visible
- Anime sword-girl mid-slash with blade-arc trail, motion-blur trailing the strike
- Anime adventurer party mid-stride walking through fantasy world, party-banter energy
- Mid-tavern-toast with anime party laughing, tankards raised, cozy isekai energy
- Anime hero mid-pet of smiling blue slime, gentle reaching gesture
- Level-up status-window appearing mid-air, character pausing in awe, glowing UI text
- Mid-quest-pick at adventurer's guild quest-board, hero pointing at a notice
- Anime mid-drink of glowing magic potion, character tilting bottle back
- Kneeling mid-summon with anime magic-circle glowing on ground, hands lowered
- Anime mid-step through dimensional gate, light-portal swirling open
- Anime party riding a flying dragon mid-flight, scarves flying behind
- Konosuba-style anime cooking with magic floating around the pot, party watching

DO NOT write:
- Posed model-stance (looking at camera)
- Western photoreal medieval actions
- Multiple actions per entry — ONE verb-phrase
- Generic "fighting" without specifying anime-isekai context

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
