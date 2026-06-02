#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/samurai_emotional_dna.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} EMOTIONAL DNA entries for a MangaBot samurai-era keyframe. Each entry locks the FRAME'S MOOD — the emotional register the viewer should feel. Mononoke / Vagabond / Demon-Slayer / Rurouni-Kenshin mood library.

Each entry: 8-16 words. Names the emotion + the visual cues that telegraph it.

EMOTIONAL REGISTER VARIETY:
- Solemn (quiet weight, lowered eyes, slow movement, hushed atmosphere)
- Determined (forward stance, focused jaw, weight committed)
- Mournful (downcast head, slumped shoulders, fallen leaves, parting)
- Fierce (gritted teeth, eyes narrowed, weight forward to strike)
- Contemplative (still figure observing, hand at chin, looking outward)
- Vow / oath (formal posture, hands pressed, sworn-binding posture)
- Parting / farewell (turning away, looking back, distance growing)
- Awe-struck (looking upward at something massive, face uplit)
- Restful (kneeling at ease, eyes half-closed, peace after struggle)
- Tense pre-violence (frozen mid-breath, both hands at hilts, no movement)
- Triumphal (quiet victory, weight settled, no boasting)
- Grieving (kneeling beside fallen blade or fallen leaf, head bowed)
- Wandering (lost-in-thought walk, eyes on the path, slow gait)
- Reverent (kneeling before a stone Buddha or shrine, prayer-clasp)
- Defiant (chin raised, eyes locked, refusal posture)

DO write:
- Solemn — lowered eyes, slow exhale, weight settled in stillness
- Determined — forward stance, jaw set, weight committed toward the action
- Mournful — head bowed, shoulders slumped, gaze on fallen leaves at the feet
- Awe-struck — face tilted upward, lit from above, hand half-raised toward the great gate
- Tense pre-violence — frozen mid-breath, both hands at twin hilts, no other motion

DO NOT write:
- Hammy theatrical emotion (anime-tears-streaming / screaming-rage poses)
- Modern emotional descriptors (anxious / depressed / triggered)
- Emotion without physical cue (just "sad" — must specify HOW it shows)
- Posed-for-camera emotion (chin-on-fist contemplation cliche)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
