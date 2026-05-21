#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/dream_environment.json',
  total: 60,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ENVIRONMENTAL FEATURES for YumBot rainbow-dreamscape — substantial outdoor scene elements that make the pastel meadow feel richly inhabited. Streams, ponds, trails, rocks, trees, bridges, hills. Template picks 3 per render.

Each entry: 12-22 words. ONE specific environmental feature.

━━━ REFERENCE — bex.ai expanded dreamscape ━━━

Beyond just open meadow, the dreamscape should have lived-in environmental features that create depth and a sense of place:
- Winding pastel streams flowing through the meadow
- Glassy pastel ponds reflecting the sky
- Mossy trails meandering through grass
- Pastel rocks / boulders / stepping-stones
- Pastel cherry-blossom trees / pastel flowering trees / pastel pine-trees
- Hilltops / gentle ridges
- Wooden footbridges / stone bridges
- Floating-island-cliffs (Studio Ghibli vibes)

━━━ DISTRIBUTION ━━━

- 15% STREAM (pastel-pink-water stream winding through the meadow / glassy pastel-mint stream with rainbow ripples / soft sparkling pastel-blue brook meandering / rainbow-ribbon stream cutting across)
- 15% POND / LAKE (small glassy pastel pond reflecting the sky / lily-pad-dotted pastel-pond / pearl-blue mini-lake nestled in the meadow / pastel-pink reflecting pool)
- 12% TRAIL / PATH (mossy stone-trail winding through the grass / pastel-petal-strewn path / smooth pebble-path / pastel-stepping-stone trail / golden-trail of pastel-pollen)
- 10% ROCKS / BOULDERS (cluster of mossy pastel-boulders / cluster of round pastel-rocks dotting the meadow / sparkling pastel-crystal-cluster outcrop / soft moss-covered rocks)
- 12% PASTEL-TREES (small pastel cherry-blossom-tree with cascading pink petals / pastel-pink flowering-tree silhouette / pastel-rainbow-leaved tree / pastel-pine-tree dusted with snow-blossoms)
- 8% BRIDGE (wooden footbridge crossing a pastel-stream / arched stone-bridge with mossy edges / pastel-painted bridge with ribbon-railings)
- 8% HILLS / RIDGES (gentle pastel-hill rising in the foreground / soft rolling pastel-grass-ridge / pastel-mossy mound in the meadow)
- 5% FLOATING-ISLAND / CLIFF (a small floating pastel-rock-island hovering in the air / mossy floating-cliff with waterfall trickling / Studio-Ghibli-style floating pastel-platform)
- 5% WATERFALL (small pastel-waterfall cascading off a rock / rainbow-mist waterfall splashing into a pool / glassy waterfall with sparkle-spray)
- 5% FLOWER-FIELD (dense field of pastel-cosmos / sea of pastel-poppies / sweeping pastel-lupine-field / dense wildflower-meadow patch)
- 5% MUSHROOM-GROVE (cluster of giant pastel-mushrooms / glowing pastel-mushroom-grove / amanita-cluster in the grass)

━━━ HARD MANDATES ━━━

- These are SUBSTANTIAL environmental features (not small decor — that's a separate pool)
- Pastel palette ALWAYS
- Painterly Studio-Ghibli-meets-bex.ai outdoor register
- Visible in the scene as a real element (not just background haze)

━━━ HARD BANS ━━━

- NO food-creatures (other pool)
- NO sky-features (other pool)
- NO indoor / tabletop
- NO industrial / man-made (except small bridges)
- NO dark / scary

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
