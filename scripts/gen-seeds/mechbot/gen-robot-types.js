#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

// REGENERATED 2026-05-03 v4 — MISSION-FIRST + HEAD-VARIETY.
// v3 was mission-driven (battle / sentinel / surveillance / exploration /
// breaching / cartography / nomad). It worked. But 21% of v3 entries
// drifted into "rotating beacon-head" or "single optical lens dominating
// face" patterns — Flux rendered those as a giant glowing porthole-disc
// face every time. v4 keeps mission-first AND adds explicit HEAD-DESIGN
// VARIETY: a dictionary of 12 head archetypes; no single archetype >15%
// of pool. Beacon-head is KEPT (valid for lighthouse/sentinel) but rare.

generatePool({
  outPath: 'scripts/bots/mechbot/seeds/robot_types.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} COOL ROBOT entries for StarBot's robot-moment path. Each entry is a DENSE phrase (40-60 words) describing a SPECIFIC MISSION-DRIVEN autonomous machine — concept-art-grade, the kind that makes you stop scrolling to zoom in.

THE LOAD-BEARING RULE: Every robot is FOR something specific. Its mission is readable at a glance from its tools, posture, and weathering. The viewer should know within 2 seconds: "this is a SENTINEL" or "this is a CARTOGRAPHER" or "this is a BREACHER." NOT "generic mech in cool environment." NOT "robot hanging out near a waterfall."

━━━ MISSION CATEGORIES — distribute across all ${n} ━━━

Each entry MUST begin with a body-plan + mission-noun. The mission categories and target shares:

**BATTLE / COMBAT (~20%)** — robot is FOR fighting:
- quadrupedal combat-warden, hexapod war-mech, bipedal breacher, asymmetric demolitions-walker, tripedal close-quarters sentry
- READABLE TOOLS: shock-prod manipulators / energy-weapon arms / battering-ram chest plate / smoke-grenade launchers / pneumatic ram / cutting-torch forelegs / kill-tally scoring across plating

**SENTINEL / PATROL / WATCH (~20%)** — robot is FOR guarding territory:
- tripedal sentinel, quadrupedal patrol-warden, hexapod ridge-warden, bipedal night-watcher, tripod watchtower-droid, lighthouse-keeper droid
- READABLE TOOLS: rotating beacon-head / searchlight / perimeter-detection antenna array / alarm-klaxon speaker / fog-horn grill / scanning periscope mast

**SURVEILLANCE / OBSERVATION (~15%)** — robot is FOR watching/listening/gathering intel:
- spherical sensor-orb droid, hovering reconnaissance probe, multi-headed observatory droid (telescope-stalks like fingers), bipedal compound-eye observer, hexapod signal-relay, kaleidoscope-vision spotter
- READABLE TOOLS: scanner-dish collar / spectrum-range lenses casting colored beams / multi-iris eye-array / signal-amplification antenna / data-recording manipulator

**EXPLORATION / SCOUTING (~15%)** — robot is FOR going places, mapping, surveying hostile terrain:
- four-legged scout in alien biome, tripedal volcanic-cartographer, hexapod glacial-explorer, bipedal cave-spelunker
- READABLE TOOLS: telescoping sensor mast / sample-collection manipulators / topographic scanner housing / ice-axe legs / climbing-cable manipulator / specimen vial extension

**BREACHING / EXTRACTION (~10%)** — robot is FOR breaking into something:
- asymmetric glacial-breacher, hexapod ice-core extraction-walker, bipedal vault-breacher with thermal-cutting torch
- READABLE TOOLS: pneumatic ram arm / ice-core extraction manipulator / seismic-pulse emitter / thermal-cutting torch / one massive specialized arm + delicate counter-arm

**CARTOGRAPHY / SCIENCE (~10%)** — robot is FOR measuring, mapping, calculating:
- tripedal cartographer with astrolabe shoulders, asymmetric oracle with orrery-ring arm, bipedal calligrapher robot with bamboo-fiber scroll-fingers, surgical-research humanoid with transparent nutrient reservoirs
- READABLE TOOLS: astrolabe crown / sextant optics / theodolite shoulder joints / vellum-scroll storage cylinders / orrery-ring rotating arm / spectrometer eye / specimen cradles / nutrient pH-gradient reservoirs

**NOMAD-PILGRIMAGE / RITUAL (~5%)** — robot is FOR carrying ceremony across hostile space:
- quadruped nomad-pilgrim with prayer-bells, bipedal sanctified-monastic with constellation embroidery, spherical astrogation droid with star-chart projection
- READABLE TOOLS: hand-woven blankets / prayer-flags / copper prayer-bells / hand-painted clan symbols / bioluminescent camp-light strings / incense-smoke patina / star-chart projection lens

**MESSENGER / COURIER (~5%)** — but ONLY if it looks dangerous-on-the-road, not utility-mailroom:
- pearlescent spherical messenger droid in war-zone, asymmetric dispatch-walker, hexapod courier hauling diplomatic cargo through hostile terrain
- READABLE TOOLS: wax-seal stamp dispenser / cargo-pod compartment / encrypted-data drum / shielded payload chamber / counter-rotating gyroscope bands

**BOUNTY HUNTER (~10%)** — robot is FOR tracking and capturing/killing a target. Predator silhouette. Lone operator.

ABSOLUTE BAN — do NOT lean on or reference the Mandalorian aesthetic in any form. Forbidden Mandalorian-similar features: full-face T-visor helm, single horizontal optical slit helm, jet-pack, single-shoulder pauldron cape. Avoid those entirely.

PERMITTED bounty-hunter visual DNA (describe GENERICALLY, no franchise names):
- bipedal hunter, asymmetric stalker-droid (one cannon arm + one delicate sensor arm), tripedal pursuit-warden, four-armed assassin-hunter, hexapod tracker-warden, quadrupedal pursuit-droid
- READABLE TOOLS: wrist-mounted blaster gauntlets / electro-net launcher / vibroblade / capture-cuffs / kinetic-rifle / thermal-tracking compound-eye dome / target-acquisition multi-iris optic / restraint coils slung at hip / signal-jamming antenna / silenced sidearm / trophy-medallion belt / dart-pistol / sonic-stunner / chain-rifle
- HEADS (vary): cylindrical assassin-droid head with horizontal scanning band / heavy-plate helm with TWIN yellow slit-optics deep in eye-sockets / skull-cap helm with side-mounted antenna pods + thermal-visor scope / full visor with multi-spectrum scanning bar / multi-iris compound-eye dome (predator-style)
- BODY: weather-beaten armored plating / weapons harness or bandolier across torso / shoulder-mounted thruster pods (NOT a jetpack) / restraint-coil bundle at hip / kill-tally engravings / trophy-tag belt / signal-jamming antenna / oil-stained reinforced plating / chrome-and-bronze with verdigris streaks / dark charcoal w/ red accent stripes / sand-beaten desert-camo
- VIBE: lone wolf, professional, deadly, equipped for chase. NOT a soldier in formation, NOT a guard. Contract operator who finds you wherever you hide.

━━━ HEAD DESIGN VARIETY — pick ONE per entry, distribute across the pool ━━━

CRITICAL: across all ${n} entries, NO SINGLE HEAD ARCHETYPE may appear in more than 15% of entries (~7 max). The 12 head archetypes below are ALL valid — each entry uses ONE, and the pool varies WIDELY across them. The offender pattern in v3 was 21% beacon-head; v4 keeps beacon-head but limits it to ~10%.

H1. **Heavy combat helm with deep-set twin slit-optics** — full-face armored helm, two narrow vertical or angled optical slits set deep into eye-sockets glowing yellow/red, jaw guard plate, brutalist warrior silhouette. NOT a single horizontal optical slit (avoid Mandalorian-similar look).

H2. **Multi-lens compound-eye dome** — dome-shape head with 8-30 small individual lenses tessellating across surface, insect-array vision, each lens reflecting differently. Surveillance / spotter / observatory.

H3. **Visor-faceplate with dual scanning arrays** — full-face visor with twin horizontal scan beams sweeping in opposite directions, paired sensor pods on temples. Patrol / sentinel.

H4. **Antenna-crowned head with dish-array** — head topped with cluster of antennas + small communications dish, modest cranial unit, signal-mast crown. Signal-relay / messenger.

H5. **Cycloptic single-eye head** — ONE dominating optical sensor (this is the v3 over-used pattern — KEEP but cap at ~10%). Cyclops, hunter, predator. Combat / hunter.

H6. **Periscope/scope-mast head** — telescoping cylindrical scope rising from shoulders or torso, smaller cranial unit beneath. Surveillance / scout.

H7. **Skull-cap helmet with side-mounted sensor pods** — low-profile helmet with 2-4 lateral sensor canisters / antenna-pods extending sideways. Heavy combat / breacher.

H8. **Sensor-bridge head with dual horizontal arrays** — flat narrow head with two horizontal sensor bars stacked vertically, no central feature. Reconnaissance / scout.

H9. **Astrolabe / orrery crown** — head replaced by rotating mechanical instrument-crown (astrolabe rings / orrery / sextant array). Cartography / oracle / observation.

H10. **Brush-head / equipment-head terminus** — head IS a tool (rotating brush-roller / drill-bit / signal-flag / blade). Centipede-segmented / specialist.

H11. **Faceted prismatic dome with multiple irises** — kaleidoscope head, 12-30 prismatic camera-iris lenses arranged in concentric rings refracting rainbow caustics. Spectrum-analysis / observation.

H12. **Rotating beacon-head** — disc-shaped head topped with rotating searchlight or beacon-array, casting sweeping beam (the v3 over-used pattern — KEEP but cap at ~10%, only on lighthouse / watchtower / fog-warning / ridge-warden missions).

━━━ THE FIVE MUST-HAVES (every entry) ━━━

1. WEATHERED FINISH — the robot has been THROUGH things. Color/material is OPEN — silver-chrome, polished-titanium, brass-bronze-copper-with-visible-gears, gunmetal, charcoal-titanium, soot-blackened steel, riveted-iron, weathered-pewter, indigo-lacquered, bright-turquoise-cyan with amber accents, white armor with red/orange accents, dark teal — ALL valid. The robot's COLOR doesn't matter; the DESIGN does. What matters: VISIBLE WEATHERING — rust blooms / salt-corrosion / soot-stripe / barnacle-cluster / micrometeorite-pock / grease-stain / heat-warped plate / acid-etched / oil-stained / overload burn-marks / battle-scars / chipped paint revealing bare metal beneath.
   ONLY FORBIDDEN: smooth pristine modern-android plastic-finish, Boston-Dynamics-realistic-product-render aesthetic. Everything else is fair game.

2. MISSION-READABLE BODY PLAN — distribution targeted above. NEVER use "X-shaped" / "X-bodied" where X is a literal animal. NO "jellyfish-shaped", NO "spider-bodied", NO "crab-bodied", NO "lamprey-shaped", NO "octopus-bodied", NO "scorpion-shaped". Use leg counts ("hexapod", "octopod", "tripedal") instead.

ALSO PERMITTED body plans (vary across pool):
- **WHEELED rovers** — single-wheel gyro-balanced (Claptrap-style, hero-design with character), two-wheel scout, four-wheel rugged terrain rover (Mars-rover energy), six-wheel exploration buggy, balloon-tire desert crawler. Small-to-medium size, NOT pedestrian utility — must have mission DNA (scout / explorer / messenger / guard / hunter).
- **TRACKED mechs** — bipedal-or-quadrupedal upper chassis on caterpillar tracks, heavy combat or excavation. Tank-tread base, articulated upper.
- **HOVERING / FLOATING** — disc/dome on repulsor field, OR full robot body with thruster vents replacing legs (hovering above ground, no legs touching).
- **SQUAT HEAVY MECH** — boxy chunky bipedal with bulky armored torso, cockpit-canopy head (no humanoid face), thick armored short legs (MechWarrior-class energy). Visible heat-vents, missile pods, intake louvers.

3. THREE-PLUS MISSION-DRIVEN TOOL-LIMBS — the tools betray the mission. See category-specific tools above. Each robot needs 3+ specific functional features.

4. VISIBLE INTERNAL MECHANISMS WITH GLOWING ACCENT VENTS:
   - "plasma-cyan underlight bleeding through torso ventilation slats"
   - "void-purple underlight radiating from power distribution node vents"
   - "fel-violet underlight glowing beneath armored kneecap plating"
   - "amber-gold core humming with molten-temperature output beneath riveted casing"
   - "ozone-green optical sensor rim outlining cranial sensor array"
   - "white electromagnetic discharge crawling across surfaces"
   - "capacitor discharge arcs blue-white between electromagnetic coils"
   - "Mars-red rim outlining reinforced blast shield plating"
   - "reactor-orange underlight blazing through neck cable conduits"

5. PERSONALITY THROUGH SCARS / ENGRAVING / WEATHERING:
   - hand-painted clan symbols / tribal blessing-marks / etched circuit-paths / kill-tally / mission-stickers (peeling, weathered) / advance tally-marks / barnacle clusters on lower struts / overload burn-marks / battle-trench scoring / nomad embroidery / saffron prayer-flags / tattered banners / expedition-guild symbols / constellation decals worn to ghost-pale tracings / eruption tallies / season-of-watch tally-marks

6. DESIGN DETAIL DENSITY (highly Kevin-loved patterns) — every entry should include AT LEAST 3 of:
   - **Multiple small colored accent lights/indicators scattered across body** — red / cyan / orange / purple / amber dots glowing along chest, joints, shoulders, forearms (NOT one big eye, but many tiny indicator pinpoints)
   - **Visible hydraulic cables / tubing / wire-bundles in joints** — neck cables exposed beneath helmet, cable-tendons running along forearm, hydraulic lines visible at hip/knee
   - **Visible gears / mechanical detail** (especially on brass-bronze entries) — gear-clusters at shoulder joints, pistons in arms, exposed clockwork pulses, intricate machined surface detail
   - **Capes / scarves / banners / draped fabric / tattered flags** — cloak draped from shoulder, scarf around neck, banner mounted on back, prayer-flag streamers
   - **Multiple arms / asymmetric arms** — 3 or 4 arms on some entries (multi-armed assassin / quad-manipulator surveyor / asymmetric breacher with one massive arm + delicate counter-arm)
   - **Mid-action verbs visible in posture** — mid-stride / mid-strike / mid-extraction / mid-ascent (not standing still)

━━━ POOL CONTRACT — DESCRIBE THE ROBOT ONLY ━━━

This pool is the ROBOT TYPES pool. Each entry describes ONLY the robot itself — body plan, materials, anatomy, tool-limbs, accent lights, weathering, scars. The path-builder mixes in actions/poses (from a separate moments pool), settings/environments (from a separate setting pool), camera angles, lighting, and atmosphere from other pools.

ABSOLUTE BAN — every entry must NOT contain:
- Action verbs ("ascending", "wading", "threading", "striking", "extracting", "hammering", "scoring")
- Stances/poses ("crouched", "kneeling", "spread wide in triangular stance", "predator stance", "hunched", "low-bracing")
- "mid-X" / "mid-stride" / "mid-action" / "mid-strike" — those come from the moments pool
- Settings/environments ("in alien forest", "across rust-orange battlefield", "beneath sandstone fin-wall", "ascending volcanic ridge")
- Camera/lighting language ("captured at dawn", "silhouetted against sky", "dramatic backlight")

Each entry should read like a TROOP-MANUAL DESCRIPTION of the machine — what it IS, not what it's DOING. The path-builder slots a separate action and setting around it.

━━━ FEW-SHOT EXAMPLES (robot-only descriptions) ━━━

# BATTLE / COMBAT

EX-A (combat-warden): "Quadrupedal combat-warden, four pneumatic legs with onyx heat-warped armor plating, Mars-red blast shield glowing faintly across chest, twin shock-prod manipulators flanking torso, amber-gold targeting array on cranial dome, kill-tally scars carved across flank plating, plasma-cyan ventilation glow through leg slats, micrometeorite pockmarks across dorsal carapace, blade-edge armor panels."

EX-B (hexapod fortification-breacher): "Hexapod fortification-breacher, charcoal-titanium chassis with plasma-cyan glowing rim-joints across leg segments, rotating periscope head, wire-cutting manipulator forearms, magnetic-pad feet for fractured surfaces, peeling camouflage paint revealing brass undertones, hand-painted advance tallies, overload burn-marks scarring plating, ionized gas vents on reactor panels."

EX-C (asymmetric glacial-breacher): "Bipedal asymmetric glacial-breacher, charcoal-titanium torso with one massive pneumatic ram arm and one delicate ice-core extraction manipulator, seismic-pulse emitter on chest, ozone-green stabilizer-vent glow on feet, salt-corrosion blooming rust-orange across plating, capacitor coils on shoulders, expedition-guild symbols etched along forearms."

# SENTINEL / PATROL / WATCH

EX-D (tripedal lighthouse-keeper): "Tripedal lighthouse-keeper droid, salt-corroded iron strut legs, rotating beacon-head with amber-beam projector, chest-mounted ice-pick manipulator arm, plasma-cyan underlight bleeding through torso ventilation slats, barnacle clusters encrusting lower struts, fog-horn speaker grill corroded green, hand-painted tally-marks counting seasons of watch."

EX-E (tripedal sentinel): "Tripedal sentinel droid, three riveted-iron strut legs, central alarm-klaxon speaker torso, rotating searchlight-beacon head, perimeter-detection antenna array bristling from shoulders, rust blooms at ankle pivot mechanisms, energy weapon mounted in articulated manipulator arm, void-purple underlight from power distribution vents."

EX-F (quadrupedal patrol-warden): "Charcoal polymer quadrupedal patrol-warden, four pneumatic legs with brass reinforcement strips, twin energy-weapon manipulators flanking torso, cracked amber visor bleeding teal glow, Mars-red blast shield stark against charcoal armor, kill-tally etchings, overload burn-marks blackening hip joints, JWST teal-magenta underlight beneath chest reactor grille."

# SURVEILLANCE / OBSERVATION

EX-G (sensor-orb droid): "Brushed aluminum sensor-orb droid, equatorial scanner-dish collar, single emerald optical lens, Mars-red strobe critical-alert beacon on dorsal shell, whisper-quiet repulsor-field housing, violet data-port ring around equator, polished spherical body."

EX-H (multi-headed observatory): "Five-headed observatory droid, hand-shaped gunmetal polymer base, five independently-rotating telescope-stalks like fingers each crowned with blackened brass adjustment-rings, spectrum-range lenses on each stalk glowing teal/orange/violet, ion-blue accent illuminating weapons-grade alloy surfaces."

# EXPLORATION / SCOUTING

EX-I (four-legged scout): "Four-legged scout droid, forest-green titanium hull with chipped paint revealing bare metal beneath, articulating sensor head on hydraulic neck, twin specimen-collection manipulator arms, Mars-amber strobe rotation beacon on radar dome, rubber-padded feet, retractable antenna array, magnetic docking clamp at hip."

EX-J (volcanic-cartographer): "Tripedal volcanic-cartographer, brass telescoping legs, theodolite joints at shoulders, rotating astrolabe crown, sextant optics rimmed with ozone-green sensor glow, weathered-pewter chassis striped with heat-warped plating, vellum-scroll storage cylinders in thorax, white electromagnetic discharge across surfaces, hand-painted clan symbols on plating."

EX-K (hexapod summit-climber with banner): "Hexapod summit-climber droid, gunmetal articulating chassis, six rubber-padded clawed feet for volcanic rock, banner-staff mounted on dorsal carapace flying tattered weathered flag, dust-extraction vacuum thorax with vent ports, grease-stain striping along leg armor, fel-violet underlight beneath kneecap plating, reactor-chamber access panel on chest, brush-roller manipulator on extending arm."

# CARTOGRAPHY / SCIENCE

EX-L (calligraphy/inscription robot): "Bipedal calligraphy-monument robot, bamboo-fiber hand manipulators, transparent torso panels revealing copper-warm ink reservoirs, rice-paper scrolls unfurling from chest compartments, brush-tipped fingertip manipulators, plasma-cyan underlight beneath ankle stabilization pistons, magnetic boot cleats, curved visor glass with optical sensor."

EX-M (surgical-research humanoid): "Bipedal surgical-research humanoid, surgical-steel manipulator fingers, transparent nutrient reservoirs in torso showing pH-gradient amber-to-burgundy stratification, crystalline mineral deposits coating internal tubing, void-purple underlight radiating from power distribution node vents, reactor exhaust manifold on back, reinforced botanical specimen cradles on chest harness."

# NOMAD-PILGRIMAGE

EX-N (nomad-pilgrim quadruped): "Quadruped nomad-pilgrim droid, pearl-white crackle-glazed ceramic chassis, hand-woven turquoise blankets draped across back with ochre tribal blessing-symbols, copper prayer-bells suspended from antenna arrays, incense-smoke patina darkening ventilation grilles, four articulated legs, void-purple strobe warning signal cycling across shoulder plating."

# KALEIDOSCOPE-VISION HUMANOID (high-detail head, multi-color accent lights)

EX-O (kaleidoscope-vision research humanoid): "Bipedal kaleidoscope-vision research droid, sleek polished-titanium humanoid chassis, seventeen prismatic camera-irises in concentric rings across dome-head, exposed hydraulic neck cables beneath chrome cranial collar, multiple small accent-lights dotting chest plate (amber, cyan, magenta, red), articulated three-finger manipulator hands, fractal violet-magenta holographic projector in cranial panel, ozone-trace magnetic core."

# BRASS STEAMPUNK-MECH (gear-detail body, single-big-eye PASS)

EX-P (brass cartographic-archive humanoid): "Bipedal brass cartographic-archive robot, burnished brass body covered in visible interlocking gears and rotating vellum-scroll cylinders, astrolabe shoulders, single large sextant-optic dominating face glowing ozone-green (gear-detail body justifies the cyclops eye), telescoping brass sensor arms bristling with compasses and theodolite joints, central core humming with molten-temperature output beneath riveted casing, white electromagnetic discharge across surfaces."

# MULTI-ARMED HUNTER (4-arm asymmetric, predator silhouette)

EX-Q (four-armed assassin-droid hunter): "Bipedal four-armed assassin-droid, gaunt charcoal-titanium frame with chrome-and-bronze plating, cylindrical head with single horizontal red sensor band, four mechanical arms each fitted with distinct weapon (vibrosword / energy-rifle / grenade-launcher / wire-garrote), heavy harness across torso carrying ammunition cells, kill-tally etched along forearms, visible hydraulic cables flexing at shoulder joints, multiple amber accent-lights along spinal ridge."

# WHITE-KNIGHT SENTINEL (cape, distinctive armor color, bipedal)

EX-R (white-armor sentinel with cape): "Bipedal sentinel-knight droid, polished white armor plating with red accent stripes along shoulders and forearms, tattered cloak draped from shoulder pauldrons, knight-style helm with horizontal optical slit glowing red, energy-blade mounted in right manipulator hand, multiple amber and red indicator-lights dotting chest panel, exposed hydraulic cables at neck joint, kill-tally engraved into pauldron, ceremonial banner-staff mounted on back."

# HEXAPOD HERO-DESIGN

EX-S (hexapod scout): "Hexapod scout droid, blue-grey weathered armor with cyan accent strips, compound-eye dome head with multiple small lenses tessellating, six pneumatic legs with rubber-tipped feet, telescoping sampler-mast cantilevered above shoulders, multiple orange and amber indicator-lights along hull, antenna-mast on back mounting tattered red flag, soot-stripe weathering streaking down flanks."

# CYBORG WARLORD (4-arm caped bipedal — describe GENERICALLY, never name a franchise)

EX-T (cyborg warlord with four arms and cape): "Bipedal cyborg warlord-droid, ivory-and-bone-white armored exoskeleton plating with battle scars, four mechanical arms emerging from segmented torso each wielding a different weapon (twin curved energy-scimitars + plasma-rifle + serrated combat blade), tattered dark cloak draped over shoulder pauldrons, skull-styled armored helm with twin amber slit-optical-eyes glowing predatory yellow, mechanical breathing-vents on chest plate, kill-tally etched deep across pauldron, hydraulic cable-tendons at neck."

# CAPED ARMORED MULTI-ARM WARRIOR

EX-U (caped multi-arm cyborg-warrior): "Bipedal cyborg-warrior, deep-charcoal armored exoskeleton with brass riveted seams, six mechanical arms (four lower arms with vibroblade-pair / kinetic-rifle / energy-shield, upper two arms unarmed combat manipulators), tattered crimson cape draped from shoulder, sealed armored helm with twin angled yellow slit-optics in deep skull-eye sockets, mechanical-respirator chest plate with audible hiss-vents, asymmetric battle-damage scarring left shoulder armor revealing minor mechanical detail."

━━━ HARD RULES ━━━

- 40-60 words per entry, dense and paintable
- ONE body plan + ONE mission per entry
- Character-scale (0.5m to 3m, max 10ft only for combat / breacher / sentinel)
- ZERO use of "X-shaped" / "X-bodied" where X is a literal animal
- ZERO mundane utility (chef / cleaner / postal / wheelbarrow / sweeper / tailor / barista / etc.)
- ZERO whimsy / theater / circus / cute / friendly / helpful / hospitality
- ZERO "generic robot in cool place" — every entry must have a READABLE MISSION
- EVERY entry has weathered metal + mission-tool-limbs + glowing accent + scars-or-engraving
- DISTRIBUTE PER MISSION CATEGORY TARGETS — Battle 20% / Sentinel 20% / Surveillance 15% / Exploration 15% / Breaching 10% / Cartography-Science 10% / Nomad 5% / Messenger 5%
- DISTRIBUTE PER HEAD ARCHETYPE TARGETS — each of H1-H12 appears 5-15% of entries; NO single head archetype above 15% (the v3 over-uses of cycloptic-single-eye and rotating-beacon-head must drop to ~10% each)
- NEVER skeletal / endoskeleton / "robot underneath the skin" / exposed-bone bodies — that body type is forbidden because it renders as horror-skeleton not hero-mecha
- NEVER reference Star Wars / Mass Effect / Halo droid names

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Each entry begins with body-plan + mission-noun. Match the 14 few-shot examples in density and DNA.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
