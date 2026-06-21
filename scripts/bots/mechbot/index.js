/**
 * MechBot — the bot-engine contract.
 *
 * Cyborgs and droids: half-human half-machine beings + ornate solo robots.
 * Hyper-real cinematic 3D. Ex Machina / Alita / Blade Runner / Westworld /
 * Ghost in the Shell aesthetic.
 *
 * Migrated 2026-05-05 from StarBot — peeled cyborg-woman, cyborg-man, and
 * robot-moment paths into their own bot. StarBot keeps the cosmos / alien
 * worlds / sci-fi-IP scenes; MechBot owns the machine-character territory.
 */

const pools = require('./pools');

const pathBuilders = {
  'robot-moment': require('./paths/robot-moment'),
  'humanoid-robots': require('./paths/humanoid-robots'),
  'cyborg-woman': require('./paths/cyborg-woman'),
  'scifi-cyborg-female': require('./paths/scifi-cyborg-female'),
  'killer-cyborgs': require('./paths/killer-cyborgs'),
  'killer-cyborgs-male': require('./paths/killer-cyborgs-male'),
  'og-cyborg-female': require('./paths/og-cyborg-female'),
  'mech-insect-hybrids': require('./paths/mech-insect-hybrids'),
  'hunter-killers': require('./paths/hunter-killers'),
  'abyss-mechs': require('./paths/abyss-mechs'),
  sentinels: require('./paths/sentinels'),
  'chrome-shogun': require('./paths/chrome-shogun'),
  'arena-titans': require('./paths/arena-titans'),
  'void-lancers': require('./paths/void-lancers'),
  // 2026-05-17: DISABLED per Kevin — only the axis cyborg-woman path fires now.
  // Legacy function-form preserved at paths/legacy/cyborg-woman.js for reference.
  // 'cyborg-female-legacy': require('./paths/legacy/cyborg-woman'),
  // 2026-05-17: per Kevin — third cyborg-female path with assassin slant
  // (killer / rogue / mysterious / capable / violent). Same axis system as
  // cyborg-woman, different template that pulls her into predator territory.
  'droid-assassin': require('./paths/droid-assassin'),
  // 2026-05-26: REBUILT to the "android-man" register (full rich axis system,
  // MECHBOT_ANDROID_MAN archetype). Mostly-machine male android-being,
  // full-figure, rugged — fixes the bust-portrait + organic-head-pasted-on-
  // chrome-body failure of cyborg-male-legacy. cyborg-male-legacy now DISABLED
  // (function-form preserved at paths/legacy/cyborg-man.js for reference).
  'cyborg-man': require('./paths/cyborg-man'),
  // 'cyborg-male-legacy': require('./paths/legacy/cyborg-man'),  // 2026-05-26 DISABLED — superseded by android-man rebuild
  'mecha-pilots': require('./paths/mecha-pilots'),
  'titan-war-machines': require('./paths/titan-war-machines'),
  'power-armor-infantry': require('./paths/power-armor-infantry'),
  'post-apoc-rust-tech': require('./paths/post-apoc-rust-tech'),
  'alien-biomechs': require('./paths/alien-biomechs'),
  'mech-skyships': require('./paths/mech-skyships'),
};

module.exports = {
  username: 'mechbot',
  displayName: 'MechBot',

  // Single locked medium — `render` (high-end cinematic 3D / VFX-quality).
  // Matches the original StarBot cyborg/robot behavior pre-migration.
  mediums: ['render'],

  // Full vibe rotation per path. Cyborg-woman gets the warm-leaning set,
  // cyborg-man the colder/fiercer set, robot-moment a broad cinematic mix.
  vibesByPath: {
    'cyborg-woman': [
      'cinematic',
      'dark',
      'epic',
      'nostalgic',
      'psychedelic',
      'ethereal',
      'arcane',
      'enchanted',
      'voltage',
      'shimmer',
      'surreal',
      'peaceful',
      'minimal',
    ],
    'cyborg-female-legacy': [
      'cinematic',
      'dark',
      'epic',
      'nostalgic',
      'psychedelic',
      'ethereal',
      'arcane',
      'enchanted',
      'voltage',
      'shimmer',
      'surreal',
      'peaceful',
      'minimal',
    ],
    'droid-assassin': [
      // Skewed darker / cooler / more lethal — drop the peaceful/enchanted/shimmer ones
      'cinematic',
      'dark',
      'fierce',
      'nightshade',
      'macabre',
      'voltage',
      'nostalgic',
      'arcane',
      'surreal',
      'epic',
    ],
    'cyborg-man': [
      'cinematic',
      'dark',
      'epic',
      'nostalgic',
      'arcane',
      'ancient',
      'fierce',
      'voltage',
      'nightshade',
      'macabre',
      'surreal',
    ],
    'cyborg-male-legacy': [
      'cinematic',
      'dark',
      'epic',
      'nostalgic',
      'arcane',
      'ancient',
      'fierce',
      'voltage',
      'nightshade',
      'macabre',
      'surreal',
    ],
    'robot-moment': [
      'cinematic',
      'dark',
      'epic',
      'nostalgic',
      'arcane',
      'ancient',
      'fierce',
      'voltage',
      'nightshade',
      'ethereal',
      'minimal',
      'peaceful',
    ],
    'humanoid-robots': [
      'cinematic',
      'dark',
      'epic',
      'nostalgic',
      'psychedelic',
      'ethereal',
      'arcane',
      'voltage',
      'shimmer',
      'surreal',
      'peaceful',
      'minimal',
      'fierce',
      'nightshade',
    ],
    'mecha-pilots': [
      'cinematic',
      'dark',
      'epic',
      'nostalgic',
      'voltage',
      'fierce',
      'shimmer',
      'surreal',
      'minimal',
    ],
    'titan-war-machines': [
      'cinematic',
      'dark',
      'epic',
      'fierce',
      'voltage',
      'macabre',
      'nightshade',
      'ancient',
    ],
    'power-armor-infantry': [
      'cinematic',
      'dark',
      'epic',
      'fierce',
      'voltage',
      'nightshade',
      'macabre',
      'minimal',
      'ancient',
    ],
    'post-apoc-rust-tech': [
      'cinematic',
      'dark',
      'fierce',
      'macabre',
      'nightshade',
      'ancient',
      'voltage',
      'nostalgic',
    ],
    'alien-biomechs': [
      'dark',
      'macabre',
      'nightshade',
      'voltage',
      'arcane',
      'surreal',
      'fierce',
      'cinematic',
      'psychedelic',
    ],
    'mech-skyships': [
      'cinematic',
      'epic',
      'dark',
      'fierce',
      'voltage',
      'shimmer',
      'ethereal',
      'nightshade',
      'ancient',
      'surreal',
    ],
  },

  // Picker on. 2026-06-05: Kevin banned Flux 2 Flex + Flux 2 Max + Flux 2 Pro
  // fleet-wide from mechbot — keeping 5 models. Defined explicitly (not via
  // subtraction of ALL_ENABLED_AI_MODELS) so the lineup is auditable.
  // BOT_MODEL_TALLY.md is the source of truth.
  useModelPicker: true,
  // 2026-06-21 (Kevin) — MechBot is FLUX-LOCKED bot-wide to flux-1.1-pro +
  // flux-1.1-pro-ultra ONLY. Nano Banana (google/gemini-2-image) and gpt-image-2
  // are both banned: Banana goes painterly / over-symmetric and renders the
  // hard-surface mech + organic-biomech briefs as unreadable mush (the hearted
  // alien-biomechs failure), and gpt-2 produces greeble-clutter. flux-dev also
  // dropped (lowest Flux fidelity; was already off the robot/mech paths).
  allowedModels: ['black-forest-labs/flux-1.1-pro-ultra', 'black-forest-labs/flux-1.1-pro'],

  // Per-path bans (2026-05-30): cyborg-woman + cyborg-man drop Nano Banana
  // and Flux 2 Pro per Kevin's review of the 24-render cyborg-woman test.
  // 2026-06-05: Flux 2 Flex + Flux 2 Max also removed here (fleet-wide ban
  // above already excludes them, but kept consistent for readability).
  // cyborg-man path is deactivated 2026-06-05 — entry left for reference if
  // the path is ever re-enabled.
  // cleanMediumByModel retired 2026-06-21 — it only ever routed Nano Banana /
  // gpt-2 to the clean medium, and both are now banned bot-wide (FLUX-only).
  cleanMediumByModel: {},

  promptPrefixByMedium: {
    mechbot_gpt_clean: 'mech sci-fi scene',
  },

  modelByPath: {
    // 2026-06-21: Flux-locked (1.1-pro + ultra) with the bot-wide ban.
    'cyborg-woman': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    // NEW exotic path — Flux (highest fidelity for dense exotic detail) +
    // nano-banana. gpt-2 excluded bot-wide; flux-dev excluded for fidelity.
    // Locked to Flux 1.1-pro + ultra (2026-06-09, Kevin) — banana goes painterly
    // and fights the photoreal alien/cyborg hybrid look.
    'scifi-cyborg-female': [
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    // killer-cyborgs — Flux-locked like its scifi parent (verbatim clone).
    'killer-cyborgs': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    'killer-cyborgs-male': [
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    // mech-insect-hybrids — Flux-locked for crisp hard-surface bio-mech detail.
    'mech-insect-hybrids': [
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    // hunter-killers — Flux-locked for crisp hard-surface military-machine detail.
    'hunter-killers': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    // abyss-mechs — Flux-locked for crisp hard-surface deep-sea machine detail.
    'abyss-mechs': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    // sentinels — Flux-locked for the colossal ancient-guardian awe register.
    sentinels: ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    // chrome-shogun — Flux-locked for crisp ornate samurai-mech armor detail.
    'chrome-shogun': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    // arena-titans — Flux-locked for crisp gladiator-mech detail + stadium spectacle.
    'arena-titans': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    // void-lancers — Flux-locked for crisp zero-G orbital mech-knight hardware.
    'void-lancers': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    // OG path — FLUX ONLY for the photoreal glossy beauty look (banana goes
    // painterly + breaks the photoreal register; gpt-2 banned bot-wide).
    'og-cyborg-female': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    // cyborg-man — DEACTIVATED 2026-06-05 from bot.paths; modelByPath entry
    // removed since it never resolves. Restore the entry above with banana if
    // the path is re-enabled.
    // flux-dev BANNED from these robot/mech paths 2026-06-09 (Kevin) — it was
    // over-represented in the bland front-on renders + lowest Flux fidelity.
    'droid-assassin': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    'mecha-pilots': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    'humanoid-robots': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    'power-armor-infantry': [
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'robot-moment': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
  },

  // Previous modelByPath: stripped 2026-05-30 to let allowedModels picker drive selection.
  // Original locks (restore individual lines if a path needs pinning again):
  // modelByPath: {
  // 'cyborg-woman': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
  // 'cyborg-female-legacy': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
  // 'droid-assassin': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
  // 'cyborg-man': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
  // 'cyborg-male-legacy': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
  // 'robot-moment': { 'black-forest-labs/flux-1.1-pro': 100 },
  // 'humanoid-robots': { 'black-forest-labs/flux-1.1-pro': 100 },
  // 'mecha-pilots': { 'black-forest-labs/flux-1.1-pro': 100 },
  // 'titan-war-machines': { 'black-forest-labs/flux-1.1-pro': 100 },
  // 'power-armor-infantry': { 'black-forest-labs/flux-1.1-pro': 100 },
  // 'industrial-machines': { 'black-forest-labs/flux-1.1-pro': 100 },
  // 'post-apoc-rust-tech': { 'black-forest-labs/flux-1.1-pro': 100 },
  // 'alien-biomechs': { 'black-forest-labs/flux-1.1-pro': 100 },
  // 'mech-skyships': { 'black-forest-labs/flux-1.1-pro': 100 },
  // },

  // Per-path prefix — injected BEFORE style prefix so it's the first tokens Flux sees.
  promptPrefixByPath: {
    // 2026-05-26: EMPTY per the playbook "stuffed-wrappers gridlock diversity"
    // lesson — the android-man rebuild leads with the Sonnet body's mandatory
    // full-figure opening tag, not a stuffed wrapper.
    'cyborg-man': '',
    'cyborg-male-legacy':
      'handsome adult male man (NOT female NOT woman), masculine face, narrow hips, torso clad in cyborg shell — synth-mesh / composite panels / chrome underweave / mechanical mesh covering chest and abdomen as integrated cyborg anatomy (NOT bare skin, NOT a shirt, NOT fabric clothing — this material IS his body covering), cybernetic breakthroughs across face / neck / forearms / hands, not a full robotic chassis',
    // 2026-06-09: dropped the "beautiful woman" lead — it front-loaded the same
    // glossy-pinup centroid on every render (look-homogenization). Kept only the
    // identity GUARD (human-bodied, not a robotic chassis); the visual REGISTER
    // is now set per-render by the rolled look-register (see the template's LOOK
    // OVERRIDE block). The template still enforces the full cyborg-woman DNA.
    'cyborg-woman': 'a woman, cybernetics integrated into a human body, not a robotic chassis',
    'cyborg-female-legacy':
      'beautiful woman, cybernetic breakthroughs integrated into a human body rather than a robotic chassis',
    'droid-assassin':
      'cool predator-droid (ninja / combat / cyber-cop / military / hunter), sleek robotic killer with cinematic poise, dramatic atmospheric rim-light',
    // 2026-05-15: bespoke-axis migration. Empty per playbook
    // "stuffed-wrappers gridlock diversity" lesson. Sonnet body leads.
    'titan-war-machines': '',
    'mech-skyships': '',
    'mecha-pilots': '',
    'power-armor-infantry': '',
    'post-apoc-rust-tech': '',
    'humanoid-robots': '',
    // 2026-06-21: testing the ORIGINAL StarBot cyborg-woman path prefix here too
    // (verbatim, commit 1a278ac3) — same drift fix as og-cyborg-female.
    'scifi-cyborg-female':
      'beautiful woman, cybernetic breakthroughs integrated into human body (not a robotic chassis)',
    'killer-cyborgs': '',
    'killer-cyborgs-male': '',
    // 2026-06-21: restored the ORIGINAL StarBot cyborg-woman path prefix
    // (verbatim from starbot/index.js promptPrefixByPath, commit 1a278ac3) —
    // the path had drifted to a robotic-chassis look on MechBot because the
    // empty path-prefix let the bot-wide "intricate mechanical surfaces" lead
    // CLIP. This puts "beautiful woman" back as the first tokens Flux reads.
    'og-cyborg-female':
      'beautiful woman, cybernetic breakthroughs integrated into human body (not a robotic chassis)',
    'mech-insect-hybrids': '',
    'hunter-killers': '',
    'abyss-mechs': '',
    sentinels: '',
    'chrome-shogun': '',
    'arena-titans': '',
    'void-lancers': '',
    // cyborg-woman keeps its legacy prefix (defined above) since it's the
    // load-bearing "beautiful woman with cybernetic breakthroughs integrated
    // into human body" coherence cue — preserved during axis migration.
  },

  // Per-medium prompt injection — MechBot's dialect for the `render` medium.
  // Front-loads photoreal / VFX language ahead of the Sonnet-written scene.
  mediumStyles: {
    // gpt-image-2 clean medium (routed via mediumByModel above). Pulls
    // GPT-Image-2 out of the abstract-plate prior triggered by the bot's
    // production-art prefix + mech render mediums. Mirrors mystical-mermaid
    // (2026-06-05).
    mechbot_gpt_clean:
      'Cinematic mech illustration, clean editorial-poster render with clearly readable mechanical detail and recognizable machinery, polished metal palette with atmospheric depth, ornate-industrial sci-fi register',
    // 2026-06-02 cruft-audit micro-strip — dropped tech-spec `4K film-
    // finish polish` + 3-stack NOT tail (NOT cartoon / NOT toy / NOT
    // videogame). "Feature-film VFX quality / physically-based rendering /
    // raytraced reflections / cinematic lighting precision" anchors carry
    // the VFX-render register.
    render:
      'high-end cinematic 3D render, realistic materials and reflections, volumetric atmosphere',
  },

  // 2026-06-02 cruft-audit micro-strip — dropped `hyper-detailed` (prefix)
  // and `hyper detailed` (suffix) tech-spec adjectives. MechBot's index.js
  // overrides the shared-blocks PROMPT_PREFIX/SUFFIX so both layers needed
  // the same edit.
  promptPrefix: 'cinematic sci-fi concept art, intricate mechanical surfaces',
  promptSuffix: 'no text, no words, no watermarks, masterpiece quality',

  vibes: ['cinematic'],

  paths: [
    'robot-moment',
    'humanoid-robots',
    // 'cyborg-woman',  // TEMP DISABLED 2026-06-09 — replaced in rotation by the 4 new cyborg-female paths below. Re-enable by uncommenting.
    'scifi-cyborg-female',
    'killer-cyborgs',
    'killer-cyborgs-male',
    'og-cyborg-female',
    'mech-insect-hybrids',
    'hunter-killers',
    'abyss-mechs',
    'sentinels',
    'chrome-shogun',
    'arena-titans',
    'void-lancers',
    // 'cyborg-female-legacy',  // 2026-05-17 DISABLED — see pathBuilders comment
    'droid-assassin',
    // 'cyborg-man',  // 2026-06-05 DISABLED (Kevin) — even after killing the mandatory opening tag, renders are unusable; redesign deferred
    // 'cyborg-male-legacy',  // 2026-05-26 DISABLED — superseded by android-man rebuild
    'mecha-pilots',
    'titan-war-machines',
    'power-armor-infantry',
    'post-apoc-rust-tech',
    'alien-biomechs',
    'mech-skyships',
  ],

  // Even split — equal weights for first-pass bring-up.
  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [
      'cyborg-woman',
      'cyborg-female-legacy',
      'droid-assassin',
      'cyborg-man',
      'cyborg-male-legacy',
      'robot-moment',
      'humanoid-robots',
      'mecha-pilots',
      'titan-war-machines',
      'power-armor-infantry',
      'post-apoc-rust-tech',
      'alien-biomechs',
      'mech-skyships',
    ],
  },

  // Two-pass Sonnet→Haiku polish.
  // Per playbook lesson #6 (2026-05-15): new-axis-system paths skip polish —
  // Haiku compression drops path-bespoke DNA / vocabulary / detail.
  twoPassPolish: {
    enabled: true,
    conceptWords: 150,
    polishedWords: '80-110',
    skipPaths: [
      'titan-war-machines',
      'mech-skyships',
      'mecha-pilots',
      'power-armor-infantry',
      'post-apoc-rust-tech',
      'humanoid-robots',
      'cyborg-woman',
      'droid-assassin',
      'cyborg-man',
    ],
    preservePhrasesByPath: {
      // Force Haiku polish to keep leg-count tokens — Flux's bipedal-default
      // bias collapses tripedal/hexapod/quadrupedal seeds to 2-legged renders
      // unless the count is HEAVILY repeated in the prompt.
      'robot-moment': [
        'tripedal',
        'tripod',
        'three legs',
        'three pneumatic legs',
        'three telescoping legs',
        'three strut legs',
        'three hydraulic legs',
        'quadrupedal',
        'four-legged',
        'four legs',
        'four pneumatic legs',
        'four reinforced legs',
        'four strut legs',
        'hexapod',
        'six-legged',
        'six legs',
        'six pneumatic legs',
        'six articulated legs',
        'six rubber-tipped legs',
        'octopod',
        'eight legs',
        'four mechanical arms',
        'four arms',
        'six arms',
        'multi-armed',
      ],
      'titan-war-machines': [
        'tripedal',
        'three legs',
        'quadrupedal',
        'four-legged',
        'four legs',
        'hexapedal',
        'hexapod',
        'six-legged',
        'six legs',
        'serpentine',
        'wormlike',
        'centaur',
        'centaur-base',
      ],
      'alien-biomechs': [
        'arthropod',
        'eight legs',
        'six-legged',
        'six legs',
        'cephalopod',
        'six tendrils',
        'four tendrils',
        'eight tendrils',
        'serpentine',
        'segmented',
      ],
    },
  },

  // Sensory anchors — 4 contexts. New paths map to 'scene' until they earn
  // dedicated sensory pools (next iteration).
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      'cyborg-woman': 'cyborg-female',
      'cyborg-female-legacy': 'cyborg-female',
      'droid-assassin': 'cyborg-female',
      'cyborg-man': 'cyborg-male',
      'cyborg-male-legacy': 'cyborg-male',
      'robot-moment': 'robot',
      'humanoid-robots': 'robot',
      'mecha-pilots': 'scene',
      'titan-war-machines': 'scene',
      'power-armor-infantry': 'scene',
      'post-apoc-rust-tech': 'scene',
      'alien-biomechs': 'scene',
      'mech-skyships': 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  rollSharedDNA({ vibeKey, path, picker }) {
    const base = {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.cinematic,
    };
    if (path === 'cyborg-woman' || path === 'cyborg-female-legacy') {
      base.characterBase = picker.pickWithRecency(
        pools.CYBORG_FEMALE_CHARACTERS,
        'cyborg_female_character'
      );
      base.skin = picker.pickWithRecency(pools.CYBORG_SKIN_TONES, 'cyborg_skin');
      base.bodyType = picker.pickWithRecency(pools.CYBORG_BODY_TYPES, 'cyborg_body');
      base.eyes = picker.pick(pools.CYBORG_EYE_STYLES);
      base.hair = picker.pick(pools.CYBORG_HAIR_STYLES);
      base.internal = picker.pickWithRecency(pools.CYBORG_INTERNAL_EXPOSURE, 'cyborg_internal');
      base.glowColor = picker.pickWithRecency(pools.CYBORG_GLOW_COLORS, 'cyborg_glow');
      // Visual-treatment axis (2026-06-09) — rolls a different rendering register
      // per render so the look stops collapsing to one glossy-photoreal pinpup.
      base.lookRegister = picker.pickWithRecency(
        pools.CYBORG_WOMAN_LOOK_REGISTER,
        'cyborg_look_register'
      );
    }
    if (path === 'droid-assassin') {
      // 2026-05-17: NINJA-BOT path (path name retained for back-compat). Pure
      // cyber-ninja robot — Genji / Gray Fox / Sandevistan cyber-ninja / Snake-
      // Eyes-as-droid energy. NO human, NO woman, NO femme — just cool ninja-
      // bots. DNA is minimal: chassis-paint + glow color. The template defines
      // everything else.
      base.characterBase =
        'Predator-droid spread — pick from 5 archetypes per render: cyber-ninja (sleek shadow-assassin) / combat-droid (heavy assault killer) / cyber-cop (police enforcer) / military-droid (uniformed soldier) / hunter-droid (lone tracker). Cool lethal robot, NO human, NO woman, NO femme.';
      base.skin = picker.pickWithRecency(pools.CYBORG_SKIN_TONES, 'cyborg_skin');
      base.bodyType =
        'Predator-droid chassis spectrum — ranges from sleek-lithe ninja chassis (Gray Fox / Genji / Sandevistan) through tactical mid-build (cyber-cop / military-soldier) to heavy combat-assault chassis (Death Trooper / ODST / Helldivers Automaton). The chassis register matches the archetype the template picks for the scene.';
      base.eyes = picker.pick(pools.CYBORG_EYE_STYLES);
      base.hair =
        'No hair — fully helmeted ninja-bot head OR exposed cybernetic cranial-sensor cluster OR sleek smooth chrome skull-dome (no human face features visible)';
      base.internal = picker.pickWithRecency(pools.CYBORG_INTERNAL_EXPOSURE, 'cyborg_internal');
      base.glowColor = picker.pickWithRecency(pools.CYBORG_GLOW_COLORS, 'cyborg_glow');
    }
    if (path === 'cyborg-man' || path === 'cyborg-male-legacy') {
      base.characterBase = picker.pickWithRecency(
        pools.CYBORG_MALE_CHARACTERS,
        'cyborg_male_character'
      );
      base.skin = picker.pickWithRecency(pools.CYBORG_MALE_SKIN_TONES, 'cyborg_male_skin');
      base.bodyType = picker.pick(pools.CYBORG_MALE_BODY_TYPES);
      base.eyes = picker.pick(pools.CYBORG_EYE_STYLES);
      base.hair = picker.pick(pools.CYBORG_MALE_HAIR_STYLES);
      base.internal = picker.pickWithRecency(
        pools.CYBORG_MALE_INTERNAL_EXPOSURE,
        'cyborg_male_internal'
      );
      base.glowColor = picker.pickWithRecency(pools.CYBORG_GLOW_COLORS, 'cyborg_glow');
    }
    return base;
  },

  // Bot-level pool defaults for the new composer architecture (2026-05-15).
  // Universal axes resolve from these when a path doesn't override.
  defaultPools: {
    lighting: 'LIGHTING',
    atmosphere: 'ATMOSPHERES',
  },

  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`MechBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`MechBot: unknown path "${path}"`);
    if (typeof builder === 'function') {
      return builder({ sharedDNA, vibeDirective, vibeKey, picker });
    }
    if (builder && typeof builder === 'object' && builder.archetype) {
      const { composeBrief } = require('../../lib/brief-composer');
      return composeBrief({
        bot: module.exports,
        pathConfig: builder,
        sharedDNA,
        vibeDirective,
        picker,
      });
    }
    throw new Error(`MechBot: path "${path}" has invalid export shape`);
  },

  caption({ path }) {
    return `[${path}] MechBot`;
  },
};
