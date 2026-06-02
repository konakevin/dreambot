#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_painterly_surprise_element.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SURPRISE ELEMENT entries for a MangaBot ghibli-painterly keyframe. This is a small subtle moment that adds whimsy or wonder — kodama / soot-sprite / dragonfly / fox-spirit / butterflies / passing-bird etc. Always SMALL and integrated, never the focus.

Each entry: 10-18 words. ONE specific small whimsical element.

VARIETY (25 bespoke entries):
- 20% KODAMA / SPIRIT-CREATURES tiny in the foliage or doorways
- 15% PASSING BIRDS (heron / crane / swallow) gliding past
- 15% DRAGONFLY / BUTTERFLY hovering near foreground
- 10% FOX-SPIRIT silhouette briefly visible at temple edge
- 10% SOOT-SPRITES drifting near a doorway / lantern
- 10% CAT-BUS / TOTORO-CODED creature half-glimpsed
- 10% FLOATING JELLYFISH-SPIRITS drifting through air
- 5% SHOOTING STAR streaking across the sky
- 5% RAINBOW arching over the architecture

DO write:
- Three white-painted kodama spirits cluster in the foliage at the edge of the doorway, heads tilted
- A heron glides past the floating fortress, silhouetted against the cloud-sea
- A dragonfly hovers near the foreground ferns, iridescent wings catching the light
- Brief fox-spirit silhouette at the temple edge, then gone — only the white-fur trace remains
- A cluster of soot-sprites drifts near the foot of the great lantern, pinprick eyes glowing
- Half-glimpsed shape of a Totoro-coded forest spirit between cedar trunks, only the silhouette visible
- Floating jellyfish-spirits drift through the air past the spire, trailing soft light
- A shooting star streaks across the twilight sky above the floating fortress
- Rainbow arches over the cathedral spire, perfectly framing it from one cliff to the next
- A pair of swallows dart between the wooden eaves, swooping low across the courtyard

DO NOT write:
- Hero-character action
- Large creature dominating frame
- Western fantasy creatures (no dragons / no unicorns)
- Threatening / scary surprise
- Generic "magic" without specifics

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
