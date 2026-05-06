#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/cozybot/seeds/cozy_outdoor_lights.json',
  total: 60,
  batch: 20,
  metaPrompt: (n) => `You are writing ${n} OUTDOOR COZY LIGHTING descriptions for CozyBot's village paths — specific warm exterior light moments that establish the painted-storybook-illustration outdoor cozy register (cottagecore village, snowy hamlet, sunny harbor, jungle-canopy village, twilight lantern street, etc). 18-32 words each.

━━━ THE CORE FORMULA ━━━
Each entry names ONE OUTDOOR lighting moment and describes (a) the light source / time of day, (b) the warmth tone, (c) what surfaces / atmosphere it touches, (d) the cozy mood. Required vocabulary register: "warm lamplight glow", "golden hour haze", "soft window light spilling onto cobblestones", "diffused dreamy lighting", "soft volumetric light", "gentle bloom on highlights", "misty morning light", "twilight glow", "lantern-pop", "fairy-light haze".

━━━ OUTDOOR LIGHTING CATEGORIES (distribute across ${n}) ━━━
- Golden hour / sunset (warm amber raking across rooftops / golden hour haze on a cobblestone alley / sunset turning the sky peach-and-pink)
- Twilight / blue hour (deep cobalt sky with amber-window-glow contrast / first stars appearing as gas-lamps light)
- Lantern-lit / gas-lamp (single gas-lamp pooling yellow on wet cobblestones / paper-lantern garlands strung overhead, warm glow / lit lanterns at every doorway)
- String-lights / fairy-lights (warm string-lights crisscrossing a courtyard / Edison bulbs above outdoor café tables / holiday string-lights along snowy roofline)
- Misty morning / dawn (misty morning light filtering through trees / dawn fog still clinging to stone walls, warm window-glow inside / morning haze with single golden ray cutting through)
- Window-glow at dusk (multiple cottage windows blazing tungsten-amber against deepening sky / single warm doorway throwing light onto the path)
- Moonlight / starlight (full moon catching snow-roofs in pearl-blue / starlight reflecting in still water with warm village lights nearby)
- Aurora (soft aurora ribbons in cobalt sky over snowy village, gentle glow / pearl-violet aurora low on horizon)
- Storm/rain glow (gas-lamps reflecting in wet cobblestones / amber light spilling from doorways onto rain-glazed stones / soft glow through curtains of soft rain)
- Snowfall light (warm window-glow refracted through gently-falling snow / soft diffused snow-light on rooftops with warm interior contrast)
- Late autumn dusk (golden-hour autumn warmth fading to violet-dusk / amber light on flame-red maples / glowing windows visible through bare branches)
- Sunny mediterranean (strong warm-gold midday on white stucco / dappled sun through climbing roses / golden-hour rake across terracotta roofs)
- Underwater caustics (caustic-light dapples on coral village paths / sun-rays piercing clear water onto anemone-cottage roofs)

━━━ MANDATORY ELEMENTS PER ENTRY ━━━
1. ONE specific named outdoor lighting moment (golden hour / twilight / lantern-lit / mist / etc.)
2. Time-of-day OR weather context
3. Color/temperature (warm amber, honey-gold, pearl-violet, cobalt-and-amber-contrast, peach-and-pink)
4. Surface it touches (cobblestones, roof-tiles, snow, grass, water, leaf-litter)
5. Mood word ("dreamy", "diffused", "honey-pooled", "lantern-warm", "soft volumetric", "twilight-glowing", "misty", "gentle bloom")
6. Always-on subtle volumetric atmosphere (dust / mist / haze / soft fog / drifting snow / falling petals — sells painterly depth)

━━━ HARD BANS ━━━
- NO harsh midday sun (only soft / diffused / golden hour / dappled — never overhead noon)
- NO modern lighting (no street-LED, no neon, no headlights)
- NO sterile clinical contrast — always warm-glow and atmospheric
- NO indoor-specific items (lamps with shades / fireplaces — those go in indoor lights)

━━━ FEW-SHOT EXAMPLES ━━━
EX-1: "Golden hour haze raking across a cobblestone alley, warm amber light pooling between leaning timber-frame cottages, soft volumetric atmosphere with drifting dust, gentle bloom on shop signs, dreamy late-afternoon warmth"
EX-2: "Twilight blue-hour sky deepening to indigo, dozens of warm-tungsten cottage windows blazing amber against the cool sky, gas-lamps just lit pooling yellow on wet cobblestones, soft volumetric mist drifting low"
EX-3: "Misty morning light filtering through tall pines, warm cabin windows glowing through the fog, soft volumetric atmosphere with golden rays cutting through, dewdrops catching the gentle bloom, dreamy peaceful diffuse"
EX-4: "Snow falling softly under warm string-lights strung overhead, every snowflake catching the gentle bloom, glowing-window cottages forming a warm-amber row against deep cobalt sky, soft volumetric snowfall, lantern-warm"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
