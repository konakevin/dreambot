#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/tilt_shift_lighting.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} TILT-SHIFT LIGHTING descriptions for TinyBot — miniature-feel lighting treatments.

Each entry: 10-20 words. One specific tilt-shift/miniature lighting treatment.

━━━ CATEGORIES ━━━
- Warm golden-hour miniature (amber raking across small scene)
- Glow-from-within (tiny lamps making small spaces glow warm)
- Window-light miniature (soft window-light on tiny interior)
- Diorama-studio light (even studio-light with highlight + shadow)
- Morning-dew light (soft dawn light on micro-nature)
- Lamp-inside-dollhouse (warm amber from within tiny structure)
- Macro-lens shallow-DOF (narrow focal range, blurred edges)
- Tilt-shift gradient (blur-at-edges focus-at-center)
- Fairy-light twinkle (string-lights lit miniature)
- Candle-glow-intimate (tiny candles)
- Spot-light-on-tiny (museum-exhibit-style spot)
- Overhead-soft (diffuse light from above)
- Window-seat-late-afternoon
- Rain-on-glass-window miniature
- Sunset-through-terrarium-glass
- Backlit-from-tiny-window
- Pendant-lamp-warm-pool
- Skylight-shaft miniature
- Fireplace-glow-warm miniature
- Lantern-string warm cluster
- Christmas-lights twinkle miniature
- Nightlight-soft (bedroom-cozy)
- Dawn-light-filtering
- Blue-hour tiny-sparkle (pinpoint lights)
- Dappled-through-tiny-leaves
- Warm-fluorescent-cafe miniature
- Garden-sunlight miniature
- Moonlight-silver miniature
- Lava-lamp-glow inside
- Reading-lamp-pool warm

━━━ RULES ━━━
- Tilt-shift / macro-lens / miniature-feel flavored
- Warm cozy preferred
- Named specific treatments

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
