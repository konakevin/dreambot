#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/occult_tokyo_surprise_element.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} OCCULT-TOKYO SURPRISE-ELEMENT entries — small Tokyo-occult secondary subjects at midground/background.

Each 10-18 words. Element + placement + urban-Japan-supernatural implication.

VARIETY:
- 16% URBAN-NEON-DISTANT (Shibuya skyline in deep distance with cursed-neon-glow / Shinjuku billboards with sigil-distortion / Akihabara signs flickering)
- 14% SHIKIGAMI / SPIRIT-CREATURE (paper-shikigami crane fluttering at midground / yokai cat-spirit prowling shadow / small kitsune-fox-spirit at edge)
- 12% OFUDA-WALL / TALISMAN-CLUSTER (wall plastered with ofuda strips at midground / cluster of paper-charms hanging / clothesline of talismans)
- 10% URBAN-PROP (vending-machine glowing pink-cyan at midground / konbini-sign / pachinko-light spilling from doorway)
- 10% CURSED-SHADOW (humanoid-shadow on wall at midground / shadow-figure in alley deep / writhing dark-tendril at corner)
- 8% PAPER-LANTERN / CHOCHIN (paper-lantern glowing at midground / row of chochin strung overhead / standing-lantern at shrine-edge)
- 6% SHRINE-PROP (ema wooden-plaques hanging at midground / shimenawa-rope across torii / komainu lion-dog statue partial)
- 6% TOKYO-CITIZEN-PASSING (salaryman-silhouette in deep background / schoolgirl-walking past oblivious / cyclist-shadow crossing alley)
- 6% TECHNOLOGY-OCCULT (CCTV camera with sigil-glitch at midground / vending-machine with cursed-display / phone-on-table glowing)
- 6% SIGIL-GRAFFITI (kanji-sigil spray-painted on wall midground / chalk-rune on ground / glowing-tag on alley brick)
- 4% CELESTIAL-OCCULT (blood-moon visible in deep distance / cursed-cloud-formation / shooting-star streaking)
- 2% TEMPORAL-OCCULT (cursed-mist rising from drain at midground / ghost-flame floating mid-air / spirit-orb hovering at edge)

DO write:
- Shibuya skyline in deep distance with cursed-neon-glow pulsing softly, blurred sigil-distortion at horizon
- Paper-shikigami crane fluttering at midground, faint kanji visible on wing
- Wall plastered with ofuda paper-talisman strips at midground, layered and weather-worn
- Vending-machine glowing pink-cyan at midground in alley, drink-bottles with cursed-labels
- Humanoid-shadow on wall at midground stretched unnaturally tall, no body visible
- Row of paper-chochin lanterns strung overhead at midground glowing soft-amber

DO NOT: anything foreground competing with character / multiple per entry / explicit gore / western occult tropes.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
