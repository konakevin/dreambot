#!/usr/bin/env node
/**
 * GOTHBOT_GOTH_CLOSEUP_CAMERA_PERSPECTIVE — framing/angle for the close-up
 * portrait of a dark-seductress. Side-profile, three-quarter, over-the-shoulder,
 * extreme close on a single facial feature, through-the-hair, mirror-reflection,
 * Dutch-tilt. Castlevania / Crimson-Peak / Bloodborne / Devil-May-Cry painted
 * register.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/gothbot_goth_closeup_camera_perspective.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} CAMERA-PERSPECTIVE entries for GothBot's goth-closeup path — the camera angle / framing of a tight gothic close-up (face + throat + one shoulder) of a hauntingly-beautiful dark-seductress. Each entry is one rich descriptive sentence (20-35 words) naming ONE specific framing + how the face/feature reads in that frame.

━━━ THE BAR ━━━
Every entry: (1) names ONE specific camera position (side-profile, three-quarter, over-shoulder, extreme close-up on feature, through-hair, mirror-reflection, Dutch-tilt, low-angle, etc.); (2) shows what the angle does to the face/silhouette (lash-shadow, jawline, throat exposed, eye-piercing, lips-only); (3) places a small environmental detail in the bokeh. Painted Castlevania / Crimson-Peak / Bloodborne / Devil-May-Cry oil register.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"Sharp side-profile at ear level, jaw cutting a severe line against blurred candlelight, lashes casting long shadow across cheekbone."
"Low-angle looking up from below the chin, throat exposed, jawline dramatic against a ceiling of dripping wax chandeliers."
"Extreme close-up on lips only, deep black-stained mouth slightly parted, a single rivulet of dark pigment tracing the cupid's bow."
"Through her own hair, dark strands falling across the lens, half her face obscured, one pale eye piercing through the curtain."
"Over-the-shoulder from behind, face reflected in a tarnished handheld mirror she holds before her, reflection slightly distorted and dim."

━━━ VARIETY MANDATE (distribute across these framing families) ━━━
- ~4 SIDE-PROFILE / THREE-QUARTER PROFILE (severe jawline, eyes downcast, lash-shadow)
- ~3 OVER-THE-SHOULDER (looking back, half-turn, hair sweeping, throat dramatically exposed)
- ~3 EXTREME CLOSE-UP ON SINGLE FEATURE (lips only, eye only, throat only, hand-at-jaw, ear with jewelry)
- ~3 LOW-ANGLE / UP-INTO-FACE (throat dominant, jaw severe, ceiling of chandeliers/columns above)
- ~2 HIGH-ANGLE / DOWN-AT-FACE (looking up at viewer through lashes, vulnerability + power)
- ~2 THROUGH-HAIR / OBSCURED PARTIAL (strands cutting across face, eye piercing through)
- ~2 MIRROR / REFLECTION (handheld mirror, vanity glass, water reflection, broken-mirror fragments)
- ~2 DUTCH-TILT / OFF-AXIS / CANTED FRAME
- ~1 DIRECT EYE CONTACT into the lens (still + lethal)
- ~1 EYES-CLOSED / LASH-DOWN moment of stillness
- ~1 DOORWAY / WINDOW / SHADOW-EDGE half-framing (figure emerging from darkness)
- ~1 SHADOW-OBSCURING / CHIAROSCURO (half-face in pitch black, half lit candle-warm)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- 20-35 words per entry.
- ONE specific camera position per entry.
- MUST name what the angle DOES to the face (jaw / throat / lashes / silhouette / shadow).
- Bokeh environmental detail in the deep blur (candlelight, chandelier, wallpaper, window).

━━━ BANS ━━━
- NO modern photography register ("85mm bokeh", "f/1.4", "Sony A7R").
- NO selfie / phone / camera-with-flash language.
- NO wide / establishing shots — this is CLOSE-UP only.
- NO full-body / waist-up framings.
- NO playful / kawaii — DARK seductive painted register.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
