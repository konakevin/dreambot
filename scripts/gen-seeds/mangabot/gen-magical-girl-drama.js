#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/magical_girl_drama.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} MAGICAL DRAMA entries for a MangaBot magical-girl keyframe. 40%-gated PEAK magical-event in the world around her — visible secondary focal point, NOT eclipsing her.

⚠️ ANTI-BACK-TO-CAMERA — drama doesn't put HER facing away to admire it; she's INSIDE the magical peak.

Each entry: 14-22 words. Drama event + magical aesthetic + where it lives in frame.

DISTRIBUTION:
- 22% FINISHING-ATTACK BLOOM (rainbow-energy-wave erupting from her wand toward off-frame foe / cosmic-blast cascading down from sky onto her wand / spiraling-petal-attack rotating outward)
- 18% TRANSFORMATION-PEAK BURST (light-pillar erupting from below her / ribbon-storm spiraling at center / costume-shift wave cascading / crystalline-shards forming around her body)
- 14% COSMIC PHENOMENON (constellation-arc forming behind her / aurora-cascade rippling across midground sky / planet-aligned beam piercing down / nebula-bloom in deep background)
- 12% FAMILIAR/CREATURE SUMMON (giant-mascot materializing from sparkle-vortex behind her / spirit-pet projecting overhead / talking-cat transforming to large form at midground)
- 10% MAGICAL-RIFT/PORTAL (heart-shaped portal opening at midground / dimensional-tear with stars bleeding through / mirror-portal cracking with light)
- 8% CARD/RUNE-CASCADE (clow-card-spread flying outward / rune-array projecting magical-geometry / spell-card-tower spinning around her)
- 6% TIME/REALITY DISTORTION (time-stop ripple frozen at frame edge / dimensional-rift cracking at deep distance / impossible-mirror-image flashing)
- 4% ELEMENTAL UNLEASH (fire-bloom blossoming from outstretched palms / ice-crystal-storm radiating outward / lightning-fork-pillar striking her wand)
- 4% MUSICAL/IDOL DRAMA (sound-wave visualizer pulsing outward from mic-wand / stage-pyro firework-burst behind / glow-stick-sea pulsing in deep background)
- 2% PRECURE/TEAM-COLOR FUSION (color-burst combining rainbow-streams at center / team-attack converging behind her)

DO write:
- Rainbow-energy-wave erupting from her wand toward off-frame foe, cascading sparkle-trail in deep midground
- Light-pillar erupting from below her body during transformation, ribbon-storm spiraling outward
- Constellation-arc forming behind her in deep sky, star-burst at peak of arc casting halo over shoulder
- Giant mascot-familiar materializing from cyan sparkle-vortex behind her, claws emerging through mist
- Heart-shaped portal opening at midground beside her, stars bleeding through portal edges
- Clow-card-spread flying outward in fan pattern, each card glowing rose-gold at deep midground

DO NOT write:
- Drama positioning her back-to-camera ("she gazes at floating cosmic event")
- Drama she's FACING AWAY to admire
- Combat-with-blood-violence
- Photoreal cinematography terms

Drama enhances scene around her — she's INSIDE it, engaged, facing forward or in profile.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
