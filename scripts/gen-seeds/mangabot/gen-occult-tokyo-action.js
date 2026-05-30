#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/occult_tokyo_action.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} OCCULT-TOKYO ACTION entries — CRITICAL FORWARD-FACING ONLY.

⚠️ ANTI-BACK-TO-CAMERA MANDATE. Every action entry must affirmatively position character ENGAGED with an occult-prop / sigil / shikigami / ofuda / weapon / spirit, FACING viewer or in profile — NEVER staring at distant city / spirit / horizon.

Each 12-20 words. Action + body orientation + face register + supernatural interaction.

VARIETY:
- 18% MID-OFUDA-THROW (mid-pinch of ofuda between fingers facing camera / mid-launch of talisman strip / mid-pin of paper-charm on wall)
- 14% MID-KUJI-MUDRA (mid-formation of rin-pyo-toh hand-sign with focused face up / mid-cast of kuji with both hands forward / mid-rin-sign with eyes glowing forward)
- 12% MID-SIGIL-DRAW (mid-stroke of kanji-sigil in air with glowing finger facing camera / mid-chalk-stroke on ground head-up / mid-brush-painting on paper, face forward)
- 10% MID-PRAYER-BEAD-MANTRA (mid-recital with beads wrapped around fist facing viewer / mid-bead-roll between palms / mid-clutch-beads at chest with eyes-closed-resolute)
- 10% MID-SHIKIGAMI-DEPLOY (mid-release of paper-shikigami from palm head-up / mid-summon with both hands forward / mid-deploy with arm-extended toward viewer)
- 8% MID-COMBAT-OCCULT (mid-slash of cursed-katana in three-quarter forward stance / mid-block with talisman-shield / mid-counter-stance with weapon raised toward camera)
- 8% MID-SPIRIT-CONFRONT (mid-stand facing spirit at midground with body angled forward / mid-confrontation with hand-raised toward off-frame curse / mid-stare-down with chin-up resolute)
- 6% MID-EXAMINE-OCCULT (mid-inspect of sigil with finger-trace, face toward object / mid-read of contract-scroll with focused-half-smile / mid-study of ofuda held close)
- 6% MID-PHONE-CURSED (mid-photo of spirit on phone, screen facing forward / mid-scroll of cursed-app face-up / mid-livestream of haunting with camera-out)
- 4% MID-OFFERING (mid-pour of sake-cup as offering with focused face / mid-light of incense with hand-cupping / mid-place of rice-bowl at altar, kneeling toward camera)
- 4% MID-MASK-REVEAL (mid-push-up of hannya-mask on forehead with smirk forward / mid-lower of fox-kitsune-mask to reveal eyes / mid-don of mask with hand pulling forward)

DO write:
- Mid-pinch of ofuda paper-talisman between two fingers facing camera, cursed-amber eye glowing
- Mid-formation of rin-pyo-toh kuji-hand-mudra with focused face up at viewer, energy traces around hands
- Mid-stroke of kanji-sigil in air with glowing fingertip, body angled three-quarter forward
- Mid-recital of mantra with juzu beads wrapped around fist at chest, eyes closed but face forward
- Mid-release of paper-shikigami spirit from outstretched palm, head up at viewer with focused stare
- Mid-slash of modernized katana in three-quarter forward stance, sigil-blade glowing pale-cyan
- Mid-photo of spirit on smartphone with screen facing forward, focused-curious expression

DO NOT — CRITICAL:
- "Looking at distant spirit" / "watching curse approach" / "staring at sigil in distance" — back-to-camera traps
- "Standing at edge of rooftop facing Tokyo" — back-to-camera trap
- "Gazing into the cursed-fog" — back-to-camera trap
- "Silhouetted against neon-Tokyo" — back-to-camera trap
- "From behind the character looking at spirit" — back-to-camera trap
- Cheesecake / dramatic-pin-up / multiple per entry

Character ALWAYS engaged with occult-prop / sigil / weapon / spirit AT HAND. Spirits / city / aura are BACKDROP, never the target of their gaze.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
