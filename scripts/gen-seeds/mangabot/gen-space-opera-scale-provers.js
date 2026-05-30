#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/space_opera_scale_provers.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} SCALE-PROVER entries for a MangaBot space-opera keyframe. SCENE-LED — each entry names ONE TINY detail on or near the hero starship that proves its monumental scale. The figure/object is small. The ship is hero.

⚠️ CRITICAL ANTI-HERO-PORTRAIT GUARDRAIL: NEVER write close-up / portrait / face-visible / chest-up / "pilot in foreground". The pilot/crew/EVA-figure must be TINY (1-5% of frame) and only present as a scale-prover. NEVER make the figure the subject.

Each entry: 12-22 words. ONE specific scale-prover. Anchor it to a specific point on or near the ship.

SCALE-PROVER VARIETY (this 25-entry pool):
- EVA-suited engineer tiny on the hull plate (1% of frame, mid-repair)
- Open cockpit canopy revealing tiny pilot silhouette inside
- Crew on walkway between docking-pylons (silhouettes at mid-distance)
- Shuttle-craft tiny at the cruiser's airlock (relative-size 1:50)
- Tug-tender approaching the hero ship (small attendant craft for scale)
- Docking-port refueling-rig connected to the hull (engineering-yard scale)
- Antenna-array with a tiny engineer climbing the mast
- Launch-tower with tiny worker on the upper-platform
- Formation of escort fighters at the cruiser's tail (relative-size 1:30)
- Mooring-cable spider-web stretching from hull to dock with tiny techs walking it
- Ore-conveyor with tiny operator silhouettes against the conveyor-mass
- Cargo-pallet array on the launch-deck, tiny loader-suit moving between
- Service-drone swarm (tiny robotic forms working a hull-section)
- Hangar-door cracked open with tiny crew silhouettes in the warm-lit interior
- Fueling-arm extended with tiny tech in EVA-suit at the coupling
- Bridge-window row with tiny crew-silhouettes lit from within (scale = many windows)
- Pilot's-helmet-visor silhouette in the cockpit-canopy (tiny against the hull-mass)
- Inspection-walkway running the length of the hull with tiny figures spaced along
- Lifeboat-pod row at the airlock-bay with tiny boarding-crew silhouettes
- Mass-driver gun-port with a tiny crew-tech checking the breech-block
- Catapult-launch-deck with tiny launch-officer arm-up at the side
- Hull-numbers stenciled-large with tiny EVA-tech painting them (scale = letter-height = human)
- Repair-scaffolding wrapping a damaged hull-section with tiny welder-flares
- Sub-orbital tender at the docking-collar with tiny crew transferring
- Forward-observation deck with tiny crew silhouettes against the cosmic backdrop

DO write:
- An EVA-suited engineer tiny on the hull plate, the human-figure 1% of the frame proving the ship's mass
- Open cockpit canopy revealing a tiny pilot silhouette inside, helmet barely visible against the hull
- Crew on the docking-walkway between pylons, silhouettes at mid-distance giving the ship scale
- Formation of escort fighters at the cruiser's tail, relative-size 1:30 making the hero-ship monumental
- Hangar-door cracked open with tiny crew silhouettes in the warm-lit interior, scale-cue against hull-mass
- Antenna-array along the dorsal-spine with a tiny engineer climbing the mast, dwarfed by the structure
- Hull-numbers stenciled vast with a tiny EVA-tech painting them, the letter-height equal to a person

DO NOT write:
- Hero close-up / portrait / face-visible / chest-up / waist-up framing of any character
- "Pilot in foreground" or "engineer fills frame" or "crew dominating shot"
- The figure as subject — the figure must be TINY (1-5% of frame) and scale-proving only
- Anything without a specific anchor-point on or near the ship
- Generic "person near ship" — name the position + activity

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
