#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/magical_girl_setting.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} MAGICAL-GIRL SETTING entries — magical realms OR earthly-with-magic stages. Character is IN the setting engaged with magic.

⚠️ ANTI-BACK-TO-CAMERA — settings where she "looks out over magical vista" / "approaches cosmic gate" produce back-to-camera renders. Settings where she's INSIDE a magical-engagement context afford forward-facing.

Each entry: 14-22 words. Setting + tactile foreground + midground depth + engagement-context.

VARIETY:
- 20% MAGICAL-REALM (cloud-realm with rainbow-stairs / cosmic-void with floating-platforms / pastel-pink heart-realm / dreamscape with crystal-towers / star-sea with constellation-bridge)
- 16% EARTHLY-WITH-MAGIC ROOFTOP (school rooftop with sailor-moon-magical light / Tokyo-rooftop at magic-hour with spell-glow / temple-rooftop with magical sparkle drift)
- 12% MAGICAL-ACADEMY (spell-classroom with floating books / academy courtyard with rune-fountains / magical-library with floating-grimoires / wand-training hall with practice-dummies)
- 10% TRANSFORMATION-CIRCLE (glowing rune-circle on ground / spell-array with glyphs spinning / magical-glyph-platform with light-pillar / transformation-arena with mirror-floor)
- 10% ENCHANTED-FOREST (forest-grove with floating-orbs / mushroom-ring meadow / sapling-clearing with light-pillars / enchanted-stream with magical lilies)
- 8% MAGICAL-CITY-NIGHT (neon-magical-Tokyo intersection with sparkle-trails / magical-festival lantern-street / heart-cafe in pastel-neon district)
- 6% MAGICAL-CASTLE (crystal-spire interior with chandeliers / throne-room with magical-mirror / tower-spell-chamber with potion shelves)
- 6% IDOL-STAGE (concert-stage with stage-lights / spotlight-platform with sparkle-curtain / fan-arena with glow-stick sea)
- 6% MAGICAL-SHRINE (shrine-altar with magical-paper-talismans / sacred-grove with kitsune-fire / shrine-courtyard with festival-magic)
- 6% COSMIC-SPACE (lunar-surface platform with Earth backdrop / asteroid-belt walkway / nebula-cloud bridge / planet-aligned arena)

DO write:
- Cloud-realm with rainbow-stairs in close foreground, pastel-pink clouds receding, distant crystal-tower — she stands ON the stairs mid-cast forward
- School rooftop at golden-hour with magical-glow, fence-post in close foreground, city beyond — she stands ON rooftop mid-transformation facing camera
- Glowing rune-circle ground with cyan glyphs spinning close, candle-flames at edge of circle, dark-arena beyond — she stands INSIDE circle mid-incantation
- Enchanted forest-clearing with floating-orbs close, mushroom-ring underfoot, light-pillars in midground — she stands AMONG orbs mid-spell
- Idol-stage spotlight platform with sparkle-curtain backdrop, mic-stand in close foreground — she stands AT stage edge mid-song-spell

DO NOT write:
- "Standing at edge of cosmic-vista looking out" — back-to-camera trap
- "Walking toward magical-castle in distance" — back-to-camera trap
- "Gazing at floating realm beyond" — back-to-camera trap
- Photoreal cinematography terms

Every setting affords her ENGAGED-WITH-magic IN-FRAME.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
