#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/magical_girl_camera_framing.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CAMERA FRAMING entries for a MangaBot magical-girl keyframe. Forward-facing or profile-engaged only. Magical-girl is HERO at 35-50% of frame.

⚠️ NEVER write back-to-camera, over-shoulder behind her, or wide-figure-tiny framings. Magical-girl renders pull HARD toward "tiny silhouette in magical realm" centroid; OVERRIDE.

Each entry: 8-16 words. Framing + character orientation + magical composition hint.

DISTRIBUTION:
- 22% LOW-ANGLE HERO (camera below, three-quarter forward, halo of sparkle behind her, peak transformation moment)
- 18% FORWARD THREE-QUARTER (character angled toward viewer at 3/4, mid-cast/spin/leap, sparkle trail)
- 14% TIGHT MEDIUM (waist-up of character mid-cast, face dominant in magical aura)
- 12% MAGIC-CIRCLE-FRAMED (rune-circle wraps character at chest-up, face dominant in circle glow)
- 10% PROFILE DYNAMIC (full side-profile mid-spin / mid-leap / mid-blast, body silhouette readable, face in profile)
- 8% MEDIUM-FULL-BODY (character at half-frame three-quarter forward, magical setting wraps)
- 6% EXTREME CLOSE-UP (face fills frame, sparkle in eyes, magical-glow on features)
- 5% DUTCH-ANGLE MAGICAL (tilted-frame with rainbow-burst behind, character mid-action toward viewer)
- 3% HIGH-ANGLE LOOKING DOWN (camera above; her face turned UP at camera or up at incoming magical beam)
- 2% WAND-FOREGROUND (wand-tip close to lens mid-cast, character's face mid-distance focused on spell)

DO write:
- Low-angle hero framing, camera below magical-girl mid-transformation, sparkle-halo overhead, body angled three-quarter forward
- Forward three-quarter, magical-girl angled at 3/4 mid-cast with hands at chest, ribbons spiraling around
- Tight medium-shot, magical-girl chest-up mid-incantation, face dominant in mana-corona glow
- Magic-circle-framed, glowing rune-ring wraps magical-girl at chest-up, face determined in cyan glow
- Profile dynamic-action full-body, magical-girl mid-spin with cape-ribbon trail, side-on face visible
- Extreme close-up, magical-girl face fills frame, single tear catches starlight along jawline
- Dutch-angle magical tilt, magical-girl mid-blast toward viewer at off-axis tension
- Wand-foreground composition, raised wand close to lens mid-cast, character's face mid-distance focused

DO NOT write:
- Over-shoulder behind X — back-to-camera trap
- "Wide vista with magical-girl small against cosmic-realm" — back-to-character trap
- "Camera behind her looking past at floating cosmic scene"
- "Tiny figure on magical platform with cosmic vista beyond" — back-to-character trap
- Photoreal camera specs

Magical-girl is HERO + forward-facing + sparkle-stacked.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
