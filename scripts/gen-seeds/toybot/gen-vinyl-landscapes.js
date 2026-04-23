#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/vinyl_landscapes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} DESIGNER-VINYL-TOY LANDSCAPE scene descriptions for ToyBot's vinyl path. Designer-vinyl-toy aesthetic (Dunny / Kidrobot / Bearbrick / Mighty-Jaxx) — glossy-ABS-plastic, mold-parting-seams, stylized-not-realistic, collector-display DNA.

Each entry: 15-25 words. ONE specific designer-vinyl landscape scene.

━━━ THE MIX ━━━
- ~30% Type A — pure designer-vinyl diorama landscape, NO figures. Stylized glossy-vinyl environment IS the subject.
- ~70% Type B — ONE off-center designer-vinyl figure (oversized-head vinyl-toy proportions) in a specific body-shaping pose within a stylized diorama landscape. Lead with BODY POSITION. Landscape dominates.

━━━ TYPE B RULES ━━━
Lead with body-position in first 5-8 words (kneeling / crouched / seated / reclining / leaning / mid-stride / reaching / climbing / leaping / bent / tilted / dangling). Then context. Pose canon drives composition — never centered-hero. Invent rich variety across the 50 entries.

━━━ CONTEXT DNA ━━━
- Vinyl-toy environments: Dunny-aesthetic candy-forests / Bearbrick monochrome rooms / Kidrobot neon-cityscapes / glossy-pastel underwater / designer-cabinet-diorama / stylized Japanese-street / vinyl-carnival / retro-diner / pop-art-gallery / vinyl-casino / vinyl-ramen-shop / stylized-ski-lodge / vinyl-planetarium / etc.
- Vinyl-figure: oversized-head 3:1 body proportions, glossy-ABS plastic, mold-parting-seam visible, collector-paint detail

━━━ MUST-HAVE ━━━
- Reference DESIGNER-VINYL / glossy-ABS / vinyl-figure / mold-parting-seam / stylized-not-realistic language
- Type A = zero figures. Type B = exactly ONE vinyl-figure, OFF-CENTER, body-shaping pose-first
- Aggressive dedup: max 4 per pose-family, max 2 per landscape-type across the 50 entries

━━━ BANNED ━━━
- NO centered-hero figure
- NO multi-figure entries
- NO passive verbs (standing / posing / looking)
- NO real-brand designer-toy series (no "Dunny" specific series names, no "Labubu" etc.)
- NO CGI / illustration / photorealism

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
