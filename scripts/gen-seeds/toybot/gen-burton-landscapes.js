#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/burton_landscapes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} TIM-BURTON / LAIKA STOP-MOTION LANDSCAPE scene descriptions for ToyBot's burton-scene path. Gothic-whimsy handcrafted miniature sets — paper-moon, sculpted-foam crags, wire-armature twisted-trees, gothic-plaster architecture. Corpse-Bride / Coraline / Frankenweenie / Nightmare-Before-Christmas empty-set DNA.

Each entry: 15-25 words. ONE specific Burton-world landscape scene.

━━━ THE MIX ━━━
- ~30% Type A — pure empty gothic-whimsy miniature environment, NO puppets. The handcrafted paper-moon/plaster/wire-tree set IS the subject.
- ~70% Type B — ONE off-center tall gaunt Laika-puppet (oversized head, teardrop eyes, pale sculpted skin, visible stitch-seams, Victorian-gothic wardrobe) in a specific body-shaping pose within a miniature gothic-whimsy set. Lead with BODY POSITION.

━━━ TYPE B RULES ━━━
Lead with body-position in first 5-8 words (kneeling / crouched / seated / reclining / lying / leaning / mid-stride / reaching / climbing / leaping / bent / tilted / dangling). Set dominates frame.

━━━ CONTEXT DNA ━━━
- Burton-world sets: moonlit graveyard / spiraling-gothic-staircase tower / dead-wire-forest / Victorian parlor / paper-moon-lake / gothic cathedral / snow-dusted rooftops / sculpted pumpkin-patch / clock-tower / haunted theater / Victorian carriage-stable / bone-shelf library / spider-web dining-hall / mad-scientist lab / cliffside manor / black-widow boudoir / ink-lake dock / gothic-chapel / haunted alley / cemetery gates / ruined-abbey cloister / masquerade-ballroom / stormy widow's-walk
- Puppet DNA: tall gaunt elongated body, oversized head, huge teardrop eyes, porcelain/pale-blue sculpted skin, visible body-stitch-seams, wild silk hair or sculpted updo, Victorian-gothic wardrobe (tattered lace / high-collar / morning-coat / top-hat / black-widow veil)

━━━ MUST-HAVE ━━━
- Reference MINIATURE-SET / handcrafted / paper-moon / plaster / wire-armature / stop-motion-set / Laika-puppet LANGUAGE
- Type A = zero puppets. Type B = exactly ONE Laika-puppet, OFF-CENTER, body-shaping pose-first
- Aggressive dedup: max 4 per pose-family, max 2 per set-type

━━━ BANNED ━━━
- NO centered-hero puppet
- NO multi-puppet entries
- NO passive verbs
- NO real-IP character names (Emily / Victor / Sally / Jack Skellington / Coraline / Beetlejuice)
- NO CGI / illustration / photorealism

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
