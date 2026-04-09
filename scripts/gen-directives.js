/**
 * Generate Sonnet-written directives + fluxFragments for all mediums.
 * Outputs JSON lines to stdout.
 */
require('dotenv').config({ path: '.env.local' });
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MEDIUMS = [
  { key: 'pixel_art', label: 'Pixel Art', refs: '16-bit SNES era, Chrono Trigger, Secret of Mana, Celeste, Hyper Light Drifter' },
  { key: 'watercolor', label: 'Watercolor', refs: 'Traditional watercolor painting, wet-on-wet, cold-pressed paper, transparent washes, Turner, Sargent watercolor studies' },
  { key: 'oil_painting', label: 'Oil Painting', refs: 'Classical oil painting, Rembrandt, Vermeer, impasto, glazing, chiaroscuro, palette knife, visible brushstrokes on canvas' },
  { key: 'lego', label: 'LEGO', refs: 'LEGO brick diorama, minifigures, baseplate construction, snap-together bricks, visible studs, photographed like a real set' },
  { key: 'claymation', label: 'Claymation', refs: 'Stop-motion clay animation, Wallace and Gromit, Shaun the Sheep, Chicken Run, sculpted clay figures, handcrafted miniature sets' },
  { key: '3d_cartoon', label: '3D Cartoon', refs: 'Pixar/DreamWorks/Illumination stylized 3D, Zootopia, Inside Out, Despicable Me, exaggerated proportions, appealing character design' },
  { key: '3d_render', label: '3D Render', refs: 'Pixar-quality realistic 3D, subsurface scattering, ray tracing, cloth simulation, Toy Story, Up, Coco' },
  { key: 'cyberpunk', label: 'Cyberpunk', refs: 'Blade Runner, Ghost in the Shell cityscapes, neon-soaked rain, cybernetic augmentation, Akira, Cyberpunk 2077' },
  { key: 'comic_book', label: 'Comic Book', refs: 'Marvel/DC comic art, Jim Lee, Todd McFarlane, bold ink outlines, Ben-Day dots, halftone, graphic novel illustration' },
  { key: 'embroidery', label: 'Embroidery', refs: 'Hand embroidery on linen, cross-stitch, satin stitch, French knots, visible thread texture, traditional needlework' },
  { key: 'disney', label: 'Disney', refs: 'Disney Renaissance 2D animation, Lion King, Little Mermaid, Aladdin, hand-drawn cel animation, Glen Keane character design' },
  { key: 'sack_boy', label: 'Sack Boy', refs: 'LittleBigPlanet, knitted fabric puppet, craft materials world, cardboard, felt, buttons, zipper, handmade miniature everything' },
  { key: 'funko_pop', label: 'Funko Pop', refs: 'Funko Pop vinyl collectible figure, oversized head, tiny body, dot eyes, no mouth, glossy plastic, product photography' },
  { key: 'ghibli', label: 'Studio Ghibli', refs: 'Spirited Away, My Neighbor Totoro, Howls Moving Castle, Miyazaki, hand-painted backgrounds, watercolor skies, living nature, warmth' },
  { key: 'tim_burton', label: 'Tim Burton', refs: 'Nightmare Before Christmas, Corpse Bride, Edward Scissorhands, gothic whimsy, spiral motifs, elongated thin figures, black/white stripes' },
  { key: 'pop_art', label: 'Pop Art', refs: 'Andy Warhol, Roy Lichtenstein, Keith Haring, Ben-Day dots, bold flat primaries, commercial art, screen printing' },
  { key: 'minecraft', label: 'Minecraft', refs: 'Minecraft voxel world, cubic blocks, pixelated textures, block-built everything, game screenshot aesthetic' },
  { key: '8bit', label: 'Retro Gaming', refs: 'NES 8-bit, original Mario, Mega Man, Zelda NES, extremely limited palette, chunky pixels, tile patterns, no anti-aliasing' },
  { key: 'felt', label: 'Felt/Stop Motion', refs: 'Coraline, Kubo and the Two Strings, needle-felted wool puppets, handcrafted miniature sets, dramatic cinematic lighting' },
  { key: 'neon', label: 'Neon', refs: 'Tron Legacy, neon tube lighting, LED strips, blacklight, glowing colors against darkness, wet reflective surfaces, fog/haze' },
  { key: 'paper_cutout', label: 'Paper Cutout', refs: 'Layered paper diorama, construction paper, scissor-cut edges, shadow between paper layers, craft table aesthetic' },
  { key: 'retro_poster', label: 'Retro Poster', refs: '1950s-60s travel posters, vintage movie posters, mid-century graphic design, limited palette, bold typography, screen print' },
  { key: 'childrens_book', label: "Children's Book", refs: 'Caldecott Medal winners, Eric Carle, Maurice Sendak, Oliver Jeffers, hand-painted warmth, gentle storybook illustration' },
  { key: 'vaporwave', label: 'Vaporwave', refs: 'Vaporwave aesthetic, pink/cyan/purple, glitch art, Greek marble statues, palm trees, sunset gradients, 90s digital nostalgia, CRT' },
  { key: 'fantasy', label: 'Fantasy', refs: 'High fantasy book covers, D&D art, Magic: The Gathering, epic landscapes, magical lighting, Frank Frazetta, Craig Mullins, Tolkien art' },
  { key: 'ukiyo_e', label: 'Ukiyo-e', refs: 'Japanese woodblock prints, Hokusai Great Wave, Hiroshige, flat colors, black ink outlines, wood-grain texture, Edo period' },
  { key: 'art_deco', label: 'Art Deco', refs: '1920s-30s, Tamara de Lempicka, Erte, geometric elegance, gold/black, Chrysler Building, Gatsby era glamour' },
  { key: 'steampunk', label: 'Steampunk', refs: 'Victorian-era machinery, brass gears, copper pipes, airships, goggles, Tesla coils, clockwork, steam-powered technology' },
  { key: 'pencil_sketch', label: 'Pencil Sketch', refs: 'Graphite pencil drawing, hatching, cross-hatching, blending, tonal range, textured paper, master drawing quality' },
];

async function main() {
  for (const m of MEDIUMS) {
    try {
      const msg = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `You are an expert art director for an AI image generator. Write TWO things for the "${m.label}" art style:

1. DIRECTIVE (120-180 words) — Instructions for an AI prompt writer. Describe the visual characteristics, techniques, and range of this style. Reference: ${m.refs}. Be specific about visual elements (linework, coloring, texture, lighting, composition). This will be used across many different scenes and subjects.

2. FLUX_FRAGMENT (25-40 words) — Comma-separated technical style tags for Flux AI image generation. Capture the core visual DNA.

Output EXACTLY this format:
DIRECTIVE: [text]
FLUX_FRAGMENT: [text]`
        }]
      });
      const text = msg.content[0].text;
      const dir = text.match(/DIRECTIVE:\s*([\s\S]*?)(?=FLUX_FRAGMENT:)/)?.[1]?.trim();
      const frag = text.match(/FLUX_FRAGMENT:\s*(.*)/)?.[1]?.trim();
      console.log(JSON.stringify({ key: m.key, directive: dir, fluxFragment: frag }));
    } catch (err) {
      console.error(`ERROR ${m.key}:`, err.message);
    }
    await new Promise(r => setTimeout(r, 300));
  }
}

main();
