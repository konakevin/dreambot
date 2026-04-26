#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/cozy_dino_actions.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} COZY DINOSAUR ACTION descriptions for DinoBot's dino-cozy path. Each entry describes a TENDER, PEACEFUL BEHAVIOR that any dinosaur species could be doing. The species will be picked separately — your job is the action/behavior only.

Each entry: 10-20 words. One specific cozy moment caught mid-action, with a lighting or weather detail that sells the coziness.

━━━ WHAT MAKES A GOOD ENTRY ━━━
- Describes a BEHAVIOR, not a species — "gently turning eggs in a moss-lined nest at golden hour" not "Maiasaura turning eggs"
- Includes atmospheric/lighting context — golden hour, misty dawn, warm rain, dappled shade, firefly glow, volcanic warmth
- Tender + warm + peaceful — NO predation, NO violence, NO fear, NO aggression
- Feels like a nature-documentary still frame, not an action scene

━━━ CATEGORIES TO COVER (spread across all) ━━━
- Nesting / egg-tending / brooding eggs under warm body
- Parent nuzzling calf / nursing / nudging hatchling to walk
- Baby dinosaurs tumbling and play-wrestling in clearing
- Pair grooming / preening feathers / gentle courtship displays
- Sleeping curled under ferns / dozing in sun-warmed clearing
- Drinking from misty dawn pond, ripples spreading
- Sheltering young from warm rain under giant-fern canopy
- Cliff-ledge roost at sunset, wings folded peacefully
- Feeding chicks torn fish on cliff nest at dawn
- Settling herd at dusk, breathing synchronized
- Basking on sun-warmed rock, eyes half-closed
- Preening iridescent feathers on branch in afternoon light
- Wading belly-deep in shallow stream, contented grunts
- Arranging soft moss carefully around speckled eggs
- Juvenile exploring puddles / first steps / discovering insects
- Family group migrating slowly through autumn ferns
- Pair standing together at misty dawn, necks intertwined
- Calf wobbling first steps beside protective parent
- Communal huddle near volcanic vent for warmth at night
- Courtship dance with crests bobbing rhythmically in sun-warmed clearing

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary behavior + time-of-day/lighting. Two entries with the same action in the same light = too similar. Vary both.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
