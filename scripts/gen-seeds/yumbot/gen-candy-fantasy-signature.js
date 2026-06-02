#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/candy_fantasy_signature.json',
  total: 200,
  batch: 18,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SIGNATURE LANDMARK elements for a candy-fantasy world. Each entry is ONE iconic candy-world object — a VERTICAL, STANDALONE, or CLUSTERED landmark that anchors a scene without creating Z-axis depth or receding lines.

Each entry: 12-22 words. ONE specific landmark. Sugar Rush kawaii Disney-CGI pastel register.

DO write:
- A single giant pastel lollipop-tree standing alone with a wide spiral-disc canopy on a candy-cane trunk
- A central candy-fountain with three tiered pastel-frosting bowls cascading sugar-glitter water
- A small cluster of oversized gumdrops in mint, lavender and bubblegum-pink heaped together
- A puffy pink-and-cream cotton-candy cloud floating in mid-frame
- A tall pop-rocks geyser fizzing skyward in pastel jewel-tone bursts
- A standalone fondant-cottage with a cake-tier roof and royal-icing trim
- A frosted-cake-tier wedding-cake tower in pastel pink, cream and mint
- A sugar-crystal sculpture catching prism-light in iridescent shards
- A peppermint-stripe gazebo with a curved-licorice roof and ribbon-tied poles
- A heaped marshmallow-throne dusted in powdered-sugar
- A giant pastel macaron-stack pyramid in mint, pink and lavender
- A round candy-globe orb suspended in mid-air, glossy and translucent

DO NOT write entries that contain ANY of these patterns:
- "row of X" / "rows of X"
- "lined with" / "lining" / "alongside" / "along the edge"
- "stretching" / "spanning" / "leading" / "leading to" / "receding"
- bridge / boardwalk / footbridge
- racetrack / race-track / track winding / path / pathway / lane / cobblestone
- fence rows / fence-posts lining / railings looping
- stream / river / creek / waterfall splashing into a pool
- "in the distance" / "horizon" / "vanishing point"

These ban patterns are non-negotiable — they all create Z-axis depth or center-receding composition that ruins the render. Stick to STANDALONE landmarks placed within the scene as anchors, not directional lines.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
