#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_character_female_action.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ANIME ACTION entries for a MangaBot anime-character-female keyframe. Each entry describes what the character is DOING RIGHT NOW — captured at a loaded mid-action instant.

⚠️ CRITICAL ANTI-BACK-TO-CAMERA RULE — every action must be FORWARD-FACING or PROFILE-ENGAGED. Phase 2.0 validation showed even with the camera_framing axis fixed, action-pool entries like "walking toward the gate" / "approaching the temple" / "kneeling at the altar facing away" produce back-of-character renders. THIS POOL must seed forward-facing dynamic action only.

Each entry: 12-20 words. Names the action + body orientation + interaction target + intensity cue.

VARIETY MANDATE — distribute across:
- 18% MID-STRIKE / COMBAT-STANCE (mid-strike with katana toward viewer / mid-block facing the threat / mid-draw forward 3/4 / squaring up with bokken / mid-spin combat-pose facing camera) — body engaged, face visible, weapon mid-motion
- 16% MID-CAST / MAGIC-CHANNEL (mid-cast with palms forward toward viewer / mid-channel with rune-circle spinning around her / mid-summon facing the materializing creature / mid-incantation hands raised) — forward-facing magic
- 14% DAILY-SLICE FORWARD (mid-pour at counter facing the viewer / mid-laugh leaning over a desk toward camera / mid-eat ramen looking up / mid-write at desk eyes up at viewer / mid-strum guitar facing camera) — engaged with foreground object
- 12% TRAINING / SPORT FORWARD (mid-stretch in dojo facing camera / mid-pose holding stance toward viewer / mid-jump-rope captured at apex / mid-archery draw with face in profile aimed off-frame) — dynamic + face readable
- 10% MID-TRANSFORMATION / MAGICAL (mid-transformation pose with ribbons spiraling around her facing camera / mid-power-up with mana corona / mid-reveal with hand raising toward camera / mid-leap-to-arena forward) — magical-girl peak moments
- 10% MID-EMOTION FORWARD (mid-laugh tossing head back / mid-blush hands raised to face / mid-shout calling out toward viewer / mid-cry tears caught at corner / mid-determined-glare straight at camera) — face dominant
- 8% PROFILE DYNAMIC-ACTION (full side-profile mid-leap with hair trailing / profile mid-spin with weapon arc / profile mid-run captured at stride / profile mid-throwing-shuriken / profile mid-flip-kick) — face in profile, body torqued
- 6% MID-INTERACTION CREATURE/OBJECT (mid-feed her familiar facing camera / mid-pet her yokai companion with smile to viewer / mid-bow with familiar at her shoulder / mid-conjure floating cat-spirit) — character forward + companion mid-frame
- 6% MID-CRAFT FORWARD (mid-paint at easel facing viewer / mid-write calligraphy from above-the-table angle / mid-arrange ikebana toward camera / mid-pour-tea facing the customer) — engaged with craft

DO write:
- Mid-strike with katana raised overhead, body torqued three-quarter forward, fierce determination in face toward viewer
- Mid-cast with palms forward toward camera, rune-glyphs spinning between her hands, eyes locked on the spell-target
- Mid-pour matcha from iron kettle at counter, leaning forward with focused half-smile aimed at customer-viewer
- Mid-transformation peak moment, ribbons spiraling outward from her, hands raised crossed at chest facing camera
- Mid-leap profile silhouette, hair and ribbons trailing, sword-arm extended in side-on full-body arc
- Mid-laugh tossing head back, twin-tails caught mid-bounce, eyes squeezed shut with open-mouth joy facing viewer
- Mid-pet of fox-yokai familiar perched on her shoulder, soft three-quarter forward face with warm smile at viewer
- Mid-archery draw, profile silhouette with composed face in profile, arrow nocked aimed at off-frame target

DO NOT write:
- "Walking toward [thing] in the distance" — back-to-camera trap
- "Approaching the [shrine / gate / temple]" — back-to-camera trap
- "Looking out over [X]" / "Gazing at [X] beyond" — back-to-camera trap
- "Standing at the window / cliff / edge watching X" — back-to-camera trap
- "Kneeling at the altar facing away" / "kneeling with back to viewer" — back-to-camera trap
- "Walking up the stairs / path / hill toward Y" — back-to-camera trap
- "Sitting facing the sunset / horizon / vista" — back-to-camera trap
- Static "standing posing" / "modelling stance" — anti-runway rule
- Combat with visible enemy / blood / wounded — combat-clean rule
- Cheesecake-coded action verbs ("seductively sipping" / "sensually adjusting outfit")
- Multiple actions per entry — ONE action only

The default Flux failure mode for "anime + woman + setting" is back-of-character looking out at scenery. Every entry in THIS pool must STRUCTURALLY push against that default — forward-facing, profile-engaged, or face-readable dynamic action only.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
