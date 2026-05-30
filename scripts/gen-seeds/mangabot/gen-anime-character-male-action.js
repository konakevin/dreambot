#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_character_male_action.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ANIME ACTION entries for a MangaBot anime-character-male keyframe. Each entry describes what the man is DOING RIGHT NOW — captured at a loaded mid-action instant.

⚠️ CRITICAL ANTI-BACK-TO-CAMERA RULE — every action FORWARD-FACING or PROFILE-ENGAGED. NO "walking toward gate" / "approaching the temple" / "standing at cliff watching".

⚠️ MALE-SPECIFIC ANTI-CHEESECAKE — outfit-tearing / shirtless-action / pirate-rigging are Flux's "dynamic anime man" centroid. PURGE these. Action mid-strike / mid-cast / mid-leap with COVERED chest only.

Each entry: 12-20 words. Names the action + body orientation + interaction target + intensity cue. Outfit-covered, face-readable, forward-facing.

VARIETY MANDATE:
- 20% MID-STRIKE COMBAT (mid-strike with katana toward viewer / mid-block facing threat / mid-draw forward 3/4 / mid-spin combat-pose / squaring up with bokken) — body engaged, weapon in motion, COVERED chest
- 16% MID-CAST MAGIC (mid-cast palms forward / mid-channel rune-circle / mid-summon facing materializing creature / mid-incantation hands raised at viewer)
- 14% DAILY-SLICE FORWARD (mid-pour at counter facing viewer / mid-laugh / mid-eat ramen looking up / mid-write at desk eyes up / mid-strum guitar facing camera)
- 12% TRAINING/SPORT FORWARD (mid-pose holding stance toward viewer / mid-stretch facing camera / mid-archery draw face in profile / mid-jump-rope captured at apex)
- 10% MID-LEAP/VAULT FORWARD (mid-vault toward viewer / mid-leap-from-rooftop forward / mid-flip-kick captured / mid-parkour-arrival landing facing camera)
- 8% MID-EMOTION FORWARD (mid-shout calling out toward viewer / mid-determined-glare straight at camera / mid-laugh-tossing-head / mid-rain-soaked-grimace)
- 8% PROFILE DYNAMIC-ACTION (full side-profile mid-leap with coat trailing / profile mid-spin with weapon arc / profile mid-run captured at stride)
- 6% MID-INTERACTION CREATURE/OBJECT (mid-feed familiar facing camera / mid-pet his yokai companion with eye contact / mid-conjure floating cat-spirit / mid-bow with familiar at shoulder)
- 6% MID-CRAFT FORWARD (mid-paint at easel facing viewer / mid-calligraphy from above-table / mid-arrange ikebana toward camera / mid-pour-tea at customer)

DO write:
- Mid-strike with katana raised overhead, body torqued three-quarter forward, fierce determination in face toward viewer, haori coat snapping
- Mid-cast with palms forward toward camera, rune-glyphs spinning between hands, eyes locked on spell-target, kimono sleeve trailing
- Mid-pour matcha from iron kettle at counter, leaning forward with focused half-smile aimed at viewer, sleeves rolled to elbow
- Mid-archery draw, profile silhouette with composed face in profile, arrow nocked at off-frame target, hakama-sleeve crisp
- Mid-leap forward toward viewer captured at apex, jacket flapping behind, sharp grin in face, hand raised in seal
- Mid-shout calling out toward camera, jaw set, body weight forward, school-uniform jacket creased
- Profile dynamic mid-spin with weapon arc, full-body side-on, robe trailing, face visible in profile
- Mid-bow with fox-yokai familiar at his shoulder, three-quarter forward face with quiet half-smile at viewer

DO NOT write:
- "Walking toward [thing] in distance" — back-to-camera trap
- "Approaching the [shrine / gate / temple]" — back-to-camera trap
- "Looking out over [X]" / "Gazing at [X] beyond" — back-to-camera trap
- "Standing at window / cliff / edge watching X" — back-to-camera trap
- Shirtless / oiled / bare-chested / sweat-gleaming / chest-revealing actions
- Pirate-rigging / boarding-skyship / cutlass-trope action verbs
- Combat with visible enemy / blood / wounded
- Static "standing posing" / "modelling stance"
- Multiple actions per entry — ONE only

The default Flux failure mode for "anime + man + scenery" is back-of-character looking out OR shirtless-pirate-action. Every entry STRUCTURALLY pushes against both — forward-facing engaged action with chest-covering outfit element implied.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
