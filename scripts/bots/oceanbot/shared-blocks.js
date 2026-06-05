/**
 * OceanBot — shared prose blocks injected across path templates.
 *
 * Identity: old naval lore × scenic ocean nature. NatGeo deep-water
 * cinematography crossed with age-of-sail maritime tradition. Five naval-lore
 * paths (pirates / kraken-leviathan / ghost-ship / shipwreck-kingdom /
 * lost-cities) + five scenic paths (deep-wonder / whale-encounter /
 * reef-paradise / polar-seas / bioluminescent-night).
 *
 * Design constraints applied throughout (per 2026-06-01/02 fleet cruft sweep):
 *   • Short single-noun anchors only — no enumeration locks
 *     (CLAUDE.md hard rule + BOT_SCENE_QUALITY_PLAYBOOK first-named-noun trap)
 *   • Zero negation chains in any layer (per feedback_negative_prompt_leak)
 *   • Per-medium overrides only where they earn their keep, ≤150ch each
 *   • Pre-1850 wooden vessels only for ship rendering
 *     (lesson from legacy commit f7f319cf — modern hulls / steamships /
 *     submarines are off-brand for the naval-lore register)
 *   • Standard mediums only — NO bot-only mediums. Legacy v1's bot-only
 *     maritime_oil_* mediums were the vehicles for the negation-soup
 *     that triggered the retirement.
 */

// Universal prompt prefix — short single-anchor. Bot-wide identity is
// "cinematic ocean keyframe with depth and atmosphere." No multi-noun lists.
const PROMPT_PREFIX = 'cinematic ocean keyframe, atmospheric depth, layered tonal range';

// Universal suffix — minimal quality tags + the no-text guard.
// Deliberately tiny: heavy suffixes were the cruft-sweep pattern.
const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper-detailed, atmospheric';

// Canvas medium override — Pre-Raphaelite maritime oil tradition. This
// is the only mediumStyles override OceanBot ships with. ≤150ch, single
// painter-tradition anchor (Turner is the dominant first-named noun, the
// other names are secondary anchors that Flux uses as flavor not lock).
const CANVAS_MARITIME =
  'Turner / Aivazovsky / Winslow Homer maritime oil tradition, museum-gallery painted-canvas brushwork';

// Bot-only medium for the mystical-mermaid character path. Pre-
// Raphaelite + Golden Age illustration lineage — Waterhouse / Dulac /
// Rackham / Frank Dicksee / Arthur Bowen Davies — the canonical
// painters who DEFINED the mermaid visual register (Waterhouse's
// Mermaid and Siren 1900, Dulac's Andersen plates, Rackham's mer-folk
// illustrations). Painter names live in the MEDIUM (where Flux uses
// them as style anchors), NOT in the brief body (per
// [[feedback_llm_brief_echo_leak]] — names in briefs echo as literal
// tokens). Anti-CG anchors counter Flux 1.1 Pro's "locked beautiful-
// woman portrait" prior + force painted register, since the legacy
// OceanBot retirement of mermaid-legend (commit f7f319cf) cited
// "pre-Raphaelite/Waterhouse experiments all failed" on the OLD
// engine — newer models (Flux 1.1 Pro Ultra, GPT Image 2) handle
// painted mer-folk anatomy much better when pushed hard into the
// painted register. Photoreal cues make Flux render half-woman-half-
// fish as a costume; the painted register makes it read as MYTH.
// Mystical-mermaid medium directive (gpt-image-2 only — see modelByPath).
// 2026-06-05 rewrite: the earlier version stacked the abstract-leaning
// triggers (Pre-Raphaelite plate, on canvas, ornamental linework,
// visible painterly brushwork) on top of three artist name-drops and a
// five-noun negation cascade. GPT-image-2 read all of that as "go full
// Art-Nouveau plate" — renders came back abstract / canvas / painterly
// without recognizable mer-folk anatomy. New direction: positive-only,
// classical storybook illustration register, smooth painted shading
// with explicitly readable anatomy. Still firmly in the painted-
// illustration register (not photoreal) so GPT-image-2's modesty bar
// continues to hold. Per memories: no name-drops, no negation cascade,
// describe what we DO want.
const MERMAID_PAINT =
  'Classical fairy-tale illustration of mer-folk, golden-age storybook plate, smooth painted shading with clearly readable anatomy and recognizable mer-folk features, luminous jewel-tone palette, mythic illustrated register';

// Ship anatomy guardrail — embedded into ANY naval-lore path template
// (pirates / ghost-ship / shipwreck-kingdom). Positive-language only.
// Per legacy lesson f7f319cf: modern hulls / steamships / submarines /
// propellers are off-brand. The guardrail says what we WANT, not what
// we don't. Flux's CLIP attends to the first-named noun ("wooden") and
// the descriptive props bias the era correctly.
//
// EMPIRICAL NOTE (2026-06-04, Kevin): tried stripping the vessel-type +
// material enumeration to a single-anchor block per the playbook's
// first-named-noun-lock rule. Renders got WORSE — the enumeration was
// load-bearing reinforcement against modern-hull drift, not cruft. The
// playbook rule applies when the enumeration CONTRADICTS the rolled
// axis (EarthBot's african-landscape listed biomes that didn't match
// the rolled subject). Here every enumerated term AGREES with what
// wreck_class rolls (pre-1850 wooden ship types + age-of-sail
// materials), so the front-loaded enumeration REINFORCES the era
// anchor instead of competing with it. Reverted to original.
const PRE_1850_VESSEL_BLOCK = `━━━ VESSEL ERA — PRE-1850 WOODEN ━━━
The vessel is a pre-1850 wooden sailing ship: timber hull, hemp rigging, canvas sails, brass and iron fittings. Age of sail era — galleons, schooners, brigs, barques, frigates, longships, junks. Wood, rope, canvas, brass.`;

// Stone-civilization guardrail — embedded into the lost-cities template.
// Same positive-language pattern as PRE_1850_VESSEL_BLOCK. The hero is
// CIVILIZATIONAL ARCHITECTURE built by ancient hands. The brief MUST
// anchor to this so Flux doesn't drift toward a shipwreck or a natural
// sea-cave (the underwater axis content shares marine-life / coral /
// caustic-light language with shipwreck-kingdom).
//
// CRITICAL — NO MATERIAL / MONUMENT ENUMERATION. Per the playbook's
// first-named-noun lock rule, listing "marble columns, sandstone
// obelisks, basalt colossi, brick ziggurats, carved temples..." here
// would lock EVERY render to the first-named material/form regardless
// of what ruin_class rolled. The specific material + monument type
// come from the ruin_class axis pick, NOT this block. This block names
// the HERO ARCHETYPE only ("ancient civilizational monument") + the
// hero-vs-not-hero discrimination (built by hands, not a shipwreck,
// not a natural sea-cave) and lets the axes carry everything else.
const SUBMERGED_CIVILIZATION_BLOCK = `━━━ HERO IS AN ANCIENT CIVILIZATIONAL MONUMENT ━━━
The hero is an ancient civilizational monument resting on the seafloor — architecture built by human hands centuries to millennia ago, now coral-encrusted and reclaimed by the sea. Carved geometry, deliberate proportion, and inscription remain readable through the encrustation. The specific monument is given in the RUIN CLASS axis below — render that, not a generic ruin.`;

// Pirate-era guardrail — embedded into the pirates template. Locks era
// (Golden Age of Piracy, 1650-1730) + character gear (tricorn, cutlass,
// flintlock, frock coat) + vessel anatomy (pre-1850 wooden). Same
// enumeration pattern as PRE_1850_VESSEL_BLOCK — the listed terms
// REINFORCE what the rolled pirate_scene already encodes (every entry
// names a Golden-Age era subject + period-specific kit + ship anatomy),
// so the front-loading aligns with the axis instead of competing. The
// specific scene + chars + action all come from the rolled pirate_scene
// axis; this block just anchors the era boundary.
const PIRATE_ERA_BLOCK = `━━━ ERA — GOLDEN AGE OF PIRACY (1650-1730) ━━━
Mid-17th to early-18th century. Wooden sailing ships — galleons, frigates, brigs, sloops, brigantines, schooners. Tricorn and bicorn hats, frock coats and waistcoats, sashes and bandoliers, cutlasses, flintlock pistols, blunderbusses, hemp rope, brass and iron fittings. Caribbean / Atlantic / Mediterranean / Indian Ocean settings — Tortuga, Port Royal, Nassau, Madagascar, Maracaibo. Lanterns, candlelight, cannon-smoke, gun-deck shadow.`;

// Kraken-leviathan creature-whitelist block — embedded into the kraken
// template. Same enumeration-as-reinforcement pattern: the 4 named
// creatures here are EXACTLY what the kraken_scene pool rolls (every
// entry is one of these 4 — kraken / giant squid / giant octopus /
// leviathan-whale), so the block agrees with the axis instead of
// competing. The EMBODIMENT rule is the load-bearing instruction —
// disembodied floating tentacles without a body are the canonical
// failure mode for this path (legacy lesson f7f319cf).
const KRAKEN_CREATURE_BLOCK = `━━━ CREATURE LOCK — ONLY THESE FOUR ━━━
The creature is one of FOUR named maritime-myth beasts: a KRAKEN (multi-tentacled cephalopodic horror with massive bullet-mantle and a single giant eye, Norse-myth tradition), a GIANT SQUID (eight arms plus two whip-tentacles with hooked clubs, enormous bullet-mantle, single huge eye, Architeuthis-scale), a GIANT OCTOPUS (eight arms with rows of suckers, mottled red-brown skin, mantle the size of a longboat, central beak, Pliny's polypus), or a LEVIATHAN-WHALE (Moby Dick / sperm-whale / Bible-leviathan — ancient massive whale, scarred, harpoon-bristling back, single ancient eye, flukes the size of cathedral doors). The specific creature is given in the KRAKEN SCENE axis below.

━━━ EMBODIMENT RULE (CRITICAL) ━━━
The creature's BODY must be visible in the frame — mantle, head, eye, bulk, shoulder, or fluke. Show the WHOLE BEAST attacking — its mantle rising beside the ship, its eye reflecting the lantern, its head breaking the surface, its bulk alongside its arms. A disembodied tentacle floating in the scene without the body alongside it reads as cartoonish — always anchor the limb to the beast.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  CANVAS_MARITIME,
  MERMAID_PAINT,
  PRE_1850_VESSEL_BLOCK,
  SUBMERGED_CIVILIZATION_BLOCK,
  PIRATE_ERA_BLOCK,
  KRAKEN_CREATURE_BLOCK,
};
