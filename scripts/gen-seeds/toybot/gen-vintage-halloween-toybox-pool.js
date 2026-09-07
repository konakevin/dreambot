#!/usr/bin/env node
// AlphaBot — vintage-halloween-toybox candidate path (prototyped for eventual
// promotion to ToyBot, per BOT_SCENE_QUALITY_PLAYBOOK.md / ALPHABOT.md).
//
// A lit tabletop cinematic macro diorama of REAL vintage 1950s-60s Halloween
// toys — ONE clear physical material tradition leads every render (never
// mixed): litho-printed pressed TIN noisemakers/toys, die-cut printed
// CARDBOARD decorations, or hand-painted PAPIER-MÂCHÉ candy containers. Five
// generated pools:
//   - display               : the lit tabletop stage the toys sit on
//   - tin_hero               : money-shot litho-tin pieces
//   - cardboard_hero         : money-shot die-cut cardboard pieces
//   - papermache_hero        : money-shot papier-mâché pieces
//   - ephemera               : small period-accent props (optional, ~45%)
//
// Run: node scripts/gen-seeds/toybot/gen-vintage-halloween-toybox-pool.js
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/toybot/seeds/';
const PREFIX = 'vintage-halloween-toybox';

(async () => {
  await generatePool({
    outPath: `${DIR}${PREFIX}_display.json`,
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are a master still-life set-dresser writing LIT TABLETOP HALLOWEEN-DISPLAY scenes for a macro toy-photography path. Each entry stages the SURFACE and SETTING a vintage Halloween toy collection sits on — never the toys themselves (those come from a separate pool). Write ${n} entries.

━━━ FORMAT (mirror exactly) ━━━
Each entry is THREE clauses separated by semicolons, moving foreground → midground → background, ~30-45 words total. Comma-separated phrases within each clause, no full sentences with periods until the very end of the entry.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A crocheted doily spreads across a dark walnut side table in the foreground, its scalloped edge catching lamplight; a brass-based lamp glows warm just behind with a paper shade rimmed amber; beyond, a rain-streaked window fades the room into soft blue dusk."
"A checkered oilcloth covers a farmhouse hutch shelf at the foreground; blue-and-white china stacks recede behind it, catching a slant of late-day sun; a curl of dried bittersweet vine drapes along the shelf's far edge into soft shadow."
"A scarred oak countertop holds the foreground stage of an old general store; a brass cash register looms softly out of focus just behind; jars of penny candy line a shelf receding into the store's dim amber back room."

━━━ SETTING VARIETY — rotate across ALL of these, never cluster on one ━━━
1. A lace doily on a walnut or mahogany side table beside a lamp
2. A windowsill with a gauzy curtain and late-afternoon autumn light
3. A fireplace mantel dressed with a garland of dried autumn leaves
4. A kitchen counter beside a cooling pumpkin pie
5. A porch railing with real pumpkins and scattered fallen leaves
6. An old general-store countertop beside a brass cash register
7. A child's bedroom dresser-top beside a small glowing nightlight
8. A library reading table by a rain-streaked window
9. A parlor curio shelf glimpsed behind glass
10. A crowded toy-shop shelf beside other vintage boxes
11. A farmhouse hutch shelf beside stacked blue-and-white china
12. An attic trunk lid propped open, contents half-unpacked around it
13. A church-bazaar folding table draped in a checkered cloth
14. A one-room schoolhouse windowsill beside a stack of composition books
15. An old barbershop counter beside a jar of peppermint candy
16. A soda-fountain counter beside a chrome napkin dispenser
17. A front-hall side table beneath a coat rack hung with autumn scarves
18. A grandmother's sewing-room shelf beside a wooden spool cabinet
19. A diner counter beside a tall milkshake glass
20. A small-town post-office counter beside stacked brown parcels

━━━ MANDATORY IN EVERY ENTRY ━━━
- A believable period-appropriate (1950s-60s-plausible) real surface and setting — never a modern object, brand, or appliance
- Warm, inviting light named specifically somewhere in the entry (lamp, window, hearth, dusk, etc.)
- Foreground / midground / background depth layering (the 3-clause format enforces this)
- NO toys or Halloween decorations named directly — this pool is the STAGE, not the star

🚫 STRICT BANS: NO humans or human silhouettes, NO gore, NO genuine horror/scares, NO real skulls/bones, NO IP-named locations or brand names, NO readable text, NO photographer/camera-brand names, NO negation phrasing ("not scary" etc — just write it warm and inviting).

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: `${DIR}${PREFIX}_tin_hero.json`,
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing the MONEY-SHOT hero-piece pool for a vintage 1950s-60s LITHOGRAPHED PRESSED-TIN Halloween toy path (noisemakers, wind-ups, friction toys — think Masudaya/Yonezawa-era tin-toy craft, never any real brand name). Each entry describes ONE specific tin Halloween toy in loving material-accurate detail. Write ${n} entries, ~25-40 words each, one sentence.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A litho-tin ratchet noisemaker, its wooden crank handle worn smooth, printed with a grinning orange jack-o-lantern face and a ring of black cats around the rim, the clockwork tab clicking mid-spin."
"A wind-up litho-tin black cat toy caught mid-waddle, its arched-back body printed with painted whiskers and a jaunty bow, the tin key still half-wound at its side."
"A tin tambourine-style noisemaker studded with jingling metal discs, its drumhead printed with a grinning witch silhouette against a full moon, propped against a small stack of other tin toys."

━━━ TOY VARIETY — rotate across ALL of these, never cluster on one ━━━
1. Ratchet-crank noisemaker printed with a grinning jack-o-lantern face
2. Clacker noisemaker printed with a black cat arching its back
3. Tin tambourine-style noisemaker with jingling discs, a witch silhouette printed on the drumhead
4. Friction-wheel tin toy shaped like a comical ghost that scoots forward
5. Wind-up tin black cat toy that waddles on a hidden clockwork mechanism
6. Litho-tin lantern with a punched jack-o-lantern face and a small wire handle
7. Tin bell-noisemaker shaped like a witch's pointed hat
8. Tin spinning noisemaker on a wooden dowel handle, printed with dancing skeletons
9. Tin friction toy shaped like a comical black-cat roadster with a curled-tail exhaust
10. Tin whistle noisemaker printed with a grinning moon face
11. Tin drum-style noisemaker with a painted pumpkin rim
12. Wind-up tin owl toy that flaps stiff tin wings
13. Tin megaphone-style noisemaker printed with a chorus of grinning jack-o-lanterns
14. Tin friction toy witch-on-a-broomstick that rolls forward on hidden wheels
15. Tin ratchet noisemaker with a printed haunted-house scene along its length
16. Tin toy skeleton that rattles on an internal spring when shaken
17. Small tin jack-o-lantern hand bell with a clapper inside
18. Tin friction toy bat that flutters forward on a wound spring
19. Tin cricket-style clicker noisemaker printed with tiny grinning pumpkins
20. Small tin lantern box that glows warm when a stub candle sits inside it

━━━ MANDATORY MATERIAL CUES — every entry names at least 2 of these ━━━
Pressed-tin construction, litho-printed color/detail, tab-and-slot seams, a wind-up key or ratchet/crank handle, patina or tiny handling scratches, enamel-paint sheen.

━━━ OPTIONAL MECHANICAL FLOURISH — include in roughly HALF the entries, not all ━━━
A wind-up key mid-turn, a ratchet mid-spin, a friction wheel caught rolling — the other half are simply beautifully still, no flourish forced.

🚫 STRICT BANS: NO humans, NO gore/real skulls, NO genuine horror/scares (grinning and playful only), NO real toy-company brand names, NO IP names, NO readable text, NO negation phrasing.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: `${DIR}${PREFIX}_cardboard_hero.json`,
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing the MONEY-SHOT hero-piece pool for a vintage 1950s-60s DIE-CUT PRINTED CARDBOARD Halloween decoration path (die-cut standees, honeycomb-tissue pieces, jointed cutouts). Each entry describes ONE specific cardboard Halloween piece in loving material-accurate detail. Write ${n} entries, ~25-40 words each, one sentence.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A die-cut cardboard black cat standee, spine arched and one paw raised, its lithographed ink faded softly at the edges where the pale cardboard ply shows through the die-cut line."
"A honeycomb-tissue pumpkin fully opened into a round accordion-pleated globe, its printed cardboard rim stamped with a crooked grin, propped beside a stack of flattened unopened ones."
"A jointed cardboard witch cutout, elbow and knee pinned with small brass paper fasteners so her broom-arm can swing, printed in bold orange-and-black ink on crisp die-cut card stock."

━━━ PIECE VARIETY — rotate across ALL of these, never cluster on one ━━━
1. Die-cut black cat standee with an arched spine and raised paw
2. Honeycomb-tissue pumpkin, accordion-pleated, pulled open to a full round
3. Die-cut skeleton figure jointed at shoulders and knees with brass paper fasteners
4. Jointed cardboard witch cutout with a paper-fastener elbow and knee
5. Cardboard jack-o-lantern face cutout with cellophane-backed eye and mouth holes
6. Die-cut cardboard owl cutout with folded paper wings
7. A short garland card of connected die-cut bat cutouts
8. Die-cut haunted-house fold-out card that stands up into a small diorama
9. Cardboard scarecrow cutout with a straw-textured print and patched overalls
10. Die-cut ghost cutout with a wavy printed hem and hollow painted eyes
11. Honeycomb-tissue bell decoration printed in orange-and-black stripes
12. Die-cut full-moon cutout with a small bat silhouette pinned across it
13. Oversized glossy-printed cardboard candy-corn cutout standee
14. Die-cut spider cutout with thin wire legs threaded through the cardboard body
15. Cardboard fortune-telling-witch cutout seated at a cauldron, one arm jointed
16. Die-cut cornstalk-and-pumpkin cutout scene card
17. Faded-ink cardboard skull-and-crossbones cutout
18. Foldable die-cut trick-or-treat lantern box printed with a pumpkin face
19. Cardboard black-cat-on-a-fence silhouette, tail curled into a question mark
20. Sepia-and-orange die-cut owl-on-a-branch cutout

━━━ MANDATORY MATERIAL CUES — every entry names at least 2 of these ━━━
Die-cut silhouette edge, lithographed/printed ink, visible pale cardboard ply at the cut edge, honeycomb-tissue accordion pleats, brass paper-fastener joints, ink softened/faded with age.

━━━ OPTIONAL MECHANICAL FLOURISH — include in roughly HALF the entries, not all ━━━
A jointed limb mid-swing, an accordion-pleated piece mid-unfold, an easel-back stand propping it up — the other half are simply beautifully still, no flourish forced.

🚫 STRICT BANS: NO humans, NO gore/real skulls, NO genuine horror/scares (grinning and playful only), NO real brand names, NO IP names, NO readable text, NO negation phrasing.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: `${DIR}${PREFIX}_papermache_hero.json`,
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing the MONEY-SHOT hero-piece pool for a vintage 1950s-60s PAPIER-MÂCHÉ Halloween candy-container path. Each entry describes ONE specific hand-molded papier-mâché piece in loving material-accurate detail. Write ${n} entries, ~25-40 words each, one sentence.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A papier-mâché pumpkin-head candy container, its hand-painted orange finish worn pale at the cheeks, a hinged cardboard-disc lid on the bottom and a thin wire bail handle looped through the stem."
"A black-cat-head papier-mâché container with a molded seam ridge circling its ears, a cord handle looped through, its painted yellow eyes crackled faintly with age."
"A witch-head papier-mâché candy container, the pointed hat molded in one piece with the head, green-painted face chipped at the nose where pale pulp shows beneath."

━━━ PIECE VARIETY — rotate across ALL of these, never cluster on one ━━━
1. Pumpkin-head jack-o-lantern candy container with a hinged cardboard-disc lid
2. Black-cat-head candy container with a cord bail handle looped through its ears
3. Witch-head candy container with a pointed hat molded as one piece with the head
4. Ghost-shaped candy container with a molded wavy hem for a base
5. Skull candy container with a hinged jaw for a lid
6. Crescent moon-face candy container with a molded profile
7. Owl-shaped candy container with molded feather ridges
8. Scarecrow-head candy container with a molded straw-hat brim
9. Small devil-head candy container with molded stub horns
10. Barrel-shaped candy container hand-painted with a jack-o-lantern face on the side
11. Standing pumpkin-man figure candy container with molded stick arms
12. Witch-on-a-broom candy container, the broom bristles molded in relief
13. Bat-shaped candy container with folded molded wings forming the lid
14. Haunted-house-shaped candy container with a small chimney-cork stopper
15. Punched-face jack-o-lantern lantern (not a container) glowing faintly from within
16. Sitting black-cat figure with an arched molded back and a looped-tail handle
17. Combination pumpkin-with-witch's-hat candy container
18. Ghost-on-a-fence-post candy container, the base molded as a stubby fence rail
19. Standing skeleton figure candy container with jointed molded limbs
20. Cauldron-shaped candy container with a molded bubbling-brew rim

━━━ MANDATORY MATERIAL CUES — every entry names at least 2 of these ━━━
Hand-molded pulp-paper form, a visible seam ridge, matte hand-painted finish worn or chipped at the high points, a hinged cardboard-disc lid or bottom, a wire or cord bail handle.

━━━ OPTIONAL MECHANICAL FLOURISH — include in roughly HALF the entries, not all ━━━
A lid propped open showing candy inside, a handle mid-swing, a crackled paint detail catching the light — the other half are simply beautifully still, no flourish forced.

🚫 STRICT BANS: NO humans, NO gore/real skulls, NO genuine horror/scares (grinning and playful only), NO real brand names, NO IP names, NO readable text, NO negation phrasing.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });

  await generatePool({
    outPath: `${DIR}${PREFIX}_ephemera.json`,
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `You are writing a small OPTIONAL period-accent ephemera pool for a vintage 1950s-60s Halloween-toybox macro path. Each entry is ONE small prop or detail scattered near the hero toy that reinforces the era and mood WITHOUT competing with it as a rival "hero" object. Write ${n} entries, ~15-25 words each, one sentence.

Example entries (this exact format/length, adapt the CONTENT, never reuse verbatim):
"A curl of orange-and-black crepe-paper streamer drapes loosely across one corner of the display, its cut fringe catching the light."
"A handful of candy corn spills from a tipped tin pail, scattering bright kernels across the tabletop just beside the scene."
"A stub candle gutters low inside a small tin candle-cup, its flame throwing a warm flicker across the nearby toys."

━━━ ACCENT VARIETY — rotate across ALL of these, never cluster on one ━━━
1. A curl of crepe-paper streamer, orange and black, draped loosely nearby
2. A small die-cut skeleton dangling on a thread, swinging gently
3. A scatter of candy corn spilled from a tipped tin pail
4. A tin candle-cup holding a low-guttering stub candle
5. A paper trick-or-treat sack with a twisted rope handle, half-full
6. A rubber Halloween noisemaker horn resting on its side
7. A short garland of small cardboard bat cutouts strung on thread
8. A spool of black thread unspooled into a loose cobweb shape
9. A stack of vintage Halloween postcards fanned slightly open
10. A small pile of roasted chestnuts in their split shells
11. A dish of candy apples on wooden sticks
12. A small burlap sack of walnuts, a few spilled loose nearby
13. A cluster of bittersweet-vine berries in a small glass jar
14. A striped paper straw poking from a jug of fresh cider
15. A handful of candy-corn-colored ribbon curls
16. A tiny toy broomstick leaning in the corner of the display
17. A pair of black construction-paper cat-ear cutouts on a thin headband
18. A folded paper fortune-telling card, one corner curling with age
19. A small brass bell tied with a length of orange ribbon
20. A dried corn husk twisted into a small wreath shape

🚫 STRICT BANS: NO humans, NO gore/real skulls, NO genuine horror/scares, NO real brand names, NO IP names, NO readable text, NO negation phrasing, NO object large or dominant enough to upstage a hero toy piece.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering, no markdown fences.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
