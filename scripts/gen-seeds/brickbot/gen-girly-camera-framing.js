#!/usr/bin/env node
/**
 * BRICKBOT_GIRLY_CAMERA_FRAMING — pastel/ultra-cute LEGO MOC camera angles.
 * Audit 2026-06-05: existing 10 entries — undersized. Target 200.
 * Path is PASTEL / candy-cute (LEGO Friends + DOTS + Elves) — the framing
 * must drive composition AWAY from the centered-eye-level Flux default and
 * INTO sweet, whimsical, "look at this whole tiny world" angles.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_girly_camera_framing.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} CAMERA-FRAMING entries for BrickBot's girly path — pastel-cute / ultra-whimsical / sparkle-pink LEGO MOC dioramas (candy castles, boutiques, unicorns, mermaids, fairy-ballet stages, ice-cream parlors, cupcake bakeries). The framing OVERRIDES Flux's centered-front-facing minifig default. Each entry is one CAPS prefix + em-dash + 22-32 word body describing the precise camera angle of a tabletop pastel-LEGO diorama photograph.

━━━ THE BAR ━━━
Every entry must tell Flux exactly where to put the camera, what's in the foreground, mid-ground, background, AND why this angle is the SWEET-WHIMSICAL drama beat. The framing pulls the eye through the candy-pastel world. Generic angles ("close-up", "wide shot") FAIL — name the specific staging.

━━━ VARIETY MANDATE (distribute roughly across these angle categories) ━━━
- ~4 TOWER-UP / VERTICAL — looking up at a candy-castle / sparkle-tower / spire-finial / unicorn-rainbow-arch dominating the vertical
- ~4 WINDOW / COUNTER / DISPLAY-CASE PEER — camera pressed to a boutique window / parlor counter / bakery glass case / vanity-mirror peering INTO a scene
- ~3 ARCHWAY / DOORWAY-THROUGH — framed BY a rose-arch / climbing-rose archway / heart-shaped portal / ribbon-bow gateway, the sweet beyond revealed
- ~3 CUTAWAY / DOLLHOUSE-OPEN — dollhouse-cutaway / open-back boutique / cake-cutaway showing furnished rooms / petal-cross-section
- ~3 RECEDING-AISLE / RUNWAY / STAIRCASE — receding perspective down a glitter-tile catwalk / spiral pearl staircase / petal-strewn aisle / ribbon-flanked walkway
- ~2 MINI-DOLL-EYE-LEVEL CROUCH — camera crouched to mini-doll height beside an enormous brick blossom / candy / pastry making the world feel huge and sweet
- ~2 OVERHEAD FLAT-LAY — directly above a tea-party / vanity / dessert spread / picnic arrangement, the pastel pieces laid out like a sweet flat-lay
- ~2 MIRROR / REFLECTION — vanity-mirror catching a mini-doll trying on a tiara / pond reflection of a unicorn / boutique mirror doubling a dress build
- ~2 LOW-ANGLE HERO — low at boardwalk/lawn level looking up at a fairy-stage / runway-strut / unicorn-rear / ballerina-leap, the subject heroic against pastel sky-baseplate
- ~2 BIRD'S-EYE BUILDING-INTERIOR — high over an open-roof cake shop / spa / boutique looking down at the cute staged scene below
- ~1 SHOULDER-PEEK BEHIND-A-MINI-DOLL — over a mini-doll's shoulder looking at the candy castle / cake counter / mirror she's facing
- ~1 BETWEEN-BRICK-FOREGROUND — framed BETWEEN two pastel column-builds / flower-stems / ribbon-bows in the immediate foreground

━━━ FORMAT ━━━
Each entry: ONE line, all-caps prefix (the framing name in 2-5 words separated by hyphens), em-dash, then a 22-32 word body. Body MUST include: foreground element, mid-ground subject, sweet pastel detail. Touchpoint examples:
"BOUTIQUE-WINDOW-DISPLAY — camera pressed to the brick boutique glass, peering in at tulle-dress builds draped on stands, the pastel street-glow casting soft reflections across the window-frame."
"CASTLE-TOWER-UP — camera hugging the candy-castle base, tilting up SNOT-curved lavender turrets past glitter-flag bricks to the rose-gold star-finial crowning a cotton-candy sky."
"DOLLHOUSE-CUTAWAY — camera square-on to the open dollhouse front, all four pastel furnished rooms exposed at once, each crammed with tiny brick vanities, rugs, and bouquets."

━━━ BANS ━━━
- NO centered eye-level front-facing default angles
- NO photoreal / real-photo language — every entry is for a brick diorama
- NO motion blur / tilt-shift (already allowed elsewhere; here the angle is the driver)
- NO licensed Disney named characters — only generic fairytale/unicorn/mermaid
- NO masculine vocab — this is the PASTEL ULTRA-CUTE path
- NO bland descriptors ("nice angle of...") — name the foreground, mid-ground, sweet detail

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with the all-caps prefix + em-dash.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
