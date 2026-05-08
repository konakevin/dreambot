#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/assassin_hairstyles_male.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} VAMPIRE-ASSASSIN-MALE HAIRSTYLE descriptions for GothBot. Each entry is 12-22 words.

CONTEXT: HOT, agile, deadly male assassins. Hairstyles must be combat-practical AND ornate gothic — out of the way for a fight, but with styling presence. NOT casual short-back-and-sides, NOT modern fade, NOT clean-shaven-corporate, NOT scruffy-grizzled-veteran.

Categories (rotate widely):
- Long hair tied back in a loose ponytail or low-bun (Van-Helsing / Witcher style)
- Shoulder-length hair pushed back from the face, mid-motion in wind
- Half-up half-down with the front pulled back, a tail loose at the back
- Short-cropped sides with a longer top swept back or to one side
- Slicked-back medium hair with a single loose strand falling forward
- Tightly-bound braid down the back (samurai-rōnin style)
- Wild medium hair with rough textured wave, mid-motion in wind
- Buzzed sides with a longer mohawk-style top combed sideways
- Long loose hair down to the shoulders, pushed half over one ear
- Mid-length tousled with deliberate styling (Dante-DMC style)
- Closely-shaved head with a small thin braid at the temple

Optional facial hair (vary widely):
- Clean-shaven (most often)
- Light stubble across jaw
- Short trimmed beard
- Sharp goatee
- Thin mustache (Belmont-style)

EVERY entry must include:
- Hair length + cut + ONE styling detail (slicked-back, tousled, mid-motion, swept-aside, low-tied, etc.)
- Optional facial-hair if it fits

Examples (write fresh):
- "Long midnight-black hair tied back in a loose low ponytail with a black-leather thong, light stubble along the jaw"
- "Shoulder-length hair slicked back and to the side, a single loose strand falling across the brow, clean-shaven"
- "Closely-shaved sides with a longer top swept back, a thin trimmed beard outlining the jaw"
- "Mid-length tousled hair with deliberate texture, mid-motion in cold wind, light stubble"

Output ONLY a valid JSON array of ${n} strings (12-22 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
