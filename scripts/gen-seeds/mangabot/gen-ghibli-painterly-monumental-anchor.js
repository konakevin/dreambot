#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_painterly_monumental_anchor.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} MONUMENTAL ANCHOR entries for a MangaBot ghibli-painterly keyframe. This is the DOMINANT architectural mass that fills 50-70% of the frame as the SCENE HERO. Castle-in-the-Sky / Spirited-Away / Princess-Mononoke / Howl's Moving Castle / Lost-Universe painterly-Ghibli register.

Each entry: 14-22 words. ONE monumental architectural anchor — towering, vertical, painterly, multi-tier-detailed. Specific architectural language that primes Flux for a MASSIVE structure.

ANCHOR VARIETY (25 bespoke entries):
- 25% FLOATING SKY-CASTLE / FORTRESS (Castle-in-the-Sky / Laputa / Tenkuu-no-Shiro lineage) — vertical stone cathedral on a floating island, brass-trim, crystalline spires, cascading ivy from terraces
- 20% CATHEDRAL-SPIRE / SHRINE-PAGODA (Mononoke-cathedral / Spirited-Away-bathhouse register) — stacked tiered pagoda climbing into clouds, painted-wood lacquer, copper roof finials, hanging banners
- 15% MOSS-OVERGROWN STONE RUIN-CATHEDRAL — ancient cyclopean monolith reclaimed by vines and moss, broken arch silhouettes, cathedral nave roofless to sky
- 15% LANTERN-TEMPLE / SUBTERRANEAN SHRINE — vaulted cavern with cascading paper lanterns descending the rock walls, carved-stone altar at center, vault-arches hewn into rock
- 10% FOREST-TOWER / ANCIENT-TREE-FORTRESS — colossal millennia-old cedar with house-clusters wound around its trunk, plank-walkways spiraling up, lantern-strings hanging
- 10% UNDERWATER / TIDE-SUBMERGED PAGODA — half-sunken shrine with tide lapping at its base, kelp-bearded columns, glow rising through tide-pool
- 5% OBSERVATORY / CLOCKWORK-SPIRE — towering bronze-and-stone observatory with massive clockwork dials, copper telescope barrel pointing skyward

DO write (each entry MUST: name structure + 2 material details + scale phrase):
- Towering Castle-in-the-Sky fortress floating above crystalline clouds, ancient stone masonry with brass gears and copper pipes, crystal spires piercing the empyrean
- A stacked tiered shrine-pagoda climbing into the clouds, lacquered scarlet beams and copper roof finials, paper banners cascading from each tier
- Cathedral-ruin overgrown with millennia of moss and ivy, broken arches silhouetted against amber sky, cyclopean stones the size of houses
- Subterranean lantern-temple with hundreds of paper chochin descending vault walls, carved-stone altar at center, vault-arches hewn from living rock
- Colossal cedar-tree fortress wrapped in wooden house-clusters, plank-walkways spiraling up the trunk, lantern-strings webbing between branches
- Half-sunken tide-pagoda with kelp-bearded columns rising from rippling water, golden interior glow leaking through wave-eroded windows
- Bronze observatory spire with massive clockwork dials and a copper telescope barrel pointing into the constellations

DO NOT write:
- Hero-character / portrait
- Tiny structure in distance (this MUST be the dominant mass)
- Modern western architecture (no Empire State, no glass skyscrapers)
- Generic "castle" — be specific about Ghibli-painterly type
- Cyberpunk megabuildings (neo-tokyo path)
- Western Tolkien fantasy (isekai-fantasy path)
- Photoreal architecture

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
