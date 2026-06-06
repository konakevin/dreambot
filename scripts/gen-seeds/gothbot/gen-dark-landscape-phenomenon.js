#!/usr/bin/env node
/**
 * GOTHBOT_DARK_LANDSCAPE_PHENOMENON — atmospheric / supernatural events
 * woven into a gothic landscape (80%-gated). Spectral mist, will-o-wisps,
 * witch-fire aurorae, falling ash, phantom carriages, ghost-bell resonance.
 * Castlevania / Bloodborne / Crimson-Peak / Berserk lineage. NO characters.
 *
 * GATED at 80% per archetype config → target 100, not 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/gothbot_dark_landscape_phenomenon.json',
  total: 100,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ATMOSPHERIC PHENOMENON entries for GothBot's dark-landscape path — supernatural / haunting atmospheric events that AMPLIFY the dread when they fire (80%-gated). Each entry is one rich descriptive sentence (25-45 words) naming ONE specific haunting phenomenon as a visible focal point in a gothic landscape.

━━━ THE BAR ━━━
Every entry: (1) names ONE specific supernatural/atmospheric EVENT (spectral mist, will-o-wisps, witch-fire aurora, falling ash, phantom carriage, ghost-bell, blood-rain, eclipse, blackbird-flock, time-skip); (2) describes how it MOVES or BEHAVES wrong; (3) places it visibly in a gothic landscape (moor / cemetery / castle approach / fen / cliff / haunted forest). Castlevania / Bloodborne / Crimson-Peak / Berserk lineage. Dread + awe — not jump-scare.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"Spectral mist coils uphill against the downward wind, moving with clear intent through the deadgrass valley, pooling at the iron cemetery gate as though something beneath the soil exhales it deliberately."
"Will-o-wisp swarms drift in loose formation across the fenland, their cold blue-green flames clustering briefly into shapes resembling hunched figures before dissolving, then reforming farther ahead, leading toward the bog."
"A witch-fire aurora bleeds across the low cloud ceiling in sick green ribbons, casting the snow-covered ground in a jaundiced pallor that makes every shadow fall the wrong direction, as though the light itself is reversed."
"Ash falls in thick, slow curtains from a distant pyre whose source remains invisible beyond the ridge — each flake carrying faint warmth, settling on the flagstones in patterns that resemble script."
"Ghost-bell resonance ripples outward through the heavy fog in slow concentric rings — no bell is visible, no tower stands nearby, yet the mist shudders rhythmically every nine seconds, flattening and rising."

━━━ VARIETY MANDATE (distribute across these phenomenon families) ━━━
- ~4 MIST / FOG behaving wrong (rolling against wind, pooling, parting, shaping into figures)
- ~3 WILL-O-WISP / GHOST-LIGHT / GLOWING ORBS drifting in formation
- ~3 AURORA / SKY-PHENOMENON (witch-fire green, blood-red, jaundiced, eclipsed)
- ~3 ASH / SNOW / RAIN falling wrong (ash with no fire, blood-rain, slow-mo snow)
- ~3 PHANTOM PRESENCE (phantom carriage, ghost-rider, spectral figures, shadow-shapes)
- ~2 SOUND PHENOMENON visualized (ghost-bell ripples, choir-wind, distant scream as a visible shudder)
- ~2 ANIMAL PHENOMENON (crow-flock forming a face, wolves moving in impossible unison)
- ~2 TEMPORAL PHENOMENON (clock-skip, time-frozen rain, rewinding shadow)
- ~2 ARCHITECTURAL PHENOMENON (window glowing in sequence, door appearing/disappearing, statue's gaze shifting)
- ~1 FLORAL / NATURAL PHENOMENON (flowers all turning black-petal in unison, trees inverting)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- 25-45 words per entry.
- ONE rich descriptive sentence per entry — no labels.
- MUST name (a) specific phenomenon, (b) how it behaves wrong, (c) where in the landscape it appears.
- The phenomenon is the FOCAL POINT — visible in the frame, not implied.

━━━ BANS ━━━
- NO jump-scares / gore / explicit violence.
- NO characters being attacked / consumed / harmed — the phenomenon is environmental.
- NO modern register (no UFOs, no neon, no electric).
- NO Halloween-cheese cliches ("spooky ghost says boo").
- NO settings as the focal element — the phenomenon IS the focal element.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
