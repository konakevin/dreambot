#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/outdoor_adventure_activities.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} ADVENTURE ACTIVITIES for ChibiBot outdoor-adventure — what a chibi creature is mid-doing in the wild. ACTIVE adventure-poses, NEVER posing still.

Each entry: 12-22 words. ACTIVE VERB-LED. NO creature species names, NO wilderness description.

━━━ FORMAT — ACTIVE ADVENTURE VERB + IMPLIED TERRAIN ━━━

Examples:
✓ "Mid-leap across mossy stepping-stones over a rushing stream, arms outstretched"
✓ "Mid-climb up a vine-draped rock-cliff, paws gripping moss, eyes upward toward the top"
✓ "Wading knee-deep through a glassy mountain-pool with a butterfly-net, ripples spreading"
✓ "Cresting a snowdrift on a hilltop, mid-stride with wind tousling fur"
✓ "Pushing through tall wildflower-grass with paws parting the stalks, head peeking through"
✓ "Mid-paddle in a tiny leaf-boat down a forest stream, paws gripping a twig oar"
✓ "Peeking over a cliff-edge with both paws on the rim, eyes wide at the view"
✓ "Mid-skip across stepping-stones of a brook, one paw lifted in mid-air"
✓ "Mid-jump from one log to the next over a mossy gully, scarf trailing"
✓ "Discovering a glowing mushroom under a fern, mid-reach with curious expression"

━━━ CATEGORY DISTRIBUTION ━━━

- 15% CLIMBING (mid-climb up vine / rock-ledge / log / tree-branch / cliff-foothold)
- 15% LEAPING (mid-leap across stepping-stones / between branches / over a gully / off a rock)
- 15% WADING / PADDLING (knee-deep in stream / mid-paddle in leaf-boat / fording a brook / splashing across)
- 15% HIKING / TREKKING (mid-stride down a trail / pushing through tall grass / cresting a ridge / mid-step over a root)
- 10% DISCOVERING (mid-reach toward glowing mushroom / mid-pluck of wildflower / mid-grab of pinecone / peering into a hollow log)
- 10% PEEKING / OBSERVING (peeking over cliff-edge / paws-pressed-to-rock peering / spy-glass to eye / cresting a ridge to see vista)
- 5% RIDING (riding a giant beetle / mid-mount on a mossy rock / paddling on a turtle-back / catching a dandelion-seed-ride)
- 5% SHELTERING (huddled under a leaf / sheltering under mushroom-cap in rain / hiding behind a stump)
- 5% CARRYING (hauling a forest-find / dragging a stick / carrying a leaf-basket of berries / pulling a load through grass)
- 5% MID-DISCOVERY (mid-gasp of wonder / mid-stop with hand-to-mouth / cresting a ridge mid-awe / paws-pressed-cheeks at a vista)

━━━ HARD POSE-BANS ━━━

✗ "Sitting / standing / posing still" — replace with mid-action
✗ "Looking" alone (passive) — make it "peering" / "discovering" / "scanning"

━━━ HARD BANS ━━━

- NO creature species names (chibi-fox / polar-bear / etc.)
- NO village / architecture references
- NO scary / sad / dangerous imagery
- NO multi-creature scenes (SOLO adventurer)
- NO weather-specific (e.g., no "in the rain" — weather comes from another axis)

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering. Each begins with an active verb-led adventure phrase.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
