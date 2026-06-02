#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/isekai_emotional_dna.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} EMOTIONAL-DNA entries for a MangaBot ANIME ISEKAI keyframe. Anime-isekai mood — adventure / cozy / dramatic / comedic. Frieren / Konosuba / Re:Zero / Slime mood library.

Each entry: 8-16 words. Names mood + physical cue.

ANIME ISEKAI MOOD VARIETY:
- Wide-eyed-wonder (newcomer-to-fantasy-world awe)
- Quiet-confidence (Frieren-style mage stillness)
- Party-banter cheerful (Konosuba comedic energy)
- Mid-adventure focused (party in mid-quest)
- Cozy-tavern warmth (Restaurant-of-Another-World energy)
- Magical-discovery awe (mid-spell-cast amazement)
- Determined-heroism (sword-girl mid-battle resolve)
- Demon-lord menace (Overlord dark-villain register)
- Pining-romance (anime fantasy romance tension)
- Slow-life contentment (Spice-and-Wolf travel-warmth)
- Triumphant-victory (anime party celebration)
- Companion-bond intimacy (anime hero with familiar)
- Quest-anticipation excitement (looking at quest-board)
- Frieren-stillness contemplation (slow-life ageless mage)
- Comedic-relief slapstick (Konosuba-fall comedy)
- Devotion-prayer (anime cleric quiet reverence)
- Soul-bonding emotional (anime dragon-bond moment)
- Lost-traveler confusion (modern-character in fantasy)
- Cozy-friendship laughter (anime party-meal warmth)
- Final-boss-fight intensity (anime climactic battle)

DO write:
- Wide-eyed-wonder, newcomer-to-fantasy-world awe, hands raised in amazement at the magical sky
- Quiet-confidence, Frieren-style mage stillness, weight settled with ancient calm
- Party-banter cheerful, Konosuba-style comedic energy with party-members laughing
- Mid-adventure focused, anime party in mid-quest with serious determined expressions
- Cozy-tavern warmth, Restaurant-of-Another-World energy with characters sharing meal
- Magical-discovery awe, mid-spell-cast amazement, eyes wide at the manifesting magic
- Determined-heroism, anime sword-girl mid-battle resolve, weight committed forward
- Demon-lord menace, Overlord-style dark-villain register, throne posture confident
- Pining-romance, anime fantasy romance tension, shy glances exchanged
- Slow-life contentment, Spice-and-Wolf travel-warmth, easy companion-bond visible

DO NOT write:
- Western photoreal gritty emotions
- Modern descriptors (anxious / depressed / triggered)
- Emotion without physical cue
- Eye-contact with viewer

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
