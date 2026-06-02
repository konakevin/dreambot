#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/train_consists.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `Write ${n} INDIVIDUAL HO-scale or N-scale model-railroad TRAIN CONSISTS for ToyBot's model-train-world path. Each entry = ONE specific train (era + engine type + cars pulled). NO HUMAN FIGURES. 10-18 words per entry.

━━━ HARD ANTI-BIAS RULES ━━━
- MAX 22% steam-locomotives across pool (Sonnet's default — keep restrained).
- HEAVY variety across eras:
  • 1880s frontier (wood-burning steam, brass-fittings, cow-catcher, tall stack, link-and-pin couplers)
  • 1900s passenger express (4-4-2 Atlantic, varnished-wood pullman cars, brass railings)
  • 1920s art-deco streamliner (silver-bullet streamline, observation-car-with-glass-roof, steel-passenger-cars)
  • 1940s wartime freight (USRA heavy-Mike, gondolas, troop-sleepers, drab-olive boxcars)
  • 1950s diesel transition (F-units, ALCO PAs, Pullman-Standard passenger consist)
  • 1960s diesel mainline (GP-9, SD-7, BLE-style, mixed-freight, refrigerator reefers)
  • 1970s autorack era (boxcars covered in graffiti, autoracks, diesel SD-40)
  • 1980s intermodal (AC-traction diesels, double-stack containers, COFC flat-cars)
  • Modern intermodal/freight (ES44AC, 60-foot tank-cars, well-cars)
  • Special types: cog-railway, narrow-gauge logging, electric-interurban-trolley, monorail-style, geared-Shay-or-Climax, push-pull commuter
- Vary RAILROADS: generic-shortline (no IP), midwest-branchline, mountain-pass, harbor-switching, transcontinental, narrow-gauge-mining, prairie-grain, coastal-passenger, alpine-cog, suburban-commuter.
- Vary CONSIST CARS: boxcars, passenger-cars (coach / sleeper / dining / observation), coal-tenders, gondolas, hoppers, tank-cars, refrigerator-reefers, flatcars-with-logs, autoracks, well-cars, cabooses, work-trains, mail-cars, baggage-cars, Pullman, RPO.

━━━ FORMAT ━━━
Each entry is ONE train consist, 10-18 words, comma-separated phrases. Always reference HO-scale or N-scale or model-railroad or die-cast:
- "1880s wood-burning HO-scale steam-engine with brass tall-stack pulling four green boxcars and brass-tender"
- "1950s N-scale F-unit diesel pulling Pullman-Standard passenger consist with observation-car"
- "Narrow-gauge HO-scale geared Shay logging-engine pulling toothpick-log-stacked flatcars"
- "Modern HO-scale ES44AC intermodal pulling double-stack containers and well-cars"

━━━ BANNED ━━━
- HUMAN FIGURES of any kind (no engineers, no passengers visible)
- IP-named railroads (use generic regional / archetype only)
- Real photography references
- Identical entries

━━━ DEDUP RULE ━━━
- No two entries share ERA + ENGINE-TYPE + CONSIST-COMPOSITION exactly.
- Vary across the 200 entries.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
