/**
 * VenusBot — shared prose blocks injected into path briefs.
 * These are verbatim text the Sonnet meta-prompt includes to anchor
 * character identity, aesthetics, and coverage rules across all paths.
 *
 * Edit cadence: these change only when design intent shifts. Axis pools
 * (which change more often as we add diversity) live in pools.js.
 */

// ── Flux prompt wrapping — applied verbatim to every render ──
const PROMPT_PREFIX =
  'surreal photography, hyper-saturated colors, double exposure, impossible lighting, warped perspective, photorealistic but dreamlike, chromatic aberration, bioluminescent glow, gravity-defying elements, Salvador Dali meets fashion photography';

const PROMPT_SUFFIX = 'no text, no words, no letters, no watermarks, hyper detailed';

const REQUIRED_ELEMENTS_BLOCK = `━━━ MACHINE-FIRST — NON-NEGOTIABLE ━━━

She MUST read unmistakably as a CYBORG at first glance, not a human woman with accents. If a viewer could scroll past this image and think "pretty woman with a glow patch," the render has failed.

MINIMUM THRESHOLD: at least HALF (50%+) of her visible body surface must be clearly, obviously mechanical — no negotiation, no compromise, no "subtle accents." The human parts are a MINORITY of what's visible.

REQUIRED MECHANICAL BODY PARTS (these MUST be visible in the render — weave them in):
- **Mechanical arms** — at least one forearm and hand must be clearly robotic: exposed segmented chrome / titanium / brass / carbon-fiber structure, articulated servo fingers with visible piston joints, NO organic flesh on the limb.
- **Shoulder joints** — exposed ball-socket or hydraulic-hinge mechanisms where a human shoulder would be, hardware visibly rotating.
- **Segmented neck / throat** — chrome or composite ring-segments with visible actuators between them where a human throat would be, not smooth skin.
- **TRANSLUCENT TORSO** — a substantial portion of her torso (chest, sternum, belly) is translucent / frosted / clear-polymer skin — you can see into her. The internal mechanical structure is visible through it, and a glowing power core sits somewhere inside. Think Ex-Machina or Alita Battle Angel — the "see inside her" reveal is part of what makes her beautiful, handled with subtlety rather than screamed. Don't over-describe the internal parts; just establish that her body is translucent and glows from within.
- **Additional machine tells welcome** — chrome jawline plating, exposed spine segments visible through back/nape, mechanical ear-housings with visible gears, transparent skull section, robotic legs with hinge joints.

Only her FACE stays organic (exotic human or alien skin, full lips, luminous eyes). Everything else should read as a constructed being.

━━━ REQUIRED LIGHT ELEMENTS (in every render) ━━━

- Her EYES burn brightly in the GLOW COLOR — plasma-lit irises visible across the scene.
- A visible INTERNAL POWER CORE lives INSIDE HER BODY and is seen THROUGH a transparent-acrylic / smoked-glass / clear-polymer section of her torso or skull. It is a physical mechanical/reactor structure (not a light effect on her surface, NOT a firework, NOT a decorative glowing emblem, NOT a heart-shape). The viewer looks INTO her and sees her mechanical guts with the reactor pulsing among gears and fiber-optic cables.
- CIRCUIT LIGHT glows from UNDER the skin — bioluminescent tree-veins visible through translucent body sections, subtle and integrated, not sparks on top.
- Uncanny "is she alive or not" stillness — machine-still composure, gaze that doesn't quite blink right.

**SURFACE EFFECTS BANNED:** No fireworks, no spark explosions bursting off her chest, no glowing hearts/logos/emblems pasted on her body, no decorative rays shooting out. Everything glowing lives INSIDE her body and is visible THROUGH translucent panels — never sits on top of her surface as an effect.

━━━ MATERIAL PALETTE (OPEN — not chrome-locked) ━━━

Her body surface materials can be ANY combination: brushed titanium, polished brass, copper, rose-gold, matte carbon fiber, glossy black latex, oxblood/royal-blue/emerald latex, iridescent holographic polymer, pearlescent ceramic, obsidian glass, smart-glass panels, color-shifting chameleon pigment, frosted acrylic, translucent silicone, bioluminescent hydrogel, liquid mercury segments, nanotube weave, jade, graphite, plus chrome (one option of many). MIX 2-3 materials across different body zones per render. Do NOT default every render to chrome-everything.

━━━ CHEST COVERAGE (rated-R, Vogue-editorial level) ━━━

Her chest is sexy in SILHOUETTE and LINE — elegant curves, sweeping contours, sculptural breast-forms rendered as a clean mechanical or fabric surface. Coverage is ALWAYS present. Options:

- Sculptural mechanical breastplate with a smooth, UNINTERRUPTED surface (like a polished sculpture — no surface features, no ports, no accents, no dots, no studs, no gems positioned on the bust)
- Translucent polymer panel across the chest revealing internal mechanisms (gears, circuits, pulsing core) — the reveal is WHAT'S INSIDE the panel, never flesh
- Silk / latex / sheer mesh / lace / high-fashion fabric draped across her chest — fabric follows the curve but the surface under it stays smooth and featureless
- Ornate circuit-traced chrome bust with patterning (filigree, etched lines, cabled circuits) — patterning flows across the whole surface continuously, never concentrating into a central feature on each breast

DO NOT add any small surface feature at the center of the bust — no accents, no ports, no studs, no gems, no LEDs, no glowing dots, no circuit-node, no small decorative emblem — anywhere on the breast surface. The bust surface stays sculpturally clean.

Rated R, high-fashion editorial — think Vogue cover, NOT lingerie catalog. Suggestive via shape, not explicit via detail. No nipples.`;

const SURREAL_EFFECTS_BLOCK = `━━━ SURREAL EFFECT LAYER (weave 2-3 naturally, don't overdo) ━━━

chromatic aberration splitting light at edges, bioluminescent veins pulsing through skin, prismatic refraction halos, atmospheric haze, fisheye distortion at frame edges, cosmic nebula backdrop, double-exposure galaxies bleeding through her silhouette, kaleidoscopic reflections. Effects feel INTEGRATED, not filtered-on.`;

const SKIN_MATERIAL_NUANCE_BLOCK = `━━━ SKIN MATERIAL NUANCE ━━━

Her skin mixes THREE material zones visible in the frame: (1) real human skin with pores and imperfections in the tinted color below, (2) polished synthetic polymer skin catching light like lacquered ceramic with subtle seam lines, (3) exposed internals / transparent panels revealing mechanisms. Let the viewer see the transitions between all three.`;

const SOLO_COMPOSITION_BLOCK = `━━━ SOLO COMPOSITION — NON-NEGOTIABLE ━━━

She is the ONLY figure in the frame. NEVER render another person, body, target, man, accomplice, chauffeur, guard, partner, victim, or crowd with her. No second figure, no one lying on the ground, no one behind her, no one she is pinning or kneeling-beside or dancing-with or sitting-across-from. The frame contains HER and HER ALONE.

Targets/accomplices/marks may be NARRATIVELY referenced (she is watching through a window for an offscreen target, she is holding photographs of a mark, she is plotting an approach) — but never rendered in the frame. Solo compositions only. Two-figure shots read as cheesy AI stock-art. She is iconic precisely because the viewer's attention has nowhere else to go.`;

const HOT_AS_HELL_BLOCK = `━━━ SHE IS HOT — BUT NEVER POSING ━━━

She is MAGNETICALLY sexy in every render — but she is NEVER posing, modeling, strutting, or performing for a camera. She's just existing in her world: plotting, moving, thinking, scheming. The viewer happens to catch her in a moment. Her sexiness comes from her BODY and MATERIALS and the way light falls on her — not from a practiced modeling stance.

Lean into her silhouette — elegant feminine curves, exposed mechanical décolletage, hip line, chrome thigh revealed through a slit, silk-and-machine clothing, latex-and-circuit pieces, sheer mesh draped over cyborg panels. Rated R, not X.

NEVER USE THESE WORDS OR CONCEPTS: "pose", "posing", "modeling", "editorial shoot", "fashion shoot", "Vogue spread", "editorial portrait", "runway stance", "catwalk", "fashion photography setup", "studio shot", "photographed by", "shoot for", "strikes a pose". She is NOT posing. She is LIVING in the scene.

Instead: use "standing", "leaning", "seated", "crouched", "walking", "mid-motion", "caught mid-X" — action verbs that describe WHAT SHE IS DOING, not what she looks like performing.

━━━ BANNED COMPOSITIONS ━━━

- NO runway walk toward the camera. NO staged editorial-portrait compositions. NO "she poses confidently for the shot". NO "statuesque fashion pose".
- NO boring standing-still-facing-camera shots. The frame is a CANDID capture of her doing something, not a posed portrait.
- PICK observational angles — overhead, low-angle, profile, tilted, Dutch angle, through-a-window / through-a-reflection / over-her-shoulder / from behind her / from across a room. The camera is a voyeur's angle, not a model's studio.`;

const ROBOT_FIRST_BLOCK = `━━━ ROBOT-FIRST — 90% MACHINE, 10% HUMAN ━━━

This is the ROBOT path. She is almost entirely a machine — think female Terminator, T-800 / T-1000 hunter energy, relentless, in a sexy-as-fuck feminine silhouette. At least 90% of her visible body reads as PURE ROBOT. Only a small HUMAN SLIVER remains (see HUMAN TOUCH axis below).

MATERIALS — OPEN: she can be built from ANY composite of materials and colors. Metals of any kind (chrome, brushed titanium, gunmetal, brass, copper, rose-gold, steel, iron, ceramic), plastics, polymers, rubber, latex, carbon fiber, ceramics, painted composites, matte finishes, glossy finishes, candy-coated colors, military matte, pearlescent whites, obsidian blacks, jewel-toned enamels, transparent panels, liquid-metal segments, hybrid fabric-over-frame — any mix. She is a BUILT thing; she can be built from anything. Don't default to chrome-everything. Let the look breathe.

The viewer should look at her and think "that is a ROBOT" — not "that is a cyborg woman." The human sliver is a haunting detail, not a reassurance.

FEMININE-BUT-ROBOT SILHOUETTE: she is unmistakably a female-form robot. Curves are present — bust, waist, hips, thighs — but rendered in her built materials. The female shape is part of the weapon. Sexiness comes from SILHOUETTE + lethal threat, not from exposed skin. Articulated limbs, visible joints, whatever internal anatomy she has, all optional flavors — choose what fits the shot.

━━━ REQUIRED LIGHT ELEMENTS (robot path) ━━━

- A glowing sensor / targeting-eye / lens slit in the GLOW COLOR — visible wherever her visual apparatus is
- An internal power core or energy source visible THROUGH a translucent section somewhere (chest, skull, shoulder) — same rule as shared: inside, not surface fireworks
- Machine-still composure — too mechanical to be alive

━━━ THE HUMAN SLIVER (the 10%) ━━━

Exactly ONE small human feature remains — see the HUMAN TOUCH axis below. This is the ONLY organic detail on her. Everywhere else: full machine.

━━━ COVERAGE ━━━

Her chest is sculptural robot material — smooth mechanical breastplate, translucent panel, built-surface, or fabric-over-frame. Suggestive via SHAPE only. No nipples.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  REQUIRED_ELEMENTS_BLOCK,
  SURREAL_EFFECTS_BLOCK,
  SKIN_MATERIAL_NUANCE_BLOCK,
  HOT_AS_HELL_BLOCK,
  ROBOT_FIRST_BLOCK,
  SOLO_COMPOSITION_BLOCK,
};
