#!/usr/bin/env node
/**
 * BRICKBOT_GIRLY_PHENOMENON — built whimsical pastel events.
 * Audit 2026-06-05: 46 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_girly_phenomenon.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} GIRLY-PHENOMENON entries for BrickBot — one big built whimsical pastel event dropping into a candy-castle / boutique / mermaid / unicorn brick diorama. Each entry: ONE CAPS prefix + em-dash + 28-40 word body.

━━━ THE BAR ━━━
Every entry names a sweet-magical event (sparkle-shower, rainbow-arc, fairy-dust, petal-fall, pastel-cloud, unicorn-gallop, mermaid-tail flick, frosting-drip, bubble-stream, balloon-release, etc.) AND shows how it's BUILT (trans-pink + trans-clear round-plates on clear rods, gem-elements, cotton-elements, trans-arc plates). Reads BRICK + ULTRA-CUTE.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 SPARKLE / GLITTER: sparkle-shower, glitter-fall, pixie-dust trail, twinkle-explosion
- ~5 RAINBOW / TRANS-ARC: rainbow arc, prism-light shafts, pastel-aurora, trans-rainbow column
- ~4 PETAL / FLORAL: cherry-blossom petal-fall, rose-petal-shower, sakura-storm, blossom-rain
- ~4 SWEETS: frosting drip, lollipop-pop, marshmallow-cloud burst, sugar-snow, gumdrop bounce
- ~3 BUBBLE / SOAP: bubble-stream rising, soap-bubble cloud, mermaid-foam, sparkly bath-bubble
- ~3 CREATURE: unicorn rear, mermaid tail-flick, fairy-flight, butterfly cloud, dove release
- ~3 SKY: pastel-cloud float, candy-cotton cloud, balloon release, paper-lantern sky-lift
- ~3 PARTY: confetti-burst, streamer-arc, cake-reveal flame-pop, glitter-cannon
- ~2 SEA / OCEAN: mermaid-pearl shimmer, jewel-coral glow, surf-foam (pastel)
- ~2 RIBBON / BOW: ribbon-furl, bow-cascade, silk-streamer drift
- ~1 SHOOTING-STAR pastel arc
- ~1 SPARKLE-PUDDLE / FAIRY-RING glow
- ~1 PASTEL-SUNRISE BAND across sky

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (2-5 hyphenated words), em-dash, 28-40 word body. Body must include WHAT + HOW it's brick-built + WHERE in the diorama. Touchpoints:
"SPARKLE-SHOWER — a cascading built fall of trans-clear + trans-pink 1×1 round-plates + gem-elements on fine clear rods arcing over a vanity scene, a frozen shimmering pastel rain."
"RAINBOW TRANS-ARC — stacked trans-red/orange/yellow/green/blue/pink plates curving in a deliberate built arc over a candy-cottage, a brick rainbow spanning the pastel sky."
"CHERRY-BLOSSOM PETAL-FALL — pink + cream leaf-elements suspended on clear rods at varied heights and angles drifting across the boutique courtyard, frozen sweet petal-storm."

━━━ BANS ━━━
- NO photoreal vocab
- NO masculine / dark / grim language
- NO living-fluid verbs ("dances in the wind")
- NO licensed franchise names
- NO duplicating events

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
