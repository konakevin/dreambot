#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/cozy_rpg_town_scenes.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (
    n
  ) => `Write ${n} COZY RPG TOWN scene descriptions for PixelBot's cozy-rpg-town path. Each entry feeds a Flux pixel-art prompt-writer. Genre lineage: Stardew Valley + Octopath Traveler HD-2D + Sea of Stars + Eastward + Children of Morta town hubs.

Each entry: 30-50 words, ONE paragraph, focused on a specific COZY RPG TOWN MOMENT — half-timbered houses, warm tavern light, market stalls, NPCs going about their day, cobblestone paths winding between shops.

━━━ THE NORTH STAR ━━━

Every scene should feel like "a screenshot from a cozy pixel-RPG town I desperately wish existed." NPCs mid-stride, signs of life everywhere — chimney smoke, lit windows, hanging lanterns, market awnings flapping, pixel-cats on rooftops.

━━━ SCENE TYPES — ROTATE BROADLY ━━━

- Tavern + market square at golden hour, cobblestone, lit lanterns, NPC vendors closing stalls
- Half-timbered cottage cluster with warm hearth glow through windows, dirt paths, garden plots
- Riverside docks with fishing boats, seagulls, dock-NPCs hauling crates
- Village square with central well, festival banners, NPCs gathering for evening
- Snow-dusted winter town, smoke curling, lantern-lit cottages with golden interiors
- Treetop village in giant oaks, rope walkways, glowing window-houses among branches
- Desert oasis trading post, palm trees, awnings, camel caravans, sun-baked bricks
- Floating sky-island village with bridge connecting wood-shingle cottages
- Coastal lighthouse town with cliffside cottages, crashing waves, fog rolling in
- Mountain pass village built into cliff face, terraced houses, mountain peaks beyond
- Underground gnome-quarter town carved into cavern walls, glowing crystals, lantern-lit corridors
- Spring-festival town with cherry blossoms, lantern strings, food carts, hanging banners
- Autumn town with pumpkin-stalls, falling leaves, hay-cart, cider-stand
- Late-summer farming town with golden wheat fields, scarecrows in middle distance
- Pirate-cove village with rope-bridges between coastal stilt-houses, longships in harbor
- Magical academy town with floating spell-glyphs above shops, robed NPCs in plaza
- Steampunk-tinged town with brass airship moored, cobblestones, gear-shop signage
- Desert caravan rest-stop with tents, camels, palm oasis, distant pyramid silhouette
- Mountain-monastery town with terraced gardens, robed NPCs, prayer-flag strings

━━━ HARD RULES ━━━

- The scene must include WARM SIGNS OF LIFE — lit windows, chimney smoke, NPCs mid-action, lanterns, animated elements
- The town is INHABITED — multiple NPCs, animals (pixel-cats, dogs, chickens, horses), small life signs
- LAYERED PARALLAX DEPTH — foreground (street/path), middle (buildings/NPCs), far (skyline/mountains/horizon)
- DIMENSIONAL ARCHITECTURE — multi-story half-timbered, terraces, market awnings, signposts, hanging signs
- NEVER mention specific game IPs ("Stardew", "Octopath" by name)
- NEVER include UI elements, health bars, dialogue boxes, score counters, button-prompt icons

━━━ EXAMPLES (write fresh — do not copy) ━━━

- "A bustling cozy market square at golden hour, half-timbered shops with hanging signs and warm-lit windows, cobblestone paths, three NPC vendors closing stalls, baker hauling crate of loaves, pixel-cat on a barrel, hanging lanterns swaying, chimney smoke from the bakery, layered parallax with mountains beyond."
- "A snowy winter village at twilight, smoke curling from chimneys, golden interior glow through every cottage window, lantern-lit paths between drifts, three NPCs in scarves mid-stride, a pixel-dog at a doorway, distant frozen peaks under starry sky."
- "A treetop village built into giant oaks, rope walkways connecting cottage-platforms, lit windows glowing in branches, two NPCs crossing a rope-bridge with lanterns, fireflies drifting between trunks, layered foliage receding into haze."
- "A desert oasis trading-post at dusk, palm trees, sand-colored stone awnings, lit lanterns swaying, three NPC traders haggling at a market stall, a camel mid-stride, mosaic tile pathways, layered dunes fading to lavender horizon."
- "A coastal lighthouse town at fog-dawn, cliffside cottages with warm-lit windows, crashing waves below, the lighthouse beam cutting through fog, two NPCs in oilskins on the dock, gulls in flight, a fishing boat returning, layered fog parallax."

━━━ AVOID ━━━

- Specific named IPs (Stardew, Pokemon, Octopath) — say lineage in your head, never write it
- UI / HUD / menu / button prompts
- Dead-still frames — every scene must have animated-feel elements (NPCs in motion, smoke, lanterns swaying, animals mid-stride)
- Single-building scenes — towns have MULTIPLE structures and inhabitants

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete scene description (30-50 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
