#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/enchanted_village.json',
  total: 200,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ENCHANTED TWILIGHT VILLAGE scene descriptions for TinyBot — handmade-resin-diorama-scale fairy-tale architectures at BLUE HOUR / TWILIGHT / DUSK, set against DRAMATIC DEEP-MAUVE / MIDNIGHT-NAVY / TWILIGHT-PURPLE skies with WARM AMBER WINDOW-GLOW as focal contrast.

Each entry: 20-35 words. ONE specific enchanted-twilight scene with cool-dusk-sky + warm-amber-window-contrast + cherry-blossom-coded setting + lavender/purple fairy-tale architecture.

━━━ THE ENCHANTED-VILLAGE VISUAL DNA (ALL ENTRIES) ━━━
• ARCHITECTURE BODY — LAVENDER / DEEP VIOLET / MAUVE / DUSTY-PURPLE walls; LAVENDER / DUSTY-PINK / MAUVE-PEARL / PALE BLUE-LILAC scalloped roof shingles; PEARL-WHITE / SOFT PINK / CREAM trim and balconies. Painted-with-affection handmade-resin finish.
• SKY + BACKGROUND — DEEP MIDNIGHT-NAVY / TWILIGHT-PURPLE / SOFT-MAUVE-DUSK gradient. Stars / sparkle-particulate visible in upper sky. Dramatic mauve-rose cloud-masses if floating-island composition.
• CHERRY BLOSSOM CLOUD — DUSTY-PINK / SOFT-PEACH-PINK / PALE-BLUSH blossoms heavy in foreground and frame edges. Cherry tree trunks DEEP BROWN / DARK CHARCOAL (real-tree, grounding contrast). Falling petals throughout the air.
• WARM AMBER WINDOWS — EVERY window glows WARM AMBER / GOLDEN-ORANGE / RICH HONEY. The brightest, warmest element in the frame. Halo-bokeh around each window.
• GROUND — soft MINT-GREEN-WITH-LAVENDER-UNDERTONE moss, PALE-LILAC / PINK-LAVENDER painted miniature stones, magenta / dusty-rose / lilac flower clusters, cherry petal carpet.
• TIME-OF-DAY LOCK — Twilight. Blue hour. Late dusk. Magic hour. The sky is darkening while windows glow brightest.
• MAGIC — fairy-light sparkle particulate suspended in the air, visible against the cool-dark sky.

━━━ CATEGORIES (spread across all 200) ━━━
- Single lavender turreted cottage against deep-mauve twilight sky, warm amber windows glowing, cherry blossoms framing foreground
- Stacked deep-violet treehouse-tiers, every level warm-amber-windowed, blue-hour sky behind
- Pastel mushroom-house cluster on a moss island — lavender / dusty-pink / pale-violet conical roofs, amber windows, deep mauve sky
- Floating cloud-island village of 3-5 lavender cottages, mauve-cloudbank underneath, twilight-purple sky, all warm windows
- Lavender cottage on a floating petal-raft, deep-twilight-purple sky, falling petals, warm-amber-window-glow
- Three pastel mushroom-houses with tiny chubby bunnies, cherry blossoms framing, midnight-navy sky behind
- A lavender turreted castle in a cherry-blossom grove at blue hour, sparkle particulate, every spire's window glowing amber
- Pastel pink-and-lavender painted cottage in a sea of cherry blossoms at deep dusk
- A treehouse-cottage with wraparound balcony, warm amber windows, deep-twilight-purple sky behind
- Sky-island village with 5 turreted lavender-cottages, all amber-windows glowing, dramatic mauve cloud-pillows underneath
- Tiny lavender cottage in a hollow brown tree-trunk, warm-amber-window-glow, deep mauve atmospheric bokeh
- Mushroom-house village stair-climbing up a cherry-blossom hill at dusk
- A pink castle-spire poking through a cherry-blossom canopy at blue hour, all warm-amber windows
- Tiny chubby-bunny village — bunnies sitting on lavender mushroom-house doorsteps at twilight
- A lavender cottage on a single floating cloud at deep dusk, amber-glow windows, drifting petals
- A lavender tower with a conical purple roof, balcony with hanging blossoms, midnight-navy sky
- Pastel cottage with a cherry-blossom-pink scalloped roof, deep-twilight ambient, sparkle particulate
- Tiny pavilion-house on a moss-pillar at blue hour, magical sparkle dust, warm amber lit windows
- Sky-floating pastel village with a stone-arch bridge between two mauve-tinted clouds at dusk
- A turreted treehouse with three levels, each warm-amber-windowed, against deep-violet twilight sky
- Pastel cottage at deep dusk with chubby bunnies sitting on the doorstep, blue-hour pink-purple sky
- A magical fairy-cottage glowing amber from within at twilight, cherry petals swirling, deep mauve sky
- Lavender castle ruins half-overgrown with blossoms at blue hour, warm amber light from one tower window

━━━ HARD COLOR RULES ━━━
• ALWAYS lead with deep mauve / midnight-navy / twilight-purple sky background
• ALWAYS include "warm amber window-glow" or "golden-amber lit windows" as the focal contrast
• ALWAYS the architecture is lavender / mauve / pastel-purple / dusty-pink (NEVER brown / red / tan)
• NEVER mention pink-bath everywhere — the cool-dark sky is essential contrast
• NEVER mention blue-daytime sky / harsh midday light / pitch-black night

━━━ HARD AESTHETIC RULES ━━━
• ALL scenes are EXTERIOR views of the architecture — never interior rooms
• ALL scenes are HANDMADE RESIN-DIORAMAS — glossy painted-with-care finish, hand-laid scalloped shingles, sculpted-with-affection details
• ALL scenes are at MINIATURE SCALE — architecture fits in a hand, snow-globe sized
• ALL scenes are at TWILIGHT / BLUE HOUR / DUSK (the time-of-day is the signature)
• ALL scenes have a DRAMATIC COOL SKY (deep mauve / midnight / twilight-purple) — never flat-pink-bath
• ALL scenes have CHERRY BLOSSOMS heavily in foreground or framing
• NEVER include humans / human figures / human-trace
• Sometimes (~30%) include tiny CHUBBY bunnies / fairy-coded creatures as inhabitants. NEVER realistic woodland animals.

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: architecture-type + sky-condition + inhabitant. "Lavender castle at dusk" and "Lavender castle at twilight" are TOO SIMILAR. "Lavender turreted castle against midnight-navy with shooting stars" and "Lavender treehouse at blue hour with chubby bunnies in windows" are distinct.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
