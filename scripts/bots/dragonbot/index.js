/**
 * DragonBot — the bot-engine contract.
 *
 * High-fantasy magical worlds + landscapes + arcane + characters.
 * LOTR/GoT/Harry-Potter/Elden-Ring/Witcher/Warhammer-concept-art energy.
 * Landscape is FLAGSHIP. Mixed scene/character. Characters by role only.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  landscape: require('./paths/landscape'),
  'fantasy-scene': require('./paths/fantasy-scene'),
  'epic-moment': require('./paths/epic-moment'),
  'dragon-scene': require('./paths/dragon-scene'),
  'female-adventurer': require('./paths/female-adventurer'),
  'female-action-scenes': require('./paths/female-action-scenes'),
  'artsy-girl': require('./paths/artsy-girl'),
  'male-adventurer': require('./paths/male-adventurer'),
  'male-action-scenes': require('./paths/male-action-scenes'),
  'cozy-arcane': require('./paths/cozy-arcane'),
  'arcane-halls': require('./paths/arcane-halls'),
  'dark-realm': require('./paths/dark-realm'),
  'dragon-lore': require('./paths/dragon-lore'),
  'wow-landscape': require('./paths/wow-landscape'),
  'wow-architecture': require('./paths/wow-architecture'),
  'lotr-landscape': require('./paths/lotr-landscape'),
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
    painted_fantasy_novel: 'fantasy concept art, painterly',
  },

  // Override prefix to empty (matches FaeBot exactly).
  promptPrefix: '',

  // Per-path prefix override — locks Flux's first-token interpretation to
  // the path's visual lineage. Engine prepends this BEFORE all other prefix
  // layers (scripts/lib/botEngine.js line 981).
  promptPrefixByPath: {
    'dragon-scene':
      'Frank Frazetta + Brom + Boris Vallejo + Greg Hildebrandt + Michael Whelan painted-fantasy-novel-cover oil tradition, traditional Western high-fantasy DRAGON as the hero — four legs + two massive membrane wings + horned reptilian skull + thick scaled body + long muscular tail (NOT a serpent NOT a wyvern), jaw-dropping epic fantasy landscape with multi-layer depth, painterly atmospheric grandeur, LOTR + GoT + Elden Ring + Skyrim + Warcraft + D&D visual lineage, awe-inducing concept-art masterwork',
    // EMPTY by design (2026-05-14). The historic May-3 era female-warrior
    // renders had varied races (tabaxi, drow, night elf, half-elf, jaguar-
    // furred warrior in cinnabar-red lacquer) because the wrapper was just
    // the medium tag, letting Sonnet's race-led body land in the first
    // tokens Flux reads. The 120-token stuffed prefix I added gridlocked
    // every render onto generic-fantasy-heroine. Match historic: empty.
    'female-adventurer': '',
    // EMPTY by design — same lesson as female-adventurer. Sonnet's peak-
    // action body is what Flux needs to read first, not a stuffed wrapper.
    'female-action-scenes': '',
    // EMPTY by design — male mirror of female-adventurer.
    'male-adventurer': '',
    // EMPTY by design — male mirror of female-action-scenes (cranked multi-effect)
    'male-action-scenes': '',
    // EMPTY by design — flagship landscape path. Per wrapper-gridlock lesson,
    // Sonnet's land-is-alive body must lead, not a stuffed prefix.
    'landscape': '',
    // FROZEN 2026-05-13 — exact clone of female-warrior wrapper at the moment
    // it produced the Frazetta-cheesecake painted-fantasy-cover renders Kevin
    // loved (R3 batch lkz161/zi3xxo/94utqp/pqgzmb/madto1). DO NOT EDIT —
    // future female-warrior tuning belongs above; this is the locked snapshot.
    'artsy-girl':
      'Frank Frazetta + Brom + Boris Vallejo + Greg Hildebrandt + Michael Whelan painted-fantasy-novel-cover oil tradition, a single heroic WOMAN of a SPECIFIC NON-DEFAULT-HUMAN fantasy lineage — render the race anatomy and tone as the ABSOLUTE FIRST visual property (drow = obsidian skin OR dragonborn = scaled face OR tiefling = horns AND red/violet skin OR orc = green skin AND tusks OR night-elf = purple skin AND glowing silver eyes OR blood-elf = glowing fel-green eyes OR aasimar = alabaster with inner glow OR genasi = elemental-tinted skin) — race is NEVER a pale-European-woman default, at 25-40% of frame full body mid-action wearing an exotic fantasy battle outfit and wielding a signature weapon — the specific armor style, materials, silhouette, and weapon varies DRAMATICALLY entry to entry (lamellar / scale / chitin / dragonbone / coral / mithril / lacquered / engraved / barbarian fur-and-bone / desert-nomad wraps / samurai bound silk — and weapons axe / spear / glaive / bow / staff / hammer / kukri / scimitars / runeblade as often as sword), CANDID PEACEFUL ADVENTURING moment between battles (NO combat NO violence — weapons holstered or being maintained), epic fantasy landscape as her stage, painterly atmospheric grandeur, LOTR + GoT + Elden Ring + Skyrim + Witcher visual lineage, awe-inducing concept-art masterwork',
  },
  // Bit-identical to FaeBot's PROMPT_SUFFIX (with forest-specific phrases
  // dropped — "atmospheric forest illustration" and the
  // "Brian Froud + Mononoke + Magic-the-Gathering green-mana" lineage,
  // both forest-fae specific). Otherwise identical.
  promptSuffix:
    'painted fantasy concept art, soft brushwork, dreamy dappled light, no text, no watermarks',

  // Lock to flux-1.1-pro for the painterly look (matches FaeBot setup).
  useModelPicker: false,
  modelByPath: {
    landscape: 'black-forest-labs/flux-1.1-pro',
    'fantasy-scene': 'black-forest-labs/flux-1.1-pro',
    'epic-moment': 'black-forest-labs/flux-1.1-pro',
    'dragon-scene': 'black-forest-labs/flux-1.1-pro',
    'female-adventurer': 'black-forest-labs/flux-1.1-pro',
    'female-action-scenes': 'black-forest-labs/flux-1.1-pro',
    'artsy-girl': 'black-forest-labs/flux-1.1-pro',
    'male-adventurer': 'black-forest-labs/flux-1.1-pro',
    'male-action-scenes': 'black-forest-labs/flux-1.1-pro',
    'cozy-arcane': 'black-forest-labs/flux-1.1-pro',
    'arcane-halls': 'black-forest-labs/flux-1.1-pro',
    'dark-realm': 'black-forest-labs/flux-1.1-pro',
    'dragon-lore': 'black-forest-labs/flux-1.1-pro',
    'wow-landscape': 'black-forest-labs/flux-1.1-pro',
    'lotr-landscape': 'black-forest-labs/flux-1.1-pro',
  },

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
    landscape: ['cinematic','dark','cozy','epic','nostalgic','whimsical','ethereal','arcane','ancient','enchanted','fierce','voltage','nightshade','shimmer','surreal'],
    'fantasy-scene': ['cinematic','dark','cozy','epic','nostalgic','whimsical','ethereal','arcane','ancient','enchanted','fierce','voltage','nightshade','shimmer','surreal'],
    'epic-moment': ['cinematic','dark','cozy','epic','nostalgic','whimsical','ethereal','arcane','ancient','enchanted','fierce','voltage','nightshade','shimmer','surreal'],
    'cozy-arcane': ['cinematic','dark','cozy','epic','nostalgic','whimsical','ethereal','arcane','ancient','enchanted','fierce','voltage','nightshade','shimmer','surreal'],
    'arcane-halls': ['cinematic','dark','cozy','epic','nostalgic','whimsical','ethereal','arcane','ancient','enchanted','fierce','voltage','nightshade','shimmer','surreal'],
    'dark-realm': ['cinematic','dark','cozy','epic','nostalgic','whimsical','ethereal','arcane','ancient','enchanted','fierce','voltage','nightshade','shimmer','surreal'],
    'dragon-lore': ['cinematic','dark','cozy','epic','nostalgic','whimsical','ethereal','arcane','ancient','enchanted','fierce','voltage','nightshade','shimmer','surreal'],
    'wow-landscape': ['cinematic','dark','cozy','epic','nostalgic','whimsical','ethereal','arcane','ancient','enchanted','fierce','voltage','nightshade','shimmer','surreal'],
    'lotr-landscape': ['cinematic','dark','cozy','epic','nostalgic','whimsical','ethereal','arcane','ancient','enchanted','fierce','voltage','nightshade','shimmer','surreal'],
  },

  paths: [
    'landscape',
    'fantasy-scene',
    'epic-moment',
    'dragon-scene',
    'female-adventurer',
    'female-action-scenes',
    'artsy-girl',
    'male-adventurer',
    'male-action-scenes',
    'cozy-arcane',
    'arcane-halls',
    'dark-realm',
    'dragon-lore',
    'wow-landscape',
    // 'wow-architecture' — scrapped 2026-05-02 (Kevin)
    'lotr-landscape',
    // 'eldenring-landscape' — scrapped 2026-05-02 (Kevin)
    // 'eldenring-architecture' — scrapped 2026-05-02 (Kevin)
  ],

  // dragon-scene + landscape co-flagship; warriors heavy; new wow paths weight 4 each.
  pathWeights: {
    landscape: 5,
    'fantasy-scene': 3,
    'epic-moment': 3,
    'dragon-scene': 4,
    'female-adventurer': 5,
    'female-action-scenes': 5,
    'artsy-girl': 4,
    'male-adventurer': 5,
    'male-action-scenes': 5,
    'cozy-arcane': 3,
    'arcane-halls': 3,
    'dark-realm': 4,
    'dragon-lore': 4,
    'wow-landscape': 4,
    // 'wow-architecture': 4,  // scrapped
    'lotr-landscape': 4,
    // 'eldenring-landscape': 4,  // scrapped
    // 'eldenring-architecture': 4,  // scrapped
  },

  // Chaos layer (V4 perception-distortion port). Skip face-dominant character
  // closeups (none here — both warrior paths are full-body). Allow subject
  // chaos on scenery + dragon paths so silhouette/echo distortions can fire.
  chaos: {
    enabled: true,
    skipPaths: [],
    allowSubjectChaosPaths: [
      'landscape',
      'fantasy-scene',
      'epic-moment',
      'dragon-scene',
      'cozy-arcane',
      'arcane-halls',
      'dark-realm',
      'dragon-lore',
      'wow-landscape',
      'wow-architecture',
      'lotr-landscape',
      'eldenring-landscape', 'eldenring-architecture',
    ],
  },

  // Two-pass Sonnet→Haiku polish.
  twoPassPolish: {
    enabled: true,
    // 2026-05-13 — artsy-girl skips Haiku polish. With it on, renders were
    // muted and more uniform; with it off, Sonnet's single-pass output gave
    // more lush + colorful + varied renders. Kevin adopted this as the
    // baseline for the path.
    skipPaths: ['artsy-girl', 'female-adventurer', 'female-action-scenes', 'male-adventurer', 'male-action-scenes', 'landscape'],
    conceptWords: 150,
    polishedWords: '65-90',
    polishedWordsByPath: {
      'female-adventurer': '80-110',
      'female-action-scenes': '100-130',
      'artsy-girl': '80-110',
      'male-adventurer': '80-110',
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
      'female-action-scenes': 'female',
      'artsy-girl': 'female',
      'male-adventurer': 'male',
      'male-action-scenes': 'male',
      'dragon-scene': 'creature',
      'landscape': 'scene',
      'fantasy-scene': 'scene',
      'epic-moment': 'scene',
      'cozy-arcane': 'scene',
      'arcane-halls': 'scene',
      'dark-realm': 'scene',
      'dragon-lore': 'scene',
      'wow-landscape': 'scene',
      'wow-architecture': 'scene',
      'lotr-landscape': 'scene',
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
