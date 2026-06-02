#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_women_accessories.json',
  total: 100,
  append: true,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} ACCESSORY entries for SteamBot's sexy-steampunk-woman path. Each entry is a SHORT phrase (8-16 words) describing ONE signature accessory she's wearing or carrying — the small detail that makes her unmistakably HER.

This pool composes with separate skin/hair/eyes/makeup/wardrobe pools. The accessory should be small enough to fit naturally in the frame but distinctive enough to anchor identity.

━━━ ACCESSORY SPREAD (enforce variety across ${n}) ━━━
- OPTICAL / VISION (4-5) — multi-lens brass goggles pushed up on her brow, monocle on a brass chain that drops to her bodice, brass-rimmed pince-nez tucked into a breast pocket, jewelers-loupe goggle worn over one eye, brass-mesh aviator goggles dangling from one hand
- TIMEPIECE / NAVIGATION (4-5) — pocket-watch with multiple sub-dials chained to her belt, brass compass on a long lanyard, sextant slung at the hip, intricate astrolabe pendant at the throat, gear-faced wrist-mounted chronometer
- WEAPON / TOOL (4-5) — steam-rifle with copper accents slung across her back, pneumatic pistol at her hip, brass-plated dagger at her thigh, brass-handled wrench tucked through her belt, crackling Tesla-baton holstered at her shoulder
- MECHANICAL / PROSTHETIC (4-5) — brass-knuckled prosthetic hand catching firelight, partial brass clockwork-arm visible from elbow down, single brass mechanical eye where the right eye used to be, gleaming clockwork-leg visible below the skirt-hem, brass-plated jaw replacement glinting at the chin
- JEWELRY / IDENTITY (4-5) — gear-faced locket pendant at her throat, brass-and-amber earring drop, copper wedding-ring she still wears, signet-ring engraved with her family's industrial mark, simple leather choker with a small brass dragonfly clasp
- INSTRUMENT / TRADE (3-4) — leather-bound notebook stuffed with field-sketches at her belt, satchel of glass alchemical vials slung crossbody, rolled blueprint tucked under one arm, ink-stained writing-quill behind one ear

━━━ RULES ━━━
- Each entry is ONE signature object — not a pile of stuff
- Brass / copper / leather / glass / oil / gear materials only
- Anchors her identity — the accessory tells you WHO she is
- One entry MUST be a brass prosthetic of some kind (signature steampunk detail)
- No modern items (no smartphones, no tactical-modern weapons)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
