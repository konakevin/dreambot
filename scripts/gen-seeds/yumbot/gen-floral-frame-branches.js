#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/floral_frame_branches.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing \${n} FRAME-BRANCH descriptions for YumBot floral-garden-cup. A cherry-blossom or floral branch arching from an upper corner into the frame, providing the magical floral-fantasy framing.

Each entry: 10-18 words. ONE specific framing branch.

━━━ REFERENCE — bex.ai ━━━

Cherry-blossom branches with pastel-pink blooms arching diagonally from upper-corner into the frame, often catching warm-pastel-light. Sometimes wisteria-cascade hanging from above, or pastel-floral-vines.

━━━ DISTRIBUTION ━━━

- 40% CHERRY-BLOSSOM (cherry-blossom branch with pastel-pink blooms arching from upper-right corner / cherry-blossom-cluster cascade from upper-left / cherry-blossom-bough with petals just-fallen / sprig of cherry-blossom with closed and open buds)
- 20% WISTERIA-CASCADE (pastel-violet wisteria cluster hanging from above / cascade of wisteria-petals from upper-corner / lavender wisteria-vine hanging in arc)
- 15% PASTEL-ROSE-BRANCH (pastel-rose-vine arching across upper-corner / cluster of mini-pastel-roses on a curving branch / climbing-rose sprig)
- 10% FLOWERING-VINE (pastel morning-glory vine curling from above / blooming-jasmine cascade / pastel-floral-vine with tendrils)
- 5% PASTEL-FLOWER-CLUSTER (cluster of cosmos-flowers on a stem arching in / pastel-lupine-stalk from corner)
- 5% LEAFY-BRANCH (pastel-mint-leaf-sprig arching in / silver-eucalyptus-branch cascade)
- 5% MAGIC-FLORAL (translucent-glowing-flower-branch / pastel-rainbow-blossom-arc / shimmery iridescent-floral-cascade)

━━━ HARD MANDATES ━━━

- Arches FROM A CORNER INTO the frame
- Pastel palette
- Hand-painted texture register

━━━ HARD BANS ━━━

- NO straight-on framing
- NO creatures / animals
- NO modern objects

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
