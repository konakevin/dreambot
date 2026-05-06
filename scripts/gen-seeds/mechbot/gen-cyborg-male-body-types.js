#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/cyborg_male_body_types.json',
  total: 200,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} BODY TYPE / SILHOUETTE descriptions for a MALE cyborg character. Each describes his overall build and physical proportions — the shape Flux should render.

━━━ THE BODY TYPE — LEAN / ATHLETIC ONLY ━━━

CRITICAL — these cyborgs derive their power from their MACHINERY, not muscle. Muscles look STUPID on a robot body. Every entry MUST describe a LEAN, ATHLETIC, WIRY, or SLIM frame.

ABSOLUTE BANS:
- NO "stocky", NO "sturdy", NO "heavy", NO "barrel-chested", NO "broad-shouldered" (in muscle context), NO "thick", NO "hefty", NO "hulking", NO "bulky", NO "powerhouse", NO "tank-frame", NO "warrior-built", NO "bodybuilder", NO "muscular", NO "muscle-bound"
- NO "softer build", NO "padding", NO "rounded shoulders", NO "rounded midsection", NO "slight belly", NO "fuller build"
- NO hyper-feminine — NO "delicate", NO "graceful", NO "elegant hands", NO "refined posture", NO "trim waist", NO "expressive lean"

Only ALLOWED descriptors:
- LEAN: lean frame, lean build, lean proportions
- WIRY: wiry frame, wiry build, sinewy
- ATHLETIC: athletic frame, athletic build, fit, runner build, swimmer frame
- SLIM: slim frame, slim build, slender, slim-tall
- TALL/REEDY: tall slim, tall reedy, lanky, reed-thin
- COMPACT-LEAN: compact lean frame, short-and-lean

━━━ BODY VARIETY (across ${n} entries) ━━━

LEAN-ATHLETIC (~50): natural athletic build — runner / swimmer / dancer / climber proportions
LEAN-WIRY (~50): sinewy frame, narrow shoulders, lean defined arms, no bulk
SLIM-TALL (~40): tall slim frames, narrow build, six-foot-three lean proportions
COMPACT-LEAN (~30): shorter lean frames, five-foot-eight to six-foot, narrow proportions
CYBERNETIC-SHIFTED (~30): naturally lean frame altered visibly by augmentation — silhouette changed by spinal mod, prosthetic limb, chest panel reveal, leg replacement

━━━ TEMPLATE / STYLE ━━━

Each entry: [height] + [lean-coded build descriptor] + [proportions detail] + [optional cybernetic shift].

Examples (variety reference, do not copy):
- "Six-foot lean frame, narrow shoulders, athletic runner proportions, defined but not bulky"
- "Tall slim build at six-foot-three, reedy frame, lanky limb proportions"
- "Five-foot-ten wiry build, sinewy arms, narrow waist, swimmer-shoulder proportions"
- "Lean six-foot-one frame with full chrome right arm changing the silhouette asymmetric"
- "Compact lean frame at five-foot-eight, narrow build, athletic climber proportions"
- "Tall reedy six-foot-four, slim narrow build, asymmetric stance from leg replacement"

━━━ RULES ━━━
- 12-20 words each
- LEAN / WIRY / SLIM / ATHLETIC ONLY — no other body types
- Use words like "tall", "compact", "medium", "slim", "lean", "wiry", "athletic", "narrow", "reedy", "lanky"
- NEVER "stocky", "thick", "heavy", "sturdy", "barrel", "broad", "bulky", "muscular", "softer", "rounded"
- Include cybernetic-shifted-silhouette on at least 30 of 200 entries
- Vary height with words: tall (six-three to six-five), medium (five-ten to six-foot), compact (five-six to five-nine)
- NO apostrophes (breaks JSON). Write "six-foot-two" not 6'2"
- NEUTRAL adult-male language — neither feminine nor macho

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
