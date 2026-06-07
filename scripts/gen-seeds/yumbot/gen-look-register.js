#!/usr/bin/env node
/**
 * YumBot LOOK_REGISTER — bot-wide visual-treatment axis (2026-06-06).
 *
 * Each entry is one CUTE / KAWAII visual register. The bot-level
 * rollSharedDNA picks one per render; the path template can use it as
 * the lead-in to break Flux's CLIP lock on a single look. All entries
 * stay 100% kawaii — only the MEDIUM varies (watercolor / claymation /
 * risograph / pixel / felt / vinyl / picture-book / etc.).
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/yumbot/seeds/yumbot_look_register.json',
  total: 25,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing ${n} CUTE / KAWAII VISUAL REGISTERS for YumBot. Each entry describes ONE distinct visual treatment (medium + finish) that the WHOLE render uses — but every entry STAYS very cute and kawaii. The variation is in the MEDIUM, not the cuteness.

Each entry: 20-32 words. Open with the medium archetype noun, then describe surface qualities + palette tilt + finish.

━━━ DISTRIBUTION — MANDATORY (vary across ALL of these) ━━━

The 25 entries cover these cute-kawaii visual treatments — write at least 1-2 of each:

- POP-MART DESIGNER VINYL (glossy pearlescent 3D collectible)
- CLAYMATION STOP-MOTION (felt / burlap / paper / soft handcraft warmth)
- WATERCOLOR KAWAII ILLUSTRATION (paper texture, gentle pigment washes)
- PASTEL GOUACHE KAWAII (flat painterly shapes, modern picture-book)
- CHILDREN'S PICTURE-BOOK ILLUSTRATION (cozy crayon-and-watercolor)
- GHIBLI-STYLE CEL-SHADED KAWAII (soft anime, gentle linework)
- RISOGRAPH PRINT KAWAII (limited pastel palette, halftone texture)
- 16-BIT PIXEL KAWAII (chunky grid pixels, soft retro palette)
- KAWAII PAPER-CUT / ORIGAMI (folded-paper layers + cut-out depth)
- KAWAII FELT / EMBROIDERED HANDCRAFT (stitched fabric, yarn details)
- KAWAII MOCHI / SQUISHY SOFT 3D (rounded soft squishy texture)
- KAWAII CERAMIC FIGURINE (glazed porcelain, hand-painted detail)
- KAWAII COLORED-PENCIL ILLUSTRATION (soft pencil shading, paper grain)
- KAWAII MARKER + INK CARTOON (clean bold lines, flat fill colors)
- KAWAII STICKER / FOIL HOLOGRAPHIC (Lisa-Frank shimmer, glossy stickers)
- KAWAII WOODBLOCK PRINT (ukiyo-e-influenced, simple flat planes)
- KAWAII NEEDLEFELT PLUSHIE (soft fuzzy wool, hand-shaped)
- KAWAII PAPER-DIORAMA (cardstock layers, shadow-box depth)
- KAWAII STAINED-GLASS (leaded sections, jewel-tone translucency)
- KAWAII LINOCUT BLOCK PRINT (chunky carved-line texture, soft ink wash)

━━━ ENTRY SHAPE ━━━

Each entry is a comma-separated description, 20-32 words. Open with the medium archetype noun (e.g., "Soft watercolor kawaii illustration —", "Pop-Mart designer-vinyl kawaii figurine —", "Felt handcraft kawaii stop-motion diorama —"). Then describe:
1. Material / surface qualities specific to the medium
2. Palette tilt (cute-soft pastel base; can vary the accent)
3. Cute-kawaii face features baked in (smiling eyes / dot-blush / printed mouth on the subject)
4. Brief finishing note ("cozy warm charm" / "soft gentle hand-feel" / "glossy dewy collectible quality").

━━━ THE BAR — every entry must produce ━━━

- 100% CUTE / KAWAII feel — NEVER edgy, never gritty, never moody, never noir.
- Distinct VISUAL MEDIUM — Flux must render this entry differently from the other 24.
- Subject still has kawaii face features baked in (the medium changes; the cuteness stays).

━━━ PALETTE DISTRIBUTION — MANDATORY MIX ━━━

The 25 entries split across THREE palette tilts (vary palette tilt INDEPENDENTLY of medium so we get e.g. jewel-tone watercolor + pastel watercolor as two different entries):

- ~14 entries with SOFT PASTEL palette tilt (the default cute — blush / mint / lavender / cream / peach / baby-blue)
- ~6 entries with JEWEL-TONE palette tilt (rich saturated kawaii — sapphire / emerald / ruby / amethyst / topaz / garnet, still cute but VIVID)
- ~5 entries with FULLY-SATURATED VIVID palette tilt (Lisa-Frank energy — hot magenta / electric tangerine / cyan / chartreuse / fuschia, still cute but POPPING)

Jewel-tone and vivid-saturated entries stay 100% kawaii — the SUBJECT is still cute-smiling-faced, the PALETTE just goes rich and vivid instead of soft-pastel. Saturation is the only variable; cuteness is constant.

━━━ EXAMPLES ━━━

"Soft warm watercolor kawaii illustration — visible paper texture, gentle pigment washes, hand-drawn pencil-line outline, cozy children's-picture-book register with smiling dot eyes baked into every subject."

"Pop-Mart designer-vinyl kawaii figurine — glossy pearlescent surface, subsurface scattering, collectible-quality 3D render with soft pastel palette, dimpled-cheek blush and printed kawaii smile on the surface."

"Sackboy-style claymation kawaii stop-motion — felt and burlap textures with X-stitched seams, pipe-cleaner accents, tilt-shift toy photography warmth, soft button-eye smile on every kawaii subject."

"Pastel gouache kawaii picture-book illustration — flat painterly color blocks, gentle warm overlay, soft brushed edges, modern children's-magazine register with sweet dot-blush kawaii faces."

"16-bit pixel kawaii sprite render — grid-aligned chunky pixels, dithered soft shading, limited pastel JRPG palette, retro game-cute kawaii faces with pixel-square eyes."

"Risograph print kawaii — limited 3-color pastel palette (sof-pink + mint + cream), halftone texture overlay, slightly mis-registered ink layers, retro zine-print kawaii charm."

"Jewel-tone kawaii watercolor illustration — rich saturated sapphire-and-ruby pigment washes on cold-press paper, gold-leaf accents, gem-bright kawaii smiling faces, vivid handmade-luxury register."

"Lisa-Frank-style kawaii foil sticker — fully-saturated hot magenta and electric cyan rainbow shimmer, prismatic holographic surface, glittery vivid 90s sticker-book charm, popping kawaii grins."

"Vivid stained-glass kawaii panel — leaded sections of saturated jewel-tone glass (emerald + amethyst + topaz), backlit translucent glow, soft kawaii smiles glowing in deep jewel colors."

━━━ HARD MANDATES ━━━

- STAY KAWAII — every entry stays soft, cute, cozy, smiling.
- Distinct medium per entry — no two entries describe the same visual treatment.
- 20-32 words, comma-separated.

━━━ HARD BANS ━━━

- NO edgy / horror / noir / gritty / dark / cyberpunk / vampire / gothic register — only soft cute.
- NO photoreal tokens ("photograph" / "DSLR" / "f/2.8" / "hyperreal").
- NO camera-specific or lens specs.
- NO mention of specific food subjects (the scene pool carries food — this axis is the LOOK only).
- NO mention of specific scene settings (windowsill / counter / etc. — this axis is the LOOK only).

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
