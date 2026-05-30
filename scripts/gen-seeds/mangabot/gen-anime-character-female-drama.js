#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_character_female_drama.json',
  total: 60,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ATMOSPHERIC DRAMA entries for a MangaBot anime-character-female keyframe. Each entry is a 40%-gated magical / atmospheric event happening in the world around the hero — render as visible secondary focal point (NOT eclipsing her).

Each entry: 12-22 words. Names the drama + its anime-aesthetic + where it lives in the frame.

VARIETY MANDATE — distribute across anime-canon dramatic events:
- 22% MAGICAL SURGES (mana-corona pulsing around her / spell-circle erupting in cyan glow / rune-glyphs cascading mid-air / power-aura burst with kanji fragments)
- 18% CELESTIAL / WEATHER DRAMA (aurora rippling across midground sky / falling-stars streaking through frame / cherry-blossom storm sweeping past / lightning crack illuminating shadow / meteor shower at deep midground)
- 14% SUMMONING / MATERIALIZING (creature emerging from spell-smoke / familiar materializing mid-air / portal opening in deep distance / spirit-form coalescing with her gesture)
- 12% TIME / REALITY DISTORTION (time-stop ripple frozen mid-action / dimensional rift cracking the sky at edge / impossible mirror-image / clock-glyphs spinning around her)
- 10% FESTIVAL / RITUAL FIREWORKS (hanabi firework bursting overhead / lantern-release floating up into night / festival fireworks reflecting in puddle / bonfire flame leaping behind her)
- 10% YOKAI / SPIRIT INCURSION (kitsune-fire trails snaking through scene / ghost-fire wisps drifting past / spirit-form crossing background / yokai-horde silhouette in deep distance)
- 8% TECHNO / SCI-FI DRAMA (status-window cascade descending from above / hologram-projection materializing mid-air / mecha-launch contrail across sky / data-stream rain falling)
- 6% NATURAL PHENOMENA (wind-whirlpool of petals around her / waterfall mist rolling in from edge / autumn-leaf-cyclone whirling past / cherry-blossom-snow combined falling)

DO write:
- Mana-corona pulsing cyan around her body, spell-glyphs cascading downward in deep midground
- Aurora ripple cascading across midground sky, casting jade-violet glow over her shoulder and hair
- Spell-creature materializing from cyan-smoke vortex at midground, claws emerging through mist
- Falling-star streak punching down through deep distance sky, faint bloom catching her cheek
- Hanabi firework bursting in saturated bloom overhead, golden sparks raining at deep midground
- Time-stop ripple frozen at the edge of the frame, raindrops suspended mid-fall around her shoulders
- Kitsune-fire trail snaking around her ankles, ghost-light flickering at deep midground

DO NOT write:
- Drama that would put the character back-to-camera ("vista of city below burning" / "horizon-spanning aurora she stares at")
- Drama that PUTS THE CHARACTER FACING AWAY to admire it
- Combat enemies attacking her (combat-clean rule)
- Photoreal cinematography terms

Drama enhances the scene around her — she's INSIDE it, engaged, facing the action or facing forward. Never positioned to gaze at the drama from behind.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
