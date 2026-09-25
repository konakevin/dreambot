/**
 * StarBot space-rogue — a painted sci-fi CHARACTER STILL of one sleek woman in a place as designed
 * as she is (2026-09-25, SHADOW).
 *
 * ═══ THE ASK (Kevin, verbatim) ═══
 * "a highly stylized version of characters in sci-fi settings — alien planets, bounty hunters,
 * space pubs and bars/hangouts/clubs on alien planets, street scenes in cities on alien planets,
 * inside space ships … the setting should always lend itself to somewhere a sleek, sexy looking
 * space character would be … women characters to begin with … push boundaries on visuals … the
 * scenes to look as sexy and cool as the main character" and "i want to see some crazy looks out
 * of it — all sorts of cool alien races and humans for characters — all out killin it".
 * Reference frames: DragonBot's painterly character paths — full-body or three-quarter figure,
 * one dramatic light source and one colour story, a hero object in hand, mid-beat, the
 * environment carrying half the picture.
 *
 * ═══ HOW IT STAYS DISTINCT ON STARBOT ═══
 * space-femme is a glossy neon comic-cover POSTER heroine (maximalist, phenomenon on most rolls).
 * female-explorer is sealed armour in the wilderness. This path is PAINTERLY, VENUE-LED and
 * civilised: nightlife, ports, ships, the surface of a world where a traveller stops.
 *
 * ═══ 12 AXES (9 always-on, company at 0.5, event at 0.4, camera hand-authored) ═══
 *   venue        ★ the hero stage, LEADS the prompt. Tagged [BAR]/[STREET]/[SHIP]/[PORT]/[WILD].
 *   set_dressing ×2, filtered to the venue's family (+ [ANY]) — a prose compatibility clause loses
 *                to a pool pick every time, so the incompatible entries are removed structurally.
 *   light_story  ★ the money shot: two committed hues on the LIGHT, warm against cool. Owns the
 *                whole palette. The venue names its light SOURCE with no colour word, so the two
 *                axes never contradict.
 *   air          what the atmosphere is doing. Air only.
 *   lineage      ★★ THE HEADLINE — who she is physically: an ALIEN or an ALIEN-HUMAN HYBRID (R4,
 *                never a human), the species as the identity noun ("A Sorvathi with …"), head and
 *                face structure first, then skin, eyes, hair-or-what-grows-instead, all in ONE pool
 *                so a head-tail never fights a "long blonde hair" roll from a separate axis.
 *   role         a hunter/outlaw title + a dangerous-mystery demeanour, zero clothing (the SteamBot
 *                homogenization triad). The title is spliced after the species in the output order
 *                so gender rides on the role noun (huntress, queen), never on "woman".
 *   costume      ★ THE KIT (R4): bounty-hunter armour made couture — plate over structured cloth,
 *                a head-cover register (full helm / partial / bare + carried), one piece of gear.
 *                Sexy through silhouette, never body words.
 *   hero_object  the thing in her hand — weapons and hunter's tools mostly, a few trophies.
 *                Nothing with a screen or a label.
 *   beat         verb-led, grounded, body-shaping. Presence or momentum, never a chore.
 *   company      0.5 gate — ONE other presence, alien-cast, machine or creature. Never a crowd.
 *   event        0.4 gate — something happening beyond her, filtered to the venue's family.
 *   camera       25 hand-authored vantages below: distance, height and angle only, hero-agnostic,
 *                venue-agnostic, no posture verbs, full-body or three-quarter on every one.
 *
 * ═══ THE LOAD-BEARING RULES (in the template's first lines) ═══
 *   1. She is IN the place and the place is as designed as she is: full-body or three-quarter,
 *      integrated, never a bust, never a cutout on bokeh.
 *   2. The venue and its light open the prompt (position law); she arrives second, and her
 *      COSTUME is the first thing said about her — before her skin. See R0 below for why.
 *   3. Text priors: bars, streets and ports are signage machines. Nothing with writing exists in
 *      any pool; the output order carries a POSITIVE dressing clause for every flat surface.
 *   4. One other presence at most. Never a crowd (flux-1.1 safety filter + frame theft).
 *
 * ═══ R0 (2026-09-25, 6 shadow renders, 3 pro + 3 ultra) — THE POSITION LAW, MEASURED AGAIN ═══
 * 6/6 full-length figures inside deep, designed places (the composition law held first try), the
 * lineage pool delivered the wild looks (violet skin + plumes, green scales + tail, white afro-halo
 * human, crystalline crest, obsidian horns). BUT 4 of 6 rendered her effectively NUDE, and the
 * safety filter fired on 4 attempts. Cause, read from the six stored prompts: Sonnet wrote 310-340
 * words against a 120-150 cap, the lineage's SKIN description landed at ~33% of the prompt and the
 * COSTUME at 44-58% — past the attended region — so Flux painted patterned skin over a whole body
 * and never read the clothes. Not a pool defect (every outfit was fully authored), not a model
 * defect (3 pro, 1 ultra). R1's single variable: the costume moves into her opening phrase, before
 * her skin traits, paid for by cutting the wrapper 48 → 25 words and the output order 10 → 7 items
 * and by halving the template prose (a cap is a nudge; deletion is what shortens the output).
 * Also seen in R0, left for later rounds: gibberish lettering on a lit ship panel, a round
 * porthole-screen and a stall sign (3/6 — the expected residual on these venue families).
 *
 * ═══ R1 → R3 (same day) — 3/6 → 5/6 → 6/6 CLOTHED, composition 6/6 every round ═══
 * R1 (costume moved into her opening phrase, wrapper 48 → 26 words, order 10 → 7 items): "wearing" at
 * 25-33%, prompts 251-299 words, clothed 3/6 — every failure was a body garment Flux merged with the
 * skin that follows it (a bodysuit under scaled skin → fishnet; "open jacket over bare arms" → bare
 * chest; "coat over a fitted underlayer" → bare torso). R2 (costume pool regenerated: every body
 * garment STRUCTURED, OPAQUE, CONSTRUCTED, named first; generator guard rejects bodysuit / satin /
 * sheer / mesh / film / open-over / underlayer): clothed 5/6, the one miss a "zipped bomber, bare
 * midriff" the model unzipped. R3 (midriff cuts reworded; dial / gauge / dashboard nouns deleted
 * from the venue pool): clothed 6/6, text 1/6. Per-model over 24 renders — nudity pro 5/9, ultra
 * 3/15 (mostly under the R0/R1 defect); signatures ultra 2/15, pro 1/9. Kept at the fleet 50/50 and
 * re-asked after the first 30 live posts. Full ledger: BOT_SCENE_QUALITY_PLAYBOOK.md → StarBot →
 * `space-rogue`.
 *
 * ═══ R4 (2026-09-25) — KEVIN'S VERDICT ON THE 15 R0-R3 RENDERS: THE CHARACTER REBUILD ═══
 * "these are too basic looking — the women look like they're just in leisure outfits mostly. i want
 * these to be more 'boba fett' in the fact that she's a mystery, and she stands out from the crowd
 * because of her 'out there' attire and dangerous looking 'edge'. the scenery and settings are really
 * good, just the character looks and designs need to be fixed — more alien looking figures, or
 * alien/human hybrids". Diagnosis against the playbook, not the images: (1) every lineage entry
 * opened "A Sorvathi WOMAN with …" and the template said "a {who} wearing" — the "[age] man/woman"
 * law: CLIP anchors on "woman" and paints the species as makeup on a modern human (7 of 15 renders
 * were plainly human, and the aliens were humans with horns); (2) the R2 structured-garment costume
 * pool fixed nudity by going PLAIN — quilted jackets, tunics, linen trousers — which is the "leisure
 * outfit" Kevin saw. Rebuild, one lever ("the character") across the four character pools + the
 * lines of the template that describe her, the seven setting pools untouched: lineage = alien or
 * hybrid only, species as the noun, head/face structure first, HUMAN_NOUN_GUARD in the generator;
 * costume = the KIT (armour plate over structured cloth, a full-helm / partial-cover / bare-face
 * register, one piece of hunter's gear); role = hunter/outlaw title + dangerous-mystery demeanour,
 * the title spliced after the species in the output order; hero_object = weapons and tools mostly;
 * wrapper prefix names "one alien character" at position 0. Structured, opaque garments are KEPT
 * (the R1-R3 nudity fix) — armour is the most structured garment there is.
 *
 * ═══ R4 → R6 RESULTS (same day, 18 shadow renders) ═══
 * R4: alien 6/6 (from ~8/15), kit 3-4/6, clothed 5/6 — but 3/6 read MALE with "woman" gone. Three phrase
 * defects reworded (a "plated VEST" opened over a bare chest → chest plate; "gill-line SCARS along the
 * jaw" → a stitched skull mouth → gill slits down the neck; the cockpit's "toggle switches / crystal
 * indicators" → dial numerals → nouns cut). R5 (cue "shaped to her feminine figure" in the output-order
 * parenthetical): alien / kit / mystery / clothed 6/6, female ~4/6 — Sonnet dropped the cue in the two
 * neutral reads. R6 (`shapeKit` bakes the cue into the kit string at ~31%): alien 6/6, kit 6/6, clothed
 * 6/6, female 3 clear + 3 ambiguous + 0 male, text 3/6 (cargo-bay crate stencils, a bar neon, lounge
 * panels — the venue-family residual since R0). Totals R4-R6: alien 17.5/18, kit ~16/18, clothed 17/18,
 * text 6/18. Round cap reached; Kevin judges the 18 in the app. Ledger + the two new portable rules:
 * BOT_SCENE_QUALITY_PLAYBOOK.md → StarBot → `space-rogue`.
 *
 * ═══ WHY FUNCTION-FORM AND SELF-CONTAINED ═══
 * Loads its own 11 seed JSONs and inlines its brief (the FaeBot mushroom-apothecary / DinoBot
 * amber-forest pattern). Registration is one `pathBuilders` line plus the shadow/skip entries in
 * `index.js`. Seeds load TOLERANTLY so StarBot keeps loading while pools are being generated; the
 * builder throws a clear error if a required pool is empty at render time.
 *
 * Config: own code-only medium `starbot_space_rogue` (painterly, no artist names, no "photograph",
 * no "poster"); modelByPath [flux-1.1-pro, flux-1.1-pro-ultra] (the fleet 50/50 default; ultra
 * measured at round 0 for signatures and golden-hour reverts — none in 3/3); chaos SKIPPED,
 * twoPassPolish SKIPPED, sensoryAnchors SKIPPED (its `lightcolor` channel is a second palette
 * source on every render and light_story owns the palette). `sharedDNA.scenePalette` deliberately
 * NOT consumed for the same reason. No `promptPrefixByPath` (the wrapper-strip lesson).
 */

const fs = require('fs');
const nodePath = require('path');

function loadOptional(name) {
  const p = nodePath.join(__dirname, '..', 'seeds', `${name}.json`);
  if (!fs.existsSync(p)) return [];
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return [];
  }
}

const VENUE = loadOptional('starbot_space_rogue_venue');
const SET_DRESSING = loadOptional('starbot_space_rogue_set_dressing');
const LIGHT_STORY = loadOptional('starbot_space_rogue_light_story');
const AIR = loadOptional('starbot_space_rogue_air');
const LINEAGE = loadOptional('starbot_space_rogue_lineage');
const ROLE = loadOptional('starbot_space_rogue_role');
const COSTUME = loadOptional('starbot_space_rogue_costume');
const HERO_OBJECT = loadOptional('starbot_space_rogue_hero_object');
const BEAT = loadOptional('starbot_space_rogue_beat');
const COMPANY = loadOptional('starbot_space_rogue_company');
const EVENT = loadOptional('starbot_space_rogue_event');

// HAND-AUTHORED (never generated — a Sonnet camera pool leaks its sibling axes). Distance, height
// and angle only; every one is full-body or three-quarter; nothing describes a posture, a hero, a
// venue or a light. Off-axis by construction: no straight-down-the-room, no plan view, no frontal
// centred portrait.
const CAMERA = [
  'full-body shot from a low three-quarter angle across the room, her whole figure in frame with the place reaching back behind her',
  'three-quarter-length shot from slightly below and to one side, the far wall of the place visible past her shoulder',
  'full-body shot from across the room at chest height, angled so one side of the place recedes behind her',
  'wide shot from a high corner looking down and across, her full figure small enough that the whole place reads around her',
  'full-body shot from knee height on a slight diagonal, the floor running away under her toward the back of the place',
  'three-quarter-length shot from her far side, the camera set back and low, the place opening out on the other side of her',
  'full-body shot from the doorway looking in at an angle, her figure a third of the frame height with the depth of the place behind',
  'three-quarter-length shot at eye level from off to one side, the camera far enough back that a full arm span of the place shows on either side of her',
  'full-body shot from a slight high angle across a diagonal, her figure off centre and the place filling the rest',
  'wide low shot from floor level at a diagonal, her full figure tall in frame, the ceiling or sky of the place visible above her',
  'three-quarter-length shot from just behind and to one side of a foreground object, the place and her figure seen past it',
  'full-body shot from the far end of the place at a three-quarter angle, her figure mid-frame with layers of the place in front of and behind her',
  'three-quarter-length shot from waist height on a diagonal, one wall of the place close on one side and the depth open on the other',
  'full-body shot from a raised walkway looking down at an angle, her figure and the whole floor of the place in frame',
  'full-body shot from a low angle just off her line of travel, the place streaming back diagonally behind her',
  'three-quarter-length shot from across a table or counter at a diagonal, its edge crossing the bottom corner of the frame',
  'wide shot from outside an opening looking in at an angle, the frame of the opening cropping one edge, her full figure inside',
  'full-body shot at hip height from three-quarters behind a piece of the place, her figure turned so her face is fully visible',
  'three-quarter-length shot from slightly above on a diagonal with the light source of the place in the top corner of the frame',
  'full-body shot from a long way back across the place at eye level, her figure a quarter of the frame height, everything sharp',
  'three-quarter-length shot from low and to the side, the nearest surface of the place cropped by the frame edge beside her',
  'full-body shot from a diagonal that puts her in the lower third and the tallest part of the place above her',
  'three-quarter-length shot from a side angle at shoulder height with open depth behind her on both sides',
  'full-body shot from a low three-quarter angle with a foreground element of the place cropped across the bottom edge',
  'wide three-quarter shot from mid-distance, the camera turned so no wall of the place is square to the frame',
];

const COMPANY_GATE = 0.5;
const EVENT_GATE = 0.4;

const TAG_RE = /^\[([A-Z]+)\]\s*/;
function familyOf(entry) {
  const m = String(entry).match(TAG_RE);
  return m ? m[1] : 'ANY';
}
function stripTag(entry) {
  return String(entry).replace(TAG_RE, '');
}
function forFamily(pool, family) {
  const hits = pool.filter((e) => {
    const f = familyOf(e);
    return f === family || f === 'ANY';
  });
  return hits.length ? hits : pool;
}

function need(pool, name) {
  if (!pool.length) throw new Error(`space-rogue: seed pool ${name} is empty — generate it first`);
  return pool;
}

function pickTwo(pool, axis, picker) {
  const a = picker.pickWithRecency(pool, axis);
  let b = picker.pickWithRecency(pool, axis);
  for (let i = 0; i < 5 && b === a && pool.length > 1; i++) b = picker.pickWithRecency(pool, axis);
  return b === a ? [a] : [a, b];
}

// Lineage entries open "A Sorvathi with …" / "A Sorvathi-human hybrid with …" (R4: the species is
// the identity noun, never "woman" — the playbook's "[age] man/woman" law). Keep the name so the
// kit can be spliced in right after it: "a Sorvathi bounty huntress wearing …, with …".
function splitLineage(entry) {
  const m = String(entry).match(/^An?\s+(.+?)\s+with\s+(.+)$/i);
  if (m) return { who: m[1], traits: m[2].replace(/\.\s*$/, '') };
  return { who: 'alien', traits: String(entry).replace(/\.\s*$/, '') };
}

// R5 → R6 (2026-09-25): with "woman" gone, 3 of 6 R4 renders read male. A "shaped to her feminine
// figure" cue held the female read in every R5 prompt Sonnet copied it into, and Sonnet dropped it in
// 2 of 6 when it lived in the output-order parenthetical. Baked into the kit string itself, right
// after the torso piece (~31% of the emitted prompt), it is copied verbatim with the rest of the kit.
function shapeKit(costume) {
  const c = String(costume).replace(/\.\s*$/, '');
  const i = c.indexOf(', ');
  return i > 0
    ? `${c.slice(0, i)}, shaped to her feminine figure${c.slice(i)}`
    : `${c}, shaped to her feminine figure`;
}

// Role entries open "<Title>, <demeanour>" — the title (2-4 words) rides after the species in the
// output order so gender comes from the role noun (huntress, queen, daughter) and the pronouns.
function roleTitle(entry) {
  const head = String(entry).split(',')[0].trim();
  const words = head.split(/\s+/);
  if (words.length < 1 || words.length > 4) return '';
  return head.toLowerCase();
}

module.exports = ({ vibeDirective, picker }) => {
  const venueRaw = picker.pickWithRecency(need(VENUE, 'venue'), 'space_rogue_venue');
  const family = familyOf(venueRaw);
  const venue = stripTag(venueRaw);
  const dressing = pickTwo(
    forFamily(need(SET_DRESSING, 'set_dressing'), family),
    'space_rogue_set_dressing',
    picker
  ).map(stripTag);
  const light = picker.pickWithRecency(need(LIGHT_STORY, 'light_story'), 'space_rogue_light');
  const air = picker.pickWithRecency(need(AIR, 'air'), 'space_rogue_air');
  const lineage = splitLineage(
    picker.pickWithRecency(need(LINEAGE, 'lineage'), 'space_rogue_lineage')
  );
  const role = picker.pickWithRecency(need(ROLE, 'role'), 'space_rogue_role');
  const costume = shapeKit(picker.pickWithRecency(need(COSTUME, 'costume'), 'space_rogue_costume'));
  const heroObject = picker.pickWithRecency(need(HERO_OBJECT, 'hero_object'), 'space_rogue_object');
  const beat = picker.pickWithRecency(need(BEAT, 'beat'), 'space_rogue_beat');
  const company =
    COMPANY.length && Math.random() < COMPANY_GATE
      ? stripTag(picker.pickWithRecency(COMPANY, 'space_rogue_company'))
      : null;
  const event =
    EVENT.length && Math.random() < EVENT_GATE
      ? stripTag(picker.pickWithRecency(forFamily(EVENT, family), 'space_rogue_event'))
      : null;
  const camera = picker.pickWithRecency(CAMERA, 'space_rogue_camera');
  const title = roleTitle(role);
  const who = title ? `${lineage.who} ${title}` : lineage.who;

  return `You are a production designer and costume designer writing ONE painted science-fiction character still for StarBot: a mysterious, dangerous-looking alien or alien-human hybrid, the one figure in the place nobody can name, in a kit so out-there that the whole room notices. Painterly sci-fi concept art, one dramatic light source, a committed two-colour story.

RULE 1 — SHE IS IN THE PLACE AND THE PLACE IS HALF THE PICTURE. Her whole figure is in frame (full-body or three-quarter, per the camera), standing or moving IN the venue, lit by the venue's own light, the depth of the place sharp behind and around her with open space between her and the walls.
RULE 2 — SHE IS ARMOURED FIRST, THEN DESCRIBED. The very first thing written about her is her kit, exactly as given, covering her exactly as the kit says, shaped to her feminine figure, head cover included. Only then her species: head and face structure, skin, eyes, hair or what grows in its place, every feature her own anatomy and rendered unmistakably. Her eyes are visible, through the visor if the kit has one. She is "she" and "her" throughout, still and in command of the room.
RULE 3 — ONLY WHAT IS NAMED IS IN THE FRAME. One venue, one figure, at most one other presence, room around her. Every flat surface of the place is dressed with objects or texture and every surface is plain of writing.

★ VENUE (opens the picture): ${venue}
★ COLOUR STORY (owns the palette): ${light}
AIR: ${air}
★ SHE IS: a ${who} — ${lineage.traits}
★ SHE WEARS: ${costume}
BEAT: ${beat}
ROLE: ${role}
HERO OBJECT: ${heroObject}
${company ? `COMPANY (one presence, clear space between it and her): ${company}\n` : ''}${event ? `BEYOND HER: ${event}\n` : ''}SET DRESSING (away from her): ${dressing.join(' · ')}
CAMERA: ${camera}
MOOD: ${vibeDirective ? String(vibeDirective).slice(0, 150) : ''}

LENGTH IS THE FIRST RULE OF THE OUTPUT — 110-140 WORDS, COUNT THEM. A tight picture beats a crammed inventory. Write comma-separated phrases in THIS order and then STOP:
[the venue in one short phrase with its light source, and the two colours of that light and where each lives],
[a ${who} wearing (her kit exactly as given, word for word, head cover included), with (her head and face structure, skin, eyes, and hair or what grows in its place), (her beat) in this place, her whole figure in frame],
[the hero object in her hand or on her],${company ? '\n[her company, at its stated distance from her],' : ''}${event ? '\n[what is happening beyond her],' : ''}
[the two pieces of set dressing placed away from her, every flat surface dressed with objects or texture],
[the air, and the camera's distance, height and angle with her whole figure and the place in frame].

Describe only what IS present, never a negation. No preamble, no titles, no headers, no markers, no bold labels.`;
};

/*
 * ── REGISTRATION (merged into scripts/bots/starbot/index.js 2026-09-25) ────────────
 *   pathBuilders:            'space-rogue': require('./paths/space-rogue'),
 *   shadowPaths:             ['space-rogue']
 *   mediumByPath:            'space-rogue': 'starbot_space_rogue'
 *   modelByPath:             'space-rogue': [flux-1.1-pro, flux-1.1-pro-ultra]
 *   promptPrefixByMedium:    starbot_space_rogue: 'painted sci-fi character scene, full-length figure in a fully painted place'
 *   promptSuffixByMedium:    starbot_space_rogue: 'painterly concept-art finish, deep readable focus, …, no text, no words, no watermarks'
 *   mediumStyles:            starbot_space_rogue: <painterly fragment, ~14 words, no artist names>
 *   chaos.skipPaths:         + 'space-rogue'
 *   twoPassPolish.skipPaths: + 'space-rogue'
 *   sensoryAnchors.skipPaths: ['space-rogue']
 */
