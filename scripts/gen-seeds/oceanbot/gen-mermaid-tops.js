#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/mermaid_tops.json',
  total: 100,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MERMAID TOP/OUTFIT descriptions for OceanBot's mermaid-legend path. What covers or adorns her upper body — creative, exotic, mythical. NOT just seashell bras. These are ancient mythical sea creatures who adorn themselves with ocean treasures.

Each entry: 8-15 words. A specific top/covering/adornment for her upper body.

━━━ RANGE TO COVER ━━━
- Shell varieties: abalone halves, conch fragments, scallop-shell armor, nautilus spiral breastplate, cowrie-shell chainmail
- Coral/reef: living coral shoulder pieces, brain-coral armor, sea-fan lace draped across shoulders
- Kelp/seaweed: woven kelp wrap, dried sea-lettuce bodice, braided sargassum halter, fresh seagrass bindings
- Pearl/jewel: pearl-strand chest harness, mother-of-pearl scale top, black pearl choker extending down
- Net/rope: salvaged fishing-net draped and knotted, hemp rope wrapping from a shipwreck, trawl-mesh crop
- Metal/treasure: tarnished gold coins strung on wire, barnacle-crusted copper breastplate, corroded silver chain drape
- Bone/organic: whale-bone corset, sea-urchin-spine crown extending to shoulders, driftwood-bead chest piece
- Scale/skin: her own scales extending up her torso like natural armor, shark-skin wrap, ray-leather halter
- Fabric/sail: torn ship's sail wrapped and tied, sun-bleached canvas bandeau, waterlogged silk from a wreck
- Bare/minimal: nothing but her own long hair draped across her chest, bioluminescent body markings only
- Starfish/creature: living starfish clinging to her shoulders, tiny crabs decorating a coral crown that extends down
- Mixed/layered: pearl strands over kelp wrap, shell pieces woven into fishing net, coral and gold combined

━━━ DEDUP RULES ━━━
- Deduplicate by: primary material + construction style
- NO two entries with the same material AND same silhouette
- Even spread across all material families
- Keep it tasteful but exotic — she is mythical, not provocative

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
