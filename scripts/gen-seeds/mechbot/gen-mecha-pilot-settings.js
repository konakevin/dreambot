#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/mecha_pilot_settings.json',
  total: 200,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} SETTING descriptions for MechBot's mecha-pilots path. Each describes WHERE the pilot+mech scene takes place, 14-22 words. Setting is half the storytelling.

━━━ SETTING CATEGORIES (spread across all) ━━━
- Underground launch bay (vertical silo, lifting platform, blast doors)
- Cavernous hangar (rows of dormant mechs, gantries, mechanic catwalks)
- Carrier deck (skyship hangar, landing pads, deployment ramps)
- Cockpit interior closeup (HUD glow, instrument panels, canopy view to outside)
- Repair bay (open access ports, sparks, dangling cables, tool carts)
- Tarmac (open-air, rain or dust, mech being prepped)
- Briefing room with mech visible through glass
- Orbital drop platform (just before deployment, vacuum/space view)
- Pre-mission rooftop / deployment ridge (mech standing ready, vista beyond)
- Post-battle field (mech smoking, pilot just emerged)

━━━ ABSOLUTE BANS ━━━
- NO active battlefield with combat happening (that's titan-war-machines)
- NO desert wasteland (that's rust-apocalypse)
- NO factory floor with mining/salvage (that's industrial-machines)

━━━ EXAMPLES (write fresh) ━━━
- "Vertical launch silo at red-alert, klaxon-strobed walls, lifting platform raising the mech to surface"
- "Cavernous carrier hangar at low-light, four dormant mechs in bays, single overhead spotlight on the active one"
- "Cockpit interior with curved HUD glass, instrument readouts in red and amber, distant lightning visible through the canopy"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: setting category + lighting condition.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
