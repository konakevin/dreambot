#!/usr/bin/env node
/**
 * Generate OceanBot axis pools using Sonnet.
 *
 * Mirrors the gen-bloombot-pool.js / gen-mechbot-pool.js infrastructure:
 * signature-based dedup, --target iterative gen+dedup loop, append-mode
 * preservation of existing entries.
 *
 * 2026-06-02 — Phase 1 PILOT scope: the shipwreck-kingdom path (10 path-
 * bespoke pools + 1 conditional drama) + the 3 universal pools shared
 * across all OceanBot paths. Other 9 paths' recipes land after the
 * pilot's render quality is approved.
 *
 * Usage:
 *   node scripts/gen-oceanbot-pool.js --pool lighting --target 25
 *   node scripts/gen-oceanbot-pool.js --pool shipwreck_kingdom_wreck_class --target 25
 *
 * Output: scripts/bots/oceanbot/seeds/<pool>.json
 */

const fs = require('fs');
const path = require('path');
const { SONNET } = require('./lib/models');

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const env = readEnvFile();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY;
if (!ANTHROPIC) {
  console.error('ANTHROPIC_API_KEY missing');
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : fb;
};
const has = (n) => args.includes('--' + n);
const POOL = flag('pool', null);
const COUNT = parseInt(flag('count', '25'), 10);
const TARGET = flag('target', null) ? parseInt(flag('target', '0'), 10) : null;
const MAX_ITERATIONS = parseInt(flag('max-iter', '15'), 10);
const DRY = has('dry-run');

if (!POOL) {
  console.error('Usage: --pool <name> --count <N> [--target N] [--dry-run]');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────────
// OceanBot shared design rules — referenced by every recipe below.
// ─────────────────────────────────────────────────────────────────────────
//
// Identity: old naval lore × scenic ocean nature. NatGeo deep-water
// cinematography crossed with age-of-sail maritime tradition.
//
// CROSS-RECIPE BANS (applied via meta-prompt DO-NOT sections — entries
// never write the banned words even to negate them, per
// [[feedback_negative_prompt_leak]]):
//   • Modern vessels — no steamships, submarines (deep-research subs OK
//     as foreground witnesses), motorized boats, propellers, modern hulls.
//     For naval-lore paths the ship is pre-1850 wooden + sail + rope only.
//   • Mermaids / sirens / merfolk — Flux fails on these per legacy
//     OceanBot's removal of mermaid-legend (commit f7f319cf).
//   • Multi-region enumeration — never list multiple regions/biomes in one
//     entry. Pick ONE. Per [[feedback_regional_path_buildout_lessons]],
//     CLIP attends only to the first-named noun.
//   • Negation language — phrase positively. Per [[feedback_negative_prompt_leak]],
//     "no fog" leaks the word "fog" into the renderer.

// ─────────────────────────────────────────────────────────────────────────
// POOL RECIPES — 14 pools (11 shipwreck-kingdom path-bespoke + 3 universal)
// ─────────────────────────────────────────────────────────────────────────

const POOL_RECIPES = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SHIPWRECK-KINGDOM path-bespoke pools (11)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  shipwreck_kingdom_wreck_class: {
    format: 'simple',
    theme: `WRECK CLASS for OceanBot's shipwreck-kingdom path — pre-1850 wooden sailing vessels resting on the seafloor, reclaimed by reef life. Each entry is ONE specific named ship type with era + cultural origin + the period detail that makes it recognizable underwater. 16-24 words per entry.

⚠️ MANDATORY — every wreck is a pre-1850 WOODEN vessel: timber hull, hemp rigging, canvas sails, brass and iron fittings. Age of sail. The ship sank decades to centuries ago and is now permanent seafloor architecture.

✓ VARIETY MANDATE — distribute across origin/era categories (~3 entries each):
  A. Spanish age-of-exploration (galleons, treasure ships, manilas)
  B. Dutch / English merchant + naval (East Indiaman, frigate, man-of-war, brig, schooner)
  C. Pirate / privateer vessels (sloop, brigantine, fluyt, hijacked schooner)
  D. Ancient Mediterranean (Roman trireme, Greek pentekonter, Phoenician bireme)
  E. Nordic / Viking longships + knarrs
  F. Asian working vessels (Chinese junk, Japanese atakebune, dhow)
  G. Polynesian war canoes + double-hull voyaging canoes
  H. Tudor + Elizabethan warships (carrack, race-built galleon)

Each entry names the vessel + ONE period-locking detail (gilded stern carving / cannon-port row / square-rigged masts now broken / dragon-prow eroded / etc.) and a one-phrase fate-or-state cue (split-keel resting on sand / heeled-over on a reef shelf / upright as if still under sail / etc.). NO speculation about decay state — that's a separate axis.

DO write positively. NO words like "no propellers / no steamships" — describe the wood, rope, canvas, brass.`,
    touchpoints: [
      'Spanish treasure galleon, gilded stern-castle carving still legible, heeled forty degrees on a coral shelf, cannon row half-buried in sand',
      'Dutch East Indiaman, three-masted with the foremast snapped, cargo hold split open exposing porcelain shards in the silt',
      'Caribbean pirate brigantine, low-slung hull on a sandbed, name-plate eroded smooth, ship\'s wheel still upright at the stern',
      'Roman trireme, oak ram-prow buried in clay, three banks of oar-ports hosting eel families, lead anchor stocks fused with sediment',
      'Viking longship, narrow oak hull preserved by cold water, dragon-prow eroded to a soft profile, shield-rim impressions along the gunwale',
      'Chinese junk, batten-pleated sail timbers fanning across the seafloor, square stern with painted lacquer barely visible',
      'Tudor warship, race-built galleon hull leaning against a basalt outcrop, three gun-decks recognizable, brass cannon-fittings green with verdigris',
      'British man-of-war frigate, hull mostly intact with the bowsprit broken, anchor chain trailing across the sandbed in a long arc',
      'Polynesian war canoe, double-hulled with the cross-deck collapsed, intricately carved prow-figure resting on the sea-grass floor',
      'colonial schooner, two-masted with both masts snapped flush at the deck, captain\'s table still bolted in the great cabin',
      'East Indiaman trader, hull split amidships exposing the cargo bay of spice jars and chests, copper-sheathed bottom still gleaming dimly',
      'Phoenician bireme, narrow cedar hull settled bow-first into a slope, painted eye still visible on the prow despite centuries',
    ],
    instructions: `Each entry is ONE specific pre-1850 wooden vessel, 16-24 words. Format: "vessel type with cultural/era origin, ONE period detail, ONE state cue." Vary across the 8 categories above. NEVER name modern vessel parts (propellers / engines / steel hulls / steamships). NEVER write negation language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines.`,
  },

  shipwreck_kingdom_decay_state: {
    format: 'simple',
    theme: `DECAY STATE for OceanBot shipwreck-kingdom — how the wreck has decomposed over decades/centuries underwater. Each entry is ONE specific structural state, 14-22 words.

✓ VARIETY across decay categories:
  A. Mostly-intact (bow rising from sand, hull leaning but recognizable, deck planks holding)
  B. Split / cracked (hull split amidships exposing cargo, keel cracked across a reef edge, stern blown out)
  C. Skeletal (ribcage of timbers remaining, frames stripped of planking, just the keel and ribs)
  D. Encrusted (so thickly covered the original shape is barely visible under living reef)
  E. Listing (heeled over at dramatic angle, capsized hull-up, half-buried diagonal)
  F. Specific dramatic anatomy (cannons protruding from coral, masts snapped flush, anchor chain stretched taut from prow into deep sand, bow upright like a tombstone)

Describe the STRUCTURE only. The coral/marine-life details live in separate axes — don\'t describe them here. NEVER use negation language.`,
    touchpoints: [
      'hull split amidships exposing the cargo bay, two distinct halves resting twenty meters apart on the sandbed',
      'mostly-intact bow rising from drifted sand like a tombstone, deck planks gone but the prow still pointing skyward',
      'skeletal ribcage of frames, hull-planking long stripped away, just the keel and curved timbers like a giant whale carcass',
      'capsized hull-up on the seafloor, copper-sheathed bottom catching dim light, deck and rigging buried beneath',
      'listing forty-five degrees against a coral outcrop, one rail buried in sand, the other reaching up toward the surface',
      'encrusted so thickly with brain coral the original profile is barely readable, only the bowsprit and stern-castle silhouettes survive',
      'cannons jutting horizontally from coral encrustation along the deck, hull beneath them obliterated by reef growth',
      'broken keel cracked across a basalt ridge, two sections collapsed apart, debris field of timbers radiating outward',
      'mostly intact upright on the seabed, sails long rotted away, masts standing as bare poles draped in kelp',
      'stern blown outward and missing, cargo hold visible all the way through, intact forward half resting on its keel',
      'bow buried prow-first into a sloping seabed, stern angled high, the whole ship pointed downward at thirty degrees',
      'deck collapsed inward, hull walls leaning toward each other like a folded book, interior fittings spilled across the seafloor',
    ],
    instructions: `Each entry 14-22 words. Pure structural state of the wreck. NO coral/marine-life detail (separate axis). NO negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  shipwreck_kingdom_coral_growth: {
    format: 'simple',
    theme: `CORAL GROWTH for shipwreck-kingdom — what living reef has grown ON the wreck. Each entry is ONE specific coral/reef-life encrustation pattern, 14-22 words.

✓ VARIETY across reef-growth categories:
  A. Soft-coral / sea-fan (fans hanging from rails / sea-whips along masts / pink soft-coral curtains)
  B. Hard coral (brain coral cluster on the deck / staghorn forest from the foredeck / boulder coral colonies)
  C. Kelp / algae (kelp forest sprouting from broken masts / algae carpet on the deck / sea-grass meadow around the hull)
  D. Anemone / sponge gardens (anemone colony in the captain\'s quarters / barrel sponges along the keel / encrusting sponges)
  E. Barnacle / shell encrustation (barnacle armor thick as a fist / oyster cluster on the prow / mussel beds along the waterline)
  F. Mixed cathedral (sea-fans + brain coral + kelp all layered into a living mosaic)

Describe what's ON the wreck. NO marine-life animals (fish/etc) — those are a separate axis. NEVER use negation. Visual register: living-reef richness.`,
    touchpoints: [
      'pink soft-coral fans hanging from the broken rail like curtains, swaying gently in the current',
      'massive brain-coral cluster colonizing the entire foredeck, fissures echoing the original deck-plank lines beneath',
      'staghorn-coral forest erupting from the open cargo hold, branching upward toward the dim light filtering through',
      'kelp forest sprouting from the snapped main-mast stump, fronds reaching twelve meters toward the surface',
      'sea-anemone colony carpeting the captain\'s quarters, hundreds of tentacle-flowers swaying in the slow current',
      'barnacle armor inches thick along the entire waterline, the original hull profile barely traceable beneath',
      'orange barrel-sponges lining the keel like sentries, each one large enough to swallow a diver',
      'encrusting sponges in purple and yellow patches across the entire stern, painting the wood in living color',
      'sea-fan curtain spanning the gap between two broken masts, plankton-filtering in the slow drift',
      'mussel beds carpeting the broken deck-planks, thousands of dark shells packed shoulder-to-shoulder',
      'oyster cluster the size of a barrel on the prow, calcified shells fused together into a living growth',
      'mixed cathedral of sea-fans + brain-coral + soft-coral layered across the entire hull, a living mosaic of textures and colors',
    ],
    instructions: `Each entry 14-22 words. Coral / reef-growth only. NO fish or marine-life animals (separate axis). NO negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  shipwreck_kingdom_marine_life: {
    format: 'simple',
    theme: `MARINE LIFE for shipwreck-kingdom — who LIVES on the wreck now. Each entry is ONE specific marine-life moment, 14-22 words.

✓ VARIETY across reef-inhabitant categories:
  A. Schools (silversides streaming through the hold / barracuda school orbiting the mast / bait-ball swirling around the bow)
  B. Solitary predator (lone moray peeking from a porthole / lone grouper hovering by the wheelhouse / lone barracuda watching from the rigging)
  C. Megafauna passing (sea-turtle gliding past the prow / shark patrolling the deck / manta ray gliding over the wreck)
  D. Cephalopods (octopus folded into a cannon / cuttlefish hovering at the rail / squid pulsing past the stern)
  E. Reef regulars (clownfish in anemone / parrotfish chewing coral on the bow / batfish hovering at the stern / sea-turtle resting on the deck)
  F. Predator hunting (shark gliding low along the deck / barracuda darting through silversides / grouper ambushing prey at the cargo hold mouth)

Describe ANIMAL behavior on/near the wreck. NO coral or sponge detail (separate axis). NEVER use negation.`,
    touchpoints: [
      'silverside school streaming through the cargo hold in a shimmering river, breaking around a coral-fused beam',
      'lone moray eel peeking from an empty porthole, jaw working slowly, watching the passing current',
      'sea-turtle gliding past the prow at deck height, flippers sculling slowly through the blue',
      'shark patrolling slowly along the keel-line, body angled close to the encrusted hull, eyes scanning forward',
      'octopus folded entirely inside a coral-fused cannon barrel, only one suckered arm trailing out and tasting the current',
      'grouper hovering motionless at the great-cabin door, the size of a barrel, watching everything that passes',
      'parrotfish flock chewing audibly at the brain-coral on the foredeck, biting and grinding without pause',
      'barracuda school orbiting the broken main-mast in a slow vertical helix, sunlight catching their silver flanks',
      'manta ray gliding diagonally over the entire wreck, wingtips brushing the rigging, slow and silent',
      'clownfish family darting in and out of an anemone colony covering the captain\'s quarters door',
      'batfish hovering vertically at the stern in a small group, flat bodies blending with the encrusted wood behind them',
      'eagle-ray cruising along the sand at the wreck\'s base, kicking up small puffs of silt with each wing-beat',
    ],
    instructions: `Each entry 14-22 words. Marine-life ANIMAL behavior only. NO coral/sponge (separate axis). NEVER use negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  shipwreck_kingdom_caustic_light: {
    format: 'simple',
    theme: `CAUSTIC LIGHT for shipwreck-kingdom — how sun-shafts and submarine light play on the wreck specifically. Each entry is ONE specific light pattern on the wreck, 14-22 words.

This is DIFFERENT from the bot-wide LIGHTING axis (which is mood/register). This axis is the path-bespoke CAUSTIC-PATTERN — the specific way light interacts with the wreck.

✓ VARIETY across caustic categories:
  A. Tight god-shafts (single dramatic ray striking the bow / pillars of light piercing the broken rigging / sun-beam stabbing through a deck-hole)
  B. Dappled mosaic (dappled water-light across the deck / shifting bright-and-dark pattern over the hull / moving light-mosaic on the captain\'s quarters)
  C. Diffuse / depth-blue (deep blue ambient saturating the wreck / cool diffuse light from above / no direct rays just blue glow)
  D. Backlit silhouette (wreck silhouetted against bright surface light / silhouette of broken masts against blue dome / hull as dark shape against sunlit shallows)
  E. Edge-rim light (sun catching only the highest edges / rim-lighting along the broken mast / golden edge on the upreaching bowsprit)
  F. Phosphorescent / unusual (bioluminescent glow lining the cracks / red-orange last-light during a sunset dive / cold-blue twilight diffuse)

NEVER use negation.`,
    touchpoints: [
      'single dramatic god-shaft piercing the broken main-mast hole, striking the foredeck like a spotlight',
      'dappled water-light shifting across the deck planks, bright-and-dark mosaic moving with the surface waves above',
      'deep blue ambient saturating the entire wreck, no direct sun rays, just luminous depth-blue glow',
      'wreck silhouetted against bright surface light above, broken masts dark cutouts against the sun-glow dome',
      'sun catching only the highest edges of the bowsprit, golden rim-light along the upreaching wood',
      'three parallel god-shafts piercing the gaps in the broken rigging, lighting the deck in vertical pillars',
      'cold blue diffuse with no direct rays, the wreck rendered in cool monochromatic depth tones',
      'red-orange last-light filtering down from a sunset surface, painting the deck in warm dying tones',
      'phosphorescent blue glow lining the cracks in the hull, almost imperceptible but unmistakably alive',
      'shifting caustic-mosaic playing across the entire upper deck, moving in slow waves with the surface chop',
      'single sun-shaft stabbing through a hole in the deck, illuminating a column of suspended particulate',
      'silhouette of the entire wreck against the surface dome above, every detail blacked-out except for the bright water beyond',
    ],
    instructions: `Each entry 14-22 words. Sun-shaft / caustic / submarine-light pattern ON the wreck. NEVER use negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  shipwreck_kingdom_water_clarity: {
    format: 'simple',
    theme: `WATER CLARITY for shipwreck-kingdom — the visibility and particulate density around the wreck. Each entry is ONE specific water-quality state, 14-22 words.

✓ VARIETY across clarity categories:
  A. Gin-clear (tropical blue with 30m visibility, every detail razor-sharp at distance)
  B. Mid-particulate (suspended plankton drifting through every shaft of light, slight haze)
  C. Silty / estuarine (brown-green tinted water, visibility under ten meters, moody)
  D. Cold-water clear (slate-blue Atlantic clarity, cold-water register, low color saturation)
  E. Disturbed sediment (dust-storm of disturbed silt, recently kicked up, swirling clouds)
  F. Phosphorescent (cyan-tinted bioluminescent suspension, glowing particles in the water column)

NEVER use negation.`,
    touchpoints: [
      'gin-clear tropical water with thirty-meter visibility, every detail of the wreck razor-sharp at distance',
      'mid-particulate suspension, plankton drifting through every shaft of light, slight diffusing haze',
      'silty estuarine water, brown-green tint, visibility under ten meters, the wreck fading into murk',
      'slate-blue cold-water Atlantic clarity, low color saturation, every detail visible but tonally muted',
      'recently disturbed sediment, swirling silt clouds drifting past the wreck like underwater dust storms',
      'cyan-tinted bioluminescent suspension, glowing particles in the water column lighting up around movement',
      'warm tropical turquoise saturating everything, the wreck and reef-life rendered in vivid color',
      'temperate-zone visibility, mid-distance haze softening the far end of the wreck while the near end stays crisp',
      'thermocline-layered water with cool clearer water above and warmer hazier water below, dividing the wreck',
      'pristine high-visibility deep blue, the kind found in offshore pelagic dives, the wreck floating in luminous space',
    ],
    instructions: `Each entry 14-22 words. Water-quality state around the wreck. NEVER use negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  shipwreck_kingdom_foreground_element: {
    format: 'simple',
    theme: `FOREGROUND ELEMENT for shipwreck-kingdom — what's in the immediate close-tier of the camera frame, anchoring depth. Each entry is ONE specific foreground anchor, 14-22 words.

⚠️ NOT THE WRECK — the wreck is the mid-frame hero. Foreground = something CLOSE to camera, framing the scene.

✓ VARIETY across foreground categories:
  A. Wreck-debris fragments (scattered timbers / loose cannon-ball pile / drifting plank / chain segment)
  B. Cargo spillage (gold coins half-buried in sand / porcelain shards / spice jars cracked open / barrel staves)
  C. Foreground reef element (coral fan in close-up / kelp fronds curling into frame / sea-fan whip in foreground)
  D. Wildlife close-up (jellyfish drifting close to lens / school passing through the foreground / sea-snake undulating close)
  E. Sediment / sand detail (rippled sand with shells / silt cloud / scattered sea-glass shards)
  F. Diving artifact (anchor stock half-buried / spear-fishing relic / brass instrument with coral grown into it)

NEVER use negation.`,
    touchpoints: [
      'scattered gold coins half-buried in the sand foreground, edges catching the light, fanning out from a cracked chest',
      'kelp fronds curling into the immediate foreground, swaying slowly, framing the wreck beyond them',
      'rusted iron-chain segment half-buried in the rippled sand, links massive and crusted with barnacles',
      'porcelain shards from a spilled cargo of trade-pottery scattered across the foreground sand',
      'massive sea-fan in the close foreground, branching purple-pink fronds filtering the view of the wreck behind',
      'jellyfish drifting close to the camera lens, translucent bell pulsing softly, the wreck dim in the background blue',
      'silt cloud kicked up by an unseen movement, swirling close to camera, the wreck a hazy silhouette beyond',
      'loose timber-plank suspended in the water column foreground, slowly rotating in a slow current',
      'anchor stock half-buried diagonally in the sand foreground, copper sheathing green with verdigris',
      'school of silversides streaming through the immediate foreground like a curtain, wreck visible through the gaps',
      'scattered sea-glass shards in the sand foreground, blue-and-green fragments catching the dim caustic light',
      'cannonball pile spilling from a broken crate in the foreground, dozens of iron spheres scattered across the seabed',
    ],
    instructions: `Each entry 14-22 words. ONE close-tier foreground element. NOT the wreck itself. NEVER use negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  shipwreck_kingdom_scale_provers: {
    format: 'simple',
    theme: `SCALE PROVERS for shipwreck-kingdom — small, far-distance figures that prove the wreck's scale. Each entry is ONE specific tiny scale-anchor, 14-22 words.

⚠️ TINY in the deep distance. These prove how big the wreck is by being small.

✓ VARIETY across scale-prover categories:
  A. Human (lone diver tiny in the middle-distance / pair of divers approaching / silhouetted research team)
  B. Submersible (small submarine silhouette above the wreck / ROV with bright lights / glass observation sphere)
  C. Large fauna (manta ray gliding far above / shark patrolling at deep range / sea-turtle cruising past)
  D. Schools at distance (distant school as a silver cloud / barracuda school orbiting at range / tuna school streaming past)
  E. Marine megafauna passing (whale shark passing in deep blue / orca silhouette transiting / pod of dolphins above)

NEVER close-up. NEVER use negation.`,
    touchpoints: [
      'lone diver tiny in the deep middle-distance, headlamp a single point of warm light against the dim blue',
      'small research submarine silhouette above the wreck, bright spotlights making twin cones in the dark water',
      'manta ray gliding far above the wreck, wingspan dwarfing the broken main-mast, silhouetted against the surface dome',
      'distant fish school as a silver cloud orbiting the upper rigging, individual fish lost in the shimmering mass',
      'whale shark passing through the deep blue background, the largest fish in the sea reduced to a graceful silhouette',
      'pair of divers approaching the wreck from above, fins kicking slowly, scale-anchored by the rigging they swim toward',
      'pod of dolphins transiting high above the wreck, six silhouettes against the surface-light dome',
      'ROV with bright halogen lights working at the far end of the wreck, cables trailing upward and out of frame',
      'school of barracuda orbiting at range, vertical helix of silver bodies moving in unison around the foremast',
      'sea-turtle cruising past in the middle-distance, ancient shell tiny against the broken hull behind it',
      'orca silhouette transiting in the deep blue, dorsal fin tall enough to identify even at extreme range',
      'lone hammerhead patrolling at deep range, distinctive head-profile recognizable even as a small silhouette',
    ],
    instructions: `Each entry 14-22 words. ALWAYS small, distant, silhouetted. NEVER close-up. NEVER use negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  shipwreck_kingdom_camera_framing: {
    format: 'simple',
    theme: `CAMERA FRAMING for shipwreck-kingdom — the explicit composition mandate. Each entry is ONE specific camera angle that the renderer must honor, 14-22 words.

⚠️ EXPLICIT CAMERA LANGUAGE — every entry NAMES the framing/angle as THE LAW. Without this mandate, Flux defaults to generic mid-shot regardless of the rest of the brief.

✓ VARIETY across framing categories:
  A. LOW-ANGLE looking up (camera below the wreck, wreck towering against surface dome)
  B. ABYSSAL DOWN (camera above, looking down onto the wreck on the seabed)
  C. OVER-THE-DECK aerial (aerial-style sweeping pan along the deck)
  D. THROUGH-THE-WRECK (camera positioned inside the broken hull looking out)
  E. SUBMERGED 3/4 (three-quarter perspective from beside the prow / stern at deck-level)
  F. WIDE ENVIRONMENTAL (vast underwater establishing shot, wreck as one element in a deep scene)
  G. CLOSE-DETAIL (camera close to a specific encrusted feature, wreck-mass extending beyond frame)

NEVER use negation.`,
    touchpoints: [
      'LOW-ANGLE looking up at the wreck-spire, hull towering against the sunlit surface dome above',
      'ABYSSAL DOWN angle, camera above looking straight down onto the wreck spread across the seafloor',
      'OVER-THE-DECK aerial sweep along the entire length of the hull, deck features parading beneath the camera',
      'THROUGH-THE-BROKEN-HOLD framing, camera inside the cargo bay looking outward through the splintered hull',
      'SUBMERGED THREE-QUARTER perspective from beside the prow, prow looming left-foreground, wreck extending right',
      'WIDE ENVIRONMENTAL ESTABLISHING shot, wreck as one element in a vast deep-blue scene, scale-provers proving size',
      'CLOSE DETAIL on a coral-encrusted cannon, wreck-mass extending out of frame on every side',
      'STERN-TO-BOW LATERAL FRAMING, camera moving along the keel-line at deck-height, wreck filling the horizontal',
      'EYE-LEVEL approach toward the prow, wreck looming larger as the camera nears, foreground sand racing past',
      'DRAMATIC LOW from the seafloor immediately beside the hull, looking up the encrusted side toward broken rigging',
      'OVER-THE-RAIL framing, camera positioned just above the broken rail looking down across the deck and into the hold',
      'DIVER POV approach, first-person framing as if the viewer is finning toward the wreck from open water',
    ],
    instructions: `Each entry 14-22 words. Explicit camera angle / framing mandate. NEVER use negation. NEVER modern cinema terms (dolly / dutch / tilt-up). Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  shipwreck_kingdom_surprise_element: {
    format: 'simple',
    theme: `SURPRISE ELEMENT for shipwreck-kingdom — ONE unexpected story detail that elevates the scene from generic-wreck to specific-history. Each entry 14-22 words.

⚠️ STORY-IMPLYING — these are the "wait, WHAT?" details that make the wreck memorable. A skeleton clutching gold. A perfect-condition pocket-watch. A ship's bell still tarnished but readable.

✓ VARIETY across surprise categories:
  A. Human remnant (skeletal hand on the wheel / bones still in the captain\'s chair / a skull on the deck)
  B. Treasure detail (jeweled cutlass in a coral-fused grip / treasure chest cracked open with gold pouring / a ruby brooch on the sand)
  C. Maritime artifact (ship\'s bell still recognizable / brass sextant fused with coral / officer\'s telescope intact)
  D. Cargo curiosity (cargo of porcelain dolls staring upward / cargo of marble statues lying on the sand / cargo of weapons in racks)
  E. Period detail (carved mermaid-figurehead on the prow / silver crucifix half-buried / regimental flag fragment fluttering)
  F. Anachronism / wonder (later-era diving helmet from a salvage attempt / message-in-a-bottle wedged in the rigging)

NEVER use negation. The surprise SHOULD be specific enough that a viewer pauses.`,
    touchpoints: [
      'skeletal hand still gripping the captain\'s wheel, finger-bones fused with coral, the ship steering its endless drift',
      'treasure chest cracked open near the stern, gold coins pouring out across the sand in a frozen cascade',
      'brass ship\'s bell hanging from a broken yardarm, tarnished but the ship\'s name still legible',
      'cargo of porcelain dolls in an open crate, hundreds of painted faces staring upward through the dim water',
      'carved mermaid-figurehead on the prow, hair flowing back in petrified wood, eyes calm and ancient',
      'officer\'s sextant resting on the captain\'s table, brass green with verdigris, the angle-arm still set',
      'later-era diving helmet abandoned beside the wreck, copper-and-brass from a salvage attempt that never returned',
      'jeweled cutlass still held in a coral-fused grip, ruby pommel catching the dim caustic light',
      'cargo of marble statues lying tumbled across the seafloor, the figures of gods and emperors face-down in the sand',
      'silver crucifix half-buried in the sand near the captain\'s quarters, chain still attached to vanished neck',
      'regimental flag fragment fluttering from a broken mast, colors faded but the heraldic device still readable',
      'cargo of weapons in their racks within the gun-deck, muskets and cutlasses preserved by silt and cold water',
    ],
    instructions: `Each entry 14-22 words. ONE story-implying surprise. NEVER use negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  shipwreck_kingdom_drama: {
    format: 'simple',
    theme: `DRAMA LAYER for shipwreck-kingdom — conditional atmospheric escalation that fires at 40% gate. Each entry 14-22 words describing ONE subtle dramatic shift.

⚠️ SUBTLE WEAVING — drama ADDS to the scene, doesn't replace it. Should COMBINE with the rest of the wreck composition, not dominate.

✓ VARIETY across drama categories:
  A. Apex predator passing (passing shark casts a long shadow across the deck / hammerhead patrolling overhead / orca silhouette transiting)
  B. Marine megafauna surfacing event (whale breaching at the surface visible above / whale-fall carcass beside the wreck / pod of dolphins racing past)
  C. Weather above (storm darkening the surface light overhead / lightning faintly visible through the surface / heavy rain dimpling the dome above)
  D. Current event (sudden current pulling kelp horizontal / silt-storm rolling across the seafloor / thermocline shimmer dividing the water)
  E. Bio-event (phosphorescent bloom rising around the wreck / dinoflagellate flash with movement / bioluminescent jellies passing through)
  F. Discovery moment (diver discovering something for the first time / camera-flash from a far diver / submarine emerging from the deep blue)

NEVER use negation.`,
    touchpoints: [
      'a passing shark casts a long moving shadow across the deck, the silhouette gliding from bow to stern',
      'storm clouds darken the surface dome above the wreck, the sunlit ceiling dimming to bruised grey',
      'sudden current pulls the kelp-forest horizontal across the wreck, fronds streaming in a single direction',
      'phosphorescent bloom rising around the wreck, cyan glow intensifying with every movement of the water',
      'whale silhouette visible above the surface dome, a massive shape blocking the sunlight in passing',
      'silt-storm rolling across the seafloor toward the wreck, a swelling dust-cloud advancing in the deep current',
      'diver appearing for the first time at the upper-frame edge, headlamp catching the broken main-mast tip',
      'lightning flickering faintly through the surface dome, brief strobes lighting the deeper water in cold pulses',
      'pod of dolphins racing past in the middle-distance, the chevron of bodies moving as one through the blue',
      'bioluminescent jellies drifting through the foreground, soft glow pulsing rhythmically as they pass',
      'submarine emerging from the deeper blue beyond the wreck, hull-lights cutting twin beams toward the bow',
      'thermocline shimmer dividing the water column horizontally, the wreck appearing distorted at the boundary',
    ],
    instructions: `Each entry 14-22 words. Subtle dramatic escalation. ADDS to the scene, doesn't replace. NEVER use negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LOST-CITIES path-bespoke pools (11)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //
  // Sister of shipwreck-kingdom — same underwater register, but the hero
  // is HEWN STONE instead of WOODEN SHIP. Atlantis-style sunken
  // civilization: drowned temples, coral-grown statues of forgotten gods,
  // toppled colossi, ziggurats half-buried in coral, palaces with kelp
  // tapestries. Haunting beauty, NOT horror. NEVER human figures within
  // the ruin (divers can appear small in the distance as scale-provers
  // only). Full-bespoke per [[feedback_full_bespoke_per_path_no_shared_pools]]
  // — content distinct from shipwreck-kingdom even where the axis name
  // matches (coral on stone columns ≠ coral on wooden ribs).
  //
  // Civilizational variety baked into RUIN_CLASS so we get Greco-Roman,
  // Egyptian, Mesoamerican, Khmer, Polynesian, Mesopotamian, Hindu,
  // Phoenician, Minoan, Indus-Valley diversity from a single axis pick
  // rather than needing a separate era axis.

  lost_cities_ruin_class: {
    format: 'simple',
    theme: `RUIN CLASS for OceanBot's lost-cities path — sunken civilizational architecture resting on the seafloor, reclaimed by coral and time. Each entry is ONE specific named monument with civilizational origin + the period detail that makes it recognizable underwater. 16-24 words per entry.

⚠️ MANDATORY — every ruin is HEWN STONE / brick / sandstone / marble / basalt — a built civilizational monument, NOT a ship. The structure sank centuries to millennia ago and is now permanent seafloor architecture, coral-fused but unmistakably built by ancient hands.

✓ VARIETY MANDATE — distribute across civilizational categories (~3 entries each):
  A. Greco-Roman (marble temple complex, amphitheater, forum, aqueduct, colossus)
  B. Egyptian (pylon temple, sphinx, obelisk, mastaba, granite colonnade)
  C. Mesoamerican (Mayan step-pyramid, Aztec temple, Toltec colonnade, Olmec head)
  D. Khmer / Hindu (Angkor-style face-tower, gopuram, lotus-pond shrine, lingam complex)
  E. Mesopotamian (Babylonian ziggurat, Assyrian palace, lamassu gateway)
  F. Polynesian / Easter Island (moai colossi, basalt platform, lashed-stone shrine)
  G. Phoenician / Carthaginian (harbor city, basalt jetty, anchor-bay platform)
  H. Minoan / Aegean (Knossos-style palace, bull-fresco wall, megaron throne room)
  I. East Asian (Hindu kingdom shrine, Japanese pagoda foundation, Chinese pavilion)
  J. Indus Valley / Norte Chico (geometric brick city, stepped tank, stone columned hall)

Each entry names the monument + ONE period-locking detail (hieroglyph relief / lotus capital / jaguar-glyph / bull-fresco / etc.) and a one-phrase position-or-state cue (face-down on the seafloor / leaning into a coral shelf / standing improbably upright / etc.). NO speculation about crumble state — that's a separate axis.

DO write positively. NO words like "no ship / no wooden / no modern" — describe the stone, the carving, the form.`,
    touchpoints: [
      'Greco-Roman amphitheater half-buried, marble tiered seating spiraling into a coral-grown bowl, central stage cracked across the proscenium',
      'Egyptian pylon temple complex with toppled obelisks, hieroglyph-carved sandstone columns sprouting kelp from fluted capitals',
      'Mayan step-pyramid breached at the upper terrace, jaguar-glyph reliefs faintly visible under thick coral encrustation',
      'Khmer face-tower complex, four-faced sandstone towers half-eaten by coral, lotus-pond bas-reliefs still readable on the lower walls',
      'Polynesian moai colossi face-down on the seafloor, basalt heads slowly being buried by drifting sand and sea-grass',
      'Babylonian ziggurat tiered upward in seven receding levels, glazed-brick lions on the lower terrace, upper steps crumbling outward',
      'Hindu shrine complex with stone-carved devas, kalasha-finials still atop the gopuram, kelp draped across the cornice friezes',
      'Phoenician harbor city, basalt jetty-stones tumbled into a long line, ancient anchor-stones still in their original bays',
      'Minoan palace with red-painted megaron walls, the bull-fresco still partly visible above a fallen colonnade of slender columns',
      'Toltec colonnade hall, Atlantean warrior-columns standing in two parallel ranks, their stone faces half-eaten by coral',
      'sunken Roman aqueduct arching across a deep blue distance, broken arches catching shafts of caustic light',
      'Egyptian sphinx avenue, twelve human-headed lion forms lining a ceremonial way, sand drifting up their flanks',
    ],
    instructions: `Each entry is ONE specific sunken monument, 16-24 words. Format: "monument type with civilizational origin, ONE period detail, ONE state cue." Vary across the 10 categories above. NEVER name ship parts (hull / mast / rigging). NEVER write negation language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines.`,
  },

  lost_cities_crumble_state: {
    format: 'simple',
    theme: `CRUMBLE STATE for OceanBot lost-cities — how the stone has fractured, eroded, or held over centuries underwater. Each entry is ONE specific structural state, 14-22 words.

✓ VARIETY across crumble categories:
  A. Mostly-intact (walls still rising, colonnade complete, pediment held, central dome whole)
  B. Cracked / fissured (column shafts cracked across, pediment split, dome fractured but standing)
  C. Toppled (columns lying like fallen dominoes, statues face-down, colossus head separated from body)
  D. Encrusted (so thickly coral-fused the original profile is barely visible)
  E. Half-buried (lower courses lost to drifting sand, upper structure rising clear)
  F. Dramatic anatomy (split-down-the-middle temple, single column standing alone in a field of debris, dome breached at the apex)

Describe the STRUCTURE only — the coral/marine-life details live in separate axes. NEVER use negation.`,
    touchpoints: [
      'columns lying toppled in parallel ranks, like fallen dominoes across the seafloor, capitals still recognizable at their broken ends',
      'temple walls mostly intact upright, pediment cracked but holding, the colonnade complete around three sides of the courtyard',
      'central dome breached at the apex, sunlight pouring down through the broken keystone like a cathedral oculus',
      'colossus head separated from the body, lying upright on the sand twenty meters from the headless shoulders',
      'lower courses buried beneath drifting sand, the upper third of the structure still rising clear into the water',
      'encrusted so thickly with coral the original architectural profile is barely readable, only the silhouette suggesting columns',
      'split down the middle as if by an earthquake, two halves leaning apart, the central altar exposed in the fissure',
      'single colonnade column still standing improbably upright, the rest of the temple collapsed into a debris field around it',
      'pyramid stepped terraces partially collapsed inward, the lower levels intact, the upper apex caved into a crater',
      'walls cracked but holding, fissures running diagonally across the masonry, the building still recognizably whole',
      'ziggurat angled forty-five degrees against a basalt outcrop, three of seven tiers still distinguishable',
      'face-tower with one face mostly intact, the other three eroded to featureless stone, kelp draped where eyes once were',
    ],
    instructions: `Each entry 14-22 words. Pure structural state of the ruin. NO coral/marine-life detail (separate axis). NO negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  lost_cities_coral_growth: {
    format: 'simple',
    theme: `CORAL GROWTH for lost-cities — what living reef has grown ON the stone monuments. Each entry is ONE specific coral/reef encrustation pattern on hewn architecture, 14-22 words.

✓ VARIETY across reef-growth categories (distinct from wreck-coral — these grow on stone columns, friezes, pediments, statue surfaces):
  A. Soft-coral / sea-fan (purple sea-fans hanging from cornices / pink soft-coral curtains on pediments / sea-whips along column flutes)
  B. Hard coral (brain-coral fused to a frieze / staghorn forest from a broken capital / boulder coral atop a statue's shoulders)
  C. Kelp / algae (kelp forest rooted in pediment cracks / algae carpet covering bas-reliefs / sea-grass meadow around toppled columns)
  D. Anemone / sponge gardens (anemone colony in carved niches / barrel sponges along the architrave / encrusting sponges painting marble in patches)
  E. Tube-worm / fan-worm (red-and-white fan-worm groves in old inscription channels / spiral tube-worms colonizing carved letters)
  F. Mixed cathedral (sea-fans + brain coral + kelp layered into a living mosaic on a single wall)

Describe what's ON the stone. NO marine-life animals (fish/etc) — those are a separate axis. NEVER use negation. Visual register: living reef draped over ancient architecture.`,
    touchpoints: [
      'purple sea-fans hanging from the cornice friezes, swaying in the slow current like funerary curtains',
      'brain-coral cluster fused to the central pediment, fissures echoing the carved-relief lines beneath the encrustation',
      'staghorn-coral forest erupting from a broken capital, branching upward toward the dim caustic light',
      'kelp forest rooted in pediment cracks, fronds reaching ten meters toward the surface, swaying in unison',
      'red-and-white fan-worm grove colonizing the inscription channels, each carved letter outlined in living spiral worms',
      'anemone colony carpeting carved niches that once held votive statues, hundreds of tentacle-flowers swaying',
      'orange barrel-sponges lining the architrave like sentries, each one large enough to swallow a human head',
      'encrusting sponges in purple and yellow patches across a bas-relief wall, painting the carved figures in living color',
      'sea-whip curtain spanning the gap between two fallen columns, filtering plankton in the slow drift',
      'boulder-coral colony grown over the shoulders of a seated colossus, the head free above, the lap completely consumed',
      'mussel beds carpeting the toppled column drums, thousands of dark shells packed against weathered marble',
      'mixed cathedral of sea-fans and brain coral and soft coral layered across an entire temple wall, living mosaic of textures',
    ],
    instructions: `Each entry 14-22 words. Coral / reef-growth on hewn stone only. NO fish or marine-life animals (separate axis). NO negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  lost_cities_marine_life: {
    format: 'simple',
    theme: `MARINE LIFE for lost-cities — who LIVES in the ruins now. Each entry is ONE specific marine-life moment in/around drowned architecture, 14-22 words.

✓ VARIETY across reef-inhabitant categories:
  A. Schools (silversides streaming through a colonnade / barracuda school orbiting a broken obelisk / bait-ball swirling around a colossus)
  B. Solitary predator (lone moray peeking from a carved niche / lone grouper hovering in a megaron throne room / lone barracuda watching from a fallen pediment)
  C. Megafauna passing (sea-turtle gliding past a pylon gateway / shark patrolling along the temple wall / manta ray gliding over the amphitheater)
  D. Cephalopods (octopus folded into a carved niche / cuttlefish hovering above a fresco / squid pulsing past a face-tower)
  E. Reef regulars (clownfish in an anemone colony on a frieze / parrotfish chewing coral on a column / batfish hovering in an open doorway / sea-turtle resting on a stone platform)
  F. Predator hunting (shark gliding along a colonnade / barracuda darting through silversides in a courtyard / grouper ambushing prey at an arched doorway)

Describe ANIMAL behavior in/near the ruins. NO coral or sponge detail (separate axis). NEVER use negation.`,
    touchpoints: [
      'silverside school streaming through the colonnade in a shimmering river, breaking around each column drum',
      'lone moray eel peeking from a carved niche that once held a votive lamp, jaw working slowly',
      'sea-turtle gliding past a pylon gateway at column-capital height, flippers sculling through the blue',
      'shark patrolling along the outer temple wall, body close to the encrusted stone, eyes scanning forward',
      'octopus folded entirely inside a carved-niche shrine, only one suckered arm trailing out and tasting the current',
      'grouper hovering motionless in a megaron throne room, body the size of a barrel, watching everything that passes',
      'parrotfish flock chewing audibly at the brain-coral on a fallen column, biting and grinding the encrustation',
      'barracuda school orbiting a broken obelisk in a slow vertical helix, sunlight catching their silver flanks',
      'manta ray gliding diagonally over the entire amphitheater, wingtips brushing the upper tiers of seating',
      'clownfish family darting in and out of an anemone colony that has colonized a carved frieze',
      'batfish hovering vertically in an open temple doorway, flat bodies blending with the dark interior beyond',
      'eagle-ray cruising along the sand at the ruin\'s base, kicking small puffs of silt with each wing-beat',
    ],
    instructions: `Each entry 14-22 words. Marine-life ANIMAL behavior in/around hewn-stone ruins. NO coral/sponge (separate axis). NEVER use negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  lost_cities_caustic_light: {
    format: 'simple',
    theme: `CAUSTIC LIGHT for lost-cities — how sun-shafts and submarine light play on hewn stone specifically. Each entry is ONE specific light pattern on the ruin, 14-22 words.

This is DIFFERENT from the bot-wide LIGHTING axis (which is mood/register). This axis is the path-bespoke CAUSTIC-PATTERN — the specific way light interacts with the architecture.

✓ VARIETY across caustic categories:
  A. Tight god-shafts (single dramatic ray striking a column / pillars of light through a broken pediment / sun-beam stabbing through a dome oculus)
  B. Dappled mosaic (dappled water-light across marble walls / shifting bright-and-dark pattern over the colonnade / moving light-mosaic on bas-reliefs)
  C. Diffuse / depth-blue (deep blue ambient saturating the ruin / cool diffuse light from above / no direct rays just blue glow)
  D. Backlit silhouette (ruin silhouetted against bright surface light / silhouette of broken columns against blue dome / monument as dark shape against sunlit shallows)
  E. Edge-rim light (sun catching only the highest cornices / rim-lighting along a fallen colossus / golden edge on the upreaching obelisk)
  F. Phosphorescent / unusual (bioluminescent glow lining carved channels / red-orange last-light during a sunset dive / cold-blue twilight diffuse)

NEVER use negation.`,
    touchpoints: [
      'single dramatic god-shaft piercing the dome oculus, striking the central altar like a divine spotlight',
      'dappled water-light shifting across the marble colonnade, bright-and-dark mosaic moving with the surface waves above',
      'deep blue ambient saturating the entire amphitheater, no direct sun rays, just luminous depth-blue glow',
      'ruin silhouetted against bright surface light above, broken columns dark cutouts against the sun-glow dome',
      'sun catching only the highest cornice edges, golden rim-light tracing the temple\'s upper outline',
      'three parallel god-shafts piercing the gaps in a broken pediment, lighting the courtyard floor in vertical pillars',
      'cold blue diffuse with no direct rays, the ruin rendered in cool monochromatic depth tones',
      'red-orange last-light filtering down from a sunset surface, painting the colonnade in warm dying tones',
      'phosphorescent blue glow lining the carved inscription channels, faint but alive in the dim water',
      'shifting caustic-mosaic playing across the entire pediment, moving in slow waves with the surface chop',
      'single sun-shaft stabbing through a hole in the dome, illuminating a column of suspended particulate over the altar',
      'silhouette of the entire face-tower against the surface dome, every carved detail blacked-out against the bright water',
    ],
    instructions: `Each entry 14-22 words. Sun-shaft / caustic / submarine-light pattern on hewn-stone architecture. NEVER use negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  lost_cities_water_clarity: {
    format: 'simple',
    theme: `WATER CLARITY for lost-cities — the visibility and particulate density around the sunken ruin. Each entry is ONE specific water-quality state, 14-22 words.

✓ VARIETY across clarity categories:
  A. Gin-clear (tropical blue with 30m visibility, every carved detail razor-sharp at distance)
  B. Mid-particulate (suspended plankton drifting through every shaft of light, slight haze softening the colonnade)
  C. Silty / estuarine (brown-green tinted water, visibility under ten meters, moody)
  D. Cold-water clear (slate-blue Atlantic clarity, cold-water register, low color saturation)
  E. Disturbed sediment (dust-storm of disturbed silt, recently kicked up, swirling clouds drifting past the colonnade)
  F. Phosphorescent (cyan-tinted bioluminescent suspension, glowing particles in the water column)

NEVER use negation.`,
    touchpoints: [
      'gin-clear tropical water with thirty-meter visibility, every carved hieroglyph razor-sharp at distance',
      'mid-particulate suspension, plankton drifting through every shaft of light, slight diffusing haze around the colonnade',
      'silty estuarine water, brown-green tint, visibility under ten meters, the ruin fading into murk',
      'slate-blue cold-water Atlantic clarity, low color saturation, every carved detail visible but tonally muted',
      'recently disturbed sediment, swirling silt clouds drifting past the temple like underwater dust storms',
      'cyan-tinted bioluminescent suspension, glowing particles in the water column lighting up around any movement',
      'warm tropical turquoise saturating everything, the ruin and reef-life rendered in vivid color',
      'temperate-zone visibility, mid-distance haze softening the far end of the colonnade while the near columns stay crisp',
      'thermocline-layered water with cool clearer water above and warmer hazier water below, dividing the ruin horizontally',
      'pristine high-visibility deep blue, offshore pelagic clarity, the temple floating in luminous space',
    ],
    instructions: `Each entry 14-22 words. Water-quality state around the sunken ruin. NEVER use negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  lost_cities_foreground_element: {
    format: 'simple',
    theme: `FOREGROUND ELEMENT for lost-cities — what's in the immediate close-tier of the camera frame, anchoring depth. Each entry is ONE specific foreground anchor, 14-22 words.

⚠️ NOT THE RUIN — the ruin is the mid-frame hero. Foreground = something CLOSE to camera, framing the scene.

✓ VARIETY across foreground categories:
  A. Ruin-debris fragments (broken column drum / fallen capital / mosaic shard / inscription stone block)
  B. Civilizational artifact (gold coin half-buried / ceremonial amphora / bronze lamp / votive figurine / ritual blade)
  C. Foreground reef element (coral fan in close-up / kelp fronds curling into frame / sea-fan whip in foreground)
  D. Wildlife close-up (jellyfish drifting close to lens / school passing through the foreground / sea-snake undulating close)
  E. Sediment / sand detail (rippled sand with shells / silt cloud / scattered mosaic-tile fragments)
  F. Carved fragment (broken statue head face-up / chunk of frieze / inscribed stele tilted in the sand)

NEVER use negation.`,
    touchpoints: [
      'scattered gold coins half-buried in the sand foreground, edges catching the light, fanning out from a tipped offering bowl',
      'kelp fronds curling into the immediate foreground, swaying slowly, framing the temple beyond them',
      'broken column drum lying on its side in the close foreground, fluted edges crusted with barnacles',
      'mosaic shards scattered across the foreground sand, tesserae of blue-and-gold glass catching the dim caustic light',
      'massive sea-fan in the close foreground, branching purple-pink fronds filtering the view of the colonnade behind',
      'jellyfish drifting close to the camera lens, translucent bell pulsing softly, the temple dim in the background blue',
      'silt cloud kicked up by unseen movement, swirling close to camera, the ruin a hazy silhouette beyond',
      'fallen capital with acanthus-leaf carving suspended on a sand-shelf, intricate detail close to lens',
      'inscribed stele tilted half-buried in the foreground sand, weathered letters still readable on the upper face',
      'school of silversides streaming through the immediate foreground like a curtain, ruin visible through the gaps',
      'broken statue head face-up in the sand foreground, calm carved eyes still meeting the camera across centuries',
      'ceremonial amphora resting on its side in the close foreground, neck cracked, contents long dispersed',
    ],
    instructions: `Each entry 14-22 words. ONE close-tier foreground element. NOT the ruin itself. NEVER use negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  lost_cities_scale_provers: {
    format: 'simple',
    theme: `SCALE PROVERS for lost-cities — small, far-distance figures that prove the ruin's monumentality. Each entry is ONE specific tiny scale-anchor, 14-22 words.

⚠️ TINY in the deep distance. These prove how massive the sunken architecture is by being small. NEVER place humans inside the ruin — they appear at distance only.

✓ VARIETY across scale-prover categories:
  A. Human (lone diver tiny against a colossus / pair of divers approaching a temple façade / silhouetted research team at the perimeter)
  B. Submersible (small submarine silhouette above the amphitheater / ROV with bright lights / glass observation sphere)
  C. Large fauna (manta ray gliding far above / shark patrolling at deep range / sea-turtle cruising past a colonnade)
  D. Schools at distance (distant school as a silver cloud orbiting an obelisk / barracuda school at range / tuna school streaming past a pylon)
  E. Marine megafauna passing (whale shark passing in the deep blue beyond / orca silhouette transiting / pod of dolphins above)

NEVER close-up. NEVER use negation.`,
    touchpoints: [
      'lone diver tiny in the deep middle-distance, headlamp a single point of warm light against the temple\'s shadowed colonnade',
      'small research submarine silhouette hovering above the amphitheater, bright spotlights making twin cones in the dim water',
      'manta ray gliding far above the temple, wingspan dwarfing the broken pediment, silhouetted against the surface dome',
      'distant fish school as a silver cloud orbiting the upper obelisk, individual fish lost in the shimmering mass',
      'whale shark passing in the deep blue background beyond the ruin, the largest fish in the sea reduced to a graceful silhouette',
      'pair of divers approaching the colossus from above, fins kicking slowly, scale-anchored against the seated giant',
      'pod of dolphins transiting high above the ziggurat, six silhouettes against the surface-light dome',
      'ROV with bright halogen lights working at the far end of the colonnade, cables trailing upward out of frame',
      'school of barracuda orbiting at range, vertical helix moving in unison around a fallen capital',
      'sea-turtle cruising past in the middle-distance, ancient shell tiny against the temple wall behind it',
      'orca silhouette transiting in the deep blue, dorsal fin tall enough to identify even at extreme range',
      'lone hammerhead patrolling at deep range past the ruin\'s perimeter, distinctive head-profile readable even at scale',
    ],
    instructions: `Each entry 14-22 words. ALWAYS small, distant, silhouetted. NEVER close-up. NEVER use negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  lost_cities_camera_framing: {
    format: 'simple',
    theme: `CAMERA FRAMING for lost-cities — the explicit composition mandate. Each entry is ONE specific camera angle that the renderer must honor, 14-22 words.

⚠️ EXPLICIT CAMERA LANGUAGE — every entry NAMES the framing/angle as THE LAW. Without this mandate, Flux defaults to generic mid-shot regardless of the rest of the brief.

✓ VARIETY across framing categories:
  A. LOW-ANGLE looking up (camera below the ruin, columns towering against surface dome)
  B. ABYSSAL DOWN (camera above, looking down onto the ruin spread across the seabed)
  C. OVER-THE-COLONNADE aerial (aerial-style sweeping pan along a colonnade)
  D. THROUGH-THE-DOORWAY (camera positioned inside a doorway / archway looking out)
  E. SUBMERGED 3/4 (three-quarter perspective from beside a colossus / pylon at base level)
  F. WIDE ENVIRONMENTAL (vast underwater establishing shot, ruin as one element in a deep scene)
  G. CLOSE-DETAIL (camera close to a specific carved feature, ruin-mass extending beyond frame)

NEVER use negation.`,
    touchpoints: [
      'LOW-ANGLE looking up at the colonnade, columns towering against the sunlit surface dome above',
      'ABYSSAL DOWN angle, camera above looking straight down onto the temple complex spread across the seafloor',
      'OVER-THE-COLONNADE aerial sweep along the entire length of the row, capitals parading beneath the camera',
      'THROUGH-THE-DOORWAY framing, camera inside an arched gateway looking outward across the courtyard',
      'SUBMERGED THREE-QUARTER perspective from beside a seated colossus, head looming left-foreground, plaza extending right',
      'WIDE ENVIRONMENTAL ESTABLISHING shot, ruin as one element in a vast deep-blue scene, scale-provers proving monumentality',
      'CLOSE DETAIL on a coral-encrusted carved face, ruin-mass extending out of frame on every side',
      'LATERAL FRAMING along the pediment, camera moving horizontally past the frieze at cornice height',
      'EYE-LEVEL approach toward the temple gateway, ruin looming larger as the camera nears, foreground sand racing past',
      'DRAMATIC LOW from the seafloor immediately beside the obelisk, looking up the encrusted shaft toward the broken tip',
      'OVER-THE-PEDIMENT framing, camera positioned just above the pediment edge looking down across the courtyard and into the cella',
      'DIVER POV approach, first-person framing as if the viewer is finning toward the colonnade from open water',
    ],
    instructions: `Each entry 14-22 words. Explicit camera angle / framing mandate. NEVER use negation. NEVER modern cinema terms (dolly / dutch / tilt-up). Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  lost_cities_surprise_element: {
    format: 'simple',
    theme: `SURPRISE ELEMENT for lost-cities — ONE unexpected story detail that elevates the scene from generic-ruin to specific-civilization. Each entry 14-22 words.

⚠️ STORY-IMPLYING — these are the "wait, WHAT?" details that make the ruin memorable. A perfectly preserved gold idol. A fresco still vivid behind a curtain of kelp. An unbroken seal on a ceremonial vessel.

✓ VARIETY across surprise categories:
  A. Cult/votive object (gold idol on a pedestal / jeweled crown on the altar / ceremonial mask propped against a column)
  B. Preserved artwork (fresco still vivid behind kelp / mosaic floor intact under thin silt / carved frieze readable across the architrave)
  C. Inscription / script (cuneiform tablet stack / hieroglyph wall complete / runestone with carving still sharp)
  D. Civilizational artifact (unbroken ceremonial amphora / ritual blade in its sheath / ornamental bronze brazier)
  E. Statuary in unexpected pose (seated colossus head turned to one side / standing figure with raised hand intact / paired figures facing each other across the plaza)
  F. Wonder / anachronism (faint phosphorescent glow from a ceremonial vessel / abandoned diver gear tangled in a column / a single offering still on the altar)

NEVER use negation. The surprise SHOULD be specific enough that a viewer pauses.`,
    touchpoints: [
      'gold idol resting upright on a pedestal at the temple\'s heart, surface still gleaming dimly through centuries of silt',
      'fresco panel still vivid behind a curtain of kelp, royal procession painted in red-and-ochre, faces calm and ancient',
      'mosaic floor intact beneath a thin layer of sand, tesserae forming a coiled sea-serpent across the courtyard',
      'cuneiform tablet stack arranged on a stone shelf in a niche, lines of wedge-marks still readable across the clay',
      'unbroken ceremonial amphora upright in a corner alcove, seal intact, contents preserved by centuries of submersion',
      'colossus seated head turned to one side as if listening, the carved expression strangely alive in the dim caustic light',
      'jeweled ceremonial crown resting on the altar slab, gemstone settings still holding their original ruby and lapis',
      'a single fresh-looking offering bowl placed centrally on the altar, contents long dissolved but the placement deliberate',
      'standing figure with one raised hand still intact, the gesture appearing to greet whoever enters the inner sanctum',
      'paired guardian-statues facing each other across the plaza, swords still crossed in ceremonial salute',
      'ornamental bronze brazier suspended on chains from the ceiling, chains still holding after the building has half-collapsed',
      'runestone with carving still sharp, a tale of conquest readable across the face for any who can decipher the script',
    ],
    instructions: `Each entry 14-22 words. ONE story-implying surprise. NEVER use negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  lost_cities_drama: {
    format: 'simple',
    theme: `DRAMA LAYER for lost-cities — conditional atmospheric escalation that fires at 40% gate. Each entry 14-22 words describing ONE subtle dramatic shift.

⚠️ SUBTLE WEAVING — drama ADDS to the scene, doesn't replace it. Should COMBINE with the rest of the ruin composition, not dominate.

✓ VARIETY across drama categories:
  A. Apex predator passing (passing shark casts a long shadow across the colonnade / hammerhead patrolling overhead / orca silhouette transiting)
  B. Marine megafauna event (whale silhouette visible at surface above / pod of dolphins racing past the temple / whale-fall carcass on the courtyard floor)
  C. Weather above (storm darkening the surface light overhead / lightning faintly visible through the surface / heavy rain dimpling the dome above)
  D. Current event (sudden current pulling kelp horizontal across the pediment / silt-storm rolling across the seafloor / thermocline shimmer dividing the water)
  E. Bio-event (phosphorescent bloom rising around the ruin / dinoflagellate flash with movement / bioluminescent jellies drifting through the colonnade)
  F. Discovery moment (diver discovering an inscription for the first time / camera-flash from a far diver / submarine emerging from the deep blue)

NEVER use negation.`,
    touchpoints: [
      'a passing shark casts a long moving shadow across the colonnade, silhouette gliding from one end of the temple to the other',
      'storm clouds darken the surface dome above the ruin, the sunlit ceiling dimming to bruised grey',
      'sudden current pulls the kelp forest horizontal across the pediment, fronds streaming in a single direction',
      'phosphorescent bloom rising around the temple, cyan glow intensifying with every movement of the water',
      'whale silhouette visible above the surface dome, a massive shape blocking the sunlight in slow passing',
      'silt-storm rolling across the seafloor toward the ruin, a swelling dust-cloud advancing in the deep current',
      'diver appearing for the first time at the upper-frame edge, headlamp catching the broken pediment',
      'lightning flickering faintly through the surface dome, brief strobes lighting the deeper water in cold pulses',
      'pod of dolphins racing past the colonnade in the middle-distance, chevron of bodies moving as one through the blue',
      'bioluminescent jellies drifting through the colonnade, soft glow pulsing rhythmically as they pass between columns',
      'submarine emerging from the deeper blue beyond the ruin, hull-lights cutting twin beams toward the temple façade',
      'thermocline shimmer dividing the water column horizontally across the ruin, columns appearing distorted at the boundary',
    ],
    instructions: `Each entry 14-22 words. Subtle dramatic escalation. ADDS to the scene, doesn't replace. NEVER use negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PIRATES path-bespoke pools (2)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //
  // 3rd OceanBot path — Pirates-of-the-Caribbean cinema (Golden Age of
  // Piracy, 1650-1730). EVEN LEANER than shipwreck-kingdom + lost-cities:
  // only 2 path-bespoke pools because the hero pirate_scene entry
  // encodes setting + characters + action + atmosphere all in one rich
  // 18-22 word phrase. Lighting + atmosphere come from the universal
  // pools.
  //
  // EXCEPTION TO OCEANBOT NO-PEOPLE CONVENTION — pirates are visible
  // subjects, not distant scale-provers. But the SETTING (ocean / harbor
  // / island / deck / cove) still does as much visual work as the figures.

  pirate_scenes: {
    format: 'simple',
    theme: `PIRATE SCENES for OceanBot's pirates path — Pirates-of-the-Caribbean cinema, Golden Age of Piracy (1650-1730). Each entry is ONE specific maritime-cinema moment, 18-24 words. Setting + characters + action + atmosphere ALL BAKED INTO THE ENTRY — this is the HERO pool and carries 80% of the render.

⚠️ MANDATORY ERA — every scene is 1650-1730 Golden Age of Piracy. Wooden ships (galleons, frigates, brigs, sloops, schooners, brigantines), tricorn/bicorn hats, frock coats, sashes and bandoliers, cutlasses, flintlock pistols, lanterns, cannon-smoke. Caribbean / Atlantic / Mediterranean / Indian Ocean settings.

✓ VARIETY MANDATE — distribute across moment categories (~3 entries each):
  A. Ship at sea (galleon under full sail, brig running before storm, sloop hidden in fog, schooner racing dawn light)
  B. Boarding action / sea battle (two wooden hulls grappled, cutlasses + cannon smoke, broadside exchange, pirates swinging on boarding ropes)
  C. Harbor town night (Tortuga / Port Royal / Nassau lantern-lit waterfront, ships at anchor, tavern doorway spilling amber light)
  D. Hidden cove / tropical inlet (bonfire on white sand, longboats, treasure chests, palm silhouettes, careened ship)
  E. Captain / crew portrait (captain at helm during storm, lookout at masthead, crew unloading cargo, lookout glassing horizon)
  F. Below decks / interior (gun-deck mid-battle, captain's cabin candlelit, powder magazine, hammock-strung berth)
  G. Tropical anchorage / island base (Madagascar moonlit cove, mangrove-hidden careenage, glassy bay at dusk, jungle-pressed inlet)
  H. Period-specific named locations (Tortuga harbor, Port Royal raid, Nassau pirate republic, Maracaibo Spanish-fort attack, Madagascar pirate cove)

Each entry: ONE specific maritime cinema moment with explicit period-accurate detail (tricorn/cutlass/flintlock/lantern/etc) + ONE atmospheric anchor (golden hour / storm / lantern-glow / fog / etc) + ONE action or character beat. NO modern vessels. NO sea monsters. NO sunken ruins. NO ghost ships (those are other paths).

Visual register: "wallpaper-worthy / Pirates-of-the-Caribbean-poster cinematic." Setting carries mood as much as the figures.

DO write positively. NEVER write a banned-word negation. Speak the moment directly, vivid and specific.`,
    touchpoints: [
      'Pirate frigate breaking through fog bank at dawn, bow spray catching pink sunlight, three masts silhouetted, tattered black sails filling with morning wind.',
      'Two brigs locked hull-to-hull, grappling hooks taut, pirates swinging across on boarding ropes through cannon smoke, cutlasses gleaming in muzzle flash.',
      'Nassau harbor at twilight, wooden taverns glowing amber along the waterfront, seven pirate sloops anchored in turquoise shallows, torch smoke drifting over cobblestones.',
      'Secret Caribbean inlet at sunset, bonfire roaring on white sand, captured Spanish galleon careened offshore, treasure chests scattered open beside palm silhouettes.',
      'Pirate captain gripping the helm during hurricane, green lightning splitting black sky, ocean spray freezing mid-air, greatcoat whipping in gale winds.',
      'Broadside exchange at golden hour, pirate schooner versus Royal Navy frigate, cannon fire rippling down both hulls, smoke columns rising into orange sky.',
      'Longboat crew hauling gold-filled chests onto tropical beach, palm fronds overhead, the mothership anchored beyond the reef, bonfire smoke curling skyward.',
      'Tortuga tavern doorway spilling lantern light onto rain-slick stones, silhouettes of brawling pirates inside, Jolly Roger painted above the archway flapping wet.',
      'Pirate brigantine hidden deep in mangrove channels, careened at low tide, crew scraping barnacles from exposed hull, parrots screaming from twisted branches overhead.',
      'Gun deck below a galleon mid-battle, powder-blackened crew ramming 24-pounders, lantern light swinging violently, brass fittings gleaming through rolling cannon smoke.',
      'Pirate sloop racing before monsoon squall at sunset, full canvas straining, bow plunging through violet swells, storm wall towering black behind golden light.',
      'Madagascar anchorage at night, dozen pirate ships moored in glassy cove, lanterns reflected perfectly in still water, jungle shadows pressing close around the bay.',
      'Captain at the bowsprit in golden hour, one boot on the figurehead, spyglass raised, ocean glittering to horizon, crew working rigging behind him in silhouette.',
      'Lookout perched in the crow\'s nest at dawn, fog parting below to reveal an unsuspecting Spanish treasure galleon, hand cupped beside his mouth ready to shout.',
      'Pirate captain\'s cabin by candlelight, sea-stained charts spread across the table, brass dividers and a silver compass, lantern swinging slow with the ship\'s roll.',
    ],
    instructions: `Each entry is ONE specific Golden Age of Piracy moment, 18-24 words. Format: "subject + period-detail + atmosphere + action/beat." Vary across the 8 categories above. NEVER name modern vessels or modern weaponry. NEVER write negation language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines.`,
  },

  pirate_camera_framing: {
    format: 'simple',
    theme: `CAMERA FRAMING for OceanBot's pirates path — the explicit composition mandate. Each entry is ONE specific camera angle that the renderer must honor, 14-22 words.

⚠️ EXPLICIT CAMERA LANGUAGE — every entry NAMES the framing/angle as THE LAW. Without this mandate, Flux defaults to generic mid-shot regardless of the rest of the brief.

✓ VARIETY across framing categories — pirates-specific (above water, characters in frame, maritime cinema):
  A. LOW-ANGLE looking up at ship/figure (camera below deck-level, mast towering against sky / captain looming against storm)
  B. ABOVE-DECK aerial (sweeping pan above the ship's deck / harbor-aerial above moored fleet / overhead of boarding action)
  C. OVER-THE-SHOULDER (camera behind a pirate figure, gaze directed at the action / horizon / ship)
  D. WIDE ENVIRONMENTAL (vast ocean establishing shot, ship as one element in a sea-and-sky scene)
  E. CLOSE PORTRAIT (camera close to a single figure, ship-mass extending beyond frame)
  F. THROUGH-THE-FOREGROUND (rigging silhouette / mast-line / cannon barrel framing the action beyond)
  G. INTERIOR (camera inside the gun-deck / captain's cabin / harbor tavern / longboat, looking out or across)
  H. CINEMATIC SIDE-PROFILE (lateral framing of two ships, broadside engagement, full ship visible parallel to camera)

NEVER use negation. NEVER name modern cinema terms (dolly / dutch tilt / etc — anachronistic vocabulary).`,
    touchpoints: [
      'LOW-ANGLE looking up at the captain at the helm, sky towering behind him heavy with storm-clouds',
      'ABOVE-DECK aerial sweep along the full length of the gun-deck, crew parading below as cannon-smoke curls upward',
      'OVER-THE-SHOULDER framing behind the lookout in the crow\'s nest, his gaze locking onto an unsuspecting ship in the distance',
      'WIDE ENVIRONMENTAL ESTABLISHING shot, pirate galleon as one element on a vast golden-hour sea, horizon stretching the full width',
      'CLOSE PORTRAIT framing on the captain\'s face by lantern light, ship\'s wheel and rigging out-of-focus behind',
      'THROUGH-THE-RIGGING framing, taut hemp lines and shroud-ratlines silhouetted across the foreground, action visible between them',
      'INTERIOR FRAMING from the gun-deck shadow, cannon row receding into smoky depth, lantern light raking across powder-blackened crew',
      'CINEMATIC SIDE-PROFILE of two ships at broadside range, full hulls visible parallel to camera, cannon-smoke billowing between',
      'WORM\'S-EYE upward angle from waterline, ship\'s hull curving overhead like a wooden cathedral against bright sky',
      'OVER-THE-BOWSPRIT framing, camera behind the figurehead looking forward, horizon and approaching prize ship in the distance',
      'HARBOR-AERIAL framing above a moored fleet, dozens of ships and lantern-lights laid out in glassy still water below',
      'THROUGH-THE-TAVERN-DOORWAY framing, lantern-warmth spilling outward across cobblestones, brawling silhouettes inside',
      'SIDE-PROFILE long shot of a sloop racing before a storm, full canvas straining, dark storm-wall towering behind',
      'CLOSE-DETAIL of hands on the helm or cutlass-grip, the broader action softly blurring behind in the deeper plane',
      'AERIAL THREE-QUARTER above the deck during boarding action, multiple pirates swinging across on boarding ropes between the ships',
    ],
    instructions: `Each entry 14-22 words. Explicit camera angle / framing mandate. NEVER use negation. NEVER modern cinema terms (dolly / dutch / tilt-up). Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // GHOST-SHIP path-bespoke pools (2)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //
  // 4th OceanBot path — derelict pre-1850 wooden vessels drifting alone
  // through fog. Flying Dutchman energy. Eerie, beautiful, haunted — NOT
  // horror. NO CREW visible (pirates is the only crewed exception).
  // Same lean 2-pool shape as pirates: hero encodes vessel + state +
  // spectral atmosphere in one entry; supporting axes do less.

  ghost_ships: {
    format: 'simple',
    theme: `GHOST SHIPS for OceanBot's ghost-ship path — derelict pre-1850 wooden sailing vessels drifting alone, Flying Dutchman register. Each entry is ONE specific haunted/derelict moment, 18-24 words. Vessel + state + spectral atmospheric detail ALL BAKED INTO THE ENTRY — this is the HERO pool and carries 80% of the render.

⚠️ MANDATORY ANATOMY — every vessel is a pre-1850 WOODEN sailing ship: timber hull, hemp rigging, canvas sails, brass and iron fittings. Galleon, schooner, frigate, brig, sloop, brigantine, junk, longship, dhow, caravel, fluyt, ketch, clipper. Wood, rope, canvas, brass.

⚠️ NO CREW. NO LIVING PEOPLE. Empty decks. Unmanned helms. The ships are ALONE. (Skeletal/decayed forms occasionally OK as part of the haunting, but no living crew.)

✓ VARIETY MANDATE — distribute across haunted-vessel categories (~3 entries each):
  A. Fog drift (vessel emerging from / fading into rolling fog bank, partial silhouette visible)
  B. Becalmed / glassy (perfect calm, ship motionless on mirror-flat water, no wind in slack sails)
  C. Listing / capsized partial (heeled at dramatic angle, half-submerged, sinking-but-not-sunk)
  D. Encrusted / overgrown (barnacles armor-thick, kelp draping like Medusa hair, coral colonizing hull)
  E. Spectral lighting (lanterns burning blue/green on empty deck, bioluminescent plankton outlining hull)
  F. Arctic / ice-locked (frozen in pack ice, rigging crystallized, hull groaning under glacial pressure)
  G. Storm-impossible (calm hurricane eye / sailing into wind / crew-less ship racing impossibly)
  H. Crescent / fleet phantom (multiple derelicts drifting in formation, ghost-armada at horizon)
  I. Decayed period detail (figurehead splintered, gun ports empty, wheel spinning to no hand)
  J. Tropical / temperate setting (mangrove ghost, Caribbean derelict, monsoon-faded junk) — NOT all polar

Each entry: ONE specific vessel type + state + ONE spectral atmospheric anchor (fog / lantern-glow / bioluminescence / ice-encrustation / etc.) + ONE haunting beat. NO modern vessels. NO sea monsters / krakens (separate path). NO sunken-into-coral ruins (shipwreck-kingdom path).

Visual register: "eerie maritime ghost story" — haunting beauty, not gore-horror.

DO write positively. Speak the moment directly, vivid and specific.`,
    touchpoints: [
      'Three-masted schooner draped in tattered canvas, barnacles thick as armor, drifting sideways through midnight fog banks with shredded rigging trailing.',
      'Colonial galleon listing forty degrees, moonlight illuminating empty gun ports and a skeletal figurehead wrapped in rotting nets and seaweed.',
      'Fog-shrouded whaling ship emerging at dawn, harpoons still mounted, deck planks split and warped, oil barrels cracked open and leaking.',
      'Hurricane lanterns burning ghostly blue on empty quarterdeck, impossible flames reflected in calm black water under a starless sky.',
      'Phantom brigantine silhouetted against blood-red sunset, every rope and spar perfectly outlined, sails hanging in windless air like funeral shrouds.',
      'Clipper ship with shredded canvas racing at impossible speed against the prevailing wind, bow carving through glassy seas without a soul aboard.',
      'Seven derelict vessels drifting in perfect crescent formation under full moon, their shadows converging on empty water at the center.',
      'Ice-encrusted merchantman locked in arctic pack ice, rigging crystallized into frozen webs, hull groaning as glacier pressures slowly crush it.',
      'Bioluminescent plankton coating the entire hull in pulsing green light, outlining every plank seam on the drifting sloop like living circuitry.',
      'Battered schooner floating in the dead-calm hurricane eye, masts pointing at brilliant stars while walls of storm rage in perfect circle around it.',
      'Only the crow\'s nest and top fifteen feet of mainmast visible above waterline, ship\'s bell still hanging and rocking with subsurface currents.',
      'Dutch fluyt with hull so thick with barnacles the original wood is invisible, anchor chains hanging straight down into bottomless depths.',
      'Chinese junk with red sails bleached pink and shredded, dragon figurehead\'s paint flaking, drifting through fog thick as cotton batting.',
      'Privateer brig trailing hundreds of feet of kelp like Medusa\'s hair, the seaweed swaying in patterns suggesting movement through still water.',
      'Twin-masted ketch with every surface covered in white salt crystals, sparkling under moonlight, rigging frozen solid despite temperate seas.',
      'Caravel with moss-covered deck planks and small trees growing from split wood, roots penetrating deep into the hold below the empty decks.',
      'Mangrove-tangled brigantine deep in a tropical channel, hull half-swallowed by aerial roots, vines climbing the bare masts to the crow\'s nest.',
      'Frigate drifting at dusk with every lantern lit on empty decks, warm amber glow casting reflections across mirror-flat water with no shore in sight.',
      'Whaler with blubber pots overturned and rusted, crow\'s nest hanging by a single rope, jawbones of leviathans lashed to rotting rails.',
    ],
    instructions: `Each entry is ONE specific haunted derelict moment, 18-24 words. Format: "wooden vessel + state + spectral atmospheric anchor + one haunting beat." Vary across the 10 categories above. NEVER name modern vessels or living crew. NEVER write negation language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines.`,
  },

  ghost_ship_camera_framing: {
    format: 'simple',
    theme: `CAMERA FRAMING for OceanBot's ghost-ship path — the explicit composition mandate. Each entry is ONE specific camera angle that the renderer must honor, 14-22 words.

⚠️ EXPLICIT CAMERA LANGUAGE — every entry NAMES the framing/angle as THE LAW. Without this mandate, Flux defaults to generic mid-shot regardless of the rest of the brief.

✓ VARIETY across framing categories — ghost-ship register (above-water spectral, empty decks, atmospheric):
  A. LOW-ANGLE silhouette (camera from waterline, ship looming overhead against fogged sky)
  B. HORIZON LONG SHOT (vessel small / distant against vast sea + sky, scale-of-loneliness composition)
  C. ABOVE-DECK aerial (sweeping aerial pan along the empty deck — wheel spinning to no one)
  D. SIDE-PROFILE drift (lateral framing of the full ship parallel to camera, slow drift across frame)
  E. THROUGH-THE-FOG (camera close to thick fog wall, ship emerging / fading through veil)
  F. EMPTY-DECK interior (camera on the deserted quarterdeck, looking forward/aft, no hand on the helm)
  G. RIGGING SILHOUETTE (camera looking up through tattered shroud-ratlines and shredded canvas)
  H. WATERLINE close-up (camera at sea-level alongside the encrusted hull, looking up the strake-line)
  I. CREST-FALL approach (camera dipping into a swell, ship rising on the opposite swell at frame center)

NEVER use negation. NEVER name modern cinema terms.`,
    touchpoints: [
      'LOW-ANGLE silhouette from the waterline, derelict galleon looming overhead against bruised fogged sky',
      'HORIZON LONG SHOT, derelict ship tiny and distant against vast pale sea-and-sky, dwarfed by emptiness',
      'ABOVE-DECK aerial sweep along the empty quarterdeck, wheel spinning to no hand, rigging trailing into open ocean below',
      'SIDE-PROFILE drift framing, full barnacle-armored hull parallel to camera, slow lateral glide across frame',
      'THROUGH-THE-FOG framing, dense fog wall in immediate foreground, vessel\'s silhouette emerging only at the edges',
      'EMPTY-DECK INTERIOR framing, camera on the deserted quarterdeck looking forward toward the empty foremast and broken figurehead',
      'RIGGING SILHOUETTE looking up through tattered shroud-ratlines and shredded canvas at a moon-lit fogged sky',
      'WATERLINE CLOSE-UP alongside the encrusted hull, looking up the strake-line at the broken rail and tilted masts',
      'CREST-FALL approach, camera dipping into a swell, the ghost ship rising on the opposite swell at frame center',
      'OVER-THE-BOW framing from behind the broken bowsprit, looking forward into endless fog, no horizon visible',
      'AERIAL THREE-QUARTER above the listing wreck, ship heeled forty degrees, decks raked toward camera',
      'INSIDE-THE-FOG-BANK framing, ship dissolved into pale grey except for the silhouetted topmasts breaking through',
      'BACKLIT SILHOUETTE against red-bleeding sunset, every rope and spar carved as cutout against the dying sky',
      'LONG-LENS COMPRESSION shot at horizon distance, the derelict reading as a flat dark shape against luminous water',
      'CRESCENT-MOON BACKLIGHT framing, ship dark against pale lunar disc, sails hanging slack in airless calm',
    ],
    instructions: `Each entry 14-22 words. Explicit camera angle / framing mandate. NEVER use negation. NEVER modern cinema terms (dolly / dutch / tilt-up). Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // KRAKEN-LEVIATHAN path-bespoke pools (2)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //
  // 5th OceanBot path — sea monsters attacking pre-1850 wooden ships.
  // ONLY 4 creatures: kraken, giant squid, giant octopus, leviathan-whale.
  // Embodiment rule (whole-beast visible, never disembodied tentacles)
  // enforced via the KRAKEN_CREATURE_BLOCK in shared-blocks.js.
  // Same lean 2-pool shape as pirates / ghost-ship; hardest hero pool
  // of the bot because each entry must encode creature + embodiment +
  // specific wooden ship + attack moment + atmospheric register.

  kraken_scenes: {
    format: 'simple',
    theme: `KRAKEN/LEVIATHAN SCENES for OceanBot's kraken-leviathan path — sea monsters attacking pre-1850 wooden sailing ships. Each entry is ONE specific maritime-myth attack moment, 20-28 words. Creature + WHOLE-BODY embodiment + specific wooden ship + attack action + atmospheric register ALL BAKED INTO THE ENTRY — this is the HERO pool and carries 80% of the render.

⚠️ MANDATORY CREATURE — every entry features EXACTLY ONE of these four named beasts, NAMED EXPLICITLY in the entry:
  1. KRAKEN — multi-tentacled cephalopodic horror, massive bullet-mantle, single giant eye, Norse-myth scale
  2. GIANT SQUID — Architeuthis / colossal squid, eight arms + two whip-tentacles with hooked clubs, enormous bullet-mantle, single huge eye
  3. GIANT OCTOPUS — eight arms with rows of suckers, mottled red-brown skin, longboat-sized mantle, central beak
  4. LEVIATHAN-WHALE — Moby Dick / sperm whale / Bible-leviathan: ancient massive whale, scarred, harpoon-bristling back, single ancient eye, cathedral-door flukes
NEVER substitute another creature (no sea-serpents, dragon-turtles, megalodons, modern sharks, mermaids).

⚠️ EMBODIMENT MANDATORY — the creature's BODY must appear in the entry. Name the mantle / head / eye / bulk / shoulder / fluke alongside any arms or tentacles. A disembodied tentacle without the body alongside is the canonical failure mode for this path.

⚠️ SHIP MANDATORY — every entry includes a pre-1850 wooden sailing ship being attacked, with at least ONE period detail (oak hull / hemp rigging / cannon row / lateen yard / dragon-prow / etc.). Galleon, frigate, schooner, brig, sloop, longship, junk, whaler, caravel.

✓ VARIETY MANDATE — distribute across attack moments:
  A. Tentacle grapple (kraken/squid/octopus arm wrapping mast / hull / yard, body visible alongside)
  B. Breaching strike (leviathan-whale ramming hull / breaching upward / smashing rail)
  C. Whole-beast surfacing (mantle + eye rising beside ship, ship dwarfed in scale)
  D. Crew-deck struggle (creature reaching across deck, tiny figures in motion — small at distance)
  E. Bow / stern confrontation (creature blocking the ship's path / rising under bow)
  F. Aerial / aerial-three-quarter (top-down view of the attack, both creature and ship visible from above)
  G. Submerged glimpse (creature visible below the waterline, ship riding above unaware)
  H. Distant-myth (long-shot silhouette of monster + ship against horizon — scale-of-terror composition)
  I. Whale-specific (harpoon-bristling back / cathedral-door flukes raised / scarred eye meeting ship)

✓ CREATURE DISTRIBUTION — roughly equal split: ~6 kraken, ~6 giant squid, ~7 giant octopus, ~6 leviathan-whale per 25-entry pool.

DO write positively. Speak the moment directly, vivid and specific.`,
    touchpoints: [
      'Kraken erupting beside a Spanish galleon, mantle and single giant eye rising above the waterline, four tentacles wrapping the mainmast.',
      'Giant squid breaching alongside a frigate at dusk, bullet-mantle and huge unblinking eye level with the deck, two whip-tentacles arching over the rigging.',
      'Giant octopus draped across a foundering schooner, mottled red-brown mantle the size of a longboat dwarfing the hull, eight suckered arms pulling the rail down.',
      'Leviathan-whale breaching directly under a colonial brig, scarred sperm-whale flank smashing the keel skyward, cathedral-door flukes raised in spray-curtain.',
      'Kraken surfacing in a dawn fog bank, vast bullet-mantle a slate-grey mountain beside a Dutch East Indiaman, three tentacles already entangled in the mizzen rigging.',
      'Giant squid suspended below the waterline alongside a longship, body and eye visible through clear water, two whip-tentacles reaching up to caress the keel.',
      'Giant octopus folded over the foredeck of a junk, all eight arms in motion across rigging, central beak visible beneath the mantle\'s soft red bulk.',
      'Leviathan-whale ramming a Tudor warship broadside, scarred head crashing through oak hull amidships, single ancient eye locked on the rail in passing.',
      'Kraken seen from above attacking a Roman trireme, vast mantle dark beneath the water, four arms above surface coiling around oar-banks.',
      'Giant squid wrapped fully around a Caribbean sloop at sunset, bullet-mantle on one rail, eye on the other, arms enveloping the entire deck.',
      'Giant octopus rising from a calm sea beside a careened brigantine, suckered arms reaching across the exposed hull, mantle massive in the foreground water.',
      'Leviathan-whale slowly surfacing alongside a whaler, harpoon-bristling back breaching first, eye then meeting the crew\'s lookout in cathedral stillness.',
      'Kraken in storm-light rising beneath a clipper, mantle and eye breaking the wave-crest, multiple tentacles already higher than the topsail yard.',
      'Giant squid full-body silhouette in deep blue beside a galleon\'s submerged stern, body curled, whip-tentacles reaching upward toward the rudder.',
      'Giant octopus mantle and beak visible at the bowsprit of a privateer, eight arms wrapping the entire forecastle, mottled colors pulsing across the head.',
      'Leviathan-whale flukes-aloft at the stern of a fluyt, body cathedral-vast in the water below, tiny crew dwarfed on the heeling deck.',
      'Kraken breaching as a four-armed mountain beside a Phoenician bireme, single eye reflecting torchlight, painted prow inches from the cephalopodic head.',
      'Giant squid surfacing alongside a Chinese junk in monsoon dusk, mantle the same red as the sails, eye reflecting lantern-flame from the stern.',
      'Giant octopus seen from aerial three-quarter, all eight arms spread across a foundering schooner, central mantle and beak visible at the deck\'s center.',
    ],
    instructions: `Each entry is ONE specific maritime-myth attack moment, 20-28 words. Format: "named creature + body/embodiment + specific wooden ship + attack action + atmospheric anchor." Vary across the 9 attack-moment categories above. Vary across all 4 creatures (~6 each). NEVER substitute another creature. NEVER write a disembodied limb without the body alongside. NEVER write negation language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines.`,
  },

  kraken_camera_framing: {
    format: 'simple',
    theme: `CAMERA FRAMING for OceanBot's kraken-leviathan path — the explicit composition mandate. Each entry is ONE specific camera angle that the renderer must honor, 14-22 words.

⚠️ EXPLICIT CAMERA LANGUAGE — every entry NAMES the framing/angle as THE LAW. Without this mandate, Flux defaults to generic mid-shot regardless of the rest of the brief.

✓ VARIETY across framing categories — kraken-leviathan-specific (above water, both creature AND ship in frame, monumental scale):
  A. LOW-ANGLE looking up (camera from deck-level, creature mantle towering against sky)
  B. WIDE ENVIRONMENTAL (vast horizon establishing shot, creature + ship as elements in a sea-and-sky scene)
  C. AERIAL THREE-QUARTER (top-down + perspective, both creature and ship visible from above)
  D. SIDE-PROFILE long shot (lateral framing of creature beside ship, full silhouettes against horizon)
  E. THROUGH-THE-RIGGING (mast-line + shroud-ratlines silhouetted across the foreground, creature visible beyond)
  F. WATERLINE close-up (camera at sea-level, creature mantle and ship hull both rising massive overhead)
  G. SUBMERGED HALF-AND-HALF (camera at the air-water boundary, creature visible below + ship above)
  H. DRAMATIC LOW from the deck (camera among the crew, creature looming above the bowsprit / stern / midship)
  I. STERN-CHASE composition (camera behind the ship, creature surfacing dead ahead or astern)

NEVER use negation. NEVER name modern cinema terms.`,
    touchpoints: [
      'LOW-ANGLE looking up from the foredeck, creature mantle towering against bruised storm-sky behind the ship',
      'WIDE ENVIRONMENTAL ESTABLISHING shot, both creature and ship rendered as elements in vast sea-and-sky',
      'AERIAL THREE-QUARTER framing, creature body and ship deck both visible from above the action',
      'SIDE-PROFILE LONG SHOT, full creature silhouette beside full ship silhouette against bright horizon',
      'THROUGH-THE-RIGGING framing, taut shrouds silhouetted across the foreground, creature mantle visible beyond',
      'WATERLINE CLOSE-UP at sea-level, creature mantle and ship hull both massive overhead, sky a narrow band above',
      'SUBMERGED HALF-AND-HALF framing, creature visible below waterline, ship hull above riding the swell',
      'DRAMATIC LOW from the deck among crew silhouettes, creature looming above the bowsprit blocking the sky',
      'STERN-CHASE composition, camera behind the ship\'s wake, creature surfacing in the foreground astern',
      'BOW-CONFRONTATION framing, camera ahead of the ship at sea-level, creature rising directly in its path',
      'OVER-THE-DECK aerial sweep along the ship\'s length, creature visible alongside coiling across the rigging',
      'SILHOUETTE STORM BACKLIGHT framing, both creature and ship carved as black cutouts against lightning-lit sky',
      'OVER-THE-CRESTING-WAVE framing, ship pitched on a swell, creature breaching in the wave-trough beyond',
      'EXTREME LONG SHOT establishing the SCALE-OF-TERROR, ship tiny against the immense creature body in deep distance',
      'BREACHING-VIEW from sea-level, leviathan flukes filling the sky, ship dwarfed in the foreground shadow',
    ],
    instructions: `Each entry 14-22 words. Explicit camera angle / framing mandate. NEVER use negation. NEVER modern cinema terms (dolly / dutch / tilt-up). Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // DEEP-WONDER path-bespoke pools (2)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //
  // 6th OceanBot path, FIRST of 5 scenic — bioluminescent beauty,
  // alien elegance, deep-sea creatures with inner light. Beauty in
  // the darkness, NOT horror. NO ships / no people / no diving gear.
  // Same lean 2-pool shape as the other paths.

  deep_wonder: {
    format: 'simple',
    theme: `DEEP WONDER for OceanBot's deep-wonder path — bioluminescent deep-sea creatures rendered as alien elegance. Each entry is ONE specific deep-sea creature in a luminous moment, 18-26 words. Creature + bioluminescent glow detail + abyssal context ALL BAKED INTO THE ENTRY — this is the HERO pool.

⚠️ MANDATORY REGISTER — every entry is a BIOLUMINESCENT or TRANSLUCENT deep-sea creature, its body the primary light source in the frame, surrounded by inky abyssal darkness. NatGeo-deep-ocean documentary register — alien but real.

⚠️ NO PEOPLE. NO SHIPS. NO DIVING GEAR. NO SUBMARINES. NO TREASURE. Just the creature and the dark.

✓ VARIETY MANDATE — distribute across deep-sea bioluminescent creatures:
  A. Jellyfish family (atolla / crystal jelly / box jellyfish / colossal lion's mane — radial glow, trailing tentacle-curtain)
  B. Siphonophore / Portuguese man o' war (long luminous chain colony, sequential lights along the body)
  C. Ctenophore / comb jelly (iridescent comb-rows pulsing rainbow light along the body)
  D. Vampyroteuthis / cirrate octopus (deep-sea cephalopod with photophore-studded body, web-like arms)
  E. Anglerfish lure (esca glowing at the end of the dorsal lure, dark body otherwise barely visible)
  F. Lantern-fish school (constellation of photophore-dotted bodies arranged like stars in the dark)
  G. Glass squid (translucent body with internal organs glowing, eyes huge and luminous)
  H. Bioluminescent shark / dwarf lantern shark (belly glowing for counter-illumination)
  I. Hatchetfish / dragonfish (rows of belly photophores, deep-sea hunter with internal lights)
  J. Plankton/bacterial bloom (entire water column glowing cyan from billions of dinoflagellates, no central creature — atmospheric whole-frame glow)

Each entry: ONE specific creature + ONE specific glow/light-source detail + ONE abyssal-context anchor (depth-blue darkness / plankton-motes / cathedral-stillness / etc.). Speak vivid and specific.

DO write positively. NEVER negation.`,
    touchpoints: [
      'Atolla jellyfish pulsing red bioluminescent rim around its bell, eight long tentacles trailing into inky abyssal black, plankton motes glowing cyan around it.',
      'Siphonophore colony stretched fifteen meters through deep darkness, sequential blue lights firing along its chain-body like a celestial telegraph.',
      'Crystal jellyfish drifting with translucent bell catching only its own pale green photophore-light, water around it absolute black void.',
      'Ctenophore pulsing iridescent rainbow light along its eight comb-rows, body translucent against a depth-blue background, no other light source.',
      'Vampyroteuthis curled into web-arms ball, photophores studding its dark mantle in constellation-pattern, single huge eye reflecting faint blue glow.',
      'Anglerfish lure glowing bright green at the end of its dorsal stalk, the rest of the fish barely a shadow in the surrounding black.',
      'Lantern-fish school arranged like a galaxy in the dark, each body marked with rows of yellow-green photophores, drifting in silent formation.',
      'Glass squid suspended motionless, translucent body revealing internal organs glowing soft amber, two enormous luminous eyes dominating the frame.',
      'Dwarf lantern shark cruising slow with belly photophores glowing soft cyan for counter-illumination, dorsal silhouette dissolving into the dark above.',
      'Hatchetfish hovering edge-on in deep mid-water, rows of belly photophores casting cool downward light, mirror-silver flank reflecting plankton-glow.',
      'Comb jelly drifting close to camera, full body iridescent with shifting rainbow combs, particulate-thick water pierced by drifting glow.',
      'Box jellyfish elegant in deep mid-water, four long tentacles trailing translucent below glowing cube-shaped bell, soft blue inner pulse.',
      'Sea-firefly bloom suffusing the entire water column with cyan particulate, no central creature visible, the dark itself rendered luminous.',
      'Dragonfish stationary in absolute black, rows of belly photophores firing in slow sequence, long barbel glowing emerald at the tip.',
      'Colossal lion\'s mane jelly drifting through abyssal twilight, dome-bell forty feet across, hundreds of tentacles trailing in radial luminous curtain.',
      'Portuguese man o\' war suspended below surface, gas-filled float catching pale blue surface-glow, long tentacles trailing iridescent below.',
      'Cirrate octopus floating with web-like arms outstretched, photophore-studded body soft-glowing amber, oversized eyes facing camera.',
      'Pyrosome colony drifting as a single long luminous tube through the dark, walls of the colony glowing cool blue from within.',
      'Bioluminescent plankton swirl spiraling outward from camera-motion disturbance, every disturbed micro-organism flaring cyan for an instant.',
    ],
    instructions: `Each entry is ONE specific bioluminescent deep-sea creature, 18-26 words. Format: "creature + specific glow detail + abyssal context." Vary across the 10 categories above. NEVER include people / ships / divers / submarines. NEVER write negation language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines.`,
  },

  deep_wonder_camera_framing: {
    format: 'simple',
    theme: `CAMERA FRAMING for OceanBot's deep-wonder path — the explicit composition mandate. Each entry is ONE specific camera angle that the renderer must honor, 14-22 words.

⚠️ EXPLICIT CAMERA LANGUAGE — every entry NAMES the framing/angle as THE LAW. Without this mandate, Flux defaults to generic mid-shot regardless of the rest of the brief.

✓ VARIETY across framing categories — deep-wonder-specific (creature is the only light source, abyssal black backdrop):
  A. CLOSE-UP on creature glow (camera near the photophores or comb-rows, body filling the frame)
  B. SILHOUETTE-IN-DEPTH (creature small in vast black, single luminous shape in empty water)
  C. LOOKING-UP from below (creature backlit against a pale surface dome above, body silhouetted)
  D. PARTICULATE-FOREGROUND (drifting plankton or marine snow in close foreground, creature beyond)
  E. THROUGH-THE-JELLY-CURTAIN (camera looking through hanging jellyfish tentacles, second creature beyond)
  F. SIDE-PROFILE drift (lateral framing of full creature parallel to camera, slow drift across frame)
  G. ABYSSAL TOP-DOWN (camera above, creature far below in the dark, scale-of-emptiness composition)
  H. EYE-LEVEL CONFRONTATION (camera meeting the creature's eye directly, intimate alien gaze)
  I. WIDE COSMIC (creature small against a swirl of plankton-glow filling the frame, galaxy-of-the-deep composition)

NEVER use negation. NEVER name modern cinema terms.`,
    touchpoints: [
      'CLOSE-UP on the creature\'s photophore row, body filling the frame, surrounding water rendered absolute black',
      'SILHOUETTE-IN-DEPTH framing, creature small and luminous in vast empty water, single shape in the dark',
      'LOOKING-UP from below, creature backlit against pale surface dome high above, body in soft silhouette',
      'PARTICULATE-FOREGROUND framing, drifting plankton motes in close foreground, glowing creature beyond in the dark',
      'THROUGH-THE-JELLY-CURTAIN framing, hanging tentacles silhouetted across the foreground, second creature glowing beyond',
      'SIDE-PROFILE drift framing, full creature body parallel to camera, slow lateral glide across the dark frame',
      'ABYSSAL TOP-DOWN angle, camera high above looking straight down, creature far below as a single luminous spot',
      'EYE-LEVEL CONFRONTATION framing, camera meeting the creature\'s huge luminous eye directly, intimate alien gaze',
      'WIDE COSMIC framing, creature small against a swirl of plankton-glow filling the frame like a galaxy of the deep',
      'EXTREME CLOSE on the dangling esca lure, the rest of the anglerfish dissolved into the surrounding black',
      'BACKLIT-CONSTELLATION framing, lantern-fish school arranged like stars against absolute black depth',
      'LATERAL TRACKING shot along the length of a siphonophore colony, sequential photophore-lights firing in succession',
      'COUNTER-ILLUMINATION VIEW from below, creature belly-photophores firing soft downward against the surface light',
      'BIOLUMINESCENT SWIRL framing, creature centered in a vortex of disturbed plankton flaring cyan around it',
      'TRANSLUCENT-X-RAY framing, internal organs of the creature glowing soft against translucent body, depth-blue beyond',
    ],
    instructions: `Each entry 14-22 words. Explicit camera angle / framing mandate. NEVER use negation. NEVER modern cinema terms. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // WHALE-ENCOUNTER path-bespoke pools (2)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //
  // 7th OceanBot path, 2nd scenic — NatGeo / Blue Planet whale
  // documentary register. Naturalistic, NOT mythic — the kraken-
  // leviathan path handles Moby-Dick-leviathan myth. NO SHIPS,
  // NO PEOPLE, NO DIVING GEAR.

  whale_encounter: {
    format: 'simple',
    theme: `WHALE ENCOUNTER for OceanBot's whale-encounter path — real cetacean species in real ocean settings, rendered with anatomical accuracy. NatGeo / BBC-Blue-Planet register. Each entry is ONE specific species in ONE specific behavior moment, 18-26 words. Species + behavior + setting ALL BAKED INTO THE ENTRY — this is the HERO pool.

⚠️ MANDATORY — every entry is a REAL cetacean species, NAMED EXPLICITLY in the entry, in a REAL ocean setting, doing a REAL species-typical behavior. NOT mythic, NOT giant-Moby-Dick-leviathan. Photographic anatomical accuracy.

⚠️ NO SHIPS. NO PEOPLE. NO HARPOONS. NO DIVING GEAR. NO BOATS. Just the whale and the ocean.

✓ SPECIES VARIETY MANDATE — distribute across cetacean species (~2-3 per species):
  A. Humpback whale (breach, fluke-slap, bubble-net feeding, song display, mother-calf)
  B. Blue whale (open-pelagic glide, surface blow, deep dive arch)
  C. Orca (pod travel, hunting cooperative, spy-hop, breaching display, mother-calf)
  D. Gray whale (calf-protection in lagoon, migration column, breach in coastal shallows)
  E. Sperm whale (deep sounding, surface logging, social pod gathering, fluke-up dive)
  F. Beluga whale (arctic-ice surface, melon-flexing, pod travel through pack ice)
  G. Narwhal (tusk display, arctic ice surfacing, social-cluster pod)
  H. Fin whale (open-ocean cruise, asymmetric jaw flash, surface blow)
  I. Right whale (callosity-covered head surfacing, surface skimming for plankton)
  J. Bowhead (arctic ice-breaking surface, callus-free smooth head, breaching slow)
  K. Whale-shark crossover (filter-feeding surface gulp — yes, technically a shark but in same NatGeo register)
  L. Minke whale (curious approach, surface skim)

✓ BEHAVIOR VARIETY MANDATE — vary across behaviors:
  - Breaching (full-body explosive leap)
  - Fluke-slap (powerful tail strike at surface)
  - Spy-hopping (vertical head out of water)
  - Bubble-net feeding (cooperative spiral)
  - Mother-with-calf (gentle pairing)
  - Pod travel (group cohesion, formation)
  - Sounding / deep dive (fluke-up arc)
  - Surface logging (resting at surface)
  - Mating/song display
  - Cooperative hunting (orca pods)

Each entry: ONE specific named species + ONE specific behavior + ONE setting anchor (open pelagic / polar pack ice / coastal lagoon / surface / underwater glide / etc.). Speak vivid and specific.

DO write positively. NEVER negation.`,
    touchpoints: [
      'Humpback whale breaching full-body from a deep Pacific swell, pectoral fins outstretched, twenty tons suspended momentarily against pale dawn sky.',
      'Blue whale gliding in horizontal deep-blue mid-water, mottled flank stretching forty meters past camera, single eye reflecting filtered surface light.',
      'Orca pod traveling in tight formation along an Antarctic ice-edge, six tall dorsal fins cutting the swell, mother and calf in the lead.',
      'Gray whale mother shielding her calf in a calm Baja lagoon, both backs barely breaking the silver surface, eye contact with calm intelligence.',
      'Sperm whale fluke-up sounding into deep blue, massive triangular fluke held vertical above surface, body already disappearing into the dark below.',
      'Beluga pod surfacing through cracks in arctic pack ice, white melons gleaming wet, breath crystallizing in the polar air above.',
      'Narwhal tusk-clash display in arctic open water, two males raising spiraled tusks above the surface in slow contact, ice floes drifting around them.',
      'Fin whale cruising at surface in open Atlantic, asymmetric white right jaw flashing as it rolls, twenty-meter body trailing wake behind.',
      'Right whale skim-feeding at the surface, callosity-covered head plowing through calm water with baleen plates open, krill streaming around the jaw.',
      'Bowhead whale breaking through thin arctic ice from below, smooth callous-free head emerging slow, gentle ripples spreading across mirror water.',
      'Humpback bubble-net feeding cooperative, six whales rising in spiral with mouths agape through a cylinder of bubbles, herring boiling at the surface.',
      'Whale-shark filter-feeding at the surface in tropical Indonesia, broad pale-spotted back at the surface, mouth wide as it gulps plankton.',
      'Minke whale curious approach in temperate water, sleek pointed rostrum lifting just above surface to investigate camera, single eye visible.',
      'Orca breaching at sunset in the Salish Sea, full body airborne against amber sky, two pod members surfacing beside in the silver wake.',
      'Sperm whale pod social-logging at surface, four cetaceans resting in parallel formation, blowholes synchronously exhaling vapor in the calm.',
      'Humpback mother nudging her newborn calf to the surface for first breath, both backs barely above water in a tropical breeding lagoon.',
      'Blue whale surface blow at dawn, towering vertical column of vapor catching pink sunrise light, body cruising slow with subsurface bulk visible.',
      'Orca cooperative hunt of a seal on an ice floe, pod surging together to wave-wash the prey into water, coordinated intelligence visible.',
      'Humpback whale song display at depth, single male suspended vertical with head down, body posture and bubble-stream of audible vocalization.',
    ],
    instructions: `Each entry is ONE specific real cetacean in ONE specific behavior in ONE setting, 18-26 words. Format: "named species + behavior + setting + sensory detail." Vary across species and behaviors per the mandates above. NEVER include ships / boats / people / harpoons / diving gear. NEVER write negation language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines.`,
  },

  whale_encounter_camera_framing: {
    format: 'simple',
    theme: `CAMERA FRAMING for OceanBot's whale-encounter path — the explicit composition mandate. Each entry is ONE specific camera angle that the renderer must honor, 14-22 words.

⚠️ EXPLICIT CAMERA LANGUAGE — every entry NAMES the framing/angle as THE LAW. Without this mandate, Flux defaults to generic mid-shot regardless of the rest of the brief.

✓ VARIETY across framing categories — whale-documentary-specific:
  A. UNDERWATER SIDE-PROFILE (camera underwater, whale gliding past parallel, full body visible)
  B. SURFACE-LEVEL eye-contact (camera at waterline, whale's eye meeting lens)
  C. AERIAL OVERHEAD (drone-style top-down, whale or pod visible against deeper blue)
  D. BREACH MOMENT (low waterline angle, whale airborne above camera against sky)
  E. FLUKE-UP DIVE (camera at surface, whale's tail filling vertical frame as it sounds)
  F. POD FORMATION (wide environmental shot, multiple whales arranged in frame)
  G. MOTHER-CALF intimacy (close framing on pair, gentle proximity, subordinate scale to mother)
  H. SPLIT-LEVEL half-and-half (camera at air-water boundary, whale visible below + surface event above)
  I. SCALE-PROVING WIDE (whale tiny against vast ocean, sense of pelagic immensity)
  J. UNDERWATER-LOOKING-UP (camera below whale, animal silhouetted against bright surface dome)

NEVER use negation. NEVER name modern cinema terms.`,
    touchpoints: [
      'UNDERWATER SIDE-PROFILE framing, whale gliding parallel to camera at mid-water depth, full body filling horizontal frame',
      'SURFACE-LEVEL eye-contact framing, camera at waterline, whale\'s eye meeting lens with calm intelligence',
      'AERIAL OVERHEAD drone-style framing, whale or pod visible from above against deeper blue water',
      'BREACH MOMENT low-waterline angle, whale airborne above camera against pale sky, full body suspended in spray',
      'FLUKE-UP DIVE framing from surface level, massive triangular tail filling vertical frame as the whale sounds',
      'POD FORMATION wide environmental shot, multiple whales arranged in cohesive group across frame, ocean stretching beyond',
      'MOTHER-CALF intimacy framing, close on the gentle pair, calf small against mother\'s scale, no other subject',
      'SPLIT-LEVEL HALF-AND-HALF framing at air-water boundary, whale body visible below, surface blow visible above',
      'SCALE-PROVING WIDE shot, whale tiny against vast pelagic ocean, sense of immense scale and isolation',
      'UNDERWATER LOOKING UP, whale silhouetted against bright surface dome above, body backlit by sun-shafts',
      'EYE-LEVEL APPROACH framing, whale swimming toward camera in mid-water, scale growing as it nears',
      'TAIL-CHASE framing from behind, whale\'s flukes propelling away from camera, wake trailing in clear water',
      'OVER-THE-MELON framing close on whale\'s head, eye visible, body extending behind out of frame',
      'SUBMERGED PROFILE BACKLIT, whale silhouette in mid-water with surface light penetrating from above in shafts',
      'POLAR ICE-EDGE framing, whale at surface beside floating sea-ice, white-on-blue composition with cetacean as anchor',
    ],
    instructions: `Each entry 14-22 words. Explicit camera angle / framing mandate. NEVER use negation. NEVER modern cinema terms. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // REEF-PARADISE path-bespoke pools (2)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //
  // 8th OceanBot path, 3rd scenic — tropical shallow-water coral reef
  // in maximum biodiversity. Counterpoint to deep-wonder (sun-lit
  // instead of abyssal-dark). NO SHIPS, NO PEOPLE, NO DIVING GEAR.

  reef_scenes: {
    format: 'simple',
    theme: `REEF SCENES for OceanBot's reef-paradise path — tropical shallow-water coral reef in maximum biodiversity. NatGeo / BBC-Blue-Planet register. Each entry is ONE specific reef moment with multi-species composition, 20-28 words. Reef structure + fish/inverts + biodiversity moment ALL BAKED INTO THE ENTRY — this is the HERO pool.

⚠️ MANDATORY REGISTER — every entry is a REAL Indo-Pacific / Caribbean / Coral-Triangle / Red Sea / Great-Barrier reef ecosystem. Sun-shafted shallow tropical water (gin-clear or sun-dappled), razor-sharp coral structure, multiple species visible together.

⚠️ NO SHIPS. NO PEOPLE. NO SCUBA GEAR. NO BOATS. Just the reef and its inhabitants.

✓ VARIETY MANDATE — distribute across reef-scene categories:
  A. CORAL HEAD + ANEMONE FISH (clownfish darting through anemone tentacles on a brain-coral dome)
  B. SCHOOL THROUGH REEF (silverside / fusilier / snapper school streaming through a coral channel)
  C. MEGAFAUNA AT REEF (reef shark / manta ray / sea turtle cruising along reef wall)
  D. STAGHORN/ELKHORN FOREST (dense branching coral forest with parrotfish grazing)
  E. SEA-FAN CORNICE (purple gorgonian fans with butterflyfish hovering, vertical reef wall)
  F. REEF-EDGE BLUE-WATER DROP-OFF (reef shelf meeting deep blue, schools at the boundary)
  G. SAND-CHANNEL between bommies (rays cruising sand between coral heads)
  H. NIGHT REEF (coral polyps extended, lionfish hunting, parrotfish in mucous cocoon)
  I. CLEANING-STATION (cleaner wrasses tending to a grouper / shark / turtle)
  J. SEA-GRASS MEADOW edge (turtles grazing, juvenile fish using grass as nursery)
  K. RAY-ON-SAND (eagle ray / spotted ray gliding over white sand between corals)
  L. APEX HUNTER PASS (gray reef shark / great barracuda / giant trevally cruising the reef-line)
  M. SPAWNING/AGGREGATION moment (mass coral spawn / fish aggregation at dusk)
  N. CEPHALOPOD HIDE (octopus / cuttlefish camouflaged on coral, color-changing in motion)
  O. CAVE/SWIM-THROUGH (light from cavern entrance, fish silhouetted)

Each entry: ONE reef-structure anchor + ONE specific dweller species (or school) + ONE atmospheric or light detail. Names species explicitly. Multiple species in one entry OK; but ONE dominant action/moment per entry.

DO write positively. NEVER negation.`,
    touchpoints: [
      'Clownfish family darting through magnificent anemone on a brain-coral dome, sun-shafts dappling purple sea-fans behind, electric-blue chromis schooling above.',
      'Fusilier school streaming through a coral channel in razor-sharp gin-clear water, sun-shafts catching their flanks against staghorn coral walls.',
      'Whitetip reef shark cruising slow along a vertical reef wall, sea-fans waving above, schooling jacks parting around its passage.',
      'Staghorn coral forest dense across the foreground, parrotfish flock chewing audibly at the branches, sun-dappled mosaic across every surface.',
      'Purple gorgonian sea-fan dominating mid-frame on a vertical wall, butterflyfish hovering in pairs, gin-clear water revealing deep blue beyond.',
      'Reef-edge drop-off, hard coral table meeting deep blue, eagle ray cruising past with school of jacks following in formation.',
      'Sand channel between massive bommies, blue-spotted ray gliding low across the white sand, coral heads framing both sides.',
      'Night reef with coral polyps fully extended, red lionfish hunting glassfish in pillar coral shadow, single dive-light beam illuminating one head.',
      'Cleaning station on a coral outcrop, cleaner wrasse tending to a giant grouper hovering with mouth and gills open.',
      'Sea-grass meadow at reef edge, green sea-turtle grazing in afternoon sun-shafts, juvenile reef fish hiding in the blades.',
      'Eagle ray gliding diagonally over white sand between massive coral bommies, wingtips brushing past sea-fans, sun-mosaic on its back.',
      'Gray reef shark patrolling the reef line in mid-water, deep blue beyond the drop-off, jacks streaming above in dense column.',
      'Mass coral spawn at dusk, billions of pink gamete bundles drifting upward, schooling fish gathering to feed on the bloom.',
      'Day octopus camouflaged on a coral head, mottled red-and-brown skin matching the substrate, single suckered arm trailing into a crevice.',
      'Cavern swim-through, light shafts cutting from the cave entrance, glassfish school silhouetted against the bright opening.',
      'Anthias swarm above an Indo-Pacific reef, thousands of orange-pink females hovering over hard coral, single male flashing display colors.',
      'Caribbean elkhorn coral thicket in clear shallows, blue tang school weaving through branches, sergeant majors guarding nests on coral plates.',
      'Manta ray banking over a Maldivian reef, mouth wide as it filter-feeds plankton, cleaner wrasses attending its underside.',
      'Hawksbill turtle resting on a Coral Triangle pinnacle, scarred shell encrusted, two cleaner shrimp picking algae from its eye-ridge.',
    ],
    instructions: `Each entry is ONE specific reef moment, 20-28 words. Format: "reef-structure anchor + named species + atmospheric/light detail." Vary across the 15 categories above. NEVER include ships / boats / people / scuba gear. NEVER write negation language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines.`,
  },

  reef_camera_framing: {
    format: 'simple',
    theme: `CAMERA FRAMING for OceanBot's reef-paradise path — the explicit composition mandate. Each entry is ONE specific camera angle that the renderer must honor, 14-22 words.

⚠️ EXPLICIT CAMERA LANGUAGE — every entry NAMES the framing/angle as THE LAW. Without this mandate, Flux defaults to generic mid-shot regardless of the rest of the brief.

✓ VARIETY across reef-specific framing:
  A. WIDE REEF VISTA (vast reef structure with depth, multi-tier biodiversity readable)
  B. CLOSE CORAL DETAIL (camera near a coral head, polyps/texture filling frame)
  C. THROUGH-CORAL framing (camera looking through a coral arch / swim-through / cave)
  D. SCHOOL-WALL (camera close to a fish school filling the frame, reef visible beyond)
  E. REEF-EDGE DROP-OFF (split composition: coral shelf foreground, deep blue beyond)
  F. UNDERWATER LOOKING UP (reef silhouetted against bright sun-dome at surface)
  G. OVER-THE-CORAL aerial (top-down on coral spread across the seafloor)
  H. EYE-LEVEL with a single creature (turtle / shark / octopus at lens-level)
  I. SAND-CHANNEL TRACK (lateral camera moving along sand between bommies)
  J. APEX-PREDATOR PASS (camera at distance watching shark/ray cruise reef line)

NEVER use negation. NEVER name modern cinema terms.`,
    touchpoints: [
      'WIDE REEF VISTA framing, vast multi-tier reef structure stretching from foreground coral into blue distance',
      'CLOSE CORAL DETAIL framing, camera near a coral head with polyps and texture filling the foreground frame',
      'THROUGH-CORAL framing, camera looking through a swim-through arch, light streaming from the far opening',
      'SCHOOL-WALL framing, dense fish school filling the foreground, reef structure visible through gaps in the school',
      'REEF-EDGE DROP-OFF framing, coral shelf in close foreground, vast deep blue stretching beyond into depth',
      'UNDERWATER LOOKING UP, reef silhouetted against the bright sun-dome surface, sun-shafts cutting downward',
      'OVER-THE-CORAL aerial framing, top-down on coral colonies spread across the seafloor in mosaic pattern',
      'EYE-LEVEL with a single creature, turtle or shark at lens height meeting the camera with calm presence',
      'SAND-CHANNEL TRACK framing, lateral camera moving along white sand between coral bommies on both sides',
      'APEX-PREDATOR PASS framing, camera at distance watching a shark or ray cruise along the reef line',
      'EXTREME WIDE-ANGLE reef panorama, dome-port distortion stretching reef horizon-to-horizon',
      'OVER-THE-FAN framing, purple gorgonian sea-fan dominating foreground, fish hovering beyond in clear water',
      'POLYP MACRO framing, individual coral polyps in full extension filling the frame with tentacle detail',
      'BACKLIT-SCHOOL framing, fish school silhouetted against bright surface light, individual silhouettes readable',
      'OVER-THE-SHOULDER OF A REEF DWELLER, camera behind a turtle or grouper looking at its world from its perspective',
    ],
    instructions: `Each entry 14-22 words. Explicit camera angle / framing mandate. NEVER use negation. NEVER modern cinema terms. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Universal pools (3) — shared across all OceanBot paths
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  lighting: {
    format: 'simple',
    theme: `UNIVERSAL OCEAN LIGHTING modes for OceanBot. Each entry is ONE lighting register used across any of the 10 OceanBot paths (deep-sea, polar, storm, whale, mermaid-myth removed, ghost-ship, pirates, etc.). 14-22 words.

⚠️ MEDIUM-AGNOSTIC — works for photography / canvas / watercolor / illustration. Don't lock to one medium.

✓ VARIETY across (ocean-themed lighting types):
  A. Submarine / underwater (caustic sun-shafts, dappled water-light, deep-blue diffuse, bioluminescent-glow)
  B. Surface / daylight (golden-hour rake, blue-hour hush, dawn coral, overcast cool diffuse)
  C. Night / moon (full-moon silver, crescent-moon faint blue, starlit cool, moon-through-cloud)
  D. Storm / weather (lightning flash, storm-break sun-shaft, rainfall diffuse)
  E. Artificial (fish-oil lantern, ship-lantern glow, distant lighthouse beam)
  F. Polar / cold (glacial-cyan diffuse, aurora, low-sun amber on ice)
  G. Chiaroscuro (strong rim-light against dark void, candlelit, Caravaggio-cold contrast)

NEVER use negation.`,
    touchpoints: [
      'submarine caustic sun-shafts dappling the water column, cool aqua-and-green light playing across surfaces',
      'low golden-hour rake across the ocean surface, warm-amber chiaroscuro, deep cool shadow extending into the distance',
      'full-moon silver halo painting everything cool-blue, scattered moonlight glinting across the water surface',
      'lightning-flash mid-strike, stark cold-white illumination, dramatic chiaroscuro carving deep shadow',
      'bioluminescent plankton-glow rising in cyan-blue, cool light pooling on the surface, depth-dark beneath',
      'dawn coral-wash across the horizon, pink-and-amber gradient melting into the deep sea',
      'overcast diffuse cool-grey light, no harsh shadows, even illumination throughout the scene',
      'fish-oil lantern warm chiaroscuro from a single source, classical Caravaggio-cold darkness in the surround',
      'glacial-cyan diffuse polar light, cool register across ice-edge sea',
      'aurora rippling cool-green-and-purple across the polar scene, atmospheric brushwork',
      'distant lighthouse beam sweeping across wet surfaces, periodic warm-amber wash, dark intervals between sweeps',
      'starlit cool faint light, deep night register, just enough silver to define silhouettes',
      'blue-hour hush, last twilight gradient across the horizon, cool silver-blue light',
      'storm-break sun-shaft piercing dark cloud, golden chiaroscuro stabbing through the darkness',
      'crescent-moon faint blue light, cool monochrome, silver edges against deep navy shadow',
      'candlelit warm chiaroscuro from a single warm source, classical Caravaggio-cold darkness surrounding',
      'low-sun amber on polar ice, warm rake across glacial surface, cold shadow extending into the distance',
      'dappled water-light playing across upper surfaces, shifting bright-and-dark mosaic',
    ],
    instructions: `Each entry 14-22 words. Ocean-themed lighting clause. Medium-agnostic. Vary across the 7 categories. NEVER use negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  atmospheres: {
    format: 'simple',
    theme: `UNIVERSAL OCEAN ATMOSPHERE modes for OceanBot. Each entry is ONE atmospheric register used across any of the 10 OceanBot paths. 14-22 words.

⚠️ MEDIUM-AGNOSTIC — works for photography / canvas / watercolor / illustration.

✓ VARIETY across:
  A. Clear / open (crisp-clear air, cathedral clarity, blue-bright daylight)
  B. Mist / fog (rolling fog-curtain, sea-mist drift, phantom-haze, dawn-mist)
  C. Salt / spray (salt-mist drifting, spray-curtain, salt-laden air)
  D. Storm / weather (storm-air dense, monsoon-humidity, heavy-pressure air)
  E. Underwater (cathedral-stillness underwater, submarine quiet, submerged calm)
  F. Arctic / cold (arctic-stillness, glacier-breath, polar-hush)
  G. Phosphorescent / magical (phosphorescent-haze, glowing-air)
  H. Night-warm (night-warm-air, moonlit-cool)

NEVER use negation.`,
    touchpoints: [
      'crisp-clear air with cathedral clarity, distant horizon razor-sharp against the sky',
      'rolling fog-curtain drifting across the scene, cool grey-white mist consuming the middle-distance',
      'sea-mist drifting low across the water, soft atmospheric brushwork softening every horizon line',
      'salt-mist drifting through the air, briny texture-laden register, fine droplets catching the light',
      'storm-air dense and heavy, charged atmosphere before lightning',
      'cathedral-stillness underwater, submarine quiet hush, light filtering down in slow shafts',
      'arctic-stillness, glacier-breath cold-clear air, every breath visible against the polar scene',
      'phantom-haze drifting between sea-stones, atmospheric softening, mysterious register',
      'spray-curtain hanging in the air after a wave-break, salt droplets suspended in the light',
      'monsoon-humidity heavy in the air, moisture-laden tropical register, the air thick with rain-pressure',
      'phosphorescent-haze suffusing the cool air, faint glowing register from bioluminescent particles',
      'night-warm air, summer ocean-air register, soft and humid with moonlight',
      'dawn-mist drifting in pale softness, the world half-revealed through veils',
      'glowing-air suffused with phosphorescent particles, the atmosphere itself holding magical light',
      'painted clear-blue daylight, even diffusion, every wave-crest and ship-line carved with clarity',
      'salt-laden dawn air drifting across the ocean, cool-warm gradient, fine mist catching first light',
      'charged storm-air, oppressive heaviness, the world holding its breath',
    ],
    instructions: `Each entry 14-22 words. Ocean-themed atmosphere clause. Medium-agnostic. NEVER use negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  scene_palettes: {
    format: 'simple',
    theme: `UNIVERSAL OCEAN COLOR PALETTES for OceanBot. Each entry is ONE cinematic-or-painted color palette used across any of the 10 OceanBot paths. 14-22 words.

⚠️ MEDIUM-AGNOSTIC — works for photography / canvas / watercolor / illustration.

✓ VARIETY across:
  A. Warm / sunset (golden-amber, copper-salmon sunset, coral-pink dawn)
  B. Cool / blue (abyssal-black-and-cyan, cool teal, glacier-cyan-white, deep navy-and-silver)
  C. Storm / dramatic (Aivazovsky-storm-amber, charcoal-and-gold, slate-and-silver)
  D. Painterly classic (Pre-Raphaelite mossy-jade, burnished bronze, Burne-Jones emerald)
  E. Monochrome (pewter-monochrome, silver-tone)
  F. Bioluminescent / magical (bioluminescent-cobalt-emerald, phosphorescent-blue, glowing-cyan-and-violet)
  G. Cinematic (teal-and-orange cinematic, Hollywood blockbuster register)

NEVER use negation.`,
    touchpoints: [
      'cinematic teal-and-orange palette, saturated cool-and-warm contrast, Hollywood blockbuster register',
      'abyssal-black-and-cyan palette, deep-sea register with bioluminescent cyan accents against the black void',
      'Aivazovsky-storm-amber palette, golden sun-break in the dark storm-cloud, painterly drama through chiaroscuro',
      'Pre-Raphaelite mossy-jade palette, Burne-Jones emerald-and-amber, Brotherhood brushwork register',
      'polar-silver-blue palette, glacier-cyan with cool whites, polar register',
      'sunset-coral-salmon palette, warm sky-gradient melting into the deep-ocean dark below',
      'monochrome-pewter palette, silver-tone classical register',
      'glacier-cyan-white palette, cold polar light, arctic register',
      'bioluminescent-cobalt-emerald palette, glowing-blue-and-green phosphorescent register against the dark water',
      'burnished bronze palette, warm-amber painterly brushwork',
      'charcoal-and-gold palette, dramatic storm-light register, Aivazovsky chiaroscuro through painted scene',
      'deep navy-and-silver palette, moonlit register, cool-night brushwork',
      'coral-pink dawn palette, warm-gradient horizon melting into the deep painted sea',
      'slate-and-silver palette, overcast register, muted painterly brushwork',
      'phosphorescent-blue palette, glowing-cool bioluminescent register, cool light',
      'glowing-cyan-and-violet palette, magical phosphorescent register',
      'golden-amber sunset palette, copper-and-salmon horizon, warm painted register',
    ],
    instructions: `Each entry 14-22 words. Ocean-themed color palette clause. Medium-agnostic. NEVER use negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },
};

// ─────────────────────────────────────────────────────────────────────────
// Infrastructure (signature dedup + iterative gen, copied from gen-bloombot-pool.js)
// ─────────────────────────────────────────────────────────────────────────

const recipe = POOL_RECIPES[POOL];
if (!recipe) {
  console.error(`No recipe for pool "${POOL}". Add it to POOL_RECIPES.`);
  process.exit(1);
}

function buildPrompt(count, recipe) {
  if (recipe.format === 'simple') {
    return `${recipe.theme}

━━━ TOUCHPOINT EXAMPLES (draw aesthetic from these — same caliber, same vocabulary register) ━━━
${recipe.touchpoints.map((t) => '  • ' + t).join('\n')}

${recipe.instructions}

━━━ NO-NEGATION-LEAK MANDATE — GLOBAL, NON-NEGOTIABLE ━━━
NEVER write a banned word even to negate it — Flux's CLIP tokenizer ignores "no/not/never" and renders the banned word. Phrase positively. Banned content is only mentioned in the meta-prompt's DO-NOT section above, NEVER inside the entries you produce.

━━━ NO-MULTI-REGION-NAMING MANDATE — GLOBAL ━━━
NEVER list multiple regions / biomes / styles in one entry. Flux attends to the first-named noun. Pick ONE per entry.

Output ${count} numbered list entries (1. ... 2. ... 3. ...). Each entry on its own single line. NO preamble, NO commentary, NO markdown fences.`;
  }
  throw new Error(`Unknown recipe.format "${recipe.format}"`);
}

async function callSonnet(prompt) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15 * 60 * 1000);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: SONNET,
        max_tokens: 16000,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    return (data.content?.[0]?.text || '').trim();
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseArray(text) {
  const body = text
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    .trim();
  const lines = body.split('\n');
  const entries = [];
  let current = null;
  const numRe = /^\s*(\d+)\s*[.):\]]\s*(.+)$/;
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const m = trimmed.match(numRe);
    if (m) {
      if (current) entries.push(current);
      current = m[2].trim();
    } else if (current) current += ' ' + trimmed;
  }
  if (current) entries.push(current);
  const cleaned = entries
    .map((e) =>
      e
        .replace(/^["']|["']$/g, '')
        .replace(/^[-•*]\s*/, '')
        .trim()
    )
    .filter((e) => e.length > 20 && e.length < 1200);
  if (cleaned.length === 0) throw new Error('No numbered entries found in response');
  return cleaned;
}

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'with', 'of', 'in', 'on', 'at', 'to',
  'for', 'from', 'by', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'this', 'that', 'these', 'those', 'it', 'its', 'they',
  'them', 'their', 'her', 'his', 'into', 'onto', 'through', 'across', 'over',
  'under', 'near', 'around', 'between', 'one', 'two', 'three', 'some', 'any',
  'all', 'no', 'not', 'than', 'then', 'also', 'so', 'very', 'more', 'most',
  'many', 'much', 'each', 'every', 'other', 'another', 'same', 'such', 'only',
  'own', 'just', 'still', 'here', 'there', 'where', 'when', 'what', 'who',
  'wide', 'tall', 'long', 'high', 'low', 'large', 'small', 'massive', 'huge',
  'vast', 'above', 'below', 'beside', 'behind', 'toward', 'within', 'throughout',
]);

function signatureOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  let body = dashIdx >= 0 ? entry.slice(dashIdx + 3) : entry;
  const tokens = body
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOPWORDS.has(w))
    .slice(0, 20);
  return [...new Set(tokens)].sort().slice(0, 12).join(' ');
}

function titleOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  if (dashIdx < 0) return null;
  return entry.slice(0, dashIdx).trim().toLowerCase();
}

function dedupe(entries) {
  const seenSigs = new Map();
  const seenTitles = new Map();
  const kept = [];
  const dropped = [];
  for (const e of entries) {
    if (typeof e !== 'string' || e.length < 20) continue;
    const title = titleOf(e);
    if (title && seenTitles.has(title)) {
      dropped.push({ entry: e.slice(0, 80), reason: 'title' });
      continue;
    }
    const sig = signatureOf(e);
    if (sig.length < 10) {
      if (title) seenTitles.set(title, e);
      kept.push(e);
      continue;
    }
    if (seenSigs.has(sig)) {
      dropped.push({ entry: e.slice(0, 80), reason: 'body' });
      continue;
    }
    seenSigs.set(sig, e);
    if (title) seenTitles.set(title, e);
    kept.push(e);
  }
  return { kept, dropped };
}

async function generateBatch(batchCount) {
  const t0 = Date.now();
  const text = await callSonnet(buildPrompt(batchCount, recipe));
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  let arr;
  try {
    arr = parseArray(text);
  } catch (e) {
    console.error('Parse failed:', e.message);
    console.error('First 400 chars:', text.slice(0, 400));
    return [];
  }
  if (!Array.isArray(arr) || arr.length === 0) {
    console.warn('  ⚠ Sonnet returned no usable entries');
    return [];
  }
  console.log(`  • Sonnet returned ${arr.length} entries in ${elapsed}s`);
  return arr;
}

(async () => {
  const outPath = path.resolve(`scripts/bots/oceanbot/seeds/${POOL}.json`);
  let preExisting = [];
  if (fs.existsSync(outPath)) {
    try {
      preExisting = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    } catch {}
  }
  const finalTarget = TARGET ?? preExisting.length + COUNT;
  const startCount = preExisting.length;
  if (TARGET !== null)
    console.log(
      `Pool "${POOL}": ${startCount} → ${finalTarget} (iterative gen+dedup)${DRY ? ' (dry-run)' : ''}`
    );
  else
    console.log(`Pool "${POOL}": gen ${COUNT} new (start ${startCount})${DRY ? ' (dry-run)' : ''}`);
  let pool = [...preExisting];
  let iteration = 0;
  while (pool.length < finalTarget && iteration < MAX_ITERATIONS) {
    iteration++;
    const stillNeeded = finalTarget - pool.length;
    const batchSize = Math.min(25, Math.ceil(stillNeeded * 1.5));
    console.log(
      `\nIteration ${iteration}: pool at ${pool.length}/${finalTarget}, need ${stillNeeded} more, gen ${batchSize}`
    );
    const fresh = await generateBatch(batchSize);
    if (fresh.length === 0) {
      console.warn('  ⚠ empty Sonnet response — stopping iteration');
      break;
    }
    const within = dedupe(fresh);
    if (within.dropped.length > 0)
      console.log(`  • within-batch dedup dropped ${within.dropped.length}`);
    const existingSigs = new Set(pool.map((e) => signatureOf(e)));
    const existingTitles = new Set(pool.map((e) => titleOf(e)).filter(Boolean));
    const newUnique = within.kept.filter((e) => {
      if (existingSigs.has(signatureOf(e))) return false;
      const t = titleOf(e);
      if (t && existingTitles.has(t)) return false;
      return true;
    });
    const crossDropped = within.kept.length - newUnique.length;
    if (crossDropped > 0) console.log(`  • cross-batch dedup dropped ${crossDropped}`);
    const room = finalTarget - pool.length;
    const toAdd = newUnique.slice(0, room);
    pool = [...pool, ...toAdd];
    console.log(`  ✓ Added ${toAdd.length} unique → pool at ${pool.length}/${finalTarget}`);
    if (toAdd.length === 0 && newUnique.length === 0) {
      console.warn('  ⚠ batch added nothing — Sonnet may be exhausted on theme, stopping');
      break;
    }
  }
  console.log(
    `\n━━━ Final: ${pool.length}/${finalTarget} entries (${pool.length - startCount} new)`
  );
  if (DRY) {
    console.log('\nDry-run — not writing to disk.');
    return;
  }
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath) && preExisting.length > 0) {
    fs.copyFileSync(outPath, bakPath);
    console.log(`Backed up existing pool → ${bakPath}`);
  }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();
