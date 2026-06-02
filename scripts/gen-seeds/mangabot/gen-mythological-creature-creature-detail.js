#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mythological_creature_creature_detail.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} CREATURE-DETAIL entries for a MangaBot mythological-creature keyframe. SCENE-LED — each entry names ONE close-grained TEXTURE / ANATOMICAL / ICONOGRAPHIC detail on the yokai's body that gives it material truth and lineage specificity. This is the surface-texture pass that proves the creature is real and Japanese-myth-authentic.

⚠️ CRITICAL: ONLY Japanese-yokai iconography. NEVER western dragon scales / unicorn horn / mermaid tail / werewolf claws. NEVER WESTERN. Every detail must be a known yokai feature (kitsune fox-fire on tails / tengu beak-mask / ryujin scale-pattern / oni iron-club / yuki-onna kanzashi).

Each entry: 12-22 words. ONE specific anatomical / textural / iconographic detail. Material-truth language (matte, lacquered, weathered, glistening, dewdrop, scarred).

DETAIL VARIETY (yokai iconography & texture):
- Fox-fire flickering from each of nine tail-tips (kitsune kyubi)
- Yamabushi tassel-cord draped down the tengu's red-feathered shoulder
- Lapped scales along the ryujin's coiled spine, each scale catching a different reflected color
- Antlered crown of the ryujin dragon-god, six points dripping condensed mist
- Pale-blue skin of yuki-onna translucent enough that veins of frost trace beneath
- Yuki-onna's hair hanging in heavy black ropes against the snow-pale shoulder
- Forked-tail aura of a nekomata, twin tail-tips wreathed in spirit-flame
- Beak-mask of a yamabushi-tengu carved from dark cypress, lacquered crow-eye whites
- Iron kanabo club of an oni, studded with bolt-heads, smeared with rust at the grip
- Red-or-blue skin of the oni, scarred at the chest, tiger-stripe loincloth weathered
- Kappa's dish-of-water atop the head, surface trembling at the rim
- Webbed green hands of the kappa, dewdrops beading at the finger-tips
- Tanuki's leaf perched precariously on the head mid-shape-shift
- Amabie's three scaled legs splayed wide at the shore, beak slightly parted
- Karakasa-obake's single eye rolling skyward atop the paper-umbrella body
- Nure-onna's massive snake-coil, scales lapped in river-silt, water beading on the spine
- Rokurokubi's impossibly elongated neck, three sharp creases at the throat from the stretch
- Inugami's white wolf-fur bristling, possessing-shadow trailing from the paws
- Bake-neko's oversized tail flicking, paper-lantern dangling from one paw
- Hyakume's clustered glowing eyes blinking out of phase across the hulking dark body
- Namahage's ogre-mask carved into a scowl, straw-cape rustling at the shoulders
- Hone-onna's exposed rib-cage visible through the parted kimono, paper-lantern lit in bone hand
- Mid-transformation visible at the seam — fox-fur giving way to human skin along the cheek
- A single sake-cup balanced on the kitsune's curled tail-tip, fox-fire reflecting in the lacquer
- Shimenawa rope tied at the tengu's waist, paper-shide tassels catching wind

DO write (texture + iconographic detail, yokai-authentic):
- Fox-fire flickering from each of nine tail-tips, blue-orange flame curling at the kitsune's spine
- Antlered crown of the ryujin dragon-god, six points dripping condensed mist down the snout
- The yuki-onna's hair hanging in heavy black ropes against her snow-pale shoulder
- An iron kanabo club studded with bolt-heads, the grip dark with rust-smear and finger-oil
- A kappa's dish-of-water trembling at the rim atop the green-scaled head, surface beading
- The tanuki's leaf perched precariously on the head mid-shape-shift, half-fur half-skin transition
- Bake-neko's oversized tail flicking behind, a small paper-lantern dangling from one upright paw

DO NOT write:
- Western dragon scales / unicorn horn / mermaid tail / werewolf claws
- Generic "scaly skin" / "horns" without yokai specificity
- Hero-human anatomical details (the hero is the YOKAI)
- Pose / action verbs (this is texture only)
- Photoreal anatomy specs
- Multi-feature dumps (pick ONE detail)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
