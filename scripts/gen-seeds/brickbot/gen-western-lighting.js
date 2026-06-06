#!/usr/bin/env node
/**
 * BRICKBOT_WESTERN_LIGHTING — western brick MOC lighting.
 * Audit 2026-06-05: 50 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_western_lighting.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} LIGHTING entries for BrickBot's western path — Wild-West frontier brick MOC photography (cowboys / saloons / mines / cavalry / canyon). Each entry: ONE sentence, 25-40 words, naming source + direction + color + how it touches the brick build.

━━━ THE BAR ━━━
Every entry names a SPECIFIC source (high-noon harsh / golden-dusk silhouette / saloon-oil-lamp / dust-storm haze / moonlit-graveyard / campfire / lightning-strike / etc.) PLUS direction PLUS color PLUS effect on brick (warm pools on tile-deck, hot lamp-glow on saloon-poker-table, dust-haze on mesa, etc.).

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 HIGH-NOON HARSH: top-light shadows, bleached tan-plate street, unforgiving sun
- ~5 GOLDEN-DUSK / SUNSET: warm amber raking main-street, long silhouettes, cinematic
- ~4 SALOON / INTERIOR LAMP: trans-orange oil-lamp pools on bar + card-tables, smoky
- ~4 MOONLIT / NIGHT: silver-blue moon, cool shadows, ghost-town stillness
- ~3 SUNRISE / DAWN: low pink-amber side-light, mist on prairie
- ~3 DUST-STORM HAZE: tan dust suspending overhead, low-contrast wash
- ~3 CAMPFIRE / TRAILSIDE: trans-orange flame-glow on a circle of cowboys, deep blue night
- ~3 LIGHTNING-FLASH: trans-yellow bolt momentarily lighting prairie/mesa
- ~3 STAGECOACH-LANTERN: warm bulb-glow rolling down a dark trail
- ~3 MINE-INTERIOR LAMP: dim trans-amber from miner's lamp, dark tunnel beyond
- ~2 RAILROAD / TRAIN-HEADLAMP: trans-yellow beam cutting through prairie night
- ~2 GHOST-TOWN ABANDONED: faint diffuse moonlight on empty street
- ~2 RAILYARD / SWITCHYARD: sodium-amber lamps, deep shadow
- ~2 BLUE-HOUR PRAIRIE: cool dim ambient, last warm sun on far mesa
- ~1 SOLAR-ECLIPSE shadow
- ~1 BLIZZARD / SNOW-STORM whiteout
- ~1 BONFIRE / RANCH-BBQ glow

━━━ FORMAT ━━━
Each entry: ONE sentence, 25-40 words. Touchpoints:
"High-noon harsh top-light, a strong overhead key throwing short hard shadows straight down off the false-fronts and figures, bleaching the tan-plate street, the unforgiving frontier glare"
"Golden-dusk low silhouette, warm amber raking the length of the brick main-street, the buildings and a lone rider thrown into long silhouette, dust-warm and cinematic"
"Saloon oil-lamp warm, pools of trans-orange lamp-glow on the brick bar and card-tables, the corners falling into smoky shadow, the cozy-but-tense interior light"

━━━ BANS ━━━
- NO photoreal vocab
- NO fluid-motion verbs
- NO photographer name-drops
- NO mood-only descriptors

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
