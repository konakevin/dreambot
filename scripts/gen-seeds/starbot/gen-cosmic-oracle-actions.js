#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cosmic_oracle_actions.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} DYNAMIC ACTION descriptions for StarBot's cosmic-oracle path — a sci-fi character DOING something physically compelling. Every entry must produce an image where the character's BODY IS IN MOTION or EXERTING FORCE. These are action-movie freeze-frames, not portraits of people sitting around.

Each entry: 12-22 words. ONE specific dynamic action. GENDER-AGNOSTIC language — use "the figure" / "they".

━━━ THE CORE RULE ━━━
Every entry MUST show a character ACTIVELY DOING SOMETHING with their body. The image should look like a freeze-frame from an action scene — muscles engaged, body in motion, tension visible.

━━━ ACTION CATEGORIES (spread evenly) ━━━
COMBAT + SURVIVAL (~25%):
- Diving behind cover as debris explodes, arm shielding face
- Swinging from cable between ships, legs tucked, momentum mid-arc
- Sliding under closing blast door, sparks trailing from armor scraping deck
- Firing weapon while sprinting across collapsing bridge
- Deflecting energy bolt with forearm shield, other hand drawing sidearm

PHYSICAL LABOR + BUILDING (~25%):
- Hauling massive cable hand-over-hand across zero-g gap
- Hammering rivets into hull patch, welding sparks showering
- Wrenching open jammed airlock with crowbar, whole body leveraged
- Hoisting salvage onto shoulder while climbing wreckage slope
- Dragging wounded ally through knee-deep alien marsh

EXPLORATION + DISCOVERY (~25%):
- Rappelling down cliff face into bioluminescent cavern
- Leaping across gap between floating rock platforms
- Pulling themselves up over ledge, one hand gripping alien vine
- Wading through chest-deep alien water, equipment held overhead
- Climbing alien megastructure hand-over-hand, wind whipping cloak

DRAMATIC + CINEMATIC (~25%):
- Planting flag on alien summit, wind tearing at suit fabric
- Catching falling artifact mid-dive, body fully horizontal
- Throwing grapple line to drifting ship, body braced against vacuum
- Shouldering through crowd in alien bazaar, pushing past obstacles
- Wrestling alien creature underwater, bubbles and bioluminescence swirling

━━━ BANNED (ABSOLUTE — violating these makes boring images) ━━━
- NO sitting, seated, resting, reclining, lounging, napping, sleeping
- NO lying down, lying on back, lying prone (unless mid-combat slide)
- NO reading, watching, gazing, staring, contemplating, meditating, waiting
- NO "standing still" / "standing guard" / static observation
- NO passive consumption (drinking, eating, smoking)
- NO "posing" / "modeling" / "facing the camera"
- NO "she" / "her" / "him" / "his" — use they/their
- NO gore / explicit blood
- NO sexual / erotic poses
- NO named IP characters
- NO location details (pool handles that)
- NO lighting details (pool handles that)

━━━ VARIETY ━━━
Max 2-3 entries using the same verb. Rotate across: diving, climbing, hauling, swinging, leaping, sprinting, wrenching, throwing, catching, rappelling, sliding, wrestling, dragging, hoisting, firing, hammering, pulling, shouldering, bracing.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
