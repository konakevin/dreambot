/**
 * SteamBot brass-glasshouse path (2026-09-22) — the Victorian glasshouse as a
 * WORKING MACHINE that happens to grow things.
 *
 * THE SOUL OF THE PATH:
 *   We are standing INSIDE a great brass-and-iron-and-glass conservatory.
 *   Riveted ribs arc up and off the top of the frame, slim white glazing ribs
 *   fan between beaded panes, a spiral stair climbs to a catwalk at canopy
 *   height — and the whole thing is plumbed: steam pipes threading the beds and
 *   venting plumes, a boiler sighing off its safety valve, chain-driven roof vents
 *   cranked half open, a rotating irrigation arm, condensation channels running
 *   with water, a wagon-wheel fan turning slowly in the haze. Inside it grows
 *   ONE thing worth the journey — a lily pad you could stand on, a corpse
 *   flower mid-bloom, a vine that has prised a pane out of its frame and gone
 *   out through the gap, a palm grown up through the sawn-out catwalk.
 *
 * WHY IT EXISTS (the gap in SteamBot's 16-path roster): every SteamBot path is
 *   metal, stone, sky, water or crowd. Its four interiors (cozy-steampunk /
 *   steampunk-labs / clocktower-heart / celestial-observatory) are all dark,
 *   warm-amber, brass-and-timber boxes. SteamBot has NO living/botanical
 *   register, NO green light, NO soaring translucent volume, and no path where
 *   steam is a visible medium filling the air (nautilus is cold water, skydock
 *   is fog). brass-glasshouse is the bot's first GREEN, WET, translucent
 *   interior — and the first where the machinery's purpose is to keep something
 *   ALIVE. (Overlap is one entry: cozy_steampunk_room has a single
 *   "conservatory reading-room" seed — but that path is a domestic sitting room
 *   with cut flowers in vases, not a plant machine at architectural scale.)
 *
 * THE OBVIOUS VERSION IS THE MISS. A pretty greenhouse with plants in it is
 *   tasteful, green, forgettable and something everyone has seen. Every pool
 *   here is written against that: the house is ENGINEERING, the machinery is
 *   VISIBLY WORKING, the specimen is an absurdity, the light COMMITS to two
 *   named colours, and one charm detail per render makes it that glasshouse and
 *   no other.
 *
 * FUNCTION-FORM + SELF-CONTAINED (the FaeBot mushroom-apothecary / ToyBot
 *   Stage-O pattern): this file loads its own eight seed JSONs and inlines its
 *   whole brief. It touches NO shared bot file — no pools.js entry, no
 *   archetypes.js entry, no archetype-templates.js entry. Registration is the
 *   block at the bottom of this file.
 *
 * 8 AXES (7 always-on + 1 gated keeper at 0.35):
 *   - house       the structure: mass, enclosure NAMED AND CROPPED, way up,
 *                 and the vantage baked in at the end. HERO, first in order.
 *   - machinery   the Victorian plant-machine, caught mid-work
 *   - specimen    the one absurd plant worth staring at (the WONDER axis)
 *   - light       ★ THE MONEY SHOT: what the light is doing in the hazed upper
 *                 air + the palette it brings. Two named colours per entry.
 *   - planting    the botanical mass + its staging + THE MARKING LAW
 *   - wet_air     heat and wet as visible media (axis-clean: air only)
 *   - charm       ONE clever detail the eye finds on second look
 *   - keeper      (0.35 gate) ONE small DISTANT figure, pose/staging/props only
 *
 * WHY `light` IS THE MONEY SHOT AND NOT `specimen`: the specimen is always-on
 *   anyway, so it needs no amplification. The documented SteamBot failure is
 *   the amber brass box — every path collapsing to one warm hue. `light` is the
 *   axis that owns the palette, so it is the one that gets the ★ and the
 *   "the palette of the whole house follows it" clause.
 *
 * THE FIVE TRAPS THIS PATH IS BUILT AGAINST (all playbook-documented):
 *   1. THE CONTAINER TRAP (ToyBot snow-globe law, 2026-09-22). "Look through a
 *      container" fails at both ends: name the glasshouse as an OBJECT and you
 *      get a product shot of a building; reduce the glass to an abstraction and
 *      it vanishes entirely. What works is CONCRETE BUT CROPPED — so every
 *      `house` entry names the ribs and panes plainly, says WHERE IN THE FRAME
 *      they sit, and crops them ("arcing up and off both top corners", "running
 *      out past the left edge"). No entry describes anything only visible from
 *      outside; no entry names a silhouette, a facade or a whole building.
 *   2. THE SPLIT-PANEL TRAP (FaeBot continuity law, lesson 10). An interior
 *      plus the world through the glass reads as two zones. Here the glass is
 *      the whole envelope, so the law is stated once and positively: the
 *      outside arrives ONLY as light and weather THROUGH the panes — pale, soft
 *      and out of focus — and that light comes back IN onto something inside.
 *      "Split" and "panel" are never named (naming seeds them); the word for a
 *      sheet of glass here is always "pane".
 *   3. READABLE TEXT (lessons 1 + 2). Plant labels are text magnets, and the
 *      surface you FORGET to describe is the one that gets lettering. So every
 *      flat panel is covered POSITIVELY and the clause sits in the template's
 *      REQUIRED OUTPUT ORDER, not in a rules block: labels carry one small
 *      painted leaf or berry, and the crates, tier fronts, door glass and shelf
 *      edges are plain smooth unmarked timber and paint. The pools were swept
 *      clean of every text-prior synonym (mark/marking/glyph/sigil/stamped/
 *      engraved/etched/inscribed/script/plaque/sign/lettering/numeral).
 *      ROUND-3 CORRECTION — A PROTECTIVE CLAUSE CAN SUMMON THE SURFACE IT
 *      PROTECTS. R2 carried "every dial and gauge is a blank white enamel face
 *      with one slim brass needle". That description IS a clock face, and
 *      flux-1.1-pro's clock prior always brings numerals: it produced a wall of
 *      numeraled clock dials in 1 of 6 and a numeraled gable dial in another,
 *      stacking on the bot-wide prefix which already says "clockwork machinery"
 *      and "glass gauges". Every dial / gauge / needle / enamel-face token was
 *      then deleted from this path (template rules, output order, AND two
 *      machinery seeds), leaving the machinery described as pipes, valves,
 *      wheels, chains and levers — round-bellied and faceless. Do not
 *      reintroduce a dial to "protect" it; the protection is the amplifier.
 *   4. THE HAND-AUTHORED CAMERA SET (snow-globe corollary). A path whose
 *      identity IS the camera must author its own vantages rather than consume
 *      a shared camera axis, and the set must be audited whole: all 25 vantages
 *      are inside the house, oblique or looking-up, at floor / stair / catwalk
 *      height. Zero plan views, zero straight axial centre-line shots, zero
 *      exteriors — any one of those is a hard-fail generator.
 *   5. THE CROWD DOUBLE LIABILITY (SteamBot skydock-harbor law). Dense figures
 *      on flux-1.1 both trip the NSFW filter and steal the frame from the
 *      architecture. So figures are at most ONE, small and distant, on a 0.35
 *      gate, and the no-figure branch is written as a POSITIVE state of the
 *      house (lesson 7 — "the room is empty" echoes into the prompt as a
 *      literal `no figures`).
 *
 * THE HOMOGENIZATION TRIAD (SteamBot, 2026-06-27) is honoured: the `keeper`
 *   axis describes POSE, STAGING and PROPS ONLY and contains zero garment
 *   words (swept: coat/jacket/uniform/corset/gown/cloak/cape/epaulet/glove/
 *   hat/cap/apron/boot/shirt/skirt/dress/trousers/waistcoat/goggles/sleeve).
 *   The one clothing line lives in the template, once.
 *
 * Config notes:
 *   - STYLE-NEUTRAL BY DESIGN (Stage M pattern). The template names no painter
 *     and no medium so the rolled LOOK prepended by index.js `buildBrief` owns
 *     the render style. Registration MUST add the path to STEAMBOT_LOOK_PATHS,
 *     which also routes it to the `steambot_neutral` medium.
 *   - `sharedDNA.scenePalette` is deliberately NOT consumed: that 200-entry
 *     pool is brass/amber/coal and would crush this path's green-and-glass
 *     palette into another warm box. `light` owns the palette. (Same call as
 *     FaeBot mushroom-apothecary, and the direct counter to the documented
 *     "bot-wide warm cast out-votes the per-render light axis" residual.)
 *   - MODEL: flux-1.1-pro ONLY, no ultra. Two documented ultra traits both
 *     apply here — ultra reverts to a golden-hour exterior on any path whose
 *     identity is a lighting condition (lesson 6), and ultra signs its work
 *     with a corner scrawl on a text-magnet path (FaeBot #8).
 *   - twoPassPolish MUST skip this path: Haiku compression strips exactly the
 *     continuity, crop and marking clauses the path is built on.
 *   - chaos MUST skip this path: GEOMETRY_CHAOS ("doorways and windows slightly
 *     wrong proportions") fights the glazing fan, and FRAMING_CHAOS ("depth of
 *     field splits unnaturally between two focal planes") is a split-frame
 *     generator on the one path that cannot afford one.
 *   - sensoryAnchors needs no entry (pathContext defaults to 'scene'); listing
 *     it explicitly is self-documenting only.
 *
 * ── QA LOG (3 rounds × 6 shadow renders, flux-1.1-pro, 2026-09-22/23) ────────
 * R1 (6/6 rendered, no NSFW fail): 3 outstanding, 1 with a prominent foreground
 *   figure, 1 off-premise MACHINE HALL with plants as garnish, 1 with a wall of
 *   numeraled clock dials. Diagnosed from the stored `ai_prompt`, not the image:
 *   (a) the plant content sat at clause 5-6 of 10, so the front of the emitted
 *   prompt was all machine nouns (bot prefix + medium fragment + structure +
 *   machinery) and the first-named-noun law ate the jungle; (b) one prompt was
 *   TRUNCATED MID-SENTENCE — the polish-skipped Sonnet call is capped at
 *   maxTokens 400 (botEngine callClaude), so a brief that makes Sonnet write
 *   ~300+ words silently loses its LAST clauses.
 * R2 — ONE VARIABLE: the emitted-prompt ORDER + BUDGET. Specimen + planting
 *   moved to clauses 3-4 (ahead of machinery), the order list cut 11 → 9, the
 *   cap tightened to 110-140 with "no clause over ~18 words", the opening
 *   naming clause changed to "packed with growing things", and "tiny and far
 *   off" folded into the keeper clause. RESULT: botanical identity 4/6 → 6/6,
 *   keeper scale fixed (1/1 tiny and distant), one 4.8 render where the
 *   specimen and the machine fused. Text still failed 1/6 hard.
 * R3 — ONE VARIABLE: DE-DIAL (see trap 3 above). RESULT: 5 of 6 at 4.0-4.8,
 *   best of the run at 4.8, split-panel 0/18 across all three rounds, camera
 *   oblique 5/6. One hard text fail remains (a roman-numeraled clock with
 *   gibberish lettering) plus 3 soft ones (illegible dial rings).
 * RESIDUAL (out of this path's scope — the state of record): the clock/dial
 *   text prior is BOT-WIDE, proven by elimination. The R3 failing prompt's body
 *   contains ZERO dial / gauge / clock / needle tokens; the only such tokens in
 *   the whole prompt are `promptPrefixByMedium.steambot_neutral`
 *   ("Victorian-industrial clockwork machinery") and `STEAMBOT_NEUTRAL_STYLE`
 *   ("glass gauges … impossible clockwork engineering"), both shared by all 16
 *   SteamBot paths, and `PROMPT_SUFFIX`'s "no text, no words" cannot negate it.
 *   The fix is a bot-level one, NOT a path edit — see the NEXT LEVER block at
 *   the bottom of this file. Second residual: emitted prompts still run 340-350
 *   words against the 400-token ceiling, so the tail clause is at risk every
 *   render; the lever is cutting the order list to 7 clauses.
 */

const fs = require('fs');
const nodePath = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(nodePath.join(__dirname, '..', 'seeds', `${name}.json`), 'utf8')
  );
}

const HOUSE = load('steambot_brass_glasshouse_house');
const MACHINERY = load('steambot_brass_glasshouse_machinery');
const SPECIMEN = load('steambot_brass_glasshouse_specimen');
const LIGHT = load('steambot_brass_glasshouse_light');
const PLANTING = load('steambot_brass_glasshouse_planting');
const WET_AIR = load('steambot_brass_glasshouse_wet_air');
const CHARM = load('steambot_brass_glasshouse_charm');
const KEEPER = load('steambot_brass_glasshouse_keeper');

const KEEPER_GATE = 0.35;

module.exports = ({ vibeDirective, picker }) => {
  const house = picker.pickWithRecency(HOUSE, 'glasshouse_house');
  const machinery = picker.pickWithRecency(MACHINERY, 'glasshouse_machinery');
  const specimen = picker.pickWithRecency(SPECIMEN, 'glasshouse_specimen');
  const light = picker.pickWithRecency(LIGHT, 'glasshouse_light');
  const planting = picker.pickWithRecency(PLANTING, 'glasshouse_planting');
  const wetAir = picker.pickWithRecency(WET_AIR, 'glasshouse_wet_air');
  const charm = picker.pickWithRecency(CHARM, 'glasshouse_charm');
  const keeper =
    Math.random() < KEEPER_GATE ? picker.pickWithRecency(KEEPER, 'glasshouse_keeper') : null;

  const keeperSection = keeper
    ? `
━━━ 8. THE ONE KEEPER (small, far off, busy — the house stays the hero) ━━━
${keeper}

TINY in the frame — a long way down the house, no taller than the pots beside them, turned mostly away, at work. Plain Victorian working dress: a long apron, rolled shirtsleeves, a long skirt or a flat cap. One figure only, never in the foreground, and the architecture keeps the frame.
`
    : `
━━━ 8. THE HOUSE AT WORK ON ITS OWN ━━━
The house is running itself this moment: the vents stand open, the pipes are venting, the irrigation is creeping along its rail, and the tools are lying exactly where they were set down.
`;

  return `You are writing ONE Flux prompt for the INTERIOR of a great Victorian brass-and-iron-and-glass glasshouse PACKED WITH GROWING THINGS — a conservatory that is really a machine for keeping a jungle alive. 1890s engineering: riveted iron ribs, brass steam pipes, chain-driven roof vents, gaslight, wet iron grating, hundreds of small beaded panes. Never modern, never neon, never futuristic.

━━━ THE FIVE THINGS THAT MAKE THIS PICTURE ━━━
1. ONE CAMERA STANDING INSIDE ONE CONTINUOUS GLASS VOLUME. We are IN the house, under its glass. Name the enclosing glass plainly and put it WHERE THE FRAME CROPS IT: riveted ribs arcing up and off the top corners, slim white glazing ribs fanning between beaded panes overhead, the wet glazed flank running out past the edge of the frame. One unbroken shot, deep focus front to back, the house filling 85-95% of frame.
2. THE PLANTS ARE HALF THE PICTURE. This is a jungle under glass, not a boiler room with a fern. Leaves, fronds, crowns, beds and pots are massed through the whole frame, and one plant in here is a genuine absurdity worth the journey — described concretely enough to paint.
3. AND IT IS A WORKING MACHINE. Brass and iron plumbing visibly DOING something for the plants: steam venting from a joint, a vent cranked half open on its chain, water running in the channels, a valve wheel wound hard over, a fan turning in the haze.
4. THE OUTSIDE ARRIVES ONLY AS LIGHT. Whatever weather is beyond is seen THROUGH the panes and nothing more — pale, soft, out of focus, smaller and hazier than everything inside — and its light comes back IN onto something real in here: a broad wet leaf, the grating, the brass edge of a tier. That returning light is what makes it one single picture.
5. VIVID, AND EVERY MARKING IS A PICTURE OR PLAIN. Commit to the rolled light and both its colours — saturated green and glass and steam, not a tasteful brown room. Each plant tag carries one small painted leaf or berry and nothing else. Crates, tier fronts, shelf edges, the door's glass and its brass push-plate are plain, smooth and unmarked. The machinery's brass is plain polished metal, raised scrollwork and cast leaf-and-vine ornament — pipes, valves, wheels, chains and levers, all of it round-bellied and mechanical. Anything that would carry writing is a small painted picture of a leaf instead.

━━━ 1. THE HOUSE (the hero — its mass, its enclosing glass, its way up, and the vantage) ━━━
${house}
Render this structure and plan exactly, from the vantage named at its end. The ribs and panes must be IN the frame and cropped by its edges.

━━━ 2. THE ONE SPECIMEN WORTH THE JOURNEY ━━━
${specimen}

━━━ 3. THE PLANTING AND ITS STAGING ━━━
${planting}

━━━ 4. THE MACHINERY (caught mid-work) ━━━
${machinery}

★━━━ 5. THE LIGHT (the money shot — it owns the palette of the whole house) ━━━
${light}
Commit fully to this light and to both of its named colours. Light is a shaft, a patch, a pool, a streak or a glow landing on a real surface — name the surface it lands on. Every other colour in the frame follows it.

━━━ 6. THE AIR (heat and wet, visible) ━━━
${wetAir}

━━━ 7. THE CHARM DETAIL (small, the eye finds it second) ━━━
${charm}
${keeperSection}
━━━ MOOD ━━━
${vibeDirective ? String(vibeDirective).slice(0, 120) : ''}

━━━ LENGTH IS THE FIRST RULE — 110-140 WORDS, COUNT THEM, AND NO CLAUSE OVER ~18 WORDS ━━━
A tight 130-word glasshouse beats a crammed 300-word inventory, and anything past 140 words is cut off and lost. Write comma-separated phrases in THIS order and then STOP:
[name it plainly as the inside of a great Victorian glasshouse packed with growing things, together with the rolled light],
[the structure: riveted ribs and beaded panes and where the frame crops them, the volume, the way up, from its vantage],
[the one absurd specimen],
[the massed planting and its staging],
[the machinery visibly working],
[what the light is doing, its two colours, and the surface it lands on],
[the tags each carrying one small painted leaf or berry, crates and tier fronts and shelf edges and door glass plain and smooth, the machinery's brass plain polished metal and raised leaf-and-scroll ornament],
[pale soft light through the panes falling back in onto a wet leaf inside, the steam thick in the high air, and the one charm detail],${keeper ? '\n[the one keeper, tiny and far off down the house],' : ''}
[the render style named at the very top of this brief].

Describe only what IS present — every phrase names something in the picture, never something absent. No preamble, no headers, no markers, no bullets, no bold labels.`;
};

/*
 * ── REGISTRATION (merge into scripts/bots/steambot/index.js) ──────────────────
 *
 *  1. pathBuilders — add:
 *       'brass-glasshouse': require('./paths/brass-glasshouse'), // Stage N SHADOW
 *
 *  2. STEAMBOT_LOOK_PATHS (the Set) — add:
 *       'brass-glasshouse', // Stage N SHADOW
 *     (this is load-bearing twice: it routes the path to the `steambot_neutral`
 *      medium via mediumByPath, and it is what prepends the rolled LOOK.)
 *
 *  3. modelByPath — add:
 *       'brass-glasshouse': ['black-forest-labs/flux-1.1-pro'], // no ultra: lighting-identity path + text magnet
 *
 *  4. shadowPaths — add (it is currently `[]`):
 *       shadowPaths: ['brass-glasshouse'],
 *
 *  5. chaos.skipPaths — add:
 *       'brass-glasshouse',
 *
 *  6. twoPassPolish.skipPaths — add:
 *       'brass-glasshouse',
 *
 *  7. sensoryAnchors.pathContext — add (optional, self-documenting; the
 *     resolver already defaults an unlisted path to 'scene'):
 *       'brass-glasshouse': 'scene',
 *
 * Nothing else: pools.js is untouched (this file loads its own seeds),
 * vibes fall through to the bot-wide ['cinematic'] lock, and no
 * promptPrefixByPath entry is wanted (the wrapper-strip lesson).
 * Going live later = move the string from shadowPaths[] into paths[] and
 * change NOTHING else (the faithful-xerox rule).
 *
 * ── THE NEXT LEVER (optional, bot-level — Kevin's call, NOT part of the merge)
 * The residual readable-clock failures come from the SHARED neutral medium, so
 * the only real fix is a path-own medium. That is three more index.js lines and
 * it would change nothing else about how the path renders:
 *
 *   const STEAMBOT_GLASSHOUSE_STYLE =
 *     'richly detailed Victorian glasshouse imagery — riveted iron ribs, brass ' +
 *     'steam pipes, valves, chain gear, wet glazed panes, gaslight and oiled ' +
 *     'timber, an 1800s world of impossible plant-machinery; render exactly the ' +
 *     'scene and composition the brief describes — the art-style, medium, ' +
 *     'palette and finish are set entirely by the LOOK at the top of the prompt';
 *
 *   mediumStyles:          steambot_glasshouse: STEAMBOT_GLASSHOUSE_STYLE,
 *   promptPrefixByMedium:  steambot_glasshouse: 'steampunk illustration, Victorian glasshouse ironwork and brass plant-machinery',
 *   promptSuffixByMedium:  steambot_glasshouse: blocks.PROMPT_SUFFIX,
 *   mediumByPath:          'brass-glasshouse': 'steambot_glasshouse',  // must be
 *                          assigned AFTER the Object.fromEntries(STEAMBOT_LOOK_PATHS)
 *                          spread, or the derived 'steambot_neutral' overwrites it
 *
 * It drops "clockwork machinery", "exposed gears" and "glass gauges" — the three
 * tokens that put a numeraled clock in the frame — while keeping every other
 * SteamBot identity word, and the path stays in STEAMBOT_LOOK_PATHS so the LOOK
 * still leads. Worth one 6-render round before believing it.
 */
