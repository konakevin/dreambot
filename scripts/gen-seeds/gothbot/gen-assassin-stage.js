#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/assassin_stage.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (
    n
  ) => `Write ${n} VAMPIRE-ASSASSIN STAGE descriptions for GothBot's vampire-assassin paths. Each entry is 25-40 words. The "stage" is the gothic biome / hunting-ground where the assassin is OUT IN THE WILD doing assassin business.

CONTEXT: Castlevania + Devil May Cry + Van Helsing energy. Vampire-hunting environments — the stages where blade meets night. The biome surrounds the assassin (foreground / midground), the epic backdrop towers behind it. Every stage MUST READ as "vampires are here, and so is a hunter."

Rotate categories widely:
- Cobblestone village square at midnight, fog-choked, gas-lanterns smudged halos, gothic-Eastern-European architecture
- Crooked-tombstone graveyard with hanging willow trees, low fog rolling between graves, wrought-iron fence
- Plague-ravaged street between gothic tenements, hanging plague-cross banners, oil lamps dim
- Cathedral courtyard with cracked stone angels, dead nightshade-vines climbing, brazier-fire flickering
- Gothic forest path with bare twisted black branches, crows on every limb, distant howling
- Vampire-estate iron gates ajar at moonrise, gravel drive through skeletal trees
- Cursed-crossroads with hanging gibbet, signpost split by lightning, fog at hip-height
- Cobblestone alley between gothic tenements, gargoyles on the corners, single oil lamp burning
- Plague-village square with hanging plague-doctor effigy, abandoned cart, no soul moving
- Fog-choked Transylvanian village square, candles in every window, no person in sight
- Stone bridge over a fog-filled gorge, broken-stone railings, distant abbey bell tolling
- Cathedral graveyard with crooked stone crosses, willows weeping over family-crypt entrances
- Coastal cliff-top cemetery with crooked stones, sea-fog rolling over the edge
- Cursed-village rooftops shingled in slate, gargoyles on every corner, blood-moon above
- Abandoned cathedral cloister with broken-glass windows, ivy and thorns climbing the columns
- Misty moorland with a lone wolf-howl on the wind, gnarled trees, knee-high fog
- Gothic-fortress drawbridge across a moat of black water, iron portcullis half-raised
- Vampire-mausoleum entrance with stone-angel guardians, wrought-iron gate creaking
- Cursed swamp with twisted dead trees, hanging Spanish-moss, will-o-wisps drifting
- Stone-arched plague-village gateway with hanging hex-symbols, cobblestone slick with rain
- Gothic-village water-fountain plaza, cracked statue at center, fog at knee-height
- Abandoned monastery courtyard with crumbling well, ravens on the cloister walls
- Cathedral-roof rooftop landscape with gothic spires reaching into storm-violet sky

EVERY entry must include:
- Specific gothic environment type (village, cemetery, cathedral exterior, forest, courtyard, alley, bridge, rooftop, etc.)
- Atmosphere descriptor (fog, mist, rain, moonlight, blood-moon, candlelight)
- 1-2 anchor details (gargoyles, crucifixes, plague-banners, willows, gibbets, gravestones, brazier-fire, oil lamps)
- Empty / abandoned tone — no civilians moving in the scene (the assassin is the only person)

ABSOLUTELY BANNED: interior/cathedral-nave shots, ANY modern element (electric, plastic, satellite), any sci-fi, any cute fantasy, any non-gothic-Europe.

Examples (write fresh):
- "Fog-choked Transylvanian cobblestone village square at midnight, gas-lanterns smudged halos in the dense mist, gothic-Eastern-European tenements rising on all sides, no soul moving, candles burning in scattered windows"
- "Cathedral graveyard with crooked stone crosses leaning at impossible angles, weeping willow trees draped over family-crypt entrances, knee-high fog rolling between rows, distant abbey bell tolling once"
- "Cursed crossroads with a hanging gibbet creaking in the wind, lightning-split signpost pointing four ways into darkness, hip-deep fog rolling across the cobblestones, ravens on the gibbet beam"

Output ONLY a valid JSON array of ${n} strings (25-40 words each). No preamble, no commentary.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
