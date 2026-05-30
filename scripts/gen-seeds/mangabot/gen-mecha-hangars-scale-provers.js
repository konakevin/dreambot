#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mecha_hangars_scale_provers.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} SCALE-PROVER entries for a MangaBot mecha-hangar keyframe. THIS POOL'S ONLY JOB is to put a TINY HUMAN-SCALE element in the frame at the mech's feet / shoulders / hands so the mech reads MASSIVE.

⚠️ EVERY entry must include AT LEAST ONE tiny human-scale element. Without scale-provers, Flux renders a "medium-size action figure" instead of a giant mech. The mech is the hero; the scale-prover is a tiny depth-prop.

Each entry: 12-22 words. ONE specific scale-proving element (or small group). Always tiny relative to the mech.

SCALE-PROVER VARIETY:
- ENGINEERS at the base of mech-feet (orange jumpsuits, clipboards held, looking up at the mech)
- OVERHEAD GANTRY-CRANE lowering replacement-armor panel (single operator visible in cab)
- PILOT-FIGURE climbing entry-ladder at mech's chest (helmet under arm, halfway up)
- SCAFFOLD-TOWER with three mechanics on different levels (welding shoulder-joint, sparks falling)
- FORKLIFT-TRUCK driving past mech's calf (carrying weapons-crate, miniaturized)
- TEAM OF FIVE engineers stretched across mech's foot (doing pre-flight checklist)
- HANGING CRANE-CABLES holding mech-arm in maintenance (cables thin as threads beside the arm)
- MECHANIC SPRAYING-PAINT on mech-shoulder via cherry-picker (lift-bucket dwarfed)
- CLIPBOARD-ENGINEER at the mech's foot, gesturing with handheld tablet
- TWO TECHS WELDING at the mech's elbow-joint via scaffold (sparks shower down past the calf)
- FUEL-TANKER TRUCK at the mech's hip (hose-up to refuel port, truck the size of a finger)
- DECK-CREW in flight-deck jumpsuits (yellow + green vests, signal-batons in hand, surrounding the foot)
- COMMANDER-FIGURE on raised catwalk at mech's shoulder-level (binoculars at eyes)
- MEDICAL-CART being wheeled past the mech's heel (paramedics with stretcher)
- AMMO-CART being wheeled to the mech's hand (shells dwarfed, crew pushing)
- ENGINEER-RAPPELLING down via gantry-cable at the mech's chest (carrying tool-kit)
- TINY PILOT figure standing on mech's outstretched palm (about to climb in)
- KEEL-WORKER hanging upside-down from mech's underside (welding undercarriage)
- TWO TECHS with fire-extinguishers at the mech's foot (one engine glow has flared)
- GROUND-CREW SIGNAL-MAN with light-batons directing mech-stride (small in the bottom-corner)
- HAZMAT-CREW in white suits at mech's coolant-port (sealing a leak)
- PROJECTION-SCREEN ENGINEER projecting blueprints onto mech's chest (laser-grid visible)
- THREE TECHS chained to safety-harness on mech's shoulder (mid-inspection, dangling)
- INSPECTION-PROBE on long telescoping arm reaching mech's eye (operator at base of probe)
- LITTLE TRACTOR-TUG towing weapons-pod past the mech's ankle

DO write:
- Two engineers in orange jumpsuits at the base of mech-feet, looking up, clipboards held to chest
- Overhead gantry-crane lowering a replacement-armor panel, single operator visible in the crane cab
- Pilot-figure climbing the entry-ladder at the mech's chest, helmet under one arm, halfway up
- Scaffold-tower with three mechanics on different levels welding the shoulder-joint, sparks falling
- Forklift-truck driving past the mech's calf carrying a weapons-crate, the truck small as a toy
- A team of five engineers stretched across the mech's foot, doing pre-flight checklist with tablets
- A fuel-tanker truck at the mech's hip with hose hooked to the refuel-port, truck dwarfed entirely

DO NOT write:
- Hero-portrait of a pilot face (pilots stay TINY)
- Crew that dominates the frame (these are SCALE-PROVERS, not subjects)
- Mech description (lives in mech_class / mech_detail)
- Setting walls (lives in hangar_setting)
- Camera angle (lives in camera_framing)
- Combat scene people

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
