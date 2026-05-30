#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/shonen_action_ethnicity.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ETHNICITY-NOUN entries for a MangaBot shonen-action MAN keyframe. Ethnicity-NOUN lead unlocks diverse rendering.

Each entry: 6-12 words. Format: "[ethnicity] shonen hero man, [one-line feature anchor with register cue]"

VARIETY: 24% East Asian (Japanese/Korean/Chinese/Taiwanese) / 16% Southeast Asian / 12% South Asian / 12% Mixed-heritage / 10% Latin / 10% Black / 9% Middle Eastern / 7% European.

REGISTER MIX (mandatory) — combine bishounen + rugged + weathered + lined + scarred. NOT all pretty-boy.

DO write:
- Japanese shonen hero man, sharp scar across left brow and dark intense eyes
- Filipino shonen hero man, broad-shouldered with sunkissed brown skin and stubbled jaw
- Nigerian shonen hero man, dark umber skin with afro pulled back and lightning-arc tattoo on temple
- Persian shonen hero man, dark sweat-damp hair and intense kohl-rimmed eyes mid-glare

DO NOT: just "shonen hero man" / dated terms / fictional fantasy races / multiple ethnicities / pretty-boy-only register.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
