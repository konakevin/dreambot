#!/usr/bin/env node
/**
 * Generator for SteamBot steampunk-labs path-bespoke pools:
 *   - STEAMPUNK_LABS_SPACE (lab interior architecture)
 *   - STEAMPUNK_LABS_CENTERPIECE (the main glowing experiment, focal point)
 *   - STEAMPUNK_LABS_APPARATUS (peripheral lab instruments — pickN:3)
 *   - STEAMPUNK_LABS_ELECTRICAL (80%-gated Tesla lightning / electrical arc phenomena)
 *   - STEAMPUNK_LABS_SCIENTIST (60%-gated tiny lab-coated figure scale prover)
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const { SONNET } = require('./lib/models');

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((s, i, a) => (s.startsWith('--') ? [s.slice(2), a[i + 1] ?? true] : null))
    .filter(Boolean)
);
const POOL = args.pool;
const TARGET = parseInt(args.target || '0', 10);
const BATCH = parseInt(args.batch || '25', 10);
const COUNT = parseInt(args.count || (TARGET ? '0' : '30'), 10);

if (!POOL) {
  console.error('Usage: --pool {space|centerpiece|apparatus|electrical|scientist} --count N OR --target N');
  process.exit(1);
}

const POOL_FILES = {
  space: 'steampunk_labs_space.json',
  centerpiece: 'steampunk_labs_centerpiece.json',
  apparatus: 'steampunk_labs_apparatus.json',
  electrical: 'steampunk_labs_electrical.json',
  scientist: 'steampunk_labs_scientist.json',
};
const OUT = path.resolve(__dirname, 'bots/steambot/seeds', POOL_FILES[POOL]);

const RECIPES = {
  space: `Generate STEAMPUNK SCIENCE LAB INTERIOR descriptions. Each is ONE comma-separated line, 35-55 words, describing a Victorian-industrial mad-scientist laboratory ARCHITECTURAL SPACE — the kind of place where impossible experiments happen.

These are ambitious INTERIORS — soaring arched glass ceilings, two-story balconies, wrought-iron staircases, mahogany shelving up the walls, brass railings, gas-lamps, marble-and-brass workbenches, mosaic tile floors with embedded sigil-patterns. The space is big enough for grand experiments. Inspired by Tesla's Wardenclyffe / Da Vinci's workshop / Frankenstein's tower-lab / Nemo's Nautilus interior / Victorian observatory / alchemist's tower / Royal Society lecture-hall / Crystal Palace.

Variety mandate (rotate widely — vary the architecture AND the color palette across entries):
- ~15% soaring arched-glass-ceiling rotunda (cathedral-glass dome above, two-story balconies wrap the round room)
- ~15% tower-lab with circular stair winding up the central column (multi-level laboratory inside a cylindrical brass-and-stone tower)
- ~15% long basilica-style hall with vaulted brick ceiling and gas-lamp chandeliers (workbenches in two rows down the center)
- ~10% cluttered cathedral-attic (steep timber rafters, leaded-glass dormers, telescope through the apex)
- ~10% brass-and-glass conservatory-lab hybrid (greenhouse architecture with experiments instead of plants, climbing copper-tubing instead of vines)
- ~10% subterranean vault-lab with vaulted-brick ceiling and iron-railed mezzanine (low-lit, gas-lamps, sigil-floor)
- ~10% ship's-cabin-style nautical-lab with porthole windows and brass-bound bulkheads (round portholes, mahogany paneling)
- ~5% open-roof observatory-lab (telescope mount through retractable copper-and-glass roof, half-dome)
- ~5% mountain-monastery-lab carved into rock with iron-bound bookshelves and arched windows
- ~5% airship-gondola-lab interior (large cabin with starboard window-wall over clouds)

EVERY entry includes:
- ARCHITECTURAL STRUCTURE (arched glass ceiling / two-story balcony / vaulted brick / tower-stair / etc.)
- A WALL/SHELVING TREATMENT (mahogany floor-to-ceiling shelves / brass-railed mezzanine / leaded-glass cabinets / wrought-iron balustrades)
- AMBIENT GAS-LAMP / WARM LIGHT SOURCES on standing lamps, sconces, chandeliers
- A FLOOR TREATMENT (mosaic tile with embedded sigil / wide mahogany planks / black-and-white marble / brass-inlaid stone)
- WORKBENCH PRESENCE (marble-topped brass-legged workbench / mahogany counter / long iron-bound table)
- SCALE that supports grand experiments (high-ceilinged, two-story, soaring, multi-level)

VARY THE COLOR PALETTE across entries — different labs have different dominant accent tones (the lab itself is wood/brass/glass; the EXPERIMENTS bring the saturated color from the OTHER pools). Don't lock to one palette in the architecture itself.

GOOD examples:
- Soaring arched-glass-ceiling rotunda with two-story brass-railed balconies wrapping a round chamber, mahogany shelves climbing every wall packed with leaded-glass cabinets, marble-topped workbenches in a circle around the center, mosaic tile floor with embedded sigil-pattern, brass gas-lamp sconces every few feet
- Cathedral-attic laboratory with steep timber rafters disappearing into shadow, four leaded-glass dormer windows on each side, central observation-table beneath a brass-mounted telescope, iron-bound bookshelves climbing the walls, gas-lamp chandelier hung from the ridge-beam
- Tower-lab with cast-iron spiral staircase winding three stories up the central column, brass-railed mezzanines at each level laden with experiments, gas-lamps mounted along the helical rail, leaded-glass arched windows ringing the upper level

ABSOLUTE BANS:
- NO modern / electric / computer / LED / fluorescent / digital
- NO sterile / clinical / minimalist (always cluttered + intricate + Victorian-busy)
- NO empty rooms (always packed with apparatus + shelving + workbenches)
- NO factory / industrial-warehouse register (this is a SCIENCE laboratory, ornate)
- NO outdoor / no exterior shots
- NO primary human figure (the figure is a scale-prover from the SCIENTIST pool only)
- NO restoration to one signature color (architecture is wood-brass-glass; color comes from experiments)
- NO single-tier flat compositions — always multi-level / arched / vaulted scale

Output: ONE space per line. No numbering. No quotes.`,

  centerpiece: `Generate STEAMPUNK SCIENCE LAB CENTERPIECE EXPERIMENT descriptions. Each is ONE comma-separated line, 30-50 words, describing THE main glowing experiment that anchors a steampunk lab scene — the focal centerpiece the viewer's eye lands on first.

This is the WOW experiment — the impossible glowing thing in the middle of the room. Mad-science meets alchemy. Often inside a containment vessel, often glowing dramatically, often emitting sparks / vapor / liquid-motion.

Variety mandate (rotate widely across CENTERPIECE TYPES — vary the apparatus, vary the glow color):
- ~15% Massive glass containment-sphere on brass tripod (4-6 feet tall glass globe, glowing liquid inside, brass valves on top)
- ~15% Tesla-coil apparatus (copper-coil cylinder on brass base, dome electrode at top, miniature lightning visible)
- ~15% Alchemical distillation column (multi-tier brass-and-glass column with bubbling vessels at each level, copper-pipes coiling)
- ~10% Floating-orb levitation chamber (glass cylinder with brass valves, a glowing orb suspended mid-air inside, sigil-runes on the base)
- ~10% Specimen-vat with creature inside (large brass-rimmed cylindrical tank, glowing liquid, dark silhouette of preserved specimen)
- ~10% Sigil-circle ritual table (waist-high brass-rimmed table, glowing sigil-circle etched into top, central crystal or vessel)
- ~10% Astrolabe-orrery contraption (massive brass orrery with glowing-orb planets, gears, mounted on central pillar)
- ~5% Brain-in-a-jar apparatus (brass-rimmed glass cylinder, glowing liquid, organ-specimen, copper-electrodes)
- ~5% Cyclotronic ring (massive brass ring with glowing particle-trail inside, mounted on multi-leg base)
- ~5% Time-pendulum (massive pendulum on brass mount, glowing crystal at the bob, copper-coil-wrapped chain)

VARY THE GLOW COLOR widely across entries — green / electric-blue / amber / violet / crimson / aqua / golden / silver-white / poison-yellow / pink. Different experiments different colors. NEVER lock to one palette.

EVERY entry includes:
- THE APPARATUS TYPE specifically named (containment-sphere / Tesla-coil / distillation-column / etc.)
- MATERIAL DETAIL (brass-rimmed / glass / mahogany base / copper-coiled / iron-bound / silver-inlaid)
- THE GLOW (specifically colored — green / blue / amber / violet / etc. — INSIDE or AROUND the apparatus)
- ONE ACTIVE-PROCESS DETAIL (bubbling / sparking / vapor curling / liquid swirling / pendulum mid-swing / arc-flashing / orb suspended)
- POSITION in the room (centered on workbench / on tripod in middle of floor / mounted on central pillar / on raised dais)
- SIGIL/RUNE detail near the base or on the vessel (etched runes, glowing sigil-circle around it)

GOOD examples:
- Massive glass containment-sphere four feet tall mounted on a brass tripod, glowing emerald liquid swirling inside with phosphorescent vapor curling at the surface, copper-wrapped piping descending into the base, sigil-circle etched into the marble floor beneath it
- Tesla-coil apparatus rising from a brass-and-mahogany base, copper-coil cylinder wrapped tight up to a dome electrode at the top, electric-blue miniature lightning crackling between the dome and a smaller secondary coil, ozone-vapor hazing the air
- Floating-orb levitation chamber: tall brass-rimmed glass cylinder on iron tripod, a single softly-glowing violet orb suspended motionless mid-air inside, sigil-runes etched around the brass collar at the base, faint vapor rising from valve ports
- Multi-tier alchemical distillation column: stacked brass-and-glass vessels rising five feet from the workbench, amber liquid bubbling in the lower flask, condensation droplets running through copper-pipe coils, smaller golden liquid in the upper retort

ABSOLUTE BANS:
- NO modern / digital / electric / computer / LED
- NO sterile / clean (always intricate Victorian-industrial detail)
- NO chemical-burn / fire-hazard imagery / explosions
- NO weapon-functionality apparatus
- NO single fixed palette (vary the glow color widely across entries)
- NO primary human figure
- NO horror-coded specimens (no skulls / no eyes-in-jars / no dismemberment)

Output: ONE centerpiece per line. No numbering. No quotes.`,

  apparatus: `Generate STEAMPUNK SCIENCE LAB APPARATUS DETAIL descriptions. Each is ONE comma-separated line, 18-30 words, describing a SMALLER peripheral lab fixture / instrument / detail that decorates the room around the centerpiece experiment. Pick 3 per render via pickN.

These are the SUPPORTING details — smaller potion-vessels, brass instruments, mounted bookshelves of leather-bound tomes, gas-mantle lamps, hanging copper-pipe rigs, glass cabinets with curio-specimens, brass clocks, telescopes, microscopes, racks of small vials, alchemical reference-charts on the wall, mortar-and-pestle, paper-scattered desks, etc.

Variety mandate (rotate widely):
- ~15% Small glass potion vessels on shelving (glowing liquids in various colors — pink/green/blue/amber)
- ~15% Brass scientific instrument (telescope / microscope / chronometer / sextant / barometer / theodolite)
- ~10% Stack of leather-bound tomes with brass-clasped spines (some open, some piled)
- ~10% Gas-mantle standing lamp with shaded brass-and-glass globe
- ~10% Mahogany desk piled with parchment, ink-well, brass quill, scattered diagrams
- ~10% Glass cabinet with curio-specimens (preserved butterflies / mineral crystals / brass clockwork models)
- ~10% Copper-pipe rigging overhead (industrial plumbing supporting experiments, valves, pressure-gauges)
- ~10% Floor-mounted sigil-circle glowing softly (independent of the centerpiece — secondary alchemical pattern)
- ~5% Brass orrery / armillary sphere on a side-table
- ~5% Mounted brass-framed wall-chart (alchemical symbols / star-chart / anatomical-illustration / engineering blueprint)

VARY THE GLOW COLOR widely on glowing items across entries — green / blue / amber / violet / pink / aqua / golden. Vary instrument material/style. Don't lock to a single palette.

EVERY entry includes:
- THE OBJECT TYPE specifically named (potion-vessel / telescope / lamp / tome-stack / etc.)
- MATERIAL (brass / mahogany / glass / leather / copper / marble / iron)
- ONE DETAIL FLOURISH (glowing-pink / brass-clasped / scattered-pages / valves-open / runed-base / dust-of-ages)
- POSITION sense (on shelf / on workbench / mounted to wall / hanging from ceiling / on side-table / on floor)

GOOD examples:
- A row of small glass potion-vessels on the brass-railed shelf, glowing pink / green / amber / violet liquids in graduated flasks
- A brass telescope mounted on a tripod near the leaded-glass window, lens-cap dangling on a chain, mahogany base intricately carved
- A floor-mounted sigil-circle glowing faintly violet beside the central workbench, runes etched into mosaic-tile
- Overhead copper-pipe rigging with pressure-gauges and brass valves, steam vapor curling from one open valve
- A glass cabinet on the wall filled with brass-tagged mineral specimens, each on a velvet-lined card with handwritten ink label
- A mahogany desk piled with parchment diagrams, brass-and-ivory ink-well, scattered quills, an open leather-bound tome held flat by a brass paperweight

ABSOLUTE BANS:
- NO modern / digital / electric
- NO competing with the centerpiece for focal weight (these are PERIPHERAL details)
- NO horror imagery (no skulls / no bones / no gore)
- NO weaponry
- NO duplicate-style entries (every entry different)

Output: ONE apparatus detail per line. No numbering. No quotes.`,

  electrical: `Generate STEAMPUNK ELECTRICAL PHENOMENON descriptions for an 80%-gated atmospheric overlay on a steampunk lab scene. Each is ONE comma-separated line, 20-35 words, describing a Tesla-coil-coded electrical event — lightning arcs, sparks, electrical glow, energy-discharge — that adds dramatic energy to the lab.

These are the WOW electrical effects — what makes the lab feel ALIVE with experimental energy. Tesla's Wardenclyffe / Frankenstein's reanimation lightning / mad-scientist arc-discharge / Edison-vs-Tesla atmosphere.

Variety mandate (rotate widely across electrical types and colors):
- ~25% Massive Tesla-coil lightning arcing through the arched-glass ceiling (multiple branching arcs from the central coil-apparatus up into the structure)
- ~15% Arc-discharge between two experimental apparatuses (electric-blue / violet arc bridging two brass terminals)
- ~15% Plasma-globe-style ball of electrical glow around the centerpiece (sphere of crackling energy encasing or surrounding the central experiment)
- ~10% Tesla-spheres at the ceiling — multiple smaller dome-electrodes mounted in the ceiling, all arcing
- ~10% Single brilliant arc flash mid-discharge (frozen instant of bright lightning across the room)
- ~10% Static-electricity haze around the apparatus (faint blue luminous mist suggesting active charge)
- ~5% Lightning arc descending FROM the ceiling INTO the centerpiece (the experiment receiving power from above)
- ~5% Crackling rings of energy around the sigil-circle floor (energy emanating from below)
- ~5% Brass-rod lightning-conductor with electric-arc dancing along its length

VARY THE COLOR WIDELY across entries — electric-blue / violet / white-hot / aqua / golden / fel-green / crimson / silver-white. The color matches lab variety. Don't lock palette.

EVERY entry includes:
- THE EVENT TYPE (Tesla-coil arc / plasma-globe / arc-discharge / static-haze / lightning-strike / etc.)
- THE PATH OF THE ENERGY (through the ceiling / between two terminals / around the sphere / from above / etc.)
- A SPECIFIC COLOR
- A BRANCHING / CRACKLING quality (multi-branched arcs / dancing across length / luminous mist / frozen-instant flash / etc.)

GOOD examples:
- Massive electric-blue Tesla-coil lightning branches outward from the central coil-apparatus, multiple arcs reaching up through the arched-glass ceiling, illuminating the iron framework
- Violet plasma-globe of crackling energy surrounds the centerpiece containment-sphere, arcs reaching out in all directions to touch nearby brass apparatuses, ozone-vapor in the air
- Single golden arc-discharge bridges two brass terminals on opposite workbenches, frozen mid-flash, the room momentarily lit white
- Aqua-glowing static haze surrounds the workbench area, faint luminous mist visible suggesting active charge, no visible arcs but the air feels electric
- Brass lightning-conductor mounted on the wall has a continuous fel-green arc dancing along its length, casting flickering light onto the surrounding shelving

ABSOLUTE BANS:
- NO modern lightning bolts (no thin-line CGI lightning)
- NO weapon-energy (this is laboratory experimental, not magical-blast)
- NO destructive imagery (everything is contained science, not chaos)
- NO single locked palette
- NO single thin lightning-bolt (always BRANCHING / multi-arc / luminous / mist)

Output: ONE electrical phenomenon per line. No numbering. No quotes.`,

  scientist: `Generate STEAMPUNK SCIENTIST FIGURE descriptions for a 60%-gated scale-prover figure in a steampunk lab scene. Each is ONE comma-separated line, 18-30 words, describing a TINY lab-coated scientist standing in the lab as a scale-prover (gives sense of the room's scale).

The figure is SMALL — 5-10% of the frame at MOST. Position: midground, often beside the centerpiece experiment OR in front of a workbench. The figure is NEVER the focal subject — it's there to make the experiment feel impossibly large.

Variety mandate (rotate across figure styles):
- ~25% Lab-coated white-haired older scientist in profile (Einstein-coded, wild hair, lab coat, glasses, holding clipboard or watching the experiment)
- ~15% Younger scientist in waistcoat-and-shirtsleeves (rolled sleeves, brass-rimmed goggles, hands on hips watching)
- ~15% Goggled mid-experiment scientist (welder-style goggles, leather apron, holding tongs / clipboard / brass tool)
- ~10% Top-hat-and-tailcoat Victorian inventor (formal Victorian dress, mahogany walking-cane, watching from a distance)
- ~10% Female scientist in long Victorian skirt + lab coat over (long hair tied back, scribbling in notebook)
- ~10% Apprentice-coded younger figure on a step-ladder (reaching up to adjust an apparatus, lab coat)
- ~5% Hooded-figure mystic-scientist (long cloak instead of lab coat, holding crystal-tipped staff)
- ~5% Multiple-figures variation (two scientists conferring across the centerpiece, both small in the frame)
- ~5% Back-of-figure pose (silhouette of scientist facing into the experiment, viewer over their shoulder)

EVERY entry includes:
- WHAT THE FIGURE WEARS (lab-coat / waistcoat / leather-apron / top-hat-tailcoat / etc.)
- WHAT THE FIGURE IS DOING (watching / scribbling / adjusting / consulting / conferring / holding tool)
- POSITION cue (in profile / back-to-camera / mid-room / beside the centerpiece / on a step-ladder / at the doorway)
- SMALL-SCALE CUE (tiny against the centerpiece / dwarfed by the apparatus / barely visible from camera / silhouette-only at midground edge)

GOOD examples:
- A tiny white-haired older scientist in a long lab-coat stands in profile beside the centerpiece sphere, scribbling on a clipboard, dwarfed by the apparatus
- A younger scientist in waistcoat and rolled-sleeves stands hands-on-hips at midground, brass-rimmed goggles up on the forehead, watching the experiment with quiet awe
- Silhouette of a top-hat-and-tailcoat Victorian inventor at the room's edge, leaning on a mahogany cane, watching the centerpiece glow from a distance
- A goggle-wearing figure on a step-ladder reaches up to adjust a brass valve high on the apparatus, leather apron dangling, lab-coat sleeves rolled

ABSOLUTE BANS:
- NO primary figure (the figure is a SCALE-PROVER, never the subject)
- NO close-up face / no portrait composition
- NO frontal posing
- NO heroic stance
- NO modern dress / no contemporary clothing
- NO weapon
- NO sexy/seductive / no cleavage emphasis
- NO uncanny / ugly / weird humans (always attractive-or-distinguished if face visible)

Output: ONE scientist figure per line. No numbering. No quotes.`,
};

const RECIPE = RECIPES[POOL];
if (!RECIPE) {
  console.error('Unknown pool:', POOL);
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function signatureOf(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 4)
    .slice(0, 4)
    .join('|');
}

async function generateBatch(n) {
  const resp = await anthropic.messages.create({
    model: SONNET,
    max_tokens: 4000,
    messages: [{ role: 'user', content: `${RECIPE}\n\nGenerate ${n} entries now.` }],
  });
  return resp.content[0].text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 15 && !/^[\d#\-\*]/.test(l.slice(0, 2)));
}

(async () => {
  if (TARGET) {
    let existing = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : [];
    const sigs = new Set(existing.map(signatureOf));
    console.log(`[${POOL}] appending: existing ${existing.length} — target ${TARGET}`);
    while (existing.length < TARGET) {
      const need = Math.min(BATCH, TARGET - existing.length);
      const batch = await generateBatch(Math.ceil(need * 1.3));
      const fresh = batch.filter((b) => !sigs.has(signatureOf(b)));
      for (const f of fresh) {
        if (existing.length >= TARGET) break;
        existing.push(f);
        sigs.add(signatureOf(f));
      }
      fs.writeFileSync(OUT, JSON.stringify(existing, null, 2));
      console.log(`  ${existing.length}/${TARGET}`);
    }
    return;
  }
  const batch = await generateBatch(COUNT);
  const sigs = new Set();
  const deduped = batch.filter((b) => {
    const sig = signatureOf(b);
    if (sigs.has(sig)) return false;
    sigs.add(sig);
    return true;
  });
  fs.writeFileSync(OUT, JSON.stringify(deduped, null, 2));
  console.log(`[${POOL}] wrote ${deduped.length} entries`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
