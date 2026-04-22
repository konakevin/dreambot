#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/gothic_landscapes.json',
  total: 200,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} LARGER-THAN-LIFE landscape scenes for GothBot. Pure landscape, NO human figures. Entries 25-40 words. Every scene is GOTHIC + PUTRID + CORRUPTED + TWILIGHT + GOTH energy — the aesthetic is the constant. ANY setting, ANY perspective, ANY subject is fair game AS LONG AS it drips with that energy. Epic + haunting + beautiful.

━━━ THE CORE IDENTITY — NON-NEGOTIABLE ━━━
Every render must FEEL gothic / putrid / corrupted / twilight / goth. A sunlit meadow is wrong. A cheerful tropical beach is wrong. A clean bright architecture is wrong. Every entry drips with dread, decay, supernatural unease, ornate decay, nightshade mood. Castlevania + Van-Helsing + Bloodborne + Hellboy + Bram-Stoker-Dracula DNA. Dark fantasy at its most stylish — beautiful, dangerous, alive.

━━━ SUBJECT + PERSPECTIVE — WIDE CREATIVE LATITUDE ━━━
ANYTHING that fits the core identity works. Examples of perspectives to rotate hard:
- LOOKING DOWN at something from above (aerial / bird's-eye / cathedral-spire / mountain-peak vantage)
- LOOKING UP from ground-level at looming gothic vertical (spires piercing sky, bat-swarm overhead, cathedral-dome from below)
- THROUGH or OUT OF (through fog-choked forest, out of cave-mouth toward valley, out of open crypt-gate, through a broken stained-glass dome)
- NEAR WATER — haunted lake reflecting gothic architecture, black river threading through dead forest, waterfall cascade from cliff-top ruin
- NEAR SWAMP / BOG / MARSH — rotting cypress groves, sunken cathedral half-submerged, will-o-wisp meadows
- NEAR MOUNTAINS — valley-floor looking up at range, mountain-pass approach, peak-top observatory, mountain-flank ossuary
- NEAR LAKE — gothic chateau reflected on still water, gondola-dock at dusk, half-drowned village visible through clear water
- NEAR COAST — coastal cliff with lighthouse, stormy harbor with ghost-ship, tide-pool with skeletal coral
- FERMENTED JUNGLE / ROT-JUNGLE — gothic ruins swallowed by vine-choked rotting rainforest, fungi-glow on fallen tombstones
- OTHER — cursed village aerial, desert ruin, volcanic ossuary, frozen fjord with ice-trapped chapel, aurora above dead-forest, underground crypt-city at night, floating-island gothic monastery, glacial-crevasse with buried bell-tower, salt-marsh graveyard, carnival-ruin overgrown, alchemist-orchard with withered black-fruit, bog-with-stone-circle, petrified-forest with runic stones, thunderhead-lit plain with single weathervane, sunken-theater filling with slow water, silver-mine shaft with cursed seam exposed, black-desert with obsidian obelisks, necropolis stair-descent, waterfall-behind-cathedral

━━━ THE DEDUP MANDATE — 200 UNIQUE SCENES ━━━
You will be shown the entries you've already written. READ THEM. Do NOT repeat the same architectural subject, landscape type, composition angle, or atmospheric combo. If prior batches wrote 4 "gothic-tower-on-cliff-above-canyon" variations, write ZERO more. If prior batches wrote 3 aerial views, alternate — write ground-level or through-forest next. THINK HARD. Every entry is a fresh surprising scene the others didn't cover.

━━━ HARD BANS ━━━
- NO sunlit / cheerful / clean / bright / serene scenes
- NO "looking through stone archway at gothic building in middle distance"
- NO "gothic tower/castle perched on cliff overlooking canyon" (max 8 out of 200)
- NO interior shots — no chamber, no nave, no hall, no corridor, no crypt-interior
- NO red/crimson stained-glass glowing windows, NO blood-moon-dominant sky (blood-moon OK in max 15 entries)
- NO red-dominant palette — Nightshade spine only: deep purples + midnight blues + velvet blacks + poison greens + witch-fire green + fel-violet + blacklight + moonlit silver + tarnished silver + twilight lavender + plum
- NO human figures, no silhouettes of people (distant crow / wolf / bat / gargoyle OK)
- NO named IP, no real-world places

━━━ LARGER-THAN-LIFE REQUIREMENT ━━━
Each scene is MEMORABLE + EPIC + GORGEOUS. Think: the shot that makes you save the image. Not "a gothic castle on a hill" — but "a mile-long gothic cathedral collapsed into a valley, its nave overgrown with 200-foot dead trees piercing the broken vault, silver moonlight pouring through the skeleton of the ceiling." Scale, detail, specificity, drama.

━━━ RULES ━━━
- 25-40 words per entry
- Pure landscape, no human figures
- Gothic + putrid + corrupted + twilight + goth energy on every single entry
- Every entry distinct in subject + perspective + atmosphere combination
- Nightshade palette, no red-dominant
- Wide-vista, no interior framing, no archway cliché
- Creative latitude on setting/composition as long as the core identity holds

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
