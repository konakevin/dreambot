/**
 * GothBot — the bot-engine contract.
 *
 * Hauntingly beautiful dark fantasy. Castlevania/Bloodborne/Dark-Souls/
 * Elden-Ring/Tim-Burton/Crimson-Peak/Berserk/gothic-fairy-tale energy.
 * Elegant darkness — unsettling but gorgeous. Characters by role only.
 * banPhrases: jack skellington, nightmare before christmas.
 */

const pools = require('./pools');
const blocks = require('./shared-blocks');

const pathBuilders = {
  'dark-landscape': require('./paths/dark-landscape'),
  'gothic-architecture': require('./paths/gothic-architecture'),
  'goth-closeup': require('./paths/goth-closeup'),
  'goth-full-body': require('./paths/goth-full-body'),
  'legacy-girl': require('./paths/legacy-girl'),
  'legacy-landscape': require('./paths/legacy-landscape'),
  'castlevania-scene': require('./paths/castlevania-scene'),
  'cozy-goth': require('./paths/cozy-goth'),
  'vampire-vogue': require('./paths/vampire-vogue'),
  'vampire-vogue-realism': require('./paths/vampire-vogue-realism'),
};

module.exports = {
  username: 'gothbot',
  displayName: 'GothBot',

  // Opt in to per-medium Flux routing via lib/modelPicker.js.
  // Reads dream_mediums.allowed_models (bot-scope, includes bot-only mediums).
  // Other bots without this flag continue to use hardcoded flux-dev.
  useModelPicker: true,

  // Bot-scoped model whitelist — intersects with each medium's allowed_models
  // pool BEFORE picking. GothBot bans flux-2-dev (tensor bug: "q_descale must
  // have shape...") and flux-2-pro (over-strict E005 safety filter). Every
  // gothbot render picks flux-dev or flux-1.1-pro only.
  allowedModels: ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],

  // Per-path model override — takes precedence over pickModel (medium pool).
  modelByPath: {
    'castlevania-scene': 'black-forest-labs/flux-1.1-pro',
    'cozy-goth': 'black-forest-labs/flux-1.1-pro',
    // vampire-vogue on flux-dev — stronger stylized concept-art output,
    // less prone to generic-photoreal drift that flux-1.1-pro produced.
    'vampire-vogue': 'black-forest-labs/flux-dev',
    // vampire-vogue-realism rotates 50/50 between flux-dev and flux-1.1-pro.
    // Both produce solid hyperreal vampire portraits; array form triggers
    // modelByPath random-pick rotation (see botEngine resolver).
    'vampire-vogue-realism': ['black-forest-labs/flux-dev', 'black-forest-labs/flux-1.1-pro'],
  },

  // Per-path medium override.
  // vampire-vogue         → gothic (heavy-ink Castlevania-boss-portrait)
  // vampire-vogue-realism → gothic-painted (surreal painterly-realism version of gothic)
  mediumByPath: {
    'vampire-vogue': 'gothic',
    'vampire-vogue-realism': 'gothic-painted',
  },

  // Bot-only tags (inactive in dream_mediums so users can't pick them — VenusBot's 'surreal' pattern):
  //   'gothic' → heavy-ink Castlevania-manga stylization (flagship)
  //   'gothic-realistic' → 80s-90s dark-fantasy paperback oil-painting
  //   'gothic-whimsy' → Tim-Burton whimsical-dark (ONLY via gothic-whimsy path, see mediumByPath)
  mediums: [
    'gothic', 'gothic', 'gothic', 'gothic', // 4× = 29% flagship stylized
    'gothic-realistic', 'gothic-realistic', 'gothic-realistic', // 3× = 21% painterly-realism
    'anime', 'anime',                                             // 2× = 14% dark-anime
    'comics',
    'pencil',
    'illustration',
    'canvas',
    'watercolor',
  ],

  // Per-medium prefix/suffix override — gothic-whimsy needs a completely different
  // stylistic anchor (Tim Burton whimsy) than the bot's default Castlevania-manga.
  // gothic-painted needs the default heavy-ink / "not photoreal" global prefix
  // STRIPPED so the medium's photoreal DNA isn't fought from the front/back.
  promptPrefixByMedium: {
    'gothic-whimsy':
      'whimsical gothic dark-fairytale cinematic still — Tim Burton / Coraline / Corpse Bride / Pan\'s Labyrinth visual family. Professional feature-film or stylized-3D-animated-feature render quality. Shadow-dominant low-key lighting, tenebrous atmosphere, dark ominous whimsy',
    'gothic-painted':
      'HYPERREAL PHOTOREALISTIC dark-fantasy vampire portrait render, 4K cinematic film-still quality, photographic skin fidelity with pore-level detail + subsurface scatter + wet dewy skin highlights, shot on ARRI Alexa / RED Komodo with 85mm portrait lens, sharp eyelashes + specular catchlights + realistic eye-reflection, dark gothic-horror atmosphere. Hyperreal-skin-with-surreal-eyes-and-makeup aesthetic',
  },
  promptSuffixByMedium: {
    'gothic-whimsy':
      'cinematic film-still polish, professional quality, no text no words no watermarks, NOT Funko, NOT flat-2D-cartoon, NOT pen-and-ink, NOT hobby-felt',
    'gothic-painted':
      'photorealistic 4K film-still finish, sharp photographic detail, skin with real pore + peach-fuzz + subsurface texture, no text no words no watermarks — NOT illustration, NOT cartoon, NOT anime, NOT manga, NOT flat-inked, NOT dark-manga, NOT heavy-ink-shadow, NOT hand-drawn, NOT line-art, NOT stylized-ink, NOT painterly, NOT oil-painted, NOT brushwork, NOT canvas-texture, NOT Artgerm, NOT Rossdraws, NOT DeviantArt-digital, NOT Castlevania-game-art, NOT PS2-game-cover, NOT concept-art-illustration',
  },

  // Per-medium prompt injection — gives each medium distinct visual character.
  // This fragment gets injected between promptPrefix and the Sonnet-written scene.
  mediumStyles: {
    gothic:
      'Ayami-Kojima Castlevania-game-art illustration, heavy-ink shadow, sharp-angular dark-manga-horror figures, hyper-baroque ornate detail, high-contrast inked stylization, PS2-era gothic-horror-game cover-art',
    'gothic-realistic':
      '1980s-1990s dark-fantasy paperback oil-painting cover, Luis-Royo + Boris-Vallejo + Julie-Bell + Frank-Frazetta + Ken-Kelly painted tradition, semi-realistic painterly face and skin with visible brushwork (NOT photoreal, NOT plastic-digital), sensual magnetic expression (open mouth mid-gasp / hungry smirk / tilted chin / gazing off with intent), VIVID GLOWING EYES (amber / crimson / orange / violet / ember-gold) rendered as stylized luminous overlay on otherwise-realistic face, BOLD DRAMATIC STYLIZED MAKEUP (heavy smokey-eye with sharp wing extending beyond the eye, ornate eye-design painted across lid and cheekbone, crimson or oxblood or obsidian-black lipstick, contoured bone structure, porcelain or ashen skin), strong chiaroscuro with warm amber candle / torch / moonlit key-light against cool violet-blue shadow, heavy impasto oil brushwork visible, dark-fantasy-paperback-cover polish, gothic-horror painted portrait tradition, NOT flat-inked NOT manga NOT smooth-digital-art NOT Artgerm-plastic NOT Rossdraws',
    // NEW medium — museum-oil-realism gothic-vampire portrait. Anchors on
    // classical-portrait-master DNA (Caravaggio/Rembrandt/Vermeer/Sargent/
    // Ingres — PORTRAITISTS, not landscape illustrators) to drag composition
    // toward photographic-baroque portrait realism, NOT paperback-landscape
    // or anime-illustration. Explicit hard bans on illustration/cartoon/anime
    // so Flux doesn't default to the same look as the `gothic` medium.
    // Used only by vampire-vogue-realism path.
    // Front-loads DEATHLY PALLOR + EXTREME DARK MAKEUP + VISIBLE FANGS + DARK
    // OMINOUS LIGHTING at equal weight with hyperreal skin — prevents Flux
    // from rendering a normal woman with glowing eyes and nothing else.
    // Vampire GLAMOUR-GOTH makeup, NOT face-paint / clown / ICP / horror-mask.
    // References: Interview-with-the-Vampire, Penny-Dreadful Eva Green,
    // Only-Lovers-Left-Alive Tilda Swinton, Lady-Dimitrescu, Theda-Bara 1920s vamp.
    // No ritual-sigils, no painted tears, no cracked-stone paint, no ghost-skull
    // underlayer — just intense smoky eye + sharp winged liner + dark lips + contour.
    // Hybrid of v20 + v21: keeps v21's strong "EXTREME CLOSE-UP hyperreal face /
    // eyes-are-hero / wet-gloss-dark-lips / wet-dark-hair close-crop" anchors,
    // replaces v21's blackwork-filigree / ritual-sigil painted tokens with v20's
    // glamour-vampire makeup DNA (heavy smoky eye + winged liner + contour +
    // Interview-with-the-Vampire / Penny-Dreadful / Tilda-Swinton / Theda-Bara refs).
    'gothic-painted':
      'EXTREME CLOSE-UP hyperreal face portrait of a dark-fantasy vampire woman — deathly-pale corpse-drained skin, photographic-fidelity rendering with visible pores, fine peach-fuzz, subsurface light-scatter on cheekbone, translucent epidermis with faint blue-veins visible at temples, wet dewy skin-highlight with tiny water droplets across forehead and cheekbone, individual eyelash strands, realistic skin-tone gradients. The EYES are a hero of the face — GLOWING UNNATURAL LUMINOUS iris rendered as saturated luminous glow against otherwise-realistic eye. INTENSE GLAMOUR-VAMPIRE MAKEUP — heavy black smoky eye-shadow thickly blended on the lid and slightly above the socket, sharp black winged eyeliner extending in a clean cat-eye flick, long dark lashes, sharp defined darkened brows, dramatic chiaroscuro contour carving hollow cheekbones. WET-GLOSS DARK LIPS — deep wine / oxblood / obsidian-black / violet-ink / jet-purple lipstick with heavy specular wet-gloss highlight. Parted lips showing LONG SHARP UPPER VAMPIRE FANGS. Close-crop atmospheric background — wet dark hair framing face or bokeh-lit dark atmosphere behind. Glamour-vampire references: Interview-with-the-Vampire / Only-Lovers-Left-Alive Tilda-Swinton / Penny-Dreadful Eva-Green / Theda-Bara vamp / Lady-Dimitrescu. Hyperreal skin + surreal glowing eyes + heavy glamour-makeup = the "fake/real" look. Feels like a 4K film still, NOT a painting, NOT an illustration, NOT anime, NOT manga, NOT cartoon, NOT painterly, NOT oil-painted, NOT brushwork-visible, NOT Artgerm-smooth, NOT Rossdraws, NOT Castlevania-game-art, NOT magazine-editorial-photo, NOT YA-fantasy, NOT face-paint, NOT ritual-sigils, NOT painted tear-streaks, NOT cracked-mask',
    'gothic-whimsy':
      'whimsical-dark cinematic render, Tim Burton / Corpse Bride / Coraline visual family, feature-film polish',
    anime:
      'dark-anime horror illustration, Berserk-manga Kentaro-Miura ink stylization, Devil-May-Cry character-art, heavy-shadow anime-horror aesthetic, NOT cute-anime NOT shonen NOT moe',
    comics:
      'gothic-horror comic-panel illustration, Mike-Mignola-Hellboy inked shadow, Hellblazer vertigo-horror comic stylization, bold black ink, dramatic chiaroscuro panels',
    pencil:
      'heavy graphite gothic-horror sketch, cross-hatched shadow, dark-fantasy concept-sketch linework, inked-over-pencil stylization, dramatic gothic illustration drawn in pencil-and-ink',
    illustration:
      'stylized gothic-horror illustration, angular ink-driven dark-fantasy concept art, heavy-black shadow rendering, dark-manga-horror cover-art stylization',
    canvas:
      'oil-painted gothic-horror portrait, heavy impasto brushwork, chiaroscuro painterly-horror tradition (Caravaggio-meets-Castlevania), painterly dark-fantasy baroque canvas',
    watercolor:
      'gothic watercolor horror illustration, blood-ink wash bleed, wet-on-wet dark fantasy tradition, atmospheric watercolor with ink-line overlay, gothic sumi-e inkwash',
  },

  promptPrefix: blocks.PROMPT_PREFIX,
  promptSuffix: blocks.PROMPT_SUFFIX,

  bannedPhrases: ['jack skellington', 'nightmare before christmas'],

  // Curated 13 — cuts: whimsical/nostalgic/enchanted/voltage (too soft/fairytale/neon);
  // excludes: minimal/cozy/peaceful (off-brand). Coquette + shimmer re-added
  // 2026-04-22 for vampire-vogue editorial-couture path (pastel-rose/black-lace
  // and tarnished-silver/gold-glint work for extreme vampire fashion).
  // Array repetition weights: macabre/nightshade/arcane 3× (flagship trio), others 1×.
  vibes: [
    'macabre', 'macabre', 'macabre',
    'nightshade', 'nightshade', 'nightshade',
    'arcane', 'arcane', 'arcane',
    'cinematic',
    'dark',
    'epic',
    'psychedelic',
    'ethereal',
    'ancient',
    'fierce',
    'surreal',
    'coquette',
    'shimmer',
  ],

  paths: [
    'dark-landscape',
    'gothic-architecture',
    'goth-closeup',
    'goth-full-body',
    'legacy-girl',
    'legacy-landscape',
    'castlevania-scene',
    'cozy-goth',
    'vampire-vogue',
    'vampire-vogue-realism',
  ],

  pathWeights: {
    'dark-landscape': 2,
    'gothic-architecture': 2,
    'goth-closeup': 2,
    'goth-full-body': 2,
    'legacy-girl': 2,
    'legacy-landscape': 2,
    'castlevania-scene': 2,
    'cozy-goth': 1,
    'vampire-vogue': 2,
    'vampire-vogue-realism': 2,
  },

  rollSharedDNA({ vibeKey, medium, picker }) {
    // Gothic-whimsy uses its own dedicated palette pool to avoid the homogeneous
    // moonlit-teal-and-orange-lantern cluster that SCENE_PALETTES produced.
    const isWhimsy = medium === 'gothic-whimsy';
    const palettePool =
      isWhimsy && pools.GOTHIC_WHIMSY_PALETTES && pools.GOTHIC_WHIMSY_PALETTES.length > 0
        ? pools.GOTHIC_WHIMSY_PALETTES
        : pools.SCENE_PALETTES;
    return {
      scenePalette: picker.pickWithRecency(palettePool, isWhimsy ? 'whimsy_palette' : 'scene_palette'),
      colorPalette: pools.VIBE_COLOR[vibeKey] || pools.VIBE_COLOR.dark,
      isWhimsy,
    };
  },

  buildBrief({ path, sharedDNA, vibeDirective, vibeKey, medium, picker }) {
    const builder = pathBuilders[path];
    if (!builder) throw new Error(`GothBot: unknown path "${path}"`);
    return builder({ sharedDNA, vibeDirective, vibeKey, medium, picker });
  },

  caption({ path }) {
    return `[${path}] GothBot`;
  },
};
