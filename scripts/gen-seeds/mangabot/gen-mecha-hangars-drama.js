#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mecha_hangars_drama.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} DRAMA entries for a MangaBot mecha-hangar keyframe. Each entry is a HANGAR-EVENT NARRATIVE BEAT — fires only 40% of the time (gated). It should add a story beat without breaking the hangar-state (no combat).

Each entry: 12-22 words. ONE specific hangar-event beat. Should add motion + meaning to the scene.

DRAMA VARIETY (all hangar-state events — not combat):
- OVERHEAD CRANE swings cargo across hangar from upper-right (silhouetted against bay-lights)
- COCKPIT-CANOPY LIFTING OPEN (hydraulic hiss-vapor venting, pilot beginning to climb in)
- HANGAR-DOORS creaking apart in BG (revealing dawn sky beyond, dust blowing in)
- FIRST-FLIGHT ENGINES igniting at mech-thruster array (glow brightening, vapor billowing)
- MECH-EYES FLICKERING ONLINE for the first time in scene (cyan-blue power-up glow)
- BATTLEFIELD-RUMBLE overhead, dust shaking from hangar roof (concussion blast nearby)
- ENGINEER RAPPELLING down via gantry-cable carrying tool-kit (mid-descent across the chest)
- MISSILE-LOADERS WHEELING IN a rack of warheads to the mech's shoulder pylons
- FUEL-LINE BEING DISCONNECTED at the refuel-port (last drops dripping, hose coiling back)
- ARMOR-PANEL BEING LOWERED INTO PLACE by a crane (single panel descending toward shoulder)
- DECK-CREW SIGNALING LAUNCH with batons crossed overhead (mech beginning forward lean)
- HANGAR-ALARM STROBE ACTIVATING (red light begins washing the deck, deployment imminent)
- LAUNCH-CATAPULT TENSIONING beneath the mech-feet (rails locking-in with deep mechanical click)
- HATCH-BLOWN-OPEN venting steam (emergency-release pressure equalization at the chest-port)
- TECH-LEAD SHOUTING into a handheld radio at the mech's foot (gesturing up at the head)
- WARNING-PRINTER spewing diagnostic paper at the maintenance-console (operator scrambling)
- AMMO-BELT BEING FED into the shoulder-cannon mid-load (belt arching down from overhead hoist)
- FLOOR-PANEL RETRACTING beneath the mech (revealing launch-shaft below, mech sinking into deployment)
- WELDING-CART BEING PUSHED clear of the deck (cart wheels squeaking, deck-crew jogging)
- HANGAR-LIGHTS DROPPING FROM WHITE TO RED (deployment-state alert, all hands going to stations)
- CREW HUSTLING DOWN GANTRY-LADDERS away from the mech (rapid retreat in advance of power-up)
- COCKPIT-DISPLAY-SCREENS CYCLING ON one by one (visible through the canopy, blue-cyan glow)
- HANGAR-DOOR SHADOW SWEEPS across the mech as doors slide (light-bar moving up the chest)
- SCRAP-CART OVERTURNING in midground (debris spilling, tech jumping aside)
- BLAST-DOORS CLOSING WITH HYDRAULIC THUD (sealing the bay for engine-test)

DO write:
- Overhead crane swings cargo across the hangar from upper-right, silhouetted against the bay-lights
- Cockpit canopy lifting open with hydraulic hiss-vapor venting, pilot beginning to climb in via ladder
- Hangar-doors creaking apart in the BG, revealing dawn sky beyond, dust and wind blowing in
- First-flight engines igniting at the mech-thruster array, glow brightening, vapor billowing across the deck
- Mech-eyes flickering online for the first time in the scene, cyan-blue power-up glow building
- Battlefield-rumble overhead, dust shaking from the hangar roof from a concussion blast nearby
- An engineer rappelling down via gantry-cable carrying a tool-kit, mid-descent across the mech's chest

DO NOT write:
- Combat sequences (this is HANGAR not battlefield)
- Pilot-face close-ups
- Anything that pulls the camera off the mech as hero
- "Mech-vs-mech battle" / "explosion engulfs the mech"

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
