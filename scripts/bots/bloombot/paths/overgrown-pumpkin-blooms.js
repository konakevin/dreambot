/**
 * BloomBot candidate — overgrown-pumpkin-blooms (prototyped on AlphaBot).
 *
 * Kevin (2026-09-06): "not just by throwing in some pumpkins — i'd rather
 * see a pumpkin patch overgrown with flowers, smothering the pumpkins, or a
 * giant pumpkin/jack-o-lantern shaped flower growth... this is AI, we can go
 * crazy here." This path is deliberately NOT a tasteful florist arrangement
 * with a pumpkin prop — it's a bold, impossible botanical fantasy. The
 * transformation axis is the whole point: either the patch is being
 * consumed/reclaimed by flowers, or the flowers ARE a monumental jack-o-
 * lantern silhouette (a botanical sculpture, not a real pumpkin at all).
 */

const TRANSFORMATIONS = require('../seeds/overgrown-pumpkin-blooms_transformations.json');
const SETTINGS = require('../seeds/overgrown-pumpkin-blooms_settings.json');
const BLOOM_PALETTES = require('../seeds/overgrown-pumpkin-blooms_palettes.json');
const CREATURE_ACCENTS = require('../seeds/overgrown-pumpkin-blooms_creature_accents.json');

const DETAIL_ACCENTS = [
  'a few real carved jack-o-lantern faces still visible peeking through the bloom-mass',
  'thorned flowering vines coiling and climbing everywhere',
  'fallen petals scattered like confetti across the ground',
  'a handful of ordinary-sized pumpkins left untouched nearby for scale contrast',
  'wisps of low autumn mist curling at ground level',
];

// auto-qa4 R4 fix: the HERO ANCHOR mandate above bans "real orange rind and
// real carved eyes anywhere in frame" whenever the hero is a flower-BUILT
// sculpture/topiary (no real pumpkin at all) — but these two accents put
// real pumpkin material back into frame, flatly contradicting that ban. That
// exact contradiction (a "built entirely of dahlias" topiary transformation
// paired with the "real carved jack-o-lantern faces peeking through" accent)
// produced image 1's muddled render: no jack-o-lantern silhouette at all,
// just a generic flower hedge with pumpkins at its feet, because the writer
// had two contradictory hero descriptions to reconcile and hedged by
// dropping the bold, specific one. Reserve these two accents for
// real-pumpkin (patch/gourd-devoured) transformations only.
const REAL_PUMPKIN_ACCENTS = new Set([
  'a few real carved jack-o-lantern faces still visible peeking through the bloom-mass',
  'a handful of ordinary-sized pumpkins left untouched nearby for scale contrast',
]);
const SCULPTURE_TYPE_RE = /\b(built|constructed|assembled|sculpted)\s+(entirely|from|of)\b/i;

module.exports = ({ picker }) => {
  const transformation = picker.pickWithRecency(TRANSFORMATIONS, 'pumpkin_bloom_transformation');
  const setting = picker.pickWithRecency(SETTINGS, 'pumpkin_bloom_setting');
  const palette = picker.pickWithRecency(BLOOM_PALETTES, 'pumpkin_bloom_palette');
  const creatureAccent = picker.pickWithRecency(CREATURE_ACCENTS, 'pumpkin_bloom_creature');
  const isSculptureType = SCULPTURE_TYPE_RE.test(transformation);
  const availableAccents = isSculptureType
    ? DETAIL_ACCENTS.filter((a) => !REAL_PUMPKIN_ACCENTS.has(a))
    : DETAIL_ACCENTS;
  const accent1 = availableAccents[Math.floor(Math.random() * availableAccents.length)];
  let accent2 = availableAccents[Math.floor(Math.random() * availableAccents.length)];
  if (accent2 === accent1) accent2 = null;

  return `━━━ NON-NEGOTIABLE MANDATE — BE BOLD AND IMPOSSIBLE ━━━
This is a fantastical botanical impossibility, NOT a tasteful florist
arrangement with a pumpkin sitting next to it. Go all the way into the
surreal scale and concept described below — monumental, impossible,
jaw-dropping. This is generative AI art; do not play it safe.

━━━ THE TRANSFORMATION (the whole concept) ━━━
${transformation}

━━━ HERO ANCHOR — MATCH THE TRANSFORMATION'S ACTUAL SCALE ━━━
Do not default every image to one macro-cropped gourd — match the scale the
transformation above actually describes. If it describes a whole PATCH
consumed, show that: several ribbed pumpkins in view, in different stages of
being devoured, a wide botanical catastrophe — not one fruit isolated in
extreme close-up with the rest of the patch cropped away. If it describes
flowers that ARE the monumental jack-o-lantern silhouette (a botanical
sculpture, not a real pumpkin), commit fully — no real orange rind and no
real carved eyes anywhere in frame, the whole ribbed form and its triangle
eyes are built entirely from the named flowers; do not soften this back into
an actual pumpkin with flowers stuck on top. Only when the transformation
describes a single gourd bursting or splitting should it read as one LARGE,
close, unmistakably orange-ribbed pumpkin filling real foreground space.
Whatever the scale, never let the transformation shrink to a small background
prop or abstract away into vague texture, and never lose the wider scenery
around it entirely. If a pumpkin cracks, splits, or bursts, the opening is
physically packed with visible flower petals, stems, and tendrils — it is
NEVER rendered as a glowing, molten, lava-like, or lit-from-within fissure;
there is no light or energy inside a pumpkin, only flowers.

━━━ WRITE THE HERO FIRST, THEN THE CREATURE — NO EXCEPTIONS ━━━
The hero transformation above — including any carved eyes, mouth, or void
detail it describes — must be fully stated in the FIRST one to two sentences
of the final image prompt, complete, before a single word about the setting,
backdrop, atmosphere, sky, or lighting. Never open with scene-setting,
ambience, or a preamble, and never run out of room before finishing the
hero AND the creature that immediately follows it below — if anything has
to be trimmed for length, trim the setting description; the hero and the
creature are BOTH mandatory and neither is ever the thing that gets cut.
Any void or negative-space eye/mouth must stay truly empty (bare stems,
dried stalks, dark wire, or shadow) — never quietly softened back into a
plain unfaced pumpkin filled with more flowers.

Immediately after the hero, in the very next sentence — still before any
setting, backdrop, sky, or lighting language — state this Halloween
creature so it shares the hero's same opening beat instead of arriving as a
late, diluted afterthought after paragraphs of setting and palette (that
late positioning is why it has been vanishing from renders entirely):
${creatureAccent}
Render it at a scale and contrast that reads instantly at a glance — a
bold, crisply-edged, unmistakable silhouette holding real weight in the
frame, never a faint texture or distant speck lost among the petals. This
creature is NOT optional flavor text — it is exactly as load-bearing as the
hero itself. Even if the final image prompt takes real creative or literary
license with mood, voice, or atmosphere (extended scene-setting, invented
lore, poetic narration), the creature's presence, species, pose, and
crisp-silhouette legibility must survive that rewrite completely intact —
an evocative, atmospheric prompt that quietly drops the creature has failed
this mandate just as surely as a flat, literal one that keeps it.

━━━ THE SETTING ━━━
${setting}

━━━ COLOR PALETTE ━━━
${palette}

━━━ ACCENT DETAIL ━━━
${accent1}${accent2 ? `, ${accent2}` : ''}

render every named species as that exact species in its named color, color
STRICTLY within the chosen autumn/Halloween palette above, depth built from
receding layers of more blooms and clearly-rendered scenery, the sky clean
and clear, every layer crisply rendered`;
};
