#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/alien_biomech_actions.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} ACTION descriptions for MechBot's alien-biomechs path. Each describes what the biomech is DOING, 12-18 words. Mid-motion alive — the organism is acting like an organism.

━━━ ACTION CATEGORIES ━━━
- Stalking (low silhouette, predatory advance, sensor-stalks scanning)
- Feeding (jaw cavity open, prey/carrion involved, coolant fluid spilling)
- Molting (old chitin shedding, fresh metal-plate emerging beneath)
- Signaling (organ-glow flaring, vocalization vapor, body-pose communication)
- Nesting (curled around eggs / pod-clutch / hatching cradles)
- Regenerating (visible wound, machine-flesh knitting closed, fluid sealing)
- Hunting (mid-pounce, mid-strike, chase posture)
- Observing (still posture, sensor-stalks oriented at off-frame subject)
- Sleeping in pod (curled inside organic-looking cocoon or resin-cradle)
- Dying (collapsing, fluid leaking, organ-glow dimming, last reflexes)
- Communing (multiple biomechs touching tendrils — alien hive-coordination)

━━━ EXAMPLES (write fresh) ━━━
- "Unfurling four cable-tendrils from jaw cavity toward something offscreen, viscera pulsing under translucent flesh"
- "Mid-pounce on a smaller creature, chitin-plated forelimbs splayed, jaw cavity open showing inner machinery"
- "Curled around a clutch of glowing pods, dorsal vents venting steam, sensor-stalks rotating to cover blind angles"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary verb + body part involved + biological/mechanical effect (fluid / glow / pose / vapor).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
