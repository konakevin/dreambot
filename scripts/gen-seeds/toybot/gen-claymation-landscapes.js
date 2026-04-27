#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/claymation_landscapes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} CLAYMATION-LANDSCAPE scene descriptions for ToyBot's claymation path — landscape-dominant composition with either (A) NO clay-puppet at all, or (B) ONE off-center clay-puppet in a specific body-shaping pose, with a claymation-world landscape as the compositional frame. Everything sculpted Plasticine with thumbprints and sculpting-tool marks. Aardman / Laika / Coraline aesthetic.

Each entry: 15-25 words. ONE specific claymation-landscape scene.

━━━ THE MIX ━━━
- ~30% of entries: Type A — pure clay-world landscape, NO clay-character. Thumbprinted environment IS the subject.
- ~70% of entries: Type B — ONE off-center clay-puppet executing a specific body-shaping pose/action within a clay-landscape. Lead with BODY POSITION, not activity. Landscape fills the frame.

━━━ TYPE B POSE CANON (rotate, never cluster) ━━━
KNEELING / CROUCHED / SEATED / RECLINING / LYING / LEANING / MID-STRIDE / REACHING / CLIMBING / LEAPING / BENT / TILTED / DANGLING — lead with the body-position in the first 5-8 words.

━━━ TYPE B EXAMPLES ━━━
- "Kneeling clay-puppet planting seedlings in a thumbprinted-green cottage-garden, clay-cottage behind, afternoon clay-light"
- "Crouched clay-figure peering into a koi-pond beside a clay-zen-garden, cherry-clay-blossoms falling all around"
- "Seated clay-puppet dangling feet off a thumbprinted-cliff above a crashing-wave claymation-ocean, wind-scarf fluttering"
- "Mid-stride clay-farmer running across a rolling thumbprint-green pasture, flock of clay-sheep blurred past, stone-cottage distant"
- "Climbing clay-puppet halfway up a sculpted-foam mountain face, mist-clay hiding peak, rope-clay trailing"
- "Reaching clay-figure stretched toward a glowing-clay mushroom in a misty-clay forest undergrowth, thumbprinted-roots everywhere"
- "Leaping clay-puppet mid-jump across a thumbprinted stream, stone-stepping-stones scattered, waterfall-clay distant"
- "Lying clay-figure on back in a purple-clay-heather moor, gazing at clay-cloud shapes drifting overhead"
- "Leaning clay-puppet against a weather-sculpted standing-stone on a misty-clay hilltop, crow-clay silhouette distant"
- "Bent double clay-figure examining a broken clay-artifact on a thumbprinted-jungle temple step, vine-clay overgrowth"
- "Dangling clay-puppet from a thumbprinted-tree branch over a stream, reaching for fallen clay-hat below"
- "Tilted head-back clay-puppet at edge of a thumbprinted-meadow watching aurora-clay streaks across sky"

━━━ TYPE A EXAMPLES ━━━
- "Claymation rolling green-thumbprinted hills with a hand-sculpted cottage in the distance, chimney-smoke-clay curling, no figures"
- "Claymation fjord — tall green-clay cliffs from still grey-clay water, misty clay-cloud layer, no figures"
- "Claymation autumn forest diorama — yellow-and-orange clay-leaves on sculpted-branches, thumbprinted-ground carpet, uninhabited"
- "Claymation volcanic island — red-and-orange lava-clay down grey-clay slopes, ash-cloud sculpted, no creatures"

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- Reference CLAY / Plasticine / thumbprint / sculpting-tool-mark / stop-motion-set LANGUAGE explicitly
- Aardman / Laika / Coraline aesthetic
- Type A = zero clay-characters. Type B = exactly ONE clay-puppet, OFF-CENTER, body-shaping pose first
- LANDSCAPE dominates the frame
- Dedup: across 50 entries, max 4 per pose-family, max 2 per landscape-type

━━━ BANNED ━━━
- NO centered-hero clay-puppet composition
- NO two+ clay-puppets per entry
- NO passive verbs (standing / posing / looking)
- NO real-IP names (Wallace / Gromit / Coraline)
- NO CGI / illustration / digital-render language

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
