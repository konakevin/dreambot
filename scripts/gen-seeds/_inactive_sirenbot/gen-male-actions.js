#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/male_actions.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} mid-action MOMENT descriptions for a menacing high-fantasy MALE warrior in combat. Dynamic motion. Race is a separate axis.

Each entry: 20-40 words describing a moment of raw combat action frozen at its most iconic instant.

━━━ CATEGORIES TO MIX ━━━
- Heavy melee (swinging great weapon, cleaving, mid-charge)
- Dual-wielding (scissor-swing, twin-blade cross, axe-and-shield)
- Defensive (braced against impact, shield up, weapon raised to parry)
- Leaping (from height, across gap, over a fallen foe)
- Bloody finisher (pulling weapon free, wrenching blade out of something, crushing blow)
- Commanding / summoning (arms raised, rallying, bellowing, calling dark magic)
- Mounted (atop warbeast, war-steed, dragon, abyssal creature)
- Battle-aftermath (walking through smoke/carnage, weapon dragging, cloak smoldering)

━━━ RULES ━━━
- SOLO — he is the only figure. Enemies can be implied offscreen, no second figure rendered.
- Visceral motion — mid-swing, mid-strike, mid-push-off
- Menacing, not hero-posed. He is DOING, not modeling.

━━━ BANNED ━━━
- Specific race / weapon name (other axes)
- "posing" / "modeling"
- Second figures in frame
- Gore beyond blade-and-blood (no dismembered body parts in frame, keep R-rated)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  maxTokens: 4000,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
