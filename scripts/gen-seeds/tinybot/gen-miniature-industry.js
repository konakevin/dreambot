#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/tinybot/seeds/miniature_industry.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MINIATURE INDUSTRY scene descriptions for TinyBot — dollhouse-scale workshops, factories, train yards, construction sites, and maker spaces. The "wow, someone BUILT that" vibe. Every scene should feel like a master model-maker's proudest diorama.

Each entry: 15-25 words. One specific miniature industry scene with technical detail notes.

━━━ CATEGORIES (spread across all) ━━━
- Clockwork repair workshop (tiny gears, springs, magnifying loupes, watchmaker tools, brass fittings)
- Miniature factory floor (conveyor belts, stamping machines, quality control station, shipping dock)
- Tiny train yard (multiple tracks, switching signals, engine house, coal tender, water tower)
- Dollhouse-scale construction site (crane, scaffolding, half-built wall, cement mixer, tiny hard hats)
- Miniature blacksmith forge (anvil, bellows, glowing coals, horseshoes, hammer rack, leather apron)
- Tiny printing press (movable type, ink rollers, stacked paper, hanging drying prints)
- Miniature pottery studio (wheel spinning, kiln glowing, glazed pieces on shelves, clay tools)
- Dollhouse sawmill (log pile, circular saw, sawdust everywhere, stacked lumber, water wheel)
- Tiny glass-blowing studio (furnace, molten glass, finished vases + bottles, pipe rack)
- Miniature shipyard (hull on blocks, rigging supplies, tar pots, woodworking tools, dry dock)
- Dollhouse-scale brewery (copper kettles, barrel storage, hops drying, bottling line)
- Tiny cobbler workshop (shoe lasts, leather scraps, thread spools, tiny shoes on display)
- Miniature textile mill (looms, spinning wheels, dyed yarn hanging, fabric bolts)
- Dollhouse chocolate factory (tempering table, molds, wrapping station, cocoa beans)
- Tiny instrument maker (violins in progress, wood shavings, varnish pots, string coils)
- Miniature bookbindery (pages being sewn, gold leaf tools, leather covers, spine pressing)
- Dollhouse-scale telegraph office (clicking machines, wires, message slips, operator desk)
- Tiny candle-making workshop (wax pots, wick spools, drying rack, molds, tinted wax)
- Miniature map-maker's studio (parchment, compass, ink wells, drafting tools, globe)
- Dollhouse mining operation (ore cart tracks, pickaxes, lanterns, gem sorting table)
- Tiny toymaker workshop (half-assembled toys, paint pots, tiny tools, wooden blocks)
- Miniature distillery (copper stills, tubing, barrel aging room, testing beakers)
- Dollhouse-scale windmill interior (grinding stones, flour sacks, gear mechanism)
- Tiny luthier workshop (guitar bodies, fretboards, carving tools, tone wood)
- Miniature apiary (bee boxes, honey extraction, wax frame, smoker, jars)

━━━ RULES ━━━
- Technical obsession — every tool, every fastener, every material visible
- "Someone BUILT this" energy — handcrafted model-making pride
- Warm, inviting workspaces (not dystopian/grim factories)
- Tilt-shift miniature aesthetic always implied

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: industry type + specific activity + unique tools. "Clockwork workshop with gears" and "watch repair with springs" are TOO SIMILAR. "Clockwork workshop assembling a pocket watch" and "clockwork workshop calibrating a music box mechanism" are distinct.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
