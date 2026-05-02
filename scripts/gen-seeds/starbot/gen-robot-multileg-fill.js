#!/usr/bin/env node
/**
 * One-off: generate 15 multi-leg (3+ legs) droid entries to top up the
 * robot_types pool after over-stripping. Aiming for ~15-18% multi-leg share.
 *
 * Variety: spider / hexapod / 8-legged / centipede / crab / tripod / quadruped.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/robot_types.json',
  total: 188,
  batch: 15,
  append: true,
  metaPrompt: (n) => `You are writing ${n} MULTI-LEG DROID entries for StarBot's robot-moment pool. Each entry is a DENSE phrase (25-45 words) describing a SPECIFIC AUTONOMOUS MACHINE with 3 or more legs (tripedal, quadruped, hexapod, six-legged, eight-legged, spider-bodied, crab-bodied, centipede-bodied, etc.).

━━━ SCALE — STRICTLY CHARACTER-SCALE ━━━

Every droid is BETWEEN 0.3 METERS AND 3 METERS in body size — knee-high to slightly-larger-than-a-person. NEVER kilometer-scale, NEVER thirty-meter-tall, NEVER building-sized.

ABSOLUTE BANS:
- NO "titan" / "titanic" / "colossal" / "kilometer" / "thirty-meter" / "behemoth"
- NO "dreadnought" / "warship" / "naval hull" / "aquatic titan"
- NO "cathedral" / "stained glass" / "limestone" / "carved stone" / "gargoyle"
- NO franchise droid names

━━━ VARIETY ACROSS ${n} ENTRIES ━━━

Mix across these multi-leg body plans (~equal coverage):

TRIPEDAL (3 legs):
- tripedal cartography droid with telescoping bronze legs and rotating sensor disc
- three-legged scout droid with single forward sensor cluster and two rear support legs

QUADRUPED (4 legs):
- four-legged maintenance droid with low body and articulating sensor head
- quadruped pack-droid with cargo harness and sturdy industrial legs

HEXAPOD (6 legs):
- six-legged surveyor droid with central body and radiating sensor arms
- hexapod cargo droid with load-platform on top and six articulated legs beneath

EIGHT-LEGGED (spider-bodied):
- spider-bodied maintenance droid with central thorax and eight tool-tipped legs
- arachnid-style sentry droid with eight piston-driven legs and roof-mounted sensors

CENTIPEDE (many segments):
- centipede-bodied utility droid with segmented chassis and twenty articulated legs
- segmented industrial droid that flexes serpent-like with rows of small legs

CRAB-BODIED (low and wide):
- crab-bodied scuttling droid with wide chassis and twin claw manipulators
- broad-stance combat droid with low body and four splayed armor-plated legs

━━━ ENTRY TEMPLATE ━━━

[body plan / leg count] + [material / finish / surface detail] + [signature feature or function-implying detail].

Examples (variety reference, do not copy):
- "Tripedal lighthouse-keeper droid with salt-corroded iron legs spread wide in triangular stance, rotating beacon-head"
- "Six-legged mining droid with reinforced gunmetal legs and pneumatic drilling arm, headlamp cluster, dust-caked plating"
- "Spider-bodied weaving droid with ceramic white thorax and eight thread-spool legs, central needle-array manipulator"

━━━ RULES ━━━
- 25-45 words per entry
- 3+ legs ONLY (no bipedal, no spherical, no hovering)
- Character-scale (0.3-3m body)
- Material specificity + personality detail
- NO franchise references
- Variety across the 6 body-plan categories above

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
