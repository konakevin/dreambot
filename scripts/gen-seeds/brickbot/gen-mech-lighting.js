#!/usr/bin/env node
/**
 * BRICKBOT_MECH_LIGHTING — light for mech / titan / robot dioramas.
 * Audit 2026-06-05: 45 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_mech_lighting.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} LIGHTING entries for BrickBot's mech path — towering mech / battle-robot brick MOC photography. Each entry: ONE sentence, 25-40 words, naming light source + direction + color quality + how it falls across brick mech armor.

━━━ THE BAR ━━━
Every entry names a SPECIFIC source (hangar-flood / battle-fire / cockpit-HUD glow / weapon-charge / arc-weld / overcast-dust / volcanic-glow / etc.) PLUS direction PLUS color quality PLUS how it touches the greebled brick mech (pooling under shoulder plates, trans-glow in joint gaps, hard shadows from overhead floods, etc.).

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 HANGAR / FLOODLIGHT: overhead bank of cool floods, sodium-amber pools, fluorescent grid
- ~5 BATTLE / FIRE-GLOW: trans-orange wreckage-glow, lit one flank, smoke-haze ambient
- ~4 WEAPON-CHARGE / TRANS-GLOW: trans-cyan pre-fire charge, trans-orange muzzle-prep
- ~3 COCKPIT-INTERIOR HUD: trans-amber underglow on pilot face, trans-cyan readouts
- ~3 ARC-WELD / MAINTENANCE: hard trans-blue welding-sparks, hot pinpoint local light
- ~3 NIGHT-BATTLE: dark ambient, flares + tracer-fire trans-yellow streaks
- ~3 STORM / OVERCAST: diffuse cool grey, no shadow contrast, flat dust-storm
- ~3 SUNRISE / SUNSET COMBAT: warm amber raking across mech, long shadows
- ~2 VOLCANIC / LAVA: trans-orange underglow from lava, hot ambient
- ~2 SEARCHLIGHT / DEFENSE: sweeping trans-yellow beams from defense-grid
- ~2 MOONLIT NIGHT: silver-blue, deep shadows
- ~1 DAYLIT URBAN: high sun in city ruins, sharp shadow
- ~1 SPACE-VOID: harsh sun + deep-black shadow, no atmospheric softening

━━━ FORMAT ━━━
Each entry: ONE sentence, 25-40 words. Touchpoints:
"Hangar floodlight — banks of cool-white overhead floods raking down the brick mech, hard plastic shadows pooling beneath every armor-plate, the bay-maintenance neutral cast"
"Battle fire-glow — trans-orange warmth from off-frame wreckage washing one flank of the mech, the opposite side falling into cool war-shadow, the combat tension dialed up"
"Cockpit-HUD trans-amber underglow rising from below the pilot's visor, casting up across her helmet and the surrounding brick instruments, deep blue shadow on the upper canopy"

━━━ BANS ━━━
- NO photoreal vocab
- NO fluid-motion verbs ("light flows")
- NO mood-only descriptors
- NO photographer name-drops

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
