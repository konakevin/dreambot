#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_emotional_dna.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} EMOTIONAL-DNA entries for a MangaBot ghibli-countryside keyframe. Each entry locks the FRAME'S MOOD. Studio Ghibli quiet pastoral emotional register.

Each entry: 8-16 words. Names the emotion + the physical cue.

GHIBLI MOOD VARIETY:
- Wistful (looking outward, slight smile, weight of memory)
- Nostalgic (revisiting familiar place, hand brushing surface)
- Quietly content (sitting still, weight settled, peace)
- Hopeful (gaze forward, weight rising slightly, anticipation)
- Contemplative (still figure observing, lost in thought)
- Awe-struck (looking upward / outward at something wonderful)
- Lonely-but-peaceful (alone in vast landscape, but at home)
- Curious (head tilted, leaning in, hand reaching to inspect)
- Homecoming (approaching cottage, soft pull-forward bearing)
- Departing (back to camera, walking away into distance)
- Sleepy / restful (yawning, stretching, leaning against tree)
- Playful (mid-skip, mid-laugh, lighter posture)
- Reverent (kneeling at shrine, prayer-clasp, soft)
- Reading / studying (quiet focus on book or paper)
- Listening (head tilted, ear forward, paused)

DO write:
- Wistful — looking outward across the valley, slight smile, weight of a long-held memory
- Nostalgic — revisiting a familiar place, hand brushing across a cottage doorpost
- Quietly content — sitting still on the engawa, weight settled, eyes half-closed in peace
- Hopeful — gaze forward toward the horizon, weight rising slightly with anticipation
- Awe-struck — looking up at a great old persimmon tree, face uplit, hand half-raised
- Lonely-but-peaceful — alone in a vast meadow, comfortable in solitude
- Curious — head tilted toward a wildflower, leaning in, fingertip nearly touching the petal
- Homecoming — approaching the cottage door, soft pull-forward bearing, basket on hip
- Departing — back to camera, walking away into the distance with satchel
- Playful — mid-skip down the path, weight light, hands open at the sides
- Reverent — kneeling at a small forest shrine, palms pressed together, head bowed

DO NOT write:
- Dramatic anime-tears / theatrical poses
- Combat / hunted / paranoid (those are cyberpunk / samurai)
- Modern emotional descriptors (anxious / depressed / triggered)
- Emotion without physical cue
- Eye-contact with viewer

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
