/**
 * Locks the bucket-eligibility lint (scripts/lib/bucketEligibility.js).
 *
 * WHY THIS TEST EXISTS. A bucket is a named sub-theme tagged inside one pool. Some pools are read
 * whole (tags are bookkeeping); others are tag-filtered per path, and there a bucket whose tag is
 * missing from the path's allowed list is SILENTLY DROPPED — no error, zero renders, and a seed
 * file that looks perfectly healthy. We are about to append ~35 new buckets to existing pools, so
 * the "did it actually reach a render" question needs an automated answer, not a manual one.
 *
 * The two regressions guarded hardest are both FALSE POSITIVES, because a lint that cries wolf
 * gets ignored and then sends someone editing a path that was already correct:
 *   1. UNFILTERED CONSUMERS. The first run of this scanner reported 71 dead buckets. Most were
 *      wrong: `farmbot_gentle_magic` is tagged by season and one path filters it to autumn, but
 *      six other paths read the same pool whole via `pools.GENTLE_MAGIC.map((e) => e.description)`,
 *      so every entry is eligible. One unfiltered consumer means the tags constrain nothing.
 *   2. DYNAMIC FILTERS. `byTags(HAIRSTYLE, [gender])` cannot be resolved statically, so the pool
 *      must be reported as unknowable rather than judged.
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const {
  tagVocabulary,
  filterSites,
  auditBot,
  willBucketRoll,
} = require('../../scripts/lib/bucketEligibility');

const tagged = (tags: string[], description = 'a scene') => ({ tags, description });
const findingsOf = (o: Record<string, unknown>) =>
  auditBot(o as never) as Array<Record<string, string>>;
const kinds = (f: Array<Record<string, string>>) => f.map((x) => x.kind);

/** A minimal one-pool bot. `allSrc` is the only thing that decides how the pool is consumed. */
function bot(allSrc: string, entries: unknown[], file = 'scenes') {
  return {
    bot: 'testbot',
    allSrc,
    symbolToFile: new Map([['SCENES', file]]),
    readPool: (f: string) => (f === file ? entries : null),
  };
}

describe('tagVocabulary', () => {
  it('counts each tag and reports how many entries carry no tags array', () => {
    const v = tagVocabulary([tagged(['a']), tagged(['a', 'b']), 'a plain string']);
    expect(v.total).toBe(3);
    expect(v.tagged).toBe(2);
    expect(v.untagged).toBe(1);
    expect(v.tags.get('a')).toBe(2);
    expect(v.tags.get('b')).toBe(1);
  });

  it('treats a pool of plain strings as not bucketed at all', () => {
    const v = tagVocabulary(['one', 'two']);
    expect(v.tagged).toBe(0);
    expect(v.tags.size).toBe(0);
  });
});

describe('filterSites — the four real call-site shapes in this repo', () => {
  it('reads literal tags from byTags(SYM, [...])', () => {
    const s = filterSites("const x = byTags(SCENES, ['greenhouse', 'library']);").get('SCENES');
    expect([...s.literal].sort()).toEqual(['greenhouse', 'library']);
    expect(s.dynamic).toBe(false);
  });

  it('reads the pools.SYM form and the filterByTags alias', () => {
    expect([...filterSites("byTags(pools.SCENES, ['a'])").get('SCENES').literal]).toEqual(['a']);
    expect([...filterSites("filterByTags(SCENES, ['b'])").get('SCENES').literal]).toEqual(['b']);
  });

  it('reads the declarative { name, tags } form', () => {
    const s = filterSites("companions: { name: 'SCENES', tags: ['CANDY', 'ANY'] },").get('SCENES');
    expect([...s.literal].sort()).toEqual(['ANY', 'CANDY']);
  });

  it('UNIONS the allowed tags across every call site', () => {
    const s = filterSites("byTags(SCENES, ['a'])\nbyTags(SCENES, ['b','c'])").get('SCENES');
    expect([...s.literal].sort()).toEqual(['a', 'b', 'c']);
    expect(s.sites).toHaveLength(2);
  });

  it('marks a runtime-valued filter as dynamic instead of guessing', () => {
    expect(filterSites('byTags(SCENES, [gender])').get('SCENES').dynamic).toBe(true);
  });

  it('ignores a commented-out call site', () => {
    const s = filterSites("// byTags(SCENES, ['old'])\n/* byTags(SCENES, ['older']) */").get(
      'SCENES'
    );
    expect(s).toBeUndefined();
  });

  it('detects an UNFILTERED consumer that reads the pool whole', () => {
    const src = "byTags(SCENES, ['autumn'])\nconst m = pools.SCENES.map((e) => e.description);";
    expect(filterSites(src).get('SCENES').unfiltered).toBe(true);
  });

  it('does not mistake the declaration or a bare re-export for an unfiltered read', () => {
    const src = [
      "const SCENES = load('scenes');",
      'module.exports = {',
      '  SCENES,',
      '};',
      "byTags(SCENES, ['a'])",
    ].join('\n');
    expect(filterSites(src).get('SCENES').unfiltered).toBe(false);
  });
});

describe('auditBot — a bucket that can never roll', () => {
  it('flags a tag no call site allows', () => {
    const f = findingsOf(
      bot("byTags(SCENES, ['greenhouse'])", [tagged(['greenhouse']), tagged(['night-market'])])
    );
    const dead = f.find((x) => x.kind === 'UNREACHABLE_TAG');
    expect(dead).toBeDefined();
    expect(dead!.tag).toBe('night-market');
    expect(dead!.severity).toBe('error');
    expect(dead!.detail).toMatch(/never roll/i);
  });

  it('does NOT flag a tag that is allowed', () => {
    const f = findingsOf(
      bot("byTags(SCENES, ['greenhouse','night-market'])", [
        tagged(['greenhouse']),
        tagged(['night-market']),
      ])
    );
    expect(kinds(f)).not.toContain('UNREACHABLE_TAG');
  });

  it('does NOT flag an entry that also carries the ANY wildcard', () => {
    const f = findingsOf(bot("byTags(SCENES, ['greenhouse'])", [tagged(['night-market', 'ANY'])]));
    expect(kinds(f)).not.toContain('UNREACHABLE_TAG');
  });

  it('counts only the STRANDED entries, not every entry carrying the tag', () => {
    // 'night-market' appears twice, but one of those entries is also 'greenhouse' so it still rolls.
    const f = findingsOf(
      bot("byTags(SCENES, ['greenhouse'])", [
        tagged(['night-market']),
        tagged(['night-market', 'greenhouse']),
      ])
    );
    const dead = f.find((x) => x.kind === 'UNREACHABLE_TAG');
    expect(dead!.detail).toMatch(/2 entries, 1 of which/);
  });
});

describe('auditBot — the false positives that must stay silent', () => {
  // THE REGRESSION THAT MATTERS MOST. farmbot_gentle_magic, 71 bogus findings.
  it('says nothing when one consumer reads the pool WHOLE, however narrow the other filter is', () => {
    const src = "byTags(SCENES, ['autumn'])\nconst m = pools.SCENES.map((e) => e.description);";
    const f = findingsOf(bot(src, [tagged(['autumn']), tagged(['spring']), tagged(['winter'])]));
    expect(kinds(f)).not.toContain('UNREACHABLE_TAG');
  });

  it('says nothing about a pool that is never tag-filtered (tags are bookkeeping)', () => {
    const f = findingsOf(bot("scene: 'SCENES',", [tagged(['greenhouse']), tagged(['aquarium'])]));
    expect(kinds(f)).not.toContain('UNREACHABLE_TAG');
  });

  it('says nothing when the filter is a runtime value it cannot resolve', () => {
    const f = findingsOf(bot('byTags(SCENES, [gender])', [tagged(['male']), tagged(['female'])]));
    expect(kinds(f)).not.toContain('UNREACHABLE_TAG');
  });

  it('says nothing about a pool of plain strings', () => {
    expect(findingsOf(bot("byTags(SCENES, ['a'])", ['plain one', 'plain two']))).toEqual([]);
  });
});

describe('auditBot — the crash case and the empty case', () => {
  it('flags an untagged entry in a tag-FILTERED pool as an error, because e.tags.includes() throws', () => {
    const f = findingsOf(bot("byTags(SCENES, ['a'])", [tagged(['a']), 'a plain string']));
    const mix = f.find((x) => x.kind === 'SHAPE_MIX');
    expect(mix!.severity).toBe('error');
    expect(mix!.detail).toMatch(/THROWS/);
  });

  it('downgrades the same shape mix to a warning when the pool is read whole', () => {
    const f = findingsOf(bot("scene: 'SCENES',", [tagged(['a']), 'a plain string']));
    const mix = f.find((x) => x.kind === 'SHAPE_MIX');
    expect(mix!.severity).toBe('warning');
  });

  it('flags a filter that matches nothing in the pool', () => {
    const f = findingsOf(
      bot("byTags(SCENES, ['nothing-has-this'])", [tagged(['a']), tagged(['b'])])
    );
    expect(kinds(f)).toContain('EMPTY_FILTER');
  });

  it('flags a pool no live path can reach', () => {
    const f = findingsOf({
      ...bot("byTags(SCENES, ['a'])", [tagged(['a'])]),
      wiredPools: new Set(),
    });
    expect(kinds(f)).toEqual(['UNWIRED_POOL']);
  });

  it('warns about a bucket too small to show up meaningfully', () => {
    const entries = [tagged(['rare']), ...Array.from({ length: 199 }, () => tagged(['common']))];
    const f = findingsOf(bot("byTags(SCENES, ['rare','common'])", entries));
    const starved = f.find((x) => x.kind === 'STARVED_BUCKET');
    expect(starved!.tag).toBe('rare');
    expect(starved!.severity).toBe('warning');
  });
});

describe('willBucketRoll — the pre-flight before writing a bucket', () => {
  it('YES when the pool is read whole', () => {
    const r = willBucketRoll({ symbol: 'SCENES', tag: 'night-market', allSrc: "scene: 'SCENES'," });
    expect(r.ok).toBe(true);
  });

  it('YES when one consumer reads the pool whole even though another filters it', () => {
    const r = willBucketRoll({
      symbol: 'SCENES',
      tag: 'night-market',
      allSrc: "byTags(SCENES, ['autumn'])\nconst m = pools.SCENES.map((e) => e.description);",
    });
    expect(r.ok).toBe(true);
  });

  it('NO, with the exact call site to edit, when the tag is not allowed', () => {
    const r = willBucketRoll({
      symbol: 'SCENES',
      tag: 'night-market',
      allSrc: "byTags(SCENES, ['greenhouse'])",
    });
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/silently dropped/);
    expect(r.action).toMatch(/byTags\(SCENES/);
  });

  it('YES when the entries will carry the ANY wildcard', () => {
    const r = willBucketRoll({
      symbol: 'SCENES',
      tag: 'night-market',
      allSrc: "byTags(SCENES, ['greenhouse'])",
      entriesHaveWildcard: true,
    });
    expect(r.ok).toBe(true);
  });

  it('UNKNOWN rather than a guess when the filter is dynamic', () => {
    const r = willBucketRoll({ symbol: 'SCENES', tag: 'x', allSrc: 'byTags(SCENES, [gender])' });
    expect(r.ok).toBeNull();
  });
});

/**
 * THE FLEET BASELINE.
 *
 * Every unreachable bucket in the fleet today lives in one of three YumBot legacy catalog pools.
 * They were built as shared catalogs (COTTAGECORE / FESTIVAL / CAFE / MAMMAL / BIRD ...), YumBot
 * later moved to per-path `yumbot_<path>_companions` pools, and only two paths still wire them —
 * so about half of `tiny_companions` (97 of 200 entries) can never roll. That is legacy debt, not
 * a broken feature: the reachable half serves both live paths correctly.
 *
 * This test's job is to stop the list GROWING. A new bucket that cannot roll fails here.
 */
describe('fleet baseline — no NEW unreachable buckets', () => {
  const KNOWN_DEBT = ['yumbot/decor_items', 'yumbot/tiny_companions', 'yumbot/landscape_features'];

  it('only the three known YumBot catalog pools have unreachable buckets', () => {
    const fs = require('fs');
    const path = require('path');
    const root = path.join(__dirname, '..', '..', 'scripts', 'bots');

    const offenders = new Set<string>();
    for (const b of fs.readdirSync(root)) {
      const dir = path.join(root, b);
      if (!fs.existsSync(path.join(dir, 'pools.js'))) continue;

      let allSrc = '';
      const walk = (d: string) => {
        for (const e of fs.readdirSync(d, { withFileTypes: true })) {
          const p = path.join(d, e.name);
          if (e.isDirectory()) {
            if (e.name !== 'seeds') walk(p);
          } else if (e.name.endsWith('.js')) allSrc += fs.readFileSync(p, 'utf8') + '\n';
        }
      };
      walk(dir);

      const poolsSrc = fs.readFileSync(path.join(dir, 'pools.js'), 'utf8');
      const symbolToFile = new Map<string, string>();
      for (const m of poolsSrc.matchAll(
        /([A-Z][A-Z0-9_]*)\s*[:=]\s*load(?:Optional)?\(\s*'([^']+)'/g
      )) {
        symbolToFile.set(m[1], m[2]);
      }

      for (const f of auditBot({
        bot: b,
        allSrc,
        symbolToFile,
        readPool: (file: string) => {
          try {
            return JSON.parse(fs.readFileSync(path.join(dir, 'seeds', `${file}.json`), 'utf8'));
          } catch {
            return null;
          }
        },
      }) as Array<Record<string, string>>) {
        if (f.kind === 'UNREACHABLE_TAG') offenders.add(`${f.bot}/${f.pool}`);
      }
    }

    expect([...offenders].sort()).toEqual([...KNOWN_DEBT].sort());
  });
});
