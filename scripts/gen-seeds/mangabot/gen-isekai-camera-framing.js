#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/isekai_camera_framing.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `Write ${n} CAMERA-FRAMING entries for a MangaBot ANIME ISEKAI keyframe. Painterly anime keyframe convention.

Each entry: 8-16 words. Names framing + anime style.

DISTRIBUTION:
- 15% PARTY-WIDE SHOT (adventurer party traveling, party-in-frame)
- 13% MEDIUM-SHOT HERO (single anime hero in fantasy setting)
- 11% LOW-ANGLE HEROIC (camera low looking up at hero, fantasy backdrop)
- 11% OVER-SHOULDER PARTY (camera behind party-member looking at fantasy view)
- 10% CLOSE-UP CHARACTER (anime character emotional close-up)
- 9% WIDE-VISTA FANTASY (anime party tiny against fantasy landscape)
- 8% DUTCH-ANGLE COMBAT (tilted frame for battle moment)
- 7% THROUGH-FOREGROUND (looking through foliage / fence / object)
- 5% HIGH-ANGLE GROUP (looking down on adventurer party)
- 5% MAGIC-CIRCLE-FRAMED (anime magic-circle wrapping the framing)
- 4% PROFILE SIDE-ON (figure crosses frame in profile)
- 2% COCKPIT-LIKE FROM-DRAGON (riding dragon mid-flight POV)

DO write:
- Anime party-wide shot, adventurer team traveling together through fantasy landscape
- Anime medium-shot of hero, character at three-quarter view in fantasy setting
- Anime low-angle heroic framing, camera below looking up at character against painterly sky
- Anime over-shoulder party composition, camera behind character looking at fantasy view
- Anime close-up character framing, emotional cel-shaded face-in-foreground
- Anime wide-vista fantasy composition, party tiny against painterly fantasy landscape
- Anime dutch-angle combat-tension framing, tilted for battle moment
- Anime through-foliage foreground framing, looking past plant cover at scene beyond
- Anime high-angle group composition, looking down on adventurer party in formation
- Anime magic-circle-framed composition with glowing rune-ring wrapping the shot

DO NOT write:
- Photoreal camera specs (f-stops)
- Multiple shots per entry
- Cyberpunk-coded framings

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
