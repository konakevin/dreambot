#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/creature_portrait_poses.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} CUTE PORTRAIT POSES for ChibiBot creature-portrait — what a chibi creature is doing in a tight portrait crop. The creature fills the frame; the pose is intimate and charming.

Each entry: 10-18 words. ONE specific pose. NO creature species names, NO setting, NO time-of-day.

━━━ FORMAT — INTIMATE PORTRAIT POSE ━━━

Examples:
✓ "Tilting head curiously to one side, both paws clasped in front"
✓ "Paws pressed to cheeks in heart-shaped happiness, mouth slightly open"
✓ "Mid-yawn with tiny pink tongue curled out, eyes squeezed shut"
✓ "Peeking shyly from behind both paws, just one eye visible"
✓ "Holding a tiny flower up to nose, sniffing it deeply"
✓ "Cheek squished against one paw in a sleepy lean"
✓ "Hugging itself with both arms wrapped around chubby body"
✓ "Looking up with paws outstretched as if about to be picked up"
✓ "Stretching wide with all paws extended, mid-yawn-stretch"
✓ "Resting chin on both folded paws, dreamy expression"

━━━ CATEGORY DISTRIBUTION ━━━

- 20% HEAD-TILT (head tilted to one side curiously / chin lifted up / head cocked questioningly)
- 15% PAWS-TO-CHEEKS (both paws pressed to cheeks / one paw to mouth in surprise / paws cupped around face)
- 15% PEEKING (peeking from behind paws / peeking around an object / peeking up from below the frame)
- 10% MID-YAWN / SLEEPY (mid-yawn with tongue / sleepy half-closed eyes / dreamy heavy-lidded)
- 10% HOLDING-SOMETHING (holding tiny flower / holding heart / holding tiny food / clutching paw to chest)
- 10% HUG / SELF-HOLD (hugging self / arms wrapped around / paws clasped to chest)
- 5% STRETCHING (mid-stretch with all paws extended / arms-up stretch / cat-stretch with arched back)
- 5% LEAN (cheek-squished-against-paw / leaning forward curiously / chin-on-folded-paws)
- 5% LOOK-UP (looking up with wide eyes / chin lifted / eyes raised hopefully)
- 5% MID-LAUGH / GIGGLE (mouth-wide-open-giggle / paws covering mouth in laugh / eyes-squinched-with-glee)

━━━ HARD POSE-BANS ━━━

✗ "Sitting" (passive — needs an active pose detail)
✗ "Standing" alone (needs more specificity)
✗ Aggressive / threatening / sad poses

━━━ HARD BANS ━━━

- NO creature species names
- NO setting / background
- NO weather/time
- NO multi-creature scenes (SOLO portrait)

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering. Each is a specific intimate portrait pose.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
