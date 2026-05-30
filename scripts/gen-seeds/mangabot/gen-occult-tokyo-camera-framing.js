#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/occult_tokyo_camera_framing.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} CAMERA FRAMING entries for occult-tokyo keyframe — STRICT forward-facing-or-profile only.

⚠️ THE PATH AESTHETIC pushes toward back-of-character watching distant spirit. Pool must aggressively counter that centroid.

Each 8-16 words. Framing + character orientation + composition cue.

DISTRIBUTION:
- 24% TIGHT MEDIUM (waist-up at mid-occult-action, face dominant in cursed-glow light)
- 18% FORWARD THREE-QUARTER (3/4 forward at mid-occult-engaged-action with prop raised)
- 14% CLOSE-UP CURSED-EYE (face fills frame with one cursed-amber/sigil-glowing eye)
- 12% LOW-ANGLE HERO (camera below; face haloed by ofuda/sigil-glow overhead, body engaged)
- 8% MEDIUM-FULL-BODY (35-50% frame with occult-prop in foreground, urban-Tokyo as backdrop)
- 8% PROFILE-ENGAGED (side-on mid-occult-action with sigil-prop, face in profile not staring at distance)
- 6% DUTCH-ANGLE-CURSED (tilted-frame at mid-occult-action toward viewer, urgent energy)
- 4% HIGH-ANGLE FROM-ABOVE (camera elevated; character face turned up at viewer with sigil-glow)
- 4% OVER-SHOULDER-TOWARD-WHAT-THEY-SEE (camera at-shoulder TOWARD off-frame target, character's face visible in three-quarter profile)
- 2% EXTREME CLOSE-UP (face fills with cursed-aura, breath visible)

DO write:
- Tight medium-shot, character waist-up mid-ofuda-throw, face dominant in pale-cyan sigil-glow
- Forward three-quarter, character mid-kuji-mudra angled toward viewer, cursed-energy on face
- Close-up cursed-eye, character face fills frame with one amber-glowing eye, kanji-tattoo at collarbone
- Low-angle hero, camera below character mid-summon, face haloed by floating sigil-glyphs overhead
- Profile-engaged mid-sigil-draw on shrine wall, side-on full-body with face in profile not staring out
- Over-shoulder-toward-spirit framing, camera at-shoulder TOWARD off-frame entity, character's profile visible

DO NOT — STRICT bans:
- Over-shoulder behind character watching curse approach — back-to-camera trap
- "Wide vista with character small against Tokyo-neon" — back-to-character trap
- "Camera behind looking past character at spirit" — back-to-camera trap
- "Lone silhouette on rooftop against cursed-city" — back-to-camera trap
- "From behind the character looking out at curse" — back-to-camera trap
- Photoreal camera specs

Forward-facing or profile-engaged ONLY. Even over-shoulder framing must keep character's FACE visible in three-quarter profile.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
