/**
 * steambot archetypes — path-bespoke archetype definitions.
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
  STEAMBOT_STEAMPUNK_WOMAN: {
    description:
      'PATH-BESPOKE — SteamBot sexy-steampunk-woman path (2026-05-15 rewrite to canonical character-path shape). Single steampunk WOMAN at 25-40% frame, FULL BODY, in a candid mid-action moment in a Victorian-industrial setting. THE OUTFIT IS THE MAIN SHOW — super ornate, layered, tasteful Victorian opulent couture (Mucha / Klimt / Pre-Raphaelite / BioShock-Infinite Elizabeth lineage). NSFW-clean vocabulary. Sister to DragonBot ARTSY_GIRL and StarBot FEMALE_EXPLORER. 7 character DNA axes (skin/eyes/makeup/hair_color/hairstyle/outfit/accessory) + 3 path-bespoke (persona/landscape/action) + 2 universal (lighting/atmosphere).',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'skin',
        'eyes',
        'makeup',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['persona', 'landscape', 'action'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  STEAMBOT_STEAMPUNK_MAN: {
    description:
      'PATH-BESPOKE — SteamBot steampunk-man path (2026-05-15 rewrite to canonical character-path shape, mirror of STEAMBOT_STEAMPUNK_WOMAN). Single steampunk MAN at 25-40% frame, FULL BODY, in a candid mid-action moment in a Victorian-industrial setting. HANDSOME / DASHING / RUGGED / INTENT / CAPABLE — never sexy/seductive. Oil-painted illustration on canvas (Frazetta / Brom / Vallejo painted-fantasy-cover lineage). Strict male DNA (skin / eyes / facial_hair / hair_color / hairstyle / outfit / accessory) — never cross-polluted with female vocab. 7 character DNA axes + 3 path-bespoke (persona / landscape / action) + 2 universal (lighting / atmosphere).',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'skin',
        'eyes',
        'facial_hair',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['persona', 'landscape', 'action'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  STEAMBOT_STEAMPUNK_HYBRID: {
    description:
      'PATH-BESPOKE — SteamBot steampunk-hybrid path (revived 2026-06-30). STEAMPUNK x another GENRE collision — gothic-horror / wild-west / rain-noir / underwater / arctic / fantasy / volcanic-desert-jungle. BOTH genres EQUALLY visible: the partner genre as prominent as the brass + gears, fused into one impossible place. Environment-dominant world scenes; figures incidental, never focal. The bot VARIETY lane. 1 path-bespoke hero (hybrid_world) + 40%-gated surprise + universal lighting + atmosphere. Render style comes from the per-render LOOK.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['hybrid_world'],
    },
    pickN: {},
    conditionalLayer: { slot: 'surprise_element', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  STEAMBOT_AIRSHIP_SKIES: {
    description:
      "PATH-BESPOKE — SteamBot airship-skies path (2026-05-15 migration from function-based form). MOVIE-POSTER airship scenes — dirigibles, sky-galleons, packet-ships, sky-clippers in vertigo-inducing dramatic-sky moments. NO ground, NO city — pure sky-world. Mortal-Engines / Treasure-Planet / Howl's-Moving-Castle / Last-Exile / Atlantis-lost-empire / Skies-of-Arcadia visual lineage. 4 path-bespoke axes (scene / sky_layer / surprise_element / phenomenon 70%-gated) + universal lighting + atmosphere. NO CHARACTERS as primary subject.",
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['scene', 'sky_layer', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.7 },
    framingModes: null,
    anchorScaleRange: null,
  },

  STEAMBOT_STEAMPUNK_CURIO: {
    description:
      'PATH-BESPOKE — SteamBot steampunk-curio path (2026-05-15 migration; REPAIRED 2026-05-27 to still-automaton-at-rest). OBJECT-AS-HERO — a single clockwork AUTOMATON (a brass mechanical creature, clearly built metal, NOT a live animal) posed CALMLY AT REST in an IMMERSIVE Victorian-industrial setting (workshop / conservatory / library / observatory / atelier / airship interior / etc.). The live-animal-mimic + mandatory-motion design rendered broken real animals — fixed via a sanitized still-mechanical pool + at-rest template. NEVER jewelry, NEVER crowns, NEVER clocks-as-subject, NEVER museum-display framing, NEVER outdoor/nature, NEVER dynamic action. NO PRIMARY HUMAN FIGURE. 3 path-bespoke axes (curio / habitat / ornate_flourish pickN:3) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['curio', 'habitat', 'ornate_flourish'],
    },
    pickN: { ornate_flourish: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  STEAMBOT_STEAMPUNK_SPECTACLE: {
    description:
      'PATH-BESPOKE — SteamBot steampunk-spectacle path (2026-05-15 migration). GRAND EVENTS / CEREMONIES / FESTIVALS / PERFORMANCES / UPRISINGS in Victorian-industrial worlds. CROWD-driven scenes — tiny figures against massive machinery, packed balconies, sea of top-hats and goggles. THE EVENT IS THE SUBJECT — never a single person. Wide cinematic establishing shots or dramatic crowd-level angles. 3 path-bespoke axes (event / crowd_detail / surprise_element) + 1 conditional 40%-gated (escalation) + universal lighting + atmosphere. Reuses production-scale 199-entry SPECTACLE_EVENTS pool.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['event', 'crowd_detail', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'escalation', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  STEAMBOT_STEAM_TRANSPORT: {
    description:
      'PATH-BESPOKE — SteamBot steam-transport path (2026-05-15 migration). Non-airship Victorian-industrial vehicles (locomotives / submarines / walking-machines / paddleboats / steam-carriages / mine-cages / clockwork-creatures-as-transport) in DRAMATIC TERRAIN. The vehicle and the landscape create the drama TOGETHER — a train is boring on flat track, epic crossing a canyon bridge in a storm. SHOW THE MACHINE CONQUERING IMPOSSIBLE GEOGRAPHY. 3 path-bespoke axes (transport / terrain_drama / surprise_element) + 1 conditional 50%-gated (phenomenon) + universal lighting + atmosphere. Reuses production-scale 200-entry TRANSPORT_SCENES pool.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['transport', 'terrain_drama', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  STEAMBOT_COZY_STEAMPUNK: {
    description:
      'PATH-BESPOKE — SteamBot cozy-steampunk path (2026-05-15 resurrection + axis migration). Dreamy ethereal cozy Victorian-industrial INTERIORS — pretty rooms with steampunk furniture, beds, flower arrangements, ornate fixtures, AND a beautiful window view (sunset / rainstorm aqua sky / distant airships / cloudtops). Multi-layered: pretty room + pretty window view together. Comforting + surreally beautiful + intricate. 4 path-bespoke axes (room / flora pickN:3 / window_view / intricate_detail pickN:2) + 1 conditional 40%-gated (quiet_moment) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['room', 'flora', 'window_view', 'intricate_detail'],
    },
    pickN: { flora: 3, intricate_detail: 2 },
    conditionalLayer: { slot: 'quiet_moment', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  STEAMBOT_STEAMPUNK_LABS: {
    description:
      "PATH-BESPOKE — SteamBot steampunk-labs path (2026-05-16 axis-system migration). VICTORIAN-INDUSTRIAL MAD-SCIENCE LABORATORY INTERIOR — soaring arched-glass ceilings, two-story balconies, brass-and-mahogany shelving, gas-lamps, mosaic-tile floors with embedded sigil-patterns. A MAJOR GLOWING EXPERIMENT centerpiece (containment-sphere / Tesla-coil / distillation-column / etc.) anchors the scene. 80%-gated Tesla-coil electrical phenomena and 60%-gated tiny lab-coated scientist scale-prover figure. Inspired by Tesla's Wardenclyffe / Frankenstein's tower-lab / Nemo's Nautilus / Royal Society. Varied palette across renders — architecture is wood-brass-glass, color comes from experiment glow (green/blue/amber/violet/pink/etc.). 4 path-bespoke axes (lab_space / centerpiece / apparatus pickN:3 / electrical 80%-gated) + 60%-gated scientist + universal lighting + atmosphere.",
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['lab_space', 'centerpiece', 'apparatus', 'electrical'],
    },
    pickN: { apparatus: 3 },
    conditionalLayer: { slot: 'scientist', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  STEAMBOT_AIRSHIP_FEMALE: {
    description:
      'PATH-BESPOKE — SteamBot airship-female path (2026-05-23, R1 architecture revision). ACTION-FOCUSED sister to STEAMBOT_STEAMPUNK_WOMAN. Solo female air-officer / sky-corsair caught MID-ACTION on/around a steampunk airship. Combat allowed. Background figures permitted in mid-distance but never co-protagonists. Character 40-60% of frame, telephoto compression with airship deck in midground. NEVER static portrait. R0→R1 fix: dropped separate heritage axis — diversity now baked into SKIN pool ("[Ethnicity] woman with..." format mirroring sexy-steampunk-woman). R0 defaulted to Euro-brunette because heritage was a separate semantic-only axis without an ethnic noun for Flux to anchor on. 7 character DNA + 2 path-bespoke (action / backdrop) + 1 conditional 40%-gated (drama) + 2 universal.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'role',
        'skin',
        'face',
        'eyes',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['action', 'backdrop'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  STEAMBOT_AIRSHIP_MALE: {
    description:
      'PATH-BESPOKE — SteamBot airship-male path (2026-05-23). MALE sister to STEAMBOT_AIRSHIP_FEMALE: same steampunk airship-action scenes, male actors. Solo handsome/rugged/weathered male air-officer / sky-corsair caught MID-ACTION on/around a steampunk airship. Combat allowed. Appeal reads through action + craftsmanship, NEVER seductive, NEVER shirtless. Background figures permitted mid-distance but never co-protagonists. Character 40-60% of frame, telephoto compression with airship deck in midground. NEVER static portrait. Carries the female-path wins: ethnicity-noun opening + FRONT-LOADED hair color (so hair varies, not default-dark) + heritage-reconcile + Frazetta painted-MAN anchor (steambot-painted-man medium). 8 character DNA (adds facial_hair) + 2 path-bespoke (action / backdrop) + 1 conditional 40%-gated (drama) + 2 universal.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'role',
        'skin',
        'face',
        'eyes',
        'facial_hair',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['action', 'backdrop'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  STEAMBOT_STEAMPUNK_SCENE: {
    description:
      'PATH-BESPOKE — SteamBot steampunk-scene path (2026-05-15 migration). CHARACTER INTEGRATED INTO EPIC STEAMPUNK SCENE — a role-based steampunk figure (clockwork magistrate / sky-nomad / weather-prognosticator / etc. — gender-agnostic, persona-driven) AT MEDIUM scale (15-25% frame) standing inside a wildly imaginative steampunk landscape (Big-Ben-clockwork-opened / gear-waterfall / floating-metropolis / mechanical-jungle / brass-cathedral / etc.). The LANDSCAPE is the co-hero. Cinematic feature-film concept render with photoreal physical light. 3 path-bespoke axes (character / landscape / surprise_element) + conditional event 40%-gated + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['character', 'landscape', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'event', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },
};
