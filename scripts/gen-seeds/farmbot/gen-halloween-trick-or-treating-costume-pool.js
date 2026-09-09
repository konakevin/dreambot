#!/usr/bin/env node
/**
 * FarmBot — halloween_trick_or_treating_costume bespoke pool ("Trick-or-
 * Treating" SEASONAL path, bot.seasonalPaths.halloween, 2026-09-09).
 *
 * Path-bespoke (not a shared cross-path pool) — describes the COSTUME ITEM
 * ONLY, generic enough to layer over EITHER a human trick-or-treater OR a
 * costumed animal companion (the path template applies whichever wearer
 * context at render time — same "costume drapes OVER the wearer's own body,
 * never replaces it" principle as chibibot's chibi-halloween-outing.js
 * money-shot costume axis, generalized to also cover a human child). Every
 * entry describes LAYERED PIECES (a hood/headpiece, a cape/vest/wrap, maybe
 * a small tail or wing accessory) rather than a solid enclosing shell, so
 * the wearer's own face/hands (human branch) or ears/paws/tail/face (animal
 * branch) stay clearly visible — required by both branches, and directly
 * guards the same failure mode BOT_SCENE_QUALITY_PLAYBOOK.md documents for
 * "costume" concepts defaulting Flux into hiding the actual subject.
 *
 * Guards baked in:
 *   - "playful, never real horror" identity constraint — costumes are cute/
 *     charming Halloween archetypes only (pumpkin, bee, ghost, witch, bat,
 *     dragon, woodland creatures, etc.), never anything gory, skeletal,
 *     zombie, or genuinely frightening
 *   - signage/label-concept hallucination trap — explicit ban on any
 *     lettering, numbers, patches with text, or brand-like emblem on the
 *     costume fabric
 *   - implied-crowd/person-language ban (banHumanLanguage catches explicit
 *     man/woman/boy/girl words — this pool describes only the costume ITEM,
 *     never who wears it, so the filter should have nothing to catch, but
 *     stays on as a safety net)
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_halloween_trick_or_treating_costume.json'),
    total: 120,
    batch: 20,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct descriptions of a CUTE, PLAYFUL HALLOWEEN COSTUME for
a cozy countryside anime farm bot's "trick-or-treating" scene. Each entry describes ONLY the costume
ITEM itself — never who wears it (no wearer, no body, no age/gender words) — because the calling code
layers this same costume description over either a human trick-or-treater OR a costumed animal
companion at render time. The costume (or its main piece) is ALWAYS the grammatical subject named
FIRST in the sentence.

CRITICAL — every costume is built from LAYERED, WEARABLE PIECES draped OVER an existing body, NEVER a
solid enclosing shell or full body-suit that would hide the wearer entirely: a soft hood or headpiece
(with ears, a cap, a mask-like face framing that leaves the eyes and face fully visible), paired with
a cape, vest, tunic, wrap, or body-panel piece, sometimes with a small tail or wing accessory attached
at the back. Describe it so it clearly sits ON TOP of a wearer's own face, hands/paws, and any tail —
never as a costume that replaces or encloses them.

Draw from a wide variety of cute, playful Halloween archetypes — vary widely across entries: a round
pumpkin (an orange body-panel with a green stem cap), a bee (black-and-yellow striped body wrap with
two round gauzy wings), a ladybug (a red-and-black spotted rounded shell-panel with an antenna
headband), a friendly ghost (a simple soft white draped wrap with two round dark eye-shapes), a
little witch (a pointed hat and a flowing cape), a bat (soft black wing panels and small round ears
on the hood), a gentle dragon (soft felt spikes down a cape and a small curled tail), a fox (a bushy
orange tail accessory and pointed-ear hood), a bunny (tall floppy ears and a small cotton-tail), a
raccoon (a striped tail accessory and a soft mask-shaped hood), a mouse (round grey ears and a thin
curled tail), a unicorn (a rainbow yarn mane on the hood and a small golden horn), a firefly (a
round headband with soft antennae and lightly glowing-look wing panels), an owl (soft brown
feather-look wing panels and round goggle-style eye framing), a strawberry (a red rounded cap with a
green leafy collar), a sunflower (a ring of soft yellow petals framing the hood), a knight (a soft
felt breastplate panel and a small plume on the hood), a star (a sparkly yellow five-pointed cape),
a penguin (a round black-and-white body panel and an orange beak-shaped cap piece), a mushroom (a
round red-and-white spotted cap), a scarecrow (a patched straw-yellow tunic and a floppy hat), a
spider (soft extra-arm cuffs and round eye-framing on the hood), an acorn (a smooth brown cap piece
over a tan body panel), a pea pod (a soft green rounded panel), a squirrel (a fluffy tail accessory
and rounded ear hood).

CRITICAL — this is a PLAYFUL, CUTE Halloween scene, never real horror. NO gore, NO skeleton/bones,
NO zombie, NO blood, NO fangs or claws framed as frightening, NO genuinely scary or menacing costume
concepts of any kind.

CRITICAL — do NOT describe any lettering, numbers, text, patch with words, or brand-like emblem
anywhere on the costume fabric, even a blank or implied one — the CONCEPT of a patch or label invites
hallucinated readable text on a render even when told "no text." A plain-colored patch or panel with
no marking is fine.

CRITICAL — describe fabric/texture in plain literal terms only (soft felt, fuzzy fleece, a knit
weave, a satiny sheen) — NEVER a metaphorical object-noun standing in for light or shine (no "flecks
of starlight," "threads of gold," or similar).

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 20-35 words each.

Examples:
["A round pumpkin costume: a soft orange body-panel worn over the shoulders like a padded vest, a
small green stem-shaped cap perched on the hood, leaving the face and hands completely free and
visible.", "A friendly bat costume: soft black wing-panels attached at the back like a light cape,
a hood with two small round felt ears, the wearer's own face left fully open and visible beneath
the hood's edge."]

🚫 STRICT BANS: NO wearer described (no body/age/gender words, no "a child wearing" or "a dog in"),
NO solid enclosing body-suit or shell that would hide the wearer's face/hands/paws, NO readable
text/lettering/numbers/brand emblems of any kind, NO gore/skeleton/zombie/blood/genuinely-scary
concepts, NO photographer/camera-brand names, NO metaphorical light-as-object language.

Output ONLY the JSON array, no preamble, no numbering.`,
  },
];

async function main() {
  for (const r of RECIPES) {
    console.log(`\n=== ${path.basename(r.outPath)} ===`);
    await generatePool(r);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
