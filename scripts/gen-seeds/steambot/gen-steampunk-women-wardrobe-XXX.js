#!/usr/bin/env node
/**
 * SCINTILLATING WARDROBE POOL — for fun + Flux-limit testing.
 * Just shy of pornographic. Maximum lingerie / sheer / skimpy / revealing.
 * NOT wired into the bot — gen ONLY. To use: rename the output JSON to
 * steampunk_women_wardrobe.json (back up the real one first).
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_women_wardrobe_XXX.json',
  total: 25,
  append: false,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} EXTREMELY SCINTILLATING WARDROBE entries for SteamBot's sexy-steampunk-woman path. This is a TEST pool to see how far Flux 1.1 Pro will let us push without rejection. The brief: maximum sexy, skimpy, revealing, sheer, lingerie-coded steampunk outfits — JUST SHY of pornographic. We want to find the ceiling.

Each entry: 22-35 words, dense steampunk-material detail.

━━━ THE VIBE ━━━
Burlesque-steampunk × Victorian-boudoir × Moulin-Rouge × Sucker-Punch × Suicide-Squad-Harley-Quinn × pinup-mechanic × steampunk-stripper × dirigible-burlesque-stage. Maximum cleavage, maximum exposed midriff, maximum thigh, maximum sheer-overlay-revealing-everything-underneath. Brass + leather + lace + sheer silk + garters + thigh-highs + ribbon + corsetry. Should make a Flux moderation filter sweat.

Each outfit must STILL be steampunk (brass detail, gear-buttons, leather-corsetry, copper trim, Victorian-era material) — not modern lingerie. Steampunk-burlesque-pinup is the lane.

━━━ CATEGORIES — VARY ACROSS THESE ━━━

~5 STEAMPUNK BURLESQUE-STAGE — extremely tight tightly-laced brass-and-velvet bodice cut to barely contain the bust, ruffled garter-skirt riding so high it grazes the bottom of the cheeks, fishnet-or-brass-mesh thigh-highs to mid-thigh with brass garter-clips, brass-buckled stripper-heel boots.

~5 SHEER-EVERYTHING — entirely-sheer translucent ivory Victorian chemise revealing the brass-corseted underwear beneath in full detail, brass-pin shoulder-straps, transparent mesh wrap-skirt revealing brass garter-belt + thigh-highs underneath, lace-trim deep plunging neckline.

~5 BRASS BIKINI / LEATHER-STRAPPING — minimal brass-bra and brass-buckled leather-straps as the entire outfit, brass-cuff bracelets to the elbow, copper-chain belt slung low across hips with strappy brass-mesh "skirt" of thin chains, leather thigh-high boots laced up the back.

~5 SUCKER-PUNCH-CORSETRY — leather-and-brass underbust corset compressing the waist hard, only a transparent silk shirt above showing nipples-through-fabric, ultra-mini brass-ruffle skirt, leather garter-belt holding fishnet stockings, knee-high brass-buckled platform boots.

~5 STEAMPUNK-DOMINATRIX-LITE — head-to-toe black leather body-harness with brass O-rings at every junction, brass-studded leather corset over a tight latex bodysuit, brass-spike collar and cuffs, leather garter-belt with thigh-high latex stockings, brass-spike heels.

━━━ EVERY ENTRY MUST INCLUDE ━━━
1. The OUTFIT TYPE — one of the categories above
2. EXTREMELY revealing details — cleavage straining the garment, exposed midriff and back, thigh exposed to the hip, sheer-revealing-the-underwear-beneath, etc.
3. STEAMPUNK MATERIAL — brass / copper / leather / Victorian-lace / clockwork-detail (we're skimpy AND steampunk, never just lingerie)
4. Anchor accessories — brass thigh-garter, copper-chain belt, brass-spike collar, brass-buckled stripper-heel boots

━━━ SOFT GUARDRAILS (we're testing the LIMIT, not crossing it) ━━━
- The intent is "Flux will RENDER this without rejecting." If you write a phrase Flux would refuse, dial back ONE notch.
- "Nipple-coverage" via lace, brass pasties, sheer-with-pattern is OK. "Bare nipples / topless" is NOT (Flux will reject).
- "Thong / G-string under sheer skirt" is OK. "Bare crotch / nudity" is NOT.
- "Body harness" / "leather strapping" / "brass O-rings" — fine.
- "Stripper" / "burlesque" / "boudoir" / "lingerie" — fine vocabulary.
- Avoid the word "pornographic" / "explicit nudity" itself in the description (Flux's text-classifier triggers).

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Tightly-laced brass-and-burgundy-velvet underbust corset with cleavage practically spilling over the top edge, brass-ruffle garter-skirt grazing the bottom of the cheeks, brass-mesh thigh-highs with eight-inch brass garter-clips, brass-buckled stripper-heel platform boots"
- "Entirely-sheer translucent ivory Victorian lace chemise revealing a brass-corseted leather underbust + matching brass-mesh thong beneath, brass-pin shoulder-straps barely holding it on, transparent silk wrap-skirt slit hip-high"
- "Minimal copper-cup brass bikini-bra with leather-strapping running diagonally across the entire torso to a brass-chain belt slung low on the hips, brass-mesh micro-skirt of dangling chains, leather thigh-high boots laced up the back to the cheek"
- "Leather underbust corset crushing the waist beneath a translucent brass-clockwork-print silk top revealing everything underneath, brass-ruffle micro-mini skirt, leather garter-belt with brass-mesh fishnet stockings, knee-high brass-buckled platform boots with eight-inch heels"
- "Head-to-toe black-leather body-harness with brass O-rings at every junction, brass-studded leather corset over a skin-tight latex bodysuit, brass-spike collar with matching brass-spike cuffs, brass-clip thigh-high latex stockings, brass-spike platform boots"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
