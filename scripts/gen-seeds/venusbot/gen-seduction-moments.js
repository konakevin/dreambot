#!/usr/bin/env node
/**
 * Generate 50 SEDUCTION MOMENTS — cyberpunk nightlife scenes where
 * she's alone and the viewer happens upon her. Used in seduction path.
 *
 * Each is a candid cyberpunk-bar / alley / subway / rooftop / hover-limo
 * scene where she's existing naturally. No posing. No second figures.
 * The camera is a voyeur's angle.
 *
 * Output: scripts/bots/venusbot/seeds/seduction_moments.json
 */

const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/venusbot/seeds/seduction_moments.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} CYBERPUNK NIGHTLIFE scene seeds for a cyborg-assassin woman. Each is a scene where she is ALONE in a cyberpunk setting, existing naturally. The viewer happens upon her — she is NOT posing for the camera.

━━━ VIBE ━━━

Cyberpunk neon underworld. Nightclubs, bars, alleys, rooftops, subway platforms, hover-limos, arcades, vending-machine corners, noodle counters, elevators, balconies. Neon saturation, rain-slicked concrete, holographic ads, magenta strobes, teal shadows. She is present — the hottest thing in the frame — but she is doing her own thing.

━━━ SOLO COMPOSITION — NON-NEGOTIABLE ━━━

ZERO second figures. No crowd, no chauffeur, no companion, no target in frame, no bartender, no man at the bar. She is the ONLY person in the scene. Ambient cyberpunk crowd/society can be implied by sound/light/signage but never rendered as visible figures.

━━━ WHAT MAKES A GOOD MOMENT ━━━

- Specific cyberpunk location (vary widely — don't cluster on bars)
- Her body is doing something in the scene (standing, leaning, sitting, walking, waiting, reaching, smoking, sipping)
- Implied sense that something about to happen — she's hunting, waiting for a mark, winding down after a hit, killing time in her territory
- Sexiness comes from HER + the light + the silhouette, not from flirting
- Sometimes she's looking straight at the camera (natural eye-catch), sometimes she hasn't noticed it

━━━ CONTENT ━━━

Each entry is 25-40 words. Vary widely:
- Location (don't all be bars — use alleys, rooftops, subway, parking garages, hover-vehicles, neon arcades, fire escapes, phone booths, vending corners, noodle counters, underground raves, etc.)
- Her activity (don't always be "lighting a cigarette" or "holding a drink" — vary)
- Time of day (3am / dawn / twilight / late night / deep night)
- Framing suggestion (can suggest viewer angle: from across street, through rain, from doorway, etc.)

━━━ BANNED ━━━

- No second figures in the frame
- No "she poses"/"modeling"/"editorial"
- No repeating of props — vary what she's holding / doing
- No clichéd scenes (she's NOT always smoking or drinking)

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
  maxTokens: 4000,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
