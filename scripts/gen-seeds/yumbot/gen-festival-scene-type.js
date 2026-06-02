#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/festival_scene_type.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} matsuri scene-types for 5 kawaii Japanese festival foods composed together. Each entry is a CLEAN CLUSTER composition where the 5 foods sit/stand together at a matsuri spot, with SLIGHT NATURAL POSE VARIATION per food (one peeking forward, one tilted, one leaning back, one looking up, one sitting tallest at center) — natural personality, NOT identical-row-of-soldiers lineup, NOT chaotic acrobatics.

Each entry: 30-42 words. Each entry MUST specify:
1. A concrete clean-cluster matsuri composition (gathered around a yatai stall / clustered at a goldfish-tank / nestled on shrine steps / huddled on a festival blanket / arranged at the foot of a torii / gathered around a candy-fountain / etc.)
2. SLIGHT POSE VARIATION per food — each food described with a distinct natural pose (leaning forward / peeking from the right edge / seated cross-legged / nestled close / tilted slightly upward / sitting tallest at center / looking down at the tray / etc.)
3. The 5 foods are NOT doing different activities — they're all just there together, but each has its own natural pose/expression. Think family-photo with everyone in slightly different poses, NOT lined-up-for-roll-call.

Examples:
"Five kawaii foods gathered around a yatai food-stall counter — one leaning forward against the menu-board peeking, one tilted slightly to the right looking out, one seated cross-legged on the counter, one nestled close to its neighbor, one sitting tallest at the back center."
"Five kawaii matsuri foods clustered at the foot of a torii gate — one in the foreground tipped slightly forward, two seated close together to the left leaning toward each other, one peeking from behind the right pillar, one perched on the lower step looking up."
"Five kawaii foods nestled together on a red picnic blanket — one leaning back propped on its hands, one seated upright at center looking out, one tilted to the side, two pressed close together at the right cuddling, all gathered as a kawaii family-portrait cluster."
"Five kawaii foods gathered around a kingyo-sukui goldfish-tank — two leaning over the rim peeking into the water on the left, one seated upright between them, one nestled at the right corner with paper-net in hand, one perched slightly higher behind looking down."

DO NOT write:
- "5 foods lined up in a row" with identical poses (NEVER — this was the failure mode)
- Vertical stacking / climbing / acrobatics
- Different activities per food ("scooping" / "ringing" / "jumping") — keep poses NATURAL not action-y
- Vendor-customer dynamics
- The broader matsuri/market BACKDROP (no shrine-courtyard / yatai-lane / Edo street descriptions — those are in a separate axis)
- Modern urban / Western festival

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
