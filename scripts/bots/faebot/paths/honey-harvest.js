/**
 * FaeBot honey-harvest path (2026-09-23) — FaeBot's FIRST FOOD / FORAGING
 * register and its FIRST HEIST. The path where the fae want something, it
 * belongs to somebody else, and that somebody can fight back.
 *
 * THE SOUL OF THE PATH:
 *   High up a great tree, a wild bees' nest: pale honeycomb hanging in
 *   overlapping sheets from the underside of a limb thicker than a fae is
 *   tall, each sheet taller than the fae herself, the sealed cups burning
 *   molten gold from inside because wax and honey are TRANSLUCENT and the sun
 *   is behind them. ONE grown fae is painted large and near, dressed by
 *   somebody who knew the job — a hood tied under the chin, mitts to the
 *   elbow, a waxed-leaf apron already gone sticky — swinging in on a
 *   grass-cord line with a smouldering bundle of moss held out at arm's
 *   length. Forty or four hundred bees, every one of them about as long as
 *   her hand, stream round her like weather. Honey pours off a broken edge
 *   thick and slow into a cupped snail shell. Somebody further back is being
 *   held by the ankles so she can reach. A woodpecker watches the whole
 *   business with open professional interest.
 *
 * WHY IT EXISTS (the gap, audited across all 28 existing FaeBot paths and
 *   every FaeBot seed file, not assumed):
 *   1. NO FOOD AND NO FORAGING. FaeBot's paths are ~9 character/portrait, ~8
 *      settlement/architecture, 4 crowd, 1 vista, 1 court, 1 frost-court, 1
 *      spirit-beasts, 1 interior shop, 1 boat race, 1 night sky. Fae are shown
 *      living, trading, dancing, ruling, racing and thinking — never GETTING
 *      something to eat. Nothing in this world has ever been shown being
 *      gathered from the wild.
 *   2. NO HEIST. Nothing in FaeBot has an OPPONENT. acorn-boat-regatta is the
 *      only path where something can go wrong, and what goes wrong there is
 *      weather and water. Here the picture contains forty furious owners.
 *   3. AND THE BEES ARE GENUINELY ABSENT. Grepped every FaeBot seed and path
 *      file: `hive` appears once and it is "shivers" matching; `bees` appears
 *      only as decoration ("a constellation of tiny bees orbiting her crown")
 *      or as market goods ("beeswax tapers"); `honeycomb` appears 30 times and
 *      29 of them are a PATTERN metaphor ("hollow-log burrows honeycomb the
 *      hillside", "amber honeycomb light across the cobbles"). One
 *      goblin-market stall sells comb-sections. No FaeBot picture has ever
 *      contained a bee's nest.
 *
 * FUNCTION-FORM + SELF-CONTAINED (the mushroom-apothecary / regatta /
 *   star-charting pattern): this file loads its own seven seed JSONs and
 *   inlines its whole brief. It touches no shared bot file — no pools.js
 *   entry, no archetypes.js entry, no archetype-templates.js entry.
 *   Registration is the block at the bottom of this file.
 *
 * 7 AXES (6 always-on + 1 gated onlooker at 0.5):
 *   - nest_site      the HERO: the WOODY PARENT and its mass, where the wax is
 *                    fixed, the footing, and the drop as one thin band. Leads,
 *                    because the kind of thing the site is decides the frame.
 *   - comb         ★ the wax as SHAPE and TRANSLUCENCY — the material money
 *                    shot, and the thing nobody has been shown at this size.
 *   - bee_presence ★ the OPPONENT: a stated count, a welded ruler, no detail
 *                    exemption, and what the mass is doing about the intrusion.
 *   - harvest_moment ★ the beat happening NOW, at output-order position 3,
 *                    naming its ACTOR. This is where the heist lives.
 *   - harvester      the ONE large near fae: adult body plan, real costume,
 *                    ears, hair, wings. Appearance and costume ONLY.
 *   - honey_light  ★ owns the palette: a committed DIRECTION, what the light
 *                    passes THROUGH, and two named saturated colours.
 *   - onlooker       (0.5 gate) the second little story, smaller and further
 *                    back. Comedy.
 *
 *   `charm` is deliberately NOT an eighth axis. Kevin's suggested spine had
 *   one, but mushroom-apothecary proved a CHARM LAW written into every content
 *   pool is stronger than a slot, and playbook 43 says the lever on an
 *   over-long prompt is deleting output-order ITEMS. So charm is a law inside
 *   all six content pools and costs no position in the order. Same reasoning
 *   retired star-charting's `air` axis here: seven picks, eight order items.
 *
 * ⭐ THE SCALE LADDER — the single most important design decision in the build,
 *   and it is a DELIBERATE DEPARTURE from the FarmBot bee measurement, recorded
 *   here so nobody "fixes" it downward.
 *   FarmBot apiary-beekeeping is a HUMAN-scale path: beside a person a correct
 *   honeybee is a speck, so a hand-sized bee is a hard defect. This path is
 *   FAE-scale. A fae is the size of a mouse (~70mm); a honeybee is ~12mm. So a
 *   physically CORRECT bee here is about as long as the fae's own hand — a
 *   large, furry, characterful animal, an opponent she could look in the eye.
 *   That is not the giant-insect defect, it is the premise, and it is the best
 *   thing in the path. What transfers from FarmBot is the MECHANISM, and all
 *   four parts are encoded in the pools and in law 4 below:
 *     (a) SIZE TRACKS THE COUNT. "Three bees, each no bigger than a fingernail"
 *         gave BIRD-SIZED bees; "about a dozen" and "eighty or more" gave
 *         correct ones. A low count IS the giant-insect generator, because Flux
 *         gives each named subject a share of the frame. Pool floor: FORTY.
 *     (b) THE RULER IS WELDED. An off-camera ruler buys nothing and a
 *         free-floating in-frame one inflates too ("no bigger than a clover
 *         floret" produced a fist-sized clover AND bird-sized bees). This path
 *         has exactly two legal rulers, both welded: the fae's own hand, and
 *         two of the little wax cups across.
 *     (c) ⭐ NO BEE GETS A DETAIL EXEMPTION. Measured 2026-09-23: 20 of 30
 *         apiary entries stated a dozen-plus AND welded a ruler and then added
 *         "the nearest showing a furry amber-and-umber thorax and banded
 *         abdomen" — and the anatomical detail beat the ruler every time.
 *         Stripping it took giant bees 3 of 5 → 0 of 6 and the batch 3.86 →
 *         4.37. The REASON is stated in law 4 so it survives editing.
 *     (d) A WILD NEST IS SHEETS, NEVER A BALL. "A dense rounded mass hanging
 *         from a branch" is a WASP NEST to Flux. Every layer here says
 *         overlapping flat sheets in layers with wavy hems.
 *   The whole ladder, which is physically honest and makes the nest monumental:
 *     fae = the size of a mouse · one bee = as long as her HAND · one wax cup =
 *     as wide as her FINGERTIP · one hanging sheet = TALLER THAN SHE IS · the
 *     limb it hangs from = THICKER THAN SHE IS TALL, running out of frame.
 *
 * THE FOUR OTHER TRAPS THIS PATH IS BUILT AGAINST:
 *   1. THE NAKED-PUTTO PRIOR, and it has already cost this bot a whole path.
 *      acorn-boat-regatta got 5 of 6 final-round renders back as UNCLOTHED,
 *      WINGLESS, FACELESS CHERUB DOLLS against a prompt that named petal-silk
 *      tunics, pointed ears and iridescent wings in every single one. "Tiny"
 *      and "palm-sized" on a humanoid ARE the prior, and at 1-2% of frame there
 *      is no resolution for cloth. star-charting beat it 0 of 26 with exactly
 *      the fix reused here: ONE fae LARGE and NEAR, ADULT proportions stated as
 *      BODY PLAN and never as an age word, a real layered costume, ears and
 *      wings named, and the words tiny / little / palm-sized / doll / child /
 *      bare banned from the figure. It sits in the PROMPT PREFIX, in template
 *      law 1, and at output-order position 2 — and playbook 34 is the reason it
 *      is NOT demoted to buy room for anything else: a measured round that did
 *      exactly that lost wings in 4 of 6, ears in 5 of 6 and the costume in 3
 *      of 6.
 *      ⚠️ This is also why the path allows AT MOST a second large near fae (in
 *      the moment axis) and never a crowd of small ones: a crowd of small
 *      winged humanoids is the regatta failure by construction.
 *   2. A HIGH PLACE IS THE PUREST VISTA PRIOR IN FANTASY ILLUSTRATION, and the
 *      crop clause does NOT beat it — measured on star-charting, where the crop
 *      law reached 6 of 6 prompts every round and rendered in roughly 6 of 22.
 *      What decides it is WHAT KIND OF THING the site is, and the parent must
 *      be WOODY. So the wax is never called "a nest" (a nest is a
 *      self-contained detachable object, the bad class, and renders as that
 *      whole object seen from outside with the figures shrunk to passengers);
 *      it hangs off a limb / a split / a burl / a hole / a fallen flank — a
 *      feature of something too big to fit — and every rock word is banned from
 *      every pool. Stated in three places that reach Flux (the prefix, law 2,
 *      output-order item 1), the form that took corridors to 0 of 20 on
 *      PixelBot floating-market-canal.
 *   3. THE JARGON TRAP, and on this path it is severe because the whole
 *      vocabulary of beekeeping is CORRECT and therefore tempting. Layperson
 *      check run on the path's own title first (playbook 47): "harvest" is a
 *      wheat field or a white-suited human; "hive" and "skep" are KEPT bees,
 *      i.e. the exact opposite of a wild nest and FarmBot's territory; "comb"
 *      bare is A HAIR COMB, and this bot's own frost-court pool uses "combs"
 *      for hair ornaments; "beeswax" bare is a CANDLE, and this bot's market
 *      pools are full of beeswax tapers; "frame" is a picture frame; "super" is
 *      superior; "smoker" is a person smoking; "drone" is AN AIRCRAFT; "queen"
 *      is a human monarch and this bot already has a queen path; "cell" is a
 *      prison cell; "cap" bare is a hat or, on a mushroom-heavy bot, a mushroom
 *      cap. Every one is banned in the gen recipes and swept out of the
 *      generated pools. The Flux-facing nouns are HONEYCOMB (whose layperson
 *      image — a golden six-sided wax slab running with honey — is exactly
 *      right), "pale wax", and "honey".
 *   4. READABLE TEXT — low risk here, handled by deletion rather than
 *      description. There are no signs, labels or charts in this world, and the
 *      one live risk is that Flux's strongest prior for "honey" is a
 *      SUPERMARKET JAR WITH A PAPER LABEL. The whole jar / bottle / label / tag
 *      class is deleted from every layer (playbook 12: naming a text-shaped
 *      noun adds it, calling it "blank" subtracts nothing), and honey is
 *      carried only in fae vessels — a snail shell, an acorn cup, a half
 *      nutshell, a folded-leaf pail. Per playbook 26 every flat surface
 *      positively CARRIES something rather than being called plain.
 *
 * CROSS-AXIS DESIGN (playbook 16 — a prose compatibility clause loses to a
 *   pool pick, so make it structural). `harvest_moment` is written
 *   SITE-NEUTRAL: a beat may refer only to the fae's own bodies, "the wax" and
 *   "the honey" as unnamed-shape things, the bees, the woody surface underfoot,
 *   its rim, the drop beyond it, the smoke, and a generically-named vessel. It
 *   may never name a specific tree part, a garment, a colour or a light. Since
 *   every nest_site supplies a woody surface + a footing + a rim + a drop +
 *   hanging wax BY CONSTRUCTION, all 25 beats are valid against all 25 sites
 *   with no tag filter. Verified by a pool sweep and a local brief dry-run over
 *   40 composed briefs, not by prose.
 *
 * GENDER: the template is deliberately PRONOUN-FREE ("the fae"), and each
 *   harvester entry carries its own gender through its pronoun, build, face and
 *   hair. The gender-lock lesson only bites when a hard-gendered TEMPLATE
 *   fights mixed seeds, so this needs no separate male path.
 *
 * ⭐⭐⭐ ROUND LOG (3 rounds × 6 shadow renders, graded against Kevin's motto).
 *   R1 avg ~3.28 — baseline. Everything designed-for landed FIRST TIME except
 *     one thing. WON: delivery 6/6, the NAKED-PUTTO TRAP BEATEN (adult +
 *     fully clothed 5 of 5 present figures, zero cherubs — the regatta's 5-of-6
 *     failure simply gone), BEE SCALE CORRECT 6/6 with zero giant bees, and the
 *     honeycomb with real six-sided cups in 3 of 6, which is a picture nobody
 *     has been shown. LOST: **the beat rendered 0 of 6.** All six prompts
 *     carried a vivid actor-named beat ("whole body arched back peeling a wax
 *     lid free", "one boot mired fast in spilt honey, hauling her own leg with
 *     both hands") and every render came back as a serene hooded fae standing,
 *     floating or reclining. FaeBot's own shared-blocks.js header names this
 *     collapse by name: "small cloaked figure in vast landscape".
 *   R2 avg ~2.6 — REGRESSION, variable REJECTED and reverted. The diagnosis
 *     was numeric: the beat clause sat at **48-58% of the emitted prompt in 6
 *     of 6**, which is exactly SteamBot rooftop-telegraph's measured dead zone
 *     (a word at 45-51% rendered 0/6 while one at 25% rendered 6/6). So I
 *     merged the fae and the beat into one action-first order item AND shortened
 *     order item 1 to buy the attended budget. The merge was right and was kept;
 *     shortening item 1 was WRONG — it took the crop law ("one thin band of far
 *     canopy below") out of the attended region and the vista prior came
 *     straight back, giving the purest "tiny cloaked figure in a vast misty
 *     forest" frames of the whole build. Item 1's full crop clause restored.
 *   R2b, the MODEL PROBE mandated by playbook 33 (a stated, correctly-ordered,
 *     seed-reinforced element that renders 0 times is a MODEL fact) — and it
 *     came back split. **flux-2-pro, identical prompts and pools: the beat
 *     rendered 2 of 4, the six-sided cups 4 of 4, a real designed working
 *     costume 4 of 4.** So flux-2 CAN see this path and flux-1.1-pro's
 *     indifference to a small hand-action is real (star-charting measured the
 *     same model discarding its hand-instrument 0 of 22). But it is
 *     UNSHIPPABLE: it signed 4 of 4 renders, and delivery took 20 Replicate
 *     safety retries for 4 deliveries. **flux-2-flex was then probed and hits
 *     the IDENTICAL E005 wall (1 hard failure in 2 attempts, 200 s and many
 *     retries for the one that landed) — so the E005 on this content is a
 *     flux-2 FAMILY fact, not a flux-2-pro fact.** That settles star-charting's
 *     open question one level up and closes the flux-2 option for this path.
 *   R3 avg ~4.2 (min 3.6, best 4.5 ×2) — **ONE VARIABLE: the first eight words
 *     of the prompt prefix.** The prefix had opened on a STATIC PORTRAIT
 *     instruction — "one slender grown fae close in the foreground, painted
 *     large, in a layered fae-craft coat and hood with open wings" — which is
 *     a description of a posed, dressed, winged figure, and CLIP rendered
 *     exactly that. Putting an ACTION in front of it, additively, with every
 *     putto token preserved ("one slender grown fae HARD AT WORK, CAUGHT
 *     MID-MOVEMENT WITH HER WHOLE BODY COMMITTED, painted large and close in
 *     the foreground, in a layered fae-craft coat and hood with open wings…")
 *     took **the beat 0 of 6 → 6 of 6** with nothing lost: adult 6/6, fully
 *     clothed 6/6, zero putto, bee scale correct 6/6, zero readable text.
 *     R3 draws: a fae at full stretch climbing a trunk with one arm reaching
 *     into a glowing hexagonal wall of comb, a swarm streaming past her; a fae
 *     braced across a chasm with both hands buried in the wax at 65% of frame
 *     height; a fae crouched at five stacked tiers of layered sheets with wavy
 *     dripping hems, both hands on them; a fae striding out along a limb with
 *     her arms flung wide under a ceiling of gold.
 *
 *   ⭐ THE REUSABLE LESSON, and it cost this build two rounds: **AN
 *   OUTPUT-ORDER POSITION IS NOT A PROMPT POSITION.** I put the beat at
 *   output-order item 3 of 8 and recorded it as "the best attended slot",
 *   because playbook 22 says the order is what ships a law. It does ship it —
 *   but items 1 and 2 were verbose, so item 3's TEXT landed at 48-58% of the
 *   emitted prompt, i.e. in playbook 43's dead zone. Measure where a clause
 *   actually lands in `uploads.ai_prompt` as a PERCENTAGE; never infer it from
 *   its rank in the order list. And the cheapest lever on a beat that will not
 *   render is not the order at all — it is the PREFIX, whose first tokens are
 *   the only position CLIP cannot ignore. A prefix that describes a POSE will
 *   get you a pose; the same prefix with a verb in front gets you the verb.
 *   (Sibling evidence nobody had connected: star-charting's prefix has the same
 *   static-portrait shape and its POSE axis rendered about 3 of 22.)
 *
 * MODEL: flux-1.1-pro, and the reasoning is measured rather than default.
 *   FaeBot's own numbers: flux-1.1-pro is 23 of 23 delivered on this bot with
 *   zero Replicate E005, while flux-2-pro delivered only 3 of 13 on
 *   star-charting (77% E005) — and the two paths in the whole fleet that
 *   trigger flux-2's classifier are precisely the two that combine a CLOSE
 *   HUMANOID BODY with, in apiary's case, close-range hands among bee swarms.
 *   This path has both, so flux-2-pro is the highest-risk delivery bet
 *   available and is NOT the round-0 pin. flux-1.1-pro-ultra is excluded: it
 *   signed 3 of 15 apothecary renders and 1 of 3 regatta renders, and a
 *   signature is readable text. IF a premise element renders 0 of 6, playbook
 *   33 says probe a model before round 2 rather than iterate the prompt — the
 *   probe order for this path is flux-2-flex then flux-2-max (both cheaper on
 *   the classifier than flux-2-pro has proven here).
 *
 * Config: FaeBot's default medium (painted_fantasy_novel — a 5-word shared
 *   fragment, so playbook 37's shared-fragment trap does not apply on this
 *   bot). chaos + sensoryAnchors are off bot-wide. twoPassPolish MUST skip this
 *   path: the one-large-fae law, the scale law and the framing law are all
 *   load-bearing and Haiku compression strips them. nudityCheck MUST include
 *   this path — it is the trap-1 backstop and it fired on the regatta.
 *   sharedDNA.colorPalette is deliberately unused: honey_light owns the palette
 *   and a fixed vibe colour-cast would override the rolled light.
 */

const fs = require('fs');
const nodePath = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(nodePath.join(__dirname, '..', 'seeds', `${name}.json`), 'utf8')
  );
}

const NEST_SITE = load('faebot_honey_nest_site');
const COMB = load('faebot_honey_comb');
const BEE_PRESENCE = load('faebot_honey_bee_presence');
const MOMENT = load('faebot_honey_moment');
const HARVESTER = load('faebot_honey_harvester');
const HONEY_LIGHT = load('faebot_honey_light');
const ONLOOKER = load('faebot_honey_onlooker');

const ONLOOKER_GATE = 0.5;

module.exports = ({ vibeDirective, picker }) => {
  const site = picker.pickWithRecency(NEST_SITE, 'honey_nest_site');
  const comb = picker.pickWithRecency(COMB, 'honey_comb');
  const bees = picker.pickWithRecency(BEE_PRESENCE, 'honey_bee_presence');
  const moment = picker.pickWithRecency(MOMENT, 'honey_moment');
  const harvester = picker.pickWithRecency(HARVESTER, 'honey_harvester');
  const light = picker.pickWithRecency(HONEY_LIGHT, 'honey_light');
  const onlooker =
    Math.random() < ONLOOKER_GATE ? picker.pickWithRecency(ONLOOKER, 'honey_onlooker') : null;

  const onlookerSection = onlooker
    ? `
━━━ THE OTHERS (smaller and further back — the near fae stays the hero) ━━━
${onlooker}
`
    : `
━━━ THE OTHERS ━━━
This one is hers alone: her own line tied off, her own smoke drifting, and the whole nest in front of her.
`;

  return `You are a fantasy concept-art painter writing ONE short Flux prompt for a grown fae emptying a wild bees' nest high in a great forest tree, in FaeBot's soft painted-fantasy register (Manchess + Giancola + Bonner + Froud painted-fantasy lineage). A timeless fae world where everything in frame was made by hand from what the woodland gave.

━━━ THE FIVE LAWS OF THIS PICTURE ━━━
1. ONE FAE, LARGE AND NEAR, AND SHE IS IN THE MIDDLE OF DOING SOMETHING. Close in the foreground, painted BIG at a third of the picture's height: a grown adult's long limbs and real face, hair, pointed ears, open wings, a layered fae-craft coat or hood covering her — and her whole body committed to the action, never standing and looking. The action and the costume are ONE phrase, action first.
2. THE WAX HANGS OFF SOMETHING TOO BIG TO FIT IN FRAME. A limb, trunk, burl or split of WOOD fills one side and runs out of frame; pale honeycomb hangs from it in overlapping flat sheets, layer behind layer, each sheet taller than the fae herself.
3. WAX AND HONEY ARE TRANSLUCENT AND THE LIGHT COMES THROUGH THEM — one committed direction, the sealed cups burning molten gold from inside, the empty ones milky cream, TWO named saturated colours in hard opposition.
4. MANY BEES, EVERY ONE THE SAME SIZE. Forty or more, stated as a real number; each about as long as the fae's own hand, or two of the little six-sided wax cups across. Every bee is the same small clean furred shape, INCLUDING the nearest — no single bee gets its own close-up, anatomy or markings, because the one you describe most is the one that comes out biggest.
5. IT IS A THEFT AT HEIGHT. Effort, haste, nerve, comedy — plus one clever thing the eye finds on second look.

Everything below is NOTES, longer than your prompt. Take from each only what fits.

━━━ WHERE THE BEES LIVE (the hero — its woody mass runs out of frame) ━━━
${site}

★━━━ WHAT IS HAPPENING RIGHT NOW (goes in your SECOND phrase, before the costume) ━━━
${moment}

━━━ THE FAE DOING IT (painted large and near) ━━━
${harvester}

★━━━ THE WAX UP CLOSE ━━━
${comb}

★━━━ THE BEES (a stated count, one welded ruler, every one the same size) ━━━
${bees}

★━━━ THE LIGHT (the money shot — it owns the whole palette) ━━━
${light}
${onlookerSection}
━━━ THIS WORLD'S OWN WORDS ━━━
Pale honeycomb in overlapping sheets, the little six-sided wax cups on its face, a skin of paler wax over the full ones, a broken slab pouring honey out thick and slow, a snail shell or acorn cup to carry it in, a smouldering bundle of dry moss on a twig trailing white smoke, a broad leaf held up as a shield, a grass-cord line tied off round a twig.

━━━ MOOD ━━━
${vibeDirective ? String(vibeDirective).slice(0, 90) : ''} — colour the feeling only; the fae stays large, the light stays committed and the bees stay many.

━━━ LENGTH IS THE FIRST RULE — 110-140 WORDS, COUNT THEM ━━━
Your whole prompt is SHORTER than any one section above. Name each thing in three or four words and move on. Write comma-separated phrases in THIS order and then STOP:
[name it plainly, with the woody limb or trunk filling one side and running out of frame, pale honeycomb hanging under it in overlapping sheets, and one thin band of far canopy below],
[ONE grown fae close and LARGE in the foreground, CAUGHT MID-ACTION — say what her whole body is doing right now FIRST, then the layered fae-craft coat or hood and its colours, her hair, pointed ears and open wings, all in this one phrase],
[the wax up close: the sheets in layers, the little six-sided cups, the pale skin over the full ones, and where the honey is getting out],
[the bees: a stated count of forty or more, each about as long as the fae's hand, every one the same small clean shape, and what the mass is doing],
[what the light is doing coming THROUGH the wax and the honey, and its two saturated colours],${onlooker ? '\n[the others, smaller and further back],' : ''}
[one thin band of far canopy below, soft painted-fantasy oil-brushwork].

If it will not all fit, the large near fae MID-ACTION, the hanging sheets on their woody parent, and the light through the wax are the ones that must survive. Describe only what IS present — every phrase names something in the picture, never something absent. No preamble, no headers, no bullets, no bold labels.`;
};

/*
 * ── REGISTRATION (merge into scripts/bots/faebot/index.js) ───────────────────
 *
 *  1. pathBuilders:
 *       'honey-harvest': require('./paths/honey-harvest'),
 *  2. shadowPaths — add:
 *       'honey-harvest',
 *  3. twoPassPolish.skipPaths — add:
 *       'honey-harvest',
 *  4. nudityCheck.paths — add:
 *       'honey-harvest',
 *  5. promptPrefixByPath — add. The first tokens CLIP reads, and the order is
 *     MEASURED, not stylistic: the FAE comes first because she is the trap this
 *     path is most likely to fail (the regatta lost 5 of 6 renders to the
 *     naked-putto prior and star-charting beat it 0 of 26 with a front-loaded
 *     adult-clothed-winged anchor). Then the WOODY PARENT as the near frame,
 *     which is the anti-vista crop. Then the WAX and the bees, still inside the
 *     first third where CLIP's attention budget lives.
 *     ⚠️ DO NOT DEMOTE THE FAE CLAUSE to buy room for anything else — playbook
 *     34 measured exactly that trade on the sibling path and it lost wings in 4
 *     of 6, pointed ears in 5 of 6 and the costume in 3 of 6.
 *     ⚠️⚠️ AND THE FIRST EIGHT WORDS ARE THE PATH. "hard at work, caught
 *     mid-movement with her whole body committed" is THE fix of this build and
 *     it is measured: with the prefix opening on a STATIC portrait the beat
 *     rendered 0 of 12 over two rounds; with those words in front of "slender
 *     grown fae" it rendered 6 of 6. Nothing was traded away to buy them — see
 *     the round log in the header. Do not "tidy" them out.
 *       'honey-harvest':
 *         'one slender grown fae hard at work, caught mid-movement with her whole body committed, painted large and close in the foreground, in a layered fae-craft coat and hood with open wings, on a great tree limb that fills one side of the picture and runs out of frame, pale honeycomb hanging under it in overlapping sheets with gold honey lit through them, forty small bees around her',
 *  6. modelByPath — add. flux-1.1-pro ONLY, and the reasoning is measured:
 *     • flux-1.1-pro is 23 of 23 delivered on FaeBot with zero Replicate E005.
 *     • flux-1.1-pro-ultra is excluded — it signed 3 of 15 mushroom-apothecary
 *       renders and 1 of 3 acorn-boat-regatta renders, and a painted signature
 *       is readable text, a hard fail on the rubric.
 *     • flux-2-pro is deliberately NOT the pin even though it is the model that
 *       rescued star-charting's premise object. Its classifier delivered 3 of
 *       13 on star-charting (77% E005) and 3 of 26 on FarmBot apiary — and
 *       those are the only two paths in 1,192 flux-2 runs that trigger it at
 *       all. What they share is a CLOSE HUMANOID BODY plus, on apiary,
 *       close-range hands among bee swarms. This path has both. Fine as a
 *       round-2 probe, wrong as a round-0 default.
 *       'honey-harvest': { 'black-forest-labs/flux-1.1-pro': 1 },
 *     MEASURED THIS BUILD, so nobody re-runs it: flux-2-pro renders the premise
 *     better (beat 2/4, cups 4/4) and is unshippable — it signed 4 of 4 and
 *     needed 20 safety retries for 4 deliveries; flux-2-flex hits the SAME E005
 *     wall (1 hard fail in 2), so this is a flux-2 FAMILY fact on this content.
 *     flux-1.1-pro is 12 of 12 delivered on this path with zero signatures.
 *
 * RESIDUAL (one defect, and the lever is named): the SIX-SIDED CUPS reached 6 of
 *   6 emitted prompts in R3 and rendered in only 2 of 6 — the other four came
 *   back as beautiful abstract gold curtains and stalactites. flux-1.1-pro's
 *   honey prior is "glowing amber drip", and the cups appear only when the
 *   rolled `comb` entry LEADS with the sheet's geometry ("seven pale sheets
 *   hanging in overlapping layers, their faces crowded with small six-sided
 *   cups") rather than with the honey's behaviour ("its torn edge pouring honey
 *   out thick and slow"). So the lever is the `comb` pool as a SET, not the
 *   template: require every entry's FIRST noun phrase to be the sheet plus its
 *   cups, and demote every honey-in-motion clause to the entry's tail. That is
 *   playbook 4 (a hero entry must LEAD with the hero's defining mass) applied
 *   inside this one pool, and playbook 35's "audit the pool as a SET and delete
 *   the offending class rather than adding words". Second, smaller: the drop
 *   below still opens into a misty forest distance in about 3 of 6 — the thin-
 *   band clause holds the bottom border but the SIDE of the frame leaks, so the
 *   `nest_site` entries would need leaves or a second trunk named as closing the
 *   open side.
 *
 * ALSO MEASURED, worth keeping: the welded bee ruler reached only 2 of 6 emitted
 *   prompts (Sonnet drops it) and bee scale was still correct 6 of 6 — because
 *   the STATED COUNT, which reached 6 of 6, is the load-bearing half. Clean
 *   confirmation of the FarmBot finding that size tracks the count, not the
 *   size word, and evidence that the ruler is the secondary belt to its braces.
 *
 * Nothing else is required: pools.js is untouched (this file loads its own
 * seeds), chaos + sensoryAnchors are disabled bot-wide, the medium falls
 * through to defaultMedium `painted_fantasy_novel`, and no promptSuffixByPath
 * entry is needed — FaeBot's bot-wide suffix ("dreamy dappled light", "green-
 * mana lineage") is register-correct for a sunlit canopy, and deep canopy green
 * is the COMPLEMENT of this path's gold, which makes the honey pop rather than
 * fighting it. (If a future round shows the honey reading green or muddy, or a
 * watermark appears — the bot-wide suffix ends "no text, no watermarks", a
 * negation the regatta measured rendering an actual stock-photo URL in 2 of 24
 * — a path-scoped promptSuffixByPath is the lever, on the star-charting
 * precedent.) Going live later = move the string from shadowPaths[] into
 * paths[].
 */
