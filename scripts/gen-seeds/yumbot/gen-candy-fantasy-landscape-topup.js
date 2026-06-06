#!/usr/bin/env node
/**
 * YumBot CANDY_FANTASY_LANDSCAPE top-up (Stage 2 backfill 2026-06-05).
 *
 * Sugar-Rush world settings — vivid lush Disney-CGI candy landscapes the
 * kawaii cast inhabits. Existing 53 mirror the WRECK-IT RALPH register
 * (donut-mountains, cookie-tracks, candy-cane forests, marshmallow snow,
 * chocolate rivers, lollipop groves, gumdrop hills, sprinkle plains,
 * cotton-candy clouds, pancake plateaus). Topping up toward 200 with
 * broader candy-region variety while holding strict register.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/candy_fantasy_landscape.json',
  total: 200,
  batch: 25,
  maxTokens: 16000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} CANDY-FANTASY WORLD SETTINGS for YumBot — Wreck-It-Ralph Sugar Rush world. Each entry describes the OVERALL CANDY LANDSCAPE the kawaii cast inhabits.

Each entry: 22-35 words. ONE specific candy-world setting.

━━━ REFERENCE — WRECK-IT-RALPH SUGAR RUSH ━━━

The world is made ENTIRELY of candy/cake/sugar. Cakes are mountains. Cookies are tracks. Lollipops are trees. Chocolate is rivers. Cotton candy is clouds. Vanellope's racing-kart kingdom. Disney-CGI lush saturated palette — vivid pastels + warm saturated candy colors. Pink, teal, orange, purple, baby-blue, mint, cream, lavender, peach.

━━━ EXISTING-DISTRIBUTION (mirror — keep this anchor mix) ━━━

- DONUT-MOUNTAIN regions (glazed donut peaks, frosting-ridges, powdered-sugar caps)
- COOKIE RACE-TRACK valleys (winding cookie-tile tracks, candy-cane forest borders)
- CANDY-CANE FORESTS (giant red-and-white candy-cane trees, peppermint-stripe trunks, gumdrop undergrowth)
- FONDANT-CASTLE plains (pastel-fondant castles, royal-icing turrets, sugar-meadow horizons)
- MARSHMALLOW SNOWFIELDS (fluffy marshmallow drifts, peppermint stick-flags)
- CHOCOLATE-RIVER VALLEYS (glossy chocolate rivers, marshmallow banks, candy-cane bridges)
- LOLLIPOP GROVES (giant pastel lollipop trees with spiral-disc tops)
- GUMDROP HILLS (rolling pastel-gumdrop hills, sprinkle-pebble paths)
- SPRINKLE PLAINS (rainbow-sprinkle ground, mini-cupcake bushes)
- COTTON-CANDY-CLOUD FIELDS (pink/blue cotton-candy cloud-ridges, sugar-glitter air)
- PANCAKE-STACK PLATEAUS (giant pancake plateaus, maple-syrup cascades)

━━━ ADDITIONAL VARIETY MANDATE (extend with these candy regions) ━━━

Distribute the new entries across additional candy biomes:
- ~10% JELLYBEAN MEADOW (rolling fields scattered with giant glossy pastel jellybeans + jellybean cobblestone paths)
- ~10% GINGERBREAD-CITY skyline (gingerbread townscape silhouette, royal-icing rooflines, peppermint-stick lampposts)
- ~8% CARAMEL-DUNE DESERT (warm-honey caramel-amber dunes, butterscotch-rock outcrops, toffee oasis)
- ~8% RAINBOW-CAKE TIER cliffs (towering layered birthday-cake cliffs, buttercream cascades between tiers)
- ~7% PASTEL-MACARON ARCHIPELAGO (floating macaron-island chain in pastel-pink sea, cream-filling beaches)
- ~7% JELLO-LAKE region (translucent wobbling jello lake in rainbow strata, fruit-suspended in the gel)
- ~7% FRUIT-GUMMY JUNGLE (translucent gummy-bear and gummy-worm vines, candied-fruit canopies)
- ~6% ICE-CREAM-CONE PEAKS (towering ice-cream-cone mountains with sprinkle-rim, drip-glaciers)
- ~6% MERINGUE-CLOUD HIGHLAND (puffy meringue-mountain plateaus dusted in powdered-sugar)
- ~6% TAFFY-PULL CANYONS (stretched taffy ribbons spanning a deep candy-canyon, pulled-sugar arches)
- ~6% BUTTERSCOTCH BLUFFS (warm amber butterscotch-rock cliffs, caramel-drip cascades)
- ~5% CHOCOLATE-TRUFFLE GROTTO (cocoa-dusted truffle boulders, chocolate-fountain centerpiece)
- ~5% PEPPERMINT-CRYSTAL CAVERN openings (red-and-white peppermint-crystal stalactites visible at entry)
- ~5% LICORICE-RIBBON BAYOU (twisting red-and-black licorice-rope bayou, gumdrop water-lilies)
- ~4% FRUITCAKE PLATEAU (rich fruitcake plateau studded with glace-cherries and candied-peel boulders)

━━━ FORMAT ━━━

Each entry: ONE complete candy-landscape sentence, 22-35 words. Lead with the dominant feature, follow with 2-3 supporting candy elements. End describing palette or horizon.

━━━ HARD MANDATES ━━━

- The ENTIRE landscape is made of candy / cake / cookie / sugar / chocolate / fondant — NOT real terrain.
- Saturated lush Disney-CGI palette (pink, teal, orange, purple, mint, cream, baby-blue, lavender, peach, butterscotch-amber).
- NOT neon — lush vivid pastels + warm saturated candy colors.
- Wreck-It-Ralph Sugar Rush register, NOT realistic landscape with candy on top.

━━━ HARD BANS ━━━

- NO real grass / real water / real mountains / real trees / real rocks.
- NO food creatures or characters (those come from other pools — focus on TERRAIN only).
- NO modern objects / signs / vehicles.
- NO neon-electric colors — saturated pastels only.
- NO dark / scary / moody / Halloween atmosphere.
- NO same biome appearing back-to-back across entries.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
