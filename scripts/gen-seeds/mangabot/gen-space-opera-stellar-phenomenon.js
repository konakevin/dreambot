#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/space_opera_stellar_phenomenon.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} STELLAR-PHENOMENON entries for a MangaBot space-opera keyframe. SCENE-LED — each entry names ONE specific deep-cosmic spectacle that occupies the BACKDROP behind the hero ship. NOT the cosmic-setting (different pool — that's the location/stage); THIS is the spectacular ASTROPHYSICAL EVENT visible in the same frame.

Each entry: 12-22 words. ONE specific anime-cosmic phenomenon. Visual + dramatic.

STELLAR PHENOMENON VARIETY (this 25-entry pool):
- Supernova-aftermath cloud (vast color-shocked debris ring, blue-magenta core)
- Pulsar-beam sweeping across the frame (narrow lighthouse-beam crossing the void)
- Magnetar-aurora wrapping a dead-star (silk-thin magnetic-field lines visualized)
- Black-hole accretion-disk (orange-blue spiral, photon-ring distortion)
- Nebula-tendrils backlit by distant stars (volumetric gas-pillars cutting the backdrop)
- Cosmic-string filament (impossibly-long luminous tendril splitting the sky)
- Galactic-spiral arm in background (full spiral-galaxy filling backdrop)
- Comet passing with tail (ion-tail + dust-tail diverging at the nucleus)
- Planet-shadow eclipse (gas-giant occulting its star, corona-arcs visible)
- Aurora on a gas-giant (Jupiter-style polar light-show in atmosphere below)
- Twin-sun double-set (two stars at separated horizons sinking together)
- Stellar-nursery glow (proto-stars embedded in dust-cloud, color-rich)
- Quasar-jet plume (relativistic jet shooting from an active galactic-center)
- Wolf-Rayet star nebula bubble (blue-white shell around a dying massive star)
- Eta-Carinae-style homunculus-nebula (twin-lobed dust-cloud around a hyper-star)
- Crab-nebula-style filaments (chaotic shock-ring around a pulsar core)
- Gravitational-lensing arc (Einstein-ring around a distant galaxy-cluster)
- Solar-flare prominence-arc (sun-edge with massive arc-loop of plasma)
- Cosmic-microwave-background visualized (subtle warm-cold blotches across the field)
- Dark-matter halo glimmer (faint blue-shimmer ring around a galaxy)
- Gamma-ray burst afterglow (bright fading point with shockwave-ring expanding)
- Tidal-disruption event (star being torn into a debris-stream by a black hole)
- Multi-star cluster (globular-cluster as a brilliant jeweled-ball in the backdrop)
- Hypervelocity-star streaking (bright point with debris-trail across the field)
- Cosmic-dust pillar (Eagle-Nebula-style finger-of-creation column in distance)

DO write:
- A supernova-aftermath cloud filling the backdrop, vast color-shocked debris ring with blue-magenta core
- A pulsar-beam sweeping across the frame, narrow lighthouse-beam crossing the void behind the ship
- A black-hole accretion-disk dominating the backdrop, orange-blue spiral with photon-ring distortion
- Nebula-tendrils backlit by distant stars, volumetric gas-pillars cutting the backdrop in silhouette
- A galactic-spiral arm filling the backdrop, full spiral-galaxy painted across the sky behind the cruiser
- A comet passing with twin-tail, ion-tail and dust-tail diverging at the nucleus, scale-prover in mid-frame
- A cosmic-string filament splitting the sky, impossibly-long luminous tendril cutting through starfield

DO NOT write:
- Star-Wars phenomena (Death-Star-explosion / hyperspace-tunnel-trek-style)
- Star-Trek phenomena (subspace-anomaly / Q-distortion)
- Real-world Hubble/JWST naming (no "Pillars of Creation by Hubble")
- The hero ship — this is the BACKDROP phenomenon
- Generic "stars" or "space dust" without specific named phenomenon
- Cosmic-setting (location) — this pool is the ASTROPHYSICAL SPECTACLE only

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
