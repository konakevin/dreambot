#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_men_candid_moments.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} CANDID-MOMENT descriptions for SteamBot's steampunk-man path. Each entry is ONE specific moment of a steampunk gentleman in his daily working life — caught natural, not posing.

The framing stays CLOSE (waist-up to thigh-up character-portrait), but THE SCENE TYPES MUST VARY WIDELY. Previous version was too clustered — guys at desks reading papers and fiddling with small objects. This version should show him EVERYWHERE doing EVERY KIND of steampunk activity, not just sit-and-read.

Each entry: 18-30 words. ONE specific candid moment in a varied setting.

━━━ MANDATORY VARIETY ENFORCEMENT — DISTRIBUTE ACROSS ALL ${n} ENTRIES ━━━
Cap each category at the listed amount — DO NOT cluster entries in one category.

LOCATIONS (mix broadly — cap any single location at 6 entries max):
- Outdoor / airship deck / rooftop / cliff observatory (8-10)
- Workshop / inventor's lab (max 6)
- Forge / smithy / foundry (4-6)
- Engine room / boiler chamber / locomotive cab (4-6)
- Drafting room / chartroom / library (max 4) ← INTENTIONALLY CAPPED LOW (was over-clustered before)
- Gentlemen's club / smoking lounge / parlor (3-5)
- Street / cobblestone alley / dock / harbor (3-5)
- Factory floor / machine works (3-5)
- Train station / platform / signal box (2-4)
- Cargo hold / hangar / workshop catwalk (2-4)
- Field / mine entrance / ruins / archaeological site (2-4)

ACTION TYPES (mix broadly — cap any single category at 5 entries max):
- ACTIVE PHYSICAL WORK (hauling, climbing, hammering, shoving, levering): 8-10
- WALKING / IN-MOTION (mid-stride somewhere, boarding, descending stairs, crossing a deck): 6-8
- INSPECTING / OBSERVING (walking around a contraption, peering through telescope, surveying horizon): 5-7
- INTERACTING WITH BIG MACHINERY (cranking a giant wheel, throttling a lever, operating a press): 5-7
- INTERACTING WITH SMALL OBJECT (pocket watch / loupe / pipe / cufflink): MAX 6 ← was over-clustered
- READING / WRITING (book / map / blueprint / letter): MAX 4 ← was over-clustered
- DRINKING / SMOKING (whiskey, tea, pipe, cigar): 4-6
- DRESSING / GROOMING (rolling sleeves, fastening coat, adjusting hat): 3-5
- TRAVELING / ARRIVING (stepping off train, boarding airship, arriving at club door): 3-5
- COMBAT-ADJACENT BUT NOT VIOLENT (loading rifle, sheathing saber, holstering weapon — not mid-shot): 3-5

━━━ HARD DEDUP RULES ━━━
- NO TWO ENTRIES with the same object (pocket watches max 2 entries, pipes max 3 entries, cufflinks max 1, monocles max 1, cravats max 1)
- NO TWO ENTRIES at the same location (drafting rooms max 2, smoking lounges max 2, etc.)
- NO TWO ENTRIES with the same verb (only one "tightening", only one "pouring", only one "wiping")
- Vary the LOCATION + OBJECT + VERB across entries

━━━ MOMENT EXAMPLES (DO NOT REUSE — these are inspiration only) ━━━
- "Hauling on a brass mooring chain dockside, brass gear-winch turning above him, sweat on his temples, harbor cranes silhouetted behind"
- "Mid-stride across a wet cobblestone street at dusk, gas-lamp glow on his greatcoat shoulders, top hat tipped against the rain"
- "Sighting through a brass telescope on a windswept cliff observatory, jacket pulled tight against gale, sea horizon below"
- "Cranking a brass valve-wheel in a steam-billowing engine room, both hands straining, pressure gauges climbing behind him"
- "Walking the length of a half-built brass dirigible at his airship hangar, hand absently trailing the hull, gantry-light overhead"
- "Lighting a cigar at the gentlemen's club bar, brass match catching, mahogany counter behind him, leather-bound backs of regulars off-frame"
- "Boarding a smoke-billowing locomotive, one boot on the iron step, leather satchel slung, station platform behind"
- "Descending a brass spiral staircase mid-stride, hand on the banister, factory catwalk below visible through gaps"
- "Climbing a wooden ladder up the side of a great clockwork contraption, tool-belt at his hip, brass gears towering above"
- "Loading brass shells into a steam-rifle one by one at a workbench, military-precise rhythm, gun-oil bottle at his elbow"
- "Pouring whiskey at the smoking-lounge sideboard, decanter tipped, crystal tumbler held steady, library walls behind"
- "Standing on the open airship gondola edge, telescope to eye, scarf whipping in the cloud-wind, harness clipped to a brass rail"
- "Sheathing a brass-handled saber at his hip, just-finished motion, gun-room weapon-rack visible behind"
- "Crouched at a mine entrance with a brass safety-lantern, examining a chunk of crystal ore in his palm, headlamp beam catching dust"
- "Operating a giant brass printing press, hand on the lever, paper feeding through, ink-blackened apron, factory floor receding"
- "Stepping off a brass-railed train carriage onto a fog-shrouded platform, leather bag at his side, top hat in hand, fellow travelers blurred behind"

━━━ TONE — CRITICAL ━━━
- HANDSOME / DASHING / RUGGED / INTENT / CAPABLE — never "sexy"
- VARIETY of body posture — sometimes facing camera, sometimes profile, sometimes back-quarter — but face always at least half-visible
- VARIETY of gaze — sometimes camera, sometimes work, sometimes off-frame
- Period-accurate Victorian-industrial steampunk
- Naturalistic working / living moments — not staged-for-camera, not action-hero, not sit-and-read every time

━━━ ABSOLUTELY BANNED ━━━
- NO twin-revolvers / hammer-mid-swing / arm-shielding-explosion (action-hero cliches)
- NO "looking smolderingly at the viewer" / "brooding model gaze"
- NO over-clustering on desks-and-papers (cap = 4 reading entries TOTAL out of ${n})
- NO over-clustering on pocket-watch / pipe / cufflink (cap = 2 each)
- NO modern actions / objects

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
