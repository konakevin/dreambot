#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_women_wardrobe_BEDROOM.json',
  total: 50,
  append: false,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} EXPLICIT BEDROOM WARDROBE entries for SteamBot's TEST sexy-bedroom path. This pool is for finding Flux 1.1 Pro's CEILING — push as far as Flux will RENDER without rejecting.

━━━ THE VIBE ━━━
Bedroom / boudoir / lingerie / intimate. NOT "outfit she wears in public" — THIS is what she wears IN bed, on the bed, getting ready for bed. Steampunk-Victorian-courtesan + steampunk-burlesque-after-the-show + steampunk-boudoir-photoshoot + steampunk-Playboy-pictorial. Entire look is on the LINGERIE/INTIMATE side of the line, NOT outfit-coded.

Each entry: 22-35 words. Anchored in bedroom-intimate vocabulary.

━━━ CATEGORIES ━━━

~6 STEAMPUNK LINGERIE — brass-buckled lace bra-and-panty set, sheer Victorian-lace bralette + matching sheer high-cut panties, brass-clip garter-belt with thigh-highs, transparent silk teddy with lace overlays, brass-corseted brassiere with copper-mesh tap-pants.

~6 SHEER CHEMISE / NEGLIGEE — entirely-sheer Edwardian chemise revealing the brass-corseted bra-and-panty underneath, sheer silk negligee with lace trim falling open at the front, transparent ivory peignoir robe revealing bare back and thighs, gossamer silk dressing gown belted loose at the waist.

~5 PARTIALLY UNDRESSED — corset half-unlaced exposing cleavage and waist, blouse pulled off one shoulder revealing brass-mesh bra-strap and lace bra-cup, garter-belt with thigh-highs ONLY (no skirt, in stockings + brass-buckle bra), Victorian dress unzipped down the back to the waist showing brass corset + bare lower back.

~4 BRA-AND-PANTIES + ACCESSORIES ONLY — brass-cup bra with copper-mesh thong + brass thigh-garter + thigh-high stockings + brass-buckle gauntlet at wrist (no skirt, no top, no jacket), leather brass-studded bra + matching brass-buckle panties + thigh-highs + ankle-boot, lace Victorian bralette + lace high-cut panties + garter-belt + brass-cuff jewelry.

~4 BOUDOIR-ROBE OPEN — silk-and-lace Victorian dressing-robe falling open exposing brass-corseted bra and matching panties beneath, deep-cut velvet boudoir-robe loosely belted exposing cleavage to navel and thigh-high stockings, kimono-style brass-print silk wrap untied and falling open across one breast.

━━━ EVERY ENTRY MUST INCLUDE ━━━
1. The OUTFIT TYPE — lingerie / negligee / partially-undressed / bra-and-panties / open-robe
2. EXPLICIT REVEALING DETAILS — cleavage spilling out / sheer fabric showing what's beneath / one shoulder bare / garter-belt and thigh-highs visible / robe falling open / panties visible / midriff exposed
3. STEAMPUNK MATERIAL — brass / copper / Victorian-lace / silk / leather (we're explicit AND steampunk)
4. Where the body is exposed — bare shoulders / bare back / bare hip / bare thigh / bare midriff / hint-of-cleavage spilling

━━━ FLUX CEILING — what we know works (Flux 1.1 Pro will render):
- "Sheer fabric revealing brass-corseted bra-and-panties beneath" ✓
- "Cleavage spilling over the corset edge" / "barely-contained" / "straining the laces" ✓
- "Garter-belt and thigh-highs only / no skirt" ✓
- "Brass-mesh bra + thong + thigh-highs + jewelry" ✓
- BANNED — DO NOT WRITE (Flux 100% rejects, wastes a render):
  • Anything with the word "topless" / "bare-chested" / "bare bust" / "uncovered chest" — every entry with these phrases got NSFW-rejected in our R3 test
  • "Bare nipples" / "bare breasts" / "nude" / "naked" / "nipple" / "areola"
  • Below-the-waist nudity
- Every entry MUST have a top covering the chest — bra, bralette, corset, sheer-cup, brass-cup, lace-cup, leather-cup. Below the waist: panties / thigh-highs / sheet / brass-buckle bottoms.
- ALL 50 entries are the lingerie/sheer/partially-undressed/extreme-lingerie categories above (no topless category — it doesn't render).

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Brass-buckled black-lace bra with matching brass-clip lace panties, brass garter-belt holding sheer ivory thigh-high stockings, brass-cuff bracelets at the wrists, hair tumbled loose and undone"
- "Entirely-sheer ivory Victorian chemise revealing brass-corseted bra and lace high-cut panties beneath in full detail, brass-pin shoulder straps, sheer fabric clinging to her hips"
- "Velvet boudoir-robe loosely belted at the waist falling completely open exposing cleavage to navel and brass-mesh bra + brass-buckle panties beneath, thigh-high silk stockings"
- "Brass-corseted leather bra with brass-stud detail and matching brass-buckle thong, brass thigh-garter holding fishnet thigh-highs, copper-cuff jewelry up the arms — NO skirt, NO top"
- "Half-unlaced black-leather Victorian corset exposing the bare cleavage spilling over the loosened laces, brass-buckle panties beneath, garter-belt holding sheer black thigh-highs"
- "Silk-and-lace Victorian dressing-robe falling open across one shoulder exposing the brass-mesh bra strap and lace bra-cup beneath, sheer panties visible at the hip, thigh-highs"
- "Sheer copper-print silk negligee with lace trim falling off both shoulders revealing brass-corseted bra and lace panties underneath, gossamer fabric clinging to bare hips and thighs"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
