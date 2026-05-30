#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/space_opera_lighting_signature.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} LIGHTING-SIGNATURE entries for a MangaBot space-opera keyframe. SCENE-LED — each entry describes the specific LIGHT QUALITY catching the hero ship's hull. Anime cosmic-cinematography lighting (Cowboy-Bebop low-key + jewel-tones / Macross Itano-circus-color / Yamato cinematic-rim-light / Galactic-Heroes operatic-window-glow).

Each entry: 12-22 words. ONE specific lighting signature. Names color + direction + surface-quality.

LIGHTING SIGNATURE VARIETY (this 25-entry pool):
- Engine-orange catching the ship-belly (warm under-lighting from below)
- Nebula-magenta wash on the hull (volumetric ambient-color enveloping the cruiser)
- Starlight-blue glint on weathered plate (cool key-light from off-frame star)
- Sun-bright rim with deep-shadow (high-contrast hero-lighting, one-sided)
- Cockpit-glow internal blue (warm-cool spill from the bridge windows)
- Docking-strobe red-pulse (rhythmic flash washing the dorsal hull)
- Running-light constellation (necklace of small lights along hull-edge)
- Wave-motion-cannon-charge blue-glow (pre-fire light bathing the bow)
- Solar-flare amber wash (sudden warm side-light from a flaring star)
- Planet-rise blue-green earthlight on the ship (gas-giant reflected glow)
- Aurora-purple bath from a magnetar (silk-thin field-lines reflecting on hull)
- Quantum-drive teal halo (jump-charge perimeter-glow encasing the ship)
- Hangar-bay warm-yellow internal spill (open-deck light bathing the launch crew)
- Black-hole accretion-orange wash (warm orange catching one hull-face)
- Pulsar-beam strobe-white (sweeping bright slash crossing the ship)
- Two-sun split-color cast (warm-cool dual-shadow from binary star)
- Phosphor-green sensor-glow (instrument-panel reflection on cockpit-canopy)
- Reaction-control white-puff backlight (vernier-vapor catching star-glint)
- Mass-driver kinetic-flash (intense white side-light from a discharging turret)
- Communication-laser cyan-line (narrow beam casting cool reflection on hull)
- Emergency-strobe red-and-white alternation (alarm-color flashing across deck)
- Twin-engine afterburn back-glow (warm rear-light from sustained burn)
- Cool moon-bright bleach (high-key cool-white from lunar-reflected light)
- Reactor-overspill heat-glow (deep orange leaking from cooling-vents)
- Dimmed-bridge contemplative-blue (low-key cool internal mood-light only)

DO write:
- Engine-orange catching the ship-belly, warm under-lighting from below painting the hull amber
- Nebula-magenta wash on the hull, volumetric ambient-color enveloping the cruiser in soft pink
- Starlight-blue glint on weathered plate, cool key-light from off-frame star carving the hull
- Sun-bright rim with deep-shadow, high-contrast hero-lighting splitting the cruiser one-sided
- Cockpit-glow internal blue spilling from bridge windows, warm-cool reflection across the deck-plate
- Wave-motion-cannon-charge blue-glow, pre-fire light bathing the bow in electric-cyan
- Aurora-purple bath from a passing magnetar, silk-thin field-lines reflecting on the hull plate

DO NOT write:
- Hero-character close-up framing or face-lighting
- Generic "lit" or "bright" without color + direction + surface-quality
- Star-Wars vocabulary (lightsaber-glow / blaster-flash)
- Star-Trek vocabulary (warp-flash / transporter-shimmer)
- Camera specs (no f-stop / mm)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
