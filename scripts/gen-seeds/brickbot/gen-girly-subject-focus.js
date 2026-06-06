#!/usr/bin/env node
/**
 * BRICKBOT_GIRLY_SUBJECT_FOCUS — dominant subject for pastel-cute diorama.
 * Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_girly_subject_focus.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} SUBJECT-FOCUS entries for BrickBot's girly path — each names the dominant brick subject of a pastel-cute diorama. Each entry: (CATEGORY) prefix + body, 28-45 words.

━━━ THE BAR ━━━
Every entry leads with one of FOUR category tags.
CATEGORIES:
- (STRUCTURE) — candy castle, boutique, parlor, ballet-studio, spa-pavilion, mermaid-palace, etc.
- (NO-VEHICLE LANDSCAPE) — fairy-meadow, butterfly-glade, rainbow-cliff, mermaid-coral grove, candy-mountain
- (NO-VEHICLE INTERIOR) — boutique-interior, vanity-room, dressing-room, slumber-loft, candy-kitchen, throne-room
- (CREATURE-MOUNT) — unicorn rider, pegasus-rider, dolphin-rider, mermaid-tail, swan-mount, peacock-cart

━━━ VARIETY MANDATE (distribute roughly) ━━━
- ~7 STRUCTURE — candy castle, bakery, boutique, ballet studio, ice-cream parlor, jewelry shop, perfume salon, spa, princess-stable, gazebo, fairy-cottage
- ~6 NO-VEHICLE LANDSCAPE — fairy meadow, butterfly glade, rainbow cliff, mermaid coral grove, candy mountain, pastel forest, blossom-garden, rose-arbor, peony field
- ~6 NO-VEHICLE INTERIOR — vanity room, dressing room, slumber loft, candy-kitchen, throne room, music-box stage, dollhouse interior
- ~5 CREATURE-MOUNT — unicorn ride, pegasus ride, dolphin ride, mermaid-tail, swan-carriage, peacock-cart, butterfly-chariot

━━━ FORMAT ━━━
Each entry: (CATEGORY) prefix + 28-45 word brick description. Touchpoints:
"(STRUCTURE) a dreamy brick ballet-studio with arched SNOT-curved pink windows, a barre-rail of bar-elements, a mirrored wall of trans-clear plates, a tutu-banner, the central diorama anchor."
"(NO-VEHICLE LANDSCAPE) a glittering fairy-forest: mushroom-cap domes, flower-stud tree-tops, a trans-pink petal-pond, a mossy brick path, dewdrop-clear studs on every leaf-element, the immersive hero scene."
"(CREATURE-MOUNT) a brick-built rainbow unicorn with pearl-white slope-brick body, trans-rainbow mane-elements flowing, a princess mini-doll on her back, the dominant centerpiece."

━━━ BANS ━━━
- NO masculine / dark / grim
- NO photoreal vocab
- NO licensed franchise IP
- NO duplicating subjects

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with (CATEGORY) prefix.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
