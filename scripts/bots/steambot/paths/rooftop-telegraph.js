/**
 * SteamBot rooftop-telegraph path (2026-09-23) — the aerial signal network
 * above a steampunk city: iron towers, painted semaphore blades, taut cables,
 * and the crews who work them, seen from the rooftops.
 *
 * THE SOUL OF THE PATH:
 *   We are standing ON a roof, level with the wires. A riveted lattice tower
 *   fills one side of the frame carrying three pairs of long painted blades,
 *   and the city's slates, leads, pantiles and chimney pots run away left and
 *   right and off both edges. Cables come in from one side edge and go back
 *   out of it. Something is happening: twenty pigeons on a wire and one
 *   lifting off it, ice shards falling off a cable into the fog, sparks off a
 *   drum, a cat asleep in a vent's updraught, every blade on every tower
 *   dropping to safe at once as a squall comes up — or a signaller out on the
 *   gallery with one arm straight up, holding the position, the city dropping
 *   away under her. The tower's little cabin is lit like a lantern, warm
 *   orange against a cold teal sky.
 *
 * WHY IT EXISTS (the gap in SteamBot's 17-path roster — verified, not assumed):
 *   Every SteamBot path is metal, stone, sky, water or crowd; its four dark
 *   amber interiors are brass-and-timber boxes; brass-glasshouse just added the
 *   first green/wet/translucent interior. NOTHING on the bot has a NETWORK or a
 *   system of communication as its subject, and NOTHING is staged ON the
 *   roofline looking across a city. Measured overlap:
 *     - "rooftop" appears in 11 seed pools but only ever as BACKDROP — the view
 *       out of cozy-steampunk's window (30 hits), a distant band in the shared
 *       `lighting` pool, a terrace a character stands on in the two outdoor-
 *       moments pools. No path's STAGE is the roof plane.
 *     - "telegraph" appears 8× in `airship_role` (a TELEGRAPHIST crew role) and
 *       as a room prop in cozy_steampunk_settings. Never as a subject.
 *     - "semaphore" appears once or twice as a gated surprise element in four
 *       pools. Never as the hero.
 *     - CLOSEST COLLISION is `skydock-harbor`: 13 of its 145 vista entries are
 *       ROOFTOP sky-harbours ("SPIREMONT ROOFPORT — airships moored to
 *       iron-ringed spires… gangways arching across the slate-grey roofscape").
 *       So the roofline is not virgin ground — but there the hero is MOORED
 *       AIRSHIPS and a departure crowd. Here the hero is the CABLE NETWORK and
 *       the people who climb it; this path's pools contain no moored hull, no
 *       gangway between gondolas and no platform crowd. An airship is welcome
 *       only as a distant passer-by in the sky band, never as a subject.
 *
 * FUNCTION-FORM + SELF-CONTAINED (the brass-glasshouse / FaeBot mushroom-
 *   apothecary pattern): this file loads its own seven seed JSONs and inlines
 *   its whole brief. It touches NO shared bot file — no pools.js entry, no
 *   archetypes.js entry, no archetype-templates.js entry. Registration is the
 *   block at the bottom of this file.
 *
 * 7 AXES (6 always-on + 1 gated crew at 0.65):
 *   - roofline       the stage. HERO, first in the order, and it carries the
 *                    CROSSWISE LAW + the vantage baked into its tail.
 *   - tower_rig      ★ the signalling hardware as SHAPE AND STATE ONLY
 *   - signal_moment  ★ the network's own beat, with a NON-HUMAN actor named
 *   - sky_light      ★ owns the palette: two named colours in opposition
 *   - city_below     what shows in the GAP between and under the roofs
 *   - charm          ONE clever detail the eye finds second
 *   - crew           (0.65 gate) the HUMAN beat — pose/staging/props only
 *
 * WHY signal_moment AND crew ARE BOTH BEAT AXES, AND WHY THAT IS NOT A
 *   CONFLICT: playbook lesson 25 says a named action with no named actor
 *   renders a disembodied limb, so every beat here names its actor in full.
 *   `signal_moment`'s actors are deliberately ALL non-human (birds, ice, wind,
 *   sparks, a cat, a fox, the blades themselves), so when the crew gate rolls
 *   FALSE the render still has a story beat instead of a tableau — the
 *   documented "a pure-machinery render must still be ADVENTUROUS" problem —
 *   and when it rolls TRUE the two beats stack instead of contradicting.
 *
 * ── THE FOUR TRAPS THIS PATH IS BUILT AGAINST ───────────────────────────────
 *  1. THE TEXT PRIOR, AND IT IS THE WORST CASE ON THIS BOT (playbook 12, 23,
 *     26, 27). A signalling network is made of exactly the surfaces that cannot
 *     be described safely: dials, indicator faces, code plates, station boards.
 *     And the prior is partly BOT-WIDE — `promptPrefixByMedium.steambot_neutral`
 *     says "clockwork machinery" and `STEAMBOT_NEUTRAL_STYLE` says "glass
 *     gauges" + "exposed gears", present in 18 of 18 brass-glasshouse prompts.
 *     Three moves, composed:
 *       (a) SIGNAL STATE IS CARRIED BY SHAPE AND POSITION, never by a reading
 *           surface. A blade's angle, a paddle up or down, a shutter open or
 *           shut, a disc face-on or edge-on, a lamp lit or dark, a flag at the
 *           top of its staff. All of that is legible with zero characters, and
 *           it is the template's FIRST rule.
 *       (b) EVERY text-shaped noun deleted from every layer this path controls
 *           (swept: dial/gauge/clock/needle/board/panel/plate/placard/sign/
 *           label/tag/code/letter/numeral/number/script/inscri/engrav/etch/
 *           glyph/sigil/mark/marking/stamped/lettering/plaque/hoarding/
 *           billboard/poster/advert). Two real hits were fixed at authoring:
 *           a "hoardings" skyline band and a "clock-less tower".
 *       (c) DELETION IS NOT ENOUGH — the space gets backfilled (playbook 27).
 *           So the flat faces are FILLED POSITIVELY: every timber and iron
 *           face on a tower is one solid colour with a bold painted band, ring,
 *           chevron or spot (which is also historically exactly right for
 *           semaphore blades), and every tall wall face in the picture is FULL
 *           — soot-furred brick crossed by an iron ladder and a run of cables,
 *           ivy to the eaves, a bristle of chimney stacks, a fern out of a
 *           crack. That last one matters because a big blank gable above a
 *           Victorian city IS a painted-advertisement prior.
 *  2. THE CORRIDOR (playbook 17, 24, 29). Cables run in lines and a line of
 *     anything tiles to a vanishing point. The CROSSWISE LAW is applied to the
 *     SETTING and stated in three places that reach Flux (template rule 2,
 *     the tail of all 25 roofline seeds, output-order item 2): the roof plane
 *     crosses the picture from the left edge to the right edge with both ends
 *     running out of frame, the far city is a low BAND across the top. Plus
 *     lesson 24's missing half — a span must cross to somewhere, so EVERY
 *     CABLE ENTERS FROM ONE SIDE EDGE AND RUNS BACK OUT OF IT, CROPPED, and so
 *     does any bridge or gangway. Lesson 29's sweep (converg / vanishing /
 *     apex / recede / down its length) was run on the HERO pool too, not just
 *     the setting: zero hits.
 *  3. ULTRA SIGNS ITS WORK. Measured on three bots in this run including
 *     SteamBot's own `airship-female`; brass-glasshouse is pinned to
 *     flux-1.1-pro for exactly this. A fake corner signature is a hard TEXT
 *     fail and this is a text-magnet path. Second, independent reason: ultra
 *     reverts to a golden-hour EXTERIOR on any path whose identity is a
 *     lighting condition (playbook 6), and this path's identity is warm lamp
 *     against cold sky. So: `modelByPath` → flux-1.1-pro ONLY.
 *  4. SOBER. A rooftop of grey machinery in grey light is the default failure
 *     and it is a MISS under the motto even when it is clean. `sky_light` owns
 *     the palette and every one of its 25 entries ends in a shouted
 *     two-colour opposition (HOT BRASS against DEEP TEAL / SIGNAL RED against
 *     YELLOW GREEN), because FarmBot lambing-season measured that every sober
 *     frame came from a light entry describing light as EVEN. Each entry also
 *     names its SOURCE and the SURFACE its light lands on (playbook 30).
 *
 * ── THE JARGON AUDIT (playbook 28 — mandatory pre-round-0 on a specialist
 *    path, and telegraphy is one of the live minefields it names) ────────────
 *   For each domain term: what does a LAYPERSON picture? If it is a different
 *   object, the word is banned even though it is correct.
 *     key        → a door key / a piano key            BANNED
 *     sounder    → nothing at all (no prior)           BANNED
 *     relay      → a relay race, a baton               BANNED
 *     drop       → a droplet of water                  BANNED
 *     arm        → a HUMAN ARM — the single worst one  BANNED as hardware.
 *                  Used ONLY of a person ("one arm straight up"), which is
 *                  wanted. The hardware word is BLADE / PADDLE / VANE /
 *                  SHUTTER / DISC / CROSSBAR.
 *     block      → a toy brick / a city block          BANNED
 *     mast       → a SAILING SHIP's mast, and this bot has a documented
 *                  age-of-sail drift (steampunk-man, 2026-06-30)  BANNED.
 *                  Use TOWER / LATTICE TOWER / STANDARD / STAFF.
 *     line       → a drawn line or a queue              BANNED for the cable.
 *                  Use CABLE / WIRE. (Kept where it genuinely means a drawn
 *                  line: "the skyline a thin line of molten red".)
 *     repeater   → a repeating RIFLE                   BANNED
 *     circuit    → a printed circuit board             BANNED
 *     station    → a RAILWAY STATION building, which also drags in signboards
 *                                                      BANNED
 *     code       → text                                BANNED
 *     message    → a written note on paper             BANNED
 *     telegraph  → the DESK instrument with a brass key, which drags the whole
 *                  scene indoors                       BANNED from every layer
 *                  that reaches Flux. The path KEY is still `rooftop-telegraph`
 *                  because that is what the thing is; the prompt says "iron
 *                  signal towers strung with cables above the rooftops", which
 *                  is more legible anyway.
 *   KEPT because the layperson's picture is the right one: SEMAPHORE (a
 *   railway semaphore signal — a post with an angled blade and a lamp, which
 *   is precisely the shape wanted), CABLE, WIRE, BLADE, PADDLE, SHUTTER, DISC,
 *   LAMP, FLAG, DRUM, WINCH, TURNBUCKLE, ANCHOR RING, GALLERY, COUNTERWEIGHT.
 *
 * ── OTHER DESIGN CALLS, WITH REASONS ───────────────────────────────────────
 *   - NO SEPARATE CAMERA AXIS. The vantage is baked into the tail of each of
 *     the 25 roofline seeds (brass-glasshouse's proven choice, and the
 *     BrickBot finding that 3 bad camera entries out of 25 out-vote every
 *     anti-front-on mandate in a template). All 25 audited as a SET: every one
 *     is at or near roof height, oblique, looking ACROSS. Zero plan views,
 *     zero axial down-the-length shots, zero ground-level shots of a whole
 *     building — each of those is a hard-fail generator here.
 *   - `sharedDNA.scenePalette` is deliberately NOT consumed. That 200-entry
 *     pool is brass/amber/coal and would crush the cold-sky half of every
 *     sky_light entry back into the warm box this path exists to escape. Same
 *     call as brass-glasshouse and FaeBot mushroom-apothecary.
 *   - NO DETAIL EXEMPTION FOR ANY SUBJECT (playbook 13's 2026-09-23
 *     correction). The pigeons, crows, starlings, bats, moths, the cat and the
 *     fox are named at count and at position and NEVER given an anatomical
 *     close-up clause, because the one you describe most is the one that comes
 *     out biggest. Bird counts are all ≥12 where a mass is meant (twenty
 *     pigeons, fifteen crows, several hundred starlings, thirty birds) for the
 *     same reason: a low count IS the giant-creature generator.
 *   - THE CROWD DOUBLE LIABILITY (SteamBot skydock-harbor law): dense figures
 *     on flux-1.1 both trip the NSFW filter and steal the frame. So figures
 *     are ONE OR TWO, never a crowd, on a 0.65 gate; the `crew` pool was swept
 *     for crowd/mass/throng/pressed/bodies (zero hits) and the one
 *     "crowd pressed back along the wall" in `city_below` was reworded to "a
 *     knot of onlookers standing well back".
 *   - THE HOMOGENIZATION TRIAD (SteamBot, 2026-06-27): the `crew` pool is
 *     POSE, STAGING and PROPS ONLY with zero garment words (swept: coat/
 *     jacket/uniform/corset/gown/cloak/cape/epaulet/glove/hat/cap/apron/boot/
 *     shirt/skirt/dress/trousers/waistcoat/goggles/sleeve/scarf/muffler). The
 *     one clothing line lives in the template, once.
 *   - SENSORY ANCHORS MUST BE SKIPPED ON THIS PATH, and this is measured:
 *     `sensoryAnchors.requiredChannels: ['lightcolor']` puts a lightcolor
 *     anchor on EVERY SteamBot render, appended AFTER the output order, and
 *     47 of the 100 entries in `sensory_scene_lightcolor` name an INTERIOR
 *     surface ("amber gaslamp wash spilling across polished mahogany wall
 *     panels", "blood-velvet-red key stabbing from the furnace observation
 *     porthole"), with 49 warm-coded. On a roof that is both a setting
 *     contradiction and a second, conflicting light instruction fighting the
 *     axis that owns the palette. `sensoryAnchors.skipPaths` is supported
 *     (sensoryAnchors.js:152) and is the smallest correct lever.
 *   - twoPassPolish MUST skip: Haiku compression strips exactly the crop,
 *     crosswise and blade-state clauses the path is built on.
 *   - chaos MUST skip: GEOMETRY_CHAOS ("windows slightly wrong proportions")
 *     scrambles the lattice, and FRAMING_CHAOS ("depth of field splits between
 *     two focal planes") is a split-frame generator on a path whose whole
 *     premise is one continuous shot across a plane.
 *   - STYLE-NEUTRAL BY DESIGN (Stage M pattern): the template names no painter
 *     and no medium, so the rolled LOOK prepended by index.js `buildBrief`
 *     owns the render style. Registration MUST add the path to
 *     STEAMBOT_LOOK_PATHS.
 *   - WORD BUDGET (playbook 18). SteamBot's emitted median is 199 words over
 *     300 renders (min 146, max 432) — a healthy bot, and the fleet-wide
 *     FarmBot problem is not present here. Of that, only ~60 words are the
 *     shared wrapper: `promptPrefixByMedium.steambot_neutral` is 5 words and
 *     `STEAMBOT_NEUTRAL_STYLE` is 54, so in a real SteamBot prompt THE SCENE
 *     STARTS AT ABOUT WORD 60 — plenty of first-third budget left, unlike
 *     FarmBot's 273-word fragment starting at word 4. The one SteamBot outlier
 *     is brass-glasshouse at median 345, from a 9-item order plus long prose.
 *     So this path states a 100-130 cap AND keeps its prose short and its
 *     order to 7 items.
 *
 * ── QA LOG (3 rounds × 6 shadow renders, flux-1.1-pro, 2026-09-23) ──────────
 *          |  R1  |  R2  |  R3  |
 *   avg    | 3.22 | 3.72 | 4.20 |  best of run 4.8 (r3.5), min 3.6
 *   signalling hardware in frame   | 0/6 | 4/6 | 6/6 |
 *   clock / dial / gauge face      | 3/6 | 3/6 | 1/6 (distant, small)
 *   clock tokens in the prompt     | 6/6 | 6/6 | 0/6 |
 *   corridor / receding street     | 3/6 | 0/6 | 0/6 |
 *   crosswise law in the prompt    | 6/6 | 6/6 | 6/6 |
 *   emitted words (median)         | 373 | 283 | 309 |
 *
 * R1 (6/6 rendered, 0 NSFW): avg 3.22. Four frames were lovely and OFF-PREMISE
 *   — the path's entire identity, the signalling hardware, rendered 0 of 6, and
 *   every tower that did appear came out a BARE LATTICE MAST. One hard corridor
 *   (a walkway running dead up the middle) and one monochrome frame. Diagnosed
 *   from the stored `ai_prompt`, not the images, and the numbers were decisive:
 *   the first roofline noun landed at word ~104 (25-32% in) and 6/6 renders
 *   delivered the roof, while the first blade/paddle/shutter word landed at word
 *   ~177 (43-51% in) — outside the attended first third — and 0/6 delivered it.
 *   The first ~90 words are pure style boilerplate (bot prefix 5 + neutral
 *   medium 54 + Sonnet restating the rolled LOOK ~30), so the path had ~30 words
 *   of attended budget and the ROOFLINE was spending all of it.
 * R2 — ONE VARIABLE: the emitted-prompt ORDER + BUDGET. The tower and its blade
 *   state hoisted from order item 3 to item 1 (and to template section 1) ahead
 *   of the roofline, the opening naming clause changed so the SUBJECT is the
 *   tower, the order cut 9 items → 7, the cap tightened 115-145 → 100-130, and
 *   the rules block cut 4 items + a standalone surface block → 3 items.
 *   RESULT: hardware 0/6 → 4/6, blades to 26-45%, emitted median 373 → 283,
 *   corridor 3/6 → 0/6, avg 3.22 → 3.72, and the two best frames so far. The
 *   blocker became unambiguous: 3/6 grew a dial or clock face, two with full
 *   numerals and one inventing an entire clock tower beside the signal tower.
 * R3 — ONE VARIABLE: a PATH-OWN MEDIUM dropping the bot-wide clock vocabulary.
 *   Attributed first, across all 12 R1+R2 prompts, by splitting each prompt at
 *   the end of the medium fragment: `clockwork` + `gears` + `gauges` present in
 *   the SHARED WRAPPER in 12 of 12, and ZERO such tokens in the part the path
 *   controls in 12 of 12. So the faces could only come from
 *   `promptPrefixByMedium.steambot_neutral` and `STEAMBOT_NEUTRAL_STYLE`.
 *   RESULT: clock tokens 12/12 → 0/6 and clock faces 3/6 → 1/6 (one small
 *   distant numeraled clock tower on a city skyline — lesson 27's shape: a
 *   Victorian skyline is itself a clock-tower prior, so deleting our mention
 *   removes nothing from the model's). Hardware 6/6. avg 3.72 → 4.20.
 *   Reference render (4.8): two cream signal discs face-on on a brass spindle
 *   above a brick tower, a signaller on the gallery at the lever, a second
 *   figure walking the snowy roof gutter to work, amber gaslamps on snow
 *   against a cold pale-blue winter city. Also strong: the signal flag at the
 *   truck under a bruised-purple sky lit from beneath by the city's furnaces
 *   (4.3); two crew walking an iron footbridge with a cable fan cropped on the
 *   left edge (4.5); a signaller crossing a footbridge over an arcade's glass
 *   barrel roof (4.2).
 *
 * RESIDUAL — and it is located precisely, not guessed. 2 of 6 R3 frames put the
 *   camera at GROUND level or a low up-shot and lost "seen from the rooftops"
 *   altogether (r3.1 a cobbled yard, r3.2 a low up-shot). Measured cause: THE
 *   VANTAGE REACHED ONLY 1 OF 6 EMITTED PROMPTS — and that one render is the
 *   4.8. The vantage lives at the TAIL of each roofline seed, and the moment the
 *   roofline moved from order item 1 to item 2 in R2, Sonnet started dropping
 *   the tail. That is playbook lesson 22 verbatim: a law appended to the tail of
 *   a seed entry reaches about a fifth of prompts; the OUTPUT ORDER takes it to
 *   all of them. brass-glasshouse never saw this because its roofline stayed at
 *   item 1.
 * THE ONE LEVER TO PULL NEXT (one line, one round): give the vantage its OWN
 *   output-order item rather than a trailing phrase inside item 2 — insert
 *   `[the vantage named at the end of the roof description: where the camera
 *   stands on the roof and that it looks ACROSS],` as item 3. Fallback if that
 *   under-delivers: buy the framing with PREFIX words instead, changing
 *   `promptPrefixByMedium.steambot_rooftop` to name the roofline
 *   ("...a city ROOFLINE of slate and lead with iron signal towers standing on
 *   it") and leaving the hero to the seeds — but note that trade is zero-sum on
 *   the first third, which is exactly what R2 demonstrated in the other
 *   direction.
 */

const fs = require('fs');
const nodePath = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(nodePath.join(__dirname, '..', 'seeds', `${name}.json`), 'utf8')
  );
}

const ROOFLINE = load('steambot_rooftop_telegraph_roofline');
const TOWER_RIG = load('steambot_rooftop_telegraph_tower_rig');
const SIGNAL_MOMENT = load('steambot_rooftop_telegraph_signal_moment');
const SKY_LIGHT = load('steambot_rooftop_telegraph_sky_light');
const CITY_BELOW = load('steambot_rooftop_telegraph_city_below');
const CHARM = load('steambot_rooftop_telegraph_charm');
const CREW = load('steambot_rooftop_telegraph_crew');

const CREW_GATE = 0.65;

module.exports = ({ vibeDirective, picker }) => {
  const roofline = picker.pickWithRecency(ROOFLINE, 'rooftop_telegraph_roofline');
  const towerRig = picker.pickWithRecency(TOWER_RIG, 'rooftop_telegraph_tower_rig');
  const signalMoment = picker.pickWithRecency(SIGNAL_MOMENT, 'rooftop_telegraph_signal_moment');
  const skyLight = picker.pickWithRecency(SKY_LIGHT, 'rooftop_telegraph_sky_light');
  const cityBelow = picker.pickWithRecency(CITY_BELOW, 'rooftop_telegraph_city_below');
  const charm = picker.pickWithRecency(CHARM, 'rooftop_telegraph_charm');
  const crew = Math.random() < CREW_GATE ? picker.pickWithRecency(CREW, 'rooftop_telegraph_crew') : null;

  const crewSection = crew
    ? `
━━━ 5. THE CREW ━━━
${crew}
One or two figures only, each about a fifth of the frame tall. Victorian working dress with one strong colour in it: an oiled canvas coat, a knitted cap or a headscarf, a leather tool-belt hung with mallets, hobnailed boots.
`
    : `
━━━ 5. THE TOWER WORKING ON ITS OWN ━━━
The cables hum in the wind, a crew's mallets and a half-used coil of wire lie where they were set down on the leads, the tar pot has its brush standing in it, and the lamp somebody lit is still burning.
`;

  return `You are writing ONE Flux prompt whose SUBJECT is an IRON SIGNAL TOWER carrying long painted semaphore blades, standing on the rooftops of a great Victorian city with taut cables running off it. 1890s engineering: riveted lattice, painted timber blades, brass lamps in hoods, slate and lead and soot. Never modern, never neon, never futuristic.

━━━ THE THREE THINGS THAT MAKE THIS PICTURE ━━━
1. THE TOWER AND ITS BLADES ARE THE SUBJECT, NAMED FIRST AND BIG IN THE FRAME. The signal is read by SHAPE AND POSITION: a blade's angle, a paddle raised or lowered, a shutter open or shut, a disc face-on or edge-on, a lamp burning or dark. Say the exact angle of every moving part, and give every flat timber and iron face one solid colour with a bold painted band, ring, chevron or spot across it.
2. EVERYTHING RUNS CROSSWISE AND OFF THE EDGES. The roof plane crosses the picture from the left edge to the right edge with both ends running out of frame, and the far city is a low BAND across the top. Every cable, bridge and walkway ENTERS FROM ONE SIDE EDGE AND RUNS BACK OUT OF IT, cropped by the frame.
3. WARM LAMP AGAINST COLD SKY, AND SOMETHING HAPPENING NOW. Commit to the rolled light and BOTH its named colours, landing on a named surface. Whatever is doing the action is named in full — the whole bird, the whole person.

★━━━ 1. THE TOWER AND ITS RIG (the subject — say the angles) ━━━
${towerRig}

━━━ 2. THE ROOF IT STANDS ON (the stage, and the vantage) ━━━
${roofline}

★━━━ 3. WHAT IS HAPPENING (name what is doing it) ━━━
${signalMoment}

★━━━ 4. THE LIGHT (it owns the palette) ━━━
${skyLight}
${crewSection}
━━━ 6. THE CITY IN THE GAP BELOW ━━━
${cityBelow}

━━━ 7. THE CHARM DETAIL (small, found second) ━━━
${charm}

━━━ MOOD ━━━
${vibeDirective ? String(vibeDirective).slice(0, 120) : ''}

━━━ LENGTH IS THE FIRST RULE — 100-130 WORDS, COUNT THEM, NO CLAUSE OVER ~16 WORDS ━━━
A tight 115-word picture beats a crammed 300-word inventory. Write comma-separated phrases in THIS order, starting with the tower, and then STOP:
[the iron signal tower standing on the rooftops of a great Victorian city, the exact angle or position of every blade, paddle, shutter, disc and lamp on it, and the solid colour and bold painted band on its faces],
[the roof it stands on crossing the picture left edge to right edge with both ends out of frame, the far city a low band across the top, every cable entering from one side edge and running back out of it cropped, from its vantage],
[what is happening right now, the whole creature or thing doing it${crew ? ', and the one or two crew at work, each about a fifth of the frame tall' : ''}],
[what the light is doing, both of its colours, and the surface it lands on],
[the city in the gap below, between and under the cables],
[every tall wall face full of soot-black brick and ladders and cables and ivy, and the one charm detail],
[the render style named at the very top of this brief].

Describe only what IS present — every phrase names something in the picture. No preamble, no headers, no markers, no bullets, no bold labels.`;
};

/*
 * ══ REGISTRATION — the exact lines to merge into scripts/bots/steambot/index.js
 *
 *  1. pathBuilders — add:
 *       'rooftop-telegraph': require('./paths/rooftop-telegraph'), // Stage N2 SHADOW
 *
 *  2. STEAMBOT_LOOK_PATHS (the Set) — add:
 *       'rooftop-telegraph', // Stage N2 SHADOW
 *     (load-bearing: it is what prepends the rolled LOOK in buildBrief. It also
 *      derives mediumByPath → steambot_neutral, which step 6 then OVERRIDES.)
 *
 *  3. A PATH-OWN MEDIUM — the R3 variable, and it is REQUIRED, not optional.
 *     Add this const beside STEAMBOT_NEUTRAL_STYLE:
 *
 *       // Stage N2: rooftop-telegraph's own medium. IDENTICAL to
 *       // STEAMBOT_NEUTRAL_STYLE except that "exposed gears", "glass gauges"
 *       // and "impossible clockwork engineering" are replaced with this path's
 *       // own nouns. Measured 2026-09-23: those three tokens reached 12 of 12
 *       // prompts across two rounds while the path's own text carried ZERO
 *       // clock/dial/gauge tokens, and 6 of those 12 renders grew a dial or a
 *       // clock face (two with full numerals, one inventing a whole clock
 *       // tower). Swapping this medium in took clock faces 3/6 → 1/6 and the
 *       // batch average 3.72 → 4.20. This is the bot-level lever
 *       // brass-glasshouse identified and did not need to spend.
 *       const STEAMBOT_ROOFTOP_STYLE =
 *         'richly detailed steampunk Victorian-industrial imagery — brass, copper, riveted iron ' +
 *         'lattice, taut cables, painted timber, pipework, gaslight, slate and lead and soot, an ' +
 *         '1800s world of impossible aerial engineering; render exactly the scene and composition ' +
 *         'the brief describes — the art-style, medium, palette and finish are set entirely by the ' +
 *         'LOOK at the top of the prompt';
 *
 *  4. mediumStyles — add:
 *       steambot_rooftop: STEAMBOT_ROOFTOP_STYLE,
 *
 *  5. promptPrefixByMedium — add (a tight CONTENT-only anchor, no style tokens,
 *     so the rolled LOOK still leads the CLIP anchor; 71 chars):
 *       steambot_rooftop: 'steampunk illustration, Victorian-industrial ironwork and aerial cables',
 *     and promptSuffixByMedium — add:
 *       steambot_rooftop: blocks.PROMPT_SUFFIX,
 *
 *  6. mediumByPath — this line MUST come AFTER the Object.fromEntries spread, or
 *     the derived 'steambot_neutral' silently overwrites it. So change:
 *
 *       mediumByPath: Object.fromEntries([...STEAMBOT_LOOK_PATHS].map((p) => [p, 'steambot_neutral'])),
 *
 *     to:
 *
 *       mediumByPath: {
 *         ...Object.fromEntries([...STEAMBOT_LOOK_PATHS].map((p) => [p, 'steambot_neutral'])),
 *         // Stage N2 SHADOW — path-own medium, dropping the bot-wide clock
 *         // vocabulary. Must stay AFTER the spread above.
 *         'rooftop-telegraph': 'steambot_rooftop',
 *       },
 *
 *     No migration: `steambot_rooftop` is bot-internal like `steambot_neutral`,
 *     and with a modelByPath pin present `pickModel` falls through the missing
 *     `dream_mediums` row straight to that pin (verified — every render in all
 *     three rounds logged "path-locked for path=rooftop-telegraph").
 *
 *  7. modelByPath — add:
 *       // Stage N2 SHADOW — pro ONLY, no ultra. Two independent reasons: ultra
 *       // signs its work with a corner scrawl on text-magnet paths (measured on
 *       // three bots this run including SteamBot's own airship-female), and
 *       // ultra reverts to a golden-hour exterior on any path whose identity is
 *       // a lighting condition (playbook 6) — this path's is warm lamp against
 *       // cold sky.
 *       'rooftop-telegraph': ['black-forest-labs/flux-1.1-pro'],
 *
 *  8. shadowPaths — add (it currently reads `['brass-glasshouse']`):
 *       shadowPaths: ['brass-glasshouse', 'rooftop-telegraph'],
 *
 *  9. chaos.skipPaths — add:
 *       'rooftop-telegraph', // Stage N2 SHADOW — GEOMETRY_CHAOS scrambles the
 *       // lattice and FRAMING_CHAOS splits the focal plane on a path whose
 *       // premise is one continuous shot across a plane
 *
 * 10. twoPassPolish.skipPaths — add:
 *       'rooftop-telegraph', // Stage N2 SHADOW — Haiku compression strips the
 *       // crop, crosswise and blade-state clauses the path is built on
 *
 * 11. sensoryAnchors.skipPaths — THIS KEY DOES NOT EXIST ON STEAMBOT YET, so add
 *     it inside the sensoryAnchors block:
 *       skipPaths: ['rooftop-telegraph'], // Stage N2 SHADOW — see below
 *     Reason, measured: `requiredChannels: ['lightcolor']` puts a lightcolor
 *     anchor on EVERY SteamBot render, appended AFTER the output order, and 47
 *     of the 100 entries in `sensory_scene_lightcolor` name an INTERIOR surface
 *     ("amber gaslamp wash spilling across polished mahogany wall panels",
 *     "blood-velvet-red key stabbing from the furnace observation porthole"),
 *     with 49 warm-coded. On a rooftop that is both a setting contradiction and
 *     a second, conflicting light instruction fighting the axis that owns the
 *     palette. `skipPaths` is honoured at sensoryAnchors.js:152. All three QA
 *     rounds ran with it skipped, so keeping it is the faithful xerox.
 *
 * 12. sensoryAnchors.pathContext — optional, self-documenting only (the resolver
 *     already defaults an unlisted path to 'scene', and it is skipped anyway):
 *       'rooftop-telegraph': 'scene', // Stage N2 SHADOW
 *
 * Nothing else. pools.js, archetypes.js and archetype-templates.js are all
 * untouched (this file loads its own seven seeds), vibes fall through to the
 * bot-wide ['cinematic'] lock, and no promptPrefixByPath entry is wanted (the
 * wrapper-strip lesson). Going live later = move the string from shadowPaths[]
 * into paths[] and change NOTHING else (the faithful-xerox rule).
 *
 * ── WORTH CONSIDERING BOT-WIDE, KEVIN'S CALL, NOT PART OF THIS MERGE ─────────
 * The clock-face prior traced here is the SAME residual brass-glasshouse
 * reported, now measured on a second path with a controlled swap. Two SteamBot
 * paths have each independently paid renders for `promptPrefixByMedium
 * .steambot_neutral`'s "clockwork machinery" and `STEAMBOT_NEUTRAL_STYLE`'s
 * "exposed gears / glass gauges / impossible clockwork engineering". Every
 * SteamBot path except `clocktower-heart` is one where a readable clock is
 * off-premise. Editing those two shared strings would touch all 17 live paths,
 * so it is not something a path build should do — but the evidence now exists
 * for it, and the per-path medium above is the safe version of the same fix.
 */
