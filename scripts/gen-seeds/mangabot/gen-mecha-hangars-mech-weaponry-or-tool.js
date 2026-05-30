#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mecha_hangars_mech_weaponry_or_tool.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} WEAPONRY-OR-TOOL entries for a MangaBot mecha-hangar keyframe. Each entry describes what the mech is HOLDING / EQUIPPED-WITH / has-on-its-rack — combat hardware OR maintenance tool. This is HANGAR-state, so weapons can be holstered, racked, or in mid-load.

Each entry: 12-22 words. ONE specific weapon / tool / equipment loadout. Genre-coded (anime-mecha hardware).

WEAPONRY/TOOL VARIETY:
- BEAM-RIFLE slung over right shoulder (Gundam-style, ammo-pack on hip)
- TWIN SHOULDER-CANNONS folded into chest-recess (gun-barrels visible at slot)
- HOVER-THRUSTER-PACK on back (glow vents emitting blue, flight-pack mounted)
- MAGNETIC-CLAMP TOOL replacing right hand (maintenance configuration)
- MINING-DRILL ARM-ATTACHMENT (rotors spinning slowly at idle)
- SHIELD strapped to left arm (shock-absorber lattice, edge-glow)
- ENERGY-BLADE HILT at hip (blade dormant, hilt magnetic-mounted)
- POLICE-BATON in right hand + RIOT-SHIELD in left (Patlabor configuration)
- EMPTY-HANDED — weapons in foreground crate awaiting load-out
- CARGO-GRAPPLE-CLAW mid-handoff with crew (claw extended, payload visible)
- TWIN HEAVY-MACHINE-GUNS at the hips (drum-mags loaded, barrels gleaming)
- MACROSS-STYLE GUN-POD ON BACK (rifle-pack snapped to a magnetic dorsal-rail)
- MISSILE-RACK on each shoulder (six tubes per side, missiles visible)
- DOUBLE BEAM-SABER PAIR mounted at the small of the back (hilts crossed)
- HUGE BUSTER-SWORD planted point-down in front of mech (held two-handed at hilt)
- INDUSTRIAL TORCH-CUTTER tool replacing the right hand (mid-cut, sparks flying)
- WRENCH-PROBE-ATTACHMENT replacing the right hand (engineer config)
- BAZOOKA SLUNG ACROSS BACK (single barrel, mounted vertical along the spine)
- COMBAT KNIFE held in reverse-grip in one hand (CQB stance)
- TWO BEAM-RIFLES held one in each hand (heavy-loadout)
- RAIL-CANNON ON SHOULDER-PYLON (long barrel projecting forward over the head)
- SHIELD + LANCE configuration (Knightmare-style cavalry kit, lance carried diagonally)
- GUN-POD AND SHIELD on opposite shoulders (assault loadout)
- ENERGY-WHIP coiled at hip (Big-O style chrome-whip)
- ARMORED FIST plus integrated arm-cannon (heavy-melee + ranged hybrid)

DO write:
- Giant beam-rifle slung over the right shoulder, ammo-pack on hip, hand-grip resting at the trigger guard
- Twin shoulder-cannons folded into chest-recess, gun-barrels visible at the slot, vapor venting from the breech
- Hover-thruster-pack on the back with blue glow-vents, flight-pack mounted between the shoulder blades
- Magnetic-clamp tool replacing the right hand, currently gripping a steel cargo-pallet at chest height
- Mining-drill arm-attachment with rotors spinning slowly at idle, oil dripping from the tip
- Shield strapped to the left arm with shock-absorber lattice, edge glowing blue from a kinetic field
- Energy-blade hilt at the hip, blade dormant, hilt magnetic-mounted, second hilt visible on opposite hip

DO NOT write:
- Posture (lives in mech_posture)
- Surface paint (lives in mech_detail)
- Setting (lives in hangar_setting)
- Combat against another mech (this is hangar)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
