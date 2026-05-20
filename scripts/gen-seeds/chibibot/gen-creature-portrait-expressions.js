#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/creature_portrait_expressions.json',
  total: 100,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CUTE PORTRAIT EXPRESSIONS for ChibiBot creature-portrait — the emotional state visible on a chibi creature's face in a tight portrait. Hyper-cute, never sad/scary/aggressive.

Each entry: 8-15 words. ONE specific expression. NO creature species names, NO pose (that's a different axis), NO setting.

━━━ FORMAT — EMOTIONAL EXPRESSION ━━━

Examples:
✓ "Wide-eyed surprised wonder, mouth open in a tiny gasp"
✓ "Heart-eyes shimmering pink with blissful adoration"
✓ "Sleepy half-closed eyes with a dreamy soft smile"
✓ "Curious tilted gaze with arched brows and bright eyes"
✓ "Shy bashful glance with rosy blush over cheeks"
✓ "Mid-laugh with eyes squeezed into joyful arcs"
✓ "Smug satisfied smirk with knowing half-closed eyes"
✓ "Hopeful pleading puppy-eyes brimming with wishfulness"
✓ "Sweet contented closed-eye smile, perfectly serene"
✓ "Surprised oh-no big-eyed gasp, cheeks pink with shock"

━━━ CATEGORY DISTRIBUTION ━━━

- 15% WONDER / SURPRISE (wide-eyed wonder / mouth-open gasp / big-eyed amazement / sparkle-eyed surprise)
- 15% HEART-EYES / LOVE (heart-eyes / pink-shimmer adoration / blissful love-struck / smitten gaze)
- 15% SLEEPY / DREAMY (sleepy half-closed eyes / dreamy soft smile / drowsy contented / heavy-lidded peaceful)
- 10% CURIOUS / INQUISITIVE (curious tilt / arched-brows wonder / inquisitive bright eyes / questioning gaze)
- 10% SHY / BASHFUL (shy bashful blush / hidden-cheek shyness / averted-eyes coy / sweet bashful smile)
- 10% JOYFUL / GIGGLY (mid-laugh / eyes-squinched-glee / joyful smile / giggling delight)
- 10% CONTENTED / SERENE (contented closed-eye smile / serene peaceful / blissed-out happy / quiet content)
- 5% HOPEFUL / PLEADING (puppy-eye plea / wishful hopeful / brimming-with-hope / starry-eyed wishful)
- 5% SMUG / MISCHIEVOUS (smug smirk / mischievous grin / knowing wink / playful sneaky)
- 5% AWE / MARVELING (jaw-drop awe / star-struck marveling / breath-held awe / dazzled wonder)

━━━ HARD MANDATES ━━━

- ALWAYS sweet / cute / warm — never sad, scary, aggressive, angry
- Expression appears on the FACE — eyes / brows / mouth / cheeks
- Include BLUSH or CHEEKS detail where natural

━━━ HARD BANS ━━━

- NO creature species names
- NO pose descriptions
- NO setting / background
- NO sad / angry / scary / aggressive emotions

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
