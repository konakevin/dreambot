/**
 * ToyBot toy-landscapes path (2026-06-06).
 *
 * Renders famous real-world landscape vistas as Sackboy / Little Big Planet
 * handcrafted craft-world dioramas, with a few classic toys scattered as
 * tiny accents in the foreground / midground. Pool mirrors BrickBot's
 * lego-landscapes + PixelBot's pixel-landscapes — wide
 * pure_scene_eligible spots from location_iconic_spots.
 *
 * Medium: handcrafted (Sackboy / LBP). The world is built from felt /
 * burlap / yarn / cardboard / sponge / cork / pipe-cleaner / foam — and
 * a few tiny real toys sit inside it for scale + delight.
 *
 * Pool entries are { location, scene } objects.
 *
 * Re-extract the pool by running:
 *   node scripts/bots/brickbot/seeds/extract-lego-landscapes-locations.js
 * (writes to all three bots' seed dirs).
 */

const pools = require('../pools');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const entry = picker.pickWithRecency(
    pools.TOYBOT_TOY_LANDSCAPES_LOCATIONS,
    'toy_landscape_location'
  );
  const { location, scene } = entry;

  // Pick 2-4 distinct toys from the shared TOYBOX_TOY_BUCKET (200 entries —
  // troll dolls / vinyl figures / plush / action figures / die-cast / etc.)
  // to scatter as tiny accents inside the handcrafted craft world.
  const toyCount = 2 + Math.floor(Math.random() * 3);
  const toys = [];
  const seen = new Set();
  let attempts = 0;
  while (toys.length < toyCount && attempts < toyCount * 4) {
    const t = picker.pickWithRecency(pools.TOYBOX_TOY_BUCKET, `toybox_toy_${toys.length}`);
    if (!seen.has(t)) {
      seen.add(t);
      toys.push(t);
    }
    attempts++;
  }

  return `You are a Little Big Planet world photographer writing a TOY-LANDSCAPES scene for ToyBot. Render a famous real-world landscape as a fully-handcrafted Little Big Planet pod-world diorama of the place. ${toys.length} real toys appear as tiny scale-prover accents inside the LBP world.

━━━ THE WORLD — Little Big Planet pod-world, FULLY HANDCRAFTED (NON-NEGOTIABLE) ━━━
Every element of the landscape is rebuilt as an LBP / Sackboy craft world — Media Molecule's Little Big Planet aesthetic, period. Tilt-shift toy photograph of a stop-motion craft diorama. Visible stickered cardboard panels with decal-edges, felt-and-burlap surfaces with X-stitched seams, pipe-cleaner armatures, sponge / foam / paper-mache forms, painted-canvas backdrops, cotton-batting atmosphere, hot-glue seams. NOT photoreal. NOT CGI. NOT illustration. It is a videogame pod-world built from craft-store materials.

Translate EVERY natural element into LBP craft vocabulary:
- Mountains / cliffs / volcanoes → cardboard or sponge or foam slabs, sometimes burlap-wrapped, often with stickered rock decals on flat panels
- Water (ocean / lake / river / waterfall) → knitted blue yarn / translucent organza / felt panels with embroidered thread ripples
- Sky → painted-canvas or felt backdrop with cotton-batting cloud puffs
- Trees / palms / foliage → pipe-cleaner trunks with paper / felt / sponge fronds
- Sand / soil → tan felt / coffee-ground texture
- Rocks → painted foam / paper-mache, stickered with decal edges
- Weather (rain / mist / snow) → embroidered thread rain ripples, cotton-batting cloud-cover, paper-snippet snowflakes
- Light → soft warm cozy tilt-shift studio lighting, visible craft texture in every shadow

━━━ THE LOCATION ━━━
Set in ${location}. The render IS the place, rebuilt as an LBP pod-world diorama. Honor the place's defining terrain, geology, atmosphere — but everything is craft material.

━━━ THE SCENE (the specific vista to build as an LBP pod-world) ━━━
${scene}

━━━ THE ${toys.length} TOYS — tiny scale-prover accents (each ≤5% of frame) ━━━
${toys.length} real toys are scattered inside the LBP craft world as tiny scale-provers — they MUST appear by name in your prompt, but the world dominates the image:
${toys.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Toys remain as themselves (do NOT translate them into felt or burlap). They are tiny accents inside the LBP pod-world, NOT the subject. The LBP-style HANDCRAFTED world is the hero.

━━━ CAMERA + FRAMING ━━━
${sharedDNA.camera}
Wide tilt-shift diorama framing — show the craft world at landscape scale, the place's identity legible, the tiny toy accents discoverable on a second look.

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

Output ONLY the 80-110 word Flux prompt, comma-separated. NO preamble, NO headers, NO ━━━ markers, NO "render as" suffixes. Start immediately with the scene description. End with: no text, no words, no letters, no watermarks, masterwork composition, hyper detailed.`;
};
