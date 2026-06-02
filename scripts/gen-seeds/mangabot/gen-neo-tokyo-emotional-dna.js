#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/neo_tokyo_emotional_dna.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} EMOTIONAL-DNA entries for a MangaBot neo-tokyo cyberpunk anime keyframe. Each entry locks the FRAME'S MOOD. Akira / Ghost-in-the-Shell / Blade-Runner / Edgerunners emotional register.

Each entry: 8-16 words. Names the emotion + the physical cue that telegraphs it.

CYBERPUNK MOOD VARIETY:
- Melancholic isolation (lone figure in crowd, downcast, body angled away)
- Wired tense paranoia (constant glances, shoulders tight, hand near weapon)
- Mechanical detachment (replicant-flat affect, eerie stillness, hollow eyes)
- Hunted on-the-run (forward urgency, glance over shoulder, sweat-on-brow)
- Contemplative loneliness (still figure observing city from height, lost in thought)
- Euphoric overload (cyber-drug-high, eyes wide, embrace of chaos)
- World-weary detective (slow exhale, smoke trail, eyes that have seen too much)
- Cybered-up power-trip (chin raised, confident swagger, just-augmented satisfaction)
- Mournful cyberpunk (figure at street-shrine for fallen friend, head bowed)
- Defiant resistance (jaw set, eye-on-distant-target, weight planted forward)
- Lost / disoriented (figure consulting holographic map, looking around)
- Wounded / failing (clutching cyber-arm, leaning against wall, half-collapse)
- Reflective at curb (sitting at edge, watching traffic, no urgency)
- Reverent at neon-shrine (kneeling at cyber-shrine, prayer-clasp)
- Predatory / stalking (low, focused, weight settled forward, no sudden moves)

DO write:
- Melancholic isolation — lone figure motionless in a moving crowd, head angled down, distance in the eyes
- Wired tense paranoia — quick glances over each shoulder, hand resting near holster, shoulders tight
- Mechanical detachment — eerie flat affect, eyes empty, posture too still to be fully human
- Hunted on-the-run — forward urgency, single glance over shoulder, sweat catching neon light on the brow
- Contemplative loneliness — still figure on a high walkway looking out, no movement, lost in thought
- World-weary detective — slow exhale of cigarette smoke, eyes that have seen too much, slumped against wall
- Wounded / failing — figure clutching a damaged cyber-arm, leaning against a wet wall, half-collapse mid-stride

DO NOT write:
- Hammy / theatrical emotion (anime-tears, screaming-rage)
- Generic emotional descriptors (sad / happy — must specify HOW it shows)
- Posed-for-camera emotion (chin-on-fist contemplation cliche)
- Modern emotional jargon (anxious / triggered / depressed)
- Eye-contact with viewer

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
