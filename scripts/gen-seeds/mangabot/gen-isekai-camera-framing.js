#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/isekai_camera_framing.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CAMERA-FRAMING entries for a MangaBot ANIME ISEKAI keyframe. Painterly anime keyframe convention.

⚠️ NEVER write "back-of-character looking out at scene" framings. The audit on 2026-05-29 found 9% of this pool was over-shoulder-party + wide-vista-with-tiny-party — that compounded into homogenous back-to-character renders. Recipe rewritten 2026-05-29 to PURGE those framings.

Each entry: 8-16 words. Names framing + anime style.

DISTRIBUTION (ALL forward-facing-or-profile):
- 18% MEDIUM-SHOT HERO (single anime hero in fantasy setting, three-quarter forward, face engaged)
- 14% LOW-ANGLE HEROIC (camera low looking up at hero, face visible, fantasy backdrop)
- 13% PARTY-WIDE SHOT (adventurer party traveling, facing toward viewer or three-quarter forward, body weight engaged in motion)
- 12% CLOSE-UP CHARACTER (anime character emotional close-up, face dominant)
- 10% PROFILE SIDE-ON (figure crosses frame in profile, mid-action, face visible in profile)
- 9% DUTCH-ANGLE COMBAT (tilted frame for battle moment, figure angled toward viewer or mid-strike profile)
- 8% FORWARD THREE-QUARTER (hero angled toward viewer at 3/4, sword half-drawn or mid-cast, face engaged)
- 7% THROUGH-FOREGROUND (looking through foliage / banner / glowing rune AT the figure, not past them)
- 5% MAGIC-CIRCLE-FRAMED (anime magic-circle wrapping the figure mid-cast, face dominant inside the circle)
- 3% TIGHT MEDIUM-SHOT (waist-up of hero mid-cast or mid-strike, face dominant)
- 1% COCKPIT-LIKE FROM-DRAGON (riding dragon mid-flight, rider's face visible at three-quarter forward)

DO write:
- Anime medium-shot of hero at three-quarter forward in fantasy setting, sword half-drawn at glowing dungeon entrance
- Anime low-angle heroic framing, camera below the warrior, face visible against painterly storm clouds
- Anime party-wide shot, adventurer team marching toward camera through sunlit enchanted forest road
- Anime close-up character framing, cel-shaded tears on hero's face during emotional reunion moment
- Profile side-on composition, mage crosses frame mid-cast, staff trailing motion, face visible in profile
- Anime dutch-angle combat-tension framing, figure angled toward viewer mid-strike
- Forward three-quarter, hero angled toward viewer, status-window holograms flickering, face engaged
- Through-glowing-rune foreground framing, looking past magic circle AT the mage's face mid-cast
- Magic-circle-framed composition, hero inside glowing rune-ring mid-cast, face dominant
- Tight medium-shot, hero chest-up mid-cast, face dominant, mana-glow lighting features

DO NOT write:
- Over-shoulder party composition "camera behind elf/knight/healer looking out at fantasy vista" — the audit flagged this as the dominant failure mode
- Wide-vista fantasy "tiny party silhouetted against vast citadel" — party-tiny renders read as back-of-figure
- "From behind the elf / knight / hooded healer / beastkin / hero" — any framing where the camera is BEHIND
- "Gazing at smoldering ruins" / "gazing across desert" with character back to viewer
- Photoreal camera specs (f-stops)
- Multiple shots per entry
- Cyberpunk-coded framings

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
