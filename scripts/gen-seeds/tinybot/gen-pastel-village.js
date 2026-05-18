#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/pastel_village.json',
  total: 200,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} PASTEL FAIRY-TALE VILLAGE scene descriptions for TinyBot — handmade-resin-diorama-scale fairytale architectures in soft pink / lavender / magenta / lilac / pearl-white palettes with warm-golden window-glow contrast. Dreamy pastel-cottagecore aesthetic — a soft little world to escape into.

Each entry: 20-35 words. ONE specific pastel-fairytale scene with cherry-blossom-coded setting + golden-window-glow contrast + architectural fairy-tale hero.

━━━ THE PASTEL-VILLAGE VISUAL DNA (ALL ENTRIES) ━━━
• COLOR LOCK — soft pink / blush / dusty rose / lavender / lilac / magenta / mauve / periwinkle / pearl-white. NEVER browns. NEVER grass-green dominating. NEVER blue sky. Warm GOLDEN window-glow is the focal contrast.
• ARCHITECTURE — fairy-tale cottages, turreted spires, conical-roofed mushroom-houses, lavender treehouse-tiers, painted pastel shingles, stained-glass-style golden windows, wraparound balconies. Hand-modeled diorama feel — like resin-cast handmade miniatures.
• SETTING — cherry blossom groves with falling petals, floating cloud-islands, soft moss banks, pastel mist, dreamy bokeh background, sparkle particulate, twilight / dusk / golden-hour timing.
• MAGIC — fairy-light particulate sparkles, glowing soft-bokeh aura around the cottage, warm-glow leaking from every window into the pink ambient.
• INHABITANTS (optional, ~30% of entries) — tiny chubby bunnies (peeking from windows / sitting on paths / hovering near doorways), small magical creatures (NEVER humans, NEVER realistic animals).
• SCALE — miniature-handmade-resin-diorama, not tilt-shift-photoreal. The frame feels like a glossy resin snow-globe / hand-painted cake topper / dreamy storybook illustration.

━━━ CATEGORIES (spread across all 200) ━━━
- Single hero turreted pink cottage tucked into a cherry-blossom tree-branch
- Lavender treehouse stacked vertically with multiple tiers, balconies, lit warm windows
- Pastel mushroom-village cluster on a moss island — pink/lilac/purple conical roof houses
- Floating cloud-island village with 3-5 pastel cottages, dusty-rose clouds underneath
- Tiny pastel cottage on a floating petal raft, golden windows, cherry blossoms drifting
- Three pastel-purple mushroom-houses with tiny chubby bunnies peeking out
- A lavender turreted castle in a cherry-blossom grove, magical sparkle particulate
- Pastel pink-and-white painted cottage in a sea of cherry blossoms, falling petals
- A treehouse-cottage with wraparound balcony, warm golden windows, lavender twilight sky
- Sky-island village with 5 turreted blossom-cottages, all windows glowing warm
- Tiny pastel cottage in a hollow tree-trunk, golden window-glow, magical bokeh
- A mushroom-house village stair-climbing up a cherry-blossom hill
- Pastel cottage cluster on a floating chunk of land, soft pink clouds around it
- A pink castle-spire poking through a cherry blossom canopy, warm windows glowing
- Tiny handmade-resin-diorama bunny village — chubby bunnies, mushroom houses, moss
- A pastel cottage on a single floating pink cloud, golden windows, drifting petals
- A lavender tower with a conical purple roof, balcony with hanging blossoms
- Pink cottage with a cherry-blossom-pink thatched roof, magical aura around
- Tiny pastel pavilion-house on a moss-pillar with magical sparkle ambient
- A pastel-pink mushroom-house in a tiny cherry-orchard, warm window-glow
- Sky-floating pastel village with a stone-arch bridge between two clouds
- A turreted treehouse with three levels, each warm-window-glowing, dreamy bokeh
- Pastel cottage at twilight with bunnies sitting on the doorstep, pink sky
- A magical fairy-cottage glowing from within, cherry petals swirling in the air
- Pastel-pink castle ruins half-overgrown with blossoms, warm light from one tower window

━━━ HARD COLOR RULES ━━━
• NEVER mention brown, beige, tan, ochre as dominant tones (touches OK)
• NEVER mention green grass / green meadows / green leaves dominating
• NEVER mention blue sky / blue ocean / blue water dominating
• NEVER mention dark / black / shadow as a primary color
• ALWAYS lead with pink / lavender / magenta / lilac / pearl / cream / blush / dusty-rose / mauve / periwinkle
• ALWAYS include "warm golden window-glow" or "golden lit windows" as the focal contrast

━━━ HARD AESTHETIC RULES ━━━
• ALL scenes are EXTERIOR views of the architecture — never interior rooms
• ALL scenes feel like HANDMADE RESIN-DIORAMAS — glossy resin polish, painted-with-care, hand-laid pink shingles, sculpted-with-affection finish
• ALL scenes have DREAMY-BOKEH backgrounds — never sharp-focus background, always soft pink/lavender bokeh
• ALL scenes are at MINIATURE SCALE — the architecture fits in a hand, snow-globe sized
• NEVER include humans / human figures / human-trace
• Sometimes (~30%) include tiny CHUBBY bunnies as inhabitants (peeking / sitting / hovering near). NEVER realistic woodland animals.

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: architecture-type + setting + inhabitant. "Pink turreted cottage in cherry blossoms" and "Pink turreted cottage with cherry trees" are TOO SIMILAR. "Pink turreted cottage on a floating cloud at sunset with falling petals" and "Pink mushroom-house cluster on moss-island with chubby bunnies at dusk" are distinct.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
