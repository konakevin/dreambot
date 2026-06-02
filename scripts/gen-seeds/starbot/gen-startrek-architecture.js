#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/startrek_architecture.json',
  total: 25,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} STAR-TREK-CODED ARCHITECTURE entries for StarBot's star-trek-architecture path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ARCHITECTURAL INTERIOR in the Star Trek aesthetic tradition — Federation starship bridge, Borg cube hexagonal corridor, Klingon volcanic-stone hall, Bajoran orange-stone temple, Cardassian station promenade, Romulan throne chamber, Vulcan red-stone meditation chamber, Trill cave-temple, Risa tropical resort lounge.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO BORG-DRONES, NO FEDERATION-OFFICERS-AS-FIGURES. Pure architecture only.

CRITICAL — NO PROPER NOUNS. Never write "Vulcan", "Klingon", "Romulan", "Cardassian", "Bajoran", "Federation", "Starfleet", "Borg", "Trill", "Risa", "Deep Space Nine", "Enterprise", "Picard", "Spock" — describe the AESTHETIC generically.

━━━ AESTHETIC DNA ━━━

Capture the mood of CLASSIC-Star-Trek concept-art / NEXT-GENERATION painted-matte / Andrew-Probert / Rick-Sternbach / Herman-Zimmerman. Each species has a STRONG color signature. UTOPIAN-FEDERATION: clean modular curved-walls + carpeted floors + soft warm-amber LCARS console glow. BORG-INDUSTRIAL: matte-black hexagonal cells + green-light tubing + cables everywhere. KLINGON: volcanic-stone walls + bronze trim + dim amber torchlight. ROMULAN: green-and-bronze brutalist-classical. CARDASSIAN: bone-rust sloped-walls + sodium-amber lighting. VULCAN: red-stone meditation chamber + carved geometric details. ORANGE-STONE TEMPLE: weathered devotional architecture with religious carvings.

━━━ ARCHITECTURE CATEGORIES (variety across ${n}) ━━━

FEDERATION-STARSHIP BRIDGE INTERIORS (~4):
- Federation-style starship bridge with horseshoe console arrangement, central command chair, panoramic viewscreen showing starfield
- starship bridge with curved walls, soft amber LCARS console glow, captain's seat at center, viewscreen ahead
- starship corridor with arched ceiling, soft warm lighting, comm-panel along walls, neutral-grey carpet
- engineering deck with central warp-core column glowing blue, multi-tier walkways, cable conduits

BORG-CUBE HEXAGONAL CORRIDORS (~3):
- vast Borg-cube corridor with hexagonal cell-alcoves lining the walls, green-light tubing, sterile mechanical aesthetic
- assimilation chamber with hexagonal alcoves stacked floor to ceiling, green tube-lighting, no figures
- cube-station central node with vertical green-light pillars, mechanical architecture, deep dark ambient

KLINGON VOLCANIC-STONE HALLS (~3):
- volcanic warrior-empire great hall with rough-hewn stone walls, bronze sigils, dim torchlight, banners hanging
- warrior-citadel chamber with carved-rock walls, weapon-racks, central iron-and-stone throne (no figure)
- empire-feast hall with long stone tables, banners, brazier-fires, dim amber torchlight

ROMULAN GREEN-AND-BRONZE EMPIRE INTERIORS (~3):
- imperial throne chamber with green-and-bronze walls, raised bronze dais, militaristic-but-elegant proportions
- senate council chamber with curved seating, green-tinted ambient, bronze geometric inlay
- imperial palace gallery with bronze sculptural decoration, jade-green wall panels, polished floor

CARDASSIAN BONE-RUST STATION (~2):
- station promenade with bone-colored sloped walls and rust-amber accent lighting, brutalist-alien architecture
- ochre-bone corridor with sloped sand-blasted walls, sodium-amber lighting, alien-bureaucratic mood

VULCAN RED-STONE MEDITATION CHAMBERS (~2):
- ancient red-stone meditation chamber with carved geometric panels, single shaft of light, simple platform
- Vulcan-style temple interior with carved-rock walls, brazier glowing dim red, atmospheric heat-haze

BAJORAN ORANGE-STONE TEMPLES (~2):
- orange-stone temple chamber with elaborate religious carvings, devotional candles, shaft of warm light
- monastery interior with weathered orange-stone walls, prayer rugs, scattered devotional objects (no figures)

TRILL CAVE-TEMPLE INTERIORS (~2):
- subterranean symbiont-cave temple with bioluminescent pools glowing through translucent walls
- mystical underground chamber carved from living rock, soft cyan-green glow from natural pools, smooth water

RISA TROPICAL RESORT LOUNGES (~2):
- tropical resort lounge interior with palm-trees, polished wooden floor, panoramic ocean view, classical-future architecture
- pleasure-planet pavilion with elegant fountains, classical columns, sunset light through arched windows

UNDERGROUND BASE / SECRET FACILITY (~2):
- secret underground research base with concrete walls, cables along ceiling, scattered terminals, no figures
- subterranean facility with reinforced steel doors, fluorescent strips, military-grade aesthetic

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO Borg-drones / NO Federation officers
- NO franchise proper nouns
- Strong COLOR signature per species (red-rock / green-bronze / bone-rust / matte-black-green / volcanic-stone-bronze / orange-stone / warm-amber-LCARS)
- Variety across the 10 categories above mandatory

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
