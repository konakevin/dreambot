#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/fae_boudoir_wardrobe.json',
  total: 50,
  append: false,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} EXTREMELY-SEXY FAE BOUDOIR WARDROBE entries for FaeBot's TEST sexy-fae-boudoir path. Each entry: 22-35 words.

━━━ THE VIBE ━━━
Enchanted-forest dryad / fae woman in INTIMATE BOUDOIR attire. Lore-accurate (NOT generic Victorian lingerie). Her body is partially-plant — leaves, vines, moss, bark, flower-petals form her "outfit." Pull the natural-coverage WAY back: she's wearing the bare minimum of plant-matter as a bralette / wrap-skirt / strappy harness. Boudoir-photoshoot energy in an enchanted-grove setting.

━━━ CATEGORIES ~equal distribution ~10 each ━━━

- LEAF & VINE BRALETTE — twin large fern-leaves shaped into a bralette covering her chest, vine-cord straps over the shoulders, matching twin leaves at the hips as panties, dewdrops glistening across her bare midriff.

- SHEER PETAL-GAUZE — gossamer flower-petal silk wrap clinging to her body like a transparent sheer chemise, faintly visible bralette of pressed flower-petals beneath, vine-cord ties at hip and shoulder.

- MOSS-AND-BARK CORSET — fitted moss-and-bark Victorian-style underbust corset framing her bare midriff, dewdrop-crystal lace bralette above, miniature vine-skirt below, mushroom-stem garters holding leaf-stockings.

- WOVEN-FLOWER STRAPPING — thin braided-flower-and-vine straps wrapping diagonally across her bare torso forming a barely-there harness, matching wide vine-belt low on her hips with petal-curtain skirt, flower-blossom pasties.

- DEW-DROP LACE — bralette and panties woven from glistening dewdrop-strung spider-silk lace (translucent, jewel-glistening), barely covering, leaf-and-petal flower-crown jewelry.

━━━ EVERY ENTRY MUST INCLUDE ━━━
1. Plant-material outfit type — leaf / vine / moss / petal / dewdrop / flower / bark / mushroom-stem
2. EXTREMELY revealing — bare midriff, bare back, bare thighs, bare shoulders, narrow strapping, sheer petal coverage
3. Faerie-magical detail — dewdrops glistening, bioluminescent moss glowing, fairy-pollen sparkling, vine-tendrils curling
4. Maintains MINIMAL coverage — bra-form / strap-form / petal-form covering chest. PANTIES-form / petal-skirt / vine-thong covering below the waist. NO bare nipples, NO full nudity (Flux 1.1 Pro will reject).

━━━ FLUX BANS — DO NOT WRITE (100% rejection rate) ━━━
- "Topless" / "bare-chested" / "bare bust" / "uncovered chest" / "nude" / "naked" / "nipple"
- Below-the-waist nudity — there must always be petals / leaves / vine / lace covering the hip-area
- Every entry needs SOMETHING covering both the chest and the crotch

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Twin large emerald-fern bralette covering her chest with vine-cord straps over bare shoulders, matching twin-leaf panties at hips, dewdrops glistening across her bare midriff and thighs"
- "Gossamer pink-petal silk wrap clinging to her body like a transparent chemise, pressed-flower bralette barely visible beneath, vine-cord ties at the hip and shoulder, bare back exposed"
- "Fitted moss-and-bark Victorian underbust corset framing her bare midriff, dewdrop-crystal lace bralette above the corset, miniature vine-skirt with mushroom-stem garters and curling-leaf stockings"
- "Thin braided-vine straps wrapping diagonally across her bare torso forming a barely-there flower-harness, wide vine-belt low on her hips with translucent petal-curtain micro-skirt"
- "Translucent jewel-glistening dewdrop-strung spider-silk bralette and matching panties, sheer enough to glow with the bioluminescent moss beneath, leaf-and-flower crown atop tousled vine-hair"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
