#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/assassin_hair_color.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (
    n
  ) => `Write ${n} VAMPIRE-ASSASSIN HAIR-COLOR descriptions for GothBot's vampire-assassin paths (gender-neutral). Each entry is 8-16 words.

CONTEXT: HOT, ornate vampire assassins. Hair color is a STATEMENT — gothic, dramatic, sometimes supernatural. NOT mundane brown/blonde — every color has presence.

Categories to rotate (vary widely):
- Raven-black / blue-black / midnight-blue-black
- Ash-blonde / platinum-silver / ice-white / moonlight-silver
- Oxblood-red / wine-red / blood-crimson (rare, used for assassin-style)
- Dark-velvet brown / cocoa-with-violet-undertone / sable
- Tarnished-gold / antique-gold / pale-honey
- Witch-fire-green-streaked-black (rare supernatural)
- Lavender-tinted-silver / violet-hued-black (subtle gothic dye)
- Smoky-grey / charcoal / gunmetal

EVERY entry: state the color + ONE descriptor (catching moonlight, with violet edge-glow, with silver streak, with single dyed strand, mid-flight in cold wind, etc.)

Examples (write fresh):
- "raven-black with a single violet-dyed strand catching moonlight"
- "platinum-silver with cool blue undertones, mid-flight in night wind"
- "oxblood-red with deep crimson undertones, rich pigment catching torchlight"
- "blue-black with witch-fire-green streaks at the temples, supernatural shimmer"

Output ONLY a valid JSON array of ${n} strings (8-16 words each). No preamble, no commentary.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
