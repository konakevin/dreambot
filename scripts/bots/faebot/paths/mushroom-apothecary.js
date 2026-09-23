/**
 * FaeBot mushroom-apothecary path (2026-09-22) — FaeBot's FIRST INTERIOR register.
 *
 * THE SOUL OF THE PATH:
 *   We are INSIDE a working fae apothecary and remedy-shop hollowed out of a
 *   giant mushroom. Curved organic walls of pale pleated gill-flesh and
 *   mushroom-timber, shelves bent to follow the curve and crowded with small
 *   vessels, bundles of drying herbs pressing down from the ceiling, a mortar
 *   and a dripping still on the counter, a ladder to a loft, warm lamplight,
 *   and ONE opening giving onto the forest — all in a single unbroken frame.
 *   The ROOM is the hero. The eye should want to read it shelf by shelf.
 *
 * WHY IT EXISTS (the gap): every other FaeBot path is an OUTDOOR vista or a
 *   figure in the open — vistas, forests, villages, courts, markets, wilds.
 *   FaeBot had no interior register at all. A warm, dense, richly-propped
 *   interior is a whole kind of picture the bot could not previously make.
 *
 * FUNCTION-FORM + SELF-CONTAINED (the ToyBot Stage-O / YumBot Stage-P pattern):
 *   this file loads its own eight seed JSONs directly and inlines its whole
 *   brief. It touches no shared bot file — no pools.js entry, no archetypes.js
 *   entry, no archetype-templates.js entry. Registering it is one line in
 *   index.js `pathBuilders` (see the header block at the bottom of this file).
 *
 * 8 AXES (7 always-on + 1 gated inhabitant at 0.5):
 *   - room           the interior itself: massing, curved shelving, counter,
 *                    way up to a loft, the ONE opening, and the vantage. HERO.
 *   - wares          the dense wall of remedy-ware + THE MARKING LAW
 *   - hanging_stock  the overhead density: bundles, braids, racks, strings
 *   - remedy_work    what is in progress on the counter, as OBJECT STATES
 *   - light_event    ★ the money shot: what the light is doing + the palette
 *   - window_view    the forest beyond, written as the SAME continuous shot
 *   - air            what the indoor air is doing (axis-clean: air only)
 *   - inhabitant     (0.5 gate) ONE palm-sized winged fae or ONE whole critter
 *
 * THE FOUR TRAPS THIS PATH IS BUILT AGAINST (all playbook-documented):
 *   1. SPLIT-PANEL. An interior plus "something through a window" reads to Flux
 *      like comic-panel instructions and renders as a hard-divided two-zone
 *      image. Both the window_view POOL and the template describe it as ONE
 *      continuous shot instead — the forest glimpsed through the opening,
 *      softer and smaller, with its light falling BACK IN onto the sill and
 *      counter. "Split" and "panel" are never named (naming seeds them).
 *   2. READABLE TEXT. An apothecary is a label-magnet and Flux renders
 *      gibberish lettering. Every marking in the wares pool is PICTORIAL or
 *      BLANK — a painted sprig, a wax seal, a tied sprig, a blank bark scrap,
 *      dyed thread, or a plain surface. Described positively, never as a ban.
 *   3. NO-PRIOR CREATURES (the KODAMA trap). The gated inhabitant is only ever
 *      a palm-sized fae with a FULL beautiful face, real eyes, real hair,
 *      pointed ears and visible wings (the proven fairy-swarm / market-stall
 *      register) or ONE whole recognisable real animal. Never bald, never
 *      round-white-headed, never dot-eyed, never fused into bark.
 *   4. UNSTATED FIGURES. A shop is a human-activity prior, so the figure rule
 *      positively populates instead of only banning: any figure in this shop
 *      is fae, and when no inhabitant rolls, the shop is empty and its life is
 *      the light plus the work left mid-step (the fae-cottage lesson).
 *
 * Config: FaeBot's default medium (painted_fantasy_novel) + the bot-wide
 *   allowedModels picker. chaos + sensoryAnchors are off bot-wide, so no skip
 *   entries are needed for them; twoPassPolish MUST skip this path (Haiku
 *   compression strips the interior + continuity + marking rules). No
 *   promptPrefixByPath — the wrapper-strip lesson says default to empty.
 *   sharedDNA.colorPalette is deliberately NOT used: light_event owns the
 *   palette, and a fixed vibe colour-cast would override the rolled light.
 */

const fs = require('fs');
const nodePath = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(nodePath.join(__dirname, '..', 'seeds', `${name}.json`), 'utf8')
  );
}

const ROOM = load('faebot_mushroom_apothecary_room');
const WARES = load('faebot_mushroom_apothecary_wares');
const HANGING_STOCK = load('faebot_mushroom_apothecary_hanging_stock');
const REMEDY_WORK = load('faebot_mushroom_apothecary_remedy_work');
const LIGHT_EVENT = load('faebot_mushroom_apothecary_light_event');
const WINDOW_VIEW = load('faebot_mushroom_apothecary_window_view');
const AIR = load('faebot_mushroom_apothecary_air');
const INHABITANT = load('faebot_mushroom_apothecary_inhabitant');

const INHABITANT_GATE = 0.5;

module.exports = ({ vibeDirective, picker }) => {
  const room = picker.pickWithRecency(ROOM, 'apothecary_room');
  const wares = picker.pickWithRecency(WARES, 'apothecary_wares');
  const hangingStock = picker.pickWithRecency(HANGING_STOCK, 'apothecary_hanging_stock');
  const remedyWork = picker.pickWithRecency(REMEDY_WORK, 'apothecary_remedy_work');
  const lightEvent = picker.pickWithRecency(LIGHT_EVENT, 'apothecary_light_event');
  const windowView = picker.pickWithRecency(WINDOW_VIEW, 'apothecary_window_view');
  const air = picker.pickWithRecency(AIR, 'apothecary_air');
  const inhabitant =
    Math.random() < INHABITANT_GATE
      ? picker.pickWithRecency(INHABITANT, 'apothecary_inhabitant')
      : null;

  const inhabitantSection = inhabitant
    ? `
━━━ 8. THE ONE SMALL INHABITANT (little and quiet — the room stays the hero) ━━━
${inhabitant}

Small, tucked in among the stock, at home. A fae keeps a full beautiful face with real eyes and real hair, pointed ears, visible wings and covering fae-craft garments; an animal is one whole recognisable creature, head and body.
`
    : `
━━━ 8. THE SHOP AT REST ━━━
The room holds only its own quiet life this moment: the warm light, the crowded stock, and the work sitting exactly where it was set down on the counter.
`;

  return `You are a fantasy concept-art painter writing ONE Flux prompt for the INTERIOR of a working fae apothecary hollowed out inside a giant mushroom, in FaeBot's soft painted-fantasy register (Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud painted-fantasy lineage). A timeless fae world where every vessel and beam was made by hand from what the forest gave.

━━━ THE FOUR THINGS THAT MAKE THIS PICTURE ━━━
1. WE ARE INSIDE. An INTERIOR, standing in the room: curved walls of pale pleated gill-flesh and honey mushroom-timber, ceiling close overhead, shelves bent to the curve, counter near. The room is the hero at 85-95% of frame, deep readable focus front to back.
2. ONE CONTINUOUS PICTURE. The shop's single opening is cut through the living wall, and the forest shows THROUGH it in the very same unbroken frame — jars on its sill, a bundle beside it, and the outside light coming back IN across that sill onto the counter and floor. The forest stays softer, hazier and smaller than the room.
3. WARM, PACKED AND VIVID. Vessels crowded two and three deep, bundles hanging from the ceiling, work spread on the counter, a warm lit core somewhere. The remedies are visibly MAGICAL — they glow from within, they drift, they hold weather or a season or a tiny living thing — in saturated JEWEL colour (emerald, sapphire, amethyst, ruby, gold, turquoise, rose) against the warm lamplight. This is a place a viewer would give anything to be let into and allowed to browse.
4. MARKINGS ARE PICTURES OR PLAIN. Each little label carries one small painted picture and nothing else — a painted sprig, leaf, berry, moon, drop or spiral. Everything else is wax-sealed, twine-tied with a dried sprig, ringed in dyed thread, tagged with a blank bark scrap, or left bare. The counter front, the cupboard doors and the shelf edges are plain smooth unmarked timber.

5. EVERY WALL SURFACE ALREADY CARRIES SOMETHING. Whatever hangs on the walls is a PICTURE or a PLANT, never a board of writing: a small framed painting of a flower, a pressed-fern panel under glass, a hanging bundle of dried stems, a woven straw disc, a copper pan, a string of seed-pods, a little painted tile of a moon. The gill-flesh and timber between them is left bare and smooth, lit by the lamps.

━━━ 1. THE ROOM (the hero — its shape, shelving, counter, way up, opening and vantage) ━━━
${room}
Render this massing and plan exactly, from the vantage named at its end.

━━━ 2. THE SHELF STOCK ━━━
${wares}

━━━ 3. THE HANGING STOCK (the ceiling is as full as the shelves — it must be visible) ━━━
${hangingStock}

━━━ 4. THE WORK IN PROGRESS (objects caught mid-step — the little story on the counter) ━━━
${remedyWork}

★━━━ 5. THE LIGHT (the money shot — it owns the whole palette) ━━━
${lightEvent}
Commit fully to this light and the time of day it brings. Name the lit surface; light is a glow, a patch, a pool, a streak or a soft shaft on a real thing. The palette of the entire room follows it.

━━━ 6. THE OPENING AND THE FOREST THROUGH IT (one unbroken shot) ━━━
${windowView}

━━━ 7. THE AIR IN THE ROOM ━━━
${air}
${inhabitantSection}
━━━ EVERY FIGURE HERE IS FAE ━━━
The shop is fae-made and fae-kept. Any figure in frame is a slender fae in fae-craft garments of petal-silk, leaf-cloth, woven grass or moss-velvet.

━━━ MOOD ━━━
${vibeDirective ? String(vibeDirective).slice(0, 120) : ''}

━━━ STYLE ━━━
Visible oil-brushwork, painted edges, warm romantic painted atmosphere, gallery-tier painted illustration in the Manchess / Giancola / Bonner / Froud painted-fantasy lineage. Deep focus throughout, richly detailed everywhere the eye lands.

━━━ LENGTH IS THE FIRST RULE — 110-140 WORDS, COUNT THEM ━━━
A tight 130-word room beats a crammed 300-word inventory. Write comma-separated phrases in THIS order and then STOP:
[name it plainly as an interior together with the rolled light — for example "warm lamplit interior of a fae apothecary hollowed inside a giant mushroom"],
[the room: curved gill-flesh walls, crooked crowded shelves, the counter, the way up to the loft, from its vantage],
[the crowded shelf stock, its MAGICAL glowing contents in saturated jewel colour, and its painted-picture-or-plain markings on plain unmarked timber],
[the bundles and strings HANGING from the ceiling],
[what hangs on the walls: a painted picture, a pressed-plant panel, a copper pan, a string of seed-pods, the bare gill-flesh smooth between them],
[the work caught mid-step on the counter],
[what the light is doing and the palette it brings],
[the sill and the soft forest through the one opening, its light falling back inside],
[the air],${inhabitant ? '\n[the one small inhabitant],' : ''}
[soft painted-fantasy oil-brushwork].

Describe only what IS present — every phrase names something in the picture, never something absent. No preamble, no headers, no markers, no bullets, no bold labels.`;
};

/*
 * ── REGISTRATION (merge into scripts/bots/faebot/index.js) ───────────────────
 *
 *  1. pathBuilders:
 *       'mushroom-apothecary': require('./paths/mushroom-apothecary'),
 *  2. shadowPaths:
 *       shadowPaths: ['mushroom-apothecary'],
 *  3. twoPassPolish.skipPaths — add:
 *       'mushroom-apothecary',
 *  4. nudityCheck.paths — add:
 *       'mushroom-apothecary',
 *
 * Nothing else is required: pools.js is untouched (this file loads its own
 * seeds), chaos + sensoryAnchors are disabled bot-wide, the medium falls
 * through to defaultMedium `painted_fantasy_novel`, models come from the
 * bot-wide allowedModels picker, and the bot-wide vibes all suit the path.
 * Going live later = move the string from shadowPaths[] into paths[].
 */
