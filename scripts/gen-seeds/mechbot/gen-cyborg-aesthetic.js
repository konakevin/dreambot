#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/cyborg_aesthetic.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} CYBORG AESTHETIC entries for StarBot's cyborg-woman and cyborg-man paths. Each entry is a DENSE phrase (25-50 words) describing the OVERALL VISUAL AESTHETIC of the cyborg's mechanical surfaces — the unifying style that ties together every panel, plate, joint, and circuit.

Each entry locks the AESTHETIC LANGUAGE so every render has a consistent material/finish/ornament tradition instead of bolting random mechanical parts together. The entry describes the LOOK AND FEEL of the cyborg's machine surfaces.

CRITICAL — gender-neutral. Each entry works for both male and female cyborg paths.

CRITICAL — describe SURFACE / MATERIAL / ORNAMENT / FINISH style. Do NOT describe specific body parts (those come from a separate axis). Describe HOW the metal looks, HOW circuits are arranged, WHAT material finishes dominate, WHAT ornament tradition the design follows.

━━━ AESTHETIC CATEGORIES (enforce variety across ${n}) ━━━

CLEAN FUTURIST (3-4):
- Smooth-polymer Ex Machina — frosted-glass body panels revealing humanoid skeletal frame beneath, minimalist clean futurist surfaces, soft white glow from within
- Apple-industrial-design aesthetic — seamless white ceramic with chrome accents, perfect lines, no visible seams, hidden mechanism behind smooth shells
- Liquid-metal mercury — chrome surfaces that shift slightly like fluid, no visible joints, perfect mirror-finish, almost organic-fluid mechanical look

ORNAMENT-HEAVY (3-4):
- Ornate steampunk-clockwork — brass and bronze plates with visible gear-trains, jeweled bearings, leather strapping at joints, baroque etched details
- Etched-copper baroque — aged copper plates with verdigris patina, hand-engraved arcane circuit-glyphs, ornate filigree edges, gothic-ornamental seams
- Art-nouveau bronze — flowing organic curves in bronze and gold, floral filigree, jeweled accent stones, decorative rather than militaristic

CIRCUIT-FORWARD (3-4):
- LED-tracery — glowing fiber-thin lines beneath translucent skin in geometric grids, soft cyan or amber pulses tracing every plate edge
- Holographic-overlay — projected light circuits floating ABOVE chrome surfaces, less physical more luminous, ghostly data streams over mirror metal
- Subdermal-glow — circuits visible THROUGH translucent skin from within, soft pulse-veins running like organic veins under flesh, biomechanical hybrid

INDUSTRIAL / MILITARY (3-4):
- Carbon-fiber matte stealth — black woven weave with rare red-LED accents, military-industrial finish, gun-metal joints, no decoration
- Riveted-iron utilitarian — exposed bolts and rivets, distressed brushed steel, oily seams, working-class machine aesthetic
- Battle-worn gunmetal — heavily scratched matte chrome, tactical paint, exposed servos at joints, scarred from use

CULTURAL / TRIBAL (3-4):
- Tribal-geometric — black ceramic plates etched with white tribal patterns, hexagonal cell arrangements, matte stone-like surfaces with luminous cracks
- Tattooed-skin biomech — organic-style tattoo patterns flowing across mechanical surfaces, ink-black against chrome, tribal lines glowing faintly
- Engraved-jade ceremonial — green jade panels with golden engraved symbols, ceremonial gold-leaf edging, eastern-priestly mechanical aesthetic

ORGANIC / BIOMECHANICAL (3-4):
- Crystal-grown — translucent biomechanical crystal lattice, organic-meets-mineral, panels that look grown rather than manufactured, prismatic light through every surface
- Coral-bone — bone-white surfaces with porous coral-like texture, organic-curved mechanical joints, biomechanical-grown look like H.R. Giger
- Wood-and-chrome arboreal — polished dark wood panels alternating with chrome, ironwood-grain visible, ent-like organic-mechanical fusion

MINIMAL / EXPRESSIONIST (3-4):
- Brushed-titanium minimalist — single-tone matte titanium across every surface, no glow no decoration, sculptural restraint
- Glassine-translucent — entire body translucent glass-like material, all internal mechanism visible always, like a complete X-ray of the machine
- Obsidian-mirror — black volcanic-glass surfaces, perfect reflective black with deep internal red-orange glow lines, gothic-futurist

━━━ RULES ━━━
- Each entry is ONE unified aesthetic vocabulary — tells the renderer "this is how every surface of this cyborg looks"
- 25-50 words — material + finish + ornament + light-quality + texture, all in service of one coherent visual identity
- NO specific body part references (no "left arm" or "spine") — that's a different axis
- NO franchise names (no Iron Man, no Geth, no Cyberman, no Borg, etc.)
- Gender-neutral — works for both male and female
- DISTINCTIVE — each entry should produce a visually different render from every other entry
- Variety across the 7 categories above mandatory
- Vivid, specific, paintable

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
