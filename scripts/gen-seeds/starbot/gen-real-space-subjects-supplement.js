#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

// SUPPLEMENT 2026-05-03 — APPENDS dramatic-event celestial subjects to
// real_space_subjects.json. The base pool was 46% nebulae, missing:
// quasars, asteroid belts, black holes (more), pulsars/magnetars,
// galaxy collisions, supernovae mid-explosion. Every entry pushes the
// "blown-out NASA cranked to 11" register — over-exaggerated detail,
// dramatic events visible mid-action, multiple things going on at once.

generatePool({
  outPath: 'scripts/bots/starbot/seeds/real_space_subjects.json',
  total: 250, // existing 200 + 50 new
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} OVER-EXAGGERATED astrophotography subjects for StarBot's real-space path. Each entry is a dense phrase (20-40 words) describing a REAL celestial object PUNCHED UP — the NASA / Hubble / JWST version cranked to 11, with dramatic events captured mid-action, multiple things happening in the frame at once.

THE LOAD-BEARING RULE: every entry shows a celestial object DOING SOMETHING dramatic — jets, shockwaves, aurora, lensing, gravitational tidal stripping, x-ray flares, supernova mid-detonation. Not just "the nebula sits there" — "the nebula is being torn apart by a Wolf-Rayet star's stellar wind, ionization fronts cascading outward in three colors at once."

━━━ CATEGORY TARGETS — distribute across ${n} ━━━

(~25%) **QUASARS / ACTIVE GALACTIC NUCLEI** — bright accretion disks, twin polar jets shooting kilolight-years across, gravitational lensing distortions, Doppler-shifted color gradients. Examples: 3C 273, OJ 287, M87's central engine, Centaurus A AGN, NGC 1275 Perseus jet structure.

(~20%) **BLACK HOLES + LENSED BACKGROUNDS** — event horizon shadow rim, accretion-disk warping due to relativistic effects, photon-ring at the edge, lensed background stars smeared into Einstein rings. Examples: M87* with photon ring, Sagittarius A* near-galactic-center, TON 618 ultramassive, paired binary black holes inspiraling.

(~15%) **PULSARS / MAGNETARS / NEUTRON STARS** — twin radio-beam cones sweeping like lighthouses, magnetic field lines visualized as glowing rope, x-ray flares mid-burst, neutron-star surface starquake fractures. Examples: Crab Pulsar at center of nebula, Vela Pulsar with twin jets, SGR 1806-20 magnetar mid-flare.

(~15%) **ASTEROID BELTS / KUIPER OBJECTS** — varied composition (metallic / icy / dusty / silicate) tumbling through frame, Trojan clusters at L4/L5 Lagrange points, comet-trail tails, debris streams from disrupted parent bodies. Examples: Main-belt asteroid 16 Psyche metallic surface detail, Eris trans-Neptunian, comet 67P close-up with dust jets.

(~15%) **GALAXY COLLISIONS / TIDAL EVENTS** — multiple galaxies in mid-merger, tidal-bridge of stars stretched between, induced starburst regions blazing pink with ionized hydrogen, central black holes about to fuse. Examples: Antennae Galaxies mid-collision, NGC 4676 Mice Galaxies tidal arms, Mayall's Object polar-ring formation, Cartwheel Galaxy ring-shock cascade.

(~10%) **SUPERNOVAE / SHOCKWAVES** — supernova mid-explosion (light-echo expanding outward), Wolf-Rayet star ejecting bipolar nebula, supernova remnants with shock-fronts visible (ionized blue-white edges), kilonova ejecta from neutron-star merger. Examples: SN 1987A ring expansion, Cassiopeia A in x-ray with shocked iron, Vela supernova remnant filaments.

━━━ THE BLOWN-OUT REGISTER ━━━

Every entry must include:
1. **A specific named real object** OR specific identification (e.g., "spiral galaxy NGC 1097 Seyfert 1", "G292.0+1.8 supernova remnant")
2. **Wavelength/false-color treatment** specified (JWST near-infrared, Hubble visible, Chandra x-ray, ALMA radio-millimeter, multi-wavelength composite)
3. **A dramatic mid-event phrase** — what's happening RIGHT NOW in the frame (jets shooting, shockwave expanding, tidal-stripping, lensing distortion, x-ray flare, accretion-disk turbulence, gravitational wave inspiral)
4. **Multi-element scene** — at least 2-3 things going on (e.g., black hole accretion + photon ring + lensed background galaxy + nearby blue-supergiant companion)
5. **Color saturation pushed to wallpaper-worthy maximum** — false-color cranked, every emission line visible

━━━ FEW-SHOT EXAMPLES ━━━

EX-1: "Quasar 3C 273 in multi-wavelength composite, brilliant blue-white accretion disk warping in x-ray Chandra view, twin polar jets shooting 200,000 light-years across in Hubble visible, gravitational lensing of background galaxy smearing into Einstein arc at lower-right, ionized halo cranked to electric magenta saturation."

EX-2: "M87 supermassive black hole shadow with sharp photon-ring rim in EHT 230GHz radio, accretion-disk asymmetric brightness from Doppler boosting, nearby relativistic jet shooting blue-white into M87's elliptical halo, background quasar lensed into double-image at frame edge."

EX-3: "Crab Pulsar at heart of Crab Nebula in Hubble-Chandra composite, twin gamma-ray beams sweeping like lighthouse, magnetar wind torus inflating ionized purple-blue bubble, supernova remnant filaments cranked emerald-amber in optical, x-ray pulsar wind nebula glowing electric cyan inside."

EX-4: "Asteroid 16 Psyche close-up high-resolution radar imagery, metallic NiFe surface with crater chains and exposed iron veins glittering, Trojan companion asteroid in foreground, dust streams from recent micrometeorite impact still suspended in zero-gravity halo, deep black space with diamond-bright stars."

EX-5: "Antennae Galaxies NGC 4038/4039 mid-merger composite, tidal-arm bridge of disrupted stars stretching between cores, induced starburst regions blazing pink with ionized hydrogen alpha, two supermassive black holes about to fuse at galactic-center cyan-flare, surrounding intergalactic medium glowing in JWST infrared."

EX-6: "SN 1987A supernova remnant in multi-wavelength composite, expanding pearl-string ring of shocked stellar material in optical, central neutron star x-ray pulse cranked vivid violet, ALMA radio dust cloud surrounding shock front, JWST infrared revealing newly-formed dust silhouettes against the inner ring."

EX-7: "Sagittarius A* Galactic-center black hole shadow, photon-ring sharp in radio EHT, accretion-disk turbulence in Doppler-shifted blue-red, S2 star screaming past at periapsis with relativistic jets visible, X-ray flare mid-eruption brightening the entire frame, dense star cluster surrounding the central engine."

EX-8: "Pulsar Vela X with twin gamma-ray beams photographed mid-sweep, magnetic-field lines visualized as luminous violet rope arcing across thirty light-years, surrounding supernova remnant filaments saturated in chartreuse-amber, central neutron star pinpoint white-hot at the core, x-ray companion flickering blue-white."

EX-9: "Comet C/2014 UN271 Bernardinelli-Bernstein in close-up, multi-jet ice-volatile geysers erupting from sublimating surface, dust trail stretching three astronomical units across the frame, fluorescent green coma in cyanogen emission, blue ion tail pushed straight by solar wind, surrounding vacuum filled with diamond stars."

EX-10: "Black-hole binary inspiral GW150914 visualized as relativistic accretion-disk torus around merging pair, gravitational-wave distortions warping background star field into ripples, Hawking radiation visualized as hot red-orange edge glow, massive jets shooting from poles, surrounding host elliptical galaxy core in wide-field."

━━━ HARD RULES ━━━

- 20-40 words per entry, dense
- REAL named astronomical subject OR specific identification
- Wavelength/false-color treatment named
- Mid-event dramatic phrase included
- Multi-element scene (2-3+ things happening)
- Saturation cranked language explicit
- NO meta-framing (do NOT say "shown on a monitor" / "displayed by" / "image of")
- NO characters, ships, station, environment elements
- NO clouds-of-dust unless attached to a celestial event (supernova shockwave, comet jet, etc.)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Each entry is a dense over-exaggerated celestial subject with mid-event drama.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
