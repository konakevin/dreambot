#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_compositions.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} BUST-FRAMING COMPOSITION descriptions for GothBot's vampire-girls-2 path. Each entry is a single short composition phrase (8-18 words) describing how the bust portrait is framed. Comma-separated phrases.

CALIBRATION — these 6 hardcoded entries drove the QA-loop wins. Match their structure and intent:

REFERENCE 1: "bust portrait, frontal, head and shoulders centered, eyes meeting camera with confident predator gaze"
REFERENCE 2: "three-quarter bust, face turned 30-40 degrees, dramatic confident pose"
REFERENCE 3: "bust at the left third, face turned right, dramatic backdrop unfolding"
REFERENCE 4: "chin-up heroic bust, head tilted up, throat exposed, regal posture"
REFERENCE 5: "window-framed bust by a tall arched gothic window, dramatic backlight"
REFERENCE 6: "over-shoulder turn-back, face in 3/4 looking past camera with cold confidence"

━━━ COMPOSITION VARIETY (mandatory spread across ${n}) ━━━
- Frontal bust shots (head-on / dead-eyes-on-camera / centered)
- Three-quarter turns (face turned 20-50 degrees)
- Profile shots (face in pure profile, jawline visible)
- Chin-up / heroic / throat-exposed poses
- Chin-down / brooding / looking-up-from-under-brow poses
- Bust at left/right third (rule of thirds, dramatic backdrop fills the rest)
- Window-framed busts (gothic window arch frames her)
- Doorway-framed busts (gothic doorway / archway frames her)
- Over-shoulder look-back (turning away, glancing back)
- Under-arch / under-vault framing (gothic stone arch overhead)
- Reflected-in-mirror (mirror catches her face)
- Behind-veil / behind-lace (veil partially obscures face)
- Crowned-low-angle (crown emphasized by camera below)
- Throne-back framing (carved throne back behind her)
- Candle-foreground bust (candle in foreground, vampire bust behind)

━━━ ABSOLUTE RULES ━━━
- Each entry is BUST or 3/4-BODY framing — head and shoulders, chest-up, sometimes upper torso. NEVER full-body. NEVER tiny figure in landscape. NEVER face-fills-frame extreme macro.
- Vampire is the SUBJECT — ~40-50% of frame.
- 8-18 words per entry, comma-separated phrases
- NO mention of specific wardrobe / makeup / setting (those come from other pools)
- NO mention of specific expression or emotion (the menace_feature pool handles that)
- Just the FRAMING — composition + camera angle + how she sits in frame

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: angle (frontal/3-4/profile) + framing element (window/throne/mirror/none) + tilt (chin-up/down/level). Two entries are too similar if they share more than 2 of these.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
