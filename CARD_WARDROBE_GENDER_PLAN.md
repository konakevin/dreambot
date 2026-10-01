# Card wardrobes for both genders

Status: **built and A/B tested, switch OFF awaiting Kevin's flip** (2026-10-01). Kevin: "why are we getting fruity outfits like this for men?" (two renders on
Crystal Caverns: a man in a sheer organza robe and briefs). Kevin approved the plan below ("yes").

## Cause

A fantasy or costume card dresses the cast from its own `biome_config.WARDROBE` (8 entries). `gen-location-wardrobe.js`
asked for entries that "work for both genders; Sonnet adapts the cut", and the lists came out leaning feminine: of the
67 cards that use their list, 63 have women-only items (bodice, corset, gown, high-slit skirt, bare midriff, organza
robe over a bodysuit) and 30 are half or more women-only. The engine picks one entry per render for everyone
(`nightly-dreams`: `pickAxis(bespokeBiome.WARDROBE)`), the brief says "adapt it for each character", and a man handed
"a floor-length translucent organza robe over a jeweled bodysuit, bare feet" comes back in a sheer robe.

## Plan

1. **Data:** a men's list, `biome_config.WARDROBE_MEN` (8 entries), on every card that uses its WARDROBE, written in the
   card's own register with the same daring bar as the women's: armour, coats, cloaks, period suits, never sheer or
   skirted. Every line reviewed. The existing WARDROBE stays as the women's list and the fallback.
2. **Engine (behind a switch):** `engine_config.nightly_gendered_wardrobe` (off until Kevin flips it; QA
   `force_gendered_wardrobe`). Each person gets their own pick from their own list; a couple gets two; the brief names
   whose inspiration is whose. Stamp `gendered_wardrobe`.
3. **Test:** men and couples on the worst cards, switch on vs off, read every render before asking for the flip.

## Progress

- [x] men's lists written and reviewed: WARDROBE_MEN on 67 cards, 526 entries (mig 646, `scripts/gen-location-wardrobe-men.js`
      with a menswear filter: no sheer, skirted, heeled or bare-legged cuts, nothing PLAIN_CLOTHES bans); women's lists on
      the 14 cards whose shared list carried men's suits or "X OR Y" entries (mig 646); the softest whimsical men's entries
      toned to deep colour and tailoring (mig 648, after the A/B showed a pink pastel tailcoat with white stockings)
- [x] engine switch + tests, deployed: `engine_config.nightly_gendered_wardrobe` (mig 647, OFF), QA
      `force_gendered_wardrobe`, `_shared/costumeWardrobe.ts` `pickWardrobeAnchors`, couple brief names whose inspiration
      is whose (`wardrobeAnchorsBySide`); off = byte-identical (golden fixtures pass); nightly-dreams v286, generate-dream v344
- [x] A/B renders on Kevin's account (`qa-location.js --gendered on|off`): 6 cards self + 3 couples + 4 whimsical re-checks.
      OFF handed the man a women's pick on 5 of 6 cards (organza robe, corset-jacket, side-slit gown, plunging bodysuit,
      taffeta gown) and Crystal Caverns rendered the sheer robe again; ON drew from WARDROBE_MEN every time and every man
      rendered in menswear; women drew their own list. Couples unchanged apart from the known plain-backdrop / degrade issues.
- [ ] Kevin's flip: `UPDATE public.engine_config SET nightly_gendered_wardrobe = true WHERE id = 1;` (rollback: false)
