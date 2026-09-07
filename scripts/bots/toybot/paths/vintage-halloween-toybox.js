/**
 * AlphaBot candidate path — vintage-halloween-toybox (destination: ToyBot).
 *
 * A lit tabletop CINEMATIC MACRO DIORAMA of a real vintage 1950s-60s Halloween
 * toy collection. NON-NEGOTIABLE template mandate: exactly ONE physical toy
 * MATERIAL TRADITION leads every render — litho-printed pressed TIN
 * noisemakers/wind-ups, die-cut printed CARDBOARD decorations, or hand-painted
 * PAPIER-MÂCHÉ candy containers — never mixed as competing heroes in one
 * frame. Still-life register (no cast, no living characters): the toys
 * themselves, photographed like a collector's prized find, are the whole
 * story.
 *
 * Axes (7, all bespoke to this path — no shared pools):
 *   1. MATERIAL TRADITION   — fixed 3-way roll (tin / cardboard / papier-mâché).
 *                             The lead axis; supplies the material-lock text.
 *   2. TABLETOP DISPLAY      — generated pool (25): the lit surface/setting.
 *   3. HERO PIECE            — MONEY SHOT. Generated pool per material (25
 *                             each): the specific vintage toy in loving
 *                             material-accurate detail.
 *   4. SUPPORTING PIECE      — optional (~45%) second pick from the SAME
 *                             material's hero pool — reinforces one-tradition
 *                             cohesion instead of introducing a rival material.
 *   5. PERIOD EPHEMERA       — near-always (~85%, raised from 45% in R2 —
 *                             the TABLETOP DISPLAY pool is mostly generic
 *                             vintage-interior staging with no baked-in
 *                             Halloween iconography of its own, so this is
 *                             the axis that reliably anchors the holiday
 *                             read when the display roll doesn't) generated
 *                             pool (25): a small accent prop that never
 *                             upstages the hero.
 *   6. LIGHT SOURCE          — fixed inline list (short, no pool needed).
 *   7. CAMERA / MACRO FRAME  — fixed inline list; every option keeps the whole
 *                             hero piece + its stage readable (never a
 *                             texture-only crop that dissolves the scene).
 *
 * Medium/model/prefix wiring into alphabot/index.js CANDIDATES (cloned
 * byte-identical from ToyBot's tin_toy_diorama-style Stage O config) is a
 * later, separate promotion step — this file is fully self-contained and
 * inlines its own material-look text, so it renders correctly regardless of
 * host-bot mediumStyles.
 */

const TIN_PIECES = require('../seeds/vintage-halloween-toybox_tin_hero.json');
const CARDBOARD_PIECES = require('../seeds/vintage-halloween-toybox_cardboard_hero.json');
const PAPERMACHE_PIECES = require('../seeds/vintage-halloween-toybox_papermache_hero.json');
const DISPLAYS = require('../seeds/vintage-halloween-toybox_display.json');
const EPHEMERA = require('../seeds/vintage-halloween-toybox_ephemera.json');

// Axis 1 — MATERIAL TRADITION. Each entry carries its own dedup axis key (so
// the two/three hero pools cycle independently) + the material-lock prose
// that anchors Flux on that ONE tradition for the whole frame.
const MATERIALS = {
  tin: {
    pool: TIN_PIECES,
    axis: 'vht_tin_hero',
    lock: 'vintage 1950s-60s LITHOGRAPHED PRESSED-TIN Halloween toy — colorful printed-on detail (grinning jack-o-lantern faces, black cats, witches printed directly onto the metal), pressed-tin panels with tab-and-slot seams, a wind-up clockwork key or ratchet handle, slight edge patina and tiny handling scratches, warm enamel-paint sheen catching every highlight. NOT plastic, NOT cardboard, NOT painted wood — real vintage litho tin, through and through.',
  },
  cardboard: {
    pool: CARDBOARD_PIECES,
    axis: 'vht_cardboard_hero',
    lock: 'vintage 1950s-60s DIE-CUT PRINTED CARDBOARD Halloween decoration — crisp die-cut silhouette edges, lithographed ink softened with age, matte uncoated paper grain visible under the print (never a flat glossy vector-clean surface), corners gently rounded and dog-eared from decades of handling, an occasional faint foxing spot or water-ring bloom freckling the pale ply, visible pale cardboard-ply at every cut edge, honeycomb-tissue accordion pleats or brass paper-fastener joints where the piece calls for them. NOT tin, NOT papier-mâché, NOT glossy modern print stock — real vintage die-cut card, through and through.',
  },
  papermache: {
    pool: PAPERMACHE_PIECES,
    axis: 'vht_papermache_hero',
    lock: 'vintage 1950s-60s PAPIER-MÂCHÉ Halloween candy container — hand-molded pulp-paper form with a visible seam ridge circling its middle, matte hand-painted finish worn pale at the high points, a hinged cardboard-disc lid or bottom for candy, a thin wire or cord bail handle. NOT tin, NOT cardboard cutout, NOT ceramic — real vintage papier-mâché, through and through.',
  },
};

// Axis 6 — LIGHT SOURCE. Short fixed list; no generated pool needed.
const LIGHT_SOURCES = [
  'a stub candle flickering warm and low from somewhere just inside the display',
  'a strand of warm amber string-lights glowing softly along the edge of frame',
  'a single brass lamp with a paper shade casting a warm pool of light',
  'late-afternoon autumn sun slanting low through a nearby windowpane',
  'moonlight slanting cool and pale through a lace-curtained window behind the scene',
  'the warm orange glow of a nearby hearth just out of frame',
  "a kerosene lantern's soft steady flame lighting the tableau from one side",
  'a strand of small paper Halloween lanterns strung overhead, each glowing faintly',
];

// Axis 7 — CAMERA / MACRO FRAME. Short fixed list; every option is explicitly
// whole-scene-readable per the "never dissolve the hero into a texture crop"
// rule (BOT_SCENE_QUALITY_PLAYBOOK.md failure-mode catalog).
const CAMERA_FRAMINGS = [
  'eye-level macro close-up holding the whole hero piece and its immediate tabletop stage in frame',
  'a slightly elevated three-quarter tabletop view taking in the full display',
  "a low toy's-eye-view looking gently up at the hero piece with the display receding softly behind",
  'a centered macro portrait of the hero piece with the rest of the display softly blurred behind',
  'a gentle diagonal composition for quiet dynamic energy, the whole piece still clearly readable',
  'a shallow-depth macro favoring the hero piece with the tabletop dissolving into warm bokeh behind it',
  'a straight-down flat-lay macro of the tabletop arrangement',
];

module.exports = ({ vibeDirective, picker }) => {
  const materialKey = picker.pickWithRecency(Object.keys(MATERIALS), 'vht_material');
  const material = MATERIALS[materialKey];

  const display = picker.pickWithRecency(DISPLAYS, 'vht_display');

  const heroPieces = [picker.pickWithRecency(material.pool, material.axis)];
  if (Math.random() < 0.45) {
    const second = picker.pickWithRecency(material.pool, material.axis);
    if (second !== heroPieces[0]) heroPieces.push(second);
  }

  const ephemera = Math.random() < 0.85 ? picker.pickWithRecency(EPHEMERA, 'vht_ephemera') : null;

  const light = picker.pickWithRecency(LIGHT_SOURCES, 'vht_light');
  const camera = picker.pickWithRecency(CAMERA_FRAMINGS, 'vht_camera');

  const supportBlock =
    heroPieces.length > 1
      ? `\nA second piece from the SAME material tradition keeps it company: ${heroPieces[1]}`
      : '';
  const ephemeraBlock = ephemera
    ? `\n\n━━━ A SMALL PERIOD-ACCENT DETAIL ━━━\n${ephemera}`
    : '';

  return `You are a macro still-life photographer shooting a lit tabletop diorama of a real vintage Halloween toy collection. Photoreal cinematic macro, shallow depth of field, warm nostalgic collector-photography register.

━━━ NON-NEGOTIABLE — ONE MATERIAL TRADITION LEADS, NEVER MIXED ━━━
Every physical toy in this frame belongs to ONE clear vintage material tradition: ${material.lock}
Never let a rival material (whichever of tin / cardboard / papier-mâché this render is NOT using) appear as a second competing hero in the same frame.

━━━ THE TABLETOP DISPLAY ━━━
${display}

━━━ THE HERO PIECE — the money shot ━━━
${heroPieces[0]}${supportBlock}
${ephemeraBlock}

━━━ THE MATERIAL LOOK (reinforce this on every surface) ━━━
${material.lock}

━━━ LIGHT ━━━
${light}

━━━ CAMERA ━━━
${camera}. Keep the whole hero piece and its immediate tabletop stage clearly readable — never crop into a texture-only detail that loses the object.

━━━ MOOD ━━━
Cozy-spooky and warmly nostalgic — a grinning jack-o-lantern, a friendly black cat, a cheerful skeleton, never true horror, gore, or a genuine scare. ${vibeDirective.slice(0, 150)}

━━━ STAY ANCHORED — DO NOT INVENT A NEW SCENE ━━━
Compress ONLY the hero piece(s), display, ephemera detail, light, and material look given above into one flowing prompt, in their own words. Do NOT invent additional named objects, buildings, or set-pieces that were not given to you above (no dollhouses, no graveyard dioramas, no extra structures) — the hero piece above IS the whole story, every time. If it doesn't all fit in the word budget, trim display texture or ephemera first; the material-lock phrase and the hero piece itself must always survive into the final prompt.

Output ONLY the 90-120 word Flux prompt, comma-separated phrases. NO preamble, NO headers, NO ━━━ markers, NO "render as" suffixes. Start immediately with the scene description. End with: no text, no words, no letters, no watermarks, masterwork composition, hyper detailed.`;
};
