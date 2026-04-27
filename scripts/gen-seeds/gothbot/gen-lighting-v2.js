#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/lighting.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} LIGHTING descriptions for GothBot's character and scene paths. Each entry is a SHORT phrase (6-15 words) describing ONLY the quality, color, direction, and mood of the light. NOT a scene description — JUST the light itself.

━━━ THE KEY RULE ━━━
Describe ONLY the light — its color, direction, intensity, and quality. NO architecture, NO objects, NO characters, NO locations. "Warm amber candlelight from the left, deep shadows on the right" YES. "Candlelight in the cathedral illuminating the altar" NO — that's a scene, not lighting.

━━━ COLOR RANGE (enforce wide variety — NOT all purple) ━━━
The old pool was 60%+ purple/violet. Fix that. Distribute evenly:

- SILVER MOONLIGHT (3-4) — pure silver moonlight from above, cold blue-white lunar glow, crescent moon edge-light, diffuse moonlit silver wash
- WARM AMBER / GOLD (3-4) — warm amber candle-glow from one side, golden torch-light below, rich amber firelight, honey-gold lantern warmth
- TWILIGHT TONES (3-4) — soft rose-pink twilight gradient, peach-and-lavender dusk glow, warm coral sunset bleeding into indigo, golden-hour amber fading to violet
- COOL BLUES (2-3) — icy blue pre-dawn light, cold steel-blue winter light, deep sapphire tones
- VIOLET / PURPLE (2-3) — violet spell-glow from below, deep amethyst backlight, lavender twilight wash (ONLY 2-3 entries — NOT dominant)
- GREEN / SUPERNATURAL (2-3) — witch-fire emerald glow, sickly fel-green underlight, bioluminescent pale-green
- ORANGE / FIRE (2-3) — forge-orange rim-light from behind, ember-glow warming from below, bonfire warmth casting long shadows
- DRAMATIC CONTRAST (2-3) — stark single-source side-light deep shadows, Rembrandt triangle illumination, split-light half-face half-shadow
- STORM / LIGHTNING (1-2) — lightning-flash stark white freezing the moment, storm-light pulsing through clouds

━━━ RULES ━━━
- 6-15 words MAXIMUM per entry
- ONLY light quality — no objects, no architecture, no scene-setting
- Include DIRECTION when relevant (from above, from left, from below, rim-light from behind)
- Variety is everything — if two entries are similar, one must go
- These should work equally well on a face closeup or a full-body character

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
