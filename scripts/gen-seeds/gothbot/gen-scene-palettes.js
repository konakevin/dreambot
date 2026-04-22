#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/scene_palettes.json',
  total: 200,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} SCENE-WIDE COLOR PALETTE descriptions for GothBot. Each entry is a specific Nightshade-aesthetic gothic palette: 3-5 specific color words that define the scene's overall color mood. Entries 12-22 words.

━━━ AESTHETIC NORTH STAR — NIGHTSHADE ━━━
Dark fantasy at its most stylish — moonlit baroque, twilight-hour gothic, occult-lit ritual, candle-and-amber. Castlevania / Bloodborne / Van-Helsing / Hellboy / Bram-Stoker-Dracula. Dark-dominant palettes with VIBRANT ACCENT COLOR — accent is purple/violet/green/blue/silver/amber territory. Red is RARE — never the dominant hue, never coloring windows or moons or fog.

━━━ NIGHTSHADE COLOR — MANDATORY SPINE ━━━
Every palette must have at least ONE vibrant accent from the Nightshade spine: deep violet / fel-violet / witch-fire green / poison green / sapphire nocturne / emerald ritual-glow / moonlit silver / tarnished silver / twilight lavender / blacklight aurora / ember-amber candle / rose-dusk / indigo-midnight. Gray-monochrome palettes are capped hard. Crimson/blood-red appears as accent ONLY (a single rose, a single lantern, a single drop) and NEVER dominates a palette — max 10 red-accent entries in the whole 200-pool.

━━━ HARD DISTRIBUTION CAPS (200 pool — enforce) ━━━

Max 30 entries that lean GRAY-CHARCOAL-MONOCHROME as the dominant (only a small silver/rose accent) — these are the exception, not the rule.

Min 20 per each of these Nightshade accent palettes:
- VIOLET-TWILIGHT: deep violet + midnight-indigo + silver-moonlight + amethyst glow
- EMERALD-OCCULT: deep-forest-green + charcoal + witch-fire-green accent + pale-bone
- SAPPHIRE-NOCTURNE: deep-sapphire + midnight-black + silver-moon + pearl-accent
- ROSE-DUSK: dusty-rose + violet-horizon + faded-gold + charcoal
- FEL-GREEN WARLOCK: fel-green-glow + charcoal + oil-black + ember-amber secondary
- NECRO-PALE-BLUE: ghost-blue + bone-white + midnight + faint-lavender
- NIGHTSHADE-INDIGO: deep-indigo + black-petal + poison-green + pale-silver
- EMBER-AMBER-CANDLE: candle-amber + deep-charcoal + tarnished-silver + bronze
- BLACKLIGHT-AURORA: fel-violet-aurora + black + pale-silver + witch-fire-green
- TWILIGHT-LAVENDER: lavender-horizon + violet-shadow + silver-starlight + plum

Min 10 per each additional accent palette:
- STAINED-GLASS VIOLET-PRISMATIC: deep-violet + emerald + sapphire + gold-lead + shadow (NO ruby/crimson-dominant)
- WITCH-FIRE GREEN: acidic-green + black + violet + bone
- OCCULT-RITUAL VIOLET-BLACK-GOLD
- VAMPIRE-COURTLY: pearl-white + plum + faded-violet + black
- AUTUMN-GOTH: deep-plum + burnt-umber + charcoal + tarnished-gold
- GOTHIC FLORAL: nightshade-violet + black-rose + pearl + emerald-leaf
- PLAGUE-POISON: sickly-yellow-green + ash-grey + bone + charcoal
- DARK-ACADEMIA: forest-green + burnt-umber + cream + black
- MOONSTONE-OPAL: pearl-white + pale-lavender + silver + black
- STORM-LIGHTNING: slate-blue + white-flash + purple-sky + black
- WARLOCK-VOID: void-purple + fel-green accent + oil-black + silver

━━━ PALETTE CONSTRUCTION RULES ━━━
Each entry: 3-5 specific color words, dark-dominant, with ONE clear vibrant accent. Describe which color dominates, which is secondary, which is the ACCENT that carries the twilight/occult energy. Example format: "deep violet dominant + midnight-indigo shadow + silver-moon accent + faint amethyst glow + oil-black depth."

━━━ RULES ━━━
- Every entry visibly distinct from the others
- No two entries share the same dominant + accent combination
- Specific color-words (not "dark gothic colors") — name actual colors
- Dark-dominant but with vibrant accent mandatory
- No flat-gray-monochrome dominating the pool

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
