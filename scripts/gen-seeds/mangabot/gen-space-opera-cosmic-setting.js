#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/space_opera_cosmic_setting.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} COSMIC-SETTING entries for a MangaBot space-opera keyframe. SCENE-LED — each entry is the BACKDROP / LOCATION the hero starship occupies. NOT the ship (different pool) — the cosmic STAGE around the ship.

⚠️ CRITICAL ANTI-STAR-WARS GUARDRAIL: NEVER write Tatooine / Hoth / Endor / Coruscant / Death-Star-trench / Mos-Eisley / Imperial / Mandalorian / stormtrooper-occupied. NEVER Star-Trek (Enterprise / starfleet / federation / warp-nacelle / nebula-class). Anime cosmic register ONLY (Cowboy-Bebop Mars-orbit / Macross SDF / Yamato Cosmo-Fleet / Galactic-Heroes Iserlohn / GitS orbital-Tokyo / Sidonia hyperspace-corridor).

Each entry: 12-22 words. ONE specific cosmic backdrop. Anime-cinematography palette + clear visual identity.

COSMIC SETTING VARIETY (this 25-entry pool):
- Orbital dry-dock above a brown-blue gas-giant (industrial scaffolding around the ship)
- Asteroid-belt mining operation (rocky chunks tumbling slow-mo around the cruiser)
- Nebula pink-magenta cloud (volumetric gas-tendrils enveloping the ship)
- Binary-star system (two suns at separated horizons, double cast-shadow)
- Jupiter-orbit with great-red-spot below (storm-system filling lower frame)
- Ring-system of a Saturn-analog (icy ring-arcs cutting through the frame at angle)
- Lunar-surface launch-bay (regolith plains under starfield, hangar-door open)
- Wormhole-event-horizon (color-shifted lensing ring at frame-edge)
- Debris-field graveyard (drifting wrecks scattered like reef-bones)
- Hyperspace-jump corridor (blueshift-tunnel walls collapsing in)
- Orbital-elevator station (ribbon-cable descending to planet-curve below)
- Lagrange-point colony (cylindrical O-Neill habitat in mid-frame, ship docking)
- Abandoned-station drift (derelict superstructure, no running-lights, ghost-silent)
- Event-horizon black-hole-glow (accretion-disk warping starlight)
- Iserlohn-fortress-style mega-station (Galactic-Heroes spherical citadel in distance)
- Sidonia hyperspace-corridor (compressed starfield streaks toward vanishing point)
- Mars-orbit dust-storm-below (rust-orange planet-curve filling lower frame)
- Neutron-star pulsar-beam (intense narrow beam sweeping at intervals)
- Cosmic-string filament (impossibly-long luminous tendril cutting starfield)
- Galactic-spiral arm overhead (spiral-galaxy filling backdrop)
- Frozen-comet drift (icy nucleus with sublimating coma)
- Solar-flare proximity (sun-disk corona-arcs in left-frame, ship silhouetted)
- Carrier-fleet rendezvous (multiple capital-ships at distance, hero cruiser foreground)
- Quantum-jump pre-flash zone (pre-collapse spacetime distortion at hull-perimeter)
- Iapetus-style icy-moon backdrop (dark/bright hemispheres split, cracked-ice surface)

DO write:
- Orbital dry-dock above a brown-blue gas-giant, industrial scaffolding enveloping the ship's hull
- Asteroid-belt mining operation, rocky chunks tumbling slow-motion around the cruiser
- Pink-magenta nebula cloud, volumetric gas-tendrils enveloping the ship in soft glow
- Binary-star system with two suns at separated horizons, double cast-shadow on the hull
- Jupiter-orbit with great-red-spot below, the storm-system filling the lower frame
- Wormhole event-horizon, color-shifted lensing ring at frame-edge, starfield warped
- Debris-field graveyard, drifting wrecks scattered like reef-bones around the cruiser
- Iserlohn-fortress-style mega-station, vast spherical citadel in distance, hero cruiser foreground

DO NOT write:
- Star-Wars planet vocabulary (Tatooine / Hoth / Endor / Coruscant / Mustafar / Naboo)
- Death-Star-trench / Mos-Eisley / Imperial-occupied
- Star-Trek vocabulary (Enterprise / starfleet / federation / nebula-class / Cardassian)
- Real-world space (ISS / SpaceX / NASA / Hubble / Webb / Apollo)
- The ship itself — this is the BACKDROP pool
- Hero-character framings or ground-level surface scenes
- Generic "space" without specific anime-cosmic identity

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
