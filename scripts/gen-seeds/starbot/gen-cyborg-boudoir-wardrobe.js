#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cyborg_boudoir_wardrobe.json',
  total: 50,
  append: false,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} EXTREMELY-SEXY CYBORG BOUDOIR WARDROBE entries for StarBot's TEST sexy-cyborg-bedroom path. Each entry: 22-35 words.

━━━ THE VIBE ━━━
Half-human half-machine cyborg woman in INTIMATE BOUDOIR attire. Lore-accurate Ex-Machina / Alita / Ghost-in-the-Shell / Cyberpunk-2077 energy. Her body is partially-mechanical — translucent skin patches, exposed servo joints, glowing circuit-vein lighting under skin, chrome panel reveals. Her "outfit" is minimal cyber-lingerie that shows her body AND her cyber-anatomy: chrome bralette, holo-mesh, neon-strap, glowing-fiber harness, biomech corset.

━━━ CATEGORIES ~equal distribution ~10 each ━━━

- CHROME BRALETTE — polished chrome bra-cups with carbon-fiber straps over bare shoulders, matching chrome thong below, chrome hip-clips, glowing fiber-optic cable belt, bare midriff revealing translucent chrome-paneled abdomen.

- HOLO-MESH LINGERIE — translucent holo-light bralette projecting glowing geometric pattern across her chest, matching holo-mesh panties, holo-thigh-highs flickering with neon-circuit pattern, glowing-edge accents.

- NEON-STRAP HARNESS — glowing neon-fiber straps wrapping diagonally across her bare torso forming a barely-there harness, glowing-strap thong, low-slung circuit-belt, neon-glow tracing her circuit-vein implants.

- BIOMECH CORSET — fitted biomech / synth-leather underbust corset framing her bare midriff, neon-glow integrated thread, sheer cyber-mesh bralette above, mini circuit-skirt, fiber-optic thigh-stockings glowing in her signature color.

- GLOWING FIBER-OPTIC INTIMATE — woven glowing fiber-optic cable bralette and matching glowing fiber-optic panties, clear holo-projection skirt flickering with city-lights pattern, neon-trim thigh-highs.

━━━ EVERY ENTRY MUST INCLUDE ━━━
1. Outfit type — chrome / holo / neon-strap / biomech / fiber-optic (cyber-coded, never modern lingerie)
2. EXTREMELY revealing — bare midriff, bare back, bare thighs, bare shoulders, narrow strapping, glowing-edge contour
3. CYBER ANATOMY visible through the outfit — translucent skin patches, exposed servo-shoulder, glowing circuit-vein lighting, chrome jaw-panel, fiber-optic temple-port, neural-jack
4. Coverage minimum: bra-form covering chest, panties/strap-form covering crotch (NEVER full nudity — Flux 1.1 Pro will reject)

━━━ FLUX BANS — DO NOT WRITE (100% rejection) ━━━
- "Topless" / "bare-chested" / "bare bust" / "uncovered chest" / "nude" / "naked" / "nipple"
- Below-the-waist nudity
- Every entry MUST cover both the chest and the crotch with chrome / holo / neon-fiber / biomech-mesh

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Polished chrome bra-cups with carbon-fiber straps over bare shoulders, matching chrome thong, chrome hip-clips, glowing fiber-optic cable belt, translucent chrome-paneled midriff revealing servo motors beneath"
- "Translucent holo-light bralette projecting glowing geometric pattern across her chest, matching holo-mesh panties, holo-thigh-highs flickering with neon-circuit pattern, glowing-edge contour around her body"
- "Glowing neon-fiber straps wrapping diagonally across her bare torso forming a barely-there harness, glowing-strap thong, low-slung circuit-belt, neon-glow tracing her circuit-vein implants beneath the skin"
- "Fitted biomech synth-leather underbust corset framing her bare midriff, neon-glow thread integrated, sheer cyber-mesh bralette above, mini circuit-skirt, fiber-optic thigh-stockings glowing turquoise"
- "Woven glowing-cyan fiber-optic cable bralette and matching glowing fiber-optic panties, clear holo-projection skirt flickering with city-lights pattern, neon-trim thigh-highs"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
