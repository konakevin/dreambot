#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/dollhouse_life_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (
    n
  ) => `Write ${n} DOLLHOUSE-LIFE scenes for ToyBot's dollhouse-life path. ENSEMBLE family / friend cozy daily-life dioramas. Three figurine traditions — Calico-Critter (~50%) / vintage-wooden (~30%) / modern Lori-doll (~20%). Each entry commits to ONE tradition (never mix). Each entry 20-32 words.

━━━ HARD RULES ━━━
- 70%+ entries: MULTIPLE figurines (3+) in shared activity.
- Solo entries MAX 30% — must have rich-context (preparing-for-others, lookout, mid-discovery).
- ONE figurine tradition per scene (never mix calico-flocked-bunny + vintage-wooden + Lori-doll in same scene).
- Mid-cozy-activity verb (mid-stir / mid-pour / mid-tuck-in / mid-bake / mid-laugh / mid-page-turn).

━━━ FIGURINE TRADITIONS ━━━
- **Calico**: flocked-velvet small-animal figurines (bunny / bear / fox / cat / mouse / raccoon / hedgehog / squirrel / panda), ~3-inch, painted plastic eyes, gingham/knit/overalls/bonnet/pinafore outfits.
- **Vintage-wooden**: 3-5-inch dollhouse-people (mom / dad / kid / baby / grandparent), simple painted faces, fabric or molded clothes, stiff-plastic or wooden joints, 1950s-70s aesthetic.
- **Modern Lori-doll**: 6-inch articulated fashion-doll-scale humans, rooted hair, contemporary outfits (overalls / sweaters / dresses / pajamas / school-uniforms).

━━━ INTERIORS (fully-appointed miniature sets) ━━━
Victorian parlor, modern kitchen, nursery, library nook, garden-room, bathroom, bakery shop, music-room, dining-room, attic, greenhouse, tea-room, study, porch, playroom, conservatory, cottage hearth.

━━━ EXAMPLE ARCHETYPES (rotate across traditions) ━━━
- Calico bunny-family parlor — 3 flocked-bunnies around miniature teapot at fringed-lamp table
- Vintage Sunday-dinner — wooden mom-dad-kids around scale dining-table, mid-pass of scale-roast
- Lori-doll sleepover — 3 articulated dolls in mini sleeping-bags on scale-floor, mid-laugh, fairy-lights
- Calico bear-family bakery — 4 flocked-bears in mini-aprons mid-roll / mid-frost / mid-decorate cookies
- Vintage music-recital — wooden mom at mini-piano, dad on scale-violin, kids listening on settee
- Lori-doll camping — 3 articulated dolls mid-marshmallow-toast over miniature campfire in scratch-built tent-set
- Calico mouse-family bedtime — 4 flocked-mice tucked into miniature bunk-beds, mom-mouse mid-tuck-in
- Vintage Christmas-morning — wooden family around miniature Christmas-tree, mid-unwrap of scale-presents
- Lori-doll tea-party — 4 articulated dolls at miniature round-table with china-set, mid-laugh
- Calico raccoon bath-time — 3 flocked-raccoons in mini clawfoot-tub with felt-bubbles, mid-scrub
- Vintage-grandparents-knitting — wooden grandma-and-grandpa in matching armchairs mid-stitch, fireplace
- Lori-doll baking-with-mom — 2 articulated dolls mid-roll of mini pie-crust on scale-counter, dough-flour

━━━ MUST-HAVE per entry ━━━
- Dollhouse / miniature / scale / flocked / wooden / articulated / figurine language
- Specific tradition + archetype
- Multi-figure ensemble OR strong solo-with-context
- Mid-cozy-activity verb
- Fully-appointed interior anchor

━━━ BANNED ━━━
- Mixing figurine traditions in same scene
- Real human / real animal
- Outdoor wilderness (interior life only)
- Action / drama / battle (cozy daily-life only)
- Solo passive-staring (the failure mode — fix it)
- CGI / illustration.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
