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
