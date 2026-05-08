#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/assassin_hairstyles_female.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} VAMPIRE-ASSASSIN-FEMALE HAIRSTYLE descriptions for GothBot. Each entry is 12-22 words.

CONTEXT: HOT, agile, deadly female assassins. Hairstyles must be combat-practical AND ornate — out of the way for a fight, but with gothic styling presence. NOT casual loose hair, NOT princess-curls, NOT high-fashion runway updos.

Categories (rotate widely):
- Long braid down the back (single thick braid / French braid / fishtail braid)
- Side-braid pulled tight (over the shoulder / from temple to chest)
- High ponytail bound with silver clasp / leather thong / metal ring
- Half-up half-down with pinned-up crown
- Combat crop with undercut (one side shaved, other side longer)
- Asymmetric pixie or sharp angled cut
- Pinned-up bun with silver hair-pin / chopsticks / dagger-shaped pin
- Wild loose hair caught in mid-motion (only when context implies wind/fight aftermath)
- Bobbed cut with razor-sharp angles
- Bound coil pinned at the nape with silver-clip
- Tightly-pinned coif with twin braids meeting at the back

EVERY entry must include:
- Length descriptor + style + ONE practical/gothic detail (silver clasp, silver hair-pin, leather binding, dagger-shaped pin, choppy ends, mid-motion in wind)

Examples (write fresh):
- "Long single fishtail braid down the back bound with a silver-cross clasp, a few loose strands at the temples"
- "High razor-sharp ponytail bound with a black-leather thong, mid-motion pulled by night wind"
- "Asymmetric pixie cut with one side shaved short, the longer side falling sharply over the right eye"
- "Tight side-braid pulled from temple over the shoulder, secured with a silver dagger-shaped hair-pin at the end"

Output ONLY a valid JSON array of ${n} strings (12-22 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
