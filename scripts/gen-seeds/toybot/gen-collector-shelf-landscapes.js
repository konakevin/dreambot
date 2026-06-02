#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/collector_shelf_landscapes.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} ACTION-FIGURE-PLAYSET LANDSCAPE scene descriptions for ToyBot's collector-shelf-epic path. Collector-grade 1/12-scale playsets (Hot-Toys / Mezco / NECA / Hasbro-Black-Series style) — handcrafted weathering, paint-detail, display-cabinet dramatic lighting.

Each entry: 15-25 words. ONE specific action-figure-playset landscape scene.

━━━ NON-NEGOTIABLE: ANTI-HUMAN-LEAK RULE ━━━
The figure (when present) is a PLASTIC TOY. Every figure-bearing entry MUST anchor that with toy-medium language. Use these words: molded, painted, sculpted, articulated, ball-jointed, plastic, vinyl, cast, weathered, primed.

NEVER use these words about the figure: "skin", "flesh", "real eyes", "wet eyes", "tears", "sweat", "breathing". They cue HUMAN.

When you describe an archetype (commando, ninja, knight, etc.) ALWAYS prefix or postfix with "action figure" or "1/12-scale plastic figure" or "articulated figurine". Example:
  ❌ "Crouched commando in wasteland..."
  ✅ "Crouched commando action figure in wasteland diorama..."
  ❌ "Reaching warrior with weathered skin..."
  ✅ "Reaching warrior figure with weathered painted skin-tone..."

When you describe the FACE: "painted face" / "painted features" / "sculpted face" — NEVER "his face" or "her face" alone.

━━━ THE MIX ━━━
- ~30% Type A — pure empty playset diorama, NO figures. Collector-diorama environment IS the subject.
- ~70% Type B — ONE off-center 1/12-scale articulated action-figure in a specific body-shaping pose within a playset environment. Lead with BODY POSITION.

━━━ TYPE B RULES ━━━
Lead with body-position in first 5-8 words (kneeling / crouched / seated / reclining / lying / leaning / mid-stride / reaching / climbing / leaping / bent / tilted / dangling). Landscape/diorama dominates frame. Figure ANCHORED as plastic toy with at least one of: "action figure", "1/12-scale", "ball-joint", "molded", "painted", "articulated", "weathered-plastic".

━━━ CONTEXT DNA ━━━
- Playset environments: post-apocalyptic wasteland / abandoned warehouse / ruined temple / spaceship interior / urban-warfare street / haunted mansion / alien surface / pirate-ship deck / dungeon / carnival / zombie-fortification / medieval forge / scrapyard / subway / desert convoy / observatory / sacred grove / jungle-ruin / crashed-UFO / arctic-station / Western saloon / biotech lab / space-cargo-bay / castle courtyard
- Figure DNA (always plastic-anchored): articulated 1/12-scale, ball-joints visible, hand-painted weathering, hard-plastic body, cloth-hybrid costume, accessories at scale, primer-chip detail

━━━ MUST-HAVE ━━━
- Reference ACTION-FIGURE / 1/12-scale / ball-joint / collector-diorama / handcrafted-miniature LANGUAGE
- Collector-grade weathering + paint detail language
- Type A = zero figures. Type B = exactly ONE figure, OFF-CENTER, body-shaping pose-first, plastic-anchored
- Aggressive dedup: max 4 per pose-family, max 2 per environment-type

━━━ BANNED ━━━
- NO centered-hero figure
- NO multi-figure entries
- NO passive verbs
- NO real IP set-names (Star Wars / Marvel / Transformers / GI Joe / He-Man / COBRA specific names)
- NO CGI / illustration / photorealism
- NO HUMAN-anatomy language about figures (no "skin", no "flesh", no "tears", no "breath", no "alive")

━━━ FORMAT EXAMPLES ━━━
✅ "Crouched commando action figure off-center in post-apocalyptic wasteland diorama, hand-painted weathering, ball-joint elbows visible, ruined-tank miniature in background, dramatic dust-haze lighting."
✅ "Empty crashed-UFO playset, broken hull plates, miniature electrical-arc effect, sodium-orange emergency lighting, no figures, collector-grade detail."
✅ "Reaching mid-stride samurai 1/12-scale action figure, ball-jointed shoulders, weathered painted armor, sacred grove diorama with miniature stone lantern, dappled blue-hour light."

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
