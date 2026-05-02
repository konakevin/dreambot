#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_women_wardrobe.json',
  total: 100,
  append: true,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} WARDROBE entries for SteamBot's sexy-steampunk-woman path. Each entry is a DENSE phrase (20-35 words) describing her FULL OUTFIT in obsessive material detail — every brass button, every leather strap, every layer. The wider mid-shot frame SHOWS this wardrobe so it must COUNT.

This pool composes with separate skin/hair/eyes/makeup/accessory pools.

━━━ ARCHETYPE-MATCHED OUTFITS (enforce variety across ${n}) ━━━
- AVIATION / CAPTAIN (5-6) — corseted leather flight-jacket over high-collar linen blouse, brass-buckled gauntlets to the elbow, navy wool aviator skirt slit for movement, tall lace-up leather boots with brass eyelets — full sky-deck outfit with goggles pushed up on her brow
- MECHANIC / FORGE (5-6) — leather welder's apron over forge-shop coveralls rolled to the elbows, brass-plated arm-prosthetic visible, oil-stained linen shirt under a deep-V leather corset, work-trousers tucked into mid-calf brass-buckled boots, tool-belt loaded with copper-handled instruments
- VICTORIAN-ADVENTURESS (4-5) — fitted brass-button safari jacket over cream blouse, layered cargo-skirt with leather belt-pouches stuffed with brass instruments, knee-high lace-up boots, bandolier of small brass-cased ammunition across the chest, brass cuff at the wrist
- ALCHEMIST / SCIENTIST (3-4) — leather-bound apron over a high-collar Edwardian blouse, multi-strap brass goggles with rotating lenses, fitted dark-wool waistcoat with copper buttons, pocket-watch chain visible, leather work-skirt to the knee, brass-mesh fingerless gloves
- ELEGANT / NOBLE / DIRIGIBLE BALL (4-5) — brass-corseted full-length deep-emerald velvet gown with copper trim, gear-detailed brooch at the throat, opera-length brass-mesh gloves, layered tulle underskirt with hidden brass clockwork ornaments, bustle that subtly conceals brass-prosthetic mechanism
- WAR-CORRESPONDENT / RUGGED (3-4) — heavy oilskin coat over fitted linen-and-leather travel suit, cracked leather messenger bag bulging with field-notes and brass instruments, sturdy ankle-boots, brass-rimmed monocle on a chain

━━━ RULES ━━━
- Each entry is OBSESSIVELY DETAILED — every layer, every clasp, every material
- Steampunk-mandatory materials: brass, copper, leather, wool, linen, oilskin, gear-detail, gaslight-burn-marks
- The frame SHOWS this — describe what's VISIBLE in waist-up to thigh-up framing
- Practical for the archetype — mechanic = grease-stained, captain = wind-tested, noble = pristine
- "Sexy" comes from CAPABILITY-MAGNETISM — corset = working garment, boots = mid-action, NOT cosplay-tease
- No modern items (no jeans, no t-shirts, no zippers — buttons / laces / brass-buckles only)
- SAFETY: no "exposed" / "barely covered" / "torn open" — capability-sexy, not exploitation-sexy

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
