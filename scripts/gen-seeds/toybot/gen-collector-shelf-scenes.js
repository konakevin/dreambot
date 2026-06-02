#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/collector_shelf_scenes.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} ACTION FIGURE BATTLE scene descriptions for ToyBot's collector-shelf-epic path — 80s/90s action-figure cinematic dioramas with toy-scale drama. Joint-articulation visible + explosion effects.

Each entry: 15-30 words. One specific action-figure battle scene.

━━━ NON-NEGOTIABLE: ANTI-HUMAN-LEAK RULE ━━━
The figure is a PLASTIC TOY. Every entry MUST anchor that with toy-medium language inside the figure description, not just at the start. Use these words throughout: molded, painted, sculpted, cast, weathered, primed, ball-jointed, articulated, plastic, vinyl, pewter (for tabletop minis only — not here).

NEVER use these words about the figure: "skin", "flesh", "real eyes", "wet eyes", "tears", "sweat", "breathing", "warm", "alive". They cue Sonnet/Flux to render a HUMAN.

When you describe an archetype (priestess, warrior, ninja, knight, etc.) ALWAYS prefix or postfix with "action figure" or "molded plastic figure" or "1/12-scale figurine". Example:
  ❌ "Voodoo priestess summoning bone-spirit warriors..."
  ✅ "Voodoo priestess action figure summoning bone-spirit-warrior figurines..."
  ❌ "leopard-skin loincloth"
  ✅ "leopard-print sculpted loincloth detail"
  ❌ "blue skin-texture"
  ✅ "blue painted skin-tone with visible brushwork"

Always describe the FACE as "painted face" or "painted features" — NEVER as "his face" / "her face" alone.

━━━ CATEGORIES ━━━
- Robot battle mid-explosion (two mech action figures grappling)
- Barbarian siege (action-figure warrior at castle-wall miniature)
- Space-marine moonbase defense (1/12-scale plastic figure)
- Ninja rooftop battle at night (articulated action figure)
- Kaiju-city-destruction action-figure in mini-city
- GI-Joe-style military strike (action figure with painted weathering)
- He-Man-style fantasy battle (hyper-muscled hand-painted figure)
- Transformer mid-transformation (vintage plastic robot)
- Action-hero at explosion-wall
- Dinosaur-vs-commandos action-figure scene
- Pirate action-figure on action-ship miniature
- Cowboy action-figure at showdown
- Space commander on bridge diorama
- Martial-arts master mid-kick (painted-face action figure)
- Cyborg vs zombies (plastic figures)
- Motorcycle chase action figures
- Mountain-climber action figure stranded
- Deep-sea-diver action figure with shark figurine
- Firefighter action figure rescuing child action figure
- Boxer mid-knockout (vinyl-paint glove figure)
- Wrestler mid-slam (painted-detail figure)
- Gladiator mid-combat (sculpted-armor figure)
- Viking-raider on longship miniature
- Samurai mid-sword-draw (painted-katana figure)
- Medieval-knight vs dragon figurine
- Space-pilot in cockpit miniature
- Tank-commander mid-firing (painted-uniform figure)
- Sniper on rooftop (camouflaged-paint action figure)
- Parachute-trooper mid-drop (cloth-hybrid figure)
- Cold-war spy action figure
- Jungle-commando in bush diorama
- Treasure-hunter action figure with torch prop
- Street-fighter action figure in back-alley
- Cyberpunk bounty-hunter (LED-eyed action figure)
- Post-apocalyptic warrior (weathered-paint figure)
- Alien-trooper mid-battle (painted-skin-tone figurine)
- Demon-slayer action figure vs horned figurine
- Ghost-buster action figure with proton-pack accessory
- Space-marine vs alien-xenomorph plastic figures
- Dragon-rider action figure
- Wasteland-raider on dirt-bike toy
- Dinosaur-rider caveman action figure
- Jungle-archer action figure in tree miniature
- Monster-hunter action figure vs wolf figurine
- Wrestler-vs-luchador tag-team plastic figures

━━━ RULES ━━━
- 80s/90s action-figure aesthetic (articulation, plastic, painted)
- Mid-action cinematic moment
- Practical-set with dramatic lighting
- Explosion / smoke / debris effects encouraged
- DO NOT describe figures as people. They are PLASTIC TOYS being photographed in a diorama.
- Multiple figures encouraged — say "action figures" plural so Flux doesn't promote one to "real character".

━━━ FORMAT EXAMPLES ━━━
✅ "Two robot mech action figures grappling mid-explosion, sparks frozen in cotton-batting smoke, plastic articulation visible, primer-chip weathering on chest plates, miniature city collapsing behind."
✅ "Voodoo priestess action figure summoning bone-spirit-warrior figurines from cotton-mist swamp, painted-face fierce, sculpted skull-staff raised, shoulder ball-joints planted in ritual stance, miniature bayou shack collapsing in green ethereal practical lighting."
✅ "1/12-scale samurai action figure mid-sword-draw, painted-katana flashing, ball-joint hips planted, weathered armor with primer-chip detail, falling cherry-blossom paper bits in foreground."

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
