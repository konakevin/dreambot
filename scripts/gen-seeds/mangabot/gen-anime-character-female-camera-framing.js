#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_character_female_camera_framing.json',
  total: 150,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CAMERA FRAMING entries for a MangaBot anime-character-female keyframe. Each entry names the SHOT TYPE — how the camera frames the character (who is the HERO of the frame at 35-50% scale).

⚠️ CRITICAL FORWARD-FACING-ONLY MANDATE — this is a character-LED path; the character must be the visual focus with face / front / engagement clearly visible. Phase 2.0 validation locked the lesson: pool entries naming "over-shoulder behind X" / "wide vista with figure tiny" / "back-of-character looking at Y" produce back-to-camera renders even with template overrides. THIS POOL must seed forward-facing or profile-engaged framings ONLY.

Each entry: 8-16 words. Names the framing + the character's orientation + composition hint.

FRAMING VARIETY (target distribution — ALL forward-facing-or-profile):
- 22% LOW-ANGLE HERO (camera below the character, three-quarter forward, face visible against atmospheric sky/canopy/ceiling)
- 18% FORWARD THREE-QUARTER (character angled toward viewer at 3/4, face engaged + body torqued in action)
- 16% TIGHT MEDIUM-SHOT (waist-up or chest-up of character mid-action, face dominant, dynamic expression — anime keyframe close-up)
- 12% PROFILE DYNAMIC-ACTION (full side-profile mid-strike / mid-leap / mid-cast, face visible in profile, body silhouette readable)
- 10% MEDIUM-FULL-BODY (character at 35-50% of frame, full body visible, three-quarter forward, setting wraps around)
- 8% DUTCH-ANGLE FORWARD (tilted-frame tension, character angled toward viewer at 3/4 mid-action)
- 6% HIGH-ANGLE LOOKING DOWN (camera above the character; face turned UP at camera or up at something off-frame, NOT a back-of-head shot)
- 4% EXTREME CLOSE-UP (face fills the frame, single feature catches light — emotional anime close-up)
- 4% MAGIC-CIRCLE-FRAMED (anime magic-circle wrapping the character mid-cast, face dominant inside the circle)

DO write:
- Low-angle hero framing, camera below character, three-quarter forward, face haloed by overhead light
- Forward three-quarter composition, character angled toward viewer mid-action, hair caught in wind
- Tight medium-shot, character waist-up mid-cast, face dominant in dramatic key light
- Profile dynamic-action full-body, character mid-strike side-on, hair and ribbons trailing motion
- Medium-full-body, character at half-frame three-quarter forward, setting wrapping around her
- Dutch-angle forward 3/4, character mid-leap toward viewer at off-axis tension
- High-angle looking down, character face turned up at camera with engaged expression
- Extreme close-up, character face fills frame, tear-track catches lamplight along jaw
- Magic-circle-framed, glowing rune-ring wraps character mid-cast at chest-up, face dominant in glow
- Overhead 90-degree top-down (RARE), character face turned up at camera surrounded by spell-glyphs

DO NOT write:
- Over-shoulder behind the character / hero / heroine / figure — back-to-camera trap
- "Wide vista with character small against landscape" — back-to-character-from-distance trap
- "Camera behind X looking past her at scene" — back-to-camera trap
- "Lone silhouette in doorway / against vista / on hilltop" — back-to-camera trap
- "From behind the character / heroine / figure" — back-to-camera trap
- "Eyes forward not at camera" / "looking off into distance" — eye direction comes from action, not framing
- "Establishing wide shot with character barely visible" — character is the HERO, never barely-visible
- Photoreal camera specs (35mm / f/stops / shutter-speed)
- Multiple shots per entry — ONE framing only
- Modern handheld shaky-cam

The default Flux failure mode for "anime + character + atmospheric setting" is the back-of-character silhouette against a lush vista. EVERY entry in this pool must STRUCTURALLY push against that default — the camera angles MUST keep the character's face / front / engagement visible.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
