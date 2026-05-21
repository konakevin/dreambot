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
  description: 'PATH-BESPOKE — SteamBot sexy-steampunk-woman path (2026-05-15 rewrite to canonical character-path shape). Single steampunk WOMAN at 25-40% frame, FULL BODY, in a candid mid-action moment in a Victorian-industrial setting. THE OUTFIT IS THE MAIN SHOW — super ornate, layered, tasteful Victorian opulent couture (Mucha / Klimt / Pre-Raphaelite / BioShock-Infinite Elizabeth lineage). NSFW-clean vocabulary. Sister to DragonBot ARTSY_GIRL and StarBot FEMALE_EXPLORER. 7 character DNA axes (skin/eyes/makeup/hair_color/hairstyle/outfit/accessory) + 3 path-bespoke (persona/landscape/action) + 2 universal (lighting/atmosphere).',
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    characterDnaAxes: [ 'skin', 'eyes', 'makeup', 'hair_color', 'hairstyle', 'outfit', 'accessory' ],
    path: [ 'persona', 'landscape', 'action' ]
  },
  pickN: {},
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},

  STEAMBOT_STEAMPUNK_MAN: {
  description: 'PATH-BESPOKE — SteamBot steampunk-man path (2026-05-15 rewrite to canonical character-path shape, mirror of STEAMBOT_STEAMPUNK_WOMAN). Single steampunk MAN at 25-40% frame, FULL BODY, in a candid mid-action moment in a Victorian-industrial setting. HANDSOME / DASHING / RUGGED / INTENT / CAPABLE — never sexy/seductive. Oil-painted illustration on canvas (Frazetta / Brom / Vallejo painted-fantasy-cover lineage). Strict male DNA (skin / eyes / facial_hair / hair_color / hairstyle / outfit / accessory) — never cross-polluted with female vocab. 7 character DNA axes + 3 path-bespoke (persona / landscape / action) + 2 universal (lighting / atmosphere).',
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    characterDnaAxes: [ 'skin', 'eyes', 'facial_hair', 'hair_color', 'hairstyle', 'outfit', 'accessory' ],
    path: [ 'persona', 'landscape', 'action' ]
  },
  pickN: {},
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},

  STEAMBOT_AIRSHIP_SKIES: {
  description: "PATH-BESPOKE — SteamBot airship-skies path (2026-05-15 migration from function-based form). MOVIE-POSTER airship scenes — dirigibles, sky-galleons, packet-ships, sky-clippers in vertigo-inducing dramatic-sky moments. NO ground, NO city — pure sky-world. Mortal-Engines / Treasure-Planet / Howl's-Moving-Castle / Last-Exile / Atlantis-lost-empire / Skies-of-Arcadia visual lineage. 4 path-bespoke axes (scene / sky_layer / surprise_element / phenomenon 70%-gated) + universal lighting + atmosphere. NO CHARACTERS as primary subject.",
  slots: { universal: [ 'lighting', 'atmosphere' ], bot: [], path: [ 'scene', 'sky_layer', 'surprise_element' ] },
  pickN: {},
  conditionalLayer: { slot: 'phenomenon', gate: 0.7 },
  framingModes: null,
  anchorScaleRange: null
},

  STEAMBOT_STEAMPUNK_CURIO: {
  description: 'PATH-BESPOKE — SteamBot steampunk-curio path (2026-05-15 migration, refined to animate-creature-in-habitat). OBJECT-AS-HERO — a single ANIMATE steampunk robot creature (mimicking a real living thing OR a novel mechanical organism) caught mid-motion in an IMMERSIVE Victorian-industrial habitat (workshop / conservatory / library / observatory / atelier / airship interior / etc.). NEVER jewelry, NEVER crowns, NEVER clocks-as-subject, NEVER museum-display framing. NO PRIMARY HUMAN FIGURE. 3 path-bespoke axes (curio / habitat / ornate_flourish pickN:3) + universal lighting + atmosphere.',
  slots: { universal: [ 'lighting', 'atmosphere' ], bot: [], path: [ 'curio', 'habitat', 'ornate_flourish' ] },
  pickN: { ornate_flourish: 3 },
  conditionalLayer: null,
  framingModes: null,
  anchorScaleRange: null
},

  STEAMBOT_STEAMPUNK_SPECTACLE: {
  description: 'PATH-BESPOKE — SteamBot steampunk-spectacle path (2026-05-15 migration). GRAND EVENTS / CEREMONIES / FESTIVALS / PERFORMANCES / UPRISINGS in Victorian-industrial worlds. CROWD-driven scenes — tiny figures against massive machinery, packed balconies, sea of top-hats and goggles. THE EVENT IS THE SUBJECT — never a single person. Wide cinematic establishing shots or dramatic crowd-level angles. 3 path-bespoke axes (event / crowd_detail / surprise_element) + 1 conditional 40%-gated (escalation) + universal lighting + atmosphere. Reuses production-scale 199-entry SPECTACLE_EVENTS pool.',
  slots: { universal: [ 'lighting', 'atmosphere' ], bot: [], path: [ 'event', 'crowd_detail', 'surprise_element' ] },
  pickN: {},
  conditionalLayer: { slot: 'escalation', gate: 0.4 },
  framingModes: null,
  anchorScaleRange: null
},

  STEAMBOT_STEAM_TRANSPORT: {
  description: 'PATH-BESPOKE — SteamBot steam-transport path (2026-05-15 migration). Non-airship Victorian-industrial vehicles (locomotives / submarines / walking-machines / paddleboats / steam-carriages / mine-cages / clockwork-creatures-as-transport) in DRAMATIC TERRAIN. The vehicle and the landscape create the drama TOGETHER — a train is boring on flat track, epic crossing a canyon bridge in a storm. SHOW THE MACHINE CONQUERING IMPOSSIBLE GEOGRAPHY. 3 path-bespoke axes (transport / terrain_drama / surprise_element) + 1 conditional 50%-gated (phenomenon) + universal lighting + atmosphere. Reuses production-scale 200-entry TRANSPORT_SCENES pool.',
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    path: [ 'transport', 'terrain_drama', 'surprise_element' ]
  },
  pickN: {},
  conditionalLayer: { slot: 'phenomenon', gate: 0.5 },
  framingModes: null,
  anchorScaleRange: null
},

  STEAMBOT_COZY_STEAMPUNK: {
  description: 'PATH-BESPOKE — SteamBot cozy-steampunk path (2026-05-15 resurrection + axis migration). Dreamy ethereal cozy Victorian-industrial INTERIORS — pretty rooms with steampunk furniture, beds, flower arrangements, ornate fixtures, AND a beautiful window view (sunset / rainstorm aqua sky / distant airships / cloudtops). Multi-layered: pretty room + pretty window view together. Comforting + surreally beautiful + intricate. 4 path-bespoke axes (room / flora pickN:3 / window_view / intricate_detail pickN:2) + 1 conditional 40%-gated (quiet_moment) + universal lighting + atmosphere.',
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    path: [ 'room', 'flora', 'window_view', 'intricate_detail' ]
  },
  pickN: { flora: 3, intricate_detail: 2 },
  conditionalLayer: { slot: 'quiet_moment', gate: 0.4 },
  framingModes: null,
  anchorScaleRange: null
},

  STEAMBOT_STEAMPUNK_LABS: {
  description: "PATH-BESPOKE — SteamBot steampunk-labs path (2026-05-16 axis-system migration). VICTORIAN-INDUSTRIAL MAD-SCIENCE LABORATORY INTERIOR — soaring arched-glass ceilings, two-story balconies, brass-and-mahogany shelving, gas-lamps, mosaic-tile floors with embedded sigil-patterns. A MAJOR GLOWING EXPERIMENT centerpiece (containment-sphere / Tesla-coil / distillation-column / etc.) anchors the scene. 80%-gated Tesla-coil electrical phenomena and 60%-gated tiny lab-coated scientist scale-prover figure. Inspired by Tesla's Wardenclyffe / Frankenstein's tower-lab / Nemo's Nautilus / Royal Society. Varied palette across renders — architecture is wood-brass-glass, color comes from experiment glow (green/blue/amber/violet/pink/etc.). 4 path-bespoke axes (lab_space / centerpiece / apparatus pickN:3 / electrical 80%-gated) + 60%-gated scientist + universal lighting + atmosphere.",
  slots: {
    universal: [ 'lighting', 'atmosphere' ],
    bot: [],
    path: [ 'lab_space', 'centerpiece', 'apparatus', 'electrical' ]
  },
  pickN: { apparatus: 3 },
  conditionalLayer: { slot: 'scientist', gate: 0.6 },
  framingModes: null,
  anchorScaleRange: null
},

  STEAMBOT_STEAMPUNK_SCENE: {
  description: 'PATH-BESPOKE — SteamBot steampunk-scene path (2026-05-15 migration). CHARACTER INTEGRATED INTO EPIC STEAMPUNK SCENE — a role-based steampunk figure (clockwork magistrate / sky-nomad / weather-prognosticator / etc. — gender-agnostic, persona-driven) AT MEDIUM scale (15-25% frame) standing inside a wildly imaginative steampunk landscape (Big-Ben-clockwork-opened / gear-waterfall / floating-metropolis / mechanical-jungle / brass-cathedral / etc.). The LANDSCAPE is the co-hero. Cinematic feature-film concept render with photoreal physical light. 3 path-bespoke axes (character / landscape / surprise_element) + conditional event 40%-gated + universal lighting + atmosphere.',
  slots: { universal: [ 'lighting', 'atmosphere' ], bot: [], path: [ 'character', 'landscape', 'surprise_element' ] },
  pickN: {},
  conditionalLayer: { slot: 'event', gate: 0.4 },
  framingModes: null,
  anchorScaleRange: null
},
};
