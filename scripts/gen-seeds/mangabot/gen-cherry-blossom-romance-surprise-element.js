#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/cherry_blossom_romance_surprise_element.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} ROMANCE SURPRISE-ELEMENT entries — small tender secondary subjects at midground/background.

Each 10-18 words. Element + placement + romantic-world implication.

VARIETY:
- 20% PETALS-DRIFTING (cherry-petal cluster drifting close / petals on ground at midground / petal-trail blown past)
- 14% IMPLIED-PARTNER (figure silhouette in deep distance / partner-shape on bench beyond / shadow of another at distance)
- 12% MAILBOX/LETTER (mailbox with letter visible / envelope on bench beside / letter-drop in background)
- 10% LANTERN/LIGHT (paper-lantern catching light at midground / streetlamp warm-glow / lantern-string overhead)
- 10% BIRD/BUTTERFLY (single butterfly catching golden light / sparrow on cherry-branch / dragonfly mid-arc)
- 8% MUSIC (sheet-music on bench / piano-keys visible / music-stand at midground / instrument on chair)
- 8% CHERRY-BRANCH-DETAIL (cherry-branch with bird / sakura-blossom cluster close-up at midground / single twig in vase)
- 6% PHOTOGRAPH (Polaroid on bench / photo-album open / framed picture nearby)
- 6% GIFT/PRESENT (wrapped present on bench / box with bow / gift-bag at midground)
- 6% ANIMAL-WITNESS (cat watching from wall / dog at side / koi in pond)

DO write:
- Cherry-petal cluster drifting close at midground beside her, three petals catching golden-pink light
- Implied-partner figure silhouette in deep distance under different sakura-tree, blurred-tender
- Mailbox at midground beside path with letter-edge visible peeking out
- Paper-lantern catching warm-amber light at midground, string of three overhead
- Single white butterfly mid-arc beside her shoulder, wings catching golden-hour

DO NOT: anything foreground competing / multiple per entry / dramatic.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
