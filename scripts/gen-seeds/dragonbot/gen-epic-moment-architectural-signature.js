#!/usr/bin/env node
/**
 * EPIC_MOMENT_ARCHITECTURAL_SIGNATURE — production scale-up 2026-06-05.
 *
 * Gated 50% accent axis for DragonBot's epic-moment path. Names the ONE
 * weird memorable detail baked INTO the castle's silhouette as a
 * specific named element with shape + scale + position — the readable-
 * focus that makes THIS castle distinct from every other fantasy castle.
 *
 * Examples: a dragon-skull mounted above the gatehouse, a floating tower
 * tethered by iron chains, a waterfall channeled through the gatehouse
 * arch, a crystal-spire erupting from the northeast tower.
 *
 * Append mode preserves the initial 25 hand-curated entries.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/epic_moment_architectural_signature.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 8000,
  metaPrompt: (
    n
  ) => `You are writing ${n} ARCHITECTURAL-SIGNATURE descriptions for DragonBot's epic-moment path. Each entry names ONE weird memorable detail that becomes a fantasy castle's signature feature — the readable-focus that makes THIS castle distinct from every other generic-fantasy-castle.

Each entry: 28-45 words.

━━━ THE BAR ━━━
The viewer should be able to PICK THIS CASTLE OUT OF A LINEUP because of this one detail. Generic-fantasy-castle has towers, walls, gates, spires. This signature is what ELSE the castle has — the dragon-skull gatehouse / the floating tower / the bone-archway / the crystal-spire / the lava-moat / the living-oak fifth tower / the obsidian-glass mirror tower. The detail must be SPECIFIC, NAMED, with SHAPE + SCALE + POSITION on the castle, and READABLE in a wide-shot.

━━━ EVERY ENTRY INCLUDES ━━━
1. A SPECIFIC SIGNATURE ELEMENT (named noun — flying buttress / crystal-spire / bone-archway / dragon-skull / floating tower / waterfall / drawbridge / cantilevered balcony / lattice tower / volcanic-glass spire / colossal carved-relief / cathedral wall / vine-overgrown spire / single dominant tower / lava-moat / acid-pit / mirror-finish spire / dragon-tooth crenellation / Elvish-leaf stonework / spike-row / impossible balcony / leviathan-bone arch / phoenix-feather banner / starlight-fissure / runic-glowing wall / serpent-coiled tower / oaken-throne-gate / silver-mirror moat / suspended-island courtyard / petrified-forest gate / clockwork-orrery roof).
2. A SHAPE / GEOMETRY (forty feet across / hundred-foot / twice the keep's height / spanning the entire gatehouse roof / mathematically-precise / cantilevered thirty feet with no support / a quarter-mile long / spanning forty feet / running the full perimeter).
3. A POSITION on the castle (northeast tower / main gatehouse / curtain wall / southwest corner / keep's highest point / southern face of great hall / eastern corner / parapet of outer ward / gate-arch keystone / inner ward entry).
4. A "READS-FROM-DISTANCE" CLAUSE explaining why the signature is visible in the wide-shot frame (its silhouette reads as a separate landmark / casting a recognizable silhouette from the valley below / readable at a hundred paces / making it read as cut-out light / visible as a luminous patchwork / defining the footprint in fire).

━━━ VARIETY MANDATE — distribute across these signature types ━━━

MASSIVE-SCALE BONE / DRAGON ELEMENTS (~5 entries):
- Dragon-skull mounted above gatehouse
- Bone-archway from articulated dragon-vertebrae
- Dragon-tooth crenellation row
- Spike-row impaling preserved skulls
- Drawbridge surfaced with fitted skulls

MAGIC / IMPOSSIBLE ARCHITECTURE (~5 entries):
- Floating tower tethered by iron chains
- Cantilevered balcony with no visible support
- Levitating-island annex above the main keep
- Tower upside-down hanging from the keep's underside
- Spire that disappears into the clouds and is never seen ending

CRYSTAL / GLASS / REFLECTIVE (~4 entries):
- Crystal-spire erupting from a tower
- Obsidian-glass tower reflecting everything
- Volcanic-glass spire with conchoidal facets
- Mirror-finish reflective spire sheathed in polished steel
- Stained-glass cathedral wall fifty feet across
- Lattice glass-tower of iron and glass panels

NATURAL / LIVING INTEGRATION (~4 entries):
- Tree-integrated tower with living oak growing through floor and roof
- Vine-overgrown spire so thick it has become a green cone
- Coral-encrusted seawall in an island-fortress
- Roots breaking through tower walls in deliberate ornament
- Living-flower-overgrown curtain wall

ELEMENTAL / HOSTILE PERIMETER (~4 entries):
- Lava-moat running the full perimeter
- Acid-pit dry-moat with corroded stone lip
- Whirlpool sea-moat in an island-fortress
- Frost-moat permanently iced over with pale-blue light below
- Storm-cloud roof permanently hovering at one keep corner

CARVED / RELIEF / SIGIL (~3 entries):
- Colossal carved-relief of a serpent swallowing a sun across the curtain wall
- Hundred-foot griffin gripping the gate-tower
- Dwarven-rune-carved gateway with three-foot letters
- Elvish-leaf-pattern stonework arch
- Phoenix-feather sculpture row along the parapet

ENGINEERED HYDRO / WATER (~3 entries):
- Waterfall channeled through the gatehouse archway
- Aqueduct-bridge crossing into the keep at second-story height
- Fountain-tower with water-jet visible from a mile off

UNUSUAL TOWER / SPIRE (~2 entries):
- Single tower twice the height of every other structure
- Twin-spire bridge connecting two towers at impossible angles

━━━ EXAMPLES — match this register ━━━

- "A dragon-skull mounted above the main gatehouse, lower jaw removed and replaced with a working portcullis, the eye-sockets fitted with iron-bracketed torch-baskets."
- "A floating tower tethered to the curtain wall by three thick iron chains, hovering visibly apart from the main structure, the gap between them reading as impossible negative space."
- "A waterfall channeled deliberately through the gatehouse archway, sheeting over the drawbridge platform in a continuous curtain, its white roar audible and visible from a mile off."
- "A crystal-spire erupting from the northeast tower, translucent violet and twice the keep's own height, refracting dawn light into colored shafts across the entire courtyard."

━━━ STRICT RULES ━━━
- Western high-fantasy register only. NO sci-fi / cyberpunk / orbital / modern.
- Every entry NAMES a specific signature element — never abstract "ornate architecture" or "impressive details".
- Every entry gives SHAPE + SCALE + POSITION + READS-FROM-DISTANCE clause.
- The signature must INTEGRATE into the castle's silhouette — it's not a separate object floating nearby (the floating tower is an exception, but it's tethered to the castle).
- Each entry describes ONE signature element — don't stack two unrelated elements into one entry.
- NO repetition of signature type — each entry's element is its own unique idea.
- NO close-up. Castle is rendered close-mid framing, so the signature must read at that distance.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
