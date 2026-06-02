#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/assassin_eyes.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (
    n
  ) => `Write ${n} VAMPIRE-ASSASSIN EYE descriptions for GothBot's vampire-assassin paths (gender-neutral). Each entry is 12-20 words.

CONTEXT: HOT, ornate, agile, mean, predator-eyed vampire assassins. Castlevania + Devil May Cry + Van Helsing aesthetic. Eyes communicate the predator inside — sharp, focused, dangerous, and beautiful.

EVERY entry must include:
- Eye color (sharp ice-blue / piercing emerald-green / molten amber / hazel / steel-grey / piercing violet / blood-crimson / ember-orange / void-black / silver / fel-green / opal-pale)
- Eye-shape / energy (almond-shaped, hooded, sharp, deep-set, smoky-rimmed, narrowed-mid-action, calculating, predatory)
- ONE detail of edge: heavy smokey-eye / kohl-rimmed / dark eyeliner sharpened / lashes catching moonlight / a single tear-mark scar / glowing rim from holy-magic / faint silver-circuit-tattoo at corner

ABSOLUTELY NEVER: dull / sleepy / tired / soft / sweet / doe-eyed / friendly. These are KILLERS.

Examples (write fresh):
- "piercing ice-blue eyes narrowed mid-stalk, kohl-rimmed and sharp, lashes wet from cold fog"
- "molten amber predator-gaze, hooded almond-shape, heavy smokey-eye smudged for a long night's hunt"
- "blood-crimson irises ringed with black eyeliner, calculating predator focus, lashes catching candle-amber"
- "steel-grey almond eyes with a single thin tear-mark scar below the right, sharp and impassive"

Output ONLY a valid JSON array of ${n} strings (12-20 words each). No preamble, no commentary.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
