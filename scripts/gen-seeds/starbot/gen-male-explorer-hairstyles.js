#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/male_explorer_hairstyles.json',
  total: 50,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} HAIRSTYLE entries for StarBot's male-explorer path. Each entry is a SHORT phrase (10-22 words) describing the EXACT hairstyle for a sci-fi space-explorer man — practical for EVA, often shaved or augmented, sometimes long for ceremony.

━━━ STYLE SPREAD (enforce variety across ${n}) ━━━
- SHAVED / CYBER-AUGMENTED (5-6) — fully shaved skull showing a chrome neural-port glowing at the base, sides shaved with a glowing ridge of cybernetic implants, undercut showing chrome plates behind one ear, completely shaved with a single bio-monitor light at the temple, mohawk over a shaved-and-augmented scalp, shaved with a single chrome jack at the crown
- SHORT / EVA-PRACTICAL (5-6) — practical short pilot-cut, jaw-length campaign-cut singed at the ends from plasma, choppy field-cut, close-cropped infantry-style with a single forelock, military buzz-cut, salt-and-pepper pilot-trim
- LONG / TIED-BACK (4-5) — long explorer-hair pulled back in a low chrome-ringed tail, half-up topknot with the rest falling to the shoulders, full Highland-mane drawn back with a single chrome-ring at the nape, long Berserker-locks tied with a strip of synth-leather, samurai-style topknot
- BEARDED / MASCULINE-SIGNATURE (4-5) — full beard matching long warrior-hair, neat goatee with a tattoo on the jaw, stubble-shadow with cropped hair, beard with a small chrome implant at the chin, salt-and-pepper beard tied with a tiny ring
- WILD / WIND-CAUGHT (3-4) — long hair caught wild in alien-atmosphere wind, loose mane blown back from a cliff-edge stand on a strange planet, undone tangles from a long expedition

━━━ RULES ━━━
- Each entry is a VIVID hairstyle with a SCI-FI-WORLD detail (chrome-ring, neural-port, plasma-burn, bio-monitor, synth-leather binding, etc.)
- Style-diverse — do NOT cluster on shaved-augmented. Hit every tier
- Beards welcome — describe alongside hair when natural
- Specific to MALE explorers
- No modern hair (no man-buns alone, no fade-cut)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
