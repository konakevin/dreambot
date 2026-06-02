#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

// SUPPLEMENT 2026-05-03 — wheeled / tracked / hovering / squat-mech body
// plan diversification. Existing pool was too leg-centric. Kevin's reference
// images: Claptrap-style single-wheel droid, WALL-E-style 4-wheel rover,
// MechWarrior-style squat heavy mech. Adding ~10 entries with these forms.
//
// HARD constraints carried over: no Mandalorian, no skeletal/endoskeleton,
// no centipede, no cyclops single-eye dominating face, robot-only descriptions
// (no actions/scenes/stances).

generatePool({
  outPath: 'scripts/bots/starbot/seeds/robot_types.json',
  total: 126, // existing 116 + 10 new
  batch: 10,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ROBOT entries to ADD to an existing pool. Each entry is a DENSE phrase (40-60 words) describing the BODY of a sci-fi droid — NOT actions, NOT settings, NOT stances.

These ${n} entries fill in BODY-PLAN diversity that the pool is missing — wheeled rovers, tracked mechs, hovering droids, squat heavy mechs. NO bipedal humanoids in this batch (pool already has ~40% bipedal — these are alternative body plans).

━━━ BODY PLAN TARGETS — distribute across ${n} ━━━

(~30%) **SINGLE-WHEEL gyro-balanced droid** — Claptrap-style, single large rubber tire as base, gyroscope-stabilized boxy or rounded torso above, character-grade mission DNA (scout / explorer / hunter / messenger / pilgrim with prayer-flags). Personality through eye-design (NOT cyclopean — twin eye-domes, multi-iris compound dome, helmet w/ paired optics).

(~25%) **FOUR-WHEEL rugged rover** — Mars-rover energy, four oversized balloon-tire wheels, low-slung chunky chassis between wheels, sensor-mast or scientific-payload on top, weathered desert/lunar finish, atmospheric mission feel.

(~10%) **SIX-WHEEL exploration buggy** — six small rugged wheels, longer chassis, articulated body sections allowing terrain-flex, mounted equipment or weapons.

(~15%) **TRACKED MECH** — caterpillar/tank-tread base, bipedal-or-armored upper torso (turret-style), heavy combat/extraction mission, twin treads visible on left and right sides.

(~10%) **HOVERING / FLOATING droid** — body suspended on visible repulsor-field shimmer or thruster-vents, NO legs touching ground, can be humanoid-shaped or compact-disc-shaped, character-scale.

(~10%) **SQUAT HEAVY MECH** — boxy bipedal-but-stumpy, cockpit-canopy head with NO humanoid face (no eyes, just a viewport), bulky armored torso, thick short legs, MechWarrior-class energy. Camouflage-paint or industrial-rust finish, missile-pod shoulders, exhaust louvers. Variant: armored bipedal with chicken-walker reverse-articulated legs.

━━━ HEAD / FACE — varied (no cyclops single-eye-dominating face) ━━━

- Twin glowing eye-domes (Claptrap-style two big friendly blue lenses)
- Multi-iris compound-eye dome
- Cockpit-canopy / viewport (no eyes — for squat mechs and tracked mechs)
- Sensor-mast antenna stack (no humanoid head — for rovers)
- Helmet with side-mounted antenna pods + thermal visor pods
- Paired optical sensors set wide apart (looks friendly / inquisitive)

━━━ MUST-HAVES (every entry) ━━━

1. WEATHERED finish — rust blooms / salt-corrosion / scuffed paint / battle-scars / oil stains / desert-sand patina
2. MISSION-READABLE — what is this thing FOR? scout / explorer / hunter / nomad-pilgrim / messenger / heavy-combat / tracker / surveyor
3. THREE-PLUS function-driven features — antenna mast / sample-claw / specimen-cradle / weapon mount / banner staff / prayer-flag streamers / cargo-pod / signal-jammer / capture-net launcher
4. GLOWING ACCENT VENTS — plasma-cyan / amber-gold / void-purple / fel-violet / Mars-red / ozone-green underlight, scattered indicator lights along body
5. PERSONALITY THROUGH SCARS / ENGRAVING — kill-tally / clan symbols / hand-painted markings / mission-stickers / battle-trench scoring / saffron prayer-flags / tattered banners

━━━ HARD BANS ━━━

- NO Mandalorian / Boba Fett / IG-88 / T-visor helm / single-shoulder pauldron cape / jet-pack
- NO skeletal endoskeleton / exposed-bone-frame
- NO centipede-segmented bodies
- NO cycloptic single-large-eye dominating face (twin eye-domes are FINE)
- NO X-bodied animal descriptors
- NO bipedal humanoids in this batch (pool already covers them)
- NO actions / stances / poses / scenes / settings — robot body only
- NO mundane utility (chef / cleaner / janitor / postal / etc.)

━━━ FEW-SHOT EXAMPLES ━━━

EX-1 (single-wheel scout): "Single-wheel gyro-balanced scout droid, large oversized rubber tire as base, boxy weathered yellow chassis above wheel with peeling stickers and oil stains, twin large glowing blue eye-domes set wide on cylindrical head giving it inquisitive friendly read, antenna mast crowned with small pennant flag, signal-jamming antenna on shoulder, kill-tally scratched into chest plate, plasma-cyan rim glow from wheel hub."

EX-2 (four-wheel desert rover): "Four-wheel rugged exploration rover droid with balloon-tire wheels caked in red Martian dust, low-slung chunky chassis in sand-beaten desert-tan armor between wheels, telescoping sensor-mast rising from spine carrying tattered red flag, sample-claw manipulator arm folded against side, multi-spectrum scanning bar between paired headlamp optics, expedition-guild decals worn to ghost-pale tracings, ozone-green underlight from wheel-well vents."

EX-3 (squat heavy mech): "Squat heavy combat mech, boxy armored torso painted forest-green camouflage with weathered rust streaks, thick short bipedal legs with heavy hydraulic pistons, cockpit-canopy head with reflective visor (no humanoid face), shoulder-mounted missile pods, twin heat-exhaust louvers on flanks, kill-tally engravings deep across pauldron, ozone-green internal-glow from cockpit, MechWarrior-class silhouette."

EX-4 (tracked combat-walker): "Tracked combat-walker droid, twin caterpillar treads on either side caked with mud and shrapnel, heavy armored turret-torso rotating above tread base, chrome-and-charcoal plating with battle-scar damage, dual cannon-arms extending from torso, multi-iris compound-eye dome head, ammunition bandolier draped across chassis, plasma-cyan underlight from ventilation slats, signal-jamming antenna on dorsal mount."

EX-5 (hovering messenger): "Hovering messenger droid, compact disc-shaped polished-titanium body suspended on visible plasma-cyan repulsor-field shimmer with no legs, twin glowing amber eye-domes on cylindrical head extending from disc, wax-seal stamp dispenser port, encrypted-data drum visible through transparent panel, holographic coordinate iris projecting beneath body, signal antennas radiating outward, scuffed verdigris-bronze plating."

EX-6 (six-wheel exploration buggy): "Six-wheel exploration buggy droid, six small rugged wheels with weathered tread, articulated tri-segment chassis allowing terrain-flex, sensor-mast carrying meteorological instruments and saffron prayer-flag streamers, sample-claw on extending arm, mounted dart-rifle on dorsal swivel, paired optical sensors on cylindrical head, expedition-guild symbols hand-painted on flanks, Mars-red strobe alert beacon, void-purple underlight from chassis vents."

EX-7 (Claptrap-style pilgrim): "Single-wheel pilgrim droid, large knobby tire base with prayer-bell suspension straps, boxy gunmetal chassis above wheel hand-decorated with ochre tribal blessing-symbols, hand-woven turquoise blanket draped across upper hull, twin friendly blue eye-domes on cylindrical head with antenna mast, copper prayer-bells suspended from manipulator arm, saffron prayer-flag streamers on antenna, incense-smoke patina on ventilation grilles."

EX-8 (hovering hunter-droid): "Hovering hunter-droid, compact rounded charcoal chassis suspended on twin thruster-vents replacing legs, no ground contact, heavy combat helm with TWIN deep-set red slit-optics in eye-sockets, wrist-mounted blaster gauntlets on articulated arms, restraint-coil bundle hanging from hip, signal-jamming antenna on shoulder, kill-tally engravings worn into pauldron, plasma-cyan repulsor glow beneath body."

EX-9 (tracked excavator): "Tracked excavation droid, twin reinforced caterpillar treads streaked with rust-orange and oil, heavy armored upper chassis in soot-blackened steel, oversized hydraulic drill-arm extending from front, articulated sample-cradle on opposite side, sensor-bridge head with paired horizontal scanning bars, ozone-green underlight bleeding through chassis vents, expedition-guild symbols engraved deep, weathered exhaust stack."

EX-10 (four-wheel war-rover): "Four-wheel armored war-rover droid, oversized rubber tires reinforced with brass cleats, low charcoal-titanium chassis with battle-scarred plating, mounted heavy-pistol on dorsal swivel-turret, paired headlamp optics flanking sensor-bar visor on cylindrical head, weapons rack along left flank carrying spare ammunition cells, kill-tally hand-painted on hood, signal-jamming antenna sprouting from spine, fel-violet underlight from wheel hubs."

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Each entry is a body-only description matching the few-shot examples in body-plan variety.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
