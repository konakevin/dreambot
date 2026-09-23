/**
 * DinoBot amber-forest — the Mesozoic RESIN FOREST (2026-09-23, SHADOW).
 *
 * ═══ THE GAP ═══
 * DinoBot's landscape register is VISTAS: canyon, coast, plain, volcanic, snowline, desert, swamp,
 * ocean. Every one of them is a place seen from a distance. The bot has no path whose hero is a
 * MATERIAL and its OPTICS, and no translucent/backlit register at all. A Mesozoic resin forest is a
 * real, science-true, famous place that almost nobody has ever been shown as a PLACE — only ever as
 * a polished bead in a jeweller's window or a specimen in a museum case. That is the delight angle:
 * stand inside it while it is still alive and still dripping.
 *
 * ═══ THE DULL FAILURE THIS PATH DRIFTS TOWARD ═══
 * "A brown forest with orange goo on some trunks." Two specific traps, guarded in every pool recipe
 * (see `scripts/gen-dinobot-pool.js`, the `dinobot_amber_*` block) AND in the template below:
 *
 *   1. AMBER IS ALREADY DINOBOT'S SATURATION WORD. Measured: 167 of 200 entries (84%) of
 *      DINOBOT_PALEO_LANDSCAPE_BIOME contain "amber" — which is exactly why a separate COLD
 *      snowline-forest path was worth building. So a path whose SUBJECT is amber has to earn it
 *      through OBJECTS AND OPTICS, never through the adjective. "amber light", "golden haze" and
 *      "warm golden glow" as standalone atmosphere are banned as crutches in every recipe here.
 *      The resin is written as a PHYSICAL SUBSTANCE with volume, surface state and contents.
 *   2. RESIN'S DELIGHT IS THAT IT IS A LENS AND A TRAP. Not sap on bark — what the resin does to
 *      light passing THROUGH it, and what is stuck inside it forever, mid-event.
 *
 * ═══ WHY FUNCTION-FORM AND SELF-CONTAINED ═══
 * DinoBot is a declarative bot (path = `{archetype, pools}` resolved through brief-composer), so
 * the normal shape would need new entries in `archetypes.js` + `archetype-templates.js` + `pools.js`
 * — three shared single-writer files. This file is instead FUNCTION-FORM and self-contained: it
 * loads its own six seed JSONs and inlines its whole brief, exactly like FaeBot's
 * `mushroom-apothecary` and the ToyBot Stage-O paths. `DinoBot.buildBrief` already dispatches
 * `typeof builder === 'function'`, so registering it is ONE line in `index.js` `pathBuilders` plus
 * the usual shadow/skip entries (exact lines in the footer of this file). Zero risk of colliding
 * with another agent in a shared tree.
 *
 * ═══ 7 AXES (5 always-on, resident at 0.65, phenomenon at 0.4) ═══
 *   resin_event  ★ THE MONEY SHOT, and it LEADS. One specific mass of resin: its volume, its
 *                  surface state, WHERE IN THE FRAME it sits, and its CROP. This axis is the path.
 *   trapped        what is caught inside it and how deep. The CLEVER axis — a tiny piece of comedy
 *                  or wonder frozen mid-event, which is what makes the picture a story.
 *   amber_grove    the forest as a LANDFORM and a stage. Every entry LEADS WITH ITS MASSING and
 *                  ends with the VANTAGE (where the camera stands).
 *   optics         what the resin does to light and to the image seen through it. Axis-clean:
 *                  optics and colour only. REPLACES the bot's lighting slot (see below).
 *   grove_air      what the air in a sheltered sticky grove is doing. Axis-clean: air only.
 *                  REPLACES the bot's atmosphere slot (see below).
 *   resident       0.65 gate — the dinosaur, mid-action and characterful. ~1 in 3 renders is pure
 *                  place, and on those the resin/optics presence is boosted instead.
 *   phenomenon     0.4 gate — REUSED from paleo-landscape, FILTERED to the canopy-compatible
 *                  entries only (see PHENOMENON below). A closed resin grove is sheltered; forcing
 *                  weather fights the premise, the same reasoning as den-and-burrow (0.5) and
 *                  undergrowth-scale (0.4).
 *
 * ═══ THE LOAD-BEARING CONSTRAINT (the template's FIRST rule) ═══
 * The resin must be a VOLUME with things inside it and light coming through it, present in the
 * FOREGROUND of every frame. A frame where resin is only a colour, or only a coating on bark, has
 * no path identity.
 *
 * ═══ THE DELIBERATE DEVIATION: optics/air are BESPOKE, not the bot's shared lighting/atmosphere ═══
 * Measured, not assumed. DinoBot's `LIGHTING` (200) and `PREHISTORIC_ATMOSPHERES` (200) are not
 * axis-clean — they carry SCENE CONTENT and NAMED DINOSAURS: "Mirror-flat lake reflecting dinosaur
 * silhouette", "Underwater shaft-light through kelp forest canopy … Mosasaur silhouette",
 * "Sandbar emerging from receding tide", "Velociraptor mid-leap", "Baryonyx hunting". On a path
 * whose setting is a closed forest with no open water and whose resident is GATED (so 1 in 3
 * renders is deliberately animal-free), those are two documented hijacks at once: an axis that
 * assumes an incompatible setting, and an axis that injects a creature the hero pool never vetted.
 * DinoBot's own precedent settles it — all three of its condition-identity paths (dino-nights,
 * storm-season, polar-dinos) REPLACE the shared lighting slot with a bespoke light axis. This
 * path's identity IS an optical condition, so `optics` is that axis and it owns the whole palette.
 *
 * ═══ PRE-EMPTED TRAPS (each already cost a real render on another path) ═══
 *   • ⚠️ "STAINED GLASS" IS NEVER WRITTEN, HERE OR IN ANY POOL. A hanging resin sheet is the
 *     obvious thing to call a window of dirty stained glass — and a glazing/heraldry noun is a
 *     documented EMBLEM prior on this fleet: PixelBot ice-cavern's carved-relief charm rendered a
 *     centred heraldic emblem AND BUILT ITSELF A MASONRY WALL to carve it into; SteamBot's "blank
 *     enamel dial" shipped roman numerals. The sheet is described by WHAT IT HOLDS — the smeared
 *     doubled forest behind it, and the thing trapped inside it — never by a glazing tradition.
 *   • THE CONTAINER IS CONCRETE, POSITIONED AND CROPPED (ToyBot snow-globe, 9/9 on the fixed spec).
 *     A resin sheet or flow IS a look-through-a-container element, and that knob has three
 *     positions of which both ends fail: named as a free-standing OBJECT it renders as a small prop
 *     in the middle distance, reduced to an ABSTRACTION it renders as nothing at all. So every
 *     `resin_event` entry names it plainly, says where in the frame it sits, and gives it a CROP
 *     ("running off the top and bottom edges") as the counter-anchor.
 *   • FIRST-NAMED-NOUN OVER THE WHOLE ASSEMBLED PROMPT, so the WEAKER half of the premise leads
 *     (SteamBot brass-glasshouse, 4/6 → 6/6 in one round). The bot's own wrapper already votes for
 *     the animal: `PROMPT_PREFIX` opens "cinematic primordial Mesozoic wilderness" and the `render`
 *     medium opens "photoreal living animal with leathery scarred biological hide". Resin is the
 *     half with no votes, so the output order puts the resin mass FIRST and the animal LAST.
 *   • NO HUMANS, BY POSITIVE CROWD-OUT, NEVER BY A BAN (DinoBot stripped its negation cascades in
 *     June 2026 precisely because "NO HUMANS" was pulling humans in). And because the bot-wide
 *     `promptSuffixByMedium.render` asserts "the dinosaur is a REAL LIVING ANIMAL" on EVERY render,
 *     the no-resident branch positively populates the frame's animal life with the insects sealed
 *     in the resin and the midges over the fresh flow, so that assertion has something on-premise
 *     to land on instead of back-filling a figure.
 *   • SILHOUETTE COLLAPSE — every `amber_grove` entry names its own massing and no two share one.
 *   • BODY-PART SCALE UNITS. 26 entries came back measuring resin in "a hand's depth" / "a finger's
 *     depth" / "fist-sized" / "two arm-spans" / "knee height" and one animal was "the length of a
 *     small car". On a no-humans bot a body-part scale unit is a figure noun in the prompt, and a
 *     car is a modern-prior noun 66 million years early. All rewritten to in-world units (a cone's
 *     length, a horsetail stem, a fallen trunk), and the recipes were hardened so a regen stays
 *     clean — the playbook's "sweep your RECIPE text, not just the output" rule.
 *   • NO AUTHORITY WORDS. The brief says "THE FIRST RULE", never "NON-NEGOTIABLE / AUTHORITY /
 *     OVERRIDES" — that phrase family triggered Sonnet's own injection defences on ~28% of FarmBot
 *     calls, and the refusal text then goes to Flux as the prompt.
 *
 * Config: DinoBot's locked `render` medium + locked `cinematic` vibe + the bot-wide model picker.
 * chaos SKIPPED and twoPassPolish SKIPPED (Haiku compression strips exactly the optics and
 * inclusion language the path is made of). No `promptPrefixByPath` — the wrapper-strip lesson says
 * default to empty. `sharedDNA.scenePalette` and `sharedDNA.colorPalette` are deliberately NOT
 * consumed: `optics` owns the palette, and DinoBot's 200-entry scene-palette pool is warm-earth
 * coded ("Amber jungle glow", 33/200 name amber/golden/honey) so it would flatten this path's
 * warm-against-cool contrast into the single orange wash the path exists to avoid. Same choice the
 * two sibling 2026-09-22 paths (undergrowth-scale, den-and-burrow) made.
 */

const fs = require('fs');
const nodePath = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(nodePath.join(__dirname, '..', 'seeds', `${name}.json`), 'utf8')
  );
}

const RESIN_EVENT = load('dinobot_amber_resin_event');
const TRAPPED = load('dinobot_amber_trapped');
const GROVE = load('dinobot_amber_grove');
const OPTICS = load('dinobot_amber_optics');
const AIR = load('dinobot_amber_air');
const RESIDENT = load('dinobot_amber_resident');

// REUSED from paleo-landscape, then FILTERED — structurally, not by a prose clause. A prose
// compatibility clause loses to a pool pick every time (ToyBot snow-globe: a harbour rowboat
// launched in a desert despite an explicit "adapt or drop it" block), so the incompatible entries
// are removed from the candidate set instead. Of the 100 entries only these are compatible with a
// closed canopy and no open horizon: the pool's other 87 need an open sky, a distant horizon, a
// coast, a floodplain or a river, none of which this grove has.
const PHENOMENON = load('dinobot_paleo_landscape_phenomenon').filter(
  (e) =>
    /(canopy|forest floor|god-ray|spore|pollen|midge|insect|odonate|ground-fog|mist-bank|mist-tendril|fern-crown)/i.test(
      e
    ) &&
    !/(horizon|comet|fireball|bolide|aurora|sunset|sunrise|thunderhead|supercell|squall|shelf-cloud|pyroclastic|storm-front|dust-event|coastal|wetland|riverbed|river|lake|valley depression|zenith)/i.test(
      e
    )
);

const RESIDENT_GATE = 0.65;
const PHENOMENON_GATE = 0.4;

module.exports = ({ vibeDirective, picker }) => {
  const resinEvent = picker.pickWithRecency(RESIN_EVENT, 'amber_resin_event');
  const trapped = picker.pickWithRecency(TRAPPED, 'amber_trapped');
  const grove = picker.pickWithRecency(GROVE, 'amber_grove');
  const optics = picker.pickWithRecency(OPTICS, 'amber_optics');
  const air = picker.pickWithRecency(AIR, 'amber_air');
  const resident =
    Math.random() < RESIDENT_GATE ? picker.pickWithRecency(RESIDENT, 'amber_resident') : null;
  const phenomenon =
    PHENOMENON.length && Math.random() < PHENOMENON_GATE
      ? picker.pickWithRecency(PHENOMENON, 'amber_phenomenon')
      : null;

  // 0.65 gate — about one render in three is pure place. On those the resin and its optics take the
  // whole frame, and the animal life is POSITIVELY named as the insects in the resin, so the
  // bot-wide "the dinosaur is a REAL LIVING ANIMAL" suffix has something on-premise to land on
  // rather than back-filling a figure of its own.
  const residentSection = resident
    ? `
━━━ 6. THE RESIDENT (it lives here — put it LAST in the picture, behind the resin) ━━━
${resident}
Lead with its body plan before any name — "a feathered raptor like Velociraptor", "a duck-billed hadrosaur with a broad flat toothless beak", "a horned ceratopsian with a bony neck-frill", "a long-necked sauropod", "a large theropod like a T-rex", "a low-slung armoured ankylosaur" — because Flux reliably knows only a handful of dinosaurs and needs the silhouette named first. It is a real living animal with leathery asymmetric hide or real patterned plumage, caught mid-motion, and the resin is a curiosity and an inconvenience to it, never a danger.
`
    : `
━━━ 6. THE GROVE TO ITSELF (the resin takes the whole frame) ━━━
No large animal is in this frame, so the resin and what it does to the light fill it completely — the flow bigger and nearer, the inclusion larger and clearer, the caustics spread wider across the bark and the litter. The living things here are the insects sealed inside the resin and a loose drift of midges out over the fresh surface.
`;

  const phenomenonSection = phenomenon
    ? `
━━━ 7. WHAT REACHES THE GROVE FROM ABOVE (keep it behind and above the resin) ━━━
${phenomenon}
This arrives as light and air in the upper and deeper part of the frame. The resin mass in the foreground still carries the picture.
`
    : '';

  return `You are a wildlife-documentary cinematographer writing MESOZOIC RESIN-FOREST scenes for DinoBot — a prehistoric Earth deep in the age of dinosaurs. Photoreal cinematic 35mm film still, shot inside a stand of enormous conifers that are bleeding.

⚠️⚠️⚠️ THE FIRST RULE — THE RESIN IS A VOLUME IN THE FOREGROUND ⚠️⚠️⚠️
A thick mass of conifer resin stands in the near foreground of this picture, big and close, with real thickness and weight — things sealed INSIDE it and daylight coming THROUGH it. It is named plainly, it is placed in a stated part of the frame, and it RUNS OFF THE PICTURE'S EDGES. That crop is what keeps it big: a resin mass described without a position and a crop renders as a small prop in the middle distance. If the resin is only a colour in this frame, or only a shine on some bark, the render has failed — the resin as a physical substance IS the path.

⚠️⚠️⚠️ THE SECOND RULE — THE RESIN IS A LENS AND A TRAP ⚠️⚠️⚠️
Two things make this picture, and both belong to the resin. It is a LENS: light passes through it and comes out changed, throwing honey-coloured caustics that drift across the bark, doubling and smearing the forest seen through it, holding a whole upside-down canopy inside one swelling bead, lighting a trapped insect from behind so it reads as a clean silhouette. And it is a TRAP: something is caught inside it forever, stopped in the middle of doing something. Describe both, concretely, as real optics and a real object.

⚠️ COLOUR — the honey of the resin is set AGAINST the cold of the forest: black-green needle shade, blue-grey depth between the trunks, cold silver rain-light, rust-red bark, emerald moss. Commit to saturated colour and real contrast. A frame that is one flat orange wash from edge to edge is the exact miss this path is built to avoid.

⚠️ THE WORLD IS PURE MESOZOIC ECOSYSTEM — Araucaria monkey-puzzles, Agathis kauri giants, Cheirolepid conifers, scaly podocarps, ginkgo, cycads, tree ferns and horsetails; dinosaurs, insects, lizards and small early mammals; earth, bark, resin, water and daylight. That is everything that exists in frame. This is the deep Mesozoic and the forest thrives entirely on its own, unobserved.

★━━━ 1. THE RESIN MASS (the hero — it opens the picture) ━━━
${resinEvent}
Render this exact formation, at this exact place in the frame, cropped exactly as stated.

★━━━ 2. WHAT IS CAUGHT INSIDE IT ━━━
${trapped}
This is the detail the eye finds and keeps looking at. Render it clearly at the stated depth, inside the resin mass above.

━━━ 3. THE GROVE AROUND IT (the stage — its massing, its floor, and the vantage at the end) ━━━
${grove}
Render this massing and this floor, from the vantage named at the end of it.

★━━━ 4. WHAT THE LIGHT DOES (the money shot — it owns the whole palette) ━━━
${optics}
Commit fully to this optical behaviour and the two colours it names. Name the surface the light lands on. The palette of the entire frame follows from this.

━━━ 5. THE AIR IN THE GROVE ━━━
${air}
${residentSection}${phenomenonSection}
━━━ MOOD ━━━
${vibeDirective ? String(vibeDirective).slice(0, 150) : ''}

━━━ STYLE ━━━
Photoreal cinematic 35mm film still, hyperreal organic texture on bark and resin, ray-traced specular on the wet surfaces, deep readable focus so the grove behind the resin stays sharp. Museum-grade paleoart accuracy with wildlife-cinematography polish.

━━━ LENGTH IS THE FIRST RULE OF THE OUTPUT — 110-140 WORDS, COUNT THEM ━━━
A tight 130-word grove beats a crammed 300-word inventory. Write comma-separated phrases in THIS order and then STOP:
[the resin mass named plainly with its surface state, its position in the frame and its crop],
[what is caught inside it, at its stated depth],
[what the light does through the resin and the two colours it throws, and the surface it lands on],
[the grove's massing, its trees and its floor, from its vantage],
[the air in the grove],${resident ? '\n[the resident, its body plan first, mid-motion, further back than the resin],' : '\n[the insects sealed in the resin and the midges over its surface],'}${phenomenon ? '\n[what reaches the grove from above, behind and higher than the resin],' : ''}
[photoreal cinematic 35mm film still, hyperreal bark and resin texture, deep focus].

Describe only what IS present — every phrase names something in the picture, never something absent, and never a negation. No preamble, no titles, no headers, no markers, no bold labels.`;
};

/*
 * MEASURED RESULTS — 3 rounds + 3 probes, 30 attempts, 2026-09-23
 *
 * R1 (6, picker-chosen models) — avg ~3.2. One render per model isolated the whole problem:
 *   flux-2-pro 4.8 | gemini 4.2 | flux-1.1-pro 2.5 | flux-1.1-pro-ultra 2.8 | flux-dev 1.8
 *   1.1-pro macro'd onto glazed bark and lost the grove to bokeh; ultra went abstract-stylised with
 *   no grove at all; flux-dev rendered NO RESIN WHATSOEVER on a brief that led with a resin sheet
 *   filling two thirds of the frame. That is the documented standing exclusion for a path whose
 *   identity is a lighting/optical condition, so the round-2 lever was modelByPath — not a pool
 *   and not the template.
 * R2 (6, pinned flux-2-pro + gemini) — avg ~4.4 and the best render of the run at 5.0: a resin
 *   window in a trunk scar with a whole feathered dinosaur suspended inside it as a backlit
 *   silhouette, hardened nodules scattered over the litter, an ankylosaur asleep in the mist behind.
 *   Also 4.7: a branch hung with beads, the two largest holding an INVERTED image of the canopy.
 * R3 (5 + 1 abort) — avg ~3.9. The round-3 variable (de-regularise the stacked geometry) WORKED:
 *   the doughnut-stack artifact both 'tiered stack' draws produced is gone. The round also surfaced
 *   two real defects, both diagnosed from the stored ai_prompt and both since fixed (below).
 * PROBE 3 (6, the shipping spec + both fixes) — avg ~4.2, 6/6 rendered, 0 aborts, 0 curio failures.
 *
 * Per-model over all 25 graded renders: flux-2-pro 4.35 (n=13, floor 3.0) | gemini 3.90 (n=12,
 * floor 2.8, four sub-4s). gemini's floor is mechanically explained — it routes through
 * cleanMediumByModel to `dinobot_gpt_clean`, which drops the bot's photoreal/PBR anchor, so its
 * resin comes back opaque and it adds an internal glow the recipes ban. Its PEAKS are among the
 * best of the run (4.8, 4.7), so it stays a small variety lane rather than being cut.
 *
 * THREE DEFECTS FOUND AND FIXED DURING QA (each measured, not guessed)
 *
 * 1. THE BANNED-PHRASE ABORT — `bot.bannedPhrases` is a RAW SUBSTRING CHECK WITH NO WORD BOUNDARIES
 *    AND NO RECOVERY. 3 of 16 renders (19%) died at stage `banned-phrase-check` with nothing stored.
 *    Found by forcing all 24 resident entries through Sonnet one at a time: `"harvestman "` contains
 *    `"man "`, and `"personally"` contains `"person"`. Both words were entirely on-brief (a
 *    harvestman is a real arachnid). Fixed in the pools (harvest-spider / plainly) and guarded in
 *    all six recipes. FLEET TRAP: any DinoBot pool word that merely CONTAINS man /woman/human/
 *    person/people/child/hunter/explorer/scientist/ranger/tourist kills the render. The bot_run_log
 *    row is no help — it stamps the DEFAULT model (flux-dev) because the abort happens before
 *    model selection, which is a red herring worth knowing about.
 * 2. A "RULED BAND OF COLOUR ... EACH STRIPE SHARP AT ITS BORDER" RENDERS A RAINBOW COLOUR-SWATCH
 *    CARD — a flat rectangular gradient strip lying on the fronds, a modern graphic-design object
 *    66 million years early, the same literalization class as "coins of light" rendering real gold
 *    coins. Straight-edged geometry words are the trigger. Colour now lands as a soft smeared wash
 *    following a real leaf's curve with no hard edge anywhere; 0 recurrences in 12 renders.
 * 3. A DETACHED RESIN MASS RENDERS AS A MANUFACTURED CURIO — 3 of 6 in one probe: a polished slab
 *    standing upright on the litter, a paperweight dome on a stump, a mineral geode. The five
 *    `split nodule` / `hardened boulder` entries named the object and its frame position but never
 *    what HELD it, so Flux framed it as a specimen with air all round it. This is the ToyBot
 *    snow-globe gift-shop-product law one layer down — in the CONTENT pool, not the prefix. Every
 *    mass now opens by naming its attachment (welded to the bark where it grew, half-buried in the
 *    litter, lying against a root, sunk into the floor with moss up one flank) with forest debris
 *    stuck to it. 0 curio failures in the 6 renders after the fix.
 *
 * RESIDUAL + THE ONE LEVER I WOULD PULL NEXT
 *
 * RESIDUAL: ~1 render in 4 makes the resin OPAQUE — a pale cream or grey-green blob with the
 * translucency, and therefore the whole LENS half of the premise, missing (worst cases read as
 * dough, wax or stone). It concentrates hard on gemini (every opaque gemini render is on the clean
 * medium) and on the largest masses. Milder second residual: both models add an internal glow the
 * recipes ban, because "water-clear + mirror-bright + backlit" reads to them as emissive.
 *
 * THE LEVER: add `'amber-forest'` to `cleanMediumByModel['google/gemini-2-image'].skipPaths` so
 * gemini renders the bot's real `render` medium (photoreal / PBR / ray-traced) plus this path's own
 * text instead of the subject-neutral clean fragment. That is exactly the ChibiBot LESSON 2 bypass,
 * verified safe there because these style tags are concrete rather than painterly-abstract, and it
 * targets the residual's measured cause rather than its symptom. One line, no pool work.
 */
/*
 * ── REGISTRATION (merge into scripts/bots/dinobot/index.js) ───────────────────
 *
 *  1. pathBuilders — add:
 *       'amber-forest': require('./paths/amber-forest'), // 2026-09-23 SHADOW — the resin forest
 *  2. shadowPaths — add the string:
 *       'amber-forest',
 *  3. chaos.skipPaths — add the string:
 *       'amber-forest',
 *  4. twoPassPolish.skipPaths — add the string:
 *       'amber-forest',
 *  5. modelByPath — DinoBot has NO modelByPath key today, so add the whole key. This is
 *     LOAD-BEARING, not a preference: three of the bot's five picker models delete the path's
 *     identity (R1 measured, table above), and every render in R2/R3 and all three probes ran on
 *     this pin. Ship it with the path or the path does not work.
 *       modelByPath: {
 *         'amber-forest': { 'black-forest-labs/flux-2-pro': 85, 'google/gemini-2-image': 15 },
 *       },
 *
 * Nothing else is required. pools.js is untouched (this file loads its own six seed JSONs),
 * the medium falls through to the bot's locked `render`, the vibe to the bot's locked `cinematic`,
 * models come from the modelByPath pin in item 5, and `sensoryAnchors.pathContext` has no entry so it
 * resolves to the bot's 'scene' context exactly as courtship-display / den-and-burrow /
 * undergrowth-scale already do. Going live later = move the string from shadowPaths[] to paths[]
 * and change nothing else (the go-live xerox rule).
 *
 * OPTIONAL, ONLY IF KEVIN WANTS IT (do NOT apply without his word — it changes how the path
 * renders): sensoryAnchors injects a `lightcolor` cue drawn from `sensory_scene_lightcolor`, whose
 * 100 entries carry SCENE NOUNS from other biomes ("volcanic-orange shaft piercing through the
 * primordial steam vents", "moonlit-blue key casting shadows on the nocturnal swamp"). If a round
 * shows one of those injecting off-premise geology, the fix is one line:
 *       sensoryAnchors: { ..., skipPaths: ['amber-forest'] },
 */
