#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/sirenbot/seeds/female_actions.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} mid-action MOMENT descriptions for a high-fantasy WOMAN warrior in the heat of combat or spellcasting. Dynamic motion, not static poses. Race is a separate axis — don't pick one.

Each entry: 20-40 words describing a moment of action that is frozen at its most iconic instant. The moment is in progress — something is happening.

━━━ CATEGORIES TO MIX ━━━
- Spellcasting (conjuring fire/ice/lightning/arcane force, hands raised, energy forming)
- Blade work (swinging, lunging, parrying, dual-wielding, mid-decapitation arc)
- Ranged (drawing bowstring, casting spear, nocking arrow, loosing)
- Mounted (riding a dragon/beast, mid-leap from saddle, on warbeast's back)
- Leaping (from height, across gap, between combatants)
- Channeling / commanding (arms raised, summoning army, binding a spirit)
- Mid-transformation (partially shifted, fur/scales erupting)

━━━ RULES ━━━
- SOLO — she is the only figure. Enemies can be implied (she swings at something offscreen) but no second figure in frame.
- Dynamic — motion frozen at peak
- Scantily-clad warrior aesthetic is fine, but never explicit; no nipples

━━━ BANNED ━━━
- Specific race / specific weapon name (those are other axes)
- "posing" / "modeling" language
- Second figures in the frame

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  maxTokens: 4000,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
