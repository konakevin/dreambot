/**
 * starbot archetypes — path-bespoke archetype definitions.
 *
 * Each archetype declares which axis slots the path requires + how many
 * to pick per slot. The composer reads this and assembles a brief per
 * the corresponding archetype template in ./archetype-templates.js.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * To add a new archetype: add an entry here + the matching template
 * function in ./archetype-templates.js + reference it from one of the
 * bot's path files via { archetype: 'YOUR_NAME', pools: {...} }.
 */

module.exports = {
  STARBOT_SPACE_FEMME: {
    description: `PATH-BESPOKE — StarBot space-femme path (2026-05-23 migration; new path). Poster-worthy ornate space-female renders pushed to 11 across every dimension: style / fashion / gear / detail / background. Single female-figure cinematic POSTER COMPOSITION in the Frazetta / Whelan / Vallejo / Bonestell / Syd-Mead Analog-SF magazine-cover tradition — the kind of render you'd pin to a wall.

7 always-on path-bespoke slots + 1 conditional cosmic phenomenon (70%-gated):
  • subject_dna       — multi-trait female figure stack (skin / anatomy / hair / eye / scars-or-tattoos / cybernetics). ~70% non-baseline (alien / augmented / mutant / cybernetic), ~30% baseline-human-with-ornate-features. NO hard gender lock — she/her/woman language only.
  • outfit            — broad 4-bucket spectrum: ~25% sleek form-fit space suits / ~25% rogue+bounty-hunter+scavenger / ~25% maximalist ornate ceremonial / ~25% mixed practical (tactical / pilot / mechanic / lab). Cheesecake banned per cross-bot rule.
  • action_poster     — mid-verb POSTER pose (heroic low-angle stand / mid-incantation / mid-scan-at-artifact / mid-defiance / cease-fire signal / climbing through canopy). Not portrait, not sitting.
  • biome             — exotic perilous biome (bioluminescent kelp cathedral / floating volcanic boulders / acid-lake archipelago / glass storm / underwater alien temple / chlorine coast / methane sea / nebula-cloud planet).
  • background_drama  — always-on secondary mid/deep-distance event (alien fleet looming / leviathan rising / orbital station / dimensional rift / colossal alien statue / kaiju-shadow / dragon-fire in cosmos).
  • prop pickN:2       — stacked accessories (bio-monitor cuff / nav-compass on chain / glowing alien artifact / ritual mask / ceremonial blade / drone-companion / familiar creature on shoulder).
  • camera_poster     — poster-style framing (heroic low-angle / silhouette-against-vista / framed-through-archway / dutch-tilt climbing / mirrored-reflection / over-shoulder spying).
  • phenomenon (70% gated) — cosmic event (supernova flash / aurora-cyclone / falling-stars / dimensional-tear / dragon-fire-in-cosmos / black-hole-event-horizon).

PUSH-TO-11 MANDATE — every render stacks 3+ ornate elements simultaneously. Maximalist dense visual storytelling — packed-with-detail in the Frazetta cover-art tradition. Inherits the painted-oil-cover-art bot prefix from StarBot (the Bonestell/Whelan/Vallejo lineage that produces Kevin's 15-heart calibration set).`,
    slots: {
      universal: [],
      bot: [],
      path: [
        'subject_dna',
        'outfit',
        'action_poster',
        'biome',
        'background_drama',
        'prop',
        'camera_poster',
      ],
    },
    pickN: { prop: 2 },
    conditionalLayer: { slot: 'phenomenon', gate: 0.7 },
    framingModes: null,
    anchorScaleRange: null,
  },

  PURE_COSMOS: {
    description: `Painted Bonestell/McCall/Whelan cosmic vista tradition — Analog SF paperback-cover painted cosmos. Astronomical phenomenon as subject, tiny figure/structure permitted as scale-prover.

PREMIUM-TIER axis stack (2026-05-31 enrichment — 2 → 8 bespoke pools):
  Always-on identity (sets WHAT is rendered + the painting tradition):
    • phenomenon       — the cosmic subject (COSMIC_PHENOMENA, 200 entries)
    • painted_tradition — painter aesthetic (Bonestell saturated planetscape / McCall NASA-watercolor / Whelan paperback / Harris vast-cinematic / Pennington dreamy-acid / Hardy poster-grandeur)
  Gated 50% (accent layers — keeps per-render density coherent for literal models):
    • vista_composition  — painted vista framing (terraformed-foreground-globe / two-moons-on-horizon / planetary-rings-bisecting / spiral-arm-overhead / nebula-cathedral / binary-double-shadow)
    • narrative_witness  — tiny figure/structure as scale-prover (painted silhouette / observatory dome / ancient ruin / orbiting habitat / lone lander / generation-ship cutaway)
    • atmospheric_layer  — terrestrial-foreground atmosphere (dust-laden / cryogenic crystal-fog / methane-blue / sulfur-yellow smog / volcanic-ash / lichen-spore drift)
    • color_register     — painted palette signature (Jupiter amber-burgundy / Saturn ivory-cobalt / Mars rust-ochre / nebula pastel-magenta-cyan / methane-and-antifreeze)
    • signature_phenomenon — painted-tradition cosmic drama (Kuiper-comet streak / mass-driver stream / planetary alignment / Lagrange habitat-cluster / Dyson-veil shimmer / impossible-aurora)
  Conditional (40% gate): event — drama beat (COSMIC_VISTA_EVENT, path-bespoke — split from shared COSMIC_EVENT)`,
    slots: {
      universal: [
        'story_beat',
        'composition_frame',
        'scale_provers',
        'weather_particulate',
        'emotional_dna',
        'lighting',
      ],
      bot: ['surprise_element'],
      path: [
        'phenomenon',
        'painted_tradition',
        'vista_composition',
        'narrative_witness',
        'atmospheric_layer',
        'color_register',
        'signature_phenomenon',
      ],
    },
    pickN: { scale_provers: 3 },
    conditionalLayer: { slot: 'event', gate: 0.4 },
    framingModes: null,
  },

  FEMALE_EXPLORER: {
    description:
      'Sci-fi female explorer character path — gender-locked to "she/her/woman" throughout the template (per 2026-05-12 lesson: Flux uses gendered pronouns + nouns as primary gender-rendering signals, gender-neutral templates regress character renders). Full 7-axis female DNA stack composed at runtime. Character is the SHOW at MEDIUM scale (25-40% frame). Alien biome serves as her stage.',
    slots: {
      universal: ['lighting', 'weather_particulate'],
      bot: ['sky_layer', 'surprise_element'],
      characterDnaAxes: ['race', 'skin', 'eyes', 'hair_color', 'hairstyle', 'outfit', 'accessory'],
      path: ['biome', 'action', 'explorer_archetype'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  MALE_EXPLORER: {
    description:
      'Sci-fi male explorer character path — gender-locked to "he/his/man" throughout the template. Sibling archetype to FEMALE_EXPLORER; separate template per gender per the 2026-05-12 hard rule about character-path gender-locking. Full 7-axis male DNA stack composed at runtime.',
    slots: {
      universal: ['lighting', 'weather_particulate'],
      bot: ['sky_layer', 'surprise_element'],
      characterDnaAxes: ['race', 'skin', 'eyes', 'hair_color', 'hairstyle', 'outfit', 'accessory'],
      path: ['biome', 'action', 'explorer_archetype'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  CHARACTER: {
    description:
      'Figure is protagonist within a scene. Anchor at MEDIUM/LARGE scale. Slim character + location + action pools layered with full canonical axes; Sonnet weaves the figure INTO the scene.',
    slots: {
      universal: [
        'story_beat',
        'anchor_scale',
        'composition_frame',
        'scale_provers',
        'weather_particulate',
        'emotional_dna',
        'lighting',
      ],
      bot: ['sky_layer', 'surprise_element'],
      path: ['character', 'location', 'action'],
    },
    pickN: { scale_provers: 3 },
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: ['MEDIUM', 'LARGE'],
  },

  OUTDOOR_CITY: {
    description:
      'Architecture / city as hero. Anchor entity at TINY/SMALL scale (scale prover only). City fills 80%+ of frame. Path-bespoke pools for setting + lone city-witness (anchor_entity override) + signature deep-distance feature + conditional drama (40% gate).',
    slots: {
      universal: [
        'story_beat',
        'anchor_scale',
        'composition_frame',
        'scale_provers',
        'weather_particulate',
        'emotional_dna',
        'lighting',
      ],
      bot: ['anchor_entity', 'sky_layer', 'surprise_element'],
      path: ['setting', 'deep_distance'],
    },
    pickN: { scale_provers: 2 },
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: ['TINY', 'SMALL'],
  },

  SPACE_OPERA: {
    description: `Sci-fi spaceship as anchor entity, MEDIUM/LARGE scale. Hero ship in cosmic setting with optional 50%-gated wide-action mode (multi-ship battle/traffic chaos with two sub-pools rolled together).

PREMIUM-TIER axis stack (2026-05-31 reactivation + enrichment — paritying space-femme/explorer richness):
  • ship                   — primary anchor entity (slim, ~30 entries)
  • setting                — cosmic environment wrapping the ship
  • ship_action            — posture/state/motion
  • crew_signal            — visible life ON the ship (lit bridge silhouettes / EVA teams / gunner cupolas / deck crews) — gives the ship LIFE
  • faction_iconography    — visible markings/badges/colors hinting at allegiance (corp sigils / military squadron numerals / pirate banners / alien-empire glyphs)
  • propulsion_signature   — engine/drive aesthetic (plasma cone / antimatter glare / fusion torch / silent ion blue / quantum-jump signature) — strong visual identity differentiator
  • genre_register         — narrative tone (military thriller / pirate adventure / diplomatic incident / first contact / lost-ship horror / smuggler chase / generation-ship arrival)
  • signature_hull_feature — the one weird memorable detail per ship (asymmetric exhaust manifold / ribbed armor pattern / glasshouse observation pod / battle-scar mosaic) — readable focus
  • CONDITIONAL (50% gate): traffic (BUSY_FLEET_ELEMENTS ×3) + battle (BATTLE_DYNAMICS ×3) — wide-action multi-ship mode`,
    slots: {
      universal: [
        'story_beat',
        'anchor_scale',
        'composition_frame',
        'scale_provers',
        'weather_particulate',
        'emotional_dna',
        'lighting',
      ],
      bot: ['sky_layer', 'surprise_element'],
      path: [
        'ship',
        'setting',
        'ship_action',
        'crew_signal',
        'faction_iconography',
        'propulsion_signature',
        'genre_register',
        'signature_hull_feature',
      ],
    },
    pickN: { scale_provers: 3 },
    conditionalLayer: {
      gate: 0.5,
      pools: {
        traffic: { name: 'BUSY_FLEET_ELEMENTS', pickN: 3 },
        battle: { name: 'BATTLE_DYNAMICS', pickN: 3 },
      },
    },
    framingModes: null,
    anchorScaleRange: ['MEDIUM', 'LARGE'],
  },

  MEGASTRUCTURE: {
    description:
      'Colossal post-planetary engineered construct as hero — orbital rings, Dyson constructs, planetary mantles, megaships. Anchor at TINY/SMALL (scale prover). Structure fills 85%+ of frame. Path-bespoke pools for setting + lone structure-scale witness (anchor_entity override) + signature deep-distance feature + conditional drama (40% gate).',
    slots: {
      universal: [
        'story_beat',
        'anchor_scale',
        'composition_frame',
        'scale_provers',
        'weather_particulate',
        'emotional_dna',
        'lighting',
      ],
      bot: ['anchor_entity', 'sky_layer', 'surprise_element'],
      path: ['setting', 'deep_distance'],
    },
    pickN: { scale_provers: 3 },
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: ['TINY', 'SMALL'],
  },

  ALIEN_LANDSCAPE: {
    description:
      'Alien planet biome as hero. Anchor entity at TINY/SMALL scale (silhouette scale prover). Path-bespoke pools for biome, lone wilderness witness (anchor_entity overrides bot default), candid landscape moment, signature deep-distance feature. Bot surprise_element is wired (was previously missing).',
    slots: {
      universal: [
        'story_beat',
        'anchor_scale',
        'composition_frame',
        'scale_provers',
        'weather_particulate',
        'emotional_dna',
        'lighting',
      ],
      bot: ['anchor_entity', 'sky_layer', 'surprise_element'],
      path: ['biome', 'moment', 'deep_distance'],
    },
    pickN: { scale_provers: 2 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: ['TINY', 'SMALL'],
  },

  SPACEWALK: {
    description: `PATH-BESPOKE — StarBot spacewalk path (2026-06-09, new). The iconic ZERO-G EVA shot: a single suited figure FLOATING in the open void, untethered or working in vacuum, the curve of a world / a blazing star / a colossal hull behind them. Gravity / 2001 / Interstellar film-still tradition. BOTH the figure (suit + visor reflection + gear, fully readable) AND the void environment (planet curve / nebula / structure, richly detailed) are the show — co-heroes. The figure is dwarfed but NOT a tiny silhouette: ~20-35% of frame, full-body free-floating, suit detail crisp.

7 bespoke slots + 1 conditional cosmic event (50%-gated):
  • suit              — the EVA suit (the figure's identity — sealed, gender-neutral): silhouette + material/finish + helmet/visor + glowing tech + wear
  • eva_action        — what they're DOING in zero-G (verb-led): untethered drift / hull repair / reaching / tumbling / hand-over-hand on a line / pushing off — FREE-FLOAT body language, never grounded
  • visor_reflection  — the signature detail: what's mirrored in the curved visor (planet curve / blazing star / nebula / the hull / HUD glow / their own ship)
  • void_backdrop     — the dominant cosmic environment they float against (gas-giant curve / planet terminator with city-lights / nebula wall / ringed planet / solar corona / star-dense field) — the "out in space" hero
  • nearby_structure  — the foreground hard-surface tech near them (battered hull panels / solar array / docking truss / derelict / satellite / tether to an offscreen ship)
  • suit_detail pickN:2 — stacked suit/gear details (thrusters venting crystallizing vapor / coiled safety tether / MMU pack / glowing power cells / mission patches / frost-rimmed visor / handheld tool)
  • CONDITIONAL (50% gate): cosmic_event — a distant drama beat (solar flare / debris streak / a second tiny EVA figure / aurora on the world below / a craft on approach)

ZERO-G MANDATE — the figure FLOATS. No "feet on ground", no standing pose, no down direction. Tether and limbs drift in free-fall. This is the opposite of the explorer paths (which are grounded on a biome). Photoreal cinematic film-still on the bot's default starbot_hyperreal medium.`,
    slots: {
      universal: ['lighting'],
      bot: [],
      path: [
        'suit',
        'eva_action',
        'visor_reflection',
        'void_backdrop',
        'nearby_structure',
        'suit_detail',
      ],
    },
    pickN: { suit_detail: 2 },
    conditionalLayer: { slot: 'cosmic_event', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  ORBITAL_DESCENT: {
    description: `PATH-BESPOKE — StarBot orbital-descent path (2026-06-10, new). A world seen from ORBIT — the great curve of an alien planet filling the frame, its terminator line, city-lights on the night side, a razor-thin atmosphere glow, a ship/capsule on approach. "Looking down at a world from space." The PLANET-FROM-ORBIT is the hero; a tiny craft sells the descent.

5 bespoke slots + 1 conditional event (40%-gated). Fully path-bespoke (vacuum vista):
  • planet_type     — THE hero world from orbit (ice world / ocean world / lava world / ringed / terraformed-green / banded cloud world / desert / storm-wracked / ecumenopolis city-world / cracked volcanic)
  • surface_detail  — what's visible on the surface (swirling cyclones / shadowed mountain ranges / a vast canyon / polar caps / glowing lava rivers / city-light webs on the night side / a great impact crater)
  • atmosphere_glow — the bright thin atmosphere arc + terminator (a razor blue atmosphere line / sunrise breaking over the limb / the day-night terminator / a glowing auroral ring / storm-lightning in the clouds)
  • approach_craft  — the descending ship/capsule for scale + narrative (a re-entry capsule trailing plasma / a sleek shuttle banking / a colony lander / a fleet entering orbit / a dropship with glowing heat-shield / an orbital station in foreground)
  • space_backdrop  — above/around the planet (black of space + stars / a moon / a distant sun / a nebula / rings / the galaxy band)

  • CONDITIONAL (40% gate): descent_event — a beat (re-entry plasma trail / a meteor burning in the atmosphere below / an orbital sunrise flare / a second ship / a satellite glinting)

ORBIT MANDATE — the planet's CURVE fills the frame, seen from above in vacuum; the craft is small. Photoreal cinematic on the bot's default starbot_hyperreal medium.`,
    slots: {
      universal: [],
      bot: [],
      path: ['planet_type', 'surface_detail', 'atmosphere_glow', 'approach_craft', 'space_backdrop'],
    },
    pickN: {},
    conditionalLayer: { slot: 'descent_event', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  ASTEROID_MINING: {
    description: `PATH-BESPOKE — StarBot asteroid-mining path (2026-06-10, new). Gritty BLUE-COLLAR industrial sci-fi — a mining rig carving an asteroid, refineries, ore-haulers, floodlights, sparks. The Nostromo / Expanse working-class-space register StarBot completely lacks. Worn, lived-in, industrial.

5 bespoke slots + 1 conditional hazard (40%-gated). Fully path-bespoke (gritty vacuum industry):
  • mining_setting   — THE hero operation (a colossal asteroid being carved open / a strip-mined rock face / a refinery platform bolted to a rock / a hollowed-out asteroid interior packed with machinery / a drill-rig boring a shaft / a processing station)
  • industrial_detail — the gritty machinery (scaffolding & gantries / ore conveyors / glowing smelters / venting exhaust / floodlight towers / fuel tanks / docked battered haulers / pipework & cabling / hazard stripes / worn scarred equipment)
  • mining_action    — what's happening (a laser-cutter carving rock with a shower of sparks / a hauler loading ore / a blast charge detonating / a drill boring / a crane swinging cargo / a swarm of mining drones)
  • worker_presence  — the human scale (a tiny suited miner with a tool / a crew on a gantry / a foreman silhouette / an EVA team — small + grubby against the industrial scale)
  • belt_setting     — the surroundings (an asteroid belt of drifting rocks / a harsh small distant sun / a gas giant looming / the black of space / a distant refinery fleet / dust & debris)

  • CONDITIONAL (40% gate): hazard_event — a beat (a blowout venting gas / a rockslide / a warning-klaxon glow / a near-miss with debris / a flare of cutting-laser / a hauler thruster burn)

GRITTY MANDATE — worn, industrial, blue-collar, scarred metal and floodlit dust — NOT a sleek clean starship. Photoreal cinematic on the bot's default starbot_hyperreal medium.`,
    slots: {
      universal: [],
      bot: [],
      path: ['mining_setting', 'industrial_detail', 'mining_action', 'worker_presence', 'belt_setting'],
    },
    pickN: {},
    conditionalLayer: { slot: 'hazard_event', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  COCKPIT_VIEW: {
    description: `PATH-BESPOKE — StarBot cockpit-view path (2026-06-10, new). FIRST-PERSON from INSIDE a cockpit/canopy/helmet — HUD overlays on the glass, the dashboard and hands in the foreground, looking OUT at space / a dogfight / a docking. The immersive "you are the pilot" framing none of the other paths use.

5 bespoke slots + 1 conditional event (40%-gated). Fully path-bespoke:
  • cockpit_type   — the cockpit interior framing the shot (a fighter canopy with a glowing dash / a freighter bridge viewport / a mech cockpit wraparound screen / a helmet visor interior / a shuttle cockpit / a capital-ship bridge window)
  • hud_overlay    — the holographic HUD on the glass (targeting reticle & lock-on brackets / nav-map & waypoints / system readouts & warning lights / a velocity ladder / comms text / a damage schematic / alien-glyph translations)
  • view_beyond    — what's OUTSIDE the glass — the scene (a dogfight with enemy ships & tracer fire / a planet on approach / a docking bay opening / a nebula / an asteroid field to thread / a capital ship looming / a jump-point / a star)
  • cockpit_detail — the foreground interior (gloved hands on the stick/throttle / glowing switches & panels / a dashboard of dials / a trinket / reflections on the glass / the pilot's faint reflection)
  • alert_state    — the mood-light (calm blue cruise / red-alert klaxon glow / warm instrument night-glow / amber master-caution / the white flash of weapons fire outside / a planet's glow filling the canopy)

  • CONDITIONAL (40% gate): combat_event — a beat (an incoming missile-lock warning / an explosion outside the canopy / an enemy ship streaking past / a near-collision / a hull-hit shaking the cockpit)

FIRST-PERSON MANDATE — the camera is INSIDE the cockpit; the canopy frame + HUD + dash are the foreground, looking OUT. NEVER a third-person shot of a ship. Photoreal cinematic on the bot's default starbot_hyperreal medium.`,
    slots: {
      universal: [],
      bot: [],
      path: ['cockpit_type', 'hud_overlay', 'view_beyond', 'cockpit_detail', 'alert_state'],
    },
    pickN: {},
    conditionalLayer: { slot: 'combat_event', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  SHIP_GRAVEYARD: {
    description: `PATH-BESPOKE — StarBot ship-graveyard path (2026-06-10, new). A vast boneyard of dead warships drifting from a battle long over, a lone explorer threading the silent hulls. Derelict's eerie tone but FLEET-scale — hundreds of wrecks, melancholy and awe.

5 bespoke slots + 1 conditional event (40%-gated). Fully path-bespoke (silent vacuum):
  • graveyard_setting — THE hero boneyard (hundreds of dead warship hulls drifting / a tangled mass of wrecked fleets / broken hulls around a dead planet / a debris-ring of shattered ships / snapped cruisers & gutted carriers / a fog of wreckage)
  • wreck_detail      — the dead ships up close (snapped-in-half hulls / gutted superstructures / frozen explosion-scars / drifting hull-plates / dead running-lights / a cracked hangar spilling fighters / cold weapon-batteries / venting breaches)
  • graveyard_scale   — the vastness (wrecks receding to the horizon / a colossal flagship hull dominating / layers of debris in haze / the field past a dead moon / thousands of hulls)
  • explorer_craft    — the lone visitor (a small salvage ship threading the hulls with floodlights / a single EVA figure drifting among wreckage / a scavenger tug / a survey probe — tiny against the dead fleet)
  • cosmic_setting    — the backdrop (a dead grey planet below / a cold distant sun / a nebula glowing behind the wrecks / a debris-dimmed starfield / a ringed planet)

  • CONDITIONAL (40% gate): eerie_detail — a beat (a single light still blinking on a dead hull / a slow-tumbling severed bridge / a reactor still faintly glowing / a drifting insignia-flag / a ghostly distress signal)

GRAVEYARD MANDATE — silent, vast, cold, melancholy — a field of the dead at fleet scale, the visitor tiny. Photoreal cinematic on the bot's default starbot_hyperreal medium.`,
    slots: {
      universal: [],
      bot: [],
      path: ['graveyard_setting', 'wreck_detail', 'graveyard_scale', 'explorer_craft', 'cosmic_setting'],
    },
    pickN: {},
    conditionalLayer: { slot: 'eerie_detail', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  TERRAFORMING: {
    description: `PATH-BESPOKE — StarBot terraforming path (2026-06-10, new). A half-remade world being born — atmosphere processors venting, domes, green creeping across red rock, a storm-wall where the new climate fights the old. Hopeful, epic-scale transformation.

5 bespoke slots + 1 conditional milestone (40%-gated):
  • terraform_stage — THE world's state (red barren rock with first green patches / half-and-half, green spreading from domes / oceans newly filled and steaming / a storm-front where new atmosphere meets old desert / lichen creeping over stone / the first forests under a thickening sky)
  • terraform_tech  — the machinery doing it (colossal atmosphere-processor towers venting clouds / orbital mirrors beaming light / domed habitat colonies / sky-cranes seeding clouds / vast greenhouses / weather-control spires / pipelines)
  • climate_drama   — the sky/weather of a world being born (a wall of new storm-clouds rolling over desert / the first rain on red rock / lightning in a thickening atmosphere / a green processing-aurora / a rainbow over new lakes / dust giving way to cloud)
  • settlement      — the human presence (a glinting dome-city / terraced farms on new soil / a frontier town / transport lines / greenhouses / tiny figures planting / a launch-pad)
  • world_backdrop  — the planetary/cosmic context (a warming sun / a moon / the planet's curve / orbital mirrors glinting / a partner-planet in the sky / old red desert vs new green)

  • CONDITIONAL (40% gate): milestone_event — a beat (the first rainfall / an ocean filling a basin / a forest reaching a ridge / an atmosphere-processor igniting / a green dawn breaking / a storm breaking to clear sky)

TRANSFORMATION MANDATE — a world MID-CHANGE: barren-meets-living, the machinery + the spreading green + the dramatic new-climate sky. Hopeful, epic. Photoreal cinematic on the bot's default starbot_hyperreal medium.`,
    slots: {
      universal: [],
      bot: [],
      path: ['terraform_stage', 'terraform_tech', 'climate_drama', 'settlement', 'world_backdrop'],
    },
    pickN: {},
    conditionalLayer: { slot: 'milestone_event', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DERELICT: {
    description: `PATH-BESPOKE — StarBot derelict-exploration path (2026-06-09, new). A drifting abandoned/dead spacecraft or station, a lone explorer's flashlight beam cutting the dark, eerie awe-horror in the Alien / Dead-Space / Event-Horizon tradition. Adds a DARKER tonal register StarBot lacks, with built-in narrative ("what happened here?"). The dead structure + the explorer's light are the show.

5 bespoke slots + 1 conditional threat (40%-gated). Fully path-bespoke (its own cold dead light):
  • derelict_setting — THE hero: the abandoned place (dead capital-ship hull adrift / silent station corridor / ghost bridge / wrecked hangar / cold reactor chamber / cargo hold of frozen containers / crashed wreck on an asteroid). VARY interior vs exterior, wide vs tight, to avoid repetition.
  • decay_detail     — signs of death (frost on dead consoles / hull breaches & scorch / drifting debris & frozen droplets / tangled swaying cables / ice-sheeted walls / scattered effects / a thin dust layer)
  • explorer_light   — the lone suited explorer + their light (helmet-lamp / flashlight beam cutting the dark, catching dust and frost), a small silhouette against the vast dead space — the narrative anchor + key light
  • ominous_reveal   — what the beam finds / the mystery (a half-open blast door / a powered-down console with one blinking light / a breach to the stars / an embedded alien artifact / a strange symbol / claw-scoured walls)
  • light_atmosphere — the eerie mood-light (cold blue emergency glow / a failing red alert light / shafts of starlight through a breach / the flashlight as the only light / pitch dark with rim-light)

  • CONDITIONAL (40% gate): threat_hint — a beat of dread (a distant silhouette in the dark / a far pair of glowing points down a corridor / an alien growth pulsing on the wall / a shadow that shouldn't be there / a flickering distress hologram)

DREAD MANDATE — silent, cold, abandoned, tense. Photoreal cinematic film-still on the bot's default starbot_hyperreal medium.`,
    slots: {
      universal: [],
      bot: [],
      path: ['derelict_setting', 'decay_detail', 'explorer_light', 'ominous_reveal', 'light_atmosphere'],
    },
    pickN: {},
    conditionalLayer: { slot: 'threat_hint', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  LEVIATHAN: {
    description: `PATH-BESPOKE — StarBot leviathan / first-contact path (2026-06-09, new). A COLOSSAL LIVING alien entity encountered in space — the creature-as-hero shot StarBot has zero of. Pure sense-of-wonder first-contact awe, with a tiny ship/figure for scale.

⚠️ HARD RULE — NO "EARTH-MAMMAL IN SPACE" CLICHÉ (Kevin 2026-06-09: "no space whales"; but clarified that squid / jellyfish / octopus — the genuinely ALIEN-LOOKING deep-sea forms — ARE fine). So: NEVER a whale / cetacean / dolphin / shark / fish-with-a-face / bird / horse / recognizable land-mammal silhouette. ENCOURAGED — the weird, alien-reading register: cephalopod tentacle-masses, cnidarian medusa-bells, deep-sea bizarre bioluminescent forms, AND non-biological alien forms: geometric/crystalline entities, energy-and-light beings, segmented ring-organisms, fractal branching structures, non-bilateral radial forms, living-metal lattices, translucent gas-bodies with internal light-organs, impossible folded geometry. The test: does it read as a wondrous ALIEN, not a recognizable Earth mammal?

5 bespoke slots + 1 conditional contact event (40%-gated). Fully path-bespoke:
  • creature_form     — THE hero body-plan, PURELY ALIEN (see hard rule). No Earth-animal silhouette.
  • creature_detail   — alien surface/anatomy (bioluminescent veins / chitinous plating / translucent membranes over glowing organs / arcing energy / crystalline growths / shifting light-patterns / eye-clusters / tendril-fields / glowing vents). No fur/scales/feathers as Earth analogs.
  • creature_behavior — the first-contact MOMENT (drifting past a ship / uncoiling / emitting a communication pulse of light / turning an eye-cluster toward the viewer / feeding on a star or nebula / releasing smaller forms / reaching a tendril toward a tiny craft)
  • cosmic_setting    — where contact happens (deep void + nebula / among planetary rings / a planet's upper atmosphere / near a star / a dense star-field / a dust cloud / eclipsing a sun)
  • scale_anchor      — the tiny thing proving its colossal size (a fighter/shuttle dwarfed beside it / a capital ship tiny against its bulk / a station / a lone EVA figure)

  • CONDITIONAL (40% gate): contact_event — a dramatic first-contact beat (it emits a beam/pulse of communication light / bioluminescent patterns ripple across it / it releases a cloud of glowing spores or smaller entities / energy arcs between it and a ship / it opens a vast eye / a wave of light passes through it)

WONDER MANDATE — awe, scale, first-contact. The alien is colossal and unmistakably ALIVE and NON-EARTH. Photoreal cinematic on the bot's default starbot_hyperreal medium.`,
    slots: {
      universal: [],
      bot: [],
      path: ['creature_form', 'creature_detail', 'creature_behavior', 'cosmic_setting', 'scale_anchor'],
    },
    pickN: {},
    conditionalLayer: { slot: 'contact_event', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  CRYSTALLINE_WORLD: {
    description: `PATH-BESPOKE — StarBot crystalline-world path (2026-06-09, new). An alien world of titanic crystal prisms — towering quartz spires, canyons of giant gem-blades, fields of glowing facets — with a star's light FRACTURING through them into rainbow caustics splashed across everything. Pure jewel-like spectacle, unlike anything else in the feed. The CRYSTAL TERRAIN + the refracted light are the show.

6 bespoke slots + 1 conditional event (40%-gated). Fully path-bespoke (self-lit jewel world):
  • composition      — THE SHOT TYPE that LEADS the render (wide canyon / enclosing cavern / aerial field / distant / overhead arch / reflection). #1 anti-repetition lever — forces a different architecture every render so the crystal world stops collapsing into a central glowing tower (Kevin 2026-06-09).
  • crystal_formation — THE hero terrain (towering prism spires / a canyon of giant gem-blades / a geode cavern / a field of shards / a crystal forest / hexagonal gem-columns / a crystal mountain)
  • crystal_material  — the crystal's color + clarity (clear quartz / amethyst / rose / emerald / sapphire / smoky / opalescent-iridescent / citrine-gold / obsidian-glass / rainbow-fluorite)
  • light_refraction  — THE signature money-shot: how the star's light fractures through the crystal (rainbow caustics across the ground / split prismatic light-shafts / internal glow / spectra dancing / lens-flare through a prism)
  • ground_detail     — the foreground floor (scattered smaller crystals & geodes / a mirror crystal-pool / shards underfoot / mineral sand / a tiny figure or ship dwarfed for scale)
  • sky_above         — the light source + sky (a low sun fracturing through the spires / binary suns / a nebula / aurora / twin moons / crystal-dust haze)

  • CONDITIONAL (40% gate): crystal_event — a phenomenon (a crystal resonating with inner energy / a beam refracting skyward / bioluminescent pulse through the lattice / a light-storm of spectra / a slow crystal-growth cascade)

JEWEL MANDATE — the crystals are colossal and translucent, the light fractures into VISIBLE rainbow caustics and prismatic shafts. Saturated, luminous, gem-like. Photoreal cinematic vista on the bot's default starbot_hyperreal medium.`,
    slots: {
      universal: [],
      bot: [],
      path: [
        'composition',
        'crystal_formation',
        'crystal_material',
        'light_refraction',
        'ground_detail',
        'sky_above',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'crystal_event', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  IMPOSSIBLE_SKY: {
    description: `PATH-BESPOKE — StarBot impossible-sky path (2026-06-09, new). The WALLPAPER money-shot: a colossal ringed gas giant hanging ENORMOUS over the horizon of an alien world, its rings slicing across the entire sky at a dramatic tilt, moons strung along the ring-plane, aurora and a distant sun — all mirrored in the alien land or sea below. The scene is grounded (a thin foreground anchor) but the SKY is the entire show — the kind of image people set as a wallpaper.

5 bespoke slots + 1 conditional sky event (40%-gated). Fully path-bespoke (the sky is its own self-lit world):
  • ringed_giant   — THE hero: the colossal ringed planet over the horizon (banding + color + ring tilt/shadow-banding/gaps + how huge it looms)
  • sky_companions pickN:2 — the rest of the sky (moons in a row / a second planet / binary suns / aurora curtains / the galaxy band / a comet) — stacked to fill the sky
  • foreground     — the alien land/sea anchoring the bottom (glassy sea reflecting the rings / ice flat / dunes / crystal field / still mirror-lake / bioluminescent ocean)
  • horizon_detail — the midground on the horizon line (alien rock spires / a distant ridge / sea-stacks / a lone tiny structure or figure for scale / dunes)
  • atmosphere     — the sky's light + air treatment (ring-shadow bands across the sky / aurora glow / twilight gradient / the terminator / dust haze / golden-hour wash)

  • CONDITIONAL (40% gate): sky_event — a dramatic beat (a meteor streaking / a moon eclipsing the sun / a comet blazing / an aurora storm / a ring-shadow eclipse crossing the land)
  • INDEPENDENT CONDITIONAL (40% gate): witness_figure — a tiny lone astronaut/character in the foreground GAZING UP at the impossible sky, dwarfed to a speck (Kevin 2026-06-09: "an epic tiny-style render of a character looking toward the sky has cool impact"). Fires independently of sky_event.

SKY-IS-HERO MANDATE — the horizon sits LOW; the sky fills 60-70% of the frame and the ringed giant dominates it. The land is a thin anchoring foreground, ideally MIRRORING the sky. Photoreal cinematic vista on the bot's default starbot_hyperreal medium.`,
    slots: {
      universal: [],
      bot: [],
      path: ['ringed_giant', 'sky_companions', 'foreground', 'horizon_detail', 'atmosphere'],
    },
    pickN: { sky_companions: 2 },
    // Two INDEPENDENT gated layers (composer rolls each separately).
    conditionalLayers: [
      { slot: 'sky_event', gate: 0.4 },
      { slot: 'witness_figure', gate: 0.4 },
    ],
    framingModes: null,
    anchorScaleRange: null,
  },

  RING_HABITAT: {
    description: `PATH-BESPOKE — StarBot ring-habitat path (2026-06-09, new). The INTERIOR of a colossal rotating space habitat (O'Neill cylinder / ring-world / Stanford-torus tradition) — the jaw-dropping shot where the LANDSCAPE CURVES UP both walls and arcs OVER the sky, so the far side of the world hangs upside-down overhead. A glowing axial sun-line lights an entire enclosed world of cities, farms, rivers and forests wrapped around the inside of a spinning drum. The HABITAT is the hero; tiny human-scale detail proves the impossible scale.

6 bespoke slots + 1 conditional event (40%-gated). Fully path-bespoke (no universal axes — the interior is its own self-lit world):
  • habitat_zone   — the terrain wrapping the interior (terraced farmland patchwork / dense green arcology city / forested river valley / lake-and-meadow parkland / mixed garden-suburb sprawl)
  • curve_overhead — THE signature mind-bend: how the land sweeps up the curved walls and arcs overhead — the upside-down far side hanging in the sky, the upward-curving horizon
  • axis_light     — the central light source running the long axis (glowing fusion sun-line / mirror-strip daylight / axial day-night terminator / hub star) — the world's sun
  • endcap         — the colossal far endcap closing the cylinder (city built into the curved wall / docking hub / mountain-ringed window / vast bulkhead) far in the distance
  • habitat_detail — mid-scale interior wonder (clouds floating at the weightless axis / a river curving up the wall / suspended lakes / a monorail spiralling the drum / weather forming along the centerline)
  • scale_prover pickN:2 — tiny human-scale proof (a town with lit windows / farm fields / a transit pod / a lone figure on a ridge / drifting aircraft) dwarfed by the scale

  • CONDITIONAL (40% gate): habitat_event — a drama beat (a flock of birds/drones along the axis / a storm cloud knotting at the centerline / a festival of lights / an aurora-like glow / a transit pod streaking past)

CURVE MANDATE — the horizon CURVES UP, never down. The far landscape rises up the walls and hangs overhead. This "the ground is the sky" gut-punch is the whole point. Photoreal cinematic vista on the bot's default starbot_hyperreal medium.`,
    slots: {
      universal: [],
      bot: [],
      path: [
        'habitat_zone',
        'curve_overhead',
        'axis_light',
        'endcap',
        'habitat_detail',
        'scale_prover',
      ],
    },
    pickN: { scale_prover: 2 },
    conditionalLayer: { slot: 'habitat_event', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  PHOTOREAL_ASTRO: {
    description: `NASA-grade photoreal astrophotography — Hubble / JWST / Chandra / ALMA / EHT cranked-to-11 framing.

PREMIUM-TIER axis stack (2026-05-31 enrichment — 2 → 8 bespoke pools):
  Always-on identity (sets WHAT is rendered + the rendering tradition):
    • subject               — the astronomical subject (REAL_SPACE_SUBJECTS, 106 entries)
    • wavelength_signature  — telescope/instrument tradition (Hubble visible / JWST IR / Chandra X-ray / ALMA radio / EHT event-horizon) — each renders very differently
  Gated 50% (accent layers — keeps per-render density coherent for literal models):
    • structural_detail     — visible features (jets / accretion disks / shock fronts / stellar nurseries / polar lobes / dust lanes)
    • color_palette_band    — false-color register (Pillars orange+teal / JWST burnt-amber+cobalt / Chandra purple-cyan)
    • scale_anchor          — astro scale-prover (foreground asteroid / nearby star with diffraction cross / approaching probe / contrasting smaller galaxy)
    • composition_focus     — astro composition (centered jewel-box / edge-on disk / spiral-arm hero / merging-galaxies / Dyson-sphere transit / nebula-into-void)
    • narrative_phase       — cosmic moment (birth: star formation / death: supernova / collision: galaxy merge / quiet majesty / aftermath / discovery)
  Conditional (35% gate): event — drama beat (REAL_SPACE_EVENT, path-bespoke — split from shared COSMIC_EVENT)`,
    slots: {
      universal: [
        'story_beat',
        'composition_frame',
        'scale_provers',
        'weather_particulate',
        'emotional_dna',
        'lighting',
      ],
      bot: ['surprise_element'],
      path: [
        'subject',
        'wavelength_signature',
        'structural_detail',
        'color_palette_band',
        'scale_anchor',
        'composition_focus',
        'narrative_phase',
      ],
    },
    pickN: { scale_provers: 3 },
    conditionalLayer: { slot: 'event', gate: 0.35 },
    framingModes: null,
  },
};
