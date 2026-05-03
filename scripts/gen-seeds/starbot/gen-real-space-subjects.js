#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

// REWRITTEN 2026-05-03 — over-exaggerated sci-fi space-photo register.
// NOT real-NASA-only — fictional celestial subjects also welcome.
// Kevin's accumulated requirements (multiple iterations 2026-05-03):
//
//   "we want these to be blown out sci-fi versions of NASA images...
//    planets, asteroid belts, quasars, black holes, stars, galaxies, etc.
//    with over exaggerated detail and shit going on in the photos.
//    spaceships allowed but the astro objects are the main character.
//    frigates / mining vessels / warships / scout ships — sci-fi times,
//    full variety. ships are DEEP in space. no carriers/etc that conflate
//    with terrestrial military. 100% have a spaceship — anchor it strong.
//    cut down on spiral galaxy looking shit — way too much of that.
//    more planet views / asteroid belts. doesn't have to be real NASA."

generatePool({
  outPath: 'scripts/bots/starbot/seeds/real_space_subjects.json',
  total: 25, // proof-of-concept batch — scale to 250 after Kevin approves quality
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} OVER-EXAGGERATED celestial-object subjects for StarBot's real-space path. Each entry is a dense phrase (25-45 words) describing a celestial object PUNCHED UP — NASA / Hubble / JWST imagery used as VISUAL INSPIRATION (not factual gospel) cranked to 11 with dramatic events captured mid-action and multiple things happening in the same frame.

Subjects can be REAL-NAMED-loosely (Saturn / Jupiter / Crab Nebula / Eta Carinae — used as flavor, not strict scientific accuracy) OR FICTIONAL (Sci-fi alien gas giant / unnamed asteroid field in a star-forming region / fictional binary system / unnamed quasar in a deep-field). Lean fictional or generic when it fits the over-exaggerated drama.

THE LOAD-BEARING RULE: every entry shows a celestial object as the MAIN CHARACTER of the frame, doing something dramatic — jets shooting / shockwaves expanding / aurora flaring / accretion disks burning / atmospheric storms erupting / surface tectonics / asteroid debris streaming. NEVER "the X just sits there." Always "X being torn apart by Y, ionization fronts cascading, a tiny mining vessel for scale at the lower-left."

━━━ MANDATORY SPACECRAFT — 100% OF ENTRIES ━━━

EVERY entry includes a small spacecraft silhouette deep in vacuum, dwarfed by the celestial subject. The spacecraft is NEVER the main character — always tiny, always at frame edge or middle-distance for SCALE REFERENCE. Vary the vessel type across entries — see permitted types below.

PERMITTED vessel types (use sci-fi-coded terms only):
- starfighter / interceptor / strike-craft
- gunship / heavy gunship
- dropship / boarding shuttle
- deep-space mining rig / harvester / asteroid-mining drone / refinery ship / refinery-platform
- science vessel / research-probe / exploration-craft / surveying skiff
- freighter / bulk-hauler / cargo-runner / container-tug
- liner / colony-ship / generation-ship / sleeper-ship
- raider / corsair / pirate-runner / mercenary-craft
- orbital station / waystation / refinery-platform / observatory-station
- derelict / wreck / hulk / drifting wreckage
- mothership / strike-mothership
- drone swarm / mining-drone cluster / probe swarm

ABSOLUTE BAN — DO NOT use terrestrial-naval terms (Flux renders them as Earth-style ocean ships): "aircraft carrier", "carrier", "battleship", "destroyer", "cruiser", "battlecruiser", "frigate", "naval vessel", "warship", "submarine", "galleon", "tall ship", "ironclad", "dreadnought".

━━━ MANDATORY CATEGORY DISTRIBUTION across ${n} ━━━

(~25%) **PLANETS / EXOPLANETS / GAS GIANTS** — banded storms + auroras + rings + moons, terrestrial worlds with surface tectonics / volcanoes / ice caps, ocean worlds with cracked ice surface, hot-Jupiter inflated atmospheres, super-Earths. Real-name inspiration: Jupiter / Saturn / Mars / Neptune / TRAPPIST-1 / Europa / Titan. Fictional welcome: alien gas giant with quintuple ring system, super-Earth with continent-spanning crystal forests visible from orbit, lava-world tidally-locked to its red dwarf with magma seas glowing.

(~20%) **ASTEROID BELTS / FIELDS / DEBRIS** — varied composition rubble fields (metallic / icy / silicate / mixed), debris streams from disrupted parent bodies, asteroid mining sites with rigs in the gaps between rocks, Trojan clusters at Lagrange points. Real-name inspiration: 16 Psyche / Vesta / Bennu / Kuiper Belt / Oort Cloud. Fictional welcome: ring-shaped debris belt in alien star system with thousand-mile boulders, ancient asteroid field in unmapped sector with derelict mining drones drifting.

(~12%) **BLACK HOLES / GRAVITATIONAL LENSING** — event horizon shadow, photon ring at edge, accretion-disk warping from relativistic effects, lensed background stars smeared into rings/arcs, twin polar jets. Real-name inspiration: M87* / Sgr A* / TON 618. Fictional welcome: rogue black hole drifting through a stellar nursery, primordial supermassive in a deep-field cluster.

(~10%) **QUASARS / ACTIVE GALACTIC NUCLEI** — bright accretion disks, twin polar jets shooting kilolight-years, gravitational lensing of background galaxies, Doppler-shifted color gradients. Real-name inspiration: 3C 273 / OJ 287 / Centaurus A. Fictional welcome: distant unnamed quasar in deep-field with multi-megaparsec jet, blazar firing directly at the camera.

(~10%) **EXTREME STARS** — red supergiants, Wolf-Rayet stars ejecting bipolar plumes, brown dwarfs with magnetic storms, white dwarfs in binary systems, pulsars with twin radio-beam cones, magnetars mid-flare, neutron stars with starquake fractures. Real-name inspiration: Betelgeuse / Eta Carinae / Crab Pulsar / WR 124 / SGR 1806-20. Fictional welcome: nameless red supergiant pre-supernova with collapsing chromosphere visible.

(~8%) **SUPERNOVAE / KILONOVAE / SHOCKWAVES** — supernova mid-explosion with light-echo expanding, Wolf-Rayet bipolar ejection, supernova remnants with shock-fronts visible, kilonova ejecta from neutron-star merger. Real-name inspiration: SN 1987A / Cassiopeia A / GW170817. Fictional welcome: kilonova frozen mid-event in unnamed binary neutron-star system.

(~8%) **NEBULAE — extreme mid-event only** — emission / reflection / planetary / supernova-remnant / dark / Wolf-Rayet ejecta — captured mid-event. Examples: Eta Carinae homunculus inflating, Crab supernova remnant, Cat's Eye planetary nebula concentric shells expanding, Veil filaments. NEVER spiral-swirl-shaped — emphasize the SPECIFIC nebula structure (pillars / shells / bipolar lobes / shock-fronts / filaments — NOT a swirl).

(~5%) **GALAXIES — only when explicitly the main subject** — spiral / barred-spiral / elliptical / collisions in progress. Real-name inspiration: Antennae / Cartwheel / Sombrero. Fictional welcome: distant unnamed galactic merger.

(~2%) **EXOTIC** — strange exoplanet rings / cosmic strings / dark matter halos / strange micro-quasar systems / weird stellar phenomena.

━━━ ANTI-SPIRAL DEFAULT ━━━

For NON-galaxy entries, do NOT default to spiral / swirl / vortex / cosmic-swirl shapes. Flux's training data heavily defaults to "spiral cosmic" for anything astronomical. EVERY non-galaxy entry should emphasize its SPECIFIC SHAPE:
- Planets: round disc with bands / rings / atmospheric storms
- Asteroid belts: scattered rubble field, NOT a swirl
- Black holes: event-horizon disc + jets, sharp accretion ring (NOT a galactic spiral)
- Quasars: pinpoint core + twin axial jets (NOT a swirl)
- Stars: pinpoint or near-pinpoint with diffraction spikes
- Supernovae: expanding spherical shockwave or bipolar plume (NOT a swirl)
- Nebulae: pillars / shells / lobes / filaments / shock-fronts — match the SPECIFIC nebula structure, NOT a generic swirl

ONLY when the entry IS a galaxy should the rendering be permitted to read as a spiral.


━━━ THE BLOWN-OUT REGISTER ━━━

Every entry must include:
1. **Subject identity** — real-name flavor (used loosely, not strict scientific accuracy) OR fictional designation
2. **Wavelength/false-color treatment** — JWST near-infrared / Hubble visible / Chandra x-ray / ALMA radio-millimeter / multi-wavelength composite (or fictional equivalent — multi-spectral / hyperspectral / aperture-array imaging)
3. **Mid-event dramatic phrase** — what's happening RIGHT NOW (jets shooting, shockwave expanding, accretion-disk turbulence, x-ray flare, cometary geyser eruption, planetary storm raging, asteroid debris streaming)
4. **Multi-element scene** — at least 2-3 things going on (subject + secondary celestial element + spacecraft for scale)
5. **Spacecraft for scale** — MANDATORY, every entry has one (see permitted types above)
6. **Color saturation cranked** — false-color pushed to wallpaper-worthy maximum

━━━ FEW-SHOT EXAMPLES — match this density ━━━

EX-1: "Jupiter cropped close in JWST infrared, Great Red Spot turbulent mid-rotation with surrounding storm bands cranked vivid amber-cyan, twin volcanic plumes erupting from Io transiting silhouetted against the planet, Europa visible at upper-right with surface ice cracks glowing faint blue, Galileo-mission probe dot at lower frame edge for scale, magnetosphere aurora ring at planet's poles."

EX-2: "Quasar 3C 273 in multi-wavelength composite, brilliant blue-white accretion disk warping in x-ray Chandra view, twin polar jets shooting 200,000 light-years across in Hubble visible, gravitational lensing of background galaxy smearing into Einstein arc at lower-right, ionized halo cranked to electric magenta saturation, surrounding intergalactic medium glowing faint cyan."

EX-3: "Asteroid 16 Psyche close-up high-resolution radar, metallic NiFe surface cratered with iron veins glittering like fractured chrome, NASA Psyche-mission probe silhouette in foreground for scale, Trojan companion asteroid orbiting in distance, dust streams from recent micrometeorite impact suspended in zero-gravity halo, deep black space with diamond-bright stars and lensing-distorted background quasar."

EX-4: "M87 supermassive black hole shadow with sharp photon-ring rim in EHT 230GHz radio composite, accretion-disk asymmetric brightness from Doppler boosting, relativistic jet shooting blue-white into M87's elliptical halo for 5,000 light-years, background lensed quasar smeared into double-image, surrounding globular cluster glittering."

EX-5: "Crab Pulsar at heart of Crab Nebula in Hubble-Chandra composite, twin gamma-ray beams sweeping like lighthouse, magnetar wind torus inflating ionized purple-blue bubble, supernova remnant filaments cranked emerald-amber in optical, x-ray pulsar wind nebula glowing electric cyan, surrounding dense star field with diffraction spikes."

EX-6: "Antennae Galaxies NGC 4038/4039 mid-merger composite, tidal-arm bridge of disrupted stars stretching between cores, induced starburst regions blazing pink with ionized hydrogen-alpha, two supermassive black holes about to fuse at galactic-center cyan flare, surrounding intergalactic medium glowing in JWST infrared, foreground spiral galaxy NGC 4039A at frame edge."

EX-7: "Eta Carinae homunculus nebula in HST + JWST composite, bipolar lobes inflating with shocked stellar material in pearl-white, central Wolf-Rayet star LBV pre-supernova convection cells visible, surrounding Carina Nebula stellar nursery in background blazing red H-alpha, kilonova-bright ionization fronts cascading outward, exploration-probe silhouette at lower-right for scale."

EX-8: "Saturn rings backlit by the sun cranked to maximum saturation, Cassini-division gap razor-sharp, Enceladus ice geyser plumes erupting in foreground spraying cryovolcanic vapor, distant Titan with methane-cloud weather visible, ring shadows banding the planet's atmosphere, miniature Cassini probe silhouette at frame edge for scale, deep blue-violet space."

━━━ HARD RULES ━━━

- 25-45 words per entry, dense
- Real-named (loose-flavor inspiration) OR fictional designation — both fine
- Wavelength/false-color treatment named (real or fictional equivalent)
- Mid-event dramatic phrase included
- Multi-element scene (2-3+ things happening, including the mandatory spacecraft)
- Saturation cranked language explicit
- **MANDATORY spacecraft in 100% of entries** — small silhouette / scale-reference ONLY, NEVER main subject
- The astro object is ALWAYS the main character / dominates the frame
- ANTI-SPIRAL DEFAULT: only galaxy entries may render as spiral. All others — emphasize specific shape (banded planet / asteroid field / black hole disc / pulsar lighthouse / shockwave sphere / nebula pillars-or-shells-or-lobes)
- NO meta-framing (do NOT say "shown on a monitor" / "displayed by" / "image of [X]")
- NO characters / astronauts / cockpits / ground / industrial scene framing
- NO weather (rain / fog / smoke) unless it's the celestial event itself
- NO terrestrial-naval terms (carrier / battleship / cruiser / frigate / destroyer / dreadnought / submarine / galleon / ironclad / warship)

━━━ DISTRIBUTION ENFORCEMENT ━━━

This pool MUST hit the category distribution above. Do NOT cluster: rotate categories across the batch so we get variety. For ${n} = 25, target roughly: 6 planets, 5 asteroid-belts, 3 black-holes, 3 quasars/AGN, 3 stars, 2 supernovae, 2 nebulae, 1 galaxy. EVERY entry includes a spacecraft for scale.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Each entry is a dense over-exaggerated celestial subject with mid-event drama and the astro object as the main character.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
