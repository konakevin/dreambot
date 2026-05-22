#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_spirit_element.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (n) => `Write ${n} SPIRIT-ELEMENT entries for a MangaBot ghibli-countryside keyframe. Each entry is a SUBTLE MAGICAL-REALISM accent — the Ghibli moment where the world reveals itself alive. Fires at 40% gate; when it appears, it's a small element, never the whole frame.

Each entry: 10-20 words. ONE specific subtle magical element with material-truth detail.

GHIBLI SPIRIT-ELEMENT VARIETY (subtle never dominating):
- KODAMA PEEKING (small tree-spirit visible in a tree-hollow, head tilted)
- FIREFLY-CLUSTER (warm-yellow firefly-orbs drifting in a tight cluster)
- GLOWING-MUSHROOM (small cluster of softly-glowing mushrooms at tree-base)
- SPIRIT-ORB FLOATING (single soft-glowing orb hovering at human-height)
- DREAMY BIRD-FLIGHT (a single white bird flying in slow magical arc)
- MAKKURO-KUROSUKE (small black soot-sprites scurrying along a beam)
- FOREST-SPIRIT TRAIL (faint glowing footprints leading into the trees)
- DRIFTING SPIRIT-LIGHT (faint ethereal glow drifting between the trees)
- TINY FAIRY-SPECKS (tiny white sparkle-specks suspended in a sun-shaft)
- SUDDEN FOX-SPIRIT (a fox briefly visible at the meadow-edge, watching)
- GLOWING DRAGONFLY (one dragonfly with faintly luminescent wings)
- MAGIC TREE-WIND (one tree visibly bowing as if greeting the figure)
- PRAYER-PAPER FLUTTERING (paper-talismans glowing softly on a shrine)
- BAMBOO-FOREST WHISPER (one bamboo culm glowing softly from within)
- FLOWER-OPENING-AT-DUSK (one wildflower visibly opening at twilight)
- WATER-SPIRIT RIPPLE (a ripple in still pond water with no visible cause)
- GHOST-CAT (faint translucent cat-shape just visible at the edge of frame)
- FLOATING LEAF (a single autumn leaf hovering in air, refusing to fall)
- DEW-DROP RAINBOW (faint rainbow caught in a single dewdrop in foreground)
- WHISPERING WIND-CHIME (a wind-chime tinkling though no wind moves)

DO write:
- A small kodama tree-spirit just visible in a tree-hollow, white face tilted curiously
- A warm-yellow firefly-cluster drifting in a tight knot above a wildflower patch
- A small cluster of softly-glowing mushrooms at the base of an ancient tree, faint blue glow
- A single soft-glowing spirit-orb hovering at human-height beside the path
- A single white bird flying in a slow magical arc above the meadow, leaving faint trail
- Small black soot-sprites scurrying along a wooden beam, just visible at the edge of frame
- Faint glowing spirit-footprints leading into the trees, ankle-height pale-blue glow
- A faint ethereal spirit-light drifting slowly between the cedar trunks at dusk
- Tiny white sparkle-specks suspended in a sun-shaft, more than dust, less than fireflies
- A fox-spirit briefly visible at the meadow-edge, eyes catching the light, ready to fade

DO NOT write:
- Overt fantasy (full ghosts / dragons / explicit-magical beings)
- Multiple spirit-elements per entry — ONE subtle accent
- Dominating the frame — must be SMALL and visible-on-second-look
- Foreground / midground anchors (separate axes)
- Cyberpunk / horror tone — keep Ghibli's quiet-reverent register

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
