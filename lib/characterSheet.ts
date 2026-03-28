// ─────────────────────────────────────────────────────────────────────────────
// SHELVED — Character Sheet logic (not in use)
// See components/CharacterSheet.tsx for the full rationale.
// ─────────────────────────────────────────────────────────────────────────────

// Pure computation — no React, no Supabase. Takes raw numbers, returns a character sheet.

export interface RawCharacterData {
  postCount: number;
  posts: Array<{
    total_votes: number;
    rad_votes: number;
    wilson_score: number | null;
    categories: string[];
  }>;
  radVotesCast: number;
  badVotesCast: number;
}

export interface CharacterStats {
  taste: number;  // 1–20
  clout: number;
  judge: number;
  edge:  number;
  range: number;
  grind: number;
}

export interface CharacterSheet {
  stats:     CharacterStats;
  modifiers: CharacterStats;
  alignment: string;
  alignmentColor: string;
  className: string;
  flavor:    string;
}

// ── Scaling helpers ──────────────────────────────────────────────────────────

/** Map a 0–1 linear value to 1–20 */
function linearScale(v: number): number {
  return Math.max(1, Math.min(20, Math.round(v * 19) + 1));
}

/** Log scale — good for vote counts that vary wildly */
function logScale(v: number, multiplier = 5): number {
  return Math.max(1, Math.min(20, Math.round(Math.log10(v + 1) * multiplier)));
}

/** D&D modifier: floor((score - 10) / 2) */
function mod(score: number): number {
  return Math.floor((score - 10) / 2);
}

function mods(stats: CharacterStats): CharacterStats {
  return {
    taste: mod(stats.taste),
    clout: mod(stats.clout),
    judge: mod(stats.judge),
    edge:  mod(stats.edge),
    range: mod(stats.range),
    grind: mod(stats.grind),
  };
}

// ── Core computation ─────────────────────────────────────────────────────────

export function computeCharacterSheet(raw: RawCharacterData): CharacterSheet {
  const { postCount, posts, radVotesCast, badVotesCast } = raw;

  // TASTE — weighted avg wilson_score across posts with ≥5 votes
  const qualPosts = posts.filter(p => p.total_votes >= 5 && p.wilson_score !== null);
  const totalWeight = qualPosts.reduce((s, p) => s + p.total_votes, 0);
  const weightedWilson = totalWeight > 0
    ? qualPosts.reduce((s, p) => s + p.wilson_score! * p.total_votes, 0) / totalWeight
    : 0;
  const taste = qualPosts.length > 0 ? linearScale(weightedWilson) : 1;

  // CLOUT — total votes received (log, ~10k = 20)
  const totalVotesReceived = posts.reduce((s, p) => s + p.total_votes, 0);
  const clout = logScale(totalVotesReceived, 5);

  // JUDGE — total non-skip votes cast (log, ~10k = 20)
  const totalVotesCast = radVotesCast + badVotesCast;
  const judge = logScale(totalVotesCast, 5);

  // EDGE — average controversy: 1 = perfect 50/50, 0 = total consensus
  const edgePosts = posts.filter(p => p.total_votes >= 5);
  const avgEdge = edgePosts.length > 0
    ? edgePosts.reduce((s, p) => {
        const radPct = p.rad_votes / p.total_votes;
        return s + (1 - 2 * Math.abs(0.5 - radPct));
      }, 0) / edgePosts.length
    : 0;
  const edge = linearScale(Math.max(0, avgEdge));

  // RANGE — distinct categories posted in (max 8)
  const uniqueCats = new Set(posts.flatMap(p => p.categories)).size;
  const range = linearScale(uniqueCats / 8);

  // GRIND — post count (log, ~10k = 20, uses multiplier 6 so lower counts feel meaningful)
  const grind = logScale(postCount, 6);

  const stats: CharacterStats = { taste, clout, judge, edge, range, grind };

  // Voting bucket — internal only, drives class + alignment label
  const radPct = totalVotesCast > 0 ? radVotesCast / totalVotesCast : null;
  const bucket = deriveVotingBucket(radPct, totalVotesCast);

  const className = deriveClass(stats, bucket);
  const { alignment, alignmentColor } = deriveDisplayAlignment(className, bucket);
  const flavor = deriveFlavor(className, bucket);

  return { stats, modifiers: mods(stats), alignment, alignmentColor, className, flavor };
}

// ── Derived personality ──────────────────────────────────────────────────────

type VotingBucket = 'lawful-rad' | 'neutral-rad' | 'true-neutral' | 'neutral-bad' | 'chaotic-bad' | 'undecided';

function deriveVotingBucket(radPct: number | null, votesCast: number): VotingBucket {
  if (radPct === null || votesCast < 10) return 'undecided';
  if (radPct > 0.70) return 'lawful-rad';
  if (radPct > 0.55) return 'neutral-rad';
  if (radPct > 0.45) return 'true-neutral';
  if (radPct > 0.30) return 'neutral-bad';
  return 'chaotic-bad';
}

function deriveClass(s: CharacterStats, bucket: VotingBucket): string {
  const ranked = (Object.keys(s) as (keyof CharacterStats)[])
    .sort((a, b) => s[b] - s[a]);

  // Special classes: defined by dominant stat + what's absent from top stats
  // CLOUT on top but GRIND is barely there → famous without hustle
  if (ranked[0] === 'clout' && ranked.indexOf('grind') >= 4) return 'One Hit Wonder';
  // TASTE on top but CLOUT is barely there → quality without reach
  if (ranked[0] === 'taste' && ranked.indexOf('clout') >= 4) return 'The Hidden Gem';
  // CRITIC on top but GRIND is barely there → watches everything, barely posts
  if (ranked[0] === 'judge' && ranked.indexOf('grind') >= 4) {
    if (bucket === 'chaotic-bad')                            return 'The Harsh Critic';
    if (bucket === 'lawful-rad')                             return 'The Hype Machine';
    return 'The Lurker';
  }

  // Matrix: top-3 stat combo (sorted alphabetically) → class
  const key = ranked.slice(0, 3).sort().join('|');
  const CLASS_MAP: Record<string, string> = {
    'clout|edge|grind':  'The Chaos Agent',    // popular, divisive, prolific — loud chaos
    'clout|edge|judge':  'The Chaos Agent',    // popular, divisive, votes lots — loud and controversial
    'clout|edge|range':  'The Chaos Agent',    // popular, divisive, eclectic — chaos everywhere
    'clout|edge|taste':  'The Main Character', // popular, divisive but tasteful — spicy main character
    'clout|grind|judge': 'The Grinder',        // popular, prolific, votes lots — working machine
    'clout|grind|range': 'The Wanderer',       // popular, prolific, eclectic — drifter with clout
    'clout|grind|taste': 'The Main Character', // popular, prolific, quality — main character hustle
    'clout|judge|range': 'The Crowd Pleaser',  // popular, votes lots, eclectic — engaged across the board
    'clout|judge|taste': 'The Crowd Pleaser',  // popular, votes lots, quality — the ideal well-rounded
    'clout|range|taste': 'The Main Character', // popular, eclectic, quality — omnipresent quality
    'edge|grind|judge':  'The Provocateur',    // divisive, prolific, votes lots — serial instigator
    'edge|grind|range':  'The Provocateur',    // divisive, prolific, eclectic — chaos everywhere
    'edge|grind|taste':  'The Provocateur',    // divisive, prolific, quality — intentional provocateur
    'edge|judge|range':  'The Provocateur',    // divisive, votes lots, eclectic — opinionated everywhere
    'edge|judge|taste':  'The Provocateur',    // divisive, votes lots, quality — opinionated and good
    'edge|range|taste':  'The Wanderer',       // divisive, eclectic, quality — edgy drifter with taste
    'grind|judge|range': 'The Grinder',        // prolific, votes lots, eclectic — relentless worker
    'grind|judge|taste': 'The Crowd Pleaser',  // prolific, votes lots, quality — dedicated quality poster
    'grind|range|taste': 'The Wanderer',       // prolific, eclectic, quality — tasteful drifter
    'judge|range|taste': 'The Crowd Pleaser',  // votes lots, eclectic, quality — engaged quality poster
  };

  return CLASS_MAP[key] ?? 'The Regular';
}

function deriveDisplayAlignment(
  className: string,
  bucket: VotingBucket,
): { alignment: string; alignmentColor: string } {
  const BUCKET_COLORS: Record<VotingBucket, string> = {
    'lawful-rad':   '#CCDD55',
    'neutral-rad':  '#AACC66',
    'true-neutral': '#888888',
    'neutral-bad':  '#9977DD',
    'chaotic-bad':  '#BB88EE',
    'undecided':    '#71767B',
  };

  // Per-class alignment labels keyed by voting bucket
  const LABELS: Record<string, Partial<Record<VotingBucket, string>>> = {
    'The Main Character': {
      'lawful-rad':   'Chaotic Iconic',
      'neutral-rad':  'Lawful Iconic',
      'true-neutral': 'True Main Character',
      'neutral-bad':  'Neutral Villain Arc',
      'chaotic-bad':  'Full Villain Arc',
    },
    'The Crowd Pleaser': {
      'lawful-rad':   'Lawful Wholesome',
      'neutral-rad':  'Neutral Good',
      'true-neutral': 'True Neutral Good',
      'neutral-bad':  'Passive Aggressive',
      'chaotic-bad':  'Chaotic Sweetheart',
    },
    'The Provocateur': {
      'lawful-rad':   'Chaotic Good',
      'neutral-rad':  'Lawful Instigator',
      'true-neutral': 'True Menace',
      'neutral-bad':  'Neutral Evil',
      'chaotic-bad':  'Lawful Evil',
    },
    'The Wanderer': {
      'lawful-rad':   'Neutral Good Drifter',
      'neutral-rad':  'Lawful Drifter',
      'true-neutral': 'True Nomad',
      'neutral-bad':  'Neutral Chaotic',
      'chaotic-bad':  'Chaotic Gremlin',
    },
    'The Chaos Agent': {
      'lawful-rad':   'Chaotic Good Disaster',
      'neutral-rad':  'Neutral Disaster',
      'true-neutral': 'True Gremlin',
      'neutral-bad':  'Chaotic Neutral',
      'chaotic-bad':  'Lawful Chaos',
    },
    'The Grinder': {
      'lawful-rad':   'Lawful Grind',
      'neutral-rad':  'Neutral Hustle',
      'true-neutral': 'True Workaholic',
      'neutral-bad':  'Grinding an Axe',
      'chaotic-bad':  'Chaotic Burnout',
    },
    'One Hit Wonder': {
      'lawful-rad':   'Accidentally Iconic',
      'neutral-rad':  'Reluctantly Famous',
      'true-neutral': 'True One-Timer',
      'neutral-bad':  'Neutrally Viral',
      'chaotic-bad':  'Chaotically Viral',
    },
    'The Hidden Gem': {
      'lawful-rad':   'Lawful Underrated',
      'neutral-rad':  'Quietly Generous',
      'true-neutral': 'True Hidden Gem',
      'neutral-bad':  'Quietly Menacing',
      'chaotic-bad':  'Chaotically Underrated',
    },
    'The Lurker': {
      'neutral-rad':  'Neutral Observer',
      'true-neutral': 'True Lurker',
      'neutral-bad':  'Neutral Lurker',
    },
    'The Harsh Critic': {
      'chaotic-bad':  'Lawful Judgmental',
    },
    'The Hype Machine': {
      'lawful-rad':   'Suspiciously Generous',
    },
    'The Regular': {
      'lawful-rad':   'Lawful Regular',
      'neutral-rad':  'Neutral Regular',
      'true-neutral': 'True Regular',
      'neutral-bad':  'Slightly Off',
      'chaotic-bad':  'Chaotic Regular',
    },
  };

  const labelBucket = bucket === 'undecided' ? 'true-neutral' : bucket;
  const label = LABELS[className]?.[labelBucket] ?? 'Undecided';
  const alignmentColor = BUCKET_COLORS[bucket];
  return { alignment: label, alignmentColor };
}

function deriveFlavor(className: string, bucket: VotingBucket): string {
  const flavorBucket = bucket === 'undecided' ? 'true-neutral' : bucket;

  const map: Record<string, Partial<Record<VotingBucket, string>>> = {
    'The Main Character': {
      'lawful-rad':   'Annoyingly good. Annoyingly supportive. Somehow makes it look effortless.',
      'neutral-rad':  'Posts quality, earns clout, votes fair. Sickening, honestly.',
      'true-neutral': 'The center of attention without trying. Everyone else is a supporting cast.',
      'neutral-bad':  'Still posting bangers. Starting to develop opinions about others.',
      'chaotic-bad':  'Incredible posts. Zero mercy in the voting booth. Iconic and dangerous.',
    },
    'The Crowd Pleaser': {
      'lawful-rad':   'Votes generously, posts quality, never starts drama. Probably bakes for coworkers too.',
      'neutral-rad':  'Reliable. Likable. Somehow never controversial. An inspiration, honestly.',
      'true-neutral': 'Shows up, does the work, skips the drama. A rarity in these times.',
      'neutral-bad':  'Lovely posts. Smiles warmly. Quietly votes Bad and says nothing.',
      'chaotic-bad':  'Great content. Absolutely no time for yours. It\'s complicated.',
    },
    'The Provocateur': {
      'lawful-rad':   'Posts things that start arguments, then votes generously anyway. Confusing but iconic.',
      'neutral-rad':  'Consistently divisive posts. Consistently fair votes. Pick a lane.',
      'true-neutral': 'Posts to divide. Votes with a coin flip. Fully committed to the chaos.',
      'neutral-bad':  'Divisive posts, skeptical votes. At least they\'re consistent.',
      'chaotic-bad':  'Every post is a trap. Every vote is a verdict. Methodically menacing.',
    },
    'The Wanderer': {
      'lawful-rad':   'Posts in every category, votes generously, commits to nothing. A generous free spirit.',
      'neutral-rad':  'No fixed aesthetic, consistent fairness. Somehow it all works.',
      'true-neutral': 'Posts everywhere, votes fairly, owes no one anything. Respect.',
      'neutral-bad':  'Posts all over the place. No aesthetic, no mercy.',
      'chaotic-bad':  'Spread thin across every category. Still finds time to vote harshly.',
    },
    'The Chaos Agent': {
      'lawful-rad':   'Posts boldly, votes generously. A disaster with a heart of gold.',
      'neutral-rad':  'Questionable posts, neutral votes. A disaster you can\'t fully blame.',
      'true-neutral': 'Posts whatever. Votes whatever. Nobody knows what\'s happening, including them.',
      'neutral-bad':  'Chaotic posts, skeptical votes. Just here to watch it slowly burn.',
      'chaotic-bad':  'Consistently unhinged posts. Consistently harsh votes. Committed to the bit.',
    },
    'The Grinder': {
      'lawful-rad':   'Posts constantly, votes generously. Genuinely alarming work ethic.',
      'neutral-rad':  'Never stops posting. Votes fairly. Probably doesn\'t sleep.',
      'true-neutral': 'Posts relentlessly, votes neutrally. This is their entire personality.',
      'neutral-bad':  'Posts everything. Votes with a grudge. Has a lot to say and all the time to say it.',
      'chaotic-bad':  'Posts constantly, votes harshly. Running on spite and caffeine.',
    },
    'One Hit Wonder': {
      'lawful-rad':   'One post. All the clout. Votes generously like they know what they\'re doing.',
      'neutral-rad':  'Had a moment. Still here. Voting fairly while quietly plotting the comeback.',
      'true-neutral': 'Famous for one thing. Unknown for everything else. The math checks out.',
      'neutral-bad':  'Went viral once. Now votes harshly on others. It\'s giving \'peaked early\'.',
      'chaotic-bad':  'One legendary post. Zero regrets. Bad vibes for everyone else.',
    },
    'The Hidden Gem': {
      'lawful-rad':   'Posts quality, votes generously, gets nothing back. The universe owes them.',
      'neutral-rad':  'Great taste, fair voter, low clout. Criminally slept on.',
      'true-neutral': 'Excellent posts. Almost no one\'s watching. Their loss.',
      'neutral-bad':  'Posts beautifully. Votes harshly. The quiet ones are always the ones.',
      'chaotic-bad':  'Amazing content. Tiny audience. Bitter about it. Understandably.',
    },
    'The Lurker': {
      'neutral-rad':  'Votes a lot, posts rarely, leans generous. A fair witness to the chaos.',
      'true-neutral': 'Watches everything. Says nothing. Has opinions. Shares none of them.',
      'neutral-bad':  'Votes constantly, barely posts, slightly critical. A judgmental ghost.',
    },
    'The Harsh Critic': {
      'chaotic-bad':  'Votes on everything. Posts almost nothing. Their Bad votes hit different.',
    },
    'The Hype Machine': {
      'lawful-rad':   'Votes Rad on everything. Posts almost nothing. Cheerleading from the shadows.',
    },
    'The Regular': {
      'lawful-rad':   'Posts consistently, votes generously. The backbone of this app. Underappreciated.',
      'neutral-rad':  'Reliably themselves. Nothing extreme. Oddly comforting.',
      'true-neutral': 'Consistent. Predictable. Present. That\'s more than most.',
      'neutral-bad':  'Average posts, slightly harsh votes. Doing fine, mostly.',
      'chaotic-bad':  'Regular posts, brutal votes. Normal on the surface. Complicated inside.',
    },
  };

  return map[className]?.[flavorBucket] ?? 'A mystery wrapped in an enigma wrapped in a questionable post.';
}

// ── Stat labels & descriptions ───────────────────────────────────────────────

export const STAT_DISPLAY: Record<keyof CharacterStats, { label: string; subtitle: string; tiers: string[] }> = {
  taste: {
    label: 'TASTE',
    subtitle: 'how well your posts score',
    tiers: ['Chaotic. At best.', 'Room for growth.', 'Reliable eye.', 'Sharp taste.', 'Certified banger machine.'],
  },
  clout: {
    label: 'CLOUT',
    subtitle: 'total votes received',
    tiers: ['Known to their mom.', 'Building slowly.', 'People are watching.', 'Certified presence.', "Can't be ignored."],
  },
  judge: {
    label: 'CRITIC',
    subtitle: 'posts you\'ve judged',
    tiers: ['Barely participates.', 'Shows up sometimes.', 'Active juror.', 'Votes on everything.', 'Has opinions. All of them.'],
  },
  edge: {
    label: 'CHAOS',
    subtitle: 'how divisive your posts are',
    tiers: ['Plays it safe.', 'Mild spice.', 'Keeps people guessing.', 'Certified crowd-divider.', 'Causes arguments on purpose.'],
  },
  range: {
    label: 'VARIETY',
    subtitle: 'categories you post in',
    tiers: ['Niche and proud.', 'Branching out.', 'Multi-category threat.', 'Posts everywhere.', 'No genre is safe.'],
  },
  grind: {
    label: 'GRIND',
    subtitle: 'total posts published',
    tiers: ['Lurks more than posts.', 'Casual contributor.', 'Regular presence.', 'Highly active.', 'Never logs off.'],
  },
};

export function statDescription(stat: keyof CharacterStats, score: number): string {
  const tiers = STAT_DISPLAY[stat].tiers;
  if (score <= 4)  return tiers[0];
  if (score <= 9)  return tiers[1];
  if (score <= 14) return tiers[2];
  if (score <= 18) return tiers[3];
  return tiers[4];
}
