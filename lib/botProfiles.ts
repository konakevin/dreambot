/**
 * Bot profiles for the "Meet the bots" onboarding screen.
 *
 * Each entry pairs an editorially-written blurb with the bot's username (which
 * matches `users.username` in the DB). Avatar URL still comes from the live
 * `useBotUsers` query — we never hardcode avatars or post URLs here. If a bot
 * is renamed or retired, it silently drops out of the screen.
 *
 * To update a blurb: edit the entry below. The bot's actual content is driven
 * by `scripts/bots/<botname>/index.js` (paths, mediums, vibes, seeds) — those
 * are the source of truth for what gets posted. This file is the source of
 * truth for how we describe the bot to a new user.
 *
 * Voice: 2nd person, present tense, no exclamation marks, no "explore" /
 * "discover" — matches the project's onboarding voice (see CLAUDE.md and the
 * memory file `feedback_your_dreambot.md`).
 */

export interface BotProfile {
  /** Username matching users.username in the DB (lowercase, no @). */
  username: string;
  /** One-line essence — what this bot dreams about. ~40-65 chars. */
  tagline: string;
  /** 2-3 sentence description, written in 2nd person, ~120-180 chars total. */
  description: string;
  /** 3-5 lowercase tag words. Used for the comma-separated tag line. */
  tags: string[];
}

export const BOT_PROFILES: Record<string, BotProfile> = {
  ancientbot: {
    username: 'ancientbot',
    tagline: 'Monumental ruins and ancient grandeur, oil-painted',
    description:
      "You'll see breathtaking scenes of lost civilizations — temples and monuments rendered with the scale and richness of museum oil paintings. No people, just epic archaeological vistas from another age.",
    tags: ['ancient', 'monuments', 'painting', 'civilizations', 'landscape'],
  },
  beachbot: {
    username: 'beachbot',
    tagline: 'Waves, sand, tropical paradise magnified',
    description:
      "You'll see pristine beaches and coastal magic in every mood — from glassy calm to dramatic storms, tide pools to tropical reefs. Follow if you crave the ocean without leaving your phone.",
    tags: ['beach', 'ocean', 'tropical', 'coastal', 'waves'],
  },
  bloombot: {
    username: 'bloombot',
    tagline: 'Flowers blooming in impossible places',
    description:
      "You'll see flowers as the hero of every scene — sprawling gardens, claustrophobic closeups, cosmic blooms, conservatories overflowing with color. Follow if you live for botanical wonder.",
    tags: ['flowers', 'nature', 'gardens', 'botanical', 'colorful'],
  },
  brickbot: {
    username: 'brickbot',
    tagline: 'LEGO worlds photographed as cinematic art',
    description:
      "You'll see brick-built everything — cities, castles, disasters, noir scenes — all rendered with theatrical lighting and obsessive plastic detail. Follow if you love the magic of toy photography.",
    tags: ['lego', 'bricks', 'toys', 'builds', 'cinematic'],
  },
  coquettebot: {
    username: 'coquettebot',
    tagline: 'Soft pink pastels, fairytales, cottagecore romance',
    description:
      "You'll see a world dripping in rose, cream, and pearl — princess bedrooms, Parisian daydreams, tea parties — rendered in watercolor and illustration. Follow if your aesthetic is feminine-pastel.",
    tags: ['cottagecore', 'pink', 'fairytale', 'romance', 'pastel'],
  },
  cuddlebot: {
    username: 'cuddlebot',
    tagline: 'Pure cozy cuteness, Pixar-warm storytelling',
    description:
      "You'll see adorable creatures, sleepy animals, and heartwarming scenes that make everyone go awww. Storybook illustration, claymation charm, and worlds that feel perpetually snug.",
    tags: ['cute', 'cozy', 'cuddly', 'animals', 'whimsical'],
  },
  dinobot: {
    username: 'dinobot',
    tagline: 'Dinosaurs, BBC Planet Earth realism',
    description:
      "You'll see museum-grade paleoart of scientifically accurate dinos in dramatic documentary stills — herds migrating, volcanic apocalypses, territorial clashes. Prehistoric majesty, no fantasy.",
    tags: ['dinosaurs', 'paleoart', 'documentary', 'scientific', 'epic'],
  },
  dragonbot: {
    username: 'dragonbot',
    tagline: 'High-fantasy worlds: LOTR, GoT, Elden Ring energy',
    description:
      "You'll see magical landscapes, epic fantasy moments, dragon-filled scenes, and warriors in arcane realms. Concept-art quality renderings of Witcher and Warhammer-grade worlds.",
    tags: ['fantasy', 'dragons', 'magic', 'epic', 'arcane'],
  },
  earthbot: {
    username: 'earthbot',
    tagline: "Earth's most breathtaking geography, amplified",
    description:
      "You'll see stunning landscapes of actual places elevated to impossible beauty — dramatic skies, sacred light, geological wonders rendered with NatGeo grandeur.",
    tags: ['landscape', 'nature', 'earth', 'scenic', 'light'],
  },
  gothbot: {
    username: 'gothbot',
    tagline: 'Vampires, castles, Castlevania-beautiful darkness',
    description:
      "You'll see elegant darkness — gothic architecture, vampire portraits, Bloodborne-style horror, witchcore scenes rendered in oil paint and heavy ink. Follow if your taste runs luxuriously dark.",
    tags: ['gothic', 'dark', 'vampires', 'witchcore', 'castlevania'],
  },
  mangabot: {
    username: 'mangabot',
    tagline: 'Anime worlds: Ghibli, Shinkai, Neo-Tokyo, samurai',
    description:
      "You'll see hand-drawn anime aesthetic across Japanese culture — Ghibli-style landscapes, slice-of-life scenes, cosmic anime, shonen action, mythological creatures. Pure anime illustration.",
    tags: ['anime', 'japanese', 'ghibli', 'manga', 'culture'],
  },
  oceanbot: {
    username: 'oceanbot',
    tagline: 'Underwater worlds, mermaids, krakens, maritime myth',
    description:
      "You'll see the full ocean spectrum — calm reefs, deep horror, ghost ships, leviathans, mermaid legends — painted in the classical maritime tradition. Follow if you're drawn to the depths.",
    tags: ['ocean', 'underwater', 'maritime', 'mythology', 'mystery'],
  },
  pixelbot: {
    username: 'pixelbot',
    tagline: 'Pixel art everything — fantasy, horror, sci-fi',
    description:
      "You'll see universal scenes rendered entirely in pixel art — from fantasy to cyberpunk to cozy cottages. The medium is the message: follow if you love pixel-perfect nostalgia.",
    tags: ['pixels', 'retro', 'pixel-art', 'videogame', 'vintage'],
  },
  retrobot: {
    username: 'retrobot',
    tagline: '70s–90s nostalgia: your childhood, perfectly frozen',
    description:
      "You'll see iconic places from the late 70s through mid-90s — malls, video stores, bedrooms, summer days — rendered with warm film grain and golden-hour light. Follow if you grew up then.",
    tags: ['nostalgia', 'retro', '90s', 'vintage', 'vaporwave'],
  },
  starbot: {
    username: 'starbot',
    tagline: 'Sci-fi grandeur: Blade Runner, Dune, Alien, 2001',
    description:
      "You'll see mind-bending cosmic vistas, alien landscapes, space opera moments, cyborg figures, futuristic architecture — all rendered with Moebius/Jodorowsky concept-art polish.",
    tags: ['sci-fi', 'space', 'cyberpunk', 'futurism', 'cosmic'],
  },
  steambot: {
    username: 'steambot',
    tagline: 'Steampunk brass, copper, clockwork, Victorian industry',
    description:
      "You'll see obsessively detailed steampunk worlds — BioShock airships, intricate contraptions, industrial landscapes — rendered with baroque brass-and-copper obsession.",
    tags: ['steampunk', 'victorian', 'industrial', 'clockwork', 'brass'],
  },
  tinybot: {
    username: 'tinybot',
    tagline: 'Miniatures, dioramas, macro-magic — whoa, look at that',
    description:
      "You'll see cleverly crafted miniature worlds and tilt-shift scenes full of obsessive detail — tiny villages, dollhouse interiors, macro nature rendered with dollhouse-scale wonder.",
    tags: ['miniatures', 'diorama', 'tilt-shift', 'dollhouse', 'macro'],
  },
  toybot: {
    username: 'toybot',
    tagline: 'Toy-world cinema: LEGO, claymation, action figures',
    description:
      "You'll see cinematic toy storytelling across mediums — LEGO epics, stop-motion claymation, vintage action figures, designer toys — photographed like blockbuster film stills.",
    tags: ['toys', 'lego', 'claymation', 'nostalgic', 'cinematic'],
  },
};

/**
 * Look up a profile by username (case-insensitive). Returns null when no
 * editorial blurb exists for the bot — the screen should fall back to a
 * generic "AI bot" rendering rather than crashing.
 */
export function getBotProfile(username: string): BotProfile | null {
  return BOT_PROFILES[username.toLowerCase()] ?? null;
}
