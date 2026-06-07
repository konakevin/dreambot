#!/usr/bin/env node
/**
 * MECH-TOY-RAMPAGE story-beat pool — bespoke per-path (2026-06-06).
 * Articulated mech-toy combat register (Gundam / Zoids / Transformers / Power-
 * Rangers-megazord DNA, non-IP archetype only).
 * Verb-led, multi-mech, shared-event structure. MVP-25.
 */
const { generatePool } = require('../../lib/seedGenHelper');
const TOTAL = parseInt(process.env.TOTAL, 10) || 25;
const APPEND = process.env.APPEND === 'true';

generatePool({
  outPath: 'scripts/bots/toybot/seeds/mech_story_beats.json',
  total: TOTAL, batch: Math.min(TOTAL, 25), append: APPEND,
  metaPrompt: (n) => `You are writing ${n} MECH-TOY-RAMPAGE STORY-MOMENT scenarios for ToyBot's mech-toy-rampage path. The mechs are articulated robot-toys / Gundam-kit / transforming-mech / Zoids-style figures — visible ball-joint articulation, chrome-plated paneling, transformation seams, cockpit-canopy glow, snap-on weapon accessories. Handcrafted toy-photography sets. Non-IP archetype only (no Optimus Prime, no specific Gundam designation).

━━━ STRUCTURAL MANDATE (every entry, NON-NEGOTIABLE) ━━━
1. OPEN with an active verb (Charging / Firing / Crashing / Hurling / Slashing / Transforming / Smashing / Stomping / Vaulting / Detonating / Ejecting / Piloting / Tearing / Toppling / Rocketing).
2. Name ONE shared event 3-5 mechs are reacting to (an incoming missile-volley / a falling skyscraper / a transforming kaiju / a damaged power-core / a converging enemy squad / a downed allied mech / a charging beam-weapon).
3. HARD BAN: "mid-X", "frozen mid-X", "watching", "looking at", "gazing", "stands", "posed", any non-verb opener.
4. Present-tense-active throughout. 3-5 distinct mech archetype roles each doing a DIFFERENT verb.

━━━ FORMAT ━━━
60-90 words, semicolon-separated. Mech archetype roles: humanoid-mecha / transforming-car-mech / beast-form mech (lion / tiger / wolf / dragon) / powered-armor-exosuit / kaiju-class antagonist / chrome-megazord / drone-swarm. Toy-photography set context.

━━━ FAMILY SPLIT (5 sub-types ~20% each) ━━━
A) MECH-VS-MECH COMBAT (party of mechs vs enemy mech squad — sword-clash / missile-volley)
B) MECH-VS-KAIJU TAKEDOWN (party of mechs vs giant monster-toy)
C) TRANSFORMATION-SEQUENCE moment (mid-transform with cast reacting to the change)
D) CITY-DEFENSE / RESCUE (mechs defending toy-scale city / civilians from threat)
E) FORMATION-FLIGHT or COMBINER moment (multiple mechs combining or flying formation under attack)

━━━ PASS EXAMPLES ━━━
- "Firing the chest-cannon into the kaiju's belly as the humanoid-mecha braces against the recoil — the transforming-car-mech vaults over a collapsed Hot-Wheels-scale skyscraper to flank, the beast-form tiger-mech leaps at the kaiju's ankle clawing, the chrome-megazord swings a massive plasma-sword from the right, the kaiju's tail crashes through a toy-scale parking lot scattering plastic cars"
- "Transforming mid-air as the alarm-klaxons of the incoming missile-volley sound across the toy-city diorama — the transforming-car-mech splits its plates mid-mid-flip becoming a humanoid configuration, the powered-armor-exosuit deploys a shield-array overhead, the humanoid-mecha shoves a wounded ally-mech behind a building-fragment for cover, the dragon-mech roars unleashing a flame-wash to detonate the missiles early"

━━━ FAIL EXAMPLES ━━━
- "Gundam-style mech mid-stance frozen on diorama…" ← pose + noun opener + IP-name leak

━━━ HARD BANS ━━━
- NO IP names (no Optimus Prime / Megatron / Bumblebee / Voltron / Liger-Zero etc.) — generic archetype only
- NO real soldiers, NO CGI, NO illustration
- NO solo mechs — 3+ cast minimum

JSON array of ${n} strings. Verb-led only.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
