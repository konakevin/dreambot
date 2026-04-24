#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/beachbot/seeds/reef_paradise_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} SHALLOW REEF PARADISE scene descriptions for BeachBot's reef-paradise path. Each entry is a complete underwater scene — a SHALLOW near-shore tropical reef teeming with vivid coral and tropical fish. Think snorkeling at Black Rock Maui, Hanauma Bay Oahu, or Captain Cook on Big Island.

Each entry: 25-40 words. One complete shallow reef scene with specific coral, fish, water quality, light, AND nearby beach context.

━━━ THE CONCEPT ━━━
You're floating in warm, crystal-clear shallow water just off a Hawaiian beach. You can see sandy bottom, palm trees through the surface shimmer, volcanic rock nearby. Below you — the most vibrant, larger-than-life coral reef packed with tropical fish. NOT deep ocean diving. This is NEAR THE BEACH — 5-15 feet of water, sunlight everywhere, beach visible.

━━━ WHAT EACH ENTRY MUST INCLUDE ━━━
1. A SHALLOW near-shore setting (lagoon, rocky shoreline reef, bay, cove)
2. 2-3 specific coral types with colors
3. 2-3 specific tropical fish with colors
4. Light quality (sun filtering through, shimmer, dappled, rays)
5. Beach context visible (sandy bottom, palm shadows on water, volcanic rock, shore nearby)

━━━ CORAL (mix 2-3 per entry) ━━━
Brain coral (tan/green/purple domes), staghorn coral (branching golden/purple), fan coral (swaying purple/red/orange fans), mushroom coral (pink/green discs), fire coral (yellow-green blades), table coral (flat brown/green plates), bubble coral (pearl-white grape clusters), tube sponge (electric purple/pink tubes), star coral (green/brown boulders), cauliflower coral (cream/pink clusters), lobe coral (brown/golden mounds), finger coral (tan upright branches)

━━━ FISH (mix 2-3 per entry) ━━━
Humuhumunukunukuapua'a (Picasso triggerfish — vivid patterns), yellow tang (bright lemon schools), parrotfish (electric blue-green/pink), moorish idol (black/white/yellow striped), butterflyfish (bright yellow, black eye spots), green sea turtle (gliding through), spotted eagle ray (graceful wingspan), clownfish (orange/white in anemone), surgeonfish (royal blue/yellow tail), wrasse (neon green/blue), damselfish (tiny electric blue schools), trumpetfish (long hovering vertically), pufferfish (spotted curious), unicornfish (grey-blue with horn), needlefish (silver at surface), convict tang (black/white striped schools)

━━━ LIGHT + WATER (vary across entries) ━━━
- Sun rays filtering through crystal water creating moving light patterns on reef
- Surface shimmer visible from below, palm tree shadows dancing on coral
- Dappled golden light through gentle surface ripples
- Bright tropical sun illuminating every color, visibility 100+ feet
- Late afternoon warm amber light angling through shallow water
- Morning light creating blue-green glow, everything fresh and vivid

━━━ BEACH CONTEXT (include in ~60% of entries) ━━━
- Sandy bottom visible between coral heads
- Volcanic rock shoreline visible through water surface
- Palm shadows falling across the water from nearby shore
- White sand beach visible through surface shimmer
- Black lava rock creating natural pools where reef thrives

━━━ NO PEOPLE ━━━
No snorkelers, divers, swimmers, boats. Empty paradise — only coral, fish, water, light, and beach context.

━━━ DEDUP ━━━
Each entry must feature a DIFFERENT lead fish + coral combo. No two entries with the same primary species.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
