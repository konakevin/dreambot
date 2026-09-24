/**
 * FaeBot star-charting path (2026-09-22) — FaeBot's FIRST KNOWLEDGE register,
 * its first path where the NIGHT SKY is the hero rather than the backdrop, and
 * the designed test of the fix acorn-boat-regatta identified and never ran.
 *
 * THE SOUL OF THE PATH:
 *   High up in a great forest, on a mushroom cap or a fork of oak or a shelf
 *   of lichened rock, ONE grown fae is painted large and near, wrapped against
 *   the cold in a coat somebody made for her, reading a sky that is the most
 *   colourful thing in the picture — a green-and-violet aurora, a banded river
 *   of gold and blue-white, a comet with a split tail, a moon just up and
 *   apricot and enormous. And the thing she reads it WITH is the delight: no
 *   brass instrument, no writing of any kind, but a pad of moss crowded with
 *   pins and coloured threads strung between them, or eleven beads slid to
 *   eleven heights on upright grass cords, or a leaf pricked full of holes and
 *   held up to the moon, or a cupped dish of water with the whole sky doubled
 *   in it so the stars lie underfoot. One warm little shielded light — a
 *   firefly in a walnut shell under a leaf hood, set down BEHIND the work so it
 *   spares her night sight — is the single warm thing in a cold frame.
 *
 * WHY IT EXISTS (the gap, audited across all 27 existing FaeBot paths):
 *   Two holes, both verified rather than assumed.
 *   1. NO NIGHT-SKY REGISTER. Three goblin-market paths are night paths, but
 *      the night there is a warm enclosed lantern-lit BAZAAR with no sky in
 *      frame at all. forest-fairy-scene and fae-village carry "moonlit" as one
 *      roll on a time-of-day axis where the forest stays the subject. Grepped
 *      across every path and seed file: "constellation" appears 368 times and
 *      "aurora" 81, and every single one is a METAPHOR — constellation-glow
 *      under a dryad's skin, aurora-coloured wings at the frost court. The
 *      literal sky has never been the subject of a FaeBot picture.
 *   2. NO CRAFT OF THE MIND. FaeBot's 27 paths are ~9 character/portrait, ~8
 *      settlement, 4 crowd, 1 vista, 1 court, 1 frost-court, 1 spirit-beasts,
 *      1 interior shop and 1 race. Fae are shown living, trading, dancing,
 *      ruling and racing — never THINKING. Nobody in this world has ever been
 *      shown measuring something, working something out, or getting it wrong.
 *
 * FUNCTION-FORM + SELF-CONTAINED (the mushroom-apothecary / acorn-boat-regatta
 *   pattern): this file loads its own eight seed JSONs and inlines its whole
 *   brief. It touches no shared bot file — no pools.js entry, no archetypes.js
 *   entry, no archetype-templates.js entry. Registration is the block at the
 *   bottom of this file.
 *
 * 8 AXES (7 always-on + 1 gated company at 0.6):
 *   - astronomer     the ONE fae painted LARGE and NEAR: adult body plan, a
 *                    real designed costume, ears, hair, wings. Leads, because
 *                    she is the element this path exists to prove.
 *   - sighting_pose  ★ the PLAYFUL axis: what her body is doing right now.
 *                    Written VENUE- and TOOL-NEUTRAL (see the cross-axis note).
 *   - sky_event      ★ the money shot: ONE committed dramatic sky, TWO named
 *                    saturated colours. Owns the whole palette.
 *   - vantage        the high perch as a STAGE, written CLOSE AND CROPPED.
 *   - reading_tool   ★ the CLEVER axis: the text-free pictorial instrument.
 *   - warm_light     the one shielded practical light, and the surface it warms.
 *   - company        (0.6 gate) the others, smaller and further back. Comedy.
 *   - air            what the night air is doing (axis-clean: air only).
 *
 *   `charm` is deliberately NOT a ninth axis. Kevin's spine suggested one, but
 *   the apothecary proved a CHARM LAW written into every content pool is
 *   stronger than a slot, and playbook lesson 18 says the lever that shortens
 *   an over-long prompt is deleting output-order ITEMS. So charm is a law
 *   inside vantage / reading_tool / sighting_pose / warm_light / company and
 *   costs no position in the order.
 *
 * THE FOUR TRAPS THIS PATH IS BUILT AGAINST:
 *   1. A NIGHT PATH RENDERS DIM AND MUDDY — the main risk, and the cure is not
 *      "brighter". It is three layers: the sky pool's VIVID LAW (one committed
 *      event, two named saturated colours, and the words dark / black / dim /
 *      gloomy / shadowy / faint banned from the pool), the warm_light axis
 *      (measured: a warm accent against a cold scene landed 15 of 15 on
 *      PixelBot ice-cavern), and a path-scoped `promptSuffixByPath` that
 *      replaces the bot-wide suffix's "dreamy dappled light" — a
 *      daylight-through-canopy phrase carried by all 28 FaeBot paths, named as
 *      the real fix in the apothecary's residual 7 — with night colour.
 *   2. CHARTS AND INSTRUMENTS ARE THE FLEET'S HIGHEST TEXT RISK. A surface
 *      whose SHAPE is a writing surface cannot be made safe by describing it
 *      (playbook 12: "blank" does not subtract, naming the noun adds), and the
 *      fleet's usual "one small painted picture" move is itself a signboard
 *      generator when the substrate is not guaranteed visible (playbook 23).
 *      So the whole object class is deleted from every layer — no chart, map,
 *      page, book, scroll, slate, dial, label, plaque, quill, ink, telescope,
 *      astrolabe, sextant, sundial or compass exists in this world — and the
 *      replacement is this path's own bespoke law:
 *
 *        ⭐ THE POSITION-COLOUR-COUNT LAW. Everything the fae know is shown by
 *        the POSITION, the COLOUR or the COUNT of real physical objects. A star
 *        is a pin in moss, a bead on a cord, a pebble on a stone, a pinprick in
 *        a leaf, a point doubled in water. A pattern is the SHAPE the threads
 *        make between the pins. A brightness is how TALL the pin stands. Never
 *        a picture, a symbol or a mark.
 *
 *      Per playbook 26 the anti-text form carries the interest itself: a pad of
 *      moss crowded with forty pins and their threads is the most interesting
 *      object in the frame, not a "blank board".
 *   3. "TINY" ON A HUMANOID IS A NAKED-PUTTO PRIOR. acorn-boat-regatta, same
 *      bot, same run: 5 of 6 final-round renders came back as unclothed,
 *      wingless, faceless cherub dolls against a prompt that named petal-silk
 *      tunics and iridescent wings in every one. At 1-2% of frame there is no
 *      resolution for cloth, and the words "tiny" and "palm-sized" summon the
 *      nearest famous image for a small winged person, which is a naked baby.
 *      The fix, stated there and tested here: ONE fae painted LARGE and NEAR,
 *      ADULT proportions given as BODY PLAN rather than an age word, a real
 *      layered costume, ears and wings named, and the words tiny / little /
 *      palm-sized / doll / child / bare banned from the figure entirely. The
 *      rule sits in the template's FIRST law AND in output-order position 2,
 *      because playbook 22 measured that a law appended to 25 of 25 seed
 *      entries reaches 1 of 5 prompts while the same clause in the output order
 *      reaches 5 of 5.
 *   4. THE TRAP NOBODY NAMED — A HIGH PLACE UNDER A BIG SKY IS THE PUREST
 *      VISTA PRIOR IN FANTASY ILLUSTRATION. "Small cloaked figure on a crag
 *      under stars" is the most-trained fantasy book cover there is, and
 *      FaeBot's own shared-blocks.js header records that exact collapse by
 *      name ("small cloaked figure in vast landscape"). If it fires, the fae is
 *      1% of frame and trap 3 follows automatically. So the CROP LAW is
 *      designed in from round 0 rather than discovered: every vantage entry
 *      opens with the perch's defining mass, says its own surface FILLS THE
 *      NEAR PICTURE, runs its rim out of frame, and reduces the drop to ONE
 *      THIN BAND along a border. A panorama cannot exist in that frame. Stated
 *      in three places that reach Flux — the prefix, template law 3, and
 *      output-order item 1 — which is the form that took corridors to 0 of 20
 *      on PixelBot floating-market-canal.
 *
 * CROSS-AXIS DESIGN (playbook 16 — a prose compatibility clause loses to a
 *   pool pick, so make it structural). `sighting_pose` is written VENUE-NEUTRAL
 *   and TOOL-NEUTRAL: a pose may refer only to the fae's own body, the perch's
 *   flat surface, its rim or edge, the drop beyond it, the sky, and "the work"
 *   as an unnamed thing. Since every vantage supplies a surface + a rim + a
 *   drop + open sky BY CONSTRUCTION, all 25 poses are valid against all 25
 *   perches and all 25 instruments with no tag filter needed. Verified by a
 *   pool sweep, not by prose.
 *
 * GENDER: the template is deliberately PRONOUN-FREE ("the fae"), and each
 *   astronomer entry carries its own gender through its pronoun, build, face
 *   and hair (12 women / 12 men / 1 neutral at MVP-25). The gender-lock lesson
 *   only bites when a hard-gendered TEMPLATE fights mixed seeds, so this needs
 *   no separate male path.
 *
 * ⭐⭐ THE MODEL IS THE PATH — THE BUILD'S HEADLINE FINDING (26 renders).
 *   flux-1.1-pro was pinned from round 0 on sound measured grounds (playbook
 *   lesson 6 excludes flux-1.1-pro-ultra from any path whose identity is a
 *   lighting condition; ultra also signed 3 of 15 apothecary renders and 1 of 3
 *   regatta renders). Over three rounds on flux-1.1-pro every law reached
 *   6 of 6 emitted prompts and the renders still came back as beautiful FAIRY
 *   PINUPS: the reading instrument — the whole reason this path exists —
 *   rendered 0 of 22, the warm light about 2 of 22, and the pose about 3 of 22.
 *   Not a content drop; flux-1.1-pro renders the fae and the sky and discards
 *   the small hand-object every time.
 *
 *   ⭐ RESOLVED 2026-09-24 — LIVE on flux-1.1-pro (Kevin's call; pin rolled back in
 *   faebot/index.js). The E005 attribution below IS settled now: a clause-level
 *   bisection of the exact flagged prompts found the trigger is the MEDIUM's
 *   named-artist clause ("Greg Manchess + Donato Giancola + Paul Bonner + Brian
 *   Froud painted-fantasy lineage") — alone it flags 3/3 on flux-2-pro, the full
 *   prompt without it flags 0/3, and the same text passes flux-1.1-pro and ultra
 *   13/13 each. safety_tolerance 5 changes nothing (14/15 flagged either way). It
 *   was never the body-plan vocabulary. Kevin graded the flux-1.1-pro batch as
 *   very good and did not miss the instrument; 47/47 delivered since, zero flags.
 *   The history below is kept as written.
 *
 *   Swapping ONE variable to flux-2-pro, same prompts, same pools:
 *     instrument rendered 3 of 3 (from 0 of 22) · warm light 3 of 3 (from 2 of
 *     22) · a genuine costume-designer wardrobe 3 of 3 · avg ~4.5 vs ~2.8.
 *   This is DinoBot amber-forest's finding on another bot: a MODEL PIN is
 *   load-bearing, not preference, and a premise OBJECT that renders 0 of 22 on
 *   one model can render 3 of 3 on another. So the pin ships as flux-2-pro and
 *   flux-1.1-pro is the rollback (see the registration block).
 *   TWO RESIDUALS on flux-2-pro, both measured and both named in the
 *   registration block: it SIGNS its work (2 of 3), and its flux-2-pro delivery
 *   rate collapsed to 3 of 13 attempts on Replicate E005 while flux-1.1-pro
 *   went 23 of 23 clean, including a control render submitted mid-streak.
 *   Shadow-safe, not cron-safe. The E005 attribution is NOT settled — see the
 *   registration block, the next step is a retry and not a pool edit.
 *
 * Config: FaeBot's default medium (painted_fantasy_novel).
 *   chaos + sensoryAnchors are off bot-wide. twoPassPolish MUST skip
 *   this path: the one-large-fae law, the position-colour-count law and the
 *   crop law are all load-bearing and Haiku compression strips them.
 *   nudityCheck MUST include this path — it is the trap-3 backstop and it
 *   fired on the regatta. sharedDNA.colorPalette is deliberately unused:
 *   sky_event owns the palette and a fixed vibe colour-cast would override the
 *   rolled sky, which is the whole point of the path.
 */

const fs = require('fs');
const nodePath = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(nodePath.join(__dirname, '..', 'seeds', `${name}.json`), 'utf8')
  );
}

const ASTRONOMER = load('faebot_starchart_astronomer');
const SIGHTING_POSE = load('faebot_starchart_sighting_pose');
const SKY_EVENT = load('faebot_starchart_sky_event');
const VANTAGE = load('faebot_starchart_vantage');
const READING_TOOL = load('faebot_starchart_reading_tool');
const WARM_LIGHT = load('faebot_starchart_warm_light');
const COMPANY = load('faebot_starchart_company');
const AIR = load('faebot_starchart_air');

const COMPANY_GATE = 0.6;

module.exports = ({ vibeDirective, picker }) => {
  const astronomer = picker.pickWithRecency(ASTRONOMER, 'starchart_astronomer');
  const pose = picker.pickWithRecency(SIGHTING_POSE, 'starchart_sighting_pose');
  const sky = picker.pickWithRecency(SKY_EVENT, 'starchart_sky_event');
  const vantage = picker.pickWithRecency(VANTAGE, 'starchart_vantage');
  const tool = picker.pickWithRecency(READING_TOOL, 'starchart_reading_tool');
  const light = picker.pickWithRecency(WARM_LIGHT, 'starchart_warm_light');
  const air = picker.pickWithRecency(AIR, 'starchart_air');
  const company =
    Math.random() < COMPANY_GATE ? picker.pickWithRecency(COMPANY, 'starchart_company') : null;

  const companySection = company
    ? `
━━━ THE OTHERS (smaller and further back — the near fae stays the hero) ━━━
${company}
`
    : `
━━━ THE OTHERS ━━━
This perch is hers alone tonight: her own work spread around her, her own light, and the whole sky to herself.
`;

  return `You are a fantasy concept-art painter writing ONE short Flux prompt for a grown fae reading the night sky from a high place in a great forest, in FaeBot's soft painted-fantasy register (Manchess + Giancola + Bonner + Froud painted-fantasy lineage). A timeless fae world where everything in frame was made by hand from what the woodland gave.

━━━ THE FIVE LAWS OF THIS PICTURE ━━━
1. ONE FAE, LARGE AND NEAR — close in the foreground, painted BIG at a third of the picture's height, at full detail: a grown adult's long limbs and real face, hair, pointed ears, open wings, and a layered fae-craft coat or cape covering her. Every fold of cloth and every feature reads clearly.
2. THE SKY IS THE MOST COLOURFUL THING IN THE FRAME. Night here is luminous: deep saturated indigo and violet with one committed dramatic event blazing across it, brighter and more saturated than anything on the ground.
3. THE PERCH IS THE FLOOR OF THE PICTURE. Its own surface fills the near frame and its rim runs out of frame at the sides. The drop beyond it is ONE THIN BAND along a border — far canopy, mist, treetops. Open sky above.
4. WHAT SHE READS THE SKY WITH IS MADE OF PINS, THREADS, BEADS, PEBBLES AND PRICKED LIGHT, and everything it tells her is held in the POSITION, COLOUR or COUNT of those real objects: a pin standing in moss for each star, a bead slid up a cord, a pebble laid on stone, a hole pricked in a leaf, a point doubled in still water. Every surface it is built on is smooth unpainted wood, stone, leaf or moss carrying only the pins and threads themselves.
5. ONE WARM LITTLE LIGHT AGAINST ALL THAT COLD COLOUR, shielded so it spares her night sight, glowing on ONE named surface — plus one clever thing the eye finds on second look.

Everything below is NOTES, longer than your prompt. Take from each only what fits.

━━━ THE FAE (painted large and near — the hero) ━━━
${astronomer}

★━━━ WHAT SHE IS DOING RIGHT NOW ━━━
${pose}

★━━━ THE SKY (the money shot — it owns the whole palette) ━━━
${sky}

━━━ THE PERCH (the floor of the picture) ━━━
${vantage}

★━━━ WHAT SHE READS IT WITH ━━━
${tool}

★━━━ THE ONE WARM LIGHT (a glow, patch, rim or streak ON a real surface) ━━━
${light}
${companySection}
━━━ THE AIR ━━━
${air}

━━━ THIS WORLD'S OWN WORDS ━━━
A pin pushed into the moss where a star stood, a bead slid up a grass cord, pebbles laid in a row and counted, a leaf pricked full of holes and held up, the whole sky doubled in a dish of water, a firefly shut in a walnut shell under a leaf hood. Everything she owns is fae-made of moss, bark, grass cord, seed, pebble, dew and beeswax.

━━━ MOOD ━━━
${vibeDirective ? String(vibeDirective).slice(0, 90) : ''} — colour the feeling only; the sky stays vivid and the fae stays large.

━━━ LENGTH IS THE FIRST RULE — 110-140 WORDS, COUNT THEM ━━━
Your whole prompt is SHORTER than any one section above. Name each thing in three or four words and move on. Write comma-separated phrases in THIS order and then STOP:
[name it plainly with the rolled sky, and the perch's own surface filling the near picture with its rim running out of frame and one thin band of far canopy below],
[ONE grown fae close and LARGE in the foreground, her layered fae-craft coat and its colours, her hair, pointed ears and open wings, her adult face],
[what her body is doing right now],
[the sky above and behind her: the one event and its two saturated colours, the most colourful thing in the picture],
[what she reads it with: its pins, threads, beads, pebbles or pricked holes on smooth unpainted wood, stone or leaf],
[the one warm shielded little light, the surface it glows on, and what the night air is doing],${company ? '\n[the others, smaller and further back],' : ''}
[soft painted-fantasy oil-brushwork].

If it will not all fit, the large near fae, the vivid sky and the perch's crop are the ones that must survive. Describe only what IS present — every phrase names something in the picture, never something absent. No preamble, no headers, no bullets, no bold labels.`;
};

/*
 * ── REGISTRATION (merge into scripts/bots/faebot/index.js) ───────────────────
 *
 *  1. pathBuilders:
 *       'star-charting': require('./paths/star-charting'),
 *  2. shadowPaths — add:
 *       'star-charting',
 *  3. twoPassPolish.skipPaths — add:
 *       'star-charting',
 *  4. nudityCheck.paths — add:
 *       'star-charting',
 *  5. promptPrefixByPath — add (the first tokens CLIP reads. Order is measured,
 *     not stylistic: the FAE comes first because she is what this path exists to
 *     prove and a foreground-first narrative is the shape that took nightly
 *     couple holds 45% -> 92%; then the PERCH as the near frame, which is the
 *     anti-vista crop; then the SKY's saturated colours, still inside the
 *     first third where CLIP's attention budget lives):
 *       'star-charting':
 *         'one slender grown fae close in the foreground, painted large, in a layered fae-craft coat and hood with open wings, on a high woodland perch whose broad surface fills the near frame, beneath a blazing saturated night sky of indigo, violet and green',
 *     (It said "FULLY CLOTHED in layered fae-craft cloth" for the first 22
 *     renders. Changed on the anti-baggage law: a clothing-STATUS assertion is
 *     a nudity-context token, and the positive form — naming the garment — is
 *     both the lawful wording and more specific to paint. Also the leading
 *     suspect for flux-2-pro's E005 rate; see item 7.)
 *  6. promptSuffixByPath — ADD THIS KEY (FaeBot has none today; it REPLACES the
 *     bot-wide promptSuffix for this path only). Two measured reasons, both
 *     path-scoped so no other FaeBot path changes:
 *       (a) the bot-wide suffix ends "dreamy dappled light ... green-mana
 *           lineage" — a daylight-through-canopy phrase plus a green-forest
 *           palette push, carried by all 28 paths and named in
 *           mushroom-apothecary's residual 7 as the real cause of a fixed warm
 *           colour cast that out-votes a per-render light axis. On a path whose
 *           identity is a saturated night sky that is the whole trap 1.
 *       (b) it also ends "no text, no watermarks" — a negation CLIP cannot
 *           process, and acorn-boat-regatta measured 2 of 24 renders coming
 *           back WITH a stock-photo watermark URL on this exact bot.
 *     Positive-only, night-coded, painted lineage preserved:
 *       promptSuffixByPath: {
 *         'star-charting':
 *           'painted fantasy concept art, soft brushwork, atmospheric night illustration, luminous saturated night colour, deep indigo and violet sky with one warm lamplight against it, Brian Froud + Mononoke painted-fantasy lineage',
 *       },
 *  7. modelByPath — SHIPPED AS flux-1.1-pro (2026-09-24, see the RESOLVED note in
 *     the header; the flux-2-pro history below is kept as written). Original text:
 *     add. flux-2-pro ONLY, and this line IS the path: the
 *     reading instrument rendered 0 of 22 on flux-1.1-pro and 3 of 3 on
 *     flux-2-pro off identical prompts and pools (full numbers in the header).
 *     flux-1.1-pro-ultra stays excluded per playbook lesson 6 (a lighting-
 *     condition path) and because it signs. NOTE flux-2-pro is NOT in FaeBot's
 *     `allowedModels`, and it does not need to be — modelByPath is resolved
 *     before the picker and bypasses that filter (only BOT_BANNED_MODELS,
 *     banana + gpt-2, is a hard gate). Rollback if the signature residual is
 *     judged worse than the missing instrument: swap in flux-1.1-pro:
 *       'star-charting': ['black-forest-labs/flux-2-pro'],
 *
 *     ⚠️⚠️ TWO OPEN BLOCKERS ON flux-2-pro. GO-LIVE IS GATED ON THE SECOND.
 *
 *     (1) IT SIGNS ITS WORK — a legible painted signature in the lower corner
 *     of 2 of 3 delivered renders. Readable text, a hard fail on the rubric,
 *     and the same trait already documented for flux-1.1-pro-ultra. The lever
 *     is item 6's path suffix: it is positive-only and deliberately carries NO
 *     anti-text clause (the bot-wide "no text, no watermarks" negation is what
 *     acorn-boat-regatta measured rendering an actual watermark URL in 2 of
 *     24). Playbook lesson 19 could not resolve that clause's effect against a
 *     1-2/6 base rate; a ~2/3 signature rate CAN be resolved by a 2-arm test
 *     at 8 renders per arm. Run that first.
 *     (2) flux-2-pro DELIVERY COLLAPSED TO 3 OF 13 ATTEMPTS (~23%), all nine
 *     failures returning Replicate E005 "flagged as sensitive". READ THE SHAPE
 *     OF THIS BEFORE ACTING ON IT, because it is NOT the obvious conclusion:
 *       • attempts 1-4 delivered 3 (06:02-06:07 UTC 2026-09-23),
 *       • every attempt after ~06:10 failed: 0 of 9, across THREE separate
 *         batches and TWO different prompt variants,
 *       • all nine carried the IDENTICAL Replicate error id (uIJ6l3ruRD),
 *       • a flux-1.1-pro control submitted in the middle of the streak
 *         succeeded immediately, and flux-1.1-pro is 23 of 23 with zero E005.
 *     So flux-1.1-pro is definitely unaffected, and the fault is definitely
 *     specific to flux-2-pro. But CONTENT ATTRIBUTION IS NOT ESTABLISHED. I
 *     tested the obvious content hypothesis — that the prefix's clothing-status
 *     clause reads as a nudity-context token to the classifier — by rewording
 *     it, and that arm went 0 of 4. A clean before/after break in TIME, holding
 *     across two prompt variants with one repeated error id, fits a throttled
 *     or canned upstream response for flux-2 on this account at least as well
 *     as it fits this path's content.
 *     SO THE NEXT STEP IS A RETRY, NOT A POOL EDIT. Re-run 8 flux-2-pro
 *     attempts in a later session first. Only if delivery is still near zero
 *     is it content, and only then consider softening the `astronomer` pool's
 *     body-plan vocabulary — carefully, because the adult-proportions law is
 *     precisely what beat the naked-putto trap that killed acorn-boat-regatta.
 *     Do not spend that lever on an unproven attribution.
 *     Either way: ~23% delivery is fine for a shadow path, which renders only
 *     on an explicit iter-bot call, and is not shippable on a 2x/day cron.
 *
 * Nothing else is required: pools.js is untouched (this file loads its own
 * seeds), chaos + sensoryAnchors are disabled bot-wide, and the medium falls
 * through to defaultMedium `painted_fantasy_novel`. Going live later = move
 * the string from shadowPaths[] into paths[].
 */
