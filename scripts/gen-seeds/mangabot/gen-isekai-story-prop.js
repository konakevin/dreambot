#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/isekai_story_prop.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} STORY-PROP entries for a MangaBot ANIME ISEKAI keyframe. Foreground narrative-implying anime-isekai-coded prop. Sword Art Online / Konosuba / Frieren / Slime canon.

Each entry: 12-22 words. ONE anime-isekai prop with painterly detail.

ANIME ISEKAI PROP CATEGORIES:
- ADVENTURER GEAR (anime fantasy sword / shield / staff / wand / spell-book)
- RPG ITEM (anime glowing potion-bottle / scroll / map / quest-paper)
- LOOT-DROP (anime treasure-chest open with coins / gems / scrolls)
- SUMMON-CIRCLE (anime pentagram glowing on cobblestone)
- QUEST-NOTICE (anime guild-board notice with kanji text)
- COMPANION-ITEM (anime familiar's bowl / slime-jar / pet collar)
- MAGIC-INGREDIENT (anime alchemy ingredients on table — herbs / dragon-scales)
- ANCIENT-ARTIFACT (anime glowing ancient artifact)
- TAVERN-MEAL (anime fantasy steaming-plate of food)
- PARTY-CAMPFIRE (anime party-camping campfire with pot)
- BROKEN-ENEMY-WEAPON (anime defeated monster's weapon on ground)
- LEVEL-UP STATUS BOX (anime floating SAO-style game-window)
- KEY ITEM (anime quest-key with glowing rune)
- TRAVELLING-BAG (anime party-pack with map sticking out)
- FANTASY-CURRENCY (anime gold-coin pile)
- ENCHANTED-SCROLL (anime glowing spellscroll mid-unroll)
- HEALING-POTION (anime red potion-vial glowing in hand)
- DRAGON-EGG (anime ornate fantasy dragon-egg in nest)
- WRITTEN-CONTRACT (anime fantasy quest-contract with kanji text)
- LOST-MAP (anime treasure-map laid out on table)

DO write:
- Anime fantasy sword stuck in the ground at the hero's feet, painterly cel-shaded
- Anime glowing red potion-bottle in the hero's hand, magical-vapor rising
- Anime treasure-chest open in foreground with gold-coins and glowing-gem spilling out
- Anime pentagram summon-circle glowing on cobblestone, arcane symbols visible
- Anime guild-board notice with kanji quest-text, pinned with daggers
- Anime familiar's pet-collar abandoned on a rock, suggesting recent adventure
- Anime alchemy ingredients spread on table — dragon-scales, herbs, crystals
- Anime glowing ancient artifact floating mid-air, rune-glow around it
- Anime tavern steaming-plate of fantasy meal, painterly food rendering
- Anime party-campfire with pot bubbling, cooking utensils scattered around

DO NOT write:
- Western photoreal medieval objects
- Multiple props per entry
- Modern earth-civilian objects
- Gritty desaturated register

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
