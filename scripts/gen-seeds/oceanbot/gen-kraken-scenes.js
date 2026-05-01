#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/oceanbot/seeds/kraken_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MARITIME LEGENDARY-CREATURE descriptions for OceanBot's kraken-leviathan path. Each entry is one cinematic scene of a real maritime-fable creature attacking, surfacing near, or threatening a wooden ship.

Each entry: 15-25 words. ONE specific dramatic moment.

━━━ CREATURE TYPES — ONLY THESE FOUR (mix broadly across all entries) ━━━
1. **KRAKEN** — multi-tentacled cephalopodic horror. The MASSIVE BODY (mantle / head / eye) must be visible or rising alongside the tentacles. Norse-myth tradition.
2. **GIANT SQUID** (architeuthis / colossal squid) — eight arms + two whip-tentacles with hooked clubs, enormous bullet-mantle, single huge eye reflecting lantern light. The BODY must be visible — head + eye + at least part of the mantle.
3. **GIANT OCTOPUS** — eight arms with rows of pale suckers, mottled red-brown skin, mantle the size of a longboat, climbing over decks. The BODY (mantle + head) must be visible alongside the arms.
4. **LEVIATHAN-WHALE** — Moby Dick / sperm whale / Bible-leviathan tradition: massive ancient whale of impossible scale, scarred, harpoon-bristling back, single ancient eye examining the ship, rising entire bulk beside a galleon, flukes the size of cathedral doors.

━━━ ABSOLUTELY BANNED (NEVER use these) ━━━
- NO disembodied / floating / standalone tentacles. The CREATURE'S BODY must be visible or visibly rising in the same frame. NO "tentacle rises beside the ship" without the squid/octopus/kraken body present.
- NO sea serpents, sea-snakes, wyrms, eel-like creatures, serpentine bodies, snake coils. ZERO.
- NO dragons, sea-dragons, dragon-turtles, lung dragons.
- NO megalodons or modern shark species (those are sea-creatures path).
- NO mermaids (mermaid-legend path).
- NO fish, manta rays, or non-mythic ocean wildlife (sea-creatures path).
- NO mythic-mammals other than leviathan-whale (no kelpies, hippocamps, centaurs).
- NO modern motor ships, submarines (era is wooden sailing ships only).

━━━ THE EMBODIMENT RULE (CRITICAL) ━━━
Every entry MUST make the creature's body visible. Examples of how:
  - "Kraken's massive bullet-mantle rises behind the schooner, eight arms gripping the rigging, single eye reflecting the lantern flame"
  - "Giant squid surfaces broadside to the longboat: ten-foot bullet-mantle, lidless eye, two whip-tentacles cresting alongside its eight arms"
  - "Giant octopus mantle pulses red beside the galleon's hull, eight arms climbing the bowsprit, central eye fixed on the sailors above"
  - "Leviathan-whale rises full bulk beside the frigate, scarred grey flank towering past the mainmast, ancient eye examining the deck"

NEVER write "a tentacle erupts" — write "the kraken's tentacle erupts (and its head/mantle is visible behind / its bulk surfaces with it)".

━━━ SHIP CONTEXT ━━━
The ships under attack are pre-1850 wooden sailing vessels — galleons, schooners, frigates, whaling ships, junks, longships. Wooden hulls, masts, sails, lanterns, harpoons. NO modern vessels.

━━━ RULES ━━━
- SCALE is everything — the creature dwarfs the ship
- Specific dramatic moments, not generic "big monster"
- Mix creature types — roughly 40% kraken, 20% giant squid, 20% giant octopus, 20% leviathan-whale
- Vivid, cinematic, mythic register — like an old maritime engraving brought to life
- Reference real fables: Norse kraken, Moby Dick, Pliny's polypus, the Bible's leviathan, Verne's Twenty-Thousand-Leagues
- Each entry MUST clearly identify which creature type by its visible body anatomy (mantle / head / eye / mantle-color / fluke / harpoon-scar)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
