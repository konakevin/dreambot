/**
 * DragonBot — the bot-engine contract.
 *
 * High-fantasy magical worlds + landscapes + arcane + characters.
 * LOTR/GoT/Harry-Potter/Elden-Ring/Witcher/Warhammer-concept-art energy.
 * Landscape is FLAGSHIP. Mixed scene/character. Characters by role only.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');
const { ALL_ENABLED_AI_MODELS } = require('../../lib/imageModels');

const pathBuilders = {
  landscape: require('./paths/landscape'),
  'fantasy-scene': require('./paths/fantasy-scene'),
  'epic-moment': require('./paths/epic-moment'),
  // 2026-05-17: NEW majestic castle path — 100% castle-as-hero, distinct
  // from epic-moment (50/50 castle + event). Pure establishing-shot energy.
  castle: require('./paths/castle'),
  'dragon-scene': require('./paths/dragon-scene'),
  'dragon-rider': require('./paths/dragon-rider'),
  'dragon-hoard': require('./paths/dragon-hoard'),
  'dragon-battle': require('./paths/dragon-battle'),
  'female-adventurer': require('./paths/female-adventurer'),
  // 2026-05-23: carbon copy of the cool-armor female-adventurer state.
  // female-adventurer was reverted to its 2026-05-14 baseline; this path
  // carries the perfected cool-armor + adventurous-scene look forward.
  'female-explorer': require('./paths/female-explorer'),
  'female-action-scenes': require('./paths/female-action-scenes'),
  'artsy-girl': require('./paths/artsy-girl'),
  'male-adventurer': require('./paths/male-adventurer'),
  // 2026-05-23: male counterpart of female-explorer (cool gritty armor +
  // candid adventurous scenes).
  'male-explorer': require('./paths/male-explorer'),
  'male-action-scenes': require('./paths/male-action-scenes'),
  'cozy-arcane': require('./paths/cozy-arcane'),
  'arcane-halls': require('./paths/arcane-halls'),
  'arcane-spaces': require('./paths/arcane-spaces'),
  'dark-realm': require('./paths/dark-realm'),
  'dragon-lore': require('./paths/dragon-lore'),
  // 2026-05-14: wow-landscape + lotr-landscape merged into iconic-landscape
  'iconic-landscape': require('./paths/iconic-landscape'),
  'wow-architecture': require('./paths/wow-architecture'),
  'eldenring-landscape': require('./paths/eldenring-landscape'),
  'eldenring-architecture': require('./paths/eldenring-architecture'),
};

module.exports = {
  username: 'dragonbot',
  displayName: 'DragonBot',

  // EXPERIMENT (2026-05-03) — hardcode FaeBot's painterly fantasy medium
  // across every DragonBot path. Tests whether the same minimal medium tag
  // + creature-description-leads structure that worked for FaeBot also
  // produces stop-and-stare fantasy renders for DragonBot subjects.
  // Old `mediums: ['canvas', 'watercolor', 'illustration', 'render']` was
  // a 4-medium roulette; replaced with single locked bot-internal medium.
  defaultMedium: 'painted_fantasy_novel',

  // Minimal medium tag — FaeBot lesson: long medium descriptors at frontload
  // hijack Flux into rendering trained-cliche compositions. Short tag here
  // lets each path's creature/scene description lead the prompt.
  // Bit-identical to FaeBot's mediumStyles (with the one "enchanted-forest"
  // context word dropped — DragonBot is dragon-fantasy, not forest).
  // FaeBot uses: 'enchanted-forest fantasy concept art, painterly'
  mediumStyles: {
    // gpt-image-2 clean (routed via mediumByModel below). Pulls GPT-Image-2
    // out of the abstract painterly-plate prior the bot's painted_fantasy
    // medium + dragon-scene's 5-painter prefix trigger. Mirrors mystical-
    // mermaid (2026-06-05). The painterly per-path prefixes (dragon-scene,
    // artsy-girl) are stripped for gpt-2 via gptCleanPathPrefixByPath below
    // (engine swaps in the cleaned prefix — content kept, painters dropped).
    dragonbot_gpt_clean: blocks.GPT_CLEAN,
    painted_fantasy_novel: 'fantasy concept art, painterly',
  },

  // cleanMediumByModel: gpt-image-2 renders the bot-only clean medium (DragonBot
  // has no nano-banana in its lineup, so gpt-2 only). On the two painterly paths
  // (dragon-scene, artsy-girl) the path-prefix is dropped ('') on this swap — the
  // seed pools (DRAGON_SCENE_DRAGON anatomy; FANTASY_RACE / ARTSY_GIRL_OUTFIT /
  // ARTSY_GIRL_ACTION) carry the subject, so we don't leak the painter name-drops
  // that pull gpt-2 abstract. Flux is unaffected (it still uses the full
  // promptPrefixByPath painterly wrappers below). 2026-06-07.
  cleanMediumByModel: {
    'openai/gpt-image-2': {
      medium: 'dragonbot_gpt_clean',
      pathPrefix: { 'dragon-scene': '', 'artsy-girl': '' },
    },
  },

  // Override prefix to empty (matches FaeBot exactly).
  promptPrefix: '',

  // Per-path prefix override — locks Flux's first-token interpretation to
  // the path's visual lineage. Engine prepends this BEFORE all other prefix
  // layers (scripts/lib/botEngine.js line 981).
  promptPrefixByPath: {
    'dragon-scene':
      'Frank Frazetta + Brom + Boris Vallejo + Greg Hildebrandt + Michael Whelan painted-fantasy-novel-cover oil tradition, traditional Western high-fantasy DRAGON as the hero — four legs + two massive membrane wings + horned reptilian skull + thick scaled body + long muscular tail (NOT a serpent NOT a wyvern), jaw-dropping epic fantasy landscape with multi-layer depth, painterly atmospheric grandeur, LOTR + GoT + Elden Ring + Skyrim + Warcraft + D&D visual lineage, awe-inducing concept-art masterwork',
    // dragon-rider: anchor the Western-dragon + mounted-rider + painted-oil
    // lineage so Flux reads "dragon with a rider on it" first (2026-06-10).
    'dragon-rider':
      'Frank Frazetta + Brom + Boris Vallejo + Michael Whelan painted-fantasy-novel-cover oil tradition, a colossal traditional Western DRAGON — four legs + two massive membrane wings + horned reptilian skull + thick scaled body + long tail (NOT a serpent NOT a wyvern) — WITH A SINGLE RIDER MOUNTED ASTRIDE its neck/shoulders, dynamic flight-or-battle moment, epic fantasy sky with multi-layer depth, painterly atmospheric grandeur, Eragon + GoT + Skyrim visual lineage, awe-inducing concept-art masterwork',
    // dragon-hoard: anchor the Western dragon coiled on a mountain of treasure.
    'dragon-hoard':
      'Frank Frazetta + Brom + Michael Whelan painted-fantasy-novel-cover oil tradition, a colossal traditional Western DRAGON — four legs + two massive membrane wings + horned reptilian skull + thick scaled body + long tail (NOT a serpent NOT a wyvern) — coiled atop an OVERWHELMING mountain of glittering golden treasure in its cavern lair, opulent Smaug-on-the-hoard grandeur, dramatic warm light catching the gold, painterly atmospheric depth, LOTR + GoT + D&D visual lineage, awe-inducing concept-art masterwork',
    // dragon-battle: anchor the Western war-dragon mid-attack.
    'dragon-battle':
      'Frank Frazetta + Brom + Boris Vallejo painted-fantasy-novel-cover oil tradition, a colossal traditional Western DRAGON — four legs + two massive membrane wings + horned reptilian skull + thick scaled body + long tail (NOT a serpent NOT a wyvern) — MID-ATTACK breathing fire and unleashing destruction on a castle or army, explosive battle spectacle with flame smoke embers and chaos, dramatic fire-lit grandeur, painterly atmospheric depth, GoT + LOTR + Warcraft visual lineage, awe-inducing concept-art masterwork',
    // EMPTY by design (2026-05-14). The historic May-3 era female-warrior
    // renders had varied races (tabaxi, drow, night elf, half-elf, jaguar-
    // furred warrior in cinnabar-red lacquer) because the wrapper was just
    // the medium tag, letting Sonnet's race-led body land in the first
    // tokens Flux reads. The 120-token stuffed prefix I added gridlocked
    // every render onto generic-fantasy-heroine. Match historic: empty.
    'female-adventurer': '',
    // EMPTY by design — carbon copy of female-adventurer's wrapper-strip lesson.
    'female-explorer': '',
    // EMPTY by design — same lesson as female-adventurer. Sonnet's peak-
    // action body is what Flux needs to read first, not a stuffed wrapper.
    'female-action-scenes': '',
    // EMPTY by design — male mirror of female-adventurer.
    'male-adventurer': '',
    // EMPTY by design — male-explorer mirror of female-explorer.
    'male-explorer': '',
    // EMPTY by design — male mirror of female-action-scenes (cranked multi-effect)
    'male-action-scenes': '',
    // EMPTY by design — flagship landscape path. Per wrapper-gridlock lesson,
    // Sonnet's land-is-alive body must lead, not a stuffed prefix.
    landscape: '',
    // EMPTY by design — dragon-lore archaeological-fantasy scene path
    'dragon-lore': '',
    // EMPTY by design — dark-realm corrupted-wasteland scene path
    'dark-realm': '',
    // EMPTY by design — fantasy-scene character+landscape path. Sonnet's
    // character+landscape body must lead, not a stuffed prefix.
    'fantasy-scene': '',
    // EMPTY by design — epic-moment (epic castle scenes) wide-shot path.
    // Sonnet's castle+event body must lead.
    'epic-moment': '',
    // EMPTY by design — castle path (100% castle-as-hero establishing shot).
    // Sonnet's castle + biome + sky body must lead.
    castle: '',
    // EMPTY by design — iconic-landscape merged path. Sonnet's stylized-biome
    // body must lead.
    'iconic-landscape': '',
    // EMPTY by design — arcane-halls cathedral-magic-interior path.
    // Sonnet's hall + magic-overload body must lead.
    'arcane-halls': '',
    // EMPTY by design — arcane-spaces no-character grand-interior path.
    'arcane-spaces': '',
    // Originally a frozen 2026-05-13 clone of female-warrior (Frazetta-cheesecake
    // painted-fantasy-cover renders Kevin loved). 2026-05-25: (1) lush full-color
    // tuning, (2) REMOVED the artist names (Frazetta/Brom/Vallejo/Hildebrandt/
    // Whelan) — they were a training-data lock that forced the same tan brunette
    // woman every render and overrode the rolled race/hair DNA. Replaced with a
    // descriptive painted-oil-illustration medium so varied races/hair render.
    'artsy-girl':
      'classic painted fantasy-novel-cover oil illustration — hand-painted oil-on-canvas with visible painterly brushwork, rich impasto and soft glazing, dramatic romantic-realist sword-and-sorcery paperback cover art, rendered in LUSH, RICH FULL COLOR (deep full-bodied saturated oil-pigment palette, rich naturalistic color depth, full jewel-tone hues), a single heroic WOMAN of a SPECIFIC NON-DEFAULT-HUMAN fantasy lineage — render the race anatomy and tone as the ABSOLUTE FIRST visual property (drow = obsidian skin OR dragonborn = scaled face OR tiefling = horns AND red/violet skin OR orc = green skin AND tusks OR night-elf = purple skin AND glowing silver eyes OR blood-elf = glowing fel-green eyes OR aasimar = alabaster with inner glow OR genasi = elemental-tinted skin) — race is NEVER a pale-European-woman default, at 25-40% of frame full body mid-action wearing an exotic fantasy battle outfit and wielding a signature weapon — the specific armor style, materials, silhouette, and weapon varies DRAMATICALLY entry to entry (lamellar / scale / chitin / dragonbone / coral / mithril / lacquered / engraved / barbarian fur-and-bone / desert-nomad wraps / samurai bound silk — and weapons axe / spear / glaive / bow / staff / hammer / kukri / scimitars / runeblade as often as sword), CANDID PEACEFUL ADVENTURING moment between battles (NO combat NO violence — weapons holstered or being maintained), epic fantasy landscape as her stage, painterly atmospheric grandeur, LOTR + GoT + Elden Ring + Skyrim + Witcher visual lineage, awe-inducing concept-art masterwork',
  },
  // Bit-identical to FaeBot's PROMPT_SUFFIX (with forest-specific phrases
  // dropped — "atmospheric forest illustration" and the
  // "Brian Froud + Mononoke + Magic-the-Gathering green-mana" lineage,
  // both forest-fae specific). Otherwise identical.
  promptSuffix:
    'painted fantasy concept art, soft brushwork, dreamy dappled light, no text, no watermarks',

  // Picker on with the full 8-model lineup per BOT_MODEL_TALLY (2026-05-30).
  // Previously locked entirely to flux-1.1-pro via `useModelPicker:false` +
  // per-path modelByPath — Kevin opened it up to all 8 models.
  useModelPicker: true,
  // Bot-wide allowedModels: bot-wide MINUS Flux Dev + Flux 2 Max
  // (Kevin 2026-05-31), MINUS Flux 2 Pro (Kevin 2026-06-02, fleet-wide
  // heart-ban), MINUS Flux 2 Flex (Kevin 2026-06-05, F2 Flex was the
  // remaining F2-family model and the path-level audits had been banning
  // it on every reviewed path anyway — promoting to bot-wide), AND
  // MINUS Nano Banana (Kevin 2026-06-05, banned bot-wide).
  // Was `ALL_ENABLED_AI_MODELS` — dropped 5 models fleet-wide for DragonBot
  // after audit. Explicit list because bot is a proper subset.
  allowedModels: [
    'openai/gpt-image-2',
    'black-forest-labs/flux-1.1-pro-ultra',
    'black-forest-labs/flux-1.1-pro',
  ],

  // Per-path bans (2026-05-31): Kevin reviewed the 4 female-character
  // dragonbot paths (artsy-girl + female-adventurer/explorer/action-scenes)
  // × 8 models × 3 reps and hearted the renders he WANTED REMOVED. The
  // surviving model arrays are the bot-wide 8 minus his bans per path.
  // modelByPath takes precedence over allowedModels in the engine
  // (botEngine.js lines 1279-1311) — only these paths are constrained;
  // remaining paths roll from the bot-wide allowedModels.
  //
  // Bans (model → reason):
  //   artsy-girl              ─ GPT-2  (no male twin in dragonbot — female-only)
  //   female-adventurer       ─ (Banana ban now subsumed by bot-wide)
  //   female-explorer         ─ Flux Dev                (mirrored to male-explorer)
  //   female-action-scenes    ─ GPT-2, Flux Dev, Flux 2 Pro
  //                                                     (mirrored to male-action-scenes)
  //
  // Note: Flux Dev BANNED across ALL paths 2026-06-07 (Kevin) — removed from
  // the artsy-girl / female-adventurer / male-adventurer overrides (the only
  // paths that still re-enabled it); it was already excluded bot-wide.
  //
  // Note: Flux 2 Flex + Flux 2 Max + Nano Banana were banned bot-wide
  // 2026-06-05 — they no longer appear in any per-path override here
  // (Banana previously rolled on artsy-girl / female-explorer /
  // male-explorer / female/male-action-scenes / landscape / iconic-landscape
  // / castle / dark-realm / dragon-lore / dragon-scene; F2 Flex + F2 Max
  // listed on the character paths).
  //
  // Male sister-path bans (2026-05-31): for the 3 female paths with a
  // direct male equivalent, the same bans were applied to keep the cast
  // visual consistency across the male/female pair. Kevin's reasoning:
  // the model fingerprint (eye geometry, face style, render polish)
  // doesn't change between male and female subjects, so a model that
  // looks bad on the female version of a path looks bad on the male
  // version too.
  //
  // To unban: add the model id back to that path's array.
  // To extend a ban: remove the model id from the array.
  modelByPath: {
    // ── Character paths — Banana BANNED (Kevin 2026-06-05 after character-path
    // ── audit: Banana lost on every DragonBot character path).
    'artsy-girl': [
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'female-adventurer': [
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'male-adventurer': [
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'female-explorer': [
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'male-explorer': [
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'female-action-scenes': [
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'male-action-scenes': [
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    // cozy-arcane (Kevin 2026-05-31): locked to F1.1 Pro + F1.1 Ultra after
    // the 6-model × 3 verification test on the premium-tier-migrated path.
    // The painted-fantasy-illustration register only hits its target look
    // on the F1.1 family.
    'cozy-arcane': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    // ── Non-character scene paths (Kevin 2026-05-31, after the 7-path × 6-model
    // audit): uniform 5-model lineup — Banana, GPT-2, F2 Pro, F1.1 Pro,
    // F1.1 Ultra. Banned the F2 Flex + F2 Max + Flux Dev that flunked the
    // heart-test on each. Same lineup applies on all 7 non-char paths.
    // landscape (Kevin 2026-06-01 after premium-tier axis enrichment +
    // 18-render comparison): F2 Pro + F2 Flex hearted-as-bad. Locked to 4.
    landscape: [
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    // iconic-landscape (Kevin 2026-06-01 after premium-tier axis enrichment +
    // 18-render comparison): F2 Pro + F2 Flex hearted-as-bad. Locked to 4 models.
    // (F2 Flex never reachable via normal picker — wasn't in the modelByPath
    // list to begin with — but documenting the heart-ban here for completeness.)
    'iconic-landscape': [
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    castle: [
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    // epic-moment (Kevin 2026-06-01 after premium-tier axis enrichment +
    // 18-render comparison): locked to 3 models. Banana + GPT-2 + F2 Flex
    // all hearted-as-bad in the enriched-path test.
    'epic-moment': ['black-forest-labs/flux-1.1-pro', 'black-forest-labs/flux-1.1-pro-ultra'],
    'dark-realm': [
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'dragon-lore': [
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
    'dragon-scene': [
      'openai/gpt-image-2',
      'black-forest-labs/flux-1.1-pro',
      'black-forest-labs/flux-1.1-pro-ultra',
    ],
  },

  // Previous modelByPath: stripped 2026-05-30 to let allowedModels picker drive selection.
  // Original locks (restore individual lines if a path needs pinning again):
  // modelByPath: {
  // landscape: 'black-forest-labs/flux-1.1-pro',
  // 'fantasy-scene': 'black-forest-labs/flux-1.1-pro',
  // 'epic-moment': 'black-forest-labs/flux-1.1-pro',
  // castle: 'black-forest-labs/flux-1.1-pro',
  // 'dragon-scene': 'black-forest-labs/flux-1.1-pro',
  // 'female-adventurer': 'black-forest-labs/flux-1.1-pro',
  // 'female-explorer': 'black-forest-labs/flux-1.1-pro',
  // 'female-action-scenes': 'black-forest-labs/flux-1.1-pro',
  // 'artsy-girl': 'black-forest-labs/flux-1.1-pro',
  // 'male-adventurer': 'black-forest-labs/flux-1.1-pro',
  // 'male-explorer': 'black-forest-labs/flux-1.1-pro',
  // 'male-action-scenes': 'black-forest-labs/flux-1.1-pro',
  // 'cozy-arcane': 'black-forest-labs/flux-1.1-pro',
  // 'arcane-halls': 'black-forest-labs/flux-1.1-pro',
  // 'arcane-spaces': 'black-forest-labs/flux-1.1-pro',
  // 'dark-realm': 'black-forest-labs/flux-1.1-pro',
  // 'dragon-lore': 'black-forest-labs/flux-1.1-pro',
  // 'iconic-landscape': 'black-forest-labs/flux-1.1-pro',
  // },

  // Inverts old excludeVibes (minimal/dark).
  vibes: [
    'cinematic',
    'dark',
    'cozy',
    'epic',
    'nostalgic',
    'whimsical',
    'ethereal',
    'arcane',
    'ancient',
    'enchanted',
    'fierce',
    'voltage',
    'nightshade',
    'macabre',
    'shimmer',
    'surreal',
  ],

  // Per-path vibe overrides — scene-only paths exclude `macabre`
  // (renders weird gore-coded landscapes; only fits character paths).
  // Character paths (female-adventurer, female-action-scenes, male-adventurer, dragon-scene) inherit
  // the full bot.vibes list.
  vibesByPath: {
    landscape: [
      'cinematic',
      'dark',
      'cozy',
      'epic',
      'nostalgic',
      'whimsical',
      'ethereal',
      'arcane',
      'ancient',
      'enchanted',
      'fierce',
      'voltage',
      'nightshade',
      'shimmer',
      'surreal',
    ],
    'fantasy-scene': [
      'cinematic',
      'dark',
      'cozy',
      'epic',
      'nostalgic',
      'whimsical',
      'ethereal',
      'arcane',
      'ancient',
      'enchanted',
      'fierce',
      'voltage',
      'nightshade',
      'shimmer',
      'surreal',
    ],
    'epic-moment': [
      'cinematic',
      'dark',
      'cozy',
      'epic',
      'nostalgic',
      'whimsical',
      'ethereal',
      'arcane',
      'ancient',
      'enchanted',
      'fierce',
      'voltage',
      'nightshade',
      'shimmer',
      'surreal',
    ],
    castle: [
      'cinematic',
      'epic',
      'dark',
      'nostalgic',
      'arcane',
      'ancient',
      'ethereal',
      'enchanted',
      'shimmer',
      'surreal',
      'nightshade',
      'cozy',
    ],
    // 2026-06-05 — trimmed dark/fierce/voltage/nightshade after Kevin caught
    // a 'fierce' cozy-arcane render landing as a tired sad old scribe.
    // Those vibes pull cozy-arcane toward macabre / battle / electric / death
    // registers — incongruous with "warm intimate sanctum with magic happening".
    'cozy-arcane': [
      'cinematic',
      'cozy',
      'epic',
      'nostalgic',
      'whimsical',
      'ethereal',
      'arcane',
      'ancient',
      'enchanted',
      'shimmer',
      'surreal',
    ],
    'arcane-halls': [
      'cinematic',
      'dark',
      'cozy',
      'epic',
      'nostalgic',
      'whimsical',
      'ethereal',
      'arcane',
      'ancient',
      'enchanted',
      'fierce',
      'voltage',
      'nightshade',
      'shimmer',
      'surreal',
    ],
    'arcane-spaces': [
      'cinematic',
      'dark',
      'cozy',
      'epic',
      'nostalgic',
      'whimsical',
      'ethereal',
      'arcane',
      'ancient',
      'enchanted',
      'fierce',
      'voltage',
      'nightshade',
      'shimmer',
      'surreal',
    ],
    'dark-realm': [
      'cinematic',
      'dark',
      'cozy',
      'epic',
      'nostalgic',
      'whimsical',
      'ethereal',
      'arcane',
      'ancient',
      'enchanted',
      'fierce',
      'voltage',
      'nightshade',
      'shimmer',
      'surreal',
    ],
    'dragon-lore': [
      'cinematic',
      'dark',
      'cozy',
      'epic',
      'nostalgic',
      'whimsical',
      'ethereal',
      'arcane',
      'ancient',
      'enchanted',
      'fierce',
      'voltage',
      'nightshade',
      'shimmer',
      'surreal',
    ],
    'iconic-landscape': [
      'cinematic',
      'dark',
      'cozy',
      'epic',
      'nostalgic',
      'whimsical',
      'ethereal',
      'arcane',
      'ancient',
      'enchanted',
      'fierce',
      'voltage',
      'nightshade',
      'shimmer',
      'surreal',
    ],
  },

  paths: [
    'landscape',
    'fantasy-scene',
    'epic-moment',
    'castle',
    'dragon-scene',
    // NEW 2026-06-10 — dragon-rider (rider mounted on a dragon). MVP-25.
    'dragon-rider',
    // NEW 2026-06-10 — dragon-hoard (dragon coiled on treasure). MVP-25.
    'dragon-hoard',
    // NEW 2026-06-10 — dragon-battle (dragon mid-combat). MVP-25.
    'dragon-battle',
    'female-adventurer',
    'female-explorer',
    'female-action-scenes',
    'artsy-girl',
    'male-adventurer',
    'male-explorer',
    'male-action-scenes',
    'cozy-arcane',
    'arcane-halls',
    // 'arcane-spaces' — paused 2026-05-15 (Kevin). Aesthetic not landing
    // consistently; revisit later. All wiring + pools preserved.
    // 'arcane-spaces',
    'dark-realm',
    'dragon-lore',
    // 2026-05-14: wow-landscape + lotr-landscape merged into iconic-landscape
    'iconic-landscape',
    // 'wow-architecture' — scrapped 2026-05-02 (Kevin)
    // 'eldenring-landscape' — scrapped 2026-05-02 (Kevin)
    // 'eldenring-architecture' — scrapped 2026-05-02 (Kevin)
  ],

  // 2026-05-23: flattened — all paths equal weight 1 (Kevin's call).
  // Flat rotation (2026-05-26): equal weight per path — every path posts
  // once per cycle in randomized order via the cycleAllPaths shuffle-bag.
  cycleAllPaths: true,

  // Chaos layer (V4 perception-distortion port). Skip face-dominant character
  // closeups (none here — both warrior paths are full-body). Allow subject
  // chaos on scenery + dragon paths so silhouette/echo distortions can fire.
  chaos: {
    enabled: true,
    // NEW 2026-06-10 paths skip chaos during MVP validation (protect the
    // dragon+rider / subject composition from distortion while we test).
    skipPaths: ['dragon-rider', 'dragon-hoard', 'dragon-battle'],
    allowSubjectChaosPaths: [
      'landscape',
      'fantasy-scene',
      'epic-moment',
      'castle',
      'dragon-scene',
      'cozy-arcane',
      'arcane-halls',
      'arcane-spaces',
      'dark-realm',
      'dragon-lore',
      'iconic-landscape',
      'wow-architecture',
      'eldenring-landscape',
      'eldenring-architecture',
    ],
  },

  // Two-pass Sonnet→Haiku polish.
  twoPassPolish: {
    enabled: true,
    // 2026-05-13 — artsy-girl skips Haiku polish. With it on, renders were
    // muted and more uniform; with it off, Sonnet's single-pass output gave
    // more lush + colorful + varied renders. Kevin adopted this as the
    // baseline for the path.
    skipPaths: [
      'artsy-girl',
      'female-adventurer',
      'female-explorer',
      'female-action-scenes',
      'male-adventurer',
      'male-explorer',
      'male-action-scenes',
      'landscape',
      'dragon-lore',
      'dark-realm',
      'arcane-halls',
      'arcane-spaces',
      // 2026-05-17 — castle is on the new axis system, skip polish per
      // playbook (Haiku compression drops path-bespoke DNA + occasionally
      // refuses the task when sensory-anchor mandates conflict with biome)
      'castle',
      // 2026-06-05 — cozy-arcane: Haiku polish was demoting the candid-moment
      // magic ("soft pale-violet rune pulsing above candle stub") to a buried
      // mid-string token, so Flux ignored it and rendered a generic tired-old-
      // wizard-at-desk scene. The path's identity IS the visible magic; polish
      // strips that detail. Same lesson as ChibiBot bath-time
      // (playbook line 2134 — polish strips setting-as-co-hero context).
      'cozy-arcane',
      // NEW 2026-06-10 axis paths — skip polish so the curated dragon/rider/
      // subject language survives (Haiku strips load-bearing detail).
      'dragon-rider',
      'dragon-hoard',
      'dragon-battle',
    ],
    conceptWords: 150,
    polishedWords: '65-90',
    polishedWordsByPath: {
      'female-adventurer': '80-110',
      'female-explorer': '80-110',
      'female-action-scenes': '100-130',
      'artsy-girl': '80-110',
      'male-adventurer': '80-110',
      'male-explorer': '80-110',
      'male-action-scenes': '100-130',
      'dragon-scene': '80-110',
    },
    preservePhrasesByPath: {},
  },

  // Sensory anchors — 4 contexts × 7 channels × 100 entries each.
  // Lightcolor required on every render (forces specific punchy lighting
  // palettes instead of Sonnet defaulting to safe warm-amber).
  sensoryAnchors: {
    enabled: true,
    requiredChannels: ['lightcolor'],
    pathContext: {
      'female-adventurer': 'female',
      'female-explorer': 'female',
      'female-action-scenes': 'female',
      'artsy-girl': 'female',
      'male-adventurer': 'male',
      'male-explorer': 'male',
      'male-action-scenes': 'male',
      'dragon-scene': 'creature',
      'dragon-rider': 'creature',
      'dragon-hoard': 'creature',
      'dragon-battle': 'creature',
      landscape: 'scene',
      'fantasy-scene': 'scene',
      'epic-moment': 'scene',
      castle: 'scene',
      'cozy-arcane': 'scene',
      'arcane-halls': 'scene',
      'arcane-spaces': 'scene',
      'dark-realm': 'scene',
      'dragon-lore': 'scene',
      'iconic-landscape': 'scene',
      'wow-architecture': 'scene',
      'eldenring-landscape': 'scene',
      'eldenring-architecture': 'scene',
    },
    poolsByContextAndChannel: pools.SENSORY_POOLS,
  },

  rollSharedDNA({ vibeKey, picker }) {
    return {
      scenePalette: picker.pickWithRecency(pools.SCENE_PALETTES, 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.epic,
    };
  },

  // Bot-level pool defaults for the new composer architecture (2026-05-14).
  // Universal axes resolve from these when a path doesn't override.
  defaultPools: {
    lighting: 'LIGHTING',
    atmosphere: 'ATMOSPHERES',
  },

  poolByName(name) {
    if (!(name in pools)) {
      throw new Error(`DragonBot.poolByName: unknown pool "${name}"`);
    }
    return pools[name];
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`DragonBot: unknown path "${path}"`);
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
    throw new Error(`DragonBot: path "${path}" has invalid export shape`);
  },

  caption({ path }) {
    return `[${path}] DragonBot`;
  },
};
