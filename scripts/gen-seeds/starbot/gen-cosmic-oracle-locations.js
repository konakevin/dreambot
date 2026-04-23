#!/usr/bin/env node
const fs = require('fs');
try { fs.unlinkSync('scripts/bots/starbot/seeds/cosmic_oracle_locations.json'); } catch (_) {}
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cosmic_oracle_locations.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} WILD / OTHERWORLDLY / OUTER-SPACE LOCATION descriptions for StarBot's cosmic-oracle path — painted-space-art sci-fi scenes. Draw wide inspiration from the vast catalog of sci-fi cinema, games, and novels. Quote the AESTHETIC of these worlds (ring-world-segment / ice-moon / desert-dune-planet / tree-canopy / lava-river-crust / neon-rain-city / etc.) — NOT character names (NO Luke, Han, Leia, Vader, Ripley, Shepard, Garrus, Master-Chief, Cortana, Spock, Kirk, Paul, Chani, etc.).

Each entry: 25-40 words. ONE specific alien/cosmic location with full time-of-cosmic-day + visible cosmic-light-source + atmospheric detail baked in.

━━━ INSPIRATION BANK (draw from these worlds freely — name the world directly when evocative, never the characters) ━━━

STAR WARS: Mos-Eisley-cantina sandstone moons, Coruscant skyscraper-canyon metropolis, Kashyyyk tree-city canopies, Naboo Renaissance-domed lake-country, Hoth ice-plains with tauntaun-tracks, Dagobah swamp-jungle, Mustafar lava rivers, Endor forest-moons, Geonosis red-rock ziggurats, Kamino storm-ocean platform-cities, Jakku star-destroyer-wreck desert, Crait salt-flats with crimson-dust undercurrent, Jedha moon-temples, Exegol Sith-throne cavern, Scarif tropical-archipelago-with-Imperial-base, Bespin cloud-city

DUNE: Arrakis spice-dunes and sandworm-scale ridges, Caladan sea-cliff citadels, Giedi-Prime black-sun stadium, Ix industrial underground, Salusa-Secundus prison-planet, Kaitain baroque imperial palaces, the Shield-Wall under spice-harvesters

HALO: Forerunner ringworld interior (continent-curving skyward), Halo-ring-segment with blue-sky-horizon curving up overhead, Covenant-architecture purple-and-gold curved spires, Sangheili high-council chambers, Forerunner monolith-ruins carved with Precursor-glyphs, UNSC-corridor gun-grey military ship, Installation-04 arctic zones, Requiem shield-world-interior, Mendicant-Bias crystalline-library

GUARDIANS / MCU COSMIC: Knowhere severed-Celestial-head mining colony, Contraxia neon-pleasure moon under snow, Sovereign gold-chrome throne worlds, Sakaar junk-portal-gladiator planet, Titan shattered-moon city-ruins, Morag tidal-temple ruins, Eternals Domo-ship interiors, Asgardian-bifrost rainbow-bridge

ALIEN / PROMETHEUS: LV-426 black-basalt storm-moon, Derelict-Engineer biomechanical-ship cyclopean-interior, Weyland-Yutani cryo-corridor, Sulaco gun-grey colonial-marine corridors, Engineer-homeworld monolith-mesas, xenomorph resin-walled hive-tunnels, Hadley's-Hope colony-processor

STAR TREK: Vulcan red-volcano mountain-temples, Risa tropical-beach-resort under ringed-planets, Cardassia-Prime brutalist military-architecture, Bajoran wormhole-mouth blue-white vortex, Qo'noS volcanic-obsidian fortress-city, Deep-Space-Nine Cardassian-spur-station, Delta-Quadrant borg-cube cube-corridor, Nimbus-III desert-of-galactic-peace, Risa tropical-hedonist moon, Ferenginar eternal-rain-neon-bazaar, Cetacean-Institute water-chambers

MASS EFFECT: Citadel Presidium garden-ring-arms, Omega lawless-neon station-interior, Tuchanka post-apocalyptic Krogan-badlands, Noveria ice-research-facility, Ilos ruined-Prothean-archives, Rannoch geth-quarian red-desert, Virmire salarian-base on ocean, Tali-Vigil geth-server-farm

WARHAMMER 40K: Hive-city sky-reaching spires above toxic undercity, Necron-tomb-world glowing-green-glyph pyramids, Eldar craftworld wraithbone spire-interior, Imperial cathedral-ship two-kilometer nave, Ork-junk-planet scrap-city, Tau sleek-white colony, Adeptus-Mechanicus forge-world red-industry, Dark-Eldar Commorragh dark-spire city

BLADE RUNNER / CYBERPUNK: Los-Angeles-2049 rain-neon perpetual-night with towering hologram-ads, orange-dust abandoned Las-Vegas-silhouette at sunset, off-world colony advertising-pyramids, Wallace-Corp inverted-water-ceiling throne-room, Tyrell-Corp pyramid-cathedral interior

COWBOY BEBOP / FAR-FUTURE NOIR: Martian shanty-dome colonies at gold-dust-dusk, Venusian cloud-plant floating-cities, asteroid-belt shipyards with neon-dive-bars, Callisto arctic-swap-stop, Ganymede dockyards, Tharsis jazz-clubs

THE EXPANSE: Eros-station cramped-corridors under red-alert, Ganymede greenhouse-domes with frozen-water-above, Ilus strange-indigo protomolecule ruins, Tycho-station spinning-wheel industrial, Ceres dock-rings, Laconia strange-alien-ruin landscapes, Belter vac-corridor

ANNIHILATION / WEIRD-BIOLOGY: iridescent shimmer-zone refraction-mutation, crystal-tree mutated gardens, lighthouse-at-world's-edge warping-reality border-zone, cellular-phase body-horror landscapes, flower-bone growths, Area-X morphing terrain

INTERSTELLAR / BIG-PHYSICS: Miller's water-world with kilometer-tall tsunami, Mann's ice-planet frozen-cloud-ceiling, Gargantua black-hole accretion-disk with lens-halo horizon, tesseract-library-behind-the-fabric-of-spacetime, wormhole-mouth outside-Saturn

FIREFLY / SPACE-WESTERNS: frontier-moon saloon-towns at red-dust-sunset, terraforming-dust-dome colonies, reaver-raider wreck-fleets, Serenity-valley dead-battlefield, border-planet dirt-streets

AVATAR / PANDORA: bioluminescent jungle-floor with glowing-fiber fungi, floating Hallelujah mountains, soul-tree spirit-grove, blue-cerulean night-bioluminescence

STARGATE / ANCIENTS: Atlantis-floating-city stepped-pyramid, Pegasus-Wraith-hive-ship biomechanical interior, Ancient-outpost snow-buried, Chulak temple-mesa, Abydos-desert pyramid-stargate

BABYLON-5 / BSG: rotating-space-station zero-g hub, Vorlon encounter-suit-ship organic-glowing interior, Minbari crystal-cathedral, Caprica-before-fall rose-sunset, Galactica gun-grey hangar-bay

FOUNDATION / FAR-FUTURE IMPERIAL: Trantor planet-wide-city at dusk, Star's-End exile-library on ice-moon, Terminus frontier-colony, Synnax star-monastery rose-dome

COSMIC-CREATIVE (invent wild, not IP-tied): living-nebula-creature mid-orbit, Dyson-sphere-under-construction, ring-world-interior curving-overhead, wormhole-throat-mid-transit, dead-god-statue-ships gravesite, neutron-star-surface magnetic-flare, cosmic-dust-storm between-stars, Oort-cloud ice-debris field, time-dilation-zone near-black-hole, coronal-loop-inside-a-star, dark-matter-visible anomaly

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
1. SETTING — specific alien/cosmic environment named (reference the inspiration-bank world OR invent cosmic-creative)
2. TIME-OF-COSMIC-DAY — baked in (nebula-twilight / pulsar-midnight / binary-dawn / supernova-noon / wormhole-flare / event-horizon-eternity / time-dilation-noon / gravity-shear-hour / spore-bloom-dawn)
3. VISIBLE COSMIC-LIGHT-SOURCE IN FRAME — specific cosmic-object visible (black-hole lens-halo / living-nebula-eye / fractured-ringworld-segment / deity-ship-hull / dying-red-giant / crystal-spike refraction / Halo-ring-curvature / protomolecule-glow)
4. ATMOSPHERIC DETAIL — exotic not generic ("fluorescent-spore-fog" / "gravity-shear-shimmer" / "bioluminescent-plasma" / "methane-rain" / "solar-wind-aurora" / "Covenant-plasma-glow" / "protomolecule-shimmer" / "xenomorph-resin-steam")

━━━ VARIETY MANDATE ━━━
Across 25 entries:
- MAX 2 per inspiration-franchise (don't do 5 Star Wars and 0 Halo) — rotate
- VARY color palette — some entries NO red/orange (all-green-and-violet / all-blue-and-white / all-magenta-and-black / all-amber-and-black / all-white-and-silver / all-cyan-and-purple)
- VARY planet-vs-space — at least 10 entries NOT on a planet surface (in-space / on-megastructure / inside-something / drifting)
- VARY atmosphere — clear-vacuum / heat-shimmer / rain-curtain / plasma-storm / particle-hail / zero-atmosphere / sparkle-storm

━━━ BANNED ━━━
- NO character names (Luke / Han / Leia / Vader / Ripley / Shepard / Master-Chief / Cortana / Spock / Kirk / Paul / Chani / Geralt / etc.)
- NO "blue sky" generic — specify alien sky colors
- NO Earth-like weather that's just Earth — make it alien
- NO characters / people in the description (pool picks characters separately)
- NO "temple" / "cathedral" more than 2 entries total
- NO "observatory" / "viewport" / "rotunda" more than 2 entries total
- NO defaulting to "desert with twin suns" — that's been overdone

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
