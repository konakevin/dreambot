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
      'STERN-LATERAL CAMERA at hull height, full hull stretched in profile through the frame, prow and stern both visible',
    ],
    instructions: `Each entry 14-22 words. Explicit camera angle / framing mandate. NEVER mention divers, ROVs, submersibles, scuba gear, or any human/vehicle presence — this path is empty-wreck only (no crew, no observers, no scale-prover figures in frame). NEVER use negation. NEVER modern cinema terms (dolly / dutch / tilt-up). Output a NUMBERED list, one entry per line, no internal newlines.`,
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
      'STERN-LATERAL CAMERA at column-height, full colonnade stretched in profile, both ends of the row visible in the frame',
    ],
    instructions: `Each entry 14-22 words. Explicit camera angle / framing mandate. NEVER mention divers, ROVs, submersibles, scuba gear, or any human/vehicle presence — this path is empty-ruin only (no archaeologists, no observers, no scale-prover figures in frame). NEVER use negation. NEVER modern cinema terms (dolly / dutch / tilt-up). Output a NUMBERED list, one entry per line, no internal newlines.`,
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
  // KELP-FOREST path-bespoke pools (3) — Stage J1
  // The GREEN giant-kelp cathedral (3rd register: reef / abyss / kelp).
  // Hero-mandated (dullness law). Kelp = columns/fronds (no architecture
  // enumeration). camera_framing AUDITED (zero hero-dissolve).
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  kelp_forest_scene: {
    format: 'simple',
    theme: `KELP FOREST SCENES for OceanBot's kelp-forest path — the GREEN giant-kelp cathedral ecosystem (the third register alongside bright reef and dark abyss). NatGeo / BBC-Blue-Planet register. Each entry is ONE specific kelp-forest moment with a readable ANIMAL hero (or a monumental kelp-architecture moment), 20-28 words. Kelp structure + animal + moment ALL BAKED INTO THE ENTRY — this is the HERO pool.

⚠️ MANDATORY REGISTER — a REAL temperate giant-kelp / bull-kelp forest (California Channel Islands, Pacific Northwest, Tasmania, South Africa's Great African Seaforest, Chile). Giant-kelp columns rising to a sunlit surface canopy, fronds streaming in the surge, holdfasts gripping rocky reef, green-gold god-ray light.

⚠️ EVERY ENTRY HAS A READABLE HERO — a NAMED animal doing something specific, OR a monumental kelp-architecture moment (a single column rising the full height, the sunlit canopy from below). NEVER "fuzzy green water" or empty kelp with no subject.

⚠️ KELP IS KELP — giant-kelp columns, stalks, streaming fronds, surface canopy, holdfasts. NEVER "cathedral nave / temple pillars / columned hall" (architecture enumeration renders a building, not a living forest).

⚠️ NO SHIPS. NO PEOPLE. NO SCUBA GEAR.

✓ VARIETY MANDATE — distribute across kelp-forest categories:
  A. SEA OTTER moment (otter wrapping a pup in fronds to rest / cracking an urchin on its chest / rafting at the canopy)
  B. SEAL / SEA-LION play (harbor seal weaving between columns / California sea lion spiraling up through god-rays / pup twisting)
  C. GARIBALDI / KELP FISH (bright orange garibaldi flashing among the stalks / kelp bass hanging in the shafts / senorita cleaning)
  D. SHARK / RAY pass (leopard shark gliding the sand channel below / bat ray cruising beyond the fronds / soupfin shark passing)
  E. SCHOOL through columns (blacksmith / jack-mackerel / sardine school streaming between the stalks in the shafts)
  F. CANOPY-FROM-BELOW (looking up the columns to the sunlit surface canopy, god-rays lancing down through the fronds)
  G. HOLDFAST FLOOR (purple urchins, sunflower sea stars, abalone on the rocky reef at the kelp base, an otter foraging)
  H. MONUMENTAL COLUMN (a single towering giant-kelp column rising the full frame, fish orbiting, the scale of the forest)
  I. FILTERED UNDERSTORY (dim green understory with a hero animal lit by a single shaft breaking through)
  J. SURFACE-CANOPY RAFT (sea otters rafting at the floating canopy seen from just below, sun blazing on the surface)

Each entry: ONE kelp-structure anchor + ONE named animal hero (or the monumental-kelp moment) + ONE light or motion detail. FAVOR active dramatic behavior over passive cruising.

DO write positively. NEVER negation.`,
    touchpoints: [
      'Sea otter wrapping its pup in a giant-kelp frond at the surface canopy, sun blazing behind them, columns dropping into green depth below.',
      'California sea lion spiraling upward through a shaft of god-ray light between giant-kelp columns, bubble-trail streaming from its whiskers.',
      'Bright orange garibaldi flashing among towering kelp stalks, green-gold light dappling its flanks, holdfast-covered reef below.',
      'Leopard shark gliding low across a sand channel at the kelp base, columns rising on both sides, dappled light moving over its spotted back.',
      'Blacksmith school streaming in a dense river between giant-kelp columns, god-rays lancing through their ranks in gin-clear temperate water.',
      'Harbor seal weaving in a lazy corkscrew around a single towering kelp column, fronds streaming, sunlit canopy shimmering far above.',
      'Looking straight up the giant-kelp columns to the sunlit surface canopy, god-rays fanning down through the streaming fronds into green depth.',
      'Sea otter foraging on the holdfast floor among purple urchins and a sunflower star, cracking an urchin against a rock on its chest.',
      'A single colossal giant-kelp column rising the full height of the frame, a kelp-bass hanging motionless beside it, fish orbiting in the shafts.',
      'Bat ray cruising slow beyond a curtain of streaming fronds, its wingtips brushing the kelp, silhouette dark against the green-gold water.',
      'Sunflower sea star sprawled across the rocky reef at the kelp base, abalone tucked in a crevice, dappled light shifting over the holdfasts.',
      'Sea lions pinwheeling together through a bright god-ray gap in the canopy, bubble-trails spiraling, columns framing the play on both sides.',
      'Kelp bass hanging motionless in a green shaft deep in the understory, a single beam of light breaking through the canopy onto its flank.',
      'Sea otters rafting at the floating surface canopy seen from just below, the sun a blazing disc on the rippling surface, columns dropping away.',
      'Jack-mackerel school parting around a towering kelp column in the god-rays, a soupfin shark cutting through the far ranks in the green haze.',
    ],
    instructions: `Each entry is ONE specific kelp-forest moment, 20-28 words. Format: "kelp-structure anchor + named animal hero (or monumental-kelp moment) + light/motion detail." Vary across the categories above. FAVOR active dramatic behavior (foraging, wrapping, spiraling, hunting, mass schooling) over passive gliding/hovering. For bottom-resting fish write "resting on its splayed pectoral fins," NEVER "perched." NEVER ships / boats / people / scuba gear. NEVER architecture-enumeration for the kelp. NEVER negation. Output a NUMBERED list (1. ... 2. ...), one entry per line, no internal newlines.`,
  },

  kelp_forest_canopy_light: {
    format: 'simple',
    theme: `CANOPY LIGHT for OceanBot's kelp-forest path — the MONEY-SHOT light signature of the giant-kelp cathedral. Each entry is ONE specific light-through-kelp effect, 14-22 words. Green-gold god-rays and sunlit-canopy shimmer.

✓ VARIETY across light categories:
  A. GOD-RAY SHAFTS lancing down through canopy gaps into the green understory
  B. SURFACE-CANOPY SHIMMER from below, sun rippling across the floating fronds
  C. GREEN-GOLD GRADIENT from bright sunlit canopy fading to dim blue-green understory depth
  D. DUST-OF-PLANKTON catching the shafts, particles drifting glinting in the green light
  E. DAPPLED-FLOOR mosaic of light moving across the rocky reef and holdfasts
  F. BACKLIT FRONDS glowing translucent gold-green as the sun passes behind them
  G. SILHOUETTE SHAFT — a bright god-ray column a hero animal can be cut dark against

Each names the specific light-through-kelp effect. DO write positively. NEVER negation.`,
    touchpoints: [
      'God-ray shafts lancing down through gaps in the surface canopy, fanning into the dim green understory',
      'Sunlit surface canopy shimmering from below, the sun rippling gold across the floating fronds',
      'Green-gold gradient from the bright sunlit canopy fading down into dim blue-green understory depth',
      'Motes of plankton glinting as they drift through a broad shaft of green-gold light',
      'A dappled mosaic of light shifting slowly across the rocky reef and kelp holdfasts below',
      'Giant-kelp fronds backlit translucent gold-green as the sun passes behind the canopy',
      'A single bright god-ray column blazing through the columns, everything around it dim green',
      'Shafts of sun raking through the streaming fronds, the water thick with drifting green light',
      'Surface light fracturing into a hundred moving shafts across the tops of the kelp columns',
      'Warm green-gold glow filling the mid-water, columns fading to silhouette in the bright haze',
    ],
    instructions: `Each entry 14-22 words, ONE specific canopy/god-ray light effect for a giant-kelp forest. NEVER negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  kelp_forest_camera_framing: {
    format: 'simple',
    theme: `CAMERA FRAMING for OceanBot's kelp-forest path — the explicit composition mandate (THE LAW). Each entry is ONE specific camera angle, 14-22 words. AUDITED SET: every framing keeps a readable animal (or monumental kelp form) AND the forest structure clearly in frame — ZERO macro / extreme-close / detail-dissolve.

⚠️ EXPLICIT CAMERA LANGUAGE — every entry NAMES the framing/angle as THE LAW. Without this mandate, Flux defaults to a generic mid-shot regardless of the rest of the brief.

✓ VARIETY across framing categories (all keep the hero + forest readable):
  A. LOW-ANGLE UP-THE-COLUMNS toward the sunlit canopy, hero animal clear in mid-frame
  B. WIDE ENVIRONMENTAL establishing the forest depth, the hero one clear element among the columns
  C. OVER-THE-ANIMAL following shot, camera behind an otter/seal with the forest opening ahead
  D. SIDE-PROFILE of the hero against a god-ray column, full animal parallel to camera
  E. THROUGH-THE-FRONDS framing, streaming kelp across the foreground with the hero clear beyond
  F. CANOPY-FROM-BELOW wide up-shot, columns converging toward the bright rippling surface
  G. UNDERSTORY WIDE, the hero lit by a single shaft, rocky floor and holdfasts visible

Every framing keeps a readable animal or monumental kelp column as the clear subject. NEVER modern cinema terms. NEVER negation.`,
    touchpoints: [
      'LOW-ANGLE looking up the giant-kelp columns toward the sunlit canopy, a sea otter clear in the mid-frame',
      'WIDE ENVIRONMENTAL establishing the full depth of the kelp forest, a sea lion one bright element among the columns',
      'OVER-THE-OTTER following framing, camera behind the otter as the forest opens into god-rays ahead',
      'SIDE-PROFILE of a leopard shark against a bright god-ray column, full animal parallel to the camera',
      'THROUGH-THE-FRONDS framing, streaming kelp across the foreground, a garibaldi flashing clear beyond',
      'CANOPY-FROM-BELOW wide up-shot, the columns converging toward the bright rippling surface canopy',
      'UNDERSTORY WIDE framing, a harbor seal lit by a single shaft, holdfasts and rocky floor visible below',
      'LOW WIDE along the sand channel at the kelp base, a bat ray cruising between the rising columns',
      'THREE-QUARTER WIDE on a sea lion spiralling up through a canopy god-ray gap, columns framing both sides',
      'WIDE SILHOUETTE framing, a shark cut dark against a bright shaft with the kelp columns all around',
    ],
    instructions: `Each entry 14-22 words, an explicit camera framing that keeps the animal (or monumental kelp form) + the forest structure clearly readable. NEVER a macro / extreme-close / detail shot that dissolves the hero. NEVER modern cinema terms. NEVER negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FEEDING-FRENZY path-bespoke pools (4) — Stage J2
  // Sardine-run / bait-ball spectacle. ENGAGEMENT-POOL LAW: every hero
  // entry NAMES 2-4 actors + their interaction (solo-hero BANNED). PG
  // nature-doc: feeding not gore (no blood clouds). camera_framing AUDITED.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  feeding_frenzy_event: {
    format: 'simple',
    theme: `FEEDING FRENZY EVENTS for OceanBot's feeding-frenzy path — the open-ocean sardine-run / bait-ball spectacle, peak NatGeo action. Each entry is ONE multi-actor feeding beat, 22-30 words. This is the HERO pool and carries the render.

⚠️ ENGAGEMENT-POOL LAW (non-negotiable) — every entry NAMES 2-4 DISTINCT ACTORS (predator species) AND their interaction AROUND THE BAIT MASS. NEVER a solo hero. A minimum of TWO predator species visible plus the bait-ball / bait-mass itself. Motion everywhere, but ONE readable focal predator anchors the eye.

⚠️ PG NATURE-DOC — this is FEEDING, not gore. Predators lunging, herding, slashing, corralling; the silver bait mass reacting. NO blood clouds, NO wounds, NO viscera.

⚠️ REAL open-ocean species — sardines/anchovies (the bait), common dolphins, bottlenose dolphins, striped marlin, sailfish, yellowfin tuna, bronze whaler / dusky / blue / mako sharks, Cape gannets (plunge-diving), Cape fur seals, Bryde's whale (lunge finale), cormorants. Real sardine-run / bait-ball ecosystems (South Africa Wild Coast, Baja, Pacific).

⚠️ NO ships, NO people, NO scuba gear.

✓ VARIETY MANDATE — distribute across frenzy categories:
  A. DOLPHIN-HERD + GANNET-RAIN (common dolphins corral the ball from below while Cape gannets plunge-dive through it in bubble-trails)
  B. MARLIN/SAILFISH SLASH (striped marlin lit up neon, slashing bills through the sphere while tuna hold the edges)
  C. SHARK-RISE (bronze whaler sharks rising into the ball from beneath as dolphins compress it from the sides)
  D. WHALE-LUNGE FINALE (a Bryde's whale erupting up through the remnant ball, gannets and dolphins scattering off its rostrum)
  E. SEAL + BIRD DRIVE (Cape fur seals and cormorants driving anchovies up to the surface where gannets hit them)
  F. TUNA-BLITZ (a wall of yellowfin tuna blitzing the bait mass, water boiling silver, birds working above)
  G. MIXED-ARMADA (dolphins + sharks + gannets + tuna all on one ball at once, chaos with one focal predator)
  H. SPLIT-BALL (the sphere torn into two swirling masses, predators driving between them)

Each entry: NAME 2-4 predators + their action + the bait mass state + a light/motion detail. ONE focal predator readable in the chaos.

DO write positively. NEVER negation.`,
    touchpoints: [
      'Common dolphins corral a silver sardine ball from below while Cape gannets plunge-dive through it in streaming bubble-trails, one dolphin surging open-mouthed through the center.',
      'A striped marlin lit electric-neon slashes its bill through the bait sphere while yellowfin tuna blitz the edges and gannets rain down from above.',
      'Bronze whaler sharks rise into the anchovy ball from beneath as common dolphins compress it from the sides, gannets streaking down through the sun-shafts.',
      'A Bryde\'s whale erupts up through the remnant of the bait-ball, dolphins and gannets scattering off its rostrum, a curtain of silver fish raining around it.',
      'Cape fur seals and cormorants drive an anchovy shoal up to the surface where a squadron of gannets hits the water, dolphins arriving beneath.',
      'A wall of yellowfin tuna blitzes the sardine mass, the water boiling silver, a single tuna banking through the center as gannets work the surface above.',
      'Dolphins, bronze whalers, tuna and gannets all converge on one shrinking bait-ball at once, a lone dolphin the readable focal point mid-lunge.',
      'The bait-ball torn into two swirling silver masses, a striped marlin driving between them, tuna flanking and gannets diving into both halves.',
      'Common dolphins spiral a tight sardine sphere upward in a silver tornado while sharks cut in from the deep and gannets plunge through the top.',
      'A blue shark and two dolphins carve into an anchovy ball together, the fish flashing into a hollow shell around them, sun-shafts lancing down.',
      'Sailfish raise their sails and slash in a coordinated pack at a sardine sphere, tuna holding the perimeter, silver scales glittering loose in the blue.',
      'Cape gannets hit the bait mass like arrows, dolphins surging up beneath, a mako shark accelerating through the raining fish in a shaft of light.',
      'A dusky shark rockets up into the center of the ball as dolphins peel it open and gannets pepper the surface, one focal dolphin mid-turn.',
      'Yellowfin tuna and common dolphins pincer a bait-ball from both sides, the sphere collapsing into a silver ribbon, gannets diving through the gap.',
      'A mixed armada of dolphins and bronze whalers works a boiling sardine mass near the surface, gannets raining, one shark rising as the focal hero.',
    ],
    instructions: `Each entry is ONE multi-actor feeding beat, 22-30 words. NAME 2-4 predator species + their interaction + the bait-ball state + one light/motion detail. NEVER a solo hero (engagement-pool law) — minimum TWO predator species + the bait mass. ONE focal predator readable. PG: feeding not gore, NO blood/wounds/viscera. NEVER ships/people/scuba. NEVER negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  feeding_frenzy_bait_ball_state: {
    format: 'simple',
    theme: `BAIT-BALL STATE for OceanBot's feeding-frenzy path — the MONEY-SHOT state of the silver bait mass. Each entry is ONE specific bait-ball form/behavior, 12-20 words.

✓ VARIETY across bait-ball states:
  A. TIGHT SILVER SPHERE — a dense flashing globe of sardines, mirror-bright, wheeling as one
  B. SPLIT VORTEX — the ball torn into two swirling masses spiralling apart
  C. RAINING SCALES — a glittering curtain of loose silver scales sifting down through the blue
  D. TORN HOLLOW — a hole punched through the ball, predators visible inside the silver shell
  E. SILVER TORNADO — the shoal drawn up into a spinning column toward the surface
  F. COLLAPSING RIBBON — the sphere stretched into a flowing ribbon as it flees
  G. SURFACE-BOIL — the mass driven to the surface, water frothing silver and white

Each names the specific bait-mass state, mirror-bright and dynamic. DO write positively. NEVER negation.`,
    touchpoints: [
      'A dense mirror-bright sphere of sardines wheeling as one, flanks flashing silver in the sun-shafts',
      'The bait-ball torn into two swirling silver masses spiralling apart in the blue',
      'A glittering curtain of loose scales sifting down through the water like silver snow',
      'A hole punched clean through the shoal, the silver shell hollow and predators wheeling inside',
      'The sardine mass drawn up into a spinning silver tornado reaching toward the bright surface',
      'The sphere stretched into a flowing silver ribbon as the shoal streams away',
      'The bait mass driven to the surface, the water frothing silver and white with panic',
      'A tight flashing globe compressed to its smallest, mirror-flanks strobing in the light',
      'The shoal folding around a predator into a bright hollow bowl of silver',
      'Loose silver scales hanging suspended in a shaft of light after the strike',
    ],
    instructions: `Each entry 12-20 words, ONE specific bait-ball state (sphere / split / raining-scales / torn / tornado / ribbon / surface-boil). Mirror-bright, dynamic. NEVER negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  feeding_frenzy_water_column_light: {
    format: 'simple',
    theme: `WATER-COLUMN LIGHT for OceanBot's feeding-frenzy path — the open-blue-water light on the action. Each entry is ONE specific light condition, 12-20 words. Bright open ocean near the surface.

✓ VARIETY across light categories:
  A. SURFACE SUN-SHAFTS lancing down into clear blue open water
  B. SILVER-FLASH light bouncing off the bait mass, scattering across the predators
  C. BACKLIT BUBBLE-CURTAIN from plunging gannets, light streaming through the trails
  D. BRIGHT BLUE-WATER CLARITY, endless open ocean, high visibility
  E. DAPPLED SURFACE seen from below, the boiling surface bright against the deep blue
  F. GOLDEN LOW-SUN raking through the upper water column
  G. HIGH-CONTRAST shafts and shadow as predators pass through the beams

Each names the specific open-water light condition. DO write positively. NEVER negation.`,
    touchpoints: [
      'Surface sun-shafts lancing straight down into clear blue open water over the action',
      'Silver flash bouncing off the wheeling bait mass, scattering light across the predators',
      'Backlit bubble-curtains from plunging gannets, light streaming through the rising trails',
      'Bright endless blue-water clarity, high visibility to the deep, the action sharp',
      'The boiling surface dappled bright from below against the darker open-blue deep',
      'Golden low-angle sun raking through the upper water column, warming the silver',
      'High-contrast light shafts and shadow as predators cut through the beams',
      'Sun glittering through a haze of loose scales suspended in the blue',
      'A bright surface ceiling of rippled light over the frenzy, deep blue below',
      'Shafts of light fracturing across the tornado of fish reaching for the surface',
    ],
    instructions: `Each entry 12-20 words, ONE specific open-water light condition. NEVER negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  feeding_frenzy_camera_framing: {
    format: 'simple',
    theme: `CAMERA FRAMING for OceanBot's feeding-frenzy path — the explicit composition mandate (THE LAW). Each entry is ONE specific camera angle, 14-22 words. AUDITED SET: every framing keeps the bait mass AND a readable focal predator in frame — ZERO macro / detail-dissolve.

⚠️ EXPLICIT CAMERA LANGUAGE — every entry NAMES the framing as THE LAW. Without it, Flux defaults to a generic mid-shot.

✓ VARIETY across framing categories (all keep bait-ball + focal predator readable):
  A. WIDE ENVIRONMENTAL of the whole frenzy, bait-ball centered, predators converging from all sides
  B. BELOW-THE-BALL looking up, the silver sphere against the bright surface, predators rising into it
  C. SIDE-PROFILE of the focal predator's lunge, full animal parallel to camera, bait mass behind
  D. THROUGH-THE-BUBBLE-CURTAIN framing, gannet trails foreground, the ball and predators clear beyond
  E. OVER-THE-PREDATOR following the focal dolphin/shark toward the ball
  F. HIGH-ANGLE down onto the surface boil, predators and birds working the silver mass
  G. WIDE SILHOUETTE of predators cut dark against a bright sun-shaft with the bait mass

Every framing keeps the bait mass + one readable focal predator as the clear subject. NEVER a macro / extreme-close / detail shot. NEVER modern cinema terms. NEVER negation.`,
    touchpoints: [
      'WIDE ENVIRONMENTAL of the whole frenzy, the silver bait-ball centered, predators converging from every side',
      'BELOW-THE-BALL looking up, the silver sphere bright against the rippled surface, dolphins rising into it',
      'SIDE-PROFILE of a shark\'s lunge, full animal parallel to camera, the bait mass swirling behind',
      'THROUGH-THE-BUBBLE-CURTAIN framing, gannet dive-trails across the foreground, the ball and predators clear beyond',
      'OVER-THE-DOLPHIN following framing, camera behind the focal dolphin driving toward the sphere',
      'HIGH-ANGLE down onto the surface boil, dolphins and gannets working the frothing silver mass',
      'WIDE SILHOUETTE of tuna cut dark against a bright surface sun-shaft, the bait mass beside them',
      'LOW WIDE beneath the action, predators and bait-ball framed against the bright surface ceiling',
      'THREE-QUARTER WIDE on a whale lunging up through the ball, gannets and dolphins scattering in frame',
      'WIDE of the split bait-ball, a marlin driving between the two silver masses, tuna flanking',
    ],
    instructions: `Each entry 14-22 words, an explicit camera framing that keeps the bait mass + one readable focal predator clearly in frame. NEVER a macro / extreme-close / detail shot. NEVER modern cinema terms. NEVER negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LIGHTHOUSE-STORMS path-bespoke pools (4) — Stage J3 (ABOVE water)
  // Jean-Guichard register: a lighthouse taking a monster wave, keeper's
  // light glowing through spray. ~75% storm / ~25% calm-after. The LIGHT
  // STAYS LIT (emotional core). NO keeper figure (unstated-figure law).
  // Tower reads weathered-real, no fantasy. camera_framing AUDITED.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  lighthouse_scenes: {
    format: 'simple',
    theme: `LIGHTHOUSE SCENES for OceanBot's lighthouse-storms path — a real weathered lighthouse against the sea, Jean-Guichard storm-photography register. Each entry is ONE specific tower + sea-state + moment, 20-28 words. Tower + sea + light ALL BAKED INTO THE ENTRY — this is the HERO pool.

⚠️ THE LIGHT STAYS LIT — the lantern-room beam is ALWAYS glowing (warm gold against the grey fury) — the emotional core of every render.

⚠️ NO KEEPER FIGURE, NO PEOPLE at the door or windows — the tower stands ALONE against the sea (uninhabited; the light itself is the character).

⚠️ WEATHERED-REAL — a real granite / stone / cast-iron / brick lighthouse (Brittany, Cornwall, Oregon, Maine, Scotland, Portugal). Barnacled base, storm-scoured stone, iron gallery-rail, glass lantern room. NO fantasy, NO castle, NO ships as the subject.

⚠️ ~75% STORM, ~25% CALM-AFTER (serene dawn/dusk aftermath, glassy sea, gulls).

✓ VARIETY MANDATE — distribute across categories:
  A. WAVE-WRAP — a monster wave curling around the whole tower, only the lantern room clear above the white chaos
  B. BASE-DETONATION — a wave exploding white up the tower's base, spray climbing half its height
  C. SPRAY-OVER-LANTERN — spray flung clean over the lantern room, the beam cutting through the mist
  D. ROCK-STACK FURY — the tower on a sea-stack, breakers detonating on the rocks all around
  E. BEAM-THROUGH-STORM — the golden beam lancing out across a black torn sea under lightning
  F. LONG-SWELL SIEGE — huge grey swells marching at the tower, one about to break, the light steady
  G. CALM DAWN AFTERMATH — glassy pastel sea, the tower serene, gulls wheeling, the light still faintly lit
  H. DUSK-AFTER — the storm passing, warm last light on wet stone, a rainbow in the departing squall

Each entry: tower + specific sea-state + the lit beam + one atmospheric detail. DO write positively. NEVER negation.`,
    touchpoints: [
      'A monster wave curls white around the entire granite tower, only the glowing lantern room clear above the churning chaos, gold beam cutting the grey.',
      'A wave detonates in an explosion of white up the lighthouse base, spray climbing half the tower\'s height, the warm beam steady above.',
      'Spray flung clean over the lantern room, the golden beam lancing through the drifting mist, black swells heaving beyond the storm-scoured stone.',
      'A stone lighthouse on a sea-stack, breakers detonating on the rocks all around it, the lit lantern glowing warm against a bruised sky.',
      'The golden beam lances out across a black torn sea under a fork of lightning, the weathered tower streaming with rain.',
      'Huge grey swells march at the tower under a low storm sky, one rearing to break, the lantern burning steady and warm.',
      'Glassy pastel dawn after the storm, the serene tower mirrored in the calm, gulls wheeling, the light still faintly aglow.',
      'The squall departing at dusk, warm last light on the wet stone, a faint rainbow in the trailing rain, the beam just kindling.',
      'A towering wave wraps the cast-iron gallery, the keeper\'s light blazing gold through a wall of white spray and wind-torn foam.',
      'The lighthouse half-swallowed by an exploding breaker, the lantern room a warm gold star above the seething white water.',
      'A weathered Breton granite tower on a low reef, three lines of breakers rolling in, the lit beam sweeping across the grey.',
      'Serene blue-hour calm, the tower dark against the last glow, its beam beginning to turn, the sea flat and silver.',
    ],
    instructions: `Each entry is ONE tower + sea-state + moment, 20-28 words. The lantern beam is ALWAYS lit (warm gold). NO keeper / people. Weathered-real lighthouse, no fantasy. ~75% storm / ~25% calm-after. NEVER a ship as the subject. NEVER negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  lighthouse_wave_impact: {
    format: 'simple',
    theme: `WAVE IMPACT for OceanBot's lighthouse-storms path — the MONEY-SHOT of the wave hitting the tower. Each entry is ONE specific impact moment, 12-20 words.

✓ VARIETY across impact states:
  A. THE WRAP — a wave curling clean around the tower, white water enveloping the base
  B. THE DETONATION — a breaker exploding vertically up the stone in a white column
  C. SPRAY-OVER-TOP — foam flung clean over the lantern room
  D. THE COLUMN — a solid pillar of white water climbing the tower's full height
  E. THE FAN — spray fanning out sideways off the tower in the wind
  F. THE SIEGE-LINE — the wave an instant before impact, wall of grey-green rearing at the base
  G. THE AFTERMATH-CASCADE — sheets of white water sluicing back down the stone after the hit

Each names the specific wave-impact moment, powerful and dynamic. DO write positively. NEVER negation.`,
    touchpoints: [
      'A wave curling clean around the tower base, white water enveloping the stone in a churning collar',
      'A breaker exploding vertically up the lighthouse in a towering white column of spray',
      'Foam flung clean over the lantern room, drifting across the glowing glass',
      'A solid pillar of white water climbing the tower\'s full height beside the light',
      'Spray fanning out sideways off the tower, torn to mist by the gale',
      'A wall of grey-green sea rearing at the base an instant before it detonates',
      'Sheets of white water sluicing back down the storm-scoured stone after the strike',
      'The wave wrapping the gallery rail, a ring of white exploding around the lantern',
      'A great arc of spray bursting above the tower, backlit gold by the beam',
      'The base lost entirely in a boiling white detonation, the lit tower rising clear above',
    ],
    instructions: `Each entry 12-20 words, ONE specific wave-impact moment on the tower. Powerful, dynamic. NEVER negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  lighthouse_storm_sky: {
    format: 'simple',
    theme: `STORM SKY for OceanBot's lighthouse-storms path — the sky/weather behind the tower. Each entry is ONE specific sky condition, 12-20 words. Mostly furious storm, some calm-after.

✓ VARIETY across sky categories:
  A. BLACK STORM-WALL — a bruised black cloud-wall towering over the sea
  B. LIGHTNING — a fork of lightning splitting the dark sky behind the tower
  C. TORN GREY RACK — fast-moving ragged grey cloud, wind-driven, breaking light
  D. BREAK-IN-THE-CLOUD — a single shaft of gold breaking through onto the tower
  E. CALM PASTEL DAWN — soft pink-and-lilac dawn sky, storm departed
  F. RAINBOW-IN-SQUALL — a rainbow arcing through the trailing rain of a passing storm
  G. BLUE-HOUR CLEAR — deep clear blue-hour sky, first stars, sea calming

Each names the specific sky condition. DO write positively. NEVER negation.`,
    touchpoints: [
      'A bruised black storm-wall towering over the heaving sea behind the tower',
      'A fork of lightning splitting the dark sky behind the lit lantern room',
      'Fast ragged grey cloud racing overhead, wind-driven, a thin break of light beyond',
      'A single shaft of gold breaking through the storm cloud onto the wet tower',
      'A soft pink-and-lilac dawn sky, the storm departed, the sea gone calm',
      'A rainbow arcing through the trailing rain of a passing squall behind the tower',
      'Deep clear blue-hour sky with the first stars, the sea settling to silver',
      'Low copper storm-light under a heavy ceiling of cloud, rain sheeting across',
      'A wild sky of torn cloud and wind-blown spray, gulls scattered before the gale',
      'The storm\'s trailing edge glowing bronze at dusk over a still-heaving sea',
    ],
    instructions: `Each entry 12-20 words, ONE specific storm or calm-after sky condition. NEVER negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  lighthouse_camera_framing: {
    format: 'simple',
    theme: `CAMERA FRAMING for OceanBot's lighthouse-storms path — the explicit composition mandate (THE LAW). Each entry is ONE specific camera angle, 14-22 words. AUDITED SET: every framing keeps the WHOLE TOWER + the sea-state readable — ZERO macro / detail-dissolve.

⚠️ EXPLICIT CAMERA LANGUAGE — every entry NAMES the framing as THE LAW. Without it, Flux defaults to a generic mid-shot.

✓ VARIETY across framing categories (all keep the whole tower + wave readable):
  A. WIDE ENVIRONMENTAL of the tower and the full wave, sea and sky around it
  B. LOW-ANGLE UP at the tower from near the waterline, wave rearing at the base
  C. AERIAL THREE-QUARTER above and beside the tower, wave-wrap seen from height
  D. SIDE-PROFILE of the tower and a breaking wave, both full in the frame
  E. DISTANT-LONG establishing shot, the small tower against a vast furious sea
  F. THROUGH-THE-SPRAY framing, wind-torn foam foreground, the lit tower clear beyond
  G. HEAD-ON toward the lantern beam cutting toward camera through the storm

Every framing keeps the whole lighthouse + the sea-state as the clear subject. NEVER a macro / extreme-close of a single detail. NEVER modern cinema terms. NEVER negation.`,
    touchpoints: [
      'WIDE ENVIRONMENTAL of the tower and the full monster wave, grey sea and storm sky around it',
      'LOW-ANGLE UP at the lighthouse from near the waterline, the wave rearing at its base',
      'AERIAL THREE-QUARTER above and beside the tower, the wave-wrap seen from height',
      'SIDE-PROFILE of the tower and a breaking wave, both full and clear in the frame',
      'DISTANT-LONG establishing shot, the small lit tower against a vast furious sea',
      'THROUGH-THE-SPRAY framing, wind-torn foam across the foreground, the lit tower clear beyond',
      'HEAD-ON toward the lantern beam lancing toward camera through the driving storm',
      'WIDE LOW from a wet rock shelf, breakers detonating between camera and the tower',
      'HIGH THREE-QUARTER at dawn, the serene tower and glassy sea laid out below',
      'WIDE SILHOUETTE of the tower against a lightning-lit sky, sea heaving at its foot',
    ],
    instructions: `Each entry 14-22 words, an explicit camera framing that keeps the WHOLE tower + the sea-state clearly in frame. NEVER a macro / extreme-close of a single detail. NEVER modern cinema terms. NEVER negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SEA-CAVES path-bespoke pools (3) — Stage J4
  // Blue-Grotto register: cathedral sea-cave light beams, hidden lagoons,
  // glowing turquoise water-windows, ceiling shafts. Serene counterpart to
  // coastal-power. The "glowing water" is REAL (sunlight through a submerged
  // entrance lights the pool electric blue) — phrased physically, never biolum.
  // A monumental formation OR a creature anchors every entry. camera AUDITED.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  sea_cave_scenes: {
    format: 'simple',
    theme: `SEA-CAVE SCENES for OceanBot's sea-caves path — the Blue-Grotto / cathedral sea-cave register. Each entry is ONE specific cave + water + light moment, 20-28 words. Cave architecture + water + light-event ALL BAKED INTO THE ENTRY — this is the HERO pool.

⚠️ THE "GLOWING WATER" IS REAL PHYSICS — sunlight entering through a submerged entrance below the waterline lights the pool electric turquoise-blue from beneath. Phrase it physically (light entering below the surface). NEVER bioluminescence, NEVER magic glow.

⚠️ EVERY ENTRY HAS A READABLE HERO — a MONUMENTAL rock formation (a great arch, a ceiling oculus, a cathedral chamber) OR a creature (a seal resting on a ledge, rays gliding through the beam, a shoal in the shaft). Never empty fuzzy water.

⚠️ REAL sea-caves — Capri Blue Grotto, Algarve Benagil, Scottish Fingal's Cave basalt, Croatian/Greek grottoes, California/Oregon sea-caves. Wet rock, barnacle line, turquoise water, shafts of daylight.

⚠️ NO ships, NO people, NO scuba gear.

✓ VARIETY MANDATE — distribute across categories:
  A. BLUE-GROTTO GLOW — a submerged entrance lighting the whole pool electric turquoise from below, cave dark above
  B. CEILING OCULUS — a round hole in the cave roof dropping a single shaft into a still pool (Benagil register)
  C. CATHEDRAL CHAMBER — a vast basalt/limestone cavern, columns and vaulted rock, daylight from a far arch
  D. SWIM-THROUGH ARCH — a rock tunnel with bright turquoise light at the far opening, dark walls framing it
  E. SEAL ON A LEDGE — a seal hauled out on a wet rock shelf in the beam, glowing water below
  F. RAYS IN THE SHAFT — bat rays / eagle rays gliding through a column of daylight in the chamber
  G. HIDDEN LAGOON — a secret beach/lagoon behind a rock arch, turquoise water, daylight pouring in
  H. STALACTITE GROTTO — a low grotto hung with mineral formations over a glowing pool
  I. BLOWHOLE CAVERN — a tall chimney cave with light and mist falling from above onto the water

Each entry: cave-formation anchor + water state + the light source + (a creature if rolled). DO write positively. NEVER negation.`,
    touchpoints: [
      'A submerged entrance lights the whole grotto pool electric turquoise from below, the vaulted rock above lost in cool shadow, water impossibly clear.',
      'A round oculus in the cave roof drops a single bright shaft onto a still emerald pool, wet limestone walls curving up into dark.',
      'A vast basalt cathedral chamber of hexagonal columns, daylight pouring through a far sea-arch onto glowing turquoise water below.',
      'A rock swim-through tunnel, dark barnacled walls framing a blaze of turquoise light at the far opening, the water lit from beyond.',
      'A grey seal hauled out on a wet rock ledge in a shaft of daylight, the pool below it glowing electric blue from the submerged mouth.',
      'Two bat rays glide slowly through a column of daylight in a limestone chamber, their shadows sweeping the sunlit sand below.',
      'A hidden lagoon behind a great rock arch, a crescent of pale sand and turquoise water, daylight pouring through the opening.',
      'A low grotto hung with dripping stalactites over a still glowing pool, a single shaft catching the mineral formations.',
      'A tall blowhole chimney cave, light and fine mist falling together from the opening far above onto the churning turquoise water.',
      'The Blue-Grotto entrance seen from within, a low bright slot at the waterline flooding the dark chamber with electric-blue light.',
      'A cormorant resting on a rock shelf deep in a sea-cave, the turquoise pool below lit from the submerged entrance.',
      'A cathedral cavern with a shaft of gold daylight from a roof-crack striking the emerald pool, columns receding into cool dark.',
    ],
    instructions: `Each entry is ONE sea-cave + water + light moment, 20-28 words. Cave-formation anchor + water state + light source + (a creature if rolled). The glowing water is REAL sunlight through a submerged/other opening — NEVER bioluminescence or magic. Monumental formation OR creature anchors every entry. NEVER ships/people/scuba. NEVER negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  sea_cave_light_window: {
    format: 'simple',
    theme: `LIGHT WINDOW for OceanBot's sea-caves path — the MONEY-SHOT light event of the sea-cave. Each entry is ONE specific real-light effect, 12-20 words. All are REAL daylight physics (never bioluminescence/magic).

✓ VARIETY across light categories:
  A. SUBMERGED-ENTRANCE GLOW — sunlight entering below the waterline lighting the pool electric turquoise
  B. CEILING SHAFT — a single beam dropping through a roof oculus onto the water
  C. FAR-ARCH DAYLIGHT — bright daylight flooding in through a distant sea-arch opening
  D. TURQUOISE WATER-WINDOW — the whole pool glowing blue-green, lit from the submerged mouth
  E. GOD-BEAM IN MIST — a shaft of light made solid by cave mist/spray
  F. REFLECTED CAUSTICS — rippling light reflected up onto the cave ceiling from the pool
  G. SLOT-OF-LIGHT — a bright narrow gap flooding one wall while the rest stays dark

Each names the specific real-daylight effect. DO write positively. NEVER negation.`,
    touchpoints: [
      'Sunlight entering below the waterline lights the whole pool electric turquoise from beneath',
      'A single bright beam drops through a roof oculus onto the still emerald water',
      'Bright daylight floods in through a distant sea-arch, glowing across the chamber',
      'The whole pool glowing blue-green, lit from the submerged cave mouth below',
      'A shaft of daylight made solid by drifting cave mist, striking the water',
      'Rippling caustics reflected up from the pool onto the vaulted cave ceiling',
      'A narrow slot of bright light flooding one wet wall while the rest stays cool dark',
      'The turquoise glow rising from the submerged entrance, silhouetting the cave mouth',
      'Gold roof-crack light striking the emerald pool in a single clean column',
      'Electric-blue light fanning up the cavern walls from the sunlit underwater opening',
    ],
    instructions: `Each entry 12-20 words, ONE specific REAL-daylight effect in a sea-cave (submerged-entrance glow / ceiling shaft / far-arch / caustics). NEVER bioluminescence or magic. NEVER negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  sea_cave_camera_framing: {
    format: 'simple',
    theme: `CAMERA FRAMING for OceanBot's sea-caves path — the explicit composition mandate (THE LAW). Each entry is ONE specific camera angle, 14-22 words. AUDITED SET: every framing keeps the cave FORMATION (or creature) + the light event readable — ZERO macro / detail-dissolve.

⚠️ EXPLICIT CAMERA LANGUAGE — every entry NAMES the framing as THE LAW. Without it, Flux defaults to a generic mid-shot.

✓ VARIETY across framing categories (all keep the cave + light readable):
  A. WIDE CHAMBER establishing the whole cavern, the light event and pool centered
  B. FROM-THE-WATER looking toward the glowing entrance/arch, cave walls framing it
  C. LOW-ANGLE UP at the ceiling oculus/shaft, the beam dropping toward camera
  D. THROUGH-THE-ARCH framing, dark rock foreground, the bright lit chamber beyond
  E. SIDE-WIDE of a seal/ray in the beam, the formation and glowing water around it
  F. HALF-UNDERWATER split, the turquoise glow below and the cave vault above
  G. DEEP-PERSPECTIVE down the length of a tunnel toward the bright opening

Every framing keeps the cave formation (or creature) + the light event as the clear subject. NEVER a macro / extreme-close of a single detail. NEVER modern cinema terms. NEVER negation.`,
    touchpoints: [
      'WIDE CHAMBER establishing the whole cavern, the glowing pool and light shaft centered',
      'FROM-THE-WATER looking toward the bright turquoise entrance, dark cave walls framing it',
      'LOW-ANGLE UP at the ceiling oculus, the single beam dropping toward camera onto the pool',
      'THROUGH-THE-ARCH framing, dark barnacled rock foreground, the bright lit chamber beyond',
      'SIDE-WIDE of a seal on a ledge in the beam, the formation and glowing water around it',
      'HALF-UNDERWATER split framing, the turquoise glow below the surface and the cave vault above',
      'DEEP-PERSPECTIVE down the length of the tunnel toward the blazing turquoise opening',
      'WIDE LOW across the glowing pool toward the cathedral columns and far daylight arch',
      'THREE-QUARTER WIDE of rays gliding through the ceiling shaft, sunlit sand below',
      'WIDE SILHOUETTE of the cave mouth from within, the bright water-window flooding the dark',
    ],
    instructions: `Each entry 14-22 words, an explicit camera framing that keeps the cave formation (or creature) + the light event clearly in frame. NEVER a macro / extreme-close of a single detail. NEVER modern cinema terms. NEVER negation. Output a NUMBERED list, one entry per line, no internal newlines.`,
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

⚠️ THE HAUNTING LEADS — the eerie, IMPOSSIBLE story-beat is the subject (a helm spinning to no hand, a table still set with goblets in the great cabin, every lantern lit where the crew vanished mid-meal, full sail driving hard into a dead calm, the ship's bell tolling itself). Encrustation / ice-coating / salt-crystal / bioluminescent-outline is only SUPPORTING texture — NEVER the whole point of the image. If the entry is just "a ship coated in [X]" with no haunting beat, it has failed.

✓ VARIETY MANDATE — distribute across haunted-vessel categories (~3 entries each):
  A. IMPOSSIBLE HAUNTING MOMENT (helm spinning to no hand / table set in the great cabin / lanterns lit where the crew vanished / full sail into dead calm / bell tolling itself)
  B. Fog drift (vessel emerging from / fading into rolling fog bank, partial silhouette visible)
  C. Becalmed / glassy (motionless on mirror-flat water, slack sails, an eerie wrongness to the stillness)
  D. Listing / capsized partial (heeled at a dramatic angle, half-submerged, sinking-but-not-sunk)
  E. Encrusted / overgrown (barnacle-armored or kelp-draped — but the DECAY tells a story, not just coating)
  F. Spectral lighting (lanterns burning blue/green on an empty deck, or a hull rim-lit by plankton — with a haunting beat)
  G. Arctic / ice-locked (frozen in pack ice, rigging crystallized — paired with an eerie beat, used sparingly)
  H. Storm-impossible (calm hurricane eye / sailing into the wind / crew-less ship racing impossibly)
  I. Crescent / fleet phantom (multiple derelicts drifting in formation, ghost-armada at the horizon)
  J. Tropical / temperate setting (mangrove ghost, Caribbean derelict, monsoon-faded junk) — NOT all polar

Each entry: ONE specific vessel type + an IMPOSSIBLE/HAUNTING beat + ONE spectral atmospheric anchor (fog / lantern-glow / bioluminescence / decay). NO modern vessels. NO sea monsters / krakens (separate path). NO sunken-into-coral ruins (shipwreck-kingdom path).

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
    instructions: `Each entry 14-22 words. Explicit camera angle / framing mandate. NEVER name any boat / ship / hull / vessel — even in framing descriptions like "bow", "hull-level", or "bowriding" — only the whale, the ocean, and the camera. NEVER name "OceanBot" as a subject in the framing. NEVER use negation. NEVER modern cinema terms. Output a NUMBERED list, one entry per line, no internal newlines.`,
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
    instructions: `Each entry is ONE specific reef moment, 20-28 words. Format: "reef-structure anchor + named species + atmospheric/light detail." Vary across the 15 categories above. FAVOR active dramatic behavior (hunting, predation, cleaning symbiosis, spawning, mass schooling, territorial display) over passive hovering / gliding. For bottom-resting fish write "resting on its splayed pectoral fins," NEVER "perched" (it triggers bird/talon anatomy). NEVER include ships / boats / people / scuba gear. NEVER write negation language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines.`,
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
  // POLAR-SEAS path-bespoke pools (2)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //
  // 9th OceanBot path, 4th scenic — Arctic / Antarctic ocean.
  // Naturalistic register, NO SHIPS (covered by other paths), NO PEOPLE.

  polar_scenes: {
    format: 'simple',
    theme: `POLAR SCENES for OceanBot's polar-seas path — Arctic / Antarctic ocean ecosystem. NatGeo / BBC-Frozen-Planet register. Each entry is ONE specific polar moment, 18-26 words. A polar ANIMAL or a MONUMENTAL ICE FORMATION is always the HERO — baked into the entry.

⚠️ ABSOLUTE RULE — EVERY entry has a clear HERO that is either (a) a real polar ANIMAL (whale, narwhal, beluga, orca, polar bear, penguin, seal, walrus) doing something, large and readable in frame, OR (b) a MONUMENTAL ICE FORMATION as the dramatic subject (a towering tabular berg, a blue-ice arch or cave, a glacier mid-calving). Aurora, polar dawn and blue-hour light may set the MOOD as a BACKDROP behind that hero, but are NEVER the subject on their own. A bare aurora, an empty pack-ice mosaic, a krill cloud, or a plain light-on-water shot is BANNED — if a viewer would say "there's nothing in it," it has failed.

⚠️ NO SHIPS. NO ICEBREAKERS. NO PEOPLE. NO EXPEDITION CAMPS. NO SCIENTISTS. Just the polar ocean and its inhabitants.

✓ VARIETY MANDATE — distribute across polar HEROES:
  A. ICE-FORMATION HERO (a towering tabular berg, a translucent blue-ice arch or cave, a glacier cliff — monumental and the clear subject)
  B. POLAR CETACEAN (narwhal tusk-display through an ice crack / beluga pod at a breathing hole / orca pod hunting the ice edge / humpback breach in icy water / bowhead breaking thin ice)
  C. POLAR BEAR (hunting at the ice edge / swimming between floes / mother and cub on a tabular berg)
  D. PENGUIN (emperor column marching / Adélie colony / king penguins porpoising to sea)
  E. SEAL / WALRUS (leopard seal hunting at the ice edge / weddell seal on fast ice / walrus haul-out / ringed seal pup)
  F. CALVING / ICE DRAMA (a glacier calving mid-fall, an ice cliff fracturing — a dramatic EVENT in motion)
  G. UNDERWATER WITH A CREATURE (camera below the ice with a seal / penguin / whale silhouetted against sun-shafts — an animal is ALWAYS present)
  (Aurora / polar dawn / midnight-sun may light any of the above as a BACKDROP — never as the subject alone.)

Each entry: ONE animal or ice-formation HERO + its action/state + ONE light/atmosphere anchor. Specific named locations OK (Lemaire Channel, Disko Bay, Svalbard, Ross Sea, McMurdo Sound, etc.). Speak vivid and specific.

DO write positively. NEVER negation.`,
    touchpoints: [
      'Tabular iceberg dominating an Antarctic peninsula channel, vertical cliff face glacier-cyan and pearl-white, calm fjord water reflecting the full silhouette below.',
      'Blue-ice arch carved by wave action through a Greenland berg, dark sea visible through the tunnel, translucent walls glowing turquoise from within.',
      'Narwhal pod surfacing through a crack in arctic fast ice, three spiraled tusks raised into pale polar light, breath crystallizing in the air above.',
      'Beluga family surfacing through breathing holes in shore-fast ice, white melons gleaming wet, crystal-clear arctic water below visible through the ice.',
      'Orca pod cruising along an Antarctic ice edge in tight formation, six tall dorsal fins cutting the dark swell, ice cliffs towering above the water.',
      'Polar bear stepping carefully across pack ice between leads of dark water, paws spread wide on a thin floe, distant horizon hazy with sea-fog.',
      'Emperor penguin column marching across an Antarctic ice shelf at dawn, hundreds of bodies casting long shadows on snow, blue-hour pink staining the horizon.',
      'Weddell seal hauled out on fast ice in Antarctic still air, eyes half-closed, breath visible as fine vapor in the polar cold.',
      'Belugas surfacing in a black arctic lead beneath a sweeping green aurora, the curtain light rippling across their wet white backs as breath plumes rise.',
      'Glacier calving in slow motion, a vertical slab of ice the size of a building toppling forward into churning meltwater below, spray erupting upward.',
      'Weddell seal gliding through golden sun-shafts beneath Antarctic fast ice, the ice ceiling glowing above, plankton drifting bright in the angled light.',
      'Walrus haul-out on Svalbard ice floe, dozen-strong herd lying densely packed, ivory tusks catching low golden polar sun, breath rising in vapor columns.',
      'Greenland calving glacier face stretching across the frame, blue-ice fractures running vertical, sea-spray fanning where ice meets sea.',
      'Adélie penguin colony on an Antarctic island shore, thousands of nesting pairs across pebbled ground, distant tabular berg dominating the bay horizon.',
      'Leopard seal hunting at the ice edge underwater, sleek serpentine body in mid-water, ringed seal silhouetted above the ice ceiling.',
      'Polar bear silhouetted on a ridge of pack ice beneath a sweeping emerald aurora, the dark animal anchoring the frame under the luminous sky.',
      'Bowhead whale breaking through thin Beaufort Sea ice, smooth callous-free head emerging slow, ice fragments cracking outward in concentric rings.',
      'Towering blue-ice cave inside a grounded Antarctic berg, sea-water lapping the entrance, light filtering through metres of compressed glacier ice.',
      'Humpback whale breaching in a Svalbard fjord beside a calving glacier, vast body twisting clear of the dark water, ice cliff towering behind.',
      'Polar bear mother and cub on a melting floe, mother nuzzling cub, both backs framed against vast pale arctic sky, distant pack ice receding to horizon.',
      'Leopard seal exploding from the water at the ice edge to snatch an Adélie penguin, spray and ice-chips flying, the chase frozen mid-strike.',
      'King penguin colony returning to sea, individuals porpoising through icy water beside a glacier face, others gathered on pebbled beach watching.',
    ],
    instructions: `Each entry is ONE specific polar moment, 18-26 words. Format: "animal or ice-formation HERO + action/state + light/atmosphere anchor." EVERY entry MUST have an animal or monumental ice-formation hero — never a bare aurora / pack-ice / krill / light-on-water shot. Vary across the 7 hero categories above. NEVER include ships / icebreakers / people / scientists / huts. NEVER write negation language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines.`,
  },

  polar_camera_framing: {
    format: 'simple',
    theme: `CAMERA FRAMING for OceanBot's polar-seas path — the explicit composition mandate. Each entry is ONE specific camera angle that the renderer must honor, 14-22 words.

⚠️ EXPLICIT CAMERA LANGUAGE — every entry NAMES the framing/angle as THE LAW. Without this mandate, Flux defaults to generic mid-shot regardless of the rest of the brief.

✓ VARIETY across polar-specific framing:
  A. ICEBERG MONUMENTAL (low waterline angle, berg towering against sky)
  B. AERIAL ICE-PACK (drone-style top-down, pack ice mosaic stretching to horizon)
  C. WILDLIFE EYE-LEVEL (camera at the animal's eye height, intimate)
  D. UNDERWATER UNDER-ICE (camera below sea ice, looking up through ceiling)
  E. AURORA PANORAMA (wide vista of sky + ice + water, aurora arcing across full frame)
  F. CALVING ACTION (mid-distance lateral, glacier face in mid-fall)
  G. ICE-EDGE PROFILE (lateral view of pack ice meeting open dark water)
  H. CETACEAN AT ICE (animal half-out-of-water beside ice formation, scale relationship clear)
  I. POLAR PANORAMA (wide environmental establishing shot, multi-element polar scene)
  J. SUN-SHAFT THROUGH ICE (underwater backlight, ice ceiling rim-lit by surface sun)

NEVER use negation. NEVER name modern cinema terms.`,
    touchpoints: [
      'LOW-WATERLINE ICEBERG framing, berg towering massive against pale polar sky, full cliff face filling vertical frame',
      'AERIAL ICE-PACK framing, drone-style top-down on pack ice mosaic stretching to horizon, dark leads threading between floes',
      'WILDLIFE EYE-LEVEL framing, camera at the animal\'s height meeting its eye directly, intimate polar gaze',
      'UNDERWATER UNDER-ICE framing, camera below the ice ceiling looking up through translucent fast ice, sun-shafts piercing',
      'AURORA PANORAMA framing, wide vista with aurora arcing across the full sky, ice + water + reflection in frame',
      'CALVING ACTION framing, mid-distance lateral view of glacier face in slow-motion mid-fall, spray erupting from impact',
      'ICE-EDGE PROFILE framing, lateral view of pack ice meeting open dark water, sharp horizon line of ice-to-sea',
      'CETACEAN AT ICE framing, whale half-out-of-water beside towering ice formation, dramatic scale relationship',
      'WIDE POLAR PANORAMA establishing shot, ice + wildlife + sky + water all readable in vast environmental composition',
      'SUN-SHAFT THROUGH ICE underwater backlight, ice ceiling rim-lit by surface sun, shafts cutting downward through water',
      'OVERHEAD CETACEAN AT SURFACE framing, drone view of whale blowing among ice floes, scale-of-emptiness visible',
      'PENGUIN COLONY WIDE ESTABLISHING shot, thousands of birds spread across an ice shelf or pebbled shore',
      'BACKLIT BERG SILHOUETTE framing, iceberg as dark cutout against bright polar twilight, edges glowing rim-lit',
      'POLAR BEAR ON FLOE framing, animal small against vast pale ice expanse, scale-of-isolation composition',
      'THROUGH-THE-ICE-ARCH framing, camera in foreground looking through a carved iceberg arch at open polar sea beyond',
    ],
    instructions: `Each entry 14-22 words. Explicit camera angle / framing mandate. NEVER mention research vessels / icebreakers / ships / boats / divers / scientists / expedition equipment — this path is empty polar wilderness, no human presence. NEVER use negation. NEVER modern cinema terms. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BIOLUMINESCENT-NIGHT path-bespoke pools (2)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //
  // 10th and FINAL OceanBot path, 5th scenic — nighttime ocean surface
  // lit by dinoflagellate plankton bloom. Counterpoint to deep-wonder
  // (creature-in-abyss). NO SHIPS, NO PEOPLE, NO ARTIFICIAL LIGHTS.

  biolum_scenes: {
    format: 'simple',
    theme: `BIOLUMINESCENT-NIGHT SCENES for OceanBot's bioluminescent-night path — a wild marine CREATURE dramatized by bioluminescent plankton light at night. The bioluminescence is the LIGHTING; a living animal is ALWAYS the HERO. NatGeo / Blue-Planet night-ocean register. Each entry is ONE specific creature in a luminous moment, 18-26 words. Creature + what it is doing + the cyan glow its motion ignites ALL BAKED INTO THE ENTRY — this is the HERO pool.

⚠️ ABSOLUTE RULE — EVERY entry has a living animal HERO, large and clearly readable in frame (roughly 20-50% of the image), its movement igniting, trailing or scattering electric-cyan plankton light. The glow REVEALS and dramatizes the creature; it never replaces it. This is wildlife photography at night, NOT a landscape of glowing water. If a viewer could say "it's just glowing water with nothing in it," the entry has failed.

⚠️ NO SHIPS. NO BOATS. NO KAYAKS. NO PEOPLE. NO HEADLAMPS. NO DIVE LIGHTS. The natural plankton glow is the only light, and a wild animal is always the subject.

✓ VARIETY MANDATE — distribute across CREATURE HEROES + dramatic moments:
  A. DOLPHIN / PORPOISE (pod tearing through a bloom trailing comets of light, single breach flinging glowing spray, calf on a glowing bow-wake)
  B. WHALE (humpback fluke sheeting cyan water, sperm whale surfacing in a glowing blow, orca dorsal parting a curtain of light)
  C. SEA TURTLE (adult gliding with luminous flipper-trails, hatchlings sparking the wet sand alive as they scramble to the surf)
  D. SHARK / RAY (manta barrel-feeding belly-lit in a swarm, reef shark firing a glowing wake, eagle ray lit from below over a sand flat)
  E. SQUID / CEPHALOPOD (Toyama firefly-squid swarm turning the shallows electric, Humboldt squid flashing, octopus rim-lit in a glowing tide pool)
  F. JELLYFISH (translucent swarm pulsing their OWN light at the surface, a single great bell glowing from within)
  G. BAITBALL DRAMA (a baitball detonating into cyan fireworks as a VISIBLE predator — sea lion, tuna, dolphin — punches through it)
  H. SEABIRD (a tern or shearwater skimming a glowing wave to snatch a glowing fish, wingtips flicking sparks off the dark water)
  I. CRAB / SHORE CREATURE (ghost crab or hatchling rim-lit on a glowing tide-line, intimate macro drama)
  J. SEAL / SEA LION (a seal porpoising through a bloom, trailing a comet of plankton light)

Each entry: ONE named creature + ONE specific action + the cyan glow that action ignites. Real species + real glowing-water locations OK (Vieques / Mosquito Bay, Toyama Bay, the Maldives). The creature leads; the glow lights it.

DO write positively. NEVER negation.`,
    touchpoints: [
      'Dolphin pod tearing through a Mosquito Bay bloom, each body trailing a comet of cyan light, spray flung glowing into the dark.',
      'Humpback whale fluking at the surface of a plankton-rich night sea, the great tail sheeting electric-cyan water as it slips under.',
      'Sea-turtle hatchlings scrambling down a dark beach into the glowing surf, each tiny flipper-step sparking the wet sand alive with cyan.',
      'Manta ray barrel-rolling through a dense plankton swarm, white belly lit from below, wingtips drawing glowing spirals in the black water.',
      'Toyama Bay firefly squid swarming to the surface in their thousands, the whole shallows pulsing electric blue around their tiny bodies.',
      'Bottlenose dolphin breaching clear of a glowing Caribbean sea, every falling droplet a cyan ember against the starry sky.',
      'A baitball detonating into cyan fireworks as a sea lion punches through the center, the predator silhouetted in the glow it triggered.',
      'Translucent moon-jellyfish swarm drifting at the twilight surface, every bell lit soft aqua from within, mirrored on the glassy black.',
      'Green sea turtle gliding through a Maldivian glow-bay, slow flipper-strokes trailing luminous plankton like smoke behind the shell.',
      'Orca surfacing through a bioluminescent bloom at midnight, tall dorsal fin parting a curtain of cyan, breath flashing pale in the dark.',
      'Ghost crab darting across a glowing tide-line, its small body rim-lit cyan where the wet sand ignites under each scuttling step.',
      'Reef shark cutting a fast glowing wake through a shallow lagoon at night, plankton firing electric blue along its whole flank.',
      'Eagle ray gliding low over a glowing sand flat, the bloom lighting its pale underside as its wing-tips stir spirals of cyan.',
      'A tern dipping to snatch a glowing fish from a luminous wave-crest, wingtips flicking sparks of cyan off the dark water.',
      'Humboldt squid flashing through a night bloom, chromatophores pulsing red and white as the disturbed plankton flares around them.',
      'Spinner dolphin leaping in a series through a glowing swell, each splashdown bursting cyan, a chain of light strung across the dark bay.',
      'Sea lion porpoising through a plankton bloom off a rocky islet, body trailing a long comet of glowing water under the stars.',
      'Whale shark cruising a Maldivian night shallows, mouth agape filtering plankton, the glow tracing every white spot along its flank.',
    ],
    instructions: `Each entry is ONE marine-creature bioluminescent-night moment, 18-26 words. Format: "named creature + specific action + the cyan glow it ignites." EVERY entry MUST have a living animal hero large in frame — never a subject-less water / surf / glow / aurora shot. Vary across the 10 creature categories above. NEVER include ships / boats / people / artificial lights. NEVER write negation language. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines.`,
  },

  biolum_camera_framing: {
    format: 'simple',
    theme: `CAMERA FRAMING for OceanBot's bioluminescent-night path — the explicit composition mandate. Each entry is ONE specific camera angle that the renderer must honor, 14-22 words.

⚠️ EXPLICIT CAMERA LANGUAGE — every entry NAMES the framing/angle as THE LAW. Without this mandate, Flux defaults to generic mid-shot regardless of the rest of the brief.

✓ VARIETY across biolum-night framing:
  A. LOW-WATERLINE SURF (camera at sea-level on glowing shore, wave breaking toward lens)
  B. HORIZON LONG SHOT (vast glowing sea stretching to dark horizon, scale-of-emptiness)
  C. ABOVE-SURFACE AERIAL (drone view of glow patterns + wake trails from above)
  D. UNDERWATER LOOKING UP (camera below surface, glow above + plankton in water column)
  E. SIDE-PROFILE CREATURE (creature swimming parallel to camera leaving glow trail)
  F. STARRY-SKY-AND-GLOW SPLIT (composition with sky above and glowing water below)
  G. CLOSE-UP ON GLOW DETAIL (camera near wave-crest or jelly, glow texture filling frame)
  H. SHORE-VANTAGE (camera on dark beach looking out at glowing surf line and bay)
  I. BIRD'S-EYE TIDE-POOL (top-down on a small glowing tide pool, intimate macro)
  J. EXTREME WIDE COSMIC (creature small against vast glowing sea + starry sky, galaxy-of-the-deep)

NEVER use negation. NEVER name modern cinema terms.`,
    touchpoints: [
      'LOW-WATERLINE SURF framing, camera at sea-level on dark beach, glowing wave breaking toward the lens',
      'HORIZON LONG SHOT, vast glowing sea stretching to dark horizon, sky a narrow band above, scale-of-emptiness',
      'ABOVE-SURFACE AERIAL framing, drone view of glow patterns and creature wake trails from above the water',
      'UNDERWATER LOOKING UP, camera below surface with glow above, plankton motes drifting in cool blue water column',
      'SIDE-PROFILE CREATURE framing, animal swimming parallel to camera leaving glowing plankton trail behind',
      'STARRY-SKY-AND-GLOW SPLIT framing, dark Milky Way sky above, glowing cyan water below, sharp horizon between',
      'CLOSE-UP ON GLOW DETAIL, camera near wave-crest or jelly bell, bioluminescent texture filling the frame',
      'SHORE-VANTAGE framing, camera on dark beach looking out at the glowing surf line and bay beyond',
      'BIRD\'S-EYE TIDE-POOL framing, top-down on a small glowing tide pool, sea-life rim-lit in intimate macro',
      'EXTREME WIDE COSMIC framing, creature small against vast glowing sea and starry sky, galaxy-of-the-deep',
      'OVER-THE-WAVE framing, camera at wave-crest height in mid-break, foamy cyan luminescence filling foreground',
      'SUBSURFACE PROFILE framing, camera below the surface looking through a glowing water column at distant horizon',
      'CRESCENT-FALL framing, camera dipping into a swell, glowing wave crest rising in the frame center',
      'OVER-THE-LAGOON framing, drone view of an entire glowing bay rimmed with mangrove silhouettes',
      'BACKLIT CREATURE SILHOUETTE framing, animal dark against glowing water, body shape readable against the cyan',
    ],
    instructions: `Each entry 14-22 words. Explicit camera angle / framing mandate. NEVER mention boats / kayaks / ships / hulls / paddles / "OceanBot vessels" — this path is empty surface ocean, no human or constructed presence. NEVER use negation. NEVER modern cinema terms. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // MYSTICAL-MERMAID character-path pools (11)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //
  // 11th OceanBot path, first CHARACTER path. Mystical mer-folk across
  // shore / underwater / kelp forests / coral palaces / tide pools /
  // moonlit grottos — every render slanted toward the magical /
  // mystical / "stuff of legend" register Kevin called out. Painted
  // Pre-Raphaelite + Dulac + Rackham illustration medium (per the
  // MERMAID_PAINT mediumStyles override). Cultural diversity baked
  // into the ARCHETYPE + FACE_AND_SKIN pools (Sirena / Mami Wata /
  // Selkie / Ningyo / Rusalka / Naiad / Iara / Sedna / Hai-Ren /
  // Andersen-Western mer-maids). NSFW-clean via natural coverings
  // (long flowing hair / shell-cluster / kelp-wrap / scaled chest-
  // plate / coral-crown) — NEVER topless. Legacy OceanBot's mermaid-
  // legend path was RETIRED 2026-05-01 (commit f7f319cf) with the
  // note "Flux couldn't render mermaids reliably" — this attempt
  // engineers against that prior with explicit tail-anatomy mandate,
  // painted-only register, and obsessive identity-axis layering.

  mermaid_archetype: {
    format: 'simple',
    theme: `MYSTICAL-MERMAID ARCHETYPE for OceanBot's mystical-mermaid path — the cultural lineage + role + emotional / mythic temperament of the mer-folk character. Each entry is ONE specific archetype, 22-32 words.

⚠️ Each entry encodes: CULTURAL LINEAGE + ROLE within that mythology + EMOTIONAL/MYTHIC TEMPERAMENT + HOOK that suggests the scene's intent.

✓ CULTURAL VARIETY MANDATE (distribute across):
  A. Andersen / Western fairy-tale mermaid (Little Mermaid lineage — longing, royal, sea-king's daughter)
  B. Sirena (Filipino sea-spirit — luminescent, hair-of-seaweed, seducing fishermen)
  C. Mami Wata (West African / Caribbean diaspora water-spirit — serpent-coiled, mirror-and-comb, regal)
  D. Selkie (Scottish / Irish / Faroese seal-folk — sealskin shed on shore, melancholic, between worlds)
  E. Ningyo (Japanese — pearl-pale, fish-headed-or-fish-tailed, omen-bringer, eternal life if eaten)
  F. Rusalka (Slavic — drowned-maiden water-spirit, pale-and-cold, water-grasses in hair, lures with songs)
  G. Naiad / Nereid (Greek — bronze-skinned freshwater or saltwater nymph, accompanied by dolphins, sea-foam born)
  H. Iara (Brazilian / Amazonian — green-haired river-mother, mirror-eyed, luring with songs)
  I. Sedna (Inuit / Polar — keeper of sea-creatures, scarred and powerful, polar mer-queen)
  J. Hai-Ren (Chinese — pearl-tearing, silk-veiled, dragon-court servant)
  K. Polynesian / Maori mermaid-spirit (tā-moko-tattooed, outrigger-canoe blesser, coral-crowned)
  L. Mediterranean Siren (Greek bird-bodied original OR Renaissance painterly mer-form, golden-tongued)

DO NOT name the SPECIFIC mythological figure (Ariel, etc.) — name the CULTURAL LINEAGE + role + temperament. Sonnet uses it as identity anchor.

NEVER negation.`,
    touchpoints: [
      'Young Andersen-coded mermaid princess of an ancient sea-king\'s court, longing-eyed and curious, surfacing too often to watch the shore-world above her father\'s domain.',
      'Filipino Sirena of the Visayan reefs, ancient and luminous, hair-of-living-seaweed, called to surface by a single fisherman\'s lantern in the moonlit night.',
      'Mami Wata regal water-spirit of the Bight of Biafra, serpent-coiled and crowned, mirror-and-comb in hand, granting fortune to those who honor her shrine.',
      'Faroese selkie woman just shed of her sealskin on a basalt shore at midnight, melancholic and torn, the skin folded beside her on the wet rocks.',
      'Ancient Ningyo of the Japanese deep, pearl-pale and ageless, said to grant eternal life to any mortal who consumes her flesh, watching from kelp-shadow.',
      'Slavic Rusalka of a forest river, drowned-pale and cold-eyed, water-weeds tangled through her hair, luring travelers with a song they cannot quite remember.',
      'Greek Nereid of the Aegean dawn, bronze-skinned and dolphin-attended, daughter of Nereus the old man of the sea, sea-foam crowning her swimming wake.',
      'Amazonian Iara of a green river-bend, river-green hair and mirror-bright eyes, luring sailors deeper into the flooded forest with a song of impossible promise.',
      'Inuit Sedna of the polar dark, scarred-and-powerful, keeper of all sea-creatures, hair tangled with pack-ice fragments, watching from beneath broken ice.',
      'Chinese Hai-Ren tear-pearling water-maiden, silk-veiled and dragon-court-bound, weeping pearls onto a shell-throne at the bottom of the South China Sea.',
      'Polynesian mermaid-spirit of an atoll lagoon, tā-moko tattoos curling across her cheeks and shoulders, coral-crowned and quiet, blessing the outrigger fleet.',
      'Mediterranean siren of a sea-stack cave, golden-throated and ancient, having stopped luring sailors centuries ago, now singing only for the gulls and the sun.',
      'Cornish mer-witch of a tide-pool grotto, herb-and-shell-bedecked, brewing storm-charms from kelp and crab-shell, salt-cracked and shrewd.',
      'Sumatran sea-naga maiden of the Strait of Malacca, serpent-finned and amber-eyed, hair-coiled with cowrie, guardian of a sunken Srivijaya temple.',
      'Norse-coded mer-skald of a fjord cliff, bronze-haired and lute-bearing, singing the old sagas to passing whale-pods at the season\'s turn.',
    ],
    instructions: `Each entry 22-32 words. Format: "[AGE/SCALE-MARKER] [CULTURAL-LINEAGE mermaid] [BODY OF WATER / DOMAIN], [TEMPERAMENT + MYTHIC-ROLE detail], [HOOK that suggests the scene's intent]." Vary across the 12 cultural categories. NEVER name a specific mythological character (Ariel, Sedna-by-name, etc — name the LINEAGE not the figure). NEVER negation. Output as a NUMBERED list, one entry per line, no internal newlines.`,
  },

  mermaid_face_and_skin: {
    format: 'simple',
    theme: `MYSTICAL-MERMAID FACE-AND-SKIN axis — load-bearing because the entry IS the opening of the Flux prompt (per the airship-female lesson: ethnicity-noun-first-token is what Flux's CLIP locks identity from). Each entry 14-22 words opening with the ethnicity-noun-phrase.

⚠️ MANDATORY OPENING FORMAT: "[a/an/the] [CULTURAL-LINEAGE] mermaid with [SKIN TONE / UNDERTONE + MYSTICAL DETAIL], [FACIAL FEATURE detail]." The "mermaid" noun MUST be in the first phrase — Flux locks species from there.

⚠️ MYSTICAL SKIN VARIATIONS expected: subtle iridescent shimmer on cheekbones / faint scaling along temples-and-jaw / bioluminescent freckling / opalescent translucence at the throat / sea-foam-pale / coral-flushed / abalone-shifting. Always WITH cultural skin-tone base.

✓ ETHNIC DIVERSITY DISTRIBUTION (~equal):
  A. Anglo / Celtic / Nordic (pale + freckled + cool undertone)
  B. Filipino / Southeast Asian (warm bronze, golden undertone)
  C. West African / Caribbean (deep mahogany / ebony / umber)
  D. Slavic / Russian (fair, cool undertone, drowned-pale variant for Rusalka)
  E. Greek / Mediterranean (warm olive, golden undertone)
  F. Brazilian / Amazonian (warm brown, copper undertone)
  G. Inuit / Polar (warm honey-bronze, weathered)
  H. Chinese / East Asian (cool ivory or pearl-pale)
  I. Polynesian (warm bronze, often with tā-moko tattoo)
  J. Japanese (pearl-pale or amber-tan)
  K. Persian / Arabian (warm honey, golden)
  L. Mixed-heritage / sea-foam-born (any blend with strong mystical sheen)

NEVER porcelain-doll / NEVER plastic-perfect / NEVER without a sea-life or mystical mark. Always with a TRACE of mermaid biology (subtle scale-line / bioluminescent spot / pearl-iridescence). NEVER topless mention / NEVER neckline language.

NEVER negation.`,
    touchpoints: [
      'an Anglo-Celtic mermaid with sea-foam-pale skin and faint freckling across her nose, a thin line of opalescent scales tracing her left jaw',
      'a Filipino mermaid with warm bronze skin and golden undertone, faint phosphor-blue freckling across her cheekbones, a pearl-iridescent sheen along her throat',
      'a West African Mami Wata mermaid with deep mahogany skin and warm umber undertone, faint indigo scaling along her temples, ritual scarification at her left eye',
      'a Slavic Rusalka mermaid with drowned-pale skin and cool blue undertone, faint silver-iridescent traces beneath her eyes, river-water still dripping from her hair',
      'a Greek Nereid mermaid with warm olive skin and golden undertone, sea-foam-pearl shimmer along her collarbones, dolphin-grace high cheekbones',
      'a Brazilian Iara mermaid with warm copper-brown skin and green undertone, faint river-jade scaling along her jaw, mirror-bright eyes echoed in her skin sheen',
      'an Inuit Sedna mermaid with warm honey-bronze weathered skin and copper undertone, faint frost-silver scaling at her temples, scars across her cheekbones',
      'a Chinese Hai-Ren mermaid with cool pearl-pale skin and faint blue undertone, faint mother-of-pearl iridescence along her brow, jade tear-tracks visible on her cheeks',
      'a Polynesian mermaid with warm bronze skin and copper undertone, tā-moko line-tattoos curling across her chin and lower lip, coral-pink shimmer at her collarbone',
      'a Japanese Ningyo mermaid with pearl-pale skin and faint amber undertone, fine fish-scale traces along her temples, ancient-jeweled iridescence beneath her cheekbones',
      'a Persian-coast mermaid with warm honey skin and golden undertone, faint turquoise scaling beneath her eyes, sun-darkened brow with subtle pearl-sheen at her throat',
      'a Cornish mer-witch with milk-pale wind-burned skin and pink undertone, faint sea-glass-green freckling across her nose, salt-cracked at the corners of her mouth',
    ],
    instructions: `Each entry 14-22 words. Format: "[a/an/the] [CULTURAL-LINEAGE] mermaid with [skin tone + undertone + mystical sheen/scale-trace], [facial feature detail]." Vary across the 12 ethnic categories. The "mermaid" noun MUST be in the first phrase. NEVER porcelain / plastic-perfect / topless / neckline language. NEVER negation. Output as a NUMBERED list, one entry per line, no internal newlines.`,
  },

  mermaid_eyes: {
    format: 'simple',
    theme: `MYSTICAL-MERMAID EYES axis — color + otherworldly luminous detail. Each entry 14-22 words.

⚠️ Every entry includes a MYSTICAL detail (faint glow / pearl-iridescent ring / nictitating-second-eyelid / pupil that catches light unnaturally / sea-glass refraction / star-fleck). The eyes are CLEARLY not-quite-human.

✓ VARIETY: sea-glass green / abalone-shifting / pearl-iridescent / storm-grey / amber-with-gold-fleck / coral-pink / deep-violet / bioluminescent-cyan / midnight-black with starlight / molten-copper / pale-silver.

EVERY entry has a sea-life or magical lived-in detail (salt-crusted lashes / pearl-rimmed iris / coral-pink corneal-edge / faint phosphor-glow when she blinks). NEVER human-mundane / NEVER doe-eyed-innocent.

NEVER negation.`,
    touchpoints: [
      'sea-glass green eyes with a faint pearl-iridescent inner ring, salt-crusted lashes catching pre-dawn light, pupils slit slightly vertical',
      'abalone-shifting eyes flickering between blue, green and violet with the angle of her head, faintly luminescent in the deeper water',
      'pearl-iridescent eyes with a deep-violet inner core, faintly glowing as she sings, the glow brightening on the held notes',
      'storm-grey eyes with a thin coral-pink corneal edge, an oddly-second translucent eyelid blinking sideways across the pupil',
      'amber eyes flecked with gold and lit faintly from within, lashes pearl-tipped, the glow steady even when her eyelids close',
      'deep-violet eyes set wide and unblinking, pupils glowing faint phosphor-cyan, sea-water still beading at the outer corners',
      'molten-copper eyes with a thin silver-iridescent rim, ancient and unhurried, catching torchlight from a sunken lantern below',
      'bioluminescent-cyan eyes lit visibly from within, glowing brighter in the deeper dark, lashes salt-crusted and silver',
      'midnight-black eyes scattered with tiny starlight points, pupils dilated wide in low light, lashes long and sea-spray-tangled',
      'pale silver eyes with a coral-pink corneal edge, river-water still trickling from the outer corner, lashes pale and salt-crusted',
      'sea-foam-grey eyes with a faint mother-of-pearl shimmer in the iris, pupils widening as she catches a passing fish-school in the dark',
      'jade-green eyes with vertical-slit pupils and a thin gold rim, glowing faintly when she turns her head into the lantern-light',
    ],
    instructions: `Each entry 14-22 words. Color + otherworldly luminous detail + sea-life-lived-in mark. NEVER human-mundane / doe-eyed. NEVER negation. Output as a NUMBERED list, one entry per line, no internal newlines.`,
  },

  mermaid_hair: {
    format: 'simple',
    theme: `MYSTICAL-MERMAID HAIR axis — combined COLOR + LENGTH + BEHAVIOR (underwater/wet/wind) + DECORATION (woven with seaweed / pearls / shells / coral / starfish / river-flowers). Each entry 22-32 words.

⚠️ MERMAID HAIR IS THE CRITICAL MODESTY ELEMENT — long flowing hair often partly covers her chest as natural NSFW-clean covering. Front-load that in some entries.

✓ COLOR VARIETY: sea-foam blonde / coral pink / abalone iridescent / kelp-green / river-jade / midnight-black / silver-pearl / oxblood-red / sandy-blonde / amber / charcoal / dawn-rose / starlight-platinum.

✓ DECORATION VARIETY: braided through with kelp ribbon / pearl strand woven across the crown / cowrie shells at the temples / coral-cluster crown / starfish tucked at the ear / river-lily wreath / sea-glass beads / fish-bone hair-pin / abalone-shell comb.

✓ BEHAVIOR VARIETY: floating outward in slow underwater drift / clinging wet to her shoulders fresh from the surf / wind-whipped on a sea-cliff / cascading over one shoulder partly covering her chest / draped across a rock in twilight / streaming behind her mid-swim.

NEVER perfect-shampoo-ad / NEVER unrealistically-clean. There's always SEA in her hair.

NEVER negation.`,
    touchpoints: [
      'Sea-foam blonde hair waist-length and floating outward in slow underwater drift, braided through with thin kelp ribbon and a strand of pearls woven across the crown.',
      'Coral-pink hair to her hips clinging wet to her shoulders fresh from the tide, draped across her chest in protective curtains, woven with three cowrie shells at the temple.',
      'Abalone-iridescent hair shifting blue-green-violet in the light, mid-back length and draped across one shoulder, tucked with a single starfish behind her left ear.',
      'Kelp-green hair impossibly long and tangled with actual living kelp-fronds, floating in a slow halo around her head in the underwater current, water-flowers at her temples.',
      'River-jade hair cascading past her hips and partly covering her chest, woven with river-lily blooms and tiny mirror-fragments, dripping from her recent surfacing.',
      'Midnight-black hair to her waist, wind-whipped across a sea-cliff at dusk, threaded with single strand of phosphor-glowing pearl, salt-crusted at the tips.',
      'Silver-pearl hair flowing past her hips in slow underwater drift, decorated with a crown of pink coral branches and tiny silver-shell beads at the brow.',
      'Oxblood-red hair to her shoulders clinging wet to her neck, braided tightly with leather cord and dressed with bone-comb at the temple, salt-stiffened.',
      'Sandy-blonde hair waist-length and wind-tangled on a shore-rock at sunset, sea-glass beads woven through, partly covering her chest in soft golden strands.',
      'Amber-bronze hair past her hips floating in a slow ring around her in deep water, decorated with a fish-bone hair-pin and three small white shells at the crown.',
      'Charcoal-black hair to mid-back, draped wet over one shoulder in a heavy column partly covering her chest, threaded with a single coral-twig and tiny pearls.',
      'Dawn-rose hair waist-length and cascading freely in the underwater current, an entire crown of pink coral and white starfish woven into the crown of her head.',
      'Starlight-platinum hair impossibly long, floating outward in a luminescent halo, glowing faintly from within with bioluminescent algae-strands threading the lengths.',
    ],
    instructions: `Each entry 22-32 words. Format: "[COLOR] hair [LENGTH] [BEHAVIOR], [DECORATION detail]." Vary across 13 colors / 9 decorations / 6 behaviors. Mention hair-as-modesty-covering in a meaningful portion of entries. NEVER perfect-shampoo / unrealistic. NEVER negation. Output as a NUMBERED list, one entry per line, no internal newlines.`,
  },

  mermaid_tail: {
    format: 'simple',
    theme: `MYSTICAL-MERMAID TAIL axis — THE MAKE-OR-BREAK AXIS for this path. Each entry 28-38 words. Without explicit tail anatomy in the brief, Flux defaults to "fish-on-the-side-of-a-naked-woman" or "fish-tail-costume-belt" — both look wrong. Every entry MUST encode: tail-color + scale-pattern + fin-shape + tail-LENGTH + smooth-transition-from-hips.

⚠️ MANDATORY ANATOMY: "scaled tail transitioning from human hips at the iliac line" or "tail starting at her waist with the scaling beginning above her hipbones" or similar EXPLICIT ANATOMY description. Never just "fish tail."

⚠️ COLOR VARIETY: emerald-and-gold / sapphire-and-pearl / coral-pink / abalone-iridescent / silver-and-violet / bronze-and-bronze / kelp-green / midnight-black-with-starlight-flecks / sunset-orange-pink / opal-shifting / pearl-white / amber-tortoiseshell / blood-red-and-gold / glacier-cyan.

✓ SCALE-PATTERN VARIETY: dense diamond-cut scales / overlapping fish-mail / iridescent micro-scales like sequins / striated bands of color / chromatophore-shifting / pearlescent gradient from hip to fluke / coral-textured carapace / tiny gold-rim each scale.

✓ FIN-SHAPE VARIETY: classic fluked tail like a whale's fluke / flowing veil-fins like a betta / lacy ornamental fins like a swordtail / split-double-fin / koi-style trailing fins / shark-style strong functional fluke / dorsal-fin running along spine / pectoral fin-flares at the hips.

✓ LENGTH VARIETY: tail of normal-leg length / impossibly long flowing tail trailing several body-lengths / compact powerful short tail / tail wrapped around a rock or coral.

NEVER nudity-cue language. The tail BEGINS at the hips and covers everything below. NEVER cleavage / NEVER topless mention.

NEVER negation.`,
    touchpoints: [
      'Long emerald-and-gold scaled tail transitioning smoothly from her human hips at the iliac line, dense diamond-cut scales each rimmed with gold, ending in a wide flowing fluke like a koi\'s tail trailing iridescent veil-fins.',
      'Sapphire-and-pearl scaled tail beginning at her waist with the scaling rising above her hipbones in a smooth transition, overlapping fish-mail in dense blue rows, ending in a strong functional whale-fluke for power.',
      'Coral-pink iridescent scaled tail starting just above her hipbones with a smooth painterly transition, micro-scales catching light like sequins, lacy ornamental swordtail fins trailing behind, total length nearly twice her torso.',
      'Abalone-iridescent tail transitioning at the iliac line, scales shifting blue-green-violet with every movement, dorsal fin running along her spine from lower back to fluke, classic functional whale-fluke at the end.',
      'Silver-and-violet scaled tail starting smoothly from her hips, pearlescent gradient running silver at the hip to deep violet at the fluke, betta-style flowing veil-fins, pectoral fin-flares cresting at her hips.',
      'Bronze-and-bronze warm-toned tail transitioning at the iliac line, striated bands of warm copper and dark bronze, compact-powerful short tail with a strong shark-style fluke for maneuvering tide-pool currents.',
      'Kelp-green scaled tail beginning above her hipbones with kelp-frond-like vertical scales, fins shaped like split betta-veils trailing behind, length nearly three body-lengths, kelp-living-on-the-scales texture.',
      'Midnight-black scaled tail with tiny starlight-fleck phosphor spots, transitioning smoothly at her waist, dense overlapping scales, flowing trailing veil-fins like deep-sea bioluminescent jellyfish trailing behind her.',
      'Sunset-orange-pink tail with chromatophore-shifting scales, transitioning at the iliac line in a smooth gradient, ornamental swordtail-style flowing fins, tail wrapped loosely around a coral spur for stillness.',
      'Opal-shifting scaled tail beginning at her hips with iridescent micro-scales like sequins, classic whale-fluke ending, flowing veil-fins along the dorsal line, a pearlescent inner glow catching every passing shaft of light.',
      'Pearl-white scaled tail transitioning above her hipbones in a smooth pale gradient, micro-scales each rimmed with silver, koi-style trailing fins, ancient and elegant rather than functional.',
      'Glacier-cyan scaled tail with vertical white striated bands, transitioning smoothly at the waist, strong powerful shark-style fluke for the polar currents, dorsal-fin running from lower back to fluke-base.',
      'Amber-tortoiseshell scaled tail beginning at the iliac line with warm honey and dark brown striations, lacy ornamental fins at the dorsal spine, fluke shaped like an open scallop-shell.',
      'Blood-red-and-gold tail with carapace-textured coral-like scaling, transitioning at her hips, ornamental Asian-dragon-style trailing fins along the spine, total length three body-lengths trailing behind.',
      'Starlight-luminescent tail of deep cobalt scales each glowing faint cyan from within, transitioning at her hips, dense bioluminescent micro-scales, trailing veil-fins extending the glow into the dark water.',
    ],
    instructions: `Each entry 28-38 words. Format: "[COLOR/PATTERN] tail [TRANSITION DESCRIPTION at hips/iliac line/waist], [SCALE-PATTERN detail], [FIN-SHAPE detail], [LENGTH or pose detail]." EVERY entry MUST include explicit smooth-transition-from-hips anatomy. NEVER nudity-cue / cleavage / topless. NEVER negation. Output as a NUMBERED list, one entry per line, no internal newlines.`,
  },

  mermaid_adornment: {
    format: 'simple',
    theme: `MYSTICAL-MERMAID ADORNMENT axis — natural-world body-worn ornaments (NOT clothes — mer-folk don't wear clothes). Each entry 18-26 words.

⚠️ NSFW-CLEAN HARD LINE: adornment combined with HAIR serves as natural chest-covering. Examples: shell-cluster necklace covering the chest / kelp-wrap draped diagonally across torso / scaled chest-plate extending the tail-scales up the torso / coral-rosette bra-form / pearl-strand bandeau / woven-seaweed wrap / sea-mist veil over the shoulders.

✓ ADORNMENT VARIETY:
  A. Necklace (shell-cluster, pearl-strand, coral-piece, sea-glass, bone-tooth)
  B. Crown / circlet (coral-branch, kelp-wreath, pearl-tiara, starfish-circlet, abalone-disc-circlet)
  C. Arm-band / bracelet (gold cuff with shell-inlay, coral-band, pearl-rope at wrist)
  D. Chest-covering (scaled chest-plate matching the tail / coral-rosette bra-form / kelp-wrap diagonal / pearl-strand bandeau / abalone-shell pectoral)
  E. Hair-decoration (already in HAIR axis — skip here)
  F. Ear ornament (pearl-drop, shell-hoop, coral-pendant earring)
  G. Body-paint / ritual-mark (luminescent bio-pigment painted across collarbones / arcane runes drawn in sea-pigment along arms)
  H. Veils / drapes (sea-mist gauze / silver-thread net draped from shoulders)

EVERY entry combines TWO OR THREE complementary ornaments + at least one that doubles as chest-modesty.

NEVER negation.`,
    touchpoints: [
      'A heavy shell-cluster necklace of mixed conch + abalone-discs + pink-coral pieces covering her chest, paired with a coral-branch circlet at her brow and small pearl-drop earrings.',
      'A scaled chest-plate of pearl-iridescent armor extending the tail-scales upward across her torso, paired with a kelp-wreath crown and gold arm-cuffs inlaid with mother-of-pearl.',
      'A wide woven-kelp wrap draped diagonally from shoulder to opposite hip covering her chest, paired with a starfish-circlet at her brow and coral-pendant earrings.',
      'A pearl-strand bandeau covering her chest with hundreds of pearls in graduated sizes, paired with an abalone-disc circlet at her brow and shell-hoop earrings.',
      'A coral-rosette bra-form of fused pink-coral branches across her chest, paired with a kelp-ribbon circlet and bone-tooth earrings hanging long.',
      'A sea-mist gauze veil draped across her shoulders and down her back covering her chest, paired with a tiara of pale pearl drops and silver arm-cuffs.',
      'Luminescent bioluminescent body-paint covering her chest in spiraling runic patterns, paired with a single jade-disc circlet at her brow and copper arm-spirals.',
      'An abalone-shell pectoral the size of a dinner plate covering her chest, paired with a coral-branch crown rising six inches above her head and pearl drop earrings.',
      'A silver-thread net draped from shoulders across her chest woven with tiny seed-pearls and starfish, paired with a single sea-glass pendant and coral arm-bands.',
      'A fitted scaled chest-piece in coral-pink iridescent scales matching her tail, paired with a kelp-wreath circlet woven with sea-flowers and gold ear-hoops.',
      'A wrap of woven seaweed and shells across her chest in geometric pattern, paired with a coral-circlet and tiny phosphor-glowing bead earrings.',
      'A heavy pearl-and-coral pectoral covering her chest in spiraling baroque pattern, paired with a starfish-and-sea-glass tiara and dangling pearl earrings.',
    ],
    instructions: `Each entry 18-26 words. Format: "[CHEST-COVERING ADORNMENT] [detail], paired with [TWO complementary ornaments]." Every entry includes a chest-covering modesty element. NEVER negation. Output as a NUMBERED list, one entry per line, no internal newlines.`,
  },

  mermaid_setting: {
    format: 'simple',
    theme: `MYSTICAL-MERMAID SETTING axis — her immediate stage. Each entry 22-32 words.

⚠️ Kevin explicitly called out: "on the shore, underwater, kelp forests, and SLANT all to have a magical/mystical feeling because mermaids are stuff of legend."

✓ SETTING VARIETY (full range):
  A. SHORE (sea-rock at sunset / black-sand beach moonlit / pebbled cove dawn / tide-pool grotto / sea-cliff overlook)
  B. UNDERWATER OPEN (mid-water column with caustic sun-shafts / deep blue void / mid-water with passing whale)
  C. KELP FOREST (towering kelp cathedral, sun-shafts through canopy, kelp-curtain hide-and-seek)
  D. CORAL PALACE / THRONE (coral-built throne room, mer-court setting, shell-and-pearl encrusted)
  E. SUNKEN-SHIP INTERIOR (mer-folk among the ribs of an old wreck, treasure-strewn captain's cabin underwater)
  F. SEA-CAVE / LUMINESCENT GROTTO (bioluminescent ceiling, glowing pool, stalactites)
  G. RIVER-MOUTH / FRESHWATER (river-mouth where she meets the sea, water-lilies, river-jade)
  H. POLAR ICE (under-ice swimming with shafts from above, ice-cave with seal-companions)
  I. TROPICAL LAGOON (turquoise shallows, coral garden, palm-shadows on the surface)
  J. SURFACE AT MIDNIGHT (moonlit calm ocean, stars on the water, she rises waist-up)
  K. STORM SURFACE (clinging to a rock in storm-spray, lightning above, hair-and-tail whipping)
  L. ENCHANTED LAGOON / FAIRY-TALE GROTTO (jewel-toned water, suspiciously-glowing flora, sea-flowers blooming)

EVERY entry has a MYSTICAL slant — at least one of: glow / sun-shaft / moonlight / aurora / shell-thrones / coral-cathedral / luminescent flora / suspended-magic / impossible-color.

NEVER negation.`,
    touchpoints: [
      'On a sea-cliff black-rock at sunset above a violet sea, gold sun-shafts spearing through clouds, her tail draped across the wet rock dripping silver light into the surf below.',
      'Underwater mid-column in deep cobalt water with caustic sun-shafts piercing from far above, suspended weightless in a slow spiral, hair floating in a halo around her crown.',
      'In a towering kelp-forest cathedral at noon, sun-shafts piercing the kelp canopy fifty feet above, holding stillness in a clearing between kelp pillars, fish-shoals threading the columns.',
      'On a coral-built throne in a mer-court palace, the throne fused from pink and white coral encrusted with pearls and shells, sea-fans waving behind her in slow current.',
      'Among the broken ribs of a sunken Spanish galleon at dusk, the captain\'s cabin still recognizable beneath coral encrustation, treasure spilled around her, lantern still hanging.',
      'In a luminescent sea-cave with bioluminescent ceiling glowing pale cyan and a still glowing pool reflecting it, stalactites dripping silver light, she rests on a flat rock at the pool\'s edge.',
      'At a river-mouth where freshwater meets the sea, water-lilies floating, river-jade water becoming sea-blue, she perches on a moss-covered rock where the two waters meet.',
      'Under an ice-shelf in arctic water with sun-shafts piercing thin ice from above in pale blue beams, seal-companions circling her, frost-pale tail glowing soft in the cold light.',
      'In a turquoise tropical lagoon barely deep enough to cover her tail, palm-shadows on the surface, coral garden below, a manta-ray gliding past in the deeper blue.',
      'On a calm moonlit sea at midnight, water flat as silver glass, she rises waist-up from the surface, stars reflected perfectly in the water around her, hair dripping silver.',
      'Clinging to a sea-stack rock in a hurricane, spray erupting around her, hair and tail-fins whipping horizontal, sky bruised with lightning above, ocean wild around the rock.',
      'In an enchanted jewel-lagoon with suspiciously-blue water, sea-flowers blooming in impossible coral-pink and gold beneath the surface, the water gleaming faintly from within.',
      'On a moonlit tide-pool grotto at the foot of a sea-cliff at midnight, the pool glowing faintly with bioluminescent algae, kelp-tendrils dripping from the cave-mouth above.',
      'In a deep abyssal blue at the edge of the continental shelf, drop-off to bottomless dark behind her, a single sun-shaft from far above lighting her position alone in the void.',
      'In a pebbled cove at dawn pink-and-amber sky, sea-foam rolling in slow waves around the rock she sits on, gulls wheeling far above, dewy and quiet.',
    ],
    instructions: `Each entry 22-32 words. Spatial context + light + mystical slant. Vary across 12 setting categories. NEVER negation. Output as a NUMBERED list, one entry per line, no internal newlines.`,
  },

  mermaid_action: {
    format: 'simple',
    theme: `MYSTICAL-MERMAID ACTION axis — what she is DOING IN HER WORLD when the camera catches her. Each entry 25-35 words.

⚠️ CANDID, NOT POSED — THIS IS THE LOAD-BEARING RULE. The mermaid is CAUGHT mid-moment in her own environment — not performing for the lens. NEVER head-tilted-back-mid-song hero-pose. NEVER comb-and-mirror tableau. NEVER weeping-tear-caught-mid-fall portrait. NEVER hand-raised-spell-cast stance. NEVER eyes-meeting-camera. The camera STUMBLED ON her, it did not stage her. Most entries: back-turned, side-profile, partly-occluded, glancing-aside, body-in-motion-and-already-half-gone, observed-from-distance, distracted-by-something-in-her-world.

⚠️ Mer-folk actions are POETIC and MYTHIC but ENVIRONMENTAL — passing through / gliding / exploring / hunting / gathering / weaving through / resting unobserved / surfacing-and-already-leaving / observed-from-distance / distracted-by-her-world.

✓ ACTION VARIETY (candid mid-motion in her environment):
  A. SWIMMING through kelp cathedral (body lateral, hair drifting behind, back-of-tail visible)
  B. GLIDING past a coral garden (mid-pass, side-profile or back-to-camera)
  C. DESCENDING into the abyss (body angled steeply downward, tail flicking back)
  D. HUNTING fish-shoal (mid-dart toward darting silversides, body coiled in pursuit)
  E. WEAVING THROUGH shipwreck-ribs (body curving around fallen mast / between hull-planks)
  F. PASSING beside a leviathan-shadow (small alongside whale-fluke in deep distance)
  G. SURFACING already-half-gone (only her tail-fluke visible breaking the surface in a swirl of spray)
  H. RESTING unobserved (eyes closed against a sea-cave rock, tail wrapped in kelp, current pulling at her hair)
  I. GATHERING shells in a tide-pool (back to camera, hand reaching into water, body partially out)
  J. ESCORTING a sea-turtle (alongside in slow parallel motion, off-center in frame)
  K. RIDING a fast current (body horizontal, hair streaming, gone in a moment)
  L. EXPLORING a sunken statue (body angled curiously beside the marble bust, examining)
  M. CHASING bioluminescent plankton (mid-swim through a bloom, body trailing the glow)
  N. CIRCLING the coral-throne unhurried (mid-orbit, back partially turned)
  O. OBSERVED FROM A DISTANCE (her tail just visible beyond a curtain of kelp, fragmentary)

EVERY entry is CAUGHT mid-motion in her world. NEVER staging-for-portrait. NEVER center-of-frame hero stance. NEVER direct eye-contact with camera unless she's caught NOTICING the viewer mid-motion.

NEVER negation.`,
    touchpoints: [
      'SWIMMING THROUGH KELP — Body lateral mid-glide between two towering kelp pillars, hair drifting behind in a slow column, only her back and tail-fluke visible to camera, fish-shoals parting around her.',
      'DESCENDING INTO ABYSS — Body angled steeply downward into deep blue, tail flicking back twice as she vanishes into the dark, hair streaming upward in the wake of her descent.',
      'HUNTING SILVERSIDES — Mid-dart through a fish-shoal with body fully coiled and lunging, fish scattering in silver flashes around her, tail snapping for the propulsion thrust.',
      'WEAVING SHIPWRECK — Body curving sinuously through the fallen ribs of a sunken galleon, hand grazing the encrusted wood, tail trailing behind through the gap in the hull.',
      'PASSING WHALE-FLUKE — Small alongside the broad fluke of a passing humpback in deep mid-water, her body dwarfed in scale, both moving in parallel through the blue.',
      'SURFACING AWAY — Only her tail-fluke visible breaking the moonlit surface in a swirl of phosphorescent spray, the rest of her already submerged and disappearing.',
      'RESTING IN SEA-CAVE — Eyes closed and body curled against a barnacled rock in a luminescent grotto, tail wrapped in kelp, current pulling slow at her drifting hair.',
      'GATHERING SHELLS — Back turned to camera as she crouches in a tide-pool reaching one hand into the water, tail dragging across wet pebbles, only her shoulder and back visible.',
      'ESCORTING TURTLE — Alongside a slow-gliding sea-turtle in parallel motion, both off-center in the frame, kelp-forest beyond them stretching deep into atmospheric haze.',
      'RIDING THE CURRENT — Body horizontal and stretched fully out in a fast underwater current, hair streaming behind, captured in a frozen instant of speed.',
      'EXPLORING STATUE — Body angled curiously beside an eroded marble bust of an ancient queen sunken on the seabed, hand drifting near the statue\'s cheek, examining quietly.',
      'CHASING PLANKTON — Mid-swim through a glowing cloud of bioluminescent plankton, body trailing the cyan glow, plankton swirling in her wake, face turned away.',
      'CIRCLING THRONE — Mid-orbit around a coral throne in a court chamber, back partially turned to camera, other mer-court attendants visible deeper in the architecture.',
      'GLIMPSED PAST KELP — Her tail-fluke and lower torso just visible beyond a curtain of swaying kelp in foreground, the rest of her hidden, a fragmentary mythic moment.',
      'CRESTING A WAVE — Mid-leap arched out of a breaking wave on the open sea, body curved in spray, gone again in the next breath, a glimpse from a passing distance.',
      'PASSING A REEF — Side-profile gliding past a coral garden, body lateral, tail propelling slow, not noticing the camera, observing a small octopus on the reef ahead.',
      'EMERGING FROM KELP — Body half-emerging from behind a kelp pillar, only torso and one arm visible, hair tangled with kelp fronds, mid-emergence not yet posed.',
    ],
    instructions: `Each entry 25-35 words. Format: "ALL-CAPS LABEL — candid mid-motion verb-led description with body position + spatial context + environmental detail." Every entry is CAUGHT in her world, NEVER posing. Prefer back-turned / side-profile / partly-occluded / off-center compositions. NEVER eyes-meeting-camera. NEVER staging-for-portrait. NEVER negation. Output as a NUMBERED list, one entry per line, no internal newlines.`,
  },

  mermaid_mystical_element: {
    format: 'simple',
    theme: `MYSTICAL-MERMAID MYSTICAL ELEMENT axis — the MAGIC LAYER added to every render to deliver Kevin's "stuff of legend" slant. Each entry 18-26 words.

⚠️ EVERY render gets one of these — this is the load-bearing slant. The element appears WITH her, on her, or around her.

✓ MYSTICAL ELEMENT VARIETY:
  A. Bioluminescent glow on her skin / hair / tail / eyes
  B. Arcane runes in her body-paint or floating in the water near her
  C. A floating glowing pearl above her cupped hands
  D. Fish-spirits / spectral sea-creatures attending her
  E. Wisps of glowing plankton spiraling around her
  F. An aurora reflected on the water surface above
  G. A constellation visible through the water above her
  H. A magical-glowing object she's holding (treasure / artifact / shell)
  I. Suspended particulate / sparkles drifting magically around her
  J. A halo of refracted light around her head
  K. Water bending unnaturally around her in slow gravity-defying patterns
  L. Sea-flowers blooming impossibly in the water around her

NEVER negation.`,
    touchpoints: [
      'Faint bioluminescent glow rising from her skin in soft cyan waves, brightest along her collarbones and the inner curves of her wrists',
      'Arcane runes drawn in sea-pigment along her forearms glowing faint phosphor-green, pulsing gently in rhythm with her breath',
      'A single luminescent pearl floating suspended above her cupped hands at chest height, casting cool blue light upward onto her face',
      'A small school of spectral silver fish-spirits orbiting her shoulders in a slow halo, partially transparent, faintly glowing',
      'Wisps of glowing cyan plankton spiraling around her body in a slow vortex, brightening with each movement of her tail',
      'A vivid aurora borealis reflected on the calm water surface above her, pale green and violet ribbons rippling across the mirror',
      'A constellation visible through the calm surface above her, the stars magnified and impossibly bright through the water',
      'A glowing golden treasure-cup held in her hands radiating warm light across her face and the surrounding kelp',
      'Suspended silver sparkles drifting magically through the water around her, defying gravity, glittering with each subtle current',
      'A halo of refracted prismatic light fanning around her head in concentric rainbow rings, brightest against her crown of pearls',
      'Water bending unnaturally around her in slow gravity-defying patterns, currents visibly looping back toward her hands',
      'Sea-flowers blooming impossibly in coral-pink and pale gold in the water around her, petals slowly unfolding as she breathes',
      'Tiny glowing jellyfish drifting in a constellation pattern around her hair, their bells pulsing in soft synchronized rhythm',
      'Drops of seawater rising upward from her hair against gravity, gathering above her head in a slow magical halo of suspended water',
      'A glowing pearl pendant at her throat casting cool light upward onto her chin, the light visibly stronger than the surrounding ambient',
    ],
    instructions: `Each entry 18-26 words. The magical / mythic layer added to the render. Vary across 12 mystical element categories. NEVER negation. Output as a NUMBERED list, one entry per line, no internal newlines.`,
  },

  mermaid_camera_framing: {
    format: 'simple',
    theme: `MYSTICAL-MERMAID CAMERA FRAMING axis — explicit SCENE-FIRST composition mandate. Mermaid is INHABITANT of frame, not subject of portrait. Each entry 14-22 words.

⚠️ EXPLICIT CAMERA LANGUAGE — every entry NAMES the framing/angle as THE LAW.

⚠️ SCENE IS THE HERO. She fills 20-40% of the frame at most. The SETTING + ATMOSPHERE + MYSTICAL ELEMENT dominate the composition. NEVER hero-portrait framing. NEVER centered-pose. NEVER waist-up-portrait. NEVER full-figure-fills-vertical-frame. NEVER her-as-the-poster.

✓ VARIETY (scene-environmental composition — mermaid as inhabitant):
  A. WIDE ENVIRONMENTAL ESTABLISHING (mermaid 20-30% of frame, full setting visible all around)
  B. AERIAL/OVERHEAD (looking down from above, mermaid small in the larger scene)
  C. THROUGH-THE-KELP-CATHEDRAL (kelp pillars dominate foreground+midground, mermaid glimpsed between)
  D. INTERIOR CORAL-PALACE (architecture dominates, mermaid small at throne or passing through)
  E. LONG-LENS COMPRESSION (foreground tactile detail, mermaid distant in midground)
  F. LOW-WATERLINE THROUGH-SURFACE (camera at water level, mermaid past a wave or rock)
  G. DRAMATIC-SCALE WIDE (mermaid dwarfed by environment — leviathan-shadow / abyss / cathedral)
  H. OVER-A-FOREGROUND-ELEMENT (rock / kelp / coral foreground, mermaid in midground)
  I. WATERLINE HALF-AND-HALF WIDE (split air/water, mostly environment, mermaid at center small)
  J. BACK-TURNED LATERAL (camera behind her, she facing into the scene, viewer follows her gaze)
  K. PARTIALLY-OCCLUDED (mermaid half-hidden behind kelp / coral / rock — glimpse composition)
  L. SCALE-PROVING WIDE (vast setting + mermaid as the scale-prover element)

NEVER hero-portrait / waist-up / center-of-frame-vertical. NEVER eyes-meeting-camera framing. NEVER modern cinema terms. NEVER negation.`,
    touchpoints: [
      'WIDE ENVIRONMENTAL ESTABLISHING framing, mermaid at 20% of frame in midground, full setting wrapping her with deep atmospheric perspective',
      'AERIAL OVERHEAD framing, looking down from above the water onto the scene, mermaid small at center of a vast lagoon or kelp clearing',
      'THROUGH-THE-KELP-CATHEDRAL framing, kelp pillars dominating foreground and midground, mermaid glimpsed in motion between two trunks',
      'INTERIOR CORAL-PALACE wide framing, ornate coral architecture dominating the frame, mermaid small at the throne or passing through an arch',
      'LONG-LENS COMPRESSION framing, foreground tactile detail (coral / rock / shell), mermaid distant in midground softened by atmospheric haze',
      'LOW-WATERLINE THROUGH-SURFACE framing, camera at wave-level looking past a breaking wave, mermaid glimpsed beyond in the deeper water',
      'DRAMATIC-SCALE WIDE framing, mermaid dwarfed by a leviathan-shadow passing in deep blue behind her, sense of vast oceanic scale',
      'OVER-A-FOREGROUND-CORAL framing, sharp coral branch silhouetted in close foreground, mermaid in midground passing through the deeper space',
      'WATERLINE HALF-AND-HALF WIDE, camera at the air-water boundary, mostly sea and sky, mermaid small at center half-submerged',
      'BACK-TURNED LATERAL framing, camera behind her at distance, she facing into the scene, viewer follows her gaze into the mythic depth',
      'PARTIALLY-OCCLUDED GLIMPSE framing, mermaid half-hidden behind kelp curtain or coral spur, only her tail or shoulder visible in the gap',
      'SCALE-PROVING WIDE framing, vast cathedral kelp or coral palace dominating frame, mermaid as small living scale-prover element off-center',
      'OVERHEAD KELP-CANOPY framing, looking down through kelp tops at a clearing far below, mermaid tiny on the sand among scattered light-shafts',
      'DEEP-LATERAL DRIFT framing, full-frame width of deep blue water with reef on one side, mermaid passing through middle of frame at small scale',
      'POSTCARD-LANDSCAPE WIDE framing, the scene reads as painted-landscape-with-figure, mermaid an inhabitant providing scale not the visual subject',
      'BEHIND-A-WAVE LOW framing, foreground wave-crest silhouetted black against sunset, mermaid past the wave glimpsed in profile',
      'CORAL-GARDEN AERIAL framing, looking down through clear water at a coral garden, mermaid passing among the formations seen from above',
      'CAVE-MOUTH FRAMING, dark cave-mouth arch dominating frame, mermaid small at the cave-pool inside, light pouring through the opening',
    ],
    instructions: `Each entry 14-22 words. Explicit scene-first camera framing. Mermaid is INHABITANT not portrait subject. Prefer wide environmental / over-foreground / through-kelp / behind-wave / scale-proving / back-turned / partially-occluded compositions. NEVER hero-portrait / centered-pose / waist-up. NEVER negation. Output as a NUMBERED list, one entry per line, no internal newlines.`,
  },

  mermaid_drama: {
    format: 'simple',
    theme: `MYSTICAL-MERMAID DRAMA axis — conditional 40%-gated mystical escalation. Each entry 18-26 words.

⚠️ SUBTLE WEAVING — the drama ADDS to the scene, never replaces her as the focal point. Most renders are quieter solo-mer moments; drama fires occasionally for cinematic / mythic escalation.

✓ DRAMA VARIETY:
  A. STORM ABOVE the surface (lightning fork, dark cloud, rain-pocked surface visible)
  B. SHIP IN THE DEEP DISTANCE (a tall ship visible miles offshore, her gaze tracking it)
  C. SEA-CREATURE COMPANION (whale fluke, manta, giant squid arm, sea-turtle close)
  D. AURORA ESCALATION (aurora visibly stronger, ribbons reaching down to the water)
  E. SHIPWRECK NEARBY (a wreck visible in the background blue, ribs and rigging)
  F. CORAL PALACE ATTENDANTS (other mer-folk in deep background as scale-provers)
  G. PORTAL / RUNE-GATE opening behind her (arcane glyphs lit up across an underwater archway)
  H. MOONLIGHT BREAKTHROUGH (a single shaft of moonlight cutting down through deep water)
  I. SEA-CREATURE LEVIATHAN passing (a vast shape in the distant blue dark)
  J. DROWNED-OFFERING surrounding her (rings / coins / lockets scattered on the seabed at her tail)
  K. BIOLUMINESCENT BLOOM rising (a vast cloud of glowing plankton drifting upward around her)
  L. ANCIENT GOD-PILLAR (a massive stone face or pillar emerging from the deep behind her)

NEVER negation.`,
    touchpoints: [
      'A storm bruising the surface above her, lightning forking through the dark cloud overhead, the surface rain-pocked silver, her tail glowing faintly defiant beneath',
      'A distant tall-ship silhouette visible miles offshore in the deep background, her gaze tracking it with sad recognition, the ship oblivious to her below',
      'A humpback whale gliding past in the deep background behind her, its enormous body dwarfing her in scale, eye briefly meeting hers in passage',
      'An aurora visibly stronger above the surface, ribbons of green and violet reaching impossibly down through the water toward her, lighting her crown',
      'A sunken galleon visible in the background blue, broken ribs and tilted mast looming, treasure scattered at her tail-base, kelp draping the wreck',
      'Three other mer-folk visible in deep midground as scale-provers, each at their own coral throne, the mer-court suggested without dominating her foreground',
      'An ancient stone archway behind her with arcane glyphs lit up in pulsing blue light, a portal opening to a deeper realm, her hair lifting toward it',
      'A single shaft of moonlight cutting impossibly far down through deep water from far above, lighting her precisely as if she stood in a spotlight',
      'A vast leviathan-shape passing in the distant blue dark behind her, larger than any whale, its silhouette barely visible but unmistakably enormous',
      'Hundreds of drowned-offerings scattered on the seabed at her tail — rings, gold coins, lockets, broken figurines — collected from centuries of lost sailors',
      'A vast bioluminescent plankton bloom rising in a slow glowing cloud around her body, lighting her from below in shifting cyan, her tail-scales catching the glow',
      'An ancient stone god-pillar carved with a forgotten face emerging from the deep abyssal blue behind her, her position dwarfed by the monument',
    ],
    instructions: `Each entry 18-26 words. Subtle mythic dramatic escalation that ADDS but never replaces her as focal point. Vary across 12 drama categories. NEVER negation. Output as a NUMBERED list, one entry per line, no internal newlines.`,
  },

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SEATURTLE-SCAPE path-bespoke pools (2)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  seaturtle_scenes: {
    format: 'simple',
    theme: `SEATURTLE SCENES for OceanBot's seaturtle-scape path — sea turtles in the ocean and at the shore. Each entry 18-26 words. Species + behavior + habitat ALL BAKED INTO THE ENTRY — this is the HERO pool.

⚠️ MANDATORY: every entry names a REAL species + REAL behavior + REAL habitat. NatGeo / BBC Blue Planet register. NO ships / NO people / NO diving gear.

⚠️ 80% ADULT TURTLES UNDERWATER OR NEAR WATER — beautiful adult-focused renders are the main register. 20% baby/hatchling/nesting scenes for variety. Distribute as ~20 adult-coded entries to ~5 baby-coded entries per 25.

✓ SPECIES VARIETY (~3 entries each across 7 real species):
  A. Green sea turtle (Caribbean / Indo-Pacific seagrass meadows / Hawaiian reefs)
  B. Loggerhead (Atlantic / Mediterranean / NW Pacific, powerful crushing jaws)
  C. Hawksbill (Indo-Pacific coral reefs, pointed beak, intricate carapace pattern)
  D. Leatherback (open pelagic, largest species, jellyfish hunter, no hard shell)
  E. Olive ridley (warmer Pacific / Indian Ocean)
  F. Kemp's ridley (Gulf of Mexico / Atlantic, smallest species)
  G. Flatback (Australia-endemic, shallow coastal soft-bottom)

✓ BEHAVIOR/HABITAT VARIETY — 80% ADULT (these eight bullets):
  A. Adult gliding through coral reef in turquoise sun-shafted water
  B. Adult drifting through kelp forest sun-shafts
  C. Adult cruising open pelagic with shark / fish-shoal / manta nearby
  D. Adult resting on coral / cleaning station with cleaner wrasse attending
  E. Adult surfacing for breath, head and shoulders breaking the surface
  F. Adult silhouetted against the bright surface dome from below
  G. Adult cruising a reef wall drop-off, body lateral in atmospheric blue
  H. Adult in mangrove or seagrass shallows, body just above the bottom
  I. Pair of mating adults in shallow lagoon
  J. Adult in golden-hour surface light, body lit warm from above

✓ BEHAVIOR/HABITAT VARIETY — 20% BABY/NESTING (these four bullets, sparingly):
  K. Nesting mother on a moonlit tropical beach (1-2 entries)
  L. Hatchlings scrambling toward the surf line in chevron (1-2 entries)
  M. Hatchling first underwater dive in surf-zone shallows (1 entry)
  N. Juvenile in mid-ocean sargassum mat (1 entry)

Each entry: species + behavior + habitat anchor + sensory/light detail. NEVER negation.`,
    touchpoints: [
      'Green sea turtle gliding slowly through a sun-shafted Caribbean coral reef, scarred shell catching dappled light, scissor-flippers sculling unhurried, blue tang school weaving past.',
      'Hawksbill cruising vertical reef wall in turquoise water, pointed beak picking at orange sponge, tortoiseshell carapace catching afternoon light, sea-fan curtain swaying.',
      'Loggerhead resting on a Mediterranean rocky bottom in clear blue water, powerful jaws closed, scarred shell encrusted with barnacles, single grouper hovering near her shoulder.',
      'Leatherback gliding through deep open Pacific blue at twilight, vast leathery carapace ridged with seven keels, mouth half-open trailing a jellyfish she just engulfed.',
      'Adult green turtle silhouetted against the bright surface dome above, viewed from below in deep blue, body in three-quarter profile, flippers extended in slow glide.',
      'Hawksbill at a Pacific cleaning station, body still as cleaner wrasse picks parasites from her flippers and shell, head turned to watch the small fish work.',
      'Leatherback surfacing for breath in deep open Atlantic at golden hour, head and shoulders breaking the calm surface, spray haloing her in warm light.',
      'Pair of mating green turtles in a shallow Hawaiian lagoon, larger female below, male riding her shell, both heads turned upward toward the bright surface.',
      'Loggerhead cruising past a hammerhead shark in open Caribbean blue, both moving in unhurried parallel, the shark in the deep distance behind her shoulder.',
      'Green turtle gliding through a Pacific kelp forest sun-shafted at noon, body small against towering amber-green kelp columns, sea otters visible in midground.',
      'Adult hawksbill silhouetted against a sunset surface dome in the Coral Triangle, body in lateral profile, deep coral garden receding in atmospheric blue below.',
      'Adult green sea turtle cruising along a tropical reef drop-off at midday, body lateral in atmospheric blue, school of yellowtail snapper scattering before her.',
      'Loggerhead at a deep-reef cleaning station, three cleaner wrasse working her shell, body still, sun-shafts piercing the water column above in soft pale pillars.',
      'Adult olive ridley surfacing for breath in calm tropical Pacific at dawn, only head and shoulders above water, pink-and-amber sky reflecting in mirror sea behind.',
      'Adult flatback turtle in Australian shallow seagrass meadow at noon, body floating just above the green carpet, jaws nibbling slowly at the blades.',
      'Adult Kemp\'s ridley cruising a Gulf of Mexico mangrove edge, body just below the surface, mottled green-grey shell catching dappled mangrove-shadow light.',
      'Hawksbill turtle drifting through a Solomon Islands soft-coral garden, body small against towering pink-and-orange coral spires rising past her in every direction.',
      'Adult green turtle resting languidly on a flat coral table at midday, body weightless in the gentle current, single batfish hovering near her left flipper.',
      'Loggerhead breaching just barely at the surface in golden-hour Mediterranean, head only just above water, eyes calm, vast shell submerged below.',
      'Adult hawksbill three-quarter angled in a kelp-forest sun-shaft, body lit warm from above, kelp columns rising past her into the bright dome of surface light.',
      'Olive ridley mid-arribada on a Costa Rican beach at dawn, thousands of mothers dragging trails across the sand, sea spray rising from the breakers behind them.',
      'Green turtle hatchlings emerging from sand at night under starlight, hundreds of tiny dark silhouettes scrambling outward from the central cone toward distant surf.',
      'Loggerhead hatchlings in mid-scramble across hot tropical sand toward the surf, tiny chevron formation, gulls wheeling above, surf line glinting silver ahead.',
      'Green hatchling first dive in surf-zone shallows, tiny body kicking sideways through translucent wave, head turned upward, body silhouetted against bright surface.',
      'Juvenile green turtle drifting in a sargassum mat in mid-Atlantic, body half-hidden in floating algae, tiny crabs visible in the weed around her shell.',
    ],
    instructions: `Each entry 18-26 words. Format: "[species] [behavior + body position] [habitat] [sensory detail]." Vary across 7 species + 15 behavior-habitat combos. FAVOR active dramatic moments (feeding, predator-escape, mating display, hatchling surf-scramble, cleaning-station interaction, current-riding) over passive cruising / drifting / resting. NEVER include ships / boats / divers / people. NEVER negation. Output as a NUMBERED list, one entry per line, no internal newlines.`,
  },

  seaturtle_camera_framing: {
    format: 'simple',
    theme: `CAMERA FRAMING for seaturtle-scape — explicit composition mandate. Each entry 14-22 words.

✓ VARIETY (turtle-documentary specific):
  A. UNDERWATER SIDE-PROFILE (turtle parallel mid-glide)
  B. SURFACE-LEVEL eye-contact (turtle's eye meeting lens at waterline)
  C. AERIAL OVERHEAD (drone-style top-down on a swimming turtle)
  D. BACKLIT SILHOUETTE from below (turtle silhouetted against bright surface dome)
  E. SHORE LATERAL (turtle pulling onto / off beach in side-profile)
  F. NESTING WIDE (mother on beach with full nesting context — sand + sea + sky)
  G. HATCHLING CHEVRON WIDE (scrambling group across sand)
  H. HATCHLING MACRO (tight on one or two hatchlings mid-scramble)
  I. CLEANING STATION CLOSE (turtle with cleaner-wrasse at the eye-ridge)
  J. KELP-FOREST WIDE (turtle small against towering kelp columns)

NEVER use negation. NEVER name modern cinema terms.`,
    touchpoints: [
      'UNDERWATER SIDE-PROFILE framing, turtle parallel mid-glide through frame, scissor-flippers sculling, full body horizontal',
      'SURFACE-LEVEL eye-contact framing at the waterline, turtle\'s head out of water and gaze meeting lens, calm and unhurried',
      'AERIAL OVERHEAD drone framing, turtle visible from above against the dappled reef or sandy bottom, full body in plan-view',
      'BACKLIT SILHOUETTE FROM BELOW framing, turtle silhouetted against bright surface dome, body shape and flipper-spread readable',
      'SHORE LATERAL framing, turtle in side-profile pulling up onto wet sand, surf curling behind her, body angled forward',
      'NESTING WIDE framing, mother on tropical beach mid-dig, full nesting context visible — sand foreground, surf middle, sky beyond',
      'HATCHLING CHEVRON WIDE framing, dozens of tiny silhouettes scrambling across sand in formation, surf line visible at frame edge',
      'HATCHLING MACRO framing, tight close on one or two hatchlings mid-scramble, body filling lower frame, sand grains visible',
      'CLEANING STATION CLOSE framing, turtle\'s eye-ridge filling the frame with cleaner wrasse picking parasites from her face',
      'KELP-FOREST WIDE framing, turtle small in midground against towering amber-green kelp columns rising past frame edges',
      'UNDERWATER FOLLOWING framing, camera trailing behind a swimming turtle at flipper-stroke distance, body and rear-shell visible',
      'CLOSE-UP HEAD framing, turtle\'s face and beak filling the frame underwater, scratches on the carapace visible at frame edge',
      'WATERLINE SPLIT framing, half-air half-water, turtle\'s shell visible above the surface + flippers visible below',
      'LOW WIDE BEACH framing from sand level, hatchlings scrambling toward camera in scattered formation, surf and sky beyond',
      'OVER-THE-SHELL framing, camera close above the turtle\'s rear carapace looking forward across her shell at the reef ahead',
    ],
    instructions: `Each entry 14-22 words. Explicit camera angle / framing mandate. NEVER use negation. NEVER modern cinema terms. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // WILD-SEALIFE-CAMERA path-bespoke pools (2)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  wild_sealife_scenes: {
    format: 'simple',
    theme: `WILD-SEALIFE SCENES for OceanBot's wild-sealife-camera path — apex predators + pelagic giants + sea-mammals + game fish + notable invertebrates CAUGHT-on-camera. Each entry 18-26 words.

⚠️ MANDATORY: every entry names a REAL species + REAL behavior + REAL habitat. NatGeo / BBC Blue Planet register.

✓ SPECIES VARIETY DISTRIBUTION:
  A. SHARKS — great white, mako, tiger, hammerhead, bull, oceanic whitetip, nurse, blacktip, lemon
  B. PELAGIC GIANTS — bluefin tuna, yellowfin tuna, blue marlin, black marlin, sailfish, swordfish, mahi-mahi
  C. SEA-MAMMALS — sea lion, fur seal, harbor seal, elephant seal, walrus, beluga, narwhal, orca
  D. LARGE GAME FISH — barracuda, wahoo, goliath grouper, tarpon, jack crevalle, amberjack, snapper
  E. NOTABLE INVERTEBRATES — giant Pacific octopus, giant squid, manta ray, mobula, sea snake
  F. SCHOOLING SPECTACULARS — sardine baitball, jack ball, scad school, bait swirl pursuit-by-predators
  G. POLAR — leopard seal, weddell seal, narwhal tusk
  H. DOLPHIN POD — common, spinner, bottlenose, Risso\'s, Pacific white-sided

✓ BEHAVIOR VARIETY:
  - Hunting / chasing prey
  - Breaching / launching from water
  - Cruising at surface (lateral pass)
  - Pod travel in tight formation
  - Predator-prey moment (mid-pursuit)
  - Surfacing for air
  - Patrolling reef edge / drop-off
  - Schooling pattern (bait-ball / synchronized turn)
  - Camouflaged in environment
  - Mating display / lekking

Each entry: species + behavior + habitat anchor + sensory/light detail. NEVER negation.`,
    touchpoints: [
      'Great white shark patrolling slow above a kelp forest at golden hour, scarred back catching the surface light, body dwarfing the kelp canopy below.',
      'Blue marlin chasing a sailfish-pursued baitball, bill flashing forward through silver scatter, deep blue Atlantic stretching to horizon behind it.',
      'Bluefin tuna school in tight formation cruising open Mediterranean blue, silver flanks catching surface light, dozens of streamlined bodies in synchronized motion.',
      'Tiger shark patrolling a Hawaiian reef-edge at dusk, striped flank in lateral profile, school of jacks scattering from her path in flashes of silver.',
      'California sea lion bull mid-pirouette underwater in kelp forest, whiskers flared, sun-shafts piercing the kelp canopy in pale-green pillars around him.',
      'Walrus pod hauled out on Svalbard pack ice in afternoon polar sun, dozens of ivory tusks catching the warm light, breath visible as fine vapor.',
      'Orca breaching full-body from a calm Salish Sea at sunset, twenty tons suspended momentarily, glassy water reflecting the silhouette below.',
      'Hammerhead shark school spiraling in slow vertical helix above a Cocos Island pinnacle, dozens of distinctive head-profiles against deep blue water.',
      'Sailfish lit-up mid-strike in baitball, dorsal fin fully erect and electric-blue, silver fish scattering in every direction around her bill.',
      'Goliath grouper hovering at a sunken wreck entrance in the Florida Keys, vast body the size of a refrigerator filling the cabin doorway.',
      'Mahi-mahi pursuing flying-fish across open Atlantic at midday, brilliant green-and-gold flank catching sun, prey already airborne ahead of the strike.',
      'Manta ray gliding over a Maldivian reef cleaning station, eight-meter wingspan dwarfing the small wrasses attending its underside, slow and unhurried.',
      'Giant Pacific octopus changing color across a sandy bottom mid-stride, eight arms in motion, body shifting from mottled brown to cream-and-red in a wave.',
      'Spinner dolphin pod bow-riding a pelagic swell at golden hour, six bodies airborne in mid-spin simultaneously, sun-glow halo around each.',
      'Sardine baitball cylindrical and shimmering off the Wild Coast, sea lions and gannets crashing through it from above, single mako shark cruising below.',
      'Leopard seal cruising under Antarctic ice in lateral profile, sleek serpentine body, ringed seal silhouetted above the ice ceiling in pale blue.',
      'Mako shark mid-leap from open Atlantic surface, full body airborne in mid-arc, blue-back flank catching the sun before the splash-down.',
      'Beluga pod surfacing through cracks in arctic fast ice, white melons gleaming wet, breath crystallizing in the polar air above them.',
      'Yellowfin tuna mid-pursuit of flying fish, body fully extended in fast strike, sickle-fin and yellow finlets visible, prey just leaving the surface ahead.',
      'Wahoo cruising along a reef drop-off in the Bahamas, electric-blue tiger-striped flank catching the light, body streamlined and unhurried.',
    ],
    instructions: `Each entry 18-26 words. Format: "[species] [behavior + body position] [habitat] [sensory detail]." Vary across all species categories. NEVER include ships / boats / divers / people. NEVER negation. Output as a NUMBERED list, one entry per line, no internal newlines.`,
  },

  wild_sealife_camera_framing: {
    format: 'simple',
    theme: `CAMERA FRAMING for wild-sealife-camera — explicit composition mandate. Each entry 14-22 words.

✓ VARIETY (wildlife-documentary specific):
  A. UNDERWATER SIDE-PROFILE (creature parallel)
  B. EYE-LEVEL CONFRONTATION (camera meeting creature's eye)
  C. AERIAL OVERHEAD (drone view of pod / school / lone hunter)
  D. BREACH MOMENT (low waterline angle, creature airborne)
  E. POD/SCHOOL WIDE (multiple animals in formation)
  F. SCALE-PROVING WIDE (creature tiny against vast ocean)
  G. PREDATOR APPROACH (creature coming toward camera)
  H. SPLIT-LEVEL HALF-AND-HALF (air-water boundary)
  I. CLOSE FACE FRAMING (head + face dominant)
  J. UNDERWATER LOOKING UP (creature backlit against surface)

NEVER use negation. NEVER modern cinema terms.`,
    touchpoints: [
      'UNDERWATER SIDE-PROFILE framing, creature parallel to camera at mid-water depth, full body filling horizontal frame',
      'EYE-LEVEL CONFRONTATION framing, creature head and eye meeting lens directly, intimate predator gaze',
      'AERIAL OVERHEAD drone framing, pod or school visible from above against deeper blue water',
      'BREACH MOMENT low-waterline framing, creature airborne above camera against pale sky, body suspended in spray',
      'POD/SCHOOL WIDE framing, multiple animals in synchronized formation across frame, ocean stretching beyond',
      'SCALE-PROVING WIDE framing, creature small against vast pelagic ocean, sense of immense scale',
      'PREDATOR APPROACH framing, creature swimming toward camera in deep water, scale growing as it nears',
      'SPLIT-LEVEL HALF-AND-HALF framing at air-water boundary, surface drama above + creature visible below',
      'CLOSE FACE framing, creature\'s head and face dominant in frame, eye and mouth detail',
      'UNDERWATER LOOKING UP, creature silhouetted against bright surface dome, body backlit by sun-shafts',
      'TAIL-CHASE framing from behind, creature\'s rear visible propelling away into the blue, wake trailing',
      'PARALLEL TRACKING shot beside a fast cruiser, body length-wise across frame, lateral motion visible',
      'BAITBALL FRAMING, predator inside or beside a tight cylindrical baitball, prey fish scattering around it',
      'POLAR ICE-EDGE framing, creature at the surface beside sea-ice, white-on-blue composition',
      'EXTREME WIDE-ANGLE OPEN OCEAN framing, single creature distant in vast blue, atmospheric depth dominating',
    ],
    instructions: `Each entry 14-22 words. Explicit camera angle / framing mandate. NEVER use negation. NEVER modern cinema terms. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TROPICAL-FISH-CLOSEUP path-bespoke pools (2)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  tropical_fish_scenes: {
    format: 'simple',
    theme: `TROPICAL FISH SCENES for OceanBot's tropical-fish-closeup path — SINGLE bright colorful tropical fish in the reef as the HERO. Distinct from reef-paradise (biodiversity-explosion); this path is ONE FISH PORTRAIT. Each entry 18-26 words.

⚠️ MANDATORY: every entry names ONE SPECIFIC fish species + ONE behavior + ONE backdrop element (coral / sea-fan / anemone / sand / kelp). The fish IS the hero — NO crowding species. Anatomical color/fin accuracy per species.

✓ SPECIES VARIETY (cover the full reef-fish spectrum, both tiny and large):
  TINY (1-3 inch macro register):
  A. Mandarinfish (psychedelic blue + orange swirl pattern, Indo-Pacific)
  B. Pygmy seahorse (matched to gorgonian coral, 1cm)
  C. Sexy shrimp (pink-and-white, in anemone tentacles)
  D. Yellow-banded sweetlips juvenile (yellow-and-black motion)
  E. Tiny clown goby (cream + orange, on coral branch)
  SMALL (3-6 inch):
  F. Clownfish (orange-white-black, in anemone)
  G. Yellow tang (Hawaiian)
  H. Royal angelfish (vivid yellow + blue stripes)
  I. Moorish idol (yellow-white-black with trailing dorsal filament)
  J. Butterflyfish (various species, paired)
  K. Damselfish (sergeant major / blue chromis)
  L. Cleaner wrasse (blue-and-black, at station)
  MEDIUM (6-18 inch):
  M. Parrotfish (multiple species, biting coral)
  N. Lionfish (Indo-Pacific, fan-spread fins)
  O. Pufferfish (porcupine / boxfish / mappa)
  P. Frogfish (camouflaged on sponge)
  Q. Triggerfish (queen / clown / titan)
  R. Surgeonfish (powder blue tang, achilles tang)
  S. Hawkfish perched on coral
  LARGE (18 inch - 6 feet):
  T. Napoleon wrasse (humphead, blue-green)
  U. Coral trout / coral grouper
  V. Giant moray eel peeking from a coral crevice
  W. Goliath grouper close-up
  X. Bumphead parrotfish

✓ BEHAVIOR VARIETY:
  - Hovering still in current
  - Mid-feeding (biting coral / picking algae / striking prey)
  - In motion (mid-swim / mid-turn)
  - Cleaning station moment
  - Camouflaged in environment
  - Defensive posture (puffed pufferfish / lionfish fins extended)
  - In symbiotic relationship (clownfish in anemone / wrasse on grouper)

Each entry: species name + behavior + backdrop + sensory detail. NEVER negation.`,
    touchpoints: [
      'Single mandarinfish hovering in a coral crevice at dusk, psychedelic blue-and-orange swirl pattern catching dim Indo-Pacific reef light, body filling lower half of frame.',
      'Clownfish darting through magnificent anemone tentacles, orange-and-white body sharp against the purple-tipped anemone, mid-turn back into the host.',
      'Yellow tang hovering still above a Hawaiian reef bommie, brilliant lemon-yellow body in profile against soft-focus coral garden behind.',
      'Royal angelfish mid-glide past a sea-fan, vivid yellow body banded with electric blue stripes, sea-fan fronds out of focus in foreground.',
      'Moorish idol hovering in profile, trailing dorsal filament arcing behind, black-and-white-and-yellow bands sharp against atmospheric deep-blue backdrop.',
      'Lionfish hovering with all eighteen venomous spines fully fan-spread, mahogany-and-cream zebra pattern, head tilted toward small prey just out of frame.',
      'Pygmy seahorse clinging to a pink gorgonian coral, body the size of a fingernail and perfectly color-matched, single eye visible in macro focus.',
      'Stonefish frogfish camouflaged on a sponge, mottled red-brown skin pattern matching the substrate, only the eye and lure betraying its position.',
      'Queen triggerfish mid-bite of a sea urchin spine, electric-blue cheek-stripes and yellow body in profile, urchin spines scattering around the strike.',
      'Powder blue tang hovering at a coral cleaning station, brilliant cobalt-and-yellow body in three-quarter profile, cleaner wrasse at its gill plate.',
      'Bumphead parrotfish mid-bite of a hard coral, vast forehead bulge dominating profile, coral fragments visible in the water from the impact crunch.',
      'Giant moray eel peeking from a coral crevice, jaw working slowly, mottled green-yellow head and one watchful eye visible, body hidden in the reef.',
      'Napoleon wrasse cruising past a reef wall, vast blue-green humphead profile dominating frame, scarred lips and golden flank catching surface light.',
      'Single porcupine pufferfish hovering with body partially inflated and spines half-erect, large dark eye watchful, body filling 50% of frame.',
      'Tiny clown goby perched on a coral branch tip, cream body with bright orange face, frame composition centered on the tiny fish at coral-branch end.',
      'Hawkfish perched motionless on a sea-fan branch, banded red-and-white body in profile, fan fronds rising past frame edges in soft focus.',
      'Achilles tang mid-turn above a Hawaiian reef, deep purple body with vivid orange teardrop near the tail, sun-shafts dappling the coral below.',
      'Mandarinfish pair courtship dance, two males swirling around each other in their psychedelic pattern, soft-coral backdrop in deep amber tones.',
      'Coral grouper hovering at a reef-edge cleaning station, electric red-and-blue speckled body in three-quarter profile, cleaner wrasse at its lip.',
      'Sergeant major damselfish hovering above its purple egg-patch on dead coral, black-and-yellow striped body in defensive guard position.',
    ],
    instructions: `Each entry 18-26 words. Format: "[species name] [behavior + body position] [reef backdrop] [sensory detail]." Vary across 20+ species and 7+ behavior categories. REWEIGHT toward bold, large, charismatic subjects (lionfish with fanned spines, Napoleon wrasse, goliath grouper, giant moray face-fill, queen triggerfish, emperor angelfish) — keep tiny subjects (pygmy seahorse, gobies, shrimp) to ~20% max. FAVOR active behavior (biting, threat-display, cleaning symbiosis, spawning-color flash, ambush) over still hovering / in-profile. For bottom-resting fish (hawkfish, blennies, gobies) write "resting on its splayed pectoral fins" — NEVER "perched" (the word triggers bird/talon anatomy in the render). NEVER include multiple competing species in one entry (one hero only). NEVER include ships / boats / divers / people. NEVER negation. Output as a NUMBERED list, one entry per line, no internal newlines.`,
  },

  tropical_fish_camera_framing: {
    format: 'simple',
    theme: `CAMERA FRAMING for tropical-fish-closeup — explicit composition mandate. Each entry 14-22 words.

✓ VARIETY (macro-fish-portrait specific):
  A. MACRO CLOSE (tiny fish filling frame, every scale visible)
  B. SIDE-PROFILE PORTRAIT (full lateral body of the single fish)
  C. THREE-QUARTER ANGLE (slight body turn showing depth)
  D. HEAD-ON APPROACH (fish facing camera, face dominant)
  E. EYE-LEVEL EYE-CONTACT (camera meeting the fish's eye)
  F. OVER-THE-FIN framing (foreground fin silhouette, body beyond)
  G. ANEMONE-IN-FOREGROUND (anemone tentacles soft, fish in midground)
  H. CORAL-FRAMED (fish framed by coral arch / branch / sea-fan)
  I. CLEANING-STATION CLOSE (fish + cleaner wrasse at gill)
  J. UNDERWATER LOW (camera below fish, body silhouetted)

NEVER use negation. NEVER modern cinema terms.`,
    touchpoints: [
      'MACRO CLOSE framing, tiny fish filling the frame entirely, every scale and fin-ray sharply visible at extreme close-distance',
      'SIDE-PROFILE PORTRAIT framing, full lateral body of single fish, all coloration and fin shape clearly readable in sharp profile',
      'THREE-QUARTER ANGLE framing, fish body slightly turned toward camera showing depth and body curvature, eye and gill visible',
      'HEAD-ON APPROACH framing, fish facing camera, face and mouth dominant, body receding behind in soft focus',
      'EYE-LEVEL EYE-CONTACT framing, camera meeting the single eye of the fish directly, intimate macro-portrait moment',
      'OVER-THE-FIN framing, foreground fin silhouetted in soft focus, body and face of the fish sharp in midground',
      'ANEMONE-IN-FOREGROUND framing, anemone tentacles waving soft in close foreground, clownfish sharp behind in the host',
      'CORAL-FRAMED framing, single fish visible through a natural arch of coral branches, sharp in the frame the coral creates',
      'CLEANING-STATION CLOSE framing, the host fish in three-quarter profile with the tiny cleaner wrasse sharp at the gill plate',
      'UNDERWATER LOW framing, camera below the fish at coral-base level, body silhouetted against bright surface light above',
      'ABOVE-LOOKING-DOWN framing, fish hovering still in profile with coral pattern below visible in atmospheric soft focus',
      'PERCHED-ON-CORAL framing, fish in classic perched-on-branch pose with body anchored, frame centered on the perch',
      'SOFT-CORAL CURTAIN framing, foreground curtain of soft coral fronds in motion, single fish sharp in the gap between',
      'STATION-WIDE framing, single large fish hovering motionless with multiple tiny cleaner-wrasse attending across body',
      'MID-MOTION TURN framing, single fish caught mid-turn, body angled and flowing through the curve, motion-implied frame',
    ],
    instructions: `Each entry 14-22 words. Explicit camera angle / framing mandate. NEVER use negation. NEVER modern cinema terms. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // COASTAL-POWER path-bespoke pools (3)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  coastal_power_scenes: {
    format: 'simple',
    theme: `COASTAL POWER SCENES for OceanBot's coastal-power path — heavy swells and wave crashes colliding with the shore. Each entry 20-28 words. Shore element + wave action + location/intensity ALL BAKED INTO THE ENTRY — this is the HERO pool.

⚠️ MANDATORY: every entry names a SPECIFIC, RECOGNIZABLE coastal landmark by name — never a generic "a cliff" / "a beach" / "a rock-shelf" / "an empty shore." A named place is what makes the image distinctive instead of a stock wave photo. Roster (use these, or an equally iconic named site): Big Sur, Nazaré, Cliffs of Moher, Cape Horn, Reynisfjara, Portland Head Light, Pe'ahi (Jaws), Teahupo'o, Lands End, Étretat, Cap Fréhel, Cape Disappointment, Pipeline / Banzai, Puerto Escondido (Zicatela), Giant's Causeway, the Faroe sea-stacks, Stack Rocks Wales, Thunder Hole Maine, Bay of Biscay, Skellig Michael. Pair it with a REAL wave action (crashing / exploding / surging / engulfing / shorebreak-curling / pounding / overtopping / spraying). NO ships, NO people, NO surfers. The collision is the visual spine; the named place is the hero.

✓ VARIETY MANDATE (distribute across):
  A. CLIFF FACE IMPACT (massive wave hitting vertical cliff, spray erupting 50+ feet)
  B. SEA-STACK BREAK (waves wrapping around a tall offshore sea-stack)
  C. JAGGED ROCK EXPLOSION (heavy swell exploding off a coastal-rock cluster)
  D. REEF BREAKER WALL (heavy swell at the outer reef line, lip pitching forward)
  E. LIGHTHOUSE SPRAY (wave overtopping the rocks at a lighthouse base, spray reaching the keeper's lamp)
  F. CAPE HEADLAND IMPACT (massive Atlantic / Pacific wave on a cape headland)
  G. SHOREBREAK CURL — sandy beach (Clark-Little-coded heavy wave curling onto wet sand, lip pitching forward)
  H. SHOREBREAK BARREL — heavy curling barrel with sun-light through the lip, empty beach
  I. ROCK-SHELF SLAM (wave hitting flat coastal rock-shelf, water sheeting in all directions)
  J. SEA-CAVE OVERTOP (heavy surge surging into a sea-cave mouth)
  K. STORM SURGE FRONT (wall of advancing water hitting a low coast)
  L. HURRICANE-DRIVEN IMPACT (named-hurricane-scale wave on shore, frame full of spray)
  M. ICELAND BLACK-SAND IMPACT (Reynisfjara-coded basalt sea-stacks + black sand + grey-green swells)
  N. NAZARÉ-SCALE big-wave shore (massive Atlantic wave at a Portuguese cape, scale-proving rock visible)
  O. NIGHT SHORE IMPACT (heavy wave hitting lighthouse rocks in moonlight, lighthouse beam sweeping)

Each entry: shore element + wave-impact action + iconic-location-or-intensity-cue + sensory anchor. NEVER negation.`,
    touchpoints: [
      'Massive Atlantic wave exploding off a vertical Big Sur cliff face, spray erupting fifty feet skyward, foam cascading down the basalt in white veins.',
      'Heavy storm-driven wave wrapping around a Faroe-Islands sea-stack, mist haloing the spire from all sides, dark grey-green water churning at its base.',
      'Clark-Little-style heavy shorebreak wave curling onto wet Hawaiian sand, lip pitching forward, sun catching through the translucent wave-face into a tube.',
      'Reynisfjara black-sand beach with a heavy grey-green wave exploding off the basalt sea-stacks, spray ten meters high, dark volcanic shore receding.',
      'Cape Disappointment lighthouse engulfed by a heavy Pacific wave, spray reaching the keeper\'s lamp, foam cascading down the wet rocks below.',
      'Nazaré-scale wave breaking off the Portuguese cape headland, sixty-foot wall of water, tiny rock-shelf in foreground proving the scale.',
      'Cliffs of Moher with a massive Atlantic swell exploding at the base, white spray climbing two hundred feet up the dark sandstone, gulls wheeling in the wind.',
      'Heavy shorebreak barrel curling onto an empty Oahu beach at golden hour, sun shining through the translucent wave lip, sand kicking up in the impact zone.',
      'Massive storm wave hitting a coastal rock-shelf in Iceland, water sheeting outward in all directions, basalt cliffs dark and wet in the bruised dawn light.',
      'Storm-driven shore-break crashing against the jagged rocks at Cape Horn, white water exploding skyward, grey-black sea stretching to the storm horizon.',
      'Heavy Pacific swell engulfing the rocks at Portland Head Light, lighthouse white-painted tower visible above the surge, spray over the lower walls.',
      'Sea-cave mouth at Lands End mid-surge, heavy wave compressing into the cave throat, spray-vapor blasting outward at violent pressure.',
      'Hurricane-scale wave hitting a low-coastal sea-wall in the Outer Banks, advancing wall of water filling the frame, light-fixtures barely visible above.',
      'Sea-stack of Iceland at Reynisfjara mid-impact, heavy grey-green wave breaking on the basalt column, white spray climbing the dark vertical pillars.',
      'Heavy shorebreak detonating onto Zicatela sand at Puerto Escondido, the Mexican-Pipeline lip pitching forward and exploding in a wide white foam-burst.',
      'Coastal cliff at Etretat in Normandy mid-impact, chalk-white cliff dwarfed by exploding wave, spray fanning sideways in the brisk Atlantic wind.',
      'Heavy storm surge at a Maine rocky coastline at blue hour, wave overtopping the jagged granite, spray sheeting upward into the steel-blue dawn.',
      'Massive shorebreak barrel at Pipeline at golden hour, perfect tube curling onto wet sand, sun spear through the lip, empty beach stretching far behind.',
      'Lighthouse rocks at Cap Fréhel completely engulfed by a heavy Atlantic wave at dusk, only the lighthouse tower visible above the white spray and foam.',
      'Sea-stack impact at Stack Rocks in Wales mid-storm, heavy swell wrapping the column, brown-green water churning at the base, sky bruised behind.',
    ],
    instructions: `Each entry 20-28 words. Format: "[NAMED iconic coast + shore element] [wave action + impact intensity] [sensory anchor / scale-cue]." EVERY entry MUST name a specific recognizable landmark from the roster (or an equally iconic named site) — never a generic unnamed cliff/beach/shelf/"empty shore." Vary across the 15 categories above. NEVER include ships / boats / surfers / people / drones. NEVER negation. Output as a NUMBERED list, one entry per line, no internal newlines.`,
  },

  coastal_power_weather_and_sky: {
    format: 'simple',
    theme: `WEATHER + SKY for OceanBot's coastal-power path — the atmospheric mood that pairs with the wave-impact. Each entry 14-22 words. This axis gives the path its dramatic range across times of day / weather fronts / lighting moods.

⚠️ The weather/sky entry is what makes a wave-on-cliff render either "moody storm" or "golden-hour wallpaper" or "stormy dawn" etc. — load-bearing for the path's atmospheric variety.

✓ VARIETY MANDATE (distribute across):
  A. GOLDEN HOUR (warm low-sun amber, long shadows, sun-shafts piercing cloud)
  B. SUNSET (saturated pink-and-orange sky over storm-grey sea)
  C. DAWN (pre-dawn blue-pink, mist over the water, soft light)
  D. BLUE HOUR (cool steel-blue twilight, lighthouse beam visible)
  E. STORM FRONT (advancing wall-cloud, rain-drizzle visible, charged atmosphere)
  F. HURRICANE SKY (bruised purple-grey overhead, lightning fork visible in distance)
  G. AURORA-OVER-COAST (Northern Lights green-violet ribbons over Iceland / Norway / Faroes coast)
  H. RAINBOW-AFTER-SQUALL (departing rain on left, rainbow arcing over the shore)
  I. NIGHT-WITH-MOON (full moon over storm-tossed sea, lighthouse beam sweeping)
  J. NIGHT-WITH-LIGHTNING (storm with frequent lightning, dramatic strobes)
  K. OVERCAST-DRAMATIC (low heavy grey ceiling, contrasted with white spray below)
  L. SUN-SHAFTS THROUGH BROKEN CLOUD (dramatic god-rays piercing storm cloud onto the shore)
  M. MIST-AND-FOG (thick coastal mist, foghorn-implied mood)
  N. CRISP-CLEAR with whitecaps (blue sky, deep-cobalt water, distinct horizon)
  O. WINTER-COASTAL (low sun, cold blue light, frost on rocks)

NEVER negation.`,
    touchpoints: [
      'Golden hour amber-low-sun raking the wave-face, long shadows across the wet rocks, sun-shafts piercing broken cloud behind',
      'Saturated pink-and-orange sunset blazing over the storm-grey sea, the silhouette of the shore receding into amber haze',
      'Pre-dawn blue-pink sky with soft mist drifting low over the water, the eastern horizon glowing pale rose behind the cliffs',
      'Cool steel-blue twilight at blue hour, lighthouse beam visible cutting through the gathering dusk above the shore',
      'Storm front advancing as a wall-cloud over the headland, rain-drizzle visible in the middle distance, charged pre-storm atmosphere',
      'Bruised purple-grey hurricane sky overhead, fork of lightning visible in the distant storm-wall, full sense of natural power gathering',
      'Aurora borealis green-and-violet ribbons rippling over an Icelandic coast, the sky alive above the dark wave-impact zone below',
      'Rainbow arcing over the shore as the squall departs to the left, foreground rocks still wet, the right sky already clearing pale blue',
      'Full moon hanging over a storm-tossed sea at midnight, lighthouse beam sweeping across the dark spray-filled coast below',
      'Frequent lightning forks splitting the storm sky over the cape, brief cold-white strobes illuminating the wave-face mid-impact',
      'Low heavy overcast ceiling pressing down with a deep grey diffuse light, white spray below in stark contrast against the sky',
      'Dramatic god-rays piercing broken storm cloud and spotlighting the wave-impact zone on the shore, sky theatrical and divine',
      'Thick coastal mist and fog reducing visibility, foghorn mood implied, shore architecture half-revealed through the grey-white veil',
      'Crisp clear blue sky with deep-cobalt water and a sharp horizon line, whitecaps visible all the way out, brisk wind energy',
      'Winter coastal scene with low cold blue light, frost on the rocks above the high-tide line, sun-low at the horizon casting long shadow',
      'Pastel dawn pink melting into pale orange across the upper sky, sea-mist drifting low over the breakers, soft and serene',
      'Storm-break sun-shaft stabbing through the dark cloud onto a single point on the breaker, the rest of the shore still bruised grey',
      'Rich amber golden hour with deep-blue ocean and brilliant orange spray-foam, the wave-impact lit warm from the side by low sun',
      'Crepuscular rays fanning from a setting sun behind broken cloud over the shore, brilliant pink-and-gold theatrical sky',
      'Night sky with full Milky Way arching overhead, the shore in pale silver moonlight, wave-impact a silver burst against dark rock',
    ],
    instructions: `Each entry 14-22 words. Format: "[time of day / weather] [sky color + cloud detail] [light behavior + secondary atmospheric mood]." Vary across the 15 categories above. NEVER negation. Output as a NUMBERED list, one entry per line, no internal newlines.`,
  },

  coastal_power_camera_framing: {
    format: 'simple',
    theme: `CAMERA FRAMING for coastal-power — explicit composition mandate. Each entry 14-22 words.

✓ VARIETY (coastal-impact cinematography):
  A. LOW WATERLINE PUNCH (camera at sea level looking up at wave + cliff)
  B. AERIAL HIGH OVERLOOK (drone-style high above the shore looking down)
  C. CLIFF-EDGE SIDE PROFILE (camera on cliff edge, wave-impact in lateral profile)
  D. INSIDE-THE-BARREL (camera inside a shorebreak tube, lip curling overhead)
  E. WIDE PANORAMA (sky + shore + ocean in full frame)
  F. EXTREME LOW from sand (wave breaking over camera height on the beach)
  G. LIGHTHOUSE LATERAL (lighthouse + wave impact in side-profile from cliff)
  H. ZOOM-COMPRESSION distant (heavy wave hitting a distant landmark, atmospheric layers)
  I. OVER-THE-ROCKS (foreground rocks silhouetted, wave impact behind)
  J. SLAM-FROM-ABOVE (camera looking straight down at wave hitting flat shelf)

NEVER use negation. NEVER modern cinema terms.`,
    touchpoints: [
      'LOW WATERLINE PUNCH framing, camera at sea-level looking up at the towering wave hitting the cliff above',
      'AERIAL HIGH OVERLOOK framing, drone-style high above the shore, wave-impact zone visible from above',
      'CLIFF-EDGE SIDE PROFILE framing, camera on the cliff edge, wave impact in lateral profile against the rock face',
      'INSIDE-THE-BARREL framing, camera inside a heavy shorebreak tube with the lip curling overhead, light through the wave-face',
      'WIDE PANORAMA framing, full vista with sky + shore + ocean visible, wave-impact in midground as one element of the larger composition',
      'EXTREME LOW BEACH framing, camera planted at sand level, wave breaking forward toward the lens, sky narrow above',
      'LIGHTHOUSE LATERAL framing, lighthouse and the wave-impact at its base both in side-profile, viewed from a nearby cliff',
      'ZOOM-COMPRESSION DISTANT framing, telephoto compression making a distant wave-impact appear massive, atmospheric haze flattening layers',
      'OVER-THE-ROCKS framing, jagged foreground rocks silhouetted in sharp focus, heavy wave impact in midground beyond them',
      'SLAM-FROM-ABOVE framing, camera looking straight down at a wave hitting a flat rock shelf, water sheeting outward in radial pattern',
      'GROUND-LEVEL SHOREBREAK framing, camera positioned mid-shorebreak on wet sand, wave curling toward lens',
      'CLIFF-TOP HIGH framing, far view from a tall headland down onto a distant wave-impact, scale-proving rocks in foreground',
      'AERIAL DRONE SHOREFRONT framing, sweeping along the coastline at altitude, multiple wave-impact zones visible',
      'BACKLIT WAVE framing, low sun behind the wave-face, the wave lit through translucent like stained glass',
      'WATERLINE-SPLIT framing, half air half water, wave-impact dominant in the air half with churning subsurface visible in the water half',
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
  D. Painterly classic (mossy-jade brushwork, burnished bronze, jewel-tone emerald, Romantic-era oil register)
  E. Monochrome (pewter-monochrome, silver-tone)
  F. Bioluminescent / magical (bioluminescent-cobalt-emerald, phosphorescent-blue, glowing-cyan-and-violet)
  G. Cinematic (teal-and-orange cinematic, Hollywood blockbuster register)

NEVER use negation.`,
    touchpoints: [
      'cinematic teal-and-orange palette, saturated cool-and-warm contrast, Hollywood blockbuster register',
      'abyssal-black-and-cyan palette, deep-sea register with bioluminescent cyan accents against the black void',
      'Aivazovsky-storm-amber palette, golden sun-break in the dark storm-cloud, painterly drama through chiaroscuro',
      'mossy-jade and amber painterly palette, jewel-tone Romantic-era oil brushwork register',
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
