#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_character_male_drama.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ATMOSPHERIC DRAMA entries for a MangaBot anime-character-MALE keyframe. 40%-gated magical / atmospheric / combat event in the world around the hero — visible secondary focal point, NOT eclipsing him.

⚠️ MALE-CODED DRAMA — relative to female's transformation/cosmic register, male leans more toward combat-energy / forge-fire / battlefield-effects / mecha-arrival / sword-aura / shadow-creature. Keep some shared registers (lightning / aurora / firework) but tilt the mix toward male-coded events.

⚠️ ANTI-BACK-TO-CAMERA — drama doesn't put HIM facing away to admire it. He's INSIDE the drama, engaged or facing the event mid-action.

Each entry: 12-22 words. Drama + anime-aesthetic + where it lives in the frame.

DISTRIBUTION:
- 22% COMBAT-ENERGY SURGE (mana-corona blasting around him as he casts / sword-aura erupting from his blade / battle-aura crackling around stance / power-up flash with kanji fragments / shockwave radiating outward at his strike)
- 18% CELESTIAL / WEATHER DRAMA (lightning crack illuminating his shadow / aurora-arc cascading across midground sky / falling-stars streaking through frame / storm-cloud parting overhead / meteor shower at deep distance)
- 14% SUMMONING / MATERIALIZING (familiar materializing from smoke vortex at midground / spell-creature emerging from rune-circle / portal opening in deep distance / spirit-form coalescing at his gesture)
- 12% FIRE / FORGE / SMOKE (forge-fire erupting in deep background as he hammers / explosion-bloom illuminating shadow / smoke-cloud parting as he steps forward / battlefield-fire silhouetting deep midground)
- 10% MECHA / SCI-FI DRAMA (mecha-launch contrail across sky behind him / hologram-projection materializing mid-air / drone-swarm crossing background / data-stream cascade behind him)
- 8% YOKAI / SPIRIT INCURSION (kitsune-fire trails snaking through scene around him / yokai-horde silhouette in deep distance / ghost-fire wisps drifting past / shadow-form stalking deep background)
- 8% TIME / REALITY DISTORTION (time-stop ripple frozen at edge / dimensional rift cracking sky / impossible mirror-image / clock-glyphs spinning around stance)
- 4% FESTIVAL / FIREWORKS (hanabi firework bursting overhead behind him / lantern-release floating up into night / festival fireworks reflecting in puddle)
- 4% NATURAL PHENOMENA (wind-whirlpool of leaves around him / waterfall-mist rolling in / petal-cyclone whirling past / autumn-leaf storm sweeping)

DO write:
- Mana-corona blasting outward as he casts forward, spell-glyphs cascading in deep midground
- Lightning crack illuminating his shadow against tower-wall, white-hot fork ripping the sky
- Familiar wolf materializing from cyan-smoke at midground behind his shoulder, claws emerging
- Forge-fire erupting in deep background as he raises hammer, sparks raining in midground
- Mecha-launch contrail punching across deep sky behind him, contrail-light catching his shoulder
- Kitsune-fire trails snaking around his ankles, ghost-light flickering at deep midground
- Time-stop ripple frozen at frame edge, raindrops suspended mid-fall around his stance
- Hanabi firework bursting in saturated bloom overhead behind him, golden sparks raining deep

DO NOT write:
- Drama positioning character back-to-camera ("city below burning, he gazes at horizon")
- Drama character is FACING AWAY to admire
- Combat enemies attacking him with visible wounds / blood (combat-clean rule)
- Photoreal cinematography terms

Drama enhances the scene around him — he's INSIDE it, engaged, facing forward or in profile.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
