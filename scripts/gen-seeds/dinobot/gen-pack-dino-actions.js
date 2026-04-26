#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/pack_dino_actions.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} PACK/HERD GROUP BEHAVIOR descriptions for DinoBot's dino-pack path. Each entry describes a COLLECTIVE BEHAVIOR that a group of any dinosaur species could be doing. The species will be picked separately — your job is the group action/formation only.

Each entry: 10-20 words. One specific multi-animal behavior at wildlife-documentary scale, communicating numbers and formation.

━━━ WHAT MAKES A GOOD ENTRY ━━━
- Describes GROUP behavior, not individual — "herd crossing flooded river, calves flanked by adults, spray frozen mid-splash"
- Communicates SCALE — dozens, hundreds, formations, horizon-spanning
- Feels like a BBC Planet Earth aerial shot or ground-level wildlife still
- Species-generic — any dinosaur type could slot in

━━━ CATEGORIES TO COVER (spread across all) ━━━
- Herd with babies crossing dusty plain, immense shadows stretching at golden hour
- Group gathering at muddy waterhole, calves wading between protective adults
- Pack flanking panicked prey, coordinated from multiple angles, sickle-claws raised
- Stampede thundering through valley floor, hundreds creating dust columns visible for miles
- Flock wheeling above coastal sea-stacks, catching thermal updrafts
- Pod standing at lake edge, crested heads raised skyward, bellowing resonant calls
- Family marching single-file through fern meadow, juveniles following parents' footprints
- Herd stretching necks into towering conifers, stripping high branches methodically
- Group grazing through low-fern thicket, plated backs catching dappled sunlight
- Colony clinging to vertical cliff-ledges, hundreds of wingspans folding and unfolding
- Herd sprinting across dawn-lit plains, moving as fluid wave through morning mist
- Nesting colony sprawling across hillside, dozens of bowl-shaped nests ringed by parents
- Pack moving through undergrowth in eerie silence, crescent formation advancing
- Group converging on beached carcass, hissing and posturing competitively
- Nest-area bustling with activity, juveniles chasing insects between eggs
- Cluster surrounding communal nest-site, rotating egg-warming duties in coordinated shifts
- Flock erupting from canopy in iridescent explosion, snatching insects mid-flight
- Family drinking at riverbank bend, adults kneeling while juveniles wade belly-deep
- Herd wallowing in coastal mudflats, coating themselves in protective clay
- Pack emerging from fog-shrouded forest, spreading wide in tactical arc
- Dome-skull rams echoing across badlands, rivals staggering between impacts while herd watches
- Herd dominating open grassland, defensive perimeter around clustered young
- Pair patrolling stream edge, coordinating fishing strikes with head-gestures
- Family traversing snowy ridge, thick feathers ruffling in blizzard wind
- Pod surfacing together in synchronized breach, spray catching low sun
- Mixed-species gathering at drought waterhole, tense coexistence at shrinking resource

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: group activity type + terrain/setting. Two entries with the same collective behavior in a similar environment = too similar. Vary both.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
