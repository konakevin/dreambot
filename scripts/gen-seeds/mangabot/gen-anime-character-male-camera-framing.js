#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_character_male_camera_framing.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CAMERA FRAMING entries for a MangaBot anime-character-MALE keyframe. Each entry names the shot type — character (HERO at 35-50% scale) face / front / engagement visible.

⚠️ FORWARD-FACING-ONLY MANDATE — Phase 2.0 lesson locked: pool entries naming "over-shoulder behind X" / "wide vista with figure tiny" / "back-of-character looking at Y" produce back-to-camera renders even with template overrides. Forward-facing or profile-engaged ONLY.

⚠️ MALE COMBAT/DYNAMIC LEAN — relative to female's slice-of-life mix, male framings lean more toward combat/action energy (low-angle hero / weapon-mid-swing / mid-leap forward). Still mix in quiet engaged framings for breadth.

Each entry: 8-16 words. Framing + character orientation + composition hint.

DISTRIBUTION (forward-facing-or-profile only):
- 20% LOW-ANGLE HERO (camera below, three-quarter forward, face haloed against sky / overhead light / canopy)
- 18% FORWARD THREE-QUARTER (character angled toward viewer at 3/4, body torqued mid-action)
- 14% TIGHT MEDIUM-SHOT (waist-up or chest-up of character mid-action, face dominant, dynamic expression)
- 14% PROFILE DYNAMIC-ACTION (full side-profile mid-strike / mid-leap / mid-cast, body silhouette readable, face in profile)
- 8% MEDIUM-FULL-BODY (character 35-50% of frame, three-quarter forward, setting wraps around)
- 8% DUTCH-ANGLE COMBAT (tilted-frame tension, character mid-strike toward viewer)
- 6% HIGH-ANGLE LOOKING DOWN (camera above; character face turned UP at camera or at action target, NOT back-of-head)
- 5% EXTREME CLOSE-UP (face fills frame, single feature catches light — emotional close-up)
- 4% WEAPON-FOREGROUND (weapon or hand-in-action close to camera, character's face mid-distance focused on action)
- 3% MAGIC-CIRCLE-FRAMED (rune-ring wraps character mid-cast, face dominant inside the circle)

DO write:
- Low-angle hero framing, camera below man, three-quarter forward, face haloed by overhead temple-lantern
- Forward three-quarter combat-pose, body torqued toward viewer mid-strike, jaw set fierce, weapon raised
- Tight medium-shot, character chest-up mid-cast, hand at chest seal, face dominant in mana-corona glow
- Profile dynamic-action full-body, man mid-leap with coat trailing motion, face visible in profile
- Medium-full-body, character at half-frame three-quarter forward sword half-drawn, dojo wrapping around
- Dutch-angle combat tilt, man angled toward viewer mid-spin with weapon arc, face determined
- High-angle looking down, character face turned up at the camera with focused expression
- Extreme close-up, character face fills frame, single eye catches firelight along jawline
- Weapon-foreground composition, raised katana close to lens with character's face mid-distance focused
- Magic-circle-framed, glowing rune-ring wraps character mid-incantation, face dominant in glow

DO NOT write:
- Over-shoulder behind X — back-to-camera trap
- "Wide vista with character small against landscape" — back-to-character-from-distance trap
- "Camera behind X looking past him at scene" — back-to-camera trap
- "Lone silhouette in doorway / on hilltop / against vista" — back-to-camera trap
- "From behind the character / man / hero" — back-to-camera trap
- "Eyes forward not at camera" / "looking off into distance" — eye direction is decided by action, not framing
- "Establishing wide with character barely visible" — he's HERO, not background
- Photoreal camera specs (35mm / f-stops / shutter-speed)
- Multiple shots per entry — ONE only
- Modern handheld shaky-cam

Default Flux failure mode for "anime + man + scenery" is back-of-character silhouette. EVERY entry must keep his face / front / engagement visible.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
