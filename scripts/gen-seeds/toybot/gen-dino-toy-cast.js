#!/usr/bin/env node
/**
 * DINO_TOY_CAST — the REAL plastic toy dinosaur cast for the diorama.
 * Hero dino + 2-3 supporting dinos, each named with its TOY material
 * (glossy hard-plastic / matte rubber / mono-molded / flocked-velvet
 * / glow-in-the-dark / translucent jelly / two-tone factory-painted)
 * + color + species. Material/scuff/seam tells are mandatory.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/dino_toy_cast.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} TOY-DINOSAUR CAST entries for ToyBot dino-diorama — the hero + supporting cast of REAL PLASTIC TOY dinosaurs that act in the sculpted-clay prehistoric world. Each entry is one sentence, 35-55 words, structured as "Hero: <hero spec>; supporting: <2-3 supporting dinos>."

━━━ THE BAR ━━━
Every entry: (1) names ONE hero dinosaur with its TOY MATERIAL + color + species + visible toy tell (mold-seam, scuffed paint, factory-paint tells, sheen, rubbery surface, glow-in-the-dark cast, translucent jelly); (2) names 2-3 supporting dinos with their own DISTINCT toy materials + colors + species. The cast must read as REAL bin-of-toys variety — mix of finishes, mold types, factory tells.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"Hero: glossy emerald-green hard-plastic T-rex with visible mold-seam down its spine and scuffed belly paint; supporting: matte olive-drab stegosaurus with chipped silver dorsal plates, single-color brick-red mono-molded velociraptor, small translucent jelly-plastic pteranodon in pale amber."
"Hero: matte rubber teal-blue triceratops, slightly tacky to the touch, factory paint rubbed thin on horn tips; supporting: glossy mustard-yellow brachiosaurus with hard-plastic sheen, tiny blaze-orange mono-molded ankylosaurus, mottled grey-and-sand two-tone parasaurolophus."
"Hero: glow-in-the-dark hard-plastic spinosaurus in chalky off-white with faint green tinge; supporting: glossy brick-red allosaurus with mold-seam running jaw to tail, matte purple velociraptor, small translucent blue jelly-plastic pteranodon."
"Hero: metallic-painted gold brontosaurus with brushed sheen over injection-molded plastic body; supporting: matte olive-drab T-rex, flocked-velvet dark-green stegosaurus with fuzzy texture, single-color blaze-orange mono-molded dilophosaurus."

━━━ VARIETY MANDATE (distribute across TOY MATERIALS + DINOSAUR SPECIES) ━━━

Toy materials to rotate as HERO finish (~equal distribution):
- glossy hard-plastic (visible mold-seam, factory sheen, scuffed paint)
- matte rubber (slightly tacky, soft squeeze, pooled paint detail)
- mono-molded single-color (brick-red / blaze-orange / lime / yellow / cobalt / olive — uniform color throughout)
- flocked-velvet (fuzzy texture overcoat)
- glow-in-the-dark (chalky off-white / pale green tinge)
- translucent jelly-plastic (amber / blue / red / smoke-grey see-through)
- two-tone factory-painted (body + underbelly different colors)
- metallic-painted (gold / silver / copper / chrome over plastic body)
- vintage tin-litho (printed metal with chipped litho-paint)

Dinosaur species to rotate across hero + supporting (each entry uses 4 different species):
T-rex, triceratops, stegosaurus, velociraptor, allosaurus, brachiosaurus, parasaurolophus, ankylosaurus, dilophosaurus, pteranodon, pterodactyl, spinosaurus, brontosaurus, diplodocus, oviraptor, deinonychus, iguanodon, dimetrodon, plesiosaurus, mosasaurus, archaeopteryx, gallimimus, edmontosaurus, pachycephalosaurus, therizinosaurus, microraptor, compsognathus, ceratosaurus, carnotaurus, baryonyx, suchomimus, giganotosaurus, sauropelta, kentrosaurus, euoplocephalus.

━━━ COLOR DIVERSITY ━━━
Distribute across: emerald-green, teal-blue, mustard-yellow, brick-red, olive-drab, sand-tan, blaze-orange, cobalt-blue, lime-green, deep-purple, hot-pink, chalky-white, charcoal-grey, copper-red, sage-green, deep-indigo, butter-yellow, magenta. Avoid repeating the same color in consecutive entries.

━━━ BANS ━━━
- NO photoreal / living dinosaurs — every cast member is a REAL PLASTIC TOY (state the material).
- NO CGI / illustration register — toy material tells are mandatory.
- NO bare "a green dinosaur" — name SPECIES + MATERIAL + COLOR + visible toy tell.
- NO mixing in non-dinosaur creatures — this axis is dinosaur cast only.
- NO real photoreal scale (lifesize) — these are TOY-scale plastic figures.
- NO repeating the same hero/supporting combination across entries.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string in the "Hero: ... ; supporting: ..." format.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
