#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_eye_colors.json',
  total: 30,
  batch: 15,
  metaPrompt: (n) => `You are writing ${n} GLOWING VAMPIRE-EYE descriptions for GothBot's vampire-vogue-realism path. Every entry is ONE extreme glowing-iris color + glow-quality + pupil description for an extreme vampire woman's eye.

Each entry: 12-25 words. ONE eye-color + glow-quality description — Sonnet will weave it into the larger face description.

━━━ DEDUP HARD — NO REPEATED HUE CLUSTERS ━━━
The pool's biggest job: variety. Right now every render defaults to crimson-red-orange glowing eyes. Across 30 entries, rotate these hue FAMILIES (max ~3 entries per family):

- REDS/CRIMSON (crimson-ember / blood-red / rose-blood / dioxide-red / ruby-ember) — max 3
- ORANGE/AMBER (molten-amber / honey-amber / forge-ember / copper-oxidized-orange / flame-orange) — max 3
- GOLD/YELLOW (ember-gold / alchemist-gold / sulfur-yellow / molten-gold / mercury-gold) — max 3
- GREEN (fel-green / emerald-poison / witch-fire-green / venom-chartreuse / absinthe-green) — max 3
- BLUE (ice-blue / glacial-sapphire / cerulean-deep-ocean / electric-neon-blue / steel-blue) — max 3
- TURQUOISE/TEAL/CYAN (turquoise / aqua / teal-cyan / frost-cyan) — max 3
- PURPLE/VIOLET (violet-void / electric-purple / plum-deep / lavender-ghost / blacklight-UV-purple) — max 3
- PINK/MAGENTA (plasma-magenta / rose-pink / fuchsia-hot / orchid) — max 2
- WHITE/PEARL/SILVER (moonstone-silver / white-void / pearl-iridescent / mercury-quicksilver / necrotic-pale-white) — max 3
- BLACK/VOID (obsidian-black-with-corona / void-black-with-pupil-glow / starfield-pupil-in-black) — max 2
- EXOTIC (opalescent-holographic / oil-slick-iridescent / rainbow-refraction / prism) — max 2

Each entry MUST explicitly name its unique hue. Two entries can BOTH be "red-family" but their specific descriptors must differ (one "crimson-ember fully-luminous iris", another "rose-blood corona-ringed round iris with gold-fleck pupil").

━━━ GLOW QUALITY — ROTATE ━━━
- Fully-luminous saturated iris (whole iris glows as one color)
- Corona-ring (iris-color forms a halo around a dark pupil)
- Inner-glow (light appears to come from inside the eye, not reflected)
- Back-lit (iris glows like a candle through thin paper)
- Ember-radiant (flickering gradient — darker at edges, bright at center)
- Starfield pupil (pupil itself contains a mini galaxy / star-points)
- Gold-fleck / silver-fleck / opal-fleck scattered through the iris
- Frost-crystalline crack pattern within the iris
- Slight dark-sclera ring around the luminous iris

━━━ PUPIL STYLE — VARY ━━━
- Slitted cat-eye / reptilian-vertical-slit
- Round (normal pupil shape)
- Hourglass slit
- Star-shaped pupil
- Microscopic pinprick pupil (intense predator focus)
- No visible pupil (fully luminous void)
- Double-concentric (ring-within-ring)

━━━ WRITING EXAMPLES (style target) ━━━
"Vivid turquoise-cyan fully-luminous iris with hourglass-slit pupil, faint frost-crystalline crack pattern glowing brighter at the center"
"Molten-amber-gold ember-radiant iris with pinprick pupil, darker ring at the edge glowing brighter toward the center"
"Violet-void iris with silver-fleck scatter and round pupil, back-lit glow like candle through paper"
"Plasma-magenta fully-luminous iris with reptilian vertical-slit pupil, faint dark-sclera ring around the glow"
"Opalescent holographic iris shifting green-pink-gold, round pupil, glow pulsing from inside the eye"
"Obsidian-black iris with thin crimson-corona ring around a dark pupil, cold predator focus"
"Necrotic-pale-white fully-luminous iris with no visible pupil, void-white glow-only eye"
"Glacial-sapphire iris with faint gold-fleck scatter, round pupil, cold inner-glow like ice over fire"
"Venom-chartreuse iris with slitted cat-eye pupil, acid-green back-lit glow with darker edge ring"

━━━ HARD RULES ━━━
- 12-25 words each
- Every entry names ONE unique hue explicitly (don't repeat the same specific hue)
- Every entry names a glow-quality + pupil style
- Spread across the hue families (rough distribution noted above — max per family strictly)
- Every entry visibly distinct from every other

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
