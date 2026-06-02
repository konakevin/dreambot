#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mecha_hangars_hangar_setting.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} HANGAR-SETTING entries for a MangaBot mecha-hangar keyframe. THIS POOL IS THE ANTI-MT-FUJI LAW. Every entry describes an INTERIOR CONTAINER space (hangar bay / silo / dry-dock / cage / launch-deck) that FRAMES the mech without competing for hero status.

⚠️ HARD BAN — REJECT INSTANTLY IF: open landscape / Mt-Fuji backdrop / mountain-vista postcard / iconic-landscape / mech-as-distant-silhouette / wide-open-field / wilderness / pure-sky / pure-ocean / mech-tiny-against-scenery. Flux's gravity is to render an iconic landscape and forget the mech. This pool's only job is to PUT the mech in a container that PROVES it's gigantic without stealing the frame.

Each entry: 14-22 words. ONE specific interior-container space. Each entry must end with an explicit container-noun (cage / bay / deck / dry-dock / silo / hangar / shaft / pit / scaffold-tower).

CONTAINER VARIETY (every entry frames the mech, container is BACKGROUND mass not subject):
- SUBTERRANEAN EVA-CAGE (red-orange catwalks crisscrossing at three levels, overhead arc-lights, restraint-bars)
- PATLABOR-PRECINCT CONCRETE MAINTENANCE BAY (steel doors closed, fluorescent overhead, oil-stained floor)
- AIRCRAFT-CARRIER FLIGHT DECK MID-STORM (catapult-rail extending forward, deck-crew in jumpsuits, sea-spray)
- ORBITAL DRY-DOCK (stars through open bay-doors, hexagonal scaffold cage around the mech, vacuum)
- INDUSTRIAL SCRAP-YARD AT DAWN (rusted girders + fallen panels providing BG mass, smoke from forges)
- UNDERGROUND SILO with retracting blast-doors (circular doors above, vapor venting from base, klaxons)
- SUBMERGED SEA-BASE (bubbles + blue-green glow through bay-port, hull-rivets visible)
- ROOFTOP LANDING-PAD MID-RAIN (city-glow at distance but contained by railing + girder framing)
- TOKYO-SHELTER OPEN HANGAR-MOUTH (Patlabor garage doors rolled up, neon-lit street outside as edge-glow)
- ASTEROID-MINING REFIT BAY (rock walls reinforced with steel ribs, mining-cradle for the mech)
- ORBITAL CARRIER LAUNCH-BAY (parallel mech-stations all empty except this one, hangar lit blue)
- NERV-CAGE LAUNCH-SHAFT (vertical shaft with restraint-bars, target-marker above, mech upside-down ready for launch)
- DESERT-OUTPOST CAMOUFLAGE-HANGAR (tarp-and-girder shelter half-open, sand drift at the threshold)
- ARCTIC-BASE ICE-HANGAR (frost on the walls, blue cold light, mech steaming in the cold)
- SCAFFOLD-TOWER OPEN-AIR REFIT (multi-tier construction-scaffold ringing the mech, exposed sky overhead — but mech still fills frame)
- TUNNEL-SHAFT mid-deployment (concrete walls receding behind mech, klaxons strobing red)
- DARK SUBTERRANEAN MAINTENANCE PIT (mech lowered into a recessed-floor pit, scaffolds at lip)
- AIRBASE-RUNWAY HANGAR-DOORS RETRACTING (mech mid-rollout, runway visible beyond, sunset)
- CORPORATE-ROOFTOP OPEN MAINTENANCE PAD (chrome-and-glass towers around, mech being serviced at altitude)
- WAREHOUSE-DISTRICT SECRET HANGAR (corrugated steel walls, sodium lights, rebel-cell hideout vibe)
- SHRINE-MEETS-HANGAR (Knightmare bay with shoji-screen partitions, tatami-mat walkways, Japanese-fusion)
- ARENA-PIT for mech-on-mech test (raised stadium-tiers around, the test-pit floor where this mech stands)
- COMPACT URBAN ALLEY-HANGAR (Patlabor-style narrow-bay opening onto a Showa Tokyo street)
- BLAST-DOOR LAUNCH-RING (circular blast-doors halfway-open above, mech rising up the lift)
- HEAVY-INDUSTRIAL FORGE-ADJACENT BAY (forge-glow leaking from next room, ironwork visible)

DO write:
- A subterranean Eva-cage with red-orange catwalks crisscrossing at three levels, overhead arc-lights flickering, restraint-bars visible
- A Patlabor-precinct concrete maintenance bay with steel doors closed, fluorescent overhead, oil-stained floor under the mech
- An aircraft-carrier flight-deck mid-storm with catapult-rail extending forward, sea-spray crossing the deck
- An orbital dry-dock with stars visible through open bay-doors, hexagonal scaffold cage around the mech
- An underground silo with circular blast-doors retracting overhead, vapor venting from the base, klaxons strobing
- A submerged sea-base with bubbles and blue-green glow leaking through the bay-port, hull-rivets gleaming
- A rooftop landing-pad mid-rain with distant city-glow contained by the railing and girder frame

DO NOT write:
- ANY open landscape / Mt-Fuji backdrop / mountain-vista / mech-tiny-against-scenery
- ANY pure-sky / pure-ocean / wilderness / open-field
- Combat-field destruction (this is HANGAR not battlefield)
- Pilots / crew / vehicles (lives in scale_provers)
- Mech description (lives in mech_class / mech_detail)
- Camera angle (lives in camera_framing)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
